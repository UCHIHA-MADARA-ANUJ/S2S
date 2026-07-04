# 🚀 SkillVerse — Deploy to Vercel (5 minutes)

## ⚠️ Most common reason AI says "service offline": **Env vars are not set in Vercel**

The `.env.local` file works locally but is **NOT** uploaded to GitHub (intentionally — secrets should never be in git). You **must** add the env vars manually in the Vercel dashboard.

---

## Step-by-step

### 1. Import the repo
- Go to https://vercel.com/new
- Click "Import Project"
- Select **`UCHIHA-MADARA-ANUJ/S2S`**
- Click **Import**

### 2. Add Environment Variables (CRITICAL)
Before clicking Deploy, expand **"Environment Variables"** and add these **6 variables**:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | `YOUR_GEMINI_KEY_FROM_ENV_LOCAL` |

| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR-PROJECT.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `YOUR_SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | `YOUR_SUPABASE_SERVICE_KEY` |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-DEPLOYMENT-URL.vercel.app` |

**For each variable:**
- Click the "Environment" dropdown → check **all three** (Production, Preview, Development)
- Type the name in the left box
- Paste the value in the right box
- Click "Add"

### 3. Click **Deploy**
Wait 60-90 seconds. Done.

### 4. Verify it worked
Visit **`https://YOUR-URL.vercel.app/api/health`**

You should see:
```json
{"ok":true,"ai":{"gemini":true,"message":"AI ready"},"supabase":true,...}
```

If `gemini: false`, you missed a step. Go back to step 2.

### 5. Test the chatbot
Visit **`https://YOUR-URL.vercel.app/ai-hub/chatbot`**
Type "hi" and hit send. You should get a real Gemini response in ~3 seconds.

---

## If it STILL says "AI service offline"

1. **Hard refresh** the page (Cmd+Shift+R or Ctrl+Shift+R) — Vercel might be serving an old build.
2. **Check Vercel logs:** Dashboard → Project → Logs → look for `[gemini] keys: GEMINI=MISSING` → means the env var didn't get set. Re-do step 2.
3. **Redeploy:** Vercel → Deployments → click the 3 dots on the latest → "Redeploy" → make sure to KEEP the env vars.
4. **Test the health endpoint** in a fresh browser tab: `https://YOUR-URL.vercel.app/api/health` — it should show `gemini: true`.

---

## Local development

If you want to run locally:
```bash
git clone https://github.com/UCHIHA-MADARA-ANUJ/S2S.git
cd S2S
npm install
cp .env.local.example .env.local
# Edit .env.local with real keys (already filled in for you locally)
npm run dev
# Open http://localhost:3000
```

---

## Troubleshooting checklist

- [ ] Did you add **all 6** env vars?
- [ ] Did you check **all 3** environments (Production/Preview/Development)?
- [ ] Did you **redeploy** after adding env vars? (Vercel doesn't auto-redeploy on env change)
- [ ] Does the health endpoint show `gemini: true`?
- [ ] Is your Gemini API key still valid? (Test at https://aistudio.google.com/)
- [ ] Are you rate-limited? (Free tier has limits; wait 60s and retry)
