"use client";
import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, Mail, Bug, Lightbulb, Sparkles, BookOpen, Database, Brain, HelpCircle, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICON_MAP: Record<string, any> = { Sparkles, BookOpen, Database, Brain, HelpCircle, Shield, Mail, Bug, Lightbulb };
const COLOR_MAP: Record<string, string> = {
  "getting-started": "from-primary to-primary-light",
  "survey-guide": "from-secondary to-warning",
  "dashboard-tour": "from-accent to-primary",
  "ai-hub-guide": "from-pink-500 to-primary",
  "workspace-guide": "from-success to-accent",
  "faq": "from-warning to-primary",
  "privacy": "from-success to-accent",
  "contact": "from-primary to-accent",
  "report-bug": "from-error to-warning",
  "suggest-feature": "from-secondary to-primary"
};

interface Section {
  id: string;
  title: string;
  icon: string;
  content: string[];
}

export default function DocsClient({ sections }: { sections: Section[] }) {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["getting-started"]));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return sections.map((s) => ({ ...s, _matched: undefined as string[] | undefined }));
    const q = query.toLowerCase();
    return sections
      .map((s) => {
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchedContent = s.content.filter((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && matchedContent.length === 0) return null;
        return { ...s, _matched: matchedContent.length ? matchedContent : s.content };
      })
      .filter(Boolean) as (Section & { _matched?: string[] })[];
  }, [query, sections]);

  return (
    <div>
      <div className="mb-8 relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search docs, FAQ, guides…"
          aria-label="Search documentation"
          className="w-full glass pl-12 pr-4 py-4 rounded-2xl text-white text-base placeholder:text-text-muted focus:outline-none focus:border-primary"
        />
        {query && (
          <p className="mt-2 text-xs text-text-muted text-center">{filtered.length} {filtered.length === 1 ? "section" : "sections"} match</p>
        )}
      </div>

      {query.trim() ? (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="glass p-12 text-center">
              <p className="text-text-muted">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-text-muted text-xs mt-2">Try: survey, dashboard, AI, CSV, privacy</p>
            </div>
          ) : (
            filtered.map((s) => <DocsCard key={s.id} section={s} open={true} onToggle={() => toggle(s.id)} highlight={query} />)
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((s) => (
            <DocsCard key={s.id} section={s} open={openIds.has(s.id)} onToggle={() => toggle(s.id)} highlight="" />
          ))}
        </div>
      )}

      <div className="mt-12 glass-strong p-8 rounded-2xl text-center">
        <h3 className="font-display font-black text-2xl mb-2">Still need help?</h3>
        <p className="text-text-secondary text-sm mb-6">We respond within 24 hours.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:anujphulera@gmail.com?subject=SkillVerse%20Help" className="btn-primary text-sm">
            <Mail className="w-4 h-4" /> Email Us
          </a>
          <a href="https://github.com/UCHIHA-MADARA-ANUJ/S2S/issues/new" target="_blank" rel="noopener" className="btn-secondary text-sm">
            <Bug className="w-4 h-4" /> Report a Bug
          </a>
          <a href="https://github.com/UCHIHA-MADARA-ANUJ/S2S/issues/new" target="_blank" rel="noopener" className="btn-secondary text-sm">
            <Lightbulb className="w-4 h-4" /> Suggest Feature
          </a>
        </div>
      </div>
    </div>
  );
}

function DocsCard({ section, open, onToggle, highlight }: { section: Section & { _matched?: string[] }; open: boolean; onToggle: () => void; highlight: string }) {
  const Icon = ICON_MAP[section.icon] || Sparkles;
  const color = COLOR_MAP[section.id] || "from-primary to-accent";
  const content = section._matched || section.content;
  return (
    <div className="glass overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`doc-${section.id}`}
        className="w-full p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg truncate">{highlightText(section.title, highlight)}</h3>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-text-muted shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-text-muted shrink-0 ml-2" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`doc-${section.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 space-y-3 text-sm text-text-secondary leading-relaxed border-t border-white/5">
              {content.map((line, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: formatLine(line, highlight) }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function highlightText(text: string, q: string): React.ReactNode {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(re);
  return parts.map((p, i) => (re.test(p) ? <mark key={i} className="bg-primary/30 text-white rounded px-0.5">{p}</mark> : p));
}

function formatLine(line: string, q: string): string {
  let html = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  if (q) {
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    html = html.replace(re, '<mark class="bg-primary/30 text-white rounded px-0.5">$1</mark>');
  }
  return html;
}
