import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const fp = req.nextUrl.searchParams.get("fp");
    if (!fp) return NextResponse.json({ exists: false });
    const supabase = createServerClient();
    if (!supabase) return NextResponse.json({ exists: false });
    const { data } = await supabase.from("survey_responses").select("id").eq("fingerprint", fp).limit(1);
    return NextResponse.json({ exists: !!(data && data.length) });
  } catch { return NextResponse.json({ exists: false }); }
}
