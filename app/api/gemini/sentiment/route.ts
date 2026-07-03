import { NextRequest, NextResponse } from "next/server";
import { genJSON } from "@/lib/gemini/client";
import { SENTIMENT_SYSTEM } from "@/lib/gemini/prompts";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || text.length < 10) return NextResponse.json({ success: false, error: "Text too short" }, { status: 400 });
    const r = await genJSON<any>(`${SENTIMENT_SYSTEM}\n\nText:\n${text}`);
    if (!r) return NextResponse.json({ success: true, data: { overallSentiment: "neutral", digitalWellnessScore: 50, categories: { learning: 5, entertainment: 5, social: 5, creative: 5, distraction: 5 }, advice: "Add a valid Gemini API key for personalized analysis.", summary: "Sample data shown." } });
    return NextResponse.json({ success: true, data: r });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
