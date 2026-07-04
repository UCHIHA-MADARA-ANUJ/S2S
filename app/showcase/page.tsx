import { DotField } from "@/components/effects/DotField";
import { ClickSpark } from "@/components/effects/ClickSpark";
import { PixelTrail } from "@/components/effects/PixelTrail";
import { MagnetLines } from "@/components/effects/MagnetLines";
import { MagicBento } from "@/components/effects/MagicBento";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { GlowCard } from "@/components/effects/GlowCard";
import { MagicRings } from "@/components/effects/MagicRings";
import { StarBorder } from "@/components/effects/StarBorder";
import { CountUp } from "@/components/effects/CountUp";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { AnimatedContent } from "@/components/effects/AnimatedContent";
import { MetaBalls } from "@/components/effects/MetaBalls";
import { Antigravity } from "@/components/effects/Antigravity";
import { Ballpit } from "@/components/effects/Ballpit";
import { ColorBends } from "@/components/effects/ColorBends";
import { SplitText } from "@/components/effects/SplitText";
import { Tilt3DCard } from "@/components/effects/Tilt3DCard";
import { TextPressure } from "@/components/effects/TextPressure";
import { Bot, Brain, Sparkles, Zap, Heart, Globe, Star, Code, Database, Cpu, Layers, BarChart, FileText, Languages, TrendingUp, Box, Image as ImageIcon, Music, FileJson, Type, FileSpreadsheet, Palette, Hexagon, MousePointer2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "FX Showcase",
  description: "Premium interactive effects and component library",
};

const STATS = [
  { value: 22, label: "Custom Effects" },
  { value: 676, label: "Illustrations" },
  { value: 439, label: "Icons" },
  { value: 95, label: "Lottie" },
  { value: 30, label: "Research PDFs" },
  { value: 22, label: "3D Models" },
  { value: 30, label: "Datasets" },
  { value: 49, label: "Embeddings" }
];

const COMPONENTS = [
  { name: "DotField", desc: "Interactive cursor-aware dot grid", icon: Hexagon, color: "from-indigo-500 to-purple-500" },
  { name: "MagicBento", desc: "Spotlight bento grid with stars", icon: Box, color: "from-cyan-500 to-blue-500" },
  { name: "Ballpit", desc: "Full physics ball simulation", icon: Box, color: "from-pink-500 to-red-500" },
  { name: "SpotlightCard", desc: "Card with cursor spotlight", icon: Star, color: "from-amber-500 to-orange-500" },
  { name: "GlowCard", desc: "Animated gradient border", icon: Sparkles, color: "from-emerald-500 to-teal-500" },
  { name: "MagicRings", desc: "Pulsing concentric rings", icon: Hexagon, color: "from-fuchsia-500 to-pink-500" },
  { name: "StarBorder", desc: "Rotating star border", icon: Star, color: "from-violet-500 to-indigo-500" },
  { name: "MagnetLines", desc: "Magnetic field lines", icon: Layers, color: "from-sky-500 to-cyan-500" },
  { name: "TextPressure", desc: "Proximity-scaling text", icon: Type, color: "from-rose-500 to-pink-500" },
  { name: "CountUp", desc: "Animated number counter", icon: BarChart, color: "from-lime-500 to-emerald-500" },
  { name: "ScrollReveal", desc: "8 reveal animations", icon: Sparkles, color: "from-yellow-500 to-amber-500" },
  { name: "AnimatedContent", desc: "Scroll-triggered entry", icon: Sparkles, color: "from-teal-500 to-cyan-500" },
  { name: "MetaBalls", desc: "Gooey metaball background", icon: Box, color: "from-blue-500 to-indigo-500" },
  { name: "Antigravity", desc: "Floating geometric shapes", icon: Box, color: "from-purple-500 to-fuchsia-500" },
  { name: "ColorBends", desc: "Flowing gradient bands", icon: Palette, color: "from-orange-500 to-red-500" },
  { name: "PixelTrail", desc: "Pixel grid cursor trail", icon: Box, color: "from-cyan-500 to-teal-500" },
  { name: "ClickSpark", desc: "Click explosion particles", icon: Sparkles, color: "from-yellow-500 to-orange-500" },
  { name: "SplitText", desc: "GSAP character animation", icon: Type, color: "from-pink-500 to-rose-500" },
  { name: "Tilt3DCard", desc: "3D mouse-tracking tilt", icon: Box, color: "from-indigo-500 to-blue-500" },
  { name: "CustomCursor", desc: "Premium custom cursor", icon: MousePointer2, color: "from-emerald-500 to-cyan-500" },
  { name: "AnimatedCount", desc: "Number animation", icon: BarChart, color: "from-orange-500 to-pink-500" },
  { name: "Tilt3D", desc: "3D perspective tilt", icon: Layers, color: "from-blue-500 to-purple-500" }
];

