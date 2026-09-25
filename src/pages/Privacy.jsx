import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <>
      <Navbar />
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <a href="/">Home</a>
              <span>›</span>
              <span className="current">Privacy Policy</span>
            </div>
            <h1>Privacy Policy</h1>
            <p>Last Updated: October 2024</p>
          </div>
        </div>
      </div>

      <section className="section-pad">
        <div className="container" style={{ maxWidth: '800px', color: 'var(--text-dark)', lineHeight: 1.8 }}>
          <h2 style={{ marginBottom: '1rem' }}>1. Data Collection</h2>
          <p style={{ marginBottom: '2rem' }}>
            We collect personal and corporate information when you request a quote, track a shipment, or contact our support team. 
            This includes names, email addresses, phone numbers, and shipment origin/destination data.
          </p>

          <h2 style={{ marginBottom: '1rem' }}>2. Use of Information</h2>
          <p style={{ marginBottom: '2rem' }}>
            The data collected is strictly used to facilitate logistics operations, process payments, provide tracking updates, and comply with international customs regulations. 
            We do not sell your data to third-party marketing agencies.
          </p>

          <h2 style={{ marginBottom: '1rem' }}>3. Data Sharing</h2>
          <p style={{ marginBottom: '2rem' }}>
            In order to execute our services, we may share necessary shipment data with trusted partners, including ocean carriers, airlines, customs brokers, and local transport authorities.
          </p>

          <h2 style={{ marginBottom: '1rem' }}>4. Security</h2>
          <p style={{ marginBottom: '2rem' }}>
            Logistiqo employs industry-standard SSL encryption and secure servers to protect your data. However, no internet transmission is 100% secure, and we cannot guarantee absolute data security.
          </p>

          <p style={{ marginTop: '3rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
            For privacy inquiries or to request data deletion, please contact privacy@logistiqo.com.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
