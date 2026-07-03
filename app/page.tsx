import Link from "next/link";
import { ArrowRight, ArrowDown, Bot, Brain, FileText, Languages, Target, BarChart3, Sparkles, Heart, TrendingUp, Search } from "lucide-react";
import { getStats } from "@/lib/data/stats";
import { HeroScene } from "@/components/three/HeroScene";
import { LiveCounter } from "@/components/dashboard/LiveCounter";
import { Marquee } from "@/components/effects/Marquee";
import { AI_FEATURES, SITE } from "@/lib/constants";

const ICONS: any = { Bot, Brain, Target, Search, FileText, TrendingUp, Languages, BarChart3, Heart, Sparkles };

export default async function HomePage() {
  const stats = await getStats();
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs label mb-8">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            {SITE.competition}
          </div>
          <h1 className="font-display font-black leading-[0.85] tracking-tight">
            <div className="text-[clamp(3rem,12vw,11rem)] text-text-primary/10 select-none">SCREENS</div>
            <div className="text-[clamp(2.5rem,9vw,8rem)] text-white -mt-[0.2em]">become</div>
            <div className="text-[clamp(3rem,12vw,11rem)] bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent -mt-[0.1em]">SKILLS.</div>
          </h1>
          <p className="mt-8 text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto text-balance">
            We surveyed <LiveCounter initial={stats.total} /> real students. We analyzed their digital habits with AI. We built this.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-base">
              EXPLORE DASHBOARD <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/survey" className="btn-secondary text-base">
              TAKE SURVEY
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <KPI value={stats.total} label="Students" />
            <KPI value={`${stats.avgScreenTime}hrs`} label="Avg/Day" />
            <KPI value={`${stats.aiUsageRate}%`} label="Use AI" />
            <KPI value={`${stats.positiveImpactRate}%`} label="Positive" />
          </div>
          <div className="mt-16 flex justify-center text-text-muted animate-bounce">
            <ArrowDown size={20} />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee items={[
        stats.topPlatform,
        "GitHub",
        "Khan Academy",
        "Discord",
        "Duolingo",
        stats.topSkill,
        "AI Tools",
        "Coding",
        "Video Editing",
        "Graphic Design",
        "145+ students",
        "12+ cities",
        "Screen2Skill 2026"
      ]} />

      {/* MISSION */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <p className="label mb-4">THE MISSION</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight">
              We don't just track screen time.
              <br />
              <span className="text-primary">We prove it can build skills.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 space-y-6 text-text-secondary leading-relaxed">
            <p>
              Every day, students spend hours on screens. The question isn't whether screens are good or bad—it's whether they're being used intentionally.
            </p>
            <p>
              SkillVerse uses AI to analyze 145+ real survey responses from teenagers across India, mapping exactly how digital platforms translate into actual skills—from coding to communication.
            </p>
            <p className="text-text-primary font-semibold">This is the data. This is the proof.</p>
          </div>
        </div>
      </section>

      {/* AI HUB PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 sm:py-32 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="label mb-3">8 AI TOOLS</p>
          <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight">Powered by Gemini.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AI_FEATURES.map((f) => {
            const Icon = ICONS[f.icon] || Bot;
            return (
              <Link key={f.id} href={f.href} className="group glass p-6 hover:border-primary/50 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-text-secondary text-sm mb-3">{f.desc}</p>
                <p className="text-primary text-xs font-mono uppercase tracking-widest">Try it →</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-32 max-w-5xl mx-auto text-center">
        <h2 className="font-display font-black text-5xl sm:text-7xl tracking-tight mb-6">
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

function KPI({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="glass p-4 text-left">
      <div className="text-3xl sm:text-4xl font-display font-black tabular-nums">{value}</div>
      <div className="label mt-1">{label}</div>
    </div>
  );
}
