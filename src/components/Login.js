import React from 'react'
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Login = (props) => {

    const [credentials, setCredentials] = React.useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { showAlert } = props;
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
        const response = await fetch("http://localhost:5000/api/auth/login", {
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
        <div className="login-container my-3">
            <h1 className="login-title">Login to QuickNote</h1>
            <p className="login-subtitle">Manage and access your notes efficiently</p>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control login-input"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={onchange}
                        aria-describedby="emailHelp"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control login-input"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={onchange}
                    />
                </div>
                <button type="submit" className="btn btn-login">Login</button>
                <div className="login-footer">
                    <p className="login-footer-text">Don't have an account? <a href="/signup" className="login-footer-link">Sign up</a></p>
                    <p className="login-footer-text">Forget your password? <a href="/reset-password" className="login-footer-link">Reset it</a></p>
                </div>
            </form>
        </div>

    )
}

export default Login
