"use client";
import Link from "next/link";
import { DotField } from "@/components/effects/DotField";
import { MagicBento } from "@/components/effects/MagicBento";
import { TextPressure } from "@/components/effects/TextPressure";
import { Home, Search, ArrowLeft, Compass } from "lucide-react";

const options = [
  { icon: Home, label: "Home", desc: "Back to the beginning", href: "/" },
  { icon: Search, label: "Research", desc: "Browse our findings", href: "/research" },
  { icon: Compass, label: "Showcase", desc: "See all FX components", href: "/showcase" }
];

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* DotField background */}
      <div className="absolute inset-0 z-0">
        <DotField dotSpacing={20} cursorRadius={200} sparkle={false} />
      </div>
      <div className="relative z-10 text-center max-w-3xl w-full">
        <TextPressure
          text="404"
          className="font-display text-9xl md:text-[200px] font-black text-primary"
          minScale={1}
          maxScale={1.1}
        />
        <p className="text-text-secondary text-xl mt-4 mb-2">Screen disconnected.</p>
        <p className="text-text-muted text-sm mb-12">The page you're looking for doesn't exist or has been moved.</p>
        <MagicBento columns={3} enableStars clickEffect>
          {options.map((opt, i) => (
            <Link key={i} href={opt.href} className="block py-4 px-3 hover:scale-105 transition-transform">
              <opt.icon className="w-7 h-7 text-primary mb-2" />
              <div className="font-display font-bold text-white">{opt.label}</div>
              <div className="text-xs text-text-muted">{opt.desc}</div>
            </Link>
          ))}
        </MagicBento>
        <div className="mt-12">
          <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Take me home
          </Link>
        </div>
      </div>
    </div>
  );
}
