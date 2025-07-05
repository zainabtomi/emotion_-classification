const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const analysisController = require('../controllers/analysisController');


router.get('/history', authenticate, analysisController.getHistory);


module.exports = router;
