"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const NAV: Record<string, string> = {
  h: "/", d: "/dashboard", r: "/research", a: "/ai-hub", s: "/survey",
  f: "/showcase", w: "/workspace", t: "/team", b: "/about", p: "/pledge",
  i: "/insights", k: "/skills", l: "/platforms", m: "/docs"
};

export function useKeyboardShortcuts(onShowHelp: () => void) {
  const router = useRouter();
  useEffect(() => {
    let lastG = 0;
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const isInput = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

      // ? → help
      if (e.key === "?" && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onShowHelp();
        return;
      }

      // g + <letter> → navigate
      if (e.key === "g" && !isInput && !e.metaKey && !e.ctrlKey) {
        lastG = Date.now();
        const next = (e2: KeyboardEvent) => {
          if (Date.now() - lastG > 1000) return;
          const k = e2.key.toLowerCase();
          if (NAV[k]) {
            e2.preventDefault();
            router.push(NAV[k]);
          }
          window.removeEventListener("keydown", next, { capture: true });
        };
        window.addEventListener("keydown", next, { capture: true });
        setTimeout(() => window.removeEventListener("keydown", next, { capture: true }), 1100);
        return;
      }

      // / → focus search (any page)
      if (e.key === "/" && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const el = document.querySelector<HTMLInputElement>('input[type="search"], input[aria-label*="Search" i]');
        if (el) el.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router, onShowHelp]);
}

export function useShortcutsModal() {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") hide(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, hide]);
  return { open, show, hide, setOpen };
}
