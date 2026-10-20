# Three-page review: implementation and evidence

All three pages of the supplied VoiceGuardAI PDF were reviewed. This checklist separates implemented software from experiments that need real data. The user confirmed that no labeled dataset is available.

| PDF recommendation | Implementation | Evidence / remaining requirement |
|---|---|---|
| Sliding-window analysis | 5-second windows, 2.5-second stride, tail coverage, mean/max aggregation, timeline | Real 10-second sample yields three windows; coverage tests pass |
| Evaluation script | `evaluate.py`: accuracy, precision/recall/F1, confusion matrix, ROC, interpolated EER; JSON + PNG | Known-value metrics tests and random-model CLI integration pass; real benchmarks require labeled data |
| Robustness | `robustness.py`: paired MP3 32 kbps, noise at 10/20 dB, 8 kHz channel resampling; physical re-recording manifest support | Transform/inference CLI fixture tested; real degradation and loudspeaker measurements not performed |
| Arabic testing | Consent-aware manifest, language filtering, speaker-disjoint splits, per-language results and collection protocol | Ready for consented Arabic real/fake recordings; none supplied |
| Calibrated thresholds / abstention | Validation-only calibration, empirical error constraints, matching model/window identity; explicit inconclusive result | Calibration and abstention tests pass. No fitted thresholds claimed; uncalibrated demo abstains |
| Explanation | Spectrogram and window overlay; optional actual occlusion recomputation with score deltas | Real model masked-inference request passed; sensitivity is not causal attribution |
| Second model / ensemble | Two configurable pinned safetensors models, individual scores, mean window scores, disagreement abstention | Both real models loaded and inferred; sample disagreement correctly abstained. No superiority claim |
| Optional Arabic fine-tuning | `train_arabic.py`: frozen feature encoder, train/validation separation, random training crops, validation-loss checkpoint selection | One-epoch tiny random-model software test passes. Real Arabic training and before/after gains require data |
| STRIDE threat model | `docs/THREAT_MODEL.md` | Assets, actors, boundaries, controls and residual risks documented |
| API abuse tests | `tests/test_api.py` | Empty/large/forged/corrupt/long/repeated requests, consent, busy service, model failure, security headers, no-disk-spooling tested |
| Security automation | Bandit, pip-audit, Dependabot, SECURITY.md, GitHub Actions | Local scans run; workflow files added. Remote GitHub Actions have not been executed here |
| Docker, non-root, one port | Dockerfile and hardened Compose service | See container validation record below |
| Serve frontend through FastAPI | Static frontend mounted at `/`; relative API URL | Real browser upload/report flow passed; no permissive CORS |
| Headers / env config | CSP, nosniff, no-referrer, no-store, permissions policy; validated configuration | Header tests pass; no credentials in repository |
| API quality | `/health`, Pydantic response, lifespan loading, structured safe event logging, versioned route | Real health/inference and model-unavailable behavior verified |
| Privacy | Bounded in-memory parsing and FFmpeg pipes, explicit consent, no audio/filename logs | No-spooling tests include an audio file larger than the default 1 MiB spool threshold |
| Accessibility | Native visible file input, focus indicators, skip link, live regions, reduced-motion support, keyboard-scrollable table | English and Arabic axe WCAG A/AA scans pass in tested states |
| Small text / header overlap | Readable text, 40px SVG mark, normal-flow header | Desktop/mobile browser render inspected; no mobile horizontal overflow |
| Arabic/English and RTL | Language switch covers content, guidance and decisions | Browser RTL and mobile checks pass |
| Drag/drop and microphone | Drop handler, permission-gated MediaRecorder, stop/time/size controls | Real Chromium flow with fake microphone device passes; WebM analyzed by actual API |
| Client size/duration checks / progress | Local decode check, server-independent checks, real XHR upload progress and indeterminate inference progress | Browser upload and recording checks pass |
| Downloadable report | JSON includes input SHA-256, timestamp, model identities, scores, windows and limitations | Browser download parsed and checked |
| Asset optimization / explicit font | Compact local SVG and locally served licensed DejaVu font | No third-party font requests; license bundled |
| “What should I do?” guidance | Callback, private family phrase, no money/codes based only on voice | English and Arabic guidance displayed |

## Local validation record

- 28 Python tests passed, including full CLI plumbing with a tiny random model and synthetic tones. Those fixture labels and metrics are software tests, not Arabic recordings or research evidence.
- Real pretrained model inference and occlusion passed on the bundled, unlabeled 10-second recording. No authenticity claim is made about it.
- Real two-model inference passed, and disagreement yielded `inconclusive`.
- Chromium: upload, inference result, JSON download, microphone recording, drag/drop, mobile RTL layout, and English/Arabic axe checks passed. Zero tested WCAG A/AA violations; automated scanning is not a complete accessibility certification.
- Runtime dependency audit: no known vulnerabilities in auditable installed packages after upgrades. PyPI cannot identify the `torch` `+cpu` build, so the corresponding upstream `torch==2.14.1` was audited separately and passed. Direct pinned requirements are also audited separately.
- Bandit: no medium/high findings. Low-severity subprocess/import warnings concern fixed-argument FFmpeg calls with no shell; training randomness is for reproducibility, not cryptography. These remain visible rather than suppressed.
- The reusable cloud installation/startup draft was updated to install the new requirements and serve the UI/API together. Saving the draft does not publish the environment.

## What cannot be finished without data

No consented labeled Arabic dataset was supplied. Therefore final threshold fitting, Arabic accuracy/EER claims, physical loudspeaker re-recording results, and real fine-tuning gains remain **unrun**. The implementation and reproducible commands are ready in `docs/RESEARCH.md`; gathering real data cannot be substituted with invented results. Verify Arabic TTS support, model license and speaker consent before generating data. XTTS was a suggestion in the review, not a dependency verified or bundled here.

## Container validation

The Docker image built successfully with TLS and APT signature verification preserved. The cloud builder needed its existing proxy DNS mapping, proxy build arguments and trusted CA supplied through a BuildKit secret. Runtime uses UID 10001. The writable named model-cache directory is owned by that user. A separate read-only, resource-limited container was started with the already-downloaded public model cache; health and real audio inference passed locally. This verifies cached-model runtime, not a new online download in a fresh Compose volume or remote deployment.
