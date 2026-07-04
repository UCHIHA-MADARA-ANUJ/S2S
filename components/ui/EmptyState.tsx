"use client";
import { motion } from "framer-motion";
import { ArrowRight, Inbox, Search as SearchIcon, BarChart3, Bot, Upload, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  emoji?: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
  secondary?: { label: string; href: string };
  variant?: "default" | "search" | "success" | "data" | "ai";
  illustration?: "data" | "search" | "success" | "ai";
  className?: string;
}

const ILLUSTRATION_MAP: Record<string, string> = {
  data: "M3 3h18v4H3V3zm0 6h18v4H3V9zm0 6h18v4H3v-4z",
  search: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z",
  success: "M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z",
  ai: "M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
};

const VARIANT_DEFAULT_ICON = { default: Inbox, search: SearchIcon, data: BarChart3, ai: Bot, success: Sparkles } as const;

export function EmptyState({ icon: Icon, emoji, title, description, action, secondary, variant = "default", illustration, className = "" }: EmptyStateProps) {
  const FallbackIcon: any = Icon || VARIANT_DEFAULT_ICON[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass p-8 sm:p-12 text-center ${className}`}
      role="status"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto mb-5 relative w-20 h-20"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-text-muted opacity-30" aria-hidden="true">
          <path d={ILLUSTRATION_MAP[illustration || variant] || ILLUSTRATION_MAP.data} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {emoji ? <span className="text-4xl" aria-hidden="true">{emoji}</span> : FallbackIcon ? <FallbackIcon className="w-8 h-8 text-primary" aria-hidden="true" /> : null}
        </div>
      </motion.div>
      <h3 className="font-display font-black text-xl sm:text-2xl mb-2">{title}</h3>
      <p className="text-text-secondary text-sm max-w-md mx-auto mb-6 leading-relaxed">{description}</p>
      {(action || secondary) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <Link href={action.href} className="btn-primary text-sm">
              {action.label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          {secondary && (
            <Link href={secondary.href} className="btn-secondary text-sm">{secondary.label}</Link>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Pre-built empty states for common scenarios
export function NoDataEmpty({ entityName = "data", action }: { entityName?: string; action?: { label: string; href: string } }) {
  return (
    <EmptyState
      variant="data"
      emoji="📊"
      title={`No ${entityName} yet`}
      description={`There's no ${entityName} to show. Take the survey or upload a CSV to see insights here.`}
      action={action || { label: "Take Survey", href: "/survey" }}
      secondary={{ label: "Try Workspace", href: "/workspace" }}
    />
  );
}

export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      variant="search"
      emoji="🔍"
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try a different search term or browse our pages.`}
      action={{ label: "Browse Pages", href: "/" }}
    />
  );
}

export function NoAIFeaturesUsed() {
  return (
    <EmptyState
      variant="ai"
      emoji="🤖"
      title="Try an AI feature"
      description="SkillVerse has 8 AI features powered by Gemini. Pick one and see what happens."
      action={{ label: "Open AI Hub", href: "/ai-hub" }}
    />
  );
}

export function NoCSVUploaded() {
  return (
    <EmptyState
      variant="data"
      emoji="📁"
      title="Upload a CSV to start"
      description="Drag-drop a CSV file (or pick a sample) and we'll auto-generate charts + AI insights."
      action={{ label: "Go to Workspace", href: "/workspace" }}
    />
  );
}
