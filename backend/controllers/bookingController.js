const Booking = require('../models/Booking');
const mongoose = require('mongoose');

const mockDrivers = [
  { name: 'Rahul Kumar', phone: '+91 98765 43210', rating: 4.8, vehicle: 'Maruti Swift', plateNumber: 'DL 01 AB 1234', avatar: '👨‍✈️' },
  { name: 'Priya Singh', phone: '+91 87654 32109', rating: 4.9, vehicle: 'Honda City', plateNumber: 'MH 12 CD 5678', avatar: '👩‍✈️' },
  { name: 'Amit Sharma', phone: '+91 76543 21098', rating: 4.7, vehicle: 'Toyota Innova', plateNumber: 'KA 05 EF 9012', avatar: '🧑‍✈️' },
  { name: 'Deepak Verma', phone: '+91 65432 10987', rating: 4.6, vehicle: 'BMW 3 Series', plateNumber: 'TN 09 GH 3456', avatar: '👨‍✈️' }
];

const fareRates = {
  economy: { base: 40, perKm: 12 },
  comfort:  { base: 60, perKm: 16 },
  premium:  { base: 100, perKm: 24 },
  xl:       { base: 80, perKm: 20 }
};

const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (e) {
    return new mongoose.Types.ObjectId();
  }
};


const getEstimate = async (req, res) => {
  try {
    const distance = parseFloat((Math.random() * 15 + 3).toFixed(1));
    const estimates = Object.entries(fareRates).map(([type, rate]) => ({
      type,
      fare: Math.round(rate.base + distance * rate.perKm),
      distance: distance.toFixed(1),
      duration: Math.round(distance * 3 + 5),
      eta: Math.round(Math.random() * 8 + 2)
    }));
    res.json({ estimates, distance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const createBooking = async (req, res) => {
  try {
    const { pickup, dropoff, cabType, paymentMethod, promoCode, donation, refreshments } = req.body;

    const distance = parseFloat((Math.random() * 15 + 3).toFixed(1));
    const rate = fareRates[cabType] || fareRates.economy;
    const baseFare = Math.round(rate.base + distance * rate.perKm);

    let discount = 0;
    if (promoCode === 'UCAB10') discount = Math.round(baseFare * 0.1);
    if (promoCode === 'FIRST50') discount = Math.round(baseFare * 0.5);

    const driver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];

    const booking = await Booking.create({
      user: toObjectId(req.user._id),
      pickup: {
        address: pickup?.address || String(pickup) || 'Unknown',
        lat: pickup?.lat || 0,
        lng: pickup?.lng || 0
      },
      dropoff: {
        address: dropoff?.address || String(dropoff) || 'Unknown',
        lat: dropoff?.lat || 0,
        lng: dropoff?.lng || 0
      },
      cabType: cabType || 'economy',
      driver,
      status: 'confirmed',
      fare: {
        base: rate.base,
        distance: Math.round(distance * rate.perKm),
        total: baseFare - discount + (donation || 0)
      },
      distance,
      duration: Math.round(distance * 3 + 5),
      paymentMethod: paymentMethod || 'cash',
      promoCode: promoCode || '',
      discount,
      donation: donation || 0,
      refreshments: refreshments || []
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error('Create booking error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const userId = toObjectId(req.user._id);
    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const rateBooking = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { rating, review, status: 'completed' },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEstimate, createBooking, getBookingHistory, getBookingById, cancelBooking, rateBooking };