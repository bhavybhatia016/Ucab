import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import BookRidePage from './pages/BookRidePage';
import TrackingPage from './pages/TrackingPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './styles/global.css';

const Splash = () => (
  <div style={{minHeight:'100vh',background:'#07070a',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{fontSize:48}}>🚖</div>
  </div>
);

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'driver') return <Navigate to="/driver" replace />;
    return <Navigate to="/home" replace />;
  }
  return children;
};

const SmartLanding = () => {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'driver') return <Navigate to="/driver" replace />;
  if (user?.role === 'rider') return <Navigate to="/home" replace />;
  return <LandingPage />;
};

const SmartLogin = () => {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'driver') return <Navigate to="/driver" replace />;
  if (user?.role === 'rider') return <Navigate to="/home" replace />;
  return <LoginPage />;
};

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SmartLanding />} />
            <Route path="/login" element={<SmartLogin />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<ProtectedRoute role="rider"><HomePage /></ProtectedRoute>} />
            <Route path="/book" element={<ProtectedRoute role="rider"><BookRidePage /></ProtectedRoute>} />
            <Route path="/track/:id" element={<ProtectedRoute role="rider"><TrackingPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute role="rider"><HistoryPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute role="rider"><ProfilePage /></ProtectedRoute>} />
            <Route path="/driver" element={<ProtectedRoute role="driver"><DriverDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
