"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, Check, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { toast } from "sonner";
import { DotField } from "@/components/effects/DotField";

export default function SignUpPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/survey";
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password strength checks
  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Contains a letter", ok: /[a-zA-Z]/.test(password) }
  ];
  const strengthScore = checks.filter(c => c.ok).length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Fill in all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("Account created! Taking you to the survey...");
    setTimeout(() => router.push(next), 800);
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
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-display font-black text-white group-hover:rotate-12 transition-transform">SV</div>
              <span className="font-display font-bold text-xl">SkillVerse</span>
            </Link>
            <h1 className="font-display font-black text-3xl mb-2">Create account</h1>
            <p className="text-text-secondary text-sm">Join 250+ students shaping screen time research</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="label block mb-1.5">Full name <span className="text-text-muted normal-case">(optional)</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input
                  id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name" autoComplete="name"
                  className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

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

            <div>
              <label htmlFor="password" className="label block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
                <input
                  id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters" autoComplete="new-password" required minLength={6}
                  className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strengthScore ? (strengthScore === 3 ? "bg-success" : strengthScore === 2 ? "bg-warning" : "bg-error") : "bg-white/10"}`} />
                    ))}
                  </div>
                  <ul className="text-[10px] space-y-0.5">
                    {checks.map((c, i) => (
                      <li key={i} className={`flex items-center gap-1 ${c.ok ? "text-success" : "text-text-muted"}`}>
                        {c.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {c.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Create account & take survey
            </button>

            <p className="text-[10px] text-text-muted text-center pt-1">
              By signing up, your survey responses will be saved to your account. You can delete everything anytime.
            </p>
          </form>

          <div className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{" "}
            <Link href={`/signin${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-4">
          <Link href="/" className="hover:text-white">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
