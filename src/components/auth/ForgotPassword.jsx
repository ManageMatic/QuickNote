import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faKey, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const ForgotPassword = ({ showAlert }) => {
  const host = 'http://localhost:5000';
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/auth/send-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) { showAlert('Verification code sent to your email', 'success'); setStep(2); }
      else showAlert(data.error || 'Failed to send code', 'error');
    } catch { showAlert('Something went wrong!', 'error'); }
    finally { setLoading(false); }
  };

  const handleVerifyAndReset = async () => {
    if (!code || !password) return;
    setLoading(true);
    try {
      const res = await fetch(`${host}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) { showAlert('Password reset successfully', 'success'); navigate('/login'); }
      else showAlert(data.error || 'Failed to reset password', 'error');
    } catch { showAlert('Something went wrong!', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-panel-left">
        <div className="auth-panel-glow" />
        <div className="auth-panel-content">
          <div className="auth-brand">
            <FontAwesomeIcon icon={faKey} />
            <span>QuickNote</span>
          </div>
          <h2>Reset your password</h2>
          <p>Enter your email and we'll send a verification code. You'll be back in your notes in no time.</p>
          <div className="auth-feature-list">
            {['Secure OTP via email', 'Instant password reset', 'Tokens expire after 10 minutes'].map(f => (
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
          <h2 className="auth-title">Forgot <span className="gradient-text">Password?</span></h2>
          <p className="auth-subtitle">
            {step === 1 ? 'Enter your email to receive a reset code.' : 'Enter the code and your new password.'}
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="auth-form">
            {step === 1 && (
              <>
                <div className="auth-field">
                  <label htmlFor="email">Email address</label>
                  <div className="auth-input-wrap">
                    <FontAwesomeIcon icon={faEnvelope} className="auth-input-icon" />
                    <input
                      type="email" id="email" className="input-dark auth-input"
                      placeholder="you@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)} required
                    />
                  </div>
                </div>
                <button type="button" className="btn-primary-glow auth-submit" onClick={handleSendCode} disabled={loading || !email}>
                  {loading ? <span className="auth-spinner" /> : <>Send Reset Code <FontAwesomeIcon icon={faArrowRight} /></>}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="auth-field">
                  <label htmlFor="code">Verification Code</label>
                  <div className="auth-input-wrap">
                    <FontAwesomeIcon icon={faKey} className="auth-input-icon" />
                    <input
                      type="text" id="code" className="input-dark auth-input"
                      placeholder="6-digit code"
                      value={code} onChange={(e) => setCode(e.target.value)} required
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="newpw">New Password</label>
                  <div className="auth-input-wrap">
                    <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
                    <input
                      type="password" id="newpw" className="input-dark auth-input"
                      placeholder="Min. 5 characters"
                      value={password} onChange={(e) => setPassword(e.target.value)} required minLength={5}
                    />
                  </div>
                </div>
                <button type="button" className="btn-primary-glow auth-submit" onClick={handleVerifyAndReset} disabled={loading || !code || !password}>
                  {loading ? <span className="auth-spinner" /> : <>Reset Password <FontAwesomeIcon icon={faArrowRight} /></>}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
