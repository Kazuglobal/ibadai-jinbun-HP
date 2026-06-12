import express from "express";
import type { Request } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const GEMINI_CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-2.5-flash-lite";
const CHAT_MONTHLY_BUDGET_JPY = getPositiveEnvNumber("CHAT_MONTHLY_BUDGET_JPY", 1000);
const CHAT_USD_JPY_RATE = getPositiveEnvNumber("CHAT_USD_JPY_RATE", 160);
const GEMINI_INPUT_USD_PER_1M = getPositiveEnvNumber("GEMINI_INPUT_USD_PER_1M", 0.1);
const GEMINI_OUTPUT_USD_PER_1M = getPositiveEnvNumber("GEMINI_OUTPUT_USD_PER_1M", 0.4);
const MAX_HISTORY_MESSAGES = getPositiveEnvNumber("CHAT_MAX_HISTORY_MESSAGES", 8);
const CHAT_RECENT_MESSAGE_RETENTION_DAYS = getPositiveEnvNumber("CHAT_RECENT_MESSAGE_RETENTION_DAYS", 7);
const REDIS_REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const CHAT_ANALYTICS_FILE = path.join(process.cwd(), "data", "chat-analytics.json");

app.use(express.json());
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
  fs.mkdirSync(path.dirname(CHAT_ANALYTICS_FILE), { recursive: true });
  fs.writeFileSync(CHAT_ANALYTICS_FILE, JSON.stringify(pruneLocalRecords(records).slice(-500), null, 2));
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
          success: record.success,
          estimatedCostJpy: record.estimatedCostJpy,
        }),
      ]);
      await redisCommand(["LTRIM", recentKey, 0, 49]);
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
      redisCommand<string[]>(["LRANGE", redisKey("recent", month), 0, 29]),
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
      .slice(-30)
      .reverse()
      .map((record) => ({
        timestamp: record.timestamp,
        intent: record.intent,
        userMessage: record.userMessage,
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

  if (suppliedToken !== token) {
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

// REST API for Chat Assistant
app.post("/api/chat", async (req, res) => {
  let reservedCostJpy = 0;
  let budgetSettled = false;

  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const trimmedHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_MESSAGES) : [];
    const systemInstruction = `あなたは「茨城大学 文理・人文学部同窓会」のAI親睦コンシェルジュ（アシスタント）です。
同窓生、在学生、教職員の皆様、あるいは一般の皆様の質問に対して、親切で丁寧な、温かみのある日本語（敬語）で回答してください。

私たちは、以下の手続きや情報を案内できます：
1. 住所変更手続き（サイト上の「住所変更手続きをする」ボタンや「Update」セクションから、またはオンラインフォームにて迅速に変更可能）
2. 最新ニュースや活動、同窓生イベント（同窓総会、懇親会、キャリア支援、支部会情報など）
3. 同窓会報（年に一回の活動アーカイブ「Network Archive」、オンラインでの会報閲覧）
4. お問い合わせ（茨城大学文理・人文学部同窓会事務局、〒310-8512 水戸市文京2-1-1 茨城大学人文社会科学部内、℡ （029）228-8546、090-3100-5814（鈴木）、E-mail：ibadai.bj.dousou@gmail.com）

歴史的知識：
- 茨城大学は1949年（昭和24年）に設置されました。
- 文理学部は茨城大学創立当初から存在した伝統ある学部で、のちに人文学部（現在の人文社会科学部）と理学部に改組されました。そのため、本同窓会は「文理・人文学部同窓会」として、両学部の卒業生の皆様の温かいネットワークを維持しています。

回答のルール：
- 親密で親切な回答にしてください。フッターやヘッダーに配置されたメニュー項目についても親しみの持てる方法で教えてください。
- 同窓生の方が「住所変更」「手続き」「会報閲覧」「お問い合わせ」などをしたそうにしている場合は、それに応じたセクションへ画面スクロールできることを親身に案内してください。
- 簡潔で実用的、かつ信頼感のある内容にしてください。字数は1回の回答で150〜300文字程度が読みやすく最適です。
- 無理に答えを捏造せず、具体的な手続きや事務局への連絡先がある場合はそれを紹介してください。`;

    const projectedInputTokens = estimateTokens(
      systemInstruction +
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
        systemInstruction,
        temperature: 0.7,
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

  if (submittedToken !== expectedToken) {
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
      <table><thead><tr><th>日時</th><th>カテゴリ</th><th>質問</th><th>概算費用</th></tr></thead><tbody id="questions"></tbody></table>
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
        ? data.recentQuestions.map((row) => '<tr><td>' + escapeHtml(row.timestamp) + '</td><td>' + escapeHtml(row.intent) + '</td><td>' + escapeHtml(row.userMessage) + '</td><td>' + yen.format(row.estimatedCostJpy) + '円</td></tr>').join("")
        : '<tr><td colspan="4">まだデータがありません</td></tr>';
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
    const { fullName, kana, gradYear, address, phone, partyStatus, memo } = req.body;
    
    if (!fullName || !gradYear || !address || !phone) {
      return res.status(400).json({ error: "必須項目が入力されていません。" });
    }

    const payload = {
      fullName,
      kana: kana || "",
      gradYear,
      address,
      phone,
      partyStatus: partyStatus || "attend",
      memo: memo || ""
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

// Vite server integrations
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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

startServer();
