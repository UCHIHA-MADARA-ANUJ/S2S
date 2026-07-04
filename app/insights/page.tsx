"use client";
import { useState, useEffect, useCallback } from "react";
import { DotField } from "@/components/effects/DotField";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { MagicBento } from "@/components/effects/MagicBento";
import { TextPressure } from "@/components/effects/TextPressure";
import { SplitText } from "@/components/effects/SplitText";
import { CountUp } from "@/components/effects/CountUp";
import { Sparkles, RefreshCw, Loader2, Share2, Copy, Check, Zap, TrendingUp, Heart, Star, BookOpen } from "lucide-react";
import { toast } from "sonner";

const TYPES = [
  { id: "insightOfDay", title: "Insight of the Day", icon: Sparkles, size: "large" },
  { id: "trendSpotlight", title: "Trend Spotlight", icon: TrendingUp },
  { id: "skillToWatch", title: "Skill to Watch", icon: Star },
  { id: "studentStory", title: "Student Story", icon: Heart },
  { id: "weeklyRecap", title: "Weekly Recap", icon: BookOpen }
] as const;

type Insight = { id: string; type: string; typeTitle: string; insight: { title: string; content: string; emoji: string; gradient: string; source: string } };

const CACHE_KEY = "sv:insights:v1";
const LAST_GEN_KEY = "sv:insights:last-gen";

interface CacheShape { ts: number; items: Record<string, Insight>; }

function readCache(): CacheShape {
  if (typeof window === "undefined") return { ts: 0, items: {} };
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}") || { ts: 0, items: {} }; }
  catch { return { ts: 0, items: {} }; }
}
function writeCache(c: CacheShape) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}
function canRegenerate(): boolean {
  if (typeof window === "undefined") return true;
  const last = Number(localStorage.getItem(LAST_GEN_KEY) || 0);
  return Date.now() - last > 60 * 60 * 1000; // 1 hour
}
function markGenerated() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LAST_GEN_KEY, String(Date.now())); } catch {}
}

