import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const normalizeSupabaseUrl = (url: string) => {
  if (!url) return '';
  try {
    const parsed = new URL(url.trim());
    // Supabase JS expects project root origin, not /auth/v1 or other subpaths.
    return parsed.origin;
  } catch {
    return '';
  }
};

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
  if (rawSupabaseUrl && !supabaseUrl) {
    console.error('⚠️ Invalid VITE_SUPABASE_URL format. Expected full URL like https://your-project.supabase.co');
  }
  console.error('Restart dev server after adding .env file');
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}) : null as any;
