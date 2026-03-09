import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './driver.css';

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('rides');
  const [availableRides, setAvailableRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [history, setHistory] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [ridesRes, activeRes, histRes] = await Promise.all([
        axios.get('/api/driver/rides/available'),
        axios.get('/api/driver/rides/active'),
        axios.get('/api/driver/rides/history'),
      ]);
      setAvailableRides(ridesRes.data);
      setActiveRide(activeRes.data);
      setHistory(histRes.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleAvailability = async () => {
    try {
      const { data } = await axios.put('/api/driver/availability');
      setIsAvailable(data.isAvailable);
      showMsg(data.isAvailable ? '✅ You are now online' : '🔴 You are now offline');
    } catch (err) { showMsg('Failed to update status'); }
  };

  const acceptRide = async (id) => {
    try {
      setLoading(true);
      await axios.post(`/api/driver/rides/${id}/accept`);
      showMsg('✅ Ride accepted!');
      fetchData();
    } catch (err) { showMsg(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const rejectRide = async (id) => {
    try {
      await axios.post(`/api/driver/rides/${id}/reject`);
      fetchData();
    } catch (err) { showMsg('Failed to reject'); }
  };

  const startRide = async (id) => {
    try {
      await axios.put(`/api/driver/rides/${id}/start`);
      showMsg('🚗 Ride started!');
      fetchData();
    } catch (err) { showMsg('Failed'); }
  };

  const completeRide = async (id) => {
    try {
      await axios.put(`/api/driver/rides/${id}/complete`);
      showMsg('🎉 Ride completed!');
      fetchData();
    } catch (err) { showMsg('Failed'); }
  };

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const totalEarnings = history.filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + (r.fare?.total || 0), 0);

  return (
    <div className="driver-app">
      {/* Header */}
      <div className="driver-header">
        <div className="driver-header-left">
          <span className="driver-logo">🚖</span>
          <div>
            <div className="driver-name">{user?.name}</div>
            <div className="driver-role">Driver</div>
          </div>
        </div>
        <div className="driver-header-right">
          <button className={`driver-avail-btn ${isAvailable ? 'online' : 'offline'}`}
            onClick={toggleAvailability}>
            {isAvailable ? '🟢 Online' : '🔴 Offline'}
          </button>
          <button className="driver-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      {msg && <div className="driver-toast">{msg}</div>}

      {/* Stats */}
      <div className="driver-stats">
        <div className="driver-stat">
          <span className="ds-num">₹{totalEarnings.toFixed(0)}</span>
          <span className="ds-label">Total Earned</span>
        </div>
        <div className="driver-stat">
          <span className="ds-num">{history.filter(r => r.status === 'completed').length}</span>
          <span className="ds-label">Completed</span>
        </div>
        <div className="driver-stat">
          <span className="ds-num">{user?.rating || '5.0'} ⭐</span>
          <span className="ds-label">Rating</span>
        </div>
      </div>

      {/* Active Ride Banner */}
      {activeRide && (
        <div className="driver-active-ride">
          <div className="dar-header">
            <span>🔥 Active Ride</span>
            <span className={`dar-status ${activeRide.status}`}>{activeRide.status.toUpperCase()}</span>
          </div>
          <div className="dar-locations">
            <div className="dar-loc"><span className="dar-dot green"/>Pickup: {activeRide.pickup?.address}</div>
            <div className="dar-loc"><span className="dar-dot red"/>Drop: {activeRide.dropoff?.address}</div>
          </div>
          <div className="dar-fare">₹{activeRide.fare?.total} · {activeRide.paymentMethod}</div>
          <div className="dar-actions">
            {activeRide.status === 'accepted' && (
              <button className="dar-btn start" onClick={() => startRide(activeRide._id)}>
                🚗 Start Ride
              </button>
            )}
            {activeRide.status === 'started' && (
              <button className="dar-btn complete" onClick={() => completeRide(activeRide._id)}>
                ✅ Complete Ride
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="driver-tabs">
        {['rides', 'history'].map(t => (
          <button key={t} className={`driver-tab ${tab === t ? 'active' : ''}`}
            onClick={() => { setTab(t); fetchData(); }}>
            {t === 'rides' ? '🔔 Available Rides' : '📋 My History'}
          </button>
        ))}
      </div>

      {/* Available Rides */}
      {tab === 'rides' && (
        <div className="driver-content">
          <div className="driver-refresh">
            <button onClick={fetchData} className="driver-refresh-btn">🔄 Refresh</button>
            <span>{availableRides.length} ride{availableRides.length !== 1 ? 's' : ''} available</span>
          </div>
          {availableRides.length === 0 ? (
            <div className="driver-empty">
              <div className="de-icon">🚗</div>
              <p>No rides available right now</p>
              <span>Click refresh to check again</span>
            </div>
          ) : (
            availableRides.map(ride => (
              <div key={ride._id} className="driver-ride-card">
                <div className="drc-top">
                  <span className="drc-type">{ride.cabType?.toUpperCase()}</span>
                  <span className="drc-fare">₹{ride.fare?.total}</span>
                </div>
                <div className="drc-locations">
                  <div className="drc-loc"><span className="drc-dot green"/>📍 {ride.pickup?.address}</div>
                  <div className="drc-divider"/>
                  <div className="drc-loc"><span className="drc-dot red"/>📍 {ride.dropoff?.address}</div>
                </div>
                <div className="drc-info">
                  <span>📏 {ride.distance?.toFixed(1)} km</span>
                  <span>💳 {ride.paymentMethod}</span>
                  <span>⏱ {ride.duration} min</span>
                </div>
                <div className="drc-actions">
                  <button className="drc-btn reject" onClick={() => rejectRide(ride._id)} disabled={loading}>
                    ✗ Reject
                  </button>
                  <button className="drc-btn accept" onClick={() => acceptRide(ride._id)} disabled={loading}>
                    ✓ Accept
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div className="driver-content">
          {history.length === 0 ? (
            <div className="driver-empty">
              <div className="de-icon">📋</div>
              <p>No rides yet</p>
            </div>
          ) : (
            history.map(ride => (
              <div key={ride._id} className="driver-history-card">
                <div className="dhc-top">
                  <span>{ride.pickup?.address?.substring(0, 25)}... → {ride.dropoff?.address?.substring(0, 20)}...</span>
                  <span className={`dhc-status ${ride.status}`}>{ride.status}</span>
                </div>
                <div className="dhc-bottom">
                  <span>₹{ride.fare?.total}</span>
                  <span>{new Date(ride.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}