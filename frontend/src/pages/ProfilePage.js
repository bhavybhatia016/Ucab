import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './profile.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAddWallet, setShowAddWallet] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: '💳', label: 'Payment Methods', action: () => {} },
    { icon: '📍', label: 'Saved Addresses', action: () => {} },
    { icon: '🎁', label: 'Referral Program', action: () => {} },
    { icon: '🌱', label: 'My Donations', action: () => {} },
    { icon: '🔔', label: 'Notifications', action: () => {} },
    { icon: '🛡️', label: 'Privacy & Safety', action: () => {} },
    { icon: '❓', label: 'Help & Support', action: () => {} },
    { icon: '⭐', label: 'Rate the App', action: () => {} }
  ];

  return (
    <div className="app-container">
      <div className="profile-page">

        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          {user?.phone && <p className="profile-phone">📱 {user.phone}</p>}
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-box">
            <span className="stat-val">{user?.totalRides || 0}</span>
            <span className="stat-label">Rides</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-box">
            <span className="stat-val">₹{user?.wallet || 0}</span>
            <span className="stat-label">Wallet</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-box">
            <span className="stat-val">{user?.referralCode || '—'}</span>
            <span className="stat-label">Referral</span>
          </div>
        </div>

        {/* Add wallet money */}
        <div className="wallet-add-section card">
          <div className="wallet-add-row">
            <div>
              <p className="wallet-add-label">UCab Wallet</p>
              <p className="wallet-add-amount">₹{user?.wallet || 0}</p>
            </div>
            <button className="btn-outline" onClick={() => setShowAddWallet(!showAddWallet)}>
              + Add Money
            </button>
          </div>
          {showAddWallet && (
            <div className="wallet-amounts">
              {[100, 200, 500, 1000].map(amt => (
                <button key={amt} className="amount-chip">₹{amt}</button>
              ))}
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="menu-list">
          {menuItems.map(item => (
            <button key={item.label} className="menu-item" onClick={item.action}>
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow">→</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Sign Out
        </button>

        <div className="app-version">UCab v1.0.0</div>
        <div style={{ height: 90 }} />
      </div>
      <Navbar active="profile" />
    </div>
  );
}