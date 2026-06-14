import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, BookOpen, X } from 'lucide-react';

import newsletter43Cover from '../data/newsletter43/lunch.jpg';

interface NewsletterModalProps {
  autoOpenReady?: boolean;
  onClose?: () => void;
}

const highlights = [
  {
    page: 'P.02',
    category: '巻頭エッセイ',
    title: '茨城大学 半世紀の想い出',
    description: '学びの場と人のつながりを、卒業生の記憶からたどります。',
  },
  {
    page: 'P.06',
    category: '学部長メッセージ',
    title: '同窓会の皆様へ',
    description: '人文社会科学部の現在と、これからの学びについて。',
  },
  {
    page: 'P.10',
    category: '学生レポート',
    title: '子どもの居場所づくり',
    description: '地域の現場で学ぶ学生の声と活動を紹介します。',
  },
];

const covers = [
  {
    issue: '41',
    image: '/newsletters/41/image-01.webp',
    className:
      'left-0 top-14 z-0 w-[42%] -rotate-[8deg] opacity-75 sm:left-2 sm:top-20 sm:w-[40%]',
  },
  {
    issue: '42',
    image: '/newsletters/42/image-01.webp',
    className:
      'left-[17%] top-8 z-10 w-[48%] -rotate-[3deg] opacity-90 sm:left-[18%] sm:top-12 sm:w-[46%]',
  },
  {
    issue: '43',
    image: newsletter43Cover,
    className:
      'right-0 top-0 z-20 w-[58%] rotate-0 sm:right-2 sm:w-[56%]',
  },
];

