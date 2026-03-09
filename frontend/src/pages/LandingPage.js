import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [cabPos, setCabPos] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
          el.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    // Animate cab
    let frame;
    let pos = 0;
    const animate = () => {
      pos = (pos + 0.4) % 100;
      setCabPos(pos);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="lp">

      {/* NAV */}
      <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="lp-logo">🚖 <span>UCab</span></div>
        <div className="lp-nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#fleet">Fleet</a>
        </div>
        <div className="lp-nav-btns">
          <button onClick={() => navigate('/login')} className="lp-btn-ghost">Sign In</button>
          <button onClick={() => navigate('/register')} className="lp-btn-yellow">Get Started →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-glow g1" />
        <div className="lp-hero-glow g2" />
        <div className="lp-hero-glow g3" />

        {/* Animated road */}
        <div className="lp-road">
          <div className="lp-road-line" />
          <div className="lp-cab-moving" style={{ left: `${cabPos}%` }}>🚖</div>
          <div className="lp-road-line" />
        </div>

        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <div className="lp-pill reveal">⚡ Instant Cab Booking in India</div>
            <h1 className="lp-h1 reveal">
              Your Ride,<br /><em>Your Way.</em>
            </h1>
            <p className="lp-sub reveal">
              Book in 30 seconds. Track live. Pay your way.<br />
              Simple, reliable travel — every single time.
            </p>
            <div className="lp-hero-btns reveal">
              <button className="lp-btn-yellow lp-btn-lg" onClick={() => navigate('/register')}>
                Book Your First Ride →
              </button>
              <button className="lp-btn-outline lp-btn-lg" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
            <div className="lp-promos reveal">
              <span className="lp-promo-tag">🏷 UCAB10 — 10% off</span>
              <span className="lp-promo-tag">🎁 FIRST50 — 50% off first ride</span>
            </div>
          </div>

          <div className="lp-hero-phone reveal">
            <div className="lp-phone">
              <div className="lp-phone-notch" />
              <div className="lp-phone-screen">
                <div className="lp-mock-top">
                  <span className="lp-mock-logo">🚖 UCab</span>
                  <span className="lp-mock-time">9:41</span>
                </div>
                <div className="lp-mock-map">
                  <div className="lp-mock-grid" />
                  <div className="lp-mock-dot green" />
                  <div className="lp-mock-dot red" />
                  <div className="lp-mock-car pulse">🚗</div>
                  <div className="lp-mock-car2 pulse">🚙</div>
                </div>
                <div className="lp-mock-card">
                  <div className="lp-mock-row">
                    <span className="lp-mock-car-icon">🚗</span>
                    <div>
                      <div className="lp-mock-name">Economy · 3 min</div>
                      <div className="lp-mock-plate">DL 01 AB 1234</div>
                    </div>
                    <div className="lp-mock-price">₹180</div>
                  </div>
                  <div className="lp-mock-book">Book Now →</div>
                </div>
                <div className="lp-mock-driver">
                  <span>👨‍✈️</span>
                  <div>
                    <div className="lp-mock-dname">Rahul Kumar</div>
                    <div className="lp-mock-stars">⭐⭐⭐⭐⭐ 4.9</div>
                  </div>
                  <span className="lp-mock-call">📞</span>
                </div>
              </div>
            </div>
            <div className="lp-float-tag ft1">📍 Live Tracking</div>
            <div className="lp-float-tag ft2">✓ Confirmed</div>
            <div className="lp-float-tag ft3">💳 Auto Pay</div>
          </div>
        </div>

        {/* Stats */}
        <div className="lp-stats reveal">
          {[
            { n: '50K+', l: 'Happy Riders' },
            { n: '2 min', l: 'Avg Pickup' },
            { n: '4.9 ★', l: 'App Rating' },
            { n: '24/7', l: 'Available' },
          ].map(s => (
            <div key={s.l} className="lp-stat">
              <span className="lp-stat-n">{s.n}</span>
              <span className="lp-stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-section" id="features">
        <div className="lp-sec-label reveal">WHY UCAB</div>
        <h2 className="lp-h2 reveal">Everything you need.</h2>
        <div className="lp-features reveal">
          {[
            { icon: '⚡', t: 'Instant Booking', d: 'Book any cab in under 30 seconds, anytime.' },
            { icon: '🗺️', t: 'Live Tracking', d: 'Watch your driver move on a live map.' },
            { icon: '💳', t: 'Flexible Payment', d: 'UPI, card, wallet, or good old cash.' },
            { icon: '☕', t: 'In-Ride Extras', d: 'Order water, snacks or coffee mid-ride.' },
            { icon: '🌱', t: 'Plant Trees', d: 'Donate ₹10 per ride to plant real trees.' },
            { icon: '🏷️', t: 'Promo Codes', d: 'Save big on every ride with exclusive deals.' },
          ].map((f, i) => (
            <div key={f.t} className="lp-feat-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="lp-feat-icon">{f.icon}</div>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-how" id="how">
        <div className="lp-how-inner">
          <div className="lp-sec-label reveal">HOW IT WORKS</div>
          <h2 className="lp-h2 reveal">Ride in 3 steps.</h2>
          <div className="lp-steps">
            {[
              { n: '01', t: 'Enter Location', d: 'Type your pickup & destination', icon: '📍' },
              { n: '02', t: 'Pick Your Cab', d: 'Economy, Comfort, Premium or XL', icon: '🚗' },
              { n: '03', t: 'Ride & Track', d: 'Live tracking & auto payment', icon: '🛣️' },
            ].map((s, i) => (
              <div key={s.n} className="lp-step reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="lp-step-num">{s.n}</div>
                <div className="lp-step-icon">{s.icon}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                {i < 2 && <div className="lp-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section className="lp-section" id="fleet">
        <div className="lp-sec-label reveal">OUR FLEET</div>
        <h2 className="lp-h2 reveal">A cab for every mood.</h2>
        <div className="lp-fleet reveal">
          {[
            { icon: '🚗', n: 'Economy', d: 'Budget-friendly rides', p: 'From ₹40', c: '#34d988' },
            { icon: '🚙', n: 'Comfort', d: 'More space & comfort', p: 'From ₹60', c: '#5b8dee' },
            { icon: '🚘', n: 'Premium', d: 'Luxury experience', p: 'From ₹100', c: '#f5c842' },
            { icon: '🚐', n: 'XL', d: 'Groups & families', p: 'From ₹80', c: '#ff4d6d' },
          ].map((c, i) => (
            <div key={c.n} className="lp-fleet-card reveal" style={{ '--cc': c.c, transitionDelay: `${i * 0.1}s` }}>
              <div className="lp-fleet-icon">{c.icon}</div>
              <h3>{c.n}</h3>
              <p>{c.d}</p>
              <div className="lp-fleet-price">{c.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lp-testi">
        <div className="lp-testi-inner">
          <div className="lp-sec-label reveal">WHAT RIDERS SAY</div>
          <h2 className="lp-h2 reveal">Loved by thousands.</h2>
          <div className="lp-testi-grid">
            {[
              { name: 'Sarah J.', role: 'Marketing Manager', text: 'Booked a cab to the airport in seconds. Never missed a flight since!', stars: 5, avatar: '👩' },
              { name: 'Rahul M.', role: 'Software Engineer', text: 'Live tracking is incredible. I always know exactly when my driver will arrive.', stars: 5, avatar: '👨' },
              { name: 'Priya K.', role: 'Teacher', text: 'Love the tree donation feature. A small act with a big impact. Using UCab daily!', stars: 5, avatar: '👩‍🏫' },
            ].map((t, i) => (
              <div key={t.name} className="lp-testi-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="lp-testi-stars">{'⭐'.repeat(t.stars)}</div>
                <p className="lp-testi-text">"{t.text}"</p>
                <div className="lp-testi-author">
                  <span className="lp-testi-avatar">{t.avatar}</span>
                  <div>
                    <div className="lp-testi-name">{t.name}</div>
                    <div className="lp-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta reveal">
        <div className="lp-cta-glow" />
        <div className="lp-cta-inner">
          <h2>Ready to ride?</h2>
          <p>Join 50,000+ riders. Your first ride is waiting.</p>
          <div className="lp-cta-btns">
            <button className="lp-btn-yellow lp-btn-lg" onClick={() => navigate('/register')}>
              Create Free Account →
            </button>
            <button className="lp-btn-outline lp-btn-lg" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
          <div className="lp-cta-tags">
            <span className="lp-promo-tag">🏷 UCAB10 — 10% off first 3 rides</span>
            <span className="lp-promo-tag">🎁 FIRST50 — 50% off your first ride</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">🚖 UCab</div>
        <p>Simple, reliable, stress-free travel.</p>
        <p className="lp-copy">© 2024 UCab · Built with ❤️ on MERN Stack</p>
      </footer>

    </div>
  );
}