# Trailmarks — Writing Journal

A standalone version of the Trailmarks writing-practice app, built to deploy
the same way as receiptbox / vault-app: GitHub → Vercel, with a serverless
function holding the Anthropic API key so no one has to log into Claude.

## What changed from the Claude artifact version

- Progress (stamps, streak) now saves to `localStorage` instead of the
  artifact-only `window.storage`.
- The AI feedback call goes to `/api/feedback` (a Vercel serverless
  function in `api/feedback.js`) instead of calling `api.anthropic.com`
  directly from the browser. The API key lives only on the server.

## Deploy (same flow as before)

1. Create a new GitHub repo and push this folder to it (or upload the
   files directly on github.com — same as you did for vault-app).
2. In Vercel, "Add New Project" → import that GitHub repo. Vercel will
   auto-detect Vite; default build settings are fine (`npm run build`,
   output `dist`).
3. Before the first deploy (or right after, then redeploy), go to the
   Vercel project → **Settings → Environment Variables** and add:
   - `ANTHROPIC_API_KEY` = an API key from [console.anthropic.com](https://console.anthropic.com)
     (Settings → API Keys → Create Key). Keep this only in Vercel's
     environment variables — never commit it to GitHub.
4. Deploy. Vercel gives you a URL like `trailmarks-xxxx.vercel.app`.

## Cost note

Each time a kid taps "get feedback," it's one Claude API call billed to
whatever Anthropic account owns that API key (pay-as-you-go, a fraction
of a cent per call with Sonnet at this length). There's no built-in cap —
if you want a safety limit, ask Claude to add a simple daily-count check
in `api/feedback.js` (same pattern as the 30-scan/month limit in
receiptbox).

## Put it on the iPad

1. Open the Vercel URL in **Safari** on the iPad.
2. Tap the Share icon → **Add to Home Screen**.
3. That's it — no Claude account, no login, just an icon that opens
   straight into the app.

## Local dev

```
npm install
npm run dev
```

The `/api/feedback` route only works when deployed on Vercel (or via
`vercel dev`), since it needs a real serverless environment to read the
API key.
