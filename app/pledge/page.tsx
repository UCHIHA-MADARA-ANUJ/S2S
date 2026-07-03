"use client";
import { useState } from "react";
import { Sparkles, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PledgePage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!name) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/pledge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, city }) });
      if (res.ok) { setDone(true); toast.success("Pledge recorded!"); }
      else toast.error("Failed");
    } catch { toast.error("Network error"); } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter mb-4">Take the Pledge.</h1>
        <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
          Commit to using digital platforms more intentionally. Be part of a movement that proves screens can build skills.
        </p>
        {done ? (
          <div className="glass p-8">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display font-black text-3xl mb-3">You're in.</h2>
            <p className="text-text-secondary">Thanks for pledging, {name}. The movement grows.</p>
          </div>
        ) : (
          <div className="glass p-8 max-w-md mx-auto text-left space-y-4">
            <div>
              <label className="label block mb-2">Your Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Anuj" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="label block mb-2">City (optional)</label>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="Gurugram" className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" />
            </div>
            <button onClick={submit} disabled={submitting || !name} className="btn-primary w-full disabled:opacity-30">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "I pledge"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
