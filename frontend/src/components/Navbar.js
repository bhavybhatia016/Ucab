import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const navItems = [
  {
    key: 'home', path: '/', label: 'Home',
    icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  },
  {
    key: 'book', path: '/book', label: 'Book',
    icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
  },
  {
    key: 'history', path: '/history', label: 'Trips',
    icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  },
  {
    key: 'profile', path: '/profile', label: 'Profile',
    icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  }
];

export default function Navbar({ active }) {
  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <Link key={item.key} to={item.path} className={`nav-item ${active === item.key ? 'active' : ''}`}>
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}