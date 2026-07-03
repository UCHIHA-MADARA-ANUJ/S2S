"use client";
import { useEffect, useRef, useState } from "react";

/**
 * DotField — React Bits-quality interactive dot grid background
 * Dots bulge away from cursor and sparkle randomly.
 */
export function DotField({
  dotRadius = 1.6,
  dotSpacing = 16,
  cursorRadius = 180,
  cursorForce = 0.35,
  bulgeStrength = 28,
  glowRadius = 220,
  sparkle = true,
  waveAmplitude = 0.4,
  className = "",
  gradientFrom = "rgba(99, 102, 241, 0.6)",
  gradientTo = "rgba(139, 92, 246, 0.35)",
  glowColor = "rgba(99, 102, 241, 0.18)",
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const tRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; mouse.current.x = -9999; mouse.current.y = -9999; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = size.w + "px";
    canvas.style.height = size.h + "px";
    ctx.scale(dpr, dpr);

    const cols = Math.ceil(size.w / dotSpacing);
    const rows = Math.ceil(size.h / dotSpacing);
    // base positions
    const dots: { x: number; y: number; base: { x: number; y: number }; phase: number; sparkle: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * dotSpacing + dotSpacing / 2;
        const y = r * dotSpacing + dotSpacing / 2;
        dots.push({ x, y, base: { x, y }, phase: Math.random() * Math.PI * 2, sparkle: Math.random() });
      }
    }

    const draw = () => {
      tRef.current += 0.016;
      ctx.clearRect(0, 0, size.w, size.h);

      // cursor glow
      if (mouse.current.active) {
        const grd = ctx.createRadialGradient(mouse.current.x, mouse.current.y, 0, mouse.current.x, mouse.current.y, glowRadius);
        grd.addColorStop(0, glowColor);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, size.w, size.h);
      }

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        // wave displacement
        const wx = Math.sin(tRef.current * 0.8 + d.phase) * waveAmplitude * 4;
        const wy = Math.cos(tRef.current * 0.7 + d.phase) * waveAmplitude * 4;

        let dx = 0, dy = 0;
        if (mouse.current.active) {
          const mdx = d.base.x - mouse.current.x;
          const mdy = d.base.y - mouse.current.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < cursorRadius) {
            const f = (1 - dist / cursorRadius);
            const force = f * f * cursorForce * bulgeStrength;
            dx = (mdx / (dist || 1)) * force;
            dy = (mdy / (dist || 1)) * force;
          }
        }
        d.x = d.base.x + dx + wx;
        d.y = d.base.y + dy + wy;

        // distance to cursor for color
        let alpha = 0.35;
        let radius = dotRadius;
        if (mouse.current.active) {
          const distC = Math.sqrt((d.base.x - mouse.current.x) ** 2 + (d.base.y - mouse.current.y) ** 2);
          if (distC < cursorRadius) {
            const t = 1 - distC / cursorRadius;
            alpha = 0.35 + t * 0.6;
            radius = dotRadius + t * 1.5;
          }
        }
        if (sparkle && d.sparkle < 0.03) {
          const s = (Math.sin(tRef.current * 3 + d.phase) + 1) * 0.5;
          if (s > 0.85) {
            radius = dotRadius + 1.5;
            alpha = Math.min(1, alpha + 0.4);
          }
        }

        // gradient color across canvas
        const gx = d.x / Math.max(1, size.w);
        const t = gx;
        const r1 = 99, g1 = 102, b1 = 241;
        const r2 = 139, g2 = 92, b2 = 246;
        const rr = Math.round(r1 + (r2 - r1) * t);
        const gg = Math.round(g1 + (g2 - g1) * t);
        const bb = Math.round(b1 + (b2 - b1) * t);
        ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, dotRadius, dotSpacing, cursorRadius, cursorForce, bulgeStrength, glowRadius, sparkle, waveAmplitude, glowColor, gradientFrom, gradientTo]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      aria-hidden
    />
  );
}

export default DotField;
