const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: ['http://localhost:3000'], methods: ['GET', 'POST'] }
});

connectDB();

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/cabs', require('./routes/cabRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/driver', require('./routes/driverRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));


app.post('/api/seed-admin', async (req, res) => {
  try {
    const User = require('./models/User');
    const exists = await User.findOne({ email: 'admin@ucab.com' });
    if (exists) return res.json({ message: 'Admin already exists' });
    await User.create({
      name: 'UCab Admin',
      email: 'admin@ucab.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin'
    });
    res.json({ message: 'Admin created: admin@ucab.com / admin123' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

io.on('connection', (socket) => {
  socket.on('join-ride', (rideId) => socket.join(rideId));
  socket.on('driver-location', (data) => io.to(data.rideId).emit('location-update', data));
  socket.on('ride-status-update', (data) => io.to(data.rideId).emit('status-update', data));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚖 UCab Server running on port ${PORT}`));