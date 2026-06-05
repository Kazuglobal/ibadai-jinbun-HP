import React from 'react';
import { motion } from 'motion/react';

// Classy Events data structure representing the exact layout, metadata, and styles from the screenshot
const EVENTS_DATA = [
  {
    id: '01',
    title: '第１８回総会・懇親会',
    subTitle: '2026 ホテル日航つくば',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
    dateYear: '2026',
    dateDay: '7.18',
    dateWeek: 'SAT',
    statusText: '重要・受付中',
    statusClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    details: [
      { label: '場所', value: 'ホテル日航つくば（つくば市吾妻1-1364-1）' },
      { label: '内容', value: '総会、講演会、懇親会（会費：５千円）' },
      { label: '申込', value: '下記参加フォーム・電子メール（7/7〆）' }
    ],
    link: '#event-registration-form'
  },
  {
    id: '02',
    title: '若手卒業生\nキャリアトーク',
    subTitle: '',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
    dateYear: '2026',
    dateDay: '7.18',
    dateWeek: 'SAT',
    statusText: 'オンライン・受付中',
    statusClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    details: [
      { label: '場所', value: 'オンライン（Zoom）' },
      { label: '内容', value: '卒業生の経験談の共有' },
      { label: '申込', value: '事前申込制（7/10まで）' }
    ],
    link: '#event-2'
  },
  {
    id: '03',
    title: '卒業生交流会・\n地域ネットワークイベント',
    subTitle: '',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
    dateYear: '2026',
    dateDay: '9.12',
    dateWeek: 'SAT',
    statusText: '対面・準備中',
    statusClass: 'bg-amber-50 text-amber-800 border-amber-200',
    details: [
      { label: '場所', value: '東京・大阪・名古屋ほか' },
      { label: '内容', value: 'どなたでも参加可能' },
      { label: '申込', value: '事前申込制（9/5まで）' }
    ],
    link: '#event-3'
  }
];

interface EventsProps {
  onSelectEvent?: (title: string) => void;
}

