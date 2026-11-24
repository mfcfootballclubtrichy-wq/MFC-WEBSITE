/**
 * ProtectedRoute.jsx — Route guard requiring authentication & role validation.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '60svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>Verifying credentials...</p>
      </div>
    );
  }

  // If user is logged in but role hasn't resolved from database yet, keep loading
  if (user && role === null && loading) {
    return (
      <div style={{
        minHeight: '60svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>Loading permissions...</p>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check role strictly from verified session
  const effectiveRole = role || 'member';

  // Role validation if specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole)) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-20)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-h2)', color: '#DC2626', marginBottom: 'var(--space-4)' }}>Access Denied</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 'var(--space-4)' }}>
          You are signed in as <strong>{user.email}</strong>, but your assigned role (<code>{effectiveRole || 'none'}</code>) does not have access to this portal.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>
          Required roles: {allowedRoles.join(', ')}
        </p>
      </div>
    );
  }

  return children;
}
