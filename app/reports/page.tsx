import Link from "next/link";
import { FileText, BarChart3, TrendingUp, Download } from "lucide-react";

const items = [
  { href: "/ai-hub/report", icon: FileText, title: "Full Research Report", desc: "AI-generated markdown report — Executive Summary, Methodology, Demographics, Key Findings, Recommendations." },
  { href: "/ai-hub/analyst", icon: BarChart3, title: "Data Analysis", desc: "AI-detected patterns, key findings, and surprising insights from the 145+ responses." },
  { href: "/dashboard", icon: BarChart3, title: "Live Dashboard", desc: "Real-time charts and KPIs from current survey data." },
  { href: "/ai-hub/trends", icon: TrendingUp, title: "Trend Predictions", desc: "AI forecasts of rising and falling digital learning trends." }
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="label mb-3">DOWNLOAD & ANALYZE</p>
          <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter">Reports.</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="glass p-6 hover:border-primary/50 group">
              <it.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-bold text-xl mb-2">{it.title}</h3>
              <p className="text-text-secondary text-sm mb-4">{it.desc}</p>
              <p className="text-primary text-xs label">Open →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
