"use client";
import { useState } from "react";
import { DotField } from "@/components/effects/DotField";
import { FileText, Loader2, Download, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { TrackAIUsage } from "@/components/ui/TrackAIUsage";

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/report", { method: "POST" });
      const data = await res.json();
      setReport(data.report || "Failed to generate.");
    } catch { toast.error("Generation failed"); } finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(report); toast.success("Copied!"); };

  return (
    <>
      <TrackAIUsage featureId="report" />
      <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50"><DotField dotSpacing={28} cursorRadius={200} sparkle={false} /></div>
      <div className="relative z-10"><div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warning to-primary flex items-center justify-center mx-auto mb-4">
            <FileText className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-black text-4xl tracking-tight">Report Writer</h1>
          <p className="text-text-secondary mt-2">Competition-ready AI research report</p>
        </div>

        {!report && !loading && (
          <div className="text-center">
            <button onClick={generate} className="btn-primary text-base">
              <Sparkles className="w-4 h-4" /> Generate Report
            </button>
            <p className="text-text-muted text-xs mt-4 label">Takes 15-30 seconds</p>
          </div>
        )}

        {loading && (
          <div className="glass p-16 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-text-secondary">Generating research report...</p>
            <p className="text-text-muted text-xs mt-1">Analyzing 145+ responses with AI</p>
          </div>
        )}

        {report && !loading && (
          <div className="glass p-6 sm:p-10">
            <div className="flex justify-end gap-2 mb-6">
              <button onClick={copy} className="btn-secondary text-xs"><Copy className="w-3 h-3" /> Copy</button>
            </div>
            <article className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-text-secondary font-sans leading-relaxed">{report}</pre>
            </article>
          </div>
        )}
      </div>
    </div>
      </div></div>

  </>
    );
}
