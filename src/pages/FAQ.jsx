import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const FAQS = [
  { category: 'Shipping & Delivery', questions: [
    { q: 'How long does ocean freight usually take?', a: 'Transit times vary greatly depending on the route. For example, Asia to North America West Coast typically takes 14-22 days, while Europe to North America takes 10-14 days. Customs clearance can add 2-4 days.' },
    { q: 'Do you offer door-to-door delivery?', a: 'Yes, we provide comprehensive door-to-door services globally, handling pickup, long-haul transport, customs, and final-mile delivery directly to your facility.' },
  ]},
  { category: 'Customs & Compliance', questions: [
    { q: 'Who handles the customs clearance?', a: 'Our in-house customs brokers manage all documentation, duties, and clearance procedures on your behalf, ensuring full compliance with local regulations.' },
    { q: 'What items are restricted or prohibited?', a: 'Prohibited items typically include hazardous materials (without proper declaration), weapons, perishable goods (without reefer transport), and certain electronics. Please contact us for a detailed list specific to your destination.' },
  ]},
  { category: 'Tracking & Technology', questions: [
    { q: 'How real-time is the tracking?', a: 'Our tracking is updated in real-time. For ocean freight, we use satellite AIS data. For road and air, we integrate directly with carrier GPS and scanning systems.' },
    { q: 'Can I integrate my ERP with your platform?', a: 'Yes, we offer robust APIs for enterprise clients to sync tracking data, invoices, and shipment booking directly into SAP, Oracle, and other ERPs.' },
  ]},
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <Navbar />
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <a href="/">Home</a>
              <span>›</span>
              <span className="current">FAQ & Support</span>
            </div>
            <h1>Help & Support Center</h1>
            <p>Find answers to common questions about our services, shipping processes, and platform features.</p>
          </div>
        </div>
      </div>

      <section className="section-pad">
        <div className="container" style={{ maxWidth: '800px' }}>
          {FAQS.map((category, idx) => (
            <div key={idx} style={{ marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', display: 'inline-block' }}>{category.category}</h2>
              <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {category.questions.map((item, qIdx) => {
                  const id = `${idx}-${qIdx}`;
                  const isOpen = openFaq === id;
                  return (
                    <motion.div
                      key={id}
                      className="faq-item"
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      style={{
                        background: 'var(--bg-white)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : id)}
                        style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '1.25rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
                          fontWeight: 600, fontSize: '1.05rem', textAlign: 'left', color: isOpen ? 'var(--primary)' : 'var(--text-dark)'
                        }}
                      >
                        {item.q}
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-light)', lineHeight: 1.7 }}>
                          {item.a}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
