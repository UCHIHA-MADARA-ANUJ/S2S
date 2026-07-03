"use client";
import { useEffect, useRef, useState } from "react";

/**
 * MagicRings — React Bits-quality concentric pulsing rings
 */
export interface MagicRingsProps {
  rings?: number;
  colors?: string[];
  size?: number;
  className?: string;
}

export function MagicRings({
  rings = 4,
  colors = ["#6366F1", "#8B5CF6", "#06B6D4", "#EC4899"],
  size = 400,
  className = "",
}: MagicRingsProps) {
  const [t, setT] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setT((p) => p + 0.016);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {Array.from({ length: rings }).map((_, i) => {
        const phase = (t * 1.2 + i * 0.4) % 1;
        const scale = 0.4 + phase * 1.2;
        const opacity = (1 - phase) * 0.6;
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className="absolute rounded-full border-2"
            style={{
              width: size * 0.6,
              height: size * 0.6,
              borderColor: color,
              transform: `scale(${scale})`,
              opacity,
              boxShadow: `0 0 ${30 + phase * 40}px ${color}66`,
            }}
          />
        );
      })}
    </div>
  );
}

export default MagicRings;
