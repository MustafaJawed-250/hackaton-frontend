import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Settings() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/settings').then(({ data }) => setForm(data.data));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/settings', {
        name: form.name,
        officeStartTime: form.officeStartTime,
        gracePeriodMinutes: Number(form.gracePeriodMinutes),
        halfDayThresholdHours: Number(form.halfDayThresholdHours),
        geofenceRadiusMeters: Number(form.geofenceRadiusMeters),
        officeLat: Number(form.officeLat),
        officeLng: Number(form.officeLng),
      });
      setMsg('Saved');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  if (!form) return <div className="spinner" style={{ margin: '3rem auto' }} />;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Organization Settings</h1>
          <p className="page-subtitle">Office rules, location, and org code</p>
        </div>
      </div>

      {form.orgCode && (
        <div className="card" style={{ marginBottom: '1.25rem', maxWidth: 520, background: 'var(--accent-soft)', borderColor: 'var(--accent)' }}>
          <div className="kpi-label">Organization code (share with HR & employees)</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '1.35rem', fontWeight: 700, marginTop: 4 }}>
            {form.orgCode}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 6 }}>
            HR and employees use this code when signing up. Do not share publicly.
          </p>
        </div>
      )}

      <form onSubmit={save} className="card" style={{ maxWidth: 520 }}>
        <div className="form-group">
          <label className="form-label">Company name</label>
          <input className="form-input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Office start (HH:MM)</label>
            <input className="form-input" value={form.officeStartTime || '09:00'} onChange={(e) => setForm({ ...form, officeStartTime: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Grace period (min)</label>
            <input className="form-input" type="number" value={form.gracePeriodMinutes ?? 15} onChange={(e) => setForm({ ...form, gracePeriodMinutes: e.target.value })} />
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Half-day threshold (hrs)</label>
            <input className="form-input" type="number" value={form.halfDayThresholdHours ?? 5} onChange={(e) => setForm({ ...form, halfDayThresholdHours: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Geofence radius (m)</label>
            <input className="form-input" type="number" value={form.geofenceRadiusMeters ?? 150} onChange={(e) => setForm({ ...form, geofenceRadiusMeters: e.target.value })} />
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Office latitude</label>
            <input className="form-input" type="number" step="any" value={form.officeLat ?? ''} onChange={(e) => setForm({ ...form, officeLat: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Office longitude</label>
            <input className="form-input" type="number" step="any" value={form.officeLng ?? ''} onChange={(e) => setForm({ ...form, officeLng: e.target.value })} />
          </div>
        </div>
        {msg && <p style={{ marginBottom: 12, color: msg === 'Saved' ? 'var(--success)' : 'var(--danger)' }}>{msg}</p>}
        <button className="btn btn-primary" type="submit">Save settings</button>
      </form>
    </div>
  );
}