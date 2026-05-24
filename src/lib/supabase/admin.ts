import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Admin Client (Service Role)
 * 
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS.
 * ONLY use in server-side code (API routes, cron jobs).
 * NEVER import this in client components.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. ' +
      'Ensure these env vars are set for server-side operations.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
