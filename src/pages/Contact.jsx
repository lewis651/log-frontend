import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitContact } from '../api';

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Full name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!form.message.trim()) errors.message = 'Please provide your message.';
  if (form.message.trim().length < 20) errors.message = 'Message must be at least 20 characters.';
  return errors;
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <span className="current">Contact</span>
            </div>
            <h1>Get In Touch</h1>
            <p>Have a shipment to plan or a question to ask? Our team is ready to help — 24/7.</p>
          </div>
        </div>
      </div>

      <section className="section-pad">
        <div className="container">
          <motion.div
            className="contact-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {/* Contact Info */}
            <motion.div variants={fadeUp}>
              <div className="contact-info-card">
                <h3>Contact Information</h3>
                <p>Fill out the form and our team will respond within 2 business hours with a tailored solution for your needs.</p>

                <div className="contact-detail">
                  <div className="contact-detail-icon"><MapPin size={18} /></div>
                  <div>
                    <h5>Head Office</h5>
                    <p>1200 Harbor Blvd, Suite 400<br />New York, NY 10001, USA</p>
                  </div>
                </div>
                <div className="contact-detail">
                  <div className="contact-detail-icon"><Phone size={18} /></div>
                  <div>
                    <h5>Phone/WhatsApp</h5>
                    <p> Call ( +1 847-737-8213 ) / WhatsApp (+1 (409) 291-9531  ) </p>
                  </div>
                </div>
                <div className="contact-detail">
                  <div className="contact-detail-icon"><Mail size={18} /></div>
                  <div>
                    <h5>Email</h5>
                    <p>Logistiqo@gmail.com</p>
                  </div>
                </div>
                <div className="contact-detail">
                  <div className="contact-detail-icon"><Clock size={18} /></div>
                  <div>
                    <h5>Support Hours</h5>
                    <p>Mon–Fri: 8am–8pm EST<br />Sat: 9am–5pm EST<br />Emergency: 24/7</p>
                  </div>
                </div>

                {/* Office Locations */}
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <h5 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 600 }}>Global Offices</h5>
                  {[
                    { city: 'London, UK', flag: '🇬🇧' },
                    { city: 'Singapore', flag: '🇸🇬' },
                    { city: 'Dubai, UAE', flag: '🇦🇪' },
                    { city: 'Lagos, Nigeria', flag: '🇳🇬' },
                  ].map(({ city, flag }) => (
                    <div key={city} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                      <span>{flag}</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>{city}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeUp}>
              <div className="contact-form-card">
                <h3>Send Us a Message</h3>
                <p>Tell us about your shipment or ask anything about our services.</p>

                {success ? (
                  <div className="alert alert-success" style={{ marginTop: '1rem' }}>
                    <CheckCircle2 size={20} />
                    <div>
                      <strong>Message sent successfully!</strong><br />
                      <span style={{ fontSize: '0.85rem' }}>Thank you for reaching out. Our team will be in touch within 2 hours.</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    {serverError && (
                      <div className="alert alert-error">
                        <AlertCircle size={18} />
                        {serverError}
                      </div>
                    )}

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          className={`form-control ${errors.name ? 'error' : ''}`}
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Smith"
                        />
                        {errors.name && <div className="form-error">{errors.name}</div>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${errors.email ? 'error' : ''}`}
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                        />
                        {errors.email && <div className="form-error">{errors.email}</div>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Subject</label>
                        <select
                          name="subject"
                          className="form-control"
                          value={form.subject}
                          onChange={handleChange}
                        >
                          <option value="">Select a subject</option>
                          <option>Ocean Freight Inquiry</option>
                          <option>Air Freight Inquiry</option>
                          <option>Road Transport</option>
                          <option>Warehousing</option>
                          <option>Customs Clearance</option>
                          <option>Get a Quote</option>
                          <option>Tracking Issue</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message *</label>
                      <textarea
                        name="message"
                        className={`form-control ${errors.message ? 'error' : ''}`}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your shipment, cargo type, origin, destination, and any special requirements..."
                      />
                      {errors.message && <div className="form-error">{errors.message}</div>}
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                      {loading
                        ? <><Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> Sending...</>
                        : <><Send size={18} /> Send Message</>
                      }
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Map placeholder */}
      <section style={{ height: 400, background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <MapPin size={40} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-light)', fontWeight: 500 }}>1200 Harbor Blvd, Suite 400, New York, NY 10001</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Head Office — Near Port Authority</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
