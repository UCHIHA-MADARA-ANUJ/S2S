import { TEAM, SITE } from "@/lib/constants";
import { Mail, MapPin } from "lucide-react";

export default function TeamPage() {
  const members: Array<{ name: string; grade: string; role: string; initial: string; bio?: string }> = [
    { ...TEAM.lead, initial: TEAM.lead.name[0] },
    { ...TEAM.ideator, initial: TEAM.ideator.name[0] },
    ...TEAM.speakers.map(s => ({ ...s, initial: s.name[0] }))
  ];

  const colors = ["from-primary to-primary-light", "from-secondary to-warning", "from-accent to-blue-500", "from-success to-emerald-500"];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="label mb-3">THE HUMANS</p>
          <h1 className="font-display font-black text-6xl sm:text-8xl tracking-tighter">Team.</h1>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto">4 students from {SITE.school}, {SITE.city}. One mission: prove screens can build skills.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {members.map((m, i) => (
            <div key={i} className="glass p-6 text-center group">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors[i]} flex items-center justify-center font-display font-black text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {m.initial}
              </div>
              <h3 className="font-display font-black text-lg">{m.name}</h3>
              <p className="label mt-1">Grade {m.grade}</p>
              <p className="text-text-secondary text-sm mt-3">{m.role}</p>
              {m.bio && <p className="text-text-muted text-xs mt-2 leading-relaxed">{m.bio}</p>}
            </div>
          ))}
        </div>

        <div className="glass-strong p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="label mb-3">CONTACT</p>
            <h2 className="font-display font-black text-3xl mb-4">Get in touch.</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              For collaboration, questions, or to discuss the research, reach out. We read every message.
            </p>
            <div className="space-y-3">
              <a href="mailto:madara.coding.projects@gmail.com" className="flex items-center gap-3 text-text-secondary hover:text-white">
                <Mail className="w-4 h-4" /> madara.coding.projects@gmail.com
              </a>
              <div className="flex items-center gap-3 text-text-secondary">
                <MapPin className="w-4 h-4" /> {SITE.school}, {SITE.city}
              </div>
            </div>
          </div>
          <div>
            <p className="label mb-3">COMPETITION</p>
            <h2 className="font-display font-black text-3xl mb-4">{SITE.competition}</h2>
            <p className="text-text-secondary leading-relaxed">
              Built for Techbuzz's Screen2Skill challenge. Theme: "From Screens to Skills — Online & Optimistic." Submitted via Google Drive with full documentation, walkthrough video, and live data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
