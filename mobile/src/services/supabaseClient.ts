import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare const process: { env: Record<string, string | undefined> };

// Configuration placeholders or injected via environment variables
export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://example-placeholder-smart-av.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'example-anon-key-placeholder';

const isSupabaseConfigured =
  SUPABASE_URL !== 'https://example-placeholder-smart-av.supabase.co' &&
  SUPABASE_ANON_KEY !== 'example-anon-key-placeholder';

let supabaseInstance: SupabaseClient | null = null;

try {
  supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
} catch (e) {
  // If creation fails due to placeholder URI format, keep null
  supabaseInstance = null;
}

export const supabase = supabaseInstance;
export const isLiveBackendAvailable = isSupabaseConfigured && supabaseInstance !== null;
