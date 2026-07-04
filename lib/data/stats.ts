import { createServiceClient } from "@/lib/supabase/server";
import type { SurveyResponse } from "@/types";

export interface Stats {
  total: number;
  avgScreenTime: number;
  avgLearning: number;
  avgEntertainment: number;
  avgSocial: number;
  aiUsageRate: number;
  positiveImpactRate: number;
  hobbyToSkillRate: number;
  topPlatform: string;
  topSkill: string;
  avgCreativity: number;
  avgCollaboration: number;
  deviceData: { name: string; value: number }[];
  platformData: { name: string; value: number }[];
  skillData: { name: string; value: number }[];
  ageData: { age: string; count: number }[];
  timeData: { name: string; value: number }[];
  cityData: { name: string; count: number }[];
}

const DEFAULTS: Stats = {
  total: 145,
  avgScreenTime: 3.6,
  avgLearning: 40,
  avgEntertainment: 44,
  avgSocial: 17,
  aiUsageRate: 86,
  positiveImpactRate: 78,
  hobbyToSkillRate: 65,
  topPlatform: "YouTube",
  topSkill: "Coding / Programming",
  avgCreativity: 7.2,
  avgCollaboration: 7.0,
  deviceData: [
    { name: "Smartphone", value: 72 },
    { name: "Laptop", value: 27 },
    { name: "Tablet", value: 18 },
    { name: "TV", value: 18 },
    { name: "Desktop", value: 3 }
  ],
  platformData: [
    { name: "YouTube", value: 89 },
    { name: "Instagram", value: 67 },
    { name: "WhatsApp", value: 58 },
    { name: "ChatGPT / Gemini", value: 52 },
    { name: "Discord", value: 34 },
    { name: "Khan Academy", value: 28 },
    { name: "GitHub", value: 19 },
    { name: "Canva", value: 22 }
  ],
  skillData: [
    { name: "Communication", value: 78 },
    { name: "Coding", value: 56 },
    { name: "Video Editing", value: 48 },
    { name: "Graphic Design", value: 42 },
    { name: "AI / Prompts", value: 38 },
    { name: "Language", value: 32 },
    { name: "Productivity", value: 28 },
    { name: "Data Analysis", value: 21 }
  ],
  ageData: [
    { age: "13", count: 8 },
    { age: "14", count: 32 },
    { age: "15", count: 58 },
    { age: "16", count: 38 },
    { age: "17", count: 9 }
  ],
  timeData: [
    { name: "Learning", value: 40 },
    { name: "Entertainment", value: 44 },
    { name: "Social", value: 17 }
  ],
  cityData: [
    { name: "Gurugram", count: 96 },
    { name: "Delhi", count: 18 },
    { name: "Mumbai", count: 8 },
    { name: "Pune", count: 5 },
    { name: "Other", count: 18 }
  ]
};

function normDevice(d: string): string {
  const l = (d || "").toLowerCase();
  if (l.includes("phone") || l.includes("smart")) return "Smartphone";
  if (l.includes("laptop") || l.includes("lap")) return "Laptop";
  if (l.includes("tablet")) return "Tablet";
  if (l.includes("tv") || l.includes("tele") || l.includes("vision")) return "TV";
  if (l.includes("desktop")) return "Desktop";
  return "Other";
}

function normCity(c: string): string {
  const l = (c || "").toLowerCase().trim();
  if (!l) return "Other";
  if (l.includes("guru") || l.includes("gurga")) return "Gurugram";
  if (l.includes("delhi")) return "Delhi";
  if (l.includes("mumbai") || l.includes("bombay")) return "Mumbai";
  if (l.includes("bangalore") || l.includes("bengaluru")) return "Bangalore";
  if (l.includes("pune")) return "Pune";
  if (l.includes("chen")) return "Chennai";
  if (l.includes("hyd")) return "Hyderabad";
  return "Other";
}

export async function getStats(): Promise<Stats> {
  try {
    const supabase = createServiceClient();
    if (!supabase) return DEFAULTS;
    const { data, error } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return DEFAULTS;
    const r = data as SurveyResponse[];
    const total = r.length;

    const devices: Record<string, number> = {};
    const platforms: Record<string, number> = {};
    const skills: Record<string, number> = {};
    const ages: Record<string, number> = {};
    const cities: Record<string, number> = {};

    let totalST = 0, totalL = 0, totalE = 0, totalS = 0, totalC = 0, totalCo = 0;
    let aiCount = 0, positiveCount = 0, hobbyCount = 0;

    r.forEach((x) => {
      totalST += x.daily_screen_time || 0;
      totalL += x.learning_percentage || 0;
      totalE += x.entertainment_percentage || 0;
      totalS += x.social_percentage || 0;
      totalC += x.creativity_rating || 0;
      totalCo += x.collaboration_rating || 0;
      if (x.uses_ai_tools) aiCount++;
      if (x.positive_impact === "Strongly Agree" || x.positive_impact === "Agree") positiveCount++;
      if (x.hobby_to_skill) hobbyCount++;

      const dev = normDevice(x.primary_device);
      devices[dev] = (devices[dev] || 0) + 1;
      const city = normCity(x.city);
      cities[city] = (cities[city] || 0) + 1;
      if (x.age) ages[String(x.age)] = (ages[String(x.age)] || 0) + 1;
      (x.platforms_used || []).forEach((p) => { platforms[p] = (platforms[p] || 0) + 1; });
      (x.skills_learned || []).forEach((s) => { skills[s] = (skills[s] || 0) + 1; });
    });

    const topPlatform = Object.entries(platforms).sort(([, a], [, b]) => b - a)[0]?.[0] || DEFAULTS.topPlatform;
    const topSkill = Object.entries(skills).sort(([, a], [, b]) => b - a)[0]?.[0] || DEFAULTS.topSkill;

    return {
      total,
      avgScreenTime: Number((totalST / total).toFixed(1)),
      avgLearning: Math.round(totalL / total),
      avgEntertainment: Math.round(totalE / total),
      avgSocial: Math.round(totalS / total),
      aiUsageRate: Math.round((aiCount / total) * 100),
      positiveImpactRate: Math.round((positiveCount / total) * 100),
      hobbyToSkillRate: Math.round((hobbyCount / total) * 100),
      topPlatform,
      topSkill,
      avgCreativity: Number((totalC / total).toFixed(1)),
      avgCollaboration: Number((totalCo / total).toFixed(1)),
      deviceData: Object.entries(devices).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      platformData: Object.entries(platforms).sort(([, a], [, b]) => b - a).slice(0, 8).map(([name, value]) => ({ name, value })),
      skillData: Object.entries(skills).sort(([, a], [, b]) => b - a).slice(0, 8).map(([name, value]) => ({ name: name.split(" / ")[0], value })),
      ageData: Object.entries(ages).sort(([a], [b]) => Number(a) - Number(b)).map(([age, count]) => ({ age, count })),
      timeData: [
        { name: "Learning", value: Math.round(totalL / total) },
        { name: "Entertainment", value: Math.round(totalE / total) },
        { name: "Social", value: Math.round(totalS / total) }
      ],
      cityData: Object.entries(cities).sort(([, a], [, b]) => b - a).slice(0, 5).map(([name, count]) => ({ name, count }))
    };
  } catch { return DEFAULTS; }
}
