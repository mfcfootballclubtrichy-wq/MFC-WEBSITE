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
          <span className="section__eyebrow">{schoolData.heroEyebrow || t('nav.schoolProgram')}</span>
          <h1 className="page-hero__title">{schoolData.title || t('schoolProgram.title')}</h1>
          <p className="page-hero__sub">{schoolData.subtitle || schoolData.description || t('schoolProgram.description')}</p>
        </div>
      </section>

      {/* Program description */}
      <section className="section" aria-labelledby="school-desc-heading">
        <div className="container">
          <div className="grid--2" style={{ alignItems: 'center' }}>
            <ScrollReveal>
              <div>
                <h2 id="school-desc-heading" className="section__title" style={{ textAlign: 'left' }}>
                  {schoolData.highlightsTitle || t('schoolProgram.highlightsTitle')}
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

      {/* Program Packages & Multiple Choice Curriculum Modules */}
      {(schoolData.modules || STATIC_SCHOOL_PROGRAM.modules)?.length > 0 && (
        <section className="section section--surface" aria-labelledby="school-modules-heading">
          <div className="container">
            <ScrollReveal>
              <div className="section__header">
                <span className="section__eyebrow">Flexible Curriculums</span>
                <h2 id="school-modules-heading" className="section__title">
                  {schoolData.modulesTitle || STATIC_SCHOOL_PROGRAM.modulesTitle || 'Partnership Program Modules'}
                </h2>
                <p className="section__subtitle">
                  Tailored football modules designed to integrate seamlessly into academic schedules.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid--2" style={{ gap: 'var(--space-6)' }}>
              {(schoolData.modules || STATIC_SCHOOL_PROGRAM.modules).map((mod, i) => (
                <ScrollReveal key={mod.id || i} delay={i * 0.08}>
                  <div
                    className="card"
                    style={{
                      padding: 'var(--space-6)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-3)',
                      height: '100%',
                      borderTop: '4px solid var(--accent)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text)' }}>
                        {mod.title}
                      </h3>
                      {mod.duration && (
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: 'var(--accent-glow)',
                          color: 'var(--accent-dark)',
                          border: '1px solid var(--accent)',
                        }}>
                          ⏱️ {mod.duration}
                        </span>
                      )}
                    </div>

                    {mod.ageBracket && (
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>
                        👥 Target Bracket: <span style={{ color: 'var(--text)' }}>{mod.ageBracket}</span>
                      </div>
                    )}

                    <p style={{ color: 'var(--text)', fontSize: 'var(--fs-sm)', lineHeight: 1.6, marginTop: 'auto' }}>
                      {mod.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Target Age Groups & Facility Readiness */}
            {((schoolData.ageCategories || STATIC_SCHOOL_PROGRAM.ageCategories)?.length > 0 || (schoolData.facilitiesNeeded || STATIC_SCHOOL_PROGRAM.facilitiesNeeded)?.length > 0) && (
              <ScrollReveal delay={0.2}>
                <div
                  style={{
                    marginTop: 'var(--space-8)',
                    padding: 'var(--space-6)',
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--space-6)',
                  }}
                >
                  {(schoolData.ageCategories || STATIC_SCHOOL_PROGRAM.ageCategories)?.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--accent-dark)' }}>
                        👥 Eligible Student Age Categories:
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(schoolData.ageCategories || STATIC_SCHOOL_PROGRAM.ageCategories).map((cat) => (
                          <span
                            key={cat}
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '4px 10px',
                              borderRadius: '999px',
                              background: 'var(--surface-2)',
                              border: '1px solid var(--border)',
                              color: 'var(--text)',
                            }}
                          >
                            ✓ {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(schoolData.facilitiesNeeded || STATIC_SCHOOL_PROGRAM.facilitiesNeeded)?.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--accent-dark)' }}>
                        🏟️ Supported Ground & Pitch Facilities:
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(schoolData.facilitiesNeeded || STATIC_SCHOOL_PROGRAM.facilitiesNeeded).map((fac) => (
                          <span
                            key={fac}
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '4px 10px',
                              borderRadius: '999px',
                              background: 'var(--surface-2)',
                              border: '1px solid var(--border)',
                              color: 'var(--text)',
                            }}
                          >
                            🏟️ {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* Benefits for schools */}
      <section
        className="section"
        style={{ background: 'var(--surface)' }}
        aria-labelledby="school-benefits-heading"
      >
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__eyebrow">Institutional Partnership</span>
              <h2 id="school-benefits-heading" className="section__title">
                {schoolData.benefitsTitle || t('schoolProgram.benefitsTitle')}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid--3" style={{ maxWidth: 1000, margin: '0 auto' }}>
            {(schoolData.schoolBenefits || STATIC_SCHOOL_PROGRAM.schoolBenefits).map((benefit, i) => (
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
              {schoolData.ctaTitle || t('schoolProgram.ctaTitle')}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 'var(--fs-lg)',
                margin: 'var(--space-4) auto var(--space-8)',
                maxWidth: '55ch',
              }}
            >
              {schoolData.ctaBody || t('schoolProgram.ctaBody')}
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
