import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Globe2, Award, Users, Briefcase,
  Ship, Plane, Truck, Anchor
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const MILESTONES = [
  { year: '2009', title: 'Company Founded', desc: 'Logistiqo was established in New York as a regional freight brokerage firm with a vision to reinvent logistics.' },
  { year: '2012', title: 'International Expansion', desc: 'Opened our first overseas offices in London and Singapore, establishing our transatlantic and Pacific routes.' },
  { year: '2015', title: 'Digital Platform Launch', desc: 'Launched our proprietary logistics management platform, giving clients real-time visibility across all shipments.' },
  { year: '2018', title: 'ISO 9001 Certification', desc: 'Achieved ISO 9001:2015 certification, recognizing our commitment to quality management and continuous improvement.' },
  { year: '2021', title: '1,000 Clients Milestone', desc: 'Celebrated our 1,000th active client, spanning industries from healthcare to automotive and retail.' },
  { year: '2024', title: 'AI-Powered Tracking', desc: 'Launched next-generation live tracking with AI-driven delivery prediction and automated client notifications.' },
];

const VALUES = [
  { icon: <CheckCircle2 size={22} />, title: 'Reliability', desc: 'We honor every commitment. When we say your cargo will arrive on time, we mean it.' },
  { icon: <Globe2 size={22} />, title: 'Global Reach', desc: 'Our network spans every continent, giving you true end-to-end global logistics capability.' },
  { icon: <Users size={22} />, title: 'Client-First', desc: 'Every decision we make starts with a simple question: what is best for our clients?' },
  { icon: <Award size={22} />, title: 'Excellence', desc: 'We set the industry standard through innovation, quality, and relentless improvement.' },
];

export default function About() {
  return (
    <>
      <Navbar />

      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <span className="current">About Us</span>
            </div>
            <h1>Our Story, Our Mission</h1>
            <p>15 years of moving cargo across the globe with precision, passion, and purpose.</p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="section-pad">
        <div className="container">
          <motion.div
            className="about-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div className="about-img-wrapper" variants={fadeUp}>
              <img
                src="/images/img-1504307651254-35680f356dfd.jpg"
                alt="Our team at work"
                loading="lazy"
                decoding="async"
              />
              <div className="about-img-badge">
                <strong>2009</strong>
                <span>Founded</span>
              </div>
            </motion.div>
            <motion.div className="about-text" variants={fadeUp}>
              <div className="section-tag">WHO WE ARE</div>
              <h2>Built on Trust, Driven By <em>Innovation</em></h2>
              <p>
                Logistiqo was founded with a single conviction: that businesses deserve a logistics partner who treats their cargo like their own. Over 15 years later, that principle drives everything we do.
              </p>
              <p>
                Today, we serve over 1,200 clients across 30+ countries — from startups shipping their first products to Fortune 500 companies managing complex global supply chains.
              </p>
              <div className="about-checks">
                {[
                  'Full end-to-end supply chain management',
                  'Real-time cargo tracking and visibility',
                  'Expert customs and compliance team',
                  'Dedicated account management for every client',
                ].map(item => (
                  <div className="about-check" key={item}>
                    <div className="about-check-icon"><CheckCircle2 size={14} /></div>
                    {item}
                  </div>
                ))}
              </div>
              <div className="stats-row">
                {[
                  { num: '15+', label: 'Years of Excellence' },
                  { num: '30+', label: 'Countries' },
                  { num: '1,200+', label: 'Clients Served' },
                ].map(({ num, label }) => (
                  <div className="stat-item" key={label}>
                    <div className="stat-num">{num}</div>
                    <div className="stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-pad" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-tag">OUR VALUES</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>What We Stand For</h2>
            <p className="text-light" style={{ maxWidth: 480, margin: '1rem auto 0' }}>
              Our core values aren't words on a wall — they're the principles that guide every shipment we handle.
            </p>
          </div>
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {VALUES.map(({ icon, title, desc }) => (
              <motion.div
                className="why-feature"
                key={title}
                variants={fadeUp}
                style={{ flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}
              >
                <div className="why-feature-icon" style={{ marginBottom: '1rem' }}>{icon}</div>
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="text-center mb-5">
            <div className="section-tag">OUR JOURNEY</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Milestones That Define Us</h2>
          </div>
          <div className="milestones">
            {MILESTONES.map(({ year, title, desc }) => (
              <div className="milestone-item" key={year}>
                <div className="milestone-year">{year}</div>
                <div className="milestone-dot" />
                <div className="milestone-body">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Infrastructure */}
      <section className="section-pad" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-tag">GLOBAL INFRASTRUCTURE</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Seamless Connectivity Worldwide</h2>
            <p className="text-light" style={{ maxWidth: 480, margin: '1rem auto 0' }}>
              We've built a resilient and expansive logistics network designed to transport your goods anywhere on the globe safely and efficiently.
            </p>
          </div>
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { icon: <Ship size={32} color="var(--primary)" />, title: 'Ocean Freight Network', desc: 'Direct partnerships with all major shipping lines and dedicated space allocations on key trade lanes.' },
              { icon: <Plane size={32} color="var(--primary)" />, title: 'Air Cargo Hubs', desc: 'Strategic hubs in North America, Europe, and Asia for expedited cross-border air shipping and charter services.' },
              { icon: <Truck size={32} color="var(--primary)" />, title: 'Overland Fleet', desc: 'Extensive fleet of modern trucks and rail partnerships for flexible, cost-effective inland transport.' }
            ].map(({ icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} style={{ background: '#fff', padding: '2.5rem 2rem', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 24px rgba(0,0,0,0.03)', textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(230,48,48,0.08)' }}>
                  {icon}
                </div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{title}</h4>
                <p className="text-light">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad-sm">
        <div className="cta-section">
          <img src="/images/img-1578575437130-527eed3abbec.jpg" alt="Port" className="cta-bg" loading="lazy" decoding="async" />
          <div className="cta-overlay" />
          <div className="cta-content">
            <div className="cta-text">
              <h2>Join 1,200+ Businesses Who Trust Logistiqo</h2>
              <p>Get started today with a free consultation and custom shipping plan designed for your needs.</p>
            </div>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Get a Free Quote <ArrowRight size={18} /></Link>
              <Link to="/services" className="btn btn-outline-white btn-lg">Our Services</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
