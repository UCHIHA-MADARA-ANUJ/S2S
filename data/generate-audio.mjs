#!/usr/bin/env node
// Generate audio assets as raw WAV files using simple synthesis
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'audio');
mkdirSync(OUT, { recursive: true });

function makeWAV(samples, sampleRate = 44100) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = samples.length * 2;
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(s * 32767), headerSize + i * 2);
  }
  return buffer;
}

function envelope(i, total, attack = 0.1, release = 0.3) {
  const t = i / total;
  if (t < attack) return t / attack;
  if (t > 1 - release) return Math.max(0, (1 - t) / release);
  return 1;
}

// 1. UI click (short, sharp)
function genClick(duration = 0.1, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = envelope(i, total, 0.005, 0.6);
    const freq = 1200 * Math.exp(-t * 30);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.5;
  }
  return samples;
}

// 2. Success chime (pleasant)
function genSuccess(duration = 0.6, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = envelope(i, total, 0.05, 0.5);
    // C major chord: C5, E5, G5
    const c5 = Math.sin(2 * Math.PI * 523.25 * t);
    const e5 = Math.sin(2 * Math.PI * 659.25 * t);
    const g5 = Math.sin(2 * Math.PI * 783.99 * t);
    samples[i] = (c5 * 0.3 + e5 * 0.2 + g5 * 0.2) * env * 0.4;
  }
  return samples;
}

// 3. Error (lower pitch, dissonant)
function genError(duration = 0.4, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = envelope(i, total, 0.02, 0.4);
    // Dissonant interval
    const a = Math.sin(2 * Math.PI * 220 * t);
    const b = Math.sin(2 * Math.PI * 233 * t);
    samples[i] = (a * 0.3 + b * 0.3) * env * 0.4;
  }
  return samples;
}

// 4. Notification
function genNotification(duration = 0.3, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = envelope(i, total, 0.01, 0.3);
    // Two-tone alert
    const f = i < total / 2 ? 880 : 1320;
    samples[i] = Math.sin(2 * Math.PI * f * t) * env * 0.3;
  }
  return samples;
}

// 5. Hover (very subtle)
function genHover(duration = 0.05, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = envelope(i, total, 0.01, 0.7);
    samples[i] = Math.sin(2 * Math.PI * 2400 * t) * env * 0.15;
  }
  return samples;
}

// 6. Whoosh
function genWhoosh(duration = 0.5, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  let lastNoise = 0;
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = Math.sin(Math.PI * (i / total));
    // Brown noise (filtered)
    const white = Math.random() * 2 - 1;
    const noise = (lastNoise + (white - lastNoise) * 0.3) * 0.95;
    lastNoise = noise;
    // Frequency sweep
    const freq = 200 + 2000 * t;
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.2;
    samples[i] = (noise * 0.5 + tone) * env * 0.4;
  }
  return samples;
}

// 7. Magic spell
function genMagic(duration = 0.8, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = envelope(i, total, 0.1, 0.5);
    // Sparkly high notes with vibrato
    const vibrato = Math.sin(2 * Math.PI * 6 * t) * 30;
    const f1 = 1500 + vibrato + Math.sin(t * 5) * 200;
    const f2 = 2200 + vibrato + Math.sin(t * 7) * 300;
    const sparkle = Math.sin(t * 50) * 0.3;
    samples[i] = (Math.sin(2 * Math.PI * f1 * t) * 0.2 + Math.sin(2 * Math.PI * f2 * t) * 0.15 + sparkle) * env * 0.4;
  }
  return samples;
}

// 8. Survey submit (long, celebratory)
function genSubmit(duration = 1.5, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C major arpeggio
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const noteIdx = Math.min(notes.length - 1, Math.floor(t * 4));
    const f = notes[noteIdx];
    const localT = (t * 4) - noteIdx;
    const env = Math.exp(-localT * 2) * 0.5;
    // Bell-like with harmonics
    samples[i] = (Math.sin(2 * Math.PI * f * t) * 0.4 +
                  Math.sin(2 * Math.PI * f * 2 * t) * 0.15 +
                  Math.sin(2 * Math.PI * f * 3 * t) * 0.08) * env;
  }
  return samples;
}

