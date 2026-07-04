import { getSocialMediaData, aggregateBy, avgBy } from "@/lib/data/kaggle";
import { BarV, BarH, ComposedC as ComposedC } from "@/components/charts/ResearchChartWrapper";
import { Heart, ArrowLeft, Smile, Frown } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { CountUp } from "@/components/effects/CountUp";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data: any[] = await getSocialMediaData();
  if (!data.length) return <div className="p-12">Loading...</div>;

  const byPlatform = aggregateBy(data, "platform");
  const platformData = Object.entries(byPlatform).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const avgBefore = avgBy(data, "platform", "mood_before_1to10");
  const avgAfter = avgBy(data, "platform", "mood_after_1to10");
  const moodDeltaData = Object.keys(byPlatform).map(p => ({
    platform: p,
    before: Number((avgBefore[p] || 0).toFixed(1)),
    after: Number((avgAfter[p] || 0).toFixed(1)),
    delta: Number(((avgAfter[p] || 0) - (avgBefore[p] || 0)).toFixed(1))
  })).sort((a, b) => a.delta - b.delta);

  const avgSkill = avgBy(data, "platform", "self_reported_skill_gain");
  const skillData = Object.entries(avgSkill).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) })).sort((a, b) => b.value - a.value);

  const avgLonely = avgBy(data, "platform", "loneliness_1to10");
  const lonelyData = Object.entries(avgLonely).map(([name, value]) => ({ name, value: Number(value.toFixed(1)) })).sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/research" className="inline-flex items-center gap-2 text-text-muted hover:text-primary label mb-6">
          <ArrowLeft className="w-4 h-4" /> BACK TO RESEARCH
        </Link>
        <div className="mb-12" data-reveal>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-accent flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <p className="label">{data.length.toLocaleString()} RECORDS</p>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter" data-split>Social Media Impact</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <KPI value={data.length.toLocaleString()} label="Records" icon="Heart" />
          <KPI value={Object.keys(byPlatform).length} label="Platforms" icon="Smile" />
          <KPI value={Math.max(...moodDeltaData.map(m => m.delta)).toFixed(1)} label="Best Δ" icon="Smile" />
          <KPI value={Math.min(...moodDeltaData.map(m => m.delta)).toFixed(1)} label="Worst Δ" icon="Frown" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Records by Platform"><BarH data={platformData} color="#FF3D2E" /></Card>
          <Card title="Mood Before vs After"><ComposedC data={moodDeltaData} /></Card>
          <Card title="Skill Gain (0-5)"><BarV data={skillData} color="#00E1FF" /></Card>
          <Card title="Loneliness (1-10)"><BarV data={lonelyData} color="#EC4899" /></Card>
        </div>
      </div>
    </div>
  );
}

function KPI({ value, label, icon }: any) {
  const ICONS: any = { Heart, Smile, Frown };
  const Icon = ICONS[icon] || Heart;
  return <div className="glass p-5" data-reveal><Icon className="w-5 h-5 text-success mb-2" />
    <div className="text-3xl font-display font-black tabular-nums">{value}</div>
    <div className="label mt-1">{label}</div></div>;
}

function Card({ title, children }: any) {
  return <div className="glass p-5" data-reveal><h3 className="font-display font-bold text-lg mb-4">{title}</h3>{children}</div>;
}
