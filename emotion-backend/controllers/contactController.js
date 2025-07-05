const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ message: 'Email and message are required.' });
    }

    await Contact.create({ name, email, message });

    return res.status(200).json({ message: 'Message received successfully!' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.findAll({ order: [['created_at', 'DESC']] });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send reply
exports.sendReply = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  try {
    const message = await Contact.findByPk(id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: message.email,
      subject: `رد على استفسارك`,
      html: `<p>رسالتك:</p><p>${message.message}</p><hr><p>ردنا:</p><p>${reply}</p>`,
    });

    message.reply = reply;
    message.status = 'Replied';
    await message.save();

    res.json({ message: 'Reply sent and status updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send reply' });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Contact.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

