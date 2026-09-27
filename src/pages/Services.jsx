import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ship, Plane, Truck, Warehouse, Globe2, Package,
  ArrowRight, CheckCircle2, Clock, Shield, BarChart3, Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const SERVICES = [
  {
    icon: <Ship size={32} />,
    title: 'Ocean Freight',
    desc: 'We manage full container loads (FCL) and less-than-container loads (LCL) across all major global shipping lanes. With partnerships with top ocean carriers including Maersk, MSC, and CMA CGM, we guarantee competitive rates and reliable schedules.',
    features: ['FCL & LCL shipping', 'Port-to-port & door-to-door', 'Reefer cargo capability', 'Dangerous goods handling', 'Real-time vessel tracking'],
    img: '/images/img-1494412574643-ff11b0a5c1c3.jpg',
  },
  {
    icon: <Plane size={32} />,
    title: 'Air Freight',
    desc: 'When speed matters most, our air freight services deliver your cargo to 200+ destinations worldwide. We partner with leading airlines to offer both express and economy air solutions, with complete door-to-door management.',
    features: ['Express & economy options', '200+ global destinations', 'Charter flights for bulk cargo', 'Temperature-controlled options', 'Same-day booking available'],
    img: '/images/img-1436491865332-7a61a109cc05.jpg',
  },
  {
    icon: <Truck size={32} />,
    title: 'Road Transport',
    desc: 'Our ground freight network covers North America and Europe with FTL and LTL trucking solutions. GPS-tracked vehicles, experienced drivers, and optimized routing ensure your cargo arrives on time.',
    features: ['FTL & LTL trucking', 'Cross-border transport', 'GPS-tracked fleet', 'Hazardous goods certified', 'Overnight delivery options'],
    img: '/images/img-1519003722824-194d4455a60c.jpg',
  },
  {
    icon: <Warehouse size={32} />,
    title: 'Warehousing & Distribution',
    desc: 'Our strategically located, bonded warehouses provide secure storage, inventory management, pick-and-pack, and cross-docking services. Integrated with our digital platform for complete visibility.',
    features: ['1M+ sq ft of warehouse space', 'Bonded & non-bonded options', 'Pick, pack & fulfillment', 'Climate-controlled storage', 'Inventory management system'],
    img: '/images/img-1586528116311-ad8dd3c8310d.jpg',
  },
  {
    icon: <Globe2 size={32} />,
    title: 'Customs Clearance',
    desc: 'Our licensed customs brokers navigate the complexities of international trade compliance. We handle documentation, tariff classification, duty calculation, and regulatory filings to ensure seamless border crossings.',
    features: ['Licensed customs brokers', 'Import & export declarations', 'Tariff & duty optimization', 'Trade compliance consulting', '30+ country coverage'],
    img: '/images/img-1578575437130-527eed3abbec.jpg',
  },
  {
    icon: <Package size={32} />,
    title: 'Last-Mile Delivery',
    desc: 'Complete the journey seamlessly with our last-mile delivery solutions. We ensure your packages reach residential and commercial addresses on schedule, with proof of delivery and real-time status updates.',
    features: ['Residential & commercial delivery', 'Proof of delivery (POD)', 'Scheduled time-window delivery', 'Returns management', 'Live tracking for recipients'],
    img: '/images/img-1601584115197-04ecc0da31d7.jpg',
  },
];

const PROCESS = [
  { icon: <BarChart3 size={24} />, step: '01', title: 'Get a Quote', desc: 'Tell us your cargo details and destination. We respond with a transparent, competitive quote within 2 hours.' },
  { icon: <Shield size={24} />, step: '02', title: 'Confirm & Book', desc: 'Confirm your shipment, provide documentation, and our team handles the logistics from there.' },
  { icon: <Zap size={24} />, step: '03', title: 'We Pick Up', desc: 'Our team or partner carrier picks up your cargo from your location on the agreed schedule.' },
  { icon: <Clock size={24} />, step: '04', title: 'Track in Real Time', desc: 'Monitor your shipment live on our platform. Receive proactive updates at every milestone.' },
  { icon: <CheckCircle2 size={24} />, step: '05', title: 'Delivered', desc: 'Your cargo arrives safely at its destination with proof of delivery and complete documentation.' },
];

export default function Services() {
  return (
    <>
      <Navbar />

      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <span className="current">Services</span>
            </div>
            <h1>Our Logistics Services</h1>
            <p>End-to-end logistics solutions for every cargo type, route, and industry — built to scale with your business.</p>
          </div>
        </div>
      </div>

      {/* Services Detail */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-tag">WHAT WE OFFER</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Comprehensive Shipping Solutions</h2>
            <p className="text-light" style={{ maxWidth: 520, margin: '1rem auto 0' }}>
              From a single parcel to a fleet of containers, Logistiqo handles it all with the same level of care and expertise.
            </p>
          </div>
          <motion.div
            className="services-hero-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {SERVICES.map(({ icon, title, desc, features, img }) => (
              <motion.div className="service-detail-card" key={title} variants={fadeUp}>
                <div style={{ height: '260px', margin: '-2.5rem -2.5rem 2rem', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', overflow: 'hidden' }}>
                  <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} loading="lazy" decoding="async" />
                </div>
                <div className="service-detail-icon" style={{ marginTop: '-4.5rem', background: 'var(--bg-white)', border: '1px solid var(--border)', position: 'relative', zIndex: 2 }}>{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="service-features">
                  {features.map(f => (
                    <div className="service-feature-item" key={f}>
                      <CheckCircle2 size={14} />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="section-pad" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-tag">HOW IT WORKS</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Simple 5-Step Shipping Process</h2>
            <p className="text-light" style={{ maxWidth: 480, margin: '1rem auto 0' }}>
              Getting your cargo moved has never been easier. Our streamlined process keeps you in control at every stage.
            </p>
          </div>
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {PROCESS.map(({ icon, step, title, desc }) => (
              <motion.div
                key={step}
                style={{
                  background: 'var(--bg-white)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  position: 'relative',
                }}
                variants={fadeUp}
              >
                <div style={{
                  width: 56, height: 56,
                  background: 'rgba(230,48,48,0.08)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', margin: '0 auto 1.25rem',
                }}>
                  {icon}
                </div>
                <div style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                  fontSize: '1.5rem', color: 'var(--border)', lineHeight: 1,
                }}>{step}</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '0.8rem', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad-sm">
        <div className="cta-section">
          <img src="/images/img-1501700493788-fa1a4fc9fe62.jpg" alt="Freight" className="cta-bg" loading="lazy" decoding="async" />
          <div className="cta-overlay" />
          <div className="cta-content">
            <div className="cta-text">
              <h2>Ready To Ship? Get Your Quote Today.</h2>
              <p>Tell us about your cargo and we'll deliver a custom solution within 2 hours.</p>
            </div>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Request a Quote <ArrowRight size={18} /></Link>
              <Link to="/tracking" className="btn btn-outline-white btn-lg">Track a Shipment</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
