import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0A0A0A",
        "surface-2": "#111111",
        primary: "#FF3D2E",
        "primary-light": "#FF6B5C",
        "primary-dark": "#CC2E22",
        secondary: "#FFA800",
        accent: "#00E1FF",
        "text-primary": "#FAFAFA",
        "text-secondary": "#A1A1A1",
        "text-muted": "#666666",
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
