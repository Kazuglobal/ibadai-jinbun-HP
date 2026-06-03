import React from 'react';
import { motion } from 'motion/react';

// Classy News Data structure mirroring the exact screenshot items
const NEWS_ITEMS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop', // Meeting & conference hotel hall
    category: '重要なお知らせ',
    categoryColor: 'bg-red-700', // Crimson Red
    title: '第１８回総会・講演会・懇親会 開催のご案内',
    date: '2026.06.02',
    description: '令和８年７月１８日（土）にホテル日航つくばにて第１８回同窓会総会を開催いたします。総会・講演会、および懇親会（会費５千円）を行います。どなたでもお気軽にご出席ください（申込締切 7月7日）。',
    link: '#event-registration-form'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop', // Close up writing pen
    category: '学生支援・奨学金',
    categoryColor: 'bg-[#009A9C]', // Teal
    title: '在学生支援・奨学金情報を更新しました',
    date: '2025.05.12',
    description: '給付型奨学金の募集要項・申請スケジュールを公開しました。申請を検討している方はご確認ください。',
    link: '#news-2'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop', // Alumni assembly roundtable
    category: 'イベント・お知らせ',
    categoryColor: 'bg-[#CD9535]', // Gold
    title: '卒業生交流会レポートを公開しました',
    date: '2025.05.10',
    description: '4月に開催した卒業生交流会の様子をレポートでお届けします。多くの卒業生にご参加いただきました。',
    link: '#news-3'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=800&auto=format&fit=crop', // Brick traditional building
    category: '学部・大学ニュース',
    categoryColor: 'bg-[#C85A75]', // Dusty Rose
    title: '茨城大学人文社会科学部関連ニュース',
    date: '2025.05.08',
    description: '学部の取り組みや研究成果など、最新ニュースをお届けします。',
    link: '#news-4'
  }
];

interface NewsProps {
  onSelectNews?: (title: string) => void;
}

export default function News({ onSelectNews }: NewsProps) {
  return (
    <section className="relative bg-[#FAF9F5] py-16 lg:py-24 border-t border-stone-200/40" id="news">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            NEWS SECTION HEADER
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-7 text-left">
            {/* Title with Left Gold Border */}
            <div className="border-l-[3px] border-[#CD9535] pl-4 flex items-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#00204A] tracking-wider leading-none">
                NEWS
              </h2>
            </div>
            
            {/* Subtext and description */}
            <div className="flex flex-col items-start md:pt-1">
              <span className="text-[#00204A] font-sans font-bold text-[14px] tracking-wider mb-1">
                最新のお知らせ
              </span>
              <p className="text-stone-500 text-[12.5px] sm:text-[13px] tracking-wider leading-relaxed">
                同窓会・大学に関する重要なお知らせや、学生の活躍などをお届けします。
              </p>
            </div>
          </div>

          {/* Right link standard web anchor style */}
          <div className="flex justify-start md:justify-end md:pb-1">
            <a 
              href="#all-news" 
              className="group flex items-center gap-1.5 text-[#00204A] font-sans font-bold text-[13px] sm:text-sm border-b border-[#00204A] pb-0.5 transition-all hover:opacity-80"
              id="news-see-all-top"
            >
              <span className="tracking-widest">一覧を見る</span>
              <svg className="w-4 h-4 text-[#00204A] stroke-[1.5] transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

        </div>

        {/* Visual category tag indicators - みてすぐわかるお知らせの分類 */}
        <div className="flex flex-wrap gap-2 mb-8" id="news-quick-categories">
          <span className="bg-red-50 text-red-800 text-[10.5px] font-bold px-3 py-1 rounded-full border border-red-200/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            重要なお知らせ
          </span>
          <span className="bg-[#EAF6F6] text-[#009A9C] text-[10.5px] font-bold px-3 py-1 rounded-full border border-[#009A9C]/35 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009A9C]" />
            学生支援・奨学金
          </span>
          <span className="bg-amber-50 text-[#CD9535] text-[10.5px] font-bold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CD9535]" />
            イベント・お知らせ
          </span>
          <span className="bg-[#FCF5F6] text-[#C85A75] text-[10.5px] font-bold px-3 py-1 rounded-full border border-pink-200/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A75]" />
            学部・大学ニュース
          </span>
        </div>

        {/* =========================================================================
            NEWS GRID CARDS (Horizontal Scroll on Mobile, Grid on Tablet/Desktop)
            ========================================================================= */}
        <div className="flex md:grid overflow-x-auto md:overflow-x-visible md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-6 md:pb-0 scrollbar-none scroll-smooth -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          
          {NEWS_ITEMS.map((item) => (
            <motion.a
              key={item.id}
              href={item.link}
              onClick={(e) => {
                if (onSelectNews) {
                  e.preventDefault();
                  onSelectNews(item.title);
                }
              }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-stone-200/30 text-left transition-all duration-200 flex-shrink-0 w-[285px] xs:w-[315px] md:w-auto snap-start"
            >
              {/* Card Thumbnail Container */}
              <div className="relative w-full aspect-[16/10.2] overflow-hidden bg-stone-100">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Slid-on category solid badge (exact alignment & color styling) */}
                <div className={`absolute bottom-0 left-0 ${item.categoryColor} text-white text-[11px] font-sans font-bold py-2 px-4.5 tracking-wider`}>
                  {item.category}
                </div>
              </div>

              {/* Card Meta and Text Content */}
              <div className="flex-1 flex flex-col justify-between p-6 xs:p-7 pt-5">
                
                {/* Title & Description Stack */}
                <div>
                  <h3 className="text-[16px] sm:text-lg font-serif font-bold text-[#00204A] leading-[1.45] tracking-wide mb-3 min-h-[48px] line-clamp-2 group-hover:text-[#CD9535]/90 transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="text-stone-400 font-sans text-xs tracking-wider mb-4">
                    {item.date}
                  </div>

                  <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed tracking-wider line-clamp-3 mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Arrow Vector (bottom aligned with content grid margins) */}
                <div className="flex justify-end pt-3">
                  <div className="text-[#00204A] opacity-90 transition-transform duration-300 group-hover:translate-x-1.5">
                    <svg className="w-5 h-5 stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

              </div>

            </motion.a>
          ))}

        </div>

        {/* =========================================================================
            BOTTOM CALL TO ACTION BUTTON (Sleek Rounded Wide Pill)
            ========================================================================= */}
        <div className="mt-16 text-center">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#all-news"
            className="inline-flex items-center justify-center gap-3 bg-white hover:bg-stone-50 border border-[#00204A] text-[#00204A] font-sans font-bold text-[13.5px] py-4 px-12 rounded-full transition-all shadow-sm group hover:shadow-md"
            id="news-see-all-bottom-pill"
          >
            <span className="tracking-widest">ニュース一覧を見る</span>
            <svg className="w-5 h-5 text-[#00204A] stroke-[1.2] transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </div>

      </div>
    </section>
  );
}
