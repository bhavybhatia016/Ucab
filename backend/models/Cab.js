const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['economy', 'comfort', 'premium', 'xl'], required: true },
  vehicle: { type: String, required: true },
  plateNumber: { type: String, required: true, unique: true },
  seats: Number,
  rating: { type: Number, default: 4.5 },
  totalRides: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  currentLocation: { lat: Number, lng: Number },
  features: [String],
  pricePerKm: Number,
  baseFare: Number,
  image: String
});

module.exports = mongoose.model('Cab', cabSchema);