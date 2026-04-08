import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dlr_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('dlr_token');
      localStorage.removeItem('dlr_user');
      if (window.location.pathname !== '/') window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

/* ── Auth ────────────────────────────────────────── */
export const authAPI = {
  getNonce:         (walletAddress) => api.post('/auth/nonce', { walletAddress }),
  verifySignature:  (data)          => api.post('/auth/verify', data),
  getMe:            ()              => api.get('/auth/me'),
};

/* ── Profile ─────────────────────────────────────── */
export const profileAPI = {
  get:    ()     => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  kyc:    (data) => api.post('/profile/kyc', data),
};

/* ── Land ────────────────────────────────────────── */
export const landAPI = {
  register:        (data)       => api.post('/land/register', data),
  list:            (params)     => api.get('/land', { params }),
  search:          (params)     => api.get('/land/search', { params }),
  getById:         (id)         => api.get(`/land/${id}`),
  update:          (id, data)   => api.put(`/land/${id}`, data),
  uploadDocuments: (id, data)   => api.post(`/land/${id}/upload-documents`, data),
  updateStatus:    (id, data)   => api.put(`/land/${id}/status`, data),
};

/* ── Co-Owner (nested under /land) ───────────────── */
export const coOwnerAPI = {
  add:       (landId, data)                    => api.post(`/land/${landId}/coowners`, data),
  list:      (landId)                          => api.get(`/land/${landId}/coowners`),
  uploadNoc: (landId, coOwnerId, formData)     => api.post(`/land/${landId}/coowners/${coOwnerId}/noc`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  signNoc:   (landId, coOwnerId, data)         => api.put(`/land/${landId}/coowners/${coOwnerId}/sign`, data),
};

/* ── Polygon (nested under /land) ────────────────── */
export const polygonAPI = {
  save:     (landId, data) => api.post(`/land/${landId}/polygon`, data),
  get:      (landId)       => api.get(`/land/${landId}/polygon`),
  validate: (landId)       => api.post(`/land/${landId}/polygon/validate`),
};

/* ── Transfer ────────────────────────────────────── */
export const transferAPI = {
  createOffer:      (data)      => api.post('/transfer/offer', data),
  accept:           (id)        => api.post(`/transfer/${id}/accept`),
  reject:           (id)        => api.post(`/transfer/${id}/reject`),
  getMyTransfers:   ()          => api.get('/transfer/my'),
  coownerConsent:   (id, data)  => api.post(`/transfer/${id}/coowner-consent`, data),
  finalize:         (id, data)  => api.post(`/transfer/${id}/finalize`, data),
};

/* ── Escrow ──────────────────────────────────────── */
export const escrowAPI = {
  getStatus: (transferId) => api.get(`/escrow/${transferId}`),
};

/* ── IPFS ────────────────────────────────────────── */
export const ipfsAPI = {
  upload:      (formData) => api.post('/ipfs/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getDocument: (cid)      => api.get(`/ipfs/${cid}`),
};

/* ── Verification ────────────────────────────────── */
export const verificationAPI = {
  getResults: (landId) => api.get(`/verification/${landId}`),
  trigger:    (landId) => api.post(`/verification/${landId}/trigger`),
};

/* ── Officer ─────────────────────────────────────── */
export const officerAPI = {
  listCases:   (params) => api.get('/officer/cases', { params }),
  getCaseById: (id)     => api.get(`/officer/cases/${id}`),
  approve:     (id, data) => api.post(`/officer/cases/${id}/approve`, data),
  reject:      (id, data) => api.post(`/officer/cases/${id}/reject`, data),
};

/* ── Notifications ───────────────────────────────── */
export const notificationAPI = {
  getAll:   ()   => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export default api;
