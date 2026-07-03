import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { GlobalFx } from "@/components/layout/GlobalFx";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { GSAPReveal } from "@/components/animations/GSAPReveal";
import { PixelTrail } from "@/components/effects/PixelTrail";
import { ClickSpark } from "@/components/effects/ClickSpark";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "SkillVerse — Where Screens Become Skills", template: "%s | SkillVerse" },
  description: "AI-powered analytics platform proving screen time can become skill time. Screen2Skill 2026.",
  keywords: ["screen time", "skills", "AI", "analytics", "education", "Gemini"],
  authors: [{ name: "Anuj Phulera" }],
  openGraph: {
    title: "SkillVerse — Where Screens Become Skills",
    description: "AI-powered analytics platform for Screen2Skill 2026",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${space.variable} ${mono.variable} bg-background text-text-primary antialiased min-h-screen overflow-x-hidden`}>
        <LenisProvider>
          <GlobalFx />
          <GSAPReveal />
          <CustomCursor />
          <PixelTrail gridSize={20} trailSize={12} color="rgba(139, 92, 246, 0.6)" />
          <ClickSpark sparkColor="#A78BFA" sparkCount={10} sparkRadius={18} />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <Toaster theme="dark" position="bottom-right" richColors />
        </LenisProvider>
      </body>
    </html>
  );
}
