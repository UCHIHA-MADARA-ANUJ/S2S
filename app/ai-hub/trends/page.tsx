"use client";
import { useState } from "react";
import { DotField } from "@/components/effects/DotField";
import { TrendingUp, Loader2, Sparkles } from "lucide-react";
import { TrackAIUsage } from "@/components/ui/TrackAIUsage";

export default function TrendsPage() {
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState<any>(null);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/trend", { method: "POST" });
      const data = await res.json();
      setR(data.data || data);
    } catch {} finally { setLoading(false); }
  };

  return (
    <>
      <TrackAIUsage featureId="trends" />
      <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50"><DotField dotSpacing={28} cursorRadius={200} sparkle={false} /></div>
      <div className="relative z-10"><div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-primary flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-black text-4xl tracking-tight">Trend Predictor</h1>
          <p className="text-text-secondary mt-2">AI-powered digital learning forecasts</p>
        </div>

        {!r && !loading && (
          <div className="text-center">
            <button onClick={analyze} className="btn-primary text-base">Predict Trends</button>
          </div>
        )}

        {loading && (
          <div className="glass p-16 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-text-secondary">Analyzing patterns...</p>
          </div>
        )}

        {r && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {r.risingTrends && (
              <div className="glass p-6">
                <h3 className="label text-success mb-4">↗ Rising</h3>
                <ul className="space-y-2">{r.risingTrends.map((t: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {t}</li>)}</ul>
              </div>
            )}
            {r.fallingTrends && (
              <div className="glass p-6">
                <h3 className="label text-error mb-4">↘ Falling</h3>
                <ul className="space-y-2">{r.fallingTrends.map((t: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {t}</li>)}</ul>
              </div>
            )}
            {r.predictions && (
              <div className="glass p-6 md:col-span-2">
                <h3 className="label mb-4">Predictions</h3>
                <div className="space-y-3">{r.predictions.map((p: any, i: number) => (
                  <div key={i} className="p-4 bg-surface rounded-lg border border-white/5">
                    <p className="font-display font-bold">{p.topic}</p>
                    <p className="text-text-secondary text-sm mt-1">{p.prediction}</p>
                    <p className="text-primary text-xs font-mono mt-2">Confidence: {p.confidence}%</p>
                  </div>
                ))}</div>
              </div>
            )}
            {r.adviceForStudents && (
              <div className="glass p-6 md:col-span-2">
                <h3 className="label mb-3">For Students</h3>
                <ul className="space-y-1">{r.adviceForStudents.map((a: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {a}</li>)}</ul>
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
