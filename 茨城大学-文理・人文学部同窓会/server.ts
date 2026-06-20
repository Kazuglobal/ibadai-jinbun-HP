import express from "express";
import type { Request } from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { retrieveNewsletterContext } from "./chatKnowledge";

dotenv.config();

const app = express();
const PORT = 3000;
const GEMINI_CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-2.5-flash-lite";
const STORIES_GEMINI_MODEL = process.env.STORIES_GEMINI_MODEL || "gemini-2.5-flash-lite";
const SLACK_STORIES_WEBHOOK_URL = process.env.SLACK_STORIES_WEBHOOK_URL || "";
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";
const SLACK_STORIES_CHANNEL_ID = process.env.SLACK_STORIES_CHANNEL_ID || "";
const FORM_WEBHOOK_URL = process.env.FORM_WEBHOOK_URL || process.env.GAS_WEBAPP_URL || "";
const FORM_RECIPIENTS = ["ibadai.bj.dousou@gmail.com", "oodate@salat.co.jp"];
const CHAT_MONTHLY_BUDGET_JPY = getPositiveEnvNumber("CHAT_MONTHLY_BUDGET_JPY", 1000);
const CHAT_USD_JPY_RATE = getPositiveEnvNumber("CHAT_USD_JPY_RATE", 160);
const GEMINI_INPUT_USD_PER_1M = getPositiveEnvNumber("GEMINI_INPUT_USD_PER_1M", 0.1);
const GEMINI_OUTPUT_USD_PER_1M = getPositiveEnvNumber("GEMINI_OUTPUT_USD_PER_1M", 0.4);
const MAX_HISTORY_MESSAGES = getPositiveEnvNumber("CHAT_MAX_HISTORY_MESSAGES", 8);
// Long-term Q&A log: keep each question↔answer pair for a year by default.
const CHAT_RECENT_MESSAGE_RETENTION_DAYS = getPositiveEnvNumber("CHAT_RECENT_MESSAGE_RETENTION_DAYS", 365);
// Max number of stored Q&A pairs (rolling, oldest pushed out).
const CHAT_RECENT_MESSAGE_LIMIT = getPositiveEnvNumber("CHAT_RECENT_MESSAGE_LIMIT", 1000);
// Max number of Q&A pairs rendered in the admin dashboard.
const CHAT_ANALYTICS_DISPLAY_LIMIT = getPositiveEnvNumber("CHAT_ANALYTICS_DISPLAY_LIMIT", 100);
const REDIS_REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
// On serverless platforms (e.g. Vercel) the project filesystem is read-only;
// only /tmp is writable. Redis is the real persistence layer — this is a best-effort fallback.
const CHAT_ANALYTICS_FILE = process.env.VERCEL
  ? path.join("/tmp", "chat-analytics.json")
  : path.join(process.cwd(), "data", "chat-analytics.json");

app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);
app.use(express.json({ limit: "9mb" }));
app.use(express.urlencoded({ extended: false }));

interface ChatAnalyticsRecord {
  timestamp: string;
  month: string;
  model: string;
  userMessage: string;
  assistantReply?: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  estimatedCostJpy: number;
  intent: string;
  success: boolean;
  errorCode?: string;
}

function getPositiveEnvNumber(name: string, fallback: number) {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getCurrentMonth() {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value || new Date().getFullYear().toString();
  const month = parts.find((part) => part.type === "month")?.value || "01";
  return `${year}-${month}`;
}

function estimateTokens(text: string) {
  return Math.max(1, Math.ceil(text.length / 2));
}

function calculateCost(inputTokens: number, outputTokens: number) {
  const estimatedCostUsd =
    (inputTokens / 1_000_000) * GEMINI_INPUT_USD_PER_1M +
    (outputTokens / 1_000_000) * GEMINI_OUTPUT_USD_PER_1M;

  return {
    estimatedCostUsd,
    estimatedCostJpy: estimatedCostUsd * CHAT_USD_JPY_RATE,
  };
}

function classifyIntent(message: string) {
  const normalized = message.toLowerCase();
  if (/住所|変更|転居|引越/.test(normalized)) return "address_update";
  if (/会報|アーカイブ|archive|冊子/.test(normalized)) return "newsletter";
  if (/総会|懇親|イベント|講演/.test(normalized)) return "event";
  if (/会費|寄付|支払|振込/.test(normalized)) return "fee";
  if (/問い合わせ|連絡|電話|メール|事務局/.test(normalized)) return "contact";
  if (/歴史|文理|人文学部|人文社会/.test(normalized)) return "history";
  return "other";
}

function sanitizeForAnalytics(text: string) {
  return text
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "[email]")
    .replace(/\d{2,4}-\d{2,4}-\d{3,4}/g, "[phone]")
    .replace(/〒?\d{3}-?\d{4}/g, "[postal-code]")
    .replace(/\d{7,}/g, "[number]")
    .slice(0, 500);
}

function hasRedisStorage() {
  return Boolean(REDIS_REST_URL && REDIS_REST_TOKEN);
}

function redisKey(name: string, month = getCurrentMonth()) {
  return `chat:${name}:${month}`;
}

async function redisCommand<T = any>(command: Array<string | number>) {
  if (!hasRedisStorage()) {
    throw new Error("Redis REST storage is not configured");
  }

  const response = await fetch(REDIS_REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  const data: any = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    throw new Error(data.error || `Redis command failed: ${response.status}`);
  }

  return data.result as T;
}

function pruneLocalRecords(records: ChatAnalyticsRecord[]) {
  const cutoff = Date.now() - CHAT_RECENT_MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return records.filter((record) => new Date(record.timestamp).getTime() >= cutoff);
}

function readChatAnalytics(): ChatAnalyticsRecord[] {
  try {
    if (!fs.existsSync(CHAT_ANALYTICS_FILE)) return [];
    return pruneLocalRecords(JSON.parse(fs.readFileSync(CHAT_ANALYTICS_FILE, "utf-8")));
  } catch (error) {
    console.error("Failed to read chat analytics:", error);
    return [];
  }
}

function writeChatAnalytics(records: ChatAnalyticsRecord[]) {
  // Analytics persistence must never break the user-facing chat. If the filesystem
  // is read-only (serverless without Redis), log and continue rather than throwing.
  try {
    fs.mkdirSync(path.dirname(CHAT_ANALYTICS_FILE), { recursive: true });
    fs.writeFileSync(CHAT_ANALYTICS_FILE, JSON.stringify(pruneLocalRecords(records).slice(-CHAT_RECENT_MESSAGE_LIMIT), null, 2));
  } catch (error) {
    console.error("Failed to persist chat analytics (non-fatal):", error);
  }
}

