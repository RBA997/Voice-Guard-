
import os
import tempfile

import librosa
import numpy as np
import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification

MODEL_NAME = "garystafford/wav2vec2-deepfake-voice-detector"
SAMPLE_RATE = 16000

app = FastAPI(title="VoiceGuardAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Local development only
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading VoiceGuardAI model...")

feature_extractor = AutoFeatureExtractor.from_pretrained(MODEL_NAME)
model = AutoModelForAudioClassification.from_pretrained(MODEL_NAME)
model.eval()

id2label = model.config.id2label

print("VoiceGuardAI model loaded successfully!")
print("Labels:", id2label)


@app.get("/")
def home():
    return {"message": "VoiceGuardAI API is running"}


@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("audio/"):
        # Browsers sometimes send uploaded audio as application/octet-stream.
        if not file.filename or not file.filename.lower().endswith(
            (".wav", ".mp3", ".flac", ".ogg", ".m4a", ".webm")
        ):
            raise HTTPException(
                status_code=400,
                detail="Please upload a supported audio file."
            )

    temp_path = None

    try:
        contents = await file.read()

        if not contents:
            raise HTTPException(status_code=400, detail="The audio file is empty.")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".audio") as temp:
            temp.write(contents)
            temp_path = temp.name

        audio, _ = librosa.load(temp_path, sr=SAMPLE_RATE, mono=True)

        if len(audio) == 0:
            raise HTTPException(status_code=400, detail="No audio samples found.")

        inputs = feature_extractor(
            audio,
            sampling_rate=SAMPLE_RATE,
            return_tensors="pt",
            padding=True,
        )

        with torch.no_grad():
            outputs = model(**inputs)
            probabilities = torch.softmax(outputs.logits, dim=-1)[0]

        scores = {
            str(id2label[i]).lower(): round(
                float(probabilities[i].item()) * 100, 2
            )
            for i in range(len(probabilities))
        }

        predicted_index = int(torch.argmax(probabilities).item())
        prediction = str(id2label[predicted_index]).lower()
        confidence = round(float(probabilities[predicted_index].item()) * 100, 2)

        fake_score = scores.get("fake", 0.0)

        return {
            "filename": file.filename,
            "prediction": prediction,
            "confidence": confidence,
            "scores": scores,
            "risk_score": fake_score,
            "duration": round(len(audio) / SAMPLE_RATE, 2),
        }

    except HTTPException:
        raise
    except Exception as exc:
        print("Audio analysis error:", repr(exc))
        raise HTTPException(
            status_code=500,
            detail="Audio analysis failed. Check the backend terminal."
        )
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
