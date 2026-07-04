import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const GEMINI_KEY = process.env.GEMINI_API_KEY || "";

interface ColumnMeta {
  name: string;
  type: "numeric" | "categorical" | "date" | "text";
}

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_KEY || GEMINI_KEY.includes("PLACEHOLDER") || GEMINI_KEY.length < 10) return "";
  const models = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 2000 }
          })
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e: any) { /* try next */ }
  }

  return "";
}

function parseInsights(text: string): any {
  if (!text) return null;
  // Try multiple JSON extraction strategies
  // 1. Try direct parse
  try {
    return JSON.parse(text);
  } catch {}

  // 2. Try to find JSON block with code fences
  const fenceMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1]);
    } catch {}
  }

  // 3. Find first { and matching }
  const start = text.indexOf("{");
  if (start === -1) {
    // No JSON - return raw text as summary
    return {
      summary: text.slice(0, 500) || "Analysis completed. View raw response.",
      keyTrends: [],
      outliers: [],
      correlations: [],
      recommendations: ["Configure API keys for full AI analysis."]
    };
  }

  // Find matching closing brace
  let depth = 0;
  let end = -1;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escape) { escape = false; continue; }
    if (c === "\\") { escape = true; continue; }
    if (c === '"' && !escape) { inString = !inString; continue; }
    if (inString) continue;
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch (e) {
      console.error("JSON parse failed, raw:", text.slice(start, end + 1).slice(0, 200));
    }
  }

  return {
    summary: text.slice(0, 500),
    keyTrends: [],
    outliers: [],
    correlations: [],
    recommendations: ["Configure API keys for full AI analysis."]
  };
}

export async function POST(req: NextRequest) {
  try {
    const { data, columns } = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ success: false, error: "No data provided" }, { status: 400 });
    }
    if (!Array.isArray(columns) || columns.length === 0) {
      return NextResponse.json({ success: false, error: "No columns provided" }, { status: 400 });
    }

    const sample = data.slice(0, 30);
    const columnInfo = columns.map((c: ColumnMeta) => `${c.name} (${c.type})`).join(", ");

    const prompt = `You are an expert data analyst. Analyze this CSV dataset and provide insights.

Dataset: ${data.length} rows. Columns: ${columnInfo}.
Sample (first ${sample.length} rows): ${JSON.stringify(sample).slice(0, 3000)}

Return ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{"summary":"2-3 sentence overview","keyTrends":["trend 1","trend 2","trend 3"],"outliers":["outlier 1","outlier 2"],"correlations":["correlation 1","correlation 2"],"recommendations":["rec 1","rec 2","rec 3"]}`;

    const text = await callGemini(prompt);
    const insights = parseInsights(text) || {
      summary: "Analysis completed. AI provided insights in a non-standard format.",
      keyTrends: [],
      outliers: [],
      correlations: [],
      recommendations: []
    };

    return NextResponse.json({ success: true, insights });
  } catch (e: any) {
    console.error("CSV insights error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
