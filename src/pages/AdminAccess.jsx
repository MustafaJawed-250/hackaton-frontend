import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Building2, ArrowLeft, Shield } from 'lucide-react';

export default function AdminAccess() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | setup
  const [setupStatus, setSetupStatus] = useState(null);
  const [setupStatusError, setSetupStatusError] = useState('');
  const [statusLoading, setStatusLoading] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [setupForm, setSetupForm] = useState({
    companyName: '', adminEmail: '', adminPassword: '', orgCode: '',
  });

  const checkSetupStatus = async () => {
    setStatusLoading(true);
    setSetupStatusError('');
    try {
    const { data } = await api.get('/setup/status');
      setSetupStatus(data.data);
      if (!data.data.isSetupComplete) setMode('setup');
    } catch (err) {
      setSetupStatus(null);
      setSetupStatusError(err.response?.data?.message || 'Could not check company setup. The API or database may be unavailable.');
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/app');
      return;
    }
    checkSetupStatus();
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(loginForm.email, loginForm.password);
      if (u.role !== 'admin') {
        setError('This page is for administrators only. Use the main sign-in for other roles.');
        return;
      }
      if (u.mustChangePassword) navigate('/change-password');
      else navigate('/app');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/setup/initialize', {
        companyName: setupForm.companyName,
        adminEmail: setupForm.adminEmail,
        adminPassword: setupForm.adminPassword,
        orgCode: setupForm.orgCode.trim().toUpperCase() || undefined,
      });
      // Auto-login after setup
      await login(setupForm.adminEmail, setupForm.adminPassword);
      navigate('/app');
    } catch (err) {
      const d = err.response?.data;
      let msg = d?.message || 'Setup failed';
      if (d?.errors?.length) {
        msg = d.errors.map((e) => e.message).join('; ');
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0f1c2e 0%, #1a2d47 100%)', padding: '1.5rem',
    }}>
      <div className="card animate-in" style={{ width: '100%', maxWidth: 440, padding: '2rem' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem',
        }}>
          <ArrowLeft size={14} /> Home
        </Link>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11, background: '#0f1c2e',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
          }}>
            <Shield size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Admin access</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            {setupStatus && !setupStatus.isSetupComplete
              ? 'No company yet — complete first-time setup'
              : 'Sign in with your administrator account'}
          </p>
        </div>

        {statusLoading && <p role="status">Checking database setup status…</p>}
        {setupStatusError && (
          <div className="form-error" role="alert" style={{ marginBottom: 16 }}>
            {setupStatusError}{' '}
            <button type="button" className="btn btn-sm btn-secondary" onClick={checkSetupStatus}>Retry</button>
          </div>
        )}

        {setupStatus && !setupStatus.isSetupComplete && (
          <div style={{
            display: 'flex', gap: 8, marginBottom: 16,
            background: 'var(--bg-muted)', borderRadius: 8, padding: 4,
          }}>
            <button type="button" className={`btn btn-sm ${mode === 'setup' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1 }} onClick={() => setMode('setup')}>First-time setup</button>
            <button type="button" className={`btn btn-sm ${mode === 'login' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1 }} onClick={() => setMode('login')}>Sign in</button>
          </div>
        )}

        {!setupStatusError && mode === 'setup' && setupStatus && !setupStatus.isSetupComplete ? (
          <form onSubmit={handleSetup}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
              Admin credentials must match the backend ADMIN_EMAIL and ADMIN_PASSWORD configuration.
            </p>
            <div className="form-group">
              <label className="form-label">Company name</label>
              <input className="form-input" value={setupForm.companyName}
                onChange={(e) => setSetupForm({ ...setupForm, companyName: e.target.value })}
                required minLength={2} />
            </div>
            <div className="form-group">
              <label className="form-label">Organization code</label>
              <input className="form-input" value={setupForm.orgCode}
                onChange={(e) => setSetupForm({ ...setupForm, orgCode: e.target.value })}
                placeholder="Unique code for HR/employee signup e.g. ACME2026"
                required minLength={4} maxLength={16}
                style={{ textTransform: 'uppercase', fontFamily: 'var(--mono)' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Configured admin email</label>
              <input className="form-input" type="email" value={setupForm.adminEmail}
                onChange={(e) => setSetupForm({ ...setupForm, adminEmail: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Configured admin password</label>
              <input className="form-input" type="password" value={setupForm.adminPassword}
                onChange={(e) => setSetupForm({ ...setupForm, adminPassword: e.target.value })}
                required minLength={8} />
            </div>
            {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Initializing…' : 'Initialize company'}
            </button>
          </form>
        ) : !setupStatusError && !statusLoading ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Admin email</label>
              <input className="form-input" type="email" value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
            </div>
            {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Signing in…' : 'Sign in as admin'}
            </button>
          </form>
        ) : null}

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Not an admin? <Link to="/login" style={{ fontWeight: 600 }}>Main sign in</Link>
          {' · '}
          <Link to="/get-started" style={{ fontWeight: 600 }}>Get started</Link>
        </p>
      </div>
    </div>
  );
}