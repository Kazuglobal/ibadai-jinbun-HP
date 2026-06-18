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
  }
];

interface NewsProps {
  onSelectNews?: (title: string) => void;
}

export default function News({ onSelectNews }: NewsProps) {
  return (
    <section className="relative border-t border-stone-200/40 bg-[#F4F4F4] py-10 md:bg-[#FAF9F5] md:py-16 lg:py-24" id="news">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-start justify-between md:hidden" data-gsap-section-title>
          <div>
            <p className="text-[13px] font-black tracking-[0.04em] text-[#00204A]">NEWS</p>
            <h2 className="mt-3 text-[25px] font-black leading-none tracking-[0.04em] text-[#17233A]">
              ニュース
            </h2>
          </div>
        </div>
        
        {/* =========================================================================
            NEWS SECTION HEADER
            ========================================================================= */}
        <div className="mb-8 hidden flex-col justify-between gap-6 md:flex md:flex-row md:items-end" data-gsap-section-title>
          
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
                第１８回総会・講演会・懇親会の開催案内をお知らせします。
              </p>
            </div>
          </div>

        </div>

        {/* =========================================================================
            NEWS GRID CARDS (Horizontal Scroll on Mobile, Grid on Tablet/Desktop)
            ========================================================================= */}
        <div className="mx-auto grid max-w-3xl gap-9 md:grid-cols-1 md:gap-6 md:pb-0">
          
          {NEWS_ITEMS.map((item) => (
            <motion.a
              key={item.id}
              data-gsap-card
              href={item.link}
              onClick={(e) => {
                if (onSelectNews) {
                  e.preventDefault();
                  onSelectNews(item.title);
                }
              }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group grid grid-cols-[36%_1fr] items-start gap-4 text-left md:flex md:w-auto md:flex-col md:gap-0 md:overflow-hidden md:rounded-2xl md:border md:border-stone-200/30 md:bg-white md:shadow-sm md:transition-all md:duration-200 md:hover:shadow-md"
            >
              {/* Card Thumbnail Container */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-stone-100 md:aspect-[16/10.2]">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Slid-on category solid badge (exact alignment & color styling) */}
                <div className={`absolute bottom-0 left-0 hidden ${item.categoryColor} px-4.5 py-2 font-sans text-[11px] font-bold tracking-wider text-white md:block`}>
                  {item.category}
                </div>
              </div>

              {/* Card Meta and Text Content */}
              <div className="flex min-w-0 flex-1 flex-col justify-between md:p-6 md:pt-5">
                
                {/* Title & Description Stack */}
                <div>
                  <div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 md:mb-4">
                    <time className="font-sans text-[10px] font-bold tracking-[0.08em] text-stone-400 md:text-xs md:font-normal md:tracking-wider">
                      {item.date}
                    </time>
                    <span className="border border-[#0074CC] px-2 py-0.5 text-[9px] font-medium tracking-[0.06em] text-[#0074CC] md:hidden">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="line-clamp-3 font-sans text-[13px] font-bold leading-[1.55] tracking-[0.025em] text-[#17233A] transition-colors group-hover:text-[#0074CC] sm:text-[14px] md:mb-3 md:min-h-[48px] md:line-clamp-2 md:font-serif md:text-lg md:leading-[1.45] md:tracking-wide md:text-[#00204A] md:group-hover:text-[#CD9535]/90">
                    {item.title}
                  </h3>

                  <p className="mb-6 hidden text-xs leading-relaxed tracking-wider text-stone-600 md:line-clamp-3 md:block md:text-[13px]">
                    {item.description}
                  </p>
                </div>

                {/* Arrow Vector (bottom aligned with content grid margins) */}
                <div className="hidden justify-end pt-3 md:flex">
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

      </div>
    </section>
  );
}
