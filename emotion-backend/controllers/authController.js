// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// إعداد الإيميل
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// تسجيل المستخدم
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.random().toString(36).substring(2, 15);

    await User.createUser(name, email, hashedPassword, verificationToken);

    const verificationLink = `${process.env.BACKEND_URL}/auth/verify/${verificationToken}`;


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// تفعيل الحساب
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const success = await User.verifyUserByCode(token);
    if (!success) return res.status(400).send('Invalid or expired verification link');

    res.send('Email verified successfully. You can now login.');
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).send('Server error');
  }
};

// تسجيل الدخول
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.is_verified) return res.status(403).json({ message: 'Please verify your email before logging in.' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

const token = jwt.sign(
  { userId: user.id, isAdmin: user.is_admin }, // ✅ مهم
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin || false, // في حال استخدمت صلاحيات
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// طلب رمز إعادة تعيين كلمة المرور
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const userExists = await User.findUserByEmail(email);
    if (!userExists) return res.status(404).json({ error: 'User not found' });

    const resetToken = await User.setResetToken(email);
    if (!resetToken) return res.status(500).json({ error: 'Could not create reset token' });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetToken}. It is valid for 15 minutes.`,
    });

    res.json({ message: 'Reset code sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};


const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;  // تأتي من authenticate middleware
    // هنا يمكنك استدعاء قاعدة البيانات لجلب بيانات المستخدم بناءً على userId
    const user = await User.findByPk(userId); // مثال مع Sequelize

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({ user: req.user });
};

// التحقق من رمز إعادة التعيين
const verifyResetCode = async (req, res) => {
     console.log('Verify Reset Code Request Body:', req.body);


const email = req.body.email?.trim();
const token = req.body.token?.trim();
console.log('📥 Trimmed Email:', email);
console.log('📥 Trimmed Token:', token);

   

  if (!email || !token) {
  console.log('❌ Missing email or token');
  return res.status(400).json({ error: 'Email and token are required' });
}


  const isValid = await User.verifyResetToken(email, token);
    console.log('🔍 Token validation result:', isValid);

  if (!isValid) return res.status(400).json({ error: 'Invalid or expired token' });

  res.json({ message: 'Token verified' });
};

// تعيين كلمة مرور جديدة
const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  const isValid = await User.verifyResetToken(email, token);
  if (!isValid) return res.status(400).json({ error: 'Invalid or expired token' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.updatePassword(email, hashedPassword);

  res.json({ message: 'Password updated successfully' });
};

module.exports = {
  register,
  verifyEmail,
  login,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
  getProfile 

};
