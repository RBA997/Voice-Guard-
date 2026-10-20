"""Sliding-window inference, validated calibration, optional model comparison."""
import json
import hashlib
import math
from pathlib import Path
import numpy as np

DISCLAIMER = ('Research prototype. Model scores are not probabilities of fraud or proof of '
              'authenticity. Verify suspicious requests through a trusted independent channel.')


class Detector:
    def __init__(self, model_id, revision):
        import torch
        from transformers import AutoFeatureExtractor, AutoModelForAudioClassification
        self.torch = torch
        self.extractor = AutoFeatureExtractor.from_pretrained(model_id, revision=revision, trust_remote_code=False)
        self.model = AutoModelForAudioClassification.from_pretrained(
            model_id, revision=revision, trust_remote_code=False, use_safetensors=True).eval()
        labels = {int(k): str(v).lower() for k, v in self.model.config.id2label.items()}
        aliases = {'fake', 'spoof', 'spoofed', 'synthetic', 'ai-generated'}
        real = {'real', 'bonafide', 'bona-fide', 'human', 'genuine'}
        fake_indices = [k for k, v in labels.items() if v in aliases]
        if len(labels) != 2 or len(fake_indices) != 1 or not any(v in real for v in labels.values()):
            raise ValueError('Model must explicitly label its two classes as real/bonafide and fake/spoof')
        self.fake_index = fake_indices[0]
        self.sample_rate = int(self.extractor.sampling_rate)

    def score(self, audio, sample_rate):
        import librosa
        if sample_rate != self.sample_rate:
            audio = librosa.resample(audio, orig_sr=sample_rate, target_sr=self.sample_rate)
        inputs = self.extractor(audio, sampling_rate=self.sample_rate, return_tensors='pt', padding=True)
        with self.torch.inference_mode():
            output = self.model(**inputs)
            score = float(self.torch.softmax(output.logits, dim=-1)[0, self.fake_index])
        if not math.isfinite(score) or not 0 <= score <= 1:
            raise ValueError('Model returned an invalid score')
        return score


class Engine:
    def __init__(self, settings, detectors=None):
        self.settings = settings
        self.detectors = detectors if detectors is not None else [Detector(settings.model_id, settings.revision)]
        if detectors is None and settings.second_model:
            self.detectors.append(Detector(settings.second_model, settings.second_revision))
        self.calibration = None
        if settings.calibration:
            self.calibration = json.loads(Path(settings.calibration).read_text())
            c = self.calibration
            expected = self.identity()
            if c.get('identity') != expected:
                raise ValueError('Calibration does not match model revisions/windowing/aggregation')
            if not 0 <= c['real_threshold'] < c['fake_threshold'] <= 1:
                raise ValueError('Invalid calibrated thresholds')

    def identity(self):
        if hasattr(self, '_identity'):
            return self._identity
        s = self.settings
        identity = {'models': [{'id': s.model_id, 'revision': s.revision}] + (
            [{'id': s.second_model, 'revision': s.second_revision}] if s.second_model else []),
            'window_seconds': s.window_seconds, 'stride_seconds': s.stride_seconds,
            'aggregation': s.aggregation}
        for model in identity['models']:
            root = Path(model['id'])
            if root.is_dir():
                digest = hashlib.sha256()
                for path in sorted(list(root.glob('*.json')) + list(root.glob('*.safetensors'))):
                    digest.update(path.name.encode())
                    with path.open('rb') as source:
                        while chunk := source.read(1024 * 1024):
                            digest.update(chunk)
                model['artifact_sha256'] = digest.hexdigest()
        self._identity = identity
        return identity

    def windows(self, audio):
        s = self.settings
        width, stride = int(s.window_seconds * s.sample_rate), int(s.stride_seconds * s.sample_rate)
        starts = list(range(0, max(1, len(audio) - width + 1), stride))
        last = max(0, len(audio) - width)
        if starts[-1] != last:
            starts.append(last)
        return [(start, min(start + width, len(audio))) for start in starts]

    def aggregate(self, scores):
        return float(np.max(scores) if self.settings.aggregation == 'max' else np.mean(scores))

    def classify(self, score):
        if self.calibration is None:
            return 'inconclusive'
        if score <= self.calibration['real_threshold']:
            return 'real'
        if score >= self.calibration['fake_threshold']:
            return 'fake'
        return 'inconclusive'

    def analyze(self, audio, explain=False):
        s = self.settings
        bounds = self.windows(audio)
        by_model = [[detector.score(audio[a:b], s.sample_rate) for a, b in bounds]
                    for detector in self.detectors]
        scores = np.mean(by_model, axis=0)
        aggregate = self.aggregate(scores)
        individual = [self.aggregate(values) for values in by_model]
        votes = [self.classify(value) for value in individual]
        disagreement = len(set(votes)) > 1 or (len(individual) > 1 and min(individual) < 0.5 <= max(individual))
        silence = float(np.sqrt(np.mean(audio.astype(np.float64) ** 2))) < 1e-5
        prediction = 'inconclusive' if disagreement or silence else self.classify(aggregate)
        reason = ('silence' if silence else 'model_disagreement' if disagreement else
                  'uncalibrated' if self.calibration is None else 'calibrated_thresholds')
        segments = []
        for i, (a, b) in enumerate(bounds):
            segment = {'start': round(a / s.sample_rate, 3), 'end': round(b / s.sample_rate, 3),
                       'fake_score': round(float(scores[i]) * 100, 2)}
            if explain:
                impacts = []
                for detector_index, detector in enumerate(self.detectors):
                    altered_scores = list(by_model[detector_index])
                    for j, (left, right) in enumerate(bounds):
                        if right <= a or left >= b:
                            continue
                        masked = audio[left:right].copy()
                        masked[max(a, left) - left:min(b, right) - left] = 0
                        altered_scores[j] = detector.score(masked, s.sample_rate)
                    impacts.append(self.aggregate(altered_scores))
                segment['occlusion_delta'] = round((aggregate - float(np.mean(impacts))) * 100, 2)
            segments.append(segment)
        return {'prediction': prediction, 'decision_reason': reason, '_raw_fake_score': aggregate,
                'scores': {'real': round((1 - aggregate) * 100, 2), 'fake': round(aggregate * 100, 2)},
                'duration': round(len(audio) / s.sample_rate, 3), 'segments': segments,
                'models': [{'id': identity['id'], 'revision': identity['revision'],
                            'fake_score': round(score * 100, 2)}
                           for identity, score in zip(self.identity()['models'], individual)],
                'calibrated': self.calibration is not None, 'disagreement': disagreement,
                'aggregation': s.aggregation, 'disclaimer': DISCLAIMER}
