import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search } from 'lucide-react';

export default function Employees() {
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', joiningDate: '', department: '', designation: '', basicSalary: '',
  });
  const [tempPwd, setTempPwd] = useState(null);
  const [error, setError] = useState('');

  const load = (page = 1) => {
    setLoading(true);
    api.get('/employees', { params: { page, q: q || undefined, limit: 20 } })
      .then(({ data }) => {
        setList(data.data);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get('/departments').then(({ data }) => setDepartments(data.data));
    api.get('/designations').then(({ data }) => setDesignations(data.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/employees', {
        ...form,
        basicSalary: Number(form.basicSalary),
      });
      setTempPwd(data.data.temporaryPassword);
      setShowForm(false);
      setForm({ firstName: '', lastName: '', email: '', joiningDate: '', department: '', designation: '', basicSalary: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Directory and registration</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add employee
        </button>
      </div>

      {tempPwd && (
        <div className="card" style={{ marginBottom: '1rem', background: 'var(--accent-soft)', borderColor: 'var(--accent)' }}>
          <strong>Temporary password:</strong> <code style={{ fontFamily: 'var(--mono)' }}>{tempPwd}</code>
          <p style={{ fontSize: '0.85rem', marginTop: 4, color: 'var(--text-secondary)' }}>
            Share securely. Employee must change it on first login.
          </p>
          <button className="btn btn-sm btn-secondary" style={{ marginTop: 8 }} onClick={() => setTempPwd(null)}>Dismiss</button>
        </div>
      )}

      <div className="row" style={{ marginBottom: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 32 }}
            placeholder="Search name, email, code…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
        </div>
        <button className="btn btn-secondary" onClick={() => load()}>Search</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
      ) : list.length === 0 ? (
        <div className="empty-state card">
          <h3>No employees</h3>
          <p>Add your first employee to get started.</p>
        </div>
      ) : (
        <div className="table-wrap card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e._id}>
                  <td><code style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>{e.employeeCode}</code></td>
                  <td>{e.firstName} {e.lastName}</td>
                  <td>{e.email}</td>
                  <td>{e.department?.name || '—'}</td>
                  <td>
                    <span className={`badge badge-${e.employmentStatus === 'active' ? 'success' : 'muted'}`}>
                      {e.employmentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }} onClick={() => setShowForm(false)}>
          <div className="card" style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Register employee</h2>
            <form onSubmit={handleCreate}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">First name</label>
                  <input className="form-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last name</label>
                  <input className="form-input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Joining date</label>
                <input className="form-input" type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
                    <option value="">Select…</option>
                    {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <select className="form-select" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required>
                    <option value="">Select…</option>
                    {designations.map((d) => <option key={d._id} value={d._id}>{d.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Basic salary (PKR)</label>
                <input className="form-input" type="number" min="1" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: e.target.value })} required />
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="row" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
