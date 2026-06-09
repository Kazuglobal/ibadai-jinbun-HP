import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Users, 
  BookOpen, 
  FileText, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';

const COVERS_DATA = [
  {
    id: '43',
    numberText: '第43号',
    seasonText: '2026年 最新号',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=600&auto=format&fit=crop',
    title: '同窓会報 第43号',
    date: '2026年 最新号',
    webMagazineReady: true
  },
  {
    id: '42',
    numberText: '第42号',
    seasonText: '2026年 春号',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=600&auto=format&fit=crop',
    title: '同窓会報 第42号',
    date: '2026年 春号',
    webMagazineReady: false
  },
  {
    id: '40',
    numberText: '第40号',
    seasonText: '2024年 春号',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop',
    title: '同窓会報 第40号',
    date: '2024年 春号',
    webMagazineReady: false
  },
  {
    id: '39',
    numberText: '第39号',
    seasonText: '2023年 秋号',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?q=80&w=600&auto=format&fit=crop',
    title: '同窓会報 第39号',
    date: '2023年 秋号',
    webMagazineReady: false
  },
  {
    id: '38',
    numberText: '第38号',
    seasonText: '2023年 春号',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600&auto=format&fit=crop',
    title: '同窓会報 第38号',
    date: '2023年 春号',
    webMagazineReady: false
  }
];

