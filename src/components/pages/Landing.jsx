import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faShieldAlt, faMobileAlt, faCheckCircle, faClock, faArrowRight, faEnvelope, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* ── Hero Section ────────────────────────── */}
      <section className="hero-section">
        <div className="hero-bg-glow" />

        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <span className="badge-dot" />
            Next-Gen Note Taking 🚀
          </div>
          <h1 className="hero-title animate-fade-up">
            Note at the <span className="gradient-text">Speed</span> <br />
            of Thought.
          </h1>
          <p className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.1s' }}>
            A beautiful, distraction-free space for your ideas. Secure,
            fast, and accessible anywhere.
          </p>
          <div className="hero-ctas animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/signup" className="btn-primary-glow">
              Start Writing — It's Free
            </Link>
            <a href="#features" className="btn-ghost">Explore Features</a>
          </div>
        </div>

        <div className="hero-visual animate-float">
          <div className="mock-card mock-card-1">
            <div className="mock-card-header">
              <span className="mock-dot" /> Project Idea
            </div>
            <p>Build a modern note-taking app with Vite and React...</p>
            <span className="mock-tag">Work</span>
          </div>
          <div className="mock-card mock-card-2">
            <div className="mock-card-header">
              <span className="mock-dot" /> Groceries
            </div>
            <p>Buy milk, eggs, bread, and some coffee beans...</p>
            <span className="mock-tag">Personal</span>
          </div>
          <div className="mock-card mock-card-3">
            <div className="mock-card-header">
              <span className="mock-dot" /> Reminder
            </div>
            <p>Meeting with the design team at 2:00 PM tomorrow.</p>
            <span className="mock-tag">Meeting</span>
          </div>
        </div>
      </section>

      {/* ── Features Section ────────────────────── */}
      <section className="features-section" id="features">
        <div className="section-label">Pro Features</div>
        <h2 className="section-title">Everything you need</h2>
        <div className="features-grid">
          {[
            { icon: faBolt, title: 'Vite Powered', desc: 'Experience lightning-fast performance and instant updates.' },
            { icon: faShieldAlt, title: 'Secure & Private', desc: 'Your notes are protected with industry-standard JWT security.' },
            { icon: faClock, title: 'Email Reminders', desc: 'Set deadlines and receive automatic notifications to your inbox.' },
            { icon: faMobileAlt, title: 'Fully Responsive', desc: 'Access your thoughts seamlessly from your phone or desktop.' }
          ].map((f, i) => (
            <div className="feature-card glass animate-fade-up" key={i} style={{ animationDelay: `${0.1 * i}s` }}>
              <div className="feature-icon-wrap" style={{ background: `var(--accent-dim)`, color: `var(--accent-light)` }}>
                <FontAwesomeIcon icon={f.icon} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials Section ────────────────────── */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-label">Success Stories</div>
        <h2 className="section-title">Loved by Thousands</h2>
        <div className="testimonials-grid">
          {[
            { name: 'Alex Chen', role: 'Software Engineer', text: 'QuickNote is the first note-taking app that actually feels as fast as my keyboard. The rich text support is exactly what I needed.' },
            { name: 'Sarah Jenkins', role: 'Product Designer', text: "The glassmorphism UI is stunning. It's not just a tool; it's a workspace that I actually enjoy looking at every day." },
            { name: 'Michael Ross', role: 'University Student', text: 'The email reminders saved my grades. I set them for my study sessions and never miss a deadline anymore.' }
          ].map((t, i) => (
            <div className="testimonial-card glass animate-fade-up" key={i} style={{ animationDelay: `${0.1 * i}s` }}>
              <div className="testimonial-avatar">
                {t.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="testimonial-content">
                <p>"{t.text}"</p>
                <div className="testimonial-author">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ───────────────────────────── */}
      <section className="faq-section" id="faq">
        <div className="section-label">FAQ</div>
        <h2 className="section-title">Common Questions</h2>
        <div className="faq-grid">
          {[
            { q: 'Is QuickNote really free?', a: 'Yes! We believe everyone should have access to a clean workspace for their ideas. Basic features are free forever.' },
            { q: 'How secure are my notes?', a: 'We use industry-standard encryption and JWT-based authentication to ensure only you can access your content.' },
            { q: 'Can I use it on my phone?', a: 'Absolutely. QuickNote is a fully responsive web app that works beautifully on any mobile browser.' },
            { q: 'How do email reminders work?', a: 'Simply set a date and time for your note, and we will send a notification to your registered email address automatically.' }
          ].map((f, i) => (
            <div className="faq-item glass animate-fade-in" key={i}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Section ───────────────────────── */}
      <section className="contact-section" id="contact">
        <div className="section-label">Connect</div>
        <h2 className="section-title">Get in Touch</h2>
        <div className="contact-container glass">
          <div className="contact-info">
            <p>Have questions or feedback? We'd love to hear from you. Our team is usually online and ready to help.</p>
            <div className="contact-methods">
              <div className="contact-method">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>support@quicknote.pro</span>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your Email" className="form-input" required />
            <textarea placeholder="How can we help?" className="form-input" rows="4" required></textarea>
            <button type="submit" className="btn-primary-glow">Send Message</button>
          </form>
        </div>
      </section>

      {/* ── Pricing Section ────────────────────────── */}
      <section className="pricing-section" id="pricing">
        <div className="section-label">Get Started</div>
        <h2 className="section-title">Always Free. No Strings Attached.</h2>
        <div className="pricing-grid">
          <div className="pricing-card glass animate-fade-in">
            <div className="pricing-badge">Free Forever</div>
            <div className="price">$0 <span>/ life</span></div>
            <p className="pricing-desc">
              We believe great ideas should have a home. QuickNote is and will always be
              free for personal use. Enjoy unlimited notes and all pro features at no cost.
            </p>
            <ul className="pricing-features">
              <li><FontAwesomeIcon icon={faCheckCircle} /> Unlimited notes & tags</li>
              <li><FontAwesomeIcon icon={faCheckCircle} /> Smart Email reminders</li>
              <li><FontAwesomeIcon icon={faCheckCircle} /> Rich text editor support</li>
              <li><FontAwesomeIcon icon={faCheckCircle} /> Secure multi-device sync</li>
            </ul>
            <Link to="/signup" className="btn-primary-glow" style={{ width: '100%', justifyContent: 'center' }}>
              Create Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
