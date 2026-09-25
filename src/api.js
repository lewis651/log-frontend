const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

// Auth
export const adminLogin = (username, password) =>
  fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(handleResponse);

// Shipments
export const createShipment = (data) =>
  fetch(`${API_BASE}/shipments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const getShipments = () =>
  fetch(`${API_BASE}/shipments`, { headers: getHeaders() }).then(handleResponse);

export const updateShipment = (tracking_number, data) =>
  fetch(`${API_BASE}/shipments/${tracking_number}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteShipment = (tracking_number) =>
  fetch(`${API_BASE}/shipments/${tracking_number}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

// Public Track
export const trackShipment = (tracking_number) =>
  fetch(`${API_BASE}/track/${tracking_number}`).then(handleResponse);

// Contact
export const submitContact = (data) =>
  fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const getMessages = () =>
  fetch(`${API_BASE}/contact`, { headers: getHeaders() }).then(handleResponse);
