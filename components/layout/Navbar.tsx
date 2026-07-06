"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, LayoutDashboard, Settings, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useIntroState } from "@/lib/intro-context";
import { toast } from "sonner";
import { SITE } from "@/lib/constants";
import { SkillVerseLogo } from "@/components/ui/SkillVerseLogo";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/research", label: "Research" },
  { href: "/skills", label: "Skills" },
  { href: "/platforms", label: "Platforms" },
  { href: "/insights", label: "Insights" },
  { href: "/ai-hub", label: "AI" },
  { href: "/workspace", label: "Data" }
];

export function Navbar() {
  const path = usePathname();
  const { user, profile, signOut } = useAuth();
  const { state: introState } = useIntroState();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setUserMenu(false); }, [path]);

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenu) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-user-menu]")) setUserMenu(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [userMenu]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    setUserMenu(false);
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initial = displayName[0]?.toUpperCase() || "U";

  // Hide navbar while intro is showing OR unknown (initial SSR).
  if (introState !== "hidden") return null;

  return (
    <header>
      <nav
        aria-label="Primary navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" aria-label={`${SITE.name} — go to home`} className="focus:outline-none">
            <SkillVerseLogo size="md" />
          </Link>

          <ul className="hidden lg:flex items-center gap-1" role="list">
            {links.map((l) => {
              const active = path === l.href;
              return (
                <li key={l.href} role="listitem">
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors touch-target inline-flex items-center ${active ? "text-white" : "text-text-secondary hover:text-white"}`}
                  >
                    {l.label}
                    {active && <span aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  aria-label="Open user menu"
                  aria-expanded={userMenu}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 transition-colors touch-target"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display font-black text-white text-sm">
                    {initial}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-text-secondary max-w-[100px] truncate">{displayName}</span>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-xl p-2 shadow-2xl" role="menu">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-sm font-semibold truncate">{displayName}</p>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5" role="menuitem">
                      <LayoutDashboard className="w-4 h-4" /> My Dashboard
                    </Link>
                    <Link href="/workspace" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5" role="menuitem">
                      <User className="w-4 h-4" /> My Workspace
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5" role="menuitem">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <div className="border-t border-white/5 my-1" />
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10" role="menuitem">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href={`/signin?next=${encodeURIComponent(path)}`} className="hidden sm:inline-flex items-center gap-1.5 text-text-secondary hover:text-white text-sm px-3 py-1.5 touch-target">
                  <LogIn className="w-3.5 h-3.5" /> Sign in
                </Link>
                <Link href="/signup" className="btn-primary text-xs hidden sm:inline-flex">
                  <UserPlus className="w-3.5 h-3.5" /> Sign up
                </Link>
              </>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-white touch-target"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-menu"
            className="lg:hidden fixed inset-0 top-16 bg-background/98 backdrop-blur-2xl z-40 p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-2 mb-6" role="list">
              {links.map((l) => {
                const active = path === l.href;
                return (
                  <li key={l.href} role="listitem">
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="px-4 py-4 rounded-lg text-2xl font-display font-bold text-text-secondary hover:text-white border-b border-white/5 inline-flex items-center w-full touch-target"
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {!user && (
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <Link href="/signin" onClick={() => setOpen(false)} className="btn-secondary text-sm justify-center">
                  <LogIn className="w-4 h-4" /> Sign in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary text-sm justify-center">
                  <UserPlus className="w-4 h-4" /> Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
