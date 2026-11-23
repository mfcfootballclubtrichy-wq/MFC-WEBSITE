/**
 * Footer.jsx — Site footer with nav links, contact info, and branding.
 * Professional modern theme: #0A0A0A background, #FFFFFF headings, #D2042D hover links.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { CLUB, NAV_ITEMS } from '../data/content.js';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* ── Brand column ── */}
          <div>
            <Link to="/" className="footer__logo" aria-label="Mutharasanallur Football Club — Home">
              <img
                src="/mfc-logo.png"
                alt="Mutharasanallur Football Club Crest"
                className="header__logo-img"
                width="48"
                height="48"
              />
              <div className="header__logo-text">
                <span className="header__logo-name">{CLUB.name}</span>
                <span className="header__logo-sub">Trichy, Tamil Nadu</span>
              </div>
            </Link>
            <p className="footer__tagline">
              {CLUB.tagline} &mdash; Founded 2020. Developing grassroots champions from Mutharasanallur and across Trichy.
            </p>

            {/* Social */}
            <a
              href="https://www.instagram.com/mfc_trichy/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline"
              style={{
                marginTop: 'var(--space-5)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderColor: 'rgba(255, 255, 255, 0.25)',
              }}
              aria-label={`Follow MFC on Instagram ${CLUB.instagramHandle}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>{CLUB.instagramHandle}</span>
            </a>
          </div>

          {/* ── Navigation column ── */}
          <div>
            <p className="footer__heading">{t('nav.home')}</p>
            <ul className="footer__links">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <Link to={item.path} className="footer__link">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact column ── */}
          <div>
            <p className="footer__heading">{t('contact.title')}</p>
            <ul className="footer__links">
              <li>
                <a
                  href={`tel:${CLUB.phone}`}
                  className="footer__link"
                  aria-label={`Call ${CLUB.phone}`}
                >
                  📞 {CLUB.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CLUB.email}`}
                  className="footer__link"
                  aria-label={`Email ${CLUB.email}`}
                >
                  ✉️ {CLUB.email}
                </a>
              </li>
              <li>
                <a
                  href={CLUB.mapsUrl || "https://www.google.com/maps?ftid=0x3baa5f1fbab6b02f:0x640fe554b7a67e15"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                  title="View Tamilan Nagar Ground on Google Maps"
                >
                  📍 {CLUB.address} ↗
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/mfc_trichy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                  title="Follow @mfc_trichy on Instagram"
                >
                  📸 Instagram: @mfc_trichy ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer__bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <p className="footer__copy">
            {CLUB.footerNote}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--fs-xs)', flexWrap: 'wrap' }}>
            <a
              href="https://www.instagram.com/mfc_trichy/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#E1306C',
                fontWeight: 600,
                textDecoration: 'none',
              }}
              title="Official Instagram @mfc_trichy"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram (@mfc_trichy)</span>
            </a>
            <span style={{ color: 'var(--muted)', opacity: 0.5 }}>•</span>
            <Link to="/privacy-policy" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
            <span style={{ color: 'var(--muted)', opacity: 0.5 }}>•</span>
            <Link to="/terms" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>
              Terms of Use
            </Link>
          </div>
          <p className="footer__copy">{t('footer.builtBy')}</p>
        </div>
      </div>
    </footer>
  );
}
