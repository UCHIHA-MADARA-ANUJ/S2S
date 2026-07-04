import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { GlobalFx } from "@/components/layout/GlobalFx";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { GSAPReveal } from "@/components/animations/GSAPReveal";
import { LiveAnnouncer } from "@/components/a11y/LiveAnnouncer";
import { WebVitalsReporter } from "@/components/a11y/WebVitalsReporter";
import { PowerUserFeatures } from "@/components/ui/PowerUserFeatures";
import { CelebrationOverlay } from "@/components/ui/Celebration";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { IntroProvider } from "@/lib/intro-context";
import { HideDuringIntro } from "@/components/layout/HideDuringIntro";

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
        {/* Skip-to-main link for keyboard / screen reader users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <ErrorBoundary>
          <AuthProvider>
            <IntroProvider>
              <LenisProvider>
                <GlobalFx />
                <GSAPReveal />
                <CustomCursor />
                <LiveAnnouncer />
                <WebVitalsReporter />
                <PowerUserFeatures />
                <CelebrationOverlay />
                <Navbar />
                <MobileNav />

                <main id="main-content" className="relative z-10" role="main" aria-label="Main content">
                  {children}
                </main>

                <HideDuringIntro><Footer /></HideDuringIntro>
                <Toaster theme="dark" position="bottom-right" richColors />
              </LenisProvider>
            </IntroProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
