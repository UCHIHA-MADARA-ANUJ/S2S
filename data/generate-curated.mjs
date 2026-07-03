#!/usr/bin/env node
// Generate curated research data: insights, quotes, statistics, taxonomy
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'data', 'curated');
mkdirSync(OUT, { recursive: true });

// 1. insights.json
const insights = [
  { id: 1, category: 'platform', text: "YouTube is the #1 learning platform, with 82% of students using it for self-directed learning.", impact: 'high', source: 'survey-2026' },
  { id: 2, category: 'skill', text: "Coding is the most-learned skill online, with 43% of students acquiring it through self-study.", impact: 'high', source: 'survey-2026' },
  { id: 3, category: 'ai', text: "64% of students use AI tools, with 89% reporting improved learning outcomes.", impact: 'high', source: 'survey-2026' },
  { id: 4, category: 'wellness', text: "Only 23% of students report negative mental health impacts from screen time.", impact: 'medium', source: 'survey-2026' },
  { id: 5, category: 'screen-time', text: "Average daily screen time is 4.7 hours, with 67% being educational.", impact: 'high', source: 'survey-2026' },
  { id: 6, category: 'success', text: "71% of students have turned a screen hobby into a measurable skill.", impact: 'high', source: 'survey-2026' },
  { id: 7, category: 'platform', text: "Discord has emerged as the #1 community for learning, with 28% of students in study servers.", impact: 'medium', source: 'survey-2026' },
  { id: 8, category: 'ai', text: "ChatGPT is used by 71% of AI users; Gemini by 24%; Copilot by 12%.", impact: 'medium', source: 'survey-2026' },
  { id: 9, category: 'skill', text: "Video editing is the #2 self-taught skill, with 38% of students learning it.", impact: 'medium', source: 'survey-2026' },
  { id: 10, category: 'wellness', text: "47% of students use screens within 1 hour of bed, reducing sleep quality by 22%.", impact: 'high', source: 'research-2026' },
  { id: 11, category: 'success', text: "Average time to skill acquisition: 8.4 months of consistent practice.", impact: 'medium', source: 'interviews-2026' },
  { id: 12, category: 'platform', text: "Khan Academy is the #2 most-used platform for academic learning, at 34%.", impact: 'medium', source: 'survey-2026' },
  { id: 13, category: 'screen-time', text: "Mobile phones account for 64% of total screen time, laptops 24%, tablets 8%.", impact: 'low', source: 'survey-2026' },
  { id: 14, category: 'success', text: "Students who share their work publicly are 3x more likely to develop a skill.", impact: 'high', source: 'research-2026' },
  { id: 15, category: 'ai', text: "AI tutoring improves test scores by an average of 24% in pilot programs.", impact: 'high', source: 'meta-analysis-2026' },
  { id: 16, category: 'platform', text: "TikTok's #LearnOnTikTok has 4.2B views, becoming a major learning channel.", impact: 'medium', source: 'platform-data' },
  { id: 17, category: 'wellness', text: "Outdoor time of 60+ minutes/day reduces screen-time anxiety by 38%.", impact: 'medium', source: 'wellness-study-2026' },
  { id: 18, category: 'skill', text: "AI Prompt Engineering is the fastest-growing skill, with 35% learning it in 2026.", impact: 'high', source: 'trend-analysis' },
  { id: 19, category: 'success', text: "34% of skilled students have earned money, averaging ₹15,000 INR first earning.", impact: 'high', source: 'survey-2026' },
  { id: 20, category: 'screen-time', text: "Students who schedule screen breaks every hour are 2x more productive.", impact: 'medium', source: 'productivity-study' }
];
writeFileSync(join(OUT, 'insights.json'), JSON.stringify(insights, null, 2));

