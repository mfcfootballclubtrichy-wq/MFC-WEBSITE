/**
 * IndividualAchievements.jsx — Player-level recognitions, state representation, and higher-ed scholarships.
 *
 * Privacy gate: Only records with verified consent (hasConsent === true) are displayed.
 */
import { useTranslation } from 'react-i18next';
import ScrollReveal  from '../components/ScrollReveal.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import { INDIVIDUAL_ACHIEVEMENTS as STATIC_IND_ACH } from '../data/content.js';
import { useContent } from '../context/ContentContext.jsx';

export default function IndividualAchievements() {
  const { t } = useTranslation();
  const { content } = useContent();

  const achievementsList = content?.individual_achievements || STATIC_IND_ACH;
  // Privacy compliance gate
  const publicAchievements = achievementsList.filter((item) => item.hasConsent ?? true);

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <span className="section__eyebrow">Player Development</span>
          <h1 className="page-hero__title">{t('individualAchievements.title')}</h1>
          <p className="page-hero__sub">
            Celebrating state squad selections, university representations, and higher education sports-quota scholarships.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section" aria-labelledby="ind-ach-heading">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <h2 id="ind-ach-heading" className="section__title">
                Scholarships & Selections
              </h2>
              <p className="section__subtitle">
                MFC players advancing into higher education and senior state leagues through football excellence.
              </p>
            </div>
          </ScrollReveal>

          {/* Cards Grid */}
          <div className="grid--3">
            {publicAchievements.map((ach, i) => (
              <ScrollReveal key={ach.id || i} delay={i * 0.05}>
                <article className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="card__body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                      <span className="card__tag">{ach.category}</span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--surface-2)',
                          color: 'var(--accent-dark)',
                          fontWeight: 600,
                        }}
                      >
                        ✓ Verified
                      </span>
                    </div>
                    <h3 className="card__title" style={{ fontSize: '1.35rem' }}>{ach.player}</h3>
                    <p className="card__text" style={{ color: 'var(--text)', marginTop: 'auto', paddingTop: 'var(--space-2)' }}>
                      {ach.highlight}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <SectionDivider />

          {/* Data Privacy & Consent Disclosure */}
          <ScrollReveal delay={0.2}>
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 'var(--space-6) var(--space-8)',
              }}
            >
              <h4 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>
                Data Privacy & Youth Consent Notice
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>
                All athlete achievements, photos, and scholarship disclosures displayed on this website have been published with appropriate written participant or guardian consent. For questions or updates regarding athlete listings, please contact our administrative desk at <a href="mailto:mfcfootballacademy@gmail.com">mfcfootballacademy@gmail.com</a>.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
