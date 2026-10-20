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
import { useContent } from '../context/ContentContext.jsx';
import aboutFreestyleImg from '../assets/about-freestyle.png';

import ScrollReveal   from '../components/ScrollReveal.jsx';
import StatCounter    from '../components/StatCounter.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import ConfirmBadge   from '../components/ConfirmBadge.jsx';

import {
  CLUB as STATIC_CLUB,
  HOME_CONTENT as STATIC_HOME_CONTENT,
  ABOUT_TEXT as STATIC_ABOUT_TEXT,
  COACHES as STATIC_COACHES,
  AGE_GROUPS,
  PARTNERSHIP_POINTS,
  TEAM_ACHIEVEMENTS as STATIC_TEAM_ACHIEVEMENTS,
  INDIVIDUAL_ACHIEVEMENTS as STATIC_INDIVIDUAL_ACHIEVEMENTS,
  STATS,
} from '../data/content.js';

const PARTNER_ICONS = ['🏅', '🛡️', '📋', '💪', '🏆'];

export default function Home() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const { content } = useContent();

  const homeData = content?.home || STATIC_HOME_CONTENT;
  const updatesList = content?.updates || [];
  const aboutText = content?.about?.body || STATIC_ABOUT_TEXT;
  const coachesList = content?.coaches || STATIC_COACHES;
  const teamAchievementsList = content?.team_achievements || STATIC_TEAM_ACHIEVEMENTS;
  const individualAchievementsList = content?.individual_achievements || STATIC_INDIVIDUAL_ACHIEVEMENTS;

  // Highlight first 3 team achievements
  const topTeamAchievements = teamAchievementsList.slice(0, 3);
  // Highlight individual achievements with consent
  const topIndividual = individualAchievementsList.filter((item) => item.hasConsent ?? true).slice(0, 3);

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
              <span>{homeData.kicker || STATIC_HOME_CONTENT.kicker}</span>
              <span style={{ color: 'var(--border)' }}>•</span>
              <span>{STATIC_CLUB.tagline}</span>
            </motion.p>

            {/* Headline with animated underline */}
            <div className="hero__headline-wrapper">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {homeData.headline || STATIC_HOME_CONTENT.headline}
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
              {homeData.subheadline || STATIC_HOME_CONTENT.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="hero__cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Link to="/team-achievements" className="btn btn-primary" id="hero-cta-achievements">
                {homeData.ctaPrimary || STATIC_HOME_CONTENT.ctaPrimary}
              </Link>
              <Link to="/coaches" className="btn btn--outline" id="hero-cta-coaches">
                {homeData.ctaSecondary || STATIC_HOME_CONTENT.ctaSecondary}
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
          2.5. LATEST UPDATES & ANNOUNCEMENTS (DYNAMIC TEMPLATE)
      ══════════════════════════════════════════════════ */}
      {updatesList && updatesList.length > 0 && (
        <section className="section" aria-labelledby="updates-heading">
          <div className="container">
            <ScrollReveal>
              <div className="section__header">
                <span className="section__eyebrow">MFC Bulletin</span>
                <h2 id="updates-heading" className="section__title">
                  Latest News & Updates
                </h2>
                <p className="section__subtitle">
                  Stay updated with our ongoing tournaments, upcoming matches, seasonal camps, and academy milestones.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid--3">
              {updatesList.map((item, idx) => {
                const articleId = item.id || encodeURIComponent((item.title || `update-${idx}`).toLowerCase().replace(/\s+/g, '-'));

                return (
                  <ScrollReveal key={item.id || idx} delay={idx * 0.1}>
                    <Link
                      to={`/news/${articleId}`}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
                      title={`Read full update: ${item.title}`}
                    >
                      <article
                        className="card"
                        style={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.borderColor = 'var(--accent)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}
                      >
                        {item.image && (
                          <div style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 'var(--space-2)',
                                right: 'var(--space-2)',
                                background: 'rgba(0,0,0,0.7)',
                                backdropFilter: 'blur(4px)',
                                color: '#fff',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            >
                              Read Article →
                            </div>
                          </div>
                        )}
                        <div className="card__body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                            <span className="card__tag">{item.tag || 'Update'}</span>
                            {item.date && (
                              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)' }}>
                                {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <h3 className="card__title" style={{ fontSize: '1.25rem', marginBottom: 'var(--space-3)' }}>
                            {item.title}
                          </h3>
                          <p className="card__text" style={{ flex: 1, color: 'var(--muted)', lineHeight: 1.6 }}>
                            {item.description}
                          </p>
                        </div>
                      </article>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          2.8. OFFICIAL YOUTUBE VIDEO & SHORTS REEL SHOWCASE
      ══════════════════════════════════════════════════ */}
      <section id="mfc-media" className="section" style={{ background: 'var(--surface-2)', scrollMarginTop: '80px' }} aria-labelledby="media-heading">
        <div className="container">
          <SectionDivider />
          <ScrollReveal>
            <div className="section__header" style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section__eyebrow">Match Action & Training</span>
              <h2 id="media-heading" className="section__title">
                Watch MFC in Action
              </h2>
              <p className="section__subtitle" style={{ maxWidth: '680px', margin: '0 auto' }}>
                Experience our official tournament highlights, training drills, and viral skills reels directly from our YouTube channel.
              </p>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-8)',
              alignItems: 'start',
            }}
          >
            {/* 16:9 Landscape Video */}
            <ScrollReveal delay={0.1}>
              <div
                className="card"
                style={{
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-glow)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span className="card__tag" style={{ background: 'var(--accent-dark)', color: '#FFF' }}>
                    Feature Match Video
                  </span>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>16:9 HD</span>
                </div>

                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '56.25%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#000',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  }}
                >
                  <iframe
                    src="https://www.youtube.com/embed/AB9QMbrBq5g?si=RCbJALNNCkxoExzq"
                    title="Mutharasanallur Football Club Official Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                  />
                </div>

                <div style={{ marginTop: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>
                    MFC Football Academy — Tournament & Training Documentary
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                    Follow our young football players as they train at Tamilan Nagar Ground, compete in regional invitationals, and prepare for state leagues.
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=AB9QMbrBq5g"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline"
                    style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 1rem' }}
                  >
                    Watch on YouTube ↗
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* 9:16 Vertical Reel Player */}
            <ScrollReveal delay={0.2}>
              <div
                className="card"
                style={{
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-glow)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span className="card__tag" style={{ background: 'var(--accent)', color: '#FFF' }}>
                    Academy Shorts
                  </span>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>9:16 Reel</span>
                </div>

                <div
                  style={{
                    maxWidth: '280px',
                    margin: '0 auto',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    border: '3px solid #1E293B',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.22)',
                    background: '#000',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '177.77%',
                    }}
                  >
                    <iframe
                      src="https://www.youtube.com/embed/Gis6rlwzR5U"
                      title="MFC Academy YouTube Shorts"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-2)' }}>
                    Ball Mastery & Skills Highlight Reel
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.5, marginBottom: 'var(--space-4)' }}>
                    Fast-paced footwork, agility drills, and technical shooting practice from our youth squad.
                  </p>
                  <a
                    href="https://youtube.com/shorts/Gis6rlwzR5U"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline"
                    style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 1rem' }}
                  >
                    Open Shorts Reel ↗
                  </a>
                </div>
              </div>
            </ScrollReveal>
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
                  {aboutText}
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
                  src={aboutFreestyleImg}
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
            {coachesList.map((coach, i) => (
              <ScrollReveal key={coach.id || i} delay={i * 0.1}>
                <article className="card" style={{ height: '100%' }}>
                  <div className="card__body">
                    <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center' }}>
                      {coach.photo ? (
                        <div
                          style={{
                            width: 110,
                            height: 110,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '2px solid var(--accent)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                            flexShrink: 0,
                          }}
                        >
                          <img src={coach.photo} alt={coach.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 110,
                            height: 110,
                            borderRadius: '16px',
                            background: 'var(--accent-glow)',
                            color: 'var(--accent-dark)',
                            border: '2px solid var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        >
                          {coach.name?.charAt(0) || 'C'}
                        </div>
                      )}
                    </div>
                    <span className="card__tag">{coach.role}</span>
                    <h3 className="card__title">{coach.name}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                      {(Array.isArray(coach.licence) ? coach.licence : [coach.licence]).filter(Boolean).map((lic) => (
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
                {topTeamAchievements.map((item, idx) => (
                  <tr key={item.id || idx}>
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
              <ScrollReveal key={item.id || i} delay={i * 0.1}>
                <article className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {(item.image || item.photo) && (
                    <div style={{ height: '180px', width: '100%', overflow: 'hidden', background: 'var(--surface-2)' }}>
                      <img
                        src={item.image || item.photo}
                        alt={item.player}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="card__body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span className="card__tag">{item.category}</span>
                    <h3 className="card__title">{item.player}</h3>
                    <p className="card__text" style={{ color: 'var(--text)', marginTop: 'auto', paddingTop: 'var(--space-2)' }}>
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
              <a href={`tel:${content?.contact?.phone || STATIC_CLUB.phone}`} className="btn btn--outline">
                📞 Call {content?.contact?.phone || STATIC_CLUB.phone}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
