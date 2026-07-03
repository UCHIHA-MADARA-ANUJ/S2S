"use client";
import { useEffect, useRef, createElement } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SplitTextProps {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  onLetterAnimationComplete?: () => void;
}

const DEFAULTS = {
  from: { opacity: 0, y: 40 },
  to: { opacity: 1, y: 0 },
};

export function SplitText({
  text,
  className = "",
  tag = "p",
  delay = 30,
  duration = 0.8,
  ease = "power3.out",
  splitType = "chars",
  from = DEFAULTS.from,
  to = DEFAULTS.to,
  threshold = 0.1,
  rootMargin = "-50px",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current as HTMLElement;
    el.style.textAlign = textAlign;
    const orig = el.textContent || "";
    el.textContent = "";

    type Unit = { ch: string; el: HTMLSpanElement };
    const units: Unit[] = [];

    if (splitType === "chars") {
      for (const ch of orig) {
        const s = document.createElement("span");
        s.style.display = "inline-block";
        s.textContent = ch === " " ? "\u00A0" : ch;
        s.style.willChange = "transform, opacity";
        el.appendChild(s);
        units.push({ ch, el: s });
      }
    } else if (splitType === "words" || splitType === "lines") {
      for (const w of orig.split(/\s+/)) {
        if (!w) continue;
        const s = document.createElement("span");
        s.style.display = "inline-block";
        s.style.marginRight = "0.3em";
        s.textContent = w;
        s.style.willChange = "transform, opacity";
        el.appendChild(s);
        units.push({ ch: w, el: s });
      }
    } else {
      for (const w of orig.split(/\s+/)) {
        if (!w) continue;
        const s = document.createElement("span");
        s.style.display = "inline-block";
        s.style.marginRight = "0.3em";
        s.textContent = w;
        s.style.willChange = "transform, opacity";
        el.appendChild(s);
        units.push({ ch: w, el: s });
      }
    }

    gsap.set(units.map((u) => u.el), from);

    const anim = gsap.to(units.map((u) => u.el), {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      scrollTrigger: {
        trigger: el,
        start: `top ${(1 - threshold) * 100}%${rootMargin ? ` ${rootMargin}` : ""}`,
        toggleActions: "play none none none",
      },
      onComplete: () => onLetterAnimationComplete?.(),
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [text, delay, duration, ease, splitType, threshold, rootMargin, textAlign, from, to, onLetterAnimationComplete]);

  return createElement(
    tag,
    { ref, className, style: { textAlign } } as any,
    text
  );
}

export default SplitText;
