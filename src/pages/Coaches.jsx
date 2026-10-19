/**
 * Coaches.jsx — Coaching leadership profiles.
 *
 * Implements Dhanapal, Rajesh, and Pragadeesh with AIFF license badges.
 */
import { useTranslation } from 'react-i18next';
import ScrollReveal  from '../components/ScrollReveal.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import { COACHES } from '../data/content.js';

export default function Coaches() {
  const { t } = useTranslation();

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <span className="section__eyebrow">Technical Team</span>
          <h1 className="page-hero__title">{t('coaches.title')}</h1>
          <p className="page-hero__sub">
            Licensed football mentors combining tactical acumen, sports science, and grassroots mentorship.
          </p>
        </div>
      </section>

      {/* Coaches grid */}
      <section className="section" aria-labelledby="coaches-list-heading">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <h2 id="coaches-list-heading" className="section__title">
                Coaching Staff & Mentors
              </h2>
              <p className="section__subtitle">
                All training modules are overseen by AIFF-certified coaches adhering to international grassroots standards.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid--3">
            {COACHES.map((coach, i) => (
              <ScrollReveal key={coach.id} delay={i * 0.1}>
                <article className="card" style={{ padding: 'var(--space-8)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Avatar badge */}
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: 'var(--accent-glow)',
                      color: 'var(--accent-dark)',
                      border: '2px solid var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: 700,
                      marginBottom: 'var(--space-5)',
                    }}
                    aria-hidden="true"
                  >
                    {coach.name.charAt(0)}
                  </div>

                  <span className="card__tag">{coach.role}</span>
                  <h3 className="card__title">{coach.name}</h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                    {coach.licence.map((lic) => (
                      <span key={lic} className="badge--confirm">
                        {lic}
                      </span>
                    ))}
                  </div>

                  <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginTop: 'auto', lineHeight: 1.6 }}>
                    {coach.bio}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <SectionDivider />

          <ScrollReveal delay={0.2}>
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-8)',
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}
            >
              <h4 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-2)' }}>
                Interested in Coaching Opportunities with MFC?
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-4)' }}>
                We welcome licensed coaches passionate about community football development in the Trichy district.
              </p>
              <a href="mailto:mfcfootballacademy@gmail.com" className="btn btn--outline">
                Contact Technical Director
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
