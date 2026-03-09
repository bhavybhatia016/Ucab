import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/Navbar';
import './history.css';

const statusColor = { completed: 'success', confirmed: 'warning', cancelled: 'danger', onride: 'info', searching: 'warning' };

export default function HistoryPage() {
  const { bookingHistory, fetchHistory } = useBooking();
  const navigate = useNavigate();

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="app-container">
      <div className="history-page">
        <div className="page-header">
          <h1>My Rides</h1>
          <span className="total-count">{bookingHistory.length} rides</span>
        </div>

        {bookingHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚖</div>
            <h3>No rides yet</h3>
            <p>Book your first ride and it will appear here</p>
            <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/book')}>
              Book a Ride
            </button>
          </div>
        ) : (
          <div className="ride-list">
            {bookingHistory.map(b => (
              <div key={b._id} className="ride-card card fade-up">
                <div className="ride-top">
                  <div className="cab-type-badge">
                    {b.cabType === 'economy' ? '🚗' : b.cabType === 'comfort' ? '🚙' : b.cabType === 'premium' ? '🚘' : '🚐'}
                    <span>{b.cabType}</span>
                  </div>
                  <span className={`badge badge-${statusColor[b.status] || 'warning'}`}>{b.status}</span>
                  <span className="ride-fare">₹{b.fare?.total}</span>
                </div>

                <div className="divider" />

                <div className="ride-locations">
                  <div className="loc-item">
                    <span className="loc-dot-sm green" />
                    <span>{b.pickup?.address}</span>
                  </div>
                  <div className="loc-item">
                    <span className="loc-dot-sm red" />
                    <span>{b.dropoff?.address}</span>
                  </div>
                </div>

                <div className="ride-footer">
                  <span className="ride-date">{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="ride-driver">👨‍✈️ {b.driver?.name || 'Driver'}</span>
                  {b.rating && <span className="ride-rating">{'⭐'.repeat(b.rating)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 90 }} />
      </div>
      <Navbar active="history" />
    </div>
  );
}