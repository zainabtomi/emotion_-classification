const express = require('express');
const router = express.Router();
const adminAnalysisController = require('../controllers/adminAnalysisController');
const authenticate = require('../middlewares/authenticate');
const isAdmin = require('../middlewares/isAdmin');

// جميع المسارات التالية تتطلب صلاحية الأدمن
router.use(authenticate, isAdmin);

// 🔍 تحليلات الجمل
router.get('/analyses', adminAnalysisController.getAllAnalyses);
router.patch('/analyses/:id', adminAnalysisController.updateAnalysisLabel);
router.delete('/analyses/:id', adminAnalysisController.deleteAnalysis);

// 📁 سجلات رفع الملفات
router.get('/file-uploads', adminAnalysisController.getFileUploadLogs);

module.exports = router;
