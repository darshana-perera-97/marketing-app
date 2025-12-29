// LocalStorage utility functions

const STORAGE_KEYS = {
  USER_ID: 'userId',
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  IS_ADMIN: 'isAdmin'
};

/**
 * Save user data to localStorage
 */
export function saveUserData(user, token) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_ID, user.id.toString());
    localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, user.isAdmin ? 'true' : 'false');
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Get user ID from localStorage
 */
export function getUserId() {
  return localStorage.getItem(STORAGE_KEYS.USER_ID);
}

/**
 * Get user token from localStorage
 */
export function getUserToken() {
  return localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
}

/**
 * Get user data from localStorage
 */
export function getUserData() {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Check if user is admin
 */
export function isAdmin() {
  return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
}

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
  return !!getUserToken() && !!getUserId();
}

/**
 * Clear all user data from localStorage
 */
export function clearUserData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

