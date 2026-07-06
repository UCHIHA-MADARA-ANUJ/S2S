import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
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
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee 30s linear infinite reverse"
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } }
      }
    }
  },
  plugins: []
};

export default config;
