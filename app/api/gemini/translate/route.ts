import { NextRequest, NextResponse } from "next/server";
import { genText } from "@/lib/gemini/client";
import { TRANSLATOR_SYSTEM } from "@/lib/gemini/prompts";

export async function POST(req: NextRequest) {
  try {
    const { text, target } = await req.json();
    if (!text) return NextResponse.json({ success: false, error: "No text" }, { status: 400 });
    const translation = await genText(`${TRANSLATOR_SYSTEM}${target || "Spanish"}\n\nText:\n${text}`);
    return NextResponse.json({ success: true, translation });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
