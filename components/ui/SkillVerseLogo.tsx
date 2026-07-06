"use client";

import React from "react";
import { SITE } from "@/lib/constants";

export interface SkillVerseLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  textClassName?: string;
  animated?: boolean;
}

export function SkillVerseLogo({
  size = "md",
  showText = true,
  className = "",
  textClassName = "",
  animated = true,
}: SkillVerseLogoProps) {
  const sizeMap = {
    sm: { box: "w-7 h-7 rounded-lg", icon: "w-4 h-4", text: "text-base" },
    md: { box: "w-9 h-9 rounded-xl", icon: "w-5 h-5", text: "text-lg" },
    lg: { box: "w-11 h-11 rounded-2xl", icon: "w-6 h-6", text: "text-xl" },
    xl: { box: "w-14 h-14 rounded-2xl", icon: "w-8 h-8", text: "text-3xl" },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Icon Box */}
      <div
        className={`relative ${sizeMap.box} flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/20 transition-all duration-500 ${
          animated ? "group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]" : ""
        }`}
      >
        {/* Glow behind */}
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur-sm -z-10 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Futuristic SVG Logo: Screen to Skill (Vertex Star + Screen Portal) */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeMap.icon} text-white transition-transform duration-500 group-hover:rotate-12`}
        >
          {/* Outer Screen Portal / Diamond */}
          <path
            d="M16 2.5L29.5 16L16 29.5L2.5 16L16 2.5Z"
            stroke="url(#logo_gradient_1)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="opacity-90"
          />
          {/* Inner Vertex Star / Lightning Skill */}
          <path
            d="M16 7L18.5 13.5L25 16L18.5 18.5L16 25L13.5 18.5L7 16L13.5 13.5L16 7Z"
            fill="url(#logo_gradient_2)"
            className="drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
          />
          <circle cx="16" cy="16" r="2.5" fill="white" />
          
          <defs>
            <linearGradient id="logo_gradient_1" x1="2.5" y1="2.5" x2="29.5" y2="29.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="0.5" stopColor="#A855F7" />
              <stop offset="1" stopColor="#F43F5E" />
            </linearGradient>
            <linearGradient id="logo_gradient_2" x1="7" y1="7" x2="25" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#FDE047" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Name with Gradient & Glow */}
      {showText && (
        <span
          className={`font-display font-black tracking-tight ${sizeMap.text} bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-200 group-hover:from-indigo-300 group-hover:to-pink-300 transition-colors duration-300 ${textClassName}`}
        >
          {SITE.name || "SkillVerse"}
          <span className="text-pink-500 font-bold ml-0.5">.</span>
        </span>
      )}
    </div>
  );
}
