import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowDown, Bot, Brain, FileText, Languages, Target, BarChart3, Heart, TrendingUp, Search, Sparkles, Zap, Lock, Globe } from "lucide-react";
import { getStats } from "@/lib/data/stats";
import { HeroScene } from "@/components/three/HeroScene";
import { LiveCounter } from "@/components/dashboard/LiveCounter";
import { Marquee } from "@/components/effects/Marquee";
import { DotField } from "@/components/effects/DotField";
import { TextPressure } from "@/components/effects/TextPressure";
import { CountUp } from "@/components/effects/CountUp";
import { StarBorder } from "@/components/effects/StarBorder";
import { MagicRings } from "@/components/effects/MagicRings";
import { SplitText } from "@/components/effects/SplitText";
import { AI_FEATURES, SITE } from "@/lib/constants";
import { CinematicWrapper } from "@/components/layout/CinematicWrapper";
import skills from "@/data/curated/skills.json";
import platforms from "@/data/curated/platforms.json";
import { MagicBento } from "@/components/effects/MagicBento";
import { Sparkles as SparklesIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

const ICONS: any = { Bot, Brain, Target, Search, FileText, TrendingUp, Languages, BarChart3, Heart, Sparkles };

export default async function HomePage() {
  const stats = await getStats();
  return (
    <div>
      <CinematicWrapper />
      {/* HERO with DotField background + MagicRings + TextPressure */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" data-reveal>
        {/* DotField background */}
        <div className="absolute inset-0 z-0">
          <DotField dotSpacing={20} cursorRadius={250} sparkle bulgeStrength={36} />
        </div>
        {/* Image fallback */}
        <div className="absolute inset-0 z-0 opacity-30">
          <Image src="/images/hero-main.png" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        <HeroScene />
        {/* MagicRings behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 opacity-30">
          <MagicRings rings={5} size={600} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div data-reveal className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs label mb-8">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            {SITE.competition}
            <span className="text-text-muted">·</span>
            <span className="text-text-muted"><CountUp to={stats.total} duration={2.5} /> responses analyzed</span>
          </div>
          {/* TextPressure headline */}
          <div className="mb-4" style={{ minHeight: '180px' }}>
            <TextPressure
              text="SCREENS become SKILLS."
              className="font-display font-black leading-[0.9] sm:leading-[0.85] tracking-tight text-3xl sm:text-5xl md:text-7xl lg:text-8xl"
              minScale={0.7}
              maxScale={1.05}
            />
          </div>
          <div data-reveal className="mt-8 text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto text-balance">
            <SplitText
              text="We surveyed 250+ real students. We analyzed their digital habits with AI. We built this."
              splitType="words"
              delay={40}
              duration={0.7}
            />
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center" data-reveal>
            <StarBorder color="#6366F1" speed={5}>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white">
                EXPLORE DASHBOARD
                <ArrowRight className="w-4 h-4" />
              </Link>
            </StarBorder>
            <Link href="/survey" className="btn-secondary text-base">
              TAKE SURVEY
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto" data-reveal>
            <KPI value={String(stats.total)} label="Students" icon="Users" />
            <KPI value={stats.avgScreenTime + "hr"} label="Avg/Day" icon="Clock" />
            <KPI value={stats.aiUsageRate + "%"} label="Use AI" icon="Zap" highlight />
            <KPI value={stats.positiveImpactRate + "%"} label="Positive" icon="TrendingUp" />
          </div>
          <div className="mt-16 flex justify-center text-text-muted animate-bounce" data-reveal>
            <ArrowDown size={20} />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee items={[
        stats.topPlatform, "GitHub", "Khan Academy", "Discord", "Duolingo",
        stats.topSkill, "AI Tools", "Coding", "Video Editing", "Graphic Design",
        "250+ students", "12+ cities", "Screen2Skill 2026", "WAKE UP TO REALITY"
      ]} />

      {/* MISSION with AI image */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 max-w-7xl mx-auto" data-reveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 relative">
            <div className="absolute -left-20 -top-20 w-72 h-72 opacity-20 -z-10" data-parallax="0.3">
              <Image src="/images/section-2.svg" alt="" width={600} height={400} className="w-full h-full" />
            </div>
            <p className="label mb-4">THE MISSION</p>
            <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight">
              We don't just track <br />
              <span className="text-primary">screen time.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 space-y-6 text-text-secondary leading-relaxed">
            <p className="text-lg">Every day, students spend hours on screens. The question isn't whether they're good or bad—it's whether they're being used <span className="text-primary font-bold">intentionally</span>.</p>
            <p>SkillVerse uses AI to analyze 250+ real survey responses from teenagers across India, mapping exactly how digital platforms translate into actual skills—from coding to communication to AI prompting.</p>
            <p className="text-text-primary font-semibold">This is the data. This is the proof.</p>
          </div>
        </div>
      </section>


      {/* FEATURED SKILLS & PLATFORMS */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 max-w-7xl mx-auto" data-reveal>
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="label mb-3">FEATURED LIBRARY</p>
            <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight">
              Skills & Platforms<br />
              <span className="text-primary">that actually teach.</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/skills" className="btn-secondary text-sm">All Skills <ArrowUpRight className="w-4 h-4" /></Link>
            <Link href="/platforms" className="btn-secondary text-sm">All Platforms <ArrowUpRight className="w-4 h-4" /></Link>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-primary" /> Top Skills</h3>
            <div className="grid grid-cols-2 gap-3">
              {(skills as any[]).slice(0, 6).map((sk, i) => (
                <Link key={sk.name} href="/skills" className="glass p-4 hover:border-primary/50 transition-all group">
                  <div className="text-xs text-text-muted mb-1">{sk.category}</div>
                  <div className="font-display font-bold text-sm mb-2 text-text-primary group-hover:text-primary transition-colors">{sk.name}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">{sk.avgHoursToBasic}h basic</span>
                    <span className="text-primary font-mono">{sk.earnersPct}% earn</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-accent" /> Top Platforms</h3>
            <div className="grid grid-cols-2 gap-3">
              {(platforms as any[]).slice(0, 6).map((pl, i) => (
                <Link key={pl.name} href="/platforms" className="glass p-4 hover:border-accent/50 transition-all group">
                  <div className="text-xs text-text-muted mb-1">{pl.category}</div>
                  <div className="font-display font-bold text-sm mb-2 text-text-primary group-hover:text-accent transition-colors">{pl.name}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary capitalize">{pl.primaryUse}</span>
                    <span className="text-accent font-mono">{pl.users}% use</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS WITH AI BRAIN IMAGE */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square max-w-md mx-auto" data-reveal>
            <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl" />
            <Image src="/images/ai-brain.png" alt="AI Brain" fill className="object-contain relative" />
          </div>
          <div data-reveal>
            <p className="label mb-3">8 AI TOOLS</p>
            <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight mb-6" data-split>
              Powered by Gemini.
            </h2>
            <p className="text-text-secondary text-lg mb-8">Every AI feature uses Google Gemini 2.5 Flash. Real analysis on real data.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AI_FEATURES.slice(0, 4).map((f) => {
                const Icon = ICONS[f.icon] || Bot;
                return (
                  <Link key={f.id} href={f.href} className="glass p-4 text-center hover:border-primary/50 group">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-display font-bold">{f.title}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ALL 8 AI FEATURES */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 max-w-7xl mx-auto">
        <div className="mb-12" data-reveal>
          <p className="label mb-3">FULL SUITE</p>
          <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight" data-split>
            Every AI tool you need.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AI_FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon] || Bot;
            return (
              <Link key={f.id} href={f.href} className="group glass p-6 hover:border-primary/50 transition-all" data-reveal style={{ transitionDelay: `${i * 50}ms` }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-black text-xl mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm mb-4">{f.desc}</p>
                <p className="text-primary text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                  Open <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-reveal>
            <p className="label mb-3">REAL-TIME</p>
            <h2 className="font-display font-black text-4xl sm:text-6xl tracking-tight mb-6" data-split>
              Live dashboard.
            </h2>
            <p className="text-text-secondary text-lg mb-8">6+ interactive charts. Supabase WebSocket updates within 1-2 seconds. Real data from real students.</p>
            <div className="space-y-3 mb-8">
              <Bullet text="Pie chart: device distribution" />
              <Bullet text="Bar chart: platform usage" />
              <Bullet text="Radar chart: skills developed" />
              <Bullet text="Area chart: age distribution" />
              <Bullet text="Real-time AI insights" />
            </div>
            <Link href="/dashboard" className="btn-primary text-sm">
              OPEN DASHBOARD <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden glass" data-reveal>
            <Image src="/images/dashboard-bg.png" alt="Dashboard preview" fill className="object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="grid grid-cols-3 gap-3">
                <Mini value={stats.total} label="Students" />
                <Mini value={stats.avgScreenTime + "h"} label="Avg/Day" />
                <Mini value={stats.aiUsageRate + "%"} label="AI" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-32 max-w-5xl mx-auto text-center relative" data-reveal>
        <div className="absolute inset-0 opacity-20 -z-10" data-parallax="0.4">
          <Image src="/images/hero-main.png" alt="" fill className="object-cover" />
        </div>
        <h2 className="font-display font-black text-5xl sm:text-8xl tracking-tight mb-6">
          Be the <span className="text-primary">next</span> data point.
        </h2>
        <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
          2 minutes. Anonymous. 21 questions. Part of the research.
        </p>
        <Link href="/survey" className="btn-primary text-base">
          START THE SURVEY <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

function KPI({ value, label, icon, highlight }: any) {
  const Icon = ICONS[icon] || Sparkles;
  return (
    <div className={`glass p-4 text-left ${highlight ? "border-primary/50" : ""}`} data-reveal>
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-4 h-4 ${highlight ? "text-primary" : "text-text-muted"}`} />
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
      </div>
      <div className="text-3xl sm:text-4xl font-display font-black tabular-nums">{value}</div>
      <div className="label mt-1">{label}</div>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-text-secondary text-sm">
      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
      {text}
    </div>
  );
}

function Mini({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="glass-strong p-3 text-center">
      <div className="text-2xl font-display font-black text-primary tabular-nums">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}
