/**
 * Coaches.jsx — Coaching leadership profiles.
 *
 * Implements Dhanapal, Rajesh, and Pragadeesh with AIFF license badges.
 */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ScrollReveal  from '../components/ScrollReveal.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import { COACHES as STATIC_COACHES } from '../data/content.js';
import { useContent } from '../context/ContentContext.jsx';

export default function Coaches() {
  const { t } = useTranslation();
  const { content } = useContent();

  const coachesList = content?.coaches || STATIC_COACHES;

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

          <div className="grid--3 coaches-grid">
            {coachesList.map((coach, i) => (
              <ScrollReveal key={coach.id || i} delay={i * 0.1}>
                <article
                  className="card coach-card"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: 'var(--space-6)',
                  }}
                >
                  {/* Transparent Cutout Portrait with Animated Sliding Entrance on Scroll */}
                  <motion.div
                    initial={{ opacity: 0, y: 55, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.15,
                    }}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      width: '100%',
                      height: '240px',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    {/* Subtle radial glow behind the transparent cutout */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(134, 239, 172, 0.25) 0%, transparent 70%)',
                        pointerEvents: 'none',
                        zIndex: 0,
                      }}
                    />

                    {coach.photo ? (
                      <img
                        src={coach.photo}
                        alt={coach.name}
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          maxHeight: `${coach.maxHeight || 235}px`,
                          width: 'auto',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          transform: `scale(${coach.scale || 1}) translateY(${coach.offsetY || 0}px)`,
                          filter: 'drop-shadow(0 14px 22px rgba(0, 0, 0, 0.14))',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          background: 'var(--accent-glow)',
                          color: 'var(--accent-dark)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                          fontWeight: 700,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        }}
                        aria-hidden="true"
                      >
                        {coach.name?.charAt(0) || 'C'}
                      </div>
                    )}
                  </motion.div>

                  <span className="card__tag" style={{ alignSelf: 'center', marginBottom: 'var(--space-2)' }}>
                    {coach.role}
                  </span>
                  <h3 className="card__title" style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>
                    {coach.name}
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                    {(Array.isArray(coach.licence) ? coach.licence : [coach.licence]).filter(Boolean).map((lic) => (
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
