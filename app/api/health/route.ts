import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Health check — shows whether the AI key is loaded.
 * Visit /api/health to verify your deployment is configured correctly.
 */
export async function GET() {
  const gemini = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10 && !process.env.GEMINI_API_KEY.includes("PLACEHOLDER");
  const supabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  return NextResponse.json({
    ok: gemini,
    ai: {
      gemini,
      message: gemini ? "AI ready" : "GEMINI_API_KEY not set — add it in Vercel Environment Variables"
    },
    supabase,
    node: process.version,
    timestamp: new Date().toISOString()
  }, {
    headers: { "Cache-Control": "no-store" }
  });
}
