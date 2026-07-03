"use client";
import { useEffect, useRef, useState } from "react";

/**
 * CountUp — React Bits-style number count-up animation
 * Animates from 0 to target value with easing on mount/visible.
 */
export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  separator?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  separator = ",",
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpProps) {
  const [val, setVal] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            setTimeout(() => {
              const start = performance.now();
              const tick = (now: number) => {
                const t = Math.min(1, (now - start) / (duration * 1000));
                const eased = 1 - Math.pow(1 - t, 3);
                setVal(from + (to - from) * eased);
                if (t < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            }, delay);
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, from, duration, delay]);

  const formatted = val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

export default CountUp;
