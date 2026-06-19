<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4a9b0331-bac2-4ffe-b422-6c25ab4f7ac8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.
   The chat endpoint uses `gemini-2.5-flash-lite` by default. Override it with `GEMINI_CHAT_MODEL` if needed.
3. Run the app:
   `npm run dev`

## Chat Cost Control and Analytics

- Monthly chat budget defaults to `CHAT_MONTHLY_BUDGET_JPY=1000`.
- In production on Vercel, configure Vercel KV / Upstash Redis with `KV_REST_API_URL` and `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- The server estimates Gemini token cost, reserves the projected cost in Redis, and stops new chat replies when the monthly cap would be exceeded.
- Chat history sent to Gemini is limited by `CHAT_MAX_HISTORY_MESSAGES=8` to keep costs stable.
- Analytics focus on category counts and usage totals. Recent question snippets are retained briefly via `CHAT_RECENT_MESSAGE_RETENTION_DAYS=7`.
- Usage summary API: `GET /api/chat/usage` with `Authorization: Bearer <CHAT_ANALYTICS_TOKEN>`
- Chat analytics API: `GET /api/chat/analytics` with `Authorization: Bearer <CHAT_ANALYTICS_TOKEN>`
- Admin dashboard: `GET /admin/chat-analytics`, then enter `CHAT_ANALYTICS_TOKEN` in the login form.
- Set `CHAT_ANALYTICS_TOKEN` in production. Without it, analytics access stays blocked.

## Form Email Forwarding

- Contact, address-change, and event-registration submissions are forwarded to Google Apps Script.
- Set `GAS_WEBAPP_URL` to the deployed Apps Script web app URL.
- Optional: set `FORM_WEBHOOK_URL` when contact/address forms should use a different webhook. If omitted, they fall back to `GAS_WEBAPP_URL`.
- Server-side recipients are fixed to `ibadai.bj.dousou@gmail.com` and `oodate@salat.co.jp`.
