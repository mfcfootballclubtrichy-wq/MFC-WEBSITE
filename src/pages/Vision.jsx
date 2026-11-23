/**
 * Vision.jsx — MFC Vision, Mission & Values.
 */
import ScrollReveal  from '../components/ScrollReveal.jsx';
import { VISION_TEXT as STATIC_VISION_TEXT } from '../data/content.js';
import { useContent } from '../context/ContentContext.jsx';

export default function Vision() {
  const { content } = useContent();

  const visionData = content?.vision || STATIC_VISION_TEXT;

  const values = [
    { title: 'Discipline', desc: 'Punctuality, consistency, and respect on and off the pitch.', icon: '🛡️' },
    { title: 'Teamwork', desc: 'Mutual support, unity of purpose, and communal brotherhood.', icon: '🤝' },
    { title: 'Sportsmanship', desc: 'Fair play, humble victories, and learning from adversity.', icon: '🏅' },
    { title: 'Grassroots Opportunity', desc: 'Empowering village youth with equal access to professional sports.', icon: '🌱' },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section__eyebrow">Guiding Purpose</span>
          <h1 className="page-hero__title">{visionData.title || STATIC_VISION_TEXT.title}</h1>
          <p className="page-hero__sub">
            {visionData.body || STATIC_VISION_TEXT.body}
          </p>
        </div>
      </section>

      <section className="section section--white" aria-labelledby="vision-values-heading">
        <div className="container">
          <ScrollReveal>
            <div className="section__header">
              <span className="section__eyebrow">Core Standards</span>
              <h2 id="vision-values-heading" className="section__title">
                What MFC Stands For
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid--4">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.08}>
                <div className="card" style={{ padding: 'var(--space-6)', height: '100%', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }} aria-hidden="true">
                    {v.icon}
                  </div>
                  <h3 className="card__title" style={{ fontSize: '1.25rem' }}>{v.title}</h3>
                  <p className="card__text">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Community Commitment (Cherry Red Band with Animated Shading) */}
      <section className="section section--red-band" aria-labelledby="community-heading">
        <div className="container">
          <ScrollReveal delay={0.1}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-10) var(--space-8)',
                textAlign: 'center',
                maxWidth: 820,
                margin: '0 auto',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
              }}
            >
              <h3 id="community-heading" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-3)', textTransform: 'uppercase', color: '#0A0A0A' }}>
                Community Commitment
              </h3>
              <p style={{ color: '#4B5563', lineHeight: 1.8, fontSize: '1.05rem', margin: '0 auto' }}>
                Our vision extends beyond the field. We measure MFC&apos;s success by how many players finish school, gain university scholarships, and lead upright, active, and healthy lives in their communities.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
