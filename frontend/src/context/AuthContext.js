import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

axios.defaults.baseURL = 'http://localhost:5001';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ucab_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u && u.token && u.role) {
          setUser(u);
          axios.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
        } else {
          localStorage.removeItem('ucab_user');
        }
      } catch(e) { localStorage.removeItem('ucab_user'); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('ucab_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const register = async (name, email, password, phone, role = 'rider') => {
    const { data } = await axios.post('/api/auth/register', { name, email, password, phone, role });
    setUser(data);
    localStorage.setItem('ucab_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ucab_user');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
