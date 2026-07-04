"use client";
import Link from "next/link";
import { useEffect } from "react";
import { DotField } from "@/components/effects/DotField";
import { MagicBento } from "@/components/effects/MagicBento";
import { TextPressure } from "@/components/effects/TextPressure";
import { Home, RefreshCw, AlertTriangle, Mail } from "lucide-react";

const options = [
  { icon: Home, label: "Home", href: "/" },
  { icon: RefreshCw, label: "Try Again", action: "reset" },
  { icon: Mail, label: "Report Bug", href: "mailto:anujphulera@gmail.com" }
];

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DotField dotSpacing={22} cursorRadius={220} sparkle={false} />
      </div>
      <div className="relative z-10 text-center max-w-2xl w-full">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-error animate-pulse" />
        </div>
        <TextPressure
          text="ERROR"
          className="font-display text-5xl md:text-7xl font-black text-error"
          minScale={1}
          maxScale={1.1}
        />
        <p className="text-text-secondary text-lg mt-4 mb-2">Screen error detected.</p>
        <p className="text-text-muted text-sm mb-12 max-w-md mx-auto">
          {error.message || "Something went wrong on our end. Try refreshing or head back home."}
        </p>
        <MagicBento columns={3} enableStars clickEffect>
          {options.map((opt, i) => (
            <div key={i} className="py-4 px-3">
              {opt.action === "reset" ? (
                <button onClick={reset} className="w-full hover:scale-105 transition-transform">
                  <opt.icon className="w-7 h-7 text-primary mb-2 mx-auto" />
                  <div className="font-display font-bold text-white">{opt.label}</div>
                </button>
              ) : (
                <Link href={opt.href || "#"} className="block hover:scale-105 transition-transform">
                  <opt.icon className="w-7 h-7 text-primary mb-2 mx-auto" />
                  <div className="font-display font-bold text-white">{opt.label}</div>
                </Link>
              )}
            </div>
          ))}
        </MagicBento>
      </div>
    </div>
  );
}
