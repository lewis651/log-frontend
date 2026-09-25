import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Anchor, Menu, X, ChevronUp, AlignRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/industries', label: 'Industries' },
    { to: '/locations', label: 'Global Network' },
    { to: '/tracking', label: 'Tracking' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <Anchor size={18} />
            </div>
            Logisti<span>qo</span>
          </Link>

          <div className="nav-links">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={isActive(to) ? 'active' : ''}>
                {label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <Link to="/tracking" className="btn btn-outline btn-sm">Track Shipment</Link>
            <Link to="/quote" className="btn btn-primary btn-sm">Get a Quote</Link>
          </div>

          <button className="nav-hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMobileOpen(false)}>
          <X size={28} />
        </button>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to}>{label}</Link>
        ))}
        <Link to="/quote" className="btn btn-primary btn-lg" style={{ marginTop: '1rem' }}>
          Get a Quote
        </Link>
      </div>

      {/* Scroll To Top */}
      <button
        className={`scroll-top-btn ${showTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} />
      </button>
    </>
  );
}
