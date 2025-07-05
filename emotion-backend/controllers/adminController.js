const User = require('../models/User');
const Analysis = require('../models/Analysis'); // إذا عندك جدول للتحليلات
const nodemailer = require('nodemailer');

// إعداد إيميل المرسل
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// عرض كل المستخدمين + عدد تحليلات كل مستخدم
exports.getAllUsers = async (req, res) => {
  try {
        console.log('📥 [Admin] طلب عرض المستخدمين'); // للتأكد أن الدالة تُستدعى

    const users = await User.findAll();
        console.log('📦 المستخدمين من قاعدة البيانات:', users);

    const analysisCounts = await Analysis.countByUser(); // ترجع { userId: count }
        console.log('📊 عدد التحليلات لكل مستخدم:', analysisCounts);


    const result = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      is_verified: user.is_verified,
      analysis_count: analysisCounts[user.id] || 0,
    }));

    res.json(result);
  } catch (err) {
    console.error('❌ getAllUsers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// تفعيل أو تعطيل المستخدم
exports.toggleVerification = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.updateVerificationStatus(id, !user.is_verified);
    res.json({ message: 'Verification status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// حذف مستخدم
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.deleteById(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// إرسال بريد يدوي لمستخدم
exports.sendManualEmail = async (req, res) => {
  const { id } = req.params;
  const { subject, message } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject,
      html: `<p>${message}</p>`,
    });

    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Email sending failed' });
  }
};
