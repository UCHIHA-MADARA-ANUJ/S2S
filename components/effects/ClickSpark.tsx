"use client";
import { useEffect, useRef } from "react";

/**
 * ClickSpark — React Bits-quality spark explosion on click
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
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  className = "",
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    onResize();
    window.addEventListener("resize", onResize);

    const easeMap: Record<string, (t: number) => number> = {
      linear: (t) => t,
      "ease-in": (t) => t * t,
      "ease-out": (t) => 1 - (1 - t) * (1 - t),
      "ease-in-out": (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    };
    const ease = easeMap[easing] ?? easeMap["ease-out"];

    const onClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
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
    window.addEventListener("click", onClick);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);

  return <canvas ref={canvasRef} className={`pointer-events-none fixed inset-0 z-[90] ${className}`} aria-hidden />;
}

export default ClickSpark;
