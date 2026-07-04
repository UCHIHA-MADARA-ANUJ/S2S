"use client";
import { useEffect, useRef } from "react";

/**
 * ClickSpark - Spark explosion on click.
 * Renders in a parent container.
 */
export interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  className?: string;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  vx: number;
  vy: number;
  start: number;
  color: string;
}

export function ClickSpark({
  sparkColor = "#A78BFA",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  className = "",
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onResize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = r.width + "px";
      canvas.style.height = r.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);
    window.addEventListener("resize", onResize);

    const easeMap: Record<string, (t: number) => number> = {
      linear: (t) => t,
      "ease-in": (t) => t * t,
      "ease-out": (t) => 1 - (1 - t) * (1 - t),
      "ease-in-out": (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    };
    const ease = easeMap[easing] ?? easeMap["ease-out"];

    const onClick = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const now = performance.now();
      for (let i = 0; i < sparkCount; i++) {
        sparksRef.current.push({
          x,
          y,
          angle: (Math.PI * 2 * i) / sparkCount,
          vx: Math.cos((Math.PI * 2 * i) / sparkCount) * sparkRadius,
          vy: Math.sin((Math.PI * 2 * i) / sparkCount) * sparkRadius,
          start: now,
          color: sparkColor,
        });
      }
    };
    wrap.addEventListener("click", onClick);

    const draw = () => {
      const r = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      const now = performance.now();
      sparksRef.current = sparksRef.current.filter((s) => now - s.start < duration);
      for (const s of sparksRef.current) {
        const t = (now - s.start) / duration;
        const e = ease(t);
        const dist = e * sparkRadius * extraScale;
        const x = s.x + Math.cos(s.angle) * dist;
        const y = s.y + Math.sin(s.angle) * dist;
        const alpha = Math.max(0, 1 - t);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, y, (sparkSize / 2) * (1 - t * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      wrap.removeEventListener("click", onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}

export default ClickSpark;