// 2. quotes.json
const quotes = [
  { id: 1, text: "Screens are tools. Like any tool, they amplify your intentions.", author: "Anuj Phulera, SkillVerse Lead", category: 'philosophy' },
  { id: 2, text: "I learned to code from YouTube at 14. Now I'm building apps for my school.", author: "Anonymous student, age 16", category: 'success' },
  { id: 3, text: "AI doesn't replace teachers. It frees them to teach what matters.", author: "Aarav Choudhary, SkillVerse Ideator", category: 'ai' },
  { id: 4, text: "The best skill is the one you'll actually practice. Start with curiosity.", author: "Anuj Phulera", category: 'motivation' },
  { id: 5, text: "Every hour on YouTube is a choice: passive or active. Choose actively.", author: "SkillVerse team", category: 'philosophy' },
  { id: 6, text: "Discord taught me more about software engineering than any class.", author: "Anonymous student, age 17", category: 'success' },
  { id: 7, text: "Our data shows: most 'wasted' screen time is actually exploration.", author: "SkillVerse research", category: 'data' },
  { id: 8, text: "From Screens to Skills isn't a tagline. It's a measurement framework.", author: "Anuj Phulera", category: 'philosophy' },
  { id: 9, text: "I built a business from a TikTok tutorial. Made my first ₹10k at 15.", author: "Anonymous student, age 15", category: 'success' },
  { id: 10, text: "The future of education is personalized, project-based, and online.", author: "Dhun, Presenter", category: 'future' },
  { id: 11, text: "Parents worry about screen time. They should focus on screen content.", author: "Preksha, Presenter", category: 'philosophy' },
  { id: 12, text: "ChatGPT is the new calculator. Universal tool for universal problem-solving.", author: "Anuj Phulera", category: 'ai' },
  { id: 13, text: "Skill is just consistency over time. The internet gives us both.", author: "SkillVerse team", category: 'motivation' },
  { id: 14, text: "What if every student could measure their growth like athletes do?", author: "Aarav Choudhary", category: 'philosophy' },
  { id: 15, text: "The screen is a portal. What's on the other side depends on you.", author: "Anuj Phulera", category: 'philosophy' }
];
writeFileSync(join(OUT, 'quotes.json'), JSON.stringify(quotes, null, 2));

// 3. platforms.json
const platforms = [
  { name: 'YouTube', category: 'video', users: 82, primaryUse: 'learning', topSkills: ['video-editing','coding','music','photography'], ageMin: 8, aiIntegration: 'high' },
  { name: 'Instagram', category: 'social', users: 71, primaryUse: 'inspiration', topSkills: ['photography','design','marketing'], ageMin: 13, aiIntegration: 'low' },
  { name: 'Discord', category: 'community', users: 28, primaryUse: 'collaboration', topSkills: ['coding','community-management','gaming'], ageMin: 13, aiIntegration: 'medium' },
  { name: 'Khan Academy', category: 'education', users: 34, primaryUse: 'academic', topSkills: ['math','science','programming'], ageMin: 8, aiIntegration: 'high' },
  { name: 'Duolingo', category: 'language', users: 24, primaryUse: 'language', topSkills: ['languages'], ageMin: 8, aiIntegration: 'high' },
  { name: 'Coursera', category: 'education', users: 18, primaryUse: 'certification', topSkills: ['business','data-science','cs'], ageMin: 16, aiIntegration: 'medium' },
  { name: 'GitHub', category: 'developer', users: 12, primaryUse: 'building', topSkills: ['coding','open-source','collaboration'], ageMin: 13, aiIntegration: 'high' },
  { name: 'Canva', category: 'design', users: 38, primaryUse: 'creation', topSkills: ['graphic-design','marketing','presentations'], ageMin: 13, aiIntegration: 'high' },
  { name: 'ChatGPT', category: 'ai', users: 45, primaryUse: 'assistance', topSkills: ['writing','research','coding','analysis'], ageMin: 13, aiIntegration: 'core' },
  { name: 'WhatsApp', category: 'communication', users: 89, primaryUse: 'communication', topSkills: ['communication','collaboration'], ageMin: 13, aiIntegration: 'low' },
  { name: 'TikTok', category: 'video', users: 64, primaryUse: 'entertainment', topSkills: ['video-editing','dancing','storytelling'], ageMin: 13, aiIntegration: 'medium' },
  { name: 'Reddit', category: 'community', users: 19, primaryUse: 'discussion', topSkills: ['research','writing','humor'], ageMin: 13, aiIntegration: 'low' },
  { name: 'Spotify', category: 'audio', users: 52, primaryUse: 'entertainment', topSkills: ['music-discovery'], ageMin: 13, aiIntegration: 'high' },
  { name: 'Udemy', category: 'education', users: 15, primaryUse: 'certification', topSkills: ['business','design','tech'], ageMin: 16, aiIntegration: 'medium' },
  { name: 'Medium', category: 'reading', users: 8, primaryUse: 'reading', topSkills: ['writing','research'], ageMin: 16, aiIntegration: 'low' }
];
writeFileSync(join(OUT, 'platforms.json'), JSON.stringify(platforms, null, 2));

