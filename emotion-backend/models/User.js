const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Analysis = require('./Analysis');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verification_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  reset_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reset_token_expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

// ✅ العلاقات
User.hasMany(Analysis, { foreignKey: 'userId' });
Analysis.belongsTo(User, { foreignKey: 'userId' });

// ✅ دوال مساعدة لإدارة المستخدمين

User.findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

User.createUser = async (name, email, passwordHash, token) => {
  return await User.create({
    name,
    email,
    password_hash: passwordHash,
    verification_token: token,
    is_verified: false,
  });
};

User.verifyUserByCode = async (token) => {
  const user = await User.findOne({ where: { verification_token: token } });
  if (!user) return false;
  user.verification_token = null;
  user.is_verified = true;
  await user.save();
  return true;
};

User.setResetToken = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  user.reset_token = token;
  user.reset_token_expires = expires;
  await user.save({ fields: ['reset_token', 'reset_token_expires'] });

  return token;
};

User.verifyResetToken = async (email, token) => {
  const user = await User.findOne({ where: { email } });
  if (!user || user.reset_token !== token) return false;

  const now = new Date();
  const expires = new Date(user.reset_token_expires);
  if (now > expires) return false;

  return true;
};

User.updatePassword = async (email, newPasswordHash) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return false;

  user.password_hash = newPasswordHash;
  user.reset_token = null;
  user.reset_token_expires = null;
  await user.save();

  return true;
};

// ✅ تحديث حالة التحقق
User.updateVerificationStatus = async (id, status) => {
  return await User.update({ is_verified: status }, { where: { id } });
};

// ✅ حذف المستخدم
User.deleteById = async (id) => {
  return await User.destroy({ where: { id } });
};

module.exports = User;
