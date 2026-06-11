import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Minus,
  Plus,
  Quote,
} from 'lucide-react';

import { getNewsletterIssue } from '../data/newsletterArchive';
import NewsletterArticleBody from './NewsletterArticleBody';

type NewsletterArchiveMagazineProps = {
  issueNumber: number;
  onIssueChange: (issueNumber: number) => void;
};

const archiveIssueNumbers = [43, 42, 41, 40, 39, 38, 37, 36, 35, 34];

export default function NewsletterArchiveMagazine({
  issueNumber,
  onIssueChange,
}: NewsletterArchiveMagazineProps) {
  const issue = getNewsletterIssue(issueNumber);
  const [activeArticleId, setActiveArticleId] = React.useState(issue?.articles[0]?.id ?? '');
  const [fontScale, setFontScale] = React.useState(1);
  const articleTopRef = React.useRef<HTMLDivElement>(null);
  const readerRef = React.useRef<HTMLDivElement>(null);
  const selectedIssueButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setActiveArticleId(issue?.articles[0]?.id ?? '');
    setFontScale(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [issue]);

  React.useLayoutEffect(() => {
    const button = selectedIssueButtonRef.current;
    const scroller = button?.parentElement?.parentElement;
    if (!button || !scroller) return;

    scroller.scrollTo({
      left: button.offsetLeft - (scroller.clientWidth - button.clientWidth) / 2,
      behavior: 'auto',
    });
  }, [issue.number]);

  React.useEffect(() => {
    if (window.location.hash !== '#newsletter-reader') return;

    const timer = window.setTimeout(() => {
      readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  if (!issue) {
    return (
      <section className="min-h-[70vh] bg-[#F8F1E6] px-4 py-24 text-center text-[#14213D]">
        <FileText className="mx-auto h-12 w-12 text-[#B57A24]" />
        <h2 className="mt-5 font-serif text-3xl font-bold">会報が見つかりません</h2>
        <button
          type="button"
          onClick={() => onIssueChange(43)}
          className="mt-8 inline-flex h-11 items-center gap-2 bg-[#14213D] px-6 text-sm font-bold text-white"
        >
          最新号を見る
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    );
  }

  const activeIndex = Math.max(
    0,
    issue.articles.findIndex((article) => article.id === activeArticleId),
  );
  const activeArticle = issue.articles[activeIndex] ?? issue.articles[0];
  const activeArticlePhotos = issue.gallery.filter((photo) => photo.articleId === activeArticle.id);
  const readingProgress = ((activeIndex + 1) / issue.articles.length) * 100;
  const highlights = issue.articles.slice(0, 3);

  const scrollToArticleTop = () => {
    window.setTimeout(() => {
      articleTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const selectArticle = (articleId: string) => {
    setActiveArticleId(articleId);
    scrollToArticleTop();
  };

  const moveArticle = (direction: number) => {
    const nextIndex = (activeIndex + direction + issue.articles.length) % issue.articles.length;
    setActiveArticleId(issue.articles[nextIndex].id);
    scrollToArticleTop();
  };

  const goHome = () => {
    window.location.href = window.location.pathname;
  };

  return (
    <section
      id={`newsletter-${issue.number}`}
      className="relative overflow-hidden bg-[#F8F1E6] py-10 text-[#14213D] sm:py-14 lg:py-20 xl:py-24"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[#D7C8AA]" aria-hidden="true" />
      <div
        className="absolute right-0 top-24 hidden h-[520px] w-[38vw] border-y border-l border-[#D7C8AA]/70 bg-[#FFFCF6]/55 xl:block"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-24 left-0 hidden h-[300px] w-[22vw] border-y border-r border-[#D7C8AA]/60 bg-[#EAF0EA]/70 xl:block"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex h-11 w-full items-center justify-center gap-2 border border-[#D7C8AA] bg-[#FFFCF6] px-5 text-sm font-bold text-stone-600 transition-colors hover:border-[#B57A24] hover:text-[#14213D] sm:w-fit"
          >
            <ChevronLeft className="h-4 w-4" />
            ホームへ戻る
          </button>
          <a
            href="#newsletter-reader"
            className="inline-flex h-11 w-full items-center justify-center gap-2 bg-[#14213D] px-5 text-sm font-bold text-white transition-colors hover:bg-[#B57A24] sm:w-fit"
          >
            記事一覧へ
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2" aria-label="会報の号を選択">
            {archiveIssueNumbers.map((number) => (
              <button
                key={number}
                ref={number === issue.number ? selectedIssueButtonRef : undefined}
                type="button"
                onClick={() => onIssueChange(number)}
                className={`h-10 border px-4 text-xs font-black tracking-[0.12em] transition-colors ${
                  number === issue.number
                    ? 'border-[#14213D] bg-[#14213D] text-white'
                    : 'border-[#D7C8AA] bg-[#FFFCF6] text-stone-600 hover:border-[#B57A24]'
                }`}
              >
                第{number}号
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative grid gap-6 lg:gap-8 xl:grid-cols-[420px_1fr]"
        >
          <aside className="relative min-h-[520px] overflow-hidden rounded-lg bg-[#111827] text-white shadow-[0_24px_70px_rgba(20,33,61,0.22)] sm:min-h-[560px] xl:min-h-[620px]">
            {issue.coverImage ? (
              <img
                src={issue.coverImage}
                alt={`会報第${issue.number}号の表紙ビジュアル`}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
            ) : (
              <div className="absolute inset-0 bg-[#283A4E]" aria-hidden="true" />
            )}
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-[#111827]/40 to-[#111827]/95" aria-hidden="true" />
            <div className="absolute left-5 top-5 h-[calc(100%-40px)] w-[calc(100%-40px)] border border-white/35" aria-hidden="true" />
            <div className="relative flex min-h-[520px] flex-col justify-between p-5 sm:min-h-[560px] sm:p-8 xl:min-h-[620px]">
              <div>
                <div className="flex items-center justify-between gap-4 border-y border-white/50 py-3 text-[10px] font-black tracking-[0.16em] text-white/90 sm:text-[11px] sm:tracking-[0.22em]">
                  <span>IBARAKI</span>
                  <span>WEB MAGAZINE</span>
                </div>
                <h2 className="mt-8 font-serif text-[44px] font-bold leading-none text-white sm:text-[58px] xl:text-[68px]">
                  同窓会報
                  <span className="mt-3 block text-[70px] text-[#E0A23A] sm:text-[92px] xl:text-[104px]">
                    {issue.number}
                  </span>
                </h2>
                <p className="mt-5 max-w-[320px] font-serif text-[15px] font-bold leading-7 text-[#FFF8EA] sm:text-[18px] sm:leading-8">
                  <span className="block">茨城大学文理・人文学部同窓会</span>
                  <span className="block">会報 第{issue.number}号</span>
                </p>
                <div className="mt-7 grid grid-cols-[58px_1fr] gap-4 border-y border-white/30 py-4 sm:mt-8 sm:grid-cols-[72px_1fr]">
                  <p className="font-serif text-[30px] leading-none text-[#E0A23A] sm:text-[38px]">特集</p>
                  <p className="text-[12px] font-bold leading-6 tracking-[0.08em] text-white/85">
                    {issue.theme}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3 border-y border-white/30 py-5 text-sm">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-[#E0A23A]">ISSUE</p>
                    <p className="mt-1 font-serif text-2xl font-bold">{issue.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-[#E0A23A]">STORIES</p>
                    <p className="mt-1 font-serif text-2xl font-bold">{String(issue.articles.length).padStart(2, '0')}</p>
                  </div>
                </div>
                <a
                  href="#newsletter-reader"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 bg-[#E0A23A] px-5 text-sm font-black tracking-[0.16em] text-[#111827] transition-colors hover:bg-white"
                >
                  読み始める
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </aside>

          <div className="relative flex min-w-0 flex-col justify-between rounded-lg border border-[#D7C8AA] bg-[#FFFCF6] p-5 shadow-sm sm:p-6 lg:p-8 xl:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-black tracking-[0.18em] text-[#B57A24]">
                <span className="inline-flex items-center gap-2 border border-[#D7C8AA] px-3 py-2">
                  <BookOpen className="h-4 w-4" />
                  WEB MAGAZINE
                </span>
                <span className="inline-flex items-center gap-2 border border-[#D7C8AA] px-3 py-2">
                  <CalendarDays className="h-4 w-4" />
                  {issue.eraDate}
                </span>
              </div>
              <h3 className="mt-8 max-w-3xl font-serif text-[34px] font-bold leading-tight text-[#14213D] sm:text-4xl lg:text-5xl xl:text-6xl">
                {issue.theme}
              </h3>
              <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-stone-600">
                {issue.description}
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {highlights.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => selectArticle(article.id)}
                  className="group border border-[#D7C8AA] bg-[#F8F1E6] p-5 text-left transition-colors hover:border-[#B57A24] hover:bg-white"
                >
                  <p className="text-[10px] font-black tracking-[0.2em] text-[#B57A24]">{article.label}</p>
                  <p className="mt-3 font-serif text-xl font-bold leading-7 text-[#14213D]">{article.title}</p>
                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-stone-600">{article.deck}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-black tracking-[0.14em] text-[#B57A24]">
                    READ
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div ref={readerRef} id="newsletter-reader" className="mt-10 scroll-mt-28 grid gap-6 xl:grid-cols-[300px_1fr] xl:gap-8">
          <nav className="xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-lg border border-[#D7C8AA] bg-[#FFFCF6] p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-serif text-2xl font-bold">Contents</h4>
                <FileText className="h-5 w-5 text-[#B57A24]" />
              </div>
              <div className="mt-5 h-2 overflow-hidden bg-[#E8DDC5]" aria-label="記事位置">
                <div className="h-full bg-[#14213D] transition-all duration-300" style={{ width: `${readingProgress}%` }} />
              </div>
              <p className="mt-2 text-[10px] font-black tracking-[0.16em] text-stone-500">
                記事 {activeIndex + 1}/{issue.articles.length}
              </p>
              <div className="mt-5 max-h-[58vh] space-y-2 overflow-y-auto pr-1">
                {issue.articles.map((article) => (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => selectArticle(article.id)}
                    className={`grid w-full grid-cols-[42px_1fr] gap-3 border p-3 text-left transition-colors ${
                      activeArticle.id === article.id
                        ? 'border-[#B57A24] bg-[#FFF4DC] text-[#14213D]'
                        : 'border-[#E3D7BF] bg-white text-stone-600 hover:border-[#B57A24]/60'
                    }`}
                  >
                    <span className="font-serif text-xl font-bold text-[#B57A24]">{article.page}</span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-black tracking-[0.14em] text-[#B57A24]">{article.label}</span>
                      <span className="mt-1 block text-sm font-bold leading-5">{article.title}</span>
                      <span className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-stone-400">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <article className="min-w-0 rounded-lg border border-[#D7C8AA] bg-[#FFFCF6] shadow-sm">
            <div
              ref={articleTopRef}
              className="scroll-mt-28 border-b border-[#D7C8AA] p-5 sm:p-8"
              style={{ borderTop: `6px solid ${activeArticle.accent}` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl font-bold sm:text-5xl" style={{ color: activeArticle.accent }}>
                    {activeArticle.page}
                  </span>
                  <div>
                    <p className="text-[11px] font-black tracking-[0.18em]" style={{ color: activeArticle.accent }}>
                      {activeArticle.label}
                    </p>
                    <p className="mt-1 max-w-xl text-sm font-bold leading-5 text-stone-500">{activeArticle.author}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-stone-400">
                      <Clock className="h-3.5 w-3.5" />
                      {activeArticle.readTime}
                    </p>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-2 border border-[#D7C8AA] bg-white px-3 py-2 sm:w-auto">
                  <span className="mr-1 text-xs font-bold text-stone-500">文字サイズ</span>
                  <button
                    type="button"
                    onClick={() => setFontScale((value) => Math.max(0.92, value - 0.08))}
                    className="flex h-8 w-8 items-center justify-center border border-[#D7C8AA] bg-[#FFFCF6] text-stone-600 hover:text-[#14213D]"
                    aria-label="本文を小さくする"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontScale((value) => Math.min(1.16, value + 0.08))}
                    className="flex h-8 w-8 items-center justify-center border border-[#D7C8AA] bg-[#FFFCF6] text-stone-600 hover:text-[#14213D]"
                    aria-label="本文を大きくする"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h4 className="mt-7 max-w-3xl font-serif text-[28px] font-bold leading-tight text-[#14213D] sm:text-4xl xl:text-5xl">
                {activeArticle.title}
              </h4>
              <p className="mt-5 max-w-3xl text-[15px] font-medium leading-8 text-stone-600 sm:text-base">
                {activeArticle.deck}
              </p>
            </div>

            <div className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[280px_1fr]">
              <div>
                <aside className="border-l-4 bg-[#F8F1E6] p-5" style={{ borderColor: activeArticle.accent }}>
                  <Quote className="h-5 w-5" style={{ color: activeArticle.accent }} />
                  <p className="mt-3 font-serif text-xl font-bold leading-8 text-[#14213D]">{activeArticle.pullQuote}</p>
                </aside>
              </div>

              <NewsletterArticleBody
                articleId={activeArticle.id}
                body={activeArticle.body}
                photos={activeArticlePhotos}
                fontScale={fontScale}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-[#D7C8AA] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <button
                type="button"
                onClick={() => moveArticle(-1)}
                className="inline-flex h-11 items-center justify-center gap-2 border border-[#D7C8AA] bg-white px-5 text-sm font-bold text-stone-600 hover:text-[#14213D]"
              >
                <ChevronLeft className="h-4 w-4" />
                前の記事
              </button>
              <p className="text-center text-xs font-black tracking-[0.16em] text-stone-500">
                {activeIndex + 1} / {issue.articles.length}
              </p>
              <button
                type="button"
                onClick={() => moveArticle(1)}
                className="inline-flex h-11 items-center justify-center gap-2 border border-[#D7C8AA] bg-white px-5 text-sm font-bold text-stone-600 hover:text-[#14213D]"
              >
                次の記事
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
}
