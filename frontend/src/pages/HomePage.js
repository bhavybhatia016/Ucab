import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/Navbar';
import './home.css';

const quickDestinations = [
  { icon: '🛩️', label: 'Airport', address: 'Indira Gandhi International Airport' },
  { icon: '🏨', label: 'Office', address: 'Connaught Place, New Delhi' },
  { icon: '🏥', label: 'Hospital', address: 'AIIMS Hospital, New Delhi' },
  { icon: '🏙️', label: 'Mall', address: 'DLF Mall of India, Noida' }
];

const promos = [
  { code: 'UCAB10', label: '10% OFF', desc: 'First 3 rides', color: '#f5c842' },
  { code: 'FIRST50', label: '50% OFF', desc: 'First ride only', color: '#34d988' }
];

export default function HomePage() {
  const { user } = useAuth();
  const { fetchHistory, bookingHistory } = useBooking();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => { fetchHistory(); }, []);

  const handleBook = () => {
    if (pickup && drop) {
      navigate('/book', { state: { pickup, drop } });
    } else {
      navigate('/book');
    }
  };

  const recentRide = bookingHistory[0];

  return (
    <div className="app-container">
      <div className="home-page">

        {/* Header */}
        <div className="home-header">
          <div className="header-left">
            <p className="greeting">{greeting},</p>
            <h1 className="user-name">{user?.name?.split(' ')[0]} 👋</h1>
          </div>
          <Link to="/profile" className="header-avatar">
            <span>{user?.name?.[0]?.toUpperCase()}</span>
          </Link>
        </div>

        {/* Wallet strip */}
        <div className="wallet-strip fade-up">
          <div className="wallet-info">
            <span className="wallet-label">UCab Wallet</span>
            <span className="wallet-amount">₹{user?.wallet || 0}</span>
          </div>
          <div className="wallet-rides">
            <span className="rides-count">{user?.totalRides || 0}</span>
            <span className="rides-label">Rides</span>
          </div>
        </div>

        {/* Search Box */}
        <div className="search-box card fade-up">
          <div className="location-input-wrap">
            <span className="dot dot-green" />
            <input
              className="location-input"
              placeholder="Current location or pickup..."
              value={pickup}
              onChange={e => setPickup(e.target.value)}
            />
          </div>
          <div className="divider" style={{ margin: '8px 0' }} />
          <div className="location-input-wrap">
            <span className="dot dot-red" />
            <input
              className="location-input"
              placeholder="Where are you going?"
              value={drop}
              onChange={e => setDrop(e.target.value)}
            />
          </div>
          <button className="btn-primary" style={{ marginTop: 14 }} onClick={handleBook}>
            Find a Ride →
          </button>
        </div>

        {/* Quick destinations */}
        <div className="section fade-up">
          <h3 className="section-title">Quick Destinations</h3>
          <div className="quick-grid">
            {quickDestinations.map(d => (
              <button
                key={d.label}
                className="quick-chip"
                onClick={() => { setDrop(d.address); }}
              >
                <span className="chip-icon">{d.icon}</span>
                <span>{d.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Promos */}
        <div className="section fade-up">
          <h3 className="section-title">Offers for you</h3>
          <div className="promo-scroll">
            {promos.map(p => (
              <div key={p.code} className="promo-card" style={{ '--promo-color': p.color }}>
                <div className="promo-badge">{p.label}</div>
                <p className="promo-desc">{p.desc}</p>
                <div className="promo-code">{p.code}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent ride */}
        {recentRide && (
          <div className="section fade-up">
            <h3 className="section-title">Recent Ride</h3>
            <div className="card recent-ride" onClick={() => navigate('/history')}>
              <div className="ride-row">
                <div className="ride-icon">🚖</div>
                <div className="ride-info">
                  <p className="ride-dest">{recentRide.dropoff?.address}</p>
                  <p className="ride-meta">
                    {new Date(recentRide.createdAt).toLocaleDateString()} •
                    <span className={`badge badge-${recentRide.status === 'completed' ? 'success' : 'warning'}`} style={{ marginLeft: 6 }}>
                      {recentRide.status}
                    </span>
                  </p>
                </div>
                <div className="ride-fare">₹{recentRide.fare?.total}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 100 }} />
      </div>

      <Navbar active="home" />
    </div>
  );
}