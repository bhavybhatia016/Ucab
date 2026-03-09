const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'ucab_secret_key', { expiresIn: '30d' });

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all required fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const referralCode = 'UCAB' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const user = await User.create({ name, email, password, phone, referralCode });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, phone: user.phone,
      wallet: user.wallet, totalRides: user.totalRides, referralCode: user.referralCode,
      savedPayments: user.savedPayments, savedAddresses: user.savedAddresses,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please enter email and password' });
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({
      _id: user._id, name: user.name, email: user.email, phone: user.phone,
      wallet: user.wallet, totalRides: user.totalRides, referralCode: user.referralCode,
      savedPayments: user.savedPayments, savedAddresses: user.savedAddresses,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile };