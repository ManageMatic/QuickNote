import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../../assets/apple-touch-icon.png';
import UserAvatar from '../profile/UserAvatar';
import '../styles/Navbar.css';

const Navbar = ({ isAuthenticated, showAlert, isLanding = false }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (location.pathname === '/' && !location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Auth links focus strictly on productivity (Home, Favorites, Trash)
  // Guest links focus on marketing (Features, Pricing, About)
  const navLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: 'Home' },
        { to: '/reminders',  label: 'Reminders' },
        { to: '/favorites', label: 'Favorites' },
        { to: '/trash',     label: 'Trash' },
      ]
    : [
        { to: '/#features',     label: 'Features' },
        { to: '/#testimonials', label: 'Testimonials' },
        { to: '/#faq',          label: 'FAQ' },
        { to: '/#contact',      label: 'Contact' },
        { to: '/#pricing',      label: 'Pricing' },
      ];

  return (
    <nav className={`qn-navbar ${scrolled ? 'scrolled' : ''} ${isLanding ? 'landing-nav' : ''}`}>
      <div className="qn-nav-inner">
        <Link to="/" className="qn-brand">
          <img src={logo} alt="QuickNote logo" className="qn-logo" />
          <span>QuickNote</span>
        </Link>

        <ul className="qn-links">
          {navLinks.map(l => (
            <li key={l.label}>
              <Link
                to={l.to}
                className={`qn-link ${location.pathname === l.to ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="qn-nav-right">
          {isAuthenticated ? (
            <UserAvatar showAlert={showAlert} />
          ) : (
            <div className="qn-auth-btns">
              <Link to="/login" className="btn-ghost qn-btn-sm">Log In</Link>
              <Link to="/signup" className="btn-primary-glow qn-btn-sm">Get Started</Link>
            </div>
          )}

          <button
            className={`qn-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`qn-mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(l => (
          <Link
            key={l.label}
            to={l.to}
            className={`qn-mobile-link ${location.pathname === l.to ? 'active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
        {!isAuthenticated && (
          <>
            <Link to="/login" className="qn-mobile-link">Log In</Link>
            <Link to="/signup" className="btn-primary-glow" style={{ margin: '0.5rem 1rem' }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