// 9. Ambient pad
function genAmbient(duration = 4, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    // Slow LFO modulated pad
    const lfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.1 * t);
    const f1 = 110 * lfo;
    const f2 = 165 * lfo;
    const f3 = 220 * lfo;
    samples[i] = (Math.sin(2 * Math.PI * f1 * t) * 0.2 +
                  Math.sin(2 * Math.PI * f2 * t) * 0.15 +
                  Math.sin(2 * Math.PI * f3 * t) * 0.1 +
                  Math.sin(2 * Math.PI * (f1 + f2) * t) * 0.05) * 0.3;
  }
  return samples;
}

// 10. Data stream (digital, glitchy)
function genDataStream(duration = 1, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = 0.5 + 0.5 * Math.sin(2 * Math.PI * 8 * t);
    const noise = (Math.random() * 2 - 1) * 0.3;
    const beep = Math.sin(2 * Math.PI * 800 * t) * Math.sin(2 * Math.PI * 4 * t) * 0.2;
    samples[i] = (noise + beep) * env * 0.3;
  }
  return samples;
}

// 11. Typing sound
function genType(duration = 0.04, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = envelope(i, total, 0.01, 0.5);
    const noise = (Math.random() * 2 - 1) * 0.5;
    const click = Math.sin(2 * Math.PI * 3000 * t) * 0.3;
    samples[i] = (noise * 0.3 + click) * env * 0.4;
  }
  return samples;
}

// 12. Heartbeat
function genHeartbeat(duration = 1, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const beat = t * 1.2; // 72 bpm
    const cycle = beat - Math.floor(beat);
    let env = 0;
    if (cycle < 0.1) env = Math.sin(cycle * 31.4) * 0.7;
    else if (cycle > 0.15 && cycle < 0.25) env = Math.sin((cycle - 0.15) * 31.4) * 0.4;
    samples[i] = Math.sin(2 * Math.PI * 60 * t) * env * 0.5;
  }
  return samples;
}

// 13. Coin (game reward)
function genCoin(duration = 0.5, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = envelope(i, total, 0.005, 0.4);
    // Coin sound: two notes rising
    const f = t < 0.2 ? 1200 + t * 1000 : 1500 + (t - 0.2) * 200;
    samples[i] = Math.sin(2 * Math.PI * f * t) * env * 0.4;
  }
  return samples;
}

// 14. Slide
function genSlide(duration = 0.4, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = Math.sin(Math.PI * (i / total));
    // Frequency slide
    const f = 300 + 1500 * t;
    samples[i] = Math.sin(2 * Math.PI * f * t) * env * 0.4;
  }
  return samples;
}

// 15. Pop
function genPop(duration = 0.15, sampleRate = 44100) {
  const total = duration * sampleRate;
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 25);
    const f = 200 - 100 * t;
    samples[i] = Math.sin(2 * Math.PI * f * t) * env * 0.5;
  }
  return samples;
}

const SOUNDS = [
  { name: 'click', gen: () => genClick() },
  { name: 'success', gen: () => genSuccess() },
  { name: 'error', gen: () => genError() },
  { name: 'notification', gen: () => genNotification() },
  { name: 'hover', gen: () => genHover() },
  { name: 'whoosh', gen: () => genWhoosh() },
  { name: 'magic', gen: () => genMagic() },
  { name: 'submit', gen: () => genSubmit() },
  { name: 'ambient-pad', gen: () => genAmbient() },
  { name: 'data-stream', gen: () => genDataStream() },
  { name: 'type', gen: () => genType() },
  { name: 'heartbeat', gen: () => genHeartbeat() },
  { name: 'coin', gen: () => genCoin() },
  { name: 'slide', gen: () => genSlide() },
  { name: 'pop', gen: () => genPop() }
];

let count = 0;
for (const s of SOUNDS) {
  const samples = s.gen();
  const wav = makeWAV(samples);
  writeFileSync(join(OUT, `${s.name}.wav`), wav);
  count++;
}
console.log(`✅ Generated ${count} audio files in ${OUT}`);
