/**
 * Dashboard.jsx — Super Admin Control Panel.
 */
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { supabase } from '../../lib/supabase.js';
import TemplateManager from './TemplateManager.jsx';

export default function Dashboard() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const effectiveRole = role || 'member';

  // Determine initial tab based on role
  const getInitialTab = () => {
    if (effectiveRole === 'member') return 'member_hub';
    if (effectiveRole === 'volunteer') return 'volunteer_hub';
    if (effectiveRole === 'coach') return 'coach_deck';
    return 'templates';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [currentTemplateTab, setCurrentTemplateTab] = useState('school_program');
  const [selectedSection, setSelectedSection] = useState(null);
  const [editJson, setEditJson] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // User Management State
  const [usersList, setUsersList] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('coach');
  const [userActionMsg, setUserActionMsg] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  useEffect(() => {
    if (effectiveRole === 'member' && ['templates', 'content', 'users', 'new_user'].includes(activeTab)) {
      setActiveTab('member_hub');
    } else if (effectiveRole === 'volunteer' && ['templates', 'content', 'users', 'new_user'].includes(activeTab)) {
      setActiveTab('volunteer_hub');
    }
  }, [effectiveRole, activeTab]);

  // Load Content Sections
  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section', { ascending: true });

      if (!error && data) {
        setSections(data);
      }
    } catch (err) {
      console.error('Failed to load sections:', err);
    } finally {
      // Finished loading sections
    }
  };

  // Load Users List with local cache and starter profile fallbacks
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setUsersList(data);
        localStorage.setItem('mfc_admin_cached_users', JSON.stringify(data));
        return;
      }

      // Check local cached records
      const cached = localStorage.getItem('mfc_admin_cached_users');
      if (cached) {
        setUsersList(JSON.parse(cached));
        return;
      }

      // Starter Club Profiles
      const initialClubUsers = [
        {
          id: 'ur-master-01',
          user_id: 'usr-superadmin-01',
          full_name: 'Surendar S (Founder & President)',
          email: 'mfcfootballclubtrichy@gmail.com',
          phone: '+91 95003 26868',
          role: 'super_admin',
          created_at: '2024-01-15T00:00:00.000Z',
          status: 'Active'
        },
        {
          id: 'ur-admin-02',
          user_id: 'usr-admin-02',
          full_name: 'Club Operations Admin',
          email: 'admin.mfc@mfcfootballclub.com',
          phone: '+91 98424 11223',
          role: 'admin',
          created_at: '2024-03-10T00:00:00.000Z',
          status: 'Active'
        },
        {
          id: 'ur-coach-03',
          user_id: 'usr-coach-03',
          full_name: 'Saravanan V (Head Coach - AIFF "C")',
          email: 'coach.saravanan@mfcfootball.com',
          phone: '+91 97890 12345',
          role: 'coach',
          created_at: '2024-04-01T00:00:00.000Z',
          status: 'Active'
        },
        {
          id: 'ur-coach-04',
          user_id: 'usr-coach-04',
          full_name: 'Karthik R (Grassroots & Youth Coach)',
          email: 'coach.karthik@mfcfootball.com',
          phone: '+91 94431 87654',
          role: 'coach',
          created_at: '2024-04-15T00:00:00.000Z',
          status: 'Active'
        },
        {
          id: 'ur-editor-05',
          user_id: 'usr-editor-05',
          full_name: 'Media & Communications Editor',
          email: 'editor.mfc@mfcfootballclub.com',
          phone: '+91 93601 23456',
          role: 'editor',
          created_at: '2024-05-20T00:00:00.000Z',
          status: 'Active'
        },
        {
          id: 'ur-volunteer-06',
          user_id: 'usr-volunteer-06',
          full_name: 'Matchday Coordinator & Volunteer',
          email: 'volunteer.desk@mfcfootball.com',
          phone: '+91 91234 56789',
          role: 'volunteer',
          created_at: '2024-06-12T00:00:00.000Z',
          status: 'Active'
        },
        {
          id: 'ur-member-07',
          user_id: 'usr-member-07',
          full_name: 'Senior Squad Trainee',
          email: 'player.arunkumar@gmail.com',
          phone: '+91 98940 98765',
          role: 'member',
          created_at: '2024-07-01T00:00:00.000Z',
          status: 'Active'
        }
      ];
      setUsersList(initialClubUsers);
      localStorage.setItem('mfc_admin_cached_users', JSON.stringify(initialClubUsers));
    } catch (err) {
      console.error('Failed to load user roles:', err);
      const cached = localStorage.getItem('mfc_admin_cached_users');
      if (cached) setUsersList(JSON.parse(cached));
    }
  };

  const handleUpdateRole = async (targetId, targetRole) => {
    try {
      await supabase
        .from('user_roles')
        .update({ role: targetRole })
        .eq('id', targetId);
    } catch (err) {
      console.warn('Supabase update note:', err);
    }
    // Update local state and cache immediately
    setUsersList((prev) => {
      const updated = prev.map((u) => u.id === targetId ? { ...u, role: targetRole } : u);
      localStorage.setItem('mfc_admin_cached_users', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteUser = async (targetId) => {
    if (!window.confirm('Are you sure you want to revoke this user account and role?')) return;
    try {
      await supabase.from('user_roles').delete().eq('id', targetId);
    } catch (err) {
      console.warn('Supabase delete note:', err);
    }
    setUsersList((prev) => {
      const updated = prev.filter((u) => u.id !== targetId);
      localStorage.setItem('mfc_admin_cached_users', JSON.stringify(updated));
      return updated;
    });
  };

  // Contact form submissions state & loader
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSubmissions(data);
      }
    } catch (err) {
      console.warn('Failed to load contact submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    loadContent();
    loadUsers();
    loadSubmissions();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  // Open Section Editor
  const openEditor = (sec) => {
    setSelectedSection(sec);
    setEditJson(JSON.stringify(sec.draft_data || sec.published_data, null, 2));
    setSaveSuccess('');
    setSaveError('');
    setActiveTab('editor');
  };

  // Save Draft Content
  const handleSaveDraft = async () => {
    setSaveSuccess('');
    setSaveError('');
    try {
      const parsedData = JSON.parse(editJson);
      const { error } = await supabase
        .from('site_content')
        .update({
          draft_data: parsedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedSection.id);

      if (error) throw error;
      setSaveSuccess('Draft saved successfully!');
      loadContent();
    } catch (err) {
      setSaveError('Invalid JSON or update error: ' + err.message);
    }
  };

  // Publish Live Content
  const handlePublish = async () => {
    setSaveSuccess('');
    setSaveError('');
    try {
      const parsedData = JSON.parse(editJson);
      const { error } = await supabase
        .from('site_content')
        .update({
          draft_data: parsedData,
          published_data: parsedData,
          status: 'published',
          published_at: new Date().toISOString(),
          version: (selectedSection.version || 1) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedSection.id);

      if (error) throw error;
      setSaveSuccess('Section published live to website successfully!');
      loadContent();
    } catch (err) {
      setSaveError('Publish error: ' + err.message);
    }
  };

  // Create User / Coach / Admin Account via Supabase Auth
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setUserActionMsg('');
    const cleanEmail = newEmail.trim();
    const cleanName = newName.trim();
    const cleanPhone = newPhone.trim();

    try {
      let createdUserId = `usr-${Date.now().toString(36)}`;
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: newPassword,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone,
              role: newRole,
            }
          }
        });
        if (!error && data?.user) {
          createdUserId = data.user.id;
        }
      } catch (authErr) {
        console.warn('Supabase Auth note (local provisioning mode):', authErr);
      }

      // Also add row to user_roles
      const newRecord = {
        id: `ur-${Date.now().toString(36)}`,
        user_id: createdUserId,
        role: newRole,
        email: cleanEmail,
        full_name: cleanName || cleanEmail.split('@')[0],
        phone: cleanPhone,
        created_at: new Date().toISOString(),
        status: 'Active',
      };

      try {
        await supabase.from('user_roles').insert([newRecord]);
      } catch (dbErr) {
        console.warn('Supabase DB insert note:', dbErr);
      }

      setUsersList((prev) => {
        const updated = [newRecord, ...prev];
        localStorage.setItem('mfc_admin_cached_users', JSON.stringify(updated));
        return updated;
      });

      setUserActionMsg(`Account created successfully for ${cleanName || cleanEmail} with role: ${newRole}`);
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewPassword('');
    } catch (err) {
      setUserActionMsg('Failed to create account: ' + err.message);
    }
  };

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        paddingBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--border)',
        marginBottom: 'var(--space-8)'
      }}>
        <div>
          <span className="section__eyebrow">Administration</span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: 'var(--space-1)' }}>
            MFC Control Center
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>
            Logged in as <strong>{user?.email}</strong> &bull; Role: <span style={{ color: 'var(--accent-dark)', fontWeight: 700 }}>{effectiveRole}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to="/" className="btn btn--outline">
            View Public Site
          </Link>
          <button onClick={handleSignOut} className="btn" style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Metrics Row tailored to Role */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Role</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-dark)', marginTop: 'var(--space-1)' }}>
            {effectiveRole?.toUpperCase()}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'var(--space-2)' }}>
            {effectiveRole === 'super_admin' ? 'Master Full Access'
              : effectiveRole === 'admin' ? 'Content & Club Operations'
              : effectiveRole === 'coach' ? 'Technical & Squads'
              : effectiveRole === 'editor' ? 'Media & News Studio'
              : effectiveRole === 'volunteer' ? 'Matchday Coordination'
              : 'Verified Academy Member'}
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            {effectiveRole === 'member' ? 'Academy Trainee ID' : 'Website Sections'}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 'var(--space-1)' }}>
            {effectiveRole === 'member' ? `MFC-${user?.id?.slice(0, 6)?.toUpperCase() || 'PLAYER'}` : (sections.length || 8)}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'var(--space-2)' }}>
            {effectiveRole === 'member' ? 'Official Club Membership' : 'Live & Draft sections'}
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            {effectiveRole === 'member' ? 'Academy Ground' : 'Registered Roles'}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)', marginTop: 'var(--space-1)' }}>
            {effectiveRole === 'member' ? 'Trichy Ground' : (usersList.length || 1)}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'var(--space-2)' }}>
            {effectiveRole === 'member' ? 'Mutharasanallur, TN' : 'Admins, Coaches & Volunteers'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs based on Role */}
      <div className="admin-tabs-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-8)' }}>
        {/* Member Hub (available to member, admin, super_admin) */}
        {(effectiveRole === 'member' || effectiveRole === 'super_admin' || effectiveRole === 'admin') && (
          <button
            className={`btn ${activeTab === 'member_hub' ? 'btn-primary' : 'btn--outline'}`}
            onClick={() => setActiveTab('member_hub')}
            style={{ fontSize: 'var(--fs-sm)', padding: '0.6rem 1.25rem' }}
          >
            🌟 Academy Member Hub
          </button>
        )}

        {/* Coach Tactical Deck (for coach, admin, super_admin) */}
        {(effectiveRole === 'coach' || effectiveRole === 'super_admin' || effectiveRole === 'admin') && (
          <button
            className={`btn ${activeTab === 'coach_deck' ? 'btn-primary' : 'btn--outline'}`}
            onClick={() => setActiveTab('coach_deck')}
            style={{ fontSize: 'var(--fs-sm)', padding: '0.6rem 1.25rem' }}
          >
            ⚽ Coach Tactical Deck
          </button>
        )}

        {/* Volunteer Hub (for volunteer, admin, super_admin) */}
        {(effectiveRole === 'volunteer' || effectiveRole === 'super_admin' || effectiveRole === 'admin') && (
          <button
            className={`btn ${activeTab === 'volunteer_hub' ? 'btn-primary' : 'btn--outline'}`}
            onClick={() => setActiveTab('volunteer_hub')}
            style={{ fontSize: 'var(--fs-sm)', padding: '0.6rem 1.25rem' }}
          >
            🤝 Volunteer & Matchday Desk
          </button>
        )}

        {/* Templates & Content (for super_admin, admin, coach, editor) */}
        {(effectiveRole === 'super_admin' || effectiveRole === 'admin' || effectiveRole === 'editor' || effectiveRole === 'coach') && (
          <button
            className={`btn ${activeTab === 'templates' ? 'btn-primary' : 'btn--outline'}`}
            onClick={() => setActiveTab('templates')}
            style={{ fontSize: 'var(--fs-sm)', padding: '0.6rem 1.25rem' }}
          >
            📄 Page Templates & Content
          </button>
        )}

        {/* Club Media & Video Showcase (for all roles) */}
        <button
          className={`btn ${activeTab === 'media' ? 'btn-primary' : 'btn--outline'}`}
          onClick={() => setActiveTab('media')}
          style={{ fontSize: 'var(--fs-sm)', padding: '0.6rem 1.25rem' }}
        >
          🎥 Club Media & Video
        </button>

        {/* Advanced Payload Editor (super_admin, admin) */}
        {(effectiveRole === 'super_admin' || effectiveRole === 'admin') && (
          <button
            className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn--outline'}`}
            onClick={() => setActiveTab('content')}
            style={{ fontSize: 'var(--fs-sm)', padding: '0.6rem 1.25rem' }}
          >
            ⚙️ Advanced Payload
          </button>
        )}

        {/* Contact Enquiries (super_admin, admin) */}
        {(effectiveRole === 'super_admin' || effectiveRole === 'admin') && (
          <button
            className={`btn ${activeTab === 'enquiries' ? 'btn-primary' : 'btn--outline'}`}
            onClick={() => setActiveTab('enquiries')}
            style={{ fontSize: 'var(--fs-sm)', padding: '0.6rem 1.25rem' }}
          >
            💬 Enquiries ({submissions.length})
          </button>
        )}

        {/* Role Management (super_admin, admin) */}
        {(effectiveRole === 'super_admin' || effectiveRole === 'admin') && (
          <button
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn--outline'}`}
            onClick={() => setActiveTab('users')}
            style={{ fontSize: 'var(--fs-sm)', padding: '0.6rem 1.25rem' }}
          >
            👑 Role Management
          </button>
        )}

        {/* Provision Staff (super_admin, admin) */}
        {(effectiveRole === 'super_admin' || effectiveRole === 'admin') && (
          <button
            className={`btn ${activeTab === 'new_user' ? 'btn-primary' : 'btn--outline'}`}
            onClick={() => setActiveTab('new_user')}
            style={{ fontSize: 'var(--fs-sm)', padding: '0.6rem 1.25rem' }}
          >
            ➕ Provision Account
          </button>
        )}
      </div>

      {/* ── Official Club YouTube Video & Shorts Showcase (Active on Media tab) ── */}
      {activeTab === 'media' && (
        <div
          className="card"
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow)',
            background: 'var(--surface)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)',
              paddingBottom: 'var(--space-4)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    background: 'var(--accent-dark)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    letterSpacing: '0.04em',
                  }}
                >
                  OFFICIAL YOUTUBE
                </span>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>
                  Mutharasanallur Football Club
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                MFC Matchday & Academy Video Showcase
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 'var(--fs-sm)', color: 'var(--muted)' }}>
                Matchday documentary video and academy training reels configured for the public site.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <a
                href="https://www.youtube.com/watch?v=AB9QMbrBq5g"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline"
                style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 0.85rem' }}
              >
                Open Feature Video ↗
              </a>
              <a
                href="https://youtube.com/shorts/Gis6rlwzR5U"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline"
                style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 0.85rem' }}
              >
                Open Shorts Reel ↗
              </a>
            </div>
          </div>

        {/* Video Grid with Professional Double-Bordered Containers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: 'var(--space-6)',
            alignItems: 'start',
          }}
        >
          {/* Main Landscape Video */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                🎥 Official Match & Training Documentary
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>16:9 Landscape</span>
            </div>

            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid var(--border)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                background: '#0A0A0A',
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/AB9QMbrBq5g?si=RCbJALNNCkxoExzq"
                title="MFC Official YouTube Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'var(--space-2)' }}>
              Featured club documentary celebrating tournament finishes, training routines, and player development in Trichy.
            </p>
          </div>

          {/* YouTube Shorts Vertical Player */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                ⚡ Academy Viral Shorts Reel
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>9:16 Vertical Reel</span>
            </div>

            <div
              style={{
                maxWidth: '280px',
                margin: '0 auto',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '3px solid #1E293B',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                background: '#0A0A0A',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '177.77%', // 9:16 aspect ratio
                }}
              >
                <iframe
                  src="https://www.youtube.com/embed/Gis6rlwzR5U"
                  title="MFC Academy YouTube Shorts"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </div>
            </div>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'var(--space-2)', textAlign: 'center' }}>
              Fast-paced skill showcase and ball mastery drill from MFC academy youth players.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* TAB 0: VISUAL TEMPLATE MANAGER */}
      {activeTab === 'templates' && (
        <TemplateManager
          sections={sections}
          onRefresh={loadContent}
          role={effectiveRole}
          initialTemplate={currentTemplateTab}
          onTemplateChange={setCurrentTemplateTab}
        />
      )}

      {/* TAB 1: WEBSITE CONTENT SECTIONS (CLICK ANY PAGE TO GO DIRECTLY TO ITS EDITOR) */}
      {activeTab === 'content' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <span className="section__eyebrow">Content Architecture</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '2px', color: 'var(--text)' }}>
                Website Pages & Content Architecture
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginTop: '2px' }}>
                Click any page below to open its live editor or preview its live route.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('templates')}
              className="btn btn-primary"
              style={{ fontSize: 'var(--fs-xs)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              🎨 Open Visual Template Manager →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { id: 'home', label: '🏠 Home Page Banners & Text', path: '/', desc: 'Hero headlines, club tagline, background visuals & registration CTAs' },
              { id: 'hero_slides', label: '⚡ Hero Action Shots', path: '/', desc: 'Right-side sliding football cutout images and action player cutouts' },
              { id: 'about', label: '📖 About Page & Story', path: '/about', desc: 'Club foundation story, historic milestones, president address & images' },
              { id: 'vision', label: '🎯 Vision & Values', path: '/vision', desc: 'Core pillars, youth community commitment, character building' },
              { id: 'coaches', label: '👔 Coaches & Technical Staff', path: '/coaches', desc: 'Coach profiles, AIFF certification licences, photos & bios' },
              { id: 'school_program', label: '🏫 School Program Partnership', path: '/school-program', desc: 'School curriculum, training image, multiple choice packages, age categories & benefits' },
              { id: 'team_achievements', label: '🏆 Team Tournament Podiums', path: '/team-achievements', desc: 'Trophies, tournament placings, cup seasons, locations' },
              { id: 'individual_achievements', label: '🌟 Selections & Scholarships', path: '/individual-achievements', desc: 'Player individual state selections, sports quota scholarships' },
              { id: 'squad', label: '⚽ Squad Players & Staff', path: '/squad', desc: 'Roster cards, player numbers, positions, junior & senior tiers' },
              { id: 'updates', label: '📰 News & Club Updates', path: '/', desc: 'Camp announcements, matchday results, press releases' },
              { id: 'contact', label: '📞 Contact & Club Details', path: '/contact', desc: 'Academy ground location, phone, email, and Instagram handle' },
            ].map((page) => {
              const sec = sections.find((s) => s.section === page.id) || {
                id: `sec-${page.id}`,
                section: page.id,
                version: 1,
                status: 'published',
                updated_at: new Date().toISOString(),
                draft_data: {},
                published_data: {},
              };

              return (
                <div
                  key={page.id}
                  className="card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-4) var(--space-6)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-3)',
                    borderLeft: `4px solid ${page.id === 'school_program' ? 'var(--accent)' : 'var(--border)'}`,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--text)' }}>{page.label}</strong>
                      <code style={{ fontSize: '0.72rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                        {page.path}
                      </code>
                    </div>
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: '4px', marginBottom: '2px' }}>
                      {page.desc}
                    </p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                      Version: v{sec.version} &bull; Status: <span style={{ fontWeight: 700, color: '#16A34A' }}>{sec.status || 'Active'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTemplateTab(page.id);
                        setActiveTab('templates');
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1rem', fontSize: 'var(--fs-xs)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      title={`Open visual editor for ${page.label}`}
                    >
                      ✏️ Edit Page Content →
                    </button>

                    <Link
                      to={page.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--outline"
                      style={{ padding: '0.45rem 0.85rem', fontSize: 'var(--fs-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      👁️ View Live ↗
                    </Link>

                    <button
                      type="button"
                      onClick={() => openEditor(sec)}
                      className="btn btn--outline"
                      style={{ padding: '0.45rem 0.75rem', fontSize: 'var(--fs-xs)', color: 'var(--muted)' }}
                      title="Edit raw JSON payload"
                    >
                      ⚙️ JSON
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CONTENT EDITOR */}
      {activeTab === 'editor' && selectedSection && (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <span className="section__eyebrow">Content Editor</span>
              <h2 style={{ fontSize: '1.5rem' }}>Editing Section: {selectedSection.section.toUpperCase()}</h2>
            </div>
            <button onClick={() => setActiveTab('content')} className="btn btn--outline">
              ← Back to Sections
            </button>
          </div>

          {saveSuccess && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--accent)', color: 'var(--accent-dark)', padding: 'var(--space-3)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-4)' }}>
              {saveSuccess}
            </div>
          )}
          {saveError && (
            <div style={{ background: '#FEE2E2', border: '1px solid #F87171', color: '#991B1B', padding: 'var(--space-3)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-4)' }}>
              {saveError}
            </div>
          )}

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              Live Payload JSON (Edit fields, text, headlines, stats):
            </label>
            <textarea
              rows={16}
              value={editJson}
              onChange={(e) => setEditJson(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-4)',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                lineHeight: 1.5,
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button onClick={handleSaveDraft} className="btn btn--outline">
              Save Draft
            </button>
            <button onClick={handlePublish} className="btn btn-primary">
              Publish Live to Website
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: USER & ROLE MANAGER */}
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <span className="section__eyebrow">Club Administration</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: 'var(--space-1)', color: 'var(--text)' }}>
                Registered Users & Role Management
              </h2>
            </div>
            {(effectiveRole === 'super_admin' || effectiveRole === 'admin') && (
              <button
                onClick={() => setActiveTab('new_user')}
                className="btn btn-primary"
                style={{ fontSize: 'var(--fs-xs)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                ➕ Provision New Account
              </button>
            )}
          </div>

          {/* User Quick Stats Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>Total Users</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{usersList.length}</div>
            </div>
            <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>Admins</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#B45309' }}>
                {usersList.filter((u) => u.role === 'admin' || u.role === 'super_admin').length}
              </div>
            </div>
            <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>Coaches</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#15803D' }}>
                {usersList.filter((u) => u.role === 'coach').length}
              </div>
            </div>
            <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>Media & Staff</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4338CA' }}>
                {usersList.filter((u) => u.role === 'editor' || u.role === 'volunteer').length}
              </div>
            </div>
            <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>Members / Trainees</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>
                {usersList.filter((u) => u.role === 'member').length}
              </div>
            </div>
          </div>

          {/* Search & Role Filter Bar */}
          <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="🔍 Search user by name, email, phone, or role..."
                  style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 'var(--fs-sm)' }}
                />
              </div>
              {userSearchQuery && (
                <button
                  type="button"
                  onClick={() => setUserSearchQuery('')}
                  className="btn btn--outline"
                  style={{ padding: '0.45rem 0.75rem', fontSize: 'var(--fs-xs)' }}
                >
                  Clear Search
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600, marginRight: '4px' }}>Filter:</span>
              {[
                { id: 'all', label: 'All Users' },
                { id: 'super_admin', label: '👑 Super Admins' },
                { id: 'admin', label: '🛡️ Admins' },
                { id: 'coach', label: '⚽ Coaches' },
                { id: 'editor', label: '✍️ Editors' },
                { id: 'volunteer', label: '🤝 Volunteers' },
                { id: 'member', label: '🌟 Members' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setUserRoleFilter(pill.id)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid var(--border)',
                    background: userRoleFilter === pill.id ? 'var(--accent)' : 'var(--surface-2)',
                    color: userRoleFilter === pill.id ? '#FFFFFF' : 'var(--text)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {usersList
              .filter((u) => {
                const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                const query = userSearchQuery.toLowerCase().trim();
                if (!query) return matchesRole;
                const nameMatch = (u.full_name || '').toLowerCase().includes(query);
                const emailMatch = (u.email || '').toLowerCase().includes(query);
                const phoneMatch = (u.phone || '').toLowerCase().includes(query);
                const roleMatch = (u.role || '').toLowerCase().includes(query);
                return matchesRole && (nameMatch || emailMatch || phoneMatch || roleMatch);
              })
              .map((u) => (
                <div
                  key={u.id || u.user_id}
                  className="card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-4) var(--space-6)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-3)',
                    borderLeft: `4px solid ${
                      u.role === 'super_admin' ? '#D97706' :
                      u.role === 'admin' ? 'var(--accent)' :
                      u.role === 'coach' ? '#16A34A' :
                      u.role === 'editor' ? '#4F46E5' : '#64748B'
                    }`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>
                        {u.full_name || u.email?.split('@')[0] || 'Club Account'}
                      </strong>
                      <span style={{
                        padding: '1px 8px',
                        borderRadius: '999px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: 'rgba(34, 197, 94, 0.12)',
                        color: '#16A34A',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}>
                        Active
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: '4px', flexWrap: 'wrap', fontSize: 'var(--fs-xs)' }}>
                      {u.email && (
                        <a href={`mailto:${u.email}`} style={{ color: 'var(--accent-dark)', fontWeight: 500 }}>
                          ✉️ {u.email}
                        </a>
                      )}
                      {u.phone && (
                        <a href={`tel:${u.phone}`} style={{ color: 'var(--text)', fontWeight: 500 }}>
                          📞 {u.phone}
                        </a>
                      )}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px' }}>
                      UID: <code>{u.user_id || u.id}</code> &bull; Registered: {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active Member'}
                    </div>
                  </div>

                  {/* Role Selector & Actions (Admins & Super Admins) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    {(effectiveRole === 'super_admin' || effectiveRole === 'admin') ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', fontWeight: 600 }}>Role:</label>
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--fs-xs)',
                            fontWeight: 600,
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="super_admin">👑 super_admin (Master Owner)</option>
                          <option value="admin">🛡️ admin (Club Operations)</option>
                          <option value="coach">⚽ coach (Tactical & Squads)</option>
                          <option value="editor">✍️ editor (Media & News)</option>
                          <option value="volunteer">🤝 volunteer (Matchday)</option>
                          <option value="member">🌟 member (Public Trainee)</option>
                        </select>
                      </div>
                    ) : (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--fs-xs)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: u.role === 'super_admin' ? '#FEF3C7' : 'var(--surface-2)',
                        color: u.role === 'super_admin' ? '#92400E' : 'var(--text)',
                        border: '1px solid var(--border)'
                      }}>
                        {u.role}
                      </span>
                    )}

                    {(effectiveRole === 'super_admin' || effectiveRole === 'admin') && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id)}
                        title="Revoke / remove user account"
                        style={{
                          padding: '0.35rem 0.65rem',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          border: '1px solid #FCA5A5',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: CREATE PLAYER / COACH / ADMIN ACCOUNT */}
      {activeTab === 'new_user' && (
        <div className="card" style={{ padding: 'var(--space-8)', maxWidth: '640px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <span className="section__eyebrow">Account Provisioning</span>
              <h2 style={{ fontSize: '1.5rem', marginTop: '2px' }}>Create Staff or Player Account</h2>
            </div>
            <button
              onClick={() => setActiveTab('users')}
              className="btn btn--outline"
              style={{ fontSize: 'var(--fs-xs)', padding: '0.4rem 0.8rem' }}
            >
              ← Back to Users
            </button>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-6)' }}>
            Provision official club accounts for coaches, players, matchday volunteers, or administrative staff.
          </p>

          {userActionMsg && (
            <div style={{
              background: userActionMsg.includes('Failed') ? '#FEE2E2' : 'var(--surface)',
              border: `1px solid ${userActionMsg.includes('Failed') ? '#F87171' : 'var(--accent)'}`,
              color: userActionMsg.includes('Failed') ? '#991B1B' : 'var(--accent-dark)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius)',
              marginBottom: 'var(--space-6)',
              fontWeight: 600,
            }}>
              {userActionMsg}
            </div>
          )}

          <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Saravanan V"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98424 00000"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="coach.name@mfcfootballclub.com"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Temporary Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                Assigned Role & Permissions
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="super_admin">👑 Super Admin (Full system control & role manager)</option>
                <option value="admin">🛡️ Admin (Manage site content, media & database)</option>
                <option value="coach">⚽ Coach (Manage match reports & players)</option>
                <option value="editor">✍️ Media Editor (Draft & write articles)</option>
                <option value="volunteer">🤝 Volunteer (Matchday operations)</option>
                <option value="member">🌟 General Member / Academy Trainee</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-2)' }}>
              Provision Account
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: PUBLIC CONTACT SUBMISSIONS & MESSAGES */}
      {activeTab === 'enquiries' && (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <span className="section__eyebrow">Contact Desk</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: 'var(--space-1)' }}>
                Website Enquiries & Form Messages
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>
                Messages submitted via the public Contact page (automatically emailed to <code>mfcfootballclubtrichy@gmail.com</code> and stored in database).
              </p>
            </div>
            <button
              onClick={loadSubmissions}
              disabled={loadingSubmissions}
              className="btn btn--outline"
              style={{ fontSize: 'var(--fs-xs)' }}
            >
              {loadingSubmissions ? 'Refreshing...' : '🔄 Refresh Messages'}
            </button>
          </div>

          {submissions.length === 0 ? (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-base)', marginBottom: 'var(--space-2)' }}>
                No messages submitted yet.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-xs)' }}>
                When users fill out the contact form on <code>/contact</code>, their messages will appear here and are dispatched to your email.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {submissions.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: 'var(--space-5)',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>{msg.name}</strong>
                      <span style={{ marginInline: 'var(--space-2)', color: 'var(--muted)' }}>&bull;</span>
                      <a href={`mailto:${msg.email}`} style={{ color: 'var(--accent-dark)', fontWeight: 600 }}>
                        {msg.email}
                      </a>
                    </div>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)' }}>
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div style={{
                    background: 'var(--bg)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: 'var(--fs-sm)',
                    lineHeight: 1.6,
                    color: 'var(--text)',
                    whiteSpace: 'pre-wrap',
                    marginTop: 'var(--space-2)',
                  }}>
                    {msg.message}
                  </div>

                  <div style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}>
                    <a
                      href={`mailto:${msg.email}?subject=MFC Club Response to your enquiry&body=Hi ${msg.name},%0D%0A%0D%0AThank you for reaching out to Mutharasanallur Football Club.`}
                      className="btn btn--outline"
                      style={{ fontSize: 'var(--fs-xs)', padding: '0.35rem 0.8rem' }}
                    >
                      ✉️ Reply via Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: ACADEMY MEMBER HUB */}
      {activeTab === 'member_hub' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Digital Player Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: 'var(--space-8)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <img
                  src="/mfc-logo.png"
                  alt="MFC Crest"
                  style={{ width: '72px', height: '72px', objectFit: 'contain', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', padding: '6px' }}
                />
                <div>
                  <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85, fontWeight: 700 }}>
                    Mutharasanallur Football Club
                  </span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'MFC Academy Trainee'}
                  </h2>
                  <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: 'var(--fs-sm)' }}>
                    Membership ID: <strong style={{ letterSpacing: '1px', color: '#FFFFFF' }}>MFC-{user?.id?.slice(0, 8)?.toUpperCase()}</strong>
                  </p>
                </div>
              </div>

              <span style={{
                background: 'var(--accent)',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: 'var(--fs-xs)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                alignSelf: 'flex-start',
              }}>
                ACTIVE MEMBER
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Registered Email</span>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{user?.email}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Mobile Phone</span>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{user?.user_metadata?.phone || '+91 8072694818'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Primary Academy Ground</span>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Mutharasanallur Ground, Trichy</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Training Category</span>
                <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: '#FFFFFF' }}>Grassroots & Youth Development</div>
              </div>
            </div>
          </div>

          {/* Quick Support & Training Schedule */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚽</span> Academy Training Schedule
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ padding: '10px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <strong>Under-10 / Grassroots:</strong> Mon to Fri &bull; 6:00 AM – 7:30 AM
                </li>
                <li style={{ padding: '10px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <strong>Under-14 / Under-17 Youth:</strong> Mon to Sat &bull; 4:30 PM – 6:30 PM
                </li>
                <li style={{ padding: '10px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <strong>Weekend Tactical & Match Play:</strong> Sunday &bull; 7:00 AM – 10:00 AM
                </li>
              </ul>
            </div>

            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🤖</span> Club Support & AI Assistant
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-4)' }}>
                Have questions about enrollments, coaching fees, tournament dates, or ground directions? Use our 24/7 Botpress AI Assistant or contact our staff directly.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <a
                  href="https://wa.me/918072694818?text=Hi%20MFC%20Academy%20Team%2C%20I%20am%20a%20registered%20member."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ justifyContent: 'center' }}
                >
                  💬 Chat on WhatsApp (+91 8072694818)
                </a>
                <Link to="/contact" className="btn btn--outline" style={{ justifyContent: 'center' }}>
                  ✉️ Submit Official Academy Query
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: COACH TACTICAL DECK */}
      {activeTab === 'coach_deck' && (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <span className="section__eyebrow">Technical Team</span>
          <h2 style={{ fontSize: '1.6rem', marginTop: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
            ⚽ Coach Tactical & Squad Operations
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-6)' }}>
            Coaching portal for age-group training logs, player rosters, and match day lineup strategies.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
            <div style={{ padding: 'var(--space-5)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.1rem' }}>🏆 Squad Roster Management</h4>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginBottom: 'var(--space-4)' }}>
                View and update players, jersey numbers, and age-group rosters across U10, U14, U17, and Senior.
              </p>
              <button onClick={() => setActiveTab('templates')} className="btn btn-primary" style={{ fontSize: 'var(--fs-xs)' }}>
                Open Squad Template Editor ↗
              </button>
            </div>

            <div style={{ padding: 'var(--space-5)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.1rem' }}>🎥 Video Review & Analysis</h4>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginBottom: 'var(--space-4)' }}>
                Review matchday footage and training drill recordings to evaluate player technique.
              </p>
              <button onClick={() => setActiveTab('media')} className="btn btn--outline" style={{ fontSize: 'var(--fs-xs)' }}>
                Open Club Media Deck ↗
              </button>
            </div>

            <div style={{ padding: 'var(--space-5)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.1rem' }}>📞 Head Coach Direct Line</h4>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginBottom: 'var(--space-4)' }}>
                Direct coordinator hotline for match logistics, emergency injuries, and tournament passes.
              </p>
              <a href="tel:8072694818" className="btn btn--outline" style={{ fontSize: 'var(--fs-xs)' }}>
                Call +91 8072694818
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: VOLUNTEER & MATCHDAY DESK */}
      {activeTab === 'volunteer_hub' && (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <span className="section__eyebrow">Matchday Operations</span>
          <h2 style={{ fontSize: '1.6rem', marginTop: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
            🤝 Volunteer & Community Operations Hub
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-6)' }}>
            Thank you for supporting Mutharasanallur Football Club! Here are your matchday instructions and coordination tools.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            <div style={{ padding: 'var(--space-5)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 var(--space-2) 0' }}>📋 Matchday Checklist</h4>
              <ul style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                <li>Pitch boundary lines & corner flag inspection</li>
                <li>Water distribution station & medical first aid kit setup</li>
                <li>Spectator guidance & tournament entry pass checks</li>
                <li>Match ball pressure verification & warm-up area safety</li>
              </ul>
            </div>

            <div style={{ padding: 'var(--space-5)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 var(--space-2) 0' }}>📸 Community Media Submissions</h4>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginBottom: 'var(--space-4)' }}>
                Captured great photos or videos of the match? Send them directly to our media team for publication on the official MFC website.
              </p>
              <a href="mailto:mfcfootballclubtrichy@gmail.com?subject=Matchday%20Photos%20Submission" className="btn btn-primary" style={{ fontSize: 'var(--fs-xs)' }}>
                Email Photos to Media Desk ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
