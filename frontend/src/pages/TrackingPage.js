import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './tracking.css';

const statusSteps = [
  { key: 'confirmed', label: 'Booking Confirmed', icon: '✓' },
  { key: 'arriving', label: 'Driver Arriving', icon: '🚖' },
  { key: 'onride', label: 'On the Way', icon: '🛣️' },
  { key: 'completed', label: 'Arrived', icon: '🏁' }
];

export default function TrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [driverPos, setDriverPos] = useState({ x: 20, y: 60 });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(`/api/bookings/${id}`);
        setBooking(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchBooking();
  }, [id]);

  // Simulate ride progression
  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStep(1), 3000),
      setTimeout(() => setCurrentStep(2), 10000),
      setTimeout(() => setCurrentStep(3), 20000),
      setTimeout(() => setShowRating(true), 22000)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Animate driver marker
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPos(p => ({
        x: Math.max(10, Math.min(80, p.x + (Math.random() - 0.4) * 5)),
        y: Math.max(20, Math.min(80, p.y + (Math.random() - 0.4) * 5))
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRate = async (stars) => {
    setRating(stars);
    try {
      await axios.put(`/api/bookings/${id}/rate`, { rating: stars, review: '' });
    } catch (e) {}
    setTimeout(() => navigate('/'), 1500);
  };

  if (!booking) return (
    <div className="app-container">
      <div className="tracking-loading">
        <div className="loader" />
        <p>Loading your ride...</p>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="tracking-page">

        {/* Live Map */}
        <div className="live-map">
          <div className="map-grid" />
          <div className="map-pin pin-pickup" style={{ bottom: '30%', left: '30%', position: 'absolute' }} />
          <div className="map-pin pin-dropoff" style={{ top: '30%', right: '30%', position: 'absolute' }} />
          <div
            className="driver-marker"
            style={{ left: `${driverPos.x}%`, top: `${driverPos.y}%` }}
          >
            🚖
          </div>
          <div className="live-badge">● LIVE</div>
        </div>

        {/* Driver card */}
        <div className="driver-card card">
          <div className="driver-info">
            <div className="driver-avatar">
              <span>{booking.driver?.avatar || '👨‍✈️'}</span>
            </div>
            <div className="driver-details">
              <h3>{booking.driver?.name || 'Your Driver'}</h3>
              <p className="driver-vehicle">{booking.driver?.vehicle} • {booking.driver?.plateNumber}</p>
              <div className="driver-rating">
                {'⭐'.repeat(Math.round(booking.driver?.rating || 4.8))}
                <span>{booking.driver?.rating || '4.8'}</span>
              </div>
            </div>
            <a href={`tel:${booking.driver?.phone}`} className="call-btn">📞</a>
          </div>
        </div>

        {/* Status steps */}
        <div className="card" style={{ margin: '12px 16px' }}>
          <div className="status-timeline">
            {statusSteps.map((step, i) => (
              <div key={step.key} className={`timeline-step ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'current' : ''}`}>
                <div className="step-circle">{i <= currentStep ? step.icon : ''}</div>
                {i < statusSteps.length - 1 && <div className="step-connector" />}
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking info */}
        <div className="card booking-info">
          <div className="info-row">
            <span className="info-label">From</span>
            <span className="info-val">{booking.pickup?.address}</span>
          </div>
          <div className="info-row">
            <span className="info-label">To</span>
            <span className="info-val">{booking.dropoff?.address}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Fare</span>
            <span className="info-val accent">₹{booking.fare?.total}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Payment</span>
            <span className="info-val">{booking.paymentMethod}</span>
          </div>
        </div>

        {/* Cancel button */}
        {currentStep < 2 && (
          <button className="btn-outline" style={{ margin: '12px 16px', width: 'calc(100% - 32px)' }}
            onClick={async () => {
              await axios.put(`/api/bookings/${id}/cancel`);
              navigate('/');
            }}>
            Cancel Ride
          </button>
        )}

        {/* Rating modal */}
        {showRating && (
          <div className="rating-overlay">
            <div className="rating-modal card fade-up">
              <div className="rating-emoji">🎉</div>
              <h2>You've arrived!</h2>
              <p>How was your ride with {booking.driver?.name}?</p>
              <div className="stars" style={{ justifyContent: 'center', fontSize: 36, gap: 8, margin: '16px 0' }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="star" onClick={() => handleRate(s)}
                    style={{ color: s <= rating ? 'var(--accent)' : 'var(--card-border)', cursor: 'pointer' }}>
                    ★
                  </span>
                ))}
              </div>
              {rating > 0 && <p style={{ color: 'var(--success)', textAlign: 'center' }}>Thanks for rating!</p>}
              <button className="btn-ghost" onClick={() => navigate('/')}>Skip →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}