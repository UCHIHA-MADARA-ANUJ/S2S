import Image from "next/image";
import { SITE, TEAM as TEAM_DATA } from "@/lib/constants";

type Member = {
  id: string;
  name: string;
  role: string;
  archetype: string;
  bullets: string[];
  intro: string;
  body: string;
  image: string;
  imageAlt: string;
  tags: string[];
  accent: string; // tailwind gradient classes
};

const MEMBERS: Member[] = [
  {
    id: "001",
    name: "ANUJ\nPHULERA",
    role: "ARCHITECT",
    archetype: "Engineer & Lead",
    bullets: ["LEAD DEVELOPER", "AI ARCHITECT", "FULL-STACK"],
    intro:
      "The architect. Anuj built SkillVerse from a single Next.js file into a 32-page AI analytics platform with live data, Gemini integration, and a cinematic 5-act intro.",
    body:
      "He engineered the system architecture, the Gemini AI pipeline, the Supabase schema, and every micro-interaction. The man behind the machine. Refuses to ship anything that isn't production-ready.",
    image: "/team/anuj.png",
    imageAlt: "Anuj Phulera",
    tags: ["LEAD", "DEVELOPER", "AI"],
    accent: "from-primary to-warning",
  },
  {
    id: "002",
    name: "AARAV\nCHOUDHARY",
    role: "VISIONARY",
    archetype: "Ideator & Strategy",
    bullets: ["VISION", "MARKETING", "IDEAS"],
    intro:
      "The strategist. Aarav saw the decay of modern social platforms and decided to burn it down by imagining something better.",
    body:
      "He engineers the narrative, the user-psychology flows, the go-to-market strategy, and the overarching vision of the SkillVerse protocol. Refuses to compromise on the idea.",
    image: "/team/aarav.png",
    imageAlt: "Aarav Choudhary",
    tags: ["VISION", "STRATEGY", "IDEAS"],
    accent: "from-warning to-primary",
  },
  {
    id: "003",
    name: "DHUN",
    role: "PRESENTER",
    archetype: "The Voice",
    bullets: ["DEMOS", "STAGE", "STORYTELLING"],
    intro:
      "The voice. Dhun turns technical architecture into a story a 12-year-old can follow. Zero jargon, all energy.",
    body:
      "On stage she runs the live demos, navigates the Q&A, and makes sure the judges feel the problem before they see the solution. Half the team agreed she's the reason this wins.",
    image: "/team/dhun.png",
    imageAlt: "Dhun",
    tags: ["PRESENTER", "DEMO", "STAGE"],
    accent: "from-accent to-primary",
  },
  {
    id: "004",
    name: "PREKSHA",
    role: "PRESENTER",
    archetype: "The Closer",
    bullets: ["NARRATIVE", "RAPPORT", "RESEARCH"],
    intro:
      "The closer. Preksha opens and closes every presentation. She frames the problem, anchors the conclusion, and leaves the room thinking about SkillVerse at 11pm.",
    body:
      "Behind the scenes she runs the survey distribution, manages the 250+ student responses, and keeps the entire timeline honest. The reason our numbers actually mean something.",
    image: "/team/preksha.png",
    imageAlt: "Preksha",
    tags: ["PRESENTER", "RESEARCH", "STORY"],
    accent: "from-success to-accent",
  },
];

export default function TeamPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0608]">
      {/* Subtle grain / scanline texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "100% 3px",
        }}
      />
      {/* Soft red glow in the top-left */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(180,30,40,0.18) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-20 sm:mb-28">
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-primary mb-4">
            // SKILLVERSE.SYS / PERSONNEL
          </p>
          <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter leading-[0.95]">
            <span className="text-white">THE </span>
            <span className="bg-gradient-to-br from-primary via-warning to-accent bg-clip-text text-transparent">
              HUMANS
            </span>
          </h1>
          <p className="text-text-secondary mt-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            4 students from {SITE.school}, {SITE.city}. One mission: prove that
            screens can build skills. Built for {SITE.competition}.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            PERSONNEL FILE · CLASSIFIED · 4 ENTRIES
          </div>
        </div>

        {/* MEMBERS — RESONATE style */}
        <div className="space-y-20 sm:space-y-32">
          {MEMBERS.map((m, idx) => (
            <MemberBlock key={m.id} member={m} reverse={idx % 2 === 1} />
          ))}
        </div>

        {/* FOOTER CREDIT */}
        <div className="mt-32 text-center">
          <div className="inline-block px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
            <p className="text-[10px] font-mono tracking-widest text-text-muted">
              END OF FILE · FACULTY: SHAMMIN MA&apos;AM · CCA GURUGRAM · 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberBlock({ member, reverse }: { member: Member; reverse: boolean }) {
  const [line1, line2] = member.name.split("\n");
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* LEFT: TEXT */}
      <div className={`${reverse ? "lg:pl-8" : "lg:pr-8"} space-y-6`}>
        {/* Archetype tag */}
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-[10px] font-mono tracking-widest text-primary border border-primary/30 rounded">
            {member.role}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-text-muted">
            {member.archetype.toUpperCase()}
          </span>
        </div>

        {/* Name (massive) */}
        <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter leading-[0.9] uppercase">
          <span className="block">{line1}</span>
          {line2 && <span className="block">{line2}</span>}
        </h2>

        {/* Bullet labels */}
        <p className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-primary flex items-center gap-2 flex-wrap">
          {member.bullets.map((b, i) => (
            <span key={b} className="flex items-center gap-2">
              {i > 0 && <span className="text-text-muted">/</span>}
              <span>{b}</span>
            </span>
          ))}
          <span className="block w-12 h-px bg-primary/40" />
        </p>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2">
          {member.tags.map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 text-[10px] font-mono tracking-widest border border-primary/40 text-primary rounded"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Intro paragraph */}
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed font-mono pt-2">
          {member.intro}
        </p>

        {/* Body in bordered box (italic, monospace) */}
        <div className="relative pl-5 pr-4 py-5 border-l-2 border-primary/60 bg-white/[0.02] backdrop-blur-sm">
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed italic font-mono">
            {member.body}
          </p>
        </div>
      </div>

      {/* RIGHT: PORTRAIT */}
      <div className="relative">
        <Portrait member={member} />
      </div>
    </div>
  );
}

function Portrait({ member }: { member: Member }) {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4]">
      {/* Background offset square (red accent) */}
      <div
        aria-hidden
        className="absolute -inset-3 bg-primary/70 rounded-sm translate-x-3 translate-y-3"
        style={{ zIndex: 0 }}
      />
      {/* Main image container */}
      <div
        className="relative w-full h-full border border-white/15 bg-black overflow-hidden rounded-sm"
        style={{ zIndex: 1 }}
      >
        {/* ID label */}
        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 border border-primary/70 text-primary text-[10px] font-mono tracking-widest bg-black/60 backdrop-blur-sm">
          ID: {member.id} // {member.role}
        </div>
        {/* Corner brackets */}
        <div aria-hidden className="absolute top-0 right-0 z-10">
          <div className="w-6 h-px bg-white/40 ml-auto" />
          <div className="w-px h-6 bg-white/40 ml-auto" />
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 z-10">
          <div className="w-px h-6 bg-white/40" />
          <div className="w-6 h-px bg-white/40" />
        </div>

        <Image
          src={member.image}
          alt={member.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={false}
        />

        {/* Bottom gradient + label */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
          <p className="text-[10px] font-mono tracking-widest text-text-muted">
            {member.imageAlt.toUpperCase()} · SKILLVERSE PERSONNEL
          </p>
        </div>
      </div>
    </div>
  );
}
