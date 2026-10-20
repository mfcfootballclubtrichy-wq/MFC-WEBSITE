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
import { DEFAULT_SQUAD } from '../../data/content.js';

export default function TemplateManager({ sections, onRefresh, role }) {
  const [selectedTemplate, setSelectedTemplate] = useState('updates');
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [adminSquadFilter, setAdminSquadFilter] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Pre-configured section definitions
  const TEMPLATE_OPTIONS = [
    { id: 'updates', label: 'News & Club Updates', desc: 'Frequent updates, tournament announcements, news with images' },
    { id: 'home', label: 'Home Page Banners & Text', desc: 'Hero headlines, call-to-actions, hero background & training images' },
    { id: 'about', label: 'About Page & Story', desc: 'Club foundation text, history, story image' },
    { id: 'vision', label: 'Vision & Values', desc: 'Club mission, community pledge and values' },
    { id: 'coaches', label: 'Coaches & Technical Staff', desc: 'Coach profiles, AIFF certification badges, photos, bios' },
    { id: 'squad', label: 'Squad Players & Staff', desc: 'Player cards, photos, positions, junior/senior tiers, physio & staff' },
    { id: 'team_achievements', label: 'Team Tournament Podiums', desc: 'Season, placement, tournament name, venue' },
    { id: 'individual_achievements', label: 'Selections & Scholarships', desc: 'Player name, photo upload/update, selections, scholarships' },
    { id: 'school_program', label: 'School Program Partnership', desc: 'Program description, photo, training highlights and school benefits' },
    { id: 'contact', label: 'Contact & Club Details', desc: 'Ground address, phone number, official email, Instagram' },
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
            image: '',
          }
        ]);
        break;
      case 'squad':
        setFormData(DEFAULT_SQUAD);
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

  // Initiate save action
  const handleSave = (publishLive = false) => {
    if (publishLive) {
      if (!isAdminRole) {
        setMessage({ text: 'Permission Denied: Only Admins and Superadmins can publish content live.', type: 'error' });
        return;
      }
      setShowConfirmModal(true);
      return;
    }
    executeSave(false);
  };

  // Execute Upsert or Save Section to Supabase
  const executeSave = async (publishLive = false) => {
    setShowConfirmModal(false);
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

      // 1. Immediately update local cache and broadcast change so site responds instantly
      try {
        const cached = localStorage.getItem('mfc_site_content_cache');
        const parsed = cached ? JSON.parse(cached) : {};
        if (publishLive) {
          parsed[selectedTemplate] = formData;
          localStorage.setItem('mfc_site_content_cache', JSON.stringify(parsed));
          window.dispatchEvent(new Event('mfc_content_updated'));
        }
      } catch (cacheErr) {
        console.warn('Local storage cache note:', cacheErr);
      }

      // 2. Persist to Supabase site_content table
      let dbError = null;
      try {
        if (currentSectionRecord?.id) {
          const { error } = await supabase
            .from('site_content')
            .update(payload)
            .eq('id', currentSectionRecord.id);
          if (error) dbError = error;
        } else {
          const { error } = await supabase
            .from('site_content')
            .insert([payload]);
          if (error) dbError = error;
        }
      } catch (err) {
        dbError = err;
      }

      if (dbError) {
        console.warn('Supabase site_content sync notice:', dbError);
        setMessage({
          text: `Saved and applied locally in browser! (Cloud note: ${dbError.message || 'Database policy notice'}. Run the provided SQL update in Supabase SQL editor to sync live across devices).`,
          type: 'warning',
        });
      } else {
        setMessage({
          text: publishLive
            ? `Successfully published "${selectedTemplate.toUpperCase()}" live to the website!`
            : `Saved draft for "${selectedTemplate.toUpperCase()}". Ready for review!`,
          type: 'success',
        });
      }

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
    <div className="admin-template-layout">
      {/* ── Left Sidebar: Template Selection ── */}
      <div className="card admin-template-sidebar" style={{ padding: 'var(--space-4)', position: 'sticky', top: '100px' }}>
        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-3)', paddingLeft: 'var(--space-2)' }}>
          Page Templates
        </h3>
        <nav className="admin-template-nav" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
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
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="btn btn-primary"
              style={{ fontSize: 'var(--fs-sm)', padding: '0.5rem 1.25rem' }}
            >
              {saving ? 'Publishing...' : 'Publish Live'}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                      <label style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>
                        Update Image URL
                      </label>
                      <span style={{ fontSize: '0.65rem', background: 'var(--surface)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                        Recommended: 800x500 (16:10)
                      </span>
                    </div>
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
                        marginBottom: 'var(--space-2)',
                      }}
                    />

                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <label
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '0.35rem 0.45rem',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          cursor: 'pointer',
                          color: 'var(--text)',
                        }}
                        title="Upload image from device"
                      >
                        📁 Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const result = event.target?.result;
                                if (result) updateArrayItemField(index, 'image', result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {item.image && (
                        <button
                          type="button"
                          onClick={() => updateArrayItemField(index, 'image', '')}
                          title="Delete / Clear this update image"
                          style={{
                            flex: 1,
                            padding: '0.35rem 0.45rem',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: '1px solid #FCA5A5',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete Image
                        </button>
                      )}
                    </div>
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

                    {/* Short Teaser Description */}
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                        Short Summary / Card Teaser (Shown on Homepage Card)
                      </label>
                      <textarea
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => updateArrayItemField(index, 'description', e.target.value)}
                        placeholder="Brief summary that shows on the homepage preview card..."
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

                    {/* Long Structured Full Article Content */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                        <label style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>
                          Full Structured Article & Report (Dedicated Article Page)
                        </label>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                          Supports multiple paragraphs & detailed match reports
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        value={item.content || ''}
                        onChange={(e) => updateArrayItemField(index, 'content', e.target.value)}
                        placeholder="Paste full tournament write-up, camp timings, player squad performance, coach analysis, schedule details, and match highlights..."
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg)',
                          fontSize: 'var(--fs-sm)',
                          lineHeight: 1.6,
                        }}
                      />
                    </div>

                    {/* Multi-Photo Gallery (Add More Images by Device Memory) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <div>
                          <label style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, display: 'block' }}>
                            📸 Additional Gallery Photos (Upload From Device Memory)
                          </label>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                            Select one or multiple photos from phone/computer storage
                          </span>
                        </div>

                        {/* Device Memory File Upload Button */}
                        <label
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: 'var(--surface)',
                            border: '1px solid var(--accent)',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            color: 'var(--accent-dark)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                          }}
                          title="Upload multiple photos from your device storage"
                        >
                          📁 Choose Photos from Device
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length === 0) return;

                              const existingGallery = Array.isArray(item.gallery) ? [...item.gallery] : [];
                              let loadedCount = 0;

                              files.forEach((file) => {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const result = event.target?.result;
                                  if (result) {
                                    existingGallery.push(result);
                                  }
                                  loadedCount++;
                                  if (loadedCount === files.length) {
                                    updateArrayItemField(index, 'gallery', existingGallery);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }}
                          />
                        </label>
                      </div>

                      {/* Display Uploaded Device Photos Grid with Delete & Order Controls */}
                      {Array.isArray(item.gallery) && item.gallery.length > 0 ? (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                            gap: 'var(--space-2)',
                            background: 'var(--surface)',
                            padding: 'var(--space-3)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {item.gallery.map((photoUrl, photoIdx) => (
                            <div
                              key={photoIdx}
                              style={{
                                position: 'relative',
                                width: '100%',
                                height: '80px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid var(--border)',
                                background: '#000',
                              }}
                            >
                              <img
                                src={photoUrl}
                                alt={`Gallery item ${photoIdx + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = item.gallery.filter((_, idx) => idx !== photoIdx);
                                  updateArrayItemField(index, 'gallery', updated);
                                }}
                                title="Remove photo"
                                style={{
                                  position: 'absolute',
                                  top: '2px',
                                  right: '2px',
                                  background: 'rgba(220, 38, 38, 0.9)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '20px',
                                  height: '20px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                }}
                              >
                                ×
                              </button>
                              <span
                                style={{
                                  position: 'absolute',
                                  bottom: '2px',
                                  left: '2px',
                                  background: 'rgba(0,0,0,0.65)',
                                  color: '#fff',
                                  fontSize: '9px',
                                  padding: '1px 4px',
                                  borderRadius: '3px',
                                  fontWeight: 600,
                                }}
                              >
                                #{photoIdx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            border: '1px dashed var(--border)',
                            borderRadius: 'var(--radius)',
                            padding: 'var(--space-4)',
                            textAlign: 'center',
                            background: 'var(--surface)',
                            color: 'var(--muted)',
                            fontSize: '0.8rem',
                          }}
                        >
                          No additional gallery photos uploaded yet. Tap <strong>"Choose Photos from Device"</strong> to select images from your gallery or file manager.
                        </div>
                      )}
                    </div>

                    {/* Quick Preview Link */}
                    {item.id && (
                      <div style={{ marginTop: 'var(--space-1)' }}>
                        <a
                          href={`/news/${item.id}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--accent-dark)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          🔗 Open Dedicated Article Page ↗
                        </a>
                      </div>
                    )}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                    <label style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>
                      About Section Ground Image URL
                    </label>
                    <span style={{ fontSize: '0.7rem', background: 'var(--surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                      Recommended: 1200x800 (3:2)
                    </span>
                  </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                    <label style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>
                      Hero Background/Banner Image URL
                    </label>
                    <span style={{ fontSize: '0.7rem', background: 'var(--surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                      Recommended: 1920x1080 (16:9)
                    </span>
                  </div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                <label style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>
                  About Page Featured Image URL
                </label>
                <span style={{ fontSize: '0.7rem', background: 'var(--surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                  Recommended: 800x600 (4:3) or 1200x800
                </span>
              </div>
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
                    gridTemplateColumns: '170px 1fr auto',
                    gap: 'var(--space-5)',
                    alignItems: 'start',
                  }}
                >
                  {/* Photo */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                      <label style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>
                        Coach Photo
                      </label>
                      <span style={{ fontSize: '0.65rem', background: 'var(--surface)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                        Recommended: 400x400 (1:1)
                      </span>
                    </div>
                    <div
                      style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'var(--surface)',
                        border: '2px solid var(--accent)',
                        marginBottom: 'var(--space-2)',
                        marginInline: 'auto',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    >
                      {coach.photo ? (
                        <img src={coach.photo} alt={coach.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
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
                        marginBottom: 'var(--space-2)',
                      }}
                    />

                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <label
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '0.35rem 0.45rem',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          cursor: 'pointer',
                          color: 'var(--text)',
                        }}
                        title="Upload photo from device"
                      >
                        📁 Upload
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const result = event.target?.result;
                                if (result) updateArrayItemField(index, 'photo', result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {coach.photo && (
                        <button
                          type="button"
                          onClick={() => updateArrayItemField(index, 'photo', '')}
                          title="Delete / Clear coach photo"
                          style={{
                            flex: 1,
                            padding: '0.35rem 0.45rem',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: '1px solid #FCA5A5',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete Photo
                        </button>
                      )}
                    </div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div>
                <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
                  Manage player milestones, college sports-quota admissions, and state team selections.
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.75rem', margin: '4px 0 0 0' }}>
                  Add, update or delete athlete photos. Only entries with written consent will display publicly.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addArrayItem({
                    id: `ind-${Date.now()}`,
                    player: 'New Athlete',
                    category: 'Scholarship',
                    highlight: 'Sports-quota selection, University (100% scholarship)',
                    hasConsent: true,
                    image: '',
                  })
                }
                style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 1rem' }}
              >
                ➕ Add Player Achievement
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {formData.map((item, index) => {
                const currentImage = item.image || item.photo || '';
                return (
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
                    {/* ── Photo Management Column (Update & Delete Images) ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>
                          Athlete Photo
                        </label>
                        <span style={{ fontSize: '0.65rem', background: 'var(--surface)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                          Recommended: 600x600 (1:1)
                        </span>
                      </div>

                      {/* Photo Preview Box */}
                      <div
                        style={{
                          width: '100%',
                          height: '130px',
                          borderRadius: 'var(--radius)',
                          overflow: 'hidden',
                          background: 'var(--surface)',
                          border: '1px dashed var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        {currentImage ? (
                          <img
                            src={currentImage}
                            alt={item.player || 'Athlete'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div style={{ textAlign: 'center', padding: 'var(--space-2)', color: 'var(--muted)' }}>
                            <div style={{ fontSize: '1.6rem', marginBottom: '2px' }}>⚽</div>
                            <span style={{ fontSize: '0.7rem' }}>No image set</span>
                          </div>
                        )}
                      </div>

                      {/* Photo URL Input Field */}
                      <input
                        type="url"
                        placeholder="Image URL https://..."
                        value={currentImage}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateArrayItemField(index, 'image', val);
                          if (item.photo) updateArrayItemField(index, 'photo', val);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.5rem',
                          fontSize: '0.75rem',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg)',
                        }}
                      />

                      {/* Action buttons: Upload local file + Delete Image */}
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <label
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '0.35rem 0.45rem',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            color: 'var(--text)',
                          }}
                          title="Upload image from device"
                        >
                          📁 Upload
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const result = event.target?.result;
                                  if (result) {
                                    updateArrayItemField(index, 'image', result);
                                    if (item.photo) updateArrayItemField(index, 'photo', result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {currentImage && (
                          <button
                            type="button"
                            onClick={() => {
                              updateArrayItemField(index, 'image', '');
                              updateArrayItemField(index, 'photo', '');
                            }}
                            title="Remove / Delete this image"
                            style={{
                              flex: 1,
                              padding: '0.35rem 0.45rem',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              background: '#FEE2E2',
                              color: '#DC2626',
                              border: '1px solid #FCA5A5',
                              borderRadius: 'var(--radius)',
                              cursor: 'pointer',
                            }}
                          >
                            🗑️ Delete Image
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ── Player Details & Consent Column ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                            Athlete / Player Name
                          </label>
                          <input
                            type="text"
                            placeholder="Player Full Name"
                            value={item.player || ''}
                            onChange={(e) => updateArrayItemField(index, 'player', e.target.value)}
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
                            Category / Distinction
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Scholarship, State, University"
                            value={item.category || ''}
                            onChange={(e) => updateArrayItemField(index, 'category', e.target.value)}
                            list={`categories-${index}`}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              borderRadius: 'var(--radius)',
                              border: '1px solid var(--border)',
                              background: 'var(--bg)',
                              fontSize: 'var(--fs-sm)',
                            }}
                          />
                          <datalist id={`categories-${index}`}>
                            <option value="Scholarship" />
                            <option value="State Representation" />
                            <option value="University" />
                            <option value="Senior League" />
                            <option value="District Selection" />
                            <option value="National Trials" />
                          </datalist>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                          Selection / Scholarship Highlights & Honors
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Sports-quota selection, University (100% scholarship, degree details)"
                          value={item.highlight || ''}
                          onChange={(e) => updateArrayItemField(index, 'highlight', e.target.value)}
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

                      {/* Extended Profile Fields: Position & Quick Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                            Playing Position
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Attacking Midfielder, Striker"
                            value={item.position || ''}
                            onChange={(e) => updateArrayItemField(index, 'position', e.target.value)}
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
                            Age / Birth Year / Batch
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 2004 (U21) / Super Seniors"
                            value={item.batch || ''}
                            onChange={(e) => updateArrayItemField(index, 'batch', e.target.value)}
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
                            College / Team Affiliation
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. SRM University / Tamil Nadu State"
                            value={item.college || ''}
                            onChange={(e) => updateArrayItemField(index, 'college', e.target.value)}
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

                      {/* Spacious Long Structured Bio */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                          <label style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>
                            Detailed Player Biography & Career Journey (Long Structured Story)
                          </label>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                            Paste full paragraphs, story, and history
                          </span>
                        </div>
                        <textarea
                          rows={5}
                          placeholder="Paste the player's full story here: childhood beginnings at MFC, breakthrough tournaments, training regimen, leadership qualities, state trials, and university progression..."
                          value={item.bio || ''}
                          onChange={(e) => updateArrayItemField(index, 'bio', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                            fontSize: 'var(--fs-sm)',
                            lineHeight: 1.6,
                            fontFamily: 'inherit',
                          }}
                        />
                      </div>

                      {/* Structured Career Achievements & Honours List */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                          <label style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>
                            Structured Tournaments, Cups & Honors (One per line)
                          </label>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                            Line-by-line list shows as trophy bullets
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          placeholder={"Santosh Trophy South Zone Camp (2023)\nChampions - Chennai Senior Division League with Viva Chennai\nInter-University Championship Top Scorer\n100% Sports-Quota Scholarship at University"}
                          value={Array.isArray(item.honors) ? item.honors.join('\n') : (item.honors || '')}
                          onChange={(e) => {
                            const lines = e.target.value.split('\n');
                            updateArrayItemField(index, 'honors', lines);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                            fontSize: 'var(--fs-sm)',
                            lineHeight: 1.5,
                            fontFamily: 'monospace',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-xs)', cursor: 'pointer', fontWeight: 600, color: item.hasConsent ?? true ? 'var(--accent-dark)' : 'var(--muted)' }}>
                          <input
                            type="checkbox"
                            checked={item.hasConsent ?? true}
                            onChange={(e) => updateArrayItemField(index, 'hasConsent', e.target.checked)}
                          />
                          Publishable (Written consent verified for public showcase)
                        </label>

                        {item.id && (
                          <a
                            href={`/player-profile/${item.id}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--accent-dark)',
                              textDecoration: 'none',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            🔗 View Public Profile Page ↗
                          </a>
                        )}
                      </div>
                    </div>

                    {/* ── Delete Record Action ── */}
                    <div>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index)}
                        title="Delete Entire Record"
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
                        🗑️ Delete Record
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 7B: SQUAD PLAYERS & STAFF (Real Madrid Style)
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'squad' && Array.isArray(formData) && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div>
                <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
                  Manage squad player cutouts, jersey numbers, positions, and competitive tiers (Juniors, Seniors, Super Seniors, Staff).
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.75rem', margin: '4px 0 0 0' }}>
                  Upload new player portraits, update details, or delete images. Filter by tier below.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addArrayItem({
                    id: `sq-${Date.now()}`,
                    name: 'New Player',
                    number: '10',
                    position: 'Forward',
                    tier: adminSquadFilter !== 'all' ? adminSquadFilter : 'seniors',
                    image: '',
                    hasConsent: true,
                  })
                }
                style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 1rem' }}
              >
                ➕ Add Squad Member
              </button>
            </div>

            {/* Admin Tier Filter Pills */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `All Members (${formData.length})` },
                { id: 'super_seniors', label: 'Super Seniors' },
                { id: 'seniors', label: 'Seniors' },
                { id: 'juniors', label: 'Juniors' },
                { id: 'staff', label: 'Coaches & Medical Staff' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAdminSquadFilter(tab.id)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border)',
                    background: adminSquadFilter === tab.id ? 'var(--accent-glow)' : 'var(--surface-2)',
                    color: adminSquadFilter === tab.id ? 'var(--accent-dark)' : 'var(--text)',
                    fontWeight: adminSquadFilter === tab.id ? 700 : 500,
                    fontSize: 'var(--fs-xs)',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Squad Members List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {formData.map((item, index) => {
                if (adminSquadFilter !== 'all' && item.tier !== adminSquadFilter) {
                  return null;
                }
                const currentImage = item.image || item.photo || '';
                return (
                  <div
                    key={item.id || index}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: 'var(--space-5)',
                      background: 'var(--surface-2)',
                      display: 'grid',
                      gridTemplateColumns: '170px 1fr auto',
                      gap: 'var(--space-5)',
                      alignItems: 'start',
                    }}
                  >
                    {/* Card Preview & Photo Management */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>
                          Player Photo Cutout
                        </label>
                        <span style={{ fontSize: '0.65rem', background: 'var(--surface)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                          Recommended: 600x800 (3:4)
                        </span>
                      </div>

                      {/* Real Madrid Card Preview Frame */}
                      <div
                        style={{
                          width: '100%',
                          height: '160px',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          background: 'linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 35%, #1E1B4B 80%, #0F172A 100%)',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      >
                        {currentImage ? (
                          <img
                            src={currentImage}
                            alt={item.name || 'Player'}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'top center',
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '2.5rem' }}>⚽</div>
                        )}

                        {/* Bottom Overlay with Number & Name */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.5) 40%, transparent 70%)',
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '8px 10px',
                            gap: '6px',
                          }}
                        >
                          {item.number && (
                            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', lineHeight: 0.9 }}>
                              {item.number}
                            </span>
                          )}
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name || 'Name'}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#CBD5E1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.position || 'Position'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* URL Input */}
                      <input
                        type="url"
                        placeholder="Photo URL https://..."
                        value={currentImage}
                        onChange={(e) => updateArrayItemField(index, 'image', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.5rem',
                          fontSize: '0.75rem',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg)',
                        }}
                      />

                      {/* Upload & Delete Image Buttons */}
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <label
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '0.35rem 0.45rem',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            color: 'var(--text)',
                          }}
                          title="Upload photo from device"
                        >
                          📁 Upload
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const result = event.target?.result;
                                  if (result) updateArrayItemField(index, 'image', result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {currentImage && (
                          <button
                            type="button"
                            onClick={() => updateArrayItemField(index, 'image', '')}
                            title="Delete / Clear player photo"
                            style={{
                              flex: 1,
                              padding: '0.35rem 0.45rem',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              background: '#FEE2E2',
                              color: '#DC2626',
                              border: '1px solid #FCA5A5',
                              borderRadius: 'var(--radius)',
                              cursor: 'pointer',
                            }}
                          >
                            🗑️ Delete Image
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Form Fields: Name, Number, Tier, Position, Consent */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-3)' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                            Player / Staff Full Name
                          </label>
                          <input
                            type="text"
                            value={item.name || ''}
                            placeholder="e.g. Mestre, Fortea, Dhanapal"
                            onChange={(e) => updateArrayItemField(index, 'name', e.target.value)}
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
                            Jersey Number (or empty)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 1, 7, 10"
                            value={item.number || ''}
                            onChange={(e) => updateArrayItemField(index, 'number', e.target.value)}
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

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                            Squad Tier / Category
                          </label>
                          <select
                            value={item.tier || 'seniors'}
                            onChange={(e) => updateArrayItemField(index, 'tier', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              borderRadius: 'var(--radius)',
                              border: '1px solid var(--border)',
                              background: 'var(--bg)',
                              fontSize: 'var(--fs-sm)',
                            }}
                          >
                            <option value="super_seniors">Super Seniors (2009–2011)</option>
                            <option value="seniors">Seniors (2012–2014)</option>
                            <option value="juniors">Juniors (2015–2017)</option>
                            <option value="staff">Coaching & Medical Staff</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                            Position / Role
                          </label>
                          <input
                            type="text"
                            placeholder="Goalkeeper, Defender, Midfielder, Forward, Head Coach, Physio"
                            value={item.position || ''}
                            onChange={(e) => updateArrayItemField(index, 'position', e.target.value)}
                            list={`squad-positions-${index}`}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              borderRadius: 'var(--radius)',
                              border: '1px solid var(--border)',
                              background: 'var(--bg)',
                              fontSize: 'var(--fs-sm)',
                            }}
                          />
                          <datalist id={`squad-positions-${index}`}>
                            <option value="Goalkeeper" />
                            <option value="Defender" />
                            <option value="Midfielder" />
                            <option value="Forward" />
                            <option value="Head Coach" />
                            <option value="Assistant Coach" />
                            <option value="Lead Physiotherapist" />
                            <option value="Fitness & Conditioning Coach" />
                            <option value="Team Doctor" />
                          </datalist>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '2px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-xs)', cursor: 'pointer', fontWeight: 600, color: item.hasConsent ?? true ? 'var(--accent-dark)' : 'var(--muted)' }}>
                          <input
                            type="checkbox"
                            checked={item.hasConsent ?? true}
                            onChange={(e) => updateArrayItemField(index, 'hasConsent', e.target.checked)}
                          />
                          Publishable (Consent verified for public roster display)
                        </label>
                      </div>
                    </div>

                    {/* Delete Squad Member Action */}
                    <div>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index)}
                        title="Delete Squad Member"
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
                        🗑️ Delete Member
                      </button>
                    </div>
                  </div>
                );
              })}
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

      {/* ── In-App Confirmation Modal Notification ── */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 10, 10, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 'var(--space-4)',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--accent-glow)',
                color: 'var(--accent-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                margin: '0 auto var(--space-4)',
                fontWeight: 800,
              }}
            >
              ✓
            </div>

            <h3 style={{ fontSize: '1.35rem', marginBottom: 'var(--space-2)' }}>
              Publish Section Live?
            </h3>

            <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
              Are you sure you want to publish the <strong>&ldquo;{selectedTemplate.toUpperCase()}&rdquo;</strong> section live to the website? This will immediately be visible to all public visitors.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn btn--outline"
                style={{ flex: 1, padding: '0.65rem 1rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeSave(true)}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.65rem 1rem' }}
              >
                Confirm &amp; Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
