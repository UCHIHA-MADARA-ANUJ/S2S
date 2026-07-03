import { DotField } from "@/components/effects/DotField";
import { BlobCursor } from "@/components/effects/BlobCursor";
import { ClickSpark } from "@/components/effects/ClickSpark";
import { PixelTrail } from "@/components/effects/PixelTrail";
import { MagnetLines } from "@/components/effects/MagnetLines";
import { MagicBento } from "@/components/effects/MagicBento";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { GlowCard } from "@/components/effects/GlowCard";
import { MagicRings } from "@/components/effects/MagicRings";
import { StarBorder } from "@/components/effects/StarBorder";
import { TextPressure } from "@/components/effects/TextPressure";
import { CountUp } from "@/components/effects/CountUp";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { AnimatedContent } from "@/components/effects/AnimatedContent";
import { MetaBalls } from "@/components/effects/MetaBalls";
import { Antigravity } from "@/components/effects/Antigravity";
import { Ballpit } from "@/components/effects/Ballpit";
import { ColorBends } from "@/components/effects/ColorBends";
import { SplitText } from "@/components/effects/SplitText";
import { Tilt3DCard } from "@/components/effects/Tilt3DCard";
import { Bot, Brain, Sparkles, Zap, Heart, Globe, Star, Code } from "lucide-react";

export const metadata = {
  title: "Component Showcase",
  description: "Premium React Bits-quality interactive effects powering SkillVerse",
};

