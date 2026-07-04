import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader, CTA } from "@/components/layout/Section";
import { Code2, Brush, Brain, Mic, Camera, Database, Rocket, BookOpen, Briefcase, BarChart3, Lightbulb, Globe, Sparkles, Box, Music, ArrowUpRight } from "lucide-react";
import skills from "@/data/curated/skills.json";
import skillDetails from "@/data/curated/skillDetails.json";
import SkillsGrid from "./SkillsGrid";

export const metadata = {
  title: "Skills Library",
  description: "14 curated skills with hours-to-mastery, earnings potential, and top platforms."
};

const ICONS: Record<string, any> = {
  "Coding / Programming": Code2,
  "Video Editing": Camera,
  "Graphic Design": Brush,
  "Language Learning": Globe,
  "Writing / Blogging": BookOpen,
  "Communication": Mic,
  "Music Production": Music,
  "Public Speaking": Mic,
  "Research Skills": Brain,
  "AI / Prompt Engineering": Lightbulb,
  "Collaboration / Teamwork": Briefcase,
  "Productivity / Time Management": Rocket,
  "Math": BarChart3,
  "Science": Sparkles,
  "Data Analysis": Database,
  "Photography": Camera,
  "3D Modeling": Box,
  "Entrepreneurship": Briefcase,
  "Other": Sparkles
};

const CATEGORY_COLORS: Record<string, string> = {
  technical: "from-primary to-accent",
  creative: "from-secondary to-pink-500",
  cognitive: "from-accent to-primary",
  soft: "from-success to-accent",
  business: "from-warning to-primary"
};

const CATEGORY_LABELS: Record<string, string> = {
  technical: "Technical",
  creative: "Creative",
  cognitive: "Cognitive",
  soft: "Soft Skills",
  business: "Business"
};

export default function SkillsPage() {
  const allSkills = skills as any[];
  const totalEarning = allSkills.reduce((s, x) => s + (x.avgFirstEarning || 0), 0);
  const avgEarning = Math.round(totalEarning / allSkills.length);
  const categories = Array.from(new Set(allSkills.map(s => s.category)));

  // Enrich each skill with metadata. Icon is resolved client-side from the name.
  const enriched = allSkills.map((s) => ({
    ...s,
    iconName: Object.keys(ICONS).find((k) => ICONS[k] === ICONS[s.name]) || "Sparkles",
    color: CATEGORY_COLORS[s.category] || "from-primary to-primary-light",
    categoryLabel: CATEGORY_LABELS[s.category] || s.category,
    ...((skillDetails as any)[s.name] || {})
  }));

  return (
    <div>
      <PageHeader
        label="SKILLS LIBRARY · 14 CURATED"
        title="What can screens teach you?"
        subtitle="14 of the most-learned skills among teens — with real hours-to-mastery, earning potential, and the platforms that teach them best."
        kpis={[
          { value: allSkills.length, label: "Skills" },
          { value: categories.length, label: "Categories" },
          { value: avgEarning, prefix: "₹", label: "Avg First Earning" },
          { value: allSkills.filter(s => s.earnersPct > 0).length, label: "With Earnings Path" }
        ]}
      />

      <Section>
        <SectionHeader
          align="left"
          label="BROWSE"
          title={<>All <span className="text-primary">Skills</span></>}
          description="Click any card to see the full breakdown, free resources, and get a 4-week AI plan."
        />
        <SkillsGrid skills={enriched} />
      </Section>

      <CTA
        title="Ready to start learning?"
        description="Take our survey to get a personalized 4-week learning pathway for any skill."
        primary={{ label: "Take Survey", href: "/survey" }}
        secondary={{ label: "Get AI Pathway", href: "/ai-hub/pathway" }}
      />
    </div>
  );
}
