/**
 * AuthContext.jsx — Provides user session, roles, and sign in/out across the app.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext({
  user: null,
  role: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch role from user_roles table for current authenticated user
  const fetchUserRole = async (userId, userEmail) => {
    try {
      if (userEmail === 'mfcfootballclubtrichy@gmail.com') return 'super_admin';

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.warn('Notice from user_roles query:', error.message);
        return 'member';
      }

      if (data && data.length > 0) {
        const roles = data.map((r) => r.role?.toLowerCase());
        if (roles.includes('super_admin')) return 'super_admin';
        if (roles.includes('admin')) return 'admin';
        if (roles.includes('coach')) return 'coach';
        if (roles.includes('editor') || roles.includes('content_editor')) return 'editor';
        if (roles.includes('volunteer')) return 'volunteer';
        if (roles.includes('member')) return 'member';
        return roles[0];
      }

      return 'member';
    } catch (err) {
      console.warn('Failed to get user role:', err);
      return 'member';
    }
  };

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id, session.user.email);
        setRole(userRole);
      }
      setLoading(false);
    });

    // 2. Listen to Auth State changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id, session.user.email);
        setRole(userRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const cleanEmail = email.trim();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    if (error) throw error;
    if (data?.user) {
      setUser(data.user);
      setSession(data.session);
      const userRole = await fetchUserRole(data.user.id, data.user.email);
      setRole(userRole || 'member');
    }
    return data;
  };

  const signUp = async ({ name, phone, email, password }) => {
    const cleanEmail = email.trim();
    // Public registrations are strictly assigned 'member' role — staff roles must be provisioned
    const safeRole = 'member';
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: name.trim(),
          phone: phone.trim(),
          role: safeRole,
        },
      },
    });
    if (error) throw error;
    if (data?.user) {
      setUser(data.user);
      setSession(data.session);

      try {
        await supabase.from('user_roles').insert([
          {
            user_id: data.user.id,
            role: 'member',
            full_name: name.trim(),
            phone: phone.trim(),
            email: cleanEmail,
          },
        ]);
        setRole('member');
      } catch (roleErr) {
        console.warn('Initial role record note:', roleErr);
        setRole('member');
      }
    }
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error);
    setUser(null);
    setRole(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
