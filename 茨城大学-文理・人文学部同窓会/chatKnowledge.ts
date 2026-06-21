// Lightweight, dependency-free retrieval over the newsletter archive ("会報").
// The chat model only knows what is placed in its prompt, so for questions about
// specific newsletter content we retrieve the most relevant articles and inject
// short, verbatim excerpts.
//
// Approach: literal-term TF-IDF. We extract "content terms" from the question
// (runs of kanji / katakana / digits / latin — hiragana particles and punctuation
// are dropped, so greetings like 「こんにちは」 yield no terms and match nothing),
// then score each article by the rarity (idf) of the query terms it literally
// contains. This is far more precise on Japanese than word tokenization or naive
// bigram overlap, and needs no embeddings / external API (no latency or Gemini cost).

import { newsletterArchiveIssues } from "./src/data/newsletterArchive";

type IndexedArticle = {
  id: string;
  issueNumber: number;
  issueDate: string; // e.g. "2020.06"
  eraDate: string; // e.g. "令和2年6月発行"
  title: string;
  author: string;
  paragraphs: string[]; // deck + body, de-duplicated (source of injected excerpt)
  text: string; // normalized full-article text (for literal substring matching)
};

// The newest issue is rendered by Newsletter43WebMagazine rather than the legacy
// archive component. Keep its factual text in the server-side search corpus so
// the chatbot does not silently stop at issue 42.
const latestIssueArticles = [
  {
    id: "memory",
    title: "茨城大学 半世紀の想い出",
    author: "木戸 之都子（人文・文10回卒）",
    deck: "入学から50年。人文学部、人文図書室、同窓会名簿づくりの記憶をたどる巻頭エッセイ。",
    body: [
      "1982年に設立された文理・人文学部同窓会には設立準備段階から加わり、私の担当は同窓会名簿作成でした。同窓会名簿は今年の発行で10冊目になります。",
      "同窓会費が入学時に徴収する方式になってから現在の同窓会加入率は95％になっていると聞きます。設立当初は加入率も30％と伸び悩んでいました。",
    ],
  },
  {
    id: "dean",
    title: "同窓会の皆様へ",
    author: "同窓会名誉会長・人文社会科学部長　蓮井 誠一郎",
    deck: "新学部長就任に際して、学部・大学院教育の現在と、人のつながりの再構築を語る。",
    body: [
      "今春、人文社会科学部長・学野長・研究科長に就任いたしました。",
      "大学院では来年度から文部科学省に採択された「ダイバーシティ地域共創プログラム」の学位プログラム化を行います。",
    ],
  },
  {
    id: "iop",
    title: "ひたちなか市における子どもの居場所づくり",
    author: "人文社会科学部4年　中塩 紗矢香",
    deck: "NPO法人「ただいま」でのiOP活動を通じ、学校の外側から子どもたちの実態を見つめる。",
    body: [
      "2024年9月から、ひたちなか市のフリースクール「ふらっと」や放課後の居場所「てらこや」にて週1回のスタッフ業務を行いました。",
      "活動を通じて、一人ひとりの特性に応じた個別最適な支援の重要性を学びました。",
    ],
  },
  {
    id: "meeting",
    title: "第18回総会の開催について",
    author: "茨城大学文理・人文学部同窓会",
    deck: "令和8年7月18日、ホテル日航つくばで開催。総会、講演会、懇親会のご案内。",
    body: [
      "会則第9条により、第18回総会を令和8年7月18日（土）につくば市内で開催します。",
      "日時は令和8年7月18日（土）午後1時30分から3時30分まで、受付は午後1時からです。場所は、つくば市吾妻1-1364-1 ホテル日航つくばです。",
      "議題は、決算・事業報告、予算・事業計画、その他。講演会の講師は茨城大学学長 佐川泰弘氏です。",
      "出席する場合は、名前、卒業年月、住所及び電話番号を同窓会事務局まで連絡します。",
    ],
  },
  {
    id: "afterword",
    title: "編集後記",
    author: "A・S",
    deck: "第43号からデジタル化へ。スマートフォンでも気軽に読める会報への移行について。",
    body: [
      "会報は第43号からデジタル化しました。会員にはハガキでQRコードを送り、スマートフォン等で閲覧できるようになりました。",
      "一部の方には紙媒体でも送付しました。",
    ],
  },
] as const;

