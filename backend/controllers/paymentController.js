const Booking = require('../models/Booking');
const User = require('../models/User');

const processPayment = async (req, res) => {
  try {
    const { bookingId, method, amount } = req.body;

    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: 'paid', status: 'completed', completedAt: new Date() },
      { new: true }
    );

  
    if (method === 'wallet') {
      await User.findByIdAndUpdate(req.user._id, { $inc: { wallet: -amount } });
    }

    res.json({ success: true, booking, transactionId: 'TXN' + Date.now() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const addToWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { wallet: amount } },
      { new: true }
    ).select('-password');
    res.json({ wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { processPayment, addToWallet };