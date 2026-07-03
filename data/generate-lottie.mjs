// Generate complex Lottie JSON animations
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'lottie');
mkdirSync(outDir, { recursive: true });

function shapeGroup(color) {
  return [
    { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, nm: "el" },
    { ty: "fl", c: { a: 0, k: color }, o: { a: 0, k: 100 }, nm: "fill" },
    { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
  ];
}

function lottieLoader() {
  const layers = [];
  for (let i = 0; i < 12; i++) {
    layers.push({
      ddd: 0, ind: i + 1, ty: 4, nm: "ring" + i,
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ t: 0, s: [i * 30], h: 0 }, { t: 90, s: [i * 30 + 360], h: 0 }] },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [
          { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [300 - i * 20, 300 - i * 20] }, nm: "ellipse" },
          { ty: "st", c: { a: 0, k: [1, 0.24, 0.18, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 4 }, lc: 2, lj: 2, nm: "stroke" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ]
      }],
      ip: 0, op: 90, st: 0, bm: 0
    });
  }
  return { v: "5.7.0", fr: 30, ip: 0, op: 90, w: 400, h: 400, nm: "loader", ddd: 0, assets: [], layers: layers };
}

function lottiePulse() {
  const layers = [];
  for (let i = 0; i < 5; i++) {
    layers.push({
      ddd: 0, ind: i + 1, ty: 4, nm: "pulse" + i,
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], h: 0 }, { t: 30, s: [100], h: 0 }, { t: 60, s: [0], h: 0 }] },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [20, 20, 100], h: 0 }, { t: 60, s: [200, 200, 100], h: 0 }] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [
          { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, nm: "el" },
          { ty: "fl", c: { a: 0, k: [i === 0 ? 1 : 0, i === 0 ? 0.24 : 0.88, i === 0 ? 0.18 : 1, 1] }, o: { a: 0, k: 100 }, nm: "fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ]
      }],
      ip: 0, op: 60, st: i * 10, bm: 0
    });
  }
  return { v: "5.7.0", fr: 60, ip: 0, op: 60, w: 400, h: 400, nm: "pulse", ddd: 0, assets: [], layers: layers };
}

function lottieBarchart() {
  const layers = [];
  const heights = [80, 150, 120, 200, 180, 90, 220];
  for (let i = 0; i < 7; i++) {
    layers.push({
      ddd: 0, ind: i + 1, ty: 4, nm: "bar" + i,
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 1, k: [{ t: 0, s: [80 + i * 60, 380, 0], h: 0 }, { t: 30, s: [80 + i * 60, 380 - heights[i], 0], h: 0 }] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [
          { ty: "rc", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [40, 200] }, r: { a: 0, k: 5 }, nm: "rect" },
          { ty: "fl", c: { a: 0, k: [1, 0.24, 0.18, 1] }, o: { a: 0, k: 100 }, nm: "fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ]
      }],
      ip: 0, op: 60, st: 0, bm: 0
    });
  }
  return { v: "5.7.0", fr: 30, ip: 0, op: 60, w: 500, h: 400, nm: "barchart", ddd: 0, assets: [], layers: layers };
}

function lottieCheckmark() {
  return {
    v: "5.7.0", fr: 60, ip: 0, op: 60, w: 200, h: 200, nm: "check", ddd: 0, assets: [],
    layers: [
      {
        ddd: 0, ind: 1, ty: 4, nm: "check", sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ t: 0, s: [0, 0, 100], h: 0 }, { t: 30, s: [120, 120, 100], h: 0 }, { t: 45, s: [100, 100, 100], h: 0 }] }
        },
        ao: 0,
        shapes: [{ ty: "gr", it: shapeGroup([0.06, 0.88, 0.63, 1]) }],
        ip: 0, op: 60, st: 0, bm: 0
      }
    ]
  };
}

function lottieRocket() {
  return {
    v: "5.7.0", fr: 30, ip: 0, op: 120, w: 400, h: 600, nm: "rocket", ddd: 0, assets: [],
    layers: [{
      ddd: 0, ind: 1, ty: 4, nm: "rocket", sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 1, k: [{ t: 0, s: [200, 500, 0], h: 0 }, { t: 60, s: [200, 100, 0], h: 0 }, { t: 120, s: [200, 500, 0], h: 0 }] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [
          { ty: "rc", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [60, 200] }, r: { a: 0, k: 30 }, nm: "body" },
          { ty: "fl", c: { a: 0, k: [1, 0.24, 0.18, 1] }, o: { a: 0, k: 100 }, nm: "fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ]
      }],
      ip: 0, op: 120, st: 0, bm: 0
    }]
  };
}

const lotties = [
  { name: 'loader.json', data: lottieLoader() },
  { name: 'pulse.json', data: lottiePulse() },
  { name: 'barchart.json', data: lottieBarchart() },
  { name: 'checkmark.json', data: lottieCheckmark() },
  { name: 'rocket.json', data: lottieRocket() }
];

for (let i = 0; i < 30; i++) {
  const base = lotties[i % lotties.length];
  const variant = JSON.parse(JSON.stringify(base.data));
  variant.nm = base.name.replace('.json', '') + "-var" + i;
  lotties.push({ name: 'var-' + i + '-' + base.name, data: variant });
}

let total = 0;
for (const l of lotties) {
  const json = JSON.stringify(l.data);
  writeFileSync(join(outDir, l.name), json);
  total += json.length;
}
console.log("Generated " + lotties.length + " Lottie files, total " + (total / 1024 / 1024).toFixed(1) + "MB");
