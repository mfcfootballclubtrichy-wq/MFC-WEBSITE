/**
 * RegisterModal.jsx — Entrance Registration Popup with Dismiss Cross Button.
 * Automatically displays on site entrance for unregistered visitors,
 * and can be reopened anytime via the 'Register' header/nav button.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { checkRateLimit, sanitizeText, isValidEmail, isValidPhone } from '../utils/security.js';

export default function RegisterModal() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-open on entrance if user is not authenticated and hasn't closed it in this session
  useEffect(() => {
    if (user) {
      setIsOpen(false);
      return;
    }

    const dismissed = sessionStorage.getItem('mfc_register_modal_closed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Global listener to trigger modal from anywhere (e.g. Header Register button)
  useEffect(() => {
    const handleOpenModal = () => {
      setErrorMsg('');
      setSuccessMsg('');
      setIsOpen(true);
    };

    window.addEventListener('open-register-modal', handleOpenModal);
    return () => window.removeEventListener('open-register-modal', handleOpenModal);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('mfc_register_modal_closed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Rate limit
    const rateCheck = checkRateLimit('auth_register_modal', 5, 60);
    if (!rateCheck.allowed) {
      setErrorMsg(`Too many registration attempts. Please wait ${rateCheck.retryAfter} seconds.`);
      return;
    }

    const cleanName = sanitizeText(name);
    if (!cleanName || cleanName.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!isValidPhone(phone)) {
      setErrorMsg('Please enter a valid 10-digit phone number (e.g. 9876543210).');
      return;
    }

    const cleanEmail = email.trim();
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please agree to the MFC Academy Guidelines and Terms to register.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp({
        name: cleanName,
        phone: phone.trim(),
        email: cleanEmail,
        password,
        role: 'member',
      });
      setSuccessMsg('Welcome to MFC! Your registration is complete.');
      sessionStorage.setItem('mfc_register_modal_closed', 'true');
      setTimeout(() => {
        setIsOpen(false);
      }, 1200);
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    handleClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="register-modal-backdrop"
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 10, 10, 0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '470px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(210, 4, 45, 0.15)',
              padding: 'clamp(1.5rem, 4vw, 2.25rem)',
              color: '#0A0A0A',
            }}
          >
            {/* Prominent Cross Button (×) */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close registration popup"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#F5F5F5',
                border: '1px solid #DDDDDD',
                color: '#0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.25rem',
                fontWeight: 700,
                lineHeight: 1,
                transition: 'all 0.2s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F5F5F5';
                e.currentTarget.style.color = '#0A0A0A';
                e.currentTarget.style.borderColor = '#DDDDDD';
                e.currentTarget.style.transform = 'none';
              }}
            >
              ✕
            </button>

            {/* Header with Club Badge */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
              <img
                src="/mfc-logo.png"
                alt="MFC Crest"
                style={{ width: '56px', height: '56px', margin: '0 auto 8px', objectFit: 'contain' }}
              />
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: 'var(--accent-dark)',
                  background: 'rgba(210, 4, 45, 0.08)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '6px',
                }}
              >
                Join MFC Academy
              </span>
              <h2
                id="register-modal-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: '#0A0A0A',
                  margin: '4px 0',
                  lineHeight: 1.15,
                }}
              >
                Create Your Account
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.45 }}>
                Register to access academy training schedules, tournament rosters, and club announcements.
              </p>
            </div>

            {/* Success Alert */}
            {successMsg && (
              <div
                style={{
                  background: 'rgba(210, 4, 45, 0.08)',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent-dark)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  marginBottom: '14px',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                ✅ {successMsg}
              </div>
            )}

            {/* Error Alert */}
            {errorMsg && (
              <div
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #F87171',
                  color: '#991B1B',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  marginBottom: '14px',
                  fontWeight: 500,
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label
                  htmlFor="modal-reg-name"
                  style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '4px' }}
                >
                  Full Name *
                </label>
                <input
                  id="modal-reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arun Kumar"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#FFFFFF',
                    color: '#0A0A0A',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="modal-reg-phone"
                  style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '4px' }}
                >
                  Mobile Number *
                </label>
                <input
                  id="modal-reg-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#FFFFFF',
                    color: '#0A0A0A',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="modal-reg-email"
                  style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '4px' }}
                >
                  Email Address *
                </label>
                <input
                  id="modal-reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. arun@gmail.com"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#FFFFFF',
                    color: '#0A0A0A',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="modal-reg-password"
                  style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '4px' }}
                >
                  Password (min 6 characters) *
                </label>
                <input
                  id="modal-reg-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#FFFFFF',
                    color: '#0A0A0A',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="modal-reg-confirm"
                  style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '4px' }}
                >
                  Confirm Password *
                </label>
                <input
                  id="modal-reg-confirm"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#FFFFFF',
                    color: '#0A0A0A',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <input
                  id="modal-reg-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                />
                <label htmlFor="modal-reg-terms" style={{ fontSize: '0.75rem', color: '#4B5563', cursor: 'pointer' }}>
                  I agree to MFC Academy rules & code of conduct.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius)',
                  background: 'var(--accent)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(210, 4, 45, 0.35)',
                }}
              >
                {isSubmitting ? 'Registering...' : 'Complete Registration →'}
              </button>
            </form>

            {/* Bottom Alternative / Sign In Link */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border)',
                textAlign: 'center',
                fontSize: '0.82rem',
                color: '#4B5563',
              }}
            >
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={handleGoToLogin}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-dark)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                Sign In to Portal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
