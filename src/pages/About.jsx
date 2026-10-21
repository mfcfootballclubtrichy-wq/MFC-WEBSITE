/**
 * About.jsx — About Mutharasanallur Football Club.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollReveal  from '../components/ScrollReveal.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import { ABOUT_TEXT as STATIC_ABOUT, PARTNERSHIP_POINTS, CLUB } from '../data/content.js';
import { useContent } from '../context/ContentContext.jsx';
import aboutFreestyleImg from '../assets/about-freestyle.png';

export default function About() {
  const { t } = useTranslation();
  const { content } = useContent();

  const aboutData = content?.about || {};
  const aboutText = aboutData.body || STATIC_ABOUT;
  const aboutImage =
    aboutData.image && !aboutData.image.includes('unsplash')
      ? aboutData.image
      : aboutFreestyleImg;

  return (
    <>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <span className="section__eyebrow">{t('nav.about')}</span>
          <h1 className="page-hero__title">{aboutData.title || "About MFC"}</h1>
          <p className="page-hero__sub">
            Grassroots football training and student-athlete development founded in 2020 in Mutharasanallur, Trichy.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="section" aria-labelledby="about-main-heading">
        <div className="container">
          <div className="about-grid">
            <ScrollReveal>
              <div>
                <h2 id="about-main-heading" className="section__title" style={{ marginBottom: 'var(--space-6)' }}>
                  Our Foundation & Roots
                </h2>
                <p className="lead" style={{ marginBottom: 'var(--space-6)' }}>
                  {aboutText}
                </p>
                <p style={{ color: 'var(--muted)', marginBottom: 'var(--space-6)', lineHeight: 1.7 }}>
                  From village pitches in Mutharasanallur to state championships, MFC was built to bridge the gap between rural athletic passion and structured football pathways. We believe every child deserves access to professional coaching, competitive exposure, and educational advancement opportunities.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <Link to="/team-achievements" className="btn btn-primary">
                    View Team Results
                  </Link>
                  <Link to="/contact" className="btn btn--outline">
                    Visit Our Ground
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div
                className="about-image-wrapper"
                style={{
                  maxHeight: `${aboutData.maxHeight || 480}px`,
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <img
                  src={aboutImage}
                  alt="Mutharasanallur Football Club training ground"
                  loading="lazy"
                  style={{
                    transform: `scale(${aboutData.scale || 1}) translateY(${aboutData.offsetY || 0}px)`,
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
            </ScrollReveal>
          </div>

          <SectionDivider />

          {/* Core Values / Pillars */}
          <ScrollReveal>
            <div className="section__header">
              <span className="section__eyebrow">Our Pillars</span>
              <h2 className="section__title">Why Choose MFC</h2>
            </div>
            <div className="grid--3">
              {PARTNERSHIP_POINTS.map((point, i) => (
                <div key={i} className="card" style={{ padding: 'var(--space-6)' }}>
                  <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: 'var(--space-3)' }}>
                    ⚽
                  </span>
                  <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1.05rem', lineHeight: 1.5 }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
