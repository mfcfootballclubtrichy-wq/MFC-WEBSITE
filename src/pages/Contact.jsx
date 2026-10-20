/**
 * Contact.jsx — Contact page with info + form.
 *
 * Security measures:
 * - Honeypot field to deter bots (visually hidden, tab-index -1)
 * - Form does not use dangerouslySetInnerHTML
 * - In Phase 4, Cloudflare Turnstile will be added before the submit button
 * - No secrets in this file; form submission endpoint goes in .env
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollReveal  from '../components/ScrollReveal.jsx';
import ConfirmBadge  from '../components/ConfirmBadge.jsx';
import { CLUB as STATIC_CLUB } from '../data/content.js';
import { useContent } from '../context/ContentContext.jsx';

const FORM_STATES = {
  IDLE:     'idle',
  LOADING:  'loading',
  SUCCESS:  'success',
  ERROR:    'error',
};

export default function Contact() {
  const { t } = useTranslation();
  const { content } = useContent();

  const clubContact = {
    ...STATIC_CLUB,
    ...(content?.contact || {}),
  };

  const [formState, setFormState] = useState(FORM_STATES.IDLE);
  const [fields, setFields]       = useState({ name: '', email: '', message: '' });
  const [honeypot, setHoneypot]   = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot check — if filled, silently succeed (bot detection)
    if (honeypot) {
      setFormState(FORM_STATES.SUCCESS);
      return;
    }

    setFormState(FORM_STATES.LOADING);

    try {
      /**
       * Phase 4: Replace this stub with a real fetch to the FastAPI endpoint.
       * The endpoint URL must come from import.meta.env.VITE_API_URL (never hard-coded).
       *
       * const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
       *   method: 'POST',
       *   headers: { 'Content-Type': 'application/json' },
       *   body: JSON.stringify(fields),
       * });
       * if (!res.ok) throw new Error('Server error');
       */

      // Temporary: simulate a successful submission for Phase 1.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFormState(FORM_STATES.SUCCESS);
      setFields({ name: '', email: '', message: '' });
    } catch {
      setFormState(FORM_STATES.ERROR);
    }
  };

  const isLoading = formState === FORM_STATES.LOADING;

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <span className="section__eyebrow">{t('nav.contact')}</span>
          <h1 className="page-hero__title">{t('contact.title')}</h1>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="section" aria-labelledby="contact-body-heading">
        <div className="container">
          <div className="grid--2" style={{ alignItems: 'start', gap: 'var(--space-16)' }}>
            {/* ── Contact info ── */}
            <ScrollReveal>
              <div>
                <h2 id="contact-body-heading" className="section__title" style={{ textAlign: 'left', marginBottom: 'var(--space-8)' }}>
                  {t('contact.title')}
                </h2>

                <address style={{ fontStyle: 'normal' }}>
                  <ul className="contact-info-list">
                    <li className="contact-info-item">
                      <div className="contact-info-item__icon" aria-hidden="true">📞</div>
                      <div>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-1)' }}>
                          {t('contact.phone')}
                        </p>
                        <a href={`tel:${clubContact.phone}`}>{clubContact.phone}</a>
                      </div>
                    </li>

                    <li className="contact-info-item">
                      <div className="contact-info-item__icon" aria-hidden="true">✉️</div>
                      <div>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-1)' }}>
                          {t('contact.email')}
                        </p>
                        <a href={`mailto:${clubContact.email}`}>{clubContact.email}</a>
                      </div>
                    </li>

                    <li className="contact-info-item">
                      <div className="contact-info-item__icon" aria-hidden="true">📸</div>
                      <div>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-1)' }}>
                          {t('contact.instagram')}
                        </p>
                        <a href={clubContact.instagram} target="_blank" rel="noopener noreferrer">
                          {clubContact.instagramHandle}
                        </a>
                      </div>
                    </li>

                    <li className="contact-info-item">
                      <div className="contact-info-item__icon" aria-hidden="true">📍</div>
                      <div>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-1)' }}>
                          {t('contact.location')}
                        </p>
                        <span>
                          {clubContact.address || clubContact.location}
                        </span>
                      </div>
                    </li>
                  </ul>
                </address>

                {/* Map placeholder — replace with Google Maps embed in Phase 3 */}
                <div
                  style={{
                    marginTop: 'var(--space-8)',
                    height: 200,
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                  }}
                  role="img"
                  aria-label="Map placeholder — Google Maps embed to be added"
                >
                  <span style={{ fontSize: '2rem' }} aria-hidden="true">🗺️</span>
                  <ConfirmBadge label="Map embed — confirm address first" />
                </div>
              </div>
            </ScrollReveal>

            {/* ── Contact form ── */}
            <ScrollReveal delay={0.15}>
              <div
                style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  padding: 'var(--space-10)',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--fs-xl)',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--space-8)',
                  }}
                >
                  {t('contact.formTitle')}
                </h2>

                {formState === FORM_STATES.SUCCESS ? (
                  <div
                    role="alert"
                    style={{
                      padding: 'var(--space-8)',
                      background: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      textAlign: 'center',
                      color: '#86efac',
                    }}
                  >
                    ✓ {t('contact.successMessage')}
                  </div>
                ) : (
                  <form
                    className="form"
                    onSubmit={handleSubmit}
                    aria-label={t('contact.formTitle')}
                    noValidate
                  >
                    {/* Honeypot — intentionally named 'website' to lure bots */}
                    <div className="form__honeypot" aria-hidden="true">
                      <label htmlFor="hp-website">Website</label>
                      <input
                        id="hp-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <div className="form__group">
                      <label className="form__label" htmlFor="contact-name">
                        {t('contact.nameLabel')} *
                      </label>
                      <input
                        id="contact-name"
                        className="form__input"
                        type="text"
                        name="name"
                        value={fields.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        autoComplete="name"
                        disabled={isLoading}
                        aria-required="true"
                      />
                    </div>

                    <div className="form__group">
                      <label className="form__label" htmlFor="contact-email">
                        {t('contact.emailLabel')} *
                      </label>
                      <input
                        id="contact-email"
                        className="form__input"
                        type="email"
                        name="email"
                        value={fields.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        disabled={isLoading}
                        aria-required="true"
                      />
                    </div>

                    <div className="form__group">
                      <label className="form__label" htmlFor="contact-message">
                        {t('contact.messageLabel')} *
                      </label>
                      <textarea
                        id="contact-message"
                        className="form__textarea"
                        name="message"
                        value={fields.message}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                        disabled={isLoading}
                        aria-required="true"
                      />
                    </div>

                    {/* Phase 4: Cloudflare Turnstile will be inserted here */}
                    {/* <CloudflareTurnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} /> */}

                    {formState === FORM_STATES.ERROR && (
                      <p
                        role="alert"
                        style={{
                          color: '#f87171',
                          fontSize: 'var(--fs-sm)',
                          padding: 'var(--space-3) var(--space-4)',
                          background: 'rgba(248, 113, 113, 0.1)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {t('contact.errorMessage')}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn btn--primary"
                      id="contact-submit"
                      disabled={isLoading}
                      aria-busy={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading-dot" aria-hidden="true" />
                          {t('common.loading')}
                        </>
                      ) : (
                        t('contact.submitButton')
                      )}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
