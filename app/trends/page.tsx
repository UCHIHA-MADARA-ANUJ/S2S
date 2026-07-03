import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function TrendsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter mb-4">Trends.</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
          AI-powered predictions of where digital learning is heading. Backed by 145+ real student responses.
        </p>
        <Link href="/ai-hub/trends" className="btn-primary text-base">
          Open Trend Predictor <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
