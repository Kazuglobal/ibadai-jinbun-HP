import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Menu, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentView?: 'home' | 'about';
  onNavigate?: (view: 'home' | 'about', hash?: string) => void;
}

export default function Header({ currentView = 'home', onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Smooth scroll tracking for sticky height adjustment
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const aboutSubItems = [
    { name: '同窓会について（概要）', hash: '#about-section' },
    { name: '目的・活動内容', hash: '#purpose-activities' },
    { name: '会長挨拶', hash: '#presidents-greeting' },
    { name: '同窓会会則', hash: '#bylaws' },
    { name: '組織・役員一覧', hash: '#organization-board' },
    { name: '事業・会計報告', hash: '#annual-reports' },
    { name: '入会・退会について', hash: '#membership' },
    { name: '地域支部・職域支部', hash: '#branches' },
    { name: '個人情報保護・法令順守', hash: '#privacy' }
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemClick = (view: 'home' | 'about', hash?: string) => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    if (onNavigate) {
      onNavigate(view, hash);
    } else if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-stone-200/50 transition-all duration-300 ${
      scrolled ? 'py-2.5 shadow-md' : 'py-4 shadow-none'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* =========================================================================
            LEFT COLUMN: UNIVERSITY ALUMNI IDENTITY LOGO WITH AUTHENTIC GOTHIC GATE
            ========================================================================= */}
        <a 
          href="#" 
          onClick={handleLogoClick}
          className="flex items-center gap-2 group focus:outline-none" 
          id="header-branding-anchor"
        >
          {/* Logo labels */}
          <div className="flex flex-col text-left">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#CD9535] font-sans leading-none uppercase">
              茨城大学
            </span>
            <span className="text-sm sm:text-[16px] font-bold tracking-tight text-[#00204A] font-sans leading-tight mt-1">
              文理・人文学部同窓会
            </span>
            <span className="text-[8px] sm:text-[9.5px] font-medium text-stone-400 tracking-wider font-mono mt-0.5 leading-none hidden xs:block">
              IBARAKI UNIVERSITY ALUMNI ASSOCIATION
            </span>
          </div>
        </a>

        {/* =========================================================================
            MIDDLE/RIGHT COLUMN: NAVIGATION LINK DIRECTORIES (Desktop hidden on mobile)
            ========================================================================= */}
        <div className="hidden xl:flex items-center gap-4 min-w-0">
          <nav className="flex items-center gap-0.5 pr-1 whitespace-nowrap" id="desktop-routing-nav">
            
            {/* Home link */}
            <button
              onClick={() => handleItemClick('home')}
              className={`relative py-2 px-2 text-[11px] font-bold font-sans tracking-wider whitespace-nowrap transition-colors duration-200 group focus:outline-none cursor-pointer ${
                currentView === 'home' ? 'text-[#00204A]' : 'text-stone-600 hover:text-[#00204A]'
              }`}
            >
              <span>ホーム</span>
              <span className={`absolute bottom-[-2px] left-3 right-3 h-[2px] bg-[#CD9535] transition-all duration-300 ${
                currentView === 'home' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
              }`} />
            </button>

            {/* About Dropdown Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                onClick={() => handleItemClick('about')}
                className={`relative py-2 px-2 text-[11px] font-bold font-sans tracking-wider whitespace-nowrap transition-colors duration-200 flex items-center gap-1 group focus:outline-none cursor-pointer ${
                  currentView === 'about' ? 'text-[#00204A]' : 'text-stone-600 hover:text-[#00204A]'
                }`}
              >
                <span>同窓会について</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${aboutDropdownOpen ? 'transform rotate-180 text-[#CD9535]' : 'text-stone-400'}`} />
                <span className={`absolute bottom-[-2px] left-3 right-3 h-[2px] bg-[#CD9535] transition-all duration-300 ${
                  currentView === 'about' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`} />
              </button>

              {/* Faint elegant dropdown alignment */}
              <AnimatePresence>
                {aboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-1 w-72 bg-white border border-stone-200/80 rounded-xl shadow-xl overflow-hidden py-2 z-50 border-t-2 border-t-[#CD9535]"
                  >
                    {aboutSubItems.map((sub, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleItemClick('about', sub.hash)}
                        className="w-full text-left px-4 py-3 text-[12px] font-bold text-stone-600 hover:text-[#00204A] hover:bg-stone-50 transition-all flex items-center justify-between gap-3 whitespace-nowrap group cursor-pointer"
                      >
                        <span>{sub.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#CD9535] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* News link */}
            <button
              onClick={() => handleItemClick('home', '#news')}
              className="relative py-2 px-2 text-stone-600 hover:text-[#00204A] text-[11px] font-bold font-sans tracking-wider whitespace-nowrap transition-colors duration-200 group focus:outline-none cursor-pointer"
            >
              <span>お知らせ</span>
              <span className="absolute bottom-[-2px] left-3 right-3 h-[2px] bg-[#CD9535] opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300" />
            </button>

            {/* Events link */}
            <button
              onClick={() => handleItemClick('home', '#events-section')}
              className="relative py-2 px-2 text-stone-600 hover:text-[#00204A] text-[11px] font-bold font-sans tracking-wider whitespace-nowrap transition-colors duration-200 group focus:outline-none cursor-pointer"
            >
              <span>イベント・総会</span>
              <span className="absolute bottom-[-2px] left-3 right-3 h-[2px] bg-[#CD9535] opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300" />
            </button>

            {/* Stories link */}
            <button
              onClick={() => handleItemClick('home', '#stories-section')}
              className="relative py-2 px-2 text-stone-600 hover:text-[#00204A] text-[11px] font-bold font-sans tracking-wider whitespace-nowrap transition-colors duration-200 group focus:outline-none cursor-pointer"
            >
              <span>卒業生ストーリー</span>
              <span className="absolute bottom-[-2px] left-3 right-3 h-[2px] bg-[#CD9535] opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300" />
            </button>

            {/* Archive link */}
            <button
              onClick={() => handleItemClick('home', '#network-archive')}
              className="relative py-2 px-2 text-stone-600 hover:text-[#00204A] text-[11px] font-bold font-sans tracking-wider whitespace-nowrap transition-colors duration-200 group focus:outline-none cursor-pointer"
            >
              <span>会報アーカイブ</span>
              <span className="absolute bottom-[-2px] left-3 right-3 h-[2px] bg-[#CD9535] opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300" />
            </button>

            {/* Contact link */}
            <button
              onClick={() => handleItemClick('home', '#site-footer')}
              className="relative py-2 px-2 text-stone-600 hover:text-[#00204A] text-[11px] font-bold font-sans tracking-wider whitespace-nowrap transition-colors duration-200 group focus:outline-none cursor-pointer"
            >
              <span>お問い合わせ</span>
              <span className="absolute bottom-[-2px] left-3 right-3 h-[2px] bg-[#CD9535] opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300" />
            </button>

            {/* Newsletter Popup Link */}
            <button
              onClick={() => {
                setAboutDropdownOpen(false);
                window.dispatchEvent(new CustomEvent('open-newsletter'));
              }}
              className="relative py-2 px-2 text-[#CD9535] hover:text-[#00204A] text-[11px] font-bold font-sans tracking-wider whitespace-nowrap transition-colors duration-200 group focus:outline-none cursor-pointer flex items-center gap-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CD9535]"></span>
              </span>
              <span>最新会報 (No.42)</span>
            </button>

          </nav>

          {/* Golden division dash */}
          <div className="h-6 w-px bg-stone-200/80" />

          {/* Prominent Address update CTA Button */}
          <button
            onClick={() => handleItemClick('home', '#update-section')}
            className="inline-flex items-center justify-center gap-2 bg-[#00204A] hover:bg-[#CD9535] text-white hover:text-white text-[11px] font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-md tracking-wider whitespace-nowrap cursor-pointer border-none focus:outline-none"
          >
            <span>住所変更手続き</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* =========================================================================
            MOBILE TOGGLE BUTTON FRAME (Hidden on desktop)
            ========================================================================= */}
        <div className="flex xl:hidden items-center gap-3">
          {/* Quick CTA icon button for mobile address access before toggle */}
          <button
            onClick={() => handleItemClick('home', '#update-section')}
            className="inline-flex sm:hidden items-center justify-center w-9 h-9 rounded-full bg-[#00204A] text-white shadow-xs focus:outline-none cursor-pointer"
            aria-label="Address Form Quick Link"
          >
            <ArrowRight className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={() => handleItemClick('home', '#update-section')}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 bg-[#00204A] text-white text-[11px] font-bold py-2 px-4 rounded-full tracking-wider cursor-pointer border-none"
          >
            <span>住所変更</span>
            <ArrowRight className="w-3" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#00204A] hover:bg-stone-50 rounded-lg transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Tray"
          >
            {mobileMenuOpen ? (
              <X className="w-6.5 h-6.5" />
            ) : (
              <Menu className="w-6.5 h-6.5 stroke-[1.8]" />
            )}
          </button>
        </div>

      </div>

      {/* =========================================================================
          MOBILE EXPANSION TRAY DRAWER PANEL
          ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="xl:hidden bg-white border-t border-stone-200/50 overflow-hidden shadow-inner"
          >
            <div className="px-5 py-6 flex flex-col gap-5 max-w-lg mx-auto text-left">
              
              <span className="text-[10px] font-bold text-stone-400 tracking-[0.2em] uppercase border-b border-stone-100 pb-1.5 block">
                同窓会サイトメニュー
              </span>

              <nav className="flex flex-col gap-3">
                {/* Home option */}
                <button
                  onClick={() => handleItemClick('home')}
                  className="flex items-center justify-between py-2 text-left w-full group border-b border-stone-50"
                >
                  <span className={`text-sm font-bold transition-colors ${currentView === 'home' ? 'text-[#00204A]' : 'text-stone-700'}`}>
                    ホーム
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-300" />
                </button>

                {/* Collapsible About section for mobile */}
                <div className="border-b border-stone-50 py-1">
                  <button
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                    className="flex items-center justify-between py-1 text-left w-full group"
                  >
                    <span className={`text-sm font-bold transition-colors ${currentView === 'about' ? 'text-[#00204A]' : 'text-stone-700'}`}>
                      同窓会について
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#CD9535] transition-transform duration-350 ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {mobileAboutOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-4 mt-2 flex flex-col gap-2.5 overflow-hidden border-l-2 border-stone-100"
                      >
                        {aboutSubItems.map((sub, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleItemClick('about', sub.hash)}
                            className="text-stone-500 hover:text-[#00204A] text-xs font-bold text-left py-1 flex items-center justify-between group cursor-pointer"
                          >
                            <span>{sub.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-stone-200 group-hover:text-[#CD9535]" />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Other standard items */}
                <button
                  onClick={() => handleItemClick('home', '#news')}
                  className="flex items-center justify-between py-2 text-left w-full group border-b border-stone-50"
                >
                  <span className="text-sm font-bold text-stone-700 transition-colors">
                    お知らせ
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-300" />
                </button>

                <button
                  onClick={() => handleItemClick('home', '#events-section')}
                  className="flex items-center justify-between py-2 text-left w-full group border-b border-stone-50"
                >
                  <span className="text-sm font-bold text-stone-700 transition-colors">
                    イベント・総会
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-300" />
                </button>

                <button
                  onClick={() => handleItemClick('home', '#stories-section')}
                  className="flex items-center justify-between py-2 text-left w-full group border-b border-stone-50"
                >
                  <span className="text-sm font-bold text-stone-700 transition-colors">
                    卒業生ストーリー
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-300" />
                </button>

                <button
                  onClick={() => handleItemClick('home', '#network-archive')}
                  className="flex items-center justify-between py-2 text-left w-full group border-b border-stone-50"
                >
                  <span className="text-sm font-bold text-stone-700 transition-colors">
                    会報アーカイブ
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-300" />
                </button>

                <button
                  onClick={() => handleItemClick('home', '#site-footer')}
                  className="flex items-center justify-between py-2 text-left w-full group border-b border-stone-50"
                >
                  <span className="text-sm font-bold text-stone-700 transition-colors">
                    お問い合わせ
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-300" />
                </button>

                {/* Mobile tray manual newsletter toggle */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('open-newsletter'));
                    }, 200);
                  }}
                  className="flex items-center justify-between py-2.5 text-left w-full group border-b border-amber-100 bg-amber-500/5 px-2.5 rounded-lg"
                >
                  <span className="text-sm font-bold text-[#CD9535] flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CD9535]"></span>
                    </span>
                    最新会報 (No.42) 読込
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#CD9535]" />
                </button>
              </nav>

              <div className="pt-2">
                <button
                  onClick={() => handleItemClick('home', '#update-section')}
                  className="w-full flex items-center justify-center gap-2 bg-[#00204A] text-white text-xs font-bold py-3.5 px-6 rounded-xl hover:bg-[#CD9535] transition-colors shadow-inner text-center cursor-pointer border-none"
                >
                  <span>住所変更手続きを行う</span>
                  <ArrowRight className="w-4 h-4 text-[#CD9535]" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
