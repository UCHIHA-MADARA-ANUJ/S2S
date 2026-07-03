import { CheckCircle2, FileText, BarChart3, Link as LinkIcon, Video, Github, Mail } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { SITE } from "@/lib/constants";

export default function SubmitPage() {
  const items = [
    { icon: LinkIcon, title: "Website Link", value: "skillverse.vercel.app" },
    { icon: Video, title: "Walkthrough Video", value: "2-3 min demo with subtitles" },
    { icon: FileText, title: "Survey Forms", value: "Built-in (8 steps, 21 questions)" },
    { icon: BarChart3, title: "Raw Data", value: "145+ responses in Supabase" },
    { icon: FileText, title: "Reports", value: "AI-generated research report" },
    { icon: BarChart3, title: "Charts/Infographics", value: "6+ live dashboard charts" }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="label mb-3">SCREEN2SKILL 2026</p>
          <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter">Submission.</h1>
        </div>

        <div className="glass-strong p-8 mb-8">
          <h2 className="font-display font-black text-2xl mb-6">Deliverables Checklist</h2>
          <div className="space-y-3">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-surface rounded-lg">
                <it.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm">{it.title}</p>
                  <p className="text-text-muted text-xs truncate">{it.value}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-6 text-center">
            <p className="label mb-4">SCAN</p>
            <div className="inline-block p-4 bg-white rounded-2xl">
              <QRCodeSVG value="https://skillverse.vercel.app" size={140} bgColor="#ffffff" fgColor="#000000" />
            </div>
            <p className="text-xs text-text-muted label mt-3">Live site QR</p>
          </div>
          <div className="glass p-6">
            <p className="label mb-4">CONTACT</p>
            <div className="space-y-3 text-sm">
              <a href="mailto:madara.coding.projects@gmail.com" className="flex items-center gap-3 text-text-secondary hover:text-white">
                <Mail className="w-4 h-4" /> madara.coding.projects@gmail.com
              </a>
              <a href="https://github.com/UCHIHA-MADARA-ANUJ/SkillVerse" className="flex items-center gap-3 text-text-secondary hover:text-white">
                <Github className="w-4 h-4" /> github.com/UCHIHA-MADARA-ANUJ/SkillVerse
              </a>
            </div>
            <p className="text-xs text-text-muted mt-4 label">Built for {SITE.competition}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
