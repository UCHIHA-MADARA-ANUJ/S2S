"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

const SHORTCUTS: Array<{ keys: string[]; desc: string; group: string }> = [
  { keys: ["⌘", "K"], desc: "Open command palette / search anything", group: "Navigation" },
  { keys: ["?"], desc: "Show this shortcuts help", group: "Navigation" },
  { keys: ["/"], desc: "Focus search input on the current page", group: "Navigation" },
  { keys: ["g", "h"], desc: "Go to Home", group: "Quick Nav" },
  { keys: ["g", "d"], desc: "Go to Dashboard", group: "Quick Nav" },
  { keys: ["g", "r"], desc: "Go to Research", group: "Quick Nav" },
  { keys: ["g", "a"], desc: "Go to AI Hub", group: "Quick Nav" },
  { keys: ["g", "s"], desc: "Go to Survey", group: "Quick Nav" },
  { keys: ["g", "w"], desc: "Go to Workspace", group: "Quick Nav" },
  { keys: ["g", "i"], desc: "Go to Daily Insights", group: "Quick Nav" },
  { keys: ["g", "k"], desc: "Go to Skills Library", group: "Quick Nav" },
  { keys: ["g", "l"], desc: "Go to Platforms Library", group: "Quick Nav" },
  { keys: ["g", "m"], desc: "Go to Docs & Help", group: "Quick Nav" },
  { keys: ["g", "p"], desc: "Go to Pledge", group: "Quick Nav" },
  { keys: ["Tab"], desc: "Move to next focusable element", group: "Accessibility" },
  { keys: ["Shift", "Tab"], desc: "Move to previous focusable element", group: "Accessibility" },
  { keys: ["Esc"], desc: "Close modal / dialog", group: "Accessibility" },
  { keys: ["Tab"], desc: "(first) → Skip to main content link", group: "Accessibility" }
];

export function ShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const groups = Array.from(new Set(SHORTCUTS.map((s) => s.group)));
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog" aria-modal="true" aria-labelledby="shortcuts-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="glass-strong p-6 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 id="shortcuts-title" className="font-display font-black text-2xl flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-primary" aria-hidden="true" /> Keyboard Shortcuts
              </h2>
              <button onClick={onClose} aria-label="Close shortcuts" className="p-1.5 rounded hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-6">
              {groups.map((g) => (
                <div key={g}>
                  <h3 className="label mb-2">{g}</h3>
                  <div className="space-y-1">
                    {SHORTCUTS.filter((s) => s.group === g).map((s, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 p-2 rounded hover:bg-white/5">
                        <span className="text-sm text-text-secondary">{s.desc}</span>
                        <div className="flex gap-1 shrink-0">
                          {s.keys.map((k, j) => (
                            <kbd key={j} className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-text-primary min-w-[24px] text-center">
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-text-muted text-center">Tip: Press <kbd className="font-mono px-1.5 py-0.5 rounded bg-white/5">?</kbd> anywhere to open this dialog.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
