"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { toast } from "sonner";
import { DotField } from "@/components/effects/DotField";
import { SkillVerseLogo } from "@/components/ui/SkillVerseLogo";

export default function SignInPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetMode) {
      if (!email) { toast.error("Enter your email"); return; }
      setLoading(true);
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) { toast.error(error); return; }
      setResetSent(true);
      toast.success("Reset link sent to your email");
      return;
    }
    if (!email || !password) { toast.error("Fill in all fields"); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("Welcome back!");
    router.push(next);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DotField dotSpacing={22} cursorRadius={200} sparkle bulgeStrength={20} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong p-8 rounded-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6 focus:outline-none">
              <SkillVerseLogo size="lg" />
            </Link>
            <h1 className="font-display font-black text-3xl mb-2">
              {resetMode ? "Reset password" : "Welcome back"}
            </h1>
            <p className="text-text-secondary text-sm">
              {resetMode ? "We'll email you a reset link" : "Sign in to access your dashboard"}
            </p>
          </div>

          {resetSent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-success" />
              </div>
              <p className="text-sm text-text-secondary mb-6">Check your email for a reset link.</p>
              <button onClick={() => { setResetMode(false); setResetSent(false); }} className="text-primary text-sm hover:underline">
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="email" className="label block mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                  <input
                    id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" autoComplete="email" required
                    className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {!resetMode && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="label">Password</label>
                    <button type="button" onClick={() => setResetMode(true)} className="text-xs text-primary hover:underline">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                    <input
                      id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" autoComplete="current-password" required minLength={6}
                      className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {resetMode ? "Send reset link" : "Sign in"}
              </button>

              <div className="text-center text-sm text-text-secondary pt-2">
                {resetMode ? (
                  <button type="button" onClick={() => setResetMode(false)} className="hover:text-white">
                    ← Back to sign in
                  </button>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-primary hover:underline font-semibold">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </form>
          )}

          <p className="text-[10px] text-text-muted text-center mt-6">
            By continuing, you agree to our terms. Your data is anonymous and encrypted.
          </p>
        </div>

        <p className="text-center text-xs text-text-muted mt-4">
          <Link href="/" className="hover:text-white">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