export default function Events({ onSelectEvent }: EventsProps) {
  return (
    <section className="relative overflow-hidden bg-[#00132C] py-16 lg:py-24" id="events-section" data-gsap-section>
      
      {/* Golden Dot Grid decoration (Top-Right as in screenshot) */}
      <div className="absolute right-[4%] top-[10%] hidden md:grid grid-cols-6 gap-2 opacity-85 z-0">
        {[...Array(24)].map((_, i) => (
          <span key={i} className="w-[3.5px] h-[3.5px] rounded-full bg-[#CD9535]" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            HEADER GRID: Title (Left Vertical Gold Line), Small Info, and Pill Button
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 sm:mb-16" data-gsap-title>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7 text-left">
            {/* Elegant Section Title with Left Gold Border */}
            <div className="border-l-[3.5px] border-[#CD9535] pl-4 flex items-center h-12 md:h-14">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#CD9535] tracking-widest leading-none">
                EVENTS
              </h2>
            </div>
            
            {/* Title description - classy creamy text with gold accent details */}
            <div className="flex flex-col justify-center text-stone-200" data-gsap-copy>
              <span className="font-sans font-bold text-[14px] sm:text-[14.5px] tracking-wider leading-relaxed">
                参加して、つながって、
              </span>
              <span className="font-sans font-bold text-[14px] sm:text-[14.5px] tracking-wider leading-relaxed">
                学びを深めるイベント
              </span>
            </div>
          </div>

          {/* High-fidelity responsive gold outline list button */}
          <div className="flex justify-start md:justify-end">
            <motion.a 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(205,149,53,0.08)' }}
              whileTap={{ scale: 0.98 }}
              href="#all-events"
              className="inline-flex items-center gap-3 border border-[#CD9535] text-[#CD9535] font-sans font-bold text-[12px] sm:text-xs py-3.5 px-6 rounded-full tracking-widest"
              id="events-list-btn"
            >
              <span>イベント一覧を見る</span>
              <svg className="w-4 h-4 text-[#CD9535] stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </div>

        </div>

        {/* =========================================================================
            THREE COLUMN EVENTS CARDS GRID - Horizontal Scroll on Mobile, Grid on Tablet/Desktop
            ========================================================================= */}
        <div className="flex md:grid overflow-x-auto md:overflow-x-visible md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-6 md:pb-0 scrollbar-none scroll-smooth -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          
          {EVENTS_DATA.map((item) => (
            <motion.div
              key={item.id}
              data-gsap-card
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-[#FAF9F5] rounded-2xl overflow-hidden shadow-md border border-amber-900/10 text-left p-5 sm:p-6 flex flex-col justify-between flex-shrink-0 w-[290px] xs:w-[320px] md:w-auto snap-start group"
            >
              <div>
                
                {/* 1. Header Row inside the card: Big number and Title with sub-year */}
                <div className="flex items-start justify-between gap-2.5 mb-4 px-0.5">
                  <div className="flex flex-col items-start gap-2">
                    <div className="text-[38px] sm:text-[44px] font-serif font-bold text-[#CD9535] leading-none select-none">
                      {item.id}
                    </div>
                    {item.statusText && (
                      <span className={`text-[9.5px] font-sans font-bold px-2 py-0.5 rounded border leading-none tracking-wider select-none ${item.statusClass}`}>
                        {item.statusText}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 text-right mt-1 pl-2">
                    <h3 className="text-[14.5px] sm:text-[16px] font-serif font-bold text-[#00204A] leading-[1.35] tracking-wide whitespace-pre-line">
                      {item.title}
                    </h3>
                    {item.subTitle && (
                      <div className="text-stone-400 font-sans text-[10.5px] tracking-wider mt-0.5">
                        {item.subTitle}
                      </div>
                    )}
                  </div>
                </div>
 
                {/* 2. Middle Row inside the card: Beautiful Wide Banner Image with Overlaid Calendar Binder */}
                <div className="relative h-[130px] sm:h-[155px] w-full rounded-xl overflow-hidden shadow-xs border border-black/5 mb-4 select-none" data-gsap-media>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover filter brightness-[0.95] group-hover:scale-[1.05] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Calendar Binder element elegantly overlaid over the image */}
                  <div className="absolute bottom-2.5 left-2.5 w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] bg-white border border-[#CD9535]/80 rounded-[6px] flex flex-col justify-between items-center py-1 shadow-md z-10">
                    
                    {/* Metal binder rings */}
                    <span className="absolute top-[-4px] left-[23%] w-[3px] h-[8px] bg-amber-50 border border-[#CD9535] rounded-full z-20" />
                    <span className="absolute top-[-4px] right-[23%] w-[3px] h-[8px] bg-amber-50 border border-[#CD9535] rounded-full z-20" />
                    
                    <div className="text-[8px] sm:text-[9.5px] text-[#CD9535] font-sans tracking-wider font-bold">
                      {item.dateYear}
                    </div>
                    <div className="text-[14px] sm:text-[16.5px] font-serif font-black text-[#00204A] leading-none my-0.5 tracking-tighter">
                      {item.dateDay}
                    </div>
                    <div className="text-[8px] sm:text-[9.5px] text-stone-500 font-sans tracking-wider font-extrabold">
                      {item.dateWeek}
                    </div>
                  </div>
                </div>
 
                {/* 3. Detail rows styled precisely with vertical separator columns */}
                <div className="space-y-2.5 mb-5 border-t border-stone-200/50 pt-4 text-[11px] sm:text-[12px] tracking-wide">
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-1 items-start">
                      <div className="col-span-3 text-stone-400 font-sans font-bold leading-normal">
                        {detail.label}
                      </div>
                      <div className="col-span-9 text-slate-800 font-sans font-medium select-text break-all">
                        {detail.value}
                      </div>
                    </div>
                  ))}
                </div>
 
              </div>
 
              {/* 4. Bottom Link Indicator with arrow */}
              <div className="border-t border-stone-200/50 pt-3">
                <a 
                  href={item.link}
                  onClick={(e) => {
                    if (onSelectEvent) {
                      e.preventDefault();
                      onSelectEvent(item.title.replace(/\n/g, ''));
                    }
                  }}
                  className="group inline-flex items-center gap-1.5 text-[#CD9535] font-sans font-bold text-[11px] sm:text-[11.5px] tracking-widest hover:opacity-85"
                >
                  <span>詳細・申込はこちら</span>
                  <svg className="w-3.5 h-3.5 text-[#CD9535] stroke-[1.2] transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
 
            </motion.div>
          ))}
 
        </div>

      </div>

      {/* =========================================================================
          BOTTOM CAPTION / NOTIFICATION FOOTER WITH CLEAN CONTRAST
          ========================================================================= */}
      <div className="w-full bg-white text-center py-4.5 mt-16 sm:mt-24 border-t border-stone-205/30">
        <p className="text-stone-500 font-sans font-medium text-[10px] xs:text-[11px] sm:text-xs tracking-widest px-4 select-none">
          ※イベントの内容・日程は変更になる場合があります。
        </p>
      </div>

    </section>
  );
}
