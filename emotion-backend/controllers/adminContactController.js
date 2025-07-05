const ContactMessage = require('../models/Contact');
const nodemailer = require('nodemailer');

// ✅ جلب كل الرسائل
const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['created_at', 'DESC']] });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ حذف رسالة
const deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await ContactMessage.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ إرسال رد
const replyToMessage = async (req, res) => {
  const { email, replyText } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'رد على رسالتك',
      html: `<p>${replyText}</p>`,
    });

    // بإمكانك هنا تحديث حالة الرسالة إلى "تم الرد"
    res.json({ message: 'Reply sent successfully' });
  } catch (err) {
    console.error('Error sending reply:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

module.exports = {
  getAllMessages,
  deleteMessage,
  replyToMessage,
};
