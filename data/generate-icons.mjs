#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'icons');
mkdirSync(OUT, { recursive: true });

const ICONS = {
  ai: ['neural','brain','robot','chat','prompt','model','train','inference','tensor','gradient','weights','layers','neuron','transformer','embedding','attention','token','agent','rag','dataset','vector','cluster','classification','regression','vision','nlp','voice','speech','recognition','gpt','llm','diffusion','gan','cnn','rnn','mlops','prompt-engineering','few-shot','zero-shot','chain-of-thought','reasoning','planning','tool-use','memory','context'],
  skills: ['code','video','design','language','writing','speaking','music','photo','3d','math','science','data','business','marketing','art','animation','podcast','stream','game','app','web','mobile','cloud','devops','security','crypto','blockchain','robotics','iot','ar','vr','metaverse','illustration','ui-ux','frontend','backend','fullstack','sql','python','javascript','typescript','react','node','rust','go'],
  platforms: ['youtube','instagram','tiktok','discord','spotify','netflix','github','twitter','reddit','linkedin','whatsapp','telegram','snapchat','pinterest','twitch','medium','substack','patreon','khan','coursera','udemy','edx','duolingo','figma','canva','notion','slack','zoom','meet','teams','drive','dropbox','box','onedrive','icloud','photos','gmail','outlook','protonmail','signal','clubhouse'],
  wellness: ['sleep','eye','posture','breath','meditation','mindful','break','stretch','walk','exercise','water','food','sun','mood','journal','gratitude','calm','breathe','rest','sunset','sunrise','star','moon','cloud','rain','leaf','tree','flower','mountain','wave','fire','candle','gem','zen','hobby','friend','laugh','play','read','music-relax','tea','yoga','pilates','cardio','strength'],
  data: ['bar','line','pie','radar','scatter','area','donut','bubble','heatmap','treemap','gauge','histogram','kpi','metric','trend-up','trend-down','growth','decline','spike','plateau','compare','filter','search','export','import','database','table','grid','list','card','stack','layers-data','funnel','sankey','choropleth','spectrum','distribution','correlation','realtime'],
  actions: ['arrow-up','arrow-down','arrow-left','arrow-right','arrow-up-right','arrow-down-right','play','pause','stop','skip','rewind','forward','shuffle','repeat','share','like','love','bookmark','star','pin','flag','tag','edit','delete','save','copy','cut','paste','undo','redo','plus','minus','check','close','info','warning','error','help','settings','gear','bell','lock','unlock','eye-open','eye-closed','download','upload','sync','refresh'],
  people: ['user','users','team','group','community','leader','mentor','student','teacher','parent','child','teen','adult','elder','friend','family','voice','chat','call','video-call','message','mail','send','receive','reply','forward','block','mute','follow','unfollow','subscribe','unsubscribe','invite','mention','react','report','verify','online','offline','away','busy'],
  devices: ['phone','laptop','tablet','tv','desktop','watch','console','headphones','camera','speaker','mic','printer','router','modem','server','cloud','cpu','gpu','memory','storage','battery','charging','wifi','bluetooth','usb','screen','keyboard','mouse','controller','vr-headset','drone','sensor','thermostat','bulb','plug','switch','hub','bridge','gateway','antenna','satellite','projector','scanner','webcam','fan','cooler','case'],
  abstract: ['circle','square','triangle','hexagon','star-shape','diamond','spiral','wave-shape','zigzag','dot','line','cross','plus-ab','minus-ab','equal','percent','infinity','atom','orbit','magnet','light','sparkle','glow','prism','pulse','ripple','vortex','grid-3d','mesh','wireframe','particle','comet','sphere','cube','pyramid','torus','cone','cylinder','ellipse','fractal','kaleidoscope','mandala','lattice','weave','braid'],
  education: ['book','book-open','pencil','pen','notebook','paper','test','exam','graduation','school','college','library','desk','chair','board','marker','ruler','compass','calculator','globe','map','flag-edu','clock','bell-edu','apple','backpack','cap','diploma','trophy','medal','award','certificate','science-beaker','microscope','telescope','dna','formula','theorem','lecture','study','tutor','mentor-edu']
};

const PALETTES = [
  { primary: '#6366F1', secondary: '#8B5CF6', glow: '#A78BFA', bg: '#030712' },
  { primary: '#06B6D4', secondary: '#0EA5E9', glow: '#67E8F9', bg: '#030712' },
  { primary: '#10B981', secondary: '#14B8A6', glow: '#6EE7B7', bg: '#030712' },
  { primary: '#F59E0B', secondary: '#EF4444', glow: '#FCD34D', bg: '#030712' },
  { primary: '#EC4899', secondary: '#F43F5E', glow: '#F9A8D4', bg: '#030712' },
  { primary: '#8B5CF6', secondary: '#6366F1', glow: '#C4B5FD', bg: '#030712' }
];

