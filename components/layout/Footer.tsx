import Link from "next/link";
import { SITE, TEAM } from "@/lib/constants";
import { Github, Mail, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 bg-surface/30 mt-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,61,46,0.1) 0%, transparent 50%)" }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-3xl font-display font-black tracking-tight mb-3">{SITE.name}</h3>
            <p className="text-text-secondary text-sm max-w-md mb-4">{SITE.tagline}</p>
            <p className="text-text-muted text-xs max-w-md">An AI-powered research platform analyzing how digital platforms help teenagers build real-world skills. Built for {SITE.competition}.</p>
          </div>
          <div>
            <h4 className="label mb-4">Navigate</h4>
            <div className="flex flex-col gap-2">
              <Link href="/dashboard" className="text-text-secondary hover:text-white text-sm">Dashboard</Link>
              <Link href="/survey" className="text-text-secondary hover:text-white text-sm">Take Survey</Link>
              <Link href="/ai-hub" className="text-text-secondary hover:text-white text-sm">AI Hub</Link>
              <Link href="/team" className="text-text-secondary hover:text-white text-sm">Team</Link>
            </div>
          </div>
          <div>
            <h4 className="label mb-4">Project</h4>
            <p className="text-text-secondary text-sm mb-1">Team Lead: {TEAM.lead.name}</p>
            <p className="text-text-secondary text-sm mb-1">{SITE.school}</p>
            <p className="text-text-secondary text-sm mb-1">{SITE.city}, India</p>
            <p className="text-text-muted text-xs mt-3">Built with Next.js + Supabase + Gemini AI</p>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-text-muted text-xs">© 2026 {SITE.name}. Built for {SITE.competition}.</p>
          <p className="text-text-muted text-xs">Data is anonymous. No personal information stored.</p>
        </div>
      </div>
    </footer>
  );
}
