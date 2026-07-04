"use client";
import { createContext, useContext, useState, ReactNode } from "react";

/**
 * Broadcasts whether the cinematic intro is currently showing on screen,
 * so that other layout elements (Navbar, Footer, etc.) can hide themselves
 * while the intro plays.
 *
 * State transitions:
 *   "unknown" - default, both server and first client render
 *   "showing" - intro is currently visible
 *   "hidden"  - intro was dismissed (or never shown)
 */
type IntroState = "unknown" | "showing" | "hidden";

const IntroContext = createContext<{
  state: IntroState;
  setState: (s: IntroState) => void;
}>({ state: "unknown", setState: () => {} });

export function IntroProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IntroState>("unknown");
  return (
    <IntroContext.Provider value={{ state, setState }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntroState() {
  return useContext(IntroContext);
}
