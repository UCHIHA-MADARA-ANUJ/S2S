import { DotField } from "@/components/effects/DotField";
import { TextPressure } from "@/components/effects/TextPressure";
import { SplitText } from "@/components/effects/SplitText";
import { CountUp } from "@/components/effects/CountUp";
import { SpotlightCard } from "@/components/effects/SpotlightCard";

export interface PageHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  enableDotField?: boolean;
  enableTextPressure?: boolean;
  kpis?: Array<{ value: number | string; label: string; prefix?: string; suffix?: string; highlight?: boolean }>;
}

/**
 * Standardized page header used across all new pages.
 * - label (kicker)
 * - animated title (TextPressure)
 * - subtitle (SplitText word-by-word)
 * - 2-4 KPI cards (SpotlightCard + CountUp)
 * - optional DotField background
 */
export function PageHeader({ label, title, subtitle, enableDotField = true, enableTextPressure = true, kpis = [] }: PageHeaderProps) {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden pt-24 pb-12" data-reveal>
      {enableDotField && (
        <div className="absolute inset-0 z-0">
          <DotField dotSpacing={20} cursorRadius={200} sparkle bulgeStrength={20} />
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        {label && <p className="label mb-4">{label}</p>}
        <div style={{ minHeight: enableTextPressure ? 100 : undefined }}>
          {enableTextPressure ? (
            <TextPressure
              text={title}
              className="font-display font-black leading-[0.95] tracking-tight text-3xl sm:text-5xl md:text-7xl"
              minScale={0.85}
              maxScale={1.05}
            />
          ) : (
            <h1 className="font-display font-black leading-[0.95] tracking-tight text-3xl sm:text-5xl md:text-7xl">{title}</h1>
          )}
        </div>
        {subtitle && (
          <div className="mt-6 max-w-2xl mx-auto text-text-secondary text-lg">
            <SplitText text={subtitle} splitType="words" delay={30} duration={0.6} />
          </div>
        )}
        {kpis.length > 0 && (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto" data-reveal>
            {kpis.slice(0, 4).map((kpi, i) => (
              <SpotlightCard key={i}>
                <div className={`text-3xl font-display font-black ${kpi.highlight ? "text-primary" : "text-white"}`}>
                  <CountUp to={typeof kpi.value === "number" ? kpi.value : 0} prefix={kpi.prefix} suffix={kpi.suffix} />
                </div>
                <div className="label mt-1">{kpi.label}</div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
