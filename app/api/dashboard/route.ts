import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/dashboard — Returns the signed-in user's data + aggregate stats.
 * Requires Authorization: Bearer <access_token> header.
 * Returns aggregated data if not signed in.
 */
export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  // Get the user's access token from the Authorization header
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");

  let userId: string | null = null;
  let userEmail: string | null = null;
  let userProfile: any = null;
  let myResponses: any[] = [];

  if (token) {
    // Verify the user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      userId = user.id;
      userEmail = user.email || null;
      // Fetch profile
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      userProfile = prof;
      // Fetch user's survey responses
      const { data: resp } = await supabase.from("survey_responses").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      myResponses = resp || [];
    }
  }

  // Fetch all survey responses for aggregate stats
  const { data: allResponses, count: totalCount } = await supabase
    .from("survey_responses")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(500);

  // Calculate aggregates
  const aggregate = computeAggregate(allResponses || []);

  // If signed in, compute user's "you vs everyone else" comparison
  let myComparison: any = null;
  if (userId && myResponses.length > 0) {
    const my = myResponses[0];
    myComparison = {
      my_screen_time: my.daily_screen_time,
      avg_screen_time: aggregate.avgScreenTime,
      my_learning_pct: my.learning_percentage,
      avg_learning_pct: aggregate.avgLearningPct,
      my_top_platform: my.most_helpful_platform,
      my_skills: my.skills_learned || [],
      my_ai_usage: my.uses_ai_tools,
      percent_rank: computePercentile(my, allResponses || [])
    };
  }

  return NextResponse.json({
    signedIn: !!userId,
    user: userId ? { id: userId, email: userEmail, profile: userProfile } : null,
    myResponses,
    myComparison,
    aggregate,
    totalResponses: totalCount || 0,
    timestamp: new Date().toISOString()
  });
}

function computeAggregate(rows: any[]) {
  if (rows.length === 0) {
    return {
      totalStudents: 0,
      avgScreenTime: 0,
      avgLearningPct: 0,
      avgEntertainmentPct: 0,
      avgSocialPct: 0,
      avgCreativity: 0,
      avgCollaboration: 0,
      aiUsageRate: 0,
      positiveImpactRate: 0,
      topPlatforms: [] as { name: string; count: number }[],
      topSkills: [] as { name: string; count: number }[],
      platformBreakdown: {} as Record<string, number>,
      ageBreakdown: {} as Record<string, number>,
      cityBreakdown: {} as Record<string, number>
    };
  }
  let totalScreen = 0, totalLearn = 0, totalEnt = 0, totalSoc = 0;
  let totalCre = 0, totalCol = 0, aiCount = 0, posCount = 0;
  const platformCounts: Record<string, number> = {};
  const skillCounts: Record<string, number> = {};
  const ageCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};

  for (const r of rows) {
    totalScreen += Number(r.daily_screen_time) || 0;
    totalLearn += Number(r.learning_percentage) || 0;
    totalEnt += Number(r.entertainment_percentage) || 0;
    totalSoc += Number(r.social_percentage) || 0;
    totalCre += Number(r.creativity_rating) || 0;
    totalCol += Number(r.collaboration_rating) || 0;
    if (r.uses_ai_tools) aiCount++;
    if (r.positive_impact && r.positive_impact.toLowerCase().includes("agree")) posCount++;
    if (r.most_helpful_platform) platformCounts[r.most_helpful_platform] = (platformCounts[r.most_helpful_platform] || 0) + 1;
    if (r.platforms_used) for (const p of r.platforms_used) platformCounts[p] = (platformCounts[p] || 0) + 1;
    if (r.skills_learned) for (const s of r.skills_learned) skillCounts[s] = (skillCounts[s] || 0) + 1;
    if (r.age) ageCounts[String(r.age)] = (ageCounts[String(r.age)] || 0) + 1;
    if (r.city) cityCounts[r.city] = (cityCounts[r.city] || 0) + 1;
  }

  const n = rows.length;
  const topPlatforms = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));
  const topSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));

  return {
    totalStudents: n,
    avgScreenTime: Number((totalScreen / n).toFixed(1)),
    avgLearningPct: Math.round(totalLearn / n),
    avgEntertainmentPct: Math.round(totalEnt / n),
    avgSocialPct: Math.round(totalSoc / n),
    avgCreativity: Number((totalCre / n).toFixed(1)),
    avgCollaboration: Number((totalCol / n).toFixed(1)),
    aiUsageRate: Math.round((aiCount / n) * 100),
    positiveImpactRate: Math.round((posCount / n) * 100),
    topPlatforms,
    topSkills,
    platformBreakdown: platformCounts,
    ageBreakdown: ageCounts,
    cityBreakdown: cityCounts
  };
}

function computePercentile(me: any, all: any[]) {
  if (!me.daily_screen_time || all.length === 0) return null;
  const myTime = me.daily_screen_time;
  const sorted = all.map(r => Number(r.daily_screen_time) || 0).sort((a, b) => a - b);
  const idx = sorted.findIndex(t => t >= myTime);
  return idx >= 0 ? Math.round((idx / sorted.length) * 100) : 100;
}
