import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Building2, ArrowLeft } from 'lucide-react';

export default function RegisterHR() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    orgCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register-hr', {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        orgCode: form.orgCode.trim().toUpperCase(),
      });
      navigate('/login', { state: { message: 'HR account created. Please sign in.' } });
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.message
        || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #f8f7f4 0%, #ebe8e1 100%)', padding: '1.5rem',
    }}>
      <div className="card animate-in" style={{ width: '100%', maxWidth: 440, padding: '2rem' }}>
        <Link to="/get-started" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem',
        }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11, background: '#0f1c2e',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
          }}>
            <Building2 size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Sign up as HR</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Requires a company organization code from your admin
          </p>
        </div>
        <form onSubmit={handle}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })} required minLength={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Work email</label>
            <input className="form-input" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Organization code</label>
            <input className="form-input" value={form.orgCode}
              onChange={(e) => setForm({ ...form, orgCode: e.target.value })}
              placeholder="e.g. ACME2026" required minLength={4}
              style={{ textTransform: 'uppercase', fontFamily: 'var(--mono)' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Password (min 8)</label>
            <input className="form-input" type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input className="form-input" type="password" value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required minLength={8} />
          </div>
          {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating account…' : 'Create HR account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already registered? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}