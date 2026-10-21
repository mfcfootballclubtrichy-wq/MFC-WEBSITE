/**
 * PlayerProfile.jsx — Dedicated showcase and achievement profile for MFC athletes.
 * Displays player bio, achievements, milestones, position, gallery, and honors.
 */
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContent } from '../context/ContentContext.jsx';
import { INDIVIDUAL_ACHIEVEMENTS as STATIC_IND_ACH } from '../data/content.js';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SectionDivider from '../components/SectionDivider.jsx';

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { content } = useContent();

  const achievementsList = content?.individual_achievements || STATIC_IND_ACH;

  // Find player item by ID or slug match
  const playerItem = achievementsList.find((item) => {
    if (item.id === id) return true;
    const itemSlug = encodeURIComponent((item.player || '').toLowerCase().replace(/\s+/g, '-'));
    return itemSlug === id;
  }) || achievementsList[0];

  if (!playerItem) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-16)', textAlign: 'center' }}>
        <h2>Player Profile Not Found</h2>
        <p style={{ color: 'var(--muted)', margin: 'var(--space-4) 0 var(--space-6)' }}>
          The player profile you are looking for may have been updated or removed.
        </p>
        <Link to="/individual-achievements" className="btn btn-primary">
          Back to Individual Achievements
        </Link>
      </div>
    );
  }

  // Related achievements for the same player (e.g. Pragadeesh has multiple achievements)
  const playerName = playerItem.player?.trim() || 'MFC Athlete';
  const relatedAchievements = achievementsList.filter(
    (item) => item.player?.toLowerCase().trim() === playerName.toLowerCase() && item.id !== playerItem.id
  );

  const photo = playerItem.image || playerItem.photo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80';

  return (
    <>
      {/* Profile Header Hero */}
      <section className="page-hero" style={{ paddingBottom: 'var(--space-12)' }}>
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: 'var(--fs-sm)',
              marginBottom: 'var(--space-4)',
              padding: 0,
            }}
          >
            ← Back to Achievements
          </button>
          <span className="section__eyebrow">{playerItem.category || 'MFC Athlete'}</span>
          <h1 className="page-hero__title" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            {playerName}
          </h1>
          <p className="page-hero__sub">
            MFC Youth Academy Player Profile & Verified Sporting Distinctions.
          </p>
        </div>
      </section>

      {/* Main Profile Showcase */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 420px) 1fr',
              gap: 'var(--space-8)',
              alignItems: 'start',
            }}
            className="player-profile-grid"
          >
            {/* Left Column: Player Photo Card */}
            <ScrollReveal>
              <div
                className="card"
                style={{
                  padding: 'var(--space-6)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md)',
                  background: 'var(--surface)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '3px solid var(--accent)',
                    marginBottom: 'var(--space-5)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    background: 'var(--surface-2)',
                  }}
                >
                  <img
                    src={photo}
                    alt={playerName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: playerItem.objectFit || 'cover',
                      objectPosition: 'center top',
                      transform: `scale(${playerItem.scale || 1}) translateY(${playerItem.offsetY || 0}px)`,
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--surface-2)', padding: '4px 12px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--accent-dark)', fontWeight: 700, fontSize: '0.8rem' }}>✓ Verified MFC Athlete</span>
                </div>

                <h2 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-1)' }}>{playerName}</h2>
                <p style={{ color: 'var(--accent-dark)', fontWeight: 600, fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-4)' }}>
                  {playerItem.position ? `${playerItem.position} • ` : ''}{playerItem.category}
                </p>

                {/* Quick Info Box */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-3)',
                    borderTop: '1px solid var(--border)',
                    paddingTop: 'var(--space-4)',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block' }}>Club Affiliation</span>
                    <strong style={{ fontSize: '0.9rem' }}>MFC Trichy</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block' }}>Status</span>
                    <strong style={{ fontSize: '0.9rem', color: '#16A34A' }}>Active Representative</strong>
                  </div>
                  {playerItem.batch && (
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block' }}>Batch / Age Group</span>
                      <strong style={{ fontSize: '0.9rem' }}>{playerItem.batch}</strong>
                    </div>
                  )}
                  {playerItem.college && (
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block' }}>Team / University</span>
                      <strong style={{ fontSize: '0.9rem' }}>{playerItem.college}</strong>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column: Achievements & Career Story */}
            <ScrollReveal delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Main Feature Highlight */}
                <div
                  className="card"
                  style={{
                    padding: 'var(--space-6) var(--space-8)',
                    borderRadius: '20px',
                    border: '2px solid var(--accent)',
                    background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
                    boxShadow: '0 6px 20px rgba(22, 163, 74, 0.08)',
                  }}
                >
                  <span className="card__tag" style={{ marginBottom: 'var(--space-3)', display: 'inline-block' }}>
                    Key Milestone & Honor
                  </span>
                  <h3 style={{ fontSize: '1.4rem', lineHeight: 1.4, marginBottom: 'var(--space-3)', color: 'var(--text)' }}>
                    {playerItem.highlight}
                  </h3>
                  <div style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: 'var(--fs-sm)', whiteSpace: 'pre-line' }}>
                    {playerItem.bio ||
                      `${playerName} has achieved notable milestones through rigorous technical preparation, discipline, and competitive matches developed under the MFC youth coaching curriculum in Trichy.`}
                  </div>
                </div>

                {/* Structured Tournaments & Honors List */}
                {Array.isArray(playerItem.honors) && playerItem.honors.filter(Boolean).length > 0 && (
                  <div
                    className="card"
                    style={{
                      padding: 'var(--space-6) var(--space-8)',
                      borderRadius: '20px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🏅</span> Verified Career Honors & Match Highlights
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {playerItem.honors.filter(Boolean).map((h, hIdx) => (
                        <div
                          key={hIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-3) var(--space-4)',
                            background: 'var(--surface-2)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          <span style={{ color: 'var(--accent-dark)', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                          <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text)' }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional / Related Honors */}
                {relatedAchievements.length > 0 && (
                  <div
                    className="card"
                    style={{
                      padding: 'var(--space-6) var(--space-8)',
                      borderRadius: '20px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>
                      Other Honors & Tournaments for {playerName}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {relatedAchievements.map((rel, idx) => (
                        <div
                          key={rel.id || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-3)',
                            background: 'var(--surface-2)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>🏆</span>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-dark)', textTransform: 'uppercase' }}>
                              {rel.category}
                            </span>
                            <p style={{ margin: '2px 0 0 0', fontSize: 'var(--fs-sm)', fontWeight: 500, color: 'var(--text)' }}>
                              {rel.highlight}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Player Journey / Academic Sponsorship Banner */}
                <div
                  className="card"
                  style={{
                    padding: 'var(--space-6) var(--space-8)',
                    borderRadius: '20px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-3)' }}>
                    Pathways & Higher Education
                  </h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: 'var(--fs-sm)', margin: 0 }}>
                    MFC Football Club Trichy actively partners with universities, senior state division clubs, and educational institutions across Tamil Nadu and India to ensure player talent converts directly into sports-quota college admissions, 100% scholarships, and senior league careers.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <SectionDivider />

          {/* Navigation CTA */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/individual-achievements" className="btn btn--outline" style={{ marginRight: 'var(--space-4)' }}>
              ← All Individual Achievements
            </Link>
            <Link to="/squad" className="btn btn-primary">
              View Academy Squad Roster →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
