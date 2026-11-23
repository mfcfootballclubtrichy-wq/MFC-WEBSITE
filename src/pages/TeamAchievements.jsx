/**
 * TeamAchievements.jsx — Team-level tournament results and honors.
 *
 * Sourced directly from deck data: Runner-up & 3rd place finishes (2021–2023).
 */
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { TEAM_ACHIEVEMENTS as STATIC_TEAM_ACHIEVEMENTS } from '../data/content.js';
import { useContent } from '../context/ContentContext.jsx';

export default function TeamAchievements() {
  const { t } = useTranslation();
  const { content } = useContent();

  const achievementsList = content?.team_achievements || STATIC_TEAM_ACHIEVEMENTS;

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <span className="section__eyebrow">Competition Record</span>
          <h1 className="page-hero__title">{t('teamAchievements.title')}</h1>
          <p className="page-hero__sub">
            MFC team competitive finishes across Trichy and Karur invitationals (2021–2023).
          </p>
        </div>
      </section>

      {/* Main content - Section 1: Quick Highlights (White Section) */}
      <section className="section section--white" aria-labelledby="team-ach-heading">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <h2 id="team-ach-heading" className="section__title">
                Tournament Podiums (2021 – 2023)
              </h2>
              <p className="section__subtitle">
                MFC teams have consistently competed at the highest grassroots levels across Tamil Nadu.
              </p>
            </div>
          </ScrollReveal>

          {/* Quick Highlight Cards */}
          <div className="grid--2" style={{ marginBottom: 'var(--space-6)' }}>
            <ScrollReveal>
              <div className="card" style={{ padding: 'var(--space-8)' }}>
                <span className="card__tag" style={{ color: 'var(--accent-dark)' }}>Podium Summary</span>
                <h3 className="card__title" style={{ fontSize: '2rem' }}>4× Runner-Up</h3>
                <p className="card__text">
                  Chinthamani U15, Kajamalai FC U16, MFC U13 7s, and SAI FC 7s (Karur).
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="card" style={{ padding: 'var(--space-8)' }}>
                <span className="card__tag" style={{ color: 'var(--accent-dark)' }}>Podium Summary</span>
                <h3 className="card__title" style={{ fontSize: '2rem' }}>5× Third Place</h3>
                <p className="card__text">
                  Green Grass Turf U13, Arena 20 U13, Decathlon Cup U13, Shaz FC Cup U13, and MFC U17 7s.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Section 2: Complete Tournament Table (Cherry Red Band with Animated Shading) */}
      <section className="section section--red-band" aria-labelledby="all-tournaments-heading">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__eyebrow">Official Records</span>
              <h2 id="all-tournaments-heading" className="section__title">
                All Official Tournament Records
              </h2>
              <p className="section__subtitle">
                Verified runner-up and third-place finishes across district and state invitationals.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mfc-table-wrapper" style={{ background: '#FFFFFF', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(0,0,0,0.25)' }}>
              <table className="mfc-table">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    <th>Season</th>
                    <th>Result</th>
                    <th>Tournament Name</th>
                    <th>Format</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {achievementsList.map((item, idx) => {
                    const isRunnerUp = (item.place || '').toLowerCase().includes('runner');
                    return (
                      <tr key={item.id || idx}>
                        <td style={{ color: '#4B5563', fontWeight: 500 }}>{item.season}</td>
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 10px',
                              borderRadius: 'var(--radius-full)',
                              background: isRunnerUp
                                ? 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)'
                                : 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                              border: isRunnerUp ? '1px solid #CBD5E1' : '1px solid #FCD34D',
                              color: isRunnerUp ? '#1E293B' : '#92400E',
                              fontWeight: 700,
                              fontSize: 'var(--fs-xs)',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            }}
                          >
                            <span>{isRunnerUp ? '🥈' : '🥉'}</span>
                            <span>{item.place}</span>
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: '#0A0A0A' }}>{item.tournament}</td>
                        <td>
                          <span style={{ fontSize: '0.75rem', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                            {item.tournament.includes('5s') ? '5-a-side' : item.tournament.includes('7s') ? '7-a-side' : 'Open'}
                          </span>
                        </td>
                        <td style={{ color: '#0A0A0A', fontWeight: 500 }}>📍 {item.location}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p
              style={{
                marginTop: 'var(--space-8)',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: 'var(--fs-sm)',
                borderLeft: '3px solid rgba(255, 255, 255, 0.5)',
                paddingLeft: 'var(--space-5)',
              }}
            >
              Note: Mutharasanallur Football Club records verified runner-up and third-place finishes from 2021 to 2023. Additional past tournament details will be updated as documentation is verified.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
