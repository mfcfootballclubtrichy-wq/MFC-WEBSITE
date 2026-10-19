/**
 * Home.jsx — Landing page for Mutharasanallur Football Club (MFC).
 *
 * Implements:
 * - Clean light theme (#FFFFFF, #16A34A, #86EFAC, #0F7A36, #0A0A0A)
 * - Hero light green gradient blob drifting slowly behind headline
 * - Light green underline that draws in beneath the title
 * - Section dividers that grow from left to right as you scroll
 * - Cards with 6px lift & light green glow box-shadow (0 10px 30px rgba(134, 239, 172, 0.45))
 * - Black stat numbers with animated light green bar filling beneath each
 * - Buttons with light green hover sweep
 */
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import ScrollReveal   from '../components/ScrollReveal.jsx';
import StatCounter    from '../components/StatCounter.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import ConfirmBadge   from '../components/ConfirmBadge.jsx';

import {
  CLUB,
  HOME_CONTENT,
  ABOUT_TEXT,
  COACHES,
  AGE_GROUPS,
  PARTNERSHIP_POINTS,
  TEAM_ACHIEVEMENTS,
  INDIVIDUAL_ACHIEVEMENTS,
  STATS,
} from '../data/content.js';

const PARTNER_ICONS = ['🏅', '🛡️', '📋', '💪', '🏆'];

