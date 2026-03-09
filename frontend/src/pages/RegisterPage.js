import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'rider' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await register(form.name, form.email, form.password, form.phone, form.role);
      if (user.role === 'driver') navigate('/driver');
      else navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card">
        <div className="auth-logo">🚖 UCab</div>
        <h2>Create Account</h2>
        <p className="auth-sub">Join thousands of riders today</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Full Name</label>
            <input type="text" placeholder="Your name" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="auth-field">
            <label>Phone</label>
            <input type="tel" placeholder="9876543210" value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
          </div>
          <div className="auth-field">
            <label>I am a</label>
            <div className="auth-role-toggle">
              <button type="button"
                className={form.role === 'rider' ? 'active' : ''}
                onClick={() => setForm({...form, role: 'rider'})}>
                🧑 Rider
              </button>
              <button type="button"
                className={form.role === 'driver' ? 'active' : ''}
                onClick={() => setForm({...form, role: 'driver'})}>
                🚗 Driver
              </button>
            </div>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}