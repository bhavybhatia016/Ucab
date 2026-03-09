const express = require('express');
const router = express.Router();
const { processPayment, addToWallet } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/process', protect, processPayment);
router.post('/wallet/add', protect, addToWallet);

module.exports = router;