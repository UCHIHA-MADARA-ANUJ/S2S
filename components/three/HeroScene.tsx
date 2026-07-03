"use client";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

const ThreeCanvas = dynamic(() => import("./ThreeCanvas").then((m) => m.ThreeCanvas), { ssr: false });

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <ThreeCanvas />
      <div className="absolute top-1/4 left-[10%] animate-float"><Sparkles className="w-4 h-4 text-primary opacity-50" /></div>
      <div className="absolute top-1/3 right-[15%] animate-float" style={{ animationDelay: "1s" }}><Sparkles className="w-3 h-3 text-accent opacity-40" /></div>
      <div className="absolute bottom-1/3 left-[20%] animate-float" style={{ animationDelay: "2s" }}><Sparkles className="w-3 h-3 text-primary opacity-30" /></div>
      <div className="absolute top-1/2 right-[10%] animate-float" style={{ animationDelay: "1.5s" }}><Sparkles className="w-4 h-4 text-accent opacity-50" /></div>
    </div>
  );
}
