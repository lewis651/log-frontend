import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Quote() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    transportType: 'Ocean Freight',
    origin: '',
    destination: '',
    weight: '',
    dimensions: '',
    cargoType: 'General',
    email: '',
    name: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send this to the backend
  };

  return (
    <>
      <Navbar />
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <a href="/">Home</a>
              <span>›</span>
              <span className="current">Request a Quote</span>
            </div>
            <h1>Get a Custom Freight Quote</h1>
            <p>Provide the details of your shipment below and our team will get back to you with a competitive rate within 2 hours.</p>
          </div>
        </div>
      </div>

      <section className="section-pad">
        <div className="container" style={{ maxWidth: '800px' }}>
          {submitted ? (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center" style={{ padding: '5rem 0' }}>
              <CheckCircle2 size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
              <h2>Quote Request Received!</h2>
              <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
                Thank you, {formData.name || 'there'}. Our logistics experts are calculating the best routes and rates for your shipment. We will email you at {formData.email} shortly.
              </p>
              <button className="btn btn-primary" onClick={() => setSubmitted(false)} style={{ marginTop: '2rem' }}>Request Another Quote</button>
            </motion.div>
          ) : (
            <motion.div className="contact-form-card" initial="hidden" animate="visible" variants={fadeUp}>
              <h3>Shipment Details</h3>
              <p>Please fill out all fields accurately to ensure a precise quote.</p>
              <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Mode of Transport</label>
                  <select
                    required
                    value={formData.transportType}
                    onChange={e => setFormData({ ...formData, transportType: e.target.value })}
                  >
                    <option>Ocean Freight (FCL / LCL)</option>
                    <option>Air Freight</option>
                    <option>Road Transport</option>
                    <option>Multimodal (Combined)</option>
                  </select>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label>Origin Address / Port</label>
                    <input type="text" required placeholder="City, Country" value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Destination Address / Port</label>
                    <input type="text" required placeholder="City, Country" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} />
                  </div>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label>Total Weight (kg)</label>
                    <input type="number" required placeholder="e.g. 1500" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Dimensions (L x W x H) cm</label>
                    <input type="text" required placeholder="e.g. 120 x 100 x 80" value={formData.dimensions} onChange={e => setFormData({ ...formData, dimensions: e.target.value })} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Cargo Type</label>
                  <select value={formData.cargoType} onChange={e => setFormData({ ...formData, cargoType: e.target.value })}>
                    <option>General Cargo</option>
                    <option>Perishable (Temperature Controlled)</option>
                    <option>Hazardous Materials (HAZMAT)</option>
                    <option>Fragile / High Value</option>
                  </select>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />
                <h3>Your Contact Info</h3>
                
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" required placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" required placeholder="john@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={18} /> Submit Request
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
