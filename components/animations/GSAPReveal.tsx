"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GSAPReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const ctx = gsap.context(() => {
        // Section reveals - use gsap.fromTo with a from that matches current state to avoid stuck invisible
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          // Skip if element is already in viewport - show immediately
          const rect = el.getBoundingClientRect();
          const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
          if (inView) return;

          gsap.fromTo(el, 
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }
          );
        });

        // Text splits for headlines - skip if in view, immediate
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          const rect = el.getBoundingClientRect();
          const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
          if (inView) return;

          const text = el.textContent || "";
          el.innerHTML = text.split(" ").map(w => `<span class="inline-block overflow-hidden"><span class="inline-block">${w}</span></span>`).join(" ");
          gsap.fromTo(el.querySelectorAll("span > span"),
            { yPercent: 110 },
            { yPercent: 0, duration: 0.8, stagger: 0.04, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }
          );
        });

        // Parallax
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = parseFloat(el.dataset.parallax || "0.2");
          gsap.to(el, {
            yPercent: -50 * speed,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
          });
        });
      });

      return () => ctx.revert();
    } catch (e) {
      // If GSAP fails, content is still visible
      console.warn("GSAPReveal failed:", e);
    }
  }, []);

  return null;
}
