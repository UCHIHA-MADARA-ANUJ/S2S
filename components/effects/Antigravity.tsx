"use client";
import { useEffect, useRef } from "react";

/**
 * Antigravity - Floating geometric shapes in a parent container.
 */
export interface AntigravityProps {
  count?: number;
  color?: string;
  sizeRange?: [number, number];
  className?: string;
}

interface Shape {
  x: number; y: number;
  vx: number; vy: number;
  rot: number; vrot: number;
  type: "sq" | "ci" | "tr";
  size: number;
  opacity: number;
}

export function Antigravity({
  count = 40,
  color = "#6366F1",
  sizeRange = [12, 36],
  className = "",
}: AntigravityProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: -9999, y: -9999, active: false });

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
      mouse.current.x = e.clientX - r.left;
      mouse.current.y = e.clientY - r.top;
      mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; mouse.current.x = -9999; };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    const types: Shape["type"][] = ["sq", "ci", "tr"];
    const shapes: Shape[] = Array.from({ length: count }).map(() => {
      const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      return {
        x: Math.random() * wrap.clientWidth,
        y: Math.random() * wrap.clientHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.4 - Math.random() * 0.6,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.02,
        type: types[Math.floor(Math.random() * 3)],
        size,
        opacity: 0.3 + Math.random() * 0.5,
      };
    });

    const draw = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const s of shapes) {
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.vrot;
        if (s.y + s.size < 0) { s.y = h + s.size; s.x = Math.random() * w; }
        if (s.x < -s.size) s.x = w + s.size;
        if (s.x > w + s.size) s.x = -s.size;

        if (mouse.current.active) {
          const dx = s.x - mouse.current.x;
          const dy = s.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const f = (1 - dist / 150) * 0.6;
            s.vx += (dx / dist) * f;
            s.vy += (dy / dist) * f;
          }
        }
        s.vx *= 0.99;
        s.vy = s.vy * 0.99 - 0.005;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.globalAlpha = s.opacity;
        ctx.lineWidth = 1.5;
        if (s.type === "sq") {
          ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
        } else if (s.type === "ci") {
          ctx.beginPath();
          ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -s.size / 2);
          ctx.lineTo(s.size / 2, s.size / 2);
          ctx.lineTo(-s.size / 2, s.size / 2);
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [count, color, sizeRange]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}

export default Antigravity;
