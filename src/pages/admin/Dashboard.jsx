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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'content' | 'users' | 'new_user' | 'editor'
  const [selectedSection, setSelectedSection] = useState(null);
  const [editJson, setEditJson] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const effectiveRole = role || user?.user_metadata?.role || (user?.email === 'mfcfootballclubtrichy@gmail.com' ? 'super_admin' : 'member');

  // User Management State
  const [usersList, setUsersList] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('coach');
  const [userActionMsg, setUserActionMsg] = useState('');

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
      setLoading(false);
    }
  };

  // Load Users List
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, user_id, role, coach_id, created_at')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUsersList(data);
      }
    } catch (err) {
      console.error('Failed to load user roles:', err);
    }
  };

  useEffect(() => {
    loadContent();
    loadUsers();
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
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newEmail.trim(),
        password: newPassword,
        options: {
          data: { role: newRole }
        }
      });
      if (error) throw error;

      if (data?.user) {
        // Also add row to user_roles
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: newRole,
        });
        setUserActionMsg(`Account created successfully for ${newEmail} with role: ${newRole}`);
        setNewEmail('');
        setNewPassword('');
        loadUsers();
      }
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

      {/* Metrics Row */}
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
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'var(--space-2)' }}>Full Master Access</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Website Sections</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 'var(--space-1)' }}>
            {sections.length || 8}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'var(--space-2)' }}>Live & Draft content</div>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>Registered Roles</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)', marginTop: 'var(--space-1)' }}>
            {usersList.length || 1}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'var(--space-2)' }}>Admins & Coaches</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-3)',
        borderBottom: '2px solid var(--border)',
        marginBottom: 'var(--space-8)',
        paddingBottom: 'var(--space-2)'
      }}>
        <button
          className={`btn ${activeTab === 'templates' ? 'btn-primary' : 'btn--outline'}`}
          onClick={() => setActiveTab('templates')}
        >
          🎨 Page Templates & Updates
        </button>
        <button
          className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn--outline'}`}
          onClick={() => setActiveTab('content')}
        >
          📝 Advanced JSON Editor
        </button>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn--outline'}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User & Role Manager
        </button>
        <button
          className={`btn ${activeTab === 'new_user' ? 'btn-primary' : 'btn--outline'}`}
          onClick={() => setActiveTab('new_user')}
        >
          ➕ Create Staff/Coach Account
        </button>
      </div>

      {/* TAB 0: VISUAL TEMPLATE MANAGER */}
      {activeTab === 'templates' && (
        <TemplateManager
          sections={sections}
          onRefresh={loadContent}
          role={effectiveRole}
        />
      )}

      {/* TAB 1: WEBSITE CONTENT SECTIONS */}
      {activeTab === 'content' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>Website Content Sections</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {sections.map((sec) => (
              <div
                key={sec.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-4) var(--space-6)',
                  flexWrap: 'wrap',
                  gap: 'var(--space-3)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.15rem' }}>{sec.section.toUpperCase()}</strong>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'var(--space-1)' }}>
                    Version: v{sec.version} &bull; Status: <span style={{ fontWeight: 700, color: 'var(--accent-dark)' }}>{sec.status}</span> &bull; Updated: {new Date(sec.updated_at).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button
                    onClick={() => openEditor(sec)}
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 1rem', fontSize: 'var(--fs-xs)' }}
                  >
                    Edit Content
                  </button>
                </div>
              </div>
            ))}
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
            <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', padding: 'var(--space-3)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-4)' }}>
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
              💾 Save Draft
            </button>
            <button onClick={handlePublish} className="btn btn-primary">
              🚀 Publish Live to Website
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: USER & ROLE MANAGER */}
      {activeTab === 'users' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>Registered Roles & Permissions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {usersList.map((u) => (
              <div
                key={u.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-4) var(--space-6)',
                  flexWrap: 'wrap',
                  gap: 'var(--space-2)'
                }}
              >
                <div>
                  <strong>User ID:</strong> <code style={{ fontSize: 'var(--fs-xs)' }}>{u.user_id}</code>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted)', marginTop: 'var(--space-1)' }}>
                    Registered: {new Date(u.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CREATE PLAYER / COACH / ADMIN ACCOUNT */}
      {activeTab === 'new_user' && (
        <div className="card" style={{ padding: 'var(--space-8)', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>Create Staff or Player Account</h2>
          <p style={{ color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-6)' }}>
            As a Super Admin, you can provision accounts with specific role permissions.
          </p>

          {userActionMsg && (
            <div style={{
              background: userActionMsg.includes('Failed') ? '#FEE2E2' : '#DCFCE7',
              border: `1px solid ${userActionMsg.includes('Failed') ? '#F87171' : '#86EFAC'}`,
              color: userActionMsg.includes('Failed') ? '#991B1B' : '#166534',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius)',
              marginBottom: 'var(--space-6)',
            }}>
              {userActionMsg}
            </div>
          )}

          <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="coach.name@mfcfootball.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
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
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                Account Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="coach">Coach (Manage match reports & players)</option>
                <option value="content_editor">Content Editor (Draft & write articles)</option>
                <option value="volunteer">Volunteer (View schedules)</option>
                <option value="super_admin">Super Admin (Full system control)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-3)' }}>
              Create Account
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
