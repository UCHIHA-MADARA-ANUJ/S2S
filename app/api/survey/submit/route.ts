import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getClientIp, checkIpRateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req as unknown as Request);
    const rateCheck = checkIpRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, error: rateCheck.reason || "Rate limited" }, { status: 429 });
    }

    const body = await req.json();
    const supabase = createServiceClient();
    if (!supabase) {
      // Dev mode: just acknowledge
      return NextResponse.json({ success: true, id: "dev-" + Date.now() });
    }

    const userId = (body?.user_id || "").toString() || null;
    const fp = (body?.fingerprint || "").toString();

    // If user is signed in, check if THEY already submitted (by user_id)
    if (userId) {
      const { data: existing } = await supabase
        .from("survey_responses")
        .select("id")
        .eq("user_id", userId)
        .limit(1);
      if (existing && existing.length) {
        // Update existing response instead of duplicating
        const { data: updated, error } = await supabase
          .from("survey_responses")
          .update({ ...body, user_id: userId, source: "website" })
          .eq("user_id", userId)
          .select("id")
          .single();
        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, id: updated.id, updated: true });
      }
    }
    // Else, dedupe by fingerprint
    else if (fp) {
      const { data: existing } = await supabase
        .from("survey_responses")
        .select("id")
        .eq("fingerprint", fp)
        .limit(1);
      if (existing && existing.length) {
        return NextResponse.json({
          success: false,
          duplicate: true,
          error: "This device has already submitted a response."
        }, { status: 409 });
      }
    }

    // Insert new
    const insertData: any = { ...body, source: "website", ip_hash: hashIp(ip) };
    if (userId) insertData.user_id = userId;

    let result = await supabase
      .from("survey_responses")
      .insert(insertData)
      .select("id")
      .single();

    // If column missing, retry without
    if (result.error && (result.error.message.includes("ip_hash") || result.error.message.includes("user_id"))) {
      const retryData: any = { ...body, source: "website" };
      if (userId) retryData.user_id = userId;
      result = await supabase
        .from("survey_responses")
        .insert(retryData)
        .select("id")
        .single();
    }

    if (result.error) return NextResponse.json({ success: false, error: result.error.message }, { status: 500 });
    return NextResponse.json({ success: true, id: result.data.id });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

function hashIp(ip: string): string {
  let h = 0;
  for (let i = 0; i < ip.length; i++) h = (h * 31 + ip.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
