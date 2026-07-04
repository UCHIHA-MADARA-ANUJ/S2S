"use client";
import { useEffect, useRef, useState } from "react";

/**
 * MagicRings — React Bits-quality concentric pulsing rings
 * Responsive: shrinks on small viewports to save GPU.
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
  size: defaultSize = 400,
  className = "",
}: MagicRingsProps) {
  const [t, setT] = useState(0);
  const [size, setSize] = useState(defaultSize);
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

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w < 640) setSize(Math.min(defaultSize, 320));
      else if (w < 1024) setSize(Math.min(defaultSize, 480));
      else setSize(defaultSize);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [defaultSize]);

  return (
    <div
      ref={ref}
      className={`relative pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {Array.from({ length: rings }).map((_, i) => {
          const radius = 48 - i * 9;
          const phase = t * 0.6 + i * 0.3;
          const scale = 1 + Math.sin(phase) * 0.04;
          const opacity = 0.18 + (Math.sin(phase) * 0.5 + 0.5) * 0.2;
          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="0.4"
              opacity={opacity}
              style={{
                transformOrigin: "50% 50%",
                transform: `scale(${scale})`,
                transition: "opacity 0.3s",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
