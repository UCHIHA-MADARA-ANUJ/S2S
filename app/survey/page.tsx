"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFingerprint, resetFingerprint } from "@/lib/fingerprint";
import { trackEvent } from "@/components/ui/Celebration";
import { useAuth } from "@/lib/auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Check, Loader2, Lock, LogIn, UserPlus } from "lucide-react";
import { GENDERS, DEVICES, PLATFORMS, SKILLS, AI_TOOLS, IMPACTS } from "@/lib/constants";

const STEPS = ["About You", "Screen Time", "Time Split", "Platforms", "Skills", "Wellness", "AI Usage", "Review"];

export default function SurveyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean | null>(null);
  const [myData, setMyData] = useState<any>(null);

  // Check if this device has already submitted
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const fp = await getFingerprint();
        const res = await fetch(`/api/survey/check?fp=${encodeURIComponent(fp)}`);
        const json = await res.json();
        if (alive) setAlreadySubmitted(!!json.exists);
      } catch {
        if (alive) setAlreadySubmitted(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const [data, setData] = useState<any>({
    age: 15, grade: 10, gender: "", city: "",
    daily_screen_time: 4, primary_device: "",
    learning_percentage: 40, entertainment_percentage: 40, social_percentage: 20,
    platforms_used: [] as string[], most_helpful_platform: "",
    skills_learned: [] as string[], creativity_rating: 7, collaboration_rating: 7,
    positive_impact: "", hobby_to_skill: false, hobby_to_skill_detail: "",
    next_skill_to_learn: "", uses_ai_tools: false, ai_tools_used: [] as string[], ai_learning_rating: 7
  });

  const update = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));
  const toggle = (k: string, v: string) => setData((d: any) => {
    const arr = (d[k] as string[]) || [];
    return { ...d, [k]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] };
  });

  const canProceed = () => {
    if (step === 0) return data.gender && data.city;
    if (step === 1) return data.primary_device;
    if (step === 2) { const t = data.learning_percentage + data.entertainment_percentage + data.social_percentage; return t >= 95 && t <= 105; }
    if (step === 3) return data.platforms_used.length > 0 && data.most_helpful_platform;
    if (step === 4) return data.skills_learned.length > 0;
    if (step === 5) return data.positive_impact && data.next_skill_to_learn;
    if (step === 6) return data.uses_ai_tools ? data.ai_tools_used.length > 0 : true;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const fp = await getFingerprint();
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, fingerprint: fp, user_id: user?.id || null })
      });
      if (res.ok) {
        try { localStorage.setItem("sv-done", "1"); } catch {}
        toast.success("Response recorded! 🎉");
        trackEvent("submittedSurvey", true);
        router.push("/survey/thank-you");
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Submission failed.");
      }
    } catch { toast.error("Network error."); } finally { setSubmitting(false); }
  };

  const total = data.learning_percentage + data.entertainment_percentage + data.social_percentage;

  const resetAndContinue = () => {
    if (confirm("Reset your device fingerprint and submit again? (Admin/testing only)")) {
      resetFingerprint();
      setAlreadySubmitted(false);
    }
  };

  // If already submitted AND not signed in, show "you've submitted" state
  if (alreadySubmitted === true && !user) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto glass-strong p-8 rounded-2xl text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="font-display font-black text-2xl mb-3">You&rsquo;ve already submitted</h1>
          <p className="text-text-secondary text-sm mb-6">
            We&rsquo;ve already received a response from this device. Thanks for participating!
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard" className="btn-primary text-sm">View Dashboard</Link>
            <Link href="/" className="btn-secondary text-sm">Back to Home</Link>
            <button onClick={resetAndContinue} className="text-text-muted text-xs hover:text-white mt-2">Reset fingerprint (testing only)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {user && (
          <div className="mb-4 glass p-3 rounded-xl flex items-center gap-2 text-xs" data-reveal>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
              {(user.email?.[0] || "U").toUpperCase()}
            </div>
            <span className="text-text-secondary">Signed in as</span>
            <span className="font-semibold truncate">{user.email}</span>
            <span className="text-text-muted ml-auto hidden sm:inline">Your response saves to your account</span>
          </div>
        )}

        {!user && (
          <div className="mb-4 glass p-3 rounded-xl flex items-center justify-between gap-3 text-xs" data-reveal>
            <div className="flex items-center gap-2 min-w-0">
              <LogIn className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-text-secondary truncate">Sign in to save your response to your account</span>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Link href="/signin?next=/survey" className="text-text-muted hover:text-white text-xs px-2 py-1">Sign in</Link>
              <Link href="/signup?next=/survey" className="text-primary hover:underline text-xs font-semibold px-2 py-1">Sign up</Link>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="label">Step {step + 1} of {STEPS.length}</span>
            <span className="font-display font-bold text-white">{STEPS[step]}</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-primary to-accent" initial={false} animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        <div className="glass p-6 sm:p-10 relative">
          <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 bg-background border border-white/10 px-3 py-1 rounded-full text-xs text-text-muted">
            <Lock className="w-3 h-3" /> Anonymous
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              {step === 0 && <Step0 data={data} update={update} />}
              {step === 1 && <Step1 data={data} update={update} />}
              {step === 2 && <Step2 data={data} update={update} total={total} />}
              {step === 3 && <Step3 data={data} update={update} toggle={toggle} />}
              {step === 4 && <Step4 data={data} update={update} toggle={toggle} />}
              {step === 5 && <Step5 data={data} update={update} />}
              {step === 6 && <Step6 data={data} update={update} toggle={toggle} />}
              {step === 7 && <Step7 data={data} user={user} />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="btn-secondary text-sm disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => canProceed() && setStep(s => s + 1)} disabled={!canProceed()} className="btn-primary text-sm disabled:opacity-30">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={submitting} className="btn-primary text-sm disabled:opacity-30">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting</> : <>Submit <Check className="w-4 h-4" /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step0({ data, update }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-black text-2xl">About you</h2>
      <p className="text-text-secondary text-sm">No names, no emails. Just basic demographics.</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label block mb-1">Age</label>
          <input type="number" min={10} max={25} value={data.age} onChange={e => update("age", Number(e.target.value))} className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="label block mb-1">Grade</label>
          <input type="number" min={1} max={12} value={data.grade} onChange={e => update("grade", Number(e.target.value))} className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
        </div>
      </div>
      <div>
        <label className="label block mb-1">Gender</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {GENDERS.map(g => (
            <button key={g} onClick={() => update("gender", g)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${data.gender === g ? "bg-primary text-white" : "bg-white/5 text-text-secondary hover:text-white"}`}>
              {g}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label block mb-1">City</label>
        <input type="text" value={data.city} onChange={e => update("city", e.target.value)} placeholder="e.g. Gurugram, Delhi" className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
      </div>
    </div>
  );
}

function Step1({ data, update }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-black text-2xl">Your screen time</h2>
      <p className="text-text-secondary text-sm">Be honest — this only helps the data.</p>
      <div>
        <label className="label block mb-1">Daily screen time: {data.daily_screen_time}hr</label>
        <input type="range" min={1} max={14} value={data.daily_screen_time} onChange={e => update("daily_screen_time", Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div>
        <label className="label block mb-2">Primary device</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DEVICES.map(d => (
            <button key={d} onClick={() => update("primary_device", d)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${data.primary_device === d ? "bg-primary text-white" : "bg-white/5 text-text-secondary hover:text-white"}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ data, update, total }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-black text-2xl">Time split</h2>
      <p className="text-text-secondary text-sm">What % of your screen time goes to each?</p>
      {[
        { k: "learning_percentage", label: "Learning", color: "accent" },
        { k: "entertainment_percentage", label: "Entertainment", color: "primary" },
        { k: "social_percentage", label: "Social", color: "secondary" }
      ].map((it) => (
        <div key={it.k}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">{it.label}</span>
            <span className="font-mono text-white">{data[it.k]}%</span>
          </div>
          <input type="range" min={0} max={100} value={data[it.k]} onChange={e => update(it.k, Number(e.target.value))} className={`w-full accent-${it.color}`} />
        </div>
      ))}
      <p className={`text-xs ${total >= 95 && total <= 105 ? "text-success" : "text-warning"}`}>Total: {total}% (should be ~100%)</p>
    </div>
  );
}

function Step3({ data, update, toggle }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-black text-2xl">Platforms you use</h2>
      <p className="text-text-secondary text-sm">Pick all that apply.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PLATFORMS.map(p => (
          <button key={p} onClick={() => toggle("platforms_used", p)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${data.platforms_used.includes(p) ? "bg-primary text-white" : "bg-white/5 text-text-secondary hover:text-white"}`}>
            {p}
          </button>
        ))}
      </div>
      <div>
        <label className="label block mb-2">Most helpful for learning</label>
        {data.platforms_used.length === 0 ? (
          <p className="text-text-muted text-xs">Select platforms above first</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.platforms_used.map((p: string) => (
              <button
                key={p}
                type="button"
                onClick={() => update("most_helpful_platform", p)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  data.most_helpful_platform === p
                    ? "bg-primary text-white"
                    : "bg-white/5 text-text-secondary hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Step4({ data, toggle }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-black text-2xl">Skills you&rsquo;re learning</h2>
      <p className="text-text-secondary text-sm">Pick all that apply.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {SKILLS.map(s => (
          <button key={s} onClick={() => toggle("skills_learned", s)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${data.skills_learned.includes(s) ? "bg-primary text-white" : "bg-white/5 text-text-secondary hover:text-white"}`}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Step5({ data, update }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-black text-2xl">Wellness &amp; impact</h2>
      <div>
        <label className="label block mb-2">Creativity rating: {data.creativity_rating}/10</label>
        <input type="range" min={1} max={10} value={data.creativity_rating} onChange={e => update("creativity_rating", Number(e.target.value))} className="w-full accent-accent" />
      </div>
      <div>
        <label className="label block mb-2">Collaboration rating: {data.collaboration_rating}/10</label>
        <input type="range" min={1} max={10} value={data.collaboration_rating} onChange={e => update("collaboration_rating", Number(e.target.value))} className="w-full accent-accent" />
      </div>
      <div>
        <label className="label block mb-1">Overall impact of screen time on your skills</label>
        <select value={data.positive_impact} onChange={e => update("positive_impact", e.target.value)} className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm">
          <option value="">Choose...</option>
          {IMPACTS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div>
        <label className="label block mb-1">Next skill you want to learn</label>
        <input type="text" value={data.next_skill_to_learn} onChange={e => update("next_skill_to_learn", e.target.value)} placeholder="e.g. Python, Photography" className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm" />
      </div>
    </div>
  );
}

function Step6({ data, update, toggle }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-black text-2xl">AI tools</h2>
      <p className="text-text-secondary text-sm">Do you use AI tools for learning?</p>
      <div className="flex gap-3">
        <button onClick={() => update("uses_ai_tools", true)} className={`flex-1 py-3 rounded-lg text-sm font-bold ${data.uses_ai_tools === true ? "bg-primary text-white" : "bg-white/5 text-text-secondary"}`}>Yes</button>
        <button onClick={() => update("uses_ai_tools", false)} className={`flex-1 py-3 rounded-lg text-sm font-bold ${data.uses_ai_tools === false ? "bg-primary text-white" : "bg-white/5 text-text-secondary"}`}>No</button>
      </div>
      {data.uses_ai_tools && (
        <div>
          <label className="label block mb-2">Which tools?</label>
          <div className="grid grid-cols-2 gap-2">
            {AI_TOOLS.map(t => (
              <button key={t} onClick={() => toggle("ai_tools_used", t)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${data.ai_tools_used.includes(t) ? "bg-primary text-white" : "bg-white/5 text-text-secondary hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Step7({ data, user }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-black text-2xl">Review &amp; submit</h2>
      <p className="text-text-secondary text-sm">Take a final look. That&rsquo;s it.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <Stat label="Age" value={data.age} />
        <Stat label="Grade" value={data.grade} />
        <Stat label="City" value={data.city || "—"} />
        <Stat label="Gender" value={data.gender || "—"} />
        <Stat label="Daily screen time" value={`${data.daily_screen_time} hr`} />
        <Stat label="Primary device" value={data.primary_device || "—"} />
        <Stat label="Learning %" value={`${data.learning_percentage}%`} />
        <Stat label="Top platform" value={data.most_helpful_platform || "—"} />
        <Stat label="Skills learned" value={data.skills_learned.join(", ") || "—"} />
        <Stat label="Creativity" value={`${data.creativity_rating}/10`} />
        <Stat label="AI tools" value={data.uses_ai_tools ? data.ai_tools_used.join(", ") || "Yes" : "No"} />
        <Stat label="Next skill" value={data.next_skill_to_learn || "—"} />
      </div>
      {user ? (
        <p className="text-xs text-success bg-success/10 p-2 rounded-lg mt-2">✅ Saving to your account ({user.email})</p>
      ) : (
        <p className="text-xs text-text-muted bg-white/5 p-2 rounded-lg mt-2">Submitting anonymously. <Link href="/signup?next=/dashboard" className="text-primary hover:underline">Sign up</Link> to save to your account.</p>
      )}
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <p className="text-[10px] label">{label.toUpperCase()}</p>
      <p className="text-sm text-white font-semibold mt-0.5">{value}</p>
    </div>
  );
}
