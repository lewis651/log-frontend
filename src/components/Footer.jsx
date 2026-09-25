import React from 'react';
import { Link } from 'react-router-dom';
import {
  Anchor, MapPin, Phone, Mail, ChevronRight, Clock, Lock
} from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="navbar-logo" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
              <div className="logo-icon"><Anchor size={18} /></div>
              Logisti<span>qo</span>
            </Link>
            <p>
              We are a global logistics leader committed to delivering your cargo with speed, precision, and total reliability — from origin to destination, every time.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="footer-social" aria-label="Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="footer-social" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="footer-social" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/services', label: 'Our Services' },
                { to: '/industries', label: 'Industries' },
                { to: '/locations', label: 'Global Network' },
                { to: '/tracking', label: 'Track Shipment' },
                { to: '/quote', label: 'Get a Quote' },
                { to: '/faq', label: 'FAQ & Support' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}>
                    <ChevronRight size={13} />{label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul className="footer-links">
              {[
                'Ocean Freight',
                'Air Freight',
                'Road Transport',
                'Warehousing',
                'Customs Clearance',
                'Last-Mile Delivery',
              ].map((s) => (
                <li key={s}>
                  <Link to="/services">
                    <ChevronRight size={13} />{s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact-item">
              <MapPin size={15} />
              <span>1200 Harbor Blvd, Suite 400<br />New York, NY 10001, USA</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={15} />
              <span>+1 (800) 555-LOGQ<br />+1 (212) 555-9482</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={15} />
              <span>support@logistiqo.com<br />sales@logistiqo.com</span>
            </div>
            <div className="footer-contact-item">
              <Clock size={15} />
              <span>Mon–Fri: 8am–8pm EST<br />Sat: 9am–5pm EST</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Logistiqo Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/faq">Support</Link>
            <Link to="/admin-dashboard" className="footer-admin-link" title="Admin Login"><Lock size={13} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
