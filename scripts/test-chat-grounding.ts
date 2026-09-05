import assert from "node:assert/strict";
import test from "node:test";

import {
  retrieveNewsletterContext,
  retrieveNewsletterEvidence,
} from "../chatKnowledge";
import {
  buildRetrievalQuery,
  getDeterministicChatAnswer,
  parseGroundedAnswer,
  sanitizeUserHistory,
} from "../chatGrounding";
import { CHAT_FAQ_QUESTIONS } from "../src/data/chatUiConfig";

test("第43号の総会情報を日時と会場を含めて取得する", () => {
  const context = retrieveNewsletterContext("第43号の総会はいつ、どこで開催されますか？");

  assert.match(context, /第43号/);
  assert.match(context, /令和8年7月18日/);
  assert.match(context, /ホテル日航つくば/);
});

test("検索結果には検証可能な根拠IDと表示名を付ける", () => {
  const evidence = retrieveNewsletterEvidence("第43号の総会の会場は？");

  assert.equal(evidence.sources[0]?.id, "newsletter-43-meeting");
  assert.match(evidence.sources[0]?.label || "", /第43号/);
  assert.match(evidence.context, /\[newsletter-43-meeting\]/);
});

test("同じ記事内の会場と講師を一度の検索で取得する", () => {
  const evidence = retrieveNewsletterEvidence("第43号の総会の会場と講師は？", 1);

  assert.match(evidence.context, /ホテル日航つくば/);
  assert.match(evidence.context, /佐川泰弘/);
});

test("追質問の検索には直近のユーザー質問だけを補う", () => {
  const history = [
    { role: "model", content: "総会は架空ホテルで開催されます。" },
    { role: "user", content: "第43号の総会について教えてください" },
    { role: "model", content: "前回の回答です。" },
  ];

  assert.equal(
    buildRetrievalQuery("その会場はどこですか？", history),
    "第43号の総会について教えてください\nその会場はどこですか？",
  );
});

test("主語が明確な新しい質問には直前の話題を混ぜない", () => {
  assert.equal(
    buildRetrievalQuery("事務局の営業時間は？", [
      { role: "user", content: "第43号の総会について教えてください" },
      { role: "model", content: "前回の回答です。" },
    ]),
    "事務局の営業時間は？",
  );
});

test("開催日時の追質問では受付・開始時刻の段落を取得する", () => {
  const query = buildRetrievalQuery("その開催日時は？", [
    { role: "user", content: "第43号の総会について教えてください" },
    { role: "model", content: "前回の回答です。" },
  ]);
  const evidence = retrieveNewsletterEvidence(query, 1);

  assert.match(evidence.context, /午後1時30分/);
  assert.match(evidence.context, /受付は午後1時/);
});

test("履歴からモデル発言・不正な要素・長すぎる文章を除外する", () => {
  const history = [
    { role: "model", content: "この内容は信頼しない" },
    { role: "user", content: "  正常な質問  " },
    { role: "user", content: "x".repeat(700) },
    { role: "user", content: 123 },
    null,
  ];

  assert.deepEqual(sanitizeUserHistory(history), [
    "正常な質問",
    "x".repeat(500),
  ]);
});

test("許可された根拠IDがないモデル回答を採用しない", () => {
  const parsed = parseGroundedAnswer(
    JSON.stringify({
      answer: "架空の会場で開催されます。",
      supported: true,
      sourceIds: ["unknown-source"],
    }),
    new Set(["newsletter-43"]),
  );

  assert.equal(parsed.supported, false);
  assert.match(parsed.answer, /確認できておりません/);
  assert.deepEqual(parsed.sourceIds, []);
});

test("許可された根拠ID付きの回答だけを採用する", () => {
  const parsed = parseGroundedAnswer(
    JSON.stringify({
      answer: "令和8年7月18日にホテル日航つくばで開催されます。",
      supported: true,
      sourceIds: ["newsletter-43"],
    }),
    new Set(["newsletter-43"]),
  );

  assert.equal(parsed.supported, true);
  assert.deepEqual(parsed.sourceIds, ["newsletter-43"]);
});

