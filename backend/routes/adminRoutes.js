const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  getStats, getAllUsers, toggleUserStatus,
  approveDriver, getAllBookings, deleteUser
} = require('../controllers/adminController');

router.use(protect, requireRole('admin'));
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.put('/users/:id/approve', approveDriver);
router.delete('/users/:id', deleteUser);
router.get('/bookings', getAllBookings);

module.exports = router;