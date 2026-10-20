/**
 * Login.jsx — Official Super Admin & Staff Sign-in Portal.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { checkRateLimit, sanitizeText, isValidEmail, isValidPhone } from '../../utils/security.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user, role } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to /admin or home depending on role
  const from = location.state?.from?.pathname || (role === 'super_admin' || role === 'admin' ? '/admin' : '/');

  useEffect(() => {
    if (user && role) {
      navigate(from, { replace: true });
    }
  }, [user, role, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // 1. Rate limiting on authentication attempts (max 5 per minute)
    const rateCheck = checkRateLimit('auth_login', 5, 60);
    if (!rateCheck.allowed) {
      setErrorMsg(`Too many login/registration attempts. Please wait ${rateCheck.retryAfter} seconds.`);
      return;
    }

    // 2. Strict Input Validations
    const cleanEmail = email.trim();
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'register') {
      const cleanName = sanitizeText(name);
      if (!cleanName || cleanName.length < 2) {
        setErrorMsg('Please enter your full name (at least 2 characters).');
        return;
      }
      if (!isValidPhone(phone)) {
        setErrorMsg('Please enter a valid phone number (at least 10 digits).');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await signIn(cleanEmail, password);
        navigate(from, { replace: true });
      } else {
        // Register: strictly sanitized name, phone, email, password
        await signUp({ name: sanitizeText(name), phone: phone.trim(), email: cleanEmail, password });
        setSuccessMsg('Account registered successfully! You are now logged in.');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1200);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Operation failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '85svh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-8) var(--space-4)',
      background: 'radial-gradient(circle at 50% 20%, rgba(187, 247, 208, 0.35) 0%, var(--bg) 70%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-glow)',
          padding: 'var(--space-8)',
          position: 'relative',
        }}
      >
        {/* Header with Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <img
            src="/mfc-logo.png"
            alt="Mutharasanallur FC Crest"
            style={{ width: '64px', height: '64px', margin: '0 auto var(--space-3)', objectFit: 'contain' }}
          />
          <span className="section__eyebrow" style={{ marginBottom: 'var(--space-1)' }}>MFC Portal</span>
          <h1 style={{ fontSize: '1.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginTop: 'var(--space-1)' }}>
            Mutharasanallur Football Club
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-2)',
          background: 'var(--surface-2)',
          padding: '4px',
          borderRadius: 'var(--radius)',
          marginBottom: 'var(--space-6)',
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-sm)',
              fontWeight: 600,
              background: mode === 'login' ? 'var(--bg)' : 'transparent',
              color: mode === 'login' ? 'var(--accent-dark)' : 'var(--muted)',
              boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-sm)',
              fontWeight: 600,
              background: mode === 'register' ? 'var(--bg)' : 'transparent',
              color: mode === 'register' ? 'var(--accent-dark)' : 'var(--muted)',
              boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Register
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div style={{
            background: '#DCFCE7',
            border: '1px solid #86EFAC',
            color: '#166534',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--fs-sm)',
            marginBottom: 'var(--space-5)',
            textAlign: 'center',
          }}>
            {successMsg}
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #F87171',
            color: '#991B1B',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--fs-sm)',
            marginBottom: 'var(--space-5)',
          }}>
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {mode === 'register' && (
            <>
              <div>
                <label
                  htmlFor="user-name"
                  style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}
                >
                  Full Name *
                </label>
                <input
                  id="user-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pragadeesh Kumar"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: 'var(--fs-base)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="user-phone"
                  style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}
                >
                  Phone Number *
                </label>
                <input
                  id="user-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: 'var(--fs-base)',
                    outline: 'none',
                  }}
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="auth-email"
              style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}
            >
              Email Address *
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: 'var(--fs-base)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}
            >
              Password *
            </label>
            <input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: 'var(--fs-base)',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            {isSubmitting
              ? (mode === 'login' ? 'Signing In...' : 'Registering...')
              : (mode === 'login' ? 'Sign In' : 'Complete Registration')}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--accent-dark)', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