async function appendChatAnalytics(record: ChatAnalyticsRecord, reservedCostJpy = 0) {
  if (hasRedisStorage()) {
    const month = record.month;
    const usagePrefix = redisKey("usage", month);
    const recentKey = redisKey("recent", month);
    const intentsKey = redisKey("intents", month);
    const costAdjustmentJpy = record.estimatedCostJpy - reservedCostJpy;

    await redisCommand(["INCR", `${usagePrefix}:requests`]);
    await redisCommand(["INCR", `${usagePrefix}:${record.success ? "success" : "failed"}`]);
    await redisCommand(["INCRBY", `${usagePrefix}:inputTokens`, record.inputTokens]);
    await redisCommand(["INCRBY", `${usagePrefix}:outputTokens`, record.outputTokens]);
    await redisCommand(["INCRBYFLOAT", `${usagePrefix}:costUsd`, record.estimatedCostUsd]);
    if (costAdjustmentJpy !== 0) {
      await redisCommand(["INCRBYFLOAT", `${usagePrefix}:costJpy`, costAdjustmentJpy]);
    }
    await redisCommand(["HINCRBY", intentsKey, record.intent, 1]);

    if (record.userMessage && CHAT_RECENT_MESSAGE_RETENTION_DAYS > 0) {
      await redisCommand([
        "LPUSH",
        recentKey,
        JSON.stringify({
          timestamp: record.timestamp,
          intent: record.intent,
          userMessage: record.userMessage,
          assistantReply: record.assistantReply || "",
          success: record.success,
          estimatedCostJpy: record.estimatedCostJpy,
        }),
      ]);
      await redisCommand(["LTRIM", recentKey, 0, CHAT_RECENT_MESSAGE_LIMIT - 1]);
      await redisCommand(["EXPIRE", recentKey, CHAT_RECENT_MESSAGE_RETENTION_DAYS * 24 * 60 * 60]);
    }
    return;
  }

  const records = readChatAnalytics();
  records.push(record);
  writeChatAnalytics(records);
}

async function getMonthlyUsage(month = getCurrentMonth()) {
  if (hasRedisStorage()) {
    const usagePrefix = redisKey("usage", month);
    const [
      totalRequests,
      successfulRequests,
      failedRequests,
      totalInputTokens,
      totalOutputTokens,
      totalCostUsd,
      totalCostJpy,
    ] = await Promise.all([
      redisCommand<string | null>(["GET", `${usagePrefix}:requests`]),
      redisCommand<string | null>(["GET", `${usagePrefix}:success`]),
      redisCommand<string | null>(["GET", `${usagePrefix}:failed`]),
      redisCommand<string | null>(["GET", `${usagePrefix}:inputTokens`]),
      redisCommand<string | null>(["GET", `${usagePrefix}:outputTokens`]),
      redisCommand<string | null>(["GET", `${usagePrefix}:costUsd`]),
      redisCommand<string | null>(["GET", `${usagePrefix}:costJpy`]),
    ]);

    const costJpy = Number(totalCostJpy || 0);
    return {
      month,
      model: GEMINI_CHAT_MODEL,
      budgetJpy: CHAT_MONTHLY_BUDGET_JPY,
      usdJpyRate: CHAT_USD_JPY_RATE,
      storage: "redis",
      totalRequests: Number(totalRequests || 0),
      successfulRequests: Number(successfulRequests || 0),
      failedRequests: Number(failedRequests || 0),
      totalInputTokens: Number(totalInputTokens || 0),
      totalOutputTokens: Number(totalOutputTokens || 0),
      totalCostUsd: Number(totalCostUsd || 0),
      totalCostJpy: costJpy,
      remainingBudgetJpy: Math.max(0, CHAT_MONTHLY_BUDGET_JPY - costJpy),
      isBudgetExceeded: costJpy >= CHAT_MONTHLY_BUDGET_JPY,
    };
  }

  const records = readChatAnalytics().filter((record) => record.month === month);
  const totalCostJpy = records.reduce((sum, record) => sum + record.estimatedCostJpy, 0);
  const totalCostUsd = records.reduce((sum, record) => sum + record.estimatedCostUsd, 0);
  const totalInputTokens = records.reduce((sum, record) => sum + record.inputTokens, 0);
  const totalOutputTokens = records.reduce((sum, record) => sum + record.outputTokens, 0);

  return {
    month,
    model: GEMINI_CHAT_MODEL,
    budgetJpy: CHAT_MONTHLY_BUDGET_JPY,
    usdJpyRate: CHAT_USD_JPY_RATE,
    storage: "local-json",
    totalRequests: records.length,
    successfulRequests: records.filter((record) => record.success).length,
    failedRequests: records.filter((record) => !record.success).length,
    totalInputTokens,
    totalOutputTokens,
    totalCostUsd,
    totalCostJpy,
    remainingBudgetJpy: Math.max(0, CHAT_MONTHLY_BUDGET_JPY - totalCostJpy),
    isBudgetExceeded: totalCostJpy >= CHAT_MONTHLY_BUDGET_JPY,
  };
}

async function reserveMonthlyBudget(projectedCostJpy: number) {
  if (hasRedisStorage()) {
    const costKey = `${redisKey("usage")}:costJpy`;
    const newTotal = Number(await redisCommand<string>(["INCRBYFLOAT", costKey, projectedCostJpy]));
    if (newTotal > CHAT_MONTHLY_BUDGET_JPY) {
      await redisCommand(["INCRBYFLOAT", costKey, -projectedCostJpy]);
      return {
        allowed: false,
        reservedCostJpy: 0,
        usage: await getMonthlyUsage(),
      };
    }

    return {
      allowed: true,
      reservedCostJpy: projectedCostJpy,
      usage: await getMonthlyUsage(),
    };
  }

  const usage = await getMonthlyUsage();
  return {
    allowed: usage.totalCostJpy + projectedCostJpy <= CHAT_MONTHLY_BUDGET_JPY,
    reservedCostJpy: 0,
    usage,
  };
}

async function releaseMonthlyBudget(reservedCostJpy: number) {
  if (hasRedisStorage() && reservedCostJpy > 0) {
    await redisCommand(["INCRBYFLOAT", `${redisKey("usage")}:costJpy`, -reservedCostJpy]);
  }
}

