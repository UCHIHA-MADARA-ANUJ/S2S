"use client";
import { useEffect, useRef, useState } from "react";

/**
 * StarBorder — React Bits-quality animated star border that rotates
 */
export interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  speed?: number;
  thickness?: number;
}

export function StarBorder({
  children,
  className = "",
  color = "#6366F1",
  speed = 6,
  thickness = 2,
}: StarBorderProps) {
  const [angle, setAngle] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setAngle((a) => (a + (360 / (speed * 60))) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from ${angle}deg, transparent 0deg, ${color} 90deg, transparent 180deg, ${color} 270deg, transparent 360deg)`,
          padding: thickness,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative rounded-2xl bg-surface/80 backdrop-blur p-6">
        {children}
      </div>
    </div>
  );
}

export default StarBorder;
