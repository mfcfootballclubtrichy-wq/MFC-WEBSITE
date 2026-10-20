/**
 * PrivacyPolicy.jsx — Official DPDP Act (2023) compliant Privacy Policy.
 */
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import { CLUB } from '../data/content.js';

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-16)', maxWidth: '900px' }}>
      <ScrollReveal>
        <span className="section__eyebrow">Legal & Compliance</span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 'var(--space-2)' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-8)' }}>
          <strong>Mutharasanallur Football Club (MFC)</strong> &bull; Effective Date: October 2026 &bull; DPDP Act 2023 Compliant
        </p>
      </ScrollReveal>

      <div className="card" style={{ padding: 'var(--space-8)', lineHeight: 1.8, fontSize: 'var(--fs-base)', color: 'var(--text)' }}>
        <h2 style={{ fontSize: '1.4rem', marginTop: 0, marginBottom: 'var(--space-3)' }}>1. Who We Are</h2>
        <p style={{ marginBottom: 'var(--space-6)' }}>
          Mutharasanallur Football Club (MFC), located at Tamilan Nagar, Mutharasanallur, Trichy-1, Tamil Nadu, India, operates as the Data Fiduciary for personal data collected through this website (<Link to="/" style={{ color: 'var(--accent-dark)', fontWeight: 600 }}>{window.location.origin}</Link>) and associated grassroots training programs.
          <br />
          Official Contact: <a href={`mailto:${CLUB.email}`} style={{ color: 'var(--accent-dark)', fontWeight: 600 }}>{CLUB.email}</a> | Phone: <a href={`tel:${CLUB.phone}`} style={{ color: 'var(--accent-dark)', fontWeight: 600 }}>+91 {CLUB.phone}</a>.
        </p>

        <SectionDivider />

        <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-3)' }}>2. Personal Data We Collect</h2>
        <div className="mfc-table-wrapper" style={{ marginBottom: 'var(--space-6)' }}>
          <table className="mfc-table" style={{ width: '100%', fontSize: 'var(--fs-sm)' }}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Data Fields Collected</th>
                <th>Collection Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Registered Users</strong></td>
                <td>Full name, phone number, email address, one-way hashed password</td>
                <td>Account provisioning and authenticated access control</td>
              </tr>
              <tr>
                <td><strong>Enquiries & Contact</strong></td>
                <td>Name, email address, message contents</td>
                <td>Responding to training queries and school partnerships</td>
              </tr>
              <tr>
                <td><strong>Youth & Athletes</strong></td>
                <td>Player name, position, age group, achievements, photographs</td>
                <td>Grassroots training records & public milestones (verifiable guardian consent required)</td>
              </tr>
              <tr>
                <td><strong>Website Visitors</strong></td>
                <td>Essential session cookies strictly for authenticated state</td>
                <td>Zero third-party advertising or cross-site tracking cookies</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-6)' }}>
          <em>Note: We do not collect Aadhaar numbers, PAN cards, biometric data, or financial bank information through this public platform.</em>
        </p>

        <SectionDivider />

        <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-3)' }}>3. Protection of Children & Youth Athletes</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          In accordance with Section 9 of the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>:
        </p>
        <ul style={{ paddingLeft: 'var(--space-6)', listStyle: 'disc', marginBottom: 'var(--space-6)' }}>
          <li>A child is defined as any individual under 18 years of age.</li>
          <li>Personal data, tournament achievements, or photographs of minors are processed and published <strong>strictly with verifiable consent</strong> from a parent or lawful guardian.</li>
          <li>We strictly prohibit behavioural tracking, targeted advertisements, or algorithmic profiling directed at children.</li>
          <li>A parent or lawful guardian may withdraw consent or request immediate deletion of a child’s profile, photo, or likeness at any time.</li>
        </ul>

        <SectionDivider />

        <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-3)' }}>4. Trusted Third-Party Processors</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          We do not sell or monetize personal data. We utilize authorized, contracted technical processors solely for operational functions:
        </p>
        <ul style={{ paddingLeft: 'var(--space-6)', listStyle: 'disc', marginBottom: 'var(--space-6)' }}>
          <li><strong>Supabase Inc.</strong> — Database, authentication, and Row-Level Security (RLS) enforcement.</li>
          <li><strong>Cloudinary</strong> — Media asset storage and optimization for official training photos.</li>
          <li><strong>Cloudflare</strong> — Turnstile bot protection and secure web traffic routing.</li>
          <li><strong>Brevo</strong> — Transactional operational email delivery.</li>
        </ul>

        <SectionDivider />

        <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-3)' }}>5. Your Rights as a Data Principal</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          Under Indian data protection laws, you retain the following statutory rights:
        </p>
        <ul style={{ paddingLeft: 'var(--space-6)', listStyle: 'disc', marginBottom: 'var(--space-6)' }}>
          <li><strong>Right to Access:</strong> Request a summary of your personal data processed by MFC.</li>
          <li><strong>Right to Correction & Erasure:</strong> Request updating inaccurate records or complete deletion of your data when no longer required.</li>
          <li><strong>Right to Grievance Redressal:</strong> Submit any concern directly to our designated Grievance Officer.</li>
          <li><strong>Right to Nominate:</strong> Designate a lawful representative to exercise rights on your behalf in the event of incapacity.</li>
        </ul>

        <SectionDivider />

        <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-3)' }}>6. Grievance Redressal & Contact</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          For inquiries, data access requests, or consent withdrawals:
        </p>
        <div style={{ background: 'var(--surface-2)', padding: 'var(--space-4)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-6)' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Grievance Officer / Data Protection Desk</p>
          <p style={{ margin: '4px 0 0 0', fontSize: 'var(--fs-sm)' }}>
            Mutharasanallur Football Club, Tamilan Nagar, Mutharasanallur, Trichy-1, Tamil Nadu.
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: 'var(--fs-sm)' }}>
            Email: <a href={`mailto:${CLUB.email}`} style={{ color: 'var(--accent-dark)' }}>{CLUB.email}</a> &bull; Phone: +91 {CLUB.phone}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: 'var(--fs-xs)', color: 'var(--muted)' }}>
            Statutory turnaround: Acknowledged within 3 working days; resolved within 30 days.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-6)' }}>
          <Link to="/terms" className="btn btn--outline" style={{ fontSize: 'var(--fs-xs)' }}>
            Terms of Use
          </Link>
          <Link to="/contact" className="btn btn-primary" style={{ fontSize: 'var(--fs-xs)' }}>
            Contact Administrative Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
