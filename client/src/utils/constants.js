export const APP_NAME = 'StudyVault';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
  : 'http://localhost:5000';

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};
