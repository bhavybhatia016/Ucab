const Booking = require('../models/Booking');

const fareRates = {
  economy: { base: 40, perKm: 12 },
  comfort:  { base: 60, perKm: 16 },
  premium:  { base: 100, perKm: 24 },
  xl:       { base: 80, perKm: 20 }
};

const mockDriverInfo = [
  { name: 'Rahul Kumar', phone: '9876543210', rating: 4.8, vehicle: 'Maruti Swift', plateNumber: 'DL01AB1234' },
  { name: 'Priya Singh', phone: '8765432109', rating: 4.9, vehicle: 'Honda City', plateNumber: 'MH12CD5678' },
  { name: 'Amit Sharma', phone: '7654321098', rating: 4.7, vehicle: 'Toyota Innova', plateNumber: 'KA05EF9012' },
  { name: 'Deepak Verma', phone: '6543210987', rating: 4.6, vehicle: 'BMW 3 Series', plateNumber: 'TN09GH3456' }
];

// POST /api/bookings/estimate
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

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { pickup, dropoff, cabType, paymentMethod, promoCode, donation, refreshments } = req.body;

    const distance = parseFloat((Math.random() * 15 + 3).toFixed(1));
    const rate = fareRates[cabType] || fareRates.economy;
    const baseFare = Math.round(rate.base + distance * rate.perKm);

    let discount = 0;
    if (promoCode === 'UCAB10') discount = Math.round(baseFare * 0.1);
    if (promoCode === 'FIRST50') discount = Math.round(baseFare * 0.5);

    const driverInfo = mockDriverInfo[Math.floor(Math.random() * mockDriverInfo.length)];

    const booking = await Booking.create({
      rider: req.user._id,
      driver: null,
      driverInfo,
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
      status: 'searching',
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

// GET /api/bookings/history
const getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ rider: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/bookings/:id/rate
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
