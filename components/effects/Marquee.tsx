"use client";
import FastMarquee from "react-fast-marquee";

export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="border-y border-white/5 py-6 bg-surface/30 overflow-hidden">
      <FastMarquee speed={50} gradient={false} className="overflow-hidden">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-12 px-12">
            <span className="text-3xl sm:text-5xl font-display font-black text-text-primary/40 uppercase tracking-tighter whitespace-nowrap">
              {item}
            </span>
            <span className="text-3xl text-primary">✦</span>
          </div>
        ))}
      </FastMarquee>
    </div>
  );
}
