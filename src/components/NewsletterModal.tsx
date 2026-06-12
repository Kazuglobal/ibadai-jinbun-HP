import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileDown,
  Menu,
  X,
} from 'lucide-react';

import activityImage from '../data/newsletter43/activity.jpg';
import hasuiImage from '../data/newsletter43/hasui.jpg';
import homeworkImage from '../data/newsletter43/homework.jpg';
import jumpRopeImage from '../data/newsletter43/jump-rope.jpg';

interface NewsletterModalProps {
  autoOpenReady?: boolean;
  onClose?: () => void;
}

type Article = {
  id: number;
  page: string;
  category: string;
  title: string;
  subtitle: string;
  writer: string;
  image: string;
  imageAlt: string;
  body: string[];
};

const articles: Article[] = [
  {
    id: 1,
    page: '02',
    category: '巻頭エッセイ',
    title: '茨城大学 半世紀の想い出',
    subtitle: '巻頭記事を本文で読む',
    writer: '木戸 之都子（人文・文10回卒）',
    image: activityImage,
    imageAlt: '茨城大学の活動風景',
    body: [
      '一人の卒業生の記憶から、人文学部と同窓会が重ねてきた時間が見えてくる巻頭記事です。',
      '入学当時のキャンパス、人文図書室、古文書整理、名簿づくりまで、大学で過ごした時間が落ち着いた語り口でつづられています。',
    ],
  },
  {
    id: 2,
    page: '06',
    category: '学部長メッセージ',
    title: '同窓会の皆様へ',
    subtitle: '母校の現在を本文で読む',
    writer: '人文社会科学部長　蓮井 誠一郎',
    image: hasuiImage,
    imageAlt: '蓮井誠一郎 人文社会科学部長',
    body: [
      '人文社会科学部の現在と、教育・研究環境づくりへの思いが語られるメッセージです。',
      'オンライン化が進む時代に、対面のつながりやカレッジの価値をどう再構築するかを考えます。',
    ],
  },
  {
    id: 3,
    page: '10',
    category: '学生レポート',
    title: 'ひたちなか市における子どもの居場所づくり',
    subtitle: '地域の現場で学ぶ声を読む',
    writer: '人文社会科学部4年　中塩 紗矢香',
    image: homeworkImage,
    imageAlt: '子どもが宿題をする活動風景',
    body: [
      '地域の居場所での実践から、子ども一人ひとりに寄り添う支援を考える学生レポートです。',
      '大学での学びが地域の課題と結びつく瞬間を、在学生のまなざしから読むことができます。',
    ],
  },
  {
    id: 4,
    page: '14',
    category: '活動報告',
    title: '総会・同窓会活動の記録',
    subtitle: '支部、グループ、近況を読む',
    writer: '茨城大学 文理・人文学部同窓会',
    image: jumpRopeImage,
    imageAlt: '同窓会報に掲載された活動風景',
    body: [
      '総会、支部・グループ、事務局からのお知らせを通じて、同窓会の現在地を確認できます。',
      '冊子としての流れを残しながら、Web上でも次の記事へ移動しやすい構成にしています。',
    ],
  },
];

const pdfPages = ['表紙', '巻頭エッセイ', '学生レポート', '活動報告'];

