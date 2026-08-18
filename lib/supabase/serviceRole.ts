import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * SERVER-ONLY. Uses SUPABASE_SERVICE_ROLE_KEY, which bypasses Row Level
 * Security entirely. Never import this file from a "use client" component
 * or expose its output to the browser.
 *
 * Why this exists: the dashboard at /dashboard/[slug] has no real user
 * login wired up yet (Phase 7's auth screens are a visual reference only,
 * not connected). Until real Supabase Auth sessions are wired into the
 * dashboard, the owner-only RLS policies (`auth.uid() = user_id`) have no
 * logged-in user to match, so every write from the dashboard would be
 * silently rejected. This client is the deliberate, temporary bypass for
 * that gap — swap dashboard actions back to the regular server client
 * once login is implemented, so RLS can do its job again.
 */
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
