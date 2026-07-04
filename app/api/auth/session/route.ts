import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Returns the current session info, or null if not signed in. */
export async function GET(req: NextRequest) {
  const supabase = createSupabaseServer();
  if (!supabase) return NextResponse.json({ signedIn: false, reason: "Supabase not configured" });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ signedIn: false });
    let profile = null;
    if (session.user) {
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
      profile = data;
    }
    return NextResponse.json({
      signedIn: true,
      user: { id: session.user?.id, email: session.user?.email, created_at: session.user?.created_at },
      profile
    });
  } catch (e: any) {
    return NextResponse.json({ signedIn: false, error: e.message });
  }
}
