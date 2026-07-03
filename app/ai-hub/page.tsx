import Link from "next/link";
import { Bot, Brain, Target, Search, FileText, TrendingUp, Languages, BarChart3, Heart, Sparkles, ArrowRight } from "lucide-react";

const ICONS: any = { Bot, Brain, Target, Search, FileText, TrendingUp, Languages, BarChart3, Heart, Sparkles };

const FEATURES = [
  { id: "chatbot", title: "SkillBot", desc: "Conversational AI learning companion", href: "/ai-hub/chatbot", icon: "Bot", color: "from-primary to-primary-light" },
  { id: "wellness", title: "Wellness Analyzer", desc: "AI digital wellness scoring", href: "/ai-hub/wellness", icon: "Heart", color: "from-success to-accent" },
  { id: "pathway", title: "Skill Pathway", desc: "Personalized 4-week learning plans", href: "/ai-hub/pathway", icon: "Target", color: "from-secondary to-primary" },
  { id: "content", title: "Content Scorer", desc: "Rate any content's educational value", href: "/ai-hub/content", icon: "Search", color: "from-accent to-primary" },
  { id: "report", title: "Report Writer", desc: "AI-generated research reports", href: "/ai-hub/report", icon: "FileText", color: "from-warning to-primary" },
  { id: "trends", title: "Trend Predictor", desc: "Predict rising digital learning trends", href: "/ai-hub/trends", icon: "TrendingUp", color: "from-pink-500 to-primary" },
  { id: "translator", title: "Translator", desc: "Translate insights to 8+ languages", href: "/ai-hub/translator", icon: "Languages", color: "from-cyan-400 to-accent" },
  { id: "analyst", title: "Data Analyst", desc: "AI pattern detection in survey data", href: "/ai-hub/analyst", icon: "BarChart3", color: "from-slate-400 to-primary" }
];

export default function AIHubPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs label mb-6">
            <Sparkles className="w-3 h-3" /> POWERED BY GEMINI 2.0 FLASH
          </div>
          <h1 className="font-display font-black text-6xl sm:text-8xl tracking-tighter">
            AI <span className="text-primary">Hub</span>.
          </h1>
          <p className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">8 AI tools. One mission: prove that screens can become skills.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => {
            const Icon = ICONS[f.icon] || Bot;
            return (
              <Link key={f.id} href={f.href} className="group glass p-6 hover:border-primary/50 transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-black text-xl mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm mb-4">{f.desc}</p>
                <p className="text-primary text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                  Open <ArrowRight className="w-3 h-3" />
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
