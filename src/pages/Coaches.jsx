/**
 * Coaches.jsx — Coaching leadership profiles.
 *
 * Implements Dhanapal, Rajesh, and Pragadeesh with AIFF license badges.
 */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal.jsx';
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
      <section className="section section--white" aria-labelledby="coaches-list-heading">
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
            {coachesList.map((coach, i) => {
              const stageHeight = coach.maxHeight ? Math.min(Math.max(coach.maxHeight, 180), 245) : 220;
              const coachScale = Math.min(coach.scale || 1, 1.25);
              const coachOffsetY = Math.min(Math.max(coach.offsetY || 0, -35), 35);

              return (
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
                    {/* Dedicated Portrait Stage — Never overlaps or hides text */}
                    <motion.div
                      initial={{ opacity: 0, y: 35, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                        delay: i * 0.1,
                      }}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: `${stageHeight}px`,
                        minHeight: `${stageHeight}px`,
                        marginBottom: 'var(--space-4)',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        background: 'radial-gradient(circle at center 60%, rgba(210, 4, 45, 0.08) 0%, transparent 72%)',
                        flexShrink: 0,
                      }}
                    >
                      {/* Subtle ambient lighting behind cutout */}
                      <div
                        style={{
                          position: 'absolute',
                          width: '180px',
                          height: '180px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(210, 4, 45, 0.12) 0%, transparent 70%)',
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
                            maxHeight: '100%',
                            maxWidth: '100%',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            transform: `scale(${coachScale}) translateY(${coachOffsetY}px)`,
                            filter: 'drop-shadow(0 10px 18px rgba(0, 0, 0, 0.12))',
                            transition: 'transform 0.2s ease',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            width: '110px',
                            height: '110px',
                            borderRadius: '50%',
                            background: 'var(--accent-glow)',
                            color: 'var(--accent-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.8rem',
                            fontWeight: 700,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                          }}
                          aria-hidden="true"
                        >
                          {coach.name?.charAt(0) || 'C'}
                        </div>
                      )}
                    </motion.div>

                    {/* Text Details Area — Full priority, guaranteed visibility */}
                    <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span className="card__tag" style={{ marginBottom: 'var(--space-2)' }}>
                        {coach.role}
                      </span>
                      <h3 className="card__title" style={{ fontSize: '1.45rem', marginBottom: 'var(--space-2)', color: '#0A0A0A' }}>
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
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
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
