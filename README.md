# 🌟 SkillVerse

> **Where Screens Become Skills** — AI-powered analytics platform built for **Screen2Skill 2026**.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![WCAG AA](https://img.shields.io/badge/A11y-WCAG%20AA-success)](https://www.w3.org/WAI/WCAG2AA-Conformance)

SkillVerse proves that **screen time can become skill time**. We surveyed 250+ Indian teenagers about their digital habits, then built an AI platform that turns those responses into real insights, recommendations, and 4-week learning pathways.

Built in **4 weeks** by 4 students at **Colonel's Central Academy, Gurugram**.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/UCHIHA-MADARA-ANUJ/S2S.git
cd S2S

# Install dependencies (use Node 20+)
npm install

# Set up environment (see below)
cp .env.local.example .env.local
# Add your API keys to .env.local

# Run dev server
npm run dev          # http://localhost:3000

# Build for production
npm run build

# Run production server
npm start
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Google Gemini (primary AI)
GEMINI_API_KEY=your_gemini_key_here

# Supabase (optional — falls back to in-memory)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Without keys, the app still works in **demo mode** (charts + static data, no AI generation).

---

## 🏗️ Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + custom design tokens |
| AI | Google Gemini 2.5 Flash |
| Database | Supabase (Postgres) with RLS |
| 3D | Three.js + @react-three/fiber |
| Animations | GSAP, Framer Motion, Lenis (smooth scroll) |
| Charts | Recharts |
| State | Zustand (workspace) + React hooks |
| Forms | react-hook-form + Zod |
| CSV | PapaParse |
| A11y | WCAG AA compliant — focus-visible, ARIA, reduced-motion |

---

## 📁 Project Structure

```
.
├── app/                      # Next.js App Router
│   ├── (pages)/              # All routes
│   │   ├── page.tsx          # Homepage
│   │   ├── dashboard/        # Stats dashboard
│   │   ├── skills/           # Skills library
│   │   ├── platforms/        # Platforms library
│   │   ├── insights/         # Daily AI insights feed
│   │   ├── docs/             # In-app help & FAQ
│   │   ├── survey/           # 8-step survey form
│   │   ├── workspace/        # CSV upload + AI analysis
│   │   ├── ai-hub/           # 8 AI features
│   │   ├── research/         # Research datasets
│   │   ├── showcase/         # FX component gallery
│   │   ├── team/             # About the team
│   │   ├── about/            # About SkillVerse
│   │   └── pledge/           # Pledge page
│   ├── api/                  # 15+ API routes
│   │   ├── gemini/           # AI endpoints (chat, sentiment, pathway, ...)
│   │   ├── survey/           # Submit + check (fingerprint dedup)
│   │   ├── csv-insights/     # CSV analysis
│   │   ├── compare-data/     # Compare user CSV with 250 baseline
│   │   ├── pledge/           # Pledge counter
│   │   └── perf/             # Health check
│   ├── layout.tsx            # Root layout (skip-link, ARIA)
│   ├── globals.css           # Design tokens + a11y
│   ├── sitemap.ts            # SEO sitemap
│   └── robots.ts             # SEO robots
│
├── components/
│   ├── effects/              # 23 custom FX components
│   │   ├── DotField.tsx
│   │   ├── MagicBento.tsx
│   │   ├── MagicRings.tsx
│   │   ├── SpotlightCard.tsx
│   │   ├── GlowCard.tsx
│   │   ├── Tilt3DCard.tsx
│   │   ├── StarBorder.tsx
│   │   ├── CountUp.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── TextPressure.tsx
│   │   ├── SplitText.tsx
│   │   ├── ColorBends.tsx
│   │   └── ... (23 total)
│   ├── three/                # 3D components (Three.js)
│   │   ├── HeroModel.tsx     # Loads real 3D models from /public/3d/
│   │   └── ThreeCanvas.tsx
│   ├── layout/               # Layout components
│   │   ├── Navbar.tsx        # ARIA-compliant nav
│   │   ├── MobileNav.tsx     # Bottom nav for mobile
│   │   ├── Footer.tsx
│   │   ├── PageHeader.tsx    # Shared hero pattern
│   │   ├── Section.tsx       # Shared section pattern
│   │   └── LenisProvider.tsx # Smooth scroll
│   ├── a11y/                 # Accessibility helpers
│   │   ├── LiveAnnouncer.tsx
│   │   └── WebVitalsReporter.tsx
│   └── charts/               # Chart wrappers
│
├── lib/
│   ├── gemini/               # AI client + prompts
│   ├── supabase/             # DB client
│   ├── workspace/            # CSV workspace state
│   ├── a11y/                 # A11y utilities
│   ├── design-tokens.ts      # Design tokens
│   ├── fingerprint.ts        # Device fingerprint
│   ├── security.ts           # Rate limiting
│   └── constants.ts          # Site config + enums
│
├── data/
│   ├── curated/              # Curated skills/platforms/insights
│   ├── kaggle/               # 4 research datasets
│   ├── embeddings/           # Semantic embeddings
│   └── research/             # Research artifacts
│
├── public/
│   ├── 3d/                   # 22 procedural 3D models
│   ├── audio/                # Sound effects
│   ├── datasets/             # 6 CSVs
│   ├── fonts/                # 12 fonts
│   ├── icons/                # 439 icons
│   ├── illustrations/        # 676 illustrations
│   ├── images/               # Hero images
│   ├── lottie/               # 95 Lottie animations
│   ├── research-pdfs/        # 30 research PDFs
│   └── ...
│
├── SUBMISSION_PACK/          # Final deliverables for Screen2Skill 2026
├── LOGBOOK.md                # Persistent change log
├── CHANGELOG.md              # Version history
└── replit-work/              # Local prompt pack (gitignored)
```

---

## 📜 Available Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start dev server on http://localhost:3000 |
| `npm run build` | Production build (skips lint) |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

---

## 🤖 AI Features (8 total)

| Feature | Description | Endpoint |
| --- | --- | --- |
| **SkillBot** | Conversational AI learning companion | `/api/gemini/chat` |
| **Wellness Analyzer** | Digital wellness score from text | `/api/gemini/sentiment` |
| **Skill Pathway** | 4-week personalized learning plan | `/api/gemini/pathway` |
| **Content Scorer** | Rate any platform for educational value | `/api/gemini/content` |
| **Report Writer** | AI-generated research reports | `/api/gemini/report` |
| **Trend Predictor** | Predict rising digital learning trends | `/api/gemini/trend` |
| **Translator** | Translate insights to 8+ languages | `/api/gemini/translate` |
| **Data Analyst** | AI pattern detection in survey data | `/api/gemini/analyze` |
| **Daily Insights** | 5 fresh AI insights every 24h | `/api/insights` |
| **CSV Insights** | Analyze any uploaded CSV | `/api/csv-insights` |
| **Compare Data** | Compare user CSV with 250 baseline | `/api/compare-data` |

---

## 🎨 Design System

SkillVerse has a custom design system. Use these consistently:

```ts
import { SECTION_CLASS, CONTAINER_CLASS, CARD_CLASS } from "@/lib/design-tokens";

<section className={SECTION_CLASS}>
  <div className={CONTAINER_CLASS}>
    <div className={CARD_CLASS}>...</div>
  </div>
</section>
```

**Shared components** for consistency:
- `<PageHeader>` — Standardized hero with label + TextPressure title + SplitText subtitle + KPIs
- `<Section>` — Standardized section padding
- `<SectionHeader>` — Standardized section title
- `<CTA>` — Standardized call-to-action block

**Color palette** (defined in `tailwind.config.ts`):
- `primary` `#FF3D2E` (red-orange)
- `secondary` `#FFA800` (orange)
- `accent` `#00E1FF` (cyan)
- `success` `#10B981` (green)
- `warning` `#F59E0B` (amber)
- `error` `#EF4444` (red)

---

## ♿ Accessibility (WCAG AA)

SkillVerse is **WCAG AA compliant**:

- ✅ **Skip-to-main link** for keyboard users
- ✅ **Visible focus indicators** (`focus-visible` rings)
- ✅ **ARIA landmarks** (`<header>`, `<main>`, `<nav>`, `<footer>`)
- ✅ **ARIA labels** on all icon-only buttons
- ✅ **Touch targets ≥ 44×44px** on mobile
- ✅ **Reduced motion** support (`@media (prefers-reduced-motion: reduce)`)
- ✅ **High contrast** support (`@media (prefers-contrast: more)`)
- ✅ **Screen reader live regions** for AI responses
- ✅ **Keyboard accessible** drag-drop file upload

---

## 📱 Mobile Responsive

- **Bottom nav** on screens < 1024px (5 main routes)
- **Top nav** on screens ≥ 1024px (8 routes)
- **Responsive FX** — MagicRings shrinks on mobile, TextPressure scales, FX components adapt
- **Touch targets** ≥ 44px on all interactive elements
- **Tested** at 320 / 375 / 414 / 768 / 1024 / 1280 / 1920px

---

## ⚡ Performance

- **Lighthouse 90+** on Performance, Accessibility, Best Practices, SEO
- **Code splitting** — heavy 3D + Lottie components lazy-loaded
- **Image optimization** — WebP, srcset, lazy loading
- **Web Vitals reporter** — monitors LCP/FID/CLS in production
- **Bundle analyzer** — see `rollup-plugin-visualizer` output

**Bundle sizes** (gzipped, top 3):
- Main shared: 87.5 KB
- Workspace page: 234 KB (drag-drop + recharts)
- 3D models: lazy-loaded

---

## 🤝 Contributing

This is a school project built for **Screen2Skill 2026** competition. We may accept improvements after the competition. For now:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📋 Team

| Member | Role |
| --- | --- |
| **Anuj Phulera** | Team Lead & Lead Developer |
| **Aarav Choudhary** | Ideator & Strategy |
| **Dhun** | Presenter |
| **Preksha** | Presenter |

**Faculty In-Charge:** Shammin Ma'am

**School:** Colonel's Central Academy, Gurugram, India

---

## 🏆 Competition

**Screen2Skill 2026 — Techbuzz**
Theme: *"From Screens to Skills — Online & Optimistic"*

---

## 📄 License

MIT — see [LICENSE](LICENSE) for full text.

---

## 🙏 Acknowledgments

- **Google Gemini 2.5 Flash** — primary AI
- **Gemini only** — single AI provider (no fallback needed)
- **Supabase** — Postgres + Auth
- **Vercel** — hosting (recommended)
- **Colonel's Central Academy** — for believing in us
- **Shammin Ma'am** — for the support

---

**Made with ❤️ in Gurugram, India**
