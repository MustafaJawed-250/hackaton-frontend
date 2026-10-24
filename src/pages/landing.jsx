import { Link } from 'react-router-dom';
import {
  Building2, Users, CalendarCheck, CalendarOff, BarChart3,
  ArrowRight, Shield, Zap, CheckCircle2
} from 'lucide-react';
import './landing.css';

const features = [
  {
    icon: Users,
    title: 'Employee Management',
    desc: 'Centralized directory, profiles, departments, and role-based access for your entire workforce.',
  },
  {
    icon: CalendarCheck,
    title: 'Attendance Tracking',
    desc: 'Web check-in/out, late detection, geofencing, and real-time daily boards for HR.',
  },
  {
    icon: CalendarOff,
    title: 'Leave Management',
    desc: 'Balances, overlap checks, approval workflows, and working-day calculations out of the box.',
  },
  {
    icon: BarChart3,
    title: 'HR Analytics',
    desc: 'Headcount, attendance rates, payroll cost, and department insights from live data.',
  },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Nav */}
      <header className="land-nav">
        <div className="land-nav-inner">
          <Link to="/" className="land-brand">
            <Building2 size={22} strokeWidth={2} />
            <span>HCM Lite</span>
          </Link>
          <nav className="land-nav-links">
            <a href="#features">Features</a>
            <a href="#access">Get access</a>
            <Link to="/login" className="land-nav-signin">Sign in</Link>
            <Link to="/get-started" className="btn btn-primary btn-sm">Get started</Link>
          </nav>
          <Link to="/login" className="land-nav-mobile-cta btn btn-primary btn-sm">Sign in</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="land-hero">
        <div className="land-hero-inner">
          <p className="land-eyebrow">Human Capital Management</p>
          <h1 className="land-hero-title">
            People first.<br />
            <span className="land-hero-accent">Work smarter.</span>
          </h1>
          <p className="land-hero-desc">
            HCM Lite helps organizations manage employees, attendance, leave, and payroll
            in one calm, secure platform — built for HR teams that value clarity over clutter.
          </p>
          <div className="land-hero-cta">
            <Link to="/get-started" className="btn btn-primary btn-lg">
              Get started <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign in
            </Link>
          </div>
          <div className="land-hero-trust">
            <span><CheckCircle2 size={14} /> Role-based security</span>
            <span><CheckCircle2 size={14} /> Live analytics</span>
            <span><CheckCircle2 size={14} /> AI assistant</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="land-features">
        <div className="land-section-inner">
          <div className="land-section-header">
            <h2>Everything HR needs, nothing it doesn’t</h2>
            <p>Four focused modules that cover the full employee lifecycle.</p>
          </div>
          <div className="land-feature-grid">
            {features.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="land-feature-card">
                <div className="land-feature-icon">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Access options */}
      <section id="access" className="land-access">
        <div className="land-section-inner">
          <div className="land-section-header">
            <h2>Choose how you join</h2>
            <p>Three clear paths depending on your role in the organization.</p>
          </div>
          <div className="land-access-grid">
            <Link to="/register/hr" className="land-access-card">
              <div className="land-access-icon"><Shield size={22} /></div>
              <h3>Sign up as HR</h3>
              <p>Create an HR account to manage employees, leave, and payroll for your company.</p>
              <span className="land-access-link">Continue <ArrowRight size={14} /></span>
            </Link>
            <Link to="/register/employee" className="land-access-card">
              <div className="land-access-icon"><Users size={22} /></div>
              <h3>Sign up as Employee</h3>
              <p>Join with an organization code provided by your HR or administrator.</p>
              <span className="land-access-link">Continue <ArrowRight size={14} /></span>
            </Link>
            <Link to="/admin-access" className="land-access-card land-access-admin">
              <div className="land-access-icon"><Zap size={22} /></div>
              <h3>Admin access</h3>
              <p>First-time company setup or sign in as an existing administrator.</p>
              <span className="land-access-link">Continue <ArrowRight size={14} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="land-footer">
        <div className="land-footer-inner">
          <div className="land-footer-brand">
            <Building2 size={18} />
            <span>HCM Lite</span>
          </div>
          <div className="land-footer-links">
            <Link to="/login">Sign in</Link>
            <Link to="/get-started">Get started</Link>
            <Link to="/setup">Company setup</Link>
            <a href="#features">Features</a>
          </div>
          <p className="land-footer-copy">© {new Date().getFullYear()} HCM Lite · Saylani Hackathon</p>
        </div>
      </footer>
    </div>
  );
}