function genIcon(name, idx) {
  const p = PALETTES[idx % PALETTES.length];
  const size = 256;
  const cx = size / 2, cy = size / 2;
  let h = 0;
  for (const c of name) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
  const r = (n, m) => Math.abs(((h * (n + 1)) % 1000) / 1000) * m;
  const style = Math.abs(h) % 8;
  let body = '';
  switch (style) {
    case 0: body = `<circle cx="${cx}" cy="${cy}" r="${80 + r(1,30)}" fill="url(#g${idx})" opacity="0.9"/><circle cx="${cx-20}" cy="${cy-20}" r="${20+r(2,10)}" fill="white" opacity="0.4"/><circle cx="${cx-20}" cy="${cy-20}" r="${30+r(3,15)}" fill="white" opacity="0.15"/>`; break;
    case 1: body = `<polygon points="${cx},${cy-90} ${cx+78},${cy-45} ${cx+78},${cy+45} ${cx},${cy+90} ${cx-78},${cy+45} ${cx-78},${cy-45}" fill="url(#g${idx})" opacity="0.85"/><polygon points="${cx},${cy-60} ${cx+52},${cy-30} ${cx+52},${cy+30} ${cx},${cy+60} ${cx-52},${cy+30} ${cx-52},${cy-30}" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>`; break;
    case 2: body = `<rect x="${cx-80}" y="${cy-80}" width="160" height="160" rx="40" fill="url(#g${idx})" opacity="0.9"/><rect x="${cx-50}" y="${cy-50}" width="100" height="100" rx="20" fill="white" opacity="0.1"/>`; break;
    case 3: body = `<polygon points="${cx},${cy-100} ${cx+100},${cy} ${cx},${cy+100} ${cx-100},${cy}" fill="url(#g${idx})" opacity="0.85"/><polygon points="${cx},${cy-60} ${cx+60},${cy} ${cx},${cy+60} ${cx-60},${cy}" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>`; break;
    case 4: body = `<circle cx="${cx}" cy="${cy}" r="80" fill="url(#g${idx})" opacity="0.6"/><circle cx="${cx-25}" cy="${cy-10}" r="40" fill="url(#g${idx})" opacity="0.8"/><circle cx="${cx+25}" cy="${cy+10}" r="40" fill="url(#g${idx})" opacity="0.9"/>`; break;
    case 5: body = `<polygon points="${cx},${cy-90} ${cx+80},${cy+60} ${cx-80},${cy+60}" fill="url(#g${idx})" opacity="0.85"/><polygon points="${cx},${cy-50} ${cx+45},${cy+35} ${cx-45},${cy+35}" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>`; break;
    case 6: const pts=[]; for(let i=0;i<10;i++){const a=(i*Math.PI)/5-Math.PI/2;const rad=i%2===0?90:45;pts.push(`${cx+Math.cos(a)*rad},${cy+Math.sin(a)*rad}`);} body=`<polygon points="${pts.join(' ')}" fill="url(#g${idx})" opacity="0.9"/><polygon points="${pts.join(' ')}" fill="none" stroke="white" stroke-width="1.5" opacity="0.4"/>`; break;
    case 7: body = `<rect x="${cx-70}" y="${cy-70}" width="140" height="140" rx="20" fill="url(#g${idx})" opacity="0.9" transform="rotate(15 ${cx} ${cy})"/><rect x="${cx-45}" y="${cy-45}" width="90" height="90" rx="10" fill="white" opacity="0.15" transform="rotate(15 ${cx} ${cy})"/>`; break;
  }
  const text = name.replace(/-/g, ' ').slice(0, 12);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <defs>
      <linearGradient id="g${idx}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${p.primary}"/>
        <stop offset="100%" stop-color="${p.secondary}"/>
      </linearGradient>
      <radialGradient id="glow${idx}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${p.glow}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${p.glow}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="${p.bg}"/>
    <circle cx="${cx}" cy="${cy}" r="120" fill="url(#glow${idx})"/>
    ${body}
    <text x="${cx}" y="${size-18}" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="white" text-anchor="middle" opacity="0.7">${text}</text>
  </svg>`;
}

let count = 0, idx = 0;
for (const [category, names] of Object.entries(ICONS)) {
  for (const name of names) {
    const svg = genIcon(name, idx);
    const filename = `${String(idx).padStart(3,'0')}-${category}-${name}.svg`;
    writeFileSync(join(OUT, filename), svg);
    count++; idx++;
  }
}
console.log(`✅ Generated ${count} icons in ${OUT}`);
