import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

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

    const chatHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const chat = gemini.chats.create({
      model: "gemini-3.5-flash",
      history: chatHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const result = await chat.sendMessage({
      message: message
    });

    res.json({ reply: result.text || "申し訳ありません。回答を生成できませんでした。" });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "予期しないエラーが発生しました。" });
  }
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
