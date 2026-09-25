import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Anchor, LayoutDashboard, Package, MessageSquare, LogOut,
  Plus, Trash2, Pause, Play, CheckCircle2, XCircle, AlertCircle,
  Loader2, RefreshCw, Search, X, Eye, ChevronDown
} from 'lucide-react';
import {
  adminLogin, createShipment, getShipments, updateShipment,
  deleteShipment, getMessages
} from '../api';

// ── Fix leaflet icons ──────────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const currentIcon = L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:#e63030;border:2px solid white;border-radius:50%;box-shadow:0 0 0 3px rgba(230,48,48,0.3);"></div>`,
  iconSize: [14, 14], iconAnchor: [7, 7],
});

// ── Helpers ────────────────────────────────────────────────────────────────────
const geocodeAddress = async (query) => {
  if (!query.trim()) return null;
  // Try parsing as "lat,lng" first
  const parts = query.split(',');
  if (parts.length === 2) {
    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng, display: query };
  }
  // Use Nominatim geocoding
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name };
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const generateTrackingNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rand = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `LQO-${new Date().getFullYear()}-${rand(6)}`;
};

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { setError('Please enter username and password.'); return; }
    setLoading(true); setError('');
    try {
      const data = await adminLogin(form.username, form.password);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));
      onLogin(data.admin);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div className="logo-icon"><Anchor size={18} /></div>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Admin Login</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.82rem', margin: 0 }}>Logistiqo Control Center</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-3">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Logging in...</> : 'Login to Dashboard'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Admin access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}

