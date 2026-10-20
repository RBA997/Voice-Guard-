import json
from dataclasses import replace
import numpy as np
import pytest
from voiceguard.config import Settings
from voiceguard.engine import Engine


class Fixed:
    def __init__(self, score): self.value = score
    def score(self, audio, sample_rate): return self.value


def test_windows_cover_tail_and_overlap():
    engine = Engine(Settings(), [Fixed(0.7)])
    audio = np.ones(11 * 16000)
    bounds = engine.windows(audio)
    assert bounds == [(0, 80000), (40000, 120000), (80000, 160000), (96000, 176000)]
    result = engine.analyze(audio)
    assert result['scores']['fake'] == 70
    assert result['prediction'] == 'inconclusive'


def test_calibration_and_ensemble(tmp_path):
    settings = replace(Settings(), second_model='second', second_revision='pinned')
    engine = Engine(settings, [Fixed(0.1), Fixed(0.9)])
    path = tmp_path / 'calibration.json'
    path.write_text(json.dumps({'identity':engine.identity(),'real_threshold':0.2,'fake_threshold':0.8}))
    engine = Engine(replace(settings, calibration=str(path)), [Fixed(0.1), Fixed(0.9)])
    result = engine.analyze(np.ones(16000))
    assert result['disagreement'] is True
    assert result['prediction'] == 'inconclusive'
    assert result['decision_reason'] == 'model_disagreement'


def test_mismatched_calibration_rejected(tmp_path):
    path = tmp_path / 'calibration.json'
    path.write_text(json.dumps({'identity':{},'real_threshold':0.2,'fake_threshold':0.8}))
    with pytest.raises(ValueError, match='does not match'):
        Engine(replace(Settings(), calibration=str(path)), [Fixed(0.2)])


def test_silence_abstains():
    result = Engine(Settings(), [Fixed(0.9)]).analyze(np.zeros(16000))
    assert result['decision_reason'] == 'silence'
    assert result['prediction'] == 'inconclusive'
