// API utility functions

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Get auth headers with token
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

/**
 * Make authenticated API request
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Login API call
 */
export async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

/**
 * Signup API call
 */
export async function signup(userData) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

/**
 * Get user profile
 */
export async function getUserProfile() {
  return apiRequest('/user/profile');
}