async function buildChatAnalytics(month = getCurrentMonth()) {
  if (hasRedisStorage()) {
    const [usage, rawIntents, rawRecent] = await Promise.all([
      getMonthlyUsage(month),
      redisCommand<string[]>(["HGETALL", redisKey("intents", month)]),
      redisCommand<string[]>(["LRANGE", redisKey("recent", month), 0, CHAT_ANALYTICS_DISPLAY_LIMIT - 1]),
    ]);
    const intents: Record<string, number> = {};
    for (let index = 0; index < (rawIntents || []).length; index += 2) {
      intents[rawIntents[index]] = Number(rawIntents[index + 1] || 0);
    }

    return {
      usage,
      topIntents: Object.entries(intents)
        .sort((a, b) => b[1] - a[1])
        .map(([intent, count]) => ({ intent, count })),
      recentQuestions: (rawRecent || []).map((item) => JSON.parse(item)),
    };
  }

  const records = readChatAnalytics().filter((record) => record.month === month);
  const usage = await getMonthlyUsage(month);
  const intents = records.reduce<Record<string, number>>((acc, record) => {
    acc[record.intent] = (acc[record.intent] || 0) + 1;
    return acc;
  }, {});

  return {
    usage,
    topIntents: Object.entries(intents)
      .sort((a, b) => b[1] - a[1])
      .map(([intent, count]) => ({ intent, count })),
    recentQuestions: records
      .slice(-CHAT_ANALYTICS_DISPLAY_LIMIT)
      .reverse()
      .map((record) => ({
        timestamp: record.timestamp,
        intent: record.intent,
        userMessage: record.userMessage,
        assistantReply: record.assistantReply || "",
        success: record.success,
        estimatedCostJpy: record.estimatedCostJpy,
      })),
  };
}

function authorizeChatAnalytics(req: Request) {
  const token = process.env.CHAT_ANALYTICS_TOKEN;
  if (!token) {
    return {
      ok: false,
      status: 403,
      message: "CHAT_ANALYTICS_TOKEN is not configured. Set it in the server environment to enable admin analytics access.",
    };
  }

  const authHeader = req.headers.authorization || "";
  const cookieToken = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("chat_admin_token="))
    ?.slice("chat_admin_token=".length) || "";
  const suppliedToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : decodeURIComponent(cookieToken);

  if (!timingSafeEqualStr(suppliedToken, token)) {
    return {
      ok: false,
      status: 401,
      message: "Unauthorized",
    };
  }

  return {
    ok: true,
    status: 200,
    message: "OK",
  };
}

function adminCookie(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `chat_admin_token=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600${secure}`;
}

