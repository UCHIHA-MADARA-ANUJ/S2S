import { promises as fs } from "fs";
import path from "path";

export interface ScreenTimeRow {
  age: number;
  gender: string;
  country: string;
  daily_screen_hours: number;
  primary_device: string;
  top_platform: string;
  creativity_score: number;
  collaboration_score: number;
}

export interface SkillRow {
  platform: string;
  skill: string;
  weeks_to_proficiency: number;
  avg_practice_hours: number;
  engagement_score: number;
  completion_rate: number;
}

export interface AIToolRow {
  age: number;
  tool: string;
  use_case: string;
  hours_per_week: number;
  satisfaction_1to10: number;
  would_recommend: boolean;
}

export interface SocialMediaRow {
  platform: string;
  age: number;
  daily_minutes: number;
  mood_before_1to10: number;
  mood_after_1to10: number;
  self_reported_skill_gain: number;
  loneliness_1to10: number;
}

function parseCSV<T>(text: string): T[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(",");
    const row: any = {};
    headers.forEach((h, i) => {
      const v = values[i]?.trim();
      const num = Number(v);
      row[h] = !isNaN(num) && v !== "" ? num : v;
    });
    return row as T;
  });
}

export async function getScreenTimeData(): Promise<ScreenTimeRow[]> {
  try {
    const path1 = path.join(process.cwd(), "data/kaggle/global_screen_time.csv");
    const text = await fs.readFile(path1, "utf-8");
    return parseCSV<ScreenTimeRow>(text);
  } catch { return []; }
}

export async function getSkillData(): Promise<SkillRow[]> {
  try {
    const text = await fs.readFile(path.join(process.cwd(), "data/kaggle/skill_acquisition.csv"), "utf-8");
    return parseCSV<SkillRow>(text);
  } catch { return []; }
}

export async function getAIToolData(): Promise<AIToolRow[]> {
  try {
    const text = await fs.readFile(path.join(process.cwd(), "data/kaggle/ai_tool_usage.csv"), "utf-8");
    return parseCSV<AIToolRow>(text);
  } catch { return []; }
}

export async function getSocialMediaData(): Promise<SocialMediaRow[]> {
  try {
    const text = await fs.readFile(path.join(process.cwd(), "data/kaggle/social_media_impact.csv"), "utf-8");
    return parseCSV<SocialMediaRow>(text);
  } catch { return []; }
}

// Aggregation helpers
export function aggregateBy<T>(arr: T[], key: keyof T): Record<string, number> {
  const r: Record<string, number> = {};
  arr.forEach(item => {
    const k = String(item[key]);
    r[k] = (r[k] || 0) + 1;
  });
  return r;
}

export function sumBy<T>(arr: T[], key: keyof T): Record<string, number> {
  const r: Record<string, number> = {};
  arr.forEach(item => {
    const k = String(item[key]);
    r[k] = (r[k] || 0) + Number(item[key as keyof T] as any);
  });
  return r;
}

export function avgBy<T>(arr: T[], groupKey: keyof T, valueKey: keyof T): Record<string, number> {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};
  arr.forEach(item => {
    const k = String(item[groupKey]);
    sums[k] = (sums[k] || 0) + Number(item[valueKey] as any);
    counts[k] = (counts[k] || 0) + 1;
  });
  return Object.fromEntries(Object.keys(sums).map(k => [k, sums[k] / counts[k]]));
}
