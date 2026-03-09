const express = require('express');
const router = express.Router();
const { getEstimate, createBooking, getBookingHistory, getBookingById, cancelBooking, rateBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/estimate', protect, getEstimate);
router.post('/', protect, createBooking);
router.get('/history', protect, getBookingHistory);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/rate', protect, rateBooking);

module.exports = router;