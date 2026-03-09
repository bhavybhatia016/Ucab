const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickup: {
    address: { type: String, required: true },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  dropoff: {
    address: { type: String, required: true },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  cabType: {
    type: String,
    enum: ['economy', 'comfort', 'premium', 'xl'],
    default: 'economy'
  },
  driver: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    vehicle: { type: String, default: '' },
    plateNumber: { type: String, default: '' },
    avatar: { type: String, default: '👨‍✈️' }
  },
  status: {
    type: String,
    enum: ['searching', 'confirmed', 'arriving', 'onride', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  fare: {
    base: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },
  distance: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  rating: { type: Number, min: 1, max: 5, default: null },
  review: { type: String, default: '' },
  refreshments: { type: Array, default: [] },
  donation: { type: Number, default: 0 },
  promoCode: { type: String, default: '' },
  discount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Booking', bookingSchema);