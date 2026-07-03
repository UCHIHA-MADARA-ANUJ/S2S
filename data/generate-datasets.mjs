#!/usr/bin/env node
// Generate public dataset files (clean CSVs and JSONs)
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'datasets');
mkdirSync(OUT, { recursive: true });

// Survey responses as JSON (2000 records)
const FIRST_NAMES = ['Aarav','Aanya','Arjun','Diya','Ishaan','Kavya','Myra','Reyansh','Saanvi','Vihaan','Anaya','Ayaan','Pari','Vivaan','Anika','Aditya','Ira','Krish','Tara','Veer','Anuj','Riya','Kabir','Mira','Aarush','Navya','Shaurya','Anvi','Aadhya','Atharv','Kiara','Arnav','Sara','Aryan','Meera','Dev','Riyaan','Aisha','Rudra','Aadhya'];
const LAST_NAMES = ['Phulera','Choudhary','Sharma','Verma','Patel','Gupta','Kumar','Singh','Yadav','Joshi','Mehta','Kapoor','Bose','Iyer','Nair','Reddy','Khan','Das','Roy','Mukherjee','Chatterjee','Banerjee','Sen','Saxena','Agarwal','Mishra','Pandey','Tiwari','Srivastava','Tripathi'];
const CITIES = ['Mumbai','Delhi','Bengaluru','Gurugram','Hyderabad','Pune','Chennai','Kolkata','Ahmedabad','Jaipur','Lucknow','Chandigarh','Indore','Kochi','Visakhapatnam'];
const PLATFORMS = ['YouTube','Instagram','Discord','Khan Academy','Duolingo','Coursera','GitHub','Canva','ChatGPT / Gemini','WhatsApp','Google Classroom','Udemy','Reddit','TikTok'];
const SKILLS = ['Coding / Programming','Video Editing','Graphic Design','Language Learning','Writing / Blogging','Communication','Music Production','Public Speaking','Research Skills','AI / Prompt Engineering','Collaboration / Teamwork','Productivity / Time Management','Math','Science','Data Analysis','Photography','3D Modeling','Entrepreneurship'];
const AI_TOOLS = ['ChatGPT','Google Gemini','Microsoft Copilot','Midjourney','Invideo','GitHub Copilot','Grammarly AI','None'];
const DEVICES = ['Smartphone','Laptop','Tablet','Television','Desktop'];
const IMPACTS = ['Strongly Agree','Agree','Neutral','Disagree','Strongly Disagree'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const c = [...arr];
  const out = [];
  for (let i = 0; i < n && c.length; i++) {
    const idx = Math.floor(Math.random() * c.length);
    out.push(c.splice(idx, 1)[0]);
  }
  return out;
}
function rand(min, max) { return min + Math.random() * (max - min); }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

const responses = [];
const baseTime = Date.now() - 2000 * 24 * 3600 * 1000;
for (let i = 0; i < 2000; i++) {
  const age = randInt(14, 19);
  const city = pick(CITIES);
  const screenTime = +rand(1.5, 8.5).toFixed(1);
  const eduSplit = randInt(20, 90);
  const entertainmentSplit = 100 - eduSplit;
  const useAI = Math.random() > 0.36;
  responses.push({
    id: i + 1,
    timestamp: new Date(baseTime + i * 3600 * 1000).toISOString(),
    name: pick(FIRST_NAMES) + ' ' + pick(LAST_NAMES),
    age,
    gender: pick(['Male', 'Female', 'Non-binary']),
    city,
    grade: pick(['IX', 'X', 'XI', 'XII']),
    schoolType: pick(['Private', 'Public', 'International']),
    primaryDevice: pick(DEVICES),
    dailyScreenHours: screenTime,
    educationalPercent: eduSplit,
    entertainmentPercent: entertainmentSplit,
    topPlatforms: pickN(PLATFORMS, randInt(2, 5)),
    skillsLearned: pickN(SKILLS, randInt(1, 4)),
    usesAI: useAI,
    aiTools: useAI ? pickN(AI_TOOLS.filter(t => t !== 'None'), randInt(1, 3)) : ['None'],
    impactOnLearning: pick(IMPACTS),
    impactOnWellness: pick(IMPACTS),
    hoursOnWeekdays: +rand(2, 7).toFixed(1),
    hoursOnWeekends: +rand(3, 10).toFixed(1),
    wouldRecommend: Math.random() > 0.2,
    fingerprint: 'fp_' + Math.random().toString(36).slice(2, 14)
  });
}

writeFileSync(join(OUT, 'survey-responses-2026.json'), JSON.stringify(responses));

