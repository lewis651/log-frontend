import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Package, MapPin, Clock, Weight, AlertCircle, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import { trackShipment } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const currentIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;background:#e63030;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(230,48,48,0.3);animation:pulse 1.5s infinite;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const startIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;background:#0b1a2c;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const endIcon = L.divIcon({
  className: '',
  html: `<div style="width:22px;height:22px;background:#22c55e;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function MapBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 1) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [positions, map]);
  return null;
}

function getStatusClass(status, isMoving) {
  if (!isMoving && status === 'In Transit') return 'status-paused';
  switch (status) {
    case 'In Transit': return 'status-transit';
    case 'Delivered': return 'status-delivered';
    case 'Processing': return 'status-processing';
    default: return 'status-paused';
  }
}

function getStatusLabel(status, isMoving) {
  if (!isMoving && status === 'In Transit') return 'Temporarily Stopped';
  return status;
}

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('id') || '');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [livePos, setLivePos] = useState(null);
  const intervalRef = useRef(null);

  const fetchShipment = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    setShipment(null);
    try {
      const data = await trackShipment(id.trim().toUpperCase());
      setShipment(data);
      setLivePos([data.current_lat, data.current_lng]);
      navigate(`/tracking?id=${id.trim().toUpperCase()}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Tracking number not found. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) fetchShipment(id);
  }, []);

  // Poll live position every 10 seconds
  useEffect(() => {
    if (!shipment) return;
    clearInterval(intervalRef.current);
    if (shipment.is_moving) {
      intervalRef.current = setInterval(async () => {
        try {
          const data = await trackShipment(shipment.tracking_number);
          setShipment(data);
          setLivePos([data.current_lat, data.current_lng]);
        } catch {}
      }, 10000);
    }
    return () => clearInterval(intervalRef.current);
  }, [shipment?.tracking_number, shipment?.is_moving]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchShipment(query);
  };

  const mapPositions = useMemo(() => {
    if (!shipment) return null;
    return [
      [shipment.start_lat, shipment.start_lng],
      [shipment.current_lat || shipment.start_lat, shipment.current_lng || shipment.start_lng],
      [shipment.end_lat, shipment.end_lng],
    ];
  }, [shipment]);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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
              <span className="current">Track Shipment</span>
            </div>
            <h1>Track Your Shipment</h1>
            <p>Enter your tracking number to get real-time updates on your cargo location and delivery status.</p>
          </div>
        </div>
      </div>

      <div className="tracking-container">
        <div className="container">
          {/* Search Box */}
          <div className="tracking-search-box">
            <Package size={36} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h2>Enter Tracking Number</h2>
            <p>Your unique tracking ID is provided in your shipment confirmation</p>
            <form onSubmit={handleSubmit}>
              <div className="tracking-input-row">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value.toUpperCase())}
                  placeholder="e.g. LQO-2024-001"
                  style={{ letterSpacing: '0.05em' }}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Search size={18} />}
                  {loading ? 'Searching...' : 'Track'}
                </button>
              </div>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error" style={{ maxWidth: 640, margin: '0 auto 2rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Results */}
          {shipment && (
            <div className="tracking-result fade-in">
              {/* Header */}
              <div className="tracking-result-header">
                <div className="tracking-number-display">
                  <span>Tracking Number</span>
                  <strong>{shipment.tracking_number}</strong>
                </div>
                <div className={`tracking-status-badge ${getStatusClass(shipment.status, shipment.is_moving)}`}>
                  <span className="dot" />
                  {getStatusLabel(shipment.status, shipment.is_moving)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="tracking-progress-bar-wrapper">
                <div className="tracking-progress-label">
                  <span>📦 {shipment.start_location}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{shipment.progress}% complete</span>
                  <span>🏁 {shipment.end_location}</span>
                </div>
                <div className="tracking-progress-bar">
                  <div className="tracking-progress-fill" style={{ width: `${shipment.progress}%` }} />
                </div>
              </div>

              {/* Details Grid */}
              <div className="tracking-details-grid">
                <div className="tracking-detail-item">
                  <div className="tracking-detail-label">Sender</div>
                  <div className="tracking-detail-value">{shipment.sender_name || '—'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>{shipment.sender_address || ''}</div>
                </div>
                <div className="tracking-detail-item">
                  <div className="tracking-detail-label">Receiver</div>
                  <div className="tracking-detail-value">{shipment.receiver_name || '—'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>{shipment.receiver_address || ''}</div>
                </div>
                <div className="tracking-detail-item">
                  <div className="tracking-detail-label">Weight / Type</div>
                  <div className="tracking-detail-value">{shipment.weight || '—'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>{shipment.package_type || ''}</div>
                </div>
                <div className="tracking-detail-item">
                  <div className="tracking-detail-label">Expected Delivery</div>
                  <div className="tracking-detail-value">{formatDate(shipment.expected_delivery)}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Dispatched: {formatDate(shipment.started_at)}</div>
                </div>
              </div>

              {/* Map */}
              <div className="tracking-map-wrapper">
                <MapContainer
                  center={livePos || [shipment.start_lat, shipment.start_lng]}
                  zoom={4}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapBounds positions={mapPositions} />

                  {/* Dashed full route */}
                  <Polyline
                    positions={[[shipment.start_lat, shipment.start_lng], [shipment.end_lat, shipment.end_lng]]}
                    color="#cbd5e1"
                    weight={2}
                    dashArray="6 8"
                  />

                  {/* Traveled route */}
                  <Polyline
                    positions={[[shipment.start_lat, shipment.start_lng], livePos || [shipment.current_lat, shipment.current_lng]]}
                    color="var(--primary)"
                    weight={4}
                  />

                  {/* Start */}
                  <Marker position={[shipment.start_lat, shipment.start_lng]} icon={startIcon}>
                    <Popup><strong>Origin</strong><br />{shipment.start_location}</Popup>
                  </Marker>

                  {/* End */}
                  <Marker position={[shipment.end_lat, shipment.end_lng]} icon={endIcon}>
                    <Popup><strong>Destination</strong><br />{shipment.end_location}</Popup>
                  </Marker>

                  {/* Live position */}
                  {livePos && shipment.status !== 'Delivered' && (
                    <Marker position={livePos} icon={currentIcon}>
                      <Popup>
                        <strong>Current Location</strong><br />
                        {shipment.is_moving ? '🚀 Moving towards destination' : '⏸ Currently stationary'}
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>

                {/* Map legend */}
                <div style={{
                  position: 'absolute', bottom: '1.5rem', left: '1.5rem', zIndex: 1000,
                  background: 'white', padding: '1rem 1.25rem', borderRadius: '0.75rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb',
                  fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 12, height: 12, background: '#0b1a2c', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 1px #0b1a2c' }} />
                    <span style={{ color: '#374151', fontWeight: 500 }}>Origin</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 12, height: 12, background: '#e63030', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 1px #e63030' }} />
                    <span style={{ color: '#374151', fontWeight: 500 }}>Current Location</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 12, height: 12, background: '#22c55e', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 1px #22c55e' }} />
                    <span style={{ color: '#374151', fontWeight: 500 }}>Destination</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
