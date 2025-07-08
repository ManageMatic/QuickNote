import './App.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import NoteState from './context/notes/NoteState';
import React, { useState } from 'react';
import AppContent from './components/AppContent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ msg: message, type });
    setTimeout(() => setAlert(null), 1500);
  };

  return (
    <div className="App">
      <NoteState>
        <BrowserRouter>
          <MainWrapper showAlert={showAlert} alert={alert} />
        </BrowserRouter>
      </NoteState>
      <ToastContainer />
    </div>
  );
}

function MainWrapper({ showAlert, alert }) {
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <div className="main-content">
        <AppContent showAlert={showAlert} alert={alert} />
      </div>
      {!hideFooter && (
        <footer className="about-footer">
          <p>© {new Date().getFullYear()} QuickNote. All rights reserved.</p>
        </footer>
      )}
    </>
  );
}

export default App;
