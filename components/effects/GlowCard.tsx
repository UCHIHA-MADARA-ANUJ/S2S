"use client";
import { useEffect, useRef, useState } from "react";

/**
 * GlowCard — React Bits-quality card with animated gradient border
 */
export interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColors?: string[];
  size?: number;
}

export function GlowCard({
  children,
  className = "",
  glowColors = ["#6366F1", "#8B5CF6", "#06B6D4", "#EC4899"],
  size = 200,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setAngle((a) => (a + 0.5) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const stops = glowColors.map((c, i) => `${c} ${(i * 100) / glowColors.length}%`).join(", ");

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl ${className}`}
      style={{
        background: `linear-gradient(${angle}deg, ${stops})`,
        padding: 2,
      }}
    >
      <div
        className="relative h-full w-full rounded-[14px] bg-surface/95 p-6 backdrop-blur"
      >
        {children}
      </div>
    </div>
  );
}

export default GlowCard;
