"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Brain, FileText, Layers } from "lucide-react";
import { useIntroState } from "@/lib/intro-context";

// Bottom nav for mobile - shows on screens < lg only
const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Stats", icon: BarChart3 },
  { href: "/ai-hub", label: "AI", icon: Brain },
  { href: "/workspace", label: "Data", icon: Layers },
  { href: "/achievements", label: "Trophies", icon: FileText }
];

export function MobileNav() {
  const path = usePathname();
  const { state: introState } = useIntroState();
  if (introState !== "hidden") return null;
  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-2xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex items-stretch justify-around h-16" role="list">
        {items.map((it) => {
          const Icon = it.icon;
          const active = path === it.href || (it.href !== "/" && path?.startsWith(it.href));
          return (
            <li key={it.href} className="flex-1" role="listitem">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                aria-label={it.label}
                className={`flex flex-col items-center justify-center gap-1 h-full text-[10px] font-medium transition-colors touch-target ${active ? "text-primary" : "text-text-secondary active:text-white"}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