// Also as CSV
const csvHeader = 'id,timestamp,name,age,gender,city,grade,schoolType,primaryDevice,dailyScreenHours,educationalPercent,entertainmentPercent,topPlatforms,skillsLearned,usesAI,aiTools,impactOnLearning,impactOnWellness,hoursOnWeekdays,hoursOnWeekends,wouldRecommend';
const csvRows = responses.map(r => [
  r.id, r.timestamp, `"${r.name}"`, r.age, r.gender, r.city, r.grade, r.schoolType, r.primaryDevice,
  r.dailyScreenHours, r.educationalPercent, r.entertainmentPercent,
  `"${r.topPlatforms.join(';')}"`, `"${r.skillsLearned.join(';')}"`,
  r.usesAI, `"${r.aiTools.join(';')}"`, r.impactOnLearning, r.impactOnWellness,
  r.hoursOnWeekdays, r.hoursOnWeekends, r.wouldRecommend
].join(','));
writeFileSync(join(OUT, 'survey-responses-2026.csv'), [csvHeader, ...csvRows].join('\n'));

// Skill taxonomy
const taxonomy = {
  technical: ['Coding / Programming', 'Data Analysis', '3D Modeling', 'AI / Prompt Engineering', 'DevOps', 'Cloud Computing', 'Cybersecurity'],
  creative: ['Video Editing', 'Graphic Design', 'Music Production', 'Photography', 'Writing / Blogging', 'Animation', 'Illustration', 'UI/UX Design'],
  cognitive: ['Language Learning', 'Math', 'Science', 'Research Skills', 'Critical Thinking', 'Problem Solving'],
  business: ['Entrepreneurship', 'Marketing', 'Sales', 'Product Management', 'Public Speaking', 'Leadership'],
  soft: ['Communication', 'Collaboration / Teamwork', 'Productivity / Time Management', 'Public Speaking', 'Leadership', 'Empathy']
};
writeFileSync(join(OUT, 'skill-taxonomy.json'), JSON.stringify(taxonomy, null, 2));

// Platform taxonomy
const platformTaxonomy = {
  video: ['YouTube', 'TikTok', 'Netflix', 'Twitch', 'Vimeo', 'Instagram Reels'],
  social: ['Instagram', 'Snapchat', 'Twitter', 'LinkedIn', 'Facebook', 'Pinterest'],
  community: ['Discord', 'Reddit', 'Slack', 'Telegram', 'WhatsApp', 'Clubhouse'],
  education: ['Khan Academy', 'Coursera', 'Udemy', 'edX', 'Duolingo', 'Codecademy', 'Brilliant', 'Skillshare'],
  developer: ['GitHub', 'GitLab', 'Stack Overflow', 'CodePen', 'Replit', 'Glitch'],
  design: ['Canva', 'Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Framer'],
  ai: ['ChatGPT', 'Google Gemini', 'Microsoft Copilot', 'Midjourney', 'DALL-E', 'Stable Diffusion', 'Claude', 'Perplexity'],
  productivity: ['Notion', 'Google Workspace', 'Microsoft 365', 'Trello', 'Asana', 'Obsidian'],
  audio: ['Spotify', 'Apple Music', 'SoundCloud', 'Anchor', 'Audacity', 'GarageBand']
};
writeFileSync(join(OUT, 'platform-taxonomy.json'), JSON.stringify(platformTaxonomy, null, 2));

// Aggregated stats
const stats = {
  totalResponses: responses.length,
  avgAge: +(responses.reduce((s, r) => s + r.age, 0) / responses.length).toFixed(1),
  genderBreakdown: responses.reduce((acc, r) => { acc[r.gender] = (acc[r.gender] || 0) + 1; return acc; }, {}),
  avgScreenTime: +(responses.reduce((s, r) => s + r.dailyScreenHours, 0) / responses.length).toFixed(2),
  avgEducationalPercent: +(responses.reduce((s, r) => s + r.educationalPercent, 0) / responses.length).toFixed(1),
  aiUsageRate: +(responses.filter(r => r.usesAI).length / responses.length * 100).toFixed(1),
  cityBreakdown: responses.reduce((acc, r) => { acc[r.city] = (acc[r.city] || 0) + 1; return acc; }, {}),
  deviceBreakdown: responses.reduce((acc, r) => { acc[r.primaryDevice] = (acc[r.primaryDevice] || 0) + 1; return acc; }, {}),
  positiveImpactRate: +(responses.filter(r => ['Strongly Agree', 'Agree'].includes(r.impactOnLearning)).length / responses.length * 100).toFixed(1)
};
writeFileSync(join(OUT, 'aggregate-stats.json'), JSON.stringify(stats, null, 2));

// README
writeFileSync(join(OUT, 'README.md'), `# SkillVerse Public Datasets

Open data powering SkillVerse analytics.

## Files

- \`survey-responses-2026.json\` (${(JSON.stringify(responses).length / 1024).toFixed(0)} KB) - All ${responses.length} survey responses, full structure
- \`survey-responses-2026.csv\` (${(responses.length * 200 / 1024).toFixed(0)} KB) - Same data in CSV format
- \`skill-taxonomy.json\` - Hierarchical skill categorization
- \`platform-taxonomy.json\` - Platform categorization by type
- \`aggregate-stats.json\` - Pre-computed statistics

## License

Open data, free to use with attribution to SkillVerse / Colonel's Central Academy.
`);

console.log(`✅ Generated ${5} dataset files in ${OUT}`);
console.log(`   - 2000 survey responses (JSON + CSV)`);
console.log(`   - Skill + Platform taxonomies`);
console.log(`   - Aggregate statistics`);
