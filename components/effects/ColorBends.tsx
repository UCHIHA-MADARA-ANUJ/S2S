"use client";
import { useEffect, useRef } from "react";

/**
 * ColorBends — flowing gradient color bands in 3D
 * Uses simple shader-less canvas with noise-driven waves.
 */
export interface ColorBendsProps {
  colors?: string[];
  speed?: number;
  frequency?: number;
  amplitude?: number;
  rotation?: number;
  className?: string;
}

const DEFAULTS_COLORS = ["#6366F1", "#8B5CF6", "#06B6D4", "#EC4899"];

export function ColorBends({
  colors = DEFAULTS_COLORS,
  speed = 0.3,
  frequency = 0.6,
  amplitude = 0.4,
  rotation = 45,
  className = "",
}: ColorBendsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

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

    const hexToRgb = (hex: string) => {
      const h = hex.replace("#", "");
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
      };
    };

    const draw = () => {
      tRef.current += 0.016 * speed;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const bands = 5;
      const t = tRef.current;
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-w / 2, -h / 2);

      for (let b = 0; b < bands; b++) {
        const phase = (b / bands) * Math.PI * 2;
        const yBase = (h / bands) * b + Math.sin(t + phase) * amplitude * 100;
        const c = hexToRgb(colors[b % colors.length]);
        const grad = ctx.createLinearGradient(0, yBase - 120, 0, yBase + 120);
        grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0)`);
        grad.addColorStop(0.5, `rgba(${c.r},${c.g},${c.b},0.55)`);
        grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        const segs = 30;
        ctx.moveTo(0, yBase - 120);
        for (let s = 0; s <= segs; s++) {
          const x = (w * s) / segs;
          const y = yBase + Math.sin((s * frequency + t + phase) * 0.3) * amplitude * 60;
          ctx.lineTo(x, y);
        }
        for (let s = segs; s >= 0; s--) {
          const x = (w * s) / segs;
          const y = yBase + 240 + Math.cos((s * frequency + t + phase) * 0.3) * amplitude * 60;
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [colors, speed, frequency, amplitude, rotation]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      aria-hidden
    />
  );
}

export default ColorBends;
