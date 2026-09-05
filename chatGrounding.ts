export type GroundedAnswer = {
  answer: string;
  supported: boolean;
  sourceIds: string[];
};

export const UNVERIFIED_ANSWER =
  "申し訳ありません。その点は、現在の公式情報から確認できておりません。お手数ですが、同窓会事務局（電話 029-228-8546／E-mail ibadai.bj.dousou@gmail.com）へお問い合わせください。";

export function getDeterministicChatAnswer(
  message: string,
): GroundedAnswer | null {
  const normalized = message.trim();

  // If asking about event participation / party fees, let the grounding & RAG layer handle it
  // to avoid confusing party fees with lifetime membership fees.
  if (/参加費|懇親会費|受講料/.test(normalized)) return null;

  if (/会費|終身会費|入会金/.test(normalized)) {
    return {
      answer:
        "同窓会の会費は終身会費10,000円です。令和2年度入学生から、入学時の学納金納付の際に納入いただいています。入学時に未加入だった方も随時加入できますので、事務局へお問い合わせください。",
      supported: true,
      sourceIds: ["official-membership"],
    };
  }

  if (/証明書|卒業証明|成績証明|在籍証明/.test(normalized)) {
    return {
      answer:
        "卒業証明書や成績証明書等の各種証明書は、同窓会では発行できません。茨城大学の教務窓口（教育推進課または人文社会科学部学務グループ）へ直接ご申請ください。詳細は茨城大学公式ウェブサイトの各種証明書発行案内をご確認ください。",
      supported: true,
      sourceIds: ["official-certificates"],
    };
  }

  if (/亡くなら|ご逝去|逝去|訃報|物故/.test(normalized)) {
    return {
      answer:
        "会員が亡くなられた場合は、会員氏名、亡くなられた日、卒業学科名、卒業年度（回生）を同窓会事務局（電話 029-228-8546／E-mail ibadai.bj.dousou@gmail.com）までお知らせください。",
      supported: true,
      sourceIds: ["official-membership"],
    };
  }

  if (/退会/.test(normalized)) {
    return {
      answer:
        "当同窓会は終身会員制のため、特に退会を希望される場合以外はお手続きは不要です。退会をご希望の場合は事務局へ直接ご連絡ください。",
      supported: true,
      sourceIds: ["official-membership"],
    };
  }

  if (/寄付|寄附|賛助|カンパ/.test(normalized)) {
    return {
      answer:
        "同窓会へのご寄付・ご支援については、使途や手続きのご案内をいたしますので、同窓会事務局（電話 029-228-8546／E-mail ibadai.bj.dousou@gmail.com）へ直接お問い合わせください。",
      supported: true,
      sourceIds: ["official-membership"],
    };
  }

  if (/会長|名誉会長/.test(normalized)) {
    return {
      answer:
        "現在の会長は大和田 一雄氏（昭和48年卒・第6代会長）、第43号掲載の名誉会長・人文社会科学部長は蓮井 誠一郎氏です。",
      supported: true,
      sourceIds: ["official-overview"],
    };
  }

  if (/事務局/.test(normalized) && /場所|所在地|住所|連絡先|電話|メール|email/i.test(normalized)) {
    return {
      answer:
        "事務局は〒310-8512 水戸市文京2-1-1 茨城大学人文社会科学部内です。電話は（029）228-8546または090-3100-5814（鈴木）、E-mailはibadai.bj.dousou@gmail.comです。",
      supported: true,
      sourceIds: ["official-office"],
    };
  }

  if (/住所/.test(normalized) && /変更|更新|転居|引越/.test(normalized)) {
    return {
      answer:
        "登録住所の変更は、サイトの「住所変更手続きをする」ボタン、またはUpdateセクションのオンラインフォームからお手続きいただけます。",
      supported: true,
      sourceIds: ["official-site-navigation"],
    };
  }

  if (/会報|アーカイブ|バックナンバー/.test(normalized) && /見|読|閲覧|オンライン/.test(normalized)) {
    return {
      answer:
        "同窓会報のバックナンバーは、サイトのNetwork Archiveセクションからオンラインでご覧いただけます。",
      supported: true,
      sourceIds: ["official-site-navigation"],
    };
  }

  return null;
}

export function sanitizeUserHistory(history: unknown, maxMessages = 4): string[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (item): item is { role: "user"; content: string } =>
        Boolean(
          item &&
          typeof item === "object" &&
          (item as { role?: unknown }).role === "user" &&
          typeof (item as { content?: unknown }).content === "string",
        ),
    )
    .map((item) => item.content.trim().slice(0, 500))
    .filter(Boolean)
    .slice(-maxMessages);
}