export default function Home() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  // Highlight first 3 team achievements
  const topTeamAchievements = TEAM_ACHIEVEMENTS.slice(0, 3);
  // Highlight individual achievements with consent
  const topIndividual = INDIVIDUAL_ACHIEVEMENTS.filter((item) => item.hasConsent).slice(0, 3);

  return (
    <>
      {/* ══════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════ */}
      <section className="hero" aria-label="Hero banner">
        {/* Animated Light Green Blob */}
        <div className="hero__blob" aria-hidden="true" />

        <div className="container">
          <div className="hero__content">
            {/* Kicker */}
            <motion.p
              className="hero__eyebrow"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span>{HOME_CONTENT.kicker}</span>
              <span style={{ color: 'var(--border)' }}>•</span>
              <span>{CLUB.tagline}</span>
            </motion.p>

            {/* Headline with animated underline */}
            <div className="hero__headline-wrapper">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {HOME_CONTENT.headline}
              </motion.h1>
              <div className="hero__headline-underline" aria-hidden="true" />
            </div>

            {/* Subheadline */}
            <motion.p
              className="hero__sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {HOME_CONTENT.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="hero__cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Link to="/team-achievements" className="btn btn-primary" id="hero-cta-achievements">
                {HOME_CONTENT.ctaPrimary}
              </Link>
              <Link to="/coaches" className="btn btn--outline" id="hero-cta-coaches">
                {HOME_CONTENT.ctaSecondary}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. STATS ROW
      ══════════════════════════════════════════════════ */}
      <section className="section section--surface" aria-label="Club Statistics">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((stat) => (
              <StatCounter
                key={stat.id}
                value={stat.value}
                suffix={stat.suffix}
                label={t(stat.labelKey)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. ABOUT MFC
      ══════════════════════════════════════════════════ */}
      <section className="section" aria-labelledby="about-heading">
        <div className="container">
          <SectionDivider />
          <div className="about-grid">
            <ScrollReveal>
              <div>
                <span className="section__eyebrow">{t('nav.about')}</span>
                <h2 id="about-heading" className="section__title" style={{ marginBottom: 'var(--space-6)' }}>
                  About MFC
                </h2>
                <p className="lead" style={{ marginBottom: 'var(--space-6)' }}>
                  {ABOUT_TEXT}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <Link to="/about" className="btn btn-primary">
                    Learn More About Us
                  </Link>
                  <Link to="/vision" className="btn btn--outline">
                    Our Vision
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="about-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
                  alt="MFC Youth Football Training in Trichy"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. COACHING STAFF PREVIEW
      ══════════════════════════════════════════════════ */}
      <section className="section section--surface" aria-labelledby="coaches-heading">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__eyebrow">{t('nav.coaches')}</span>
              <h2 id="coaches-heading" className="section__title">
                Coaching Leadership
              </h2>
              <p className="section__subtitle">
                Certified AIFF licensed mentors committed to technical excellence and grassroots player advancement.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid--3">
            {COACHES.map((coach, i) => (
              <ScrollReveal key={coach.id} delay={i * 0.1}>
                <article className="card" style={{ height: '100%' }}>
                  <div className="card__body">
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'var(--accent-glow)',
                        color: 'var(--accent-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                        marginBottom: 'var(--space-4)',
                        fontWeight: 700,
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
                    <p className="card__text">{coach.bio}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <Link to="/coaches" className="btn btn--outline">
              View All Coaches & Profiles
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. TEAM ACHIEVEMENTS & PODIUMS
      ══════════════════════════════════════════════════ */}
      <section className="section" aria-labelledby="tournaments-heading">
        <div className="container">
          <SectionDivider />
          <ScrollReveal>
            <div className="section__header">
              <span className="section__eyebrow">Podiums & Honors</span>
              <h2 id="tournaments-heading" className="section__title">
                Recent Tournament Record
              </h2>
              <p className="section__subtitle">
                Proven competitive performance across district and state invitationals in Trichy & Karur (2021–2023).
              </p>
            </div>
          </ScrollReveal>

          <div className="mfc-table-wrapper">
            <table className="mfc-table">
              <thead>
                <tr>
                  <th>Tournament</th>
                  <th>Season</th>
                  <th>Result</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {topTeamAchievements.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.tournament}</td>
                    <td>{item.season}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--accent-glow)',
                          color: 'var(--accent-dark)',
                          fontWeight: 700,
                          fontSize: 'var(--fs-xs)',
                        }}
                      >
                        🥈 {item.place}
                      </span>
                    </td>
                    <td>{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/team-achievements" className="btn btn-primary">
              View Full Tournament History
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. INDIVIDUAL PATHWAYS & SCHOLARSHIPS
      ══════════════════════════════════════════════════ */}
      <section className="section section--surface" aria-labelledby="player-pathways-heading">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__eyebrow">Player Milestones</span>
              <h2 id="player-pathways-heading" className="section__title">
                State Selections & Scholarships
              </h2>
              <p className="section__subtitle">
                Empowering student-athletes with university scholarships and state tournament representations.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid--3">
            {topIndividual.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.1}>
                <article className="card" style={{ height: '100%' }}>
                  <div className="card__body">
                    <span className="card__tag">{item.category}</span>
                    <h3 className="card__title">{item.player}</h3>
                    <p className="card__text" style={{ color: 'var(--text)' }}>
                      {item.highlight}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <Link to="/individual-achievements" className="btn btn--outline">
              Explore All Player Achievements
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. AGE GROUPS
      ══════════════════════════════════════════════════ */}
      <section className="section" aria-labelledby="age-groups-heading">
        <div className="container">
          <SectionDivider />
          <ScrollReveal>
            <div className="section__header">
              <span className="section__eyebrow">{t('ageGroups.title')}</span>
              <h2 id="age-groups-heading" className="section__title">
                Youth Training Batches
              </h2>
              <p className="section__subtitle">
                Structured progressive coaching designed specifically for every developmental age bracket.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid--4">
            {AGE_GROUPS.map((group, i) => (
              <ScrollReveal key={group.id} delay={i * 0.08}>
                <div className="age-group-card">
                  <h3 className="age-group-card__label">{group.label}</h3>
                  <p className="age-group-card__years">
                    {t('ageGroups.bornLabel')} {group.years}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          8. PARTNERSHIP & CONTACT CALLOUT
      ══════════════════════════════════════════════════ */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
          borderTop: '1px solid var(--border)',
        }}
        aria-labelledby="cta-banner-heading"
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <ScrollReveal>
            <span className="section__eyebrow">Get Started</span>
            <h2 id="cta-banner-heading" className="section__title" style={{ marginBottom: 'var(--space-4)' }}>
              Join Mutharasanallur Football Club
            </h2>
            <p className="lead" style={{ margin: '0 auto var(--space-8)' }}>
              Looking to enroll your child, partner your school with MFC, or support our community grassroots initiatives?
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary">
                Contact Club Management
              </Link>
              <a href={`tel:${CLUB.phone}`} className="btn btn--outline">
                📞 Call {CLUB.phone}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
