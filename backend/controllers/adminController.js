const User = require('../models/User');
const Booking = require('../models/Booking');

// Dashboard stats
exports.getStats = async (req, res) => {
  try {
    const totalRiders = await User.countDocuments({ role: 'rider' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: { $in: ['searching', 'accepted', 'started'] } });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$fare.total' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      totalRiders, totalDrivers, totalBookings,
      activeBookings, completedBookings, cancelledBookings, totalRevenue
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : { role: { $in: ['rider', 'driver'] } };
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Block / unblock user
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'unblocked' : 'blocked'}`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve driver
exports.approveDriver = async (req, res) => {
  try {
    const driver = await User.findById(req.params.id);
    if (!driver || driver.role !== 'driver') return res.status(404).json({ message: 'Driver not found' });
    driver.isApproved = true;
    await driver.save();
    res.json({ message: 'Driver approved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('rider', 'name email phone')
      .populate('driver', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};