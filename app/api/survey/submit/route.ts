import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getClientIp, checkIpRateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req as unknown as Request);
    const rateCheck = checkIpRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, error: rateCheck.reason || "Rate limited" }, { status: 429 });
    }

    const body = await req.json();
    const supabase = createServerClient();
    if (!supabase) return NextResponse.json({ success: true, id: "dev" });

    // Try with ip_hash first, fall back without
    let result = await supabase
      .from("survey_responses")
      .insert({ ...body, source: "website", ip_hash: hashIp(ip) })
      .select("id")
      .single();

    if (result.error && result.error.message.includes("ip_hash")) {
      // ip_hash column doesn't exist yet, retry without
      result = await supabase
        .from("survey_responses")
        .insert({ ...body, source: "website" })
        .select("id")
        .single();
    }

    if (result.error) return NextResponse.json({ success: false, error: result.error.message }, { status: 500 });
    return NextResponse.json({ success: true, id: result.data.id });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}

function hashIp(ip: string): string {
  let h = 0;
  for (let i = 0; i < ip.length; i++) h = (h * 31 + ip.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
