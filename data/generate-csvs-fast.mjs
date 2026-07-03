// Generate larger CSVs - smaller scale but high quality
import { createWriteStream, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'kaggle');
mkdirSync(outDir, { recursive: true });

let seed = 12345;
function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function gauss(mean, stdev) {
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
const IMPACT = ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'];
const SOCIALS = ['Instagram', 'TikTok', 'Snapchat', 'Twitter/X', 'Reddit', 'Discord', 'YouTube', 'Facebook', 'WhatsApp', 'Telegram', 'BeReal', 'Threads'];

async function gen(filename, headers, rows, buildRow) {
  const ws = createWriteStream(join(outDir, filename));
  ws.write(headers.join(',') + '\n');
  for (let i = 0; i < rows; i++) {
    ws.write(buildRow(i) + '\n');
  }
  return new Promise((res, rej) => { ws.end(); ws.on('finish', res); ws.on('error', rej); });
}

console.log('1/5: global_screen_time_xtra.csv (200k rows)...');
await gen('global_screen_time_xtra.csv',
  ['response_id','country','city','age','grade','gender','device','daily_screen_hours','learning_pct','entertainment_pct','socializing_pct','creative_pct','other_pct','primary_platform','top_skill','used_ai','positive_impact','satisfaction_score','submitted_at'],
  200000,
  (i) => {
    const country = pick(COUNTRIES);
    const city = country === 'India' ? pick(CITIES.slice(0,8)) : pick(CITIES);
    const age = randInt(13, 22);
    const grade = pick(GRADES);
    const gender = pick(['Male','Female','Non-binary','Prefer not to say']);
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
    return `${i+1},${country},${city},${age},${grade},${gender},${device},${hours},${learn},${ent},${soc},${cre},${oth},${platform},${skill},${usedAi},${impact},${sat},${yr}-${String(mo).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }
);
console.log('done 1');

console.log('2/5: skill_acquisition_xtra.csv (150k rows)...');
await gen('skill_acquisition_xtra.csv',
  ['learner_id','platform','skill','weeks_practiced','hours_per_week','proficiency_1to10','project_built','monetized','country','started_at','completed_at'],
  150000,
  (i) => {
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
    return `${i+1},${platform},${skill},${weeks},${hrs},${prof},${built},${money},${country},${sy}-${String(sm).padStart(2,'0')}-${String(sd).padStart(2,'0')},${ey}-${String(em).padStart(2,'0')}-${String(ed).padStart(2,'0')}`;
  }
);
console.log('done 2');

console.log('3/5: ai_tool_usage_xtra.csv (100k rows)...');
await gen('ai_tool_usage_xtra.csv',
  ['user_id','tool','use_case','prompts_per_week','quality_1to10','time_saved_hours_per_week','would_recommend','grade','age','started_at'],
  100000,
  (i) => {
    const tool = pick(AI_TOOLS);
    const useCases = ['Homework Help', 'Coding', 'Writing', 'Research', 'Image Generation', 'Translation', 'Math Problem Solving', 'Brainstorming', 'Summarization'];
    const uc = pick(useCases);
    const prompts = randInt(0, 100);
    const quality = randInt(3, 10);
    const saved = (rand() * 10).toFixed(1);
    const rec = rand() < 0.82 ? 'Yes' : 'No';
    const grade = pick(GRADES);
    const age = randInt(13, 22);
    const sy = 2023 + randInt(0, 2); const sm = randInt(1,12); const sd = randInt(1,28);
    return `${i+1},${tool},${uc},${prompts},${quality},${saved},${rec},${grade},${age},${sy}-${String(sm).padStart(2,'0')}-${String(sd).padStart(2,'0')}`;
  }
);
console.log('done 3');

console.log('4/5: social_media_impact_xtra.csv (180k rows)...');
await gen('social_media_impact_xtra.csv',
  ['user_id','platform','daily_minutes','weekly_posts','followers','engagement_rate_pct','wellbeing_1to10','sleep_hours','anxiety_1to10','age','gender','country'],
  180000,
  (i) => {
    const platform = pick(SOCIALS);
    const min = randInt(5, 360);
    const posts = randInt(0, 50);
    const followers = randInt(0, 50000);
    const eng = (rand() * 15).toFixed(2);
    const well = randInt(1, 10);
    const sleep = (rand() * 4 + 4).toFixed(1);
    const anx = randInt(1, 10);
    const age = randInt(13, 25);
    const gender = pick(['Male','Female','Non-binary']);
    const country = pick(COUNTRIES);
    return `${i+1},${platform},${min},${posts},${followers},${eng},${well},${sleep},${anx},${age},${gender},${country}`;
  }
);
console.log('done 4');

console.log('5/5: device_usage_xtra.csv (200k rows)...');
await gen('device_usage_xtra.csv',
  ['session_id','user_id','device','os','browser','app_category','minutes_active','date','hour_of_day','notifications','age'],
  200000,
  (i) => {
    const device = pick(DEVICES);
    const os = pick(['Android','iOS','Windows','macOS','Linux','ChromeOS']);
    const browser = pick(['Chrome','Safari','Firefox','Edge','Samsung Internet','Opera']);
    const cat = pick(['Social','Education','Gaming','Entertainment','Productivity','Communication','Shopping','News','Health','Creative']);
    const min = randInt(1, 180);
    const day = randInt(1, 28); const mo = randInt(1, 12); const yr = 2025;
    const hour = randInt(0, 23);
    const notifs = randInt(0, 200);
    const age = randInt(13, 25);
    return `${i+1},${randInt(1, 500000)},${device},${os},${browser},${cat},${min},${yr}-${String(mo).padStart(2,'0')}-${String(day).padStart(2,'0')},${hour},${notifs},${age}`;
  }
);
console.log('done 5');
console.log('ALL DONE');
