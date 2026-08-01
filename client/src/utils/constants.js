export const APP_NAME = import.meta.env.VITE_APP_NAME || 'StudyVault';

const envRenderUrl = import.meta.env.VITE_RENDER_URL;
const envApiUrl = import.meta.env.VITE_API_BASE_URL;

const defaultProdServer = envRenderUrl || (envApiUrl ? envApiUrl.replace(/\/api\/?$/, '') : 'https://study-vault-tbgz.onrender.com');

const rawApiUrl = import.meta.env.DEV
  ? '/api'
  : (envApiUrl || `${defaultProdServer.replace(/\/+$/, '')}/api`);

export const API_BASE_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : rawApiUrl.replace(/\/+$/, '') + '/api';

export const SERVER_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5000'
  : (envApiUrl
      ? envApiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '')
      : defaultProdServer.replace(/\/+$/, ''));

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};
