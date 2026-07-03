"use client";
import { useEffect, useState } from "react";
import { useRealtime } from "@/hooks/useRealtime";

export function LiveCounter({ initial }: { initial: number }) {
  const { count, live } = useRealtime();
  const display = count > 0 ? count : initial;
  return (
    <span className="inline-flex items-baseline gap-1 font-display font-black text-primary tabular-nums">
      {display}
      {live && <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-glow ml-1 self-center" />}
    </span>
  );
}
