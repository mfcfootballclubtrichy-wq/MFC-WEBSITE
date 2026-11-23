/**
 * NotFound.jsx — 404 page.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="not-found" style={{ paddingTop: 'calc(var(--header-height) + var(--space-8))' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ textAlign: 'center' }}
      >
        <p className="not-found__number" aria-hidden="true">404</p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-3xl)',
            textTransform: 'uppercase',
            marginTop: 'calc(-1 * var(--space-8))',
            marginBottom: 'var(--space-4)',
          }}
        >
          Page Not Found
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 'var(--space-8)' }}>
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="btn btn--primary" id="not-found-home">
          {t('common.backToHome')}
        </Link>
      </motion.div>
    </div>
  );
}
