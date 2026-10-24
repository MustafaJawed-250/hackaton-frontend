import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Building2, ArrowLeft } from 'lucide-react';

export default function RegisterEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    orgCode: '',
    inviteCode: '',
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
      await api.post('/auth/register-employee', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        orgCode: form.orgCode.trim().toUpperCase(),
        inviteCode: form.inviteCode.trim() || undefined,
      });
      navigate('/login', { state: { message: 'Employee account created. Please sign in.' } });
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
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Sign up as Employee</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Use the organization code shared by your HR team
          </p>
        </div>
        <form onSubmit={handle}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">First name</label>
              <input className="form-input" value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input className="form-input" value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
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
            <label className="form-label">Invite code <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
            <input className="form-input" value={form.inviteCode}
              onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
              placeholder="If provided by HR" />
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
            {loading ? 'Creating account…' : 'Create employee account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already registered? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}