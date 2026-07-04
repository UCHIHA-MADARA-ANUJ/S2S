// Accessibility utilities for SkillVerse (WCAG AA compliant)

/**
 * Generate a unique ID that's stable across SSR/CSR.
 * Uses crypto.randomUUID when available, falls back to time-based.
 */
let _counter = 0;
export function uid(prefix = "sv"): string {
  if (typeof window !== "undefined" && typeof window.crypto?.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID().slice(0, 8)}`;
  }
  _counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${_counter}`;
}

/**
 * Announce a message to screen readers via a polite live region.
 * Safe to call repeatedly — replaces previous message.
 */
export function announce(message: string, priority: "polite" | "assertive" = "polite") {
  if (typeof document === "undefined") return;
  let el = document.getElementById(`sv-announce-${priority}`) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = `sv-announce-${priority}`;
    el.setAttribute("aria-live", priority);
    el.setAttribute("aria-atomic", "true");
    el.className = "sr-only";
    document.body.appendChild(el);
  }
  // Clear then set to ensure screen readers re-announce
  el.textContent = "";
  // Use a microtask delay so AT reliably re-announces same message
  setTimeout(() => { if (el) el.textContent = message; }, 50);
}

/**
 * Trap focus within a container (for modals / dialogs).
 * Returns a cleanup function.
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const handler = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusables = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
      .filter((el) => !el.hasAttribute("aria-hidden") && el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  container.addEventListener("keydown", handler);
  return () => container.removeEventListener("keydown", handler);
}

/**
 * Get a sensible label for a chart/data-viz container.
 * Provides screen-reader summary that complements the visual.
 */
export function chartA11y(title: string, summary: string, points: string[] = []) {
  return {
    role: "img",
    "aria-label": title,
    "aria-describedby": `chart-desc-${uid("c")}`,
    description: `${summary}${points.length ? ". Key points: " + points.join(", ") : ""}`
  };
}

/**
 * Format a number for screen readers (e.g. 1000000 → "1 million").
 */
export function formatForSR(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} million`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)} thousand`;
  return value.toString();
}

/**
 * Detect if user prefers reduced motion (for fx components).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Detect if user prefers high contrast.
 */
export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: more)").matches;
}