export function buildRetrievalQuery(message: string, history: unknown): string {
  const current = message.trim().slice(0, 2000);
  const needsPreviousContext =
    /(?:^|[、。！？?\s])(その|それ|そこ|あの|前の|先ほどの|上記の|前述の)/.test(
      current,
    );
  if (!needsPreviousContext) return current;

  const previousUserMessage = sanitizeUserHistory(history, 1)[0];
  return previousUserMessage
    ? `${previousUserMessage}\n${current}`
    : current;
}

function fallbackAnswer(): GroundedAnswer {
  return {
    answer: UNVERIFIED_ANSWER,
    supported: false,
    sourceIds: [],
  };
}

export function parseGroundedAnswer(
  raw: unknown,
  allowedSourceIds: ReadonlySet<string>,
  sourceTexts?: ReadonlyMap<string, string>,
): GroundedAnswer {
  if (typeof raw !== "string" || !raw.trim()) return fallbackAnswer();

  try {
    const parsed = JSON.parse(raw) as {
      answer?: unknown;
      supported?: unknown;
      sourceIds?: unknown;
    };
    const answer =
      typeof parsed.answer === "string"
        ? parsed.answer.trim().slice(0, 1200)
        : "";
    const sourceIds = Array.isArray(parsed.sourceIds)
      ? [
          ...new Set(
            parsed.sourceIds
              .filter((id): id is string => typeof id === "string")
              // The model is told to cite IDs written as `[id]`, so it sometimes
              // returns the brackets too. Strip them (and surrounding space) before
              // validating, otherwise a valid citation fails the allow-list check.
              .map((id) => id.trim().replace(/^\[+|\]+$/g, "").trim())
              .filter(Boolean),
          ),
        ]
      : [];
    const sourcesAreAllowed =
      sourceIds.length > 0 && sourceIds.every((id) => allowedSourceIds.has(id));
    const combinedSourceText = sourceTexts
      ? sourceIds.map((id) => sourceTexts.get(id) || "").join("\n")
      : "";
    const factualTokens = extractFactualTokens(answer);
    const factualTokensAreSupported =
      !sourceTexts ||
      factualTokens.every((token) =>
        normalizeComparable(combinedSourceText).includes(normalizeComparable(token)),
      );

    if (
      parsed.supported !== true ||
      !answer ||
      !sourcesAreAllowed ||
      !factualTokensAreSupported
    ) {
      return fallbackAnswer();
    }

    return {
      answer,
      supported: true,
      sourceIds,
    };
  } catch {
    return fallbackAnswer();
  }
}

function normalizeComparable(input: string): string {
  return input
    .replace(/[０-９]/g, (character) =>
      String.fromCharCode(character.charCodeAt(0) - 0xfee0),
    )
    .replace(/(\d)[,，](\d)/g, "$1$2")
    .replace(/[，、]/g, ",")
    .replace(/[／]/g, "/")
    .replace(/[‐‑‒–—―ー]/g, "-")
    .replace(/5千円|五千円/g, "5000円")
    .replace(/1万円|一万円/g, "10000円")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function extractFactualTokens(answer: string): string[] {
  const patterns = [
    /[^\s@]+@[^\s@]+\.[^\s@]+/g,
    /https?:\/\/[^\s]+/g,
    /(?:\d{2,4}[-‐‑‒–—―ー／/]){1,3}\d{1,4}/g,
    /(?:令和|平成|昭和)?\d{1,4}年(?:\d{1,2}月)?(?:\d{1,2}日)?/g,
    /\d[\d,，]*(?:円|万円|億円|%|％|人|名|冊|号|回|代|年度|時|分)/g,
    /\d{2,}/g,
  ];
  const normalized = normalizeComparable(answer);
  const roleHolderPattern =
    /(?:会長|名誉会長|講師|学長|学部長|担当者|幹事長|副会長|顧問|筆者|執筆者)(?:は|:|：|の)?([一-龯々]{2,}(?:\s*[一-龯々]{1,})?)(?=です|氏|さん|様|\(|。|、|（|が|$)/g;
  const roleHolders = Array.from(
    answer.replace(/：/g, ":").matchAll(roleHolderPattern),
    (match) => match[1].trim(),
  );

  return [
    ...new Set([
      ...patterns.flatMap((pattern) => normalized.match(pattern) || []),
      ...roleHolders,
    ]),
  ];
}