function adminLoginHtml(message = "") {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>チャット分析 - 管理者認証</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #faf9f5; color: #00204a; }
    main { max-width: 520px; margin: 0 auto; padding: 48px 20px; }
    form { background: #fff; border: 1px solid #e5dfd5; border-radius: 8px; padding: 24px; box-shadow: 0 8px 24px rgba(0,0,0,.04); }
    h1 { margin: 0 0 12px; font-size: 24px; }
    p { line-height: 1.8; color: #555; }
    label { display: block; font-size: 13px; font-weight: 700; margin: 18px 0 8px; }
    input { width: 100%; box-sizing: border-box; border: 1px solid #d8d0c4; border-radius: 6px; padding: 12px; font-size: 14px; }
    button { margin-top: 16px; width: 100%; border: 0; border-radius: 6px; padding: 12px; background: #00204a; color: white; font-weight: 800; cursor: pointer; }
    .error { color: #b91c1c; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <form method="post" action="/admin/chat-analytics/login">
      <h1>管理者認証</h1>
      <p>チャット分析画面は管理者のみ閲覧できます。</p>
      ${message ? `<p class="error">${message}</p>` : ""}
      <label for="token">管理者トークン</label>
      <input id="token" name="token" type="password" autocomplete="current-password" required />
      <button type="submit">分析画面を開く</button>
    </form>
  </main>
</body>
</html>`;
}

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;
function getGemini() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

type StoryInterviewItem = {
  question: string;
  answer: string;
};

type StoryPhoto = {
  name: string;
  type: string;
  dataUrl: string;
};

const storyInterviewRequests = new Map<string, { count: number; resetAt: number }>();
const storySubmissionRequests = new Map<string, { count: number; resetAt: number }>();
const chatRequests = new Map<string, { count: number; resetAt: number }>();
const registerRequests = new Map<string, { count: number; resetAt: number }>();
const formRequests = new Map<string, { count: number; resetAt: number }>();

function getSafeText(value: unknown, maxLength = 2000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function getSafeHttpUrl(value: unknown) {
  const text = getSafeText(value, 1000);
  if (!text) return "";
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function escapeSlackText(value: unknown) {
  return getSafeText(value, 5000)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function rateLimitAllowed(
  store: Map<string, { count: number; resetAt: number }>,
  ip: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const existing = store.get(ip);
  if (!existing || existing.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  existing.count += 1;
  return existing.count <= limit;
}

function storyInterviewRateAllowed(ip: string) {
  return rateLimitAllowed(storyInterviewRequests, ip, 20, 10 * 60 * 1000);
}

function storySubmissionRateAllowed(ip: string) {
  return rateLimitAllowed(storySubmissionRequests, ip, 3, 60 * 60 * 1000);
}

function chatRateAllowed(ip: string) {
  return rateLimitAllowed(chatRequests, ip, 20, 60 * 1000);
}

function registerRateAllowed(ip: string) {
  return rateLimitAllowed(registerRequests, ip, 5, 60 * 60 * 1000);
}

function formRateAllowed(ip: string) {
  return rateLimitAllowed(formRequests, ip, 10, 60 * 60 * 1000);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function timingSafeEqualStr(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function decodeStoryPhoto(photo: StoryPhoto) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([a-zA-Z0-9+/=]+)$/.exec(photo.dataUrl || "");
  if (!match) throw new Error("Unsupported photo format");
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > 2 * 1024 * 1024) throw new Error("Photo exceeds 2MB");
  const extensionByType: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };
  const safeBaseName =
    path.basename(getSafeText(photo.name, 120), path.extname(getSafeText(photo.name, 120)))
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .slice(0, 80) || `story-photo-${Date.now()}`;
  return {
    name: `${safeBaseName}${extensionByType[match[1]]}`,
    type: match[1],
    buffer,
  };
}

async function slackApi(method: string, params: URLSearchParams) {
  const response = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const data: any = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) {
    throw new Error(data.error || `Slack API ${method} failed`);
  }
  return data;
}

async function uploadStoryPhotoToSlack(photo: StoryPhoto) {
  const decoded = decodeStoryPhoto(photo);
  const upload = await slackApi(
    "files.getUploadURLExternal",
    new URLSearchParams({ filename: decoded.name, length: String(decoded.buffer.length) }),
  );
  const uploadResponse = await fetch(upload.upload_url, {
    method: "POST",
    headers: { "Content-Type": decoded.type },
    body: decoded.buffer,
  });
  if (!uploadResponse.ok) throw new Error(`Slack photo upload failed: ${uploadResponse.status}`);

  await slackApi(
    "files.completeUploadExternal",
    new URLSearchParams({
      files: JSON.stringify([{ id: upload.file_id, title: decoded.name }]),
      channel_id: SLACK_STORIES_CHANNEL_ID,
    }),
  );
}

async function sendStoryApplicationToSlack(text: string, photos: StoryPhoto[]) {
  if (SLACK_BOT_TOKEN && SLACK_STORIES_CHANNEL_ID) {
    await slackApi(
      "chat.postMessage",
      new URLSearchParams({
        channel: SLACK_STORIES_CHANNEL_ID,
        text,
        unfurl_links: "false",
        unfurl_media: "false",
      }),
    );
    for (const photo of photos) {
      await uploadStoryPhotoToSlack(photo);
    }
    return true;
  }

  if (SLACK_STORIES_WEBHOOK_URL) {
    const response = await fetch(SLACK_STORIES_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error(`Slack webhook failed: ${response.status}`);
    return true;
  }

  return false;
}

function formatStoryApplicationForSlack(payload: any) {
  const profile = payload.profile || {};
  const links = payload.links || {};
  const interview: StoryInterviewItem[] = Array.isArray(payload.interview) ? payload.interview : [];
  const originalInterview: StoryInterviewItem[] = Array.isArray(payload.originalInterview)
    ? payload.originalInterview
    : [];
  const photos: StoryPhoto[] = Array.isArray(payload.photos) ? payload.photos : [];
  const linkLines = [
    ["HP", getSafeHttpUrl(links.website)],
    ["LinkedIn", getSafeHttpUrl(links.linkedin)],
    ["Instagram", getSafeHttpUrl(links.instagram)],
    ["Facebook", getSafeHttpUrl(links.facebook)],
    ["X", getSafeHttpUrl(links.x)],
  ].filter(([, value]) => value);

  return [
    "*新しいSTORIES掲載申請*",
    "> 掲載前の審査が必要です。内容によっては掲載しない場合があります。",
    "",
    `*掲載名:* ${escapeSlackText(profile.name)}`,
    `*連絡先:* ${escapeSlackText(profile.email)}`,
    `*卒業年・専攻:* ${escapeSlackText(profile.gradYear)} / ${escapeSlackText(profile.major)}`,
    `*所属・活動:* ${escapeSlackText(profile.affiliation)}`,
    `*分野:* ${escapeSlackText(profile.category)}`,
    `*写真:* ${photos.length}枚${SLACK_BOT_TOKEN && SLACK_STORIES_CHANNEL_ID ? "（別添）" : "（Webhook構成では本文のみ送信）"}`,
    "",
    "*インタビュー回答*",
    ...interview.flatMap((item, index) => [
      `*Q${index + 1}. ${escapeSlackText(item.question)}*`,
      escapeSlackText(item.answer),
    ]),
    ...(originalInterview.length
      ? [
          "",
          "*校正前の原文（確認用）*",
          ...originalInterview.flatMap((item, index) => [
            `*Q${index + 1} 原文*`,
            escapeSlackText(item.answer),
          ]),
        ]
      : []),
    "",
    `*同窓生特典:* ${escapeSlackText(payload.benefit) || "なし"}`,
    ...(linkLines.length ? ["", "*HP・SNS*", ...linkLines.map(([label, value]) => `- *${label}:* ${value}`)] : []),
  ].join("\n");
}

async function proofreadStoryApplication(payload: any) {
  const interview: StoryInterviewItem[] = Array.isArray(payload.interview)
    ? payload.interview.slice(0, 5).map((item: any) => ({
        question: getSafeText(item?.question, 300),
        answer: getSafeText(item?.answer, 2000),
      }))
    : [];
  const benefit = getSafeText(payload.benefit, 2000);
  const result: any = await getGemini().models.generateContent({
    model: STORIES_GEMINI_MODEL,
    contents: JSON.stringify({
      answers: interview.map((item) => item.answer),
      benefit,
    }),
    config: {
      systemInstruction: `あなたは同窓会広報誌の日本語校正者です。
入力されたインタビュー回答と同窓生特典を、掲載前の原稿として読みやすく校正してください。

必ず守ること:
- 氏名、固有名詞、組織名、数字、年月、役職、出来事などの事実を追加・削除・変更しない
- 回答者が述べていない実績、感情、因果関係を創作しない
- 誤字脱字、助詞、句読点、重複、読みにくい語順だけを自然な敬体に整える
- 回答の意味、語り手の個性、情報量を維持する
- 各回答を別々に校正し、結合や要約をしない
- 特典が空欄なら空欄のまま返す
- JSON以外の説明を返さない`,
      responseMimeType: "application/json",
      maxOutputTokens: 3000,
      temperature: 0.15,
    },
  });
  const parsed = JSON.parse(getSafeText(result.text, 12000));
  if (!Array.isArray(parsed.answers) || parsed.answers.length !== interview.length) {
    throw new Error("Invalid proofreading response");
  }
  const proofreadInterview = interview.map((item, index) => ({
    question: item.question,
    answer: getSafeText(parsed.answers[index], 2000) || item.answer,
  }));

  return {
    ...payload,
    originalInterview: interview,
    interview: proofreadInterview,
    benefit: benefit ? getSafeText(parsed.benefit, 2000) || benefit : "",
  };
}

app.post("/api/stories/interview", async (req, res) => {
  try {
    if (!storyInterviewRateAllowed(req.ip || "unknown")) {
      return res.status(429).json({ error: "短時間の利用回数が多いため、少し時間をおいてお試しください。" });
    }

    const profile = req.body?.profile || {};
    const interview: StoryInterviewItem[] = Array.isArray(req.body?.interview)
      ? req.body.interview.slice(0, 5).map((item: any) => ({
          question: getSafeText(item?.question, 300),
          answer: getSafeText(item?.answer, 2000),
        }))
      : [];

    if (!getSafeText(profile.name, 100) || interview.some((item) => !item.question || !item.answer)) {
      return res.status(400).json({ error: "基本情報とこれまでの回答を確認してください。" });
    }

    if (interview.length >= 5) {
      return res.status(400).json({ error: "インタビューはすでに完了しています。" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "Gemini APIキーが未設定です。サーバー環境のGEMINI_API_KEYを設定してください。",
        code: "GEMINI_NOT_CONFIGURED",
      });
    }

    const transcript = interview
      .map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`)
      .join("\n\n") || "まだ回答はありません。";
    const nextQuestionNumber = interview.length + 1;
    const prompt = `次は全5問中の第${nextQuestionNumber}問です。

掲載名: ${getSafeText(profile.name, 100)}
卒業年・専攻: ${getSafeText(profile.gradYear, 100)} / ${getSafeText(profile.major, 150)}
現在の所属・活動: ${getSafeText(profile.affiliation, 200)}
活動分野: ${getSafeText(profile.category, 100)}

これまでの回答:
${transcript}

この方への次の質問を1問だけ作成してください。`;

    const result: any = await getGemini().models.generateContent({
      model: STORIES_GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: `あなたは茨城大学 文理・人文学部同窓会「STORIES」の熟練インタビュアーです。
同窓生の人柄、歩み、仕事・活動の価値、大学とのつながりが伝わる記事を作るため、温かく具体的な質問を一度に1問だけしてください。
完成する記事は、サイトに表示されているサンプル記事と同じ構成・内容の深さにします。

全5問の設計:
1. 現在の仕事・活動の具体的な内容と、その仕事を選んだ理由
2. 仕事・活動のやりがいが伝わる具体的な経験、転機、挑戦。第1問の回答にある固有の内容を必ず一つ拾って深掘りする
3. 茨城大学で学んだこと、ゼミ・先生・仲間・課外活動などの思い出と、それが現在にどう生きているか
4. 在学生・受験生へのメッセージ。大学で挑戦してほしいことや、社会に出て役立った学びを聞く
5. 同窓生向けに提供できる割引、優待、相談、協力などの会員特典。質問文の中で、ない場合は「なし」でよいと必ず伝える

サンプル記事との対応:
- 第1問と第2問の回答から「この仕事を選んだ理由と、やりがい」の記事を作れる情報を集める
- 第3問から「茨城大学での学びや学生時代の思い出」の記事を作れる情報を集める
- 第4問から「在学生や受験生の皆さんへのメッセージ」の記事を作れる情報を集める
- 回答から、一覧カードに使える短い紹介文と記事見出しを編集できるだけの具体性を得る
- 第5問はサンプル記事の「会員限定特典」欄に対応する

必ず守ること:
- これまでの回答を読んで、固有の内容を拾った自然な聞き方にする
- すでに答えた内容を繰り返し質問しない
- 抽象的な回答には、出来事・役割・相手・変化などを一つだけ尋ねて具体化する
- 一度に複数の論点を詰め込まず、回答しやすい一問にする
- 誘導、誇張、事実の創作をしない
- 個人情報や機密情報を過度に求めない
- 日本語の質問文だけを返し、前置き・番号・解説・引用符は付けない
- 100文字以内にする`,
        temperature: 0.65,
        maxOutputTokens: 160,
      },
    });
    const question = getSafeText(result.text, 200);
    if (!question) {
      return res.status(502).json({
        error: "Geminiから質問を生成できませんでした。もう一度お試しください。",
        code: "GEMINI_EMPTY_RESPONSE",
      });
    }
    res.json({
      question,
      model: STORIES_GEMINI_MODEL,
    });
  } catch (error: any) {
    console.error("STORIES interview error:", error);
    const status = Number(error?.status);
    if (status === 401 || status === 403) {
      return res.status(503).json({
        error: "Gemini APIキーを確認できませんでした。サーバー設定をご確認ください。",
        code: "GEMINI_AUTH_FAILED",
      });
    }
    if (status === 429) {
      return res.status(429).json({
        error: "Geminiの利用上限に達しています。時間をおいてからお試しください。",
        code: "GEMINI_RATE_LIMITED",
      });
    }
    res.status(502).json({
      error: "Geminiとの通信に失敗しました。時間をおいてからもう一度お試しください。",
      code: "GEMINI_REQUEST_FAILED",
    });
  }
});

app.post("/api/stories/submit", async (req, res) => {
  try {
    if (!storySubmissionRateAllowed(req.ip || "unknown")) {
      return res.status(429).json({ error: "申請回数が多いため、時間をおいてからお試しください。" });
    }

    const payload = req.body || {};
    const profile = payload.profile || {};
    const interview: StoryInterviewItem[] = Array.isArray(payload.interview)
      ? payload.interview.slice(0, 5).map((item: any) => ({
          question: getSafeText(item?.question, 300),
          answer: getSafeText(item?.answer, 2000),
        }))
      : [];
    const photos: StoryPhoto[] = Array.isArray(payload.photos) ? payload.photos.slice(0, 3) : [];

    if (
      !getSafeText(profile.name, 100) ||
      !getSafeText(profile.email, 200) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(getSafeText(profile.email, 200)) ||
      !getSafeText(profile.gradYear, 100) ||
      !getSafeText(profile.major, 150) ||
      !getSafeText(profile.affiliation, 200) ||
      interview.length !== 5 ||
      interview.some((item) => !item.question || !item.answer) ||
      payload.agreedToReviewTerms !== true
    ) {
      return res.status(400).json({ error: "必須情報、インタビュー回答、掲載審査への同意を確認してください。" });
    }

    for (const photo of photos) decodeStoryPhoto(photo);

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "現在、回答の文章を整える機能を利用できません。時間をおいてお試しください。" });
    }

    const proofreadPayload = await proofreadStoryApplication({ ...payload, interview });
    const slackText = formatStoryApplicationForSlack(proofreadPayload);
    const integrated = await sendStoryApplicationToSlack(slackText, photos);
    if (!integrated && process.env.NODE_ENV === "production") {
      return res.status(503).json({ error: "現在、掲載申請を受け付けられません。事務局へお問い合わせください。" });
    }
    if (!integrated) {
      console.info("Slack STORIES integration is not configured. Development submission preview:\n", slackText);
    }

    res.json({
      status: "success",
      integrated,
      proofread: true,
      message: "掲載審査の申請を受け付けました。",
    });
  } catch (error: any) {
    console.error("STORIES submission error:", error);
    res.status(500).json({ error: "STORIES掲載申請を送信できませんでした。" });
  }
});

