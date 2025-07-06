import './App.css';
import { BrowserRouter } from 'react-router-dom';
import NoteState from './context/notes/NoteState';
import React, { useState } from 'react';
import AppContent from './components/AppContent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  return (
    <div className="App">
      <NoteState>
        <BrowserRouter>
          <div className="main-content">
            <AppContent showAlert={showAlert} alert={alert} />
          </div>
        </BrowserRouter>
      </NoteState>
      <footer className="about-footer">
        <p>© {new Date().getFullYear()} QuickNote. All rights reserved.</p>
      </footer>
      <ToastContainer />
    </div>
  );
}

export default App;
