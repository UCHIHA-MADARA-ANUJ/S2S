import { Brain, Target, Users, Sparkles, Lock } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="label mb-3">THE STORY</p>
          <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter">About.</h1>
        </div>

        <div className="glass p-8 sm:p-12 mb-8">
          <h2 className="font-display font-black text-2xl mb-4">Why we built this.</h2>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            Every day, students spend hours on screens. Parents worry. Teachers worry. Society worries.
          </p>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            But we wanted to ask a different question: <span className="text-primary font-bold">what if screens are where the skills are?</span>
          </p>
          <p className="text-text-secondary leading-relaxed text-lg">
            So we surveyed 145+ real students. We built AI to analyze what they actually do. The data tells a different story than the fear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Pillar icon={Brain} title="AI-Powered" body="8 Gemini-powered tools analyze data in real-time." />
          <Pillar icon={Target} title="Real-Time" body="Supabase WebSocket updates within 1-2 seconds of new data." />
          <Pillar icon={Users} title="Anonymous" body="No emails, no names, no tracking. Pure anonymous research." />
          <Pillar icon={Sparkles} title="Open & Honest" body="Every chart is from real data. No fake testimonials." />
        </div>

        <div id="privacy" className="glass p-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="font-display font-black text-2xl">Privacy</h2>
          </div>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li>• No email or personal information required to take the survey</li>
            <li>• No tracking cookies or third-party analytics that identify users</li>
            <li>• All data is anonymous and aggregated for research only</li>
            <li>• Built by students at {SITE.school}, {SITE.city}</li>
            <li>• Submitted to: {SITE.competition}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Pillar({ icon: Icon, title, body }: any) {
  return (
    <div className="glass p-6">
      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-display font-bold text-xl mb-2">{title}</h3>
      <p className="text-text-secondary text-sm">{body}</p>
    </div>
  );
}
