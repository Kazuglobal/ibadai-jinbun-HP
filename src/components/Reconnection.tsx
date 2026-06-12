import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Reconnection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24 border-t border-stone-200/50" id="reconnection-section">
      
      {/* Decorative Dotted Grid in BG (Left Top for Desktop) */}
      <div className="absolute top-[8%] left-[2%] pointer-events-none select-none z-0 opacity-40 hidden lg:block">
        <div className="grid grid-cols-5 gap-3">
          {[...Array(15)].map((_, i) => (
            <span key={i} className="w-[4px] h-[4px] rounded-full bg-[#CD9535]" />
          ))}
        </div>
      </div>

      {/* Decorative Dotted Grid in BG (Mobile Left Side under main Title) */}
      <div className="absolute top-[18%] left-[4%] pointer-events-none select-none z-0 opacity-45 block lg:hidden">
        <div className="grid grid-cols-4 gap-2.5">
          {[...Array(16)].map((_, i) => (
            <span key={i} className="w-[3.5px] h-[3.5px] rounded-full bg-[#CD9535]" />
          ))}
        </div>
      </div>

      {/* Gold loop spirals background SVG (Top left behind heading) */}
      <div className="absolute top-[2%] left-[-4%] w-[180px] h-[240px] text-amber-600/30 opacity-60 z-0 pointer-events-none select-none">
        <svg viewBox="0 0 100 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,130 C30,90 80,110 65,80 C50,60 15,75 35,45 C50,20 85,30 70,5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M20,135 C38,100 85,118 72,90 C58,72 25,85 43,55 C56,32 90,40 76,15" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            1. MAIN BODY GRID: TEXT CORES (LEFT) & COLLAGE + FLOATING CARDS (RIGHT)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* -------------------------------------------------------------------------
              LEFT STRIP: Main Texts & CTA buttons for Desktop
              ------------------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            {/* Elegant Vertical Decorative Line + Header Title */}
            <div className="mb-6 lg:mb-8">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#00204A] leading-[1.3] tracking-wider select-none">
                母校とのつながりを、
                <br />
                もう一度ここから。
              </h2>
            </div>

            {/* Clear Japanese multi-paragraph details precisely matched */}
            <div className="text-stone-600 font-sans text-xs sm:text-[14.5px] leading-relaxed tracking-wider mb-10 space-y-4 max-w-2xl border-l-[1.5px] border-stone-200 pl-4.5">
              <p>
                ニュースを見る、イベントに参加する、会報を読む、住所を更新する。
              </p>
              <p>
                茨城大学文理・人文学部で育まれたつながりを、卒業後にもっと身近に。
              </p>
            </div>

            {/* Desktop Action Buttons Stack (Aligned Side-by-Side as horizontally styled pills) */}
            <div className="hidden lg:flex flex-row items-center gap-4 w-full" id="desktop-reconnect-ctas">
              
              <motion.a 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#update-section"
                className="inline-flex items-center justify-between gap-6 bg-[#00204A] text-white hover:bg-[#031C3C] font-sans font-bold text-[12px] py-4 px-6.5 rounded-full shadow-md transition-all duration-350"
              >
                <span>住所変更手続きをする</span>
                <ArrowRight className="w-4 h-4 text-white stroke-[2.2]" />
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(0, 32, 74, 0.04)' }}
                whileTap={{ scale: 0.97 }}
                href="#news-section"
                className="inline-flex items-center justify-between gap-[18px] bg-transparent text-[#00204A] border border-[#00204A] font-sans font-bold text-[12px] py-4 px-6.5 rounded-full transition-all duration-300"
              >
                <span>最新ニュースを見る</span>
                <ArrowRight className="w-4 h-4 text-[#00204A]" />
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(0, 32, 74, 0.04)' }}
                whileTap={{ scale: 0.97 }}
                href="#footer"
                className="inline-flex items-center justify-between gap-5 bg-transparent text-[#00204A] border border-[#00204A] font-sans font-bold text-[12px] py-4 px-6 rounded-full transition-all duration-300"
              >
                <span>お問い合わせ</span>
                <ArrowRight className="w-4 h-4 text-[#00204A]" />
              </motion.a>

            </div>

          </div>

          {/* -------------------------------------------------------------------------
              RIGHT STRIP: High Fidelity Circular Collage & Floating Cards
              ------------------------------------------------------------------------- */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-6 w-full min-h-[420px] sm:min-h-[480px]">
            
            {/* Background Golden Crescent Arc overlay block (curves from left) */}
            <div className="absolute left-[3%] top-[3%] w-[90%] aspect-square max-w-[420px] bg-[#fdfaf2] border border-amber-900/5 rounded-full select-none -z-10" />
            
            <div className="absolute right-[4%] top-[12%] w-[45px] h-[45px] pointer-events-none select-none z-0 opacity-40">
              <svg viewBox="0 0 40 40" className="w-full h-full text-[#CD9535]" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* COLLAGE IMAGE A: Main Grand Circular Clock Tower Campus building */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-[68%] aspect-square rounded-full overflow-hidden shadow-lg border-4 border-white z-10 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop" 
                alt="Ibaraki University Campus Clock Tower" 
                className="w-full h-full object-cover filter brightness-95 saturate-[0.95] group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* COLLAGE IMAGE B: Laptop / Group debate in a woody modern lounge */}
            <motion.div 
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute right-[-1%] top-[3%] w-[33%] aspect-square rounded-full overflow-hidden shadow-md border-[3.5px] border-white z-20"
            >
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop" 
                alt="Alumni gathering discussion" 
                className="w-full h-full object-cover filter brightness-95"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* COLLAGE IMAGE C: Classical domed academic library hall/pillars */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute right-[11%] bottom-[-2%] w-[33%] aspect-square rounded-full overflow-hidden shadow-md border-[3.5px] border-white z-20"
            >
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop" 
                alt="Secondary Building facade" 
                className="w-full h-full object-cover filter brightness-[0.92] saturate-[0.88]"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Decorative Gold spiral curves sweeping on bottom right */}
            <div className="absolute right-[-2%] bottom-[12%] w-[100px] h-[100px] text-amber-600/40 select-none z-0 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <path d="M5 80 C 40 75, 80 85, 95 60 C 100 45, 95 30, 80 32" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>

            {/* Solid Navy small decorative accent circle dots */}
            <div className="absolute left-[8%] bottom-[12%] w-5 h-5 rounded-full bg-[#00204A]/90 shadow-sm z-30 animate-pulse" />
            <div className="absolute right-[44%] bottom-[-3%] w-3.5 h-3.5 rounded-full bg-[#00204A]/60 z-30" />
            <div className="absolute right-[2%] top-[38%] w-3.5 h-3.5 rounded-full bg-[#CD9535]/80 z-20" />

            {/* Dotted Grid Pattern Matrix on deep right */}
            <div className="absolute right-[-4%] bottom-[24%] grid grid-cols-4 gap-1.5 opacity-40 z-10 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <span key={i} className="w-[3.5px] h-[3.5px] rounded-full bg-[#00204A]" />
              ))}
            </div>

            {/* Dotted Gold Grid pattern behind Student photo overlay */}
            <div className="absolute right-[4%] top-[-2%] grid grid-cols-3 gap-2 opacity-50 z-0 pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <span key={i} className="w-[3px] h-[3px] rounded-full bg-[#CD9535]" />
              ))}
            </div>

          </div>

        </div>


        {/* =========================================================================
            3. MOBILE ACTION BUTTONS STACK (Displays ONLY on Mobile)
            ========================================================================= */}
        <div className="block lg:hidden mt-12 w-full max-w-md mx-auto space-y-4 relative z-20">
          
          <motion.a 
            whileTap={{ scale: 0.98 }}
            href="#update-section"
            className="w-full bg-[#00204A] text-white hover:bg-[#031C3C] text-sm font-sans font-bold py-4 px-6 rounded-xl flex items-center justify-between shadow-sm border border-transparent transition-all"
          >
            <span className="tracking-wider">住所変更手続きをする</span>
            <ArrowRight className="w-4 h-4 text-white stroke-[2]" />
          </motion.a>

          <motion.a 
            whileTap={{ scale: 0.98 }}
            href="#news-section"
            className="w-full bg-white hover:bg-stone-50 text-[#00204A] text-sm font-sans font-bold py-4 px-6 rounded-xl border border-[#00204A] flex items-center justify-between transition-all"
          >
            <span className="tracking-wider">最新ニュースを見る</span>
            <ArrowRight className="w-4 h-4 text-[#00204A] stroke-[2]" />
          </motion.a>

          <motion.a 
            whileTap={{ scale: 0.98 }}
            href="#footer"
            className="w-full bg-white hover:bg-stone-50 text-[#00204A] text-sm font-sans font-bold py-4 px-6 rounded-xl border border-[#00204A] flex items-center justify-between transition-all"
          >
            <span className="tracking-wider">お問い合わせ</span>
            <ArrowRight className="w-4 h-4 text-[#00204A] stroke-[2]" />
          </motion.a>

        </div>

      </div>

    </section>
  );
}
