"use client";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

const HeroModel = dynamic(
  () => import("./HeroModel").then((m) => m.HeroModel),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="w-32 h-32 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }
);

export interface HeroSceneProps {
  modelUrl?: string;
  color?: string;
}

export function HeroScene({ modelUrl, color }: HeroSceneProps) {
  return (
    <div className="absolute inset-0 z-0">
      <HeroModel
        modelUrl={modelUrl || "/3d/torus-knot-1.json"}
        color={color || "#FF3D2E"}
      />
      <div className="absolute top-1/4 left-[10%] animate-float" aria-hidden="true">
        <Sparkles className="w-4 h-4 text-primary opacity-50" />
      </div>
      <div className="absolute top-1/3 right-[15%] animate-float" style={{ animationDelay: "1s" }} aria-hidden="true">
        <Sparkles className="w-3 h-3 text-accent opacity-40" />
      </div>
      <div className="absolute bottom-1/3 left-[20%] animate-float" style={{ animationDelay: "2s" }} aria-hidden="true">
        <Sparkles className="w-3 h-3 text-primary opacity-30" />
      </div>
      <div className="absolute top-1/2 right-[10%] animate-float" style={{ animationDelay: "1.5s" }} aria-hidden="true">
        <Sparkles className="w-4 h-4 text-accent opacity-50" />
      </div>
    </div>
  );
}
