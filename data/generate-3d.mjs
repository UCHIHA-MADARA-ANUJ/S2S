#!/usr/bin/env node
// Generate 3D models as JSON (vertex data) - lightweight format
// Real GLB files would be binary - this is procedural data
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', '3d');
mkdirSync(OUT, { recursive: true });

// Sphere
function sphere(radius, segments) {
  const vertices = [];
  const indices = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i * Math.PI) / segments;
    for (let j = 0; j <= segments; j++) {
      const phi = (j * 2 * Math.PI) / segments;
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.cos(theta);
      const z = radius * Math.sin(theta) * Math.sin(phi);
      vertices.push(x, y, z);
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + j;
      const b = a + segments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { vertices, indices, format: 'spherical' };
}

// Cube
function cube(size) {
  const s = size / 2;
  const v = [
    -s,-s,-s,  s,-s,-s,  s, s,-s, -s, s,-s,
    -s,-s, s,  s,-s, s,  s, s, s, -s, s, s
  ];
  const i = [
    0,1,2, 0,2,3,  4,6,5, 4,7,6,
    0,4,5, 0,5,1,  2,6,7, 2,7,3,
    1,5,6, 1,6,2,  0,3,7, 0,7,4
  ];
  return { vertices: v, indices: i, format: 'cubic' };
}

// Torus
function torus(R, r, segA, segB) {
  const v = [];
  const i = [];
  for (let a = 0; a <= segA; a++) {
    const u = (a / segA) * Math.PI * 2;
    for (let b = 0; b <= segB; b++) {
      const w = (b / segB) * Math.PI * 2;
      const x = (R + r * Math.cos(w)) * Math.cos(u);
      const y = (R + r * Math.cos(w)) * Math.sin(u);
      const z = r * Math.sin(w);
      v.push(x, y, z);
    }
  }
  for (let a = 0; a < segA; a++) {
    for (let b = 0; b < segB; b++) {
      const A = a * (segB + 1) + b;
      const B = (a + 1) * (segB + 1) + b;
      const C = (a + 1) * (segB + 1) + b + 1;
      const D = a * (segB + 1) + b + 1;
      i.push(A, B, D, B, C, D);
    }
  }
  return { vertices: v, indices: i, format: 'torus' };
}

// Icosphere (geodesic)
function icosphere(radius, subdivisions) {
  const t = (1 + Math.sqrt(5)) / 2;
  let v = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
  ];
  let i = [
    0,11,5, 0,5,1, 0,1,7, 0,7,10, 0,10,11,
    1,5,9, 5,11,4, 11,10,2, 10,7,6, 7,1,8,
    3,9,4, 3,4,2, 3,2,6, 3,6,8, 3,8,9,
    4,9,5, 2,4,11, 6,2,10, 8,6,7, 9,8,1
  ];
  for (let s = 0; s < subdivisions; s++) {
    const newI = [];
    const midCache = new Map();
    const getMid = (a, b) => {
      const key = Math.min(a, b) + '_' + Math.max(a, b);
      if (midCache.has(key)) return midCache.get(key);
      const va = v[a], vb = v[b];
      const mid = [(va[0]+vb[0])/2, (va[1]+vb[1])/2, (va[2]+vb[2])/2];
      const len = Math.sqrt(mid[0]**2+mid[1]**2+mid[2]**2);
      mid[0] *= radius/len; mid[1] *= radius/len; mid[2] *= radius/len;
      v.push(mid);
      const idx = v.length - 1;
      midCache.set(key, idx);
      return idx;
    };
    const T = []; for (let k = 0; k < i.length; k += 3) T.push([i[k], i[k+1], i[k+2]]);
  for (const [a, b, c] of T) {
      const ab = getMid(a, b);
      const bc = getMid(b, c);
      const ca = getMid(c, a);
      newI.push(a, ab, ca, b, bc, ab, c, ca, bc, ab, bc, ca);
    }
    i = newI;
  }
  // Normalize to radius
  const flatV = [];
  for (const p of v) {
    const len = Math.sqrt(p[0]**2+p[1]**2+p[2]**2);
    flatV.push(p[0]*radius/len, p[1]*radius/len, p[2]*radius/len);
  }
  return { vertices: flatV, indices: i.flat(), format: 'icosphere' };
}

// 3D model metadata
const MODELS = [
  { name: 'sphere', gen: () => sphere(1, 32), color: '#6366F1', description: 'Perfect sphere for hero background' },
  { name: 'cube', gen: () => cube(2), color: '#8B5CF6', description: 'Glass cube for feature cards' },
  { name: 'torus', gen: () => torus(1, 0.4, 32, 16), color: '#06B6D4', description: 'Torus for loading animation' },
  { name: 'icosphere-low', gen: () => icosphere(1, 1), color: '#EC4899', description: 'Low-poly icosphere' },
  { name: 'icosphere-high', gen: () => icosphere(1, 3), color: '#F59E0B', description: 'High-detail icosphere' },
  { name: 'icosphere-detail', gen: () => icosphere(1, 4), color: '#10B981', description: 'Maximum detail icosphere' },
  { name: 'sphere-large', gen: () => sphere(1.5, 48), color: '#8B5CF6', description: 'Large smooth sphere' },
  { name: 'cube-rotated', gen: () => cube(2.5), color: '#06B6D4', description: 'Large cube' }
];

for (const m of MODELS) {
  const data = m.gen();
  const model = {
    name: m.name,
    description: m.description,
    color: m.color,
    format: 'vertex-data',
    ...data
  };
  writeFileSync(join(OUT, `${m.name}.json`), JSON.stringify(model));
  console.log(`  ✓ ${m.name}.json (${data.vertices.length / 3} verts, ${data.indices.length / 3} tris)`);
}

console.log(`\n✅ Generated ${MODELS.length} 3D models in ${OUT}`);
