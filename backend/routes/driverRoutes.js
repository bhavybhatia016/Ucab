const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  getAvailableRides, getActiveRide, acceptRide, rejectRide,
  startRide, completeRide, getRideHistory, toggleAvailability
} = require('../controllers/driverController');

router.use(protect, requireRole('driver'));
router.get('/rides/available', getAvailableRides);
router.get('/rides/active', getActiveRide);
router.get('/rides/history', getRideHistory);
router.post('/rides/:id/accept', acceptRide);
router.post('/rides/:id/reject', rejectRide);
router.put('/rides/:id/start', startRide);
router.put('/rides/:id/complete', completeRide);
router.put('/availability', toggleAvailability);

module.exports = router;