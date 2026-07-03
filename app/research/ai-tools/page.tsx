import { getAIToolData, aggregateBy, avgBy } from "@/lib/data/kaggle";
import { BarV, BarH, PieC } from "@/components/charts/ResearchChartWrapper";
import { Cpu, ArrowLeft, Star, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const COLORS = ["#FF3D2E", "#FFA800", "#00E1FF", "#10B981", "#8B5CF6", "#EC4899", "#06B6D4", "#F59E0B"];

export default async function Page() {
  const data: any[] = await getAIToolData();
  if (!data.length) return <div className="p-12">Loading...</div>;

  const byTool = aggregateBy(data, "tool");
  const toolData = Object.entries(byTool).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const avgSat = avgBy(data, "tool", "satisfaction_1to10");
  const satisfactionData = Object.entries(avgSat).map(([name, value]) => ({ name, value: Number(value.toFixed(1)) })).sort((a, b) => b.value - a.value);

  const byUseCase = aggregateBy(data, "use_case");
  const useCaseData = Object.entries(byUseCase).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const avgRec = avgBy(data, "tool", "would_recommend");
  const recommendData = Object.entries(avgRec).map(([name, value]) => ({ name, value: Number((value * 100).toFixed(0)) })).sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/research" className="inline-flex items-center gap-2 text-text-muted hover:text-primary label mb-6">
          <ArrowLeft className="w-4 h-4" /> BACK TO RESEARCH
        </Link>
        <div className="mb-12" data-reveal>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <p className="label">{data.length.toLocaleString()} RECORDS</p>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter" data-split>AI Tool Usage Among Teens</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <KPI value={data.length.toLocaleString()} label="Records" icon="Cpu" />
          <KPI value={Object.keys(byTool).length} label="Tools" icon="Sparkles" />
          <KPI value={(data.filter(r => r.would_recommend).length / data.length * 100).toFixed(0) + "%"} label="Recommend" icon="Star" />
          <KPI value={(data.reduce((s, r) => s + r.hours_per_week, 0) / data.length).toFixed(1) + "h"} label="Avg Use/Wk" icon="Zap" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Tool Popularity"><PieC data={toolData} colors={COLORS} /></Card>
          <Card title="Satisfaction (1-10)"><BarV data={satisfactionData} color="#FF3D2E" /></Card>
          <Card title="Use Cases"><BarH data={useCaseData} color="#00E1FF" /></Card>
          <Card title="Recommend %"><BarV data={recommendData} color="#10B981" /></Card>
        </div>
      </div>
    </div>
  );
}

function KPI({ value, label, icon }: any) {
  const ICONS: any = { Cpu, Sparkles, Star, Zap };
  const Icon = ICONS[icon] || Cpu;
  return <div className="glass p-5" data-reveal><Icon className="w-5 h-5 text-accent mb-2" />
    <div className="text-3xl font-display font-black tabular-nums">{value}</div>
    <div className="label mt-1">{label}</div></div>;
}

function Card({ title, children }: any) {
  return <div className="glass p-5" data-reveal><h3 className="font-display font-bold text-lg mb-4">{title}</h3>{children}</div>;
}
