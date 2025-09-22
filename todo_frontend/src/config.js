export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns configured backend API base URL. */
  return API_BASE_URL.replace(/\/+$/, '');
}
