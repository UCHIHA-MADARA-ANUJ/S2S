"use client";
import { useEffect } from "react";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: any;
    let raf: number;
    (async () => {
      try {
        const Lenis = (await import("lenis")).default;
        lenis = new Lenis({ duration: 1.1, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
      } catch {}
    })();
    return () => { if (raf) cancelAnimationFrame(raf); if (lenis) lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