function TextLines({ rows = 5, compact = false }: { rows?: number; compact?: boolean }) {
  return (
    <div className={compact ? 'space-y-2.5' : 'space-y-3.5'} aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <span
          key={index}
          className={`block h-px bg-[#D3CBBF] ${index % 5 === 4 ? 'w-[72%]' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export default function NewsletterModal({ autoOpenReady = true, onClose }: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(1);
  const [pdfPage, setPdfPage] = useState(1);

  const selectedArticle = articles.find((article) => article.id === selectedArticleId) ?? articles[0];

  useEffect(() => {
    if (!autoOpenReady) return;

    if (!(window as any).__hasShownNewsletterThisSession) {
      const timer = window.setTimeout(() => {
        setIsOpen(true);
        (window as any).__hasShownNewsletterThisSession = true;
      }, 700);
      return () => window.clearTimeout(timer);
    }
  }, [autoOpenReady]);

  useEffect(() => {
    const handleOpenNewsletter = () => {
      setIsOpen(true);
      setSelectedArticleId(1);
    };

    window.addEventListener('open-newsletter', handleOpenNewsletter);
    return () => window.removeEventListener('open-newsletter', handleOpenNewsletter);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const goToNextArticle = () => {
    setSelectedArticleId((current) => (current === articles.length ? 1 : current + 1));
  };

  const goToPreviousArticle = () => {
    setSelectedArticleId((current) => (current === 1 ? articles.length : current - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6" id="editorial-newsletter-modal">
          <motion.button
            type="button"
            aria-label="会報ポップアップを閉じる"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#0F1115]/55 backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-modal-title"
            initial={{ opacity: 0, scale: 0.985, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.985, y: 16 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[394px] overflow-hidden rounded-[22px] border border-[#D6CDBD] bg-[#FCFAF7] text-[#00204A] shadow-[18px_20px_0_rgba(0,0,0,0.32),0_30px_90px_rgba(0,0,0,0.35)] lg:h-[770px] lg:max-w-[1390px] lg:rounded-[18px]"
          >
            <div className="absolute inset-x-0 top-0 z-20 h-1.5 bg-[#CD9535]" aria-hidden="true" />

            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-stone-100 bg-white text-stone-600 shadow-sm transition-colors hover:border-[#00204A] hover:text-[#00204A] lg:right-6 lg:top-7 lg:h-12 lg:w-12"
              aria-label="閉じる"
            >
              <X className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            {/* Desktop: faithful recreation of the generated desktop image. */}
            <div className="hidden h-full lg:flex">
              <aside className="flex w-[360px] flex-shrink-0 flex-col justify-between bg-[#00204A] px-8 pb-7 pt-16 text-white">
                <div>
                  <p className="text-[15px] font-bold tracking-[0.16em] text-[#CD9535]">最新会報</p>
                  <h2 className="mt-8 font-serif text-[44px] font-bold leading-tight tracking-[0.04em] text-white">
                    同窓会報
                    <span className="mt-3 block text-[56px] text-[#CD9535]">第43号</span>
                  </h2>
                  <div className="mt-7 h-px w-24 bg-[#CD9535]" aria-hidden="true" />
                  <p className="mt-5 max-w-[260px] font-serif text-[17px] font-bold leading-8 tracking-[0.08em] text-[#FAF9F5]">
                    学びの記憶と人のつながりを、本文で読む。
                  </p>
                </div>

                <div>
                  <div className="h-[286px] overflow-hidden bg-stone-200">
                    <img src={jumpRopeImage} alt="同窓会報に掲載された活動風景" className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedArticleId(1)}
                    className="mt-8 flex h-14 w-[245px] items-center justify-center gap-2 rounded-full bg-[#CD9535] px-6 text-sm font-bold tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[#00204A]"
                  >
                    本文を読む
                  </button>
                  <p className="mt-10 border-t border-white/25 pt-4 text-[11px] font-bold tracking-[0.16em] text-white/75">
                    PDF / WEB READER
                  </p>
                </div>
              </aside>

              <div className="flex min-w-0 flex-1 flex-col">
                <header className="px-12 pb-6 pt-14">
                  <h3 id="newsletter-modal-title" className="max-w-[820px] font-serif text-[38px] font-bold leading-tight tracking-[0.05em] text-[#00204A]">
                    会報第43号を、HPの中でそのまま読み進める
                  </h3>
                  <div className="mt-5 h-px w-20 bg-[#CD9535]" aria-hidden="true" />
                  <p className="mt-5 max-w-[830px] text-[15px] font-medium leading-8 tracking-wide text-stone-600">
                    短い要約ではなく、写真・目次・記事本文へ自然に進むポップアップ。既存HPの余白、濃紺、金の罫線、丸いCTAに合わせた読み物導線です。
                  </p>
                </header>

                <div className="grid flex-1 grid-cols-[245px_1fr] gap-8 px-12">
                  <nav className="h-[370px] rounded-[18px] border border-[#D8D2C5] bg-white p-7 shadow-sm">
                    <h4 className="font-serif text-2xl font-bold text-[#00204A]">目次</h4>
                    <div className="mt-7 space-y-5">
                      {articles.map((article) => (
                        <button
                          key={article.id}
                          type="button"
                          onClick={() => setSelectedArticleId(article.id)}
                          className="group flex w-full items-center justify-between text-left"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="h-2 w-2 flex-shrink-0 bg-[#CD9535]" />
                            <span className={`truncate text-sm font-bold tracking-wide transition-colors ${selectedArticleId === article.id ? 'text-[#00204A]' : 'text-stone-700 group-hover:text-[#00204A]'}`}>
                              {article.category}
                            </span>
                          </span>
                          <span className="font-mono text-xs text-stone-400">{article.page}</span>
                        </button>
                      ))}
                    </div>
                  </nav>

                  <article className="h-[370px] rounded-[18px] border border-[#D8D2C5] bg-white p-7 shadow-sm">
                    <div className="grid grid-cols-[240px_1fr] gap-8">
                      <div className="h-[180px] overflow-hidden bg-stone-200">
                        <img src={selectedArticle.image} alt={selectedArticle.imageAlt} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-serif text-[29px] font-bold leading-tight text-[#00204A]">
                          {selectedArticle.title}
                        </h4>
                        <p className="mt-4 text-[14px] font-bold text-[#CD9535]">{selectedArticle.subtitle}</p>
                        <div className="mt-7 max-w-[330px]">
                          <TextLines rows={6} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-7">
                      <TextLines rows={4} />
                    </div>

                    <div className="mt-7 flex justify-center">
                      <a
                        href="http://dousoukai.hum.ibaraki.ac.jp/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-[52px] min-w-[245px] items-center justify-center gap-2 rounded-full bg-[#00204A] px-8 text-sm font-bold tracking-[0.12em] text-white shadow-sm transition-colors hover:bg-[#CD9535]"
                      >
                        <BookOpen className="h-4 w-4" />
                        記事を全文で読む
                      </a>
                    </div>
                  </article>
                </div>

                <footer className="mt-auto flex h-[70px] items-center justify-between border-t border-[#D8D2C5] px-8">
                  <button
                    type="button"
                    onClick={goToPreviousArticle}
                    className="flex h-10 min-w-[170px] items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-stone-600 shadow-sm transition-colors hover:text-[#00204A]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    前のページ
                  </button>
                  <p className="text-xs font-bold tracking-wide text-stone-500">HPデザインに合わせた会報ポップアップ / Desktop</p>
                  <button
                    type="button"
                    onClick={goToNextArticle}
                    className="flex h-10 min-w-[180px] items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-stone-600 shadow-sm transition-colors hover:text-[#00204A]"
                  >
                    次のページ
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </footer>
              </div>
            </div>

            {/* Mobile: faithful recreation of the generated mobile image. */}
            <div className="max-h-[92vh] overflow-y-auto px-5 pb-7 pt-7 lg:hidden">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-[#CD9535]">
                <Menu className="h-4 w-4" />
                最新会報 第43号
              </div>

              <h3 className="mt-5 font-serif text-[31px] font-bold leading-tight tracking-[0.04em] text-[#00204A]">
                会報を本文で読む
              </h3>
              <p className="mt-4 max-w-[330px] text-[13px] font-medium leading-7 tracking-wide text-stone-600">
                要約だけで終わらせず、写真、目次、本文へ進むスマホ用ポップアップ。
              </p>

              <div className="mt-6 h-40 overflow-hidden bg-stone-200">
                <img src={selectedArticle.image} alt={selectedArticle.imageAlt} className="h-full w-full object-cover" />
              </div>

              <a
                href="http://dousoukai.hum.ibaraki.ac.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex h-[58px] w-full items-center justify-center gap-2 rounded-full bg-[#00204A] px-6 text-sm font-bold tracking-[0.12em] text-white shadow-sm transition-colors hover:bg-[#CD9535]"
              >
                この記事を全文で読む
                <ArrowRight className="h-4 w-4" />
              </a>

              <h4 className="mt-10 font-serif text-[24px] font-bold text-[#00204A]">目次</h4>
              <div className="mt-5 space-y-3">
                {articles.map((article) => (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => setSelectedArticleId(article.id)}
                    className={`flex h-[43px] w-full items-center justify-between rounded-xl border px-5 text-left transition-colors ${
                      selectedArticleId === article.id ? 'border-[#CD9535]/60 bg-[#FAF4E8]' : 'border-[#D8D2C5] bg-white'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="h-2 w-2 flex-shrink-0 bg-[#CD9535]" />
                      <span className="truncate text-sm font-bold tracking-wide text-stone-700">{article.category}</span>
                    </span>
                    <span className="text-xs font-bold text-[#CD9535]">読む</span>
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <TextLines rows={5} compact />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#D8D2C5] pt-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-[#CD9535]">PDF / WEB READER</p>
                  <p className="text-xs font-bold text-[#00204A]">
                    {pdfPages[pdfPage - 1]} <span className="font-mono text-stone-400">0{pdfPage}/04</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pdfPage === 1}
                    onClick={() => setPdfPage((page) => Math.max(1, page - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 disabled:opacity-40"
                    aria-label="PDF前ページ"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={pdfPage === pdfPages.length}
                    onClick={() => setPdfPage((page) => Math.min(pdfPages.length, page + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 disabled:opacity-40"
                    aria-label="PDF次ページ"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <a
                    href="http://dousoukai.hum.ibaraki.ac.jp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-[#00204A]"
                    aria-label="会報サイトを見る"
                  >
                    <FileDown className="h-4 w-4" />
                    <ExternalLink className="sr-only" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
