const Booking = require('../models/Booking');
const User = require('../models/User');


exports.getAvailableRides = async (req, res) => {
  try {
    const rides = await Booking.find({
      status: 'searching',
      rejectedBy: { $ne: req.user._id }
    }).sort({ createdAt: -1 }).limit(10);
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getActiveRide = async (req, res) => {
  try {
    const ride = await Booking.findOne({
      driver: req.user._id,
      status: { $in: ['accepted', 'started'] }
    });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.acceptRide = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'searching') return res.status(400).json({ message: 'Ride no longer available' });

    const driver = await User.findById(req.user._id);
    booking.driver = req.user._id;
    booking.status = 'accepted';
    booking.acceptedAt = new Date();
    booking.driverInfo = {
      name: driver.name,
      phone: driver.phone,
      rating: driver.rating,
      vehicle: driver.vehicle?.model || 'Sedan',
      plateNumber: driver.vehicle?.plateNumber || 'DL01AB1234',
    };
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectRide = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.rejectedBy.push(req.user._id);
    await booking.save();
    res.json({ message: 'Ride rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.startRide = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, driver: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'started';
    booking.startedAt = new Date();
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.completeRide = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, driver: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'completed';
    booking.completedAt = new Date();
    booking.paymentStatus = 'paid';
    await booking.save();

    
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalEarnings: booking.fare?.total || 0, completedRides: 1 }
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getRideHistory = async (req, res) => {
  try {
    const rides = await Booking.find({ driver: req.user._id })
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.toggleAvailability = async (req, res) => {
  try {
    const driver = await User.findById(req.user._id);
    driver.isAvailable = !driver.isAvailable;
    await driver.save();
    res.json({ isAvailable: driver.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};