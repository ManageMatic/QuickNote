import React, { useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Alert from './Alert';
import Home from './Home';
import About from './About';
import Login from './Login';
import Signup from './Signup';

const AppContent = ({ showAlert, alert }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const hideNavbarPaths = ['/login', '/signup'];

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:5000/api/auth/getuser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    showAlert('Session expired. Please log in again.', 'danger');
                    navigate('/login');
                }

                const data = await response.json();

            } catch (error) {
                console.error('Auth check failed:', error);
                showAlert('Failed to verify authentication. Please log in again.', 'danger');
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        checkAuth();
    }, []);

    return (
        <>
            {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
            <Alert alert={alert} />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home showAlert={showAlert} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login showAlert={showAlert} />} />
                    <Route path="/signup" element={<Signup showAlert={showAlert} />} />
                </Routes>
            </div>
        </>
    );
};

export default AppContent;
