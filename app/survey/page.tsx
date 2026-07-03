"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Check, Loader2, Lock } from "lucide-react";
import { GENDERS, DEVICES, PLATFORMS, SKILLS, AI_TOOLS, IMPACTS } from "@/lib/constants";

const STEPS = ["About You", "Screen Time", "Time Split", "Platforms", "Skills", "Wellness", "AI Usage", "Review"];

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
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
      const res = await fetch("/api/survey/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        try { localStorage.setItem("sv-done", "1"); } catch {}
        toast.success("Response recorded! 🎉");
        router.push("/survey/thank-you");
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Submission failed.");
      }
    } catch { toast.error("Network error."); } finally { setSubmitting(false); }
  };

  const total = data.learning_percentage + data.entertainment_percentage + data.social_percentage;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
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
              {step === 7 && <Step7 data={data} />}
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-10">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-white disabled:opacity-30 transition">
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

function Chip({ active, onClick, children }: any) {
  return (
    <button onClick={onClick} className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${active ? "bg-primary text-white border-primary" : "border-white/10 text-text-secondary hover:border-white/30 hover:text-white"}`}>
      {children}
    </button>
  );
}

function Step0({ data, update }: any) {
  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-display font-black">About you.</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label block mb-2">Age</label>
          <input type="number" min={10} max={20} value={data.age} onChange={e => update("age", +e.target.value)} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="label block mb-2">Grade</label>
          <input type="number" min={6} max={12} value={data.grade} onChange={e => update("grade", +e.target.value)} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
        </div>
      </div>
      <div>
        <label className="label block mb-2">Gender</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {GENDERS.map((g) => <Chip key={g} active={data.gender === g} onClick={() => update("gender", g)}>{g}</Chip>)}
        </div>
      </div>
      <div>
        <label className="label block mb-2">City</label>
        <input type="text" value={data.city} onChange={e => update("city", e.target.value)} placeholder="Gurugram, Delhi, Mumbai..." className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
      </div>
    </div>
  );
}

function Step1({ data, update }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-black">Screen time.</h2>
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <label className="label">Daily hours</label>
          <span className="text-4xl font-display font-black text-primary tabular-nums">{data.daily_screen_time}</span>
        </div>
        <input type="range" min={0} max={16} step={0.5} value={data.daily_screen_time} onChange={e => update("daily_screen_time", +e.target.value)} className="w-full accent-primary" />
      </div>
      <div>
        <label className="label block mb-2">Primary device</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DEVICES.map((d) => <Chip key={d} active={data.primary_device === d} onClick={() => update("primary_device", d)}>{d}</Chip>)}
        </div>
      </div>
    </div>
  );
}

function Step2({ data, update, total }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-black">Time split.</h2>
      <p className="text-text-muted text-sm">Total should equal 100%</p>
      {[
        { k: "learning_percentage", l: "Learning", c: "from-primary to-primary-light" },
        { k: "entertainment_percentage", l: "Entertainment", c: "from-accent to-blue-500" },
        { k: "social_percentage", l: "Social", c: "from-secondary to-yellow-500" }
      ].map((s: any) => (
        <div key={s.k}>
          <div className="flex items-baseline justify-between mb-2">
            <label className="label">{s.l}</label>
            <span className="text-2xl font-display font-bold tabular-nums">{data[s.k]}%</span>
          </div>
          <input type="range" min={0} max={100} step={5} value={data[s.k]} onChange={e => update(s.k, +e.target.value)} className="w-full accent-primary" />
        </div>
      ))}
      <div className={`p-4 rounded-lg text-center ${total === 100 ? "bg-success/20 text-success" : total >= 95 && total <= 105 ? "bg-warning/20 text-warning" : "bg-error/20 text-error"}`}>
        <span className="label">Total</span>
        <div className="text-3xl font-display font-black">{total}%</div>
      </div>
    </div>
  );
}

function Step3({ data, update, toggle }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-black">Platforms.</h2>
      <div>
        <label className="label block mb-3">Which do you use regularly?</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PLATFORMS.map((p) => <Chip key={p} active={data.platforms_used.includes(p)} onClick={() => toggle("platforms_used", p)}>{p}</Chip>)}
        </div>
      </div>
      <div>
        <label className="label block mb-2">Most helpful for learning?</label>
        <select value={data.most_helpful_platform} onChange={e => update("most_helpful_platform", e.target.value)} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
          <option value="">Select</option>
          {data.platforms_used.map((p: string) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </div>
  );
}

function Step4({ data, update, toggle }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-black">Skills learned.</h2>
      <div>
        <label className="label block mb-3">What skills have you developed online?</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
          {SKILLS.map((s) => <Chip key={s} active={data.skills_learned.includes(s)} onClick={() => toggle("skills_learned", s)}>{s}</Chip>)}
        </div>
      </div>
      <SliderRow label="Creativity boost" value={data.creativity_rating} onChange={(v: number) => update("creativity_rating", v)} />
      <SliderRow label="Collaboration boost" value={data.collaboration_rating} onChange={(v: number) => update("collaboration_rating", v)} />
    </div>
  );
}

function SliderRow({ label, value, onChange }: any) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="label">{label}</label>
        <span className="text-2xl font-display font-bold tabular-nums">{value}/10</span>
      </div>
      <input type="range" min={1} max={10} value={value} onChange={e => onChange(+e.target.value)} className="w-full accent-primary" />
    </div>
  );
}

function Step5({ data, update }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-black">Digital wellness.</h2>
      <div>
        <label className="label block mb-3">Screens have positively impacted my life</label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {IMPACTS.map((i) => <Chip key={i} active={data.positive_impact === i} onClick={() => update("positive_impact", i)}>{i}</Chip>)}
        </div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer glass p-4">
        <input type="checkbox" checked={data.hobby_to_skill} onChange={e => update("hobby_to_skill", e.target.checked)} className="w-5 h-5 accent-primary" />
        <span>I turned a screen hobby into a real skill</span>
      </label>
      <div>
        <label className="label block mb-2">Next skill to learn?</label>
        <input type="text" value={data.next_skill_to_learn} onChange={e => update("next_skill_to_learn", e.target.value)} placeholder="Python, video editing, AI prompting..." className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary" />
      </div>
    </div>
  );
}

function Step6({ data, update, toggle }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-black">AI usage.</h2>
      <label className="flex items-center gap-3 cursor-pointer glass p-4">
        <input type="checkbox" checked={data.uses_ai_tools} onChange={e => update("uses_ai_tools", e.target.checked)} className="w-5 h-5 accent-primary" />
        <span>I use AI tools for learning</span>
      </label>
      {data.uses_ai_tools && (
        <>
          <div>
            <label className="label block mb-3">Which AI tools?</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AI_TOOLS.map((t) => <Chip key={t} active={data.ai_tools_used.includes(t)} onClick={() => toggle("ai_tools_used", t)}>{t}</Chip>)}
            </div>
          </div>
          <SliderRow label="AI helpfulness" value={data.ai_learning_rating} onChange={(v: number) => update("ai_learning_rating", v)} />
        </>
      )}
    </div>
  );
}

function Step7({ data }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-display font-black">Almost there.</h2>
      <p className="text-text-secondary text-sm">Review and submit. That's it.</p>
      <div className="space-y-2 text-sm glass p-5">
        <Row k="Age" v={`${data.age}, Grade ${data.grade}`} />
        <Row k="Gender / City" v={`${data.gender} · ${data.city}`} />
        <Row k="Screen time" v={`${data.daily_screen_time} hrs on ${data.primary_device}`} />
        <Row k="Split" v={`${data.learning_percentage}% L · ${data.entertainment_percentage}% E · ${data.social_percentage}% S`} />
        <Row k="Platforms" v={data.platforms_used.join(", ")} />
        <Row k="Most helpful" v={data.most_helpful_platform} />
        <Row k="Skills learned" v={data.skills_learned.join(", ")} />
        <Row k="Next skill" v={data.next_skill_to_learn} />
        <Row k="AI tools" v={data.uses_ai_tools ? data.ai_tools_used.join(", ") : "None"} />
      </div>
    </div>
  );
}

function Row({ k, v }: any) {
  return (
    <div className="flex items-start gap-3 border-b border-white/5 pb-2 last:border-0">
      <span className="label w-32 flex-shrink-0">{k}</span>
      <span className="text-text-primary flex-1">{v || "—"}</span>
    </div>
  );
}
