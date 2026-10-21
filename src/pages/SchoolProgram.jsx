/**
 * SchoolProgram.jsx — School partnership program page.
 *
 * Sections:
 * 1. Page hero
 * 2. Program description
 * 3. Highlights grid
 * 4. Benefits for schools
 * 5. CTA
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { SCHOOL_PROGRAM as STATIC_SCHOOL_PROGRAM } from '../data/content.js';
import { useContent } from '../context/ContentContext.jsx';

const HIGHLIGHT_ICONS = ['📚', '📊', '🏆', '🗺️'];
const BENEFIT_ICONS   = ['🎖️', '🔍', '💪', '🤝', '📜'];

export default function SchoolProgram() {
  const { t } = useTranslation();
  const { content } = useContent();

  const schoolData = content?.school_program || STATIC_SCHOOL_PROGRAM;
  const schoolImage = schoolData.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80";

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <span className="section__eyebrow">{t('nav.schoolProgram')}</span>
          <h1 className="page-hero__title">{t('schoolProgram.title')}</h1>
          <p className="page-hero__sub">{schoolData.description || t('schoolProgram.description')}</p>
        </div>
      </section>

      {/* Program description */}
      <section className="section" aria-labelledby="school-desc-heading">
        <div className="container">
          <div className="grid--2" style={{ alignItems: 'center' }}>
            <ScrollReveal>
              <div>
                <h2 id="school-desc-heading" className="section__title" style={{ textAlign: 'left' }}>
                  {t('schoolProgram.highlightsTitle')}
                </h2>
                <div className="divider--accent" />
                <p style={{ color: 'var(--muted)', marginTop: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                  {schoolData.description || STATIC_SCHOOL_PROGRAM.description}
                </p>

                <div className="feature-list">
                  {(schoolData.highlights || STATIC_SCHOOL_PROGRAM.highlights).map((h, i) => (
                    <div key={h} className="feature-item">
                      <div className="feature-item__icon" aria-hidden="true">
                        {HIGHLIGHT_ICONS[i] ?? '✓'}
                      </div>
                      <p className="feature-item__text">{h}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Dynamic School Training Photo */}
            <ScrollReveal delay={0.15}>
              <div
                style={{
                  width: '100%',
                  height: schoolData.maxHeight || 440,
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}
              >
                <img
                  src={schoolImage}
                  alt="MFC School Football Training Program"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${schoolData.scale || 1}) translateY(${schoolData.offsetY || 0}px)`,
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Benefits for schools */}
      <section
        className="section"
        style={{ background: 'var(--surface)' }}
        aria-labelledby="school-benefits-heading"
      >
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__eyebrow">{t('schoolProgram.benefitsTitle')}</span>
              <h2 id="school-benefits-heading" className="section__title">
                {t('schoolProgram.benefitsTitle')}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid--3" style={{ maxWidth: 1000, margin: '0 auto' }}>
            {SCHOOL_PROGRAM.schoolBenefits.map((benefit, i) => (
              <ScrollReveal key={benefit} delay={i * 0.07}>
                <div
                  style={{
                    padding: 'var(--space-8) var(--space-6)',
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                    transition: 'transform var(--transition), border-color var(--transition)',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }} aria-hidden="true">
                    {BENEFIT_ICONS[i] ?? '✓'}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--fs-lg)',
                      textTransform: 'uppercase',
                      color: 'var(--text)',
                    }}
                  >
                    {benefit}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section
        className="section"
        style={{ background: 'var(--accent)' }}
        aria-labelledby="school-cta-page-heading"
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <ScrollReveal>
            <h2
              id="school-cta-page-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-3xl)',
                textTransform: 'uppercase',
                color: 'var(--text)',
              }}
            >
              {t('schoolProgram.ctaTitle')}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 'var(--fs-lg)',
                margin: 'var(--space-4) auto var(--space-8)',
                maxWidth: '55ch',
              }}
            >
              {t('schoolProgram.ctaBody')}
            </p>
            <Link
              to="/contact"
              className="btn"
              id="school-program-contact-cta"
              style={{ background: 'var(--bg)', color: 'var(--text)', borderColor: 'var(--bg)' }}
            >
              {t('schoolProgram.ctaButton')}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
