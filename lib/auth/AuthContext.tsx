"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  grade?: number;
  school?: string;
  city?: string;
  avatar_url?: string;
  created_at?: string;
  last_login_at?: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string) => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    try {
      const { data, error } = await sb.from("profiles").select("*").eq("id", uid).maybeSingle();
      if (!error && data) setProfile(data as Profile);
    } catch {}
  }, []);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      setLoading(false);
      return;
    }

    // Get initial session
    sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const sb = getSupabaseBrowser();
    if (!sb) return { error: "Supabase is not configured. On Vercel: Settings → Environment Variables → add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. Locally: check your .env.local file." };
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Server-side signup uses the service role to bypass email confirmation.
    // This avoids the "email rate limit exceeded" error on Supabase's free tier.
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: fullName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        return { error: data.error || `Signup failed (${res.status})` };
      }
      // Force the client to pick up the new session from cookies.
      const sb = getSupabaseBrowser();
      if (sb) {
        await sb.auth.getSession();
        if (!data.session) {
          // Server couldn't set cookies for some reason - sign in client-side.
          const { error: signInErr } = await sb.auth.signInWithPassword({ email, password });
          if (signInErr) return { error: signInErr.message };
        }
      }
      return { error: null };
    } catch (e: any) {
      // Network failure - try direct client signUp as a fallback.
      const sb = getSupabaseBrowser();
      if (!sb) return { error: "Network error and Supabase not configured" };
      const { error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName || email.split("@")[0] } },
      });
      if (error) return { error: error.message };
      return { error: null };
    }
  };

  const signOut = async () => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    await sb.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    const sb = getSupabaseBrowser();
    if (!sb) return { error: "Supabase is not configured. On Vercel: Settings → Environment Variables → add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. Locally: check your .env.local file." };
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const sb = getSupabaseBrowser();
    if (!sb || !user) return { error: "Not signed in" };
    const { error } = await sb.from("profiles").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", user.id);
    if (error) return { error: error.message };
    await refreshProfile();
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut, resetPassword, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
