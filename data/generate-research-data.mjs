#!/usr/bin/env node
// Generate research data: academic-style datasets
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'data', 'research');
mkdirSync(OUT, { recursive: true });

// 1. Screen time distribution by age
const screenTimeByAge = [];
for (let age = 10; age <= 22; age++) {
  const mean = 2.5 + (age - 10) * 0.3;
  const std = 1.2;
  const dist = [];
  for (let i = 0; i < 1000; i++) {
    // Box-Muller
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    dist.push(+(mean + z * std).toFixed(2));
  }
  screenTimeByAge.push({ age, mean: +mean.toFixed(2), std, distribution: dist });
}
writeFileSync(join(OUT, 'screen-time-by-age.json'), JSON.stringify(screenTimeByAge));

// 2. Platform adoption over time (monthly)
const platformAdoption = {};
['YouTube', 'Instagram', 'Discord', 'Khan Academy', 'Duolingo', 'ChatGPT'].forEach(p => {
  const series = [];
  let val = Math.random() * 30;
  for (let m = 0; m < 24; m++) {
    val = Math.max(0, val + (Math.random() - 0.3) * 8);
    series.push(+(val).toFixed(1));
  }
  platformAdoption[p] = series;
});
writeFileSync(join(OUT, 'platform-adoption-monthly.json'), JSON.stringify(platformAdoption));

// 3. Skill acquisition curves (hours to proficiency)
const skillCurves = {
  'Coding / Programming': { hours: [0, 50, 100, 200, 500, 1000, 2000], proficiency: [0, 15, 35, 60, 80, 92, 98] },
  'Video Editing': { hours: [0, 20, 50, 100, 200, 500, 1000], proficiency: [0, 25, 50, 70, 85, 95, 99] },
  'Graphic Design': { hours: [0, 30, 60, 120, 250, 500, 1500], proficiency: [0, 20, 40, 65, 82, 93, 98] },
  'Language Learning': { hours: [0, 100, 300, 600, 1200, 2400, 4800], proficiency: [0, 10, 25, 45, 65, 82, 95] },
  'Music Production': { hours: [0, 50, 150, 400, 800, 1500, 3000], proficiency: [0, 15, 30, 50, 70, 85, 95] },
  'AI Prompt Engineering': { hours: [0, 10, 25, 50, 100, 200, 500], proficiency: [0, 30, 55, 75, 88, 95, 99] },
  'Public Speaking': { hours: [0, 30, 80, 200, 500, 1000, 2000], proficiency: [0, 20, 40, 60, 78, 90, 96] },
  'Photography': { hours: [0, 30, 80, 200, 500, 1000, 2000], proficiency: [0, 25, 50, 70, 85, 95, 98] }
};
writeFileSync(join(OUT, 'skill-acquisition-curves.json'), JSON.stringify(skillCurves, null, 2));

// 4. AI tool market share
const aiMarketShare = [
  { tool: 'ChatGPT', share: 71, change: 0, color: '#10A37F' },
  { tool: 'Google Gemini', share: 24, change: 8, color: '#8E75F9' },
  { tool: 'Microsoft Copilot', share: 12, change: 4, color: '#0078D4' },
  { tool: 'Midjourney', share: 5, change: 1, color: '#8B5CF6' },
  { tool: 'GitHub Copilot', share: 8, change: 3, color: '#0F0F0F' },
  { tool: 'Claude', share: 3, change: 2, color: '#D97757' },
  { tool: 'Perplexity', share: 2, change: 1, color: '#1FB8CD' },
  { tool: 'Other', share: 4, change: 0, color: '#94A3B8' }
];
writeFileSync(join(OUT, 'ai-market-share.json'), JSON.stringify(aiMarketShare, null, 2));

// 5. Geographic heatmap (state-level data)
const geoData = [
  { state: 'Maharashtra', responses: 28, avgScreen: 5.0, topPlatform: 'YouTube', tier: 'high' },
  { state: 'Delhi', responses: 22, avgScreen: 4.9, topPlatform: 'YouTube', tier: 'high' },
  { state: 'Karnataka', responses: 16, avgScreen: 5.4, topPlatform: 'YouTube', tier: 'high' },
  { state: 'Haryana', responses: 25, avgScreen: 4.7, topPlatform: 'YouTube', tier: 'high' },
  { state: 'Telangana', responses: 12, avgScreen: 4.8, topPlatform: 'Instagram', tier: 'medium' },
  { state: 'Tamil Nadu', responses: 9, avgScreen: 4.3, topPlatform: 'YouTube', tier: 'medium' },
  { state: 'West Bengal', responses: 8, avgScreen: 4.1, topPlatform: 'YouTube', tier: 'medium' },
  { state: 'Gujarat', responses: 7, avgScreen: 4.0, topPlatform: 'YouTube', tier: 'medium' },
  { state: 'Rajasthan', responses: 6, avgScreen: 3.9, topPlatform: 'Instagram', tier: 'low' },
  { state: 'Uttar Pradesh', responses: 5, avgScreen: 3.8, topPlatform: 'YouTube', tier: 'low' },
  { state: 'Punjab', responses: 7, avgScreen: 4.6, topPlatform: 'YouTube', tier: 'medium' },
  { state: 'Kerala', responses: 4, avgScreen: 4.4, topPlatform: 'YouTube', tier: 'low' }
];
writeFileSync(join(OUT, 'geographic-distribution.json'), JSON.stringify(geoData, null, 2));

// 6. Wellness metrics
const wellness = {
  eyeStrain: { affected: 34, severity: { mild: 18, moderate: 12, severe: 4 } },
  sleepImpact: { affected: 47, avgReductionHours: 0.8 },
  anxiety: { affected: 23, triggers: ['social_comparison: 35%', 'FOMO: 28%', 'cyberbullying: 8%', 'other: 29%'] },
  posture: { affected: 41, avgSittingHours: 4.2 },
  outdoorTime: { avgMinutesPerDay: 78, target: 90, deficit: 12 },
  hydration: { avgGlassesPerDay: 4.2, target: 8, deficit: 3.8 }
};
writeFileSync(join(OUT, 'wellness-metrics.json'), JSON.stringify(wellness, null, 2));

// 7. Time-of-day usage
const timeOfDay = {
  '6-9am': 12,
  '9am-12pm': 18,
  '12-2pm': 8,
  '2-5pm': 15,
  '5-8pm': 22,
  '8-11pm': 18,
  '11pm-2am': 6,
  '2-6am': 1
};
writeFileSync(join(OUT, 'time-of-day-usage.json'), JSON.stringify(timeOfDay, null, 2));

// 8. Correlation matrix
const correlationMatrix = {
  variables: ['screen_time', 'educational_pct', 'ai_usage', 'wellness_score', 'skills_count', 'income_potential'],
  matrix: [
    [1.0, 0.45, 0.62, -0.23, 0.58, 0.41],
    [0.45, 1.0, 0.51, 0.34, 0.62, 0.48],
    [0.62, 0.51, 1.0, 0.12, 0.71, 0.65],
    [-0.23, 0.34, 0.12, 1.0, 0.18, 0.15],
    [0.58, 0.62, 0.71, 0.18, 1.0, 0.78],
    [0.41, 0.48, 0.65, 0.15, 0.78, 1.0]
  ]
};
writeFileSync(join(OUT, 'correlation-matrix.json'), JSON.stringify(correlationMatrix, null, 2));

console.log(`✅ Generated 8 research data files in ${OUT}`);
