// Generate MASSIVE realistic datasets for analytics
// Outputs 5 huge CSVs totaling ~2GB with millions of rows
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'kaggle');
mkdirSync(outDir, { recursive: true });

// Deterministic PRNG for reproducibility
let seed = 12345;
function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function gauss(mean, stdev) {
  // Box-Muller
  const u = 1 - rand(); const v = rand();
  return mean + stdev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const COUNTRIES = ['India', 'USA', 'UK', 'Brazil', 'Japan', 'Germany', 'Australia', 'Canada', 'Singapore', 'UAE', 'South Africa', 'Mexico', 'France', 'South Korea', 'Indonesia'];
const CITIES = ['Gurugram', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'New York', 'London', 'Tokyo', 'Berlin', 'Sydney', 'Toronto', 'Singapore', 'Dubai', 'Cape Town', 'Seoul', 'Paris', 'Jakarta'];
const GRADES = ['8th', '9th', '10th', '11th', '12th', 'Undergrad'];
const DEVICES = ['Smartphone', 'Laptop', 'Tablet', 'Desktop', 'TV'];
const PLATFORMS = ['YouTube', 'Instagram', 'TikTok', 'Discord', 'Reddit', 'Roblox', 'Minecraft', 'Khan Academy', 'Coursera', 'Udemy', 'Duolingo', 'GitHub', 'Stack Overflow', 'Twitch', 'Snapchat', 'WhatsApp', 'Telegram'];
const SKILLS = ['Coding/Programming', 'Video Editing', 'Graphic Design', 'Photography', 'Music Production', 'Digital Art', 'Creative Writing', 'Public Speaking', 'Math', 'Science', 'Languages', 'Cooking', 'Gaming Strategy', 'Animation', '3D Modeling', 'Marketing', 'Financial Literacy', 'AI/ML', 'Web Development'];
const AI_TOOLS = ['ChatGPT', 'Gemini', 'Claude', 'Copilot', 'Perplexity', 'Midjourney', 'Grammarly', 'Notion AI', 'Canva AI'];
const PURPOSES = ['Learning', 'Entertainment', 'Socializing', 'Gaming', 'Creating'];
const HELPFULNESS = ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'];
const IMPACT = ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'];

console.log('Generating 1: global_screen_time_full.csv (5M rows, ~700MB)...');
{
  const stream = [];
  const CHUNK = 500_000;
  const TOTAL = 5_000_000;
  const f = join(outDir, 'global_screen_time_full.csv');
  const fs = await import('fs');
  const ws = fs.createWriteStream(f);
  ws.write('response_id,country,city,age,grade,gender,device,daily_screen_hours,learning_pct,entertainment_pct,socializing_pct,creative_pct,other_pct,primary_platform,top_skill,used_ai,positive_impact,satisfaction_score,submitted_at\n');
  let id = 1;
  for (let i = 0; i < TOTAL; i++) {
    const country = pick(COUNTRIES);
    const city = country === 'India' ? pick(CITIES.slice(0, 8)) : pick(CITIES);
    const age = randInt(13, 22);
    const grade = pick(GRADES);
    const gender = pick(['Male', 'Female', 'Non-binary', 'Prefer not to say']);
    const device = pick(DEVICES);
    const hours = Math.max(0.5, gauss(3.8, 1.8)).toFixed(1);
    const learn = randInt(10, 60);
    const ent = randInt(10, 60);
    const soc = randInt(5, 40);
    const cre = randInt(0, 20);
    const oth = Math.max(0, 100 - learn - ent - soc - cre);
    const platform = pick(PLATFORMS);
    const skill = pick(SKILLS);
    const usedAi = rand() < 0.7 ? 'Yes' : 'No';
    const impact = pick(IMPACT);
    const sat = randInt(1, 10);
    const day = randInt(1, 28); const mo = randInt(1, 12); const yr = 2025 + (rand() < 0.1 ? 1 : 0);
    ws.write(`${id++},${country},${city},${age},${grade},${gender},${device},${hours},${learn},${ent},${soc},${cre},${oth},${platform},${skill},${usedAi},${impact},${sat},${yr}-${String(mo).padStart(2,'0')}-${String(day).padStart(2,'0')}\n`);
    if (i % 500_000 === 0 && i > 0) console.log(`  ...${i.toLocaleString()} rows`);
  }
  ws.end();
  await new Promise(r => ws.on('finish', r));
  console.log(`  done: ${(TOTAL).toLocaleString()} rows`);
}

console.log('Generating 2: skill_acquisition_full.csv (3M rows, ~450MB)...');
{
  const f = join(outDir, 'skill_acquisition_full.csv');
  const fs = await import('fs');
  const ws = fs.createWriteStream(f);
  ws.write('learner_id,platform,skill,weeks_practiced,hours_per_week,proficiency_1to10,project_built,monetized,country,started_at,completed_at\n');
  const TOTAL = 3_000_000;
  for (let i = 0; i < TOTAL; i++) {
    const platform = pick(PLATFORMS);
    const skill = pick(SKILLS);
    const weeks = randInt(1, 104);
    const hrs = (rand() * 20).toFixed(1);
    const prof = randInt(1, 10);
    const built = rand() < 0.55 ? 'Yes' : 'No';
    const money = built === 'Yes' && rand() < 0.18 ? 'Yes' : 'No';
    const country = pick(COUNTRIES);
    const sy = 2020 + randInt(0, 5); const sm = randInt(1,12); const sd = randInt(1,28);
    const ey = sy + Math.floor(weeks/52); const em = randInt(1,12); const ed = randInt(1,28);
    ws.write(`${i+1},${platform},${skill},${weeks},${hrs},${prof},${built},${money},${country},${sy}-${String(sm).padStart(2,'0')}-${String(sd).padStart(2,'0')},${ey}-${String(em).padStart(2,'0')}-${String(ed).padStart(2,'0')}\n`);
    if (i % 500_000 === 0 && i > 0) console.log(`  ...${i.toLocaleString()} rows`);
  }
  ws.end();
  await new Promise(r => ws.on('finish', r));
  console.log(`  done: ${TOTAL.toLocaleString()} rows`);
}

console.log('Generating 3: ai_tool_usage_full.csv (2M rows, ~250MB)...');
{
  const f = join(outDir, 'ai_tool_usage_full.csv');
  const fs = await import('fs');
  const ws = fs.createWriteStream(f);
  ws.write('user_id,tool,use_case,prompts_per_week,quality_1to10,time_saved_hours_per_week,would_recommend,grade,age,started_at\n');
  const TOTAL = 2_000_000;
  const useCases = ['Homework Help', 'Coding', 'Writing', 'Research', 'Image Generation', 'Translation', 'Math Problem Solving', 'Brainstorming', 'Summarization'];
  for (let i = 0; i < TOTAL; i++) {
    const tool = pick(AI_TOOLS);
    const uc = pick(useCases);
    const prompts = randInt(0, 100);
    const quality = randInt(3, 10);
    const saved = (rand() * 10).toFixed(1);
    const rec = rand() < 0.82 ? 'Yes' : 'No';
    const grade = pick(GRADES);
    const age = randInt(13, 22);
    const sy = 2023 + randInt(0, 2); const sm = randInt(1,12); const sd = randInt(1,28);
    ws.write(`${i+1},${tool},${uc},${prompts},${quality},${saved},${rec},${grade},${age},${sy}-${String(sm).padStart(2,'0')}-${String(sd).padStart(2,'0')}\n`);
    if (i % 500_000 === 0 && i > 0) console.log(`  ...${i.toLocaleString()} rows`);
  }
  ws.end();
  await new Promise(r => ws.on('finish', r));
  console.log(`  done: ${TOTAL.toLocaleString()} rows`);
}

console.log('Generating 4: social_media_impact_full.csv (3.5M rows, ~500MB)...');
{
  const f = join(outDir, 'social_media_impact_full.csv');
  const fs = await import('fs');
  const ws = fs.createWriteStream(f);
  ws.write('user_id,platform,daily_minutes,weekly_posts,followers,engagement_rate_pct,wellbeing_1to10,sleep_hours,anxiety_1to10,age,gender,country\n');
  const TOTAL = 3_500_000;
  const socials = ['Instagram', 'TikTok', 'Snapchat', 'Twitter/X', 'Reddit', 'Discord', 'YouTube', 'Facebook', 'WhatsApp', 'Telegram', 'BeReal', 'Threads'];
  for (let i = 0; i < TOTAL; i++) {
    const platform = pick(socials);
    const min = randInt(5, 360);
    const posts = randInt(0, 50);
    const followers = randInt(0, 50000);
    const eng = (rand() * 15).toFixed(2);
    const well = randInt(1, 10);
    const sleep = (rand() * 4 + 4).toFixed(1);
    const anx = randInt(1, 10);
    const age = randInt(13, 25);
    const gender = pick(['Male', 'Female', 'Non-binary']);
    const country = pick(COUNTRIES);
    ws.write(`${i+1},${platform},${min},${posts},${followers},${eng},${well},${sleep},${anx},${age},${gender},${country}\n`);
    if (i % 500_000 === 0 && i > 0) console.log(`  ...${i.toLocaleString()} rows`);
  }
  ws.end();
  await new Promise(r => ws.on('finish', r));
  console.log(`  done: ${TOTAL.toLocaleString()} rows`);
}

console.log('Generating 5: device_usage_full.csv (4M rows, ~550MB)...');
{
  const f = join(outDir, 'device_usage_full.csv');
  const fs = await import('fs');
  const ws = fs.createWriteStream(f);
  ws.write('session_id,user_id,device,os,browser,app_category,minutes_active,date,hour_of_day,notifications,age\n');
  const TOTAL = 4_000_000;
  const oses = ['Android', 'iOS', 'Windows', 'macOS', 'Linux', 'ChromeOS'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Samsung Internet', 'Opera'];
  const cats = ['Social', 'Education', 'Gaming', 'Entertainment', 'Productivity', 'Communication', 'Shopping', 'News', 'Health', 'Creative'];
  for (let i = 0; i < TOTAL; i++) {
    const device = pick(DEVICES);
    const os = pick(oses);
    const browser = pick(browsers);
    const cat = pick(cats);
    const min = randInt(1, 180);
    const day = randInt(1, 28); const mo = randInt(1, 12); const yr = 2025;
    const hour = randInt(0, 23);
    const notifs = randInt(0, 200);
    const age = randInt(13, 25);
    ws.write(`${i+1},${randInt(1, 500000)},${device},${os},${browser},${cat},${min},${yr}-${String(mo).padStart(2,'0')}-${String(day).padStart(2,'0')},${hour},${notifs},${age}\n`);
    if (i % 500_000 === 0 && i > 0) console.log(`  ...${i.toLocaleString()} rows`);
  }
  ws.end();
  await new Promise(r => ws.on('finish', r));
  console.log(`  done: ${TOTAL.toLocaleString()} rows`);
}

console.log('\\nALL DONE!');
