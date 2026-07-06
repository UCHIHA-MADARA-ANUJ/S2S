import { NextRequest, NextResponse } from "next/server";
import { genText } from "@/lib/gemini/client";

export const dynamic = "force-dynamic";

const FAQ_LIST = [
  { id: "what", q: "What is SkillVerse?" },
  { id: "data", q: "How is my data used?" },
  { id: "free", q: "Is this free?" },
  { id: "delete", q: "Can I delete my data?" },
  { id: "competition", q: "What is the Screen2Skill competition?" },
  { id: "accuracy", q: "How accurate are the AI features?" },
  { id: "school", q: "Can I use this for my school project?" },
  { id: "team", q: "Who built this?" },
  { id: "contribute", q: "How can I contribute?" },
  { id: "next", q: "What's next for SkillVerse?" }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question = String(body.question || "").trim();
    if (!question) return NextResponse.json({ success: false, error: "Empty question" }, { status: 400 });

    const prompt = `You are SkillVerse's support AI. A user asked: "${question}"

Answer in 2-3 sentences, friendly tone, plain English. If the question is unrelated to SkillVerse, say so politely and suggest a relevant FAQ.

Then on a new line, list 1-3 related FAQ IDs (from this list) that might help:
${FAQ_LIST.map((f) => `- ${f.id}: ${f.q}`).join("\n")}

Format:
ANSWER: <answer>
RELATED: <id1>,<id2>`;

    const raw = await genText(prompt, { provider: "openrouter", model: "openai/gpt-4o-mini", maxTokens: 600 });
    const answerMatch = raw.match(/ANSWER:\s*([\s\S]*?)\s*(?:RELATED:|$)/i);
    const relatedMatch = raw.match(/RELATED:\s*([\s\S]*?)$/i);
    const answer = (answerMatch?.[1] || raw.split("\n")[0] || "I couldn't find an answer, but feel free to check the FAQ list below.").trim().slice(0, 600);
    const related = (relatedMatch?.[1] || "")
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((id) => FAQ_LIST.some((f) => f.id === id))
      .slice(0, 3);

    return NextResponse.json({ success: true, answer, related });
  } catch (e: any) {
    return NextResponse.json({ success: true, answer: "I'm having trouble answering right now. Please try one of the FAQs below.", related: ["what", "data"] });
  }
}
