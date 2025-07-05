import os
import torch
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.preprocessing import LabelEncoder
import pandas as pd

# تحميل النموذج والتوكن
model_dir = "arabert_emotion_model_phase1_saher_sarcasm"
tokenizer = AutoTokenizer.from_pretrained(model_dir)
model = AutoModelForSequenceClassification.from_pretrained(model_dir)
model.eval()

# تحميل بيانات التحقق
val_df = pd.read_csv("val_data.csv")

# إعادة تعريف LabelEncoder بنفس ترتيب الفئات الأصلية
le = LabelEncoder()
le.classes_ = np.array([
    'Admiration', 'Anger', 'Fear', 'Happiness', 'Hope', 'Love',
    'Oppressed Sorrow', 'Sarcasm', 'Yearning', 'other'
])

# تحويل الفئات النصية إلى أرقام
val_df["emotion"] = le.transform(val_df["emotion"])

# ترميز الجمل
val_encodings = tokenizer(
    val_df["sentence"].tolist(),
    padding=True,
    truncation=True,
    max_length=128,
    return_tensors="pt"
)

labels = torch.tensor(val_df["emotion"].tolist())

# إنشاء Dataset مخصص
class ValDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        return {key: val[idx] for key, val in self.encodings.items()}, self.labels[idx]

    def __len__(self):
        return len(self.labels)

val_dataset = ValDataset(val_encodings, labels)

# دالة للتنبؤ
def get_predictions(model, dataset, batch_size=16):
    preds = []
    true_labels = []

    dataloader = torch.utils.data.DataLoader(dataset, batch_size=batch_size)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    with torch.no_grad():
        for batch in dataloader:
            inputs, targets = batch
            inputs = {k: v.to(device) for k, v in inputs.items()}
            outputs = model(**inputs)
            logits = outputs.logits
            batch_preds = torch.argmax(logits, dim=1).cpu().numpy()
            preds.extend(batch_preds)
            true_labels.extend(targets.cpu().numpy())

    return np.array(true_labels), np.array(preds)

# تنفيذ التنبؤ
true_labels, pred_labels = get_predictions(model, val_dataset)

# رسم مصفوفة الالتباس
cm = confusion_matrix(true_labels, pred_labels)
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=le.classes_, yticklabels=le.classes_)
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.show()
