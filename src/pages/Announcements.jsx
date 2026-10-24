import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Announcements() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title: '', body: '' });
  const canPost = ['admin', 'hr'].includes(user?.role);

  const load = () => api.get('/announcements').then(({ data }) => setList(data.data));
  useEffect(() => { load(); }, []);

  const post = async (e) => {
    e.preventDefault();
    await api.post('/announcements', form);
    setForm({ title: '', body: '' });
    load();
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">Company-wide updates</p>
        </div>
      </div>
      {canPost && (
        <form onSubmit={post} className="card" style={{ marginBottom: '1.5rem', maxWidth: 560 }}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Body</label>
            <textarea className="form-textarea" rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit">Post</button>
        </form>
      )}
      <div className="stack">
        {list.length === 0 && <div className="empty-state card"><h3>No announcements</h3></div>}
        {list.map((a) => (
          <div className="card" key={a._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <h3 style={{ fontWeight: 600 }}>{a.title}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {new Date(a.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