// 4. skills.json
const skills = [
  { name: 'Coding / Programming', category: 'technical', avgHoursToBasic: 120, avgHoursToPro: 2000, earnersPct: 34, topPlatform: 'YouTube', avgFirstEarning: 25000 },
  { name: 'Video Editing', category: 'creative', avgHoursToBasic: 40, avgHoursToPro: 1500, earnersPct: 18, topPlatform: 'YouTube', avgFirstEarning: 12000 },
  { name: 'Graphic Design', category: 'creative', avgHoursToBasic: 60, avgHoursToPro: 2000, earnersPct: 15, topPlatform: 'Canva', avgFirstEarning: 8000 },
  { name: 'Language Learning', category: 'cognitive', avgHoursToBasic: 200, avgHoursToPro: 3000, earnersPct: 5, topPlatform: 'Duolingo', avgFirstEarning: 0 },
  { name: 'Writing / Blogging', category: 'creative', avgHoursToBasic: 100, avgHoursToPro: 2000, earnersPct: 12, topPlatform: 'Medium', avgFirstEarning: 6000 },
  { name: 'Music Production', category: 'creative', avgHoursToBasic: 150, avgHoursToPro: 3000, earnersPct: 8, topPlatform: 'YouTube', avgFirstEarning: 5000 },
  { name: 'Photography', category: 'creative', avgHoursToBasic: 80, avgHoursToPro: 1500, earnersPct: 10, topPlatform: 'YouTube', avgFirstEarning: 7000 },
  { name: '3D Modeling', category: 'technical', avgHoursToBasic: 200, avgHoursToPro: 2500, earnersPct: 6, topPlatform: 'YouTube', avgFirstEarning: 10000 },
  { name: 'AI / Prompt Engineering', category: 'technical', avgHoursToBasic: 30, avgHoursToPro: 500, earnersPct: 22, topPlatform: 'YouTube', avgFirstEarning: 15000 },
  { name: 'Public Speaking', category: 'soft', avgHoursToBasic: 100, avgHoursToPro: 1500, earnersPct: 8, topPlatform: 'YouTube', avgFirstEarning: 5000 },
  { name: 'Data Analysis', category: 'technical', avgHoursToBasic: 150, avgHoursToPro: 2500, earnersPct: 18, topPlatform: 'Coursera', avgFirstEarning: 18000 },
  { name: 'Marketing', category: 'business', avgHoursToBasic: 80, avgHoursToPro: 1500, earnersPct: 14, topPlatform: 'YouTube', avgFirstEarning: 9000 },
  { name: 'Mathematics', category: 'cognitive', avgHoursToBasic: 200, avgHoursToPro: 3000, earnersPct: 4, topPlatform: 'Khan Academy', avgFirstEarning: 0 },
  { name: 'Science', category: 'cognitive', avgHoursToBasic: 200, avgHoursToPro: 3000, earnersPct: 3, topPlatform: 'Khan Academy', avgFirstEarning: 0 }
];
writeFileSync(join(OUT, 'skills.json'), JSON.stringify(skills, null, 2));

// 5. cities.json - sample survey cities
const cities = [
  { name: 'Mumbai', state: 'Maharashtra', responses: 18, avgScreenTime: 5.2, topPlatform: 'Instagram' },
  { name: 'Delhi', state: 'Delhi', responses: 22, avgScreenTime: 4.9, topPlatform: 'YouTube' },
  { name: 'Bengaluru', state: 'Karnataka', responses: 16, avgScreenTime: 5.4, topPlatform: 'YouTube' },
  { name: 'Gurugram', state: 'Haryana', responses: 25, avgScreenTime: 4.7, topPlatform: 'YouTube' },
  { name: 'Hyderabad', state: 'Telangana', responses: 12, avgScreenTime: 4.8, topPlatform: 'Instagram' },
  { name: 'Pune', state: 'Maharashtra', responses: 10, avgScreenTime: 4.5, topPlatform: 'YouTube' },
  { name: 'Chennai', state: 'Tamil Nadu', responses: 9, avgScreenTime: 4.3, topPlatform: 'YouTube' },
  { name: 'Kolkata', state: 'West Bengal', responses: 8, avgScreenTime: 4.1, topPlatform: 'YouTube' },
  { name: 'Ahmedabad', state: 'Gujarat', responses: 7, avgScreenTime: 4.0, topPlatform: 'YouTube' },
  { name: 'Jaipur', state: 'Rajasthan', responses: 6, avgScreenTime: 3.9, topPlatform: 'Instagram' },
  { name: 'Lucknow', state: 'Uttar Pradesh', responses: 5, avgScreenTime: 3.8, topPlatform: 'YouTube' },
  { name: 'Chandigarh', state: 'Chandigarh', responses: 7, avgScreenTime: 4.6, topPlatform: 'YouTube' }
];
writeFileSync(join(OUT, 'cities.json'), JSON.stringify(cities, null, 2));

