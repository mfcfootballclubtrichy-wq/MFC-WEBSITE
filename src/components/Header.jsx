/**
 * Header.jsx — Fixed navigation header.
 *
 * Light Theme styling:
 * - Clean white background with thin border at bottom
 * - Active nav link with #0A0A0A black text and 3px light green underline (#86EFAC)
 * - Mobile menu: white panel with black links and light green hover backgrounds
 */
import { useState, useEffect, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { CLUB, NAV_ITEMS } from '../data/content.js';
import { useAuth } from '../context/AuthContext.jsx';

const SCROLL_THRESHOLD = 30;

const drawerVariants = {
  hidden:  { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:    { opacity: 0, x: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
};

const linkContainerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const linkItemVariants = {
  hidden:  { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

export default function Header() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((o) => !o);
  const closeMenu  = () => setMenuOpen(false);



  return (
    <header
      className={`header${scrolled ? ' header--scrolled' : ''}`}
      role="banner"
    >
      <div className="container">
        <div className="header__inner">
          {/* ── Logo ── */}
          <Link
            to="/"
            className="header__logo"
            aria-label={`${CLUB.name} — Home`}
            onClick={closeMenu}
          >
            <img
              src="/mfc-logo.png"
              alt="Mutharasanallur Football Club Crest"
              className="header__logo-img"
              width="44"
              height="44"
            />
            <div className="header__logo-text">
              <span className="header__logo-name">MFC Club</span>
              <span className="header__logo-sub">Trichy</span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `nav__link${isActive ? ' active' : ''}`
                }
                end={item.path === '/'}
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          {/* ── Right side: Admin/Login button + mobile hamburger ── */}
          <div className="flex" style={{ gap: 'var(--space-3)', alignItems: 'center' }}>
            {/* Admin / Login Button */}

            {/* Admin / Login Button */}
            {user ? (
              <Link
                to="/admin"
                className="btn btn--outline"
                style={{ padding: '0.45rem 1rem', fontSize: 'var(--fs-xs)', borderRadius: 'var(--radius-full)' }}
              >
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="btn btn-primary"
                style={{ padding: '0.45rem 1.1rem', fontSize: 'var(--fs-xs)', borderRadius: 'var(--radius-full)' }}
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className={`menu-btn${menuOpen ? ' menu-btn--open' : ''}`}
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? t('common.close') : t('common.menu')}
            >
              <span className="menu-btn__line" aria-hidden="true" />
              <span className="menu-btn__line" aria-hidden="true" />
              <span className="menu-btn__line" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-label="Mobile navigation"
          >
            <motion.ul
              variants={linkContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {NAV_ITEMS.map((item) => (
                <motion.li key={item.id} variants={linkItemVariants}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `mobile-nav__link${isActive ? ' active' : ''}`
                    }
                    end={item.path === '/'}
                    onClick={closeMenu}
                  >
                    {t(item.labelKey)}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>



            <div style={{ marginTop: 'var(--space-6)', width: '100%' }}>
              {user ? (
                <Link
                  to="/admin"
                  className="btn btn--outline"
                  onClick={closeMenu}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="btn btn-primary"
                  onClick={closeMenu}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
