/**
 * TemplateManager.jsx — Visual Form-Based Template Editor for All MFC Pages.
 *
 * Allows Admin and Super Admin to:
 * 1. Add, edit, and delete dynamic Updates / News (title, date, tag, image URL, description).
 * 2. Upload / update page images (Hero banner, training ground image, school program image, etc.).
 * 3. Add, edit, and delete Coaches with AIFF licences, role, and custom image.
 * 4. Add, edit, and delete Team Tournament Podiums & Individual Player Milestones.
 * 5. Update Club Information & Page Text (Headlines, Subheadings, Mission, Vision, Contact info).
 * 6. One-click Live Publish or Save as Draft with visual preview.
 */
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';

export default function TemplateManager({ sections, onRefresh, role }) {
  const [selectedTemplate, setSelectedTemplate] = useState('updates');
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Pre-configured section definitions
  const TEMPLATE_OPTIONS = [
    { id: 'updates', label: '📢 News & Club Updates', desc: 'Frequent updates, tournament announcements, news with images' },
    { id: 'home', label: '🏠 Home Page Banners & Text', desc: 'Hero headlines, call-to-actions, hero background & training images' },
    { id: 'about', label: '📖 About Page & Story', desc: 'Club foundation text, history, story image' },
    { id: 'vision', label: '🎯 Vision & Values', desc: 'Club mission, community pledge and values' },
    { id: 'coaches', label: '⚽ Coaches & Technical Staff', desc: 'Coach profiles, AIFF certification badges, photos, bios' },
    { id: 'team_achievements', label: '🏆 Team Tournament Podiums', desc: 'Season, placement, tournament name, venue' },
    { id: 'individual_achievements', label: '⭐ Player Milestones & Scholarships', desc: 'Player name, highlights, college/state selections, consent' },
    { id: 'school_program', label: '🏫 School Program Partnership', desc: 'Program description, photo, training highlights and school benefits' },
    { id: 'contact', label: '📞 Contact & Club Details', desc: 'Ground address, phone number, official email, Instagram' },
  ];

  // Load current section data when selectedTemplate changes or sections reload
  useEffect(() => {
    const found = sections.find((s) => s.section === selectedTemplate);
    if (found && found.draft_data && Object.keys(found.draft_data).length > 0) {
      setFormData(JSON.parse(JSON.stringify(found.draft_data)));
    } else if (found && found.published_data && Object.keys(found.published_data).length > 0) {
      setFormData(JSON.parse(JSON.stringify(found.published_data)));
    } else {
      // Default empty template schemas
      initDefaultTemplate(selectedTemplate);
    }
    setMessage({ text: '', type: '' });
  }, [selectedTemplate, sections]);

  const initDefaultTemplate = (templateId) => {
    switch (templateId) {
      case 'updates':
        setFormData([
          {
            id: 'update-1',
            title: 'Summer Youth Football Camp Registration Open',
            date: new Date().toISOString().split('T')[0],
            tag: 'Academy',
            image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
            description: 'Registration is now open for our annual grassroots coaching camp for Super Seniors, Seniors, Juniors, and Kids batches at Tamilan Nagar Ground.',
          }
        ]);
        break;
      case 'home':
        setFormData({
          kicker: 'Mutharasanallur, Trichy',
          headline: 'Mutharasanallur Football Club',
          subheadline: 'Founded 2020. Creating young football talent from our village and across Trichy.',
          ctaPrimary: 'Explore Achievements',
          ctaSecondary: 'Meet the Coaches',
          heroImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
          aboutImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
        });
        break;
      case 'about':
        setFormData({
          title: 'About MFC',
          body: 'Mutharasanallur Football Club, known as MFC, was founded in 2020 to create young football talent from our village side and across Trichy. We give players a platform to develop their skills while building teamwork, discipline, and sportsmanship.',
          image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
        });
        break;
      case 'vision':
        setFormData({
          title: 'Our Vision',
          body: 'To create young football talent from our village and Trichy, with a platform to thrive and strong values of teamwork, discipline, and sportsmanship.',
          communityText: 'Our vision extends beyond the field. We measure MFC\'s success by how many players finish school, gain university scholarships, and lead upright, active, and healthy lives in their communities.',
        });
        break;
      case 'coaches':
        setFormData([
          {
            id: 'dhanapal',
            name: 'Dhanapal',
            role: 'Head Coach',
            licence: ['AIFF C Licence', 'AIFF D Licence'],
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            bio: 'Guiding player development and structured technical football training across youth squads.',
          }
        ]);
        break;
      case 'team_achievements':
        setFormData([
          {
            id: 'ta-1',
            season: '2021–2023',
            place: 'Runner-up',
            tournament: 'Chinthamani U15 5s Football Tournament',
            location: 'Trichy',
          }
        ]);
        break;
      case 'individual_achievements':
        setFormData([
          {
            id: 'ind-1',
            player: 'Pragadeesh D',
            category: 'State Representation',
            highlight: 'Represented Tamil Nadu state team at the Santosh Trophy (2023)',
            hasConsent: true,
          }
        ]);
        break;
      case 'school_program':
        setFormData({
          description: 'Technical, tactical, and physical development through progressive modules.',
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
          highlights: [
            'Training at school premises',
            'Periodic assessments and match exposure',
            'Inter-school and academy tournaments',
            'Pathways to Tamil Nadu and Karnataka state leagues',
          ],
          schoolBenefits: [
            'Sports reputation',
            'Talent identification',
            'Student health',
            'Discipline and teamwork',
            'Recognition through AIFF and academy events',
          ],
        });
        break;
      case 'contact':
        setFormData({
          address: 'Tamilan Nagar, Mutharasanallur, Trichy-1',
          phone: '8072694818',
          email: 'mfcfootballacademy@gmail.com',
          instagram: 'https://www.instagram.com/mfc_trichy',
          instagramHandle: '@mfc_trichy',
        });
        break;
      default:
        setFormData({});
    }
  };

  const isAdminRole = ['super_admin', 'admin'].includes((role || '').toLowerCase());

  // Upsert or Save Section to Supabase
  const handleSave = async (publishLive = false) => {
    if (publishLive) {
      if (!isAdminRole) {
        setMessage({ text: 'Permission Denied: Only Admins and Superadmins can publish content live.', type: 'error' });
        return;
      }
      const confirmed = window.confirm(
        `Are you sure you want to publish the "${selectedTemplate.toUpperCase()}" section live to the website? This will immediately be visible to all public visitors.`
      );
      if (!confirmed) return;
    }

    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const currentSectionRecord = sections.find((s) => s.section === selectedTemplate);
      const payload = {
        section: selectedTemplate,
        draft_data: formData,
        updated_at: new Date().toISOString(),
      };

      if (publishLive) {
        payload.published_data = formData;
        payload.status = 'published';
        payload.publish_at = new Date().toISOString();
      }

      if (currentSectionRecord?.id) {
        // Update existing row
        const { error } = await supabase
          .from('site_content')
          .update(payload)
          .eq('id', currentSectionRecord.id);

        if (error) throw error;
      } else {
        // Insert new section row
        const { error } = await supabase
          .from('site_content')
          .insert([payload]);

        if (error) throw error;
      }

      // Also update local cache so public website responds immediately
      try {
        const cached = localStorage.getItem('mfc_site_content_cache');
        const parsed = cached ? JSON.parse(cached) : {};
        if (publishLive) {
          parsed[selectedTemplate] = formData;
          localStorage.setItem('mfc_site_content_cache', JSON.stringify(parsed));
        }
      } catch {
        // cache fallback
      }

      setMessage({
        text: publishLive
          ? `🎉 Successfully published "${selectedTemplate.toUpperCase()}" live to the website!`
          : `💾 Saved draft for "${selectedTemplate.toUpperCase()}". Submit for review or publish when ready!`,
        type: 'success',
      });

      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to save section content:', err);
      setMessage({ text: `Save error: ${err.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Generic Field Update
  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Array item helpers (for Updates, Coaches, Achievements)
  const addArrayItem = (defaultItem) => {
    setFormData((prev) => (Array.isArray(prev) ? [...prev, defaultItem] : [defaultItem]));
  };

  const removeArrayItem = (index) => {
    setFormData((prev) => {
      if (!Array.isArray(prev)) return prev;
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const updateArrayItemField = (index, field, value) => {
    setFormData((prev) => {
      if (!Array.isArray(prev)) return prev;
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
      {/* ── Left Sidebar: Template Selection ── */}
      <div className="card" style={{ padding: 'var(--space-4)', position: 'sticky', top: '100px' }}>
        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-3)', paddingLeft: 'var(--space-2)' }}>
          Page Templates
        </h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {TEMPLATE_OPTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedTemplate(item.id)}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: selectedTemplate === item.id ? 'var(--accent-glow)' : 'transparent',
                color: selectedTemplate === item.id ? 'var(--accent-dark)' : 'var(--text)',
                fontWeight: selectedTemplate === item.id ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 'var(--fs-sm)' }}>{item.label}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 400 }}>{item.desc}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Right Content Area: Visual Editor Forms ── */}
      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
          <div>
            <span className="section__eyebrow">Visual Template Manager</span>
            <h2 style={{ fontSize: '1.6rem', marginTop: 'var(--space-1)' }}>
              {TEMPLATE_OPTIONS.find((t) => t.id === selectedTemplate)?.label}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="btn btn--outline"
              style={{ fontSize: 'var(--fs-sm)', padding: '0.5rem 1rem' }}
            >
              {saving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="btn btn-primary"
              style={{ fontSize: 'var(--fs-sm)', padding: '0.5rem 1.25rem' }}
            >
              {saving ? 'Publishing...' : '🚀 Publish Live'}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {message.text && (
          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius)',
              marginBottom: 'var(--space-6)',
              background: message.type === 'error' ? '#FEE2E2' : '#DCFCE7',
              border: `1px solid ${message.type === 'error' ? '#F87171' : '#86EFAC'}`,
              color: message.type === 'error' ? '#991B1B' : '#166534',
              fontSize: 'var(--fs-sm)',
            }}
          >
            {message.text}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 1: DYNAMIC NEWS & UPDATES (Image, title, description)
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'updates' && Array.isArray(formData) && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>
                Publish new camp announcements, match results, event notices and photo updates here. They show instantly on the homepage.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addArrayItem({
                    id: `update-${Date.now()}`,
                    title: 'New Club Announcement',
                    date: new Date().toISOString().split('T')[0],
                    tag: 'Announcement',
                    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
                    description: 'Description of the latest news, achievements, or upcoming fixture.',
                  })
                }
                style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 1rem' }}
              >
                ➕ Add New Update
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {formData.map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--space-5)',
                    background: 'var(--surface-2)',
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr auto',
                    gap: 'var(--space-5)',
                    alignItems: 'start',
                  }}
                >
                  {/* Image Preview & URL */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                      Update Image URL
                    </label>
                    <div
                      style={{
                        width: '100%',
                        height: '110px',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        background: '#000',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80'}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="Image URL https://..."
                      value={item.image || ''}
                      onChange={(e) => updateArrayItemField(index, 'image', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.6rem',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                      }}
                    />
                  </div>

                  {/* Text details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--space-3)' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                          Title / Headline
                        </label>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => updateArrayItemField(index, 'title', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                            fontSize: 'var(--fs-sm)',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                          Category Tag
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Tournament, Camp"
                          value={item.tag || ''}
                          onChange={(e) => updateArrayItemField(index, 'tag', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                            fontSize: 'var(--fs-sm)',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                          Date
                        </label>
                        <input
                          type="date"
                          value={item.date || ''}
                          onChange={(e) => updateArrayItemField(index, 'date', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                            fontSize: 'var(--fs-sm)',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                        Description / Content
                      </label>
                      <textarea
                        rows={3}
                        value={item.description || ''}
                        onChange={(e) => updateArrayItemField(index, 'description', e.target.value)}
                        placeholder="Detailed write-up of the announcement..."
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg)',
                          fontSize: 'var(--fs-sm)',
                          lineHeight: 1.5,
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index)}
                      title="Delete Update"
                      style={{
                        padding: '0.45rem 0.75rem',
                        background: '#FEE2E2',
                        color: '#DC2626',
                        border: '1px solid #FCA5A5',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        fontSize: 'var(--fs-xs)',
                        fontWeight: 600,
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 2: HOME PAGE CONTENT & IMAGE
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'home' && formData && !Array.isArray(formData) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Eyebrow Kicker Text
                </label>
                <input
                  type="text"
                  value={formData.kicker || ''}
                  onChange={(e) => updateField('kicker', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Hero Main Headline
                </label>
                <input
                  type="text"
                  value={formData.headline || ''}
                  onChange={(e) => updateField('headline', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Hero Subheadline / Mission Statement
              </label>
              <textarea
                rows={3}
                value={formData.subheadline || ''}
                onChange={(e) => updateField('subheadline', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.ctaPrimary || ''}
                  onChange={(e) => updateField('ctaPrimary', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Secondary CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.ctaSecondary || ''}
                  onChange={(e) => updateField('ctaSecondary', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                  }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-3)' }}>🖼️ Homepage Image Areas</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                    About Section Ground Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.aboutImage || ''}
                    onChange={(e) => updateField('aboutImage', e.target.value)}
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      marginBottom: 'var(--space-2)',
                    }}
                  />
                  {formData.aboutImage && (
                    <img
                      src={formData.aboutImage}
                      alt="About section preview"
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius)' }}
                    />
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                    Hero Background/Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.heroImage || ''}
                    onChange={(e) => updateField('heroImage', e.target.value)}
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      marginBottom: 'var(--space-2)',
                    }}
                  />
                  {formData.heroImage && (
                    <img
                      src={formData.heroImage}
                      alt="Hero banner preview"
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius)' }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 3: ABOUT PAGE CONTENT & IMAGE
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'about' && formData && !Array.isArray(formData) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Page Title
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                About Club Description Body
              </label>
              <textarea
                rows={6}
                value={formData.body || ''}
                onChange={(e) => updateField('body', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                About Page Featured Image URL
              </label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => updateField('image', e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  marginBottom: 'var(--space-2)',
                }}
              />
              {formData.image && (
                <div style={{ maxWidth: '400px', height: '220px', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  <img src={formData.image} alt="About preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 4: VISION & VALUES
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'vision' && formData && !Array.isArray(formData) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Vision Title
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Vision Statement Body
              </label>
              <textarea
                rows={4}
                value={formData.body || ''}
                onChange={(e) => updateField('body', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Community Commitment Callout Text
              </label>
              <textarea
                rows={4}
                value={formData.communityText || ''}
                onChange={(e) => updateField('communityText', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  lineHeight: 1.6,
                }}
              />
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 5: COACHES & TECHNICAL STAFF
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'coaches' && Array.isArray(formData) && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>
                Manage coaching leadership, certification licences, roles, biographies and profile photos.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addArrayItem({
                    id: `coach-${Date.now()}`,
                    name: 'Coach Name',
                    role: 'Coach',
                    licence: ['AIFF Licenced'],
                    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    bio: 'Dedicated youth coach focusing on tactical awareness and match development.',
                  })
                }
                style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 1rem' }}
              >
                ➕ Add New Coach
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {formData.map((coach, index) => (
                <div
                  key={coach.id || index}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--space-5)',
                    background: 'var(--surface-2)',
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr auto',
                    gap: 'var(--space-5)',
                    alignItems: 'start',
                  }}
                >
                  {/* Photo */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                      Coach Photo URL
                    </label>
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'var(--surface)',
                        border: '2px solid var(--accent)',
                        marginBottom: 'var(--space-2)',
                        marginInline: 'auto',
                      }}
                    >
                      {coach.photo ? (
                        <img src={coach.photo} alt={coach.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                          {coach.name?.charAt(0) || 'C'}
                        </div>
                      )}
                    </div>
                    <input
                      type="url"
                      placeholder="Photo URL https://..."
                      value={coach.photo || ''}
                      onChange={(e) => updateArrayItemField(index, 'photo', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.5rem',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                      }}
                    />
                  </div>

                  {/* Form Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={coach.name || ''}
                          onChange={(e) => updateArrayItemField(index, 'name', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={coach.role || ''}
                          onChange={(e) => updateArrayItemField(index, 'role', e.target.value)}
                          placeholder="Head Coach, Player-Coach, etc."
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                        Licences (Comma separated, e.g. "AIFF C Licence, AIFF D Licence")
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(coach.licence) ? coach.licence.join(', ') : coach.licence || ''}
                        onChange={(e) =>
                          updateArrayItemField(
                            index,
                            'licence',
                            e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg)',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                        Biography & Experience
                      </label>
                      <textarea
                        rows={2}
                        value={coach.bio || ''}
                        onChange={(e) => updateArrayItemField(index, 'bio', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        background: '#FEE2E2',
                        color: '#DC2626',
                        border: '1px solid #FCA5A5',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        fontSize: 'var(--fs-xs)',
                        fontWeight: 600,
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 6: TEAM ACHIEVEMENTS & PODIUMS
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'team_achievements' && Array.isArray(formData) && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>
                Add, update, or remove tournament finishes, runner-up spots, and championship trophies.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addArrayItem({
                    id: `ta-${Date.now()}`,
                    season: '2024–2025',
                    place: 'Champions',
                    tournament: 'District Youth Championship',
                    location: 'Trichy',
                  })
                }
                style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 1rem' }}
              >
                ➕ Add Tournament Finish
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {formData.map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--space-4)',
                    background: 'var(--surface-2)',
                    display: 'grid',
                    gridTemplateColumns: '120px 140px 1fr 140px auto',
                    gap: 'var(--space-3)',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Season"
                    value={item.season || ''}
                    onChange={(e) => updateArrayItemField(index, 'season', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 'var(--fs-sm)' }}
                  />
                  <input
                    type="text"
                    placeholder="Place (e.g. Runner-up)"
                    value={item.place || ''}
                    onChange={(e) => updateArrayItemField(index, 'place', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 'var(--fs-sm)' }}
                  />
                  <input
                    type="text"
                    placeholder="Tournament Name"
                    value={item.tournament || ''}
                    onChange={(e) => updateArrayItemField(index, 'tournament', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 'var(--fs-sm)' }}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={item.location || ''}
                    onChange={(e) => updateArrayItemField(index, 'location', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 'var(--fs-sm)' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index)}
                    style={{
                      padding: '0.45rem 0.65rem',
                      background: '#FEE2E2',
                      color: '#DC2626',
                      border: '1px solid #FCA5A5',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      fontSize: 'var(--fs-xs)',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 7: INDIVIDUAL ACHIEVEMENTS & SCHOLARSHIPS
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'individual_achievements' && Array.isArray(formData) && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>
                Recognize player milestones, college sports-quota admissions, and state team selections.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addArrayItem({
                    id: `ind-${Date.now()}`,
                    player: 'Player Name',
                    category: 'Scholarship',
                    highlight: 'Sports-quota selection, University (100% scholarship)',
                    hasConsent: true,
                  })
                }
                style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 1rem' }}
              >
                ➕ Add Player Achievement
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {formData.map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--space-4)',
                    background: 'var(--surface-2)',
                    display: 'grid',
                    gridTemplateColumns: '180px 160px 1fr auto auto',
                    gap: 'var(--space-3)',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Player Name"
                    value={item.player || ''}
                    onChange={(e) => updateArrayItemField(index, 'player', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 'var(--fs-sm)' }}
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. State, Scholarship)"
                    value={item.category || ''}
                    onChange={(e) => updateArrayItemField(index, 'category', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 'var(--fs-sm)' }}
                  />
                  <input
                    type="text"
                    placeholder="Highlight / Selection details"
                    value={item.highlight || ''}
                    onChange={(e) => updateArrayItemField(index, 'highlight', e.target.value)}
                    style={{ padding: '0.45rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 'var(--fs-sm)' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--fs-xs)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={item.hasConsent ?? true}
                      onChange={(e) => updateArrayItemField(index, 'hasConsent', e.target.checked)}
                    />
                    Publishable
                  </label>
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index)}
                    style={{
                      padding: '0.45rem 0.65rem',
                      background: '#FEE2E2',
                      color: '#DC2626',
                      border: '1px solid #FCA5A5',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      fontSize: 'var(--fs-xs)',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 8: SCHOOL PROGRAM
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'school_program' && formData && !Array.isArray(formData) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Program Overview Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                School Program Training Image URL
              </label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => updateField('image', e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  marginBottom: 'var(--space-2)',
                }}
              />
              {formData.image && (
                <div style={{ maxWidth: '400px', height: '200px', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  <img src={formData.image} alt="School program preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 9: CONTACT & CLUB DETAILS
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'contact' && formData && !Array.isArray(formData) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Official Ground Address
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => updateField('address', e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Official Phone Number
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Official Contact Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagramHandle || ''}
                onChange={(e) => updateField('instagramHandle', e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
