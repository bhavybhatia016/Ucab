import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const BookingContext = createContext();
export const useBooking = () => useContext(BookingContext);

const getConfig = () => {
  const user = JSON.parse(localStorage.getItem('ucab_user') || '{}');
  return {
    headers: { Authorization: `Bearer ${user.token}` }
  };
};

export const BookingProvider = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);

  const getEstimate = async (pickup, dropoff) => {
    const { data } = await axios.post('/api/bookings/estimate', { pickup, dropoff }, getConfig());
    setEstimates(data.estimates);
    return data;
  };

  const createBooking = async (bookingData) => {
    const { data } = await axios.post('/api/bookings', bookingData, getConfig());
    setCurrentBooking(data);
    return data;
  };

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('/api/bookings/history', getConfig());
      setBookingHistory(data);
      return data;
    } catch (e) {
      console.warn('Could not fetch history:', e.message);
      return [];
    }
  };

  const cancelBooking = async (id) => {
    const { data } = await axios.put(`/api/bookings/${id}/cancel`, {}, getConfig());
    setCurrentBooking(data);
    return data;
  };

  const rateBooking = async (id, rating, review) => {
    const { data } = await axios.put(`/api/bookings/${id}/rate`, { rating, review }, getConfig());
    return data;
  };

  return (
    <BookingContext.Provider value={{
      currentBooking, setCurrentBooking,
      estimates, getEstimate,
      bookingHistory, fetchHistory,
      createBooking, cancelBooking, rateBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};