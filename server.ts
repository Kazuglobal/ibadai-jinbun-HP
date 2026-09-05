import express from "express";
import type { Request } from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { retrieveNewsletterEvidence } from "./chatKnowledge.js";
import {
  buildRetrievalQuery,
  getDeterministicChatAnswer,
  parseGroundedAnswer,
} from "./chatGrounding.js";

dotenv.config();

const app = express();
const GEMINI_CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-2.5-flash-lite";
const STORIES_GEMINI_MODEL = process.env.STORIES_GEMINI_MODEL || "gemini-2.5-flash-lite";
const SLACK_STORIES_WEBHOOK_URL = process.env.SLACK_STORIES_WEBHOOK_URL || "";
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || "";
const SLACK_STORIES_CHANNEL_ID = process.env.SLACK_STORIES_CHANNEL_ID || "";
const DEFAULT_FORM_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbyvCZ6a1ZKdwaJfmxgXz_N0GVWgyfyLovb3fhYfnhovbnBbeKZ9D4eA99yTnAcUmr7p/exec";
// Single GAS web app receives every form type (event-registration / address-update /
// contact), sends office e-mail, and appends to the spreadsheet. See google-apps-script/forms.gs.
const FORM_WEBHOOK_URL =
  process.env.GAS_WEBAPP_URL ||
  DEFAULT_FORM_WEBHOOK_URL;
// GAS web app URLs cannot be kept secret once deployed (this default is itself public
// in the repo), so the URL alone is not an access control. Set GAS_SHARED_SECRET here
// and the matching "SHARED_SECRET" Script Property on the GAS side (forms.gs) to
// require every request to present it — this is what actually blocks direct,
// unauthenticated calls to the Web App URL that bypass this server's rate limiting
// and validation.
const FORM_WEBHOOK_SECRET = process.env.GAS_SHARED_SECRET || "";
const FORM_RECIPIENTS = ["ibadai.bj.dousou@gmail.com", "oodate@salat.co.jp"];
const CHAT_MONTHLY_BUDGET_JPY = getPositiveEnvNumber("CHAT_MONTHLY_BUDGET_JPY", 1000);
const CHAT_USD_JPY_RATE = getPositiveEnvNumber("CHAT_USD_JPY_RATE", 160);
const GEMINI_INPUT_USD_PER_1M = getPositiveEnvNumber("GEMINI_INPUT_USD_PER_1M", 0.1);
const GEMINI_OUTPUT_USD_PER_1M = getPositiveEnvNumber("GEMINI_OUTPUT_USD_PER_1M", 0.4);
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

