import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Alert from './Alert';
import Home from './Home';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import { ensureAccess } from '../utils/refreshToken';
import Trash from './Trash';
import ForgotPassword from './ForgotPassword';

const host = 'http://localhost:5000';
const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];

const AppContent = ({ showAlert, alert }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Skip check on /login or /signup
        if (publicPaths.includes(location.pathname)) return;

        let intervalId;

        const verifySession = async () => {
            try {
                const res = await fetch(`${host}/api/auth/getuser`, {
                    method: 'POST',
                    credentials: 'include',
                });

                if (res.status === 401 || res.status === 403) {
                    const ref = await fetch(`${host}/api/auth/refresh-token`, {
                        method: 'POST',
                        credentials: 'include',
                    });

                    if (!ref.ok) {
                        showAlert('Session expired. Please log in again.', 'error');
                        setIsAuthenticated(false);
                        navigate('/login');
                        return;
                    }
                }

                // Access token is valid (or refreshed successfully)
                setIsAuthenticated(true);
                ensureAccess();
                intervalId = setInterval(ensureAccess, 10 * 60 * 1000);
            } catch (err) {
                console.error('Auth check failed:', err);
                showAlert('Failed to verify session.', 'error');
                setIsAuthenticated(false);
                navigate('/login');
            }
        };

        verifySession();
        return () => clearInterval(intervalId);
    }, [location.pathname, navigate, showAlert]);

    return (
        <>
            {!publicPaths.includes(location.pathname) && (
                <Navbar isAuthenticated={isAuthenticated} showAlert={showAlert} />
            )}

            <Alert alert={alert} />

            <div className="container">
                <Routes>
                    <Route path="/" element={<Home showAlert={showAlert} />} />
                    <Route path="/trash" element={<Trash showAlert={showAlert} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login showAlert={showAlert} />} />
                    <Route path="/signup" element={<Signup showAlert={showAlert} />} />
                    <Route path="/forgot-password" element={<ForgotPassword showAlert={showAlert} />} />
                </Routes>
            </div>
        </>
    );
};

export default AppContent;
