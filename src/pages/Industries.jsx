import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Factory, ShoppingCart, Heart, Car, Zap, Wheat, Cpu, Plane } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const INDUSTRIES = [
  {
    icon: <Factory size={32} />,
    label: 'Manufacturing',
    tagline: 'Keeping Production Lines Moving',
    image: '/images/img-1581091226825-a6a2a5aee158.jpg',
    desc: 'We understand that manufacturing depends on tight supply chains. Our logistics solutions ensure raw materials arrive on time and finished goods reach markets without delay — minimizing downtime and maximizing throughput.',
    stats: [{ num: '500+', label: 'Factories Served' }, { num: '99.2%', label: 'On-Time Rate' }, { num: '40+', label: 'Countries' }],
    solutions: ['Just-In-Time delivery', 'Raw material sourcing', 'Heavy equipment shipping', 'Factory-to-distribution center routing', 'Vendor managed inventory'],
    color: '#e63030',
  },
  {
    icon: <ShoppingCart size={32} />,
    label: 'Retail & E-Commerce',
    tagline: 'Faster Deliveries, Happier Customers',
    image: '/images/img-1556740738-b6a63e27c4df.jpg',
    desc: 'In the age of next-day delivery expectations, we help retailers and e-commerce brands fulfil orders faster. Our integrated last-mile network and warehouse solutions streamline your entire fulfilment operation.',
    stats: [{ num: '2M+', label: 'Parcels/Month' }, { num: '48hr', label: 'Avg. Fulfilment' }, { num: '150+', label: 'Retail Clients' }],
    solutions: ['Multi-channel fulfilment', 'Returns management', 'Peak season scaling', 'Last-mile delivery', 'Inventory management'],
    color: '#7c3aed',
  },
  {
    icon: <Heart size={32} />,
    label: 'Healthcare & Pharma',
    tagline: 'Cold Chain Precision You Can Trust',
    image: '/images/img-1519494026892-80bbd2d6fd0d.jpg',
    desc: 'Healthcare cargo demands flawless cold-chain management and regulatory compliance. Our GDP-certified team handles pharmaceuticals, medical devices, and diagnostics with the highest level of care and traceability.',
    stats: [{ num: '100%', label: 'Cold Chain Integrity' }, { num: 'GDP', label: 'Certified' }, { num: '24/7', label: 'Monitoring' }],
    solutions: ['GDP-compliant cold chain', 'Temperature-controlled storage', 'Pharma import/export permits', 'Medical device shipping', 'Serialisation & traceability'],
    color: '#059669',
  },
  {
    icon: <Car size={32} />,
    label: 'Automotive',
    tagline: 'Precision Logistics for Every Part',
    image: '/images/img-1562259929-b4e1fd3aef09.jpg',
    desc: 'The automotive industry operates on razor-thin margins and strict production schedules. We move parts, components, and finished vehicles globally — supporting both OEMs and Tier 1/2 suppliers with reliable, sequence-based logistics.',
    stats: [{ num: '300+', label: 'OEM Partners' }, { num: '98.5%', label: 'On-Time Delivery' }, { num: '25+', label: 'Production Plants' }],
    solutions: ['Vehicle shipping (RoRo & Container)', 'Sequenced parts delivery', 'Inbound supply chain management', 'Cross-border transport', 'Bonded warehousing'],
    color: '#d97706',
  },
  {
    icon: <Zap size={32} />,
    label: 'Oil & Energy',
    tagline: 'Supplying the World\'s Energy Infrastructure',
    image: '/images/img-1518709268805-4e9042af9f23.jpg',
    desc: 'Energy projects operate in remote, challenging environments and require logistics partners who can deliver under pressure. We move equipment, pipes, chemicals, and machinery to offshore and onshore sites worldwide.',
    stats: [{ num: '80+', label: 'Energy Projects' }, { num: '60+', label: 'Countries' }, { num: 'HAZMAT', label: 'Certified' }],
    solutions: ['Project cargo & heavy lift', 'HAZMAT transport', 'Offshore supply chain', 'Equipment mobilisation', 'Out-of-gauge cargo handling'],
    color: '#0284c7',
  },
  {
    icon: <Wheat size={32} />,
    label: 'Agriculture & Food',
    tagline: 'Farm to Fork, Freshness Guaranteed',
    image: '/images/img-1500382017468-9049fed747ef.jpg',
    desc: 'Agricultural products are time-sensitive and require meticulous temperature control. Our reefer container fleet and cold-chain expertise ensure fresh produce, grains, and processed foods arrive in perfect condition.',
    stats: [{ num: '250K+', label: 'Tons Handled/yr' }, { num: '-30°C', label: 'Min Temp Control' }, { num: '40+', label: 'Agri Markets' }],
    solutions: ['Reefer container shipping', 'Grain bulk cargo', 'Phytosanitary compliance', 'Cold storage & ripening rooms', 'Fumigation services'],
    color: '#16a34a',
  },
  {
    icon: <Cpu size={32} />,
    label: 'Technology & Electronics',
    tagline: 'High-Value Cargo, Zero Compromise',
    image: '/images/img-1518770660439-4636190af475.jpg',
    desc: 'Electronics are high-value, sensitive, and often subject to strict trade regulations. We handle semiconductors, consumer electronics, and server equipment with anti-static packaging, real-time tracking, and full insurance coverage.',
    stats: [{ num: '$2B+', label: 'Cargo Value Handled' }, { num: '100%', label: 'Fully Insured' }, { num: 'ESD', label: 'Safe Packaging' }],
    solutions: ['Anti-static & ESD packaging', 'Express air freight', 'High-security warehousing', 'Trade compliance (ITAR/EAR)', 'White glove delivery'],
    color: '#7c3aed',
  },
  {
    icon: <Plane size={32} />,
    label: 'Aerospace & Defence',
    tagline: 'Mission-Critical Logistics, Every Time',
    image: '/images/img-1436491865332-7a61a109cc05.jpg',
    desc: 'Aerospace and defence cargo demands the highest standards of security, compliance, and precision. Our specialised team manages aircraft parts, MRO equipment, and defence-grade cargo with full regulatory adherence.',
    stats: [{ num: 'ITAR', label: 'Compliant' }, { num: 'AOG', label: 'Express Service' }, { num: '100%', label: 'Secure Chain' }],
    solutions: ['AOG (Aircraft on Ground) express', 'ITAR & EAR compliance', 'Secure document handling', 'MRO parts logistics', 'Charter & special missions'],
    color: '#0f172a',
  },
];

