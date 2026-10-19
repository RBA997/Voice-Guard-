# VoiceGuardAI

**AI-Powered Voice Deepfake Detection**

VoiceGuardAI is a cybersecurity project designed to analyze audio recordings and classify them as likely **real or AI-generated**. The project explores how machine learning can help identify synthetic voices and potential voice impersonation.

## Project Overview

AI-generated voices are becoming increasingly realistic and can be misused in voice impersonation and social engineering attacks. VoiceGuardAI aims to demonstrate how audio classification can help users assess whether a voice recording may be artificially generated.

This project is an educational prototype and is not intended to provide definitive proof that an audio recording is authentic or fake.

## Features

- **Audio Upload:** Upload an audio file for analysis.
- **Audio Processing:** Prepare the uploaded recording for the model.
- **AI-Based Classification:** Analyze audio using a pretrained deepfake voice detection model.
- **Results Display:** Present the model's predicted classification through the web interface.
- **Web Interface:** Provide a simple way to interact with the detection system.

## Technologies Used

- **Python** — backend and audio-processing logic
- **PyTorch** — deep learning framework
- **Hugging Face Transformers** — pretrained audio-classification model
- **Librosa** — audio loading and processing
- **SoundFile** — audio file handling
- **HTML, CSS, JavaScript** — frontend interface

## AI Model and Attribution

VoiceGuardAI uses the following pretrained model as its starting point:

- **Model:** [garystafford/wav2vec2-deepfake-voice-detector](https://huggingface.co/garystafford/wav2vec2-deepfake-voice-detector)
- **Model source:** Hugging Face
- **Architecture:** Wav2Vec2-based audio classification
- **Approach:** Pretrained model inference; further fine-tuning may be explored as the project develops.

The pretrained model and its associated components remain subject to their respective licenses and attribution requirements. Please consult the model card and applicable dataset information for details.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/RBA997/Voice-Guard-.git
cd Voice-Guard-
```

### 2. Create and activate a virtual environment

On Windows:

```bash
py -3.12 -m venv .v
.v\Scripts\activate
```

### 3. Install dependencies

Install the project's required Python packages:

```bash
python -m pip install torch transformers librosa soundfile
```

Additional packages may be required depending on the current backend and audio-processing implementation.

### 4. Run the application

Run the appropriate application entry point for the current project version. For example, if the backend is configured to start from `app.py`:

```bash
python app.py
```

Follow the instructions displayed by the application to access the interface.

## How It Works

1. The user uploads an audio recording.
2. The application loads and preprocesses the audio.
3. The processed audio is passed to the pretrained classification model.
4. The model produces a prediction and associated scores.
5. The application displays the result to the user.

## Limitations

- Predictions may be incorrect, including false positives and false negatives.
- Performance can vary depending on recording quality, background noise, compression, language, and voice characteristics.
- A model's confidence score is not necessarily the probability that a recording is fake.
- Results should not be treated as conclusive evidence of fraud or impersonation.
- Further testing on diverse, independent audio samples is necessary to evaluate reliability.

## Privacy

Audio recordings may contain sensitive personal information. Use appropriate safeguards when handling uploaded files, and avoid collecting, storing, or sharing recordings unnecessarily.

## License

The original project code in this repository is released under the **MIT License**, as specified in the repository's `LICENSE` file.

This license applies to the project code covered by it. Third-party models, datasets, libraries, and other assets may have separate licensing terms and must be used according to their respective conditions.

## Project Purpose

VoiceGuardAI is an educational cybersecurity project exploring the use of artificial intelligence for audio deepfake detection and voice impersonation awareness.

**Developed as a student project.**
