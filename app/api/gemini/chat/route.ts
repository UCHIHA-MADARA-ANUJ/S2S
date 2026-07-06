import { NextRequest, NextResponse } from "next/server";
import { genText } from "@/lib/gemini/client";
import { CHATBOT_SYSTEM } from "@/lib/gemini/prompts";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ success: false, error: "No message" }, { status: 400 });
    const response = await genText(`${CHATBOT_SYSTEM}\n\nUser: ${message}\nSkillBot:`, { provider: "gemini", model: "gemini-2.5-flash", maxTokens: 1000 });
    return NextResponse.json({ success: true, response });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
