import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import './bookride.css';

const cabTypes = [
  { type: 'economy', icon: '🚗', label: 'Economy', desc: '4 seats • Affordable' },
  { type: 'comfort', icon: '🚙', label: 'Comfort', desc: '4 seats • Comfortable' },
  { type: 'premium', icon: '🚘', label: 'Premium', desc: '4 seats • Luxury' },
  { type: 'xl', icon: '🚐', label: 'XL', desc: '6 seats • Spacious' }
];

const paymentMethods = [
  { id: 'upi', icon: '📱', label: 'UPI' },
  { id: 'card', icon: '💳', label: 'Card' },
  { id: 'wallet', icon: '👛', label: 'Wallet' },
  { id: 'cash', icon: '💵', label: 'Cash' }
];

const refreshmentItems = [
  { item: 'Water Bottle', price: 20, icon: '💧' },
  { item: 'Snack Bar', price: 35, icon: '🍫' },
  { item: 'Coffee', price: 50, icon: '☕' }
];

export default function BookRidePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getEstimate, createBooking, estimates } = useBooking();

  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState(location.state?.pickup || '');
  const [drop, setDrop] = useState(location.state?.drop || '');
  const [selectedCab, setSelectedCab] = useState('economy');
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [donation, setDonation] = useState(0);
  const [refreshments, setRefreshments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentEstimate = estimates.find(e => e.type === selectedCab);
  const refreshmentTotal = refreshments.reduce((a, r) => a + r.price, 0);

  const applyPromo = () => {
    if (['UCAB10', 'FIRST50'].includes(promoCode.toUpperCase())) {
      setPromoApplied(true);
      setPromoCode(promoCode.toUpperCase());
    } else {
      alert('Invalid promo code. Try UCAB10 or FIRST50');
    }
  };

  const toggleRefreshment = (r) => {
    const exists = refreshments.find(x => x.item === r.item);
    if (exists) setRefreshments(refreshments.filter(x => x.item !== r.item));
    else setRefreshments([...refreshments, { ...r, qty: 1 }]);
  };

  const handleGetEstimate = async () => {
    if (!pickup || !drop) { setError('Please enter both pickup and drop locations'); return; }
    setError('');
    setLoading(true);
    try {
      await getEstimate(pickup, drop);
      setStep(2);
    } catch (e) {
      setError('Failed to get estimate. Make sure backend is running.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    setLoading(true);
    setError('');
    try {
      const booking = await createBooking({
        pickup: { address: pickup, lat: 28.6139, lng: 77.2090 },
        dropoff: { address: drop, lat: 28.7041, lng: 77.1025 },
        cabType: selectedCab,
        paymentMethod: selectedPayment,
        promoCode: promoApplied ? promoCode : '',
        donation,
        refreshments
      });
      navigate(`/track/${booking._id}`);
    } catch (e) {
      setError('Booking failed. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="book-page">

        
        <div className="book-header">
          <button className="back-btn" onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}>←</button>
          <h2>{step === 1 ? 'Where to?' : step === 2 ? 'Choose Ride' : 'Payment'}</h2>
          <div className="step-indicator">
            {[1,2,3].map(s => <span key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />)}
          </div>
        </div>

        {error && <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', color: '#ff4d6d', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

       
        {step === 1 && (
          <div className="fade-up">
            <div className="map-placeholder" style={{ margin: '0 0 20px' }}>
              <div className="map-grid" />
              <div className="map-pin pin-pickup" />
              <div className="map-pin pin-dropoff" />
              <div className="map-cab-icon pulse">🚖</div>
            </div>

            <div className="location-card card">
              <div className="loc-row">
                <div className="loc-line">
                  <span className="loc-dot green" />
                  <div className="loc-line-inner" />
                  <span className="loc-dot red" />
                </div>
                <div className="loc-inputs">
                  <input className="loc-input" placeholder="Pickup location" value={pickup} onChange={e => setPickup(e.target.value)} />
                  <div className="divider" style={{ margin: '8px 0' }} />
                  <input className="loc-input" placeholder="Drop location" value={drop} onChange={e => setDrop(e.target.value)} />
                </div>
              </div>
            </div>

            <button className="btn-primary" style={{ marginTop: 16 }} onClick={handleGetEstimate} disabled={loading || !pickup || !drop}>
              {loading ? 'Getting estimates...' : 'Get Estimates →'}
            </button>
          </div>
        )}

        
        {step === 2 && (
          <div className="fade-up">
            <div className="route-summary card" style={{ marginBottom: 16 }}>
              <div className="route-loc">📍 {pickup}</div>
              <div className="route-arrow">↓</div>
              <div className="route-loc">🏁 {drop}</div>
            </div>

            <div className="cab-list">
              {cabTypes.map(cab => {
                const est = estimates.find(e => e.type === cab.type);
                return (
                  <div key={cab.type} className={`cab-card ${selectedCab === cab.type ? 'selected' : ''}`} onClick={() => setSelectedCab(cab.type)}>
                    <span className="cab-icon">{cab.icon}</span>
                    <div className="cab-info">
                      <div className="cab-name">{cab.label}</div>
                      <div className="cab-desc">{cab.desc}</div>
                      {est && <div className="cab-eta">🕐 {est.eta} min away</div>}
                    </div>
                    <div className="cab-fare">{est ? `₹${est.fare}` : '...'}</div>
                    {selectedCab === cab.type && <span className="cab-check">✓</span>}
                  </div>
                );
              })}
            </div>

            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setStep(3)}>
              Continue →
            </button>
          </div>
        )}

      
        {step === 3 && (
          <div className="fade-up">
            <div className="fare-summary card">
              <h3>Fare Summary</h3>
              <div className="fare-row"><span>Base fare</span><span>₹{currentEstimate?.fare || 0}</span></div>
              {promoApplied && (
                <div className="fare-row success">
                  <span>Promo ({promoCode})</span>
                  <span>-₹{promoCode === 'FIRST50' ? Math.round((currentEstimate?.fare||0)*0.5) : Math.round((currentEstimate?.fare||0)*0.1)}</span>
                </div>
              )}
              {donation > 0 && <div className="fare-row"><span>Donation 🌱</span><span>+₹{donation}</span></div>}
              {refreshmentTotal > 0 && <div className="fare-row"><span>Refreshments</span><span>+₹{refreshmentTotal}</span></div>}
              <div className="divider" />
              <div className="fare-row total"><span>Total</span><span>₹{(currentEstimate?.fare||0) + donation + refreshmentTotal}</span></div>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <p className="sub-heading">Promo Code</p>
              <div className="promo-input-row">
                <input className="input-field" placeholder="UCAB10 or FIRST50" value={promoCode} onChange={e => setPromoCode(e.target.value)} style={{ flex: 1 }} />
                <button className="btn-outline" onClick={applyPromo} style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>
                  {promoApplied ? '✓ Applied' : 'Apply'}
                </button>
              </div>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <p className="sub-heading">Payment Method</p>
              <div className="payment-grid">
                {paymentMethods.map(m => (
                  <button key={m.id} className={`payment-chip ${selectedPayment === m.id ? 'selected' : ''}`} onClick={() => setSelectedPayment(m.id)}>
                    <span>{m.icon}</span><span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <p className="sub-heading">Refreshments 🍃</p>
              <div className="refresh-list">
                {refreshmentItems.map(r => {
                  const added = refreshments.find(x => x.item === r.item);
                  return (
                    <button key={r.item} className={`refresh-item ${added ? 'added' : ''}`} onClick={() => toggleRefreshment(r)}>
                      <span>{r.icon}</span><span>{r.item}</span>
                      <span className="refresh-price">₹{r.price}</span>
                      <span className="refresh-toggle">{added ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <p className="sub-heading">Plant a Tree 🌱</p>
              <p style={{ fontSize: 12, color: 'var(--grey)', marginBottom: 10 }}>Donate per ride to plant trees</p>
              <div className="donation-row">
                {[0,10,20,50].map(d => (
                  <button key={d} className={`donation-chip ${donation === d ? 'selected' : ''}`} onClick={() => setDonation(d)}>
                    {d === 0 ? 'Skip' : `₹${d}`}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary" style={{ marginTop: 16, marginBottom: 20 }} onClick={handleBook} disabled={loading}>
              {loading ? 'Booking...' : `Book ${cabTypes.find(c => c.type === selectedCab)?.label} →`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}