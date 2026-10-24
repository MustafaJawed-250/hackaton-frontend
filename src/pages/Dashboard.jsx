import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, UserCheck, CalendarOff, Clock, Wallet, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = user?.role === 'employee' ? '/analytics/employee-dashboard' : '/analytics/dashboard';
    api.get(endpoint)
      .then(({ data: res }) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;
  }

  if (user?.role === 'employee') {
    return (
      <div className="animate-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Dashboard</h1>
            <p className="page-subtitle">Today’s overview and weekly progress</p>
          </div>
        </div>
        <div className="kpi-grid">
          <div className="kpi">
            <div className="kpi-label">Today</div>
            <div className="kpi-value" style={{ fontSize: '1.2rem' }}>
              {data?.today?.checkIn
                ? data.today.checkOut
                  ? 'Checked out'
                  : 'Checked in'
                : 'Not checked in'}
            </div>
            <div className="kpi-sub">
              {data?.today?.status && <span className={`badge badge-${data.today.status === 'late' ? 'warning' : 'success'}`}>{data.today.status}</span>}
            </div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Weekly hours</div>
            <div className="kpi-value">{data?.weeklyHours ?? 0}<span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}> / 40</span></div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Late arrivals (YTD)</div>
            <div className="kpi-value">{data?.lateCountYTD ?? 0}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Live workforce overview</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi">
          <div className="kpi-label"><Users size={14} style={{ verticalAlign: -2, marginRight: 4 }} /> Headcount</div>
          <div className="kpi-value">{data?.activeHeadcount ?? 0}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><UserCheck size={14} style={{ verticalAlign: -2, marginRight: 4 }} /> Present today</div>
          <div className="kpi-value">{data?.presentToday ?? 0}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><Clock size={14} style={{ verticalAlign: -2, marginRight: 4 }} /> Late today</div>
          <div className="kpi-value">{data?.lateToday ?? 0}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><CalendarOff size={14} style={{ verticalAlign: -2, marginRight: 4 }} /> On leave</div>
          <div className="kpi-value">{data?.onLeaveToday ?? 0}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><Wallet size={14} style={{ verticalAlign: -2, marginRight: 4 }} /> Payroll cost</div>
          <div className="kpi-value" style={{ fontSize: '1.25rem' }}>
            {data?.monthlyPayrollCost ? `PKR ${(data.monthlyPayrollCost / 1000).toFixed(0)}k` : '—'}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label"><TrendingUp size={14} style={{ verticalAlign: -2, marginRight: 4 }} /> Avg basic</div>
          <div className="kpi-value" style={{ fontSize: '1.25rem' }}>
            {data?.averageBasicSalary ? `PKR ${data.averageBasicSalary.toLocaleString()}` : '—'}
          </div>
        </div>
      </div>

      {data?.headcountByDepartment?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Headcount by department</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Department</th><th>Employees</th></tr>
              </thead>
              <tbody>
                {data.headcountByDepartment.map((d, i) => (
                  <tr key={i}>
                    <td>{d.name || 'Unassigned'}</td>
                    <td><strong>{d.count}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(!data || data.activeHeadcount === 0) && (
        <div className="empty-state card" style={{ marginTop: '1.5rem' }}>
          <h3>No employees yet</h3>
          <p>Register employees from the Employees page to see live metrics.</p>
        </div>
      )}
    </div>
  );
}
