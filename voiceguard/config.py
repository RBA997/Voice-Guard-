"""Validated runtime configuration; no credentials are required for public models."""
import os
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Settings:
    model_id: str = 'garystafford/wav2vec2-deepfake-voice-detector'
    revision: str = 'c66306024a7ede0be291e9c4558b37634782dc4e'
    second_model: str = ''
    second_revision: str = ''
    calibration: str = ''
    max_bytes: int = 15 * 1024 * 1024
    max_seconds: float = 120
    requests_per_minute: int = 6
    window_seconds: float = 5
    stride_seconds: float = 2.5
    aggregation: str = 'mean'
    max_explain_seconds: float = 30
    sample_rate: int = 16000
    frontend: Path = Path(__file__).resolve().parent.parent / 'frontend'

    @classmethod
    def from_env(cls):
        result = cls(
            model_id=os.getenv('VG_MODEL_ID', cls.model_id),
            revision=os.getenv('VG_MODEL_REVISION', cls.revision),
            second_model=os.getenv('VG_SECOND_MODEL', ''),
            second_revision=os.getenv('VG_SECOND_REVISION', ''),
            calibration=os.getenv('VG_CALIBRATION', ''),
            max_bytes=int(os.getenv('VG_MAX_BYTES', cls.max_bytes)),
            max_seconds=float(os.getenv('VG_MAX_SECONDS', cls.max_seconds)),
            requests_per_minute=int(os.getenv('VG_RATE_LIMIT', cls.requests_per_minute)),
            aggregation=os.getenv('VG_AGGREGATION', 'mean'),
        )
        if not 1024 <= result.max_bytes <= 100 * 1024 * 1024:
            raise ValueError('VG_MAX_BYTES must be between 1024 and 104857600')
        if not 1 <= result.max_seconds <= 600 or result.requests_per_minute < 1:
            raise ValueError('Invalid duration or rate limit')
        if result.aggregation not in {'mean', 'max'}:
            raise ValueError('VG_AGGREGATION must be mean or max')
        if result.second_model and not result.second_revision:
            raise ValueError('Pin VG_SECOND_REVISION when enabling a second model')
        for model_id, revision in [(result.model_id, result.revision), (result.second_model, result.second_revision)]:
            if model_id and not Path(model_id).is_dir() and not re.fullmatch(r'[0-9a-f]{40}', revision):
                raise ValueError('Remote model revisions must be immutable 40-character commit hashes')
        return result
