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
  FileDown
} from 'lucide-react';

interface NewsletterModalProps {
  onClose?: () => void;
}

export default function NewsletterModal({ onClose }: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'select' | 'magazine' | 'pdf'>('select');
  const [pdfPage, setPdfPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  useEffect(() => {
    // Show automatically on page mount (and on every reload/refresh)
    // We store a flag on window context so it only auto-opens once per reload session (and won't pop up again when user toggles currentView between Home and About)
    if (!(window as any).__hasShownNewsletterThisSession) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        (window as any).__hasShownNewsletterThisSession = true;
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

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
      category: 'DIALOGUE / 巻頭対談',
      title: '人文社会科学部が描く「未来の地域協働設計」',
      writer: '阿部 准教授 × 同窓会代表幹事',
      bulletPoints: [
        '生涯学習とリカレント教育のモデルケース。',
        '大学発の知見を地域へ、現場のリアルな経験を後輩へ巡らせる仕組み。'
      ],
      outline: 'これからの文系学問が果たすべき地域連携と、同窓生ネットワークが持つ実社会でのポテンシャルについてコンパクトに抜粋して提示しています。'
    },
    {
      id: 2,
      category: 'AWARD / 学生活動',
      title: '第11回学生懸賞論文 最優秀賞受賞作検証',
      writer: '選出：人文社会科学部 3年',
      bulletPoints: [
        '地方都市における自主移動系コミュニティ交通の持続性。',
        '豊富なアンケートとデータに基づく、実現可能性の高い画期的な自治体提案。'
      ],
      outline: '徹底した実地踏査とデータ収集による学生の熱い眼差しが評価されました。概要と講評を瞬時に読み解くことができます。'
    },
    {
      id: 3,
      category: 'REPORT / 講義最前線',
      title: '人文社会科学部「地域連携授業」の実践',
      writer: '地域協働科目 担当講義陣',
      bulletPoints: [
        '同窓会が全面的に講師陣を財政派遣する特別寄附カリキュラム。',
       '若手起業家から行政官まで、多様な先輩たちが教壇に立ち生の実務を語る。'
      ],
      outline: '社会に出てから即戦力となるための知恵を養う最先端のプログラムについて、一目で全体像が把握できるダイアグラムで構成されています。'
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
            className="relative bg-[#FCFAF7] text-[#1A1A1A] w-full max-w-4xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-stone-800/20 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[660px]"
          >
            
            {/* COLUMN 1: EDITORIAL JACKET COVER (Stark Bauhaus & Swiss Modernism) */}
            <div className="bg-[#1C1C1C] text-[#F3EFE9] p-6 md:p-8 flex flex-col justify-between w-full md:w-85 md:border-r border-stone-800 flex-shrink-0 relative">
              {/* Asymmetric layout designators */}
              <div className="absolute top-0 right-0 h-full w-[1px] bg-stone-800/45 left-10 pointer-events-none" />
              
              <div className="relative z-10 text-left">
                {/* Micro editorial metadata header */}
                <div className="flex items-center gap-2 mb-8 text-[10px] font-mono tracking-[0.25em] text-[#CD9535] uppercase font-bold">
                  <span>No. 42 / SPRING ISSUE</span>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-mono text-stone-400 tracking-widest uppercase font-semibold">
                    IBARAKI UNIV. HUM-REUNION
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-none text-white mt-2">
                    同窓会報
                  </h2>
                  <div className="text-[48px] font-mono font-extrabold leading-none text-[#CD9535] mt-1 tracking-tighter">
                    VOL.42
                  </div>
                </div>

                <div className="h-[1px] bg-stone-800 my-6" />

                <p className="text-stone-400 text-[11.5px] leading-relaxed tracking-wide font-sans">
                  読者の「読む時間と認知の負担」を極限まで低減。デザインを視覚的なワイヤーフレーム、短い構造化テキストに再設計し、直感的な誌面レイアウトとしてまとめました。
                </p>
              </div>

              {/* Graphical Wireframe Abstract layout: simulated print alignment */}
              <div className="hidden md:block bg-stone-900/40 border border-stone-800 rounded p-4 my-6 text-[10px] font-mono text-stone-500 overflow-hidden relative">
                <div className="flex justify-between border-b border-stone-800 pb-2 mb-2 font-bold text-[9px] tracking-wider text-stone-400">
                  <span>PRINT WIREFRAME</span>
                  <span>424 / 962MM</span>
                </div>
                <div className="space-y-1.5 opacity-60">
                  <div className="h-2 bg-stone-800 w-full rounded" />
                  <div className="h-5 bg-[#CD9535]/20 border border-[#CD9535]/35 rounded flex items-center justify-center font-bold text-[#CD9535] text-[8px] tracking-wider">
                    COLUMN 01 HEADER
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="h-3 bg-stone-800 rounded" />
                    <div className="h-3 bg-stone-800/50 rounded" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 text-stone-500 text-[9.5px] font-mono tracking-widest text-left pt-6 md:pt-0">
                PUBLISHED BY UNIVERSITY ALUMNI
              </div>
            </div>

            {/* COLUMN 2: DIGITAL READER STAGE (Stark Minimalist Japanese Layout Container) */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              
              {/* Dynamic Navbar: Flat, Crisp Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-stone-200 flex-shrink-0">
                <div className="flex items-center gap-2">
                  {activeTab !== 'select' && (
                    <button 
                      onClick={() => {
                        setActiveTab('select');
                        setSelectedArticle(null);
                      }}
                      className="text-[11px] font-sans font-bold tracking-wider text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FCFAF7] transition-all bg-white border border-stone-800 px-3 py-1.5 shadow-xs cursor-pointer inline-flex items-center gap-1 uppercase"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      BACK
                    </button>
                  )}
                  <div className="text-[11px] font-mono font-bold tracking-[0.15em] text-stone-500 uppercase">
                    {activeTab === 'select' && 'Select Reading Format'}
                    {activeTab === 'magazine' && 'Web Magazine Fast summary'}
                    {activeTab === 'pdf' && 'Print Layout Digital Replica'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleClose}
                    className="group text-[10px] font-mono tracking-widest text-stone-500 hover:text-stone-900 border border-stone-200 hover:border-stone-800 px-3 py-1.5 transition-all flex items-center gap-1 cursor-pointer"
                    aria-label="閉じる"
                  >
                    <span>CLOSE</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* TAB 1: METHOD CHOOSE VIEW (Clean interactive architectural wireframe) */}
              {activeTab === 'select' && (
                <div className="flex-grow flex flex-col justify-center py-2 text-left">
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#1A1A1A]">
                      情報負荷のない閲覧スタイルをご選択ください
                    </h3>
                    <p className="text-stone-500 text-xs mt-1.5 font-sans leading-relaxed">
                      どちらの選択肢も、ダラダラとした長いテキストを排除し、視覚的な要点配置を用いて瞬時に最新情報を獲得できるように設計されています。
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="editorial-options">
                    
                    {/* OPTION A: WEB MAGAZINE CARDS STYLE */}
                    <div 
                      onClick={() => setActiveTab('magazine')}
                      className="group bg-white border border-stone-200 hover:border-stone-900/60 p-6 cursor-pointer transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 flex flex-col justify-between"
                    >
                      <div>
                        {/* Wireframe simulated tag */}
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-mono font-bold tracking-widest bg-stone-900 text-[#FCFAF7] px-2 py-1 leading-none uppercase">
                            WEB DIGEST
                          </span>
                          <span className="text-stone-400 text-[10px] font-sans font-medium">
                            スマホ最適・スクロール型
                          </span>
                        </div>

                        <h4 className="font-serif font-black text-stone-900 text-base mb-2 group-hover:text-[#CD9535] transition-colors leading-snug">
                          Webマガジン版で読む
                        </h4>
                        
                        <p className="text-stone-500 text-[11.5px] leading-relaxed">
                          各トピックを「15秒のスマートな図解・要点」として再構成。テキストを読む疲労を感じず、直感的にトピックのみをサクサク把握できます。
                        </p>

                        {/* HIGHLY SCHEMATIC JAPANESE GRAPHICAL WIREFRAME */}
                        <div className="mt-4 bg-[#FCFAF7] border border-stone-200 p-3.5 space-y-2 select-none">
                          <div className="flex justify-between items-center text-[8px] font-mono text-stone-400">
                            <span>GRID BLOCKS VIEW</span>
                            <div className="flex gap-1">
                              <Laptop className="w-3 h-3" />
                              <Phone className="w-3 h-3" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            <div className="border border-stone-200 bg-white p-1 text-[8px] font-mono text-center flex flex-col justify-between h-14">
                              <div className="bg-stone-300 h-1 w-full rounded-xs" />
                              <div className="bg-stone-100 h-6 w-full rounded-xs mt-1" />
                              <div className="text-[7px] text-[#CD9535] font-bold">DIGEST</div>
                            </div>
                            <div className="border border-stone-200 bg-white p-1 text-[8px] font-mono text-center flex flex-col justify-between h-14">
                              <div className="bg-stone-300 h-1 w-2/3 rounded-xs" />
                              <div className="bg-stone-100 h-6 w-full rounded-xs mt-1" />
                              <div className="text-[7px] text-[#CD9535] font-bold font-sans">SUMMARY</div>
                            </div>
                            <div className="border border-stone-900/40 bg-white p-1 text-[8px] font-mono text-[#CD9535] text-center flex flex-col justify-between h-14">
                              <div className="bg-[#CD9535] h-1 w-full rounded-xs" />
                              <div className="bg-stone-100 h-6 w-full rounded-xs mt-1" />
                              <div className="text-[7px] text-[#1A1A1A] font-bold">BULLET</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between text-xs font-mono font-bold tracking-widest text-[#CD9535] border-t border-stone-100 pt-3 group-hover:text-stone-900 transition-colors">
                        <span>START READING WEB</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* OPTION B: PDF REPLICA BOOK STYLE */}
                    <div 
                      onClick={() => setActiveTab('pdf')}
                      className="group bg-white border border-stone-200 hover:border-stone-900/60 p-6 cursor-pointer transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 flex flex-col justify-between"
                    >
                      <div>
                        {/* Wireframe simulated tag */}
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-mono font-bold tracking-widest bg-[#CD9535] text-[#FCFAF7] px-2 py-1 leading-none uppercase">
                            PDF EDITION
                          </span>
                          <span className="text-stone-400 text-[10px] font-sans font-medium">
                            冊子イメージそのまま
                          </span>
                        </div>

                        <h4 className="font-serif font-black text-stone-900 text-base mb-2 group-hover:text-[#CD9535] transition-colors leading-snug">
                          デジタルブック版で読む
                        </h4>
                        
                        <p className="text-stone-500 text-[11.5px] leading-relaxed">
                          実際の印刷物と同じ「美しい見開きレイアウト」を大画面のPDFで楽しめます。印刷・保存や、全体の一括ダウンロードをご希望の際におすすめです。
                        </p>

                        {/* HIGHLY SCHEMATIC JAPANESE GRAPHICAL WIREFRAME FOR PRINT */}
                        <div className="mt-4 bg-[#FCFAF7] border border-stone-200 p-3.5 space-y-2 select-none">
                          <div className="flex justify-between items-center text-[8px] font-mono text-stone-400">
                            <span>PRINT LAYOUT PAGE DECK</span>
                            <div className="flex gap-1 items-center">
                              <BookOpen className="w-3 h-3" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="border border-stone-300 bg-white p-1.5 h-14 flex flex-col justify-between">
                              <div className="bg-[#CD9535]/30 h-1 w-1/2" />
                              <div className="space-y-1">
                                <div className="bg-stone-200 h-1.5 w-full" />
                                <div className="bg-stone-100 h-1 w-4/5" />
                              </div>
                              <div className="text-[6px] text-stone-400 font-mono text-right">01</div>
                            </div>
                            <div className="border-y border-r border-[#CD9535]/50 bg-white p-1.5 h-14 flex flex-col justify-between border-l-2 border-stone-500 shadow-xs">
                              <div className="bg-stone-200 h-1 w-full" />
                              <div className="bg-[#CD9535]/10 h-3 w-full" />
                              <div className="text-[6px] text-[#CD9535] font-mono font-bold">REUNION</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between text-xs font-mono font-bold tracking-widest text-stone-700 border-t border-stone-100 pt-3 group-hover:text-stone-900 transition-colors">
                        <span>OPEN PDF REPLICA</span>
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
                          No.42 WEB EDITION SPECS / 要点抽出
                        </span>
                        <h4 className="text-lg font-serif font-black text-stone-900 leading-tight mt-1">
                          記事を選択：読む負担を極限まで削いだエッセンス解説
                        </h4>
                      </div>

                      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
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
                    // Beautiful Editorial Spec Details Layout (Unbelievably simple, graphic, zero-reading burden)
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
                            ← INDEX
                          </button>
                        </div>

                        <h4 className="text-base sm:text-lg font-serif font-black text-[#1A1A1A] leading-snug mb-1">
                          {articles.find(a => a.id === selectedArticle)?.title}
                        </h4>
                        
                        <p className="text-[11px] text-stone-400 font-mono font-bold tracking-wide mb-5">
                          {articles.find(a => a.id === selectedArticle)?.writer}
                        </p>

                        {/* Interactive schematic diagram visual representation of the article */}
                        <div className="p-4 bg-[#FCFAF7] border-l-4 border-stone-800 border-y border-r border-stone-200 mb-4 select-none">
                          <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#CD9535] block mb-3 uppercase">◆ 15秒で頭に入る構造プロット ◆</span>
                          
                          <div className="space-y-3">
                            {articles.find(a => a.id === selectedArticle)?.bulletPoints.map((pt, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="bg-stone-900 text-white rounded-none font-mono w-4 h-4 text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                  0{idx + 1}
                                </span>
                                <p className="text-stone-800 text-[11.5px] font-bold leading-relaxed font-sans">
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
                    <div className="bg-[#FAF9F5] border border-stone-250 p-6 relative overflow-hidden flex flex-col items-center select-none h-[225px] justify-center bg-white shadow-inner">
                      
                      {/* Left and Right navigation buttons on top of book */}
                      <button 
                        disabled={pdfPage === 1}
                        onClick={() => setPdfPage(p => Math.max(1, p - 1))}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none border border-stone-800 bg-white/95 flex items-center justify-center text-stone-800 hover:bg-stone-50 transition-colors z-20 ${pdfPage === 1 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <ChevronLeft className="w-4.5 h-4.5" />
                      </button>

                      <button 
                        disabled={pdfPage === 4}
                        onClick={() => setPdfPage(p => Math.min(4, p + 1))}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none border border-stone-800 bg-white/95 flex items-center justify-center text-stone-800 hover:bg-stone-50 transition-colors z-20 ${pdfPage === 4 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <ChevronRight className="w-4.5 h-4.5" />
                      </button>

                      {/* simulated book layout with elegant spine shadow */}
                      <div className="w-[195px] h-[185px] bg-[#FCFAF7] shadow-[0_8px_25px_rgba(0,0,0,0.08)] border-y border-stone-300 px-4.5 py-4 flex flex-col justify-between transition-all duration-300 relative border-l border-r-4 border-r-stone-400">
                        <div className="absolute top-2.5 right-3 text-[8.5px] font-mono text-stone-400 font-extrabold tracking-wider">PAGE 0{pdfPage}/04</div>
                        
                        {pdfPage === 1 && (
                          <div className="space-y-4 pt-1.5 text-left">
                            <div className="flex justify-between items-baseline border-b border-stone-200 pb-1.5">
                              <span className="text-[11.5px] font-serif font-black text-stone-900 tracking-tight">第42号 表紙</span>
                              <div className="w-6 h-1 bg-[#CD9535]" />
                            </div>
                            
                            {/* Stylized physical graphic mock */}
                            <div className="w-full h-15 bg-[#1C1C1C] flex flex-col justify-center items-center p-2 relative">
                              <span className="text-[#CD9535] text-[10px] font-serif font-extrabold tracking-tight">同窓会報</span>
                              <span className="text-white text-[7px] font-mono tracking-widest uppercase mt-0.5">IBARAKI UNIVERSITY</span>
                            </div>

                            <div className="space-y-1 mt-1">
                              <div className="w-full h-1 bg-stone-300" />
                              <div className="w-2/3 h-1 bg-stone-200" />
                            </div>
                          </div>
                        )}

                        {pdfPage === 2 && (
                          <div className="space-y-3 pt-1 text-left">
                            <span className="text-[9.5px] font-mono font-extrabold text-stone-800 tracking-wider block border-b border-stone-200 pb-1">02: 決算・会合会計報告</span>
                            
                            <div className="space-y-2 mt-2">
                              <div className="flex gap-2 justify-between">
                                <div className="w-1/3 h-7 bg-[#FCFAF7] border border-stone-200 p-1 flex flex-col justify-between">
                                  <div className="bg-stone-300 h-1 w-full" />
                                  <div className="bg-stone-200 h-2 w-2/3" />
                                </div>
                                <div className="w-2/3 h-7 bg-[#FCFAF7] border border-stone-300 p-1">
                                  <div className="bg-[#CD9535] h-1.5 w-4/5" />
                                  <div className="bg-stone-100 h-2 mt-1 w-full" />
                                </div>
                              </div>
                              <div className="w-full h-12 bg-stone-50 border border-stone-200 p-1 flex flex-col justify-between">
                                <span className="text-[7px] text-stone-400 font-mono tracking-tighter uppercase font-bold">REVENUE DISTRIBUTION</span>
                                <div className="flex gap-1">
                                  <div className="h-1.5 bg-stone-800" style={{ width: '60%' }} />
                                  <div className="h-1.5 bg-[#CD9535]" style={{ width: '30%' }} />
                                  <div className="h-1.5 bg-stone-300" style={{ width: '10%' }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {pdfPage === 3 && (
                          <div className="space-y-3 pt-1 text-left">
                            <span className="text-[9.5px] font-mono font-extrabold text-stone-800 tracking-wider block border-b border-stone-200 pb-1">03: 論文選出・学生寄稿</span>
                            
                            <div className="space-y-2">
                              <div className="w-full h-9 bg-white border border-stone-200 p-1.5 flex items-center gap-2">
                                <span className="text-[#CD9535] text-[10px] font-serif font-black">文</span>
                                <div className="flex-1 space-y-1">
                                  <div className="w-2/3 h-1 bg-stone-300" />
                                  <div className="w-4/5 h-1 bg-stone-100" />
                                </div>
                              </div>
                              
                              <div className="w-full h-11 bg-white border border-stone-200 p-1.5 flex flex-col justify-between">
                                <div className="w-full h-1 bg-stone-300" />
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div className="h-3 bg-stone-100" />
                                  <div className="h-3 bg-[#CD9535]/15" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {pdfPage === 4 && (
                          <div className="space-y-3 pt-1 text-left">
                            <span className="text-[9.5px] font-mono font-extrabold text-stone-800 tracking-wider block border-b border-stone-200 pb-1">04: 登録住所一斉更新</span>
                            
                            <div className="w-full h-15 bg-[#FCFAF7] border border-dashed border-[#CD9535]/40 p-2 flex flex-col justify-between items-center text-center">
                              <span className="text-[7.5px] font-bold text-stone-700 tracking-tighter">同窓会データベース登録管理</span>
                              <div className="bg-stone-900 text-white rounded-none w-14 h-3.5 flex items-center justify-center text-[6.5px] font-mono font-bold tracking-wide">
                                CLOUD REG
                              </div>
                              <span className="text-[6.5px] text-stone-400 font-sans">※簡単フォームは次の画面で</span>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="w-full h-1 bg-stone-300" />
                              <div className="w-5/6 h-1 bg-stone-200" />
                            </div>
                          </div>
                        )}

                        <div className="text-[7px] text-stone-400 text-center font-mono tracking-widest">
                          - NO. 42 BULLETIN REPLICA -
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
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

              {/* Bottom Footer block: Stark monochrome styling */}
              <div className="mt-6 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
                <span className="text-[10px] sm:text-[10.5px] text-stone-400 font-mono tracking-wider text-center sm:text-left">
                  * This notification will prioritize your session choices and not reappear.
                </span>
                
                <button
                  onClick={handleClose}
                  className="bg-stone-950 text-white hover:bg-[#CD9535] hover:text-stone-900 transition-all text-xs font-mono font-bold tracking-widest py-2.5 px-6 rounded-none cursor-pointer select-none"
                >
                  DISMISS
                </button>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
