# 🚖 UCab — Your Ride, Your Way

> A full-stack cab booking web application built with the MERN stack (MongoDB, Express.js, React, Node.js)

## 📱 What is UCab?

UCab is a simple and easy-to-use cab booking webapp that helps people book rides quickly and comfortably. 
Users can log in, choose their pickup and drop-off locations, select the type of cab they want, track their driver in real-time, and pay automatically.

---

## ✨ Features

- 🔐 **User Authentication** — Register & Login with JWT
- 🗺️ **Live Tracking** — Real-time driver location via Socket.IO
- 🚗 **4 Cab Types** — Economy, Comfort, Premium, XL
- 💰 **Fare Estimation** — Instant fare & ETA before booking
- 🏷️ **Promo Codes** — UCAB10 (10% off), FIRST50 (50% off first ride)
- 💳 **Multiple Payments** — UPI, Card, Wallet, Cash
- ☕ **In-Ride Refreshments** — Water, Snacks, Coffee
- 🌱 **Donate & Plant Trees** — ₹10–₹50 donation per ride
- 📋 **Booking History** — View all past rides
- 👛 **UCab Wallet** — Add money & pay with wallet
- ⭐ **Rate Your Driver** — 1–5 star rating after ride
- 🎁 **Referral Codes** — Unique code for every user

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
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
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Profile
│   │   ├── bookingController.js  # Bookings & estimates
│   │   ├── cabController.js      # Nearby cabs
│   │   ├── paymentController.js  # Payments & wallet
│   │   └── userController.js     # User management
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Booking.js            # Booking schema
│   │   └── Cab.js                # Cab schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── cabRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── userRoutes.js
│   ├── server.js                 # Entry point + Socket.IO
│   └── .env                      # Environment variables
│
└── frontend/
    └── src/
        ├── components/
        │   └── Navbar.js         # Bottom navigation
        ├── context/
        │   ├── AuthContext.js    # Auth global state
        │   └── BookingContext.js # Booking global state
        ├── pages/
        │   ├── LandingPage.js    # Landing page
        │   ├── LoginPage.js      # Sign in
        │   ├── RegisterPage.js   # Sign up
        │   ├── HomePage.js       # Dashboard
        │   ├── BookRidePage.js   # 3-step booking
        │   ├── TrackingPage.js   # Live tracking
        │   ├── HistoryPage.js    # Past rides
        │   └── ProfilePage.js    # User profile
        ├── styles/
        │   └── global.css        # Design system
        └── App.js                # Routes
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ucab.git
cd ucab
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ucab?appName=Cluster0
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

You should see:
```
🚖 UCab Server running on port 5001
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

Open **http://localhost:3000**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get token |
| GET | `/api/auth/profile` | Get user profile |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings/estimate` | Get fare estimates |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/history` | Get booking history |
| GET | `/api/bookings/:id` | Get booking by ID |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| PUT | `/api/bookings/:id/rate` | Rate a ride |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/process` | Process payment |
| POST | `/api/payments/wallet/add` | Add to wallet |

### Cabs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cabs/nearby` | Get nearby cabs |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
