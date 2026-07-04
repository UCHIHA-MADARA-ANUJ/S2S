// Lightweight device fingerprint generator (no external lib).
// Combines stable browser features into a stable hash for dedup purposes.
// NOT cryptographic — only used to prevent double-submissions on the same device.

const STORAGE_KEY = "sv:fp:v1";

function getStableFeatures(): string {
  if (typeof window === "undefined") return "ssr";
  const parts: string[] = [];
  try {
    parts.push(`screen:${screen.width}x${screen.height}x${screen.colorDepth}`);
    parts.push(`tz:${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
    parts.push(`lang:${navigator.language}`);
    parts.push(`plat:${(navigator as any).platform || "?"}`);
    parts.push(`hw:${(navigator as any).hardwareConcurrency || 0}`);
    parts.push(`mem:${(navigator as any).deviceMemory || 0}`);
    parts.push(`ua:${navigator.userAgent}`);
    // Canvas fingerprint
    try {
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      if (ctx) {
        c.width = 200; c.height = 50;
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(100, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.font = "14px Arial";
        ctx.fillText("SkillVerse-FP-2026", 2, 15);
        parts.push(`cv:${c.toDataURL().slice(-64)}`);
      }
    } catch {}
  } catch {}
  return parts.join("|");
}

// FNV-1a hash (good enough for non-crypto dedup)
function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

let cached: string | null = null;

export async function getFingerprint(): Promise<string> {
  if (typeof window === "undefined") return "ssr";
  if (cached) return cached;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) { cached = stored; return stored; }
  } catch {}
  const fp = `sv1-${fnv1a(getStableFeatures())}`;
  try { localStorage.setItem(STORAGE_KEY, fp); } catch {}
  cached = fp;
  return fp;
}

/** Hook-friendly sync version. Returns cached or null. */
export function getCachedFingerprint(): string | null {
  if (typeof window === "undefined") return null;
  if (cached) return cached;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) { cached = stored; return stored; }
  } catch {}
  return null;
}

/** Clears the stored fingerprint (admin override / "Submit again" button). */
export function resetFingerprint(): void {
  cached = null;
  if (typeof window !== "undefined") {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }
}
