"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import { useIntroState } from "@/lib/intro-context";
import { ArrowRight, Sparkles, X, SkipForward, Loader2, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

const SESSION_KEY = "sv:intro:completed";
const REPLAY_PARAM = "intro";

type Stage = "gate" | "play" | "auth" | "done";

export function CinematicIntro() {
  const [stage, setStage] = useState<Stage>("done");
  const [act, setAct] = useState(0);
  const [mode, setMode] = useState<"choice" | "signin" | "signup" | null>(null);
  const [skipped, setSkipped] = useState(false);
  const router = useRouter();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const { setState: setIntroState } = useIntroState();
  const hasCheckedRef = useRef(false);

  // Broadcast intro state to the layout so Navbar/Footer can hide.
  useEffect(() => {
    if (stage === "done") {
      setIntroState("hidden");
    } else {
      setIntroState("showing");
    }
  }, [stage, setIntroState]);

  // Initial check using useLayoutEffect to avoid navbar flash.
  useLayoutEffect(() => {
    if (typeof window === "undefined" || hasCheckedRef.current) return;
    hasCheckedRef.current = true;
    const url = new URL(window.location.href);
    const force = url.searchParams.get(REPLAY_PARAM) === "1";
    const reset = url.searchParams.get("reset-intro") === "1";
    if (reset) {
      try { localStorage.removeItem(SESSION_KEY); } catch {}
      try { window.history.replaceState({}, "", url.pathname); } catch {}
    }
    const done = (() => { try { return localStorage.getItem(SESSION_KEY); } catch { return null; } })();
    if (done && !force) {
      setStage("done");
    } else {
      setStage("gate");
    }
  }, []);

  // Play sequence of acts
  useEffect(() => {
    if (stage !== "play") return;
    const ACTS = [1800, 1800, 2400, 2000, 1800];
    if (act >= ACTS.length) {
      setStage("auth");
      return;
    }
    const t = setTimeout(() => setAct((a) => a + 1), ACTS[act]);
    return () => clearTimeout(t);
  }, [act, stage]);

  // If user is signed in at any point, dismiss the intro
  useEffect(() => {
    if (authLoading) return;
    if (user && stage !== "done") {
      if (stage !== "auth") {
        try { localStorage.setItem(SESSION_KEY, "1"); } catch {}
        setStage("done");
      } else {
        finishIntro("/dashboard");
      }
    }
  }, [user, authLoading, stage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard: Space/Enter starts the gate
  useEffect(() => {
    if (stage !== "gate") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        startSequence();
      } else if (e.code === "Escape") {
        finishIntro();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const startSequence = () => {
    setStage("play");
    setAct(0);
  };

  const skipToAuth = () => {
    setSkipped(true);
    setStage("auth");
  };

  const finishIntro = (nextRoute?: string) => {
    try { localStorage.setItem(SESSION_KEY, "1"); } catch {}
    setStage("done");
    if (nextRoute) router.push(nextRoute);
  };

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) { toast.error(error); return false; }
    toast.success("Welcome back!");
    finishIntro("/dashboard");
    return true;
  };

  const handleSignUp = async (email: string, password: string, name?: string) => {
    const { error } = await signUp(email, password, name);
    if (error) { toast.error(error); return false; }
    toast.success("Account created! Taking you to the survey...");
    finishIntro("/survey");
    return true;
  };

  if (stage === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[500] bg-black text-white flex items-center justify-center overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="SkillVerse intro"
      >
        <BackgroundFX stage={stage} act={act} />

        {/* Top status bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-30 flex items-center justify-between gap-4 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>SKILLVERSE.SYS</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            {stage === "play" && !skipped && (
              <button
                onClick={skipToAuth}
                className="flex items-center gap-1.5 text-text-muted hover:text-white text-[10px] font-mono tracking-widest px-3 py-1.5 rounded-full glass"
                aria-label="Skip intro"
              >
                SKIP <SkipForward className="w-3 h-3" />
              </button>
            )}
            {stage === "auth" && (
              <button
                onClick={() => finishIntro()}
                className="flex items-center gap-1.5 text-text-muted hover:text-white text-[10px] font-mono tracking-widest px-3 py-1.5 rounded-full glass"
                aria-label="Enter without account"
              >
                CONTINUE <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Center stage */}
        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {stage === "gate" && (
              <GateScreen
                key="gate"
                ready={!authLoading}
                onStart={startSequence}
                signedIn={!!user}
              />
            )}
            {stage === "play" && <PlayAct key={`act-${act}`} act={act} />}
            {stage === "auth" && (
              <AuthStage
                key="auth"
                user={user}
                mode={mode}
                setMode={setMode}
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
                onContinue={() => finishIntro(user ? "/dashboard" : "/")}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Bottom credits */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-30 pointer-events-none">
          <div className="flex items-center justify-between gap-4 text-[10px] font-mono tracking-[0.2em] text-white/40">
            <span>v9.9.1 · SCREEN2SKILL 2026</span>
            <span>{stage === "play" ? `ACT ${act + 1}/5` : stage.toUpperCase()}</span>
            <span>CCA · GURUGRAM</span>
          </div>
          {stage === "play" && (
            <div className="mt-3 h-px bg-white/10 overflow-hidden rounded">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((act + 1) / 5) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function BackgroundFX({ stage, act }: { stage: Stage; act: number }) {
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0A0505] to-black" />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,61,46,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,61,46,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{
          background:
            act === 0
              ? "radial-gradient(circle at 50% 50%, rgba(255,61,46,0.18), transparent 60%)"
              : act === 1
              ? "radial-gradient(circle at 50% 50%, rgba(255,168,0,0.22), transparent 60%)"
              : act === 2
              ? "radial-gradient(circle at 50% 50%, rgba(0,225,255,0.18), transparent 60%)"
              : act === 3
              ? "radial-gradient(circle at 50% 50%, rgba(255,61,46,0.35), transparent 55%)"
              : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.10), transparent 60%)",
        }}
        transition={{ duration: 1.2 }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      {stage === "play" && (
        <motion.div
          className="absolute inset-x-0 h-px bg-primary/30"
          initial={{ top: "0%" }}
          animate={{ top: "100%" }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}

      {stage === "play" && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/40"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              animate={{
                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GateScreen({ ready, onStart, signedIn }: { ready: boolean; onStart: () => void; signedIn: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-[10px] font-mono tracking-[0.4em] text-primary mb-4 inline-flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        SEQUENCE READY
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      </motion.div>
      <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter leading-none">
        <span className="bg-gradient-to-br from-white via-white to-primary bg-clip-text text-transparent">
          SkillVerse
        </span>
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 text-text-secondary text-base sm:text-lg max-w-xl mx-auto"
      >
        Where screens become skills. An interactive story in 5 acts.
      </motion.p>
      {signedIn && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-3 text-xs text-success font-mono tracking-widest"
        >
          ✓ ACCOUNT DETECTED — YOU CAN SKIP
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-10"
      >
        <button
          onClick={onStart}
          disabled={!ready}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm sm:text-base overflow-hidden disabled:opacity-50 hover:scale-105 transition-transform"
          aria-label="Start the intro sequence"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-warning to-accent opacity-80 blur-md group-hover:opacity-100 transition-opacity" />
          <span className="absolute inset-[2px] rounded-full bg-black" />
          <span className="relative flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            CLICK TO INITIALIZE SEQUENCE
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-6 text-[10px] font-mono text-text-muted tracking-widest"
      >
        PRESS <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">SPACE</kbd> OR <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">ENTER</kbd> TO START
        <span className="mx-2">·</span>
        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">ESC</kbd> TO SKIP
      </motion.div>
    </motion.div>
  );
}

function PlayAct({ act }: { act: number }) {
  return (
    <motion.div
      key={act}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-6 text-center"
    >
      {act === 0 && (
        <>
          <ActLabel text="ACT 01 · THE PROBLEM" />
          <Typewriter
            text="SCREENS"
            className="font-display font-black text-7xl sm:text-9xl tracking-tighter leading-none bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent"
            delay={120}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6 text-text-secondary text-lg sm:text-2xl"
          >
            Every. Single. Day.
          </motion.p>
        </>
      )}
      {act === 1 && (
        <>
          <ActLabel text="ACT 02 · THE DATA" />
          <h2 className="font-display font-black text-6xl sm:text-8xl tracking-tighter leading-none">
            <span className="text-white/40 mr-2 sm:mr-4">+</span>
            <span className="bg-gradient-to-br from-warning to-primary bg-clip-text text-transparent">6.4</span>
            <span className="text-white/40 ml-2 sm:ml-4 text-3xl sm:text-5xl">HOURS</span>
          </h2>
          <p className="mt-6 text-text-secondary text-lg sm:text-2xl max-w-2xl mx-auto">
            That's what the average Indian teen spends on screens every day.
          </p>
        </>
      )}
      {act === 2 && (
        <>
          <ActLabel text="ACT 03 · THE OPPORTUNITY" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto">
            <Stat n="73%" l="learn more from YouTube than school" color="from-accent to-primary" />
            <Stat n="41%" l="use AI tools every day" color="from-primary to-warning" />
            <Stat n="68%" l="turned a hobby into a real skill" color="from-warning to-success" />
          </div>
          <p className="mt-6 text-text-secondary text-sm sm:text-base max-w-2xl mx-auto">
            That's what 250+ real students told us.
          </p>
        </>
      )}
      {act === 3 && (
        <>
          <ActLabel text="ACT 04 · THE ANSWER" />
          <Typewriter
            text="SkillVerse"
            className="font-display font-black text-6xl sm:text-9xl tracking-tighter leading-none bg-gradient-to-br from-primary via-warning to-accent bg-clip-text text-transparent"
            delay={140}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-6 text-text-secondary text-lg sm:text-2xl max-w-2xl mx-auto"
          >
            AI-powered analytics. A personalized 4-week plan. Real progress.
          </motion.p>
        </>
      )}
      {act === 4 && (
        <>
          <ActLabel text="ACT 05 · YOU" />
          <h2 className="font-display font-black text-5xl sm:text-7xl tracking-tighter leading-none">
            <span className="bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">Ready to start?</span>
          </h2>
          <p className="mt-4 text-text-secondary text-lg">Take 90 seconds. Change everything.</p>
        </>
      )}
    </motion.div>
  );
}

function ActLabel({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono tracking-[0.3em] text-white/60"
    >
      <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
      {text}
    </motion.div>
  );
}

function Stat({ n, l, color }: { n: string; l: string; color: string }) {
  return (
    <div className="glass p-4 sm:p-6 rounded-2xl">
      <div className={`font-display font-black text-4xl sm:text-6xl tracking-tighter bg-gradient-to-br ${color} bg-clip-text text-transparent`}>
        {n}
      </div>
      <div className="mt-2 text-[11px] sm:text-sm text-text-secondary leading-snug">{l}</div>
    </div>
  );
}

function Typewriter({ text, className, delay = 80 }: { text: string; className?: string; delay?: number }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, delay);
    return () => clearInterval(id);
  }, [text, delay]);
  return (
    <h2 className={className}>
      {out}
      <span className="inline-block w-[0.5em] h-[0.9em] bg-white/70 align-middle ml-1 animate-pulse" />
    </h2>
  );
}

function AuthStage({
  user,
  mode,
  setMode,
  onSignIn,
  onSignUp,
  onContinue,
}: {
  user: any;
  mode: "choice" | "signin" | "signup" | null;
  setMode: (m: "choice" | "signin" | "signup" | null) => void;
  onSignIn: (email: string, password: string, name?: string) => Promise<boolean>;
  onSignUp: (email: string, password: string, name?: string) => Promise<boolean>;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-6"
    >
      {user ? (
        <SignedInCard email={user.email} onContinue={onContinue} />
      ) : mode === "signin" || mode === "signup" ? (
        <AuthForm
          mode={mode}
          onSubmit={mode === "signin" ? onSignIn : onSignUp}
          onSwitch={() => setMode(mode === "signin" ? "signup" : "signin")}
          onCancel={() => setMode("choice")}
        />
      ) : (
        <ChoiceCard onChoose={setMode} onContinue={onContinue} />
      )}
    </motion.div>
  );
}

function SignedInCard({ email, onContinue }: { email: string; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong p-8 rounded-3xl text-center"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-warning flex items-center justify-center mx-auto mb-4 text-xl font-black">
        {email[0]?.toUpperCase()}
      </div>
      <h2 className="font-display font-black text-2xl">Welcome back</h2>
      <p className="text-text-secondary text-sm mt-1">{email}</p>
      <button onClick={onContinue} className="btn-primary w-full justify-center mt-6 text-sm">
        Enter Dashboard <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function ChoiceCard({
  onChoose,
  onContinue,
}: {
  onChoose: (m: "signin" | "signup") => void;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong p-8 rounded-3xl text-center"
    >
      <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
      <h2 className="font-display font-black text-2xl mb-2">Initialize your account</h2>
      <p className="text-text-secondary text-sm mb-6">
        Create a free account to take the survey and unlock your personalized dashboard.
      </p>
      <div className="space-y-3">
        <button
          onClick={() => onChoose("signup")}
          className="btn-primary w-full justify-center text-sm"
        >
          Create free account <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChoose("signin")}
          className="btn-secondary w-full justify-center text-sm"
        >
          I already have an account
        </button>
        <button
          onClick={onContinue}
          className="text-xs text-text-muted hover:text-white py-2"
        >
          Continue without account
        </button>
      </div>
      <p className="text-[10px] text-text-muted mt-4">100% free. Anonymous. No credit card.</p>
    </motion.div>
  );
}

function AuthForm({
  mode,
  onSubmit,
  onSwitch,
  onCancel,
}: {
  mode: "signin" | "signup";
  onSubmit: (email: string, password: string, name?: string) => Promise<boolean>;
  onSwitch: () => void;
  onCancel: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(email, password, name);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong p-8 rounded-3xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-2xl">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h2>
        <button onClick={onCancel} aria-label="Back" className="p-1.5 rounded hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode === "signup" && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              autoComplete="name"
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          {mode === "signin" ? "Sign in" : "Create account & start survey"}
        </button>
      </form>
      <p className="text-center text-xs text-text-muted mt-4">
        {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={onSwitch} className="text-primary hover:underline font-semibold">
          {mode === "signin" ? "Sign up" : "Sign in"}
        </button>
      </p>
      <p className="text-[10px] text-text-muted text-center mt-3">
        By continuing you agree to our terms. Your data is anonymous.
      </p>
    </motion.div>
  );
}
