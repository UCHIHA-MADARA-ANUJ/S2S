import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || "";

export async function genText(prompt: string): Promise<string> {
  // Try Gemini first
  if (GEMINI_KEY && !GEMINI_KEY.includes("PLACEHOLDER")) {
    try {
      const ai = new GoogleGenerativeAI(GEMINI_KEY);
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e: any) {
      const errMsg = e?.message || String(e);
      if (!errMsg.includes("429") && !errMsg.includes("quota")) {
        console.error("Gemini error, trying OpenRouter:", errMsg.slice(0, 200));
      }
    }
  }
  // Fallback to OpenRouter
  return await genTextOpenRouter(prompt);
}

async function genTextOpenRouter(prompt: string): Promise<string> {
  if (!OPENROUTER_KEY || OPENROUTER_KEY.includes("PLACEHOLDER")) {
    return "AI service is offline. Add a valid API key in .env.local.";
  }
  // Use a free working model
  const models = ["openrouter/free", "google/gemma-4-26b-a4b-it:free", "poolside/laguna-xs.2:free"];
  for (const model of models) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "https://skillverse.vercel.app", "X-Title": "SkillVerse" },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 2000 })
      });
      if (!res.ok) continue;
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) return text;
    } catch {}
  }
  return "AI service temporarily unavailable. Please try again.";
}

export async function genJSON<T>(prompt: string): Promise<T | null> {
  try {
    const text = await genText(prompt);
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch { return null; }
}
