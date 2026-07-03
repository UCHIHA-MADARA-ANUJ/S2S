"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * MagicBento — React Bits-style grid of cards with spot-light glow that follows cursor.
 */
export interface MagicBentoProps {
  children: React.ReactNode[];
  columns?: number;
  className?: string;
  glowColor?: string;
  enableStars?: boolean;
  enableBorderGlow?: boolean;
  particleCount?: number;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export function MagicBento({
  children,
  columns = 3,
  className = "",
  glowColor = "rgba(99, 102, 241, 0.4)",
  enableStars = true,
  enableBorderGlow = true,
  particleCount = 12,
  clickEffect = true,
  enableMagnetism = true,
}: MagicBentoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enableStars) return;
    const generated = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.4 + 0.3,
      delay: Math.random() * 4,
    }));
    setStars(generated);
  }, [enableStars]);

  useEffect(() => {
    if (!clickEffect && !enableMagnetism) return;
    const draw = () => {
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= 0.02;
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    if (clickEffect) {
      const onClick = (e: MouseEvent) => {
        for (let i = 0; i < particleCount; i++) {
          const a = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
          particlesRef.current.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(a) * (2 + Math.random() * 2),
            vy: Math.sin(a) * (2 + Math.random() * 2),
            life: 1,
          });
        }
      };
      window.addEventListener("click", onClick);
      rafRef.current = requestAnimationFrame(draw);
      return () => {
        window.removeEventListener("click", onClick);
        cancelAnimationFrame(rafRef.current);
      };
    }
  }, [clickEffect, enableMagnetism, particleCount]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setHoverIdx(idx);
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      className={`grid gap-3 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {children.map((child, i) => (
        <div
          key={i}
          onMouseMove={(e) => handleMove(e, i)}
          onMouseLeave={() => { setHoverIdx(null); setPos(null); }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all"
          style={{
            boxShadow: hoverIdx === i && pos
              ? `${pos.x - 100}px ${pos.y - 100}px 200px ${glowColor}`
              : "none",
            borderColor: hoverIdx === i && enableBorderGlow ? "rgba(99,102,241,0.5)" : undefined,
          }}
        >
          {enableStars && hoverIdx === i && (
            <>
              {stars.map((s, si) => (
                <span
                  key={si}
                  className="pointer-events-none absolute rounded-full bg-white"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.size,
                    height: s.size,
                    animation: `twinkle 2s ${s.delay}s ease-in-out infinite`,
                    opacity: 0.5,
                  }}
                />
              ))}
            </>
          )}
          <div className="relative z-10">{child}</div>
        </div>
      ))}
      {particlesRef.current.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[100]">
          {particlesRef.current.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: p.x,
                top: p.y,
                width: 4,
                height: 4,
                background: glowColor,
                opacity: p.life,
                transform: `scale(${0.5 + p.life})`,
              }}
            />
          ))}
        </div>
      )}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}

export default MagicBento;