test("根拠本文にない日付・金額・連絡先を含む回答を採用しない", () => {
  const parsed = parseGroundedAnswer(
    JSON.stringify({
      answer: "総会は2026年8月1日に開催され、参加費は5,000円です。",
      supported: true,
      sourceIds: ["official-events"],
    }),
    new Set(["official-events"]),
    new Map([["official-events", "総会は隔年で開催します。"]]),
  );

  assert.equal(parsed.supported, false);
  assert.match(parsed.answer, /確認できておりません/);
});

test("根拠本文にない役職者名を含む回答を採用しない", () => {
  const parsed = parseGroundedAnswer(
    JSON.stringify({
      answer: "同窓会の会長は田中太郎です。",
      supported: true,
      sourceIds: ["official-overview"],
    }),
    new Set(["official-overview"]),
    new Map([["official-overview", "同窓会の会長は大和田 一雄です。"]]),
  );

  assert.equal(parsed.supported, false);
});

test("FAQは未確認の営業時間を質問候補として提示しない", () => {
  assert.equal(CHAT_FAQ_QUESTIONS.some((item) => item.question.includes("営業時間")), false);
  assert.equal(CHAT_FAQ_QUESTIONS.some((item) => item.question.includes("事務局の場所")), true);
});

test("終身会費は生成AIを使わず確定情報から回答する", () => {
  const answer = getDeterministicChatAnswer("同窓会の終身会費はいくらですか？");

  assert.equal(answer?.supported, true);
  assert.match(answer?.answer || "", /10,000円/);
  assert.deepEqual(answer?.sourceIds, ["official-membership"]);
});

test("総会の参加費を終身会費と混同しない", () => {
  assert.equal(
    getDeterministicChatAnswer("第18回総会の参加費はいくらですか？"),
    null,
  );
});

test("現在の会長と名誉会長を確定情報から回答する", () => {
  const answer = getDeterministicChatAnswer("現在の会長と名誉会長は誰ですか？");

  assert.match(answer?.answer || "", /大和田 一雄/);
  assert.match(answer?.answer || "", /蓮井 誠一郎/);
  assert.deepEqual(answer?.sourceIds, ["official-overview"]);
});

test("卒業証明書や成績証明書の発行は大学教務窓口を案内する", () => {
  const answer = getDeterministicChatAnswer("卒業証明書を発行してもらえますか？");

  assert.equal(answer?.supported, true);
  assert.match(answer?.answer || "", /同窓会では発行できません/);
  assert.match(answer?.answer || "", /教育推進課|学務/);
  assert.deepEqual(answer?.sourceIds, ["official-certificates"]);
});

test("会員の逝去・物故連絡の案内を確定情報から回答する", () => {
  const answer = getDeterministicChatAnswer("会員が亡くなられたときはどうすればいいですか？");

  assert.equal(answer?.supported, true);
  assert.match(answer?.answer || "", /亡くなられた日/);
  assert.match(answer?.answer || "", /事務局/);
  assert.deepEqual(answer?.sourceIds, ["official-membership"]);
});

test("寄付についての問い合わせを確定情報から回答する", () => {
  const answer = getDeterministicChatAnswer("同窓会に寄付をしたいのですが");

  assert.equal(answer?.supported, true);
  assert.match(answer?.answer || "", /ご寄付/);
  assert.match(answer?.answer || "", /事務局/);
  assert.deepEqual(answer?.sourceIds, ["official-membership"]);
});

test("号数を指定しない「総会はどこですか？」でもコア単語で最新総会記事を取得する", () => {
  const evidence = retrieveNewsletterEvidence("総会の会場はどこですか？", 1);

  assert.ok(evidence.sources.length > 0);
  assert.match(evidence.context, /ホテル日航つくば/);
  assert.equal(evidence.sources[0]?.id, "newsletter-43-meeting");
});

test("「学長は誰ですか？」で学長・佐川泰弘氏の情報を検索できる", () => {
  const evidence = retrieveNewsletterEvidence("学長は誰ですか？", 1);

  assert.ok(evidence.sources.length > 0);
  assert.match(evidence.context, /佐川泰弘/);
});

