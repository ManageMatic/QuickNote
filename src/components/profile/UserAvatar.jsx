import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteContext from '../../context/notes/NoteContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faCamera } from '@fortawesome/free-solid-svg-icons';
import '../styles/UserAvatar.css';

const UserAvatar = ({ showAlert }) => {
  const { logout } = useContext(NoteContext);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', avatar: '' });
  const navigate = useNavigate();
  const popoverRef = useRef(null);
  const host = 'http://localhost:5000';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${host}/api/auth/getuser`, { method: 'POST', credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUserData({ name: data.name, email: data.email, avatar: localStorage.getItem(`avatar_${data.email}`) || '' });
        }
      } catch (err) { console.error('Failed to fetch user', err); }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    showAlert('Logged out successfully', 'success');
    navigate('/login');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setUserData(prev => ({ ...prev, avatar: base64 }));
        localStorage.setItem(`avatar_${userData.email}`, base64);
        showAlert('Avatar updated locally', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="avatar-container" ref={popoverRef}>
      <button className="avatar-trigger" onClick={() => setIsOpen(!isOpen)}>
        {userData.avatar ? (
          <img src={userData.avatar} alt="User" className="avatar-img" />
        ) : (
          <div className="avatar-img glass-placeholder">
            <FontAwesomeIcon icon={faUser} />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="avatar-popover glass animate-fade-in">
          <div className="avatar-popover-top">
            <label className="avatar-upload-label">
              <input type="file" hidden onChange={handleAvatarChange} accept="image/*" />
              {userData.avatar ? (
                <img src={userData.avatar} alt="User" className="avatar-img-lg" />
              ) : (
                <div className="avatar-img-lg glass-placeholder">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
              <div className="avatar-upload-overlay">
                <FontAwesomeIcon icon={faCamera} />
              </div>
            </label>
            <div className="avatar-user-info">
              <div className="avatar-name">{userData.name}</div>
              <div className="avatar-email">{userData.email}</div>
            </div>
          </div>
          
          <div className="avatar-popover-menu">
            <button className="avatar-logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
