import { Brain, Target, Users, Sparkles, Lock, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/constants";
import { DotField } from "@/components/effects/DotField";
import { MagicBento } from "@/components/effects/MagicBento";
import { TextPressure } from "@/components/effects/TextPressure";
import { CountUp } from "@/components/effects/CountUp";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import Link from "next/link";

const reasons = [
  { icon: Brain, title: "Real Research", desc: "Surveyed 250+ students across 12+ Indian cities. Real data, real insights.", color: "from-primary to-secondary" },
  { icon: Target, title: "AI-First", desc: "8 AI features powered by Google Gemini 2.5 Flash. Real analysis on real data.", color: "from-secondary to-pink" },
  { icon: Users, title: "Built by Students", desc: "Designed by 4 10th-graders who actually live the screen time reality.", color: "from-accent to-blue-500" },
  { icon: Lock, title: "Anonymous", desc: "Device fingerprinting for dedup. No login. No tracking. No bullshit.", color: "from-success to-emerald-500" }
];

const timeline = [
  { date: "Jan 2026", event: "SkillVerse project conceived" },
  { date: "Feb 2026", event: "Survey design + 50 pilot responses" },
  { date: "Mar 2026", event: "Supabase database + Gemini AI integration" },
  { date: "Apr 2026", event: "8 AI features built" },
  { date: "May 2026", event: "150+ responses collected" },
  { date: "Jun 2026", event: "Premium UI with 23 FX components" },
  { date: "Jul 2026", event: "Screen2Skill 2026 submission" }
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <DotField dotSpacing={28} cursorRadius={250} sparkle />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="label mb-3">THE STORY</p>
          <TextPressure text="About." className="font-display font-black text-5xl sm:text-7xl tracking-tighter" minScale={1} maxScale={1.1} />
        </div>

        {/* Stats with CountUp */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          <SpotlightCard>
            <div className="text-3xl font-display font-black"><CountUp to={250} suffix="+" /></div>
            <div className="label mt-1">Students</div>
          </SpotlightCard>
          <SpotlightCard>
            <div className="text-3xl font-display font-black"><CountUp to={30} /></div>
            <div className="label mt-1">Datasets</div>
          </SpotlightCard>
          <SpotlightCard>
            <div className="text-3xl font-display font-black"><CountUp to={8} /></div>
            <div className="label mt-1">AI Features</div>
          </SpotlightCard>
          <SpotlightCard>
            <div className="text-3xl font-display font-black"><CountUp to={22} /></div>
            <div className="label mt-1">FX Components</div>
          </SpotlightCard>
        </div>

        {/* Mission */}
        <div className="glass p-8 sm:p-12 mb-12" data-reveal>
          <h2 className="font-display font-black text-2xl mb-4">Why we built this.</h2>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            Every day, students spend hours on screens. Parents worry. Teachers worry. Society worries.
          </p>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            But we wanted to ask a different question: <span className="text-primary font-bold">what if screens are where the skills are?</span>
          </p>
          <p className="text-text-secondary leading-relaxed text-lg">
            SkillVerse analyzes 250+ real survey responses using AI to map how digital platforms translate into measurable skills — from coding to video editing to AI prompting.
          </p>
        </div>

        {/* Why we built this - MagicBento */}
        <h2 className="font-display font-black text-3xl text-center mb-8" data-reveal>Why SkillVerse</h2>
        <MagicBento columns={2} enableStars clickEffect>
          {reasons.map((r, i) => (
            <div key={i} className="py-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-3`}>
                <r.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-display font-bold text-white text-lg">{r.title}</div>
              <div className="text-text-muted text-sm mt-1">{r.desc}</div>
            </div>
          ))}
        </MagicBento>

        {/* Timeline */}
        <h2 className="font-display font-black text-3xl text-center mt-16 mb-8" data-reveal>Our Journey</h2>
        <div className="space-y-3">
          {timeline.map((t, i) => (
            <ScrollReveal key={i} effect="slide-left" delay={i * 0.08}>
              <div className="glass p-4 flex items-center gap-4">
                <div className="font-mono text-primary text-sm w-24">{t.date}</div>
                <div className="w-1 h-6 bg-primary/30 rounded" />
                <div className="text-text-secondary">{t.event}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/showcase" className="btn-primary inline-flex items-center gap-2">
            See the FX <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
