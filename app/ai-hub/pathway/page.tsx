"use client";
import { useState } from "react";
import { Target, Loader2, Sparkles, CheckCircle2, Clock } from "lucide-react";

export default function PathwayPage() {
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [hours, setHours] = useState(5);
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState<any>(null);

  const generate = async () => {
    if (!skill) return;
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/pathway", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skillGoal: skill, level, hoursPerWeek: hours }) });
      const data = await res.json();
      setR(data.data || data);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mx-auto mb-4">
            <Target className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-black text-4xl tracking-tight">Skill Pathway</h1>
          <p className="text-text-secondary mt-2">Personalized 4-week learning plan</p>
        </div>

        <div className="glass p-6 mb-6 space-y-4">
          <div>
            <label className="label block mb-2">What skill do you want to learn?</label>
            <input value={skill} onChange={e => setSkill(e.target.value)} placeholder="Python, video editing, AI prompting..." className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label block mb-2">Level</label>
              <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="label block mb-2">Hours/week: <span className="text-primary">{hours}</span></label>
              <input type="range" min={1} max={20} value={hours} onChange={e => setHours(+e.target.value)} className="w-full mt-2 accent-primary" />
            </div>
          </div>
          <button onClick={generate} disabled={loading || !skill} className="btn-primary w-full disabled:opacity-30">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating</> : <>Generate Pathway <Sparkles className="w-4 h-4" /></>}
          </button>
        </div>

        {r && (
          <div className="space-y-4">
            <div className="glass-strong p-6">
              <h2 className="font-display font-black text-3xl mb-2">{r.skillGoal || skill}</h2>
              {r.summary && <p className="text-text-secondary">{r.summary}</p>}
            </div>
            {r.weeks?.map((w: any) => (
              <div key={w.week} className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="label">Week {w.week}</span>
                    <h3 className="font-display font-bold text-xl">{w.title}</h3>
                  </div>
                  <span className="flex items-center gap-1 text-text-muted text-sm"><Clock className="w-4 h-4" /> {w.estimatedHours}hrs</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="label mb-2">Goals</p>
                    <ul className="space-y-1">{w.goals?.map((g: string, i: number) => <li key={i} className="text-sm text-text-secondary flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /> {g}</li>)}</ul>
                  </div>
                  <div>
                    <p className="label mb-2">Tasks</p>
                    <ul className="space-y-1">{w.tasks?.map((t: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {t}</li>)}</ul>
                    {w.platforms && <div className="mt-3 flex flex-wrap gap-1">{w.platforms.map((p: string) => <span key={p} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{p}</span>)}</div>}
                  </div>
                </div>
                {w.milestone && <p className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg text-sm"><span className="text-secondary font-mono uppercase text-xs">Milestone: </span>{w.milestone}</p>}
              </div>
            ))}
            {r.expectedOutcome && (
              <div className="glass p-6 border-success/30 bg-success/5">
                <p className="text-success label mb-2">Expected outcome</p>
                <p className="text-text-primary">{r.expectedOutcome}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
