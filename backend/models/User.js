const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true },
  avatar: { type: String, default: '' },
  savedPayments: [{
    type: { type: String, enum: ['card', 'upi', 'wallet'] },
    last4: String,
    brand: String,
    isDefault: { type: Boolean, default: false }
  }],
  savedAddresses: [{
    label: String,
    address: String,
    lat: Number,
    lng: Number
  }],
  wallet: { type: Number, default: 0 },
  totalRides: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);