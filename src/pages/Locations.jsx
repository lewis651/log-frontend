import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const LOCATIONS = [
  { region: 'North America', offices: [
    { city: 'New York, USA', address: '1 World Trade Center, Suite 4500, NY 10007', phone: '+1 (458) 344-0688', email: 'jefferylawrence973@gmail.com' },
    { city: 'Los Angeles, USA', address: 'Port of LA Logistics Hub, CA 90731', phone: '+1 (555) 987-6543', email: 'la-hub@logistiqo.com' },
  ]},
  { region: 'Europe', offices: [
    { city: 'Rotterdam, Netherlands', address: 'Maasvlakte 2, Port Operations Center', phone: '+31 10 123 4567', email: 'eu-ops@logistiqo.com' },
    { city: 'London, UK', address: 'Heathrow Cargo Terminal 4, TW6 2GW', phone: '+44 20 7946 0958', email: 'uk-hub@logistiqo.com' },
  ]},
  { region: 'Asia-Pacific', offices: [
    { city: 'Singapore', address: 'Keppel Distripark, 39 Keppel Rd', phone: '+65 6123 4567', email: 'apac-ops@logistiqo.com' },
    { city: 'Shanghai, China', address: 'Yangshan Deep-Water Port Zone', phone: '+86 21 1234 5678', email: 'cn-hub@logistiqo.com' },
  ]},
];

export default function Locations() {
  return (
    <>
      <Navbar />
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <a href="/">Home</a>
              <span>›</span>
              <span className="current">Global Network</span>
            </div>
            <h1>Our Global Presence</h1>
            <p>With offices and major logistics hubs in over 30 countries, our network is perfectly positioned to connect your business to the world.</p>
          </div>
        </div>
      </div>

      <section className="section-pad">
        <div className="container">
          {LOCATIONS.map((region, idx) => (
            <div key={idx} style={{ marginBottom: '4rem' }}>
              <div className="section-tag" style={{ marginBottom: '1rem' }}>{region.region}</div>
              <motion.div 
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                {region.offices.map(office => (
                  <motion.div
                    key={office.city}
                    variants={fadeUp}
                    style={{
                      background: 'var(--bg-white)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '2rem',
                    }}
                  >
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
                      <MapPin size={20} color="var(--primary)" />
                      {office.city}
                    </h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{office.address}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <a href={`tel:${office.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', fontWeight: 500 }}>
                        <Phone size={14} color="var(--primary)" /> {office.phone}
                      </a>
                      <a href={`mailto:${office.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', fontWeight: 500 }}>
                        <Mail size={14} color="var(--primary)" /> {office.email}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
