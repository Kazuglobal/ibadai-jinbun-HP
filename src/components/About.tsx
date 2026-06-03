import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  ArrowRight, 
  CheckCircle, 
  User, 
  FileText, 
  Users, 
  BookOpen, 
  ChevronRight, 
  X, 
  Info,
  Layers,
  Sparkles,
  Mail,
  FileSpreadsheet,
  Check,
  UserPlus,
  UserMinus,
  Phone,
  MapPin,
  Building2
} from 'lucide-react';

interface AboutProps {
  onNavigate?: (view: 'home' | 'about', hash?: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'finance' | 'audit'>('business');
  const [isGreetingOpen, setIsGreetingOpen] = useState(false);
  const [isOfficersOpen, setIsOfficersOpen] = useState(false);
  const [isBylawsOpen, setIsBylawsOpen] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  // File download mock experience
  const handleDownload = (filename: string) => {
    setDownloadingFile(filename);
    setTimeout(() => {
      setDownloadingFile(null);
      alert(`「${filename}」がダウンロードされました。（※デモ用の模擬ダウンロードです）`);
    }, 1200);
  };

  const boardMembers = [
    { title: '名誉会長', name: '原口　弥生', year: '人文社会科学部長' },
    { title: '顧問', name: '土田　惣一', year: '文理・経済・１７' },
    { title: '会長', name: '大和田　一雄', year: '人文・経済・３' },
    { title: '副会長', name: '仲田　正夫', year: '文理・経済・１７' },
    { title: '副会長', name: '大畠　一芳', year: '人文・文・１' },
    { title: '副会長', name: '村上　主税', year: '人文・経済・２' },
    { title: '副会長', name: '鈴木　章史', year: '人文・経済・３' },
    { title: '副会長', name: '糟谷　政和', year: '人文・経済・５' },
    { title: '副会長', name: '川又　敏郎', year: '人文・経済・９' },
    { title: '副会長', name: '飯村　泉太郎', year: '人文・社会・１４' },
    { title: '副会長', name: '石田　奈緒子', year: '人文・人文・１４' },
    { title: '副会長', name: '矢内　結香', year: '人文・人文・２０' },
    { title: '会計監査', name: '藤田　絹代', year: '文理・経済・１３' },
    { title: '会計監査', name: '岡本　美咲', year: '人文・社会・４７' },
    { title: '幹事長（兼）', name: '鈴木　章史', year: '人文・経済・３' },
    { title: '理事兼幹事', name: '木戸　之都子', year: '人文・文・１０' },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-12 xs:py-16 lg:py-24 border-t border-stone-200/50" id="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* =========================================================================
            0. BREADCRUMBS & SECTION TITLE (Top Section)
            ========================================================================= */}
        <div className="mb-12 lg:mb-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-stone-400 text-xs sm:text-[12px] mb-6 tracking-widest font-sans font-medium">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('home');
              }}
              className="hover:text-[#CD9535] transition-colors"
            >
              HOME
            </a>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-stone-600 font-bold">同窓会について</span>
          </nav>

          {/* Hero Page Title Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-[#00204A] tracking-wider leading-tight mb-6">
                同窓会について
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed tracking-wider font-sans max-w-xl">
                茨城大学文理・人文学部同窓会の目的や活動、組織・役員、事業報告などをご紹介します。
              </p>
            </div>

            {/* Right Graphics Badge Column - EXACT REPLICATED DESIGN */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end h-[280px] select-none pointer-events-none">
              <div className="relative w-full max-w-[460px] h-full flex items-center justify-between">
                
                {/* Thin gold orbital tracking curve */}
                <div className="absolute left-[5%] top-[10%] w-[80%] h-[80%] border border-[#CD9535]/30 rounded-full z-0 opacity-80" />
                
                {/* Overlapped offset circle representing orbital motion */}
                <div className="absolute right-[22%] top-[-10%] w-[45px] h-[45px] text-[#CD9535]/40 opacity-50 z-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="6" fill="currentColor" />
                  </svg>
                </div>

                {/* Big Navy Badge: "LIBERAL ARTS & HUMANITIES" */}
                <div className="absolute left-[5%] top-[12%] w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] bg-[#00204A] rounded-full flex flex-col items-center justify-center text-center p-3 sm:p-4 shadow-xl border border-white/10 z-20">
                  <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-[0.25em] leading-normal font-sans uppercase">
                    Liberal Arts
                  </span>
                  <div className="w-8 h-[1px] bg-[#CD9535] my-2 opacity-80" />
                  <span className="text-[9px] sm:text-[10px] font-medium text-[#CD9535] tracking-[0.18em] leading-tight font-mono uppercase">
                    & Humanities
                  </span>
                </div>

                {/* Arched core photo: path and clock tower */}
                <div className="absolute right-[10%] top-[4%] w-[62%] h-[92%] rounded-t-full rounded-b-2xl overflow-hidden shadow-2xl border-4 border-white z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop"
                    alt="Ibaraki University gothic brick clock tower"
                    className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Books stacked visual element lower right */}
                <div className="absolute right-[-10px] bottom-[15px] w-[90px] h-[105px] rounded-lg overflow-hidden border border-stone-200 bg-white/90 p-2 shadow-lg z-25 flex flex-col justify-end backdrop-blur-xs">
                  <img 
                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300&auto=format&fit=crop"
                    alt="Stack of books"
                    className="w-full h-[65%] object-cover rounded-sm filter brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[8px] font-mono font-bold text-stone-500 tracking-wider uppercase text-center mt-2">
                    LITERATURE
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            01. ABOUT BY NUMBERS & ACTIVITIES (数字でみる同窓会 ＆ 目的・活動)
            ========================================================================= */}
        <div className="relative py-12 md:py-16 border-t border-stone-200/40 text-left" id="purpose-activities">
          {/* Header Title group */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-4xl sm:text-5xl font-mono font-bold text-[#CD9535]/65 leading-none">01</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider relative pb-1">
                同窓会の全貌（数字でみる ＆ 目的・活動）
                <span className="absolute bottom-0 left-0 w-12 h-[2.5px] bg-[#CD9535]" />
              </h2>
            </div>
          </div>

          {/* Infographics: Numbers board (みてすぐわかるレイアウト) */}
          <p className="text-stone-500 text-xs tracking-widest font-sans uppercase mb-4">ALUMNI ASSOCIATION BY THE NUMBERS</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-[#00204A] text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-xs text-[#CD9535] font-sans font-bold tracking-wider mb-2">同窓会員数</span>
              <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight">19,000<span className="text-xs sm:text-sm font-sans font-medium ml-1">人超</span></span>
              <span className="text-[10px] text-stone-300 font-sans mt-2">全国各地・多分野で活躍</span>
            </div>
            
            <div className="bg-[#FAF9F5] border border-stone-200/80 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-xs text-stone-500 font-sans font-bold tracking-wider mb-2">設立</span>
              <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#00204A] tracking-tight">1982<span className="text-xs sm:text-sm font-sans font-medium ml-1">年</span></span>
              <span className="text-[10px] text-stone-500 font-sans mt-2">40年を超える歴史と伝統</span>
            </div>

            <div className="bg-[#FAF9F5] border border-stone-200/80 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-xs text-stone-500 font-sans font-bold tracking-wider mb-2">総会・理事会</span>
              <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#00204A] tracking-tight">隔年/毎年</span>
              <span className="text-[10px] text-stone-500 font-sans mt-2">透明性の高い管理運営</span>
            </div>

            <div className="bg-[#FAF9F5] border border-stone-200/80 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-xs text-stone-500 font-sans font-bold tracking-wider mb-2">就職・研究支援</span>
              <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#00204A] tracking-tight">2<span className="text-xs sm:text-sm font-sans font-medium ml-1">大主軸</span></span>
              <span className="text-[10px] text-stone-500 font-sans mt-2">後輩たちの未来を応援</span>
            </div>
          </div>

          <div className="border-b border-stone-200/50 pb-6 mb-8">
            <h3 className="text-sm font-bold text-[#00204A] tracking-widest uppercase mb-2">主な活動内容のマップ</h3>
            <p className="text-stone-600 text-sm leading-relaxed max-w-3xl">
              文字を読む負担を感じさせないよう、主要な活動目的をシンプルな視覚的タイルでカード化しました。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-[#CD9535]/50 hover:shadow-xs transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#00204A]/5 text-[#CD9535] flex items-center justify-center font-bold text-sm">
                  01
                </span>
                <h4 className="font-serif font-bold text-[#00204A] text-sm">総会の開催（隔年）</h4>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                全国の同窓生が集い、事業計画などの重要事項を可決する最高決定機関です。
              </p>
            </div>

            {/* 2 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-[#CD9535]/50 hover:shadow-xs transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#00204A]/5 text-[#CD9535] flex items-center justify-center font-bold text-sm">
                  02
                </span>
                <h4 className="font-serif font-bold text-[#00204A] text-sm">理事会の推進（毎年）</h4>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                全役員・幹事が一堂に会し、年度の活動報告や適正な予算運用、方針を整備。
              </p>
            </div>

            {/* 3 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-[#CD9535]/50 hover:shadow-xs transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#00204A]/5 text-[#CD9535] flex items-center justify-center font-bold text-sm">
                  03
                </span>
                <h4 className="font-serif font-bold text-[#00204A] text-sm">定期会報の発行（年1回）</h4>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                毎年6月中旬に全会員に向けて送付。大学の近況や同窓生の今の声を届けます。
              </p>
            </div>

            {/* 4 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-[#CD9535]/50 hover:shadow-xs transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#00204A]/5 text-[#CD9535] flex items-center justify-center font-bold text-sm">
                  04
                </span>
                <h4 className="font-serif font-bold text-[#00204A] text-sm">地域連携授業への貢献</h4>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                大学で開講される「地域連携論」の講義に対し、講師派遣や財政支援を行います。
              </p>
            </div>

            {/* 5 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-[#CD9535]/50 hover:shadow-xs transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#00204A]/5 text-[#CD9535] flex items-center justify-center font-bold text-sm">
                  05
                </span>
                <h4 className="font-serif font-bold text-[#00204A] text-sm">学生懸賞論文の共同開催</h4>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                学部後援会と共催で優秀論文を表彰。在学生の学術・知的追求を支援します。
              </p>
            </div>

            {/* 6 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-[#CD9535]/50 hover:shadow-xs transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#00204A]/5 text-[#CD9535] flex items-center justify-center font-bold text-sm">
                  06
                </span>
                <h4 className="font-serif font-bold text-[#00204A] text-sm">就職活動・キャリアの伴走</h4>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                卒業生のネットワークを活かした在学生向け業界研究、OB/OG訪問の円滑化。
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            02. PRESIDENT'S GREETING (会長挨拶)
            ========================================================================= */}
        <div className="relative py-12 md:py-16 border-t border-stone-200/40" id="presidents-greeting">
          
          {/* Subtle Tower Line Sketch SVG overlay (Right absolute position, matches the design perfectly) */}
          <div className="absolute right-0 bottom-6 w-[280px] h-[340px] text-[#CD9535]/10 pointer-events-none select-none z-0 hidden lg:block">
            <svg viewBox="0 0 100 200" className="w-full h-full stroke-[#CD9535] opacity-25" fill="none">
              {/* Abstract gothic tower outline */}
              <rect x="35" y="60" width="30" height="120" strokeWidth="0.8" />
              <rect x="40" y="30" width="20" height="30" strokeWidth="0.8" />
              <line x1="50" y1="5" x2="50" y2="30" strokeWidth="0.8" />
              <polygon points="50,5 40,30 60,30" strokeWidth="0.8" />
              <circle cx="50" cy="45" r="5" strokeWidth="0.8" />
              {/* Window lines */}
              <line x1="45" y1="80" x2="45" y2="100" strokeWidth="0.5" />
              <line x1="55" y1="80" x2="55" y2="100" strokeWidth="0.5" />
              <line x1="45" y1="120" x2="45" y2="140" strokeWidth="0.5" />
              <line x1="55" y1="120" x2="55" y2="140" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
            
            {/* Left photo column (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Label */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl sm:text-5xl font-mono font-bold text-[#CD9535]/65 leading-none">02</span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider relative pb-1">
                    会長挨拶
                    <span className="absolute bottom-0 left-0 w-12 h-[2.5px] bg-[#CD9535]" />
                  </h2>
                </div>
              </div>

              {/* Portrait container holding simulated picture of Ohwada Kazuo */}
              <div className="relative group w-full max-w-[280px] aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-stone-200">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
                  alt="大和田 一雄 同窓会会長 温和なシニア男性の肖像"
                  className="w-full h-full object-cover filter brightness-[0.98] transition-all duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#00204A]/40 to-transparent opacity-40" />
              </div>
            </div>

            {/* Right text description column (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-start text-left pt-2 lg:pt-14">
              <div className="space-y-5 text-[14.5px] text-stone-700 font-sans leading-relaxed tracking-wider">
                <p>
                  令和４年１１月に開催されました第１６回総会におきまして、土田惣一会長（昭和４４年卒）の後を受けて第６代会長に選任されました、昭和４８年卒の大和田一雄です。
                </p>
                <p>
                  同窓会は、昭和５７（１９８２）年６月６日に設立されてから４０年を経過いたしました。この間19,000人を超える同窓生が、茨城県内をはじめ全国各地で活躍されております。
                </p>
              </div>

              {/* Sign and Title Block */}
              <div className="mt-8 mb-6 border-l border-stone-200 pl-4">
                <span className="text-xs text-stone-500 font-sans block mb-1">茨城大学 文理・人文学部同窓会 会長</span>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-xl font-serif font-bold text-[#00204A] tracking-widest">
                    大和田 一雄
                  </h3>
                  <span className="text-stone-500 text-xs font-sans">（昭和48年卒）</span>
                </div>
              </div>

              {/* Action Button to Open Greeting modal */}
              <button
                onClick={() => setIsGreetingOpen(true)}
                className="mt-2 self-start inline-flex items-center gap-2 bg-[#00204A] hover:bg-[#CD9535] text-white hover:text-white font-sans font-semibold text-xs py-3.5 px-6 rounded-full transition-all duration-300 shadow-md cursor-pointer"
              >
                <span>詳しい挨拶文を読む</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* =========================================================================
            03. CONSTITUTION (会則)
            ========================================================================= */}
        <div className="relative py-12 md:py-16 border-t border-stone-200/40" id="bylaws">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left informative section (7 cols) */}
            <div className="lg:col-span-7 flex flex-col text-left">
              {/* Title group */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl sm:text-5xl font-mono font-bold text-[#CD9535]/65 leading-none">03</span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider relative pb-1">
                    会則
                    <span className="absolute bottom-0 left-0 w-12 h-[2.5px] bg-[#CD9535]" />
                  </h2>
                </div>
              </div>

              {/* Description */}
              <p className="text-stone-600 text-[14.5px] leading-relaxed tracking-wider font-sans mb-8">
                同窓会の目的・事業・会員・役員・会計など、運営の基本となる会則を定めています。
              </p>

              {/* Action and Summary Info Layout Side-by-side */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <button
                    onClick={() => setIsBylawsOpen(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#00204A] hover:bg-[#CD9535] text-white font-sans font-bold text-xs py-4 px-8 rounded-full transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4.5 h-4.5 text-[#CD9535]" />
                    <span>会則の全文を表示</span>
                  </button>
                </div>

                {/* Box Panel: Detailed Constitution indexes */}
                <div className="bg-[#FAF9F5] border border-stone-200/60 rounded-2xl p-6 md:p-8">
                  <h3 className="font-serif font-bold text-sm text-[#00204A] border-b border-stone-200 pb-3 mb-4 tracking-wider">
                    会則の主な内容
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-[13px] text-stone-700 font-sans tracking-wide">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#CD9535]" />
                      <span className="font-bold text-[#00204A]">第１章 </span>
                      <span>総則</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#CD9535]" />
                      <span className="font-bold text-[#00204A]">第４章 </span>
                      <span>会議</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#CD9535]" />
                      <span className="font-bold text-[#00204A]">第２章 </span>
                      <span>会員</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#CD9535]" />
                      <span className="font-bold text-[#00204A]">第５章 </span>
                      <span>事業</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#CD9535]" />
                      <span className="font-bold text-[#00204A]">第３章 </span>
                      <span>役員および選任</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#CD9535]" />
                      <span className="font-bold text-[#00204A]">第６章 </span>
                      <span>会計 ほか</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Document Graphic Column (5 cols) */}
            <div className="lg:col-span-5 relative w-full pt-6 lg:pt-14 flex justify-center">
              <div className="relative group w-full max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop"
                  alt="Constitution fountain pen sign document"
                  className="w-full h-full object-cover filter brightness-[0.98] transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent" />
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            04. ORGANIZATION & OFFICERS (組織・役員)
            ========================================================================= */}
        <div className="relative py-12 md:py-16 border-t border-stone-200/40" id="organization-board">
          
          {/* Header Title group */}
          <div className="flex items-baseline gap-3 mb-10 text-left">
            <span className="text-4xl sm:text-5xl font-mono font-bold text-[#CD9535]/65 leading-none">04</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider relative pb-1">
                組織・役員
                <span className="absolute bottom-0 left-0 w-12 h-[2.5px] bg-[#CD9535]" />
              </h2>
            </div>
          </div>

          <div className="max-w-3xl mx-auto w-full">
            
            {/* Right: Board members listings (centered) */}
            <div className="flex flex-col text-left">
              
              {/* Flex header area holding small description and photo at top-right */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[13px] font-bold text-[#00204A] tracking-widest uppercase flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <Users className="w-4.5 h-4.5 text-[#CD9535]" />
                    <span>役員一覧</span>
                  </span>
                </div>

                {/* Overlapping small board members group image */}
                <div className="w-[100px] h-[65px] rounded-lg overflow-hidden border border-white shadow-md select-none transform rotate-2">
                  <img 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop"
                    alt="Board executives group"
                    className="w-full h-full object-cover filter brightness-[0.98]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <p className="text-stone-600 text-xs md:text-sm mb-4 leading-relaxed font-sans">
                文理・人文学部同窓会は、次の組織・役員により管理運営を行っています。
              </p>

              {/* Members listings stack container with beautiful scrollable viewport */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100 bg-white shadow-xs max-h-[360px] overflow-y-auto scrollbar-thin">
                {boardMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between px-5 py-3 hover:bg-stone-50/50 transition-colors text-sm font-sans">
                    <span className="font-bold text-[#00204A] text-[11px] py-0.5 px-2 bg-stone-100 rounded-[4px] min-w-[90px] text-center">
                      {member.title}
                    </span>
                    <div className="flex items-baseline gap-3 text-right">
                      <span className="font-bold text-stone-800">{member.name}</span>
                      <span className="text-xs text-stone-500">{member.year}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button to trigger Board Intro modal */}
              <button
                onClick={() => setIsOfficersOpen(true)}
                className="mt-6 inline-flex self-start items-center justify-center gap-2 border border-stone-300 hover:border-[#00204A] bg-white text-[#00204A] font-sans font-bold text-xs py-3.5 px-6 rounded-full transition-all cursor-pointer shadow-xs"
              >
                <span>役員紹介の詳細を見る</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>

          </div>
        </div>

        {/* =========================================================================
            05. ANNUAL REPORTS (事業報告)
            ========================================================================= */}
        <div className="relative py-12 md:py-16 border-t border-stone-200/40" id="annual-reports">
          {/* Header Title group */}
          <div className="flex items-baseline gap-3 mb-4 text-left">
            <span className="text-4xl sm:text-5xl font-mono font-bold text-[#CD9535]/65 leading-none">05</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider relative pb-1">
                事業報告
                <span className="absolute bottom-0 left-0 w-12 h-[2.5px] bg-[#CD9535]" />
              </h2>
            </div>
          </div>

          <p className="text-stone-600 text-[14.5px] leading-relaxed tracking-wider font-sans mb-10 text-left max-w-xl">
            同窓会のさまざまな活動について、事業報告書を公開しています。
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Area: Tab interface, lists downloads (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-stretch">
              
              {/* Tabs button header (Perfect replication) */}
              <div className="flex bg-stone-100 p-1 rounded-xl gap-1 mb-6" id="reports-tab-controls">
                <button
                  onClick={() => setActiveTab('business')}
                  className={`flex-1 py-3 text-center text-xs font-bold rounded-lg cursor-pointer tracking-widest transition-all ${
                    activeTab === 'business' 
                      ? 'bg-[#00204A] text-white shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  事業報告
                </button>
                <button
                  onClick={() => setActiveTab('finance')}
                  className={`flex-1 py-3 text-center text-xs font-bold rounded-lg cursor-pointer tracking-widest transition-all ${
                    activeTab === 'finance' 
                      ? 'bg-[#00204A] text-white shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  会計報告
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`flex-1 py-3 text-center text-xs font-bold rounded-lg cursor-pointer tracking-widest transition-all ${
                    activeTab === 'audit' 
                      ? 'bg-[#00204A] text-white shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  監査報告
                </button>
              </div>

              {/* Dynamic Interactive Reports listing frame */}
              <div className="space-y-3.5 text-left mb-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'business' && (
                    <motion.div
                      key="business-list"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5"
                    >
                      {/* Personal Info Policy Change Announcement */}
                      <div className="bg-amber-50/40 border border-[#CD9535]/30 rounded-2xl p-5 md:p-6 mb-6">
                        <span className="text-[10px] font-bold text-[#CD9535] tracking-widest uppercase block mb-1.5 font-sans">重要なお知らせ</span>
                        <h4 className="font-serif font-bold text-[#00204A] text-sm sm:text-base mb-3 leading-snug">
                          個人情報の取扱いに関する基本方針の改正について
                        </h4>
                        <div className="text-stone-700 text-xs sm:text-[13px] leading-relaxed tracking-wider space-y-3 font-sans">
                          <p>
                            「個人情報の保護に関する法律（略称「個人情報保護法」）平成１５年法律第１５号。平成１７年４月１日施行」に基づき、平成３０年７月１４日に「個人情報の取扱いに関する基本方針」を作成し、会員の個人情報を保有し、会員名簿を作成し、適正に管理し、活用してまいりました。
                          </p>
                          <p>
                            この度、茨城大学において、新たな取り組みとして、広く社会との繋がりをもつために、「イバダイ・サステナ・パートナーズ（略称：イバサス）」が創設されることになりました。
                          </p>
                          <p>
                            この「イバサス」は、卒業生、在学生に限らず、大学を応援したい方や企業等多くの方に入会していただき、茨城大学を広くご理解ご支援いただくことを目的としています。
                          </p>
                          <p>
                            これに伴い、大学と本同窓会を始め全学部の各同窓会との間で、「学生個人情報等の共同利用に関する覚書」を締結することになり、本同窓会は去る令和７年４月１５日付で締結いたしました。詳細は本ページ下部（06）の「法令順守」セクションに掲載しております。
                          </p>
                        </div>
                      </div>

                      {/* Header for reports */}
                      <span className="text-[11px] font-bold text-stone-400 tracking-widest uppercase block mb-3 font-sans">事業報告書 ダウンロード</span>

                      {/* Document Card 1 */}
                      <div 
                        onClick={() => handleDownload('2024年度 事業報告書.pdf')}
                        className="bg-stone-50 hover:bg-stone-100/60 border border-stone-200/80 rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Mini campus brick icon element */}
                          <div className="w-[45px] h-[45px] rounded-md overflow-hidden border border-white shadow-xs flex-shrink-0">
                            <img 
                              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=150&auto=format&fit=crop"
                              alt="Mini campus icon"
                              className="w-full h-full object-cover filter brightness-[0.98] blur-[0.3px]"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-[#00204A] text-sm group-hover:text-amber-800 transition-colors block">
                              2024年度 事業報告書
                            </span>
                            <span className="text-[11px] text-stone-400 font-sans block mt-0.5">（PDF / 2.3MB）</span>
                          </div>
                        </div>

                        <div className="p-2 border border-stone-300 group-hover:border-amber-600 rounded-sm bg-white text-stone-500 group-hover:text-amber-700 transition-all">
                          <Download className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Document Card 2 */}
                      <div 
                        onClick={() => handleDownload('2023年度 事業報告書.pdf')}
                        className="bg-stone-50 hover:bg-stone-100/60 border border-stone-200/80 rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-[45px] h-[45px] rounded-md overflow-hidden border border-white shadow-xs flex-shrink-0">
                            <img 
                              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=150&auto=format&fit=crop"
                              alt="Mini campus icon"
                              className="w-full h-full object-cover filter brightness-[0.98]"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-[#00204A] text-sm group-hover:text-amber-800 transition-colors block">
                              2023年度 事業報告書
                            </span>
                            <span className="text-[11px] text-stone-400 font-sans block mt-0.5">（PDF / 2.1MB）</span>
                          </div>
                        </div>

                        <div className="p-2 border border-stone-300 group-hover:border-amber-600 rounded-sm bg-white text-stone-500 group-hover:text-amber-700 transition-all">
                          <Download className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Document Card 3 */}
                      <div 
                        onClick={() => handleDownload('2022年度 事業報告書.pdf')}
                        className="bg-stone-50 hover:bg-stone-100/60 border border-stone-200/80 rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-[45px] h-[45px] rounded-md overflow-hidden border border-white shadow-xs flex-shrink-0">
                            <img 
                              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=150&auto=format&fit=crop"
                              alt="Mini campus icon"
                              className="w-full h-full object-cover filter brightness-[0.98]"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-[#00204A] text-sm group-hover:text-amber-800 transition-colors block">
                              2022年度 事業報告書
                            </span>
                            <span className="text-[11px] text-stone-400 font-sans block mt-0.5">（PDF / 1.9MB）</span>
                          </div>
                        </div>

                        <div className="p-2 border border-stone-300 group-hover:border-amber-600 rounded-sm bg-white text-stone-500 group-hover:text-amber-700 transition-all">
                          <Download className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'finance' && (
                    <motion.div
                      key="finance-list"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5"
                    >
                      {/* Document Card Finance */}
                      <div 
                        onClick={() => handleDownload('2024年度 決算報告書.pdf')}
                        className="bg-stone-50 hover:bg-stone-100/60 border border-stone-200/80 rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-[45px] h-[45px] bg-slate-100 rounded-md border border-white shadow-xs flex-shrink-0 flex items-center justify-center text-slate-400">
                            <FileSpreadsheet className="w-6 h-6 text-[#CD9535]" />
                          </div>
                          <div>
                            <span className="font-bold text-[#00204A] text-sm group-hover:text-amber-800 transition-colors block">
                              2024年度 会計決算報告書
                            </span>
                            <span className="text-[11px] text-stone-400 font-sans block mt-0.5">（PDF / 1.5MB）</span>
                          </div>
                        </div>

                        <div className="p-2 border border-stone-300 group-hover:border-amber-600 rounded-sm bg-white text-stone-500 group-hover:text-amber-700 transition-all">
                          <Download className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Document Card Finance 2 */}
                      <div 
                        onClick={() => handleDownload('2023年度 決算報告書.pdf')}
                        className="bg-stone-50 hover:bg-stone-100/60 border border-stone-200/80 rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-[45px] h-[45px] bg-slate-100 rounded-md border border-white shadow-xs flex-shrink-0 flex items-center justify-center text-slate-400">
                            <FileSpreadsheet className="w-6 h-6 text-[#CD9535]" />
                          </div>
                          <div>
                            <span className="font-bold text-[#00204A] text-sm group-hover:text-amber-800 transition-colors block">
                              2023年度 会計決算報告書
                            </span>
                            <span className="text-[11px] text-stone-400 font-sans block mt-0.5">（PDF / 1.4MB）</span>
                          </div>
                        </div>

                        <div className="p-2 border border-stone-300 group-hover:border-amber-600 rounded-sm bg-white text-stone-500 group-hover:text-amber-700 transition-all">
                          <Download className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'audit' && (
                    <motion.div
                      key="audit-list"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5"
                    >
                      {/* Document Card Audit */}
                      <div 
                        onClick={() => handleDownload('2024年度 監査報告書.pdf')}
                        className="bg-stone-50 hover:bg-stone-100/60 border border-stone-200/80 rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-[45px] h-[45px] bg-[#FAF9F5] rounded-md border border-white shadow-xs flex-shrink-0 flex items-center justify-center">
                            <Check className="w-6 h-6 text-emerald-600 stroke-[3]" />
                          </div>
                          <div>
                            <span className="font-bold text-[#00204A] text-sm group-hover:text-amber-800 transition-colors block">
                              2024年度 監事監査報告書
                            </span>
                            <span className="text-[11px] text-stone-400 font-sans block mt-0.5">（PDF / 850KB）</span>
                          </div>
                        </div>

                        <div className="p-2 border border-stone-300 group-hover:border-amber-600 rounded-sm bg-white text-stone-500 group-hover:text-amber-700 transition-all">
                          <Download className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Document Card Audit 2 */}
                      <div 
                        onClick={() => handleDownload('2023年度 監査報告書.pdf')}
                        className="bg-stone-50 hover:bg-stone-100/60 border border-stone-200/80 rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-[45px] h-[45px] bg-[#FAF9F5] rounded-md border border-white shadow-xs flex-shrink-0 flex items-center justify-center">
                            <Check className="w-6 h-6 text-emerald-600 stroke-[3]" />
                          </div>
                          <div>
                            <span className="font-bold text-[#00204A] text-sm group-hover:text-amber-800 transition-colors block">
                              2023年度 監事監査報告書
                            </span>
                            <span className="text-[11px] text-stone-400 font-sans block mt-0.5">（PDF / 810KB）</span>
                          </div>
                        </div>

                        <div className="p-2 border border-stone-300 group-hover:border-amber-600 rounded-sm bg-white text-stone-500 group-hover:text-amber-700 transition-all">
                          <Download className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action trigger to load more historical folders */}
              <button
                onClick={() => alert('過去20年分のアーカイブデータへの閲覧権限を付与しました。（デモ稼働）')}
                className="inline-flex self-start items-center justify-center gap-2 border border-stone-300 hover:border-[#00204A] bg-white text-[#00204A] font-sans font-bold text-xs py-3.5 px-6 rounded-full transition-all cursor-pointer shadow-xs"
              >
                <span>過去の報告書をすべて見る</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>

            </div>

            {/* Right Audit Graphic Column (5 cols) */}
            <div className="lg:col-span-5 relative w-full pt-6 lg:pt-14 flex justify-center">
              <div className="relative group w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop"
                  alt="Annual accounts reports charts with calculators"
                  className="w-full h-full object-cover filter brightness-[0.98] transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/15 to-transparent" />
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            06. MEMBERSHIP (入会・退会について)
            ========================================================================= */}
        <div className="relative py-12 md:py-16 border-t border-stone-200/40 text-left" id="membership">
          {/* Header Title group */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl sm:text-5xl font-mono font-bold text-[#CD9535]/65 leading-none">06</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider relative pb-1">
                入会・退会について
                <span className="absolute bottom-0 left-0 w-12 h-[2.5px] bg-[#CD9535]" />
              </h2>
            </div>
          </div>

          <p className="text-stone-700 text-sm sm:text-base leading-relaxed tracking-wider font-sans mb-10 max-w-3xl">
            「文理・人文学部同窓会」への入会のご案内、会員の退会、および物故会員（ご逝去）に関する届け出についてご案内いたします。
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Admission details */}
            <div className="bg-[#FAF9F5] border border-stone-200/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-3 mb-5 border-b border-stone-200/50 pb-4">
                  <div className="p-2.5 bg-[#00204A] text-[#CD9535] rounded-xl flex-shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#00204A] tracking-wider">
                    入会のご案内
                  </h3>
                </div>
                
                <div className="space-y-4 text-stone-700 text-xs sm:text-sm font-sans leading-relaxed tracking-wide">
                  <p className="indent-4">
                    令和2年度入学生から茨城大学で行う入学手続きのひとつとして、「文理・人文学部同窓会」への入会をご案内しております。
                  </p>
                  <p className="indent-4">
                    同窓会費（<strong className="text-[#00204A] font-semibold">終身会費10,000円</strong>）を入学時の学納金の納付の際に納入をいただいております。
                  </p>
                  <p className="indent-4">
                    なお、入学時の未加入者等については、<strong className="text-[#CD9535] font-bold">随時加入が可能です</strong>。ご加入を希望される方は、同窓会事務局までお問い合わせください。
                  </p>
                </div>
              </div>
            </div>

            {/* Withdrawal details */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-3 mb-5 border-b border-stone-200/50 pb-4">
                  <div className="p-2.5 bg-stone-100 text-stone-600 rounded-xl flex-shrink-0">
                    <UserMinus className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#00204A] tracking-wider">
                    退会・ご親族のご逝去について
                  </h3>
                </div>

                <div className="space-y-5 text-stone-700 text-xs sm:text-sm font-sans leading-relaxed tracking-wide">
                  <div>
                    <h4 className="font-bold text-[#00204A] mb-1.5 flex items-center gap-1.5 text-xs tracking-wider">
                      <span className="w-1.5 h-1.5 bg-[#CD9535] rounded-full inline-block" />
                      退会について
                    </h4>
                    <p className="text-stone-600 leading-relaxed text-xs sm:text-[13px] pl-3">
                      同窓会は終身会員としておりますので、特に退会を望まれる場合以外は手続きを要しません。
                      <br />
                      退会をご希望の場合は、同窓会事務局までお知らせください。
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100">
                    <h4 className="font-bold text-[#00204A] mb-1.5 flex items-center gap-1.5 text-xs tracking-wider">
                      <span className="w-1.5 h-1.5 bg-[#CD9535] rounded-full inline-block" />
                      会員が亡くなられた場合（物故連絡）
                    </h4>
                    <p className="text-stone-600 leading-relaxed text-xs sm:text-[13px] pl-3 mb-2.5">
                      会員の方が亡くなられた場合には、ご家族から、或いは、ご友人の方から、以下の情報を同窓会事務局までお知らせください。
                    </p>
                    <div className="bg-stone-50 border border-stone-200/40 p-3 sm:p-3.5 rounded-xl text-stone-600 text-xs tracking-wider font-sans grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 ml-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[#CD9535]">•</span>
                        <span>会員氏名</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[#CD9535]">•</span>
                        <span>亡くなられた日</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[#CD9535]">•</span>
                        <span>卒業学科名等</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[#CD9535]">•</span>
                        <span>卒業年度</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inline Contact Info of Secretariat */}
          <div className="bg-[#00204A] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md border border-white/5">
            <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 rounded-full border-12 border-[#CD9535]/10 pointer-events-none select-none" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 text-left">
                <span className="text-[10px] sm:text-xs font-bold text-[#CD9535] tracking-widest uppercase block mb-1">Inquiries</span>
                <h4 className="text-base sm:text-lg font-serif font-bold text-white tracking-wider flex flex-col gap-1">
                  <span>茨城大学文理・人文学部同窓会事務局</span>
                </h4>
                <p className="text-stone-300 text-xs font-sans mt-2.5 leading-relaxed">
                  入会・退会・物故報告のご連絡やご質問については、以下の同窓会事務局窓口までお知らせください。
                </p>
              </div>

              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-5 md:pt-0 md:pl-8 text-xs sm:text-sm">
                <div className="flex items-start gap-2 text-left">
                  <Phone className="w-5 h-5 text-[#CD9535] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-[#CD9535] font-sans font-bold text-[10px] tracking-widest uppercase mb-1">電話番号</span>
                    <span className="font-semibold block font-sans text-xs sm:text-[13px] leading-tight text-stone-100">
                      （029）228-8546<br />
                      090-3100-5814<span className="text-[11px] text-[#CD9535] ml-1">（鈴木）</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-left">
                  <Mail className="w-5 h-5 text-[#CD9535] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-[#CD9535] font-sans font-bold text-[10px] tracking-widest uppercase mb-1">メールアドレス</span>
                    <span className="font-semibold break-all font-mono text-[11px] sm:text-[12px] text-stone-100">ibadai.bj.dousou<br />@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-left">
                  <User className="w-5 h-5 text-[#CD9535] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-[#CD9535] font-sans font-bold text-[10px] tracking-widest uppercase mb-1">事務局所在地</span>
                    <span className="font-semibold font-sans text-xs sm:text-[11px] leading-snug block text-stone-100">
                      〒310-8512<br />
                      水戸市文京2-1-1<br />
                      茨城大学人文社会科学部内
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            07. BRANCHES (地域支部・職域支部)
            ========================================================================= */}
        <div className="relative py-12 md:py-16 border-t border-stone-200/40 text-left" id="branches">
          {/* Header Title group */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl sm:text-5xl font-mono font-bold text-[#CD9535]/65 leading-none">07</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider relative pb-1">
                地域支部・職域支部
                <span className="absolute bottom-0 left-0 w-12 h-[2.5px] bg-[#CD9535]" />
              </h2>
            </div>
          </div>

          <p className="text-stone-700 text-sm sm:text-base leading-relaxed tracking-wider font-sans mb-8 max-w-3xl">
            同窓生の皆様の各地域かつ各職場でのネットワーク強化と、学年・学科を超えた親睦を深めることを目的として、以下の支部が置かれております。<br />
            <span className="text-stone-500 text-xs sm:text-[13px] block mt-2">※支部等ホームページのリンク登録や更新、お問い合わせ等は、同窓会事務局までお知らせください。</span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 地域支部 (Regional) */}
            <div className="bg-[#FAF9F5] border border-stone-200/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-3 mb-6 border-b border-stone-200/50 pb-4">
                  <div className="p-2.5 bg-[#00204A] text-[#CD9535] rounded-xl flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#00204A] tracking-wider">
                    地域支部
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Branch 1 */}
                  <div className="border-b border-stone-200/30 pb-5 last:border-0 last:pb-0">
                    <h4 className="font-serif font-bold text-[14.5px] text-[#00204A] mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#CD9535] rounded-full inline-block" />
                      茨城大学文理・人文在京同窓会（水交会）
                    </h4>
                    <div className="pl-3 space-y-1 font-sans text-xs sm:text-[13px] text-stone-600">
                      <div><span className="font-semibold text-stone-500 mr-2">会長（敬称略）：</span>仲田正夫（文理・経済17）</div>
                    </div>
                  </div>

                  {/* Branch 2 */}
                  <div className="border-b border-stone-200/30 pb-5 last:border-0 last:pb-0">
                    <h4 className="font-serif font-bold text-[14.5px] text-[#00204A] mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#CD9535] rounded-full inline-block" />
                      茨城大学文理・人文学部県南同窓会
                    </h4>
                    <div className="pl-3 space-y-1.5 font-sans text-xs sm:text-[13px] text-stone-600">
                      <div><span className="font-semibold text-stone-500 mr-2">会長（敬称略）：</span>村上主税（人文・経済2）</div>
                      <div className="flex items-center">
                        <span className="font-semibold text-stone-500 mr-2">ホームページ：</span>
                        <a 
                          href="http://ibadai-dousoukai.holy.jp/kennan_index.htm" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#CD9535] hover:underline font-mono text-[11px] sm:text-xs font-bold"
                        >
                          http://ibadai-dousoukai.holy.jp/kennan_index.htm
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 職域支部 (Professional/Occupational) */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-3 mb-6 border-b border-stone-200/50 pb-4">
                  <div className="p-2.5 bg-stone-100 text-stone-600 rounded-xl flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#00204A] tracking-wider">
                    職域支部
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Branch 1 */}
                  <div className="border-b border-stone-200/30 pb-5 last:border-0 last:pb-0">
                    <h4 className="font-serif font-bold text-[14.5px] text-[#00204A] mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#CD9535] rounded-full inline-block" />
                      茨苑会
                    </h4>
                    <div className="pl-3 space-y-1 font-sans text-xs sm:text-[13px] text-stone-600">
                      <div><span className="font-semibold text-stone-500 mr-2">会長（敬称略）：</span>黒沢吉之（人文・社会11）</div>
                      <div><span className="font-semibold text-stone-500 mr-2">連絡先住所：</span>〒310-0021 水戸市南町2-5-5 常陽銀行本店</div>
                    </div>
                  </div>

                  {/* Branch 2 */}
                  <div className="border-b border-stone-200/30 pb-5 last:border-0 last:pb-0">
                    <h4 className="font-serif font-bold text-[14.5px] text-[#00204A] mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#CD9535] rounded-full inline-block" />
                      県信茨大同窓会
                    </h4>
                    <div className="pl-3 space-y-1 font-sans text-xs sm:text-[13px] text-stone-600">
                      <div><span className="font-semibold text-stone-500 mr-2">会長（敬称略）：</span>志賀亮一（文理・経済18）</div>
                      <div><span className="font-semibold text-stone-500 mr-2">連絡先住所：</span>〒310-0062 水戸市大町2-3-12 茨城県信用組合本店</div>
                    </div>
                  </div>

                  {/* Branch 3 */}
                  <div className="border-b border-stone-200/30 pb-5 last:border-0 last:pb-0">
                    <h4 className="font-serif font-bold text-[14.5px] text-[#00204A] mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#CD9535] rounded-full inline-block" />
                      水戸市役所茨大会
                    </h4>
                    <div className="pl-3 space-y-1 font-sans text-xs sm:text-[13px] text-stone-600">
                      <div><span className="font-semibold text-stone-500 mr-2">会長：</span>会沢俊郎</div>
                      <div><span className="font-semibold text-stone-500 mr-2">連絡先住所：</span>〒310-8610 水戸市中央1-4-1 水戸市役所</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            08. COMPLIANCE & PRIVACY (法令順守・個人情報保護方針)
            ========================================================================= */}
        <div className="relative py-12 md:py-16 border-t border-stone-200/40 text-left" id="privacy">
          {/* Header Title group */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl sm:text-5xl font-mono font-bold text-[#CD9535]/65 leading-none">08</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider relative pb-1">
                法令順守
                <span className="absolute bottom-0 left-0 w-12 h-[2.5px] bg-[#CD9535]" />
              </h2>
            </div>
          </div>

          <p className="text-stone-700 text-sm sm:text-base leading-relaxed tracking-wider font-sans mb-8 max-w-3xl">
            「個人情報の保護に関する法律（個人情報保護法）」に基づき、会員の皆様の個人情報を適正に管理し、本同窓会の目的および母校の発展に寄与する活動に活用してまいります。
          </p>

          <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif font-bold text-base text-[#00204A] border-b border-stone-200/80 pb-2.5 mb-3.5 tracking-wider">
                個人情報の取扱いに関する基本方針
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed tracking-wider font-sans">
                当会では、平成30年7月14日に「個人情報の取扱いに関する基本方針」を定め、適正な維持管理に努めてきました。
                令和7年度より開始される茨城大学の新取り組み「イバダイ・サステナ・パートナーズ（イバサス）」の創設に伴い、全学各同窓会が大学との間で「学生個人情報等の共同利用に関する覚書」を締結しました。本同窓会におきましては、令和7年4月15日付で本覚書を正式に締結し、緊密かつ安全な連携のもとで、卒業生等への有益な案内と支援体制を拡張してまいります。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-white border border-stone-200/50 rounded-xl p-5 shadow-xs">
                <h4 className="font-serif font-bold text-sm text-[#00204A] mb-2">① 共同利用の目的</h4>
                <p className="text-stone-600 text-[12.5px] leading-relaxed">
                  大学を応援する「イバサス」による茨城大学の支援活動、同窓会会員名簿の適正な維持、会員相互の各種連絡・親睦・学術研究支援等の推進。
                </p>
              </div>

              <div className="bg-white border border-stone-200/50 rounded-xl p-5 shadow-xs">
                <h4 className="font-serif font-bold text-sm text-[#00204A] mb-2">② 共同利用する情報の範囲</h4>
                <p className="text-stone-600 text-[12.5px] leading-relaxed">
                  氏名、生年月日、卒業年次、学部、学科、所属（研究科）、現住所、連絡先電話番号・メールアドレス等、活動目的遂行上不可欠な情報。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM CONTACT BANNER (お問い合せバナー)
            ========================================================================= */}
        <div className="mt-12 md:mt-16 bg-[#FAF9F5] border border-[#CD9535]/25 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-left relative z-10">
          <div className="flex items-center gap-4">
            
            {/* Letter Envelope Gold Icon bubble */}
            <div className="w-12 h-12 rounded-xl bg-[#CD9535] text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>

            <div>
              <p className="text-[#00204A] font-sans font-bold text-[14.5px] tracking-wider leading-relaxed">
                ご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
            </div>

          </div>

          <a
            href="#contact"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#00204A] hover:bg-[#031C3C] text-white text-xs font-bold py-4 px-8 rounded-full transition-all tracking-widest shadow-sm text-center"
          >
            <span>お問い合わせフォームへ</span>
            <ArrowRight className="w-4 h-4 text-[#CD9535]" />
          </a>
        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE GREETING MODAL DIALOG
          ========================================================================= */}
      <AnimatePresence>
        {isGreetingOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop cover overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGreetingOpen(false)}
              className="absolute inset-0 bg-stone-900"
            />
            
            {/* Modal Body card */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white border border-stone-200 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative z-11 flex flex-col p-6 sm:p-8 md:p-10 text-left scrollbar-thin"
            >
              {/* Top sticky X button */}
              <button 
                onClick={() => setIsGreetingOpen(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title group */}
              <div className="border-b border-stone-100 pb-4 mb-6">
                <span className="text-[10px] font-bold text-[#CD9535] tracking-widest uppercase block mb-1">PRESIDENT MESSAGES</span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider leading-relaxed">
                  茨城大学 文理・人文学部同窓会 会長就任に寄せて
                </h3>
              </div>

              {/* Comprehensive expanded text */}
              <div className="space-y-4.5 text-stone-700 text-sm sm:text-[14.5px] leading-relaxed tracking-wider font-sans pr-1">
                <p>
                  令和４年１１月に開催されました第１６回総会におきまして、土田惣一会長（昭和４４年卒）の後を受けて第６代会長に選任されました、昭和４８年卒の大和田一雄です。
                </p>
                <p>
                  同窓会は、昭和５７（１９８２）年６月６日に設立されてから４０年を経過いたしました。この間19,000人を超える同窓生が、県内はじめ全国各地で活躍されております。また、茨城大学におきましても、「イバダイ・ビジョン2030（２０２１年３月公表）」等で、「卒業生とさらに連携協力する大学をめざして」とし、「地域ステークホルダーとともに創る教育・教育改革推進体制の強化」、「分野横断型の教育組織の構築」及び「地域課題・ニーズを踏まえた産学官連携の強化」を目標に、各同窓会と連携・協力をさらに深めて、持続可能な社会づくりに貢献する大学の存在感を高めていこうとしております。
                </p>
                <p>
                  このような中、本同窓会事業としまして、大学及び地域の関係機関に協力していただき、「地域連携論」の講座及びシンポジウムの開講や学部並びに学部後援会との共催で、「学生懸賞論文」の募集、表彰などを行って、大学・学生と地域社会の結びつきを強め、在学生の存在感を発揮できるよう取り組んでおります。
                </p>
                <p>
                  同窓会は、学び、遊び合った先輩と後輩が旧交を温めるとともに、忌憚のない対話から絆を強めていけるものです。このような中からも自己研鑽を積み、新たな活力を得られるものであります。
                </p>
                <p>
                  役員、理事、幹事はじめ同窓会会員の皆様方のご指導、ご協力を得まして、同窓会活動を進めて参りたいと考えておりますので、なお一層のご支援をお願い申し上げ、ご挨拶といたします。
                </p>
              </div>

              {/* Signing metadata */}
              <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 font-sans block mb-0.5">茨城大学 文理・人文学部同窓会 会長</span>
                  <span className="text-base font-serif font-bold text-[#00204A] tracking-wider">大和田 一雄 <span className="text-xs text-stone-500 font-sans font-medium">（昭和48年卒）</span></span>
                </div>

                <button
                  onClick={() => setIsGreetingOpen(false)}
                  className="bg-[#00204A] hover:bg-[#031C3C] text-white font-sans font-semibold text-xs py-2.5 px-5 rounded-lg cursor-pointer transition-all"
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          INTERACTIVE OFFICERS DETAIL MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isOfficersOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOfficersOpen(false)}
              className="absolute inset-0 bg-stone-900"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white border border-stone-200 rounded-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl relative z-11 flex flex-col p-6 sm:p-8"
            >
              <button 
                onClick={() => setIsOfficersOpen(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-stone-100 pb-3 mb-5 text-left">
                <span className="text-[10px] font-bold text-[#CD9535] tracking-widest uppercase block mb-1">OFFICERS SUMMARY</span>
                <h3 className="text-lg font-serif font-bold text-[#00204A] tracking-wider">
                  ２０２５年度 役員会体制・活動方針
                </h3>
              </div>

              <div className="space-y-4 text-stone-700 text-[13px] sm:text-sm leading-relaxed tracking-wider font-sans text-left">
                <p>
                  当同窓会は、総会を最高意思決定機関とし、日常的な執行業務は理事会において協議・展開されています。
                </p>
                <p>
                  各専門部会は、同窓会報の発行を担う<strong>「広報部会」</strong>、年次行事・各種交流イベントの催行を担当する<strong>「事業部会」</strong>、現役学生の就職や未来をサポートする<strong>「キャリア支援部会」</strong>など、機動的かつ円滑な学生活動補助を目指して鋭意活動しています。
                </p>
                <p>
                  また、財務健全性を確保するための専門的な<strong>「会計部会」</strong>および監事による<strong>「監査（監事体制）」</strong>により、透明性の高い同窓会事業運営を実施しております。
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => setIsOfficersOpen(false)}
                  className="bg-[#00204A] hover:bg-[#031C3C] text-white font-sans font-semibold text-xs py-2.5 px-6 rounded-lg cursor-pointer transition-all"
                >
                  確認して閉じる
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          INTERACTIVE BYLAWS DETAIL MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isBylawsOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBylawsOpen(false)}
              className="absolute inset-0 bg-stone-900"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white border border-stone-200 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl relative z-11 flex flex-col p-6 sm:p-8 md:p-10 text-left scrollbar-thin"
            >
              <button 
                onClick={() => setIsBylawsOpen(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b-2 border-[#CD9535] pb-4 mb-6 text-center">
                <span className="text-[10px] font-bold text-[#CD9535] tracking-widest uppercase block mb-1">ALUMNI CONSTITUTION</span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider leading-relaxed">
                  茨城大学文理・人文学部同窓会会則
                </h3>
              </div>

              <div className="space-y-6 text-stone-700 text-sm leading-relaxed tracking-wider font-sans text-left pr-1">
                
                {/* Chapter 1 */}
                <div>
                  <h4 className="font-serif font-bold text-base text-[#00204A] border-b border-stone-200 pb-1 mb-2.5">
                    第１章　総則
                  </h4>
                  <ul className="space-y-2 pl-1">
                    <li><strong className="text-[#00204A]">第１条</strong> 本会は、茨城大学文理・人文学部同窓会と称し、事務所を同大学人文社会科学部内に置く。</li>
                    <li><strong className="text-[#00204A]">第２条</strong> 本会は、会員相互の連絡と親睦を図り、学術研究と母校の発展に寄与することを目的とする。</li>
                    <li>
                      <strong className="text-[#00204A]">第３条</strong> 本会は、前条の目的を達成するために次の事業を行う。
                      <ul className="pl-5 mt-1 space-y-1 list-none">
                        <li>(1) 会員名簿及び会誌の発行</li>
                        <li>(2) その他本会の目的を達成するために必要な事業</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                {/* Chapter 2 */}
                <div>
                  <h4 className="font-serif font-bold text-base text-[#00204A] border-b border-stone-200 pb-1 mb-2.5">
                    第２章　会員
                  </h4>
                  <ul className="space-y-2 pl-1">
                    <li>
                      <strong className="text-[#00204A]">第４条</strong> 本会の会員は会員及び特別会員からなり、それぞれ次のとおりとする。
                      <ul className="pl-5 mt-1 space-y-1.5 list-none">
                        <li><strong className="text-[#00204A] text-xs">(1) 会員</strong> 茨城大学文理学部（理学科を除く）、人文学部及び人文社会科学部の卒業生、人文社会科学研究科の修了生及びこれに準ずる者並びに人文社会科学部学生及び人文社会科学研究科生。</li>
                        <li><strong className="text-[#00204A] text-xs">(2) 特別会員</strong> 茨城大学人文社会科学部の専任教官、これに準ずる者、同大学文理学部（理学科を除く）、人文学部及び人文社会科学部に専任教官として在職した者。</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                {/* Chapter 3 */}
                <div>
                  <h4 className="font-serif font-bold text-base text-[#00204A] border-b border-stone-200 pb-1 mb-2.5">
                    第３章　役員
                  </h4>
                  <ul className="space-y-2 pl-1">
                    <li>
                      <strong className="text-[#00204A]">第５条</strong> 本会に次の役員を置く。
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-5 mt-1.5 mb-2.5 text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                        <div>(1) 会長　１ 名</div>
                        <div>(2) 副会長　若干名</div>
                        <div>(3) 理事　各卒業年度各学科ごと若干名</div>
                        <div>(4) 会計監査　２名</div>
                        <div>(5) 幹事長　１名</div>
                        <div>(6) 幹事　若干名</div>
                      </div>
                    </li>
                    <li><strong className="text-[#00204A]">第６条</strong> 会長、副会長、理事及び会計監査は総会において正会員の中から選出する。</li>
                    <li className="pl-5 list-decimal list-inside">幹事長は、幹事の互選による。</li>
                    <li className="pl-5 list-decimal list-inside">役員の任期は、総会から次期総会（臨時総会を除く。以下同じ）までとし、再任は妨げない。</li>
                    <li className="pl-5 list-decimal list-inside">役員に欠員が生じた場合は、理事会で選出することができる。なお、補欠によって選任された役員の任期は前任者の残任期間とする。</li>
                    <li><strong className="text-[#00204A]">第７条</strong> 会長は、本会を代表し、会務を総轄する。</li>
                    <li className="pl-5 list-decimal list-inside">副会長は、会長を補佐し、会長に事故あるときはその職務を代行する。</li>
                    <li className="pl-5 list-decimal list-inside">理事は、理事会を構成し、本会の重要事項を審議する。</li>
                    <li className="pl-5 list-decimal list-inside">会計監査は、会計を監査し、その結果を総会に報告する。</li>
                    <li className="pl-5 list-decimal list-inside">幹事長は、本会の日常の業務執行を統括する。</li>
                    <li className="pl-5 list-decimal list-inside">幹事は共同して本会の日常の業務を処理する。</li>
                  </ul>
                </div>

                {/* Chapter 4 */}
                <div>
                  <h4 className="font-serif font-bold text-base text-[#00204A] border-b border-stone-200 pb-1 mb-2.5">
                    第４章　名誉会長及び顧問
                  </h4>
                  <ul className="space-y-2 pl-1">
                    <li><strong className="text-[#00204A]">第８条</strong> 本会に名誉会長及び顧問を置く。名誉会長は現に茨城大学人文社会科学部長の職にある者とする。顧問には特に本会に功労のあった会員を理事会の議を経て委嘱する。</li>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-5 mt-1.5 text-xs bg-stone-50 p-2 rounded-lg border border-stone-100">
                      <div>(1) 名誉会長　１名</div>
                      <div>(2) 顧問　若干名</div>
                    </div>
                  </ul>
                </div>

                {/* Chapter 5 */}
                <div>
                  <h4 className="font-serif font-bold text-base text-[#00204A] border-b border-stone-200 pb-1 mb-2.5">
                    第５章　会議及び会務
                  </h4>
                  <ul className="space-y-2 pl-1">
                    <li><strong className="text-[#00204A]">第９条</strong> 総会は二年ごとに１回開催する。ただし、会長が必要と認めるとき、又は理事の過半数の要求があったときは、臨時に総会を開催することができる。</li>
                    <li>
                      <strong className="text-[#00204A]">第１０条</strong> 総会は次の各号に掲げる事項を審議する。
                      <ul className="pl-5 mt-1 space-y-1 list-none">
                        <li>(1) 会務の報告</li>
                        <li>(2) 予算及び決算の承認</li>
                        <li>(3) 会長・副会長・理事及び会計監査の選出</li>
                        <li>(4) 会則の改廃</li>
                        <li>(5) 事業内容の承認</li>
                        <li>(6) その他重要な事項</li>
                      </ul>
                    </li>
                    <li className="pl-5 list-decimal list-inside">総会の議事は出席者の過半数をもって決する。</li>
                    <li><strong className="text-[#00204A]">第１１条</strong> 会長は理事会を招集し、その議長となる。</li>
                    <li className="pl-5 list-decimal list-inside">理事会は毎年１回開催する。ただし、会長が必要と認めるときは臨時に理事会を開催することができる。</li>
                    <li className="pl-5 list-decimal list-inside">理事会の議事は出席者の過半数をもって決し、可否同数のときは、議長の決するところによる。</li>
                    <li className="pl-5 list-decimal list-inside">議長は必要に応じて、理事会構成員以外の者の出席を求め、意見の交流をはかることができる。</li>
                    <li><strong className="text-[#00204A]">第１２条</strong> 幹事会は幹事及び幹事長より構成され、本会の日常の業務を処理する。</li>
                    <li className="pl-5 list-decimal list-inside">幹事長は幹事会を招集して、その座長となると共に、常に本会の日常の業務執行状況の把握に努め、適宜、会長に本会の日常の業務執行状況を報告し、必要な指示を受けなければならない。</li>
                  </ul>
                </div>

                {/* Chapter 6 */}
                <div>
                  <h4 className="font-serif font-bold text-base text-[#00204A] border-b border-stone-200 pb-1 mb-2.5">
                    第６章　会計
                  </h4>
                  <ul className="space-y-2 pl-1">
                    <li><strong className="text-[#00204A]">第１３条</strong> 本会の運営は、終身会費、寄付金及びその他の収入によってまかない、幹事会がその経理に当たる。</li>
                    <li><strong className="text-[#00204A]">第１４条</strong> 本会の会員は、終身会費１口（10,000円）以上を納入する。ただし、会員名簿の発行は別途会計で処理する。一旦納入された会費は返還しない。</li>
                    <li><strong className="text-[#00204A]">第１５条</strong> 本会の会計年度は、毎年６月１日より翌年５月３１日までとし、その決算は毎年理事会に報告するものとする。各年度における決算は総会において承認を得るものとする。</li>
                  </ul>
                </div>

                {/* Chapter 7 */}
                <div>
                  <h4 className="font-serif font-bold text-base text-[#00204A] border-b border-stone-200 pb-1 mb-2.5">
                    第７章　雑則
                  </h4>
                  <ul className="space-y-2 pl-1">
                    <li><strong className="text-[#00204A]">第１６条</strong> この会則の改正は、理事会の議を経て総会で決定する。</li>
                    <li>
                      <strong className="text-[#00204A]">第１７条</strong> 本会に支部を置くことができる。
                      <ul className="pl-5 mt-1 space-y-1 list-none">
                        <li>２ 支部規約は、それぞれの支部において別に定めることができる。</li>
                      </ul>
                    </li>
                    <li><strong className="text-[#00204A]">第１８条</strong> この会則に定めるもののほか、本会の運営に関し、必要な事項は幹事会がこれを定める。</li>
                  </ul>
                </div>

                {/* Appended dates */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/50 mt-6 prose prose-stone max-w-none text-xs text-stone-500">
                  <h5 className="font-bold text-stone-600 mb-1.5">付則</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    <div>• 昭和５７年６月６日から実施</div>
                    <div>• 昭和６１年６月７日から施行</div>
                    <div>• 平成７年１月１日から施行</div>
                    <div>• 平成１０年６月２０日から施行</div>
                    <div>• 平成１４年７月６日から施行</div>
                    <div>• 平成２０年７月５日から施行</div>
                    <div>• 平成３０年７月１４日から施行</div>
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-5 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => setIsBylawsOpen(false)}
                  className="bg-[#00204A] hover:bg-[#031C3C] text-white font-sans font-semibold text-xs py-2.5 px-6 rounded-lg cursor-pointer transition-all"
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
