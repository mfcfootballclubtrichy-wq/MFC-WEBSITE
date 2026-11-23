/**
 * supabase.js — Supabase client for client-side authentication and session management.
 * Strictly uses publishable/anon keys (service role key is NEVER used on frontend).
 */
import { createClient } from '@supabase/supabase-js';

// Values come from environment variables (Netlify env vars in production, .env locally).
// Never hardcode them here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set. See .env.example.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'missing-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
