import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <>
      <Navbar />
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <a href="/">Home</a>
              <span>›</span>
              <span className="current">Terms of Service</span>
            </div>
            <h1>Terms of Service</h1>
            <p>Last Updated: October 2024</p>
          </div>
        </div>
      </div>

      <section className="section-pad">
        <div className="container" style={{ maxWidth: '800px', color: 'var(--text-dark)', lineHeight: 1.8 }}>
          <h2 style={{ marginBottom: '1rem' }}>1. Introduction</h2>
          <p style={{ marginBottom: '2rem' }}>
            Welcome to Logistiqo. By using our website and services, you agree to comply with and be bound by the following terms and conditions of use. 
            Please review these terms carefully. If you do not agree to these terms, you should not use this site or our services.
          </p>

          <h2 style={{ marginBottom: '1rem' }}>2. Services Provided</h2>
          <p style={{ marginBottom: '2rem' }}>
            Logistiqo provides freight forwarding, logistics, warehousing, and tracking services. 
            All quotes provided are estimates based on the cargo details submitted. Final pricing is subject to verification of actual cargo weight, dimensions, and regulatory fees.
          </p>

          <h2 style={{ marginBottom: '1rem' }}>3. Cargo Liability & Insurance</h2>
          <p style={{ marginBottom: '2rem' }}>
            While we take the utmost care in handling your shipments, Logistiqo is not liable for loss or damage beyond standard carrier liability limits unless supplementary cargo insurance is purchased. 
            Clients are responsible for properly packaging goods and declaring dangerous materials.
          </p>

          <h2 style={{ marginBottom: '1rem' }}>4. Payment Terms</h2>
          <p style={{ marginBottom: '2rem' }}>
            Invoices are due upon receipt unless a credit account has been established. Logistiqo reserves the right to hold cargo in the event of non-payment.
          </p>

          <p style={{ marginTop: '3rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
            For full legal documentation, please contact legal@logistiqo.com.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
