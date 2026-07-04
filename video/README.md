# Demo video

This folder contains the Screen2Skill 2026 demo video recording.

## Files

- **`demo-final.mp4`** — The final 6:45 demo video (1920×1080, H.264, AAC, 33 MB)
- **`demo-raw.webm`** — Raw recording from Playwright (intermediate, 35 MB)
- **`thumb-frame*.jpg`** — Frame thumbnails for verification

## How it was made

1. **`scripts/record-demo.mjs`** — Playwright automation that drives a headless
   Chromium through every cue in `SUBMISSION_PACK/SCRIPT.md` (hero → dashboard
   → AI hub → SkillBot → pathway → research → workspace → insights → pledge → end).
   Records a `.webm` automatically via Playwright's built-in recorder.

2. **`scripts/post-process.sh`** — Converts the raw `.webm` into a polished
   `demo-final.mp4`:
   - 1920×1080 @ 30 fps
   - Cinematic letterbox bars (54px top + 54px bottom)
   - 0.5s fade in, 1s fade out
   - H.264 (libx264, CRF 22) + AAC audio
   - Muxes in your voiceover if you add `video/voiceover.mp3`

## How to re-record (e.g. after UI changes)

```bash
# Terminal 1: keep Next.js running
cd /home/user/skillverse
./node_modules/.bin/next build
./node_modules/.bin/next start -p 3050

# Terminal 2: record + post-process
cd /home/user/skillverse
node scripts/record-demo.mjs
FFMPEG=/path/to/ffmpeg bash scripts/post-process.sh
```

## Adding your voiceover

1. Record the voiceover in any DAW (Audacity, GarageBand, etc.) to
   match the script cues in `SUBMISSION_PACK/SCRIPT.md`.
2. Export as `video/voiceover.mp3` (44.1 kHz, mono is fine).
3. Re-run `scripts/post-process.sh` — it will mux the voiceover in
   automatically.

## Adding background music

Drop a loop at `video/music.mp3`. The script will use it if no voiceover
is present, or as an underlay if you'd like both.

## Tips for the best result

- **Practice the demo 2-3 times** before the real recording so the
  voiceover timing matches the on-screen action.
- **Hover the cursor** on the dashboard charts during recording to
  trigger the interactive tooltips — the script already does this.
- **For the SkillBot cue**, type the question slowly so judges can read it
  on screen before Gemini responds.
- **If the AI response time is slow**, lengthen the `sleep(22000)` in
  `scripts/record-demo.mjs` (line 137).
