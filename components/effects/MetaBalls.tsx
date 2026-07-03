"use client";
import { useEffect, useRef } from "react";

/**
 * MetaBalls — React Bits-quality gooey metaball background
 * Smooth animated blobby shapes using canvas + SVG filter.
 */
export interface MetaBallsProps {
  count?: number;
  colors?: string[];
  speed?: number;
  className?: string;
}

interface MB {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  c: string;
}

export function MetaBalls({
  count = 6,
  colors = ["#6366F1", "#8B5CF6", "#06B6D4"],
  speed = 0.5,
  className = "",
}: MetaBallsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    const w0 = () => window.innerWidth;
    const h0 = () => window.innerHeight;
    const balls: MB[] = Array.from({ length: count }).map((_, i) => ({
      x: w0() * (0.2 + 0.6 * Math.random()),
      y: h0() * (0.2 + 0.6 * Math.random()),
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: 120 + Math.random() * 100,
      c: colors[i % colors.length],
    }));
    const t0 = performance.now();
    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      const w = w0();
      const h = h0();
      ctx.clearRect(0, 0, w, h);
      for (const b of balls) {
        b.x += b.vx + Math.sin(t + b.x * 0.001) * 0.3;
        b.y += b.vy + Math.cos(t + b.y * 0.001) * 0.3;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;
        const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grd.addColorStop(0, b.c);
        grd.addColorStop(0.7, b.c + "80");
        grd.addColorStop(1, b.c + "00");
        ctx.fillStyle = grd;
        ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [count, colors, speed]);
  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
        <defs>
          <filter id="metaballs-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>
      </svg>
      <canvas
        ref={canvasRef}
        className={`pointer-events-none fixed inset-0 z-0 ${className}`}
        style={{ filter: "url(#metaballs-goo)" }}
        aria-hidden
      />
    </>
  );
}
export default MetaBalls;
