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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Section reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true }
        });
      });

      // Text splits for headlines
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        const text = el.textContent || "";
        el.innerHTML = text.split(" ").map(w => `<span class="inline-block overflow-hidden"><span class="inline-block">${w}</span></span>`).join(" ");
        gsap.from(el.querySelectorAll("span > span"), {
          yPercent: 110,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true }
        });
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
  }, []);

  return null;
}
