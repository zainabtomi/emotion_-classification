import torch
import pandas as pd
from sklearn.metrics import classification_report
from transformers import AutoTokenizer
from torch.utils.data import Dataset

# === تحميل البيانات ===
val_df = pd.read_csv("val_data.csv", encoding="utf-8-sig")

# === تحميل المحول ===
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
le.classes_ =  ['Admiration', 'Anger', 'Fear', 'Happiness', 'Hope', 'Love', 'Oppressed Sorrow', 'Other', 'Sarcasm', 'Yearning', 'other']
# === إعداد Tokenizer (نفس المستخدم في التدريب) ===
model_name = "aubmindlab/bert-base-arabertv02"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# === إعداد Dataset للتحقق ===
class ValDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {k: torch.tensor(v[idx]) for k, v in self.encodings.items()}
        item["labels"] = self.labels[idx]
        return item

val_encodings = tokenizer(val_df["sentence"].tolist(), padding=True, truncation=True, max_length=128)
val_labels = torch.tensor(val_df["emotion"].tolist())
val_ds = ValDataset(val_encodings, val_labels)

# === تحميل النموذج المدرّب ===
from transformers import AutoModelForSequenceClassification, Trainer

model = AutoModelForSequenceClassification.from_pretrained("arabert_emotion_model")
trainer = Trainer(model=model, tokenizer=tokenizer)

# === التقييم وإخراج التقرير ===
print("\nتقرير التقييم النهائي على مجموعة التحقق:\n")
preds = trainer.predict(val_ds).predictions.argmax(-1)

report = classification_report(val_df["emotion"].tolist(), preds, target_names=le.classes_)
print(report)

# === حفظ التقرير في ملف نصي ===
with open("evaluation_report.txt", "w", encoding="utf-8") as f:
    f.write("تقرير التقييم النهائي على مجموعة التحقق:\n\n")
    f.write(report)

print("\n✅ تم حفظ التقرير في evaluation_report.txt")
