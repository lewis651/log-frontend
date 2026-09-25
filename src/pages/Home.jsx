import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Play, CheckCircle2, Truck, Globe2, Shield, Clock, Package,
  Anchor, Star, ChevronDown, ChevronUp, Zap, HeadphonesIcon, Award, BarChart3,
  Ship, Plane, Warehouse
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const SERVICES = [
  { img: '/images/img-1494412574643-ff11b0a5c1c3.jpg', icon: <Ship size={24} />, title: 'Ocean Freight', desc: 'Full and less-than-container load shipping across all major global shipping lanes. Reliable schedules, competitive rates.' },
  { img: '/images/img-1436491865332-7a61a109cc05.jpg', icon: <Plane size={24} />, title: 'Air Freight', desc: 'Express and standard airfreight solutions for time-critical cargo. Door-to-door delivery in over 200 destinations.' },
  { img: '/images/img-1601584115197-04ecc0da31d7.jpg', icon: <Truck size={24} />, title: 'Road Transport', desc: 'Comprehensive FTL and LTL trucking across North America, Europe and beyond with real-time GPS tracking.' },
  { img: '/images/img-1553413077-190dd305871c.jpg', icon: <Warehouse size={24} />, title: 'Warehousing', desc: 'State-of-the-art bonded warehouses with inventory management, pick-and-pack, and distribution services.' },
  { img: '/images/img-1578575437130-527eed3abbec.jpg', icon: <Globe2 size={24} />, title: 'Customs Clearance', desc: 'Expert customs brokerage ensuring your cargo clears borders quickly and compliantly in 30+ countries.' },
  { img: '/images/img-1580674285054-bed31e145f59.jpg', icon: <Package size={24} />, title: 'Last-Mile Delivery', desc: 'Final-mile solutions that ensure your packages reach end consumers on time, every time — with live tracking.' },
];

const WHY = [
  { icon: <Zap size={22} />, title: 'Fast & Secure Delivery', desc: 'We prioritize speed and safety, making sure your goods arrive on time and in perfect condition, no matter the distance.' },
  { icon: <Package size={22} />, title: 'Custom Shipping Plans', desc: 'Every business is different. We tailor logistics packages to your timeline, budget, and requirements — exactly how you need it.' },
  { icon: <HeadphonesIcon size={22} />, title: '24/7 Tracking & Support', desc: 'Stay informed with real-time tracking and our round-the-clock customer support team ready to assist you at any time.' },
  { icon: <Shield size={22} />, title: 'Cargo Insurance', desc: 'All shipments come with comprehensive cargo insurance options, protecting your goods against loss or damage in transit.' },
  { icon: <Globe2 size={22} />, title: 'Global Network', desc: 'With offices in 30+ countries and partnerships with leading carriers, we have the reach to move cargo anywhere.' },
  { icon: <Award size={22} />, title: 'ISO Certified', desc: 'We operate under ISO 9001:2015 quality management standards, ensuring consistent excellence in every shipment.' },
];

const TESTIMONIALS = [
  {
    text: 'Logistiqo transformed our supply chain. We went from unpredictable delivery windows to pinpoint accuracy. Their live tracking is a game-changer — our clients love it.',
    author: 'Marcus Williams', role: 'COO, NorthCore Manufacturing', avatar: 'MW', stars: 5, featured: true,
  },
  {
    text: 'Switching to Logistiqo was the best logistics decision we made. The team is professional, responsive, and they truly understand our business needs.',
    author: 'Priya Sharma', role: 'VP of Operations, BlueTech Imports', avatar: 'PS', stars: 5,
  },
  {
    text: 'From customs clearance to last-mile delivery, everything is handled seamlessly. I have complete peace of mind knowing where my cargo is at all times.',
    author: 'David Chen', role: 'Director, Pacific Trade Co.', avatar: 'DC', stars: 5,
  },
  {
    text: 'Their ocean freight rates are competitive and the service quality is second to none. We\'ve been clients for 3 years and have never looked back.',
    author: 'Sarah Mitchell', role: 'Logistics Manager, EuroGoods Ltd', avatar: 'SM', stars: 5,
  },
  {
    text: 'The admin portal is intuitive and powerful. I can track every shipment, get instant reports, and communicate with the team all from one place.',
    author: 'James Okafor', role: 'CEO, Lagos Export Group', avatar: 'JO', stars: 5,
  },
  {
    text: 'Exceptional service from quote to delivery. Their air freight team handled our urgent medical equipment shipment flawlessly, arriving 12 hours ahead of schedule.',
    author: 'Ana García', role: 'Supply Chain Lead, MedTech Global', avatar: 'AG', stars: 5,
  },
];

