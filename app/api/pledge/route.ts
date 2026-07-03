import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { name, city } = await req.json();
    if (!name) return NextResponse.json({ success: false, error: "Name required" }, { status: 400 });
    const supabase = createServerClient();
    if (!supabase) return NextResponse.json({ success: true });
    const { error } = await supabase.from("pledge_signers").insert({ name, city });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
