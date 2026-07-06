/**
 * SkillVerse design tokens — single source of truth for spacing, radii, shadows, gradients.
 * All components should import from here (or use Tailwind utility classes that mirror these).
 */

export const SPACING = {
  xs: "4px",   // 1
  sm: "8px",   // 2
  md: "16px",  // 4
  lg: "24px",  // 6
  xl: "32px",  // 8
  "2xl": "48px", // 12
  "3xl": "64px", // 16
  section: "96px" // py-24
} as const;

export const RADIUS = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px"
} as const;

export const SHADOW = {
  sm: "0 1px 2px rgba(0,0,0,0.3)",
  md: "0 4px 8px rgba(0,0,0,0.3)",
  lg: "0 12px 24px rgba(0,0,0,0.4)",
  xl: "0 24px 48px rgba(0,0,0,0.5)",
  glow: "0 0 40px rgba(255,61,46,0.4)",
  "glow-accent": "0 0 40px rgba(0,225,255,0.4)"
} as const;

export const COLORS = {
  // Match tailwind.config.ts
  background: "#050505",
  surface: "#0D0E12",
  "surface-2": "#161821",
  primary: "#FF3D2E",
  "primary-light": "#FF6B5C",
  "primary-dark": "#CC2E22",
  secondary: "#FFA800",
  accent: "#00E1FF",
  "text-primary": "#FAFAFA",
  "text-secondary": "#D1D5DB",
  "text-muted": "#9CA3AF",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444"
} as const;

export const GRADIENTS = {
  brand: "from-primary to-accent",
  primary: "from-primary to-primary-light",
  accent: "from-accent to-primary",
  success: "from-success to-accent",
  warning: "from-warning to-primary",
  secondary: "from-secondary to-primary",
  pink: "from-pink-500 to-primary",
  cyan: "from-cyan-400 to-accent",
  slate: "from-slate-400 to-primary"
} as const;

export const TYPOGRAPHY = {
  display: "var(--font-space), system-ui, sans-serif",
  sans: "var(--font-inter), system-ui, sans-serif",
  mono: "var(--font-mono), monospace"
} as const;

export const FONT_SIZES = {
  xs: ["11px", "1.4"],   // label
  sm: ["14px", "1.5"],   // body-sm
  base: ["16px", "1.6"], // body
  lg: ["18px", "1.6"],
  xl: ["20px", "1.5"],
  "2xl": ["24px", "1.3"],
  "3xl": ["30px", "1.2"],
  "4xl": ["36px", "1.1"],
  "5xl": ["48px", "1.05"],
  "6xl": ["60px", "1.0"],
  "7xl": ["72px", "0.95"]
} as const;

export const CONTAINER = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px"
} as const;

export const TOUCH_TARGET = {
  min: 44,    // WCAG minimum
  recommended: 48
} as const;

export const ANIMATION = {
  fast: "150ms",
  normal: "250ms",
  slow: "400ms",
  slower: "600ms"
} as const;

export const Z_INDEX = {
  behind: -1,
  base: 0,
  raised: 10,
  sticky: 30,
  nav: 50,
  overlay: 70,
  modal: 90,
  toast: 100,
  max: 9999
} as const;

/**
 * Standard section spacing for consistency.
 * Use as: `<section className="py-section px-4">` or via class.
 */
export const SECTION_CLASS = "py-12 sm:py-16 lg:py-24";
export const CONTAINER_CLASS = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
export const CARD_CLASS = "glass p-6 rounded-2xl";
export const CARD_HOVER_CLASS = "glass p-6 rounded-2xl hover:border-primary/50 transition-colors";
export const H1_CLASS = "font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight";
export const H2_CLASS = "font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight";
export const H3_CLASS = "font-display font-bold text-xl sm:text-2xl";
export const BODY_CLASS = "text-text-secondary text-sm sm:text-base leading-relaxed";
export const LABEL_CLASS = "text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted";
export const BTN_PRIMARY = "btn-primary text-sm";
export const BTN_SECONDARY = "btn-secondary text-sm";
