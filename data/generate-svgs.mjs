// Generate 100+ custom SVG illustrations for the project
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'images', 'illustrations');
mkdirSync(outDir, { recursive: true });

const C = { bg: '#050505', primary: '#FF3D2E', secondary: '#FFA800', accent: '#00E1FF', success: '#10B981', white: '#F5F5F5', gray: '#3A3A3A' };

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// 1. Geometric patterns
function geometricPattern(n) {
  const cx = 500, cy = 500, size = 100;
  let shapes = '';
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    const r = 150 + (i % 3) * 80;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    const color = pick([C.primary, C.secondary, C.accent]);
    const type = i % 4;
    if (type === 0) shapes += `<circle cx="${x}" cy="${y}" r="${size/3}" fill="${color}" opacity="0.7"/>`;
    else if (type === 1) shapes += `<rect x="${x-30}" y="${y-30}" width="60" height="60" fill="${color}" opacity="0.7" transform="rotate(${i*15} ${x} ${y})"/>`;
    else if (type === 2) shapes += `<polygon points="${x},${y-40} ${x+35},${y+20} ${x-35},${y+20}" fill="${color}" opacity="0.7"/>`;
    else shapes += `<line x1="${x-50}" y1="${y}" x2="${x+50}" y2="${y}" stroke="${color}" stroke-width="4" opacity="0.8"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="${C.bg}"/>${shapes}<circle cx="${cx}" cy="${cy}" r="80" fill="${C.white}" opacity="0.9"/><circle cx="${cx}" cy="${cy}" r="40" fill="${C.bg}"/></svg>`;
}

// 2. Brain network
function brainNetwork() {
  const nodes = [];
  for (let i = 0; i < 40; i++) {
    nodes.push({ x: randInt(100, 900), y: randInt(100, 900) });
  }
  let lines = '';
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i+1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < 200) {
        lines += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="${C.accent}" stroke-width="0.5" opacity="${1 - d/200}"/>`;
      }
    }
  }
  let circles = nodes.map(n => `<circle cx="${n.x}" cy="${n.y}" r="4" fill="${C.accent}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="${C.bg}"/>${lines}${circles}<circle cx="500" cy="500" r="60" fill="${C.primary}"/><text x="500" y="520" text-anchor="middle" fill="${C.white}" font-size="60" font-weight="900" font-family="Arial">🧠</text></svg>`;
}

