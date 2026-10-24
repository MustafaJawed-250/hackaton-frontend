import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const fetched = useRef(false);

  const fetchMe = useCallback(async () => {
    // Skip if no token — avoid noisy 401 on public pages
    const token = sessionStorage.getItem('hcm_token');
    if (!token) {
      setUser(null);
      setAuthError('');
      setLoading(false);
      return;
    }
    setLoading(true);
    setAuthError('');
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
    } catch (err) {
      setUser(null);
      if (err.response?.status === 401) {
        sessionStorage.removeItem('hcm_token');
      } else {
        setAuthError(err.response?.data?.message || 'Could not verify your session. Check the API and database connection.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Guard against React Strict Mode double-invoke in dev
    if (fetched.current) return;
    fetched.current = true;
    fetchMe();
  }, [fetchMe]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.data.token) {
      sessionStorage.setItem('hcm_token', data.data.token);
    }
    setUser(data.data.user);
    setAuthError('');
    return data.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    sessionStorage.removeItem('hcm_token');
    setUser(null);
    setAuthError('');
  };

  const value = { user, loading, authError, login, logout, refresh: fetchMe, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}