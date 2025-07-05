const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContactMessage = sequelize.define('ContactMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'New',
  },
}, {
  tableName: 'contact_messages',
  timestamps: true,
  underscored: true,
});

module.exports = ContactMessage;
