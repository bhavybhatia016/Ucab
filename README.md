# 🚖 UCab — Your Ride, Your Way

> A full-stack cab booking web application built with the MERN stack (MongoDB, Express.js, React, Node.js) with role-based access for Riders, Drivers, and Admins.

## 📱 What is UCab?

UCab is a simple and easy-to-use cab booking webapp with three roles — **Rider**, **Driver**, and **Admin**. Riders book cabs, drivers accept and complete rides, and admins manage the entire platform from a dashboard.

---

## 🎭 Three Roles

### 🧑 Rider
- Register and login
- Book a cab in 3 steps
- Choose from 4 cab types
- Apply promo codes & pay via UPI/Card/Wallet/Cash
- Add in-ride refreshments & donate to plant trees
- Track driver live on map
- View ride history and receipts
- Manage UCab wallet

### 🚗 Driver
- Register as a driver
- View available ride requests
- Accept or reject rides
- Start and complete rides
- View earnings and ride history
- Toggle online/offline availability

### 👤 Admin
- Login to admin dashboard
- View platform stats (riders, drivers, bookings, revenue)
- Monitor live/active bookings
- Manage riders (block/unblock/delete)
- Manage drivers (approve/block/delete)
- View all bookings with full details

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login with role-based access
- 🎭 **3 Role System** — Rider, Driver, Admin
- 🗺️ **Live Tracking** — Real-time driver location via Socket.IO
- 🚗 **4 Cab Types** — Economy, Comfort, Premium, XL
- 💰 **Fare Estimation** — Instant fare & ETA before booking
- 🏷️ **Promo Codes** — UCAB10 (10% off), FIRST50 (50% off first ride)
- 💳 **Multiple Payments** — UPI, Card, Wallet, Cash
- ☕ **In-Ride Refreshments** — Water, Snacks, Coffee
- 🌱 **Donate & Plant Trees** — ₹10–₹50 donation per ride
- 📋 **Booking History** — View all past rides
- 👛 **UCab Wallet** — Add money & pay instantly
- ⭐ **Rate Your Driver** — 1–5 star rating after ride
- 📊 **Admin Dashboard** — Full platform management

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs |
| Real-time | Socket.IO |
| Styling | Custom CSS (dark luxury theme) |

---

## 📁 Project Structure

```
ucab/
├── backend/
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # Register, Login (role-aware)
│   │   ├── bookingController.js      # Rider booking flow
│   │   ├── driverController.js       # Driver actions
│   │   ├── adminController.js        # Admin actions
│   │   ├── cabController.js          # Nearby cabs
│   │   ├── paymentController.js      # Payments & wallet
│   │   └── userController.js         # User profile
│   ├── middleware/
│   │   └── authMiddleware.js         # JWT verify + requireRole()
│   ├── models/
│   │   ├── User.js                   # User schema (all 3 roles)
│   │   ├── Booking.js                # Booking schema
│   │   └── Cab.js                    # Cab schema
│   ├── routes/
│   │   ├── authRoutes.js             # /api/auth
│   │   ├── bookingRoutes.js          # /api/bookings
│   │   ├── driverRoutes.js           # /api/driver
│   │   ├── adminRoutes.js            # /api/admin
│   │   ├── cabRoutes.js              # /api/cabs
│   │   ├── paymentRoutes.js          # /api/payments
│   │   └── userRoutes.js             # /api/users
│   ├── seedData.js                   # Mock data seeder
│   ├── server.js                     # Entry point + Socket.IO
│   └── .env                          # Environment variables
│
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.js        # Global auth + role state
        │   └── BookingContext.js     # Booking state
        ├── pages/
        │   ├── LandingPage.js        # Public landing page
        │   ├── LoginPage.js          # Role-aware login
        │   ├── RegisterPage.js       # Rider/Driver registration
        │   ├── HomePage.js           # Rider dashboard
        │   ├── BookRidePage.js       # 3-step booking
        │   ├── TrackingPage.js       # Live tracking
        │   ├── HistoryPage.js        # Past rides
        │   ├── ProfilePage.js        # Profile + wallet
        │   ├── DriverDashboard.js    # Driver app
        │   └── AdminDashboard.js     # Admin panel
        ├── components/
        │   └── Navbar.js             # Bottom navigation
        ├── styles/
        │   └── global.css            # Design system
        └── App.js                    # Role-based routing
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free at [mongodb.com/atlas](https://mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/bhavybhatia016/Ucab.git
cd Ucab
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ucab?appName=Cluster0
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Seed Mock Data

```bash
node seedData.js
```

### 4. Start Backend

```bash
npm run dev
```

You should see:
```
🚖 UCab Server running on port 5001
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### 5. Setup & Start Frontend

```bash
cd ../frontend
npm install
npm start
```

Open **http://localhost:3000**

---

## 👥 Test Accounts

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| 👤 Admin | admin@ucab.com | admin123 | `/admin` |
| 🧑 Rider | arjun@gmail.com | test123 | `/home` |
| 🚗 Driver | rahul.driver@gmail.com | test123 | `/driver` |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (rider/driver) |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/auth/profile` | Get user profile |

### Bookings (Rider)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings/estimate` | Get fare estimates |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/history` | Get ride history |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| PUT | `/api/bookings/:id/rate` | Rate a ride |

### Driver
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/driver/rides/available` | Get available rides |
| GET | `/api/driver/rides/active` | Get active ride |
| POST | `/api/driver/rides/:id/accept` | Accept a ride |
| POST | `/api/driver/rides/:id/reject` | Reject a ride |
| PUT | `/api/driver/rides/:id/start` | Start ride |
| PUT | `/api/driver/rides/:id/complete` | Complete ride |
| GET | `/api/driver/rides/history` | Driver ride history |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id/toggle` | Block/unblock user |
| PUT | `/api/admin/users/:id/approve` | Approve driver |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/bookings` | All bookings |

---

## 🎮 Promo Codes

| Code | Discount |
|------|----------|
| `UCAB10` | 10% off |
| `FIRST50` | 50% off first ride |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