// ── Shipment Form Modal ────────────────────────────────────────────────────────
function ShipmentModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    tracking_number: generateTrackingNumber(),
    sender_name: '',
    sender_address: '',
    receiver_name: '',
    receiver_address: '',
    start_location: '',
    end_location: '',
    total_hours: '',
    weight: '',
    description: '',
    package_type: '',
  });
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [errors, setErrors] = useState({});
  const [geoError, setGeoError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.tracking_number.trim()) e.tracking_number = 'Required';
    if (!form.start_location.trim()) e.start_location = 'Required';
    if (!form.end_location.trim()) e.end_location = 'Required';
    if (!form.total_hours || isNaN(form.total_hours) || Number(form.total_hours) <= 0) e.total_hours = 'Enter valid hours > 0';
    if (!form.weight.trim()) e.weight = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setGeocoding(true); setGeoError('');
    try {
      const [startGeo, endGeo] = await Promise.all([
        geocodeAddress(form.start_location),
        geocodeAddress(form.end_location),
      ]);
      if (!startGeo) { setGeoError(`Could not find location: "${form.start_location}". Try "City, Country" or "lat, lng".`); setGeocoding(false); return; }
      if (!endGeo) { setGeoError(`Could not find location: "${form.end_location}". Try "City, Country" or "lat, lng".`); setGeocoding(false); return; }
      setGeocoding(false);

      setLoading(true);
      await createShipment({
        ...form,
        start_lat: startGeo.lat,
        start_lng: startGeo.lng,
        end_lat: endGeo.lat,
        end_lng: endGeo.lng,
        total_hours: Number(form.total_hours),
      });
      onCreated();
      onClose();
    } catch (err) {
      setGeoError(err.message || 'Error creating shipment');
      setGeocoding(false);
      setLoading(false);
    }
  };

  const f = (name, value) => {
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: 'white', borderRadius: 'var(--radius-xl)',
        width: '100%', maxWidth: 780, maxHeight: '90vh', overflowY: 'auto',
        padding: '2rem', position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem' }}>Create New Shipment</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
            <X size={24} />
          </button>
        </div>

        {geoError && <div className="alert alert-error mb-3"><AlertCircle size={16} />{geoError}</div>}

        <form onSubmit={handleSubmit}>
          {/* Tracking Number */}
          <div className="form-group">
            <label className="form-label">Tracking Number *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className={`form-control ${errors.tracking_number ? 'error' : ''}`}
                value={form.tracking_number}
                onChange={e => f('tracking_number', e.target.value.toUpperCase())}
              />
              <button type="button" className="btn btn-outline btn-sm"
                onClick={() => f('tracking_number', generateTrackingNumber())}
                style={{ whiteSpace: 'nowrap' }}>
                <RefreshCw size={14} /> Generate
              </button>
            </div>
            {errors.tracking_number && <div className="form-error">{errors.tracking_number}</div>}
          </div>

          {/* Sender & Receiver */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Sender Name</label>
              <input className="form-control" value={form.sender_name} onChange={e => f('sender_name', e.target.value)} placeholder="Company or Person Name" />
            </div>
            <div className="form-group">
              <label className="form-label">Sender Address</label>
              <input className="form-control" value={form.sender_address} onChange={e => f('sender_address', e.target.value)} placeholder="Full address" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Receiver Name</label>
              <input className="form-control" value={form.receiver_name} onChange={e => f('receiver_name', e.target.value)} placeholder="Company or Person Name" />
            </div>
            <div className="form-group">
              <label className="form-label">Receiver Address</label>
              <input className="form-control" value={form.receiver_address} onChange={e => f('receiver_address', e.target.value)} placeholder="Full address" />
            </div>
          </div>

          {/* Locations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Origin Location * <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(City, Country or lat,lng)</span></label>
              <input
                className={`form-control ${errors.start_location ? 'error' : ''}`}
                value={form.start_location}
                onChange={e => f('start_location', e.target.value)}
                placeholder="New York, USA"
              />
              {errors.start_location && <div className="form-error">{errors.start_location}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Destination Location * <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(City, Country or lat,lng)</span></label>
              <input
                className={`form-control ${errors.end_location ? 'error' : ''}`}
                value={form.end_location}
                onChange={e => f('end_location', e.target.value)}
                placeholder="London, UK"
              />
              {errors.end_location && <div className="form-error">{errors.end_location}</div>}
            </div>
          </div>

          {/* Duration, Weight, Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Transit Duration (Hours) *</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                className={`form-control ${errors.total_hours ? 'error' : ''}`}
                value={form.total_hours}
                onChange={e => f('total_hours', e.target.value)}
                placeholder="72"
              />
              {errors.total_hours && <div className="form-error">{errors.total_hours}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Weight *</label>
              <input
                className={`form-control ${errors.weight ? 'error' : ''}`}
                value={form.weight}
                onChange={e => f('weight', e.target.value)}
                placeholder="500 kg"
              />
              {errors.weight && <div className="form-error">{errors.weight}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Package Type</label>
              <select className="form-control" value={form.package_type} onChange={e => f('package_type', e.target.value)}>
                <option value="">Select type</option>
                <option>FCL Container</option>
                <option>LCL Container</option>
                <option>Air Cargo</option>
                <option>Pallet</option>
                <option>Crate</option>
                <option>Parcel</option>
                <option>Bulk Cargo</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Notes</label>
            <textarea
              className="form-control"
              value={form.description}
              onChange={e => f('description', e.target.value)}
              placeholder="Cargo contents, special handling instructions, fragile, temperature-sensitive, etc."
              rows={2}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline flex-1" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-1" disabled={loading || geocoding}>
              {geocoding
                ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Geocoding locations...</>
                : loading
                  ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Creating...</>
                  : <><Plus size={16} /> Create Shipment</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Mini Map for admin ─────────────────────────────────────────────────────────
function AdminMiniMap({ shipment }) {
  if (!shipment) return null;
  const elapsedMs = shipment.is_paused ? parseFloat(shipment.elapsed_hours || 0) * 3600000 : Date.now() - new Date(shipment.started_at).getTime();
  const totalMs = parseFloat(shipment.total_hours) * 3600000;
  let progress = Math.min(Math.max(elapsedMs / totalMs, 0), 1);
  if (shipment.status === 'Delivered') progress = 1;

  const currentLat = parseFloat(shipment.start_lat) + (parseFloat(shipment.end_lat) - parseFloat(shipment.start_lat)) * progress;
  const currentLng = parseFloat(shipment.start_lng) + (parseFloat(shipment.end_lng) - parseFloat(shipment.start_lng)) * progress;
  const center = [currentLat || 0, currentLng || 0];

  return (
    <div className="admin-map-wrapper">
      <MapContainer center={center} zoom={3} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        <Polyline positions={[[shipment.start_lat, shipment.start_lng], [shipment.end_lat, shipment.end_lng]]} color="#e5e7eb" weight={2} dashArray="5 8" />
        <Polyline positions={[[shipment.start_lat, shipment.start_lng], [currentLat, currentLng]]} color="var(--primary)" weight={3} />
        <Marker position={[currentLat, currentLng]} icon={currentIcon}>
          <Popup>{shipment.tracking_number}<br />Progress: {progress * 100}%</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

// ── Main Admin Dashboard ───────────────────────────────────────────────────────
export default function Admin() {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [shipments, setShipments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const data = await getShipments();
      setShipments(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch {}
  };

  useEffect(() => {
    if (admin) {
      fetchShipments();
      fetchMessages();
    }
  }, [admin]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  const handlePauseResume = async (shipment) => {
    const key = shipment.tracking_number;
    setActionLoading(p => ({ ...p, [key]: true }));
    try {
      const now = Date.now();
      const startedAt = new Date(shipment.started_at).getTime();
      const elapsed = (now - startedAt) / 3600000;
      const new_elapsed = shipment.is_paused
        ? parseFloat(shipment.elapsed_hours) // resuming — keep elapsed
        : Math.min(elapsed, parseFloat(shipment.total_hours)); // pausing — save current elapsed
      
      await updateShipment(key, {
        is_paused: !shipment.is_paused,
        elapsed_hours: new_elapsed,
      });
      showToast(`Shipment ${key} ${!shipment.is_paused ? 'paused' : 'resumed'} successfully.`);
      fetchShipments();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(p => ({ ...p, [key]: false }));
    }
  };

  const handleMarkDelivered = async (tracking_number) => {
    setActionLoading(p => ({ ...p, [tracking_number]: true }));
    try {
      await updateShipment(tracking_number, { status: 'Delivered', is_paused: false, elapsed_hours: 9999 });
      showToast(`Shipment ${tracking_number} marked as delivered.`);
      fetchShipments();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(p => ({ ...p, [tracking_number]: false }));
    }
  };

  const handleDelete = async (tracking_number) => {
    if (!window.confirm(`Delete shipment ${tracking_number}? This action cannot be undone.`)) return;
    setActionLoading(p => ({ ...p, [tracking_number]: true }));
    try {
      await deleteShipment(tracking_number);
      showToast(`Shipment ${tracking_number} deleted.`);
      setSelectedShipment(null);
      fetchShipments();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(p => ({ ...p, [tracking_number]: false }));
    }
  };

  const filteredShipments = useMemo(() =>
    shipments.filter(s =>
      s.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
      (s.sender_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.receiver_name || '').toLowerCase().includes(search.toLowerCase()) ||
      s.start_location.toLowerCase().includes(search.toLowerCase()) ||
      s.end_location.toLowerCase().includes(search.toLowerCase())
    ), [shipments, search]);

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'In Transit' && !s.is_paused).length,
    paused: shipments.filter(s => s.is_paused).length,
    delivered: shipments.filter(s => s.status === 'Delivered').length,
  };

  if (!admin) return <LoginForm onLogin={setAdmin} />;

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'shipments', label: 'Shipments', icon: <Package size={18} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 99999,
          background: toast.type === 'error' ? '#b91c1c' : '#15803d',
          color: 'white', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)', display: 'flex', alignItems: 'center', gap: '0.75rem',
          fontSize: '0.9rem', fontWeight: 500,
        }}>
          {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="logo-icon"><Anchor size={16} /></div>
          Logisti<span>qo</span>
        </div>

        <div style={{ marginBottom: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Logged in as</div>
          <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{admin.username}</div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />

        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            className={`admin-nav-item ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {icon} {label}
            {id === 'messages' && messages.length > 0 && (
              <span style={{
                marginLeft: 'auto', background: 'var(--primary)',
                color: 'white', borderRadius: '9999px', padding: '0.1rem 0.5rem',
                fontSize: '0.7rem', fontWeight: 700,
              }}>{messages.length}</span>
            )}
          </button>
        ))}

        <div style={{ flex: 1 }} />
        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="fade-in">
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Dashboard</h1>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Overview of all logistics operations</p>
            </div>

            {/* Stats */}
            <div className="admin-stats-grid">
              {[
                { label: 'Total Shipments', value: stats.total, bg: 'rgba(99,102,241,0.1)', color: '#6366f1', icon: <Package size={22} /> },
                { label: 'In Transit', value: stats.inTransit, bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', icon: <Package size={22} /> },
                { label: 'Paused', value: stats.paused, bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', icon: <Pause size={22} /> },
                { label: 'Delivered', value: stats.delivered, bg: 'rgba(34,197,94,0.1)', color: '#22c55e', icon: <CheckCircle2 size={22} /> },
              ].map(({ label, value, bg, color, icon }) => (
                <div className="admin-stat" key={label}>
                  <div className="admin-stat-icon" style={{ background: bg, color }}>{icon}</div>
                  <div>
                    <div className="admin-stat-num" style={{ color }}>{value}</div>
                    <div className="admin-stat-label">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Shipments */}
            <div className="admin-card">
              <div className="admin-card-title">
                <Package size={18} />
                Recent Shipments
                <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowModal(true)}>
                  <Plus size={14} /> New Shipment
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Tracking #</th>
                      <th>Route</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.slice(0, 5).map(s => (
                      <tr key={s.tracking_number}>
                        <td><span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>{s.tracking_number}</span></td>
                        <td style={{ fontSize: '0.82rem' }}>{s.start_location} → {s.end_location}</td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
                            background: s.status === 'Delivered' ? 'rgba(34,197,94,0.1)' : s.is_paused ? 'rgba(156,163,175,0.1)' : 'rgba(245,158,11,0.1)',
                            color: s.status === 'Delivered' ? '#16a34a' : s.is_paused ? '#6b7280' : '#d97706',
                          }}>
                            {s.status === 'Delivered' ? 'Delivered' : s.is_paused ? 'Paused' : 'In Transit'}
                          </span>
                        </td>
                        <td>
                          <div style={{ width: 100, height: 6, background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${s.status === 'Delivered' ? 100 : Math.min(100, ((Date.now() - new Date(s.started_at).getTime()) / (s.total_hours * 3600000)) * 100)}%`, background: 'var(--primary)', borderRadius: '9999px', transition: 'width 0.5s' }} />
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => { setSelectedShipment(s); setActiveTab('shipments'); }}
                          >
                            <Eye size={12} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {shipments.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No shipments yet. Create one to get started.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Shipments Tab */}
        {activeTab === 'shipments' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Shipments</h1>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{shipments.length} total shipments</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn btn-outline btn-sm" onClick={fetchShipments} disabled={loading}>
                  <RefreshCw size={14} /> Refresh
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                  <Plus size={14} /> New Shipment
                </button>
              </div>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: 400 }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search by tracking number, name, route..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedShipment ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
              {/* Table */}
              <div className="admin-card" style={{ overflow: 'auto' }}>
                <div className="admin-card-title">
                  <Package size={18} />All Shipments
                </div>
                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="spinner" />
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Tracking #</th>
                        <th>Route</th>
                        <th>Weight</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShipments.map(s => {
                        const isLoading = actionLoading[s.tracking_number];
                        return (
                          <tr
                            key={s.tracking_number}
                            style={{ cursor: 'pointer', background: selectedShipment?.tracking_number === s.tracking_number ? 'rgba(230,48,48,0.04)' : '' }}
                            onClick={() => setSelectedShipment(s)}
                          >
                            <td>
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>
                                {s.tracking_number}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.8rem' }}>
                              <div>{s.start_location}</div>
                              <div style={{ color: 'var(--text-muted)' }}>→ {s.end_location}</div>
                            </td>
                            <td style={{ fontSize: '0.82rem' }}>{s.weight || '—'}</td>
                            <td>
                              <span style={{
                                padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700,
                                background: s.status === 'Delivered' ? 'rgba(34,197,94,0.1)' : s.is_paused ? 'rgba(156,163,175,0.1)' : 'rgba(245,158,11,0.1)',
                                color: s.status === 'Delivered' ? '#16a34a' : s.is_paused ? '#6b7280' : '#d97706',
                              }}>
                                {s.status === 'Delivered' ? '✅ Delivered' : s.is_paused ? '⏸ Paused' : '🚀 In Transit'}
                              </span>
                            </td>
                            <td onClick={e => e.stopPropagation()}>
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {s.status !== 'Delivered' && (
                                  <button
                                    className={`btn btn-sm ${s.is_paused ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ fontSize: '0.72rem', padding: '0.35rem 0.7rem' }}
                                    onClick={() => handlePauseResume(s)}
                                    disabled={isLoading}
                                    title={s.is_paused ? 'Resume shipment' : 'Pause shipment'}
                                  >
                                    {isLoading ? <Loader2 size={11} style={{ animation: 'spin 0.8s linear infinite' }} />
                                      : s.is_paused ? <><Play size={11} /> Resume</> : <><Pause size={11} /> Pause</>}
                                  </button>
                                )}
                                {s.status !== 'Delivered' && (
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    style={{ fontSize: '0.72rem', padding: '0.35rem 0.7rem' }}
                                    onClick={() => handleMarkDelivered(s.tracking_number)}
                                    disabled={isLoading}
                                    title="Mark as delivered"
                                  >
                                    <CheckCircle2 size={11} /> Done
                                  </button>
                                )}
                                <button
                                  className="btn btn-sm"
                                  style={{ fontSize: '0.72rem', padding: '0.35rem 0.7rem', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
                                  onClick={() => handleDelete(s.tracking_number)}
                                  disabled={isLoading}
                                  title="Delete shipment"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredShipments.length === 0 && (
                        <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No shipments found.</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Detail Panel */}
              {selectedShipment && (
                <div className="admin-card fade-in">
                  <div className="admin-card-title">
                    <Package size={18} />
                    {selectedShipment.tracking_number}
                    <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }} onClick={() => setSelectedShipment(null)}>
                      <X size={18} />
                    </button>
                  </div>

                  <AdminMiniMap shipment={selectedShipment} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
                    {[
                      { label: 'Status', value: selectedShipment.is_paused ? '⏸ Paused' : selectedShipment.status === 'Delivered' ? '✅ Delivered' : '🚀 In Transit' },
                      { label: 'Weight', value: selectedShipment.weight },
                      { label: 'Package Type', value: selectedShipment.package_type },
                      { label: 'Duration', value: `${selectedShipment.total_hours}h` },
                      { label: 'Origin', value: selectedShipment.start_location },
                      { label: 'Destination', value: selectedShipment.end_location },
                      { label: 'Sender', value: selectedShipment.sender_name },
                      { label: 'Receiver', value: selectedShipment.receiver_name },
                      { label: 'Created', value: formatDate(selectedShipment.created_at) },
                      { label: 'Expected Delivery', value: formatDate(selectedShipment.expected_delivery) },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>{value || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {selectedShipment.description && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-mid)' }}>
                      <strong>Notes:</strong> {selectedShipment.description}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                    {selectedShipment.status !== 'Delivered' && (
                      <>
                        <button
                          className={`btn btn-sm flex-1 ${selectedShipment.is_paused ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => handlePauseResume(selectedShipment)}
                          disabled={actionLoading[selectedShipment.tracking_number]}
                        >
                          {selectedShipment.is_paused ? <><Play size={14} /> Resume Shipment</> : <><Pause size={14} /> Pause Shipment</>}
                        </button>
                        <button
                          className="btn btn-sm btn-secondary flex-1"
                          onClick={() => handleMarkDelivered(selectedShipment.tracking_number)}
                          disabled={actionLoading[selectedShipment.tracking_number]}
                        >
                          <CheckCircle2 size={14} /> Mark Delivered
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-sm w-full"
                      style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
                      onClick={() => handleDelete(selectedShipment.tracking_number)}
                    >
                      <Trash2 size={14} /> Delete Shipment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="fade-in">
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Contact Messages</h1>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{messages.length} messages from clients</p>
            </div>
            <div className="admin-card">
              <div className="admin-card-title"><MessageSquare size={18} />Inbox</div>
              {messages.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No messages yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map(m => (
                    <div key={m.id} style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <span style={{ fontWeight: 700 }}>{m.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginLeft: '0.5rem' }}>{m.email}</span>
                          {m.phone && <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginLeft: '0.5rem' }}>· {m.phone}</span>}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDate(m.created_at)}</span>
                      </div>
                      {m.subject && <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>{m.subject}</div>}
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Shipment Modal */}
      {showModal && (
        <ShipmentModal
          onClose={() => setShowModal(false)}
          onCreated={() => { fetchShipments(); showToast('Shipment created successfully!'); }}
        />
      )}
    </div>
  );
}
