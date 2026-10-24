import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Building2 } from 'lucide-react';

export default function Setup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '', adminEmail: '', adminPassword: '', orgCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState('');

  const checkSetupStatus = async () => {
    setStatusLoading(true);
    setStatusError('');
    try {
      const { data } = await api.get('/setup/status');
      setAlreadyDone(!!data.data?.isSetupComplete);
    } catch (err) {
      setStatusError(err.response?.data?.message || 'Could not check company setup. The API or database may be unavailable.');
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/setup/initialize', {
        companyName: form.companyName,
        adminEmail: form.adminEmail,
        adminPassword: form.adminPassword,
        orgCode: form.orgCode.trim().toUpperCase() || undefined,
      });
      navigate('/login', { state: { message: 'Setup complete. Sign in with your admin account.' } });
    } catch (err) {
      const d = err.response?.data;
      let msg = d?.message || 'Setup failed';
      if (d?.errors?.length) msg = d.errors.map((x) => x.message).join('; ');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (alreadyDone) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(145deg, #f7f6f3 0%, #e8e6e0 100%)', padding: '1.5rem',
      }}>
        <div className="card" style={{ maxWidth: 400, padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Already set up</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            This company has already been initialized.
          </p>
          <Link to="/admin-access" className="btn btn-primary">Admin sign in</Link>
          {' '}
          <Link to="/login" className="btn btn-secondary">Main sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #f7f6f3 0%, #e8e6e0 100%)', padding: '1.5rem',
    }}>
      <div className="card animate-in" style={{ width: '100%', maxWidth: 440, padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'var(--accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem',
          }}>
            <Building2 size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Company Setup</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Create your organization with the backend-configured bootstrap admin credentials
          </p>
        </div>
        {statusLoading && <p role="status">Checking database setup status…</p>}
        {statusError && (
          <div className="form-error" role="alert" style={{ marginBottom: '0.75rem' }}>
            {statusError}{' '}
            <button type="button" className="btn btn-sm btn-secondary" onClick={checkSetupStatus}>Retry</button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Company name</label>
            <input className="form-input" value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })} required minLength={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Organization code</label>
            <input className="form-input" value={form.orgCode}
              onChange={(e) => setForm({ ...form, orgCode: e.target.value })}
              placeholder="e.g. ACME2026 (shared with HR/employees)"
              required minLength={4} maxLength={16}
              style={{ textTransform: 'uppercase', fontFamily: 'var(--mono)' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Configured admin email</label>
            <input className="form-input" type="email" value={form.adminEmail}
              onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Configured admin password</label>
            <input className="form-input" type="password" value={form.adminPassword}
              onChange={(e) => setForm({ ...form, adminPassword: e.target.value })} required minLength={8} />
          </div>
          {error && <div className="form-error" style={{ marginBottom: '0.75rem' }}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading || statusLoading || !!statusError} style={{ width: '100%' }}>
            {loading ? 'Initializing…' : 'Complete setup'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link to="/">Home</Link> · <Link to="/admin-access">Admin access</Link>
        </p>
      </div>
    </div>
  );
}