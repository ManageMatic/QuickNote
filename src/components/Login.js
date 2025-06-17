import React from 'react'
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Login = (props) => {

    const [credentials, setCredentials] = React.useState({ email: "", password: "" });
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: e.target.email.value,
                password: e.target.password.value
            })
        });
        const json = await response.json();
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged in successfully", "success");
            navigate('/');
        } else {
            props.showAlert("Invalid credentials", "danger");
        }
    }

    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    return (
        <div className="login-container my-3">
            <h1 className="login-title">Login to QuickNote</h1>
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
            </form>
        </div>

    )
}

export default Login
