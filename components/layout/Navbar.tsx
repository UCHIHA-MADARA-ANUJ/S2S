"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/constants";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/research", label: "Research" },
  { href: "/ai-hub", label: "AI Hub" },
  { href: "/survey", label: "Survey" },
  { href: "/showcase", label: "FX" },
  { href: "/team", label: "Team" }
];

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-display font-black text-white group-hover:rotate-12 transition-transform">SV</div>
          <span className="font-display font-bold text-lg hidden sm:inline">{SITE.name}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`relative px-3 py-2 text-sm font-medium transition-colors ${path === l.href ? "text-white" : "text-text-secondary hover:text-white"}`}>
              {l.label}
              {path === l.href && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/survey" className="hidden sm:inline-flex btn-primary text-xs">
            Take Survey
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-white">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background/98 backdrop-blur-2xl z-40 p-6">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-4 py-4 rounded-lg text-2xl font-display font-bold text-text-secondary hover:text-white border-b border-white/5">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