const FAQS = [
  { q: 'What services does Logistiqo provide?', a: 'We offer full-service logistics solutions including ocean freight, air freight, road transport, warehousing, customs clearance, and last-mile delivery — tailored to your specific needs.' },
  { q: 'Do you handle international shipments?', a: 'Absolutely. We operate in 30+ countries with trusted partners, ensuring end-to-end global logistics support — including customs documentation and compliance.' },
  { q: 'How do I track my shipment?', a: 'You\'ll receive a unique tracking ID after dispatch. Enter it on our Tracking page for real-time updates including current location, live map, and estimated delivery.' },
  { q: 'How fast can I get a shipping quote?', a: 'You can request an instant quote through our Contact page. Our team typically responds within a few hours with a detailed, transparent breakdown.' },
  { q: 'Is my cargo insured during transit?', a: 'Yes. All shipments are eligible for comprehensive cargo insurance. We offer multiple coverage tiers to suit your goods and risk profile.' },
  { q: 'Can I schedule a pickup from my location?', a: 'Yes, we offer door-to-door pickup and delivery services. Simply provide your location and preferred pickup date when requesting a quote.' },
];

const PARTNERS = ['DHL Connect', 'FedEx Elite', 'Maersk', 'MSC Lines', 'UPS Global', 'CMA CGM'];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingInput.trim()) navigate(`/tracking?id=${trackingInput.trim().toUpperCase()}`);
  };

  return (
    <>
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="hero">
        <img
          src="/images/img-1494412574643-ff11b0a5c1c3.jpg"
          alt="Cargo ship at sea"
          className="hero-bg-image"
          fetchpriority="high"
          decoding="async"
        />
        <div className="hero-overlay" />
        <div className="container">
          <motion.div
            className="hero-grid"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <div className="hero-text-col">
              <motion.div className="hero-tag" variants={fadeUp}>
                <span className="dot" /> Best-in-class Logistics Platform
              </motion.div>

              <motion.h1 className="hero-title" variants={fadeUp}>
                Take Your Shipping<br />
                <span className="highlight">To The Next Level</span>
              </motion.h1>

              <motion.p className="hero-subtitle" variants={fadeUp}>
                Simplify logistics, reduce costs, and deliver faster with our all-in-one global shipping management platform — trusted by 1,200+ businesses worldwide.
              </motion.p>

              <motion.div className="hero-ctas" variants={fadeUp}>
                <Link to="/contact" className="btn btn-primary btn-lg">
                  Let's Collaborate <ArrowRight size={18} />
                </Link>
                <Link to="/services" className="btn btn-outline-white btn-lg">
                  Explore Services
                </Link>
              </motion.div>
            </div>

            <div className="hero-action-col">
              <motion.div className="hero-track-form" variants={fadeUp}>
                <p>Quick Shipment Tracker</p>
                <form onSubmit={handleTrack}>
                  <div className="hero-track-inner">
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="Enter your tracking number..."
                    />
                    <button type="submit" className="btn btn-primary btn-sm">Track Now</button>
                  </div>
                </form>
              </motion.div>

              <motion.div className="hero-stats" variants={fadeUp}>
                {[
                  { num: '15+', unit: 'YRS', label: 'Shipping Experience' },
                  { num: '30+', unit: 'CO', label: 'Countries Covered' },
                  { num: '60K+', unit: 'TN', label: 'Cargo Handled' },
                  { num: '99%', unit: '', label: 'On-time Delivery Rate' },
                ].map(({ num, unit, label }) => (
                  <div key={label}>
                    <div className="hero-stat-num">{num}<span>{unit}</span></div>
                    <div className="hero-stat-label">{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Trust Bar ────────────────────────────────── */}
      <div className="trust-bar">
        <div className="trust-bar-inner">
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <div key={i} className="trust-bar-item">
              <Anchor size={14} />
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* ─── About Section ────────────────────────────── */}
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
                src="/images/img-1586528116311-ad8dd3c8310d.jpg"
                alt="Logistics warehouse operations"
                loading="lazy"
                decoding="async"
              />
              <div className="about-img-badge">
                <strong>15+</strong>
                <span>Years of Excellence</span>
              </div>
            </motion.div>

            <motion.div className="about-text" variants={fadeUp}>
              <div className="section-tag">ABOUT US</div>
              <h2>At LOGISTIQO, We Combine <em>Logistics Expertise</em> With Digital Innovation</h2>
              <p>
                To deliver cargo with speed, confidence, and global impact. Whether you're moving electronics across the Pacific or fresh produce across Europe, our platform gives you full visibility and control.
              </p>
              <p>
                Founded in 2009, Logistiqo has grown from a regional freight broker to a full-service global logistics operator, serving clients in manufacturing, retail, healthcare, and more.
              </p>
              <div className="about-checks">
                {['ISO 9001:2015 Certified Operations', 'Real-Time GPS & Satellite Tracking', 'Dedicated Account Managers', 'Competitive & Transparent Pricing'].map(item => (
                  <div className="about-check" key={item}>
                    <div className="about-check-icon"><CheckCircle2 size={14} /></div>
                    {item}
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn btn-secondary">
                Learn More About Us <ArrowRight size={16} />
              </Link>
              <div className="stats-row">
                {[
                  { num: '1,200+', label: 'Happy Clients' },
                  { num: '98%', label: 'Satisfaction Rate' },
                  { num: '60K+', label: 'Tons Delivered' },
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

      {/* ─── Services Section ─────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-tag">OUR SERVICES</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Explore Our Services</h2>
            <p className="text-light" style={{ maxWidth: 500, margin: '1rem auto 0' }}>
              From ocean freight to last-mile delivery, we cover every step of your supply chain with precision.
            </p>
          </div>
          <motion.div
            className="services-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {SERVICES.map(({ img, icon, title, desc }, i) => (
              <motion.div className="service-card" key={title} variants={fadeUp}>
                <div className="service-img-wrapper" style={{ height: '200px', overflow: 'hidden', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', margin: '-2.5rem -2.5rem 2rem' }}>
                  <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                </div>
                <span className="service-card-num">0{i + 1}</span>
                <div className="service-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-4">
            <Link to="/services" className="btn btn-outline">View All Services <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ────────────────────────────── */}
      <section className="section-pad">
        <div className="container">
          <motion.div
            className="why-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div className="why-img" variants={fadeUp}>
              <img
                src="https://images.pexels.com/photos/6169052/pexels-photo-6169052.jpeg"
                alt="Why choose Logistiqo"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="section-tag">WHY CHOOSE US</div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                Why Businesses Choose Us For Their Logistics &amp; Shipping
              </h2>
              <p className="text-light mb-4">
                We don't just move cargo — we build trust. Our clients choose Logistiqo because we deliver consistency, transparency, and exceptional service every step of the way.
              </p>
              <div className="why-features">
                {WHY.map(({ icon, title, desc }) => (
                  <div className="why-feature" key={title}>
                    <div className="why-feature-icon">{icon}</div>
                    <div>
                      <h4>{title}</h4>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────── */}
      <section className="testimonials section-pad">
        <div className="container">
          <div className="testimonials-header">
            <div>
              <div className="section-tag">TESTIMONIALS</div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>What Our Clients Say</h2>
            </div>
            <div>
              <p className="text-light" style={{ textAlign: 'right', maxWidth: 280 }}>
                +99% client satisfaction rate — achieved through consistent excellence every time.
              </p>
            </div>
          </div>
          <motion.div
            className="testimonials-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {TESTIMONIALS.map(({ text, author, role, avatar, stars, featured }) => (
              <motion.div
                className={`testimonial-card ${featured ? 'featured' : ''}`}
                key={author}
                variants={fadeUp}
              >
                <div className="stars">{'★'.repeat(stars)}</div>
                <div className="testimonial-quote">"</div>
                <p>{text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={featured ? { background: 'rgba(255,255,255,0.1)', color: 'white' } : {}}>
                    {avatar}
                  </div>
                  <div>
                    <h5>{author}</h5>
                    <p>{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Partners */}
          <div className="partners-row">
            {PARTNERS.map(p => (
              <span className="partner-logo" key={p}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────── */}
      <section className="section-pad">
        <div className="container">
          <motion.div
            className="faq-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <div className="section-tag">FAQ</div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                Frequently Asked Questions
              </h2>
              <p className="text-light mb-4">
                From planning to delivery, our logistics experts are here to simplify your shipping experience. Everything you need to know, answered with confidence.
              </p>
              <div className="faq-stats">
                {[
                  { icon: <Clock size={20} />, num: '< 2h', label: 'Average Quote Response Time' },
                  { icon: <BarChart3 size={20} />, num: '99%', label: 'Client Satisfaction Rate' },
                  { icon: <Globe2 size={20} />, num: '30+', label: 'Countries We Operate In' },
                ].map(({ icon, num, label }) => (
                  <div className="faq-stat-card" key={label}>
                    <div className="faq-stat-icon">{icon}</div>
                    <div>
                      <div className="faq-stat-num">{num}</div>
                      <div className="faq-stat-text">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="faq-list">
                {FAQS.map(({ q, a }, i) => (
                  <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                    <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{q}</span>
                      <span className="faq-icon">
                        {openFaq === i ? '−' : '+'}
                      </span>
                    </div>
                    <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                      {a}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────── */}
      <section className="section-pad-sm">
        <div className="cta-section">
          <img
            src="/images/img-1578575437130-527eed3abbec.jpg"
            alt="Port containers"
            className="cta-bg"
            loading="lazy"
            decoding="async"
          />
          <div className="cta-overlay" />
          <div className="cta-content">
            <div className="cta-text">
              <h2>Ready To Move Your Business Forward?</h2>
              <p>
                From planning to delivery, our logistics experts are ready to simplify your supply chain and accelerate your growth.
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Get a Free Quote <ArrowRight size={18} />
              </Link>
              <Link to="/tracking" className="btn btn-outline-white btn-lg">
                Track Shipment
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
