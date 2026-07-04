"use client";
import { useState, useEffect } from "react";
import { Sparkles, Heart, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/components/ui/Celebration";
import { DotField } from "@/components/effects/DotField";
import { CountUp } from "@/components/effects/CountUp";
import { StarBorder } from "@/components/effects/StarBorder";
import { MagicRings } from "@/components/effects/MagicRings";

export default function PledgePage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(247);

  useEffect(() => {
    // Try to fetch real pledge count
    fetch("/api/pledge")
      .then(r => r.json())
      .then(d => { if (d.count) setCount(d.count); })
      .catch(() => {});
  }, []);

  const submit = async () => {
    if (!name) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/pledge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, city }) });
      if (res.ok) { setDone(true); setCount(c => c + 1); trackEvent("signedPledge", true); toast.success("Pledge recorded! 🎉"); }
      else toast.error("Failed to record");
    } catch { toast.error("Network error"); } finally { setSubmitting(false); }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden flex items-center justify-center">
      {/* DotField background */}
      <div className="absolute inset-0 z-0">
        <DotField dotSpacing={20} cursorRadius={250} sparkle />
      </div>
      {/* MagicRings decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 opacity-20">
        <MagicRings rings={5} size={500} />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto text-center w-full">
        {/* Live counter */}
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm"><CountUp to={count} duration={2} /></span>
          <span className="text-text-muted text-sm">pledged so far</span>
        </div>
        <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter mb-4">Take the Pledge.</h1>
        <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
          Commit to using digital platforms more intentionally. Be part of a movement that proves screens can build skills.
        </p>
        {done ? (
          <div className="glass p-8 max-w-md mx-auto" data-reveal>
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <h2 className="font-display font-black text-3xl mb-3">You're in.</h2>
            <p className="text-text-secondary">Thanks for pledging, {name}. The movement grows.</p>
          </div>
        ) : (
          <div className="glass p-8 max-w-md mx-auto text-left space-y-4" data-reveal>
            <div>
              <label className="label block mb-2">Your Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Anuj" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="label block mb-2">City (optional)</label>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="Gurugram" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition" />
            </div>
            <StarBorder color="#6366F1" speed={5} className="block">
              <button onClick={submit} disabled={submitting || !name} className="w-full px-6 py-3 font-semibold text-white disabled:opacity-30 flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Heart className="w-4 h-4" /> I pledge</>}
              </button>
            </StarBorder>
          </div>
        )}
      </div>
    </div>
  );
}