// 3. Data wave
function dataWave(seed) {
  let path = `M 0 500`;
  for (let x = 0; x <= 1000; x += 20) {
    const y = 500 + Math.sin((x + seed) * 0.02) * 150 + Math.cos((x + seed) * 0.05) * 50;
    path += ` L ${x} ${y}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="${C.bg}"/><path d="${path}" fill="none" stroke="${C.primary}" stroke-width="6"/><path d="${path} L 1000 1000 L 0 1000 Z" fill="${C.primary}" opacity="0.2"/><circle cx="500" cy="500" r="20" fill="${C.accent}"/></svg>`;
}

// 4. Skill icons grid
function skillGrid() {
  const skills = ['💻', '🎨', '🎵', '📸', '✍️', '🎤', '🔬', '🌍', '🍳', '🎮', '🎬', '📐', '🤖', '📊', '🔐', '☁️'];
  let icons = '';
  for (let i = 0; i < 16; i++) {
    const col = i % 4; const row = Math.floor(i / 4);
    const x = 150 + col * 200; const y = 150 + row * 200;
    icons += `<g transform="translate(${x},${y})"><rect x="-70" y="-70" width="140" height="140" rx="20" fill="${C.gray}" stroke="${C.accent}" stroke-width="2"/><text x="0" y="20" text-anchor="middle" font-size="70">${skills[i]}</text></g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="${C.bg}"/>${icons}</svg>`;
}

// 5. Phone-to-skill transformation
function phoneToSkill() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600">
    <rect width="1000" height="600" fill="${C.bg}"/>
    <!-- Phone -->
    <g transform="translate(100,150)">
      <rect x="0" y="0" width="200" height="350" rx="30" fill="${C.gray}" stroke="${C.accent}" stroke-width="3"/>
      <rect x="15" y="40" width="170" height="270" rx="5" fill="${C.bg}"/>
      <circle cx="100" cy="335" r="8" fill="${C.accent}"/>
      <text x="100" y="180" text-anchor="middle" font-size="80">📱</text>
    </g>
    <!-- Transformation particles -->
    ${Array.from({length: 30}, (_, i) => `<circle cx="${300 + i*10}" cy="${300 + Math.sin(i)*80}" r="3" fill="${C.secondary}"/>`).join('')}
    <!-- Skills -->
    <g transform="translate(700,150)">
      <text x="0" y="50" font-size="60">💻</text>
      <text x="0" y="130" font-size="60">🎨</text>
      <text x="0" y="210" font-size="60">🎵</text>
      <text x="0" y="290" font-size="60">📚</text>
    </g>
    <text x="500" y="50" text-anchor="middle" font-size="30" fill="${C.white}" font-weight="700" font-family="Arial">SCREEN → SKILL</text>
  </svg>`;
}

// 6. Stats dashboard
function statsDashboard() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600">
    <rect width="1000" height="600" fill="${C.bg}"/>
    <rect x="50" y="50" width="900" height="500" rx="20" fill="${C.gray}" opacity="0.3"/>
    <!-- Bar chart -->
    ${[120, 180, 90, 240, 160, 200, 280].map((h, i) => `<rect x="${100 + i*100}" y="${450 - h}" width="60" height="${h}" fill="${C.primary}" rx="5"/>`).join('')}
    <!-- Line chart -->
    <polyline points="100,200 250,150 400,180 550,100 700,130 850,80" fill="none" stroke="${C.accent}" stroke-width="4"/>
    <circle cx="850" cy="80" r="8" fill="${C.accent}"/>
    <!-- Pie chart -->
    <circle cx="800" cy="450" r="60" fill="${C.secondary}"/>
    <path d="M 800 450 L 800 390 A 60 60 0 0 1 856 470 Z" fill="${C.primary}"/>
    <!-- Title -->
    <text x="500" y="30" text-anchor="middle" font-size="24" fill="${C.white}" font-weight="900" font-family="Arial">REAL-TIME ANALYTICS</text>
  </svg>`;
}

// 7. Particle field
function particleField() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
    <rect width="1000" height="1000" fill="${C.bg}"/>
    ${Array.from({length: 200}, () => {
      const x = randInt(0, 1000); const y = randInt(0, 1000); const r = rand(0.5, 3);
      const colors = [C.primary, C.secondary, C.accent, C.white];
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${pick(colors)}" opacity="${rand(0.3, 1)}"/>`;
    }).join('')}
  </svg>`;
}

// 8. Logo variants
function logoVariant(variant) {
  const center = 500;
  if (variant === 1) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
      <rect width="1000" height="1000" fill="${C.bg}"/>
      <circle cx="${center}" cy="${center}" r="300" fill="none" stroke="${C.primary}" stroke-width="20"/>
      <circle cx="${center}" cy="${center}" r="200" fill="none" stroke="${C.accent}" stroke-width="15"/>
      <circle cx="${center}" cy="${center}" r="100" fill="${C.primary}"/>
      <text x="${center}" y="${center+30}" text-anchor="middle" font-size="80" fill="${C.white}" font-weight="900" font-family="Arial">SV</text>
    </svg>`;
  } else if (variant === 2) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
      <rect width="1000" height="1000" fill="${C.bg}"/>
      <polygon points="${center},200 ${center+260},${center-100} ${center+160},${center+200} ${center-160},${center+200} ${center-260},${center-100}" fill="${C.primary}"/>
      <text x="${center}" y="${center+30}" text-anchor="middle" font-size="100" fill="${C.white}" font-weight="900" font-family="Arial">SV</text>
    </svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
      <rect width="1000" height="1000" fill="${C.bg}"/>
      <rect x="${center-200}" y="${center-200}" width="400" height="400" fill="none" stroke="${C.accent}" stroke-width="20" transform="rotate(45 ${center} ${center})"/>
      <rect x="${center-150}" y="${center-150}" width="300" height="300" fill="${C.primary}" transform="rotate(45 ${center} ${center})"/>
      <text x="${center}" y="${center+20}" text-anchor="middle" font-size="60" fill="${C.white}" font-weight="900" font-family="Arial">SV</text>
    </svg>`;
  }
}

// 9. Section divider
function divider(seed) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 100">
    <rect width="2000" height="100" fill="${C.bg}"/>
    <path d="M 0 50 ${Array.from({length: 20}, (_, i) => `L ${i*100 + 50 + Math.sin((i+seed)*0.5)*30} ${50 + Math.cos((i+seed)*0.5)*30}`).join(' ')}" fill="none" stroke="${C.accent}" stroke-width="2"/>
    ${Array.from({length: 21}, (_, i) => `<circle cx="${i*100}" cy="50" r="3" fill="${C.primary}"/>`).join('')}
  </svg>`;
}

