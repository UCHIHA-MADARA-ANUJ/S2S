"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * GlobalFx - Premium ambient effects on every page:
 * - Subtle interactive dot field
 * - Click spark effects
 * - Page transitions
 * - Scroll progress indicator
 */
export function GlobalFx() {
  const path = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); 
  }, [path]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      setScrollProgress(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="grain" aria-hidden />
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(6,182,212,0.06) 0%, transparent 50%)" }} />
      </div>
      {/* Scroll progress bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none origin-left"
        style={{
          background: "linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4)",
          transform: `scaleX(${scrollProgress})`,
          transition: "transform 0.1s linear",
        }}
        aria-hidden
      />
    </>
  );
}
