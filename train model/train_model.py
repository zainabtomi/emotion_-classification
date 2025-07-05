import os
import random
import pandas as pd
import numpy as np
import torch
import nltk
nltk.download("averaged_perceptron_tagger_eng")

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, f1_score, recall_score, classification_report
from sklearn.utils.class_weight import compute_class_weight

from deep_translator import GoogleTranslator
import time

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    EarlyStoppingCallback,
    TrainerCallback
)

from torch.nn import CrossEntropyLoss
from torch.utils.data import Dataset


SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

model_name = "aubmindlab/bert-base-arabertv02"
TARGET_COUNT = 500  

def back_translate(text, src="ar", tmp="en", sleep=2.5):
    try:
        to_tmp = GoogleTranslator(source=src, target=tmp).translate(text)
        back = GoogleTranslator(source=tmp, target=src).translate(to_tmp)
        time.sleep(sleep)
        return back
    except Exception as e:
        print(" Error in back-translation:", e)
        return None

class BalancedEmotionDataset(Dataset):
    def __init__(self, df, tokenizer, label_column="emotion", text_column="sentence", samples_per_class=500):
        self.df = df
        self.tokenizer = tokenizer
        self.label_column = label_column
        self.text_column = text_column
        self.samples_per_class = samples_per_class
        self.refresh_data()

    def refresh_data(self):
        balanced_samples = []
        for emo in self.df[self.label_column].unique():
            samples = self.df[self.df[self.label_column] == emo].sample(
                n=self.samples_per_class, replace=True
            )
            balanced_samples.append(samples)
        self.sampled_df = pd.concat(balanced_samples).sample(frac=1).reset_index(drop=True)
        self.encodings = self.tokenizer(
            self.sampled_df[self.text_column].tolist(),
            padding=True,
            truncation=True,
            max_length=128,
            return_tensors="pt"
        )
        self.labels = torch.tensor(self.sampled_df[self.label_column].tolist())

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {k: v[idx] for k, v in self.encodings.items()}
        item["labels"] = self.labels[idx]
        return item

class RefreshDatasetCallback(TrainerCallback):
    def on_epoch_begin(self, args, state, control, **kwargs):
        kwargs["train_dataloader"].dataset.refresh_data()

