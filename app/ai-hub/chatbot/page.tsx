"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const SUGGESTIONS = [
  "How can I turn YouTube into learning time?",
  "What's the fastest way to learn coding online?",
  "Best free platforms for high school students?",
  "How do I balance learning and entertainment?"
];

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.response || "Sorry, try again." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Network error. Try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mx-auto mb-4">
            <Bot className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-black text-4xl tracking-tight">SkillBot</h1>
          <p className="text-text-secondary mt-2">Your AI learning companion</p>
        </div>

        <div className="glass-strong overflow-hidden flex flex-col" style={{ height: "65vh" }}>
          <div ref={ref} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
                <p className="text-text-muted mb-6 label">Try asking</p>
                <div className="flex flex-col sm:flex-row gap-2 flex-wrap justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="glass px-4 py-2.5 rounded-lg text-sm text-text-secondary hover:text-white hover:border-primary/50 text-left">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-primary" /></div>}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-gradient-to-r from-primary to-primary-dark text-white rounded-tr-sm" : "glass rounded-tl-sm"}`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>
                {m.role === "user" && <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0"><User className="w-4 h-4" /></div>}
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><Bot className="w-4 h-4 text-primary" /></div>
                <div className="glass px-4 py-3"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-white/5 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask SkillBot anything..." className="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary" />
            <button onClick={() => send(input)} disabled={loading || !input.trim()} className="btn-primary !p-3 disabled:opacity-30">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
