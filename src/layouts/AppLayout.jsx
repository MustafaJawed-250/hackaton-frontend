import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarCheck, CalendarOff, Wallet,
  BarChart3, Bot, Settings, Megaphone, LogOut, Menu, Building2
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './layout.css';

const navByRole = {
  admin: [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/app/employees', icon: Users, label: 'Employees' },
    { to: '/app/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/app/leave', icon: CalendarOff, label: 'Leave' },
    { to: '/app/payroll', icon: Wallet, label: 'Payroll' },
    { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/app/ai', icon: Bot, label: 'AI Assistant' },
    { to: '/app/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/app/settings', icon: Settings, label: 'Settings' },
  ],
  hr: [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/app/employees', icon: Users, label: 'Employees' },
    { to: '/app/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/app/leave', icon: CalendarOff, label: 'Leave' },
    { to: '/app/payroll', icon: Wallet, label: 'Payroll' },
    { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/app/ai', icon: Bot, label: 'AI Assistant' },
    { to: '/app/announcements', icon: Megaphone, label: 'Announcements' },
  ],
  employee: [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/app/attendance', icon: CalendarCheck, label: 'My Attendance' },
    { to: '/app/leave', icon: CalendarOff, label: 'My Leave' },
    { to: '/app/payroll', icon: Wallet, label: 'Payslips' },
    { to: '/app/ai', icon: Bot, label: 'AI Assistant' },
    { to: '/app/announcements', icon: Megaphone, label: 'Announcements' },
  ],
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = navByRole[user?.role] || navByRole.employee;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Building2 size={22} strokeWidth={2} />
          <span>HCM Lite</span>
        </div>
        <nav className="sidebar-nav">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{user?.email?.[0]?.toUpperCase()}</div>
            <div className="user-meta">
              <div className="user-email">{user?.email}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ width: '100%', color: 'rgba(245,244,240,0.8)' }}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      <div className="main-area">
        <header className="topbar">
          <button className="btn btn-ghost menu-btn" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="topbar-right">
            <span className="role-pill">{user?.role}</span>
          </div>
        </header>
        <main className="main-content animate-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}