import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Payroll() {
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';
  const [list, setList] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    if (!isEmployee) {
      api.get('/payroll').then(({ data }) => setList(data.data));
    }
  };

  useEffect(() => { load(); }, [user]);

  const prepare = async () => {
    setLoading(true);
    setMsg('');
    try {
      await api.post('/payroll/prepare', { year, month });
      setMsg('Draft prepared');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const finalize = async () => {
    if (!confirm('Finalize payroll? This cannot be undone.')) return;
    setLoading(true);
    try {
      await api.post('/payroll/finalize', { year, month });
      setMsg('Payroll finalized');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadPayslip = async () => {
    try {
      const res = await api.get(`/payroll/payslip/${year}/${month}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip-${year}-${month}.pdf`;
      a.click();
    } catch {
      alert('Payslip not available for this period');
    }
  };

  if (isEmployee) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Payslips</h1>
            <p className="page-subtitle">Download finalized payslips</p>
          </div>
        </div>
        <div className="card" style={{ maxWidth: 360 }}>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input className="form-input" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Month</label>
            <input className="form-input" type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} />
          </div>
          <button className="btn btn-primary" onClick={downloadPayslip}>Download PDF</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll</h1>
          <p className="page-subtitle">Prepare and finalize monthly runs</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', maxWidth: 480 }}>
        <div className="row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Year</label>
            <input className="form-input" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ width: 100 }} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Month</label>
            <input className="form-input" type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} style={{ width: 80 }} />
          </div>
          <button className="btn btn-primary" disabled={loading} onClick={prepare} style={{ alignSelf: 'flex-end' }}>
            Prepare draft
          </button>
          {user?.role === 'admin' && (
            <button className="btn btn-secondary" disabled={loading} onClick={finalize} style={{ alignSelf: 'flex-end' }}>
              Finalize
            </button>
          )}
        </div>
        {msg && <p style={{ marginTop: 12, fontSize: '0.9rem' }}>{msg}</p>}
      </div>

      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr><th>Period</th><th>Status</th><th>Employees</th><th>Gross</th><th>Net</th><th>Tax</th></tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p._id}>
                <td>{p.month}/{p.year}</td>
                <td><span className={`badge badge-${p.status === 'finalized' ? 'success' : 'warning'}`}>{p.status}</span></td>
                <td>{p.items?.length || 0}</td>
                <td>PKR {p.totalGross?.toLocaleString()}</td>
                <td>PKR {p.totalNet?.toLocaleString()}</td>
                <td>PKR {p.totalTax?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