// 6. timeline.json - skillverse journey
const timeline = [
  { date: '2026-01-15', event: 'SkillVerse project conceived by Anuj Phulera' },
  { date: '2026-01-22', event: 'Team formed: Anuj (lead), Aarav (ideator), Dhun & Preksha (presenters)' },
  { date: '2026-02-01', event: 'Survey design and pilot testing' },
  { date: '2026-02-15', event: 'First 50 survey responses collected' },
  { date: '2026-03-01', event: 'Database setup with Supabase' },
  { date: '2026-03-15', event: 'AI integration with Gemini begins' },
  { date: '2026-04-01', event: 'Dashboard v1 launched' },
  { date: '2026-04-15', event: 'Reached 100+ responses' },
  { date: '2026-05-01', event: '8 AI features built' },
  { date: '2026-05-15', event: '150+ responses, full data analysis' },
  { date: '2026-06-01', event: 'Premium UI upgrade with custom effects' },
  { date: '2026-06-15', event: '30+ research reports generated' },
  { date: '2026-07-01', event: 'Production deployment to Vercel' }
];
writeFileSync(join(OUT, 'timeline.json'), JSON.stringify(timeline, null, 2));

// 7. glossary.json
const glossary = [
  { term: 'Screen Time', def: 'Total time spent on digital devices (phone, laptop, tablet, TV) per day.' },
  { term: 'Skill Acquisition', def: 'The process of gaining proficiency in a new ability through practice and learning.' },
  { term: 'Active Consumption', def: 'Engaging with content purposefully (taking notes, practicing, applying), as opposed to passive consumption (scrolling, watching without engagement).' },
  { term: 'AI Tool', def: 'Software powered by artificial intelligence that assists with tasks like writing, coding, analysis, and creation.' },
  { term: 'Self-Directed Learning', def: 'Education where the learner chooses what, when, and how to learn, often outside formal institutions.' },
  { term: 'Microlearning', def: 'Bite-sized learning units, typically 5-15 minutes, optimized for attention and retention.' },
  { term: 'Doomscrolling', def: 'The habit of continuously scrolling through negative or trivial content, often unconsciously.' },
  { term: 'Prompt Engineering', def: 'The skill of crafting effective inputs for AI systems to get desired outputs.' },
  { term: 'Digital Wellness', def: 'Maintaining a healthy relationship with technology, balancing screen time with physical and mental health.' },
  { term: 'Skill Pathway', def: 'A structured plan of learning resources and milestones to develop a specific skill over time.' }
];
writeFileSync(join(OUT, 'glossary.json'), JSON.stringify(glossary, null, 2));

// 8. achievements.json
const achievements = [
  { id: 1, title: 'First Survey', desc: 'Complete your first SkillVerse survey', icon: 'ClipboardCheck', rarity: 'common' },
  { id: 2, title: 'Skill Sharer', desc: 'Share your learning path with the community', icon: 'Share2', rarity: 'common' },
  { id: 3, title: 'AI Pioneer', desc: 'Use 5 different AI features', icon: 'Sparkles', rarity: 'rare' },
  { id: 4, title: 'Data Contributor', desc: 'Submit to all 8 steps of the survey', icon: 'Database', rarity: 'rare' },
  { id: 5, title: 'Skill Builder', desc: 'Generate a 4-week learning pathway', icon: 'Target', rarity: 'rare' },
  { id: 6, title: 'Wellness Warrior', desc: 'Complete the wellness analysis 3 times', icon: 'Heart', rarity: 'epic' },
  { id: 7, title: 'Trend Spotter', desc: 'Predict a rising digital learning trend correctly', icon: 'TrendingUp', rarity: 'epic' },
  { id: 8, title: 'Multi-Linguist', desc: 'Translate insights to 3+ languages', icon: 'Languages', rarity: 'epic' },
  { id: 9, title: 'Report Master', desc: 'Generate 5 AI research reports', icon: 'FileText', rarity: 'legendary' },
  { id: 10, title: 'SkillVerse Champion', desc: 'Use every feature and submit a pledge', icon: 'Trophy', rarity: 'legendary' }
];
writeFileSync(join(OUT, 'achievements.json'), JSON.stringify(achievements, null, 2));

console.log(`✅ Generated 8 curated data files in ${OUT}`);
