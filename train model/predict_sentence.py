from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# تحميل النموذج والتوكن
tokenizer = AutoTokenizer.from_pretrained("aubmindlab/bert-base-arabertv02")
model = AutoModelForSequenceClassification.from_pretrained("./arabert_emotion_model_phase1_saher_sarcasm")

# تسميات الفئات حسب التدريب
labels = ['Admiration', 'Anger', 'Fear', 'Happiness', 'Hope', 'Love', 'Oppressed Sorrow', 'Sarcasm', 'Yearning', 'other']

sentences = [
    "كم هو مدهشٌ ذلك الكاتب، يجعل الحروف ترقص على الورق!",
    "تصميم المكان يعكس ذوقًا رفيعًا لا يُخطئه النظر.",
    "طريقة شرحه بسيطة، عبقرية، وتلامس فهم القارئ مباشرة.",
    "أداء الفريق كان منسجمًا بطريقة تُثير الإعجاب.",
    "كلماتها كانت كالسحر، تدخل القلب دون استئذان.",
    "يا سلام على الخدمة الممتازة، استنيت بس ساعتين بدون ما يرد عليّ أحد!",
    "أكيد، لأنه طبعًا كل قرار حكومي هدفه راحتنا وسعادتنا.",
    "ما شاء الله عليه، عبقري لدرجة أنه نسي كيف يحل مسألة جمع بسيطة.",
    "كل شيء كان مثاليًا، لولا أنه فشل فشلًا ذريعًا!",
    "النت كان سريع جدًا، بس أخذ ساعة عشان يفتح صفحة جوجل!"
]


# تحليل كل جملة
for text in sentences:
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    max_prob, idx = torch.max(probs, dim=1)
    
    print("📌 الجملة:", text)
    print("🔍 التصنيف:", labels[idx.item()])
    print("📊 النسبة:", f"{max_prob.item()*100:.2f}%")
    print("-" * 40)

