/**
 * Login.jsx — Official MFC Authentication & Public Registration Portal.
 * Supports public member sign-ups, volunteer onboarding, and staff role sign-in.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { checkRateLimit, sanitizeText, isValidEmail, isValidPhone, validatePassword, isValidRedirect } from '../../utils/security.js';

export default function Login({ defaultMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user, role } = useAuth();

  // Determine initial mode from props or current pathname
  const initialMode = defaultMode || (location.pathname.includes('register') ? 'register' : 'login');
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const selectedRole = 'member'; // default public role
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to validated internal path
  const rawFrom = location.state?.from?.pathname || '/portal';
  const from = isValidRedirect(rawFrom) ? rawFrom : '/portal';

  useEffect(() => {
    if (user && role) {
      navigate(from, { replace: true });
    }
  }, [user, role, navigate, from]);

  // Sync mode if route changes between /login and /register
  useEffect(() => {
    if (location.pathname.includes('register')) {
      setMode('register');
    } else if (location.pathname.includes('login')) {
      setMode('login');
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // 1. Rate limiting on authentication attempts (max 5 per minute)
    const rateCheck = checkRateLimit('auth_login', 6, 60);
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

    if (mode === 'register') {
      const passValidation = validatePassword(password);
      if (!passValidation.valid) {
        setErrorMsg(passValidation.message);
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
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter your password.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('Please agree to the MFC Academy Guidelines and Terms to register.');
        return;
      }
    } else {
      if (password.length < 6) {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await signIn(cleanEmail, password);
        setSuccessMsg('Successfully signed in! Redirecting to MFC Portal...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 600);
      } else {
        // Register: strictly sanitized name, phone, email, password, and chosen role
        await signUp({
          name: sanitizeText(name),
          phone: phone.trim(),
          email: cleanEmail,
          password,
          role: selectedRole || 'member',
        });
        setSuccessMsg('Welcome to MFC! Your account has been registered successfully.');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      }
    } catch (err) {
      console.error('Auth error:', err);
      let userFriendly = 'Unable to complete request. Please verify your details and try again.';
      if (err.message?.includes('Invalid login credentials')) {
        userFriendly = 'Invalid email or password. Please verify your credentials.';
      } else if (err.message?.includes('User already registered') || err.message?.includes('already registered')) {
        userFriendly = 'This email is already registered. Please sign in or use a different email.';
      }
      setErrorMsg(userFriendly);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '88svh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-8) var(--space-4)',
      background: 'radial-gradient(circle at 50% 20%, rgba(210, 4, 45, 0.1) 0%, var(--bg) 75%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-glow)',
          padding: 'var(--space-8)',
          position: 'relative',
        }}
      >
        {/* Header with Club Crest */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
          <img
            src="/mfc-logo.png"
            alt="Mutharasanallur Football Club Crest"
            style={{ width: '68px', height: '68px', margin: '0 auto var(--space-3)', objectFit: 'contain' }}
          />
          <span className="section__eyebrow" style={{ marginBottom: 'var(--space-1)' }}>
            Mutharasanallur FC
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            {mode === 'login' ? 'Sign In to Portal' : 'Public Registration'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginTop: 'var(--space-1)' }}>
            {mode === 'login'
              ? 'Access your role dashboard, academy updates, and club tools'
              : 'Join MFC as an Academy Trainee, Parent, Volunteer, or Staff'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-2)',
          background: 'var(--surface-2)',
          padding: '4px',
          borderRadius: 'var(--radius)',
          marginBottom: 'var(--space-5)',
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-sm)',
              fontWeight: 700,
              background: mode === 'login' ? 'var(--bg)' : 'transparent',
              color: mode === 'login' ? 'var(--accent-dark)' : 'var(--muted)',
              boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-sm)',
              fontWeight: 700,
              background: mode === 'register' ? 'var(--bg)' : 'transparent',
              color: mode === 'register' ? 'var(--accent-dark)' : 'var(--muted)',
              boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Create Account (Register)
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--accent)',
            color: 'var(--accent-dark)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--fs-sm)',
            marginBottom: 'var(--space-5)',
            textAlign: 'center',
            fontWeight: 600,
          }}>
            ✅ {successMsg}
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
            fontWeight: 500,
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {mode === 'register' && (
            <>
              <div>
                <label
                  htmlFor="reg-name"
                  style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}
                >
                  Full Name *
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arun Kumar"
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
                  htmlFor="reg-phone"
                  style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}
                >
                  Mobile Number *
                </label>
                <input
                  id="reg-phone"
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
              placeholder="e.g. yourname@gmail.com"
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

          {mode === 'register' && (
            <>
              <div>
                <label
                  htmlFor="reg-confirm-password"
                  style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}
                >
                  Confirm Password *
                </label>
                <input
                  id="reg-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent-dark)' }}
                />
                <label htmlFor="reg-terms" style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', cursor: 'pointer' }}>
                  I agree to MFC Football Club Academy rules and conduct policy.
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-2)', padding: '0.85rem' }}
          >
            {isSubmitting
              ? (mode === 'login' ? 'Authenticating...' : 'Creating Account...')
              : (mode === 'login' ? 'Sign In to Portal' : 'Complete Registration')}
          </button>
        </form>

        {/* Bottom Back & Help Link */}
        <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-5)', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--muted)', fontSize: 'var(--fs-xs)', fontWeight: 600 }}>
            ← Back to Home
          </Link>
          <span style={{ color: 'var(--muted)', fontSize: 'var(--fs-xs)' }}>
            Need help? Ask our <strong>AI Assistant</strong> below
          </span>
        </div>
      </motion.div>
    </div>
  );
}
