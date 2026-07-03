"use client";
import { useEffect, useRef, useState } from "react";

/**
 * TextPressure — React Bits-quality text that scales with mouse pressure (proximity)
 */
export interface TextPressureProps {
  text: string;
  className?: string;
  minScale?: number;
  maxScale?: number;
  flex?: boolean;
  weight?: boolean;
}

export function TextPressure({
  text,
  className = "",
  minScale = 0.9,
  maxScale = 1.4,
  flex = true,
  weight = true,
}: TextPressureProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [scales, setScales] = useState<number[]>(text.split("").map(() => minScale));
  const [weights, setWeights] = useState<number[]>(text.split("").map(() => 300));
  const chars = text.split("");

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - r.left;
    const spans = ref.current.querySelectorAll("span");
    const nextScales: number[] = [];
    const nextWeights: number[] = [];
    spans.forEach((sp, i) => {
      const sr = (sp as HTMLElement).getBoundingClientRect();
      const cx = sr.left + sr.width / 2 - r.left;
      const dist = Math.abs(mouseX - cx);
      const t = Math.max(0, 1 - dist / 150);
      const s = minScale + (maxScale - minScale) * t;
      const w = 300 + Math.round(700 * t);
      nextScales.push(s);
      nextWeights.push(w);
    });
    setScales(nextScales);
    setWeights(nextWeights);
  };

  const handleLeave = () => {
    setScales(chars.map(() => minScale));
    setWeights(chars.map(() => 300));
  };

  return (
    <h1
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`${flex ? "inline-flex" : ""} select-none ${className}`}
      style={{ lineHeight: 0.9, letterSpacing: "-0.04em" }}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            transform: `scale(${1}, ${scales[i] ?? 1})`,
            fontWeight: weight ? weights[i] ?? 300 : undefined,
            transition: "transform 0.18s ease-out, font-weight 0.18s ease-out",
            whiteSpace: ch === " " ? "pre" : "normal",
            transformOrigin: "bottom",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </h1>
  );
}

export default TextPressure;
