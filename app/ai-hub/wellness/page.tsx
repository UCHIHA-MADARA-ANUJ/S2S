"use client";
import { useState } from "react";
import { Heart, Loader2, Sparkles, Lightbulb } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SAMPLE = "I spend about 5 hours on screens daily. 2 hours on YouTube watching coding tutorials, 1.5 hours gaming, 1 hour on Instagram, 30 mins on Khan Academy.";

export default function WellnessPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState<any>(null);

  const analyze = async () => {
    if (text.length < 10) return;
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/sentiment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await res.json();
      setR(data.data || data);
    } catch {} finally { setLoading(false); }
  };

  const score = r?.digitalWellnessScore || 0;
  const pathColor = score > 70 ? "#10B981" : score > 40 ? "#FFA800" : "#EF4444";

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success to-accent flex items-center justify-center mx-auto mb-4">
            <Heart className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-black text-4xl tracking-tight">Wellness Analyzer</h1>
          <p className="text-text-secondary mt-2">AI-powered digital wellness scoring</p>
        </div>

        <div className="glass p-6 mb-6">
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Describe your typical day with screens..." rows={6} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary resize-none" />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-text-muted label">{text.length} chars</span>
            <div className="flex gap-2">
              <button onClick={() => setText(SAMPLE)} className="text-xs text-text-muted hover:text-white">Use sample</button>
              <button onClick={analyze} disabled={loading || text.length < 10} className="btn-primary text-sm disabled:opacity-30">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing</> : <>Analyze <Sparkles className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </div>

        {r && (
          <div className="space-y-4">
            <div className="glass p-8 text-center">
              <div className="w-48 h-48 mx-auto">
                <CircularProgressbar value={score} text={`${score}`} styles={buildStyles({ pathColor, textColor: "#FAFAFA", trailColor: "rgba(255,255,255,0.05)", textSize: "32px", pathTransitionDuration: 1.5 })} />
              </div>
              <p className="label mt-6">Digital Wellness Score</p>
              <p className="text-2xl font-display font-bold mt-2 capitalize">{r.overallSentiment || "neutral"}</p>
              {r.summary && <p className="text-text-secondary text-sm mt-3 max-w-md mx-auto">{r.summary}</p>}
            </div>

            {r.categories && (
              <div className="glass p-6">
                <h3 className="label mb-4">Category Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(r.categories).map(([k, v]: any) => (
                    <div key={k}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="capitalize text-text-secondary">{k}</span>
                        <span className="font-display font-bold tabular-nums">{v}/10</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${v * 10}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {r.advice && (
              <div className="glass p-6">
                <div className="flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-secondary" /><h3 className="label">AI Advice</h3></div>
                <p className="text-text-secondary leading-relaxed">{r.advice}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