class CustomTrainer(Trainer):
    def __init__(self, *args, class_weights=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.class_weights = class_weights

    def compute_loss(self, model, inputs, return_outputs=False, **kwargs):
        labels = inputs.pop("labels")
        outputs = model(**inputs)
        logits = outputs.logits
        loss_fn = CrossEntropyLoss(weight=self.class_weights.to(logits.device)) if self.class_weights is not None else CrossEntropyLoss()
        loss = loss_fn(logits, labels)
        return (loss, outputs) if return_outputs else loss

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

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = torch.tensor(logits).argmax(dim=1)
    labels = torch.tensor(labels)
    return {
        "accuracy": accuracy_score(labels, preds),
        "f1": f1_score(labels, preds, average="weighted"),
        "recall": recall_score(labels, preds, average="weighted"),
    }

def load_phase1_data():
    df_saher = pd.read_excel("saher hamed5.xlsx", usecols=["sentence", "emotion"])
    df_sarcasm = pd.read_excel("Sarcasm.xlsx", usecols=["sentence", "emotion"])
    df = pd.concat([df_saher, df_sarcasm], ignore_index=True)
    df.columns = df.columns.str.strip().str.lower()
    df.dropna(inplace=True)
    df["emotion"] = df["emotion"].str.strip()
    return df

def prepare_and_train_with_extra(df_main, df_extra=None, phase_name="Phase"):
    print(f"\n--- {phase_name} ---")

    # دمج بيانات الإضافة مع بيانات التدريب الرئيسية (إن وُجدت)
    if df_extra is not None:
        print(f"🔀 دمج بيانات إضافية من df_extra بعدد {len(df_extra)} جملة")
        df = pd.concat([df_main, df_extra], ignore_index=True)
    else:
        df = df_main

    # تنظيف وترتيب البيانات
    df = df.dropna().reset_index(drop=True)

    le = LabelEncoder()
    df["emotion"] = le.fit_transform(df["emotion"])
    print(f"📚 فئات {phase_name}: ", list(le.classes_))

    aug_sents, aug_labels = [], []
    label_counts = df["emotion"].value_counts()
    saved_aug_file = f"augmented_sentences_{phase_name.lower()}.csv"

    # تحميل الجمل المولدة مسبقًا
    if os.path.exists(saved_aug_file):
        prev_aug = pd.read_csv(saved_aug_file)
        max_label = len(le.classes_) - 1  # أكبر فئة
        # تصفية القيم خارج المجال (مثلاً 11 أو أكثر)
        prev_aug = prev_aug[prev_aug["emotion"].between(0, max_label)]
        aug_sents = prev_aug["sentence"].tolist()
        aug_labels = prev_aug["emotion"].tolist()
        print(f"🔁 تم تحميل {len(aug_sents)} جملة مولدة مسبقاً من {saved_aug_file}")

    # الترجمة العكسية للجمل الناقصة فقط من بيانات df_main (دون بيانات الإضافة)
    for emo in df_main["emotion"].unique():
        # نحول اسم الفئة لرقم في الترميز
        emo_idx = None
        if emo in le.classes_:
            emo_idx = list(le.classes_).index(emo)
        else:
            continue

        current_count = label_counts.get(emo_idx, 0)
        if current_count < TARGET_COUNT:
            needed = TARGET_COUNT - current_count
            already_done = sum(1 for label in aug_labels if int(label) == int(emo_idx))

            remaining = needed - already_done
            print(f"⚠️ فئة {emo} تحتاج {remaining} جملة جديدة")

            if remaining > 0:
                samples = df_main[df_main["emotion"] == emo]["sentence"].tolist()
                for _ in range(remaining):
                    original = random.choice(samples)
                    aug_sent = back_translate(original, sleep=2.5)
                    if aug_sent:
                        aug_sents.append(aug_sent)
                        aug_labels.append(emo_idx)
                        pd.DataFrame({"sentence": aug_sents, "emotion": aug_labels}) \
                            .to_csv(saved_aug_file, index=False, encoding="utf-8-sig")
                        print(f"✅ تم توليد جملة جديدة لفئة {emo}")

    # دمج البيانات مع الجمل المولدة فقط (أي الجمل المولدة غير موجودة في df_extra)
    if aug_sents:
        aug_df = pd.DataFrame({"sentence": aug_sents, "emotion": aug_labels})
        df = pd.concat([df, aug_df], ignore_index=True).reset_index(drop=True)

    # تقسيم البيانات
    train_df, temp_df = train_test_split(df, test_size=0.3, stratify=df["emotion"], random_state=SEED)
    val_df, test_df = train_test_split(temp_df, test_size=0.5, stratify=temp_df["emotion"], random_state=SEED)

    class_weights_np = compute_class_weight(
        class_weight="balanced",
        classes=np.unique(train_df["emotion"]),
        y=train_df["emotion"]
    )
    class_weights = torch.tensor(class_weights_np, dtype=torch.float)

    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name, num_labels=len(le.classes_)
    )

    train_ds = BalancedEmotionDataset(train_df, tokenizer)
    val_encodings = tokenizer(val_df["sentence"].tolist(), padding=True, truncation=True, max_length=128)
    val_labels = torch.tensor(val_df["emotion"].tolist())
    val_ds = ValDataset(val_encodings, val_labels)

    training_args = TrainingArguments(
        output_dir=f"./results_{phase_name.lower()}",
        eval_strategy="epoch",
        save_strategy="epoch",
        learning_rate=2e-5,
        weight_decay=0.01,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        gradient_accumulation_steps=2,
        num_train_epochs=10,
        lr_scheduler_type="cosine",
        warmup_steps=300,
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        greater_is_better=True,
        logging_dir=f"./logs_{phase_name.lower()}",
        logging_strategy="epoch",
        save_total_limit=2,
    )

    trainer = CustomTrainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        compute_metrics=compute_metrics,
        tokenizer=tokenizer,
        callbacks=[
            EarlyStoppingCallback(early_stopping_patience=3),
            RefreshDatasetCallback()
        ],
        class_weights=class_weights
    )

    trainer.train()

    print(f"\n📊 تقرير التقييم النهائي على مجموعة التحقق ({phase_name}):\n")
    preds = trainer.predict(val_ds).predictions.argmax(-1)
    print(classification_report(val_df["emotion"].tolist(), preds, target_names=le.classes_))

    save_dir = f"arabert_emotion_model_{phase_name.lower()}"
    os.makedirs(save_dir, exist_ok=True)
    trainer.save_model(save_dir)
    tokenizer.save_pretrained(save_dir)
    print(f"✅ تم حفظ النموذج في {save_dir}")

    return df, le

if __name__ == "__main__":
    df_phase1 = load_phase1_data()

    df_extra1 = pd.read_excel("shuffled_extra_sentance4.xlsx", usecols=["sentence", "emotion"])
    df_extra2 = pd.read_excel("extra.xlsx", usecols=["sentence", "emotion"])

    for df in [df_extra1, df_extra2]:
        df.columns = df.columns.str.strip().str.lower()
        df.dropna(inplace=True)
        df["emotion"] = df["emotion"].str.strip()

    df_extra = pd.concat([df_extra1, df_extra2], ignore_index=True)

    df_phase1, le_phase1 = prepare_and_train_with_extra(
        df_phase1, df_extra=df_extra, phase_name="Phase1_Saher_Sarcasm"
    )