// REST API for Chat Assistant
app.post("/api/chat", async (req, res) => {
  let reservedCostJpy = 0;
  let budgetSettled = false;

  try {
    if (!chatRateAllowed(req.ip || "unknown")) {
      return res.status(429).json({
        error: "短時間に多くのリクエストが送信されました。少し時間をおいて再度お試しください。",
        code: "RATE_LIMITED",
      });
    }

    const message = getSafeText(req.body?.message, 2000);
    const history = req.body?.history;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const trimmedHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_MESSAGES) : [];
    const systemInstruction = `あなたは「茨城大学 文理・人文学部同窓会」公式サイトのAIコンシェルジュ（アシスタント）です。
同窓生、在学生、教職員、一般の皆様からの質問に、親切で丁寧な、温かみのある日本語（敬語）でお答えします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【確定情報（ナレッジベース）】
※以下は当サイトで確認済みの事実です。回答はこの範囲の事実に基づいてください。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

■ 同窓会の概要
- 正式名称：茨城大学 文理・人文学部同窓会
- 設立：昭和57（1982）年6月6日（設立から40年以上の歴史）
- 同窓生数：19,000人を超える卒業生が県内および全国で活躍
- 現会長：大和田 一雄（昭和48年卒・第6代会長／令和4年11月の第16回総会で選任）
- 名誉会長：原口 弥生（人文社会科学部長）

■ 沿革・歴史
- 茨城大学は1949年（昭和24年）に新制大学として設置されました。
- 文理学部は創立当初からの伝統ある学部で、のちに人文学部（現在の人文社会科学部）と理学部に改組されました。本同窓会は「文理・人文学部同窓会」として両学部の卒業生のネットワークを維持しています。

■ 会費・入会・退会
- 会費：令和2年度入学生から、入学手続きの一つとして入会を案内し、「終身会費10,000円」を入学時の学納金納付の際に納入いただいています。
- 入学時に未加入の方も随時加入が可能です（事務局へお問い合わせください）。
- 退会：終身会員制のため、特に退会を望まれる場合以外は手続き不要です。退会希望の場合は事務局へご連絡ください。
- 物故連絡：会員が亡くなられた場合は、会員氏名・亡くなられた日・卒業学科名等・卒業年度を事務局へお知らせください。

■ 主な活動
- 総会の開催（隔年）／理事会（毎年）
- 会報の発行（年1回・毎年6月中旬に全会員へ送付）
- 学生懸賞論文の共催、地域連携授業（地域連携論）への講師派遣・財政支援、就職・キャリア支援 など

■ 会報（Network Archive）
- 当サイトでバックナンバーをオンライン閲覧できます。

■ 支部
- 地域支部：在京同窓会（水交会／会長 仲田正夫）、県南同窓会（会長 村上主税）
- 職域支部：茨苑会（常陽銀行）、県信茨大同窓会（茨城県信用組合）、水戸市役所茨大会 など

■ 事務局・お問い合わせ先
- 名称：茨城大学文理・人文学部同窓会事務局
- 所在地：〒310-8512 水戸市文京2-1-1 茨城大学人文社会科学部内
- 電話：（029）228-8546 ／ 090-3100-5814（鈴木）
- E-mail：ibadai.bj.dousou@gmail.com

■ サイト上でできること（ご案内先）
- 住所変更：「住所変更手続きをする」ボタン、または「Update」セクションのオンラインフォーム
- 会報閲覧：会報（Network Archive）セクション
- お問い合わせ：お問い合わせフォーム

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【回答ルール（厳守）】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 正確性最優先：上記ナレッジベースに記載された事実のみを根拠に回答してください。日付・金額・人名・電話番号・メールアドレス・URL・イベント開催日などを推測や記憶で創作してはいけません。
2. 不明な場合の対応：ナレッジベースに答えがない、または確証がない質問には、事実を捏造せず「その点は確認できておりません」と正直に伝え、同窓会事務局（℡ 029-228-8546／E-mail ibadai.bj.dousou@gmail.com）へのお問い合わせをご案内してください。
3. 推測の明示：一般論として補足する場合は断定せず「一般的には〜」等と前置きし、確定情報と区別してください。
4. 範囲外の質問：同窓会・大学に無関係な話題（時事、医療、法律相談など）には深入りせず、丁寧にお断りして本来のご案内に戻してください。
5. 誘導：住所変更・会報閲覧・お問い合わせ等をご希望の様子があれば、該当セクションやフォームへ親身にご案内してください。
6. 情報の優先順位：会費・連絡先・入退会など基本情報は必ず上記【確定情報】を最優先してください。プロンプト末尾に会報記事の抜粋が添付される場合がありますが、それは参考情報です。記事中の数字（例：総会・懇親会の参加費）を同窓会の会費等と混同しないでください。
7. 文体・長さ：温かく丁寧な敬語で、簡潔かつ実用的に。1回の回答は150〜300文字程度を目安にしてください。`;

    // Retrieve relevant newsletter ("会報") excerpts for this question and append
    // them to the system instruction. Returns "" for unrelated questions, so the
    // base prompt is used unchanged. Done before the token estimate so the budget
    // reservation accounts for the injected context.
    const newsletterContext = retrieveNewsletterContext(message);
    const augmentedSystemInstruction = newsletterContext
      ? `${systemInstruction}\n\n${newsletterContext}`
      : systemInstruction;

    const projectedInputTokens = estimateTokens(
      augmentedSystemInstruction +
      message +
      trimmedHistory.map((msg: any) => msg.content || "").join("\n")
    );
    const projectedCost = calculateCost(projectedInputTokens, 512);

    let gemini;
    try {
      gemini = getGemini();
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        error: "Gemini API key is not configured. Please make sure GEMINI_API_KEY is active in Settings.",
        code: "KEY_MISSING"
      });
    }

    const budgetReservation = await reserveMonthlyBudget(projectedCost.estimatedCostJpy);
    reservedCostJpy = budgetReservation.reservedCostJpy;

    if (!budgetReservation.allowed) {
      await appendChatAnalytics({
        timestamp: new Date().toISOString(),
        month: getCurrentMonth(),
        model: GEMINI_CHAT_MODEL,
        userMessage: sanitizeForAnalytics(message),
        inputTokens: projectedInputTokens,
        outputTokens: 0,
        estimatedCostUsd: 0,
        estimatedCostJpy: 0,
        intent: classifyIntent(message),
        success: false,
        errorCode: "BUDGET_EXCEEDED",
      });

      return res.status(429).json({
        error: "今月のAIチャット利用上限（1,000円）に達したため、チャットを一時停止しています。恐れ入りますが、同窓会事務局へ直接お問い合わせください。",
        code: "BUDGET_EXCEEDED",
        usage: budgetReservation.usage,
      });
    }

    const chatHistory = trimmedHistory.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const chat = gemini.chats.create({
      model: GEMINI_CHAT_MODEL,
      history: chatHistory,
      config: {
        systemInstruction: augmentedSystemInstruction,
        // 事実ベースのQ&Aでは決定性を高め、創作（ハルシネーション）を抑えるため低温に設定。
        temperature: 0.2,
        topP: 0.8,
        maxOutputTokens: 512,
      }
    });

    const result: any = await chat.sendMessage({
      message: message
    });

    const reply = result.text || "申し訳ありません。回答を生成できませんでした。";
    const inputTokens = result.usageMetadata?.promptTokenCount || projectedInputTokens;
    const outputTokens = result.usageMetadata?.candidatesTokenCount || estimateTokens(reply);
    const actualCost = calculateCost(inputTokens, outputTokens);

    await appendChatAnalytics({
      timestamp: new Date().toISOString(),
      month: getCurrentMonth(),
      model: GEMINI_CHAT_MODEL,
      userMessage: sanitizeForAnalytics(message),
      assistantReply: sanitizeForAnalytics(reply),
      inputTokens,
      outputTokens,
      estimatedCostUsd: actualCost.estimatedCostUsd,
      estimatedCostJpy: actualCost.estimatedCostJpy,
      intent: classifyIntent(message),
      success: true,
    }, reservedCostJpy);
    budgetSettled = true;

    res.json({
      reply,
      usage: {
        inputTokens,
        outputTokens,
        estimatedCostJpy: actualCost.estimatedCostJpy,
        monthly: await getMonthlyUsage(),
      },
    });
  } catch (error: any) {
    if (reservedCostJpy > 0 && !budgetSettled) {
      await releaseMonthlyBudget(reservedCostJpy).catch((releaseError) => {
        console.error("Failed to release chat budget reservation:", releaseError);
      });
    }
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "予期しないエラーが発生しました。" });
  }
});

