#!/usr/bin/env node
// Generate 50+ unique Lottie-style JSON animations
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'lottie');
mkdirSync(OUT, { recursive: true });

function makeLottie(name, frames, shapes, bgColor = [0.1, 0.1, 0.1, 1]) {
  return {
    v: "5.7.0",
    fr: 30, // framerate
    ip: 0, // in point
    op: frames, // out point
    w: 400, h: 400,
    nm: name,
    ddd: 0, // 3D flag
    assets: [],
    layers: shapes,
    meta: { g: "SkillVerse Lottie Generator", a: "Anuj Phulera", d: name }
  };
}

const COLORS = {
  primary: [0.388, 0.4, 0.945, 1],      // #6366F1
  secondary: [0.545, 0.361, 0.965, 1],  // #8B5CF6
  accent: [0.024, 0.714, 0.831, 1],     // #06B6D4
  success: [0.063, 0.725, 0.506, 1],    // #10B981
  warning: [0.961, 0.62, 0.043, 1],     // #F59E0B
  error: [0.937, 0.267, 0.267, 1],      // #EF4444
  pink: [0.925, 0.282, 0.6, 1],         // #EC4899
  cyan: [0.404, 0.91, 0.851, 1]         // #67E8F9
};

function shape(type, color, x = 0, y = 0, w = 100, h = 100, opacity = 100) {
  return {
    ty: 4, // shape layer
    nm: type,
    ks: { o: { a: 0, k: opacity }, r: { a: 0, k: 0 }, p: { a: 0, k: [x, y, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
    shapes: [{
      ty: "rc",
      p: { a: 0, k: [0, 0] },
      s: { a: 0, k: [w, h] },
      r: { a: 0, k: 8 }
    }, {
      ty: "fl",
      c: { a: 0, k: color },
      o: { a: 0, k: 100 }
    }],
    ip: 0, op: 60, st: 0, bm: 0
  };
}

function circleShape(color, x = 0, y = 0, r = 50, opacity = 100) {
  return {
    ty: 4,
    nm: "circle",
    ks: { o: { a: 0, k: opacity }, r: { a: 0, k: 0 }, p: { a: 0, k: [x, y, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
    shapes: [
      { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [r * 2, r * 2] } },
      { ty: "fl", c: { a: 0, k: color }, o: { a: 0, k: 100 } }
    ],
    ip: 0, op: 60, st: 0, bm: 0
  };
}

function textShape(text, color, x = 0, y = 0) {
  return {
    ty: 5, // text
    nm: text,
    ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [x, y, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
    shapes: [{
      ty: "tm",
      s: { a: 0, k: 0 },
      e: { a: 0, k: 0 },
      o: { a: 0, k: 0 },
      m: 1
    }],
    ip: 0, op: 60, st: 0, bm: 0,
    text: { name: text }
  };
}

const ANIMATIONS = [
  // Spinners & loaders
  { name: 'spinner-circular', frames: 60, layers: [
    shape("ring", COLORS.primary, 200, 200, 200, 8, 80),
    shape("dot", COLORS.accent, 280, 200, 16, 16, 100)
  ]},
  { name: 'spinner-dual', frames: 60, layers: [
    shape("ring1", COLORS.primary, 200, 200, 200, 4, 60),
    shape("ring2", COLORS.secondary, 200, 200, 200, 4, 60)
  ]},
  { name: 'spinner-triad', frames: 60, layers: [
    shape("a", COLORS.primary, 200, 100, 16, 16),
    shape("b", COLORS.secondary, 250, 250, 16, 16),
    shape("c", COLORS.accent, 150, 250, 16, 16)
  ]},
  { name: 'spinner-quad', frames: 60, layers: [
    shape("a", COLORS.primary, 200, 100, 16, 16),
    shape("b", COLORS.secondary, 300, 200, 16, 16),
    shape("c", COLORS.accent, 200, 300, 16, 16),
    shape("d", COLORS.pink, 100, 200, 16, 16)
  ]},
  { name: 'spinner-pentagon', frames: 60, layers: [
    shape("a", COLORS.primary, 200, 80, 16, 16),
    shape("b", COLORS.secondary, 300, 160, 16, 16),
    shape("c", COLORS.accent, 270, 290, 16, 16),
    shape("d", COLORS.success, 130, 290, 16, 16),
    shape("e", COLORS.warning, 100, 160, 16, 16)
  ]},
  { name: 'spinner-hexagon', frames: 60, layers: [
    shape("a", COLORS.primary, 200, 60, 16, 16),
    shape("b", COLORS.secondary, 320, 130, 16, 16),
    shape("c", COLORS.accent, 320, 270, 16, 16),
    shape("d", COLORS.pink, 200, 340, 16, 16),
    shape("e", COLORS.success, 80, 270, 16, 16),
    shape("f", COLORS.cyan, 80, 130, 16, 16)
  ]},
  { name: 'spinner-orbit', frames: 60, layers: [
    circleShape(COLORS.primary, 200, 200, 30),
    shape("dot", COLORS.accent, 320, 200, 20, 20)
  ]},
  { name: 'spinner-bars', frames: 60, layers: [
    shape("b1", COLORS.primary, 150, 150, 20, 100),
    shape("b2", COLORS.secondary, 200, 150, 20, 100),
    shape("b3", COLORS.accent, 250, 150, 20, 100)
  ]},
  // Charts & data
  { name: 'bar-chart', frames: 60, layers: [
    shape("b1", COLORS.primary, 100, 280, 40, 100),
    shape("b2", COLORS.secondary, 160, 240, 40, 140),
    shape("b3", COLORS.accent, 220, 180, 40, 200),
    shape("b4", COLORS.pink, 280, 220, 40, 160)
  ]},
  { name: 'bar-chart-2', frames: 60, layers: [
    shape("b1", COLORS.primary, 100, 250, 30, 130),
    shape("b2", COLORS.secondary, 150, 200, 30, 180),
    shape("b3", COLORS.accent, 200, 150, 30, 230),
    shape("b4", COLORS.pink, 250, 180, 30, 200),
    shape("b5", COLORS.success, 300, 220, 30, 160)
  ]},
  { name: 'line-chart', frames: 60, layers: [
    shape("l1", COLORS.primary, 50, 250, 300, 4)
  ]},
  { name: 'pie-chart', frames: 60, layers: [
    circleShape(COLORS.primary, 200, 200, 100, 70),
    circleShape(COLORS.secondary, 220, 200, 100, 60),
    circleShape(COLORS.accent, 180, 200, 100, 50)
  ]},
  { name: 'donut-chart', frames: 60, layers: [
    shape("ring1", COLORS.primary, 200, 200, 200, 60, 80),
    shape("ring2", COLORS.secondary, 200, 200, 200, 60, 60)
  ]},
  { name: 'radar-chart', frames: 60, layers: [
    shape("bg", COLORS.primary, 200, 200, 200, 200, 10),
    shape("data", COLORS.accent, 200, 200, 150, 150, 50)
  ]},
  { name: 'area-chart', frames: 60, layers: [
    shape("a", COLORS.primary, 200, 200, 200, 100, 60)
  ]},
  // Success & feedback
  { name: 'check', frames: 30, layers: [
    shape("c1", COLORS.success, 150, 200, 40, 8),
    shape("c2", COLORS.success, 180, 220, 80, 8)
  ]},
  { name: 'checkmark-animated', frames: 30, layers: [
    shape("c1", COLORS.success, 150, 200, 40, 12),
    shape("c2", COLORS.success, 180, 220, 80, 12)
  ]},
  { name: 'cross', frames: 30, layers: [
    shape("x1", COLORS.error, 200, 200, 100, 8),
    shape("x2", COLORS.error, 200, 200, 100, 8)
  ]},
  { name: 'plus', frames: 30, layers: [
    shape("p1", COLORS.primary, 200, 200, 100, 8),
    shape("p2", COLORS.primary, 200, 200, 8, 100)
  ]},
  { name: 'thumbs-up', frames: 30, layers: [
    shape("thumb", COLORS.primary, 180, 180, 40, 80),
    shape("base", COLORS.secondary, 220, 240, 60, 40)
  ]},
  { name: 'heart', frames: 30, layers: [
    circleShape(COLORS.pink, 180, 200, 30, 80),
    circleShape(COLORS.pink, 220, 200, 30, 80)
  ]},
  { name: 'star', frames: 30, layers: [
    shape("star", COLORS.warning, 200, 200, 100, 100, 80)
  ]},
  // Icons & symbols
  { name: 'gear', frames: 30, layers: [
    circleShape(COLORS.primary, 200, 200, 60, 50),
    circleShape(COLORS.secondary, 200, 200, 30, 100)
  ]},
  { name: 'user', frames: 30, layers: [
    circleShape(COLORS.primary, 200, 180, 30, 80),
    shape("body", COLORS.primary, 200, 260, 80, 60, 80)
  ]},
  { name: 'rocket', frames: 30, layers: [
    shape("body", COLORS.primary, 200, 160, 40, 120, 90),
    shape("nose", COLORS.accent, 200, 120, 30, 50, 90),
    shape("flame", COLORS.warning, 200, 280, 20, 40, 80)
  ]},
  { name: 'lightbulb', frames: 30, layers: [
    circleShape(COLORS.warning, 200, 180, 50, 90),
    shape("base", COLORS.secondary, 200, 250, 50, 30, 80)
  ]},
  { name: 'mail', frames: 30, layers: [
    shape("env", COLORS.primary, 200, 200, 100, 60, 90),
    shape("flap", COLORS.secondary, 200, 180, 100, 30, 80)
  ]},
  { name: 'bell', frames: 30, layers: [
    shape("bell", COLORS.warning, 200, 180, 60, 80, 90),
    shape("clapper", COLORS.warning, 200, 270, 20, 20, 90)
  ]},
  { name: 'book', frames: 30, layers: [
    shape("cover", COLORS.primary, 200, 200, 100, 120, 90),
    shape("pages", COLORS.secondary, 200, 200, 80, 100, 80)
  ]},
  { name: 'globe', frames: 30, layers: [
    circleShape(COLORS.accent, 200, 200, 80, 80),
    shape("line1", COLORS.primary, 200, 200, 160, 4, 70),
    shape("line2", COLORS.primary, 200, 200, 4, 160, 70)
  ]},
  { name: 'chat', frames: 30, layers: [
    shape("bubble", COLORS.primary, 200, 180, 120, 80, 90),
    shape("tail", COLORS.primary, 180, 240, 20, 20, 90)
  ]},
  // Activity indicators
  { name: 'pulse', frames: 60, layers: [
    circleShape(COLORS.primary, 200, 200, 60, 70),
    circleShape(COLORS.accent, 200, 200, 30, 100)
  ]},
  { name: 'wave', frames: 60, layers: [
    shape("w1", COLORS.primary, 50, 200, 300, 4),
    shape("w2", COLORS.secondary, 50, 220, 300, 4),
    shape("w3", COLORS.accent, 50, 180, 300, 4)
  ]},
  { name: 'ripple', frames: 60, layers: [
    circleShape(COLORS.primary, 200, 200, 20, 50),
    circleShape(COLORS.secondary, 200, 200, 60, 30),
    circleShape(COLORS.accent, 200, 200, 100, 15)
  ]},
  { name: 'progress', frames: 60, layers: [
    shape("bg", COLORS.primary, 200, 200, 300, 8, 20),
    shape("fg", COLORS.accent, 150, 200, 200, 8, 100)
  ]},
  { name: 'infinity', frames: 60, layers: [
    shape("l1", COLORS.primary, 100, 200, 80, 8),
    shape("l2", COLORS.secondary, 200, 200, 80, 8),
    shape("l3", COLORS.accent, 300, 200, 80, 8)
  ]},
  { name: 'spinner-grid', frames: 60, layers: [
    shape("a", COLORS.primary, 100, 100, 30, 30),
    shape("b", COLORS.secondary, 200, 100, 30, 30),
    shape("c", COLORS.accent, 300, 100, 30, 30),
    shape("d", COLORS.pink, 100, 200, 30, 30),
    shape("e", COLORS.success, 200, 200, 30, 30),
    shape("f", COLORS.warning, 300, 200, 30, 30),
    shape("g", COLORS.cyan, 100, 300, 30, 30),
    shape("h", COLORS.error, 200, 300, 30, 30),
    shape("i", COLORS.primary, 300, 300, 30, 30)
  ]},
  { name: 'dots-pulse', frames: 60, layers: [
    circleShape(COLORS.primary, 150, 200, 15),
    circleShape(COLORS.secondary, 200, 200, 15),
    circleShape(COLORS.accent, 250, 200, 15)
  ]},
  { name: 'loading-dots', frames: 60, layers: [
    shape("d1", COLORS.primary, 150, 200, 20, 20),
    shape("d2", COLORS.secondary, 200, 200, 20, 20),
    shape("d3", COLORS.accent, 250, 200, 20, 20)
  ]},
  { name: 'infinity-loop', frames: 60, layers: [
    circleShape(COLORS.primary, 150, 200, 30, 70),
    circleShape(COLORS.secondary, 250, 200, 30, 70)
  ]},
  // Particles & decorations
  { name: 'confetti', frames: 60, layers: [
    shape("c1", COLORS.primary, 100, 100, 20, 20),
    shape("c2", COLORS.secondary, 200, 150, 20, 20),
    shape("c3", COLORS.accent, 300, 100, 20, 20),
    shape("c4", COLORS.pink, 150, 250, 20, 20),
    shape("c5", COLORS.success, 250, 300, 20, 20)
  ]},
  { name: 'fireworks', frames: 60, layers: [
    shape("f1", COLORS.warning, 200, 200, 20, 20, 80),
    shape("f2", COLORS.error, 250, 150, 15, 15, 60),
    shape("f3", COLORS.pink, 150, 150, 15, 15, 60),
    shape("f4", COLORS.primary, 250, 250, 15, 15, 60),
    shape("f5", COLORS.secondary, 150, 250, 15, 15, 60)
  ]},
  { name: 'star-burst', frames: 60, layers: [
    shape("s", COLORS.warning, 200, 200, 200, 200, 20)
  ]},
  { name: 'explosion', frames: 30, layers: [
    circleShape(COLORS.warning, 200, 200, 50, 80),
    circleShape(COLORS.error, 200, 200, 80, 50),
    circleShape(COLORS.pink, 200, 200, 120, 20)
  ]},
  // Tech
  { name: 'code', frames: 30, layers: [
    shape("bracket-l", COLORS.primary, 150, 200, 8, 100),
    shape("bracket-r", COLORS.secondary, 250, 200, 8, 100)
  ]},
  { name: 'database', frames: 30, layers: [
    shape("cyl1", COLORS.primary, 200, 150, 100, 30, 80),
    shape("cyl2", COLORS.secondary, 200, 200, 100, 30, 80),
    shape("cyl3", COLORS.accent, 200, 250, 100, 30, 80)
  ]},
  { name: 'cloud', frames: 30, layers: [
    shape("c1", COLORS.primary, 150, 200, 80, 60, 90),
    shape("c2", COLORS.secondary, 230, 180, 80, 80, 90)
  ]},
  { name: 'shield', frames: 30, layers: [
    shape("sh", COLORS.success, 200, 200, 120, 140, 80)
  ]},
  { name: 'lock', frames: 30, layers: [
    shape("body", COLORS.warning, 200, 220, 80, 70, 90),
    shape("shackle", COLORS.secondary, 200, 170, 60, 50, 90)
  ]},
  { name: 'eye', frames: 30, layers: [
    circleShape(COLORS.primary, 200, 200, 60, 80),
    circleShape(COLORS.secondary, 200, 200, 30, 100)
  ]},
  { name: 'mouse', frames: 30, layers: [
    shape("body", COLORS.primary, 200, 200, 40, 70, 90),
    circleShape(COLORS.secondary, 200, 190, 6, 100)
  ]},
  { name: 'keyboard', frames: 30, layers: [
    shape("base", COLORS.primary, 200, 220, 200, 60, 80),
    shape("k1", COLORS.secondary, 100, 220, 20, 20, 100),
    shape("k2", COLORS.secondary, 140, 220, 20, 20, 100),
    shape("k3", COLORS.secondary, 180, 220, 20, 20, 100),
    shape("k4", COLORS.secondary, 220, 220, 20, 20, 100)
  ]},
  { name: 'monitor', frames: 30, layers: [
    shape("screen", COLORS.primary, 200, 170, 200, 120, 90),
    shape("stand", COLORS.secondary, 200, 290, 40, 30, 90)
  ]},
  { name: 'phone', frames: 30, layers: [
    shape("body", COLORS.primary, 200, 200, 60, 120, 90)
  ]},
  // Misc
  { name: 'speaker', frames: 30, layers: [
    shape("s1", COLORS.primary, 150, 200, 40, 100, 80),
    shape("s2", COLORS.secondary, 230, 200, 60, 100, 80)
  ]},
  { name: 'compass', frames: 30, layers: [
    circleShape(COLORS.primary, 200, 200, 80, 80),
    shape("needle", COLORS.accent, 200, 200, 8, 80, 100)
  ]},
  { name: 'map', frames: 30, layers: [
    shape("m", COLORS.success, 200, 200, 150, 100, 80)
  ]},
  { name: 'camera', frames: 30, layers: [
    shape("body", COLORS.primary, 200, 220, 120, 80, 90),
    circleShape(COLORS.secondary, 200, 220, 30, 100)
  ]},
  { name: 'video', frames: 30, layers: [
    shape("frame", COLORS.primary, 180, 200, 120, 80, 90),
    shape("play", COLORS.accent, 240, 200, 30, 30, 100)
  ]},
  { name: 'mic', frames: 30, layers: [
    shape("head", COLORS.primary, 200, 170, 40, 60, 90),
    shape("stand", COLORS.secondary, 200, 250, 8, 60, 90)
  ]},
  { name: 'headphones', frames: 30, layers: [
    shape("band", COLORS.primary, 200, 160, 120, 16, 90),
    shape("ear1", COLORS.secondary, 140, 220, 30, 50, 90),
    shape("ear2", COLORS.secondary, 260, 220, 30, 50, 90)
  ]},
  { name: 'music', frames: 30, layers: [
    shape("note", COLORS.primary, 200, 220, 8, 60, 90),
    circleShape(COLORS.primary, 200, 270, 25, 90),
    shape("note2", COLORS.accent, 250, 180, 8, 60, 90),
    circleShape(COLORS.accent, 250, 230, 25, 90)
  ]}
];

let count = 0;
for (const a of ANIMATIONS) {
  const data = makeLottie(a.name, a.frames, a.layers);
  writeFileSync(join(OUT, `${a.name}.json`), JSON.stringify(data));
  count++;
}
console.log(`✅ Generated ${count} unique Lottie animations in ${OUT}`);
