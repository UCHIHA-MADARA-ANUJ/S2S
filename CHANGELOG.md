# Changelog

All notable changes to SkillVerse are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [9.5.0] - 2026-07-03 - "Final Release"

### Added
- **Prompt 25**: Daily AI Insights feed (`/insights`) with 5 cards + share/copy
- **Prompt 26**: In-app Documentation page (`/docs`) with search + 10 sections
- **Prompt 27**: 3D Hero Scene with mouse-parallax + 22 procedural models
- **Prompt 28**: Device fingerprinting for survey dedup
- **Prompt 29**: Design tokens + shared `PageHeader`/`Section`/`CTA` components
- **Prompt 30**: Comprehensive README + CHANGELOG

### Changed
- Refactored `/skills` and `/platforms` to use shared `PageHeader` + `Section` + `CTA` components
- MagicBento children type changed to `React.ReactNode` (was `React.ReactNode[]`)
- MagicRings now responsive (shrinks on mobile)

## [9.4.0] - 2026-07-03 - "Accessibility + Mobile + Performance"

### Added
- **Prompt 21**: WCAG AA compliance (skip-link, ARIA, focus-visible, reduced-motion)
- **Prompt 22**: Mobile bottom nav (5 routes) + responsive MagicRings + responsive MagicBento heights
- **Prompt 23**: Performance audit — Web Vitals reporter, image optimization, bundle analyzer

### Changed
- Navbar now has proper `header`/`nav` semantics, `aria-current`, mobile menu uses `role=dialog`
- Footer now has `nav` semantics and `aria-label`
- Layout includes `LiveAnnouncer` + `WebVitalsReporter`
- All buttons have `min-height: 44px` for touch targets

## [9.3.0] - 2026-07-03 - "Static Pages + Workspace"

### Added
- **Prompt 11**: Static content pages enhanced (not-found, error, team, about, pledge)
- **Prompt 12**: `/workspace` page — drag-drop CSV → auto-charts → AI insights → export
- **Prompt 13**: `/api/compare-data` endpoint (compare user CSV with 250 baseline)
- **Prompt 14**: Dataset expansion — 2000+ records across 4 research datasets
- **Prompt 15**: 1,500+ assets (icons, illustrations, lottie, 3D, fonts, etc.)
- **Prompt 16**: Loading animations (`app/loading.tsx` with premium spinner)
- **Prompt 17**: Custom cursor
- **Prompt 18**: Smooth scroll (Lenis) + sticky navbar with backdrop blur
- **Prompt 19**: Toast notifications (Sonner) + page polish
- **Prompt 20**: SEO — sitemap + robots.txt

## [9.2.0] - 2026-07-03 - "Premium Homepage"

### Added
- **Prompt 04**: Premium homepage hero (DotField + TextPressure + MagicRings + StarBorder + SplitText + CountUp)
- **Prompt 05**: Verified showcase page (22 FX components)
- **Prompt 06**: FX site-wide — DotField on all 8 AI Hub pages
- **Prompt 07**: Dashboard with real data (SpotlightCard + CountUp on KPIs)
- **Prompt 08**: 8-step survey form (verified, has framer-motion + toast + submit)
- **Prompt 09**: AI Hub pages (DotField backgrounds)
- **Prompt 10**: Research pages (FX imports added)

## [9.1.0] - 2026-07-03 - "Initial Setup"

### Added
- 24 pages across 5 categories
- 11 API routes (Gemini + survey + pledge + compare)
- 23 custom FX components
- 4 research datasets (5K + 3K + 2K + 1K records)
- Supabase schema for `survey_responses` with fingerprint dedup
- 22 procedural 3D models
- 6 curated JSON datasets (skills, platforms, achievements, etc.)

## [9.0.0] - 2026-06-01 - "Genesis"

- Initial Next.js + TypeScript + Tailwind setup
- 4-person team formed at Colonel's Central Academy
- Submitted intent for Screen2Skill 2026

## [9.6.0] - 2026-07-03 - "Final Polish + UX"

### Added
- **Prompt 31**: FAQ Accordion with AI-powered "Ask a question" via Gemini + related FAQ suggestions
- **Prompt 32**: Settings page (`/settings`) with JSON/CSV export, JSON import, data delete, theme/notif/reduce-motion prefs
- **Prompt 33**: ShareButton component with Web Share API + 4 social targets (Twitter/LinkedIn/WhatsApp/Facebook) + email + copy link
- **Prompt 34**: Achievement system (6 achievements) with confetti celebration + `CelebrationOverlay` + `/achievements` page
- **Prompt 35**: Command palette (Cmd+K) + Keyboard shortcuts (g+letter for nav, ? for help) + `ShortcutsModal`
- **Prompt 36**: Animated EmptyState component (4 variants: data/search/ai/success) + pre-built `NoDataEmpty`, `NoSearchResults`, `NoAIFeaturesUsed`, `NoCSVUploaded`
- **Prompt 37**: Voice input via Web Speech API (Chrome/Safari) with pulse animation, transcript, errors
- **Prompt 38**: `scripts/test-all.sh` — 46-check smoke test
- **Prompt 39**: ErrorBoundary + retry.ts (exponential backoff + fetchWithRetry with timeout)
- **Prompt 40**: Final LOGBOOK + CHANGELOG update + test script

### Changed
- Survey submit now tracks achievement (`submittedSurvey`)
- Pledge submit now tracks achievement (`signedPledge`)
- Workspace CSV upload now tracks achievement (`csvUploaded`)
- All 8 AI Hub pages now track feature usage for AI Explorer achievement
- Footer + MobileNav updated with new pages (Settings, Achievements)
- Layout now includes `PowerUserFeatures` + `CelebrationOverlay` + `ErrorBoundary`
- Survey thank-you page now has Share button

### API
- `GET/DELETE /api/me` — get/delete user data by fingerprint
- `POST /api/faq/ask` — Gemini-powered FAQ Q&A with related suggestions

## Stats
- **34 pages** (30 routes + 8 AI subroutes + 2 dynamic params)
- **18+ API routes**
- **35+ custom components** (effects, layout, ui, a11y, three, dashboard, animations)
- **3 sample data sources** (curated + kaggle + research)
- **1500+ assets** in /public
- **WCAG AA accessible**
- **6 achievement tiers** (Bronze/Silver/Gold)
- **17 keyboard shortcuts**
