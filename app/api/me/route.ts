import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getData(fp: string) {
  const supabase = createServiceClient();
  if (!supabase) return { row: null, supabase: false };
  const { data } = await supabase.from("survey_responses").select("*").eq("fingerprint", fp).maybeSingle();
  return { row: data, supabase: true };
}

export async function GET(req: NextRequest) {
  const fp = req.nextUrl.searchParams.get("fp") || "";
  if (!fp) return NextResponse.json({ success: false, error: "Missing fingerprint" }, { status: 400 });
  const { row, supabase } = await getData(fp);
  return NextResponse.json({ success: true, hasResponse: !!row, data: row, supabase });
}

export async function DELETE(req: NextRequest) {
  const fp = req.nextUrl.searchParams.get("fp") || (await req.json().catch(() => ({}))).fingerprint || "";
  if (!fp) return NextResponse.json({ success: false, error: "Missing fingerprint" }, { status: 400 });
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ success: true, demo: true });
  const { error, count } = await supabase.from("survey_responses").delete({ count: "exact" }).eq("fingerprint", fp);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, deleted: count || 0 });
}