// A matched term this rare (present in ≤ ~6 of 52 articles) makes an article
// eligible for injection; below it, matches are treated as too generic.
const MIN_TERM_IDF = 2.0;

// Generic words that can be statistically rare in this formal archive yet carry no
// retrieval intent (e.g. a one-off 「今日」). Dropped so questions like
// 「今日の天気は？」 don't latch onto an unrelated article.
const STOPWORD_TERMS = new Set([
  "今日", "明日", "昨日", "本日", "今年", "昨年", "来年", "最近",
  "場所", "内容", "方法", "時間", "意味", "情報", "教えて",
]);

// Normalize: drop whitespace, fold full-width ASCII/digits to half-width, lowercase.
function normalize(input: string): string {
  return (input || "")
    .replace(/[　\s]+/g, "")
    .replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .toLowerCase();
}

// Extract content terms: maximal runs of kanji / katakana / digits / latin / 々.
// Everything else (hiragana, punctuation) becomes a separator, so particles and
// greetings drop out. Terms shorter than 2 chars are ignored.
function extractTerms(input: string): string[] {
  const normalizedInput = normalize(input);
  const cleaned = normalizedInput.replace(
    /[^0-9a-z゠-ヿ一-鿿々]+/g,
    " "
  );
  const seen = new Set<string>();
  const terms: string[] = [];
  for (const t of cleaned.split(/\s+/)) {
    if (t.length >= 2 && !seen.has(t) && !STOPWORD_TERMS.has(t)) {
      seen.add(t);
      terms.push(t);
    }
  }
  const semanticExpansions: Array<[RegExp, string[]]> = [
    [/(開催日時|何時|いつ)/, ["日時", "受付"]],
    [/(会場|どこ)/, ["場所"]],
    [/(連絡先|問い合わせ)/, ["電話", "email"]],
  ];
  for (const [pattern, expansions] of semanticExpansions) {
    if (!pattern.test(normalizedInput)) continue;
    for (const expansion of expansions) {
      if (!seen.has(expansion)) {
        seen.add(expansion);
        terms.push(expansion);
      }
    }
  }
  return terms;
}

