console.log('✅ analysisRoutes loaded');

const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/analyze', authenticate, analysisController.analyzeSentence);
router.post('/upload', authenticate, analysisController.upload.single('file'), analysisController.analyzeFile);
router.get('/history', authenticate, analysisController.getHistory);

module.exports = router;
