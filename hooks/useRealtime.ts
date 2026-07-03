"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { SurveyResponse } from "@/types";

export function useRealtime() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const s = createBrowserClient();
    if (!s) { setLoading(false); return; }
    const load = async () => {
      const { data } = await s.from("survey_responses").select("*").order("created_at", { ascending: false });
      if (data) { setResponses(data as SurveyResponse[]); setCount(data.length); }
      setLoading(false);
    };
    load();
    const ch = s.channel("rt")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "survey_responses" }, (p) => {
        setResponses((r) => [p.new as SurveyResponse, ...r]);
        setCount((c) => c + 1);
      })
      .subscribe((status) => { if (status === "SUBSCRIBED") setLive(true); });
    return () => { s.removeChannel(ch); };
  }, []);

  return { responses, count, loading, live };
}
