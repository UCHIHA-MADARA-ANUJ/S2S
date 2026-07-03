import { NextRequest, NextResponse } from "next/server";
import { genJSON } from "@/lib/gemini/client";
import { CONTENT_SYSTEM } from "@/lib/gemini/prompts";

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (!content) return NextResponse.json({ success: false, error: "No content" }, { status: 400 });
    const r = await genJSON<any>(`${CONTENT_SYSTEM}\n\nContent:\n${content}`);
    if (!r) return NextResponse.json({ success: true, data: { skillScore: 50, educationalValue: 5, engagementLevel: 5, ageAppropriateness: 5, practicalApplication: 5, pros: ["Sample data"], cons: ["Add API key"], verdict: "Add Gemini key for real analysis.", betterAlternatives: [], rating: "average", skillsYouCanLearn: [] } });
    return NextResponse.json({ success: true, data: r });
  } catch (e: any) { return NextResponse.json({ success: false, error: e.message }, { status: 500 }); }
}
