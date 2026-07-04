import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const FALLBACK_URL = "https://suxnpzpxlkhvpijpgdkh.supabase.co";
const FALLBACK_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eG5wenB4bGtodnBpanBnZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNDUzNDgsImV4cCI6MjA5ODYyMTM0OH0.H57JlAhpUWzTaCw5XU0Zdr2Hcye7VAbkdS6_ukE9RVo";
const FALLBACK_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eG5wenB4bGtodnBpanBnZGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA0NTM0OCwiZXhwIjoyMDk4NjIxMzQ4fQ.4qdY7N3syGiNB6c9XgBU2zZ7kkxJDJDy0cCRCguJWhU";

/**
 * Server-side Supabase client (Next.js 14 with @supabase/ssr).
 * Uses hard-coded fallbacks so the app works even if env vars are missing.
 */
export function createSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: any) {
        try {
          cookiesToSet.forEach(({ name, value, options }: any) => cookieStore.set(name, value, options));
        } catch {
          // Server component - can't set cookies here
        }
      }
    }
  });
}

/**
 * Get the current logged-in user (server side).
 */
export async function getCurrentUser() {
  const supabase = createSupabaseServer();
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/**
 * Service-role client for admin operations (bypasses RLS).
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_SERVICE_KEY;
  if (!url || !serviceKey) return null;
  // Use direct import to avoid cookie machinery
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
