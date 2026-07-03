// In-memory IP rate limiting (resets on server restart)
// Tracks: IP -> { count, firstSeen }
const ipMap = new Map<string, { count: number; firstSeen: number }>();
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_SUBMISSIONS = 1; // 1 submission per IP per day

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  const xri = req.headers.get("x-real-ip");
  const cf = req.headers.get("cf-connecting-ip");
  if (xff) return xff.split(",")[0].trim();
  if (xri) return xri.trim();
  if (cf) return cf.trim();
  return "0.0.0.0";
}

export function checkIpRateLimit(ip: string): { allowed: boolean; reason?: string; remaining?: number } {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry) {
    ipMap.set(ip, { count: 1, firstSeen: now });
    return { allowed: true, remaining: 0 };
  }

  // Window expired - reset
  if (now - entry.firstSeen > WINDOW_MS) {
    ipMap.set(ip, { count: 1, firstSeen: now });
    return { allowed: true, remaining: 0 };
  }

  if (entry.count >= MAX_SUBMISSIONS) {
    return { allowed: false, reason: "Already submitted from this IP. Only 1 response per IP allowed." };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_SUBMISSIONS - entry.count };
}

// Cleanup old entries every hour
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipMap.entries()) {
      if (now - entry.firstSeen > WINDOW_MS) ipMap.delete(ip);
    }
  }, 60 * 60 * 1000);
}
