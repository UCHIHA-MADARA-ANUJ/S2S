"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";

export interface Tilt3DCardProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  scale?: number;
  glow?: boolean;
  glowColor?: string;
}

export function Tilt3DCard({
  href,
  children,
  className = "",
  intensity = 12,
  scale = 1.03,
  glow = true,
  glowColor = "rgba(99, 102, 241, 0.35)",
}: Tilt3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [supportsTilt, setSupportsTilt] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) setSupportsTilt(false);
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || !supportsTilt) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTransform(`perspective(1000px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(${scale}, ${scale}, ${scale})`);
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      setGlare({ x: px, y: py, opacity: 1 });
    },
    [intensity, scale, supportsTilt]
  );
  const onLeave = useCallback(() => {
    setTransform(`perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)`);
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  const card = (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative transition-transform duration-300 ${className}`}
      style={{ transform, transformStyle: "preserve-3d" }}
    >
      {children}
      {glow && supportsTilt && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, ${glowColor}, transparent 60%)`,
          }}
        />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    );
  }
  return card;
}

export default Tilt3DCard;
