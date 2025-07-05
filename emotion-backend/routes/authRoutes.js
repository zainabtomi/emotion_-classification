const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate'); // تأكد أنه موجود

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.get('/verify/:token', authController.verifyEmail);
router.get('/profile', authController.getProfile);

router.post('/forgot-password', authController.requestPasswordReset);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
