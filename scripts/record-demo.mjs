// Playwright automation that records a full Screen2Skill 2026 demo video
// following the SCRIPT.md cues. Outputs:
//   - demo-raw.webm   (raw recording from Playwright)
//   - demo-final.mp4  (post-processed, ready to use)
//
// Usage:
//   1) Make sure `next start -p 3050` is running
//   2) node scripts/record-demo.mjs
//   3) Add your voiceover in post (iMovie, DaVinci, CapCut, etc.)

import { chromium } from "playwright";
import { spawn } from "child_process";
import { existsSync, mkdirSync, statSync } from "fs";
import { join } from "path";

const BASE = "http://localhost:3050";
const OUT_DIR = "video";
const RAW = join(OUT_DIR, "demo-raw.webm");
const FINAL = join(OUT_DIR, "demo-final.mp4");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);

const W = 1920;
const H = 1080;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Smooth scroll to an element, with a brief pause for the judges to read.
async function slowScrollTo(page, selector, opts = {}) {
  const el = await page.locator(selector).first();
  await el.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
  await sleep(opts.pause ?? 1200);
}

async function run() {
  console.log("▶ launching headless browser…");
  const browser = await chromium.launch({
    headless: true,
    args: [`--window-size=${W},${H}`, "--no-sandbox", "--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: OUT_DIR + "/",
      size: { width: W, height: H },
    },
    // 30fps capture, 4Mbps — good balance for YouTube
    recordVideoSize: { width: W, height: H },
  });

  // Pre-seed localStorage so the cinematic intro doesn't play
  // (we want to open directly on the hero for the demo)
  await context.addInitScript(() => {
    try { localStorage.setItem("sv:intro:completed", "1"); } catch {}
  });

  const page = await context.newPage();
  // Make sure the recorded video is the right size
  await page.setViewportSize({ width: W, height: H });

  // Find the video file Playwright is recording into
  const video = page.video();
  console.log("🎥 recording started");

  // ============================================================
  // CUE 1: TITLE CARD / HOMEPAGE HERO (0:00 - 0:15)
  // ============================================================
  console.log("CUE 1 — homepage hero");
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(3500); // let the 3D scene + particles load

  // Click "EXPLORE DASHBOARD" briefly to show it's interactive, then come back
  // Actually no — just hold on the hero for the judges to look
  await sleep(3000);

  // ============================================================
  // CUE 2: PREKSHA TALKS (0:15 - 0:50)
  // (no on-screen changes; we just hold the hero)
  // ============================================================
  console.log("CUE 2 — hero hold for Preksha's intro");
  await sleep(35000);

  // ============================================================
  // CUE 3: SCROLL TO STATS + MISSION (0:50 - 1:20)
  // ============================================================
  console.log("CUE 3 — scroll to stats");
  await page.evaluate(() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" }));
  await sleep(2500);
  await page.evaluate(() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" }));
  await sleep(2500);
  // Scroll a little more to the mission
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
  await sleep(3000);
  // Keep showing the 73% / 41% / 68% for judges
  await page.evaluate(() => window.scrollBy({ top: 200, behavior: "smooth" }));
  await sleep(22000);

  // ============================================================
  // CUE 4: SCROLL TO FEATURED SKILLS & PLATFORMS (1:20 - 1:45)
  // ============================================================
  console.log("CUE 4 — featured skills & platforms");
  await page.evaluate(() => {
    const el = document.querySelector('[data-section="skills-platforms"]') ||
               Array.from(document.querySelectorAll("h2, h3")).find(h => /skill|platform/i.test(h.textContent || ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    else window.scrollBy({ top: window.innerHeight * 1.2, behavior: "smooth" });
  });
  await sleep(4000);
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: "smooth" }));
  await sleep(18000);

  // ============================================================
  // CUE 5: DASHBOARD (1:45 - 2:30)
  // ============================================================
  console.log("CUE 5 — dashboard");
  await page.goto(BASE + "/dashboard", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(3000);
  // Let the charts settle, hover on a pie slice briefly
  try {
    const slice = await page.locator("svg .recharts-pie-sector").first();
    await slice.hover();
    await sleep(2500);
  } catch {}
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
  await sleep(35000);

  // ============================================================
  // CUE 6: AI HUB LANDING (2:30 - 2:55)
  // ============================================================
  console.log("CUE 6 — AI hub landing");
  await page.goto(BASE + "/ai-hub", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(4000);
  // Slowly scroll through the 8 cards
  await page.evaluate(() => window.scrollBy({ top: 250, behavior: "smooth" }));
  await sleep(18000);

  // ============================================================
  // CUE 7: SKILLBOT CHAT (2:55 - 3:20)
  // ============================================================
  console.log("CUE 7 — SkillBot");
  await page.goto(BASE + "/ai-hub/chatbot", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(3000);
  try {
    const ta = await page.locator("textarea, input[type='text']").first();
    await ta.click();
    await ta.fill("I want to learn video editing in 30 days. I am a beginner. What should I do?");
    await sleep(1500);
    // Find and click the send button (best effort)
    const send = await page.locator("button:has(svg), button[type='submit']").filter({ hasText: "" }).last();
    await send.click({ timeout: 3000 }).catch(() => {});
    await sleep(2000);
  } catch (e) {
    console.log("   (chat input not found, just holding)");
  }
  // Wait for Gemini to respond
  await sleep(22000);

  // ============================================================
  // CUE 8: SKILL PATHWAY (3:20 - 3:50)
  // ============================================================
  console.log("CUE 8 — skill pathway");
  await page.goto(BASE + "/ai-hub/pathway", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(3000);
  try {
    // Best-effort: fill the form. Different fields have different names.
    const inputs = await page.locator("input[type='text'], textarea").all();
    if (inputs.length > 0) {
      await inputs[0].fill("Graphic Design");
      await sleep(500);
    }
    // Click "Beginner" or similar button
    const beginner = await page.locator("button:has-text('Beginner')").first();
    await beginner.click({ timeout: 2000 }).catch(() => {});
    await sleep(1500);
    const generate = await page.locator("button:has-text('Generate')").first();
    await generate.click({ timeout: 2000 }).catch(() => {});
    await sleep(3000);
  } catch (e) {
    console.log("   (pathway form not auto-fillable, holding)");
  }
  await sleep(27000);

  // ============================================================
  // CUE 9: RESEARCH (3:50 - 4:15)
  // ============================================================
  console.log("CUE 9 — research");
  await page.goto(BASE + "/research", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(3000);
  await page.goto(BASE + "/research/screen-time", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(3000);
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
  await sleep(22000);

  // ============================================================
  // CUE 10: WORKSPACE (4:15 - 4:45)
  // ============================================================
  console.log("CUE 10 — workspace");
  await page.goto(BASE + "/workspace", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(3000);
  try {
    const sample = await page.locator("button:has-text('Student')").first();
    await sample.click({ timeout: 2000 }).catch(() => {});
    await sleep(2500);
    const insights = await page.locator("button:has-text('Insights')").first();
    await insights.click({ timeout: 2000 }).catch(() => {});
    await sleep(3000);
  } catch (e) {
    console.log("   (workspace buttons not auto-clickable, holding)");
  }
  await sleep(22000);

  // ============================================================
  // CUE 11: DAILY INSIGHTS (4:45 - 5:05)
  // ============================================================
  console.log("CUE 11 — daily insights");
  await page.goto(BASE + "/insights", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(3500);
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: "smooth" }));
  await sleep(17000);

  // ============================================================
  // CUE 12: PLEDGE (5:05 - 5:30)
  // ============================================================
  console.log("CUE 12 — pledge");
  await page.goto(BASE + "/pledge", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(4000);
  await page.evaluate(() => window.scrollBy({ top: 200, behavior: "smooth" }));
  await sleep(20000);

  // ============================================================
  // CUE 13: END CARD (5:30)
  // ============================================================
  console.log("CUE 13 — end card on homepage");
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(4000);
  // Final hold for the bow
  await sleep(4000);

  console.log("✔ recording complete");
  await context.close();
  await browser.close();

  // Playwright saves the video as a uuid.webm inside OUT_DIR; find it.
  const fs = await import("fs/promises");
  const files = await fs.readdir(OUT_DIR);
  const rawWebm = files.find((f) => f.endsWith(".webm"));
  if (!rawWebm) {
    console.error("✘ no webm found in", OUT_DIR);
    process.exit(1);
  }
  const rawPath = join(OUT_DIR, rawWebm);
  const finalPath = join(OUT_DIR, "demo-raw.webm");
  await fs.rename(rawPath, finalPath);
  const size = (statSync(finalPath).size / 1024 / 1024).toFixed(1);
  console.log(`📦 raw recording: ${finalPath} (${size} MB)`);
  console.log("Run `bash scripts/post-process.sh` to convert to mp4 with cinematic bars + zoom.");
}

run().catch((e) => {
  console.error("✘ failed:", e);
  process.exit(1);
});
