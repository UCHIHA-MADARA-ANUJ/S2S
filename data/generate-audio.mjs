// Generate audio files using node's built-in tools (silent WAVs of various sizes)
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'audio');
mkdirSync(outDir, { recursive: true });

// Generate a real silent WAV file with given duration
function makeWAV(seconds, sampleRate = 44100) {
  const numSamples = seconds * sampleRate;
  const buffer = Buffer.alloc(44 + numSamples * 2);
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  // Leave data section as zeros (silent)
  return buffer;
}

const files = [
  { name: 'intro-narration.wav', sec: 30 },
  { name: 'survey-prompt.wav', sec: 20 },
  { name: 'thank-you.wav', sec: 15 },
  { name: 'pledge.wav', sec: 45 },
  { name: 'walkthrough-act1.wav', sec: 60 },
  { name: 'walkthrough-act2.wav', sec: 60 },
  { name: 'walkthrough-act3.wav', sec: 60 },
  { name: 'ambient-1.wav', sec: 120 },
  { name: 'ambient-2.wav', sec: 120 },
  { name: 'click.wav', sec: 1 },
  { name: 'success.wav', sec: 2 },
  { name: 'error.wav', sec: 2 },
  { name: 'transition.wav', sec: 3 },
  { name: 'data-stream.wav', sec: 90 },
  { name: 'background-loop.wav', sec: 180 },
];

let total = 0;
for (const f of files) {
  const buf = makeWAV(f.sec);
  writeFileSync(join(outDir, f.name), buf);
  total += buf.length;
  console.log(`  ${f.name}: ${(buf.length/1024).toFixed(1)}KB (${f.sec}s)`);
}
console.log(`TOTAL: ${(total/1024/1024).toFixed(1)}MB`);
