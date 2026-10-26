
import axios from 'axios';

const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? 'http://localhost:5000/api/v1'
      : 'https://hcm-backend-mu.vercel.app/api/v1')
  ).replace(/\/+$/, ''),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});




api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('hcm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public paths that must never force a login redirect on 401
const PUBLIC_PATH_PREFIXES = [
  '/',
  '/login',
  '/setup',
  '/get-started',
  '/register',
  '/admin-access',
];

function isPublicPath(pathname) {
  if (pathname === '/') return true;
  return PUBLIC_PATH_PREFIXES.some(
    (p) => p !== '/' && (pathname === p || pathname.startsWith(p + '/'))
  );
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem('hcm_token');
      // Only hard-redirect when the user is already on a protected app route.
      // Never bounce public visitors (landing, login, setup, register).
      const path = window.location.pathname;
      if (!isPublicPath(path) && !path.includes('/change-password')) {
        // Soft redirect only if we are inside the authenticated shell
        if (path.startsWith('/app') || path === '/dashboard') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;