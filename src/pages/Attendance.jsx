import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn, LogOut, MapPin } from 'lucide-react';

export default function Attendance() {
  const { user } = useAuth();
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const isEmployee = user?.role === 'employee';

  const load = () => {
    if (isEmployee) {
      api.get('/attendance/today').then(({ data }) => setToday(data.data));
      api.get('/attendance/my').then(({ data }) => setHistory(data.data));
    } else {
      api.get('/attendance/board').then(({ data }) => setBoard(data.data));
    }
  };

  useEffect(() => { load(); }, [user]);

  const doCheckIn = async (withGeo = false) => {
    setLoading(true);
    setMsg('');
    try {
      let payload = { source: 'web' };
      if (withGeo && navigator.geolocation) {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
        );
        payload = {
          ...payload,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
      }
      await api.post('/attendance/check-in', payload);
      setMsg('Checked in successfully');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const doCheckOut = async () => {
    setLoading(true);
    setMsg('');
    try {
      await api.post('/attendance/check-out');
      setMsg('Checked out successfully');
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  if (isEmployee) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Attendance</h1>
            <p className="page-subtitle">Check in / out and history</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem', maxWidth: 420 }}>
          <div style={{ marginBottom: '1rem' }}>
            <div className="kpi-label">Today’s status</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: 4 }}>
              {today?.checkIn
                ? today.checkOut
                  ? <>Checked out · <span className="badge badge-success">{today.status}</span></>
                  : <>Checked in · <span className={`badge badge-${today.isLate ? 'warning' : 'success'}`}>{today.status}</span></>
                : 'Not checked in'}
            </div>
            {today?.checkIn && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
                In: {new Date(today.checkIn).toLocaleTimeString()}
                {today.checkOut && <> · Out: {new Date(today.checkOut).toLocaleTimeString()}</>}
                {today.workingHours > 0 && <> · {today.workingHours}h</>}
              </div>
            )}
          </div>
          <div className="row">
            {!today?.checkIn && (
              <>
                <button className="btn btn-primary" disabled={loading} onClick={() => doCheckIn(false)}>
                  <LogIn size={16} /> Check in
                </button>
                <button className="btn btn-secondary" disabled={loading} onClick={() => doCheckIn(true)}>
                  <MapPin size={16} /> Check in with location
                </button>
              </>
            )}
            {today?.checkIn && !today?.checkOut && (
              <button className="btn btn-primary" disabled={loading} onClick={doCheckOut}>
                <LogOut size={16} /> Check out
              </button>
            )}
          </div>
          {msg && <p style={{ marginTop: 12, fontSize: '0.9rem', color: msg.includes('success') ? 'var(--success)' : 'var(--danger)' }}>{msg}</p>}
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="card-header" style={{ padding: '1rem 1.25rem' }}>
            <h3 className="card-title">Recent history</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Date</th><th>In</th><th>Out</th><th>Hours</th><th>Status</th></tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r._id}>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '—'}</td>
                    <td>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '—'}</td>
                    <td>{r.workingHours || '—'}</td>
                    <td><span className={`badge badge-${r.status === 'late' || r.status === 'half_day' ? 'warning' : r.status === 'absent' ? 'danger' : 'success'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // HR / Admin board
  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Board</h1>
          <p className="page-subtitle">Today’s check-ins</p>
        </div>
        <button className="btn btn-secondary" onClick={load}>Refresh</button>
      </div>
      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr><th>Employee</th><th>Department</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr>
          </thead>
          <tbody>
            {board.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No records for today</td></tr>
            ) : board.map((r) => (
              <tr key={r._id}>
                <td>{r.employee?.firstName} {r.employee?.lastName}</td>
                <td>{r.employee?.department?.name || '—'}</td>
                <td>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '—'}</td>
                <td>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '—'}</td>
                <td><span className={`badge badge-${r.status === 'late' ? 'warning' : 'success'}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
