const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authenticate');
const isAdmin = require('../middlewares/isAdmin');

// جميع هذه الروابط تتطلب أن يكون المستخدم مسؤولًا (is_admin)
router.use(authenticate, isAdmin);

router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/toggle-verification', adminController.toggleVerification);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/:id/send-email', adminController.sendManualEmail);

module.exports = router;
