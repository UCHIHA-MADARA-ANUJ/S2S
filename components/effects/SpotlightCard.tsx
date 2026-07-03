"use client";
import { useRef, useState } from "react";

/**
 * SpotlightCard — React Bits-quality card that follows cursor with a spotlight glow
 */
export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  borderColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(99, 102, 241, 0.25)",
  spotlightSize = 400,
  borderColor = "rgba(99, 102, 241, 0.4)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos(null)}
      className={`relative overflow-hidden rounded-2xl border bg-white/[0.02] p-6 transition-colors ${className}`}
      style={{
        borderColor: pos ? borderColor : "rgba(255,255,255,0.08)",
        backgroundImage: pos
          ? `radial-gradient(${spotlightSize}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 50%)`
          : "none",
      }}
    >
      {children}
    </div>
  );
}

export default SpotlightCard;
