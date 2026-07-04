"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Home, BarChart3, Brain, BookOpen, FileText, Layers, Sparkles, Wrench, Code, Users, Bot, Heart, Database, TrendingUp, Languages, Camera, BookOpen as Docs } from "lucide-react";
import { announce } from "@/lib/a11y";

interface Item { id: string; title: string; href: string; icon: any; group: string; keywords?: string; }

const PAGES: Item[] = [
  { id: "home", title: "Home", href: "/", icon: Home, group: "Pages" },
  { id: "dashboard", title: "Dashboard", href: "/dashboard", icon: BarChart3, group: "Pages" },
  { id: "research", title: "Research", href: "/research", icon: Database, group: "Pages" },
  { id: "skills", title: "Skills Library", href: "/skills", icon: BookOpen, group: "Pages" },
  { id: "platforms", title: "Platforms Library", href: "/platforms", icon: Layers, group: "Pages" },
  { id: "insights", title: "Daily Insights", href: "/insights", icon: Sparkles, group: "Pages" },
  { id: "docs", title: "Docs & Help", href: "/docs", icon: Docs, group: "Pages" },
  { id: "survey", title: "Take Survey", href: "/survey", icon: FileText, group: "Pages" },
  { id: "team", title: "Team", href: "/team", icon: Users, group: "Pages" },
  { id: "about", title: "About", href: "/about", icon: BookOpen, group: "Pages" },
  { id: "pledge", title: "Pledge", href: "/pledge", icon: Heart, group: "Pages" },
  { id: "workspace", title: "CSV Workspace", href: "/workspace", icon: Wrench, group: "Pages" },
  { id: "showcase", title: "FX Showcase", href: "/showcase", icon: Sparkles, group: "Pages" },
  { id: "chatbot", title: "AI Hub — SkillBot", href: "/ai-hub/chatbot", icon: Bot, group: "AI Hub", keywords: "ai chat assistant" },
  { id: "wellness", title: "AI Hub — Wellness", href: "/ai-hub/wellness", icon: Heart, group: "AI Hub", keywords: "ai wellness" },
  { id: "pathway", title: "AI Hub — Skill Pathway", href: "/ai-hub/pathway", icon: TrendingUp, group: "AI Hub", keywords: "ai pathway" },
  { id: "content", title: "AI Hub — Content Scorer", href: "/ai-hub/content", icon: Camera, group: "AI Hub", keywords: "ai content score" },
  { id: "translator", title: "AI Hub — Translator", href: "/ai-hub/translator", icon: Languages, group: "AI Hub", keywords: "ai translate" }
];

const ACTIONS: Item[] = [
  { id: "act-take-survey", title: "Take the survey", href: "/survey", icon: FileText, group: "Actions" },
  { id: "act-try-chatbot", title: "Chat with SkillBot", href: "/ai-hub/chatbot", icon: Bot, group: "Actions" },
  { id: "act-upload-csv", title: "Upload a CSV", href: "/workspace", icon: Wrench, group: "Actions" },
  { id: "act-daily-insights", title: "Read today's insights", href: "/insights", icon: Sparkles, group: "Actions" },
  { id: "act-docs", title: "Read documentation", href: "/docs", icon: BookOpen, group: "Actions" }
];

const ALL = [...PAGES, ...ACTIONS];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!q.trim()) return ALL.slice(0, 10);
    const Q = q.toLowerCase();
    return ALL.filter((it) => it.title.toLowerCase().includes(Q) || (it.keywords || "").toLowerCase().includes(Q) || it.group.toLowerCase().includes(Q)).slice(0, 10);
  }, [q]);

  const open_palette = useCallback(() => { setOpen(true); setQ(""); setIdx(0); announce("Command palette opened", "polite"); }, []);
  const close_palette = useCallback(() => { setOpen(false); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open_palette();
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        close_palette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, open_palette, close_palette]);

  useEffect(() => { setIdx(0); }, [q]);

  const select = (it: Item) => { router.push(it.href); close_palette(); };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && filtered[idx]) { e.preventDefault(); select(filtered[idx]); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-4"
          onClick={close_palette}
          role="dialog" aria-modal="true" aria-label="Command palette"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
            className="glass-strong rounded-2xl w-full max-w-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onListKey}
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/5">
              <Search className="w-4 h-4 text-text-muted" aria-hidden="true" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type a page, feature, or action…"
                aria-label="Command palette search"
                className="flex-1 bg-transparent text-white placeholder:text-text-muted focus:outline-none text-sm"
              />
              <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-text-muted">ESC</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto" role="listbox">
              {filtered.length === 0 ? (
                <li className="p-6 text-center text-text-muted text-sm">No results for &ldquo;{q}&rdquo;</li>
              ) : (
                filtered.map((it, i) => {
                  const Icon = it.icon;
                  const active = i === idx;
                  return (
                    <li
                      key={it.id}
                      role="option"
                      aria-selected={active}
                      onClick={() => select(it)}
                      onMouseEnter={() => setIdx(i)}
                      className={`flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer ${active ? "bg-primary/10 text-white" : "text-text-secondary hover:bg-white/5"}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-sm truncate">{it.title}</p>
                          <p className="text-[10px] text-text-muted">{it.group} · {it.href}</p>
                        </div>
                      </div>
                      {active && <ArrowRight className="w-3.5 h-3.5 shrink-0" />}
                    </li>
                  );
                })
              )}
            </ul>
            <div className="p-3 border-t border-white/5 flex items-center justify-between text-[10px] text-text-muted">
              <div className="flex gap-3">
                <span><kbd className="font-mono">↑↓</kbd> Navigate</span>
                <span><kbd className="font-mono">↵</kbd> Select</span>
                <span><kbd className="font-mono">Esc</kbd> Close</span>
              </div>
              <span>Powered by SkillVerse</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
