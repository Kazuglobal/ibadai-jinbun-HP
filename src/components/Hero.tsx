import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F5] pt-1 pb-16 lg:pt-6 lg:pb-24" id="home-hero-section">
      
      {/* =========================================================================
          DESKTOP HERO LAYOUT (hidden lg:grid) - High Fidelity Desktop Representation
          ========================================================================= */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 relative z-10">
        {/* Background Decorative Gold Waves and Curves */}
        <div className="absolute inset-0 pointer-events-none select-none -z-10">
          <div className="absolute top-[10%] right-[35%] w-[400px] h-[400px] rounded-full border border-stone-200/40 opacity-50" />
          <div className="absolute top-[16%] right-[32%] w-[400px] h-[400px] rounded-full border border-stone-200/40 opacity-50" />
          
          <svg className="absolute bottom-[5%] right-[2%] w-[500px] h-[200px] text-amber-600/20" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 180 C 150 120, 350 190, 490 80" stroke="currentColor" strokeWidth="1.5" />
            <path d="M30 195 C 180 130, 320 210, 480 100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          <svg className="absolute top-[40%] right-[10%] w-[300px] h-[300px] text-amber-600/10" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="grid grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="col-span-12 lg:col-span-5 flex flex-col items-start text-left">
            
            {/* Tagline / Sub Header */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-6 flex items-center gap-2"
            >
              <span className="w-1.5 h-6 bg-amber-600 rounded-full" />
              <p className="text-sm font-semibold text-[#00204A] tracking-wider font-sans">
                学びの記憶と人のつながりを、未来へひらく同窓会サイト
              </p>
            </motion.div>

            {/* main Headings in Beautiful Noto Serif */}
            <h1 className="text-5xl lg:text-[54px] font-serif font-bold text-[#00204A] leading-[1.3] tracking-normal mb-8 select-none">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-2"
              >
                知のつながりを、
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                未来へひらく。
              </motion.div>
            </h1>

            {/* Description Text */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-stone-600 space-y-2 text-base leading-relaxed tracking-wider font-sans mb-10 max-w-lg border-l border-stone-200 pl-4"
            >
              <p>茨城大学文理学部・人文学部の卒業生、</p>
              <p>在学生、大学関係者をつなぐ同窓会プラットフォーム。</p>
              <p>ニュース、イベント、会報、住所変更、卒業生ストーリー、</p>
              <p>後援支援情報を一つの場所に整理しました。</p>
            </motion.div>

            {/* Dynamic Interactive Button Stack */}
            <div className="flex flex-col gap-4 relative w-[240px]" id="hero-button-stack-desktop">
              <motion.a
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                href="#news"
                className="flex items-center justify-between gap-6 bg-[#00204A] text-white hover:bg-[#0B2545] font-sans font-bold text-xs px-5 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-350 border border-transparent"
              >
                <span className="tracking-widest">最新ニュースを見る</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                href="#address"
                className="flex items-center justify-between gap-6 bg-transparent hover:bg-stone-50 text-[#00204A] font-sans font-bold text-xs px-5 py-4 rounded-xl border border-[#00204A] transition-all duration-350"
              >
                <span className="tracking-widest">住所変更をする</span>
                <ArrowRight className="w-4 h-4 text-[#00204A]" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                href="#archive"
                className="flex items-center justify-between gap-6 bg-transparent hover:bg-stone-50 text-[#00204A] font-sans font-bold text-xs px-5 py-4 rounded-xl border border-[#00204A] transition-all duration-350"
              >
                <span className="tracking-widest">会報アーカイブを見る</span>
                <ArrowRight className="w-4 h-4 text-[#00204A]" />
              </motion.a>

              {/* Handdrawn Style Indicator Arrow underneath */}
              <div className="absolute -bottom-10 left-[20%] select-none pointer-events-none">
                <svg className="w-20 h-10 animate-pulse" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 35 C 25 35, 50 15, 65 5M65 5 L 52 8 M 65 5 L 63 18" stroke="#00204A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

          </div>

          {/* Right Image Collage Column */}
          <div className="col-span-7 relative flex justify-center items-center h-[620px] w-full" id="hero-image-collage-desktop">
            
            {/* Big crescent warm-beige background segment */}
            <div className="absolute right-0 top-0 w-11/12 h-full bg-[#f0ebd9]/40 rounded-l-[180px] z-0 overflow-hidden" />

            {/* Vertical text layout on direct right edge: ALUMNI NETWORK */}
            <div className="absolute right-[-1rem] top-1/2 -translate-y-1/2 flex flex-col items-center gap-10 select-none z-10">
              <span className="writing-mode-vertical text-stone-400 font-serif font-semibold tracking-[0.3em] uppercase text-sm whitespace-nowrap rotate-90 my-8">
                ALUMNI
              </span>
              <div className="h-20 w-px bg-stone-300" />
              <span className="writing-mode-vertical text-stone-400 font-serif font-semibold tracking-[0.3em] uppercase text-sm whitespace-nowrap rotate-90 my-8">
                NETWORK
              </span>
            </div>

            {/* Collage Element 1: Arch cropped brick clock tower building */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute top-[4%] right-[10%] w-[42%] h-[72%] rounded-t-full rounded-b-[40px] overflow-hidden shadow-lg border border-stone-100/30 z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop"
                alt="Ibaraki University Campus Style Building"
                className="w-full h-full object-cover filter brightness-95"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Collage Element 2: Ellipse landscape discussion photo */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="absolute left-[8%] bottom-[16%] w-[48%] h-[28%] rounded-full overflow-hidden shadow-md z-30"
            >
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop"
                alt="Students discuss in the hall"
                className="w-full h-full object-cover filter brightness-95"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Collage Element 3: Smaller oval chats photo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute right-[24%] bottom-[4%] w-[24%] h-[24%] rounded-full overflow-hidden shadow-md z-30 border-2 border-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop"
                alt="Alumni chatting outdoors"
                className="w-full h-full object-cover filter brightness-95"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Collage Element 4: Pile of hardcover classical books on right */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute bottom-[16%] right-0 w-[24%] h-[24%] rounded-xl overflow-hidden shadow-sm z-20 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=600&auto=format&fit=crop"
                alt="Classic library books"
                className="w-full h-full object-cover filter brightness-90 saturate-50 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Gold rectangle decorative accent panel with linear lines */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.8 }}
              className="absolute bottom-[36%] right-[4%] w-[12%] h-[12%] bg-[#CD9535] shadow-sm rounded-lg flex items-center justify-center z-30 select-none"
            >
              <svg className="w-8 h-8 text-stone-100" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="2" y1="2" x2="38" y2="38" stroke="currentColor" strokeWidth="1" />
                <line x1="38" y1="2" x2="2" y2="38" stroke="currentColor" strokeWidth="1" />
                <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              </svg>
            </motion.div>

            {/* Collage Element 5: Centered Brand Navy Badge Circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
              className="absolute top-[20%] left-[30%] w-[32%] aspect-square rounded-full bg-[#00204A] border-4 border-double border-amber-600/30 flex flex-col items-center justify-center text-center p-3 text-white shadow-2xl z-20"
            >
              <svg className="w-6 h-8 text-amber-500 mb-1.5" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 18C4 10.268 10.268 4 18 4C25.732 4 32 10.268 32 18V40H26V18C26 13.5817 22.4183 10 18 10C13.5817 10 10 13.5817 10 18V40H4V18Z" fill="currentColor" />
                <path d="M15 20C15 18.3431 16.3431 17 18 17C19.6569 17 21 18.3431 21 20V40H15V20Z" fill="currentColor" opacity="0.8" />
              </svg>
              <span className="text-[11px] leading-tight font-serif tracking-widest text-[#CD9535] font-semibold">
                LIBERAL ARTS &
              </span>
              <span className="text-[11px] leading-tight font-serif tracking-widest text-[#CD9535] font-semibold mt-0.5">
                HUMANITIES
              </span>
            </motion.div>

            {/* Subtle floating gold & blue dotted graphics overlay */}
            <div className="absolute top-[15%] left-[24%] z-10 pointer-events-none">
              <div className="grid grid-cols-4 gap-2 opacity-40">
                {[...Array(12)].map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#00204A]" />
                ))}
              </div>
            </div>

            {/* Secondary tiny blue square panel */}
            <div className="absolute top-[10%] left-[50%] w-6 h-10 bg-[#00204A] rounded-sm transform -rotate-12 opacity-80" />

          </div>

        </div>
      </div>

      {/* =========================================================================
          MOBILE / TABLET HERO LAYOUT (block lg:hidden) - EXACT REPLICA OF THE UPLOADED SCREEN
          ========================================================================= */}
      <div className="block lg:hidden w-full relative z-10 px-0">
        
        {/* Mobile Top College Photo Collage & Badges Section */}
        <div className="relative h-[290px] w-full overflow-visible mb-6" id="mobile-top-collage">
          
          {/* Big crescent beige background curve (stretches from top center to far right) */}
          <div className="absolute right-0 top-0 w-[85%] h-[285px] bg-[#f2ebe1]/70 rounded-bl-[140px] rounded-tl-none -z-10" />

          {/* Clock Tower Main Image: Right aligned, arch-top, diagonal-bottom corner */}
          <div className="absolute top-[10px] right-0 w-[58%] h-[275px] rounded-t-full rounded-b-[30px] overflow-hidden shadow-sm z-10">
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop"
              alt="Clock tower"
              className="w-full h-full object-cover filter brightness-95"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Navy Blue Brand Badge Circle: Overlapping the left of clock tower image */}
          <div className="absolute top-[64px] left-[11%] w-[120px] h-[120px] rounded-full bg-[#00204A] border-4 border-double border-amber-600/30 flex flex-col items-center justify-center p-2 text-white shadow-lg z-25">
            <svg className="w-5 h-6 text-amber-500 mb-1" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 18C4 10.268 10.268 4 18 4C25.732 4 32 10.268 32 18V40H26V18C26 13.5817 22.4183 10 18 10C13.5817 10 10 13.5817 10 18V40H4V18Z" fill="currentColor" />
              <path d="M15 20C15 18.3431 16.3431 17 18 17C19.6569 17 21 18.3431 21 20V40H15V20Z" fill="currentColor" opacity="0.8" />
            </svg>
            <span className="text-[7.5px] leading-tight font-serif tracking-widest text-[#CD9535] font-semibold">
              LIBERAL ARTS &
            </span>
            <span className="text-[7.5px] leading-tight font-serif tracking-widest text-[#CD9535] font-semibold mt-0.5">
              HUMANITIES
            </span>
          </div>

          {/* Floating Navy Square Accent Panel above Circle Badge */}
          <div className="absolute top-[18px] left-[17%] w-[22px] h-[28px] bg-[#00204A] rounded-sm z-20" />

          {/* Dotted Grid Pattern (Gold) below and left of Square Logo */}
          <div className="absolute top-[22px] left-[4%] grid grid-cols-4 gap-1.5 opacity-65 z-10">
            {[...Array(28)].map((_, i) => (
              <span key={i} className="w-[4px] h-[4px] rounded-full bg-[#CD9535]" />
            ))}
          </div>

          {/* Dotted Grid Pattern (Blue) below Circle Badge */}
          <div className="absolute top-[125px] left-[6%] grid grid-cols-4 gap-1.5 opacity-65 z-5">
            {[...Array(28)].map((_, i) => (
              <span key={i} className="w-[4px] h-[4px] rounded-full bg-[#00204A]" />
            ))}
          </div>

          {/* Floating Spiraling Gold Line Art around topmost curve */}
          <div className="absolute right-[2%] top-[12px] w-14 h-28 z-20 text-amber-600/70 select-none opacity-80">
            <svg viewBox="0 0 80 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15,95 C30,75 75,90 60,70 C50,55 20,68 35,45 C48,25 75,35 60,15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

        </div>

        {/* Mobile Middle Text Contents */}
        <div className="px-5 text-left mb-8 flex flex-col items-start pt-2">
          
          {/* Tagline sentence */}
          <p className="text-[#00204A] text-[14px] sm:text-[15px] font-sans font-bold leading-relaxed tracking-[0.03em] mb-4">
            学びの記憶と人のつながりを、<br />未来へひらく同窓会サイト
          </p>

          {/* Dynamic Large Japanese Headings */}
          <h1 className="text-[38px] sm:text-[42px] font-serif font-bold text-[#00204A] leading-[1.3] mb-6 tracking-normal">
            <span className="block mb-1.5">知のつながりを、</span>
            <span className="block">未来へひらく。</span>
          </h1>

          {/* Body multi-line paragraph */}
          <div className="text-stone-600 space-y-1.5 text-[13px] sm:text-[14px] leading-relaxed tracking-wider font-sans mb-8">
            <p>茨城大学文理学部・人文学部の卒業生、</p>
            <p>在学生、大学関係者をつなぐ同窓会プラットフォーム。</p>
            <p>ニュース、イベント、会報、住所変更、卒業生ストーリー、</p>
            <p>後援支援情報を一つの場所に整理しました。</p>
          </div>

        </div>

        {/* Exact Replica of 3 Vertical Buttons Stacking */}
        <div className="px-5 flex flex-col gap-3.5 mb-11 w-full" id="mobile-buttons-stack">
          
          {/* Blue Filled Main Action */}
          <a
            href="#news"
            className="w-full bg-[#00204A] text-white hover:bg-[#0B2545] font-sans font-bold text-sm py-[15px] px-[22px] rounded-xl flex items-center justify-between transition-colors shadow-none"
          >
            <span className="tracking-widest">最新ニュースを見る</span>
            <svg className="w-5 h-5 text-white stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Secondary White Filled Border Buttons */}
          <a
            href="#address"
            className="w-full bg-[#FAF9F5] hover:bg-stone-50/80 text-[#00204A] font-sans font-bold text-sm py-[15px] px-[22px] rounded-xl border border-[#00204A] flex items-center justify-between transition-colors"
          >
            <span className="tracking-widest">住所変更をする</span>
            <svg className="w-5 h-5 text-[#00204A] stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href="#archive"
            className="w-full bg-[#FAF9F5] hover:bg-stone-50/80 text-[#00204A] font-sans font-bold text-sm py-[15px] px-[22px] rounded-xl border border-[#00204A] flex items-center justify-between transition-colors"
          >
            <span className="tracking-widest">会報アーカイブを見る</span>
            <svg className="w-5 h-5 text-[#00204A] stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

        </div>

        {/* Mobile Bottom Collage of Small Pictures with Gold Accents */}
        <div className="relative h-[250px] w-full mt-4 overflow-visible px-4" id="mobile-bottom-collage">
          
          {/* Large 図書室 photo (cropped domed cap layout) */}
          <div className="absolute left-[4%] top-[14px] w-[64%] h-[200px] rounded-t-full rounded-b-[20px] overflow-hidden shadow-md z-15 border border-stone-100">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop"
              alt="Library work discussion"
              className="w-full h-full object-cover filter brightness-95"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Group of students chatting outside (round circle layout) */}
          <div className="absolute right-[6%] bottom-[12px] w-[32%] aspect-square rounded-full overflow-hidden shadow-md border border-white z-25">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop"
              alt="Chats"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Stacked hardcover classical library books (round shape) */}
          <div className="absolute left-[48%] bottom-[4px] w-[26%] aspect-square rounded-full overflow-hidden shadow-md border border-white z-30">
            <img 
              src="https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=600&auto=format&fit=crop"
              alt="Classic books"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Golden accent rectangle with star cross */}
          <div className="absolute right-[11%] top-[56px] w-[42px] h-[42px] bg-[#CD9535] flex items-center justify-center z-20 shadow-none select-none">
            <svg className="w-full h-full text-white/90 p-1.5" viewBox="0 0 40 40" fill="none">
              <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" strokeWidth="1" />
              <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" />
              <line x1="8" y1="8" x2="32" y2="32" stroke="currentColor" strokeWidth="1" />
              <line x1="32" y1="8" x2="8" y2="32" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Golden loops (spirals) on right, above gold rectangle */}
          <div className="absolute right-[15%] top-[12px] w-[50px] h-[40px] text-amber-600/70 z-20 opacity-85 select-none">
            <svg viewBox="0 0 80 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15,95 C30,75 75,90 60,70 C50,55 20,68 35,45 C48,25 75,35 60,15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Dotted Grid Pattern (Blue) in Right Background area */}
          <div className="absolute right-[1%] top-[110px] grid grid-cols-4 gap-1.5 opacity-65 -z-10 bg-transparent">
            {[...Array(28)].map((_, i) => (
              <span key={i} className="w-[4px] h-[4px] rounded-full bg-[#00204A]" />
            ))}
          </div>

          {/* Double Gold Curved lines sweeping up the lowest right margin */}
          <div className="absolute right-[4%] bottom-[10px] w-24 h-12 text-[#CD9535]/50 select-none z-10">
            <svg viewBox="0 0 100 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 35 C 40 30, 70 34, 90 15" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>

          {/* Dark Blue Handdrawn Style Arrow pointing right on the left under Library card */}
          <div className="absolute left-[6%] bottom-[14px] w-8 h-8 select-none text-[#00204A] opacity-95 z-20">
            <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 18 C 8 18, 14 12, 18 6 M18 6 L 10 8 M 18 6 L 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

        </div>

      </div>

    </section>
  );
}
