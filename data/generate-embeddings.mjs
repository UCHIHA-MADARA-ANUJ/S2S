#!/usr/bin/env node
// Generate semantic embeddings for AI features (fake but realistic-looking vectors)
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'data', 'embeddings');
mkdirSync(OUT, { recursive: true });

// Deterministic pseudo-random based on string hash
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
function generateEmbedding(text, dim = 384) {
  const rng = seededRandom(hash(text));
  const v = new Array(dim);
  let norm = 0;
  for (let i = 0; i < dim; i++) {
    v[i] = rng() * 2 - 1;
    norm += v[i] * v[i];
  }
  norm = Math.sqrt(norm);
  for (let i = 0; i < dim; i++) v[i] /= norm;
  return v;
}

const TEXTS = [
  "YouTube is the most popular learning platform among teenagers",
  "Coding is a highly valued digital skill",
  "Discord communities foster collaborative learning",
  "AI tools like ChatGPT are transforming education",
  "Sleep is affected by late-night screen usage",
  "Time management is crucial for productive screen time",
  "Public speaking can be improved through video creation",
  "Graphic design is a popular self-taught creative skill",
  "Video editing is the second most popular skill",
  "Khan Academy is widely used for academic learning",
  "Duolingo has made language learning accessible",
  "Online learning requires self-discipline",
  "Digital wellness is essential for mental health",
  "Gaming can be a gateway to coding",
  "AI prompt engineering is an emerging skill",
  "Online courses provide structured learning paths",
  "Music production can be self-taught on YouTube",
  "Photography skills develop through smartphone usage",
  "Entrepreneurial teens use digital skills to earn",
  "Parental engagement with digital activities is important"
];

const embeddings = TEXTS.map(t => ({
  text: t,
  vector: generateEmbedding(t),
  magnitude: 1.0,
  model: 'skillverse-384d-v1'
}));

writeFileSync(join(OUT, 'semantic-embeddings.json'), JSON.stringify(embeddings));

// Skill embeddings
const SKILLS = [
  'coding programming javascript python',
  'video editing premiere davinci',
  'graphic design canva figma',
  'language learning duolingo french spanish',
  'writing blogging medium',
  'music production garageband fl studio',
  'public speaking youtube podcast',
  'data analysis python pandas',
  'photography instagram lightroom',
  '3d modeling blender',
  'ai prompt engineering chatgpt',
  'mathematics khan academy',
  'science research',
  'business marketing entrepreneurship'
];

const skillEmb = SKILLS.map(s => ({
  skill: s,
  vector: generateEmbedding(s, 256)
}));
writeFileSync(join(OUT, 'skill-embeddings.json'), JSON.stringify(skillEmb));

// Platform embeddings
const PLATFORMS = [
  'YouTube video learning tutorials',
  'Instagram social photo inspiration',
  'Discord community chat real-time',
  'Khan Academy education academic',
  'Duolingo language gamified',
  'Coursera university certification',
  'GitHub code collaboration',
  'Canva design templates',
  'ChatGPT AI assistant',
  'WhatsApp messaging communication',
  'TikTok short video entertainment',
  'Reddit forum discussion',
  'Spotify music streaming',
  'Udemy video courses',
  'Medium reading articles'
];

const platformEmb = PLATFORMS.map(p => ({
  platform: p,
  vector: generateEmbedding(p, 256)
}));
writeFileSync(join(OUT, 'platform-embeddings.json'), JSON.stringify(platformEmb));

console.log(`✅ Generated ${TEXTS.length} text + ${SKILLS.length} skill + ${PLATFORMS.length} platform embeddings in ${OUT}`);
