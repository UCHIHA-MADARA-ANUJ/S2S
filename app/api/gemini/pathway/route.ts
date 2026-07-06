import { NextRequest, NextResponse } from "next/server";
import { genJSON } from "@/lib/gemini/client";
import { PATHWAY_SYSTEM } from "@/lib/gemini/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await genJSON<any>(`${PATHWAY_SYSTEM}\n\nStudent profile:\n${JSON.stringify(body)}`, { provider: "gemini", model: "gemini-2.5-flash", maxTokens: 2000 });
    if (!r) return NextResponse.json({ success: true, data: { skillGoal: body.skillGoal, summary: "Add GEMINI_API_KEY for personalized plans.", weeks: [{ week: 1, title: "Foundations", goals: ["Learn basics"], tasks: ["Watch intro videos", "Set up"], platforms: ["YouTube"], estimatedHours: 3, milestone: "Basics done" }], expectedOutcome: "Foundational skills." } });
    return NextResponse.json({ success: true, data: r });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
