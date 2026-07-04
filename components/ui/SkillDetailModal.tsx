"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, TrendingUp, DollarSign, BookOpen, ArrowRight, Sparkles, Users, CheckCircle2, Play, ExternalLink, Target, Zap } from "lucide-react";
import Link from "next/link";

export interface Skill {
  name: string;
  category?: string;
  avgHoursToBasic?: number;
  avgHoursToPro?: number;
  earnersPct?: number;
  topPlatform?: string;
  avgFirstEarning?: number;
  description?: string;
  icon?: any;
  color?: string;
  skillsYouCanLearn?: string[];
  bestFor?: string[];
  resources?: { name: string; url: string; free: boolean }[];
}

export function SkillDetailModal({ skill, onClose }: { skill: Skill | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[400] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-title"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl my-8 rounded-3xl overflow-hidden bg-gradient-to-b from-surface to-background border border-white/10"
          >
            {/* Hero header */}
            <div className={`relative p-8 bg-gradient-to-br ${skill.color || "from-primary to-accent"} overflow-hidden`}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4),transparent_50%)]" />
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  {skill.icon && (
                    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                      <skill.icon className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-widest font-mono">{skill.category || "Skill"}</p>
                    <h2 id="skill-title" className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
                      {skill.name}
                    </h2>
                  </div>
                </div>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl">
                  {skill.description || `Master ${skill.name} with our AI-powered learning pathway. Get a personalized 4-week plan, real resources, and progress tracking.`}
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5">
              <Stat icon={Clock} label="To Basic" value={`${skill.avgHoursToBasic || 0}h`} accent="text-accent" />
              <Stat icon={Target} label="To Pro" value={`${skill.avgHoursToPro || 0}h`} accent="text-primary" />
              <Stat icon={TrendingUp} label="Earn %" value={`${skill.earnersPct || 0}%`} accent="text-success" />
              <Stat icon={DollarSign} label="First Earning" value={`₹${(skill.avgFirstEarning || 0).toLocaleString()}`} accent="text-secondary" />
            </div>

            {/* Top platform */}
            {skill.topPlatform && (
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-4 h-4 text-primary" />
                  <p className="label">BEST PLATFORM TO START</p>
                </div>
                <p className="text-xl font-display font-black text-white">{skill.topPlatform}</p>
                <p className="text-text-muted text-xs mt-1">Most learners in our survey said this platform taught them the skill.</p>
              </div>
            )}

            {/* Skills you can build */}
            {skill.skillsYouCanLearn && skill.skillsYouCanLearn.length > 0 && (
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-secondary" />
                  <p className="label">SKILLS YOU&apos;LL BUILD</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.skillsYouCanLearn.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full bg-white/5 text-sm text-text-secondary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Best for */}
            {skill.bestFor && skill.bestFor.length > 0 && (
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-accent" />
                  <p className="label">BEST FOR</p>
                </div>
                <ul className="space-y-1.5 text-sm text-text-secondary">
                  {skill.bestFor.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Free resources */}
            {skill.resources && skill.resources.length > 0 && (
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-pink-500" />
                  <p className="label">FREE RESOURCES TO START</p>
                </div>
                <div className="space-y-2">
                  {skill.resources.map((r) => (
                    <a
                      key={r.url}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium">{r.name}</span>
                        {r.free && <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/20 text-success font-mono">FREE</span>}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="p-6 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/ai-hub/pathway?skill=${encodeURIComponent(skill.name)}`}
                onClick={onClose}
                className="btn-primary text-sm flex-1 justify-center"
              >
                <Sparkles className="w-4 h-4" /> Get 4-week plan
              </Link>
              <Link
                href={`/ai-hub/chatbot?ask=${encodeURIComponent(`Teach me ${skill.name} from scratch`)}`}
                onClick={onClose}
                className="btn-secondary text-sm flex-1 justify-center"
              >
                Ask SkillBot <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: string }) {
  return (
    <div className="bg-background p-4 text-center">
      <Icon className={`w-4 h-4 mx-auto mb-2 ${accent || "text-text-muted"}`} />
      <p className={`text-xl sm:text-2xl font-display font-black ${accent || "text-white"}`}>{value}</p>
      <p className="label mt-1">{label}</p>
    </div>
  );
}
