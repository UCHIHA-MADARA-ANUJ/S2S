"use client";
import { useEffect, useState } from "react";

/**
 * CustomCursor - Single, elegant, premium cursor.
 * No mix-blend-mode (which causes weird color inversions).
 * Just a clean dot + ring with smooth animation.
 */
export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [click, setClick] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setHidden(false);

    let raf = 0;
    let targetX = -100, targetY = -100;
    let curX = -100, curY = -100;

    const animate = () => {
      // Smooth lerp for ring
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      const ring = document.getElementById("sv-cursor-ring");
      if (ring) ring.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const move = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const dot = document.getElementById("sv-cursor-dot");
      if (dot) dot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
      const t = e.target as HTMLElement;
      const isHoverable = t.closest("a, button, [data-cursor='hover'], input, textarea, [role='button']");
      const cursorText = t.closest("[data-cursor-text]")?.getAttribute("data-cursor-text");
      setHover(!!isHoverable);
      setText(cursorText || "");
    };
    const onClick = () => {
      setClick(true);
      setTimeout(() => setClick(false), 220);
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", onClick);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onClick);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        id="sv-cursor-ring"
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9998,
          width: hover ? 56 : 36,
          height: hover ? 56 : 36,
          borderRadius: "50%",
          border: `2px solid ${hover ? "rgba(167, 139, 250, 1)" : "rgba(255, 255, 255, 0.7)"}`,
          background: hover ? "rgba(167, 139, 250, 0.08)" : "transparent",
          transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease",
          transform: "translate(-100px, -100px) translate(-50%, -50%)",
          willChange: "transform",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: hover ? "0 0 24px rgba(167, 139, 250, 0.5)" : "none",
        }}
      >
        {text && (
          <span
            style={{
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {text}
          </span>
        )}
        {click && (
          <span
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              border: "2px solid rgba(167, 139, 250, 0.6)",
              animation: "sv-cursor-pulse 0.4s ease-out",
            }}
          />
        )}
      </div>
      {/* Center dot */}
      <div
        id="sv-cursor-dot"
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          width: hover ? 0 : 6,
          height: hover ? 0 : 6,
          borderRadius: "50%",
          background: hover ? "transparent" : "#A78BFA",
          transition: "width 0.18s ease, height 0.18s ease, background 0.18s ease",
          transform: "translate(-100px, -100px) translate(-50%, -50%)",
          boxShadow: hover ? "none" : "0 0 8px rgba(167, 139, 250, 0.8)",
        }}
      />
      <style jsx global>{`
        @keyframes sv-cursor-pulse {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(1.5); opacity: 0; }
        }
        @media (pointer: fine) {
          html, body, a, button, [role="button"], input, textarea, select, label {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default CustomCursor;
