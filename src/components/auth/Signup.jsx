import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faShieldAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/Login.css';

const host = 'http://localhost:5000';

const Signup = ({ showAlert }) => {
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '', cpassword: '' });
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSendCode = async () => {
    setSending(true);
    try {
      const res = await fetch(`${host}/api/auth/send-signup-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email }),
      });
      if (res.ok) { setCodeSent(true); showAlert('Verification code sent to e‑mail', 'success'); }
      else { const e = await res.json(); showAlert(e.error || 'Failed to send code', 'error'); }
    } catch { showAlert('Network error', 'error'); }
    finally { setSending(false); }
  };

  const handleVerifyCode = async () => {
    setVerifying(true);
    try {
      const res = await fetch(`${host}/api/auth/verify-signup-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, code }),
      });
      if (res.ok) { setEmailVerified(true); showAlert('E‑mail verified', 'success'); }
      else { const e = await res.json(); showAlert(e.error || 'Invalid / expired code', 'error'); }
    } catch { showAlert('Network error', 'error'); }
    finally { setVerifying(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.cpassword) { showAlert('Passwords do not match', 'error'); return; }
    setLoading(true);
    const res = await fetch(`${host}/api/auth/createuser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password }),
    });
    if (res.ok) { showAlert('Account created successfully', 'success'); navigate('/login'); }
    else { const e = await res.json(); showAlert(e.error || 'Failed to create account', 'error'); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-panel-left">
        <div className="auth-panel-glow" />
        <div className="auth-panel-content">
          <div className="auth-brand">
            <FontAwesomeIcon icon={faShieldAlt} />
            <span>QuickNote</span>
          </div>
          <h2>Start your journey</h2>
          <p>Create a free account in seconds and start capturing your ideas with a beautiful, secure app.</p>
          <div className="auth-feature-list">
            {['Email verification for security', 'Pin & favourite notes', 'Set reminders on notes'].map(f => (
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

      {/* Right form */}
      <div className="auth-panel-right">
        <div className="auth-form-card glass">
          <h2 className="auth-title">Create your <span className="gradient-text">account</span></h2>
          <p className="auth-subtitle">Free forever. No credit card required.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name */}
            <div className="auth-field">
              <label htmlFor="name">Full Name</label>
              <div className="auth-input-wrap">
                <FontAwesomeIcon icon={faUser} className="auth-input-icon" />
                <input id="name" name="name" type="text" className="input-dark auth-input" placeholder="John Doe" value={credentials.name} onChange={handleChange} required />
              </div>
            </div>

            {/* Email + verify */}
            <div className="auth-verify-row">
              <div className="auth-field">
                <label htmlFor="email">Email address</label>
                <div className="auth-input-wrap">
                  <FontAwesomeIcon icon={faEnvelope} className="auth-input-icon" />
                  <input
                    id="email" name="email" type="email"
                    className="input-dark auth-input"
                    placeholder="you@example.com"
                    value={credentials.email}
                    onChange={(e) => {
                      setEmailVerified(false); setCodeSent(false); setCode('');
                      handleChange(e);
                    }}
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                className={`btn-verify ${emailVerified ? 'verified' : ''}`}
                disabled={sending || !credentials.email || emailVerified}
                onClick={handleSendCode}
              >
                {sending ? '…' : emailVerified ? '✓ Verified' : 'Verify'}
              </button>
            </div>

            {/* OTP */}
            {codeSent && !emailVerified && (
              <div className="auth-code-row">
                <div className="auth-field">
                  <label htmlFor="code">Verification Code</label>
                  <input id="code" type="text" className="input-dark" placeholder="Enter 6-digit code" value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
                <button type="button" className="btn-verify" disabled={verifying || !code} onClick={handleVerifyCode}>
                  {verifying ? '…' : 'Submit'}
                </button>
              </div>
            )}

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
                <input id="password" name="password" type="password" className="input-dark auth-input" placeholder="Min. 5 characters" value={credentials.password} onChange={handleChange} required minLength={5} />
              </div>
            </div>

            {/* Confirm password */}
            <div className="auth-field">
              <label htmlFor="cpassword">Confirm Password</label>
              <div className="auth-input-wrap">
                <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
                <input id="cpassword" name="cpassword" type="password" className="input-dark auth-input" placeholder="Repeat password" value={credentials.cpassword} onChange={handleChange} required minLength={5} />
              </div>
            </div>

            <button type="submit" className="btn-primary-glow auth-submit" disabled={!emailVerified || loading}>
              {loading ? <span className="auth-spinner" /> : <>Create Account <FontAwesomeIcon icon={faArrowRight} /></>}
            </button>
          </form>

          <div className="auth-footer-links">
            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
