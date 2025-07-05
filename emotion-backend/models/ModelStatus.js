const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ModelStatus = sequelize.define('ModelStatus', {
  isTrained: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  accuracy: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  lastTrained: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ModelStatus;
