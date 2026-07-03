"use client";
import { useEffect, useRef } from "react";

/**
 * Ballpit — React Bits-quality 3D-feel ball pit physics
 * 2D canvas with metaball-style rendering for a 3D feel.
 */
export interface BallpitProps {
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: string[];
  className?: string;
}

interface Ball {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  c: string;
  rot: number; vrot: number;
}

const DEFAULT_COLORS = ["#6366F1", "#8B5CF6", "#06B6D4", "#EC4899", "#F59E0B"];

export function Ballpit({
  count = 35,
  gravity = 0.25,
  friction = 0.992,
  wallBounce = 0.85,
  followCursor = true,
  colors = DEFAULT_COLORS,
  className = "",
}: BallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: -9999, y: -9999, active: false, down: false });

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

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; mouse.current.x = -9999; };
    const onDown = () => { mouse.current.down = true; };
    const onUp = () => { mouse.current.down = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const w0 = () => window.innerWidth;
    const h0 = () => window.innerHeight;
    const balls: Ball[] = Array.from({ length: count }).map(() => {
      const r = 18 + Math.random() * 24;
      return {
        x: Math.random() * w0(),
        y: Math.random() * h0() * 0.6,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        r,
        c: colors[Math.floor(Math.random() * colors.length)],
        rot: 0,
        vrot: (Math.random() - 0.5) * 0.04,
      };
    });

    const draw = () => {
      const w = w0();
      const h = h0();
      ctx.clearRect(0, 0, w, h);

      // balls
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        b.vy += gravity;
        b.vx *= friction;
        b.vy *= friction;
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.vrot;

        // cursor repel
        if (followCursor && mouse.current.active) {
          const dx = b.x - mouse.current.x;
          const dy = b.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const f = (1 - dist / 150) * 1.4;
            b.vx += (dx / (dist || 1)) * f;
            b.vy += (dy / (dist || 1)) * f;
          }
          if (mouse.current.down && dist < 200) {
            b.vx += (dx / (dist || 1)) * 1.8;
            b.vy += (dy / (dist || 1)) * 1.8 - 4;
          }
        }

        // walls
        if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx * wallBounce; }
        if (b.x + b.r > w) { b.x = w - b.r; b.vx = -b.vx * wallBounce; }
        if (b.y - b.r < 0) { b.y = b.r; b.vy = -b.vy * wallBounce; }
        if (b.y + b.r > h) { b.y = h - b.r; b.vy = -b.vy * wallBounce; }

        // ball-ball
        for (let j = i + 1; j < balls.length; j++) {
          const o = balls[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b.r + o.r;
          if (dist < minDist && dist > 0) {
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist, ny = dy / dist;
            b.x -= nx * overlap;
            b.y -= ny * overlap;
            o.x += nx * overlap;
            o.y += ny * overlap;
            const dvx = o.vx - b.vx;
            const dvy = o.vy - b.vy;
            const dot = dvx * nx + dvy * ny;
            if (dot < 0) {
              b.vx += dot * nx;
              b.vy += dot * ny;
              o.vx -= dot * nx;
              o.vy -= dot * ny;
            }
          }
        }
      }

      // render with shadow
      for (const b of balls) {
        // shadow
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.ellipse(b.x + 4, b.y + b.r + 4, b.r * 0.9, b.r * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        // body
        const grd = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 1, b.x, b.y, b.r);
        grd.addColorStop(0, "#fff");
        grd.addColorStop(0.4, b.c);
        grd.addColorStop(1, "#1a1a1a");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        // specular highlight
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.ellipse(b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.25, b.r * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [count, gravity, friction, wallBounce, followCursor, colors]);

  return <canvas ref={canvasRef} className={`pointer-events-none fixed inset-0 z-0 ${className}`} aria-hidden />;
}

export default Ballpit;