export default function NewsletterModal({ autoOpenReady = true, onClose }: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!autoOpenReady) return;

    if (!(window as Window & { __hasShownNewsletterThisSession?: boolean }).__hasShownNewsletterThisSession) {
      const timer = window.setTimeout(() => {
        setIsOpen(true);
        (window as Window & { __hasShownNewsletterThisSession?: boolean }).__hasShownNewsletterThisSession = true;
      }, 700);
      return () => window.clearTimeout(timer);
    }
  }, [autoOpenReady]);

  useEffect(() => {
    const handleOpenNewsletter = () => setIsOpen(true);
    window.addEventListener('open-newsletter', handleOpenNewsletter);
    return () => window.removeEventListener('open-newsletter', handleOpenNewsletter);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const openWebMagazine = () => {
    handleClose();
    window.dispatchEvent(new CustomEvent('open-newsletter-issue', { detail: 43 }));
  };

  const openArchive = () => {
    handleClose();
    window.setTimeout(() => {
      const archive = document.querySelector('#network-archive');
      if (archive) {
        archive.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = 'network-archive';
      }
    }, 80);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="editorial-newsletter-modal"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-8"
        >
          <motion.button
            type="button"
            aria-label="会報ポップアップを閉じる"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#06182D]/70 backdrop-blur-[2px]"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-modal-title"
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[94vh] w-full max-w-[1180px] overflow-hidden rounded-[22px] border border-white/70 bg-[#FCFAF6] text-[#00204A] shadow-[0_32px_100px_rgba(0,18,43,0.42)] sm:rounded-[28px]"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#00204A]/15 bg-white/95 text-[#00204A] shadow-sm transition-colors hover:bg-[#00204A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CD9535] focus-visible:ring-offset-2 sm:right-6 sm:top-6"
              aria-label="閉じる"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid max-h-[calc(94vh-76px)] overflow-y-auto lg:min-h-[680px] lg:max-h-none lg:grid-cols-[47%_53%] lg:overflow-visible">
              <div className="relative overflow-hidden bg-[#F2EEE5] px-5 pb-6 pt-16 sm:px-10 sm:pb-10 sm:pt-20 lg:px-12 lg:pb-12 lg:pt-16">
                <div className="relative z-30">
                  <p className="text-xs font-bold tracking-[0.22em] text-[#B57A24] sm:text-sm">
                    最新号が届きました
                  </p>
                  <h2
                    id="newsletter-modal-title"
                    className="mt-2 font-serif text-[34px] font-bold leading-tight tracking-[0.04em] sm:text-[48px] lg:text-[52px]"
                  >
                    同窓会報 <span className="whitespace-nowrap">第43号</span>
                  </h2>
                  <div className="mt-5 h-px w-16 bg-[#CD9535]" aria-hidden="true" />
                </div>

                <div className="relative mx-auto mt-7 h-[285px] max-w-[430px] sm:mt-9 sm:h-[365px] lg:h-[395px]">
                  {covers.map((cover) => (
                    <div
                      key={cover.issue}
                      className={`absolute aspect-[3/4] overflow-hidden border border-white/80 bg-white shadow-[0_18px_38px_rgba(0,32,74,0.2)] ${cover.className}`}
                    >
                      <img
                        src={cover.image}
                        alt={`同窓会報 第${cover.issue}号`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-[#00204A]/92 px-3 py-2 text-white sm:px-4 sm:py-3">
                        <p className="text-[9px] font-bold tracking-[0.14em] text-[#E8C172] sm:text-[10px]">
                          IBARAKI ALUMNI
                        </p>
                        <p className="mt-0.5 font-serif text-sm font-bold sm:text-base">同窓会報 第{cover.issue}号</p>
                      </div>
                      {cover.issue === '43' && (
                        <span className="absolute left-0 top-0 bg-[#CD9535] px-3 py-2 text-[10px] font-black tracking-[0.16em] text-white sm:px-4 sm:text-xs">
                          NEW
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="relative z-30 mt-3 flex items-center justify-center gap-3 text-[11px] font-bold tracking-[0.12em] text-stone-500 sm:text-xs">
                  <BookOpen className="h-4 w-4 text-[#CD9535]" />
                  最新号から過去の会報までWEBで閲覧できます
                </div>
              </div>

              <div className="flex flex-col px-5 pb-7 pt-8 sm:px-10 sm:pb-10 sm:pt-12 lg:px-12 lg:pb-12 lg:pt-16">
                <div className="pr-12">
                  <p className="font-serif text-xl font-bold tracking-[0.08em] sm:text-2xl">今号の見どころ</p>
                  <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-stone-600 sm:text-[15px]">
                    学部の今、卒業生の記憶、地域で学ぶ学生の声を、読みやすいWEBマガジンでお届けします。
                  </p>
                </div>

                <div className="mt-7 divide-y divide-[#D8D0C2] border-y border-[#D8D0C2] sm:mt-9">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.page}
                      className="grid grid-cols-[58px_1fr] gap-3 py-4 sm:grid-cols-[72px_1fr] sm:gap-5 sm:py-5"
                    >
                      <p className="font-serif text-xl font-bold text-[#B57A24] sm:text-2xl">{highlight.page}</p>
                      <div>
                        <p className="text-[10px] font-black tracking-[0.13em] text-[#B57A24] sm:text-xs">
                          {highlight.category}
                        </p>
                        <h3 className="mt-1 font-serif text-base font-bold leading-6 sm:text-lg">
                          {highlight.title}
                        </h3>
                        <p className="mt-1 text-xs font-medium leading-5 text-stone-500 sm:text-[13px]">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-7 sm:pt-9">
                  <button
                    type="button"
                    onClick={openWebMagazine}
                    className="group hidden min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#002E63] px-5 text-sm font-bold tracking-[0.08em] text-white shadow-[0_12px_25px_rgba(0,46,99,0.2)] transition-colors hover:bg-[#CD9535] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CD9535] focus-visible:ring-offset-2 sm:min-h-16 sm:text-base lg:flex"
                  >
                    第43号 WEBマガジンを読む
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    type="button"
                    onClick={openArchive}
                    className="group mx-auto mt-4 flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-bold text-[#00204A] underline decoration-[#CD9535] decoration-2 underline-offset-8 transition-colors hover:text-[#B57A24]"
                  >
                    バックナンバーから選ぶ
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-[#D8D0C2] bg-[#FCFAF6] p-3 lg:hidden">
              <button
                type="button"
                onClick={openWebMagazine}
                className="group flex min-h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#002E63] px-4 text-sm font-bold tracking-[0.06em] text-white shadow-[0_10px_22px_rgba(0,46,99,0.2)] transition-colors hover:bg-[#CD9535] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CD9535] focus-visible:ring-offset-2"
              >
                第43号 WEBマガジンを読む
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}
