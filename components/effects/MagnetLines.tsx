"use client";
import { useEffect, useRef, useState } from "react";

/**
 * MagnetLines — React Bits-style magnetic field lines that follow cursor
 */
export interface MagnetLinesProps {
  rows?: number;
  columns?: number;
  containerSize?: string;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  baseAngle?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MagnetLines({
  rows = 9,
  columns = 9,
  containerSize = "100%",
  lineColor = "rgba(99, 102, 241, 0.55)",
  lineWidth = "1px",
  lineHeight = "28px",
  baseAngle = -10,
  className = "",
  style = {},
}: MagnetLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setSize({ w: r.width, h: r.height });
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const handleLeave = () => setPos({ x: -1000, y: -1000 });

  const cellW = size.w / columns;
  const cellH = size.h / rows;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden ${className}`}
      style={{ width: containerSize, height: containerSize, ...style }}
    >
      {Array.from({ length: rows * columns }).map((_, i) => {
        const row = Math.floor(i / columns);
        const col = i % columns;
        const cx = col * cellW + cellW / 2;
        const cy = row * cellH + cellH / 2;
        const mdx = pos.x - cx;
        const mdy = pos.y - cy;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        const maxDist = Math.max(1, Math.min(size.w, size.h) / 2);
        const influence = Math.max(0, 1 - dist / maxDist);
        const angle = pos.x < 0 ? baseAngle : Math.atan2(mdy, mdx) * (180 / Math.PI);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              width: lineWidth,
              height: lineHeight,
              background: lineColor,
              transform: `translate(-50%, -50%) rotate(${angle}deg) scaleY(${0.6 + influence * 1.4})`,
              transition: "transform 0.25s ease-out, background 0.25s ease",
              opacity: 0.3 + influence * 0.7,
            }}
          />
        );
      })}
    </div>
  );
}

export default MagnetLines;
