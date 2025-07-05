const sequelize = require('../config/db'); // ✅ هذا السطر هو الحل
const Analysis = require('../models/Analysis');
const User = require('../models/User');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    // عدد المستخدمين
    const usersCount = await User.count();

    // عدد التحليلات (كلها من جدول analysis)
    const totalAnalyses = await Analysis.count();

    // عدد الجمل (تساوي التحليلات نفسها)
    const totalSentences = totalAnalyses;

    // توزيع المشاعر
    const emotionCounts = await Analysis.findAll({
      attributes: ['label', [sequelize.fn('COUNT', 'label'), 'count']],
      group: ['label'],
    });

    const emotionDistribution = {};
    for (const item of emotionCounts) {
      emotionDistribution[item.label] = parseInt(item.dataValues.count);
    }

    res.json({
      usersCount,
      totalAnalyses,
      totalSentences,
      emotionDistribution,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Error loading dashboard statistics' });
  }
};

module.exports = {
  getDashboardStats,
};
