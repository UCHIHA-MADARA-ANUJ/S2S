"use client";
import { useEffect, useState } from "react";
import { Trophy, Lock, Sparkles, Share2, Check } from "lucide-react";
import { DotField } from "@/components/effects/DotField";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { CountUp } from "@/components/effects/CountUp";
import { ShareButton } from "@/components/ui/ShareButton";
import { getAllAchievements, getUnlockedAchievements, getAchievementState, type Achievement } from "@/components/ui/Celebration";
import { toast } from "sonner";

const TIER_COLORS = { bronze: "from-amber-700 to-amber-500", silver: "from-slate-400 to-slate-300", gold: "from-yellow-500 to-yellow-300" };
const TIER_LABELS = { bronze: "Bronze", silver: "Silver", gold: "Gold" };

export default function AchievementsPage() {
  const [state, setState] = useState<ReturnType<typeof getAchievementState> | null>(null);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    setState(getAchievementState());
    setUnlocked(new Set(getUnlockedAchievements().map((a) => a.id)));
  }, []);

  const all = getAllAchievements();
  const pct = Math.round((unlocked.size / all.length) * 100);

  return (
    <div>
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 z-0">
          <DotField dotSpacing={20} cursorRadius={200} sparkle bulgeStrength={20} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <p className="label mb-4">ACHIEVEMENTS</p>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight mb-4">Your <span className="text-primary">Trophy Case</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10">Unlock badges by exploring SkillVerse. Every action counts.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <SpotlightCard>
              <div className="text-3xl font-display font-black text-primary"><CountUp to={unlocked.size} /></div>
              <div className="label mt-1">Unlocked</div>
            </SpotlightCard>
            <SpotlightCard>
              <div className="text-3xl font-display font-black text-text-secondary"><CountUp to={all.length - unlocked.size} /></div>
              <div className="label mt-1">Locked</div>
            </SpotlightCard>
            <SpotlightCard>
              <div className="text-3xl font-display font-black text-accent"><CountUp to={pct} suffix="%" /></div>
              <div className="label mt-1">Progress</div>
            </SpotlightCard>
            <SpotlightCard>
              <div className="text-3xl font-display font-black text-secondary">
                <CountUp to={[...unlocked].filter((id) => all.find((a) => a.id === id)?.tier === "gold").length} />
              </div>
              <div className="label mt-1">Gold</div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-5xl mx-auto">
        <div className="space-y-3">
          {all.map((a) => {
            const isUnlocked = unlocked.has(a.id);
            return (
              <SpotlightCard key={a.id}>
                <div className="p-5 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${isUnlocked ? `bg-gradient-to-br ${TIER_COLORS[a.tier]}` : "bg-white/5"}`} aria-hidden="true">
                    {isUnlocked ? a.emoji : <Lock className="w-5 h-5 text-text-muted" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-display font-bold text-base sm:text-lg ${isUnlocked ? "" : "text-text-muted"}`}>
                        {isUnlocked ? a.title : "???"}
                      </h3>
                      <span className="label">{TIER_LABELS[a.tier]}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{isUnlocked ? a.description : "Locked — keep exploring to unlock"}</p>
                  </div>
                  {isUnlocked && (
                    <ShareButton
                      size="sm"
                      variant="ghost"
                      label=""
                      text={`I just unlocked "${a.title}" on SkillVerse! ${a.emoji}`}
                      hashtags={["SkillVerse", "Achievement"]}
                    />
                  )}
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        <div className="mt-12 glass-strong p-8 rounded-2xl text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" aria-hidden="true" />
          <h2 className="font-display font-black text-2xl mb-2">Keep exploring</h2>
          <p className="text-text-secondary text-sm mb-6">Every action you take can unlock a new badge.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <a href="/survey" className="btn-primary text-xs">Take Survey</a>
            <a href="/ai-hub" className="btn-secondary text-xs">Try AI Features</a>
            <a href="/workspace" className="btn-secondary text-xs">Upload CSV</a>
            <a href="/pledge" className="btn-secondary text-xs">Sign Pledge</a>
          </div>
        </div>
      </section>
    </div>
  );
}
