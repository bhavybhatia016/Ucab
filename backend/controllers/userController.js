const User = require('../models/User');


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { name, phone, savedAddresses } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, savedAddresses },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const addPaymentMethod = async (req, res) => {
  try {
    const { type, last4, brand } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { savedPayments: { type, last4, brand } } },
      { new: true }
    ).select('-password');
    res.json(user.savedPayments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile, addPaymentMethod };