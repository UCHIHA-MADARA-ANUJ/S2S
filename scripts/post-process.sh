#!/usr/bin/env bash
# Post-process the raw Playwright recording into a polished demo video.
#
# Requirements:
#   - ffmpeg (real build, not the stripped-down playwright one)
#   - Optional: a background music file at video/music.mp3
#   - Optional: a voiceover file at video/voiceover.mp3
#
# Output: video/demo-final.mp4 (H.264, 1920x1080, 30fps, ready to share)

set -e
cd "$(dirname "$0")/.."

FFMPEG="${FFMPEG:-ffmpeg}"
if ! command -v "$FFMPEG" >/dev/null 2>&1; then
  for cand in /usr/bin/ffmpeg /usr/local/bin/ffmpeg /tmp/ffmpeg-*/bin/ffmpeg; do
    if [ -x "$cand" ]; then FFMPEG="$cand"; break; fi
  done
  if [ -z "$FFMPEG" ] || ! command -v "$FFMPEG" >/dev/null 2>&1; then
    echo "✘ ffmpeg not found in PATH or common locations." >&2
    exit 1
  fi
fi
echo "▶ using ffmpeg: $FFMPEG"

[ -f video/demo-raw.webm ] || { echo "✘ video/demo-raw.webm not found"; exit 1; }
mkdir -p video
FF="$FFMPEG"

# ---------------------------------------------------------------
# Single-pass: webm -> mp4, 1920x1080@30, with cinematic bars + fade
# ---------------------------------------------------------------
echo "▶ converting with cinematic bars + fade…"
DUR=$($FF -i video/demo-raw.webm 2>&1 | grep "Duration" | awk '{print $2}' | sed 's/,//')
HMS=$(echo "$DUR" | cut -d. -f1)
H=$(echo "$HMS" | cut -d: -f1)
M=$(echo "$HMS" | cut -d: -f2)
S=$(echo "$HMS" | cut -d: -f3)
TOTAL_S=$((H * 3600 + M * 60 + S))
FADE_OUT_START=$((TOTAL_S - 1))
[ "$FADE_OUT_START" -lt 0 ] && FADE_OUT_START=0

# Build filter chain
FILTER="scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,drawbox=x=0:y=0:w=1920:h=54:color=black@1:t=fill,drawbox=x=0:y=1026:w=1920:h=54:color=black@1:t=fill,fade=t=in:st=0:d=0.5,fade=t=out:st=${FADE_OUT_START}:d=1.0"

# Build audio inputs
AUDIO_INPUTS=""
AUDIO_MAP=""
if [ -f video/voiceover.mp3 ]; then
  AUDIO_INPUTS="-i video/voiceover.mp3"
  AUDIO_MAP="-map 0:v -map 1:a"
elif [ -f video/music.mp3 ]; then
  AUDIO_INPUTS="-i video/music.mp3"
  AUDIO_MAP="-map 0:v -map 1:a -shortest"
else
  AUDIO_MAP="-map 0:v"
fi

$FF -y -i video/demo-raw.webm $AUDIO_INPUTS \
  $AUDIO_MAP \
  -vf "$FILTER" \
  -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  -r 30 \
  -movflags +faststart \
  -threads 0 \
  video/demo-final.mp4 2>&1 | tail -5

echo ""
echo "✔ done! Final video:"
ls -lh video/demo-final.mp4
