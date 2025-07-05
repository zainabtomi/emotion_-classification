const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const modelController = require('../controllers/modelController');
const authenticate = require('../middlewares/authenticate');
const isAdmin = require('../middlewares/isAdmin');

router.use(authenticate, isAdmin);

router.get('/status', modelController.getStatus);
router.get('/logs', modelController.getLogs);
router.post('/train', upload.single('file'), modelController.uploadAndTrain);

module.exports = router;
