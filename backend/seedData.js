const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Booking = require('./models/Booking');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');


  const collections = await mongoose.connection.db.listCollections().toArray();
  const names = collections.map(c => c.name);
  if (names.includes('bookings')) {
    await mongoose.connection.db.dropCollection('bookings');
    console.log('🗑  Dropped bookings collection');
  }
  await User.deleteMany({ email: { $ne: 'admin@ucab.com' } });
  console.log('🗑  Cleared users (kept admin)');

  await User.deleteOne({ email: 'admin@ucab.com' });
  await User.create({
    name: 'UCab Admin', email: 'admin@ucab.com',
    password: 'admin123', phone: '9999999999',
    role: 'admin', isActive: true,
    referralCode: 'UCBADMIN'
  });
  console.log('✅ Admin created with role: admin');

  const riderData = [
    { name: 'Arjun Sharma',  email: 'arjun@gmail.com',  password: 'test123', phone: '9876543210', role: 'rider', wallet: 450, totalRides: 12, isActive: true },
    { name: 'Priya Patel',   email: 'priya@gmail.com',   password: 'test123', phone: '9876543211', role: 'rider', wallet: 200, totalRides: 8,  isActive: true },
    { name: 'Rohan Mehta',   email: 'rohan@gmail.com',   password: 'test123', phone: '9876543212', role: 'rider', wallet: 0,   totalRides: 3,  isActive: true },
    { name: 'Sneha Iyer',    email: 'sneha@gmail.com',    password: 'test123', phone: '9876543213', role: 'rider', wallet: 800, totalRides: 25, isActive: false },
  ];
  const riders = [];
  for (let i = 0; i < riderData.length; i++) {
    const u = await User.create({ ...riderData[i], referralCode: 'RIDER' + (i+1) + Math.random().toString(36).substr(2,4).toUpperCase() });
    riders.push(u);
  }
  console.log(`✅ ${riders.length} riders created`);

  const driverData = [
    { name: 'Rahul Kumar', email: 'rahul.driver@gmail.com', password: 'test123', phone: '9123456781', role: 'driver', isApproved: true,  isAvailable: true,  rating: 4.9, totalEarnings: 18500, completedRides: 142, vehicle: { type: 'economy', model: 'Maruti Swift',   plateNumber: 'DL01AB1234', color: 'White'  }, isActive: true },
    { name: 'Suresh Yadav', email: 'suresh.driver@gmail.com', password: 'test123', phone: '9123456782', role: 'driver', isApproved: true,  isAvailable: false, rating: 4.7, totalEarnings: 12300, completedRides: 98,  vehicle: { type: 'comfort', model: 'Honda City',     plateNumber: 'DL02CD5678', color: 'Silver' }, isActive: true },
    { name: 'Amit Singh',  email: 'amit.driver@gmail.com',  password: 'test123', phone: '9123456783', role: 'driver', isApproved: false, isAvailable: false, rating: 5.0, totalEarnings: 0,     completedRides: 0,   vehicle: { type: 'premium', model: 'Toyota Innova',  plateNumber: 'DL03EF9012', color: 'Black'  }, isActive: true },
    { name: 'Vijay Rao',   email: 'vijay.driver@gmail.com',  password: 'test123', phone: '9123456784', role: 'driver', isApproved: true,  isAvailable: true,  rating: 4.8, totalEarnings: 9800,  completedRides: 76,  vehicle: { type: 'xl',      model: 'Maruti Ertiga',  plateNumber: 'DL04GH3456', color: 'Grey'   }, isActive: true },
  ];
  const drivers = [];
  for (let i = 0; i < driverData.length; i++) {
    const u = await User.create({ ...driverData[i], referralCode: 'DRV' + (i+1) + Math.random().toString(36).substr(2,4).toUpperCase() });
    drivers.push(u);
  }
  console.log(`✅ ${drivers.length} drivers created`);

  const statuses = ['completed', 'completed', 'completed', 'cancelled', 'searching', 'accepted'];
  const cabTypes = ['economy', 'comfort', 'premium', 'xl'];
  const payMethods = ['upi', 'cash', 'wallet', 'card'];
  const pickups  = ['Connaught Place, New Delhi', 'Bandra West, Mumbai', 'MG Road, Bangalore', 'Park Street, Kolkata', 'Anna Nagar, Chennai'];
  const dropoffs = ['IGI Airport, Delhi', 'Andheri East, Mumbai', 'Whitefield, Bangalore', 'Salt Lake, Kolkata', 'Chennai Central Railway'];
  const rates = { economy: 12, comfort: 16, premium: 24, xl: 20 };

  const bookings = [];
  for (let i = 0; i < 20; i++) {
    const rider  = riders[i % riders.length];
    const driver = drivers[i % drivers.length];
    const status = statuses[i % statuses.length];
    const cabType = cabTypes[i % cabTypes.length];
    const dist  = +(5 + Math.random() * 15).toFixed(1);
    const total = Math.round(40 + dist * rates[cabType]);
    const hasDriver = ['completed', 'accepted', 'started'].includes(status);

    bookings.push({
      rider:  rider._id,
      driver: hasDriver ? driver._id : null,
      driverInfo: hasDriver ? {
        name: driver.name, phone: driver.phone,
        rating: driver.rating,
        vehicle: driver.vehicle?.model,
        plateNumber: driver.vehicle?.plateNumber
      } : {},
      pickup:  { address: pickups[i % pickups.length],  lat: 28.6 + Math.random(), lng: 77.2 + Math.random() },
      dropoff: { address: dropoffs[i % dropoffs.length], lat: 28.5 + Math.random(), lng: 77.1 + Math.random() },
      cabType, status,
      fare: { base: 40, distance: Math.round(dist * rates[cabType]), total },
      distance: dist,
      duration: Math.round(dist * 3),
      paymentMethod: payMethods[i % payMethods.length],
      paymentStatus: status === 'completed' ? 'paid' : 'pending',
      rating: status === 'completed' ? (4 + Math.round(Math.random())) : null,
      promoCode: i % 4 === 0 ? 'UCAB10' : '',
      discount:  i % 4 === 0 ? Math.round(total * 0.1) : 0,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    });
  }

  await Booking.insertMany(bookings);
  console.log(`✅ ${bookings.length} bookings created`);

  console.log('\n🎉 All mock data seeded!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 ADMIN:   admin@ucab.com   / admin123');
  console.log('🧑 RIDER:   arjun@gmail.com  / test123');
  console.log('🚗 DRIVER:  rahul.driver@gmail.com / test123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });