"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, BarChart3, Bot, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { SITE } from "@/lib/constants";
import { ShareButton } from "@/components/ui/ShareButton";

export default function ThankYou() {
  const [url, setUrl] = useState("");
  useEffect(() => { setUrl(window.location.origin + "/survey"); }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 0.8 }}>
          <CheckCircle2 className="w-24 h-24 text-primary mx-auto mb-6" />
        </motion.div>
        <h1 className="font-display font-black text-5xl sm:text-6xl tracking-tight mb-4">You're <span className="text-primary">in</span>.</h1>
        <p className="text-text-secondary text-lg mb-10">Your response just became part of the dataset. Thank you for being a data point.</p>
        <div className="glass p-6 text-left mb-8 max-w-md mx-auto">
          <p className="label mb-3">What happens next</p>
          <ol className="space-y-2 text-sm text-text-secondary">
            <li>✓ Your data is in the database</li>
            <li>✓ AI is analyzing patterns across 145+ responses</li>
            <li>✓ Dashboard updated in real-time</li>
            <li>✓ Insights feeding the research report</li>
          </ol>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link href="/dashboard" className="btn-primary text-sm"><BarChart3 className="w-4 h-4" /> View Dashboard</Link>
          <Link href="/ai-hub/chatbot" className="btn-secondary text-sm"><Bot className="w-4 h-4" /> Ask SkillBot</Link>
          <ShareButton text="I just contributed to SkillVerse — research on screen time & skills for teens." hashtags={["SkillVerse", "Screen2Skill"]} label="Share" />
        </div>
        {url && (
          <div className="inline-flex flex-col items-center gap-3 glass p-6">
            <QRCodeSVG value={url} size={120} bgColor="#0a0a0a" fgColor="#FAFAFA" />
            <p className="text-xs text-text-muted label">Share · {SITE.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
