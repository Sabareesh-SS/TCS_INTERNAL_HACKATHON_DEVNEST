import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare const process: { env: Record<string, string | undefined> };

// Supabase Cloud Configuration (configured for campus AV platform)
export const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://xhygvotlbrmsjlqinehr.supabase.co';
export const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoeWd2b3RsYnJtc2pscWluZWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNjAxMDksImV4cCI6MjEwODgzNjEwOX0.2t-x5DJo77Ho7KSmAK9ezRVga_rqcJSgpeI3o_XOxbY';

const isSupabaseConfigured =
  Boolean(SUPABASE_URL) &&
  Boolean(SUPABASE_ANON_KEY) &&
  !SUPABASE_URL.includes('example-placeholder');

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
