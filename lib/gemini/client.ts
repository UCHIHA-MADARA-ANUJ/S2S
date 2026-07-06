import { GoogleGenerativeAI } from "@google/generative-ai";

// API Keys with built-in fallbacks from user credentials
const GEMINI_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  "";

const OPENROUTER_KEY =
  process.env.OPENROUTER_API_KEY ||
  "";

// Provider model lists in priority order
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest"];
const OPENROUTER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct",
  "openai/gpt-4o-mini",
  "qwen/qwen-2.5-7b-instruct",
  "google/gemini-2.5-flash"
];

let _warned = false;
function warnOnce() {
  if (_warned) return;
  _warned = true;
  // eslint-disable-next-line no-console
  console.log(`[ai-engine] Gemini Key: ${isPlaceholder(GEMINI_KEY) ? "MISSING" : "LOADED (" + GEMINI_KEY.slice(0, 8) + "...)"}`);
  // eslint-disable-next-line no-console
  console.log(`[ai-engine] OpenRouter Key: ${isPlaceholder(OPENROUTER_KEY) ? "MISSING" : "LOADED (" + OPENROUTER_KEY.slice(0, 8) + "...)"}`);
}

function isPlaceholder(s?: string): boolean {
  if (!s) return true;
  if (s.includes("PLACEHOLDER")) return true;
  if (s.includes("your_")) return true;
  if (s.length < 10) return true;
  return false;
}

export type AIOptions = {
  model?: string;
  provider?: "gemini" | "openrouter" | "auto";
  maxTokens?: number;
};

/**
 * Call OpenRouter API
 */
async function callOpenRouter(prompt: string, model: string, maxTokens = 1000): Promise<string | null> {
  if (isPlaceholder(OPENROUTER_KEY)) return null;
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://skillverse.app",
        "X-Title": "SkillVerse"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    if (data?.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    if (data?.error) {
      // eslint-disable-next-line no-console
      console.error(`[openrouter] ${model} error:`, JSON.stringify(data.error).slice(0, 200));
    }
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error(`[openrouter] ${model} fetch exception:`, (e?.message || e).slice(0, 200));
  }
  return null;
}

/**
 * Call Google Gemini Direct API
 */
async function callGemini(prompt: string, model: string): Promise<string | null> {
  if (isPlaceholder(GEMINI_KEY)) return null;
  try {
    const ai = new GoogleGenerativeAI(GEMINI_KEY);
    const md = ai.getGenerativeModel({ model });
    const result = await md.generateContent(prompt);
    const text = result.response.text();
    if (text && text.trim()) {
      return text;
    }
  } catch (e: any) {
    const err = String(e?.message || e);
    if (!err.includes("429") && !err.includes("404") && !err.includes("503")) {
      // eslint-disable-next-line no-console
      console.error(`[gemini] ${model} error:`, err.slice(0, 200));
    }
  }
  return null;
}

/**
 * Generate text using dual-engine AI (Gemini + OpenRouter) with automatic cross-provider fallback.
 * Returns a guaranteed string (never throws).
 */
export async function genText(prompt: string, modelOrOptions?: string | AIOptions): Promise<string> {
  warnOnce();

  // Parse options
  let options: AIOptions = {};
  if (typeof modelOrOptions === "string") {
    if (modelOrOptions === "openrouter" || modelOrOptions === "gemini" || modelOrOptions === "auto") {
      options.provider = modelOrOptions;
    } else if (modelOrOptions.includes("/") || modelOrOptions.includes("llama") || modelOrOptions.includes("gpt") || modelOrOptions.includes("qwen")) {
      options.provider = "openrouter";
      options.model = modelOrOptions;
    } else {
      options.provider = "gemini";
      options.model = modelOrOptions;
    }
  } else if (modelOrOptions && typeof modelOrOptions === "object") {
    options = { ...modelOrOptions };
  }

  const provider = options.provider || "auto";
  const maxTokens = options.maxTokens || 1000;

  // If both keys are missing
  if (isPlaceholder(GEMINI_KEY) && isPlaceholder(OPENROUTER_KEY)) {
    return "AI service offline. Please configure GEMINI_API_KEY or OPENROUTER_API_KEY in environment variables.";
  }

  // Determine order of execution based on provider preference
  const tryOpenRouterFirst = provider === "openrouter" || (provider === "auto" && isPlaceholder(GEMINI_KEY));

  // 1. Try OpenRouter first if requested
  if (tryOpenRouterFirst) {
    const modelsToTry = options.model ? [options.model, ...OPENROUTER_MODELS.filter(m => m !== options.model)] : OPENROUTER_MODELS;
    for (const m of modelsToTry) {
      const res = await callOpenRouter(prompt, m, maxTokens);
      if (res && res.trim()) {
        if (m !== modelsToTry[0]) {
          // eslint-disable-next-line no-console
          console.log(`[openrouter] succeeded with fallback model: ${m}`);
        }
        return res;
      }
    }
    // Fallback to Gemini if OpenRouter failed
    // eslint-disable-next-line no-console
    console.log("[ai-engine] OpenRouter models exhausted, falling back to Google Gemini...");
    for (const m of GEMINI_MODELS) {
      const res = await callGemini(prompt, m);
      if (res && res.trim()) return res;
    }
  } 
  // 2. Try Gemini first (default for most routes like SkillBot, Pathway, etc.)
  else {
    const modelsToTry = options.model ? [options.model, ...GEMINI_MODELS.filter(m => m !== options.model)] : GEMINI_MODELS;
    for (const m of modelsToTry) {
      const res = await callGemini(prompt, m);
      if (res && res.trim()) {
        if (m !== modelsToTry[0]) {
          // eslint-disable-next-line no-console
          console.log(`[gemini] succeeded with fallback model: ${m}`);
        }
        return res;
      }
    }
    // Fallback to OpenRouter if Gemini failed/rate-limited
    // eslint-disable-next-line no-console
    console.log("[ai-engine] Gemini models rate-limited or exhausted, falling back to OpenRouter...");
    for (const m of OPENROUTER_MODELS) {
      const res = await callOpenRouter(prompt, m, maxTokens);
      if (res && res.trim()) return res;
    }
  }

  return "AI service temporarily unavailable. Both Gemini and OpenRouter providers are currently rate-limited or erroring. Please try again in a moment.";
}

/**
 * Generate JSON robustly using dual-engine AI. Extracts JSON object/array from response.
 * Returns null on failure.
 */
export async function genJSON<T = any>(prompt: string, modelOrOptions?: string | AIOptions): Promise<T | null> {
  try {
    const text = await genText(prompt, modelOrOptions);
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
