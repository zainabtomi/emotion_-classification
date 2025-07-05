const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Analysis = sequelize.define('Analysis', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId',
  },
  sentence: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  confidence: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
}, {
  tableName: 'analyses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: false,
});

// ✅ دالة لحساب عدد التحليلات لكل مستخدم
Analysis.countByUser = async () => {
  const results = await Analysis.findAll({
    attributes: ['userId', [sequelize.fn('COUNT', 'userId'), 'count']],
    group: ['userId'],
    raw: true,
  });

  const counts = {};
  results.forEach(item => {
    counts[item.userId] = parseInt(item.count);
  });

  return counts;
};

module.exports = Analysis;

