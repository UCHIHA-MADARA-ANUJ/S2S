"use client";
import { useState } from "react";
import { DotField } from "@/components/effects/DotField";
import { BarChart3, Loader2, Sparkles } from "lucide-react";
import { TrackAIUsage } from "@/components/ui/TrackAIUsage";

export default function AnalystPage() {
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState<any>(null);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/analyze", { method: "POST" });
      const data = await res.json();
      setR(data.data || data);
    } catch {} finally { setLoading(false); }
  };

  return (
    <>
      <TrackAIUsage featureId="analyst" />
      <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50"><DotField dotSpacing={28} cursorRadius={200} sparkle={false} /></div>
      <div className="relative z-10"><div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-primary flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-black text-4xl tracking-tight">Data Analyst</h1>
          <p className="text-text-secondary mt-2">AI pattern detection in survey data</p>
        </div>

        {!r && !loading && (
          <div className="text-center"><button onClick={analyze} className="btn-primary text-base">Analyze Data</button></div>
        )}

        {loading && <div className="glass p-16 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" /><p className="text-text-secondary">Analyzing 145+ responses...</p></div>}

        {r && (
          <div className="space-y-4">
            {r.keyMetric && <div className="glass-strong p-6 border-primary/30"><p className="label text-primary mb-2">Key Finding</p><p className="font-display text-2xl">{r.keyMetric}</p></div>}
            {r.summary && <div className="glass p-6"><h3 className="label mb-3">Summary</h3><p className="text-text-secondary leading-relaxed">{r.summary}</p></div>}
            {r.keyFindings && (
              <div className="glass p-6">
                <h3 className="label mb-4">Key Findings</h3>
                <ol className="space-y-3">{r.keyFindings.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold text-xs flex-shrink-0">{i + 1}</span><span className="text-text-secondary text-sm pt-0.5">{f}</span></li>
                ))}</ol>
              </div>
            )}
            {r.surprisingPatterns && (
              <div className="glass p-6">
                <h3 className="label mb-3">Surprising Patterns</h3>
                <ul className="space-y-1">{r.surprisingPatterns.map((p: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {p}</li>)}</ul>
              </div>
            )}
            {r.recommendations && (
              <div className="glass p-6">
                <h3 className="label mb-3">Recommendations</h3>
                <ul className="space-y-1">{r.recommendations.map((r: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {r}</li>)}</ul>
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
