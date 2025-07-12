import React, { useState } from 'react';
import './styles/ForgotPassword.css';
import forgotImage from '../assets/Forgot password-illustartion.svg';
import { useNavigate } from 'react-router-dom';

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
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                showAlert('Verification code sent to your email', 'success');
                setStep(2);
            } else {
                showAlert(data.error || 'Failed to send code', 'error');
            }
        } catch (error) {
            showAlert('Something went wrong!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndReset = async () => {
        if (!code || !password) return;
        setLoading(true);
        try {
            const res = await fetch(`${host}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword: password })
            });
            const data = await res.json();
            if (res.ok) {
                showAlert('Password reset successfully', 'success');
                navigate('/login')
            } else {
                showAlert(data.error || 'Failed to reset password', 'error');
            }
        } catch (error) {
            showAlert('Something went wrong!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-main">
            <div className="forgot-box">
                <div className="forgot-image-section">
                    <img src={forgotImage} alt="forgot" className="forgot-image" />
                </div>
                <div className="forgot-form-section">
                    <h2 className='forgot-title'>Forgot Password</h2>
                    <p className='forgot-subtitle'>Reset access to your notes</p>

                    <form onSubmit={(e) => e.preventDefault()} className="forgot-form">
                        {step === 1 && (
                            <>
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="forgot-input" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <button type="button" className="btn-forgot" onClick={handleSendCode} disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Code'}
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <label htmlFor="code" className="form-label">Verification Code</label>
                                <input type="text" className="forgot-input" id="code" value={code} onChange={(e) => setCode(e.target.value)} required />
                                <label htmlFor="password" className="form-label">New Password</label>
                                <input type="password" className="forgot-input" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={5} />
                                <button type="button" className="btn-forgot" onClick={handleVerifyAndReset} disabled={loading}>
                                    {loading ? 'Resetting...' : 'Reset Password'}
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
