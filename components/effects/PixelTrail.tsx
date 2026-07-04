"use client";
import { useEffect, useRef } from "react";

/**
 * PixelTrail - Cursor-following pixel trail.
 * Renders in a parent container (was fixed inset-0).
 */
export interface PixelTrailProps {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  color?: string;
  className?: string;
}

export function PixelTrail({
  gridSize = 18,
  trailSize = 14,
  maxAge = 1200,
  color = "rgba(139, 92, 246, 0.8)",
  className = "",
}: PixelTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: -9999, y: -9999 });
  const cells = useRef<{ x: number; y: number; t: number }[]>([]);
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

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.floor(dist / (gridSize / 2)));
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        cells.current.push({
          x: lastPos.current.x + dx * t,
          y: lastPos.current.y + dy * t,
          t: Date.now(),
        });
        if (cells.current.length > 400) cells.current.shift();
      }
      lastPos.current = { x, y };
    };
    wrap.addEventListener("mousemove", onMove);

    const draw = () => {
      const now = Date.now();
      const r = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      cells.current = cells.current.filter((c) => now - c.t < maxAge);
      for (const c of cells.current) {
        const age = (now - c.t) / maxAge;
        const alpha = Math.max(0, 1 - age);
        const gx = Math.floor(c.x / gridSize) * gridSize + gridSize / 2;
        const gy = Math.floor(c.y / gridSize) * gridSize + gridSize / 2;
        ctx.fillStyle = color.replace(/[\d.]+\)$/g, `${(alpha * 0.9).toFixed(3)})`);
        ctx.fillRect(gx - trailSize / 2, gy - trailSize / 2, trailSize, trailSize);
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      wrap.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [gridSize, trailSize, maxAge, color]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}

export default PixelTrail;
