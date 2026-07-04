"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, X } from "lucide-react";
import dynamic from "next/dynamic";


export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: (state: AchievementState) => boolean;
  tier: "bronze" | "silver" | "gold";
}

export interface AchievementState {
  submittedSurvey: boolean;
  signedPledge: boolean;
  aiFeaturesUsed: Set<string>;
  csvUploaded: boolean;
  researchRead: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first-survey", title: "First Voice", description: "Submitted your first survey", emoji: "📝", tier: "bronze", condition: (s) => s.submittedSurvey },
  { id: "ai-explorer", title: "AI Explorer", description: "Tried 3 different AI features", emoji: "🤖", tier: "silver", condition: (s) => s.aiFeaturesUsed.size >= 3 },
  { id: "data-analyst", title: "Data Analyst", description: "Uploaded and analyzed a CSV", emoji: "📊", tier: "silver", condition: (s) => s.csvUploaded },
  { id: "pledger", title: "Pledger", description: "Signed the digital pledge", emoji: "✋", tier: "bronze", condition: (s) => s.signedPledge },
  { id: "scholar", title: "Scholar", description: "Read 3 research pages", emoji: "📚", tier: "bronze", condition: (s) => s.researchRead >= 3 },
  { id: "ai-power-user", title: "AI Power User", description: "Tried all 8 AI features", emoji: "⚡", tier: "gold", condition: (s) => s.aiFeaturesUsed.size >= 8 }
];

const STORAGE_KEY = "sv:achievements:v1";

function getUnlocked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveUnlocked(s: Set<string>) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...s])); } catch {}
}

let listeners: Array<(s: AchievementState) => void> = [];
let cached: AchievementState = {
  submittedSurvey: false,
  signedPledge: false,
  aiFeaturesUsed: new Set(),
  csvUploaded: false,
  researchRead: 0
};

export function trackEvent(event: keyof AchievementState, payload?: any) {
  if (typeof window === "undefined") return;
  // Read current
  try {
    const s = localStorage.getItem("sv:track:v1");
    const state: any = s ? JSON.parse(s) : {};
    if (event === "aiFeaturesUsed" && payload) {
      const arr: string[] = state.aiFeaturesUsed || [];
      if (!arr.includes(payload)) arr.push(payload);
      state.aiFeaturesUsed = arr;
    } else if (event === "researchRead") {
      state.researchRead = (state.researchRead || 0) + 1;
    } else {
      state[event] = payload ?? true;
    }
    localStorage.setItem("sv:track:v1", JSON.stringify(state));
  } catch {}
  // Recompute state
  const newState = readState();
  cached = newState;
  // Check achievements
  const unlocked = getUnlocked();
  let newlyUnlocked: Achievement[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!unlocked.has(a.id) && a.condition(newState)) {
      unlocked.add(a.id);
      newlyUnlocked.push(a);
    }
  }
  if (newlyUnlocked.length) {
    saveUnlocked(unlocked);
    for (const a of newlyUnlocked) {
      window.dispatchEvent(new CustomEvent("sv:achievement", { detail: a }));
    }
  }
  // Notify listeners
  listeners.forEach((l) => l(newState));
}

function readState(): AchievementState {
  try {
    const s = localStorage.getItem("sv:track:v1");
    if (!s) return cached;
    const o: any = JSON.parse(s);
    return {
      submittedSurvey: !!o.submittedSurvey,
      signedPledge: !!o.signedPledge,
      aiFeaturesUsed: new Set(o.aiFeaturesUsed || []),
      csvUploaded: !!o.csvUploaded,
      researchRead: o.researchRead || 0
    };
  } catch { return cached; }
}

export function getAchievementState() { return readState(); }
export function getAllAchievements() { return ACHIEVEMENTS; }
export function getUnlockedAchievements() { return ACHIEVEMENTS.filter((a) => getUnlocked().has(a.id)); }

/** Triggers a one-shot confetti + notification. Use trackEvent() to also unlock achievements. */
export function useCelebration() {
  const [burst, setBurst] = useState<{ id: number; lottie?: any } | null>(null);
  const [toast, setToast] = useState<{ id: number; achievement: Achievement } | null>(null);

  const fire = useCallback((opts?: { withLottie?: boolean }) => {
    const id = Date.now();
    setBurst({ id });
    setTimeout(() => setBurst(null), 5000);
  }, []);

  useEffect(() => {
    const onAch = (e: Event) => {
      const achievement = (e as CustomEvent).detail as Achievement;
      setToast({ id: Date.now(), achievement });
      fire();
      setTimeout(() => setToast(null), 6000);
    };
    window.addEventListener("sv:achievement", onAch);
    return () => window.removeEventListener("sv:achievement", onAch);
  }, [fire]);

  return { burst, toast, fire };
}

const TIER_COLORS = {
  bronze: "from-amber-700 to-amber-500",
  silver: "from-slate-400 to-slate-300",
  gold: "from-yellow-500 to-yellow-300"
};

/** Confetti overlay + achievement toast. Drop once at the app root. */
export function CelebrationOverlay() {
  const [burst, setBurst] = useState<{ id: number } | null>(null);
  const [toast, setToast] = useState<{ id: number; achievement: Achievement } | null>(null);

  useEffect(() => {
    const onAch = (e: Event) => {
      const a = (e as CustomEvent).detail as Achievement;
      const id = Date.now();
      setBurst({ id });
      setToast({ id, achievement: a });
      setTimeout(() => setBurst(null), 4500);
      setTimeout(() => setToast(null), 6500);
    };
    window.addEventListener("sv:achievement", onAch);
    return () => window.removeEventListener("sv:achievement", onAch);
  }, []);

  return (
    <>
      <AnimatePresence>
        {burst && (
          <motion.div
            key={burst.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] pointer-events-none flex items-center justify-center"
            aria-hidden="true"
          >
            <ConfettiBurst />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
            className="fixed top-20 right-4 z-[401] max-w-sm"
            role="alert" aria-live="assertive"
          >
            <div className={`glass-strong p-4 rounded-2xl border-2 border-white/20 shadow-2xl`}>
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${TIER_COLORS[toast.achievement.tier]} flex items-center justify-center text-2xl shrink-0`}>
                  {toast.achievement.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
                    <span className="label text-secondary">ACHIEVEMENT UNLOCKED</span>
                  </div>
                  <h3 className="font-display font-black text-base mt-1">{toast.achievement.title}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{toast.achievement.description}</p>
                </div>
                <button onClick={() => setToast(null)} aria-label="Dismiss" className="p-1 rounded hover:bg-white/10">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ConfettiBurst() {
  // Simple CSS-based confetti (50 pieces falling)
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2 + Math.random() * 2,
    rotate: Math.random() * 360,
    color: ["#FF3D2E", "#FFA800", "#00E1FF", "#10B981", "#8B5CF6", "#EC4899"][i % 6]
  }));
  return (
    <div className="absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: p.rotate * 4, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{ left: `${p.left}%`, position: "absolute", top: 0, width: 10, height: 14, background: p.color, borderRadius: 1 }}
        />
      ))}
    </div>
  );
}
