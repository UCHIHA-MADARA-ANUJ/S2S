import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader, CTA } from "@/components/layout/Section";
import { Youtube, MessageCircle, GraduationCap, Bot, MessageSquare, BookOpen, Users, Sparkles, Brain, Globe } from "lucide-react";
import platforms from "@/data/curated/platforms.json";
import Link from "next/link";

export const metadata = {
  title: "Platforms Library",
  description: "15 platforms analyzed — adoption, AI integration, top skills, and age minimums."
};

const ICONS: Record<string, any> = {
  YouTube: Youtube,
  Instagram: Sparkles,
  Discord: MessageCircle,
  "Khan Academy": GraduationCap,
  Duolingo: Globe,
  Coursera: BookOpen,
  GitHub: Brain,
  Canva: Sparkles,
  "ChatGPT / Gemini": Bot,
  WhatsApp: MessageSquare,
  "Google Classroom": BookOpen,
  Udemy: BookOpen,
  Reddit: Users,
  TikTok: Sparkles
};

const CATEGORY_LABELS: Record<string, string> = {
  video: "Video",
  social: "Social",
  community: "Community",
  education: "Education",
  language: "Language",
  developer: "Developer",
  design: "Design",
  ai: "AI",
  audio: "Audio",
  communication: "Communication",
  reading: "Reading"
};

const AI_LEVEL_COLOR: Record<string, string> = {
  high: "bg-success/20 text-success border border-success/30",
  medium: "bg-warning/20 text-warning border border-warning/30",
  low: "bg-error/20 text-error border border-error/30"
};

export default function PlatformsPage() {
  const allPlatforms = platforms as any[];
  const totalUsers = allPlatforms.reduce((s, x) => s + (x.users || 0), 0);
  const avgUsers = Math.round(totalUsers / allPlatforms.length);
  const highAI = allPlatforms.filter(p => p.aiIntegration === "high").length;

  return (
    <div>
      <PageHeader
        label="PLATFORMS LIBRARY · 15 ANALYZED"
        title="Where do teens learn?"
        subtitle="15 platforms ranked by adoption, AI integration, age-appropriateness, and the real-world skills they teach best."
        kpis={[
          { value: allPlatforms.length, label: "Platforms" },
          { value: avgUsers, suffix: "%", label: "Avg Adoption" },
          { value: highAI, label: "AI-Native" },
          { value: Math.min(...allPlatforms.map(p => p.ageMin || 13)), label: "Youngest Age" }
        ]}
      />

      <Section>
        <SectionHeader
          align="left"
          label="BROWSE"
          title={<>All <span className="text-primary">Platforms</span></>}
          description="Each card shows adoption rate, age minimum, AI integration level, and the top skills taught."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allPlatforms.map((p) => {
            const Icon = ICONS[p.name] || Sparkles;
            const aiColor = AI_LEVEL_COLOR[p.aiIntegration] || "bg-white/10 text-white border border-white/20";
            return (
              <div key={p.name} className="glass p-5 hover:border-primary/50 transition-all duration-300 group flex flex-col h-full min-h-[280px]">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <span className="label text-[10px] shrink-0">{CATEGORY_LABELS[p.category] || p.category}</span>
                </div>
                <h3 className="font-display font-black text-lg mb-3 text-text-primary leading-tight break-words">
                  {p.name}
                </h3>
                <div className="space-y-1.5 text-sm text-text-secondary flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-muted text-xs">Adoption</span>
                    <span className="font-mono text-white text-xs whitespace-nowrap">{p.users}%</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-muted text-xs">Primary Use</span>
                    <span className="font-mono text-white text-xs capitalize truncate">{p.primaryUse}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-muted text-xs">Age Min</span>
                    <span className="font-mono text-white text-xs whitespace-nowrap">{p.ageMin}+</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-muted text-xs">AI Level</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize whitespace-nowrap ${aiColor}`}>{p.aiIntegration}</span>
                  </div>
                </div>
                {p.topSkills?.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-white/5">
                    <p className="text-[10px] text-text-muted mb-1">Top Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {p.topSkills.slice(0, 3).map((s: string) => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-secondary truncate max-w-[80px]">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <CTA
        title="Curious about a platform?"
        description="Use AI to compare any platform with our survey data, or get a personalized recommendation."
        primary={{ label: "Ask SkillBot", href: "/ai-hub/chatbot" }}
        secondary={{ label: "View Research", href: "/research" }}
      />
    </div>
  );
}
