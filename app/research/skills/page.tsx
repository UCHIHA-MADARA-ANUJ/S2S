import { getSkillData, aggregateBy, avgBy } from "@/lib/data/kaggle";
import { BarV, BarH, BarHDomain, ScatterC } from "@/components/charts/ResearchChartWrapper";
import { TrendingUp, ArrowLeft, Clock, Target, Award } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { CountUp } from "@/components/effects/CountUp";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data: any[] = await getSkillData();
  if (!data.length) return <div className="p-12">Loading...</div>;

  const byPlatform: Record<string, number> = {};
  for (const r of data) { const k = String(r.platform); byPlatform[k] = (byPlatform[k] || 0) + 1; }
  const platformRows = Object.entries(byPlatform).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const sumWeeks: Record<string, number> = {}, countWeeks: Record<string, number> = {};
  const sumEng: Record<string, number> = {}, countEng: Record<string, number> = {};
  const sumComp: Record<string, number> = {}, countComp: Record<string, number> = {}, sumHrs: Record<string, number> = {};
  for (const r of data) {
    const k = String(r.skill);
    sumWeeks[k] = (sumWeeks[k] || 0) + Number(r.weeks_to_proficiency);
    countWeeks[k] = (countWeeks[k] || 0) + 1;
    const p = String(r.platform);
    sumEng[p] = (sumEng[p] || 0) + Number(r.engagement_score);
    countEng[p] = (countEng[p] || 0) + 1;
    sumComp[p] = (sumComp[p] || 0) + Number(r.completion_rate);
    countComp[p] = (countComp[p] || 0) + 1;
    sumHrs[p] = (sumHrs[p] || 0) + Number(r.avg_practice_hours);
  }
  const avgWeeks: Record<string, number> = {};
  for (const k of Object.keys(sumWeeks)) avgWeeks[k] = sumWeeks[k] / countWeeks[k];
  const avgEng: Record<string, number> = {};
  for (const k of Object.keys(sumEng)) avgEng[k] = sumEng[k] / countEng[k];

  const skillsByTime = Object.entries(avgWeeks).map(([name, value]) => ({ name, value: Number(value.toFixed(1)) })).sort((a, b) => a.value - b.value);
  const engagementData = Object.entries(avgEng).map(([name, value]) => ({ name, value: Number(value.toFixed(1)) })).sort((a, b) => b.value - a.value);
  const scatterData = Object.keys(byPlatform).map(name => ({
    name, avg_practice_hours: Number(((sumHrs[name] || 0) / (countComp[name] || 1) || 5).toFixed(1)),
    completion_rate: Number(((sumComp[name] || 0) / (countComp[name] || 1) || 0.5).toFixed(2)),
    engagement_score: Number((avgEng[name] || 7).toFixed(1))
  }));

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/research" className="inline-flex items-center gap-2 text-text-muted hover:text-primary label mb-6">
          <ArrowLeft className="w-4 h-4" /> BACK TO RESEARCH
        </Link>
        <div className="mb-12" data-reveal>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-warning flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="label">{data.length.toLocaleString()} RECORDS</p>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter" data-split>Skill Acquisition Patterns</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <KPI value={data.length.toLocaleString()} label="Records" icon="Target" />
          <KPI value={Math.min(...Object.values(avgWeeks)).toFixed(0) + "w"} label="Fastest" icon="Clock" />
          <KPI value={Object.keys(byPlatform).length} label="Platforms" icon="Award" />
          <KPI value={Object.keys(avgWeeks).length} label="Skills" icon="TrendingUp" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Records by Platform"><BarV data={platformRows} color="#FFA800" /></Card>
          <Card title="Time to Proficiency (weeks)"><BarHDomain data={skillsByTime} color="#8B5CF6" /></Card>
          <Card title="Platform Engagement (1-10)"><BarV data={engagementData} color="#10B981" /></Card>
          <Card title="Hours vs Completion"><ScatterC data={scatterData} /></Card>
        </div>
      </div>
    </div>
  );
}

function KPI({ value, label, icon }: any) {
  const ICONS: any = { Target, Clock, Award, TrendingUp };
  const Icon = ICONS[icon] || Target;
  return <div className="glass p-5" data-reveal><Icon className="w-5 h-5 text-secondary mb-2" />
    <div className="text-3xl font-display font-black tabular-nums">{value}</div>
    <div className="label mt-1">{label}</div></div>;
}

function Card({ title, children }: any) {
  return <div className="glass p-5" data-reveal><h3 className="font-display font-bold text-lg mb-4">{title}</h3>{children}</div>;
}
