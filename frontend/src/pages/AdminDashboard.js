import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './admin.css';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [userFilter, setUserFilter] = useState('');
  const [msg, setMsg] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/stats');
      setStats(data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const url = userFilter ? `/api/admin/users?role=${userFilter}` : '/api/admin/users';
      const { data } = await axios.get(url);
      setUsers(data);
    } catch (err) { console.error(err); }
  }, [userFilter]);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/bookings');
      setBookings(data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchBookings();
  }, [fetchStats, fetchUsers, fetchBookings]);

  const toggleUser = async (id) => {
    try {
      const { data } = await axios.put(`/api/admin/users/${id}/toggle`);
      showMsg(data.message);
      fetchUsers();
    } catch (err) { showMsg('Failed'); }
  };

  const approveDriver = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/approve`);
      showMsg('✅ Driver approved!');
      fetchUsers();
    } catch (err) { showMsg('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      showMsg('🗑 User deleted');
      fetchUsers();
    } catch (err) { showMsg('Failed'); }
  };

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const statusColor = (s) => ({
    completed: '#34d988', cancelled: '#ff4d6d',
    searching: '#f5c842', accepted: '#5b8dee', started: '#a78bfa'
  }[s] || '#666');

  return (
    <div className="admin-app">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">🚖<span>UCab</span></div>
        <div className="admin-nav">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'riders', icon: '🧑', label: 'Riders' },
            { id: 'drivers', icon: '🚗', label: 'Drivers' },
            { id: 'bookings', icon: '📋', label: 'Bookings' },
          ].map(item => (
            <button key={item.id}
              className={`admin-nav-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <button className="admin-logout" onClick={logout}>🚪 Logout</button>
      </div>

      {/* Main */}
      <div className="admin-main">
        {msg && <div className="admin-toast">{msg}</div>}

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <div className="admin-page-header">
              <h1>Dashboard Overview</h1>
              <span className="admin-date">{new Date().toDateString()}</span>
            </div>
            <div className="admin-stat-grid">
              {[
                { label: 'Total Riders', value: stats?.totalRiders || 0, icon: '🧑', color: '#5b8dee' },
                { label: 'Total Drivers', value: stats?.totalDrivers || 0, icon: '🚗', color: '#f5c842' },
                { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: '📋', color: '#a78bfa' },
                { label: 'Active Now', value: stats?.activeBookings || 0, icon: '🔥', color: '#ff4d6d' },
                { label: 'Completed', value: stats?.completedBookings || 0, icon: '✅', color: '#34d988' },
                { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toFixed(0)}`, icon: '💰', color: '#34d988' },
              ].map(s => (
                <div key={s.label} className="admin-stat-card" style={{'--ac': s.color}}>
                  <div className="asc-icon">{s.icon}</div>
                  <div className="asc-value">{s.value}</div>
                  <div className="asc-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Live Bookings */}
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>🔴 Live Bookings</h2>
                <button className="admin-refresh-btn" onClick={fetchBookings}>Refresh</button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Rider</th><th>Pickup</th><th>Drop</th>
                      <th>Cab</th><th>Fare</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.filter(b => ['searching','accepted','started'].includes(b.status))
                      .slice(0, 10).map(b => (
                      <tr key={b._id}>
                        <td>{b.rider?.name || 'N/A'}</td>
                        <td>{b.pickup?.address?.substring(0,20)}...</td>
                        <td>{b.dropoff?.address?.substring(0,20)}...</td>
                        <td>{b.cabType}</td>
                        <td>₹{b.fare?.total}</td>
                        <td>
                          <span className="admin-badge" style={{background: `${statusColor(b.status)}22`, color: statusColor(b.status)}}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {bookings.filter(b => ['searching','accepted','started'].includes(b.status)).length === 0 && (
                      <tr><td colSpan="6" style={{textAlign:'center',color:'#444',padding:'30px'}}>No active bookings</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Riders */}
        {tab === 'riders' && (
          <div>
            <div className="admin-page-header">
              <h1>Manage Riders</h1>
              <span className="admin-count">{users.filter(u=>u.role==='rider').length} riders</span>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Phone</th><th>Wallet</th><th>Rides</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === 'rider').map(u => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td>₹{u.wallet}</td>
                      <td>{u.totalRides}</td>
                      <td>
                        <span className="admin-badge" style={{background: u.isActive ? '#34d98822':'#ff4d6d22', color: u.isActive ? '#34d988':'#ff4d6d'}}>
                          {u.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button className={`admin-action-btn ${u.isActive ? 'block' : 'unblock'}`}
                            onClick={() => toggleUser(u._id)}>
                            {u.isActive ? 'Block' : 'Unblock'}
                          </button>
                          <button className="admin-action-btn delete" onClick={() => deleteUser(u._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Drivers */}
        {tab === 'drivers' && (
          <div>
            <div className="admin-page-header">
              <h1>Manage Drivers</h1>
              <span className="admin-count">{users.filter(u=>u.role==='driver').length} drivers</span>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Phone</th><th>Rating</th><th>Earnings</th><th>Approved</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === 'driver').map(u => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td>⭐ {u.rating}</td>
                      <td>₹{u.totalEarnings}</td>
                      <td>
                        <span className="admin-badge" style={{background: u.isApproved ? '#34d98822':'#f5c84222', color: u.isApproved ? '#34d988':'#f5c842'}}>
                          {u.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          {!u.isApproved && (
                            <button className="admin-action-btn approve" onClick={() => approveDriver(u._id)}>Approve</button>
                          )}
                          <button className={`admin-action-btn ${u.isActive ? 'block':'unblock'}`} onClick={() => toggleUser(u._id)}>
                            {u.isActive ? 'Block' : 'Unblock'}
                          </button>
                          <button className="admin-action-btn delete" onClick={() => deleteUser(u._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings */}
        {tab === 'bookings' && (
          <div>
            <div className="admin-page-header">
              <h1>All Bookings</h1>
              <button className="admin-refresh-btn" onClick={fetchBookings}>🔄 Refresh</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Rider</th><th>Driver</th><th>Pickup</th><th>Drop</th><th>Cab</th><th>Fare</th><th>Payment</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td>{b.rider?.name || '—'}</td>
                      <td>{b.driver?.name || '—'}</td>
                      <td>{b.pickup?.address?.substring(0,18)}...</td>
                      <td>{b.dropoff?.address?.substring(0,18)}...</td>
                      <td>{b.cabType}</td>
                      <td>₹{b.fare?.total}</td>
                      <td>{b.paymentMethod}</td>
                      <td>
                        <span className="admin-badge" style={{background:`${statusColor(b.status)}22`, color: statusColor(b.status)}}>
                          {b.status}
                        </span>
                      </td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}