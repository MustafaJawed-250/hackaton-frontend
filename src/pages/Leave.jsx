import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Leave() {
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';
  const [balances, setBalances] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [pending, setPending] = useState([]);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    api.get('/leave/types').then(({ data }) => setTypes(data.data));
    if (isEmployee) {
      api.get('/leave/balance').then(({ data }) => setBalances(data.data));
      api.get('/leave/my').then(({ data }) => setMyLeaves(data.data));
    } else {
      api.get('/leave/pending').then(({ data }) => setPending(data.data));
    }
  };

  useEffect(() => { load(); }, [user]);

  const apply = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/leave/apply', form);
      setMsg('Leave request submitted');
      setShowForm(false);
      setForm({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    }
  };

  const decide = async (id, status) => {
    try {
      await api.post(`/leave/${id}/decide`, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  if (isEmployee) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Leave</h1>
            <p className="page-subtitle">Balances and requests</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Apply for leave</button>
        </div>

        <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
          {balances.map((b, i) => (
            <div className="kpi" key={i}>
              <div className="kpi-label">{b.leaveType?.name}</div>
              <div className="kpi-value">{b.remaining ?? '∞'}</div>
              <div className="kpi-sub">of {b.quota ?? 'Unlimited'} · used {b.used}</div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '1.5rem', maxWidth: 480 }}>
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>New leave request</h3>
            <form onSubmit={apply}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={form.leaveTypeId} onChange={(e) => setForm({ ...form, leaveTypeId: e.target.value })} required>
                  <option value="">Select…</option>
                  {types.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Start</label>
                  <input className="form-input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End</label>
                  <input className="form-input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <textarea className="form-textarea" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
              </div>
              {msg && <div className="form-error" style={{ color: msg.includes('submitted') ? 'var(--success)' : undefined }}>{msg}</div>}
              <div className="row">
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="table-wrap card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr>
            </thead>
            <tbody>
              {myLeaves.map((l) => (
                <tr key={l._id}>
                  <td>{l.leaveType?.name}</td>
                  <td>{new Date(l.startDate).toLocaleDateString()}</td>
                  <td>{new Date(l.endDate).toLocaleDateString()}</td>
                  <td>{l.days}</td>
                  <td>
                    <span className={`badge badge-${l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : l.status === 'pending' ? 'warning' : 'muted'}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Approvals</h1>
          <p className="page-subtitle">Pending requests</p>
        </div>
      </div>
      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {pending.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No pending requests</td></tr>
            ) : pending.map((l) => (
              <tr key={l._id}>
                <td>{l.employee?.firstName} {l.employee?.lastName}</td>
                <td>{l.leaveType?.name}</td>
                <td>{new Date(l.startDate).toLocaleDateString()}</td>
                <td>{new Date(l.endDate).toLocaleDateString()}</td>
                <td>{l.days}</td>
                <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.reason}</td>
                <td>
                  <div className="row">
                    <button className="btn btn-sm btn-primary" onClick={() => decide(l._id, 'approved')}>Approve</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => decide(l._id, 'rejected')}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