export default function InsightsPage() {
  const [items, setItems] = useState<Record<string, Insight>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const fetchOne = useCallback(async (type: string, force = false) => {
    const cache = readCache();
    const cached = cache.items[type];
    // 24h cache
    if (!force && cached && Date.now() - cache.ts < 24 * 60 * 60 * 1000) {
      setItems((prev) => ({ ...prev, [type]: cached }));
      return;
    }
    setLoading((p) => ({ ...p, [type]: true }));
    try {
      const res = await fetch(`/api/insights?type=${type}`);
      const data = await res.json();
      if (data.success) {
        const next: Insight = { id: type, ...data };
        setItems((prev) => ({ ...prev, [type]: next }));
        const newCache = readCache();
        newCache.items[type] = next;
        newCache.ts = Date.now();
        writeCache(newCache);
      } else {
        toast.error(`Failed to load ${type}`);
      }
    } catch (e: any) {
      toast.error(`Network error: ${e.message}`);
    } finally {
      setLoading((p) => ({ ...p, [type]: false }));
    }
  }, []);

  const refreshAll = useCallback(async () => {
    if (!canRegenerate()) {
      toast.warning("You can regenerate insights once per hour. Please wait.");
      return;
    }
    markGenerated();
    await Promise.all(TYPES.map((t) => fetchOne(t.id, true)));
    toast.success("All insights refreshed");
  }, [fetchOne]);

  useEffect(() => {
    // Load all insights on mount (using cache if available)
    TYPES.forEach((t) => fetchOne(t.id));
  }, [fetchOne]);

  const copyText = (ins: Insight) => {
    const text = `${ins.insight.emoji} ${ins.insight.title}\n\n${ins.insight.content}\n\n— SkillVerse Insights`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(ins.id);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const shareLink = (ins: Insight) => {
    const text = `${ins.insight.emoji} ${ins.insight.title}: ${ins.insight.content}`;
    if (navigator.share) {
      navigator.share({ title: "SkillVerse Insight", text }).catch(() => {});
    } else {
      copyText(ins);
    }
  };

  const featured = items.insightOfDay;
  const rest = TYPES.filter((t) => t.id !== "insightOfDay");

  return (
    <div>
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-12" data-reveal>
        <div className="absolute inset-0 z-0">
          <DotField dotSpacing={20} cursorRadius={200} sparkle bulgeStrength={20} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <p className="label mb-4">AI INSIGHTS · GENERATED DAILY</p>
          <div style={{ minHeight: 100 }}>
            <TextPressure
              text="Fresh signals from the data."
              className="font-display font-black leading-[0.95] tracking-tight text-3xl sm:text-5xl md:text-7xl"
              minScale={0.85}
              maxScale={1.05}
            />
          </div>
          <div className="mt-6 max-w-2xl mx-auto text-text-secondary text-lg">
            <SplitText
              text="Every insight is generated by Gemini using real survey data. Cached for 24 hours. Refreshable once per hour."
              splitType="words"
              delay={30}
              duration={0.6}
            />
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={refreshAll}
              className="btn-primary text-sm"
              disabled={Object.values(loading).some(Boolean)}
            >
              {Object.values(loading).some(Boolean) ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
              ) : (
                <><RefreshCw className="w-4 h-4" /> Generate New Insights</>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
        {/* Featured insight of the day */}
        {featured ? (
          <MagicBento enableStars clickEffect enableMagnetism={false} className="mb-8">
            <div className="p-8 sm:p-12 relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${featured.insight.gradient} opacity-10`} aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="label">⭐ FEATURED</span>
                  <span className="label">{featured.typeTitle}</span>
                </div>
                <div className="text-6xl mb-4">{featured.insight.emoji}</div>
                <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-4">{featured.insight.title}</h2>
                <p className="text-text-secondary text-lg sm:text-xl leading-relaxed max-w-3xl">{featured.insight.content}</p>
                <p className="text-text-muted text-xs mt-4">Source: {featured.insight.source}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => shareLink(featured)} className="btn-primary text-xs">
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                  <button onClick={() => copyText(featured)} className="btn-secondary text-xs">
                    {copied === featured.id ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
              </div>
            </div>
          </MagicBento>
        ) : (
          <div className="mb-8 glass p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-text-muted mt-3 text-sm">Loading featured insight…</p>
          </div>
        )}

        {/* Other insights in 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((t) => {
            const ins = items[t.id];
            const isLoading = loading[t.id];
            const Icon = t.icon;
            return (
              <SpotlightCard key={t.id}>
                <div className="p-6 min-h-[260px] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span className="label">{t.title}</span>
                    </div>
                    {ins && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => shareLink(ins)}
                          aria-label={`Share ${t.title}`}
                          className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        >
                          <Share2 className="w-3 h-3 text-text-muted" />
                        </button>
                        <button
                          onClick={() => copyText(ins)}
                          aria-label={`Copy ${t.title}`}
                          className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        >
                          {copied === ins.id ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3 text-text-muted" />}
                        </button>
                      </div>
                    )}
                  </div>
                  {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : ins ? (
                    <>
                      <div className="text-4xl mb-3">{ins.insight.emoji}</div>
                      <h3 className="font-display font-black text-xl mb-3">{ins.insight.title}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed flex-1">{ins.insight.content}</p>
                      <p className="text-text-muted text-xs mt-3">Source: {ins.insight.source}</p>
                    </>
                  ) : (
                    <p className="text-text-muted text-sm">Loading…</p>
                  )}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto text-center" data-reveal>
        <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-4">Want the full data?</h2>
        <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">Browse all 250+ responses, or run your own analysis on the data we used to generate these insights.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/dashboard" className="btn-primary text-sm">View Dashboard <Zap className="w-4 h-4" /></a>
          <a href="/workspace" className="btn-secondary text-sm">Run Your Own Analysis</a>
        </div>
      </section>
    </div>
  );
}
