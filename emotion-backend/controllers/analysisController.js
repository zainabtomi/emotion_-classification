const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const multer = require('multer');
const Analysis = require('../models/Analysis');

const upload = multer({ dest: 'uploads/' });

const analyzeSentence = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    const response = await axios.post('http://localhost:5000/analyze', { text });
    const { label, confidence } = response.data;

    const analysis = await Analysis.create({
      userId,
      sentence: text,
      label,
      confidence
    });

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error in analyzeSentence:', error);
    return res.status(500).json({ message: 'Server error during sentence analysis' });
  }
};

// ✅ تحليل ملف (TXT / CSV) مع حفظ النتائج وحساب النسب
const analyzeFile = async (req, res) => {
  console.log('📁 ملف تم رفعه:', req.file);

  try {
    const userId = req.user.id;
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let sentences = [];

    // ✅ قراءة ملف TXT
    if (ext === '.txt') {
      const data = fs.readFileSync(filePath, 'utf8');
      sentences = data.split(/\r?\n/).filter(line => line.trim() !== '');
    }

    // ✅ قراءة ملف CSV
    else if (ext === '.csv') {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            if (row.sentence) sentences.push(row.sentence);
          })
          .on('end', resolve)
          .on('error', reject);
      });
    }

    // ❌ ملف غير مدعوم
    else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Unsupported file type. Use .txt or .csv' });
    }

  const results = {};
const detailed = [];

for (const sentence of sentences) {
  const response = await axios.post('http://localhost:5000/analyze', { text: sentence });
  const { label, confidence } = response.data;

  await Analysis.create({ userId, sentence, label, confidence });

  results[label] = (results[label] || 0) + 1;
  detailed.push({ sentence, label, confidence });
}

// احسب النسب
const total = sentences.length;
const percentages = {};
for (const label in results) {
  percentages[label] = ((results[label] / total) * 100).toFixed(2);
}

// ✅ أرجع النتيجة كاملة
return res.status(200).json({
  percentages,
  total,
  detailed
});

  } catch (error) {
    console.error('Error during file analysis:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Server error during file analysis' });
  }
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await Analysis.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'sentence', 'label', 'created_at'],
    });

    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  analyzeSentence,
  analyzeFile,
  getHistory,
  upload
};
