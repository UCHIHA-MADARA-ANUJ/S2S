"use client";
import { useEffect, useRef, useState } from "react";

export interface AnimatedContentProps {
  children: React.ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  className?: string;
}

export function AnimatedContent({
  children,
  distance = 80,
  direction = "vertical",
  reverse = false,
  duration = 1.2,
  ease = "cubic-bezier(0.16, 1, 0.3, 1)",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.15,
  delay = 0,
  className = "",
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Start visible to avoid invisible content bug
  const [visible, setVisible] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Check if already in view
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * (1 - threshold) && rect.bottom > 0;
    if (inView) {
      setHasAnimated(true);
      return;
    }
    setVisible(false);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTimeout(() => {
              setVisible(true);
              setHasAnimated(true);
            }, delay * 1000);
            observer.unobserve(el);
          }
        }
      },
      { threshold }
    );
    observer.observe(el);
    const fallback = setTimeout(() => {
      setVisible(true);
      setHasAnimated(true);
    }, 3000);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [delay, threshold]);

  const initial: React.CSSProperties = {
    opacity: animateOpacity ? initialOpacity : 1,
    transform: direction === "vertical"
      ? `translateY(${reverse ? -distance : distance}px) scale(${scale === 1 ? 1 : scale})`
      : `translateX(${reverse ? -distance : distance}px) scale(${scale === 1 ? 1 : scale})`,
    transition: `transform ${duration}s ${ease}, opacity ${duration}s ${ease}`,
  };
  const animated: React.CSSProperties = {
    opacity: 1,
    transform: "none",
  };

  return (
    <div ref={ref} className={className} style={(visible || hasAnimated) ? animated : initial}>
      {children}
    </div>
  );
}

export default AnimatedContent;
