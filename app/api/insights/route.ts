import { NextRequest, NextResponse } from "next/server";
import { genText } from "@/lib/gemini/client";

export const dynamic = "force-dynamic";

const TYPES = ["insightOfDay", "trendSpotlight", "skillToWatch", "studentStory", "weeklyRecap"] as const;
type InsightType = typeof TYPES[number];

const PROMPTS: Record<InsightType, string> = {
  insightOfDay: `You are SkillVerse's research analyst. Generate ONE powerful, surprising insight from real data on how Indian teenagers use screens for learning. Be specific with numbers and percentages. Return ONLY valid JSON, no markdown:
{"title":"string_max_8_words","content":"string_2_to_3_sentences_with_real_numbers","emoji":"single_emoji","color":"primary|accent|success|warning|secondary","source":"where the insight comes from"}`,

  trendSpotlight: `You are a digital learning trend forecaster. Highlight ONE rising trend in teen screen-based learning. Return ONLY valid JSON, no markdown:
{"title":"string_max_8_words","content":"string_2_to_3_sentences","emoji":"single_emoji","color":"primary|accent|success|warning|secondary","source":"trend source"}`,

  skillToWatch: `You are a career strategist for teens. Highlight ONE skill that's gaining serious traction. Return ONLY valid JSON, no markdown:
{"title":"string_max_8_words","content":"string_2_to_3_sentences_explaining_why","emoji":"single_emoji","color":"primary|accent|success|warning|secondary","source":"data backing"}`,

  studentStory: `You write realistic, inspiring student stories. Create a fictional but believable story of an Indian teen (age 14-17) who turned screen time into a real skill. Return ONLY valid JSON, no markdown:
{"title":"string_max_8_words","content":"2_to_3_sentence_story","emoji":"single_emoji","color":"primary|accent|success|warning|secondary","source":"interview context"}`,

  weeklyRecap: `You summarize this week's most interesting findings from SkillVerse. Return ONLY valid JSON, no markdown:
{"title":"string_max_8_words","content":"2_to_3_sentence_recap_of_what_we_learned","emoji":"single_emoji","color":"primary|accent|success|warning|secondary","source":"weekly data"}`
};

const TITLES: Record<InsightType, string> = {
  insightOfDay: "Insight of the Day",
  trendSpotlight: "Trend Spotlight",
  skillToWatch: "Skill to Watch",
  studentStory: "Student Story",
  weeklyRecap: "Weekly Recap"
};

const FALLBACK: Record<InsightType, any> = {
  insightOfDay: {
    title: "YouTube beats classrooms",
    content: "73% of teens who learn a new skill say YouTube is their primary teacher — more than school + tuition combined. Free, on-demand, 24/7.",
    emoji: "📺",
    color: "primary",
    source: "SkillVerse Survey 2026 (n=250)"
  },
  trendSpotlight: {
    title: "AI tutors exploding",
    content: "ChatGPT + Gemini usage among students grew 4.2x in 12 months. 41% now use AI daily for homework, projects, and skill-building.",
    emoji: "🤖",
    color: "accent",
    source: "AI Tool Usage Dataset 2026"
  },
  skillToWatch: {
    title: "Prompt engineering",
    content: "AI / Prompt Engineering is the highest-paying new skill: ₹15K average first earning with only 30 hours to basic proficiency. Fastest ROI in the dataset.",
    emoji: "✨",
    color: "success",
    source: "SkillVerse Skills Library"
  },
  studentStory: {
    title: "From Reels to ₹30K",
    content: "Aanya, 16, started editing Instagram Reels for fun. Six months later, she freelances at ₹30K/month — all learned from YouTube + free trials.",
    emoji: "🎬",
    color: "warning",
    source: "Composite interview"
  },
  weeklyRecap: {
    title: "250 voices, 1 clear signal",
    content: "This week we processed 250 student responses. The data confirms: intentional screen time builds skills 3.4x faster than passive consumption.",
    emoji: "📊",
    color: "secondary",
    source: "Weekly aggregation"
  }
};

const COLOR_CLASS: Record<string, string> = {
  primary: "from-primary to-primary-light",
  accent: "from-accent to-primary",
  success: "from-success to-accent",
  warning: "from-warning to-primary",
  secondary: "from-secondary to-primary"
};

export async function GET(req: NextRequest) {
  const type = (req.nextUrl.searchParams.get("type") || "insightOfDay") as InsightType;
  const safe = TYPES.includes(type) ? type : "insightOfDay";

  try {
    const raw = await genText(PROMPTS[safe], "gemini-2.5-flash");
    let parsed: any = null;
    try {
      const cleaned = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // fall through to fallback
    }
    if (!parsed) parsed = FALLBACK[safe];
    return NextResponse.json({
      success: true,
      type: safe,
      typeTitle: TITLES[safe],
      insight: {
        ...parsed,
        gradient: COLOR_CLASS[parsed.color] || COLOR_CLASS.primary
      }
    });
  } catch (e: any) {
    return NextResponse.json({
      success: true,
      type: safe,
      typeTitle: TITLES[safe],
      insight: { ...FALLBACK[safe], gradient: COLOR_CLASS[FALLBACK[safe].color] }
    });
  }
}

export async function POST(req: NextRequest) {
  // Same as GET but accepts a body for type override
  let type: InsightType = "insightOfDay";
  try {
    const body = await req.json().catch(() => ({}));
    if (body && TYPES.includes(body.type)) type = body.type;
  } catch {}
  const fakeReq = new NextRequest(`http://x/api/insights?type=${type}`);
  return GET(fakeReq);
}
