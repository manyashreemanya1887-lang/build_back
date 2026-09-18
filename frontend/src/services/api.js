const API_BASE = '/api';

export function getAuthHeaders() {
  const token = localStorage.getItem('rebuild_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(endpoint, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errData.message || errorMsg;
    } catch {
      errorMsg = response.statusText;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/auth/me'),

  // ML Endpoints
  predictMaterial: (formData) => apiRequest('/ml/predict-material', { method: 'POST', body: formData }),
  assessQuality: (data) => apiRequest('/ml/assess-quality', { method: 'POST', body: JSON.stringify(data) }),
  predictPrice: (data) => apiRequest('/ml/predict-price', { method: 'POST', body: JSON.stringify(data) }),
  imageSimilaritySearch: (formData) => apiRequest('/ml/image-search', { method: 'POST', body: formData }),
  submitFeedback: (data) => apiRequest('/ml/feedback', { method: 'POST', body: JSON.stringify(data) }),
  getModelMetrics: () => apiRequest('/ml/model-metrics'),

  // Listings
  getListings: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'All') {
        query.append(k, v);
      }
    });
    return apiRequest(`/listings?${query.toString()}`);
  },
  getListingDetail: (id) => apiRequest(`/listings/${id}`),
  createListing: (data) => apiRequest('/listings', { method: 'POST', body: JSON.stringify(data) }),
  updateListing: (id, data) => apiRequest(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteListing: (id) => apiRequest(`/listings/${id}`, { method: 'DELETE' }),
  toggleFavorite: (id) => apiRequest(`/listings/${id}/favorite`, { method: 'POST' }),

  // Purchases & Requests
  createPurchaseRequest: (data) => apiRequest('/purchases/request', { method: 'POST', body: JSON.stringify(data) }),
  getMyBuyerRequests: () => apiRequest('/purchases/my-requests'),
  getIncomingSellerRequests: () => apiRequest('/purchases/incoming-requests'),
  updateRequestStatus: (id, status) => apiRequest(`/purchases/request/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Environmental Impact
  getEnvironmentalSummary: () => apiRequest('/environmental/summary'),

  // Admin
  getAdminStats: () => apiRequest('/admin/statistics'),
  getAiMonitoring: () => apiRequest('/admin/ai-monitoring'),
  getUsers: () => apiRequest('/admin/users'),
  moderateListing: (id, action) => apiRequest(`/admin/moderate-listing/${id}?action=${action}`, { method: 'POST' })
};
