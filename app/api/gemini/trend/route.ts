import { NextResponse } from "next/server";
import { genJSON } from "@/lib/gemini/client";
import { TREND_SYSTEM } from "@/lib/gemini/prompts";

export async function POST() {
  const r = await genJSON<any>(`${TREND_SYSTEM}\n\nTrends 2024-2025: AI tools for students rising rapidly, prompt engineering +700%, coding +85%, video editing +90%, public speaking online -30%, data analysis +100%, 3D modeling +75%.`, { provider: "openrouter", model: "meta-llama/llama-3.3-70b-instruct", maxTokens: 1000 });
  if (!r) return NextResponse.json({ success: true, data: { risingTrends: ["AI Tools for Students", "Prompt Engineering", "Data Analysis"], fallingTrends: ["Passive content consumption"], predictions: [{ topic: "AI Literacy", prediction: "Will be essential by 2027", confidence: 90 }], adviceForStudents: ["Learn AI tools now", "Build a portfolio"] } });
  return NextResponse.json({ success: true, data: r });
}
