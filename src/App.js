import './App.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import NoteState from './context/notes/NoteState';
import React, { useState } from 'react';
import AppContent from './components/layout/AppContent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ msg: message, type });
    setTimeout(() => setAlert(null), 2500);
  };

  return (
    <div className="App">
      <NoteState>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <MainWrapper showAlert={showAlert} alert={alert} />
        </BrowserRouter>
      </NoteState>
      <ToastContainer
        theme="dark"
        position="top-right"
        toastStyle={{
          background: 'rgba(13,13,36,0.95)',
          border: '1px solid rgba(124,58,237,0.3)',
          color: '#f1f5f9',
        }}
      />
    </div>
  );
}

function MainWrapper({ showAlert, alert }) {
  const location = useLocation();
  const authOnlyPaths = ['/login', '/signup', '/forgot-password'];
  const hideFooter = authOnlyPaths.includes(location.pathname);

  return (
    <>
      <div className="main-content">
        <AppContent showAlert={showAlert} alert={alert} />
      </div>
      {!hideFooter && (
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-left">
              <p className="footer-copyright">
                © {new Date().getFullYear()} QuickNote. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

export default App;
