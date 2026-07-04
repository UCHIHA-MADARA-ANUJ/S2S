"use client";
import { useState } from "react";
import { Share2, Twitter, Linkedin, Facebook, MessageCircle, Link2, Check, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  hashtags?: string[];
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  label?: string;
  className?: string;
}

const ICON_PROPS = { "twitter.com": Twitter, "linkedin.com": Linkedin, "facebook.com": Facebook, "wa.me": MessageCircle, "mailto": Mail };

export function ShareButton({
  title = "SkillVerse — Where Screens Become Skills",
  text = "Check out SkillVerse — AI-powered analytics proving screen time can become skill time.",
  url,
  hashtags = ["SkillVerse", "Screen2Skill"],
  size = "md",
  variant = "primary",
  label = "Share",
  className = ""
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.origin : "https://skillverse.vercel.app");
  const fullText = `${text}\n\n${shareUrl}`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, text, url: shareUrl });
        return;
      } catch { /* fall through to modal */ }
    }
    setOpen(true);
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); toast.success("Link copied!"); setTimeout(() => setCopied(false), 2000); }
    catch { toast.error("Copy failed"); }
  };

  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags.join(",")}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  const ml = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullText)}`;

  const sizeClasses = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2", lg: "text-base px-5 py-2.5" }[size];
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
  }[variant];

  return (
    <>
      <button onClick={handleShare} className={`${variantClasses} ${sizeClasses} ${className}`} aria-label="Share">
        <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
        {label && <span>{label}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
            role="dialog" aria-modal="true" aria-label="Share"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong p-6 rounded-2xl max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-lg">Share</h3>
                <button onClick={() => setOpen(false)} aria-label="Close share dialog" className="p-1.5 rounded hover:bg-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <a href={tw} target="_blank" rel="noopener noreferrer" className="glass p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors" aria-label="Share on Twitter">
                  <Twitter className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs">Twitter / X</span>
                </a>
                <a href={li} target="_blank" rel="noopener noreferrer" className="glass p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors" aria-label="Share on LinkedIn">
                  <Linkedin className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs">LinkedIn</span>
                </a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="glass p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors" aria-label="Share on WhatsApp">
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs">WhatsApp</span>
                </a>
                <a href={fb} target="_blank" rel="noopener noreferrer" className="glass p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors" aria-label="Share on Facebook">
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs">Facebook</span>
                </a>
              </div>
              <div className="flex gap-2">
                <a href={ml} className="btn-secondary text-xs flex-1" aria-label="Share via email">
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
                <button onClick={copyLink} className="btn-primary text-xs flex-1" aria-label="Copy link">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Link2 className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
