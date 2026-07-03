"use client";
import { useEffect, useRef, useState } from "react";

/**
 * CardSwap — React Bits-quality stacked card swipe animation
 * Cards in front can be dragged/swapped with smooth transitions.
 */
export interface CardSwapProps {
  children: React.ReactNode[];
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function CardSwap({
  children,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  className = "",
}: CardSwapProps) {
  const [order, setOrder] = useState<number[]>(children.map((_, i) => i));
  const intervalRef = useRef<number>(0);
  const paused = useRef(false);

  useEffect(() => {
    const tick = () => {
      if (pauseOnHover && paused.current) return;
      setOrder((o) => {
        if (o.length < 2) return o;
        const next = [...o];
        next.push(next.shift()!);
        return next;
      });
    };
    intervalRef.current = window.setInterval(tick, delay);
    return () => clearInterval(intervalRef.current);
  }, [delay, pauseOnHover]);

  return (
    <div
      className={`relative h-[500px] w-full ${className}`}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      style={{ perspective: 1000 }}
    >
      {children.map((child, idx) => {
        const pos = order.indexOf(idx);
        if (pos === -1) return null;
        const isFront = pos === order.length - 1;
        return (
          <div
            key={idx}
            className="absolute inset-0 transition-all duration-700 ease-out"
            style={{
              transform: `
                translateX(${(pos - (order.length - 1)) * cardDistance}px)
                translateY(${(pos - (order.length - 1)) * verticalDistance}px)
                scale(${1 - (order.length - 1 - pos) * 0.05})
                ${isFront ? "rotateY(0deg)" : "rotateY(15deg)"}
              `,
              zIndex: pos,
              opacity: pos < order.length - 2 ? 0 : 1,
              pointerEvents: isFront ? "auto" : "none",
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

export default CardSwap;
