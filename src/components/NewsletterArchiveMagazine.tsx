import React from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Menu,
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
const fontScales = [0.875, 1, 1.125, 1.25];

function changeFontScale(current: number, direction: -1 | 1) {
  const nearestIndex = fontScales.reduce(
    (bestIndex, scale, index) =>
      Math.abs(scale - current) < Math.abs(fontScales[bestIndex] - current) ? index : bestIndex,
    0,
  );
  return fontScales[Math.min(fontScales.length - 1, Math.max(0, nearestIndex + direction))];
}

export default function NewsletterArchiveMagazine({
  issueNumber,
  onIssueChange,
}: NewsletterArchiveMagazineProps) {
  const issue = getNewsletterIssue(issueNumber);
  const [activeArticleId, setActiveArticleId] = React.useState(issue?.articles[0]?.id ?? '');
  const [fontScale, setFontScale] = React.useState(1);
  const articleTopRef = React.useRef<HTMLDivElement>(null);
  const readerRef = React.useRef<HTMLDivElement>(null);
  const timelineRef = React.useRef<HTMLDivElement>(null);
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
  }, [issueNumber]);

  React.useEffect(() => {
    if (window.location.hash !== '#newsletter-reader') return;

    const timer = window.setTimeout(() => {
      readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  if (!issue) {
    return (
      <section className="min-h-[70vh] bg-[#F8F4EC] px-4 py-24 text-center text-[#14213D]">
        <FileText className="mx-auto h-12 w-12 text-[#B87816]" />
        <h2 className="mt-5 font-serif text-3xl font-bold">会報が見つかりません</h2>
        <button
          type="button"
          onClick={() => onIssueChange(43)}
          className="mt-8 inline-flex min-h-11 items-center gap-2 bg-[#14213D] px-6 text-sm font-bold text-white"
        >
          最新号を見る
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    );
  }

  const activeIndex = Math.max(0, issue.articles.findIndex((article) => article.id === activeArticleId));
  const activeArticle = issue.articles[activeIndex] ?? issue.articles[0];
  const activeArticlePhotos = issue.gallery.filter((photo) => photo.articleId === activeArticle.id);
  const readingProgress = ((activeIndex + 1) / issue.articles.length) * 100;

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
    <section id={`newsletter-${issue.number}`} className="relative bg-[#F8F4EC] pb-28 pt-6 text-[#14213D] sm:pb-32 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-bold text-stone-600 hover:text-[#14213D]"
          >
            <ChevronLeft className="h-4 w-4" />
            ホームへ戻る
          </button>
          <button
            type="button"
            onClick={() => timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-bold text-[#14213D]"
          >
            <Menu className="h-5 w-5" />
            目次
          </button>
        </div>

        <div className="mb-4 overflow-x-auto overscroll-x-contain pb-2 scroll-smooth [touch-action:pan-x_pan-y] [-webkit-overflow-scrolling:touch] scrollbar-none">
          <div className="flex min-w-max gap-2" aria-label="会報の号を選択">
            {archiveIssueNumbers.map((number) => (
              <button
                key={number}
                ref={number === issue.number ? selectedIssueButtonRef : undefined}
                type="button"
                onClick={() => onIssueChange(number)}
                className={`min-h-11 rounded-full border px-4 text-xs font-black tracking-[0.08em] transition-colors ${
                  number === issue.number
                    ? 'border-[#062B59] bg-[#062B59] text-white'
                    : 'border-[#D7C8AA] bg-[#FFFCF7] text-stone-600 hover:border-[#B87816]'
                }`}
              >
                第{number}号
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden border border-[#DED4C2] bg-[#FFFCF7] shadow-[0_14px_42px_rgba(20,33,61,0.08)]">
          <div className="grid grid-cols-[minmax(0,1fr)_100px] items-center gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-8 sm:p-8 lg:grid-cols-[1fr_330px] lg:gap-12 lg:p-12">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-[10px] font-black tracking-[0.2em] sm:text-[12px] sm:tracking-[0.24em]">WEB MAGAZINE</span>
                <span className="font-serif text-3xl leading-none text-[#B87816] sm:text-5xl">{issue.number}</span>
              </div>
              <p className="mt-2 text-xs font-bold text-stone-600 sm:mt-3 sm:text-sm">{issue.eraDate}</p>
              <h2 className="mt-4 max-w-xl font-serif text-[26px] font-bold leading-[1.45] tracking-[0.01em] sm:mt-6 sm:text-5xl lg:text-6xl">
                {issue.theme}
              </h2>
              <p className="mt-4 hidden max-w-lg text-[15px] font-medium leading-8 text-stone-600 min-[430px]:block sm:text-base">
                {issue.description}
              </p>
              <button
                type="button"
                onClick={() => selectArticle(issue.articles[0].id)}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#062B59] px-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(6,43,89,0.18)] transition-colors hover:bg-[#B87816] sm:mt-7 sm:min-h-14 sm:w-auto sm:gap-3 sm:px-7 sm:text-base"
              >
                最初の記事を読む
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <div className="mx-auto w-full max-w-[300px]">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111827] shadow-[0_16px_32px_rgba(20,33,61,0.2)]">
                {issue.coverImage ? (
                  <img src={issue.coverImage} alt={`会報第${issue.number}号の表紙ビジュアル`} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-[#283A4E]" aria-hidden="true" />
                )}
                <div className="absolute inset-0 bg-linear-to-b from-[#071C39]/15 via-[#071C39]/35 to-[#071C39]/92" aria-hidden="true" />
                <div className="relative flex h-full flex-col justify-between p-2.5 text-white sm:p-5">
                  <div className="flex justify-between text-[5px] font-black tracking-[0.1em] sm:text-[9px] sm:tracking-[0.18em]">
                    <span>IBARAKI</span>
                    <span>WEB MAGAZINE</span>
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold sm:text-3xl">同窓会報</p>
                    <p className="font-serif text-4xl leading-none text-[#E4A52E] sm:text-7xl">{issue.number}</p>
                    <p className="mt-2 hidden border-t border-white/40 pt-2 text-xs font-bold leading-6 sm:block">{issue.theme}</p>
                    <div className="mt-2 flex gap-2 text-[7px] font-bold sm:mt-4 sm:gap-8 sm:text-xs">
                      <span>{issue.issueDate}</span>
                      <span>{String(issue.articles.length).padStart(2, '0')} STORIES</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={timelineRef} className="scroll-mt-24 py-8 sm:py-16">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#D8CDBA] pb-4 sm:mb-8 sm:pb-5">
            <div>
              <p className="text-[11px] font-black tracking-[0.22em] text-[#B87816]">CONTENTS</p>
              <h3 className="mt-2 font-serif text-[28px] font-bold sm:text-4xl">{issue.articles.length}つの物語をたどる</h3>
            </div>
            <p className="shrink-0 text-xs font-bold text-stone-500">全{issue.articles.length}記事</p>
          </div>

          <div className="relative">
            <div className="absolute bottom-3 left-[46px] top-3 w-px bg-[#C98B23] sm:left-[68px]" aria-hidden="true" />
            <div className="space-y-5 sm:space-y-7">
              {issue.articles.map((article, index) => (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => selectArticle(article.id)}
                  className="group relative grid w-full grid-cols-[74px_1fr] gap-4 text-left sm:grid-cols-[112px_1fr] sm:gap-7"
                >
                  <span className="relative z-10 block bg-[#F8F4EC] py-2">
                    <span className="block font-serif text-[38px] font-bold leading-none text-[#062B59] sm:text-6xl">{article.page}</span>
                    <span className="mt-3 block text-[11px] font-black leading-5 text-[#B87816] sm:text-sm">{article.label}</span>
                    <span className="mt-3 flex items-center gap-1 text-[10px] font-bold text-stone-500 sm:text-xs">
                      <Clock className="h-3.5 w-3.5" />
                      {article.readTime}
                    </span>
                  </span>

                  <span className="overflow-hidden border border-[#E2D8C8] bg-[#FFFCF7] shadow-[0_8px_22px_rgba(20,33,61,0.07)] transition-transform group-hover:-translate-y-0.5">
                    <span className={`grid ${article.image ? 'md:grid-cols-2' : ''}`}>
                      {article.image && index % 2 === 0 && (
                        <img src={article.image} alt={article.imageAlt ?? ''} className="h-44 w-full bg-[#F3EDE3] object-contain object-center sm:h-52 md:h-72" />
                      )}
                      <span className="flex min-h-[170px] flex-col justify-center p-5 sm:p-7">
                        <span className="font-serif text-[23px] font-bold leading-[1.45] sm:text-3xl">{article.title}</span>
                        <span className="mt-3 line-clamp-2 text-sm font-medium leading-7 text-stone-600">{article.deck}</span>
                        <span className="mt-5 inline-flex items-center gap-3 text-xs font-black tracking-[0.18em] text-[#B87816]">
                          READ
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </span>
                      {article.image && index % 2 === 1 && (
                        <img src={article.image} alt={article.imageAlt ?? ''} className="h-44 w-full bg-[#F3EDE3] object-contain object-center sm:h-52 md:h-72" />
                      )}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={readerRef} id="newsletter-reader" className="scroll-mt-24">
          <article className="overflow-hidden border border-[#D7C8AA] bg-[#FFFCF7] shadow-[0_12px_34px_rgba(20,33,61,0.08)]">
            <div ref={articleTopRef} className="scroll-mt-24 border-b border-[#D7C8AA] p-5 sm:p-8" style={{ borderTop: `6px solid ${activeArticle.accent}` }}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl font-bold sm:text-5xl" style={{ color: activeArticle.accent }}>{activeArticle.page}</span>
                  <div>
                    <p className="text-[11px] font-black tracking-[0.18em]" style={{ color: activeArticle.accent }}>{activeArticle.label}</p>
                    <p className="mt-1 max-w-xl text-sm font-bold leading-5 text-stone-500">{activeArticle.author}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-stone-400">
                      <Clock className="h-3.5 w-3.5" />
                      {activeArticle.readTime}
                    </p>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-2 border border-[#D7C8AA] bg-white px-3 py-2 sm:w-auto">
                  <span className="mr-1 text-xs font-bold text-stone-500">
                    文字サイズ
                    <span className="ml-1 text-[#B87816]">{Math.round(fontScale * 100)}%</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setFontScale((value) => changeFontScale(value, -1))}
                    disabled={fontScale <= 0.875}
                    className="flex h-11 w-11 items-center justify-center border border-[#D7C8AA] bg-[#FFFCF6] text-stone-600 hover:text-[#14213D] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="本文を小さくする"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontScale((value) => changeFontScale(value, 1))}
                    disabled={fontScale >= 1.25}
                    className="flex h-11 w-11 items-center justify-center border border-[#D7C8AA] bg-[#FFFCF6] text-stone-600 hover:text-[#14213D] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="本文を大きくする"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h4 className="mt-7 max-w-3xl font-serif text-[28px] font-bold leading-tight sm:text-4xl xl:text-5xl">{activeArticle.title}</h4>
              <p className="mt-5 max-w-3xl text-[15px] font-medium leading-8 text-stone-600 sm:text-base">{activeArticle.deck}</p>
            </div>

            <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[260px_1fr]">
              <aside className="self-start border-l-4 bg-[#F8F1E6] p-5" style={{ borderColor: activeArticle.accent }}>
                <Quote className="h-5 w-5" style={{ color: activeArticle.accent }} />
                <p className="mt-3 font-serif text-xl font-bold leading-8">{activeArticle.pullQuote}</p>
              </aside>

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
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#D7C8AA] bg-white px-5 text-sm font-bold text-stone-600 hover:text-[#14213D]"
              >
                <ChevronLeft className="h-4 w-4" />
                前の記事
              </button>
              <p className="text-center text-xs font-black tracking-[0.16em] text-stone-500">{activeIndex + 1} / {issue.articles.length}</p>
              <button
                type="button"
                onClick={() => moveArticle(1)}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#D7C8AA] bg-white px-5 text-sm font-bold text-stone-600 hover:text-[#14213D]"
              >
                次の記事
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>

        <div className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-24px)] max-w-xl -translate-x-1/2 items-center gap-3 rounded-full bg-[#062B59] px-4 py-3 text-white shadow-[0_12px_30px_rgba(6,43,89,0.28)] sm:bottom-6 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex min-h-11 shrink-0 items-center gap-2 px-1 text-xs font-bold sm:text-sm"
          >
            <BookOpen className="h-5 w-5 text-[#E4A52E]" />
            全{issue.articles.length}記事
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-center text-[10px] font-bold tracking-[0.08em] text-white/80">記事 {activeIndex + 1} / {issue.articles.length}</p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/25" aria-label="記事位置">
              <div className="h-full rounded-full bg-[#E4A52E] transition-all duration-300" style={{ width: `${readingProgress}%` }} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex min-h-11 shrink-0 items-center gap-2 px-1 text-xs font-bold sm:text-sm"
          >
            <Menu className="h-5 w-5 text-[#E4A52E]" />
            目次
          </button>
        </div>
      </div>
    </section>
  );
}
