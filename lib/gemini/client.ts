import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || "";

// Models confirmed working with your key
const PRIMARY_MODEL = "gemini-2.5-flash";
const QUALITY_MODEL = "gemini-2.5-pro";
const FAST_MODEL = "gemini-2.5-flash-lite";
const OPENROUTER_MODEL = "google/gemma-4-26b-a4b-it:free";

export async function genText(prompt: string, model: string = PRIMARY_MODEL): Promise<string> {
  // Try Gemini first
  if (GEMINI_KEY && !GEMINI_KEY.includes("PLACEHOLDER")) {
    try {
      const ai = new GoogleGenerativeAI(GEMINI_KEY);
      const m = ai.getGenerativeModel({ model });
      const result = await m.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim()) return text;
    } catch (e: any) {
      const err = String(e?.message || e);
      if (!err.includes("429") && !err.includes("quota")) {
        console.error("Gemini error:", err.slice(0, 150));
      }
    }
  }
  // Fallback to OpenRouter
  return await genTextOpenRouter(prompt);
}

async function genTextOpenRouter(prompt: string): Promise<string> {
  if (!OPENROUTER_KEY || OPENROUTER_KEY.includes("PLACEHOLDER")) {
    return "AI service offline. Configure API keys in .env.local";
  }
  const models = [OPENROUTER_MODEL, "openrouter/free"];
  for (const model of models) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://skillverse.vercel.app", "X-Title": "SkillVerse" },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 4000 })
      });
      if (!res.ok) continue;
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) return text;
    } catch {}
  }
  return "AI temporarily unavailable.";
}

export async function genJSON<T>(prompt: string, model?: string): Promise<T | null> {
  try {
    const text = await genText(prompt, model);
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch { return null; }
}

export const MODELS = { PRIMARY: PRIMARY_MODEL, QUALITY: QUALITY_MODEL, FAST: FAST_MODEL };
