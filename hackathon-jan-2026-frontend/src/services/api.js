// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// OTJ Entry API calls
export const otjApi = {
  // Get all entries
  getAllEntries: () => apiCall('/entries'),

  // Get entry by ID
  getEntryById: (id) => apiCall(`/entries/${id}`),

  // Create new entry
  createEntry: (entry) => apiCall('/entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  }),

  // Update entry
  updateEntry: (id, entry) => apiCall(`/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  }),

  // Delete entry
  deleteEntry: (id) => apiCall(`/entries/${id}`, {
    method: 'DELETE',
  }),

  // Get total hours (if endpoint exists)
  getTotalHours: () => apiCall('/entries/total-hours'),
};

// KSB API calls
export const ksbApi = {
  // Get all KSBs
  getAllKSBs: () => apiCall('/ksbs'),

  // Get KSB by ID
  getKSBById: (id) => apiCall(`/ksbs/${id}`),

  // Create new KSB
  createKSB: (ksb) => apiCall('/ksbs', {
    method: 'POST',
    body: JSON.stringify(ksb),
  }),

  // Get KSBs by type (if endpoint exists)
  getKSBsByType: (type) => apiCall(`/ksbs/type/${type}`),
};

// Holiday API calls
export const holidayApi = {
  // Get all holidays
  getAllHolidays: () => apiCall('/holidays'),

  // Get holiday by ID
  getHolidayById: (id) => apiCall(`/holidays/${id}`),

  // Create new holiday record
  createHoliday: (holiday) => apiCall('/holidays', {
    method: 'POST',
    body: JSON.stringify(holiday),
  }),

  // Update holiday record
  updateHoliday: (id, holiday) => apiCall(`/holidays/${id}`, {
    method: 'PUT',
    body: JSON.stringify(holiday),
  }),

  // Delete holiday record
  deleteHoliday: (id) => apiCall(`/holidays/${id}`, {
    method: 'DELETE',
  }),
};

export default { otjApi, ksbApi, holidayApi };
