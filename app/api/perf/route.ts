import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Lightweight health check that returns server timing info.
 * Useful for verifying deployment + measuring cold-start latency.
 */
export async function GET() {
  const t0 = performance.now();
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Number(uptime.toFixed(2)),
    memoryMB: {
      rss: Number((memory.rss / 1024 / 1024).toFixed(1)),
      heap: Number((memory.heapUsed / 1024 / 1024).toFixed(1)),
      heapTotal: Number((memory.heapTotal / 1024 / 1024).toFixed(1))
    },
    node: process.version,
    platform: process.platform,
    computeMs: Number((performance.now() - t0).toFixed(2))
  });
}
