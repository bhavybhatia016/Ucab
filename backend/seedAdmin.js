const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const exists = await User.findOne({ email: 'admin@ucab.com' });
  if (exists) {
    console.log('✅ Admin already exists — admin@ucab.com / admin123');
    process.exit(0);
  }

  await User.create({
    name: 'UCab Admin',
    email: 'admin@ucab.com',
    password: 'admin123',
    phone: '9999999999',
    role: 'admin',
    isActive: true
  });

  console.log('✅ Admin created successfully!');
  console.log('📧 Email: admin@ucab.com');
  console.log('🔑 Password: admin123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });