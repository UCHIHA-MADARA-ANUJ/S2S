// Generate even more massive CSVs - target 1.5GB+ more
import { createWriteStream, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'kaggle');
mkdirSync(outDir, { recursive: true });

let seed = 77777;
function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function gauss(mean, stdev) {
  const u = 1 - rand(); const v = rand();
  return mean + stdev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const COUNTRIES = ['India','USA','UK','Brazil','Japan','Germany','Australia','Canada','Singapore','UAE','South Africa','Mexico','France','South Korea','Indonesia','Spain','Italy','Netherlands','Sweden','Norway','Finland','Denmark','Belgium','Switzerland','Austria','Ireland','Portugal','Poland','Greece','Turkey','Egypt','Nigeria','Kenya','Ghana','Morocco','Thailand','Vietnam','Philippines','Malaysia','Argentina','Chile','Colombia','Peru','Saudi Arabia','Israel','Czech Republic','Hungary','Romania','Bulgaria','Croatia','Slovakia','Estonia','Latvia','Lithuania','Iceland','Luxembourg','New Zealand','Pakistan','Bangladesh','Sri Lanka','Nepal','Myanmar','Cambodia','Laos','Mongolia','Kazakhstan','Uzbekistan'];
const CITIES = ['Gurugram','Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Pune','New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','London','Manchester','Birmingham','Leeds','Tokyo','Osaka','Kyoto','Yokohama','Berlin','Munich','Hamburg','Sydney','Melbourne','Brisbane','Perth','Toronto','Vancouver','Montreal','Calgary','Singapore','Dubai','Abu Dhabi','Sharjah','Cape Town','Johannesburg','Durban','Seoul','Busan','Incheon','Paris','Lyon','Marseille','Toulouse','Jakarta','Surabaya','Bandung','Madrid','Barcelona','Valencia','Rome','Milan','Naples','Amsterdam','Rotterdam','The Hague','Stockholm','Gothenburg','Helsinki','Espoo','Bangkok','Chiang Mai','Hanoi','Ho Chi Minh City','Manila','Quezon City','Kuala Lumpur','Penang','Buenos Aires','Cordoba','Rosario'];
const GRADES = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','Undergrad','Postgrad','Working Professional','Retired'];
const DEVICES = ['Smartphone','Laptop','Tablet','Desktop','TV','Smartwatch','Console','VR Headset','E-reader','Streaming Stick','Smart Speaker','E-ink Tablet'];
const PLATFORMS = ['YouTube','Instagram','TikTok','Discord','Reddit','Roblox','Minecraft','Khan Academy','Coursera','Udemy','Duolingo','GitHub','Stack Overflow','Twitch','Snapchat','WhatsApp','Telegram','LinkedIn','Pinterest','Spotify','Netflix','Disney+','Prime Video','HBO Max','Apple TV+','Hulu','Vimeo','Dailymotion','Tumblr','Medium','Substack','Quora','Skillshare','MasterClass','Codecademy','freeCodeCamp','Brilliant','EdX','Udacity','DataCamp','Pluralsight','Treehouse','Egghead','Frontend Masters','Laracasts','Wes Bos','Net Ninja','Academind','Traversy Media','The Odin Project','Vue Mastery','React Armory','Egghead.io','Code School','Codewars','LeetCode','HackerRank','TopCoder','Codeforces','Project Euler'];
const SKILLS = ['Coding/Programming','Video Editing','Graphic Design','Photography','Music Production','Digital Art','Creative Writing','Public Speaking','Math','Science','Languages','Cooking','Gaming Strategy','Animation','3D Modeling','Marketing','Financial Literacy','AI/ML','Web Development','Data Science','Cybersecurity','UI/UX Design','Mobile Dev','Cloud Computing','DevOps','Game Dev','Blockchain','AR/VR','Robotics','Quantum Computing','Embedded Systems','Database Design','Network Engineering','Pen Testing','SEO','Content Writing','Copywriting','Journalism','Podcasting','Voice Acting','Drawing','Painting','Sculpting','Pottery','Knitting','Sewing','Embroidery','Woodworking','Metalworking','Calligraphy','Origami','Chess','Go','Poker','Investing','Trading','Tax Prep','Bookkeeping','Yoga','Meditation','Martial Arts','Dance','Singing','Songwriting','Beat Making','DJing','Sound Design','Film Making','Cinematography','Color Grading','VFX','Motion Graphics','Architecture','Interior Design','Fashion Design','Jewelry Making','Cosmetics','Skincare','Fitness','Nutrition','Psychology','Philosophy','History','Geography','Astronomy','Biology','Chemistry','Physics','Geology','Meteorology','Oceanography','Anthropology','Sociology','Political Science','Economics','Law','Medicine','Dentistry','Veterinary','Pharmacy','Nursing','Paramedic','Piloting','Sailing','Skating','Snowboarding','Rock Climbing','Cycling','Running','Swimming','Surfing','Skateboarding','Parkour','Magic','Juggling','Puppetry','Stand-up Comedy','Improv','Storytelling','Vlogging','Streaming','Influencing','Tutoring','Coaching','Mentoring'];
const AI_TOOLS = ['ChatGPT','Gemini','Claude','Copilot','Perplexity','Midjourney','Grammarly','Notion AI','Canva AI','Stable Diffusion','DALL-E','Jasper','Bard','Bing Chat','You.com','Poe','HuggingChat','Leonardo AI','Runway','ElevenLabs','Synthesia','Descript','Murf','Play.ht','Resemble AI','Speechify','Otter','Fireflies','Fathom','Krisp','Tome','Gamma','Beautiful AI','Pitch','SlidesAI','Decktopus','Writesonic','Rytr','Copy.ai','Wordtune','Quillbot','Hemingway','Frase','Surfer','MarketMuse','Scalenut','Outranking','Ink','Longshot','Sudowrite','Lex','NovelAI','ShortlyAI','Anyword','ContentBot'];
const IMPACT = ['Very Negative','Negative','Slightly Negative','Neutral','Slightly Positive','Positive','Very Positive'];
const SOCIALS = ['Instagram','TikTok','Snapchat','Twitter/X','Reddit','Discord','YouTube','Facebook','WhatsApp','Telegram','BeReal','Threads','LinkedIn','Pinterest','Tumblr','Vimeo','Quora','Medium','Mastodon','Bluesky','Clubhouse','Twitch','Kick','Rumble','Truth Social','Parler','Gab','Gettr','Trovo','DLive'];

async function gen(filename, headers, rows, buildRow) {
  const ws = createWriteStream(join(outDir, filename));
  ws.write(headers.join(',') + '\n');
  for (let i = 0; i < rows; i++) {
    ws.write(buildRow(i) + '\n');
    if (i % 500_000 === 0 && i > 0) console.log(`  ${i.toLocaleString()}/${rows.toLocaleString()}`);
  }
  return new Promise((res, rej) => { ws.end(); ws.on('finish', res); ws.on('error', rej); });
}

console.log('1/4: global_screen_time_huge.csv (2M rows)...');
await gen('global_screen_time_huge.csv',
  ['response_id','country','city','age','grade','gender','device','daily_screen_hours','learning_pct','entertainment_pct','socializing_pct','creative_pct','other_pct','primary_platform','top_skill','used_ai','positive_impact','satisfaction_score','submitted_at'],
  2000000,
  (i) => {
    const country = pick(COUNTRIES);
    const city = country === 'India' ? pick(CITIES.slice(0,7)) : pick(CITIES);
    const age = randInt(8, 35);
    const grade = pick(GRADES);
    const gender = pick(['Male','Female','Non-binary','Prefer not to say','Other']);
    const device = pick(DEVICES);
    const hours = Math.max(0.1, gauss(4.2, 2.1)).toFixed(1);
    const learn = randInt(5, 70);
    const ent = randInt(5, 70);
    const soc = randInt(5, 50);
    const cre = randInt(0, 30);
    const oth = Math.max(0, 100 - learn - ent - soc - cre);
    const platform = pick(PLATFORMS);
    const skill = pick(SKILLS);
    const usedAi = rand() < 0.72 ? 'Yes' : 'No';
    const impact = pick(IMPACT);
    const sat = randInt(1, 10);
    const day = randInt(1, 28); const mo = randInt(1, 12); const yr = 2020 + randInt(0, 6);
    return `${i+1},${country},${city},${age},${grade},${gender},${device},${hours},${learn},${ent},${soc},${cre},${oth},${platform},${skill},${usedAi},${impact},${sat},${yr}-${String(mo).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }
);
console.log('done 1');

console.log('2/4: skill_acquisition_huge.csv (1.5M rows)...');
await gen('skill_acquisition_huge.csv',
  ['learner_id','platform','skill','weeks_practiced','hours_per_week','proficiency_1to10','project_built','monetized','country','started_at','completed_at','instructor_rating_1to5'],
  1500000,
  (i) => {
    const platform = pick(PLATFORMS);
    const skill = pick(SKILLS);
    const weeks = randInt(1, 200);
    const hrs = (rand() * 30).toFixed(1);
    const prof = randInt(1, 10);
    const built = rand() < 0.58 ? 'Yes' : 'No';
    const money = built === 'Yes' && rand() < 0.22 ? 'Yes' : 'No';
    const country = pick(COUNTRIES);
    const rating = randInt(1, 5);
    const sy = 2015 + randInt(0, 10); const sm = randInt(1,12); const sd = randInt(1,28);
    const ey = sy + Math.floor(weeks/52); const em = randInt(1,12); const ed = randInt(1,28);
    return `${i+1},${platform},${skill},${weeks},${hrs},${prof},${built},${money},${country},${sy}-${String(sm).padStart(2,'0')}-${String(sd).padStart(2,'0')},${ey}-${String(em).padStart(2,'0')}-${String(ed).padStart(2,'0')},${rating}`;
  }
);
console.log('done 2');

console.log('3/4: social_media_impact_huge.csv (2M rows)...');
await gen('social_media_impact_huge.csv',
  ['user_id','platform','daily_minutes','weekly_posts','followers','engagement_rate_pct','wellbeing_1to10','sleep_hours','anxiety_1to10','age','gender','country','screen_time_hours','mood_1to10','fomo_1to10'],
  2000000,
  (i) => {
    const platform = pick(SOCIALS);
    const min = randInt(5, 720);
    const posts = randInt(0, 200);
    const followers = randInt(0, 200000);
    const eng = (rand() * 25).toFixed(2);
    const well = randInt(1, 10);
    const sleep = (rand() * 6 + 2).toFixed(1);
    const anx = randInt(1, 10);
    const age = randInt(10, 40);
    const gender = pick(['Male','Female','Non-binary','Prefer not to say','Other']);
    const country = pick(COUNTRIES);
    const screen = Math.max(0.5, gauss(4.0, 2.0)).toFixed(1);
    const mood = randInt(1, 10);
    const fomo = randInt(1, 10);
    return `${i+1},${platform},${min},${posts},${followers},${eng},${well},${sleep},${anx},${age},${gender},${country},${screen},${mood},${fomo}`;
  }
);
console.log('done 3');

console.log('4/4: device_usage_huge.csv (2M rows)...');
await gen('device_usage_huge.csv',
  ['session_id','user_id','device','os','browser','app_category','minutes_active','date','hour_of_day','notifications','age','country','battery_pct','data_mb'],
  2000000,
  (i) => {
    const device = pick(DEVICES);
    const os = pick(['Android','iOS','Windows','macOS','Linux','ChromeOS','Tizen','HarmonyOS','iPadOS','FireOS','Ubuntu Touch','Sailfish','KaiOS','Symbian','BlackBerryOS']);
    const browser = pick(['Chrome','Safari','Firefox','Edge','Samsung Internet','Opera','Brave','DuckDuckGo','Vivaldi','Tor','Epic','Puffin','Dolphin','Yandex','UC Browser','Mint','Aloha','Cake','Kiwi','Ghostery']);
    const cat = pick(['Social','Education','Gaming','Entertainment','Productivity','Communication','Shopping','News','Health','Creative','Finance','Travel','Music','Photos','Books','Sports','Food','Dating','Maps','Weather','Calendar','Notes','Email','Browser','Camera','Voice Recorder','Calculator','Compass','Flashlight','Files']);
    const min = randInt(1, 360);
    const day = randInt(1, 28); const mo = randInt(1, 12); const yr = 2020 + randInt(0, 6);
    const hour = randInt(0, 23);
    const notifs = randInt(0, 1000);
    const age = randInt(10, 40);
    const country = pick(COUNTRIES);
    const batt = randInt(0, 100);
    const data = randInt(1, 5000);
    return `${i+1},${randInt(1, 2000000)},${device},${os},${browser},${cat},${min},${yr}-${String(mo).padStart(2,'0')}-${String(day).padStart(2,'0')},${hour},${notifs},${age},${country},${batt},${data}`;
  }
);
console.log('done 4');
console.log('ALL DONE');