export default function Industries() {
  const [active, setActive] = useState(null);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="page-hero industries-hero">
        <img
          src="/images/img-1553413077-190dd305871c.jpg"
          alt="Industries"
          className="hero-bg-image"
          style={{ opacity: 0.25 }}
        />
        <div className="hero-overlay" style={{ background: 'linear-gradient(135deg, rgba(11,26,44,0.97) 0%, rgba(230,48,48,0.15) 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="page-hero-content" style={{ maxWidth: 720 }}>
            <div className="breadcrumb">
              <a href="/">Home</a><span>›</span>
              <span className="current">Industries</span>
            </div>
            <h1>Industries We Serve</h1>
            <p style={{ maxWidth: 580, fontSize: '1.1rem' }}>
              From factory floors to hospital wards, oil rigs to aircraft hangars — Logistiqo delivers tailored logistics expertise across the world's most demanding sectors.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <Link to="/quote" className="btn btn-primary btn-lg">Get a Sector Quote <ArrowRight size={18} /></Link>
              <Link to="/contact" className="btn btn-outline-white btn-lg">Talk to an Expert</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Tabs Nav */}
      <div className="industries-tab-bar">
        <div className="container">
          <div className="industries-tabs">
            {INDUSTRIES.map((ind, i) => (
              <button
                key={ind.label}
                className={`industry-tab ${active === i ? 'active' : ''}`}
                onClick={() => {
                  setActive(i);
                  document.getElementById(`industry-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <span className="industry-tab-icon">{ind.icon}</span>
                <span>{ind.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Detail Cards */}
      <section className="section-pad" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {INDUSTRIES.map((ind, i) => (
              <motion.div
                id={`industry-${i}`}
                key={ind.label}
                variants={fadeUp}
                className="industry-detail-card"
                style={{ '--ind-color': ind.color }}
              >
                {/* Image Banner */}
                <div className="industry-card-image">
                  <img src={ind.image} alt={ind.label} loading="lazy" decoding="async" />
                  <div className="industry-card-overlay" />
                  <div className="industry-card-badge">
                    <span style={{ color: ind.color }}>{ind.icon}</span>
                    <div>
                      <div className="industry-card-label">{ind.label}</div>
                      <div className="industry-card-tagline">{ind.tagline}</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="industry-card-body">
                  {/* Stats */}
                  <div className="industry-stats-row">
                    {ind.stats.map(s => (
                      <div key={s.label} className="industry-stat">
                        <div className="industry-stat-num" style={{ color: ind.color }}>{s.num}</div>
                        <div className="industry-stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="industry-card-content">
                    <div>
                      <p className="industry-desc">{ind.desc}</p>
                    </div>
                    <div>
                      <h4 className="industry-solutions-title">Our Solutions for {ind.label}</h4>
                      <ul className="industry-solutions">
                        {ind.solutions.map(sol => (
                          <li key={sol}>
                            <CheckCircle2 size={15} style={{ color: ind.color, flexShrink: 0 }} />
                            {sol}
                          </li>
                        ))}
                      </ul>
                      <Link to="/quote" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                        Get a Quote for {ind.label} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad-sm">
        <div className="cta-section">
          <img src="/images/img-1501700493788-fa1a4fc9fe62.jpg" alt="CTA" className="cta-bg" loading="lazy" decoding="async" />
          <div className="cta-overlay" />
          <div className="cta-content">
            <div className="cta-text">
              <h2>Don't See Your Industry?</h2>
              <p>We work across all sectors. Let's talk about a custom logistics solution tailored to your specific needs.</p>
            </div>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Contact Our Team <ArrowRight size={18} /></Link>
              <Link to="/services" className="btn btn-outline-white btn-lg">View All Services</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
