import React from 'react'
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import loginIllustration from '../assets/login-illustration.svg';

const Login = (props) => {
    const [credentials, setCredentials] = React.useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { showAlert } = props;
    const host = "http://localhost:5000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        if (response.ok) {
            showAlert("Logged in successfully", "success");
            navigate('/');
        } else {
            showAlert("Invalid credentials", "danger");
        }
    }

    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className="login-main">
            <div className="login-box">
                <div className="login-form-section">
                    <h2 className="login-title">Login to <span className="brand-color">QuickNote</span></h2>
                    <p className="login-subtitle">Manage your notes with ease</p>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" id="email" name="email" className="login-input" value={credentials.email} onChange={onchange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" id="password" name="password" className="login-input" value={credentials.password} onChange={onchange} />
                        </div>
                        <button type="submit" className="btn-login">Login</button>
                        <div className="login-footer">
                            <p>Don't have an account? <a href="/signup">Sign up</a></p>
                            <p>Forgot password? <a href="/reset-password">Reset it</a></p>
                        </div>
                    </form>
                </div>
                <div className="login-image-section">
                    <img src={loginIllustration} alt="Login" className="login-image" />
                </div>
            </div>
        </div>
    )
}

export default Login;
