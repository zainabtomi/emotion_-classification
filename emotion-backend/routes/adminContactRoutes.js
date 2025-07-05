const express = require('express');
const router = express.Router();
const adminContactController = require('../controllers/adminContactController'); // تأكد أن هذا الملف موجود
const authenticate = require('../middlewares/authenticate');
const isAdmin = require('../middlewares/isAdmin');

router.use(authenticate, isAdmin);

router.get('/', adminContactController.getAllMessages);
router.delete('/:id', adminContactController.deleteMessage);
router.post('/reply', adminContactController.replyToMessage); // ← هنا الخطأ على الأغلب


module.exports = router;