const CHAT_BASE_SOURCES = [
  {
    id: "official-meeting-18",
    label: "同窓会公式情報：第18回総会・懇親会",
    text: `第18回総会・講演会・懇親会の開催についてご案内します。
開催期日：令和8年（2026年）7月18日（土）午後1時30分～3時30分（受付は午後1時より）。
開催場所：ホテル日航つくば（つくば市吾妻1-1364-1、TXつくば駅下車5分、電話 029-852-1112）。
内容：総会（決算・事業報告、予算・事業計画等）、講演会（講師：茨城大学学長 佐川泰弘氏）、懇親会。
懇親会費：5,000円（5千円）。総会・講演会のみ参加の場合は無料です。
お申し込み締め切り：令和8年7月7日（火）。
申込方法：サイトの参加申込フォーム、または事務局への電子メール（ibadai.bj.dousou@gmail.com）にて受付中です。`,
  },
  {
    id: "official-certificates",
    label: "同窓会公式情報：各種証明書の発行窓口",
    text: `卒業証明書、成績証明書、単位修得証明書等の各種証明書は、同窓会事務局では発行業務を行っておりません。
証明書の発行申請は、茨城大学教育推進課または人文社会科学部学務グループ窓口へ直接ご請求ください。
申請方法・郵送請求等の詳細は茨城大学公式ウェブサイトの各種証明書発行案内をご確認ください。`,
  },
  {
    id: "official-overview",
    label: "同窓会公式情報：概要・役員",
    text: `正式名称は茨城大学 文理・人文学部同窓会です。
設立は昭和57（1982）年6月6日です。
19,000人を超える卒業生が県内および全国で活躍しています。
会長は大和田 一雄（昭和48年卒・第6代会長）です。令和4年11月の第16回総会で選任されました。
第43号（令和8年6月発行）掲載の名誉会長・人文社会科学部長は蓮井 誠一郎です。`,
  },
  {
    id: "official-history",
    label: "同窓会公式情報：沿革",
    text: `茨城大学は1949年（昭和24年）に新制大学として設置されました。
文理学部は創立当初からの学部で、のちに人文学部（現在の人文社会科学部）と理学部に改組されました。
本同窓会は文理・人文学部同窓会として両学部卒業生のネットワークを維持しています。`,
  },
  {
    id: "official-membership",
    label: "同窓会公式情報：会費・入退会・物故連絡",
    text: `令和2年度入学生から、入学手続きの一つとして入会を案内し、終身会費10,000円を入学時の学納金納付の際に納入いただいています。
入学時に未加入の方も随時加入できます。事務局へお問い合わせください。
終身会員制のため、特に退会を望む場合以外は手続き不要です。退会希望の場合は事務局へ連絡してください。
会員が亡くなられた場合は、会員氏名、亡くなられた日、卒業学科名等、卒業年度を事務局へお知らせください。
同窓会へのご寄付・ご支援・カンパのお問い合わせは同窓会事務局にて承っております。`,
  },
  {
    id: "official-activities",
    label: "同窓会公式情報：活動・会報・支部",
    text: `総会は隔年、理事会は毎年開催します。
会報は年1回、毎年6月中旬に発行し、サイトでバックナンバーを閲覧できます。
最新の同窓会名簿（会員名簿）は2026年11月に発行を予定しています。令和8年11月発行予定です。
学生懸賞論文の共催、地域連携論への講師派遣・財政支援、就職・キャリア支援を行っています。
地域支部は在京同窓会（水交会、会長 仲田正夫）と県南同窓会（会長 村上主税）があります。
職域支部には茨苑会（常陽銀行）、県信茨大同窓会（茨城県信用組合）、水戸市役所茨大会などがあります。`,
  },
  {
    id: "official-newsletter-43",
    label: "同窓会公式情報：最新会報第43号",
    text: `最新の会報は第43号（令和8年6月発行、2026.06）です。
第43号からデジタル化（Webマガジン化）へ移行し、会員にはハガキでQRコードを送付してスマートフォン等で手軽に閲覧できるようになりました（一部紙媒体送付あり）。
木戸之都子氏の巻頭エッセイ「茨城大学 半世紀の想い出」、蓮井誠一郎人文社会科学部長の「同窓会の皆様へ」、中塩紗矢香さんのiOP活動報告、第18回総会案内などが掲載されています。`,
  },
  {
    id: "official-office",
    label: "同窓会公式情報：事務局",
    text: `茨城大学文理・人文学部同窓会事務局は、〒310-8512 水戸市文京2-1-1 茨城大学人文社会科学部内です。
電話は（029）228-8546、または090-3100-5814（鈴木）です。
E-mailはibadai.bj.dousou@gmail.comです。`,
  },
  {
    id: "official-site-navigation",
    label: "同窓会公式サイト：手続き案内",
    text: `住所変更は、住所変更手続きをするボタン、またはUpdateセクションのオンラインフォームから行えます。
会報はNetwork Archiveセクションで閲覧できます。
問い合わせはサイトのお問い合わせフォームから行えます。`,
  },
] as const;

app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);
app.disable("x-powered-by");

// Security headers applied to every response.
// frame-ancestors/X-Frame-Options block clickjacking (esp. the admin page),
// nosniff blocks MIME confusion, and the rest reduce information leakage.
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  );
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  next();
});

// Body parsing: keep the default tight. Only the photo-upload endpoint needs a
// large body, so the 9 MB limit is scoped to it instead of every route.
app.use("/api/stories/submit", express.json({ limit: "9mb" }));
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

function getPublicOrigin(req: Request) {
  const configuredUrl = process.env.SITE_URL || process.env.APP_URL;
  if (configuredUrl && /^https?:\/\//.test(configuredUrl) && configuredUrl !== "MY_APP_URL") {
    return configuredUrl.replace(/\/$/, "");
  }

  const forwardedHost = req.headers["x-forwarded-host"];
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost || req.headers.host || "localhost:3000";
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || req.protocol || "https";
  return `${protocol}://${host}`.replace(/\/$/, "");
}

app.get("/robots.txt", (req, res) => {
  const origin = getPublicOrigin(req);
  res.type("text/plain").send([
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /admin/",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n"));
});

app.get("/googlecde97c1db5a2382b.html", (_req, res) => {
  res.type("text/html").send("google-site-verification: googlecde97c1db5a2382b.html");
});

