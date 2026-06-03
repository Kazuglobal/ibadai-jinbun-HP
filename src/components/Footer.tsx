import React from 'react';
import { ArrowUp, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onNavigate?: (view: 'home' | 'about', hash?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const sitemapMain = [
    { name: 'ニュース', en: 'NEWS', href: '#news' },
    { name: 'イベント', en: 'EVENTS', href: '#events' },
    { name: '卒業生ストーリー', en: 'STORIES', href: '#stories' },
    { name: '交流・ネットワーク', en: 'NETWORK', href: '#network' },
    { name: '会報アーカイブ', en: 'ARCHIVE', href: '#archive' },
  ];

  const sitemapSub = [
    { name: '住所変更手続き', href: '#address' },
    { name: '後援支援・学生支援情報', href: '#support' },
    { name: '入会・退会について', href: '#membership' },
    { name: '地域支部・職域支部', href: '#branches' },
    { name: 'お問い合わせ', href: '#contact' },
    { name: '個人情報保護方針', href: '#privacy' },
    { name: '会則・概要', href: '#rules' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (!onNavigate) {
      window.location.hash = href;
      return;
    }

    const aboutHashes = ['#rules', '#bylaws', '#about-section', '#membership', '#branches', '#privacy'];

    if (aboutHashes.includes(href)) {
      onNavigate('about', href === '#rules' ? '#bylaws' : href);
    } else {
      let targetHash = href;
      if (href === '#address') targetHash = '#update-section';
      if (href === '#events') targetHash = '#events-section';
      if (href === '#contact') targetHash = '#site-footer';
      onNavigate('home', targetHash);
    }
  };

  return (
    <footer className="bg-white text-stone-600 border-t border-stone-200/80 pt-16 pb-8 relative overflow-hidden" id="site-footer">
      {/* Decorative organic background line art */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,200 C300,100 600,500 1100,150 C1300,50 1500,300 1600,100" stroke="#00204A" strokeWidth="2" />
          <path d="M-120,230 C280,130 580,530 1080,180 C1280,80 1480,330 1580,130" stroke="#00204A" strokeWidth="1" strokeDasharray="5 5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Top interactive Back to Top button floating row */}
        <div className="flex justify-end mb-12">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: '#CD9535' }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="flex items-center gap-2 bg-[#00204A] text-white p-3 lg:px-4 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer focus:outline-none shadow-sm"
            aria-label="Back to Top"
            id="back-to-top-button"
          >
            <span>ページトップへ</span>
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-stone-200/60">
          
          {/* Left Block: Logo, Info & Contacts (span 5) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-6" id="footer-logo-container">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold tracking-wider text-[#CD9535] leading-none">
                  茨城大学
                </span>
                <span className="text-base md:text-lg font-bold tracking-tight text-[#00204A] mt-1 leading-none">
                  文理・人文学部同窓会
                </span>
              </div>
            </div>

            <p className="text-stone-600 text-xs md:text-sm leading-relaxed mb-6 font-sans">
              茨城大学文理学部および人文社会科学部の卒業生・在学生を繋ぐ、公式同窓会ネットワーク事務局です。本学の学術研究支援、及び同窓生の皆様の相互親睦を目的として活動しています。
            </p>

            {/* Office Contact Info Card */}
            <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-5 w-full space-y-3 text-xs md:text-sm text-stone-600" id="footer-contact-info">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#CD9535] mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  〒310-8512 水戸市文京2-1-1<br />
                  茨城大学人文社会科学部内<br />
                  茨城大学文理・人文学部同窓会事務局
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#CD9535] mt-1 flex-shrink-0" />
                <span className="leading-normal">
                  （029）228-8546<br />
                  090-3100-5814（鈴木）
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#CD9535] flex-shrink-0" />
                <span className="break-all">ibadai.bj.dousou@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Right Block: Sitemap Grid (span 7) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Sitemap Column 1: Main Menu */}
            <div className="flex flex-col text-left">
              <h4 className="text-[#CD9535] font-bold text-xs md:text-sm uppercase tracking-widest border-b border-stone-200 pb-2.5 mb-4">
                同窓会メニュー
              </h4>
              <ul className="space-y-3.5" id="footer-main-menu">
                {sitemapMain.map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="group flex items-center justify-between text-xs md:text-[13px] text-stone-600 hover:text-[#00204A] transition-colors py-1 focus:outline-none"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-stone-600 group-hover:text-amber-700 transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[9px] text-stone-400 group-hover:text-stone-500">
                          {item.en}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 group-hover:text-amber-700 transition-all ml-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sitemap Column 2: Various Procedures */}
            <div className="flex flex-col text-left col-span-1 sm:col-span-2">
              <h4 className="text-[#CD9535] font-bold text-xs md:text-sm uppercase tracking-widest border-b border-stone-200 pb-2.5 mb-4">
                手続き・ご支援
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5" id="footer-procedure-menu">
                {sitemapSub.map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="group flex items-center gap-1.5 text-xs md:text-[13px] text-stone-600 hover:text-[#00204A] hover:translate-x-1 duration-200 transition-transform py-1 focus:outline-none"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-60" />
                      <span className="font-medium">{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>


            </div>

          </div>

        </div>

        {/* Bottom Copyright & Notes Section */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] md:text-xs text-stone-500 font-sans">
          <p>© 2026 茨城大学 文理・人文学部同窓会 All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#rules" onClick={(e) => handleLinkClick(e, '#rules')} className="hover:text-[#00204A] transition-colors">会則</a>
            <span>•</span>
            <a href="#privacy" onClick={(e) => handleLinkClick(e, '#privacy')} className="hover:text-[#00204A] transition-colors">プライバシーポリシー</a>
            <span>•</span>
            <a href="https://www.ibaraki.ac.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00204A] transition-colors">茨城大学公式サイト</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