export default function ShowcasePage() {
  return (
    <div className="relative pt-24 pb-32 overflow-hidden">
      <DotField dotSpacing={20} cursorRadius={220} sparkle />
      <MetaBalls count={5} speed={0.4} />
      <ColorBends speed={0.2} amplitude={0.5} />
      <PixelTrail />
      <ClickSpark sparkColor="#A78BFA" />
      <Antigravity count={28} />
      <BlobCursor fillColor="#6366F1" trailCount={3} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center mb-24">
          <AnimatedContent direction="vertical" distance={50}>
            <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs label mb-8">
              <Sparkles className="w-3 h-3 text-primary" />
              Premium React Bits-Quality Components
            </div>
          </AnimatedContent>
          <TextPressure
            text="SkillVerse FX"
            className="font-display text-6xl md:text-8xl font-black mb-6"
            minScale={0.95}
            maxScale={1.6}
          />
          <SplitText
            tag="p"
            text="Interactive components, animations, and effects - the same libraries you'd pay $200/mo for, built natively into SkillVerse."
            className="text-text-secondary text-lg max-w-2xl mx-auto"
            splitType="words"
            delay={30}
            duration={0.6}
            ease="power2.out"
          />
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <StarBorder color="#6366F1" speed={4}>
              <span className="flex items-center gap-2 px-2 py-1 font-semibold text-white">
                <Zap className="w-4 h-4 text-primary" /> 15+ Premium Effects
              </span>
            </StarBorder>
            <GlowCard size={1} className="px-6 py-2">
              <span className="flex items-center gap-2 text-white font-semibold text-sm">
                <Heart className="w-4 h-4 text-pink-400" /> 100% Custom
              </span>
            </GlowCard>
          </div>
        </section>

        <section className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 15, label: "Custom Components", suffix: "+" },
              { value: 60, label: "FPS Animations", suffix: "" },
              { value: 0, label: "External Lib Cost", prefix: "$" },
              { value: 100, label: "Built In-House", suffix: "%" },
            ].map((s, i) => (
              <ScrollReveal key={i} effect="slide-up" delay={i * 0.1}>
                <SpotlightCard>
                  <div className="text-4xl font-display font-black text-white">
                    <CountUp to={s.value} prefix={s.prefix} suffix={s.suffix} duration={2.5} />
                  </div>
                  <div className="text-xs uppercase tracking-wider text-text-muted mt-1">{s.label}</div>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <ScrollReveal effect="slide-up">
            <h2 className="font-display text-4xl font-black mb-8 text-center">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Magic Bento</span> Grid
            </h2>
          </ScrollReveal>
          <MagicBento columns={3} enableStars clickEffect>
            {[
              { I: Bot, t: "SkillBot", d: "Conversational AI" },
              { I: Brain, t: "AI Brain", d: "Neural pathway generation" },
              { I: Sparkles, t: "Sparkle FX", d: "Magical interactions" },
              { I: Zap, t: "Instant", d: "Real-time analytics" },
              { I: Heart, t: "Wellness", d: "Mental health tracking" },
              { I: Globe, t: "Global", d: "Worldwide insights" },
            ].map((c, i) => (
              <div key={i} className="flex flex-col gap-2 py-4">
                <c.I className="w-7 h-7 text-primary" />
                <div className="font-display font-bold text-white">{c.t}</div>
                <div className="text-xs text-text-muted">{c.d}</div>
              </div>
            ))}
          </MagicBento>
        </section>

        <section className="mb-24 flex flex-col items-center gap-12">
          <ScrollReveal>
            <h2 className="font-display text-4xl font-black text-center">
              <span className="bg-gradient-to-r from-secondary to-pink-400 bg-clip-text text-transparent">Magic Rings</span>
            </h2>
          </ScrollReveal>
          <MagicRings rings={5} size={420} />
        </section>

        <section className="mb-24">
          <ScrollReveal>
            <h2 className="font-display text-4xl font-black mb-8 text-center">
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">Magnet Field</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MagnetLines rows={11} columns={11} containerSize="100%" lineHeight="32px" />
            <div className="space-y-4">
              {[
                { t: "Cursor Aware", d: "Every pixel reacts to your presence" },
                { t: "GPU Optimized", d: "Smooth 60fps on any device" },
                { t: "Fully Custom", d: "Every parameter tweakable" },
              ].map((c, i) => (
                <SpotlightCard key={i} spotlightColor="rgba(139, 92, 246, 0.2)">
                  <Star className="w-5 h-5 mb-2 text-purple-400" />
                  <div className="font-display font-bold text-white">{c.t}</div>
                  <div className="text-sm text-text-muted">{c.d}</div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-24">
          <ScrollReveal>
            <h2 className="font-display text-4xl font-black mb-8 text-center">
              <span className="bg-gradient-to-r from-pink-400 to-primary bg-clip-text text-transparent">Tilt 3D</span> Cards
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["AI Powered", "Real-time", "Beautiful"].map((t, i) => (
              <ScrollReveal key={i} effect="rotate" delay={i * 0.1}>
                <Tilt3DCard className="glass p-6 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Code className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="font-display font-bold text-white text-xl">{t}</div>
                    <div className="text-xs text-text-muted mt-1">Hover and move to tilt</div>
                  </div>
                </Tilt3DCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <ScrollReveal>
            <h2 className="font-display text-4xl font-black mb-8 text-center">
              <span className="bg-gradient-to-r from-warning to-error bg-clip-text text-transparent">Scroll-triggered</span> Animations
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(["fade", "slide-up", "scale", "blur"] as const).map((e, i) => (
              <ScrollReveal key={e} effect={e} delay={i * 0.05}>
                <SpotlightCard>
                  <div className="font-display font-bold text-white capitalize">{e}</div>
                  <div className="text-xs text-text-muted mt-1">Reveals on scroll</div>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <ScrollReveal>
            <h2 className="font-display text-4xl font-black mb-4 text-center">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Ballpit</span> Physics
            </h2>
            <p className="text-center text-text-muted text-sm mb-8">Click to throw balls, hover to repel</p>
          </ScrollReveal>
          <div className="relative h-[420px] glass rounded-3xl overflow-hidden">
            <Ballpit count={28} followCursor />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center glass-strong px-6 py-4 rounded-2xl">
                <div className="font-display font-black text-2xl text-white">Click and Drag</div>
                <div className="text-xs text-text-muted">Full physics simulation</div>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <ScrollReveal effect="scale">
            <div className="glass-strong rounded-3xl p-12">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-3xl font-black text-white mb-2">All built natively</h3>
              <p className="text-text-muted max-w-lg mx-auto">No expensive subscriptions. No third-party lock-in. Pure React + TypeScript + Canvas, optimized for performance.</p>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
