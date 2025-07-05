const ModelStatus = require('../models/ModelStatus');
const { getLogs } = require('../utils/logHandler');
const trainModel = require('../utils/trainModel');
const fs = require('fs');

exports.getStatus = async (req, res) => {
  try {
    const status = await ModelStatus.findOne();
    if (!status) {
      return res.json({ isTrained: false, accuracy: 0.0, lastTrained: null });
    }
    return res.json(status);
  } catch (err) {
    console.error('Error fetching model status:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await getLogs();
    return res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadAndTrain = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  try {
    const accuracy = await trainModel(req.file.path);
    fs.unlinkSync(req.file.path); // حذف الملف بعد الاستخدام
    return res.json({ message: 'Model trained successfully', accuracy });
  } catch (err) {
    console.error('Training failed:', err);
    return res.status(500).json({ message: 'Training failed', error: err.message });
  }
};
