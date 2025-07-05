const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TrainingLog = sequelize.define('TrainingLog', {
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  log: {
    type: DataTypes.TEXT,
  },
});

module.exports = TrainingLog;
