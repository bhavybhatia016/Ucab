const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  driverInfo: {
    name: String, phone: String, rating: Number,
    vehicle: String, plateNumber: String, avatar: String
  },
  pickup: { address: { type: String, required: true }, lat: Number, lng: Number },
  dropoff: { address: { type: String, required: true }, lat: Number, lng: Number },
  cabType: { type: String, enum: ['economy', 'comfort', 'premium', 'xl'], default: 'economy' },
  status: {
    type: String,
    enum: ['searching', 'accepted', 'started', 'completed', 'cancelled'],
    default: 'searching'
  },
  fare: { base: Number, distance: Number, total: Number, currency: { type: String, default: 'INR' } },
  distance: Number,
  duration: Number,
  paymentMethod: { type: String, default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  rating: { type: Number, min: 1, max: 5, default: null },
  review: { type: String, default: '' },
  refreshments: { type: Array, default: [] },
  donation: { type: Number, default: 0 },
  promoCode: { type: String, default: '' },
  discount: { type: Number, default: 0 },
  rejectedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date
});

module.exports = mongoose.model('Booking', bookingSchema);