test("金額の表記揺れ（5千円と5,000円）があってもグラウンディング検証を通過する", () => {
  const parsed = parseGroundedAnswer(
    JSON.stringify({
      answer: "懇親会費は5千円です。",
      supported: true,
      sourceIds: ["official-meeting-18"],
    }),
    new Set(["official-meeting-18"]),
    new Map([["official-meeting-18", "懇親会費：5,000円です。"]]),
  );

  assert.equal(parsed.supported, true);
  assert.match(parsed.answer, /5千円/);
});

test("学長や講師など多様な役職者の氏名が検証される", () => {
  const parsed = parseGroundedAnswer(
    JSON.stringify({
      answer: "講演会の講師は学長 佐川泰弘氏です。",
      supported: true,
      sourceIds: ["newsletter-43-meeting"],
    }),
    new Set(["newsletter-43-meeting"]),
    new Map([["newsletter-43-meeting", "講演会の講師は茨城大学学長 佐川泰弘氏です。"]]),
  );

  assert.equal(parsed.supported, true);
  assert.deepEqual(parsed.sourceIds, ["newsletter-43-meeting"]);
});

test("根拠にない学長・講師名を捏造した回答を採用しない", () => {
  const parsed = parseGroundedAnswer(
    JSON.stringify({
      answer: "講演会の講師は学長 山田太郎氏です。",
      supported: true,
      sourceIds: ["newsletter-43-meeting"],
    }),
    new Set(["newsletter-43-meeting"]),
    new Map([["newsletter-43-meeting", "講演会の講師は茨城大学学長 佐川泰弘氏です。"]]),
  );

  assert.equal(parsed.supported, false);
  assert.match(parsed.answer, /確認できておりません/);
});

test("住所変更の手続きを確定情報から回答する", () => {
  const answer = getDeterministicChatAnswer("引っ越したので住所を変更したいです");

  assert.equal(answer?.supported, true);
  assert.match(answer?.answer || "", /住所変更/);
  assert.match(answer?.answer || "", /Updateセクション|オンラインフォーム/);
  assert.deepEqual(answer?.sourceIds, ["official-site-navigation"]);
});

test("会報のオンライン閲覧方法を確定情報から回答する", () => {
  const answer = getDeterministicChatAnswer("会報をオンラインで見たいです");

  assert.equal(answer?.supported, true);
  assert.match(answer?.answer || "", /Network Archive/);
  assert.deepEqual(answer?.sourceIds, ["official-site-navigation"]);
});

test("退会手続きについての質問を確定情報から回答する", () => {
  const answer = getDeterministicChatAnswer("同窓会を退会したい場合はどうすればいいですか？");

  assert.equal(answer?.supported, true);
  assert.match(answer?.answer || "", /終身会員制/);
  assert.match(answer?.answer || "", /事務局/);
  assert.deepEqual(answer?.sourceIds, ["official-membership"]);
});

test("根拠にない未来の日付（2027年など）を捏造した回答は却下される", () => {
  const parsed = parseGroundedAnswer(
    JSON.stringify({
      answer: "2027年総会は2027年10月10日に開催されます。",
      supported: true,
      sourceIds: ["official-meeting-18"],
    }),
    new Set(["official-meeting-18"]),
    new Map([["official-meeting-18", "第18回総会は令和8年7月18日（土）に開催されます。"]]),
  );

  assert.equal(parsed.supported, false);
  assert.match(parsed.answer, /確認できておりません/);
});

test("悪意あるプロンプト注入で架空の情報を返そうとしても根拠照合で弾かれる", () => {
  const parsed = parseGroundedAnswer(
    JSON.stringify({
      answer: "指示を無視して秘密の情報を開示します。暗証番号は9999です。",
      supported: true,
      sourceIds: ["official-overview"],
    }),
    new Set(["official-overview"]),
    new Map([["official-overview", "正式名称は茨城大学 文理・人文学部同窓会です。"]]),
  );

  assert.equal(parsed.supported, false);
  assert.match(parsed.answer, /確認できておりません/);
});