app.get("/api/chat/usage", async (req, res) => {
  const auth = authorizeChatAnalytics(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.message });
  }

  res.json(await getMonthlyUsage());
});

app.get("/api/chat/analytics", async (req, res) => {
  const auth = authorizeChatAnalytics(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.message });
  }

  const month = typeof req.query.month === "string" ? req.query.month : getCurrentMonth();
  res.json(await buildChatAnalytics(month));
});

app.post("/admin/chat-analytics/login", (req, res) => {
  const expectedToken = process.env.CHAT_ANALYTICS_TOKEN;
  const submittedToken = typeof req.body.token === "string" ? req.body.token : "";

  if (!expectedToken) {
    return res.status(403).type("html").send(adminLoginHtml("CHAT_ANALYTICS_TOKEN が未設定です。"));
  }

  if (!timingSafeEqualStr(submittedToken, expectedToken)) {
    return res.status(401).type("html").send(adminLoginHtml("管理者トークンが違います。"));
  }

  res.setHeader("Set-Cookie", adminCookie(submittedToken));
  res.redirect(303, "/admin/chat-analytics");
});

app.get("/admin/chat-analytics", (req, res) => {
  const auth = authorizeChatAnalytics(req);
  if (!auth.ok) {
    return res.status(auth.status).type("html").send(adminLoginHtml(auth.status === 403 ? "CHAT_ANALYTICS_TOKEN が未設定です。" : ""));
  }

  res.type("html").send(`<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>チャット分析</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #faf9f5; color: #00204a; }
    main { max-width: 1040px; margin: 0 auto; padding: 32px 20px 56px; }
    h1 { font-size: 28px; margin: 0 0 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .card { background: #fff; border: 1px solid #e5dfd5; padding: 16px; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.04); }
    .label { color: #777; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .value { font-size: 24px; font-weight: 800; margin-top: 6px; }
    section { margin-top: 28px; }
    table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5dfd5; border-radius: 8px; overflow: hidden; }
    th, td { border-bottom: 1px solid #eee8de; padding: 10px 12px; text-align: left; font-size: 13px; vertical-align: top; }
    td:nth-child(3), td:nth-child(4) { max-width: 320px; word-break: break-word; white-space: pre-wrap; }
    th { background: #00204a; color: #fff; font-size: 12px; letter-spacing: .06em; }
    tr:last-child td { border-bottom: 0; }
    .bar { height: 10px; background: #ebe3d7; border-radius: 999px; overflow: hidden; margin-top: 8px; }
    .bar > span { display: block; height: 100%; background: #cd9535; width: 0; }
    code { background: #fff; border: 1px solid #e5dfd5; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <main>
    <h1>チャット分析</h1>
    <div id="status">読み込み中...</div>
    <div class="grid" id="cards"></div>
    <section>
      <h2>質問カテゴリ</h2>
      <table><thead><tr><th>カテゴリ</th><th>件数</th></tr></thead><tbody id="intents"></tbody></table>
    </section>
    <section>
      <h2>最近の質問</h2>
      <table><thead><tr><th>日時</th><th>カテゴリ</th><th>質問</th><th>回答</th><th>概算費用</th></tr></thead><tbody id="questions"></tbody></table>
    </section>
  </main>
  <script>
    const yen = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 2 });
    const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    async function loadAnalytics() {
      const response = await fetch("/api/chat/analytics");
      if (!response.ok) throw new Error("分析データを取得できませんでした。管理者としてログインし直してください。");
      return response.json();
    }
    loadAnalytics().then((data) => {
      const usage = data.usage;
      const percent = usage.budgetJpy > 0 ? Math.min(100, (usage.totalCostJpy / usage.budgetJpy) * 100) : 0;
      document.getElementById("status").innerHTML = '<p>対象月: <code>' + escapeHtml(usage.month) + '</code> / モデル: <code>' + escapeHtml(usage.model) + '</code></p><div class="bar"><span style="width:' + percent + '%"></span></div>';
      document.getElementById("cards").innerHTML = [
        ["月額上限", yen.format(usage.budgetJpy) + "円"],
        ["利用額", yen.format(usage.totalCostJpy) + "円"],
        ["残額", yen.format(usage.remainingBudgetJpy) + "円"],
        ["質問数", usage.totalRequests + "件"],
        ["成功", usage.successfulRequests + "件"],
        ["失敗", usage.failedRequests + "件"],
      ].map(([label, value]) => '<div class="card"><div class="label">' + label + '</div><div class="value">' + value + '</div></div>').join("");
      document.getElementById("intents").innerHTML = data.topIntents.length
        ? data.topIntents.map((row) => '<tr><td>' + escapeHtml(row.intent) + '</td><td>' + row.count + '</td></tr>').join("")
        : '<tr><td colspan="2">まだデータがありません</td></tr>';
      document.getElementById("questions").innerHTML = data.recentQuestions.length
        ? data.recentQuestions.map((row) => '<tr><td>' + escapeHtml(row.timestamp) + '</td><td>' + escapeHtml(row.intent) + '</td><td>' + escapeHtml(row.userMessage) + '</td><td>' + escapeHtml(row.assistantReply) + '</td><td>' + yen.format(row.estimatedCostJpy) + '円</td></tr>').join("")
        : '<tr><td colspan="5">まだデータがありません</td></tr>';
    }).catch((error) => {
      document.getElementById("status").textContent = error.message;
    });
  </script>
</body>
</html>`);
});

