/**
 * Footer.jsx — Site footer with nav links, contact info, and branding.
 * Clean light theme: #F5F7F5 background, #0A0A0A headings, #0F7A36 links.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { CLUB, NAV_ITEMS } from '../data/content.js';

const CURRENT_YEAR = new Date().getFullYear();

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
              href={CLUB.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline"
              style={{ marginTop: 'var(--space-5)', display: 'inline-flex' }}
              aria-label={`Follow MFC on Instagram ${CLUB.instagramHandle}`}
            >
              <span aria-hidden="true">📸</span> {CLUB.instagramHandle}
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
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer__bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <p className="footer__copy">
            {CLUB.footerNote}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--fs-xs)' }}>
            <Link to="/privacy-policy" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
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
