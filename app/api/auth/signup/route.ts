import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Server-side signup that uses the service-role key to bypass email confirmation.
 * This avoids the "email rate limit exceeded" error on Supabase's free tier.
 *
 * Body: { email: string, password: string, name?: string }
 * Returns: { ok, user, session } on success, or { error } on failure.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string; name?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email || "").trim();
  const password = body.password || "";
  const name = (body.name || email.split("@")[0] || "").trim();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json({ error: "Server misconfigured: no service key" }, { status: 500 });
  }

  try {
    // 1) Create user with email_confirm: true so no confirmation email is sent
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });

    if (createErr) {
      return NextResponse.json({ error: createErr.message }, { status: 400 });
    }
    if (!created?.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    const userId = created.user.id;

    // 2) Best-effort: upsert profile row so the user has a name + email on record.
    try {
      await admin.from("profiles").upsert({
        id: userId,
        email,
        full_name: name,
        last_login_at: new Date().toISOString(),
      });
    } catch {
      // non-fatal: profile trigger will create it
    }

    // 3) Sign the user in (server-side) and return the session tokens.
    const { createSupabaseServer } = await import("@/lib/supabase/server");
    const supabase = createSupabaseServer();

    let session: any = null;
    if (supabase) {
      const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
      session = signInData?.session ?? null;
    }

    return NextResponse.json({
      ok: true,
      user: { id: userId, email },
      session,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Signup failed" }, { status: 500 });
  }
}
