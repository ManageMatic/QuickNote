import './App.css';
import { BrowserRouter } from 'react-router-dom';
import NoteState from './context/notes/NoteState';
import React, { useState } from 'react';
import AppContent from './components/AppContent';

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
          <AppContent showAlert={showAlert} alert={alert} />
        </BrowserRouter>
      </NoteState>
      <footer className="about-footer">
        <hr />
        <p>© {new Date().getFullYear()} QuickNote. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
