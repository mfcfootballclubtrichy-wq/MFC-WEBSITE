/**
 * TermsOfUse.jsx — Official terms of use for Mutharasanallur Football Club.
 */
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SectionDivider from '../components/SectionDivider.jsx';

export default function TermsOfUse() {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-16)', maxWidth: '900px' }}>
      <ScrollReveal>
        <span className="section__eyebrow">Legal & Compliance</span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 'var(--space-2)' }}>
          Terms of Use
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-8)' }}>
          <strong>Mutharasanallur Football Club (MFC)</strong> &bull; Effective Date: October 2026
        </p>
      </ScrollReveal>

      <div className="card" style={{ padding: 'var(--space-8)', lineHeight: 1.8, fontSize: 'var(--fs-base)', color: 'var(--text)' }}>
        <h2 style={{ fontSize: '1.4rem', marginTop: 0, marginBottom: 'var(--space-3)' }}>1. Acceptance of Terms</h2>
        <p style={{ marginBottom: 'var(--space-6)' }}>
          By accessing or using this website, you agree to comply with and be bound by these Terms of Use and our <Link to="/privacy-policy" style={{ color: 'var(--accent-dark)', fontWeight: 600 }}>Privacy Policy</Link>. If you do not agree, please discontinue using this website.
        </p>

        <SectionDivider />

        <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-3)' }}>2. Academy Programs & Training Information</h2>
        <p style={{ marginBottom: 'var(--space-6)' }}>
          Schedules, coach assignments, batch brackets, and club fixtures published on this website are for educational and club coordination purposes. While MFC endeavours to maintain accurate schedules, training timings may vary due to ground or weather conditions.
        </p>

        <SectionDivider />

        <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-3)' }}>3. Account Security & Permitted Use</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          Registered users (including athletes, parents, and coaches) are responsible for maintaining the confidentiality of their credentials. You agree not to:
        </p>
        <ul style={{ paddingLeft: 'var(--space-6)', listStyle: 'disc', marginBottom: 'var(--space-6)' }}>
          <li>Attempt unauthorized access to administrative or non-public database endpoints.</li>
          <li>Engage in automated scraping, denial of service, or harassment of staff and academy athletes.</li>
          <li>Upload malicious code, defamatory material, or unauthorized imagery of minors.</li>
        </ul>

        <SectionDivider />

        <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-3)' }}>4. Intellectual Property</h2>
        <p style={{ marginBottom: 'var(--space-6)' }}>
          The MFC crest, branding, documentation, video highlights, and original media displayed are the exclusive intellectual property of Mutharasanallur Football Club. Unauthorized reproduction without prior written approval is prohibited.
        </p>

        <SectionDivider />

        <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-3)' }}>5. Governing Law & Jurisdiction</h2>
        <p style={{ marginBottom: 'var(--space-6)' }}>
          These terms are governed by the laws of the Republic of India. Any legal dispute or controversy arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Tiruchirappalli (Trichy), Tamil Nadu, India</strong>.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-6)' }}>
          <Link to="/privacy-policy" className="btn btn--outline" style={{ fontSize: 'var(--fs-xs)' }}>
            Read Privacy Policy
          </Link>
          <Link to="/contact" className="btn btn-primary" style={{ fontSize: 'var(--fs-xs)' }}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
