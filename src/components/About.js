import React, { useEffect, useState } from 'react';
import './styles/About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLightbulb, faCheckCircle, faBolt, faEnvelope, faPhone, faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

const About = () => {
  const [stats, setStats] = useState({ notes: 0, users: 0, uptime: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        notes: Math.min(prev.notes + 12, 3250),
        users: Math.min(prev.users + 1, 410),
        uptime: Math.min(prev.uptime + 1, 24)
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="about-page">
      <h1 className="about-title">About QuickNote</h1>

      <p className="about-paragraph">
        <FontAwesomeIcon icon={faLightbulb} className="about-icon" /> QuickNote is your smart note-taking app built to
        boost productivity, help organize thoughts, and capture ideas instantly.
      </p>
      <p className="about-paragraph">
        <FontAwesomeIcon icon={faCheckCircle} className="about-icon" /> Features include secure login, real-time note
        creation, editing, and deletion, all with a clean and responsive UI.
      </p>
      <p className="about-paragraph">
        <FontAwesomeIcon icon={faBolt} className="about-icon" /> Built using the MERN stack, QuickNote ensures lightning-fast
        performance and a modern web experience.
      </p>

      <div className="counters">
        <div className="counter-box">
          <h3>{stats.notes}+</h3>
          <p>Notes Created</p>
        </div>
        <div className="counter-box">
          <h3>{stats.users}+</h3>
          <p>Registered Users</p>
        </div>
        <div className="counter-box">
          <h3>{stats.uptime} hrs</h3>
          <p>Uptime Today</p>
        </div>
      </div>

      <h3 className="contact-title">Connect with the Developer</h3>
      <div className="socials">
        <a href="https://github.com/ManageMatic" target="_blank" rel="noreferrer" className="social-link">
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
        <a href="https://www.linkedin.com/in/ishan-mahida-b90959338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer" className="social-link">
          <FontAwesomeIcon icon={faLinkedin} size="2x" />
        </a>
        <a href="https://www.instagram.com/ishxm_9.13?igsh=YXB3d3g0MXJicGxy" target="_blank" rel="noreferrer" className="social-link">
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </a>
      </div>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p><FontAwesomeIcon icon={faEnvelope} /> Email: <a href="mailto:support@quicknote.com">support@quicknote.com</a></p>
        <p><FontAwesomeIcon icon={faPhone} /> Phone: +91-98765-43210</p>
        <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Location: Surat, Gujarat, India</p>
      </div>
    </div>
  );
};

export default About;