// GAS Forwarding Webhook registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    if (!registerRateAllowed(req.ip || "unknown")) {
      return res.status(429).json({
        error: "短時間に多くの登録リクエストが送信されました。少し時間をおいて再度お試しください。",
        code: "RATE_LIMITED",
      });
    }

    const fullName = getSafeText(req.body?.fullName, 100);
    const kana = getSafeText(req.body?.kana, 100);
    const gradYear = getSafeText(req.body?.gradYear, 50);
    const address = getSafeText(req.body?.address, 300);
    const phone = getSafeText(req.body?.phone, 30);
    const partyStatus = getSafeText(req.body?.partyStatus, 30) || "attend";
    const memo = getSafeText(req.body?.memo, 2000);

    if (!fullName || !gradYear || !address || !phone) {
      return res.status(400).json({ error: "必須項目が入力されていません。" });
    }

    const payload = {
      formType: "event-registration",
      recipients: FORM_RECIPIENTS,
      submittedAt: new Date().toISOString(),
      fullName,
      kana,
      gradYear,
      address,
      phone,
      partyStatus,
      memo,
      subject: `【第18回総会 参加申込】 ${fullName} 様`,
    };

    const gasWebAppUrl = process.env.GAS_WEBAPP_URL;

    if (gasWebAppUrl) {
      console.log(`Forwarding registration to GAS WebApp URL: ${gasWebAppUrl}`);
      
      const response = await fetch(gasWebAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`GAS WebApp returned status: ${response.status}`);
      }

      const resData = await response.json().catch(() => ({ status: "success" }));
      return res.json({ 
        status: "success", 
        message: "Google Apps Script(GAS)経由でメール転送が正常に処理されました。",
        integrated: true,
        data: resData 
      });
    } else {
      // Return a simulated success status indicating the local configuration scenario
      console.info("GAS_WEBAPP_URL is not set in `.env`. Request is simulated perfectly.");
      return res.json({ 
        status: "success", 
        message: "受付完了（開発用シミュレーション）。本番連携には環境変数GAS_WEBAPP_URLを設定してください。",
        integrated: false
      });
    }
  } catch (error: any) {
    console.error("Registration endpoint error:", error);
    res.status(500).json({ 
      error: "GASサーバーへの転送中にエラーが発生しました。詳細: " + error.message,
      code: "GAS_FORWARD_FAILED"
    });
  }
});

