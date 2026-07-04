"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Loader2, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const DEFAULT_FAQS: FAQItem[] = [
  { id: "what", question: "What is SkillVerse?", answer: "SkillVerse is an AI-powered analytics platform that proves screen time can become skill time. We surveyed 250+ Indian teenagers about their digital habits and built 8 AI features to help you understand and improve your own learning.", category: "Basics" },
  { id: "data", question: "How is my data used?", answer: "Your survey responses are stored anonymously in our database. We use aggregated, anonymized data to power the dashboard and AI features. We never share individual responses with third parties. You can export or delete your data anytime from Settings.", category: "Privacy" },
  { id: "free", question: "Is this free?", answer: "Yes, 100% free. No login required. We built this for the Screen2Skill 2026 competition as a public good.", category: "Basics" },
  { id: "delete", question: "Can I delete my data?", answer: "Yes. Go to Settings → Data → Delete My Data. We'll remove your response within 24 hours. (Note: aggregated, anonymized stats may remain.)", category: "Privacy" },
  { id: "competition", question: "What is the Screen2Skill competition?", answer: "Screen2Skill 2026 is a school-level competition by Techbuzz with the theme 'From Screens to Skills — Online & Optimistic'. We're 4 students from Colonel's Central Academy, Gurugram, competing.", category: "About" },
  { id: "accuracy", question: "How accurate are the AI features?", answer: "We use Google Gemini 2.5 Flash as primary AI  Responses are AI-generated and should be treated as helpful suggestions, not ground truth. Always cross-check important info.", category: "AI" },
  { id: "school", question: "Can I use this for my school project?", answer: "Absolutely! SkillVerse is open source under MIT license. Fork it, remix it, use the data — just credit us. See the README for setup instructions.", category: "About" },
  { id: "team", question: "Who built this?", answer: "4 students from Colonel's Central Academy, Gurugram: Anuj Phulera (Lead Dev), Aarav Choudhary (Ideator), Dhun (Presenter), Preksha (Presenter). Faculty in-charge: Shammin Ma'am.", category: "About" },
  { id: "contribute", question: "How can I contribute?", answer: "After the competition, we'll accept PRs on GitHub. For now, take the survey, share with friends, and submit bug reports via /docs or email anujphulera@gmail.com.", category: "About" },
  { id: "next", question: "What's next for SkillVerse?", answer: "After the competition, we plan to add: real-time multi-user dashboards, mobile apps, integration with school LMS, and a public API. Stay tuned!", category: "About" }
];

export function FAQ({ items = DEFAULT_FAQS, enableAI = true }: { items?: FAQItem[]; enableAI?: boolean }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id || null);
  const [askQ, setAskQ] = useState("");
  const [aiAns, setAiAns] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [relatedFaqs, setRelatedFaqs] = useState<string[]>([]);

  const ask = async () => {
    if (!askQ.trim()) return;
    setAiLoading(true);
    setAiAns(null);
    setRelatedFaqs([]);
    try {
      const res = await fetch("/api/faq/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: askQ })
      });
      const data = await res.json();
      if (data.success) {
        setAiAns(data.answer);
        setRelatedFaqs(data.related || []);
      } else {
        toast.error("Couldn't get an answer. Try the suggestions below.");
      }
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {enableAI && (
        <div className="glass-strong p-6 rounded-2xl mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
            <h3 className="font-display font-bold text-lg">Ask a question</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={askQ}
              onChange={(e) => setAskQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder="What do you want to know about SkillVerse?"
              aria-label="Ask a question about SkillVerse"
              className="flex-1 bg-surface border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            <button onClick={ask} disabled={aiLoading || !askQ.trim()} className="btn-primary text-xs disabled:opacity-50" aria-label="Submit question">
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">Ask</span>
            </button>
          </div>
          {aiAns && (
            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20" role="region" aria-label="AI answer">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="label text-primary">AI ANSWER</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{aiAns}</p>
              {relatedFaqs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-text-muted">Related:</span>
                  {relatedFaqs.map((id) => {
                    const f = items.find((x) => x.id === id);
                    if (!f) return null;
                    return (
                      <button key={id} onClick={() => { setOpen(id); setAskQ(""); setAiAns(null); document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="text-xs px-2 py-1 rounded bg-white/5 text-text-secondary hover:text-white">
                        {f.question}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {items.map((f) => {
          const isOpen = open === f.id;
          return (
            <div key={f.id} id={`faq-${f.id}`} className="glass overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : f.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${f.id}`}
                className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors text-left gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {f.category && <span className="label shrink-0">{f.category}</span>}
                  <h3 className="font-display font-bold text-sm sm:text-base truncate">{f.question}</h3>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-content-${f.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-sm text-text-secondary leading-relaxed border-t border-white/5">
                      {f.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
