import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  BookOpen, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Laptop,
  Phone,
  FileDown,
  Clock3,
  MousePointerClick,
  Sparkles
} from 'lucide-react';

interface NewsletterModalProps {
  autoOpenReady?: boolean;
  onClose?: () => void;
}

export default function NewsletterModal({ autoOpenReady = true, onClose }: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'select' | 'magazine' | 'pdf'>('select');
  const [pdfPage, setPdfPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  useEffect(() => {
    // Show automatically on page mount (and on every reload/refresh)
    // We store a flag on window context so it only auto-opens once per reload session (and won't pop up again when user toggles currentView between Home and About)
    if (!autoOpenReady) return;

    if (!(window as any).__hasShownNewsletterThisSession) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        (window as any).__hasShownNewsletterThisSession = true;
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [autoOpenReady]);

  useEffect(() => {
    // Enable manual trigger from any part of the app
    const handleOpenNewsletter = () => {
      setIsOpen(true);
      setActiveTab('select');
      setSelectedArticle(null);
    };
    window.addEventListener('open-newsletter', handleOpenNewsletter);
    return () => {
      window.removeEventListener('open-newsletter', handleOpenNewsletter);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const articles = [
    {
      id: 1,
      category: '巻頭エッセイ',
      title: '茨城大学 半世紀の想い出',
      writer: '木戸 之都子（人文・文10回卒）',
      bulletPoints: [
        '1976年の入学から、人文図書室、古文書整理、同窓会名簿づくりまでをたどります。',
        '個人の思い出を通して、文理・人文学部同窓会の歩みと大学の変化が見えてきます。'
      ],
      outline: '懐かしさだけで終わらない、大学と同窓会が重ねてきた時間を感じられる巻頭記事です。まずここから読むと、第43号全体の温度感がつかめます。'
    },
    {
      id: 2,
      category: '学部長メッセージ',
      title: '同窓会の皆様へ',
      writer: '人文社会科学部長　蓮井 誠一郎',
      bulletPoints: [
        '人文社会科学部の現在と、これからの教育・研究環境づくりについて語られています。',
        'オンライン化が進む時代に、対面のつながりやカレッジの価値をどう再構築するかを考えます。'
      ],
      outline: '学部の今を知りたい同窓生に向けた、落ち着いた読み応えのあるメッセージです。母校との距離をもう一度近づけてくれます。'
    },
    {
      id: 3,
      category: '学生レポート',
      title: 'ひたちなか市における子どもの居場所づくり',
      writer: '人文社会科学部4年　中塩 紗矢香',
      bulletPoints: [
        'フリースクールや地域の居場所での実践から、子ども一人ひとりに寄り添う支援を考えます。',
        '在学生が地域の現場で何を学び、将来へどうつなげようとしているかが伝わる記事です。'
      ],
      outline: '現役学生のまなざしから、大学での学びが地域の課題と結びつく瞬間を読めます。卒業生にも在学生にも届く、今号の注目記事です。'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" id="editorial-newsletter-modal">
          {/* Backdrop with elegant clay tone fade */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#0F1115]/90 backdrop-blur-sm"
          />

          {/* Modal Container: Stark Brutalist / Swiss Grid Editorial */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#FCFAF7] text-[#1A1A1A] w-[95vw] md:w-full max-w-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-[#CD9535]/15 md:border-stone-800/20 overflow-hidden flex flex-col md:flex-row h-auto max-h-[88vh] md:max-h-[550px] md:h-[520px]"
          >
            
            {/* COLUMN 1: EDITORIAL JACKET COVER (Stark Bauhaus & Swiss Modernism) */}
            <div className="hidden md:flex bg-[#1C1C1C] text-[#F3EFE9] p-5 md:p-6 flex-col justify-between md:w-52 md:border-r border-stone-800 flex-shrink-0 relative overflow-hidden">
              {/* Asymmetric layout designators */}
              <div className="absolute top-0 right-0 h-full w-[1px] bg-stone-800/45 left-10 pointer-events-none" />
              <div className="absolute -right-14 -top-12 h-32 w-32 rounded-full bg-[#CD9535]/18 blur-2xl" />
              <div className="absolute bottom-6 left-4 h-20 w-20 rounded-full bg-white/7 blur-xl" />
              
              <div className="relative z-10 text-left">
                {/* Micro editorial metadata header */}
                <div className="flex items-center gap-2 mb-4 md:mb-6 text-[10px] font-mono tracking-[0.25em] text-[#CD9535] uppercase font-bold">
                  <span>No. 43 / NEW ISSUE</span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-stone-400 tracking-widest uppercase font-semibold">
                    IBARAKI UNIV. HUM-REUNION
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight leading-none text-white mt-1.5">
                    同窓会報
                  </h2>
                  <div className="text-[36px] font-mono font-extrabold leading-none text-[#CD9535] mt-0.5 tracking-tighter">
                    VOL.43
                  </div>
                </div>

                <div className="h-[1px] bg-stone-800 my-4" />

                <p className="text-stone-300 text-[11px] leading-relaxed tracking-wide font-sans">
                  半世紀の記憶、学部長メッセージ、学生の地域実践、総会案内を、すぐ読める入口に整理しました。
                </p>

                <div className="mt-5 space-y-2">
                  {['読みどころを先に確認', 'スマホで見やすい', '冊子風にも切替'].map((label) => (
                    <div key={label} className="flex items-center gap-2 text-[10px] font-bold text-stone-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#CD9535]" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 rounded-lg border border-white/10 bg-white/7 p-3">
                <p className="text-[9px] font-mono font-bold tracking-[0.22em] text-[#CD9535]">PICK UP</p>
                <p className="mt-1 text-[12px] font-serif font-black leading-snug text-white">
                  まずは巻頭特集から。懐かしさと現在の学びがつながります。
                </p>
              </div>
            </div>

            {/* COLUMN 2: DIGITAL READER STAGE (Stark Minimalist Japanese Layout Container) */}
            <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-between overflow-y-auto">
              
              {/* Dynamic Navbar: Flat, Crisp Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 mb-3.5 border-b border-stone-200 flex-shrink-0">
                <div className="flex flex-col gap-1 text-left w-full sm:w-auto">
                  {/* Mobile-only micro header */}
                  <div className="md:hidden flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#CD9535] uppercase font-bold mb-1">
                    <span>同窓会報 VOL.43</span>
                    <span className="text-stone-300">/</span>
                    <span className="text-stone-400 font-medium">ALUMNI BULLETIN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeTab !== 'select' && (
                      <button 
                        onClick={() => {
                          setActiveTab('select');
                          setSelectedArticle(null);
                        }}
                        className="text-[10px] font-sans font-bold tracking-wider text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FCFAF7] transition-all bg-white border border-stone-800 px-2 py-1 shadow-xs cursor-pointer inline-flex items-center gap-0.5 uppercase"
                      >
                        <ChevronLeft className="w-3 h-3" />
                        BACK
                      </button>
                    )}
                    <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.15em] text-stone-500 uppercase">
                      {activeTab === 'select' && 'Select Reading Format'}
                      {activeTab === 'magazine' && 'Web Magazine Fast summary'}
                      {activeTab === 'pdf' && 'Print Layout Digital Replica'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleClose}
                    className="group text-[10px] font-mono tracking-widest text-[#888888] hover:text-[#1A1A1A] border border-stone-200 hover:border-stone-800 px-3 py-1.5 transition-all flex items-center gap-1 cursor-pointer"
                    aria-label="閉じる"
                  >
                    <span>CLOSE</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* TAB 1: METHOD CHOOSE VIEW (Clean interactive architectural wireframe with zero reading burden) */}
              {activeTab === 'select' && (
                <div className="flex-grow flex flex-col justify-center py-1 text-left">
                  <div className="mb-4">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#CD9535]/25 bg-[#CD9535]/10 px-3 py-1.5 text-[10px] font-black tracking-[0.18em] text-[#9B6B18]">
                      <Sparkles className="h-3.5 w-3.5" />
                      最新号を、読みやすく再編集
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#1A1A1A] leading-snug">
                      まず読みたい記事が、すぐ見つかる会報です。
                    </h3>
                    <p className="text-stone-600 text-[12px] sm:text-[12.5px] mt-2 font-sans leading-relaxed">
                      巻頭エッセイ、学部長挨拶、学生レポート、総会案内。第43号の見どころを、短く読むか、冊子の雰囲気でじっくり読むか選べます。
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[
                        { icon: Clock3, label: '1分で概要' },
                        { icon: MousePointerClick, label: 'タップで記事' },
                        { icon: BookOpen, label: '冊子風表示' },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center justify-center gap-1.5 rounded-lg bg-white px-2 py-2 text-[10px] font-black text-stone-700 shadow-sm ring-1 ring-stone-200/70">
                          <Icon className="h-3.5 w-3.5 text-[#CD9535]" />
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="editorial-options">
                    
                    {/* OPTION A: WEB MAGAZINE CARDS STYLE */}
                    <div 
                      onClick={() => setActiveTab('magazine')}
                      className="group relative overflow-hidden rounded-2xl bg-white border border-[#CD9535]/35 hover:border-[#CD9535] p-4 sm:p-5 cursor-pointer transition-all hover:shadow-[0_18px_45px_rgba(205,149,53,0.18)] hover:-translate-y-1 flex flex-col justify-between"
                    >
                      <span className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#CD9535]/12 blur-xl" />
                      <div>
                        {/* Wireframe simulated tag */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-mono font-bold tracking-widest bg-[#00204A] text-[#FCFAF7] px-2.5 py-1 rounded-full leading-normal uppercase">
                            おすすめ
                          </span>
                          <span className="text-[#CD9535] text-[10px] font-mono font-bold flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            すぐ読める
                          </span>
                        </div>

                        <h4 className="font-serif font-black text-stone-900 text-base mb-1 group-hover:text-[#CD9535] transition-colors leading-snug">
                          見どころから読む Webマガジン
                        </h4>
                        
                        <p className="text-stone-600 text-[11.5px] leading-relaxed mb-3">
                          長い記事に入る前に、読みどころをカードで確認。気になる記事だけを選んで、短時間で会報の流れをつかめます。
                        </p>

                        {/* HIGHLY SCHEMATIC GRAPHICAL WIREFRAME WITH ZERO COGNITIVE BURDEN */}
                        <div className="hidden sm:block bg-[#FAF9F6] border border-stone-200/80 p-2.5 select-none space-y-2 rounded-sm font-sans">
                          <div className="flex justify-between items-center text-[8px] font-mono text-stone-400 font-bold">
                            <span>SUMMARY PLOT WIREFRAME</span>
                            <div className="flex gap-1 items-center">
                              <Laptop className="w-2.5 h-2.5" />
                              <Phone className="w-2.5 h-2.5 text-[#CD9535]" />
                            </div>
                          </div>
                          
                          {/* Simulated Interactive Mobile Content Blocks */}
                          <div className="space-y-1">
                            <div className="border border-stone-200/60 bg-white p-1 text-[8px] flex items-center justify-between">
                              <div className="flex items-center gap-1 w-full">
                                <span className="bg-[#CD9535] text-white font-mono text-[7px] w-3 h-3 flex items-center justify-center font-bold">1</span>
                                <div className="h-1.5 bg-stone-200 w-1/3 rounded-xs" />
                              </div>
                              <span className="text-[6px] font-mono text-stone-400">85%</span>
                            </div>
                            <div className="border border-stone-200/60 bg-white p-1 text-[8px] flex items-center justify-between">
                              <div className="flex items-center gap-1 w-full">
                                <span className="bg-[#1C1C1C] text-white font-mono text-[7px] w-3 h-3 flex items-center justify-center font-bold">2</span>
                                <div className="h-1.5 bg-stone-200 w-1/2 rounded-xs" />
                              </div>
                              <span className="text-[6px] font-mono text-[#CD9535] font-bold">DIAG</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-full bg-[#00204A] px-4 py-2.5 text-[11px] font-black tracking-widest text-white transition-colors group-hover:bg-[#CD9535] group-hover:text-[#1A1A1A]">
                        <span>見どころを読む</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* OPTION B: PDF REPLICA BOOK STYLE */}
                    <div 
                      onClick={() => setActiveTab('pdf')}
                      className="group rounded-2xl bg-white border border-stone-200 hover:border-stone-900 p-4 sm:p-5 cursor-pointer transition-all hover:shadow-[0_18px_45px_rgba(0,32,74,0.12)] hover:-translate-y-1 flex flex-col justify-between"
                    >
                      <div>
                        {/* Wireframe simulated tag */}
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[9px] font-mono font-bold tracking-widest bg-[#CD9535] text-[#FCFAF7] px-2.5 py-1 rounded-full leading-normal uppercase">
                            冊子派
                          </span>
                          <span className="text-stone-400 text-[10px] font-mono tracking-wider font-semibold">
                            冊子レイアウト
                          </span>
                        </div>

                        <h4 className="font-serif font-black text-stone-900 text-base mb-1 group-hover:text-[#CD9535] transition-colors leading-snug">
                          紙面の雰囲気で読む デジタル冊子
                        </h4>
                        
                        <p className="text-stone-600 text-[11.5px] leading-relaxed mb-3">
                          これまでの会報らしい読み心地を大切にした表示です。ページをめくりながら、資料として落ち着いて確認できます。
                        </p>

                        {/* HIGHLY SCHEMATIC PRINT LAYOUT WIREFRAME FOR PRINT */}
                        <div className="hidden sm:block bg-[#FAF9F6] border border-stone-200/80 p-2.5 select-none space-y-2 rounded-sm font-sans">
                          <div className="flex justify-between items-center text-[8px] font-mono text-stone-400 font-bold">
                            <span>PRINT LAYOUT DECK</span>
                            <div className="flex gap-1 items-center">
                              <BookOpen className="w-2.5 h-2.5 text-[#CD9535]" />
                            </div>
                          </div>
                          
                          {/* Beautiful miniature pages side by side */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="border border-stone-300 bg-white p-1 h-8 flex flex-col justify-between shadow-xs">
                              <div className="w-2/3 h-1 bg-[#CD9535]/40 rounded-xs" />
                              <div className="space-y-0.5">
                                <div className="w-full h-1 bg-stone-200 rounded-xs" />
                              </div>
                            </div>
                            <div className="border-y border-r border-[#CD9535]/30 bg-white p-1 h-8 flex flex-col justify-between shadow-xs border-l-[1.5px] border-stone-400">
                              <div className="w-full h-1 bg-stone-200" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-full border border-stone-900 px-4 py-2.5 text-[11px] font-black tracking-widest text-stone-900 transition-colors group-hover:bg-stone-950 group-hover:text-white">
                        <span>冊子風で開く</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: WEB MAGAZINE SUMMARY SLIDESHOW (Strict Minimal layout) */}
              {activeTab === 'magazine' && (
                <div className="flex-grow flex flex-col justify-between py-1 text-left">
                  
                  {selectedArticle === null ? (
                    <div>
                      <div className="mb-4">
                        <span className="text-[9px] font-mono font-bold text-[#CD9535] tracking-[0.25em] block uppercase">
                          No.43 WEB EDITION / 今号の読みどころ
                        </span>
                        <h4 className="text-base sm:text-lg font-serif font-black text-stone-900 leading-tight mt-1">
                          気になる記事をタップ！胸が高鳴るストーリーが待っています
                        </h4>
                      </div>

                      <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                        {articles.map((art) => (
                          <div 
                            key={art.id}
                            onClick={() => setSelectedArticle(art.id)}
                            className="bg-white border border-stone-200 hover:border-stone-800 p-4 rounded-none cursor-pointer transition-all flex items-start gap-4 group"
                          >
                            <span className="w-9 h-9 border border-stone-200 text-stone-800 flex items-center justify-center font-mono font-extrabold text-[13px] flex-shrink-0 group-hover:bg-stone-950 group-hover:text-[#FCFAF7] group-hover:border-stone-950 transition-all duration-300">
                              0{art.id}
                            </span>
                            
                            <div className="flex-1 text-left">
                              <span className="text-[9px] font-mono tracking-widest text-[#CD9535] block font-bold mb-0.5">
                                {art.category}
                              </span>
                              
                              <h5 className="font-sans font-bold text-stone-800 text-[13.5px] sm:text-sm group-hover:text-[#CD9535] transition-colors leading-snug">
                                {art.title}
                              </h5>
                              <p className="text-[11px] text-stone-400 font-medium">
                                {art.writer}
                              </p>
                            </div>

                            <ChevronRight className="w-4.5 h-4.5 text-stone-300 self-center group-hover:text-stone-950 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Beautiful Editorial Spec Details Layout (Unbelievably simple, ultra-graphic, zero-reading burden)
                    <motion.div 
                      key="selected-art-view"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white border border-stone-200 p-6 text-left flex-grow flex flex-col justify-between"
                    >
                      <div>
                        {/* Header metadata */}
                        <div className="flex items-center justify-between border-b border-stone-200 pb-2.5 mb-4">
                          <span className="text-[9.5px] font-mono font-black text-[#CD9535] tracking-widest uppercase">
                            {articles.find(a => a.id === selectedArticle)?.category}
                          </span>
                          <button 
                            onClick={() => setSelectedArticle(null)}
                            className="text-[10px] font-mono font-bold text-stone-500 hover:text-stone-950 hover:underline tracking-wider"
                          >
                            ← INDEX / 戻る
                          </button>
                        </div>

                        <h4 className="text-base sm:text-lg font-serif font-black text-[#1A1A1A] leading-snug mb-1">
                          {articles.find(a => a.id === selectedArticle)?.title}
                        </h4>
                        
                        <p className="text-[11px] text-stone-400 font-mono font-bold tracking-wide mb-5">
                          {articles.find(a => a.id === selectedArticle)?.writer}
                        </p>

                        {/* Interactive schematic diagram representation with a beautiful dot blueprint style and zero-cognitive load */}
                        <div className="p-5 bg-[#FCFAF7] border-l-4 border-[#CD9535] border-y border-r border-stone-200/80 mb-4 select-none relative overflow-hidden bg-[radial-gradient(#EFECE6_1px,transparent_1px)] [background-size:16px_16px]">
                          <span className="text-[9px] font-mono font-bold tracking-widest text-[#CD9535] block mb-3 uppercase flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#CD9535] animate-ping" />
                            ◆ 15秒で頭に入る構造プロット ◆
                          </span>
                          
                          <div className="space-y-3.5 relative z-10">
                            {articles.find(a => a.id === selectedArticle)?.bulletPoints.map((pt, idx) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <span className="bg-[#CD9535] text-stone-900 rounded-none font-mono w-4.5 h-4.5 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                  0{idx + 1}
                                </span>
                                <p className="text-stone-850 text-xs font-bold leading-relaxed font-sans">
                                  {pt}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <p className="text-stone-500 text-xs leading-relaxed font-sans">
                          {articles.find(a => a.id === selectedArticle)?.outline}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2.5 justify-end">
                        <button 
                          onClick={() => setSelectedArticle(null)}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-mono font-bold tracking-widest px-4 py-2.5 transition-colors cursor-pointer"
                        >
                          SPECIAL LIST
                        </button>
                        <a 
                          href="http://dousoukai.hum.ibaraki.ac.jp/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-stone-950 hover:bg-[#CD9535] text-white hover:text-stone-900 text-xs font-mono font-bold px-4 py-2.5 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span>VISIT FULL BULLETIN SITE</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </motion.div>
                  )}

                  {/* Footer toggle prompt */}
                  {selectedArticle === null && (
                    <div className="mt-4 text-left border-t border-stone-100 pt-3">
                      <button 
                        onClick={() => setActiveTab('pdf')}
                        className="text-[10px] font-sans font-bold text-[#CD9535] hover:text-stone-900 tracking-wide underline uppercase"
                      >
                        → 実際の冊子そのままのレイアウト（PDF版）で読みたい場合はこちら
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: PRINT PDF DIGITAL MOCKUP (Exquisite page book representation) */}
              {activeTab === 'pdf' && (
                <div className="flex-grow flex flex-col justify-between py-1 text-left">
                  <div>
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-100 pb-2">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-[#CD9535] tracking-[0.25em] block uppercase">PRINTED DOCUMENT REPLICA</span>
                        <h4 className="text-base font-serif font-black text-stone-900 mt-0.5">
                          冊子見開き完全再現ビュー
                        </h4>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1.5 sm:mt-0">
                        <span className="text-[10px] font-mono text-stone-400 font-bold tracking-wider">
                          4 PAGES
                        </span>
                        <a 
                          href="http://dousoukai.hum.ibaraki.ac.jp/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-stone-950 text-white hover:bg-[#CD9535] hover:text-stone-900 transition-colors text-[10px] font-mono font-bold px-3 py-1.5 flex items-center gap-1 uppercase tracking-wider"
                        >
                          <span>DOWNLOAD</span>
                          <FileDown className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Book wireframe preview: high-end flat book render */}
                    <div className="bg-[#FAF9F5] border border-stone-250 p-4 relative overflow-hidden flex flex-col items-center select-none h-[180px] justify-center bg-white shadow-inner">
                      
                      {/* Left and Right navigation buttons on top of book */}
                      <button 
                        disabled={pdfPage === 1}
                        onClick={() => setPdfPage(p => Math.max(1, p - 1))}
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-none border border-stone-800 bg-white/95 flex items-center justify-center text-stone-800 hover:bg-stone-50 transition-colors z-20 ${pdfPage === 1 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button 
                        disabled={pdfPage === 4}
                        onClick={() => setPdfPage(p => Math.min(4, p + 1))}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-none border border-stone-800 bg-white/95 flex items-center justify-center text-stone-800 hover:bg-stone-50 transition-colors z-20 ${pdfPage === 4 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* simulated book layout with elegant spine shadow */}
                      <div className="w-[170px] h-[145px] bg-[#FCFAF7] shadow-[0_8px_25px_rgba(0,0,0,0.08)] border-y border-stone-300 px-3.5 py-3 flex flex-col justify-between transition-all duration-300 relative border-l border-r-4 border-r-stone-400">
                        <div className="absolute top-2 right-2.5 text-[8px] font-mono text-stone-400 font-extrabold tracking-wider">PAGE 0{pdfPage}/04</div>
                        
                        {pdfPage === 1 && (
                          <div className="space-y-3 pt-1 text-left">
                            <div className="flex justify-between items-baseline border-b border-stone-200 pb-1">
                              <span className="text-[10.5px] font-serif font-black text-stone-900 tracking-tight">第43号 表紙</span>
                              <div className="w-5 h-0.5 bg-[#CD9535]" />
                            </div>
                            
                            {/* Stylized physical graphic mock */}
                            <div className="w-full h-11 bg-[#1C1C1C] flex flex-col justify-center items-center p-1.5 relative">
                              <span className="text-[#CD9535] text-[9px] font-serif font-extrabold tracking-tight">同窓会報</span>
                              <span className="text-white text-[6px] font-mono tracking-widest uppercase mt-0.5">IBARAKI UNIV</span>
                            </div>

                            <div className="space-y-0.5 mt-0.5">
                              <div className="w-full h-0.5 bg-stone-300" />
                              <div className="w-2/3 h-0.5 bg-stone-200" />
                            </div>
                          </div>
                        )}

                        {pdfPage === 2 && (
                          <div className="space-y-2.5 pt-0.5 text-left">
                            <span className="text-[9px] font-mono font-extrabold text-stone-800 tracking-wider block border-b border-stone-200 pb-0.5">02: 決算会計報告</span>
                            
                            <div className="space-y-1.5 mt-1">
                              <div className="flex gap-1.5 justify-between">
                                <div className="w-1/3 h-5 bg-[#FCFAF7] border border-stone-200 p-0.5 flex flex-col justify-between">
                                  <div className="bg-stone-300 h-0.5 w-full" />
                                </div>
                                <div className="w-2/3 h-5 bg-[#FCFAF7] border border-stone-300 p-0.5">
                                  <div className="bg-[#CD9535] h-1 w-4/5" />
                                </div>
                              </div>
                              <div className="w-full h-9 bg-stone-50 border border-stone-200 p-0.5 flex flex-col justify-between">
                                <span className="text-[6px] text-stone-400 font-mono tracking-tighter uppercase font-bold">REVENUE</span>
                                <div className="flex gap-0.5">
                                  <div className="h-1 bg-stone-800" style={{ width: '60%' }} />
                                  <div className="h-1 bg-[#CD9535]" style={{ width: '30%' }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {pdfPage === 3 && (
                          <div className="space-y-2.5 pt-0.5 text-left">
                            <span className="text-[9px] font-mono font-extrabold text-stone-800 tracking-wider block border-b border-stone-200 pb-0.5">03: 論文選出・学生寄稿</span>
                            
                            <div className="space-y-1.5">
                              <div className="w-full h-7 bg-white border border-stone-200 p-1 flex items-center gap-1.5">
                                <span className="text-[#CD9535] text-[9px] font-serif font-black">文</span>
                                <div className="flex-1 space-y-0.5">
                                  <div className="w-2/3 h-0.5 bg-stone-300" />
                                </div>
                              </div>
                              
                              <div className="w-full h-8 bg-white border border-stone-200 p-1 flex flex-col justify-between">
                                <div className="w-full h-0.5 bg-stone-300" />
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="h-2 bg-stone-100" />
                                  <div className="h-2 bg-[#CD9535]/15" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {pdfPage === 4 && (
                          <div className="space-y-2.5 pt-0.5 text-left">
                            <span className="text-[9px] font-mono font-extrabold text-stone-800 tracking-wider block border-b border-stone-200 pb-0.5">04: 登録住所一斉更新</span>
                            
                            <div className="w-full h-11 bg-[#FCFAF7] border border-dashed border-[#CD9535]/40 p-1 flex flex-col justify-between items-center text-center">
                              <span className="text-[7px] font-bold text-stone-700 tracking-tighter">データ更新管理</span>
                              <div className="bg-stone-900 text-white rounded-none w-12 h-3 flex items-center justify-center text-[6px] font-mono font-bold tracking-wide">
                                CLOUD REG
                              </div>
                            </div>
                            
                            <div className="space-y-0.5">
                              <div className="w-full h-0.5 bg-stone-300" />
                            </div>
                          </div>
                        )}

                        <div className="text-[7px] text-stone-400 text-center font-mono tracking-widest">
                          - NO. 43 BULLETIN REPLICA -
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button 
                      onClick={() => setActiveTab('magazine')}
                      className="text-[10px] font-sans font-bold text-[#CD9535] hover:text-stone-900 tracking-wide underline uppercase"
                    >
                      ← スマホに最適化されたWebマガジン版はこちら
                    </button>
                    
                    <a 
                      href="http://dousoukai.hum.ibaraki.ac.jp/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-stone-950 hover:bg-[#CD9535] text-white hover:text-stone-900 font-mono font-bold py-2 px-4 transition-all flex items-center gap-1.5 select-none"
                    >
                      <span>OPEN PRINT PDF HIGH-RES</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              )}



            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