// Collect deck + body paragraphs, dropping blanks and verbatim duplicates
// (decks frequently repeat the first body line).
function collectParagraphs(deck: string, body: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of [deck, ...(body || [])]) {
    const text = (raw || "").trim().replace(/\s+/g, " ");
    if (!text) continue;
    const key = normalize(text);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

function clip(text: string, maxChars = 230): string {
  return text.length <= maxChars ? text : text.slice(0, maxChars).trimEnd() + "…";
}

// Build the searchable index once and memoize it (data is static at runtime).
let cachedIndex: IndexedArticle[] | null = null;

function getIndex(): IndexedArticle[] {
  if (cachedIndex) return cachedIndex;
  const index: IndexedArticle[] = [];
  for (const issue of newsletterArchiveIssues) {
    for (const article of issue.articles) {
      const paragraphs = collectParagraphs(article.deck, article.body);
      const textRaw = [
        `第${issue.number}号`,
        issue.issueDate,
        issue.eraDate,
        issue.theme,
        issue.description,
        article.label,
        article.title,
        article.author,
        article.pullQuote,
        ...paragraphs,
      ].join(" ");
      index.push({
        id: article.id,
        issueNumber: issue.number,
        issueDate: issue.issueDate,
        eraDate: issue.eraDate,
        title: article.title,
        author: article.author,
        paragraphs,
        text: normalize(textRaw),
      });
    }
  }
  for (const article of latestIssueArticles) {
    const paragraphs = collectParagraphs(article.deck, [...article.body]);
    index.push({
      id: article.id,
      issueNumber: 43,
      issueDate: "2026.06",
      eraDate: "令和8年6月発行",
      title: article.title,
      author: article.author,
      paragraphs,
      text: normalize([
        "第43号",
        "2026.06",
        "令和8年6月発行",
        article.title,
        article.author,
        ...paragraphs,
      ].join(" ")),
    });
  }
  cachedIndex = index;
  return index;
}

// idf of a literal term = log((N+1)/(df+1)); memoized per term.
const idfCache = new Map<string, number>();

function termIdf(term: string, index: IndexedArticle[]): number {
  const cached = idfCache.get(term);
  if (cached !== undefined) return cached;
  let df = 0;
  for (const article of index) {
    if (article.text.includes(term)) df++;
  }
  const idf = df === 0 ? 0 : Math.log((index.length + 1) / (df + 1));
  idfCache.set(term, idf);
  return idf;
}

// Choose up to two paragraphs so multi-part questions (e.g. venue + lecturer)
// do not lose facts that are split across adjacent article sections.
function pickExcerpt(
  article: IndexedArticle,
  rankedTerms: { term: string; idf: number }[]
): string {
  const scored = article.paragraphs
    .map((paragraph, index) => ({
      paragraph,
      index,
      score: rankedTerms.reduce(
        (total, { term, idf }) =>
          total + (normalize(paragraph).includes(term) ? idf : 0),
        0,
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2)
    .sort((a, b) => a.index - b.index);

  if (scored.length > 0) {
    return scored.map((item) => clip(item.paragraph)).join(" ");
  }
  return clip(article.paragraphs[0] || "");
}

/**
 * Retrieve a compact, prompt-ready context block of the newsletter articles most
 * relevant to `query`. Returns an empty string when nothing clears the relevance
 * threshold, so unrelated questions (住所変更・greetings 等) inject nothing.
 */
export type NewsletterEvidence = {
  context: string;
  sources: Array<{ id: string; label: string; text: string }>;
};

export function retrieveNewsletterEvidence(
  query: string,
  maxArticles = 3
): NewsletterEvidence {
  const index = getIndex();

  const queryNumbers = new Set(normalize(query).match(/\d{2,4}/g) || []);
  const hasIssueNumberHint = Array.from(queryNumbers).some((n) =>
    [...newsletterArchiveIssues.map((i) => String(i.number)), "43"].includes(n)
  );

  // Rank query terms by specificity (rarest first) for excerpt selection.
  const rankedTerms = extractTerms(query)
    .map((term) => ({ term, idf: termIdf(term, index) }))
    .filter((t) => t.idf > 0)
    .sort((a, b) => b.idf - a.idf);

  const hasSpecificTerm = rankedTerms.some((t) => t.idf >= MIN_TERM_IDF);
  // Inject only when the question names a known issue number or contains at least
  // one reasonably specific term that actually appears in the archive.
  if (!hasIssueNumberHint && !hasSpecificTerm) {
    return { context: "", sources: [] };
  }

  const scored = index.map((article) => {
    let score = 0;
    for (const { term, idf } of rankedTerms) {
      if (article.text.includes(term)) score += idf;
    }
    if (queryNumbers.has(String(article.issueNumber))) score += 12;
    if (queryNumbers.has(article.issueDate.slice(0, 4))) score += 5;
    return { article, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const minScore = hasIssueNumberHint ? 1 : MIN_TERM_IDF;
  const selected = scored
    .filter((s) => s.score >= minScore)
    .slice(0, maxArticles);
  if (selected.length === 0) return { context: "", sources: [] };

  const lines = selected.map(({ article }) => {
    const excerpt = pickExcerpt(article, rankedTerms);
    const sourceId = `newsletter-${article.issueNumber}-${article.id}`;
    return `- [${sourceId}] 第${article.issueNumber}号（${article.issueDate}／${article.eraDate}）「${article.title}」（${article.author}）: ${excerpt}`;
  });

  return {
    context: [
      "【会報アーカイブ 関連記事（参考）】",
      "※以下はユーザーの質問に関連する可能性のある会報記事の抜粋です。回答の根拠として利用できますが、抜粋に書かれていない内容は創作しないでください。",
      ...lines,
    ].join("\n"),
    sources: selected.map(({ article }) => {
      const excerpt = pickExcerpt(article, rankedTerms);
      return {
        id: `newsletter-${article.issueNumber}-${article.id}`,
        label: `会報第${article.issueNumber}号「${article.title}」`,
        text: `第${article.issueNumber}号 ${article.issueDate} ${article.eraDate} ${article.title} ${article.author} ${excerpt}`,
      };
    }),
  };
}

export function retrieveNewsletterContext(
  query: string,
  maxArticles = 3,
): string {
  return retrieveNewsletterEvidence(query, maxArticles).context;
}
