"use client";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [click, setClick] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setHidden(false);

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target as HTMLElement;
      setHover(!!(t.closest("a, button, [data-cursor='hover'], input, textarea, [role='button']")));
    };
    const onClick = () => { setClick(true); setTimeout(() => setClick(false), 200); };
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
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          transform: `translate(${pos.x - 4}px, ${pos.y - 4}px)`,
          transition: "transform 0.05s linear"
        }}
      >
        <div className={`w-2 h-2 rounded-full bg-primary transition-all duration-200 ${click ? "scale-150" : ""}`} />
      </div>
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9998] mix-blend-difference transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${pos.x - (hover ? 20 : 16)}px, ${pos.y - (hover ? 20 : 16)}px) scale(${click ? 0.8 : 1})`
        }}
      >
        <div className={`rounded-full border transition-all duration-300 ${hover ? "w-10 h-10 border-primary" : "w-8 h-8 border-white/40"}`} />
      </div>
    </>
  );
}
