import { createBrowserClient } from "./client";
import type { SurveyResponse } from "@/types";

export async function getSurveyResponses(): Promise<SurveyResponse[]> {
  try {
    const supabase = createBrowserClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as SurveyResponse[];
  } catch { return []; }
}

export async function insertSurvey(data: any): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const supabase = createBrowserClient();
    if (!supabase) return { ok: false, error: "DB not configured" };
    const { data: row, error } = await supabase
      .from("survey_responses")
      .insert({ ...data, source: "website" })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: row.id };
  } catch (e: any) { return { ok: false, error: e.message }; }
}

export async function checkDuplicate(fp: string): Promise<boolean> {
  try {
    const supabase = createBrowserClient();
    if (!supabase) return false;
    const { data } = await supabase
      .from("survey_responses")
      .select("id")
      .eq("fingerprint", fp)
      .limit(1);
    return !!(data && data.length);
  } catch { return false; }
}

export async function insertPledge(name: string, city?: string) {
  try {
    const supabase = createBrowserClient();
    if (!supabase) return { ok: false };
    const { error } = await supabase.from("pledge_signers").insert({ name, city });
    return { ok: !error };
  } catch { return { ok: false }; }
}

export async function getPledgeCount(): Promise<number> {
  try {
    const supabase = createBrowserClient();
    if (!supabase) return 0;
    const { count } = await supabase.from("pledge_signers").select("*", { count: "exact", head: true });
    return count || 0;
  } catch { return 0; }
}
