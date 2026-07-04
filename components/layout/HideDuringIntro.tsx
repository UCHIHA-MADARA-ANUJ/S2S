"use client";
import { ReactNode } from "react";
import { useIntroState } from "@/lib/intro-context";

/**
 * Wraps any children (Navbar, Footer, etc.) and hides them entirely while
 * the cinematic intro is on screen, including during the first render
 * before the client has determined whether to show the intro.
 */
export function HideDuringIntro({ children }: { children: ReactNode }) {
  const { state } = useIntroState();
  // Hide during SSR ("unknown") and when intro is actively showing.
  // Show only when the intro is explicitly done.
  if (state !== "hidden") return null;
  return <>{children}</>;
}