app.get("/sitemap.xml", (req, res) => {
  const origin = getPublicOrigin(req);
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const urls = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/about", priority: "0.8", changefreq: "monthly" },
    { loc: "/events", priority: "0.8", changefreq: "weekly" },
    { loc: "/archive", priority: "0.8", changefreq: "monthly" },
    { loc: "/contact", priority: "0.7", changefreq: "monthly" },
    { loc: "/newsletter/43", priority: "0.7", changefreq: "monthly" },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${origin}${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  res.type("application/xml").send(body);
});

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

// Adjusts the reserved (projected) budget cost to the actual cost. This must
// succeed or throw independently of the best-effort logging in appendChatAnalytics
// below, so callers can gate `budgetSettled` on it: the budget ledger has to stay
// accurate (or the caller must release the reservation on failure), whereas losing a
// Q&A log entry is not something the user-facing chat response should ever fail for.
async function settleChatBudget(estimatedCostJpy: number, reservedCostJpy: number, month = getCurrentMonth()) {
  if (!hasRedisStorage()) return;
  const costAdjustmentJpy = estimatedCostJpy - reservedCostJpy;
  if (costAdjustmentJpy === 0) return;
  await redisCommand(["INCRBYFLOAT", `${redisKey("usage", month)}:costJpy`, costAdjustmentJpy]);
}

async function appendChatAnalytics(record: ChatAnalyticsRecord) {
  if (hasRedisStorage()) {
    // Best-effort: a Redis hiccup here must never surface as a failed chat response
    // (the budget ledger itself is settled separately via settleChatBudget, above,
    // before this is called, so it isn't affected by a failure in this block).
    try {
      const month = record.month;
      const usagePrefix = redisKey("usage", month);
      const recentKey = redisKey("recent", month);
      const intentsKey = redisKey("intents", month);

      await redisCommand(["INCR", `${usagePrefix}:requests`]);
      await redisCommand(["INCR", `${usagePrefix}:${record.success ? "success" : "failed"}`]);
      await redisCommand(["INCRBY", `${usagePrefix}:inputTokens`, record.inputTokens]);
      await redisCommand(["INCRBY", `${usagePrefix}:outputTokens`, record.outputTokens]);
      await redisCommand(["INCRBYFLOAT", `${usagePrefix}:costUsd`, record.estimatedCostUsd]);
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
    } catch (error) {
      console.error("Failed to persist chat analytics to Redis (non-fatal):", error);
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
  let decodedCookieToken = "";
  try {
    decodedCookieToken = decodeURIComponent(cookieToken);
  } catch {
    // Malformed cookie (e.g. a stray "%"): treat as no token supplied rather than
    // letting decodeURIComponent's URIError crash the request with a 500.
    decodedCookieToken = "";
  }
  const suppliedToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : decodedCookieToken;

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
const addressUpdateRequests = new Map<string, { count: number; resetAt: number }>();
const adminAuthRequests = new Map<string, { count: number; resetAt: number }>();

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

// Cap the number of tracked IPs so a stream of unique/spoofed source IPs can't
// grow these in-memory maps without bound (memory-exhaustion DoS).
const RATE_LIMIT_MAX_ENTRIES = 50_000;

function pruneRateLimitStore(store: Map<string, { count: number; resetAt: number }>, now: number) {
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
  // If still oversized after dropping expired windows, evict oldest insertions.
  if (store.size > RATE_LIMIT_MAX_ENTRIES) {
    const overflow = store.size - RATE_LIMIT_MAX_ENTRIES;
    let removed = 0;
    for (const key of store.keys()) {
      store.delete(key);
      if (++removed >= overflow) break;
    }
  }
}

// In-memory fixed-window limiter. Only safe as a standalone rate limit on a single
// long-lived process; on Vercel's serverless runtime, concurrent/cold-started
// invocations each get their own empty Map, so this alone does not actually bound
// request volume in production. Kept as the fallback for when Redis isn't
// configured (e.g. local dev) and as a same-process safety net when Redis is.
function rateLimitAllowedLocal(
  store: Map<string, { count: number; resetAt: number }>,
  ip: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const existing = store.get(ip);
  if (!existing || existing.resetAt <= now) {
    if (store.size >= RATE_LIMIT_MAX_ENTRIES) pruneRateLimitStore(store, now);
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  existing.count += 1;
  return existing.count <= limit;
}

// Redis-backed fixed-window limiter shared across all serverless instances, with a
// fallback to the in-memory limiter if Redis is unavailable or errors — a Redis
// hiccup should degrade rate limiting, not take the endpoint down or (silently)
// disable the limit entirely.
async function rateLimitAllowed(
  kind: string,
  store: Map<string, { count: number; resetAt: number }>,
  ip: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  if (hasRedisStorage()) {
    try {
      const key = `ratelimit:${kind}:${ip}`;
      const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
      const count = Number(await redisCommand<string>(["INCR", key]));
      // NX: only (re)arms the TTL if the key doesn't already have one, so this is
      // safe to call on every request without resetting an in-progress window.
      await redisCommand(["EXPIRE", key, windowSeconds, "NX"]);
      return count <= limit;
    } catch (error) {
      console.error(`Redis rate limit check failed for "${kind}" (falling back to in-memory):`, error);
    }
  }
  return rateLimitAllowedLocal(store, ip, limit, windowMs);
}

function storyInterviewRateAllowed(ip: string) {
  return rateLimitAllowed("story-interview", storyInterviewRequests, ip, 20, 10 * 60 * 1000);
}

function storySubmissionRateAllowed(ip: string) {
  return rateLimitAllowed("story-submission", storySubmissionRequests, ip, 3, 60 * 60 * 1000);
}

function chatRateAllowed(ip: string) {
  return rateLimitAllowed("chat", chatRequests, ip, 20, 60 * 1000);
}

function registerRateAllowed(ip: string) {
  return rateLimitAllowed("register", registerRequests, ip, 5, 60 * 60 * 1000);
}

function addressUpdateRateAllowed(ip: string) {
  return rateLimitAllowed("address-update", addressUpdateRequests, ip, 5, 60 * 60 * 1000);
}

function adminAuthRateAllowed(ip: string) {
  return rateLimitAllowed("admin-auth", adminAuthRequests, ip, 10, 10 * 60 * 1000);
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
    ...(payload.proofread === false
      ? ["", "⚠️ *AI校正が利用できなかったため、回答者の原文のまま掲載申請されています。*"]
      : []),
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

// Throws on any failure (Gemini error, malformed response, or the monthly AI budget
// being exhausted). Proofreading is a quality-of-life pass over the applicant's own
// words, not a required step, so the caller (/api/stories/submit) treats a thrown
// error as "submit the original text instead" rather than failing the submission.
async function proofreadStoryApplication(payload: any) {
  const interview: StoryInterviewItem[] = Array.isArray(payload.interview)
    ? payload.interview.slice(0, 5).map((item: any) => ({
        question: getSafeText(item?.question, 300),
        answer: getSafeText(item?.answer, 2000),
      }))
    : [];
  const benefit = getSafeText(payload.benefit, 2000);
  const promptContents = JSON.stringify({
    answers: interview.map((item) => item.answer),
    benefit,
  });

  // Route this Gemini call through the same monthly budget ledger as /api/chat so
  // STORIES traffic can't spend the Gemini budget invisibly to the chat cap.
  const projectedInputTokens = estimateTokens(promptContents);
  const budgetReservation = await reserveMonthlyBudget(calculateCost(projectedInputTokens, 3000).estimatedCostJpy);
  if (!budgetReservation.allowed) {
    throw new Error("STORIES proofreading budget exceeded");
  }
  const reservedCostJpy = budgetReservation.reservedCostJpy;

  try {
    const result: any = await getGemini().models.generateContent({
      model: STORIES_GEMINI_MODEL,
      contents: promptContents,
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

    const inputTokens = result.usageMetadata?.promptTokenCount || projectedInputTokens;
    const outputTokens = result.usageMetadata?.candidatesTokenCount || estimateTokens(getSafeText(result.text, 12000));
    await settleChatBudget(calculateCost(inputTokens, outputTokens).estimatedCostJpy, reservedCostJpy);

    return {
      ...payload,
      originalInterview: interview,
      interview: proofreadInterview,
      benefit: benefit ? getSafeText(parsed.benefit, 2000) || benefit : "",
    };
  } catch (error) {
    await releaseMonthlyBudget(reservedCostJpy).catch((releaseError) => {
      console.error("Failed to release STORIES proofreading budget reservation:", releaseError);
    });
    throw error;
  }
}

app.post("/api/stories/interview", async (req, res) => {
  let reservedCostJpy = 0;
  let budgetSettled = false;

  try {
    if (!(await storyInterviewRateAllowed(req.ip || "unknown"))) {
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
        error: "AI機能を一時的にご利用いただけません。お手数ですが、時間をおいて再度お試しください。",
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

    // Route this Gemini call through the same monthly budget ledger as /api/chat.
    // Rate limiting bounds request volume, but not cost directly — without this,
    // STORIES traffic could spend the Gemini budget invisibly to the chat cap.
    const projectedInputTokens = estimateTokens(prompt);
    const budgetReservation = await reserveMonthlyBudget(calculateCost(projectedInputTokens, 160).estimatedCostJpy);
    if (!budgetReservation.allowed) {
      return res.status(429).json({
        error: "AIの月間利用上限に達したため、インタビュー機能を一時停止しています。恐れ入りますが、同窓会事務局へ直接お問い合わせください。",
        code: "BUDGET_EXCEEDED",
      });
    }
    reservedCostJpy = budgetReservation.reservedCostJpy;

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
      await releaseMonthlyBudget(reservedCostJpy).catch((releaseError) => {
        console.error("Failed to release STORIES interview budget reservation:", releaseError);
      });
      return res.status(502).json({
        error: "質問を生成できませんでした。もう一度お試しください。",
        code: "GEMINI_EMPTY_RESPONSE",
      });
    }

    const inputTokens = result.usageMetadata?.promptTokenCount || projectedInputTokens;
    const outputTokens = result.usageMetadata?.candidatesTokenCount || estimateTokens(question);
    await settleChatBudget(calculateCost(inputTokens, outputTokens).estimatedCostJpy, reservedCostJpy);
    budgetSettled = true;

    res.json({
      question,
    });
  } catch (error: any) {
    if (reservedCostJpy > 0 && !budgetSettled) {
      await releaseMonthlyBudget(reservedCostJpy).catch((releaseError) => {
        console.error("Failed to release STORIES interview budget reservation:", releaseError);
      });
    }
    console.error("STORIES interview error:", error);
    const status = Number(error?.status);
    if (status === 401 || status === 403) {
      return res.status(503).json({
        error: "AI機能を一時的にご利用いただけません。お手数ですが、時間をおいて再度お試しください。",
        code: "GEMINI_AUTH_FAILED",
      });
    }
    if (status === 429) {
      return res.status(429).json({
        error: "AIの利用上限に達しています。時間をおいてからお試しください。",
        code: "GEMINI_RATE_LIMITED",
      });
    }
    res.status(502).json({
      error: "AIとの通信に失敗しました。時間をおいてからもう一度お試しください。",
      code: "GEMINI_REQUEST_FAILED",
    });
  }
});

app.post("/api/stories/submit", async (req, res) => {
  try {
    if (!(await storySubmissionRateAllowed(req.ip || "unknown"))) {
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

    try {
      for (const photo of photos) decodeStoryPhoto(photo);
    } catch (photoError: any) {
      // decodeStoryPhoto throws on an unsupported image type or an oversized file —
      // that's a client input problem (400), not a server fault (500).
      return res.status(400).json({
        error: photoError?.message === "Photo exceeds 2MB"
          ? "写真のファイルサイズが大きすぎます（1枚2MBまで）。"
          : "写真の形式をご確認ください（JPEG・PNG・WEBPのみ対応しています）。",
      });
    }

    // Proofreading is best-effort: a Gemini outage, malformed response, or an
    // exhausted monthly AI budget should not block a member's submission — it just
    // means the office reviews the applicant's own wording as typed (formatStoryApplicationForSlack
    // flags this in the Slack message so reviewers know no AI polish was applied).
    let proofreadPayload: any = { ...payload, interview };
    let proofread = false;
    if (process.env.GEMINI_API_KEY) {
      try {
        proofreadPayload = await proofreadStoryApplication({ ...payload, interview });
        proofread = true;
      } catch (proofreadError) {
        console.error("STORIES proofreading failed, submitting original text:", proofreadError);
        proofreadPayload = { ...payload, interview, proofread: false };
      }
    } else {
      proofreadPayload = { ...payload, interview, proofread: false };
    }

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
      proofread,
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
    if (!(await chatRateAllowed(req.ip || "unknown"))) {
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

    const deterministicAnswer = getDeterministicChatAnswer(message);
    if (deterministicAnswer) {
      const sourceLabels = new Map<string, string>(
        CHAT_BASE_SOURCES.map((source) => [source.id, source.label]),
      );
      const citedSources = deterministicAnswer.sourceIds.map((id) => ({
        id,
        label: sourceLabels.get(id) || id,
      }));

      await appendChatAnalytics({
        timestamp: new Date().toISOString(),
        month: getCurrentMonth(),
        model: "deterministic",
        userMessage: sanitizeForAnalytics(message),
        assistantReply: sanitizeForAnalytics(deterministicAnswer.answer),
        inputTokens: 0,
        outputTokens: 0,
        estimatedCostUsd: 0,
        estimatedCostJpy: 0,
        intent: classifyIntent(message),
        success: true,
      });

      return res.json({
        reply: deterministicAnswer.answer,
        supported: true,
        sources: citedSources,
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          estimatedCostJpy: 0,
        },
      });
    }

    const retrievalQuery = buildRetrievalQuery(message, history);
    const newsletterEvidence = retrieveNewsletterEvidence(retrievalQuery);
    const baseKnowledge = CHAT_BASE_SOURCES
      .map((source) => `[${source.id}] ${source.label}\n${source.text}`)
      .join("\n\n");
    const systemInstruction = `あなたは「茨城大学 文理・人文学部同窓会」公式サイトのAIコンシェルジュです。
同窓生、在学生、教職員、一般の皆様からの質問に、親切で丁寧な、温かみのある日本語（敬語）でお答えします。

【確定情報】
${baseKnowledge}

【回答ルール（厳守）】
1. 確定情報と会報抜粋だけを根拠にしてください。学習済み知識、推測、ユーザーが提示した未確認情報を事実として採用してはいけません。
2. 日付、金額、人名、肩書、電話番号、メールアドレス、URL、会場などは根拠本文と完全に一致する場合だけ回答してください。
3. 根拠が不足する、または確認できない内容が含まれる場合は、推測で埋めず supported を false にしてください。
4. supported が true の場合、利用した角括弧内の根拠ID（例: "official-meeting-18"）を sourceIds に必ず列挙してください。
5. 同窓会・大学に無関係な質問や未確認の未来情報、事実無根の質問には応じず、supported を false にしてください。
6. 現在の質問に直接必要な事実だけを答え、無関係な別件の情報を付け足さないでください。
7. 回答は温かく丁寧な敬語で、簡潔かつ実用的にしてください。
8. 必ず指定のJSONスキーマに従って出力してください。

【模範回答の例（Few-shot）】
質問例1: 第18回総会の開催日、会場、懇親会費を教えてください。
出力例1:
{
  "answer": "第18回総会は令和8年7月18日（土）にホテル日航つくばで開催されます。懇親会費はお一人様5,000円です（総会・講演会のみ参加の場合は無料）。",
  "supported": true,
  "sourceIds": ["official-meeting-18"]
}

質問例2: 卒業証明書の発行をお願いできますか？
出力例2:
{
  "answer": "卒業証明書や成績証明書等の各種証明書は、同窓会事務局では発行業務を行っておりません。茨城大学教育推進課または人文社会科学部学務グループ窓口へ直接ご請求ください。",
  "supported": true,
  "sourceIds": ["official-certificates"]
}

質問例3: 2027年の総会日程を教えてください。
出力例3:
{
  "answer": "申し訳ありません。2027年の総会日程は現在の公式情報から確認できておりません。恐れ入りますが、同窓会事務局へお問い合わせください。",
  "supported": false,
  "sourceIds": []
}`;

    const augmentedSystemInstruction = newsletterEvidence.context
      ? `${systemInstruction}\n\n${newsletterEvidence.context}`
      : systemInstruction;

    const projectedInputTokens = estimateTokens(
      augmentedSystemInstruction +
      retrievalQuery
    );
    const projectedCost = calculateCost(projectedInputTokens, 512);

    let gemini;
    try {
      gemini = getGemini();
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        error: "AIチャットが一時的にご利用いただけません。お手数ですが、時間をおいて再度お試しください。",
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
      });
    }

    const availableSources = [
      ...CHAT_BASE_SOURCES,
      ...newsletterEvidence.sources,
    ];
    const allowedSourceIds = new Set(availableSources.map((source) => source.id));
    const sourceTexts = new Map(
      availableSources.map((source) => [source.id, source.text]),
    );
    const sourceLabels = new Map(
      availableSources.map((source) => [source.id, source.label]),
    );

    const result: any = await gemini.models.generateContent({
      model: GEMINI_CHAT_MODEL,
      contents: retrievalQuery,
      config: {
        systemInstruction: augmentedSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["answer", "supported", "sourceIds"],
          properties: {
            answer: {
              type: Type.STRING,
              description: "ユーザーに表示する簡潔な日本語回答",
            },
            supported: {
              type: Type.BOOLEAN,
              description: "回答全体が提示された根拠だけで裏付けられる場合のみtrue",
            },
            sourceIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "回答に実際に使った角括弧内の根拠ID",
            },
          },
        },
        temperature: 0,
        topP: 0.2,
        maxOutputTokens: 512,
      },
    });

    const groundedAnswer = parseGroundedAnswer(
      result.text,
      allowedSourceIds,
      sourceTexts,
    );
    const reply = groundedAnswer.answer;
    const citedSources = groundedAnswer.sourceIds.map((id) => ({
      id,
      label: sourceLabels.get(id) || id,
    }));
    const inputTokens = result.usageMetadata?.promptTokenCount || projectedInputTokens;
    const outputTokens = result.usageMetadata?.candidatesTokenCount || estimateTokens(reply);
    const actualCost = calculateCost(inputTokens, outputTokens);

    // Settle the budget ledger first and mark it settled immediately on success, so
    // the catch block below only ever releases the reservation when it genuinely
    // was never applied — a failure in the best-effort analytics logging that
    // follows must not cause the reservation to be released a second time.
    await settleChatBudget(actualCost.estimatedCostJpy, reservedCostJpy);
    budgetSettled = true;

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
    });

    res.json({
      reply,
      supported: groundedAnswer.supported,
      sources: citedSources,
      usage: {
        inputTokens,
        outputTokens,
        estimatedCostJpy: actualCost.estimatedCostJpy,
      },
    });
  } catch (error: any) {
    if (reservedCostJpy > 0 && !budgetSettled) {
      await releaseMonthlyBudget(reservedCostJpy).catch((releaseError) => {
        console.error("Failed to release chat budget reservation:", releaseError);
      });
    }
    console.error("Chat error:", error);
    // Gemini intermittently returns 503/UNAVAILABLE ("high demand"). Surface a
    // dedicated MODEL_OVERLOADED message so the UI can suggest retrying.
    const rawMessage = typeof error?.message === "string" ? error.message : "";
    const isOverloaded =
      error?.status === 503 ||
      error?.code === 503 ||
      /503|UNAVAILABLE|overloaded|high demand/i.test(rawMessage);
    if (isOverloaded) {
      return res.status(503).json({
        error: "ただいまAIチャットへのアクセスが集中しています。恐れ入りますが、少し時間をおいて再度お試しください。",
        code: "MODEL_OVERLOADED",
      });
    }
    res.status(500).json({
      error: "予期しないエラーが発生しました。時間をおいて再度お試しください。",
      code: "CHAT_ERROR",
    });
  }
});

app.get("/api/chat/usage", async (req, res) => {
  if (!(await adminAuthRateAllowed(req.ip || "unknown"))) {
    return res.status(429).json({ error: "試行回数が多いため、少し時間をおいて再度お試しください。" });
  }
  const auth = authorizeChatAnalytics(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.message });
  }

  res.json(await getMonthlyUsage());
});

app.get("/api/chat/analytics", async (req, res) => {
  if (!(await adminAuthRateAllowed(req.ip || "unknown"))) {
    return res.status(429).json({ error: "試行回数が多いため、少し時間をおいて再度お試しください。" });
  }
  const auth = authorizeChatAnalytics(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.message });
  }

  const month = typeof req.query.month === "string" ? req.query.month : getCurrentMonth();
  res.json(await buildChatAnalytics(month));
});

