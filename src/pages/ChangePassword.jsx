import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ChangePassword() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      await refresh();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: '2rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>Change password</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          You must set a new password before continuing.
        </p>
        <form onSubmit={handle}>
          <div className="form-group">
            <label className="form-label">Current password</label>
            <input className="form-input" type="password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">New password (min 8)</label>
            <input className="form-input" type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} required minLength={8} />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Saving…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
