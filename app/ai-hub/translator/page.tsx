"use client";
import { useState } from "react";
import { DotField } from "@/components/effects/DotField";
import { Languages, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { TrackAIUsage } from "@/components/ui/TrackAIUsage";

const LANGS = ["Spanish", "French", "German", "Hindi", "Japanese", "Chinese", "Arabic", "Portuguese", "Korean"];

export default function TranslatorPage() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("Hindi");
  const [r, setR] = useState("");
  const [loading, setLoading] = useState(false);

  const translate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, target }) });
      const data = await res.json();
      setR(data.translation || "");
    } catch {} finally { setLoading(false); }
  };

  return (
    <>
      <TrackAIUsage featureId="translator" />
      <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50"><DotField dotSpacing={28} cursorRadius={200} sparkle={false} /></div>
      <div className="relative z-10"><div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-accent flex items-center justify-center mx-auto mb-4">
            <Languages className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-black text-4xl tracking-tight">Translator</h1>
          <p className="text-text-secondary mt-2">Translate insights globally</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-5">
            <select value={target} onChange={e => setTarget(e.target.value)} className="w-full mb-3 bg-surface border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
              {LANGS.map(l => <option key={l}>{l}</option>)}
            </select>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." rows={10} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary resize-none" />
            <button onClick={translate} disabled={loading || !text} className="btn-primary w-full mt-3 disabled:opacity-30">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Translate <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
          <div className="glass p-5">
            <p className="label mb-3">{target} Translation</p>
            <div className="min-h-[280px] p-4 bg-surface rounded-xl text-text-secondary text-sm whitespace-pre-wrap">
              {r || "Translation will appear here..."}
            </div>
          </div>
        </div>
      </div>
    </div>
      </div></div>
    </>
  );
}