app.post("/admin/chat-analytics/login", async (req, res) => {
  if (!(await adminAuthRateAllowed(req.ip || "unknown"))) {
    return res.status(429).type("html").send(adminLoginHtml("試行回数が多いため、少し時間をおいて再度お試しください。"));
  }

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

app.get("/admin/chat-analytics", async (req, res) => {
  if (!(await adminAuthRateAllowed(req.ip || "unknown"))) {
    return res.status(429).type("html").send(adminLoginHtml("試行回数が多いため、少し時間をおいて再度お試しください。"));
  }
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

// Forward a form payload to the GAS web app. Throws when the webhook is missing,
// unreachable, or reports an error, so callers can map failures to one place.
async function forwardToFormWebhook(payload: Record<string, unknown>) {
  if (!FORM_WEBHOOK_URL) {
    const error: any = new Error("Form webhook is not configured");
    error.code = "FORM_WEBHOOK_NOT_CONFIGURED";
    throw error;
  }

  const response = await fetch(FORM_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      FORM_WEBHOOK_SECRET ? { ...payload, token: FORM_WEBHOOK_SECRET } : payload,
    ),
  });

  if (!response.ok) {
    throw new Error(`GAS WebApp returned status: ${response.status}`);
  }

  const resData: any = await response.json().catch(() => ({ status: "success" }));
  if (resData.status === "error") {
    throw new Error(resData.error || "GAS WebApp returned an error");
  }
  return resData;
}

// GAS Forwarding Webhook registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    if (!(await registerRateAllowed(req.ip || "unknown"))) {
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

    const resData = await forwardToFormWebhook(payload);

    return res.json({
      status: "success",
      message: "第１８回総会へのお申込みを受け付けました。",
      integrated: true,
      data: resData
    });
  } catch (error: any) {
    console.error("Registration endpoint error:", error);
    if (error?.code === "FORM_WEBHOOK_NOT_CONFIGURED") {
      return res.status(503).json({
        error: "送信先が未設定です。事務局へ直接メールでお問い合わせください。",
        code: "FORM_WEBHOOK_NOT_CONFIGURED",
      });
    }
    res.status(500).json({
      error: "登録リクエストの処理中にエラーが発生しました。時間をおいて再度お試しください。",
      code: "GAS_FORWARD_FAILED"
    });
  }
});

