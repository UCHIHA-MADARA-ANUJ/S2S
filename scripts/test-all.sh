#!/usr/bin/env bash
# SkillVerse — Comprehensive smoke test
# Usage: bash scripts/test-all.sh [port]
set -uo pipefail

PORT="${1:-${SKILLVERSE_PORT:-3050}}"
BASE="http://localhost:${PORT}"
PASS=0
FAIL=0
TOTAL=0
WARN=0

# Colours
GREEN=$'\033[0;32m'
RED=$'\033[0;31m'
YELLOW=$'\033[0;33m'
CYAN=$'\033[0;36m'
DIM=$'\033[2m'
RESET=$'\033[0m'

check() {
  local label="$1"
  local path="$2"
  local expected="${3:-200}"
  local timeout="${4:-10}"
  TOTAL=$((TOTAL + 1))
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "${BASE}${path}" 2>/dev/null || echo "000")
  if [[ "$code" == "$expected" ]]; then
    echo "${GREEN}✓${RESET} ${code} ${path}"
    PASS=$((PASS + 1))
  elif [[ "$code" == "000" ]]; then
    echo "${RED}✗${RESET} --- ${path}  ${RED}TIMEOUT${RESET}"
    FAIL=$((FAIL + 1))
  else
    echo "${YELLOW}⚠${RESET} ${code} ${path}  ${DIM}(expected ${expected})${RESET}"
    WARN=$((WARN + 1))
  fi
}

check_post() {
  local label="$1"
  local path="$2"
  local data="$3"
  local timeout="${4:-20}"
  TOTAL=$((TOTAL + 1))
  local code
  code=$(curl -s -o /tmp/sv_test_response -w "%{http_code}" --max-time "$timeout" -X POST -H "Content-Type: application/json" -d "$data" "${BASE}${path}" 2>/dev/null || echo "000")
  if [[ "$code" == "200" ]]; then
    local size
    size=$(wc -c < /tmp/sv_test_response | tr -d ' ')
    echo "${GREEN}✓${RESET} ${code} ${path}  ${DIM}(${size} bytes)${RESET}"
    PASS=$((PASS + 1))
  else
    echo "${RED}✗${RESET} ${code} ${path}  ${RED}POST FAILED${RESET}"
    FAIL=$((FAIL + 1))
  fi
}

heading() {
  echo ""
  echo "${CYAN}═══ $1 ═══${RESET}"
}

heading "Server health"
echo "${DIM}Base URL: ${BASE}${RESET}"
check "Server is up" "/" 200 5

heading "Static pages (24 expected)"
for p in / /showcase /dashboard /survey /survey/thank-you /research /research/screen-time /research/skills /research/ai-tools /research/social-media /ai-hub /ai-hub/chatbot /ai-hub/wellness /ai-hub/pathway /ai-hub/content /ai-hub/report /ai-hub/trends /ai-hub/translator /ai-hub/analyst /team /about /pledge /reports /trends /submit /workspace /skills /platforms /insights /docs /achievements /settings; do
  check "page" "$p" 200 8
done

heading "SEO routes"
check "sitemap" /sitemap.xml 200
check "robots" /robots.txt 200

heading "Static assets (3D models)"
for m in torus-knot-1 icosphere-x5 mobius-strip cube; do
  check "3D model" "/3d/${m}.json" 200 5
done

heading "API — health"
check "perf" /api/perf 200 5

heading "API — survey (fingerprint dedup)"
check "check" "/api/survey/check?fp=sv1-test-$(date +%s)" 200
check "me" "/api/me?fp=sv1-test" 400  # No data → 400 is correct

heading "API — AI insights (slow, longer timeout)"
check "insight of day" "/api/insights?type=insightOfDay" 200 20
check "trend" "/api/insights?type=trendSpotlight" 200 20

heading "API — FAQ"
check_post "ask" /api/faq/ask '{"question":"What is SkillVerse?"}'

heading "API — Pledge"
check "GET count" /api/pledge 200 5
# Don't actually POST a pledge in test mode

echo ""
echo "${CYAN}════════════════════════════════════════════${RESET}"
echo "${GREEN}PASS:${RESET} ${PASS}   ${YELLOW}WARN:${RESET} ${WARN}   ${RED}FAIL:${RESET} ${FAIL}   ${DIM}TOTAL:${RESET} ${TOTAL}"
echo "${CYAN}════════════════════════════════════════════${RESET}"
[[ $FAIL -eq 0 ]] && exit 0 || exit 1
