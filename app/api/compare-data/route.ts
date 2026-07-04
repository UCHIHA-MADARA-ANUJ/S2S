import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { userData } = await req.json();

    if (!Array.isArray(userData) || userData.length === 0) {
      return NextResponse.json({ success: false, error: "No user data provided" }, { status: 400 });
    }

    // Load SkillVerse survey data from public dataset
    let svData: any[] = [];
    try {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const filePath = path.join(process.cwd(), "public", "datasets", "survey-responses-2026.json");
      const txt = await fs.readFile(filePath, "utf-8");
      const all = JSON.parse(txt);
      svData = all.slice(0, 250);
    } catch (e) {
      return NextResponse.json({ success: false, error: "Cannot load baseline data" }, { status: 500 });
    }

    // Use AI to compare
    let comparison: any = null;
    if (GEMINI_KEY) {
      try {
        const userSummary = `User data (${userData.length} rows): ${JSON.stringify(userData.slice(0, 10))}`;
        const svSummary = `SkillVerse data (${svData.length} rows): ${JSON.stringify(svData.slice(0, 10))}`;

        const prompt = `Compare these two datasets and find key differences. Return ONLY valid JSON:
{"summary":"Comparison summary","keyDifferences":["diff 1","diff 2","diff 3"],"alignment":["similarity 1","similarity 2"],"insights":["insight 1","insight 2"]}

User's data: ${userSummary}

SkillVerse baseline (250 Indian students): ${svSummary}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 1500 }
            })
          }
        );
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          try { comparison = JSON.parse(match[0]); } catch {}
        }
        if (!comparison) {
          comparison = { summary: text.slice(0, 500), keyDifferences: [], alignment: [], insights: [] };
        }
      } catch (e) {
        comparison = { summary: "Comparison unavailable", keyDifferences: [], alignment: [], insights: [] };
      }
    }

    return NextResponse.json({
      success: true,
      comparison,
      userStats: { rows: userData.length },
      svStats: { rows: svData.length }
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
