"use client";
import { useState } from "react";
import { DotField } from "@/components/effects/DotField";
import { Search, Loader2, Sparkles, Check, X } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { TrackAIUsage } from "@/components/ui/TrackAIUsage";

const EXAMPLES = ["YouTube - Khan Academy", "TikTok gaming content", "Instagram reels", "GitHub learning"];

export default function ContentPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState<any>(null);

  const analyze = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: text }) });
      const data = await res.json();
      setR(data.data || data);
    } catch {} finally { setLoading(false); }
  };

  const score = r?.skillScore || 0;
  const pathColor = score > 70 ? "#10B981" : score > 40 ? "#FFA800" : "#EF4444";

  return (
    <>
      <TrackAIUsage featureId="content" />
      <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50"><DotField dotSpacing={28} cursorRadius={200} sparkle={false} /></div>
      <div className="relative z-10"><div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4">
            <Search className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-black text-4xl tracking-tight">Content Scorer</h1>
          <p className="text-text-secondary mt-2">Rate any content's educational value</p>
        </div>

        <div className="glass p-6 mb-6">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Enter a URL, app name, or describe any content..." className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" />
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map(e => <button key={e} onClick={() => setText(e)} className="text-xs glass-subtle px-3 py-1.5 rounded-full text-text-secondary hover:text-white">{e}</button>)}
          </div>
          <button onClick={analyze} disabled={loading || !text} className="btn-primary w-full mt-4 disabled:opacity-30">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scoring</> : <>Analyze <Sparkles className="w-4 h-4" /></>}
          </button>
        </div>

        {r && (
          <div className="space-y-4">
            <div className="glass p-8 text-center">
              <div className="w-44 h-44 mx-auto">
                <CircularProgressbar value={score} text={`${score}`} styles={buildStyles({ pathColor, textColor: "#FAFAFA", trailColor: "rgba(255,255,255,0.05)", textSize: "32px", pathTransitionDuration: 1.5 })} />
              </div>
              <p className="label mt-4">Skill Score</p>
              {r.rating && <p className="text-2xl font-display font-bold mt-2 capitalize">{r.rating}</p>}
            </div>

            {r.educationalValue !== undefined && (
              <div className="glass p-6 space-y-4">
                <h3 className="label">Breakdown</h3>
                {Object.entries({
                  "Educational Value": r.educationalValue,
                  "Engagement": r.engagementLevel,
                  "Age Appropriate": r.ageAppropriateness,
                  "Practical Application": r.practicalApplication
                }).map(([k, v]: any) => (
                  <div key={k}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-text-secondary">{k}</span>
                      <span className="font-bold tabular-nums">{v}/10</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${v * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {r.pros && (
              <div className="glass p-6">
                <h3 className="label text-success mb-3">Pros</h3>
                <ul className="space-y-1">{r.pros.map((p: string, i: number) => <li key={i} className="text-sm flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" /> {p}</li>)}</ul>
              </div>
            )}

            {r.cons && (
              <div className="glass p-6">
                <h3 className="label text-error mb-3">Cons</h3>
                <ul className="space-y-1">{r.cons.map((c: string, i: number) => <li key={i} className="text-sm flex items-start gap-2"><X className="w-4 h-4 text-error mt-0.5 flex-shrink-0" /> {c}</li>)}</ul>
              </div>
            )}

            {r.verdict && <div className="glass p-6"><h3 className="label mb-2">Verdict</h3><p className="text-text-secondary">{r.verdict}</p></div>}
            {r.betterAlternatives && r.betterAlternatives.length > 0 && (
              <div className="glass p-6">
                <h3 className="label mb-2">Try instead</h3>
                <div className="flex flex-wrap gap-2">{r.betterAlternatives.map((a: string) => <span key={a} className="text-sm glass px-3 py-1.5 rounded-full">{a}</span>)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
      </div></div>
    </>
  );
}
