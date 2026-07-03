"use client";
import { useEffect, useState } from "react";

export function useFingerprint() {
  const [fp, setFp] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const done = localStorage.getItem("sv-done") === "1";
      if (done) { setCompleted(true); setLoading(false); return; }
    } catch {}
    import("@fingerprintjs/fingerprintjs").then(async (mod: any) => {
      try {
        const f = await mod.load();
        const id: string = f.visitorId;
        setFp(id);
        const res = await fetch(`/api/survey/check?fp=${id}`);
        const d = await res.json();
        setCompleted(d.exists);
      } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return { fp, completed, loading };
}