const ASSETS = [
  { name: "Fonts", count: 12, size: "3.3 MB", icon: Type, href: "/fonts" },
  { name: "Icons", count: 439, size: "1.8 MB", icon: Star, href: "/icons" },
  { name: "Illustrations", count: 676, size: "5.3 MB", icon: ImageIcon, href: "/illustrations" },
  { name: "3D Models", count: 22, size: "6.2 MB", icon: Box, href: "/3d" },
  { name: "Lottie", count: 95, size: "440 KB", icon: FileJson, href: "/lottie" },
  { name: "Audio", count: 15, size: "1.0 MB", icon: Music, href: "/audio" },
  { name: "Research PDFs", count: 30, size: "128 KB", icon: FileText, href: "/research-pdfs" },
  { name: "Datasets", count: 30, size: "67 MB", icon: FileSpreadsheet, href: "/datasets" },
  { name: "Curated Data", count: 8, size: "36 KB", icon: Database, href: "/curated" },
  { name: "Embeddings", count: 49, size: "320 KB", icon: Cpu, href: "/embeddings" }
];

export default function ShowcasePage() {
  return (
    <div className="relative pt-24 pb-32">
      {/* HERO with DotField background - CONFINED */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <DotField dotSpacing={20} cursorRadius={250} bulgeStrength={36} sparkle />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full text-sm font-semibold mb-8 border border-primary/30 bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
            Premium React Bits-Quality Components
          </div>
          <TextPressure
            text="SkillVerse FX"
            className="font-display text-7xl md:text-9xl font-black mb-6"
            minScale={1}
            maxScale={1.5}
          />
          <p className="text-text-secondary text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
            <strong className="text-white">22 custom interactive components</strong>, <strong className="text-white">1,300+ assets</strong>, all built natively.
            <br />No expensive subscriptions. Pure React + TypeScript + Canvas, optimized for 60fps.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
              <Zap className="w-4 h-4" /> Back to home
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 font-semibold hover:border-primary/50 transition-colors">
              <BarChart className="w-4 h-4" /> See Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* STATS with MagicBento */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal effect="slide-up">
          <h2 className="font-display text-5xl font-black text-center mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">By the Numbers</span>
          </h2>
          <p className="text-center text-text-muted mb-12">Every component, asset, and dataset built from scratch</p>
        </ScrollReveal>
        <MagicBento columns={4} enableStars clickEffect>
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col gap-2 py-4">
              <div className="text-5xl font-display font-black text-white">
                <CountUp to={s.value} duration={2} />
              </div>
              <div className="text-xs uppercase tracking-wider text-text-muted">{s.label}</div>
            </div>
          ))}
        </MagicBento>
      </section>

      {/* COMPONENTS GRID with GlowCard */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal effect="slide-up">
          <h2 className="font-display text-5xl font-black text-center mb-4">
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">22 Interactive Components</span>
          </h2>
          <p className="text-center text-text-muted mb-12">Hover over any card to see the spotlight effect</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMPONENTS.map((c, i) => (
            <SpotlightCard key={i} className="bg-surface/40">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 shadow-lg`}>
                <c.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-display font-bold text-white text-lg">{c.name}</div>
              <div className="text-sm text-text-muted">{c.desc}</div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ASSETS LIBRARY */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal effect="slide-up">
          <h2 className="font-display text-5xl font-black text-center mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-warning bg-clip-text text-transparent">Asset Library</span>
          </h2>
          <p className="text-center text-text-muted mb-12">Browse our 1,300+ generated assets</p>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {ASSETS.map((a, i) => (
            <GlowCard key={i}>
              <a.icon className="w-7 h-7 text-primary mb-2" />
              <div className="font-display font-bold text-white text-base">{a.name}</div>
              <div className="text-xs text-text-muted mt-1">{a.count} files</div>
              <div className="text-xs text-accent font-semibold mt-1">{a.size}</div>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* MAGNET LINES */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal effect="slide-up">
          <h2 className="font-display text-5xl font-black text-center mb-12">
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">Magnet Field</span>
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass rounded-2xl p-6 h-[400px] relative overflow-hidden">
            <MagnetLines rows={11} columns={11} containerSize="100%" lineHeight="32px" />
          </div>
          <div className="space-y-4">
            {[
              { t: "Cursor Aware", d: "Every line reacts to your mouse movement", icon: MousePointer2 },
              { t: "GPU Optimized", d: "Smooth 60fps on any device", icon: Zap },
              { t: "Fully Custom", d: "Every parameter is tweakable", icon: Zap }
            ].map((c, i) => (
              <SpotlightCard key={i} spotlightColor="rgba(139, 92, 246, 0.25)">
                <c.icon className="w-6 h-6 text-purple-400 mb-2" />
                <div className="font-display font-bold text-white text-lg">{c.t}</div>
                <div className="text-sm text-text-muted">{c.d}</div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* TILT 3D */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal effect="slide-up">
          <h2 className="font-display text-5xl font-black text-center mb-12">
            <span className="bg-gradient-to-r from-pink-400 to-primary bg-clip-text text-transparent">Tilt 3D</span> Cards
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["AI Powered", "Real-time", "Beautiful"].map((t, i) => (
            <Tilt3DCard key={i} className="glass p-8 h-56 flex items-center justify-center">
              <div className="text-center">
                <Code className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="font-display font-bold text-white text-2xl">{t}</div>
                <div className="text-xs text-text-muted mt-2">Hover and move to tilt</div>
              </div>
            </Tilt3DCard>
          ))}
        </div>
      </section>

      {/* MAGIC RINGS */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <ScrollReveal effect="slide-up">
          <h2 className="font-display text-5xl font-black text-center mb-12">
            <span className="bg-gradient-to-r from-secondary to-pink-400 bg-clip-text text-transparent">Magic Rings</span>
          </h2>
        </ScrollReveal>
        <div className="relative h-[500px] w-full max-w-2xl flex items-center justify-center">
          <MagicRings rings={5} size={500} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center glass-strong px-8 py-4 rounded-2xl">
              <div className="font-display font-black text-3xl text-white">5 Rings</div>
              <div className="text-sm text-text-muted">Pulsing outward</div>
            </div>
          </div>
        </div>
      </section>

      {/* BALLPIT */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal effect="slide-up">
          <h2 className="font-display text-5xl font-black text-center mb-4">
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Ballpit</span> Physics
          </h2>
          <p className="text-center text-text-muted mb-12">Click to throw balls, hover to repel</p>
        </ScrollReveal>
        <div className="relative h-[500px] glass rounded-3xl overflow-hidden">
          <Ballpit count={28} followCursor />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center glass-strong px-8 py-4 rounded-2xl">
              <div className="font-display font-black text-3xl text-white">Click and Drag</div>
              <div className="text-sm text-text-muted">Full physics simulation</div>
            </div>
          </div>
        </div>
      </section>

      {/* METABALLS + ANTIGRAVITY */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-[400px] glass rounded-3xl overflow-hidden">
            <MetaBalls count={5} speed={0.4} />
            <div className="absolute bottom-4 left-4 glass-strong px-4 py-2 rounded-xl">
              <div className="font-display font-bold text-white">MetaBalls</div>
              <div className="text-xs text-text-muted">Gooey metaballs</div>
            </div>
          </div>
          <div className="relative h-[400px] glass rounded-3xl overflow-hidden">
            <Antigravity count={30} />
            <div className="absolute bottom-4 left-4 glass-strong px-4 py-2 rounded-xl">
              <div className="font-display font-bold text-white">Antigravity</div>
              <div className="text-xs text-text-muted">Floating shapes</div>
            </div>
          </div>
        </div>
      </section>

      {/* COLOR BENDS */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal effect="slide-up">
          <h2 className="font-display text-5xl font-black text-center mb-4">
            <span className="bg-gradient-to-r from-warning to-error bg-clip-text text-transparent">ColorBends</span>
          </h2>
          <p className="text-center text-text-muted mb-12">Flowing gradient bands</p>
        </ScrollReveal>
        <div className="relative h-[400px] glass rounded-3xl overflow-hidden">
          <ColorBends speed={0.25} amplitude={0.6} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center glass-strong px-8 py-4 rounded-2xl">
              <div className="font-display font-black text-3xl text-white">5 Color Bands</div>
              <div className="text-sm text-text-muted">Smoothly flowing</div>
            </div>
          </div>
        </div>
      </section>

      {/* PIXEL TRAIL + CLICK SPARK */}
      <section className="relative py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal effect="slide-up">
          <h2 className="font-display text-5xl font-black text-center mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-accent bg-clip-text text-transparent">Interactive</span> Trails
          </h2>
          <p className="text-center text-text-muted mb-12">Move your mouse and click around this section</p>
        </ScrollReveal>
        <div className="relative h-[400px] glass rounded-3xl overflow-hidden">
          <PixelTrail gridSize={20} trailSize={16} color="rgba(139, 92, 246, 0.7)" />
          <ClickSpark sparkColor="#A78BFA" sparkCount={12} sparkRadius={24} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center glass-strong px-8 py-4 rounded-2xl">
              <MousePointer2 className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-display font-black text-2xl text-white">Move and Click</div>
              <div className="text-sm text-text-muted">Pixel trail + spark on click</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <StarBorder color="#6366F1" speed={4} className="block">
          <div className="p-12">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-4xl font-black text-white mb-3">All built natively</h2>
            <p className="text-text-muted max-w-xl mx-auto mb-6">No expensive subscriptions. No third-party lock-in. Pure React + TypeScript + Canvas, optimized for performance.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
              <Zap className="w-4 h-4" /> Back to home
            </Link>
          </div>
        </StarBorder>
      </section>
    </div>
  );
}
