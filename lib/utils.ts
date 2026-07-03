import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatNum(n: number) {
  return n.toLocaleString();
}

export function generateSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
