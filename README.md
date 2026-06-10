# WC 2026 — SSCG Sweepstake

Office sweepstake tracker for the 2026 FIFA World Cup.  
Participants: Petrus, Neda, Gemma, Max, Tinashe, Nkulu, Matt, Simba, Zenon

---

## Deployment Instructions

### Step 1 — Upload files to GitHub
1. Go to your GitHub repo: github.com/petruserasmusapple-source/wc2026-sweepstake
2. Click **Add file** → **Upload files**
3. Drag and drop ALL files including the `netlify/functions/` folder
4. Click **Commit changes**

### Step 2 — Connect Netlify to GitHub
1. Go to app.netlify.com
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub**
4. Authorise Netlify to access your GitHub
5. Select the **wc2026-sweepstake** repository
6. Leave build settings as default
7. Click **Deploy site**

### Step 3 — Add your API key (IMPORTANT — do this before sharing the URL)
1. In Netlify dashboard go to **Site configuration** → **Environment variables**
2. Click **Add a variable**
3. Key: `API_FOOTBALL_KEY`
4. Value: paste your API-Football key here
5. Click **Save**
6. Go to **Deploys** → **Trigger deploy** → **Deploy site**

### Step 4 — Set your custom site name
1. In Netlify go to **Site configuration** → **Site details**
2. Click **Change site name**
3. Enter: `sscg-sweepstake`
4. Your site will be live at: **https://sscg-sweepstake.netlify.app**

### Step 5 — Regenerate your API key (security)
1. Go to dashboard.api-football.com
2. Account → My Access
3. Regenerate your key
4. Update the key in Netlify environment variables (Step 3)

---

## How it works
- Fixtures and results are fetched automatically from API-Football
- Points are calculated automatically when results come in
- The sweepstake leaderboard updates itself
- All 9 colleagues can access the same live URL
- The draw is saved in each browser's local storage

---

## Files
- `index.html` — the full sweepstake website
- `netlify/functions/fixtures.js` — secure API proxy (your key never touches the frontend)
- `netlify.toml` — Netlify configuration
