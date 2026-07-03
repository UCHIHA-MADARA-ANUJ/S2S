"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function GlobalFx() {
  const path = usePathname();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [path]);
  return (
    <>
      <div className="grain" aria-hidden />
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 0%, rgba(255,61,46,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(0,225,255,0.04) 0%, transparent 50%)" }} />
      </div>
    </>
  );
}
