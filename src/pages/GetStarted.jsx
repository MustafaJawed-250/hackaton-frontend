import { Link } from 'react-router-dom';
import { Building2, Shield, Users, Zap, ArrowLeft } from 'lucide-react';

const options = [
  {
    to: '/register/hr',
    icon: Shield,
    title: 'Sign up as HR',
    desc: 'Manage employees, attendance, leave approvals, and payroll drafts for your organization.',
  },
  {
    to: '/register/employee',
    icon: Users,
    title: 'Sign up as Employee',
    desc: 'Join your company with an organization code from HR. Track attendance, leave, and payslips.',
  },
  {
    to: '/admin-access',
    icon: Zap,
    title: 'Admin access',
    desc: 'Initialize a new company or sign in as an existing administrator.',
  },
];

export default function GetStarted() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f8f7f4 0%, #ebe8e1 100%)',
      padding: '2rem 1.25rem',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem',
        }}>
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: '#0f1c2e',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}>
            <Building2 size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f1c2e' }}>
            Get started with HCM Lite
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: '0.95rem' }}>
            Select the account type that matches your role
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {options.map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="card"
              style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                padding: '1.35rem 1.5rem', textDecoration: 'none', color: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: '#0f1c2e',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={20} />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 4 }}>{title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}