"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Brush, Brain, Mic, Camera, Database, Rocket, BookOpen, Briefcase, BarChart3, Lightbulb, Globe, Sparkles, Box, Music, ArrowUpRight } from "lucide-react";
import { SkillDetailModal, type Skill } from "@/components/ui/SkillDetailModal";

const ICONS: Record<string, any> = {
  Code2, Brush, Brain, Mic, Camera, Database, Rocket, BookOpen, Briefcase, BarChart3, Lightbulb, Globe, Sparkles, Box, Music, ArrowUpRight
};

export default function SkillsGrid({ skills }: { skills: any[] }) {
  const [selected, setSelected] = useState<Skill | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skills.map((s, i) => {
          const Icon = ICONS[s.iconName] || Sparkles;
          return (
            <motion.button
              key={s.name}
              type="button"
              onClick={() => setSelected(s)}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
              whileHover={{ y: -4 }}
              className="glass p-5 hover:border-primary/50 transition-all duration-300 group flex flex-col h-full min-h-[300px] text-left relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all duration-500" aria-hidden="true" />

              <div className="flex items-start justify-between gap-2 mb-3 relative">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </motion.div>
                <span className="label text-[10px] shrink-0">{s.categoryLabel}</span>
              </div>

              <h3 className="font-display font-black text-lg mb-4 text-text-primary leading-tight break-words">
                {s.name}
              </h3>

              <div className="space-y-1.5 text-sm text-text-secondary flex-1">
                <Row label="To Basic" value={`${s.avgHoursToBasic}h`} />
                <Row label="To Pro" value={`${s.avgHoursToPro}h`} />
                <Row label="Earn %" value={`${s.earnersPct}%`} highlight />
                <Row label="Avg Earning" value={`₹${(s.avgFirstEarning || 0).toLocaleString()}`} highlight />
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted">Top Platform</p>
                  <p className="text-xs text-white font-semibold truncate">{s.topPlatform}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                  View <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <SkillDetailModal skill={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-text-muted text-xs">{label}</span>
      <span className={`font-mono text-xs whitespace-nowrap ${highlight ? "text-primary" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}
