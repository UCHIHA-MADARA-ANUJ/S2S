import { getScreenTimeData, aggregateBy, avgBy } from "@/lib/data/kaggle";
import { BarV, BarH, PieC } from "@/components/charts/ResearchChartWrapper";
import { Globe, Clock, Sparkles, TrendingUp, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { CountUp } from "@/components/effects/CountUp";

export const dynamic = "force-dynamic";

const COLORS = ["#FF3D2E", "#FFA800", "#00E1FF", "#10B981", "#8B5CF6", "#EC4899", "#F59E0B", "#06B6D4"];

export default async function Page() {
  const data: any[] = await getScreenTimeData();
  if (!data.length) return <div className="p-12">Loading...</div>;

  const byCountry = avgBy(data, "country", "daily_screen_hours");
  const countryData = Object.entries(byCountry).map(([name, value]) => ({ name, value: Number(value.toFixed(1)) })).sort((a, b) => b.value - a.value);

  const byPlatform = aggregateBy(data, "top_platform");
  const platformData = Object.entries(byPlatform).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);

  const byDevice = aggregateBy(data, "primary_device");
  const deviceData = Object.entries(byDevice).map(([name, value]) => ({ name, value }));

  const ageMap: Record<string, number[]> = {};
  for (const r of data) {
    const k = String(r.age);
    if (!ageMap[k]) ageMap[k] = [];
    ageMap[k].push(Number(r.daily_screen_hours));
  }
  const ageData = Object.entries(ageMap)
    .map(([age, hours]) => ({ name: age, value: Number((hours.reduce((a, b) => a + b, 0) / hours.length).toFixed(1)) }))
    .sort((a, b) => Number(a.name) - Number(b.name));

  let totalHours = 0; let totalCreativity = 0;
  for (const r of data) { totalHours += Number(r.daily_screen_hours) || 0; totalCreativity += Number(r.creativity_score) || 0; }
  const avgHours = (totalHours / data.length).toFixed(1);
  const avgCreativity = (totalCreativity / data.length).toFixed(1);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/research" className="inline-flex items-center gap-2 text-text-muted hover:text-primary label mb-6">
          <ArrowLeft className="w-4 h-4" /> BACK TO RESEARCH
        </Link>
        <div className="mb-12" data-reveal>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <p className="label">{data.length.toLocaleString()} RECORDS</p>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter" data-split>Global Screen Time Study</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <KPI value={data.length.toLocaleString()} label="Students" icon="Users" />
          <KPI value={avgHours + "h"} label="Avg/Day" icon="Clock" />
          <KPI value={avgCreativity + "/10"} label="Avg Creativity" icon="Sparkles" />
          <KPI value={(data.length * Number(avgHours) / 1000).toFixed(0) + "k"} label="Hours/Day Total" icon="TrendingUp" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Screen Time by Country"><BarH data={countryData} color="#FF3D2E" /></Card>
          <Card title="Top Platforms"><PieC data={platformData} colors={COLORS} /></Card>
          <Card title="Screen Time by Age"><BarH data={ageData} color="#00E1FF" /></Card>
          <Card title="Device Distribution"><BarV data={deviceData} color="#10B981" /></Card>
        </div>
      </div>
    </div>
  );
}

function KPI({ value, label, icon }: any) {
  const ICONS: any = { Users, Clock, Sparkles, TrendingUp, Globe };
  const Icon = ICONS[icon] || Globe;
  return <div className="glass p-5" data-reveal><Icon className="w-5 h-5 text-primary mb-2" />
    <div className="text-3xl font-display font-black tabular-nums">{value}</div>
    <div className="label mt-1">{label}</div></div>;
}

function Card({ title, children }: any) {
  return <div className="glass p-5" data-reveal><h3 className="font-display font-bold text-lg mb-4">{title}</h3>{children}</div>;
}
