export const APP_NAME = 'StudyVault';

const rawApiUrl = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || '/api');

export const API_BASE_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : rawApiUrl.replace(/\/+$/, '') + '/api';

export const SERVER_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5000'
  : (import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '')
      : 'http://localhost:5000');

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};