// Address / contact-info update form → GAS web app (formType: "address-update").
// forms.gs reads fullName / email / phone at the top level and the new address
// fields from `details` (see the address-update branch in google-apps-script/forms.gs).
app.post("/api/address-update", async (req, res) => {
  try {
    if (!(await addressUpdateRateAllowed(req.ip || "unknown"))) {
      return res.status(429).json({
        error: "短時間に多くの送信リクエストがありました。少し時間をおいて再度お試しください。",
        code: "RATE_LIMITED",
      });
    }

    const fullName = getSafeText(req.body?.fullName, 100);
    const nameKana = getSafeText(req.body?.nameKana, 100);
    const birthdate = getSafeText(req.body?.birthdate, 30);
    const gradYear = getSafeText(req.body?.gradYear, 50);
    const department = getSafeText(req.body?.department, 100);
    const postalCode = getSafeText(req.body?.postalCode, 10);
    const prefecture = getSafeText(req.body?.prefecture, 20);
    const cityAddress = getSafeText(req.body?.cityAddress, 200);
    const building = getSafeText(req.body?.building, 200);
    const phone = getSafeText(req.body?.phone, 30);
    const email = getSafeText(req.body?.email, 200);
    const subscribeMail = req.body?.subscribeMail === true;

    if (!fullName || !postalCode || !prefecture || !cityAddress) {
      return res.status(400).json({ error: "氏名と新しいご住所（郵便番号・都道府県・市区町村番地）をご入力ください。" });
    }
    if (!phone && !email) {
      return res.status(400).json({ error: "確認のご連絡のため、電話番号またはメールアドレスをご入力ください。" });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "メールアドレスの形式をご確認ください。" });
    }

    const payload = {
      formType: "address-update",
      recipients: FORM_RECIPIENTS,
      submittedAt: new Date().toISOString(),
      fullName,
      email,
      phone,
      subject: `【住所変更届】 ${fullName} 様`,
      details: {
        nameKana,
        birthdate,
        gradYear,
        department,
        postalCode,
        prefecture,
        cityAddress,
        building,
        subscribeMail: subscribeMail ? "希望する" : "希望しない",
      },
    };

    const resData = await forwardToFormWebhook(payload);

    return res.json({
      status: "success",
      message: "住所変更届を受け付けました。",
      integrated: true,
      data: resData,
    });
  } catch (error: any) {
    console.error("Address update endpoint error:", error);
    if (error?.code === "FORM_WEBHOOK_NOT_CONFIGURED") {
      return res.status(503).json({
        error: "送信先が未設定です。お手数ですが、事務局へ直接メールでお問い合わせください。",
        code: "FORM_WEBHOOK_NOT_CONFIGURED",
      });
    }
    res.status(500).json({
      error: "住所変更届の送信中にエラーが発生しました。時間をおいて再度お試しください。",
      code: "GAS_FORWARD_FAILED",
    });
  }
});

// This module only configures and exports the Express app. The dev/host bootstrap
// (Vite middleware, static serving, app.listen) lives in dev-server.ts so that the
// Vercel serverless function (api/index.ts → this module) never imports Vite or binds
// a port. Keeping Vite out of the serverless import graph avoids ERR_MODULE_NOT_FOUND.
export { app };
export default app;
