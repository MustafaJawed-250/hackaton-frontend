import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import Landing from './pages/landing';
import Login from './pages/Login';
import Setup from './pages/Setup';
import GetStarted from './pages/GetStarted';
import RegisterHR from './pages/RegisterHR';
import RegisterEmployee from './pages/RegisterEmployee';
import AdminAccess from './pages/AdminAccess';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import Analytics from './pages/Analytics';
import AIChat from './pages/AIChat';
import Settings from './pages/Settings';
import ChangePassword from './pages/ChangePassword';
import Announcements from './pages/Announcements';

function Protected({ children, roles, allowPasswordChange = false }) {
  const { user, loading, authError, refresh } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }
  if (!user && authError) {
    return (
      <div style={{ display: 'grid', placeContent: 'center', minHeight: '100vh', padding: '1.5rem', textAlign: 'center' }}>
        <p>{authError}</p>
        <button className="btn btn-primary" onClick={refresh} style={{ margin: '1rem auto' }}>Retry</button>
        <Link to="/login">Return to sign in</Link>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (user.mustChangePassword && !allowPasswordChange) {
    return <Navigate to="/change-password" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }
  return children;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }
  // Logged-in users go to app
  if (user?.mustChangePassword) return <Navigate to="/change-password" replace />;
  if (user && !user.mustChangePassword) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/get-started" element={<PublicOnly><GetStarted /></PublicOnly>} />
      <Route path="/register/hr" element={<PublicOnly><RegisterHR /></PublicOnly>} />
      <Route path="/register/employee" element={<PublicOnly><RegisterEmployee /></PublicOnly>} />
      <Route path="/admin-access" element={<AdminAccess />} />
      <Route path="/change-password" element={
        <Protected allowPasswordChange><ChangePassword /></Protected>
      } />

      {/* Authenticated app under /app */}
      <Route path="/app" element={<Protected><AppLayout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Protected roles={['admin', 'hr']}><Employees /></Protected>} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<Leave />} />
        <Route path="payroll" element={<Protected roles={['admin', 'hr', 'employee']}><Payroll /></Protected>} />
        <Route path="analytics" element={<Protected roles={['admin', 'hr']}><Analytics /></Protected>} />
        <Route path="ai" element={<AIChat />} />
        <Route path="settings" element={<Protected roles={['admin']}><Settings /></Protected>} />
        <Route path="announcements" element={<Announcements />} />
      </Route>

      {/* Legacy redirects */}
      <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      <Route path="/employees" element={<Navigate to="/app/employees" replace />} />
      <Route path="/attendance" element={<Navigate to="/app/attendance" replace />} />
      <Route path="/leave" element={<Navigate to="/app/leave" replace />} />
      <Route path="/payroll" element={<Navigate to="/app/payroll" replace />} />
      <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
      <Route path="/ai" element={<Navigate to="/app/ai" replace />} />
      <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
      <Route path="/announcements" element={<Navigate to="/app/announcements" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}