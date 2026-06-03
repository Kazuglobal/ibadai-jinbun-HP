import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Users, 
  BookOpen, 
  FileText, 
  ArrowRight, 
  ChevronRight 
} from 'lucide-react';

const COVERS_DATA = [
  {
    id: '42',
    numberText: '第42号',
    seasonText: '2026年 最新号',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=600&auto=format&fit=crop',
    title: '同窓会報 第42号',
    date: '2026年 最新号'
  },
  {
    id: '40',
    numberText: '第40号',
    seasonText: '2024年 春号',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop',
    title: '同窓会報 第40号',
    date: '2024年 春号'
  },
  {
    id: '39',
    numberText: '第39号',
    seasonText: '2023年 秋号',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?q=80&w=600&auto=format&fit=crop',
    title: '同窓会報 第39号',
    date: '2023年 秋号'
  },
  {
    id: '38',
    numberText: '第38号',
    seasonText: '2023年 春号',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600&auto=format&fit=crop',
    title: '同窓会報 第38号',
    date: '2023年 春号'
  }
];

export default function NetworkArchive() {
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
                  THREE COLUMN JOURNAL COVER GRID + SOLID SLATE CARD ON DESKTOP
                  ========================================================================= */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4.5 my-6">
                
                {COVERS_DATA.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-newsletter'));
                    }}
                    className="flex flex-col text-left cursor-pointer group/card"
                  >
                    {/* Cover Photo booklet element with custom Japanese printed text overlays to match booklet */}
                    <div className="relative aspect-[1/1.4] w-full rounded-xl overflow-hidden shadow-sm border border-stone-200/40 bg-stone-150 relative">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.08] saturate-[0.88]"
                        referrerPolicy="no-referrer"
                      />
                      {/* Classy Traditional Text Banner Overlay */}
                      <div className="absolute inset-x-0 inset-y-0 p-2 sm:p-3 flex flex-col justify-between text-white select-none pointer-events-none">
                        
                        <div className="border border-white/20 p-1 rounded h-full flex flex-col justify-between">
                          {/* Banner small header */}
                          <div className="text-[8px] xs:text-[9.5px] sm:text-[10px] tracking-widest font-serif font-medium text-center border-b border-white/20 pb-1">
                            同窓会報
                          </div>

                          {/* Large Elegant Title Number in the center */}
                          <div className="text-center font-serif font-bold text-sm xs:text-base sm:text-lg my-auto tracking-wide">
                            {item.numberText}
                          </div>

                          {/* Mini footer details */}
                          <div className="text-[6.5px] sm:text-[8px] tracking-widest font-sans text-center text-stone-200/90 whitespace-nowrap overflow-hidden scale-90 origin-bottom">
                            {item.seasonText}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Captions below each booklet details */}
                    <div className="mt-2.5">
                      <h4 className="text-[#00204A] font-sans font-bold text-[10px] xs:text-[11.5px] leading-tight mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[#CD9535] font-sans font-medium text-[8px] xs:text-[10px] tracking-wider leading-none">
                        {item.date}
                      </p>
                      {/* Underline segment precisely matching screenshot */}
                      <span className="block w-6 h-[1.5px] bg-[#CD9535] mt-1.5" />
                    </div>

                  </motion.div>
                ))}

                {/* 4. SOLID BLUE BOOK CARD BLOCK (Displays on Desktop, collapses on Mobile to separate wide button) */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="hidden sm:flex flex-col bg-[#00132C] rounded-xl overflow-hidden shadow-sm border border-amber-900/10 p-3.5 sm:p-4.5 justify-between text-left cursor-pointer min-h-[140px]"
                >
                  <BookOpen className="w-5 h-5 text-[#CD9535]/80" />
                  
                  <div className="text-white font-serif font-bold text-xs xs:text-[13px] tracking-wider leading-[1.4] mt-3">
                    活動記録
                    <br />
                    2022年度
                    <br />
                    アーカイブ
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <span className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                </motion.div>

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
