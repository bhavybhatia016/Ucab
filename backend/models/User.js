const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['rider', 'driver', 'admin'], default: 'rider' },
  avatar: { type: String, default: '' },

  // Rider fields
  wallet: { type: Number, default: 0 },
  totalRides: { type: Number, default: 0 },
  referralCode: { type: String, sparse: true },
  savedPayments: [{ type: { type: String }, last4: String, brand: String, isDefault: Boolean }],
  savedAddresses: [{ label: String, address: String, lat: Number, lng: Number }],

  // Driver fields
  isAvailable: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  vehicle: {
    type: { type: String },
    model: String,
    plateNumber: String,
    color: String
  },
  rating: { type: Number, default: 5.0 },
  totalEarnings: { type: Number, default: 0 },
  completedRides: { type: Number, default: 0 },
  currentLocation: { lat: Number, lng: Number },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
