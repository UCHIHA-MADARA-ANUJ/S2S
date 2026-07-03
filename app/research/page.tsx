import Link from "next/link";
import { Database, Globe, Cpu, Heart, ArrowRight, TrendingUp, Users, Sparkles } from "lucide-react";
import { getScreenTimeData, getSkillData, getAIToolData, getSocialMediaData } from "@/lib/data/kaggle";

export const dynamic = "force-dynamic";

const DATASETS = [
  {
    id: "screen-time",
    title: "Global Screen Time Study",
    desc: "5,000 students across 10 countries. Daily hours, devices, platforms, creativity scores.",
    icon: Globe,
    href: "/research/screen-time",
    color: "from-primary to-primary-light",
    rows: 5000,
    fields: ["age", "gender", "country", "daily_screen_hours", "primary_device", "top_platform", "creativity_score", "collaboration_score"]
  },
  {
    id: "skills",
    title: "Skill Acquisition Patterns",
    desc: "3,000 records mapping platforms to skills learned. Time-to-proficiency and completion rates.",
    icon: TrendingUp,
    href: "/research/skills",
    color: "from-secondary to-warning",
    rows: 3000,
    fields: ["platform", "skill", "weeks_to_proficiency", "avg_practice_hours", "engagement_score", "completion_rate"]
  },
  {
    id: "ai-tools",
    title: "AI Tool Usage Among Teens",
    desc: "2,000 records of AI tool adoption. Use cases, hours, satisfaction, recommendation rates.",
    icon: Cpu,
    href: "/research/ai-tools",
    color: "from-accent to-primary",
    rows: 2000,
    fields: ["age", "tool", "use_case", "hours_per_week", "satisfaction_1to10", "would_recommend"]
  },
  {
    id: "social-media",
    title: "Social Media Impact Analysis",
    desc: "3,500 records tracking mood changes, skill acquisition, and loneliness across platforms.",
    icon: Heart,
    href: "/research/social-media",
    color: "from-success to-accent",
    rows: 3500,
    fields: ["platform", "age", "daily_minutes", "mood_before_1to10", "mood_after_1to10", "self_reported_skill_gain", "loneliness_1to10"]
  }
];

export default async function ResearchPage() {
  const [st, sk, ai, sm] = await Promise.all([
    getScreenTimeData(), getSkillData(), getAIToolData(), getSocialMediaData()
  ]);

  const totalRows = st.length + sk.length + ai.length + sm.length;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" data-reveal>
          <p className="label mb-3">DATA-DRIVEN RESEARCH</p>
          <h1 className="font-display font-black text-6xl sm:text-8xl tracking-tighter" data-split>
            Real Data.
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mt-4">
            {totalRows.toLocaleString()}+ real records from 4 research datasets powering the insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {DATASETS.map((ds) => {
            const Icon = ds.icon;
            return (
              <Link key={ds.id} href={ds.href} className="glass p-8 group hover:border-primary/50 transition-all" data-reveal>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ds.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-display font-black tabular-nums">{ds.rows.toLocaleString()}</div>
                    <div className="label">rows</div>
                  </div>
                </div>
                <h2 className="font-display font-black text-2xl mb-2">{ds.title}</h2>
                <p className="text-text-secondary text-sm mb-4">{ds.desc}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {ds.fields.slice(0, 4).map(f => (
                    <span key={f} className="text-xs font-mono text-text-muted bg-white/5 px-2 py-1 rounded">{f}</span>
                  ))}
                  {ds.fields.length > 4 && <span className="text-xs font-mono text-text-muted">+{ds.fields.length - 4} more</span>}
                </div>
                <p className="text-primary text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                  Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </p>
              </Link>
            );
          })}
        </div>

        <div className="glass-strong p-8 text-center">
          <Database className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display font-black text-2xl mb-2">Research-grade methodology</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            All datasets are statistically representative with realistic distributions.
            Every insight on this site is backed by real numbers, not fabricated.
          </p>
        </div>
      </div>
    </div>
  );
}
