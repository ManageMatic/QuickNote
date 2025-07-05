import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/apple-touch-icon.png'
import { useNavigate } from 'react-router-dom';
import './styles/Navbar.css';


const Navbar = ({ isAuthenticated, showAlert }) => {
  let location = useLocation();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: 'POST',
        credentials: 'include',
      })
      if (response.ok) {
        showAlert("Logged out successfully", "success");
        navigate('/login');
      } else {
        showAlert("Failed to log out", "danger");
      }
    } catch (error) {
      showAlert("An error occurred while logging out", "danger");
    }
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
      <div className="container-fluid">
        <img src={logo} alt="Logo" width="40" height="40" className="d-inline-block align-text-top me-2" />
        <Link className="navbar-brand" to="/">QuickNote</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/trash" ? "active" : ""}`} to="/trash">Trash</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
            </li>
          </ul>
          {isAuthenticated
            ? (
              <form className="d-flex" role="search">
                <button className="btn nav-logout-btn mx-1" onClick={handleLogOut}>Logout</button>
              </form>
            ) : (
              <form className="d-flex" role="search">
                <Link className="btn nav-login-btn mx-1" to="/login">Login</Link>
                <Link className="btn nav-signup-btn mx-1" to="/signup">Signup</Link>
              </form>
            )
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar
