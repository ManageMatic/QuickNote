import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faBolt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Login.css';

const Login = ({ showAlert }) => {
  const [credentials, setCredentials] = React.useState({ email: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const host = 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${host}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        showAlert('Logged in successfully', 'success');
        navigate('/dashboard');
      } else {
        showAlert('Invalid credentials', 'error');
      }
    } catch {
      showAlert('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <div className="auth-page">
      {/* Left illustration panel */}
      <div className="auth-panel-left">
        <div className="auth-panel-glow" />
        <div className="auth-panel-content">
          <div className="auth-brand">
            <FontAwesomeIcon icon={faBolt} />
            <span>QuickNote</span>
          </div>
          <h2>Welcome back!</h2>
          <p>Your notes are waiting. Log in to pick up right where you left off.</p>
          <div className="auth-feature-list">
            {['Pinned & organised notes', 'Smart reminders', 'Secure JWT sessions'].map(f => (
              <div className="auth-feature-item" key={f}>
                <span className="auth-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-panel-orbs">
          <div className="auth-orb auth-orb-1" />
          <div className="auth-orb auth-orb-2" />
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-panel-right">
        <div className="auth-form-card glass">
          <h2 className="auth-title">Log in to <span className="gradient-text">QuickNote</span></h2>
          <p className="auth-subtitle">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrap">
                <FontAwesomeIcon icon={faEnvelope} className="auth-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-dark auth-input"
                  placeholder="you@example.com"
                  value={credentials.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="input-dark auth-input"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary-glow auth-submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : <>Log In <FontAwesomeIcon icon={faArrowRight} /></>}
            </button>
          </form>

          <div className="auth-footer-links">
            <p>Don't have an account? <Link to="/signup">Sign up free</Link></p>
            <p><Link to="/forgot-password">Forgot password?</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
