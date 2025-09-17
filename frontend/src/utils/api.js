// Centralized API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  MOVIES: {
    ALL: `${API_BASE_URL}/api/movies/allMovie`,
    POPULAR: `${API_BASE_URL}/api/movies/popular`,
    UPCOMING: `${API_BASE_URL}/api/movies/upcoming`,
    SEARCH: `${API_BASE_URL}/api/movies/search`,
    BY_ID: (id) => `${API_BASE_URL}/api/movies/${id}`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  BOOKINGS: `${API_BASE_URL}/api/bookings`,
  SHOWTIMES: `${API_BASE_URL}/api/showtimes`,
  THEATERS: `${API_BASE_URL}/api/theaters`,
  REVIEWS: `${API_BASE_URL}/api/reviews`,
  PAYMENTS: `${API_BASE_URL}/api/payments`,
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to make authenticated API calls
export const apiCall = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
};

export default API_BASE_URL;
