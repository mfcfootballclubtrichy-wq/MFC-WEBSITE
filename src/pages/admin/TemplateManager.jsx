/* eslint-disable react/prop-types, react/no-unescaped-entities */
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
    { id: 'updates', label: '📰 News & Club Updates', desc: 'Frequent updates, tournament announcements, news with images' },
    { id: 'home', label: '🏠 Home Page Banners & Text', desc: 'Hero headlines, call-to-actions, hero background & training images' },
    { id: 'hero_slides', label: '⚡ Hero Action Shots (Right Side)', desc: 'Large cutout ball-shooting & action images sliding in hero banner' },
    { id: 'about', label: '📖 About Page & Story', desc: 'Club foundation text, history, story image' },
    { id: 'vision', label: '🎯 Vision & Values', desc: 'Club mission, community pledge and values' },
    { id: 'coaches', label: '👔 Coaches & Technical Staff', desc: 'Coach profiles, AIFF certification badges, photos, bios' },
    { id: 'squad', label: '⚽ Squad Players & Staff', desc: 'Player cards, photos, positions, junior/senior tiers, physio & staff' },
    { id: 'team_achievements', label: '🏆 Team Tournament Podiums', desc: 'Season, placement, tournament name, venue' },
    { id: 'individual_achievements', label: '🌟 Selections & Scholarships', desc: 'Player name, photo upload/update, selections, scholarships' },
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
      case 'hero_slides':
        setFormData([
          {
            id: 'slide-1',
            image: '/coaches/sample-coach.png',
            title: 'Action Shot 1 (Ball Shooting)',
          },
          {
            id: 'slide-2',
            image: '/about-mfc-freestyle.png',
            title: 'Action Shot 2 (Freestyle / Dribble)',
          },
          {
            id: 'slide-3',
            image: '/coaches/sample-coach.png',
            title: 'Action Shot 3 (Match Action)',
          },
        ]);
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
              background: message.type === 'error' ? '#FEE2E2' : 'var(--surface)',
              border: `1px solid ${message.type === 'error' ? '#F87171' : 'var(--accent)'}`,
              color: message.type === 'error' ? '#991B1B' : 'var(--accent-dark)',
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
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: item.objectFit || 'cover',
                          transform: `scale(${item.scale || 1}) translateY(${item.offsetY || 0}px)`,
                          transition: 'transform 0.15s ease',
                        }}
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

                    {/* Spacious Sizing & Positioning Control Bar for Featured Main Image */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3)',
                        background: 'var(--bg)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                            📏 Main Banner Height
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                            {item.maxHeight || 200}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="150"
                          max="480"
                          step="10"
                          value={item.maxHeight || 200}
                          onChange={(e) => updateArrayItemField(index, 'maxHeight', parseInt(e.target.value, 10))}
                          style={{ width: '100%', accentColor: 'var(--accent)' }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                            🔍 Main Zoom / Scale
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                            {Math.round((item.scale || 1) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.7"
                          max="1.6"
                          step="0.05"
                          value={item.scale || 1}
                          onChange={(e) => updateArrayItemField(index, 'scale', parseFloat(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--accent)' }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                            ↕️ Shift Up / Down
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                            {item.offsetY || 0}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-70"
                          max="70"
                          step="2"
                          value={item.offsetY || 0}
                          onChange={(e) => updateArrayItemField(index, 'offsetY', parseInt(e.target.value, 10))}
                          style={{ width: '100%', accentColor: 'var(--accent)' }}
                        />
                      </div>

                      <div>
                        <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)', marginBottom: '2px' }}>
                          🔲 Main Fit Mode
                        </span>
                        <select
                          value={item.objectFit || 'cover'}
                          onChange={(e) => updateArrayItemField(index, 'objectFit', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.35rem 0.5rem',
                            fontSize: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)',
                            background: 'var(--surface)',
                            color: 'var(--text)',
                          }}
                        >
                          <option value="cover">Cover (Fill Card/Banner)</option>
                          <option value="contain">Contain (Full Photo - No Cut)</option>
                        </select>
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

                      {/* Gallery Photos Sizing & Fit Display Options */}
                      <div
                        style={{
                          background: 'var(--bg)',
                          borderRadius: 'var(--radius)',
                          border: '1.5px solid var(--accent)',
                          padding: 'var(--space-3)',
                          marginBottom: 'var(--space-3)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            🖼️ Gallery Sizing & Display Settings (Prevents Face Cutoff)
                          </span>

                          {/* Quick 1-Click Sizing Presets */}
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => {
                                updateArrayItemField(index, 'galleryFit', 'contain');
                                updateArrayItemField(index, 'galleryHeight', 360);
                                updateArrayItemField(index, 'galleryScale', 1);
                              }}
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                                background: (item.galleryFit || 'contain') === 'contain' ? 'var(--accent)' : 'var(--surface)',
                                color: (item.galleryFit || 'contain') === 'contain' ? '#000' : 'var(--text)',
                                cursor: 'pointer',
                              }}
                            >
                              📐 Contain (No Crop)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateArrayItemField(index, 'galleryFit', 'natural');
                                updateArrayItemField(index, 'galleryHeight', 420);
                                updateArrayItemField(index, 'galleryScale', 1);
                              }}
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                                background: item.galleryFit === 'natural' ? 'var(--accent)' : 'var(--surface)',
                                color: item.galleryFit === 'natural' ? '#000' : 'var(--text)',
                                cursor: 'pointer',
                              }}
                            >
                              ✨ Natural (Auto Height)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateArrayItemField(index, 'galleryFit', 'cover');
                                updateArrayItemField(index, 'galleryHeight', 280);
                                updateArrayItemField(index, 'galleryScale', 1);
                              }}
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                                background: item.galleryFit === 'cover' ? 'var(--accent)' : 'var(--surface)',
                                color: item.galleryFit === 'cover' ? '#000' : 'var(--text)',
                                cursor: 'pointer',
                              }}
                            >
                              🔲 Grid Tiles (Cover)
                            </button>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: 'var(--space-3)',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text)' }}>
                                📏 Gallery Card Height
                              </span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-dark)' }}>
                                {item.galleryHeight || 340}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="180"
                              max="550"
                              step="10"
                              value={item.galleryHeight || 340}
                              onChange={(e) => updateArrayItemField(index, 'galleryHeight', parseInt(e.target.value, 10))}
                              style={{ width: '100%', accentColor: 'var(--accent)' }}
                            />
                          </div>

                          <div>
                            <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
                              🔲 Gallery Fit Mode
                            </span>
                            <select
                              value={item.galleryFit || 'contain'}
                              onChange={(e) => updateArrayItemField(index, 'galleryFit', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '0.35rem 0.5rem',
                                fontSize: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: 'var(--text)',
                              }}
                            >
                              <option value="contain">Contain (Full Image - Never Crop Face)</option>
                              <option value="natural">Natural (Adaptive Height - Zero Crop)</option>
                              <option value="cover">Cover (Fill Equal Cards)</option>
                            </select>
                          </div>

                          <div>
                            <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
                              📐 Grid Layout Columns
                            </span>
                            <select
                              value={item.galleryColumns || 'auto'}
                              onChange={(e) => updateArrayItemField(index, 'galleryColumns', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '0.35rem 0.5rem',
                                fontSize: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: 'var(--text)',
                              }}
                            >
                              <option value="auto">Auto Responsive Grid</option>
                              <option value="2">2 Columns (Large Photos)</option>
                              <option value="3">3 Columns (Standard)</option>
                              <option value="4">4 Columns (Compact)</option>
                            </select>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text)' }}>
                                🔍 Gallery Photo Zoom
                              </span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-dark)' }}>
                                {Math.round((item.galleryScale || 1) * 100)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0.7"
                              max="1.5"
                              step="0.05"
                              value={item.galleryScale || 1}
                              onChange={(e) => updateArrayItemField(index, 'galleryScale', parseFloat(e.target.value))}
                              style={{ width: '100%', accentColor: 'var(--accent)' }}
                            />
                          </div>
                        </div>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
                {/* ── About Section Ground Image ── */}
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <label style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text)' }}>
                      About Section Ground Image
                    </label>
                    <span style={{ fontSize: '0.68rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)', fontWeight: 600 }}>
                      1200×800 (3:2)
                    </span>
                  </div>

                  {/* Photo Preview Box */}
                  <div
                    style={{
                      width: '100%',
                      height: '160px',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                      background: 'radial-gradient(circle, rgba(210, 4, 45, 0.12) 0%, var(--surface-2) 70%)',
                      border: '1px dashed var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {formData.aboutImage ? (
                      <img
                        src={formData.aboutImage}
                        alt="About ground preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transform: `scale(${formData.aboutImageScale || 1}) translateY(${formData.aboutImageOffsetY || 0}px)`,
                          transition: 'transform 0.15s ease',
                        }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 'var(--space-3)' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🏞️</div>
                        <span style={{ fontSize: '0.75rem' }}>No photo uploaded</span>
                      </div>
                    )}
                  </div>

                  {/* Direct Device File Upload & Clear Buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <label
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '0.55rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: 'var(--accent)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(210, 4, 45, 0.2)',
                      }}
                      title="Upload photo from phone or computer storage"
                    >
                      📁 Choose Photo from Device
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
                              if (result) updateField('aboutImage', result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {formData.aboutImage && (
                      <button
                        type="button"
                        onClick={() => updateField('aboutImage', '')}
                        style={{
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: '#FEE2E2',
                          color: '#DC2626',
                          border: '1px solid #FCA5A5',
                          borderRadius: 'var(--radius)',
                          cursor: 'pointer',
                        }}
                        title="Remove photo"
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>

                  {/* Fallback URL Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '3px' }}>
                      Or paste direct image URL:
                    </label>
                    <input
                      type="url"
                      value={formData.aboutImage || ''}
                      onChange={(e) => updateField('aboutImage', e.target.value)}
                      placeholder="https://..."
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                      }}
                    />
                  </div>

                  {/* Sizing & Framing Bar */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2)',
                      background: 'var(--bg)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                          🔍 Zoom
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text)' }}>
                          {Math.round((formData.aboutImageScale || 1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.8"
                        max="1.6"
                        step="0.05"
                        value={formData.aboutImageScale || 1}
                        onChange={(e) => updateField('aboutImageScale', parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent)' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                          ↕️ Shift Y
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text)' }}>
                          {formData.aboutImageOffsetY || 0}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="2"
                        value={formData.aboutImageOffsetY || 0}
                        onChange={(e) => updateField('aboutImageOffsetY', parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--accent)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Hero Background / Banner Image ── */}
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <label style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text)' }}>
                      Hero Background / Banner Image
                    </label>
                    <span style={{ fontSize: '0.68rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)', fontWeight: 600 }}>
                      1920×1080 (16:9)
                    </span>
                  </div>

                  {/* Photo Preview Box */}
                  <div
                    style={{
                      width: '100%',
                      height: '160px',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                      background: 'radial-gradient(circle, rgba(210, 4, 45, 0.12) 0%, var(--surface-2) 70%)',
                      border: '1px dashed var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {formData.heroImage ? (
                      <img
                        src={formData.heroImage}
                        alt="Hero banner preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transform: `scale(${formData.heroImageScale || 1}) translateY(${formData.heroImageOffsetY || 0}px)`,
                          transition: 'transform 0.15s ease',
                        }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 'var(--space-3)' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🏟️</div>
                        <span style={{ fontSize: '0.75rem' }}>No banner uploaded</span>
                      </div>
                    )}
                  </div>

                  {/* Direct Device File Upload & Clear Buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <label
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '0.55rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: 'var(--accent)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(210, 4, 45, 0.2)',
                      }}
                      title="Upload hero banner from phone or computer storage"
                    >
                      📁 Choose Banner from Device
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
                              if (result) updateField('heroImage', result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {formData.heroImage && (
                      <button
                        type="button"
                        onClick={() => updateField('heroImage', '')}
                        style={{
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: '#FEE2E2',
                          color: '#DC2626',
                          border: '1px solid #FCA5A5',
                          borderRadius: 'var(--radius)',
                          cursor: 'pointer',
                        }}
                        title="Remove banner"
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>

                  {/* Fallback URL Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '3px' }}>
                      Or paste direct image URL:
                    </label>
                    <input
                      type="url"
                      value={formData.heroImage || ''}
                      onChange={(e) => updateField('heroImage', e.target.value)}
                      placeholder="https://..."
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                      }}
                    />
                  </div>

                  {/* Sizing & Framing Bar */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2)',
                      background: 'var(--bg)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                          🔍 Zoom
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text)' }}>
                          {Math.round((formData.heroImageScale || 1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.8"
                        max="1.6"
                        step="0.05"
                        value={formData.heroImageScale || 1}
                        onChange={(e) => updateField('heroImageScale', parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent)' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                          ↕️ Shift Y
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text)' }}>
                          {formData.heroImageOffsetY || 0}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="2"
                        value={formData.heroImageOffsetY || 0}
                        onChange={(e) => updateField('heroImageOffsetY', parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--accent)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            FORM VIEW 2.5: HERO ACTION SHOTS (SLIDESHOW)
        ═══════════════════════════════════════════════════════ */}
        {selectedTemplate === 'hero_slides' && Array.isArray(formData) && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-1)' }}>
                  ⚡ Right-Side Hero Action Shots (Ball Shooting & Match Poses)
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', maxWidth: '650px' }}>
                  Manage the large action images that slide continuously on the right side of the homepage hero banner.
                  Use <strong>transparent PNGs (cutout without any background)</strong> so the ball shooting or action pose blends seamlessly into the page!
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addArrayItem({
                    id: `slide-${Date.now()}`,
                    image: '/coaches/sample-coach.png',
                    title: `Action Pose ${formData.length + 1}`,
                  })
                }
              >
                + Add New Action Image
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {formData.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="card"
                  style={{
                    padding: 'var(--space-5)',
                    display: 'grid',
                    gridTemplateColumns: '150px 1fr auto',
                    gap: 'var(--space-5)',
                    alignItems: 'center',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {/* Image Preview with transparent ambient background */}
                  <div
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: 'var(--radius)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'radial-gradient(circle, rgba(210, 4, 45, 0.12) 0%, #FFFFFF 70%)',
                      border: '1px dashed var(--border)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {slide.image ? (
                      <img
                        src={slide.image}
                        alt={slide.title || 'Action preview'}
                        style={{
                          maxHeight: '140px',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          transform: `scale(${slide.scale || 1}) translateY(${slide.offsetY || 0}px)`,
                          filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.18))',
                          transition: 'transform 0.15s ease',
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)' }}>No image</span>
                    )}
                  </div>

                  {/* Field inputs with Sizing & Dimension Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                          Action Cutout Image (Device Upload)
                        </label>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <label
                            style={{
                              flex: 1,
                              textAlign: 'center',
                              padding: '0.45rem 0.65rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: 'var(--accent)',
                              color: '#FFFFFF',
                              borderRadius: 'var(--radius)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                            title="Upload action photo / transparent cutout from your device storage"
                          >
                            📁 Upload Cutout from Device
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
                                    if (result) updateArrayItemField(idx, 'image', result);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>

                          {slide.image && (
                            <button
                              type="button"
                              onClick={() => updateArrayItemField(idx, 'image', '')}
                              style={{
                                padding: '0.45rem 0.65rem',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                background: '#FEE2E2',
                                color: '#DC2626',
                                border: '1px solid #FCA5A5',
                                borderRadius: 'var(--radius)',
                                cursor: 'pointer',
                              }}
                              title="Remove image"
                            >
                              🗑️
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={slide.image || ''}
                          onChange={(e) => updateArrayItemField(idx, 'image', e.target.value)}
                          placeholder="Or path e.g. /coaches/mfc-player-action.png"
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                            fontSize: '0.75rem',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--fs-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                          Action Pose Label / Alt Text
                        </label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => updateArrayItemField(idx, 'title', e.target.value)}
                          placeholder="e.g. Striker Ball Shooting Pose"
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.8rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                            fontSize: 'var(--fs-sm)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Sizing & Positioning Control Bar */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-3)',
                        background: 'var(--bg)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {/* Height Control */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                            📏 Height / Size
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                            {slide.maxHeight || 520}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="350"
                          max="650"
                          step="10"
                          value={slide.maxHeight || 520}
                          onChange={(e) => updateArrayItemField(idx, 'maxHeight', parseInt(e.target.value, 10))}
                          style={{ width: '100%', accentColor: 'var(--accent)' }}
                        />
                      </div>

                      {/* Scale / Zoom Control */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                            🔍 Zoom / Scale
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                            {Math.round((slide.scale || 1) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.8"
                          max="1.5"
                          step="0.05"
                          value={slide.scale || 1}
                          onChange={(e) => updateArrayItemField(idx, 'scale', parseFloat(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--accent)' }}
                        />
                      </div>

                      {/* Vertical Shift (Up/Down) Control */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                            ↕️ Shift Up / Down
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                            {slide.offsetY || 0}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-60"
                          max="60"
                          step="5"
                          value={slide.offsetY || 0}
                          onChange={(e) => updateArrayItemField(idx, 'offsetY', parseInt(e.target.value, 10))}
                          style={{ width: '100%', accentColor: 'var(--accent)' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions: delete */}
                  <div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem(idx)}
                      className="btn btn--outline"
                      style={{ color: '#DC2626', borderColor: 'rgba(220, 38, 38, 0.3)', padding: '0.5rem 0.8rem', fontSize: 'var(--fs-xs)' }}
                      title="Remove slide"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {formData.length === 0 && (
                <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--muted)', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
                  No action shots added yet. Click <strong>+ Add New Action Image</strong> above to add your first image!
                </div>
              )}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: '6px' }}>
                <label style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text)' }}>
                  About Page Featured Image
                </label>
                <span style={{ fontSize: '0.68rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)', fontWeight: 600 }}>
                  800×600 (4:3) or 1200×800
                </span>
              </div>

              {/* Photo Preview Box */}
              <div
                style={{
                  maxWidth: '440px',
                  height: '200px',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  background: 'radial-gradient(circle, rgba(210, 4, 45, 0.12) 0%, var(--surface-2) 70%)',
                  border: '1px dashed var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="About preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: `scale(${formData.scale || 1}) translateY(${formData.offsetY || 0}px)`,
                      transition: 'transform 0.15s ease',
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 'var(--space-3)' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🖼️</div>
                    <span style={{ fontSize: '0.75rem' }}>No photo uploaded</span>
                  </div>
                )}
              </div>

              {/* Upload from Device & Clear Buttons */}
              <div style={{ display: 'flex', gap: '8px', maxWidth: '440px', marginBottom: 'var(--space-2)' }}>
                <label
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: 'var(--accent)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(210, 4, 45, 0.2)',
                  }}
                  title="Upload image from phone or computer storage"
                >
                  📁 Choose Photo from Device
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
                          if (result) updateField('image', result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                {formData.image && (
                  <button
                    type="button"
                    onClick={() => updateField('image', '')}
                    style={{
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: '#FEE2E2',
                      color: '#DC2626',
                      border: '1px solid #FCA5A5',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                    }}
                    title="Remove photo"
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>

              <div style={{ maxWidth: '440px', marginBottom: 'var(--space-3)' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '3px' }}>
                  Or paste direct image URL:
                </label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => updateField('image', e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    fontSize: '0.75rem',
                  }}
                />
              </div>

              {/* Sizing & Positioning Control Bar for About Featured Image */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  maxWidth: '440px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                      📏 Height
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                      {formData.maxHeight || 440}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="280"
                    max="550"
                    step="10"
                    value={formData.maxHeight || 440}
                    onChange={(e) => updateField('maxHeight', parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                      🔍 Zoom
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                      {Math.round((formData.scale || 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.5"
                    step="0.05"
                    value={formData.scale || 1}
                    onChange={(e) => updateField('scale', parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                      ↕️ Shift Y
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                      {formData.offsetY || 0}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="2"
                    value={formData.offsetY || 0}
                    onChange={(e) => updateField('offsetY', parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                </div>
              </div>
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
                        width: '100%',
                        maxWidth: '160px',
                        height: `${Math.round((coach.maxHeight ? Math.min(Math.max(coach.maxHeight, 180), 245) : 220) * 0.72)}px`,
                        minHeight: '135px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'radial-gradient(circle, rgba(210, 4, 45, 0.12) 0%, #FFFFFF 70%)',
                        border: '1px dashed var(--border)',
                        marginBottom: 'var(--space-2)',
                        marginInline: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      {coach.photo ? (
                        <img
                          src={coach.photo}
                          alt={coach.name}
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            transform: `scale(${Math.min(coach.scale || 1, 1.25)}) translateY(${Math.min(Math.max(coach.offsetY || 0, -35), 35)}px)`,
                            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.14))',
                            transition: 'transform 0.15s ease',
                          }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                          {coach.name?.charAt(0) || 'C'}
                        </div>
                      )}
                    </div>
                    {/* Live label preview showing text visibility */}
                    <div style={{ textAlign: 'center', padding: '3px 6px', background: 'var(--surface)', borderRadius: '6px', marginBottom: '8px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--accent-dark)', textTransform: 'uppercase', display: 'block' }}>
                        {coach.role || 'Coach Role'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                        {coach.name || 'Coach Name'}
                      </span>
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

                    {/* Sizing & Positioning Control Bar for Coach Photo */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3)',
                        background: 'var(--bg)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                            📏 Height / Size
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                            {coach.maxHeight ? Math.min(Math.max(coach.maxHeight, 180), 245) : 220}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="180"
                          max="245"
                          step="5"
                          value={coach.maxHeight ? Math.min(Math.max(coach.maxHeight, 180), 245) : 220}
                          onChange={(e) => updateArrayItemField(index, 'maxHeight', parseInt(e.target.value, 10))}
                          style={{ width: '100%', accentColor: 'var(--accent)' }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                            🔍 Zoom / Scale
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                            {Math.round(Math.min(coach.scale || 1, 1.25) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.8"
                          max="1.25"
                          step="0.05"
                          value={Math.min(coach.scale || 1, 1.25)}
                          onChange={(e) => updateArrayItemField(index, 'scale', parseFloat(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--accent)' }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                            ↕️ Shift Up / Down
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                            {Math.min(Math.max(coach.offsetY || 0, -30), 30)}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-30"
                          max="30"
                          step="2"
                          value={Math.min(Math.max(coach.offsetY || 0, -30), 30)}
                          onChange={(e) => updateArrayItemField(index, 'offsetY', parseInt(e.target.value, 10))}
                          style={{ width: '100%', accentColor: 'var(--accent)' }}
                        />
                      </div>
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
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transform: `scale(${item.scale || 1}) translateY(${item.offsetY || 0}px)`,
                              transition: 'transform 0.15s ease',
                            }}
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

                      {/* Spacious Sizing & Positioning Control Bar for Athlete Photo */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                          gap: 'var(--space-3)',
                          padding: 'var(--space-3)',
                          background: 'var(--bg)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                              🔍 Photo Zoom
                            </span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                              {Math.round((item.scale || 1) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.7"
                            max="1.6"
                            step="0.05"
                            value={item.scale || 1}
                            onChange={(e) => updateArrayItemField(index, 'scale', parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent)' }}
                          />
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                              ↕️ Shift Up / Down
                            </span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                              {item.offsetY || 0}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-60"
                            max="60"
                            step="2"
                            value={item.offsetY || 0}
                            onChange={(e) => updateArrayItemField(index, 'offsetY', parseInt(e.target.value, 10))}
                            style={{ width: '100%', accentColor: 'var(--accent)' }}
                          />
                        </div>

                        <div>
                          <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)', marginBottom: '2px' }}>
                            🔲 Photo Fit Mode
                          </span>
                          <select
                            value={item.objectFit || 'cover'}
                            onChange={(e) => updateArrayItemField(index, 'objectFit', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.35rem 0.5rem',
                              fontSize: '0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border)',
                              background: 'var(--surface)',
                              color: 'var(--text)',
                            }}
                          >
                            <option value="cover">Cover (Fill Frame)</option>
                            <option value="contain">Contain (Full Athlete - No Crop)</option>
                          </select>
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
                              objectFit: item.objectFit || 'cover',
                              objectPosition: 'top center',
                              transform: `scale(${item.scale || 1}) translateY(${item.offsetY || 0}px)`,
                              transformOrigin: 'top center',
                              transition: 'transform 0.15s ease',
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

                      {/* Spacious Sizing & Positioning Control Bar for Squad Photo */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                          gap: 'var(--space-3)',
                          padding: 'var(--space-3)',
                          background: 'var(--bg)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                              🔍 Photo Zoom
                            </span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                              {Math.round((item.scale || 1) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.7"
                            max="1.6"
                            step="0.05"
                            value={item.scale || 1}
                            onChange={(e) => updateArrayItemField(index, 'scale', parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent)' }}
                          />
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                              ↕️ Shift Up / Down
                            </span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                              {item.offsetY || 0}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-60"
                            max="60"
                            step="2"
                            value={item.offsetY || 0}
                            onChange={(e) => updateArrayItemField(index, 'offsetY', parseInt(e.target.value, 10))}
                            style={{ width: '100%', accentColor: 'var(--accent)' }}
                          />
                        </div>

                        <div>
                          <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)', marginBottom: '2px' }}>
                            🔲 Card Fit Mode
                          </span>
                          <select
                            value={item.objectFit || 'cover'}
                            onChange={(e) => updateArrayItemField(index, 'objectFit', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.35rem 0.5rem',
                              fontSize: '0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border)',
                              background: 'var(--surface)',
                              color: 'var(--text)',
                            }}
                          >
                            <option value="cover">Cover (Fill Card)</option>
                            <option value="contain">Contain (Full Cutout)</option>
                          </select>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: '6px' }}>
                <label style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text)' }}>
                  School Program Training Image
                </label>
                <span style={{ fontSize: '0.68rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--muted)', fontWeight: 600 }}>
                  1200×800 or 800×600
                </span>
              </div>

              {/* Photo Preview Box */}
              <div
                style={{
                  maxWidth: '440px',
                  height: '200px',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  background: 'radial-gradient(circle, rgba(210, 4, 45, 0.12) 0%, var(--surface-2) 70%)',
                  border: '1px dashed var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="School program preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: `scale(${formData.scale || 1}) translateY(${formData.offsetY || 0}px)`,
                      transition: 'transform 0.15s ease',
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 'var(--space-3)' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🏫</div>
                    <span style={{ fontSize: '0.75rem' }}>No photo uploaded</span>
                  </div>
                )}
              </div>

              {/* Upload from Device & Clear Buttons */}
              <div style={{ display: 'flex', gap: '8px', maxWidth: '440px', marginBottom: 'var(--space-2)' }}>
                <label
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: 'var(--accent)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(210, 4, 45, 0.2)',
                  }}
                  title="Upload image from phone or computer storage"
                >
                  📁 Choose Photo from Device
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
                          if (result) updateField('image', result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                {formData.image && (
                  <button
                    type="button"
                    onClick={() => updateField('image', '')}
                    style={{
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: '#FEE2E2',
                      color: '#DC2626',
                      border: '1px solid #FCA5A5',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                    }}
                    title="Remove photo"
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>

              <div style={{ maxWidth: '440px', marginBottom: 'var(--space-3)' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '3px' }}>
                  Or paste direct image URL:
                </label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => updateField('image', e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    fontSize: '0.75rem',
                  }}
                />
              </div>

              {/* Sizing & Positioning Control Bar for School Program Image */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  maxWidth: '440px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                      📏 Height
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                      {formData.maxHeight || 440}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="280"
                    max="550"
                    step="10"
                    value={formData.maxHeight || 440}
                    onChange={(e) => updateField('maxHeight', parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                      🔍 Zoom
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                      {Math.round((formData.scale || 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.5"
                    step="0.05"
                    value={formData.scale || 1}
                    onChange={(e) => updateField('scale', parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dark)' }}>
                      ↕️ Shift Y
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                      {formData.offsetY || 0}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="2"
                    value={formData.offsetY || 0}
                    onChange={(e) => updateField('offsetY', parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                </div>
              </div>
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
