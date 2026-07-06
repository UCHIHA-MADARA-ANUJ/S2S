import { NextResponse } from "next/server";
import { genText } from "@/lib/gemini/client";
import { REPORT_SYSTEM } from "@/lib/gemini/prompts";
import { getStats } from "@/lib/data/stats";

export async function POST() {
  const s = await getStats();
  const data = `Total Responses: ${s.total}
Avg Daily Screen Time: ${s.avgScreenTime} hours
Time Split: ${s.avgLearning}% learning, ${s.avgEntertainment}% entertainment, ${s.avgSocial}% social
Top Platform: ${s.topPlatform}
Top Skill: ${s.topSkill}
AI Tool Usage: ${s.aiUsageRate}%
Positive Impact: ${s.positiveImpactRate}%
Hobby-to-Skill Rate: ${s.hobbyToSkillRate}%
Avg Creativity: ${s.avgCreativity}/10
Avg Collaboration: ${s.avgCollaboration}/10
Top Cities: ${s.cityData?.map(c => c.name).join(", ")}`;
  const report = await genText(`${REPORT_SYSTEM}\n\nSurvey Data:\n${data}`, { provider: "openrouter", model: "meta-llama/llama-3.3-70b-instruct", maxTokens: 1500 });
  return NextResponse.json({ success: true, report });
}
