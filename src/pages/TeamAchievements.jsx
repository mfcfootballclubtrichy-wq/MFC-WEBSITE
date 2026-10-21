/**
 * TeamAchievements.jsx — Team-level tournament results and honors.
 *
 * Sourced directly from deck data: Runner-up & 3rd place finishes (2021–2023).
 */
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import { TEAM_ACHIEVEMENTS as STATIC_TEAM_ACHIEVEMENTS } from '../data/content.js';
import { useContent } from '../context/ContentContext.jsx';

export default function TeamAchievements() {
  const { t } = useTranslation();
  const { content } = useContent();

  const achievementsList = content?.team_achievements || STATIC_TEAM_ACHIEVEMENTS;
  const runnerUps = achievementsList.filter((t) => (t.place || '').toLowerCase().includes('runner'));
  const thirdPlaces = achievementsList.filter((t) => (t.place || '').toLowerCase().includes('3rd'));

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

      {/* Main content */}
      <section className="section" aria-labelledby="team-ach-heading">
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
          <div className="grid--2" style={{ marginBottom: 'var(--space-12)' }}>
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

          <SectionDivider />

          {/* Complete Tournament Table */}
          <ScrollReveal>
            <h3 style={{ marginBottom: 'var(--space-6)', textTransform: 'uppercase' }}>
              All Official Tournament Records
            </h3>
            <div className="mfc-table-wrapper">
              <table className="mfc-table">
                <thead>
                  <tr>
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
                        <td style={{ color: 'var(--muted)', fontWeight: 500 }}>{item.season}</td>
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
                        <td style={{ fontWeight: 600 }}>{item.tournament}</td>
                        <td>
                          {item.tournament.includes('5s') ? '5-a-side' : item.tournament.includes('7s') ? '7-a-side' : 'Open'}
                        </td>
                        <td>📍 {item.location}</td>
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
                marginTop: 'var(--space-10)',
                color: 'var(--muted)',
                fontSize: 'var(--fs-sm)',
                borderLeft: '3px solid var(--accent-light)',
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
