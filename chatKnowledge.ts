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

import { newsletterArchiveIssues } from "./src/data/newsletterArchive.js";

type IndexedArticle = {
  issueNumber: number;
  issueDate: string; // e.g. "2020.06"
  eraDate: string; // e.g. "令和2年6月発行"
  title: string;
  author: string;
  paragraphs: string[]; // deck + body, de-duplicated (source of injected excerpt)
  text: string; // normalized full-article text (for literal substring matching)
};

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
  const cleaned = normalize(input).replace(
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

// Choose the paragraph that best showcases the most specific matched term.
function pickExcerpt(
  article: IndexedArticle,
  rankedTerms: { term: string; idf: number }[]
): string {
  for (const { term } of rankedTerms) {
    const para = article.paragraphs.find((p) => normalize(p).includes(term));
    if (para) return clip(para);
  }
  return clip(article.paragraphs[0] || "");
}

/**
 * Retrieve a compact, prompt-ready context block of the newsletter articles most
 * relevant to `query`. Returns an empty string when nothing clears the relevance
 * threshold, so unrelated questions (住所変更・greetings 等) inject nothing.
 */
export function retrieveNewsletterContext(
  query: string,
  maxArticles = 3
): string {
  const index = getIndex();

  const queryNumbers = new Set(normalize(query).match(/\d{2,4}/g) || []);
  const hasIssueNumberHint = Array.from(queryNumbers).some((n) =>
    newsletterArchiveIssues.some((i) => String(i.number) === n)
  );

  // Rank query terms by specificity (rarest first) for excerpt selection.
  const rankedTerms = extractTerms(query)
    .map((term) => ({ term, idf: termIdf(term, index) }))
    .filter((t) => t.idf > 0)
    .sort((a, b) => b.idf - a.idf);

  const hasSpecificTerm = rankedTerms.some((t) => t.idf >= MIN_TERM_IDF);
  // Inject only when the question names a known issue number or contains at least
  // one reasonably specific term that actually appears in the archive.
  if (!hasIssueNumberHint && !hasSpecificTerm) return "";

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
  if (selected.length === 0) return "";

  const lines = selected.map(({ article }) => {
    const excerpt = pickExcerpt(article, rankedTerms);
    return `- 第${article.issueNumber}号（${article.issueDate}／${article.eraDate}）「${article.title}」（${article.author}）: ${excerpt}`;
  });

  return [
    "【会報アーカイブ 関連記事（参考）】",
    "※以下はユーザーの質問に関連する可能性のある会報記事の抜粋です。回答の根拠として利用できますが、抜粋に書かれていない内容は創作しないでください。引用する際は「第○号」と号数を明示してください。",
    ...lines,
  ].join("\n");
}
