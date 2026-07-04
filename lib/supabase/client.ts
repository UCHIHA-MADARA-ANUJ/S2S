"use client";
import { createBrowserClient } from "@supabase/ssr";

let _client: ReturnType<typeof createBrowserClient> | null = null;

// FALLBACK: hard-coded values so the app works even if env vars are missing on Vercel.
// These are the public Supabase project values - safe to embed in client-side code.
const FALLBACK_URL = "https://suxnpzpxlkhvpijpgdkh.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eG5wenB4bGtodnBpanBnZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNDUzNDgsImV4cCI6MjA5ODYyMTM0OH0.H57JlAhpUWzTaCw5XU0Zdr2Hcye7VAbkdS6_ukE9RVo";

export function getSupabaseBrowser() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;
  if (!url || !key) return null;
  _client = createBrowserClient(url, key);
  return _client;
}

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL);
}
