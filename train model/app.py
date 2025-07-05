import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from fastapi import FastAPI
from pydantic import BaseModel

model = AutoModelForSequenceClassification.from_pretrained("./arabert_emotion_model_phase1_saher_sarcasm")
tokenizer = AutoTokenizer.from_pretrained("./arabert_emotion_model_phase1_saher_sarcasm")
model.eval()

labels = ['Admiration', 'Anger', 'Fear', 'Happiness', 'Hope', 'Love', 'Oppressed Sorrow', 'Sarcasm', 'Yearning', 'other']

app = FastAPI()

class TextInput(BaseModel):
    sentence: str

@app.post("/predict")
async def predict_emotion(data: TextInput):
    inputs = tokenizer(data.sentence, return_tensors="pt", truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        pred = torch.argmax(probs, dim=-1).item()
        probabilities = probs.squeeze().tolist()

    return {"prediction": labels[pred], "probabilities": probabilities}