// 10. AI neural net
function neuralNet() {
  const layers = [3, 5, 5, 3];
  const positions = [];
  layers.forEach((count, lIdx) => {
    for (let i = 0; i < count; i++) {
      positions.push({ x: 150 + lIdx * 230, y: 100 + (i + 1) * (800 / (count + 1)), layer: lIdx });
    }
  });
  let lines = '';
  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length; j++) {
      if (positions[j].layer === positions[i].layer + 1) {
        lines += `<line x1="${positions[i].x}" y1="${positions[i].y}" x2="${positions[j].x}" y2="${positions[j].y}" stroke="${C.accent}" stroke-width="0.5" opacity="0.3"/>`;
      }
    }
  }
  let circles = positions.map(p => {
    const color = p.layer === 0 ? C.primary : p.layer === layers.length-1 ? C.secondary : C.accent;
    return `<circle cx="${p.x}" cy="${p.y}" r="20" fill="${color}"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="${C.bg}"/>${lines}${circles}<text x="500" y="50" text-anchor="middle" font-size="24" fill="${C.white}" font-weight="900" font-family="Arial">NEURAL NETWORK</text></svg>`;
}

// 11. World map dots
function worldMap() {
  const cities = [[200,300],[300,250],[400,400],[500,350],[600,300],[700,450],[800,200],[150,400],[350,500],[450,200],[550,500],[650,250],[750,300],[250,150],[450,150],[550,150],[180,450],[820,450]];
  let dots = cities.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.accent}"/>`).join('');
  let lines = '';
  for (let i = 0; i < cities.length; i++) {
    for (let j = i+1; j < cities.length; j++) {
      if (Math.random() < 0.3) {
        lines += `<line x1="${cities[i][0]}" y1="${cities[i][1]}" x2="${cities[j][0]}" y2="${cities[j][1]}" stroke="${C.primary}" stroke-width="0.5" opacity="0.5"/>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600"><rect width="1000" height="600" fill="${C.bg}"/>${lines}${dots}<text x="500" y="50" text-anchor="middle" font-size="24" fill="${C.white}" font-weight="900" font-family="Arial">GLOBAL DATA</text></svg>`;
}

// 12. Loading spinner
function loadingSpinner() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="80" fill="none" stroke="${C.gray}" stroke-width="8"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="${C.primary}" stroke-width="8" stroke-dasharray="150 400" transform="rotate(-90 100 100)"/>
    <text x="100" y="110" text-anchor="middle" font-size="24" fill="${C.white}" font-weight="900" font-family="Arial">SV</text>
  </svg>`;
}

// 13. Stacked cards
function stackedCards() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="${C.bg}"/>
    <rect x="150" y="100" width="300" height="200" rx="15" fill="${C.gray}" transform="rotate(-5 300 200)"/>
    <rect x="160" y="110" width="300" height="200" rx="15" fill="${C.gray}" transform="rotate(2 310 210)" stroke="${C.accent}" stroke-width="2"/>
    <rect x="170" y="120" width="300" height="200" rx="15" fill="${C.bg}" stroke="${C.primary}" stroke-width="3"/>
    <text x="320" y="220" text-anchor="middle" font-size="20" fill="${C.white}" font-weight="700" font-family="Arial">CARD 1</text>
  </svg>`;
}

// 14. Mountain (line graph style)
function mountains() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600">
    <rect width="1000" height="600" fill="${C.bg}"/>
    <polyline points="0,400 200,200 400,350 600,150 800,300 1000,100" fill="none" stroke="${C.primary}" stroke-width="6"/>
    <polyline points="0,500 150,300 350,450 550,250 750,400 1000,200" fill="none" stroke="${C.accent}" stroke-width="4" opacity="0.7"/>
  </svg>`;
}

// 15. Eye (vision)
function eye() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="${C.bg}"/>
    <ellipse cx="300" cy="200" rx="200" ry="120" fill="none" stroke="${C.primary}" stroke-width="6"/>
    <circle cx="300" cy="200" r="80" fill="${C.bg}" stroke="${C.accent}" stroke-width="4"/>
    <circle cx="300" cy="200" r="40" fill="${C.primary}"/>
    <circle cx="300" cy="200" r="15" fill="${C.bg}"/>
  </svg>`;
}

const generators = [
  { name: 'geo', fn: () => geometricPattern(randInt(8, 40)) },
  { name: 'brain', fn: brainNetwork },
  { name: 'wave', fn: () => dataWave(randInt(0, 1000)) },
  { name: 'grid', fn: skillGrid },
  { name: 'phone', fn: phoneToSkill },
  { name: 'stats', fn: statsDashboard },
  { name: 'particles', fn: particleField },
  { name: 'logo1', fn: () => logoVariant(1) },
  { name: 'logo2', fn: () => logoVariant(2) },
  { name: 'logo3', fn: () => logoVariant(3) },
  { name: 'divider', fn: () => divider(randInt(0, 100)) },
  { name: 'neural', fn: neuralNet },
  { name: 'world', fn: worldMap },
  { name: 'spinner', fn: loadingSpinner },
  { name: 'cards', fn: stackedCards },
  { name: 'mountains', fn: mountains },
  { name: 'eye', fn: eye },
];

const total = 250;
console.log(`Generating ${total} SVGs...`);
for (let i = 0; i < total; i++) {
  const gen = generators[i % generators.length];
  const svg = gen.fn();
  const filename = `${String(i).padStart(3, '0')}-${gen.name}.svg`;
  writeFileSync(join(outDir, filename), svg);
  if (i % 25 === 0) console.log(`  ${i}/${total}`);
}
console.log('DONE');
