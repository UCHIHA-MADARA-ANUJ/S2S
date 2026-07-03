"use client";
import { useEffect, useRef, useState, createElement } from "react";

export interface ScrollRevealProps {
  children: React.ReactNode;
  effect?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "rotate" | "blur" | "flip";
  duration?: number;
  delay?: number;
  distance?: number;
  threshold?: number;
  className?: string;
  as?: "div" | "section" | "span" | "p" | "h1" | "h2" | "h3";
}

export function ScrollReveal({
  children,
  effect = "slide-up",
  duration = 0.8,
  delay = 0,
  distance = 30,
  threshold = 0.15,
  className = "",
  as = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTimeout(() => setVisible(true), delay * 1000);
            observer.unobserve(el);
          }
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const initial: React.CSSProperties = {
    opacity: 0,
    transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  };
  const visible2: React.CSSProperties = {
    opacity: 1,
    transform: "none",
    filter: "blur(0px)",
  };

  const initialMap: Record<string, React.CSSProperties> = {
    fade: { ...initial },
    "slide-up": { ...initial, transform: `translateY(${distance}px)` },
    "slide-down": { ...initial, transform: `translateY(-${distance}px)` },
    "slide-left": { ...initial, transform: `translateX(${distance}px)` },
    "slide-right": { ...initial, transform: `translateX(-${distance}px)` },
    scale: { ...initial, transform: `scale(0.9)` },
    rotate: { ...initial, transform: `rotate(-8deg)` },
    blur: { ...initial, filter: `blur(${distance / 6}px)` },
    flip: { ...initial, transform: `rotateX(${distance * 2}deg)` },
  };

  const style = visible ? visible2 : initialMap[effect] ?? initial;

  return createElement(
    as,
    { ref, className, style } as any,
    children
  );
}

export default ScrollReveal;
