import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini-only client. Tries 3 models in fallback order.
const GEMINI_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  "";

// Models that work with the current key (tested 2026-07-04).
// gemini-2.0-flash and pro-latest are 429 (rate-limited on this key), so don't try them first.
const MODELS_FAST = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
const MODELS_QUALITY = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest"];

let _warned = false;
function warnOnce() {
  if (_warned) return;
  _warned = true;
  // eslint-disable-next-line no-console
  console.log(`[gemini] key ${GEMINI_KEY ? "loaded (" + GEMINI_KEY.slice(0, 8) + "...)" : "MISSING"}`);
}

function isPlaceholder(s: string) {
  if (!s) return true;
  if (s.includes("PLACEHOLDER")) return true;
  if (s.includes("your_")) return true;
  if (s.length < 10) return true;
  return false;
}

/**
 * Generate text using Gemini. Tries 3 models in order.
 * Returns a real string (never throws).
 */
export async function genText(prompt: string, model?: string): Promise<string> {
  warnOnce();

  if (isPlaceholder(GEMINI_KEY)) {
    return "AI service offline. Set GEMINI_API_KEY in Vercel Environment Variables.";
  }

  const models = model
    ? [model, ...MODELS_FAST.filter((m) => m !== model)]
    : MODELS_FAST;

  for (const m of models) {
    try {
      const ai = new GoogleGenerativeAI(GEMINI_KEY);
      const md = ai.getGenerativeModel({ model: m });
      const result = await md.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim()) {
        if (m !== models[0]) console.log(`[gemini] succeeded with fallback model: ${m}`);
        return text;
      }
    } catch (e: any) {
      const err = String(e?.message || e);
      // 429 = rate limited, 404 = model not found, 503 = overload
      // All non-fatal — try next model
      if (!err.includes("429") && !err.includes("404") && !err.includes("503")) {
        // eslint-disable-next-line no-console
        console.error(`[gemini] ${m} error:`, err.slice(0, 200));
      }
    }
  }

  return "AI service temporarily unavailable. All models are rate-limited or erroring. Please try again in a moment.";
}

/**
 * Generate JSON. Robustly extracts a JSON object/array from the response.
 * Returns null on failure.
 */
export async function genJSON<T = any>(prompt: string, model?: string): Promise<T | null> {
  try {
    const text = await genText(prompt, model);
    // Try to find JSON in the response
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    return null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("genJSON error:", e);
    return null;
  }
}
