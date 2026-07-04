import type { MetadataRoute } from "next";

const BASE = "https://skillverse.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/showcase",
    "/dashboard",
    "/ai-hub",
    "/ai-hub/chatbot",
    "/ai-hub/wellness",
    "/ai-hub/pathway",
    "/ai-hub/content",
    "/ai-hub/report",
    "/ai-hub/trends",
    "/ai-hub/translator",
    "/ai-hub/analyst",
    "/survey",
    "/research",
    "/research/screen-time",
    "/research/skills",
    "/research/ai-tools",
    "/research/social-media",
    "/team",
    "/about",
    "/pledge",
    "/reports",
    "/trends",
    "/submit",
    "/workspace"
  ];
  return routes.map(r => ({
    url: `${BASE}${r}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1.0 : 0.7
  }));
}