export default function NetworkArchive() {
  const [activeCoverIndex, setActiveCoverIndex] = React.useState(0);
  const [isCoverAutoPaused, setIsCoverAutoPaused] = React.useState(false);
  const activeCover = COVERS_DATA[activeCoverIndex];

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches || isCoverAutoPaused) return;

    const timer = window.setInterval(() => {
      setActiveCoverIndex((current) => (current + 1) % COVERS_DATA.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [isCoverAutoPaused]);

  const moveCover = (direction: number) => {
    setActiveCoverIndex((current) => (current + direction + COVERS_DATA.length) % COVERS_DATA.length);
  };

  const getCoverOffset = (index: number) => {
    const rawOffset = index - activeCoverIndex;
    const half = Math.floor(COVERS_DATA.length / 2);

    if (rawOffset > half) return rawOffset - COVERS_DATA.length;
    if (rawOffset < -half) return rawOffset + COVERS_DATA.length;
    return rawOffset;
  };

  const openNewsletter = (cover = activeCover) => {
    if (!cover.webMagazineReady) return;

    window.dispatchEvent(new CustomEvent('open-newsletter-43'));
  };

  return (
    <section className="relative bg-[#FAF9F5] py-16 lg:py-24 border-t border-stone-200/40" id="network-archive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            TOP SECTION: SPLIT NETWORK (LEFT) & ARCHIVE (RIGHT) FOR DESKTOP, STACKED FOR MOBILE
            ========================================================================= */}
        <div className="grid grid-cols-1 gap-8 items-stretch mb-10">

          {/* -------------------------------------------------------------------------
              2. ARCHIVE BANNER (PALE CREAM / SOFT STONE CARD WITH BOOK COVERS SPLIT)
              ------------------------------------------------------------------------- */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#F5F3EC] rounded-3xl p-8 sm:p-12 shadow-sm border border-amber-900/5 flex flex-col justify-between h-full min-h-[460px] lg:min-h-[500px]"
            id="archive-top-card"
          >
            <div>
              {/* Header section with subtitle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4 mb-6 text-left">
                <div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#00204A] tracking-wider leading-none mb-4 uppercase">
                    ARCHIVE
                  </h2>
                  <p className="text-stone-500 font-sans font-bold text-xs sm:text-[13px] tracking-widest leading-relaxed">
                    会報アーカイブ / 過去の活動記録
                  </p>
                </div>

                {/* Classy minimal Pill button (desktop top-right aligned) */}
                <div className="hidden sm:block">
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="#archive-main"
                    className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-[#00204A] border border-stone-200 shadow-sm py-2.5 px-5 rounded-full font-sans font-bold text-xs tracking-wider transition-colors"
                  >
                    <span>会報アーカイブを見る</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.a>
                </div>
              </div>

              {/* =========================================================================
                  SWIPEABLE JOURNAL COVER HERO
                  ========================================================================= */}
              <div className="my-6">
                <div
                  className="relative overflow-hidden rounded-3xl border border-stone-200/60 bg-white/55 px-3 py-5 shadow-inner sm:px-6 sm:py-7"
                  onPointerEnter={() => setIsCoverAutoPaused(true)}
                  onPointerLeave={() => setIsCoverAutoPaused(false)}
                  onFocusCapture={() => setIsCoverAutoPaused(true)}
                  onBlurCapture={() => setIsCoverAutoPaused(false)}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-left">
                      <p className="text-[10px] font-black tracking-[0.22em] text-[#CD9535]">
                        SWIPE COVER
                      </p>
                      <p className="mt-1 text-xs font-bold leading-5 text-stone-500">
                        自動で切り替わります。左右スワイプも可能
                      </p>
                    </div>

                    <div className="hidden items-center gap-2 sm:flex">
                      <button
                        type="button"
                        onClick={() => moveCover(-1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-[#00204A] shadow-sm transition hover:border-[#CD9535] hover:text-[#CD9535]"
                        aria-label="前の会報へ"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCover(1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-[#00204A] shadow-sm transition hover:border-[#CD9535] hover:text-[#CD9535]"
                        aria-label="次の会報へ"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <motion.div
                    className="relative h-[330px] cursor-grab overflow-hidden rounded-2xl [touch-action:pan-y] sm:h-[395px]"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.08}
                    onDragStart={() => setIsCoverAutoPaused(true)}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -45 || info.velocity.x < -300) moveCover(1);
                      if (info.offset.x > 45 || info.velocity.x > 300) moveCover(-1);
                      setIsCoverAutoPaused(false);
                    }}
                    whileTap={{ cursor: 'grabbing' }}
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-14 bg-linear-to-r from-white/80 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-14 bg-linear-to-l from-white/80 to-transparent" />

                    {COVERS_DATA.map((item, index) => {
                      const offset = getCoverOffset(index);
                      const isActive = offset === 0;
                      const isVisible = Math.abs(offset) <= 2;

                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            if (isActive) {
                              openNewsletter(item);
                              return;
                            }

                            setActiveCoverIndex(index);
                          }}
                          className="absolute left-1/2 top-2 flex w-[178px] origin-center -translate-x-1/2 flex-col text-left outline-none sm:w-[220px]"
                          animate={{
                            x: offset * 148,
                            y: isActive ? 0 : 18,
                            rotate: offset * -5,
                            scale: isActive ? 1 : 0.7,
                            opacity: isVisible ? (isActive ? 1 : 0.48) : 0,
                            zIndex: 10 - Math.abs(offset),
                          }}
                          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                          aria-label={isActive ? `${item.title}を開く` : `${item.title}を選択`}
                        >
                          <span className="relative block aspect-[1/1.38] w-full overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-150 shadow-[0_16px_40px_rgba(0,32,74,0.18)]">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover brightness-[0.72] contrast-[1.08] saturate-[0.9]"
                              referrerPolicy="no-referrer"
                            />

                            <span className="absolute inset-0 bg-linear-to-t from-[#00132C]/55 via-transparent to-white/10" />

                            <span className="absolute inset-3 flex flex-col justify-between rounded-xl border border-white/25 p-2 text-white">
                              <span className="border-b border-white/25 pb-1 text-center font-serif text-[10px] tracking-widest">
                                同窓会報
                              </span>
                              <span className="text-center font-serif text-2xl font-black tracking-wide sm:text-3xl">
                                {item.numberText}
                              </span>
                              <span className="text-center text-[8px] font-bold tracking-widest text-stone-100/90">
                                {item.seasonText}
                              </span>
                            </span>
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="text-left">
                      <h4 className="font-sans text-sm font-black tracking-wide text-[#00204A]">
                        {activeCover.title}
                      </h4>
                      <p className="mt-1 text-xs font-bold tracking-wider text-[#CD9535]">
                        {activeCover.date}
                      </p>
                      {!activeCover.webMagazineReady && (
                        <p className="mt-2 text-[11px] font-bold tracking-wider text-stone-500">
                          WEBマガジン準備中
                        </p>
                      )}
                      <span className="mt-2 block h-[1.5px] w-8 bg-[#CD9535]" />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5">
                        {COVERS_DATA.map((item, index) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveCoverIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                              activeCoverIndex === index ? 'w-7 bg-[#00204A]' : 'w-2 bg-stone-300 hover:bg-[#CD9535]'
                            }`}
                            aria-label={`${item.title}へ移動`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => openNewsletter()}
                        disabled={!activeCover.webMagazineReady}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-black tracking-widest shadow-sm transition ${
                          activeCover.webMagazineReady
                            ? 'bg-[#00204A] text-white hover:bg-[#CD9535]'
                            : 'cursor-not-allowed bg-stone-200 text-stone-500'
                        }`}
                      >
                        {activeCover.webMagazineReady ? '読む' : '準備中'}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 sm:hidden">
                    <button
                      type="button"
                      onClick={() => moveCover(-1)}
                      className="flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white py-3 text-xs font-black text-[#00204A]"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      前へ
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCover(1)}
                      className="flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white py-3 text-xs font-black text-[#00204A]"
                    >
                      次へ
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Only: Wide full-width navy button for horizontal activities record */}
              <div className="sm:hidden mt-6 w-full">
                <motion.a 
                  whileTap={{ scale: 0.98 }}
                  href="#activities-record"
                  className="flex items-center justify-between bg-[#00132C] text-white py-4 px-5 rounded-xl shadow-sm text-left group"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#CD9535]" />
                    <span className="font-sans font-bold text-xs tracking-wider">
                      活動記録 2022年度 アーカイブ
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#CD9535] transition-transform duration-300 group-hover:translate-x-1" />
                </motion.a>
              </div>

            </div>

            {/* Micro action pill button fallback link for mobile view */}
            <div className="sm:hidden mt-8 flex justify-center">
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#archive-main"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-[#00204A] border border-stone-200 shadow-sm py-3 px-5 rounded-full font-sans font-bold text-xs tracking-wider transition-colors"
              >
                <span>会報アーカイブを見る</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            </div>

          </motion.div>

        </div>


      </div>
    </section>
  );
}
