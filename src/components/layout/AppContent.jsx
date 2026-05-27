import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Alert from './Alert';
import Home from '../pages/Home';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import Landing from '../pages/Landing';
import { ensureAccess } from '../../utils/refreshToken';
import Trash from '../notes/Trash';
import ForgotPassword from '../auth/ForgotPassword';
import Favorites from '../pages/Favorites';
import Reminders from '../pages/Reminders';

const host = 'http://localhost:5000';
const publicPaths = ['/login', '/signup', '/forgot-password', '/'];
const authOnlyPaths = ['/login', '/signup', '/forgot-password'];

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

const AppContent = ({ showAlert, alert }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isProtectedPath = !publicPaths.includes(location.pathname);

    // If the user is already authenticated and navigating inside protected pages,
    // we don't need to re-verify synchronously on every transition.
    if (isAuthenticated && isProtectedPath) return;

    let intervalId;

    const verifySession = async () => {
      try {
        const res = await fetch(`${host}/api/auth/getuser`, {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          setIsAuthenticated(true);
          // Directly access notes by redirecting auth pages and the landing page to dashboard
          if (authOnlyPaths.includes(location.pathname) || location.pathname === '/') {
            navigate('/dashboard');
          }
          ensureAccess();
          intervalId = setInterval(ensureAccess, 10 * 60 * 1000);
          return;
        }

        // Try to refresh token if access token is invalid/expired
        if (res.status === 401 || res.status === 403) {
          const ref = await fetch(`${host}/api/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include',
          });

          if (ref.ok) {
            setIsAuthenticated(true);
            if (authOnlyPaths.includes(location.pathname) || location.pathname === '/') {
              navigate('/dashboard');
            }
            ensureAccess();
            intervalId = setInterval(ensureAccess, 10 * 60 * 1000);
            return;
          }
        }

        // Both access and refresh tokens are completely expired or invalid
        setIsAuthenticated(false);
        if (isProtectedPath) {
          showAlert('Session expired. Please log in again.', 'error');
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
        if (isProtectedPath) {
          showAlert('Failed to verify session.', 'error');
          navigate('/login');
        }
      }
    };

    verifySession();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [location.pathname, navigate, showAlert, isAuthenticated]);
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {!authOnlyPaths.includes(location.pathname) && (
        <Navbar isAuthenticated={isAuthenticated} showAlert={showAlert} isLanding={isLandingPage} />
      )}

      <Alert alert={alert} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><Home showAlert={showAlert} /></PageWrapper>} />
          <Route path="/reminders" element={<PageWrapper><Reminders showAlert={showAlert} /></PageWrapper>} />
          <Route path="/trash" element={<PageWrapper><Trash showAlert={showAlert} /></PageWrapper>} />
          <Route path="/favorites" element={<PageWrapper><Favorites showAlert={showAlert} /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login showAlert={showAlert} /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup showAlert={showAlert} /></PageWrapper>} />
          <Route path="/forgot-password" element={<PageWrapper><ForgotPassword showAlert={showAlert} /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default AppContent;