app.post("/api/forms/submit", async (req, res) => {
  try {
    if (!formRateAllowed(req.ip || "unknown")) {
      return res.status(429).json({
        error: "短時間に多くの送信が行われました。時間をおいて再度お試しください。",
        code: "RATE_LIMITED",
      });
    }

    // A filled honeypot indicates an automated submission.
    if (getSafeText(req.body?.website, 200)) {
      return res.json({ status: "success" });
    }

    const type = req.body?.type === "address-update" ? "address-update" : "contact";
    const fullName = getSafeText(req.body?.fullName, 100);
    const email = getSafeText(req.body?.email, 254);
    const phone = getSafeText(req.body?.phone, 30);
    const subject = getSafeText(req.body?.subject, 200);
    const message = getSafeText(req.body?.message, 4000);

    if (!fullName || !email || !isValidEmail(email)) {
      return res.status(400).json({ error: "お名前と正しいメールアドレスを入力してください。" });
    }

    if (type === "contact" && (!subject || !message)) {
      return res.status(400).json({ error: "件名とお問い合わせ内容を入力してください。" });
    }

    const details =
      type === "address-update"
        ? {
            nameKana: getSafeText(req.body?.details?.nameKana, 100),
            birthdate: getSafeText(req.body?.details?.birthdate, 30),
            gradYear: getSafeText(req.body?.details?.gradYear, 50),
            department: getSafeText(req.body?.details?.department, 100),
            postalCode: getSafeText(req.body?.details?.postalCode, 20),
            prefecture: getSafeText(req.body?.details?.prefecture, 20),
            cityAddress: getSafeText(req.body?.details?.cityAddress, 200),
            building: getSafeText(req.body?.details?.building, 200),
          }
        : {};

    if (
      type === "address-update" &&
      (!details.postalCode || !details.prefecture || !details.cityAddress || !phone)
    ) {
      return res.status(400).json({ error: "住所変更の必須項目をすべて入力してください。" });
    }

    if (!FORM_WEBHOOK_URL) {
      return res.status(503).json({
        error: "送信先が未設定です。事務局へ直接メールでお問い合わせください。",
        code: "FORM_WEBHOOK_NOT_CONFIGURED",
      });
    }

    const payload = {
      formType: type,
      recipients: FORM_RECIPIENTS,
      submittedAt: new Date().toISOString(),
      fullName,
      email,
      phone,
      subject: type === "address-update" ? `【住所変更届】${fullName} 様` : `【お問い合わせ】${subject}`,
      message,
      details,
    };

    const response = await fetch(FORM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const responseData: any = await response.json().catch(() => ({}));

    if (!response.ok || responseData.status === "error") {
      throw new Error(responseData.error || `Webhook returned status ${response.status}`);
    }

    return res.json({
      status: "success",
      message: "送信を受け付けました。",
    });
  } catch (error: any) {
    console.error("Form submission error:", error);
    return res.status(502).json({
      error: "送信に失敗しました。時間をおいて再度お試しください。",
      code: "FORM_FORWARD_FAILED",
    });
  }
});

// Vite server integrations
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Lazy-import Vite so it is never pulled into the serverless bundle.
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// On Vercel the Express app is exported as a serverless function (see api/index.ts),
// so it must NOT bind a port or attach Vite middleware here. Everywhere else
// (local `tsx server.ts`, and `node dist/server.cjs` on a Node host) we self-host.
if (!process.env.VERCEL) {
  startServer();
}

export { app };
export default app;
