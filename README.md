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
- Browser-provided AI replies are not trusted or sent back to Gemini. Only the latest user question is used for explicit follow-ups such as 「その会場は？」.
- Gemini replies use structured JSON with source IDs. Answers without an allowed source, or with unsupported dates, amounts, contact details, or role-holder names, are replaced with the office-contact fallback.
- Common fixed questions such as membership fees, officers, office contact details, address updates, and newsletter access use deterministic zero-cost answers.
- Analytics focus on category counts and usage totals. Recent question snippets are retained briefly via `CHAT_RECENT_MESSAGE_RETENTION_DAYS=7`.
- Usage summary API: `GET /api/chat/usage` with `Authorization: Bearer <CHAT_ANALYTICS_TOKEN>`
- Chat analytics API: `GET /api/chat/analytics` with `Authorization: Bearer <CHAT_ANALYTICS_TOKEN>`
- Admin dashboard: `GET /admin/chat-analytics`, then enter `CHAT_ANALYTICS_TOKEN` in the login form.
- Set `CHAT_ANALYTICS_TOKEN` in production. Without it, analytics access stays blocked.
