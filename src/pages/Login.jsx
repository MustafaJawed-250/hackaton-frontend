import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Building2, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupError, setSetupError] = useState('');

  useEffect(() => {
    if (user && !user.mustChangePassword) navigate('/app');
    api.get('/setup/status')
      .then(({ data }) => {
        if (!data.data.isSetupComplete) setNeedsSetup(true);
        setSetupError('');
      })
      .catch((err) => {
        setNeedsSetup(false);
        setSetupError(err.response?.data?.message || 'Could not check company setup. The API or database may be unavailable.');
      });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const u = await login(email, password);
      if (u.mustChangePassword) navigate('/change-password');
      else navigate('/app');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #f7f6f3 0%, #e8e6e0 100%)', padding: '1.5rem',
    }}>
      <div className="card animate-in" style={{ width: '100%', maxWidth: 400, padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Link to="/" style={{ display: 'inline-block' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: 'var(--accent)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem',
            }}>
              <Building2 size={24} color="#fff" />
            </div>
          </Link>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Sign in to HCM Lite</p>
        </div>

        {needsSetup && (
          <div style={{
            background: 'var(--warning-soft)', color: 'var(--warning)', padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.88rem',
          }}>
            Company not set up yet.{' '}
            <Link to="/admin-access" style={{ fontWeight: 600 }}>Initialize as admin →</Link>
          </div>
        )}
        {setupError && (
          <div className="form-error" style={{ marginBottom: '1.25rem' }}>{setupError}</div>
        )}

        {info && (
          <div style={{
            background: 'var(--success-soft)', color: 'var(--success)', padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.88rem',
          }}>
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="form-error" style={{ marginBottom: '0.75rem' }}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <>Sign in <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          New here? <Link to="/get-started" style={{ fontWeight: 600 }}>Get started</Link>
          {' · '}
          <Link to="/" style={{ fontWeight: 600 }}>Home</Link>
        </p>
      </div>
    </div>
  );
}