const express = require('express');
const router = express.Router();
const multer = require('multer');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authMiddleware, upload.single('file'), transactionController.uploadCSV);
router.get('/', authMiddleware, transactionController.getTransactions);
router.get('/summary', authMiddleware, transactionController.getSummary);
router.delete('/all', authMiddleware, transactionController.deleteAllTransactions);

module.exports = router;