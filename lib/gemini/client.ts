import { GoogleGenerativeAI } from "@google/generative-ai";

export async function genText(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.includes("PLACEHOLDER") || key.includes("placeholder")) {
    return "AI features are offline. Add a valid GEMINI_API_KEY to enable them.";
  }
  try {
    const ai = new GoogleGenerativeAI(key);
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e: any) {
    return "AI temporarily unavailable.";
  }
}

export async function genJSON<T>(prompt: string): Promise<T | null> {
  try {
    const text = await genText(prompt);
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch { return null; }
}
