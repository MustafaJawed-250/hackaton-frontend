import { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/analytics/dashboard').then(({ data: res }) => setData(res.data));
  }, []);

  if (!data) return <div className="spinner" style={{ margin: '3rem auto' }} />;

  const chartData = (data.headcountByDepartment || []).map((d) => ({
    name: d.name || 'N/A',
    count: d.count,
  }));

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Workforce insights from live data</p>
        </div>
      </div>
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi">
          <div className="kpi-label">Active headcount</div>
          <div className="kpi-value">{data.activeHeadcount}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Present today</div>
          <div className="kpi-value">{data.presentToday}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Late today</div>
          <div className="kpi-value">{data.lateToday}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">On leave</div>
          <div className="kpi-value">{data.onLeaveToday}</div>
        </div>
      </div>
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Headcount by department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
