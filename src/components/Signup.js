// src/components/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Signup.css';
import signupIllustration from '../assets/signup-illustration.svg';

const host = 'http://localhost:5000';

const Signup = ({ showAlert }) => {
    /* ───────────────────────────────────────── state */
    const [credentials, setCredentials] = useState({
        name: '',
        email: '',
        password: '',
        cpassword: ''
    });

    const [code, setCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const navigate = useNavigate();

    /* ───────────────────────────────────────── handlers */
    const handleChange = (e) =>
        setCredentials({ ...credentials, [e.target.name]: e.target.value });

    /* 1️⃣  send verification code */
    const handleSendCode = async () => {
        setSending(true);
        try {
            const res = await fetch(`${host}/api/auth/send-signup-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: credentials.email })
            });

            if (res.ok) {
                setCodeSent(true);
                showAlert('Verification code sent to e‑mail', 'success');
            } else {
                const err = await res.json();
                showAlert(err.error || 'Failed to send code', 'error');
            }
        } catch (err) {
            showAlert('Network error', 'error');
        } finally {
            setSending(false);
        }
    };

    /* 2️⃣  verify code */
    const handleVerifyCode = async () => {
        setVerifying(true);
        try {
            const res = await fetch(`${host}/api/auth/verify-signup-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: credentials.email, code })
            });

            if (res.ok) {
                setEmailVerified(true);
                showAlert('E‑mail verified', 'success');
            } else {
                const err = await res.json();
                showAlert(err.error || 'Invalid / expired code', 'error');
            }
        } catch (err) {
            showAlert('Network error', 'error');
        } finally {
            setVerifying(false);
        }
    };

    /* 3️⃣  final signup (disabled until emailVerified === true) */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (credentials.password !== credentials.cpassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }
        const res = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                name: credentials.name,
                email: credentials.email,
                password: credentials.password
            })
        });

        if (res.ok) {
            showAlert('Account created successfully', 'success');
            navigate('/login');
        } else {
            const err = await res.json();
            showAlert(err.error || 'Failed to create account', 'error');
        }
    };

    return (
        <div className="signup-main">
            <div className="signup-box">
                <div className="signup-image-section">
                    <img src={signupIllustration} alt="signup" className="signup-image" />
                </div>
                <div className="signup-form-section">
                    <h2 className="signup-title">Signup for QuickNote</h2>
                    <p className="signup-subtitle">Create an account to manage your notes</p>
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input required id="name" name="name" type="text" className="form-control signup-input" value={credentials.name} onChange={handleChange} />
                        </div>
                        <div className="mb-3 email-input-wrapper">
                            <div className="email-verify-container">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input required id="email" name="email" type="email" className="signup-input signup-input" value={credentials.email}
                                    onChange={(e) => {
                                        /* reset verification if email changes again */
                                        setEmailVerified(false);
                                        setCodeSent(false);
                                        setCode('');
                                        handleChange(e);
                                    }} />
                            </div>
                            <button type="button" className="verify-btn-inside" disabled={sending || !credentials.email || emailVerified} onClick={handleSendCode}>
                                {sending ? 'Sending…' : emailVerified ? 'Verified' : 'Verify'}
                            </button>
                        </div>
                        {codeSent && !emailVerified && (
                            <div className="mb-3 code-input-wrapper">
                                <div className="code-input-container">
                                    <label htmlFor="code" className="form-label">Verification code</label>
                                    <input id="code" name="code" type="text" className="signup-input" value={code} onChange={(e) => setCode(e.target.value)} />
                                    <button type="button" className="verify-btn-inside code-submit-btn" disabled={verifying || code.length === 0} onClick={handleVerifyCode}>
                                        {verifying ? 'Verifying…' : 'Verify'}
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input required minLength={5} id="password" name="password" type="password" className="form-control signup-input" value={credentials.password} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                            <input required minLength={5} id="cpassword" name="cpassword" type="password" className="form-control signup-input" value={credentials.cpassword} onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn-signup" disabled={!emailVerified}>Signup</button>
                        <p className="signup-footer">Already have an account? <Link to="/login">Login</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
