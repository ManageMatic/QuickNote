import React from 'react'
import { useNavigate } from 'react-router-dom';
import './styles/Signup.css';
import signupIllustration from '../assets/signup-illustration.svg';

const Signup = (props) => {
    const [credentials, setCredentials] = React.useState({ name: "", email: "", password: "", cpassword: "" });
    const navigate = useNavigate();
    const host = "http://localhost:5000"
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle signup logic here
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: credentials.name,
                email: credentials.email,
                password: credentials.password
            })
        });
        if (response.ok) {
            props.showAlert("Account created successfully", "success");
            navigate('/login');
        } else {
            const errorData = await response.json();
            props.showAlert(errorData.error || "Failed to create account", "danger");
        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    return (
        <div className="signup-main">
            <div className="signup-box">
                <div className="signup-image-section">
                    <img src={signupIllustration} alt="signup" className="signup-image" />
                </div>
                <div className="signup-form-section">
                    <h2 className='signup-title'>Signup for QuickNote</h2>
                    <p className='signup-subtitle'>Create an account to manage your notes</p>
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control signup-input" id="name" name="name" onChange={onChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control signup-input" id="email" name="email" onChange={onChange} aria-describedby="emailHelp" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control signup-input" id="password" name="password" onChange={onChange} minLength={5} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control signup-input" id="cpassword" name="cpassword" onChange={onChange} minLength={5} required />
                        </div>
                        <button type="submit" className="btn-signup">Signup</button>
                        <p className="signup-footer">Already have an account? <a href="/login">Login</a></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
