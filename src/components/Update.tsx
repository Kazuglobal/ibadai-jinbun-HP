import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Check, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  ArrowRight,
  FileText,
  BadgeCheck,
  Building2,
  Lock
} from 'lucide-react';

export default function Update() {
  // --- FORM STATES ---
  const [name, setName] = useState('茨城 太郎');
  const [nameKana, setNameKana] = useState('イバラキ タロウ');
  const [birthdate, setBirthdate] = useState('1990/04/01');
  const [gradYear, setGradYear] = useState('2015年');
  const [department, setDepartment] = useState('人文学部 文学科');

  const [postalCode, setPostalCode] = useState('310-8512');
  const [prefecture, setPrefecture] = useState('茨城県');
  const [cityAddress, setCityAddress] = useState('水戸市文京1-5-30');
  const [building, setBuilding] = useState('例) 茨城大学◯◯寮101');

  const [phone, setPhone] = useState('090-1234-5678');
  const [email, setEmail] = useState('alumni@ibaraki.ac.jp');
  const [subscribeMail, setSubscribeMail] = useState(true);

  // Accordion state (Mobile ONLY)
  const [expandedSection, setExpandedSection] = useState<number>(1); // default expand section 1

  // Handle accordion toggle
  const toggleAccordion = (index: number) => {
    setExpandedSection(expandedSection === index ? 0 : index);
  };

  // Demo status simulation
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Automatically scroll to the success card
      const el = document.getElementById('update-success-banner');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1000);
  };

  const resetForm = () => {
    setSubmitSuccess(false);
    setExpandedSection(1);
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24 border-t border-stone-200/50" id="update-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            HEADER & BRIEF & INTERACTIVE FLOW DIAGRAM (みてわかる直感レイアウト)
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12 sm:mb-16">
          <div className="flex-1 text-left">
            {/* Elegant section heading with Gold left vertical line */}
            <div className="border-l-[3.5px] border-[#CD9535] pl-4 flex items-center h-12 mb-5" data-gsap-section-title>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#00204A] tracking-widest leading-none">
                UPDATE
              </h2>
            </div>
            
            <h3 className="text-lg sm:text-[21px] font-sans font-bold text-[#00204A] tracking-wider leading-relaxed mb-4">
              住所変更や連絡先更新を、オンラインでかんたんに。
            </h3>

            {/* Visual Process Badges - みてすぐわかる手続きステータス */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-1.5 rounded-md border border-amber-200/50 flex items-center gap-1">
                ⏱️ 所要時間：約3分
              </span>
              <span className="bg-[#E8F6F7] text-[#108A93] text-[11px] font-bold px-3 py-1.5 rounded-md border border-[#108A93]/30 flex items-center gap-1">
                📱 スマホ・PC完全対応
              </span>
            </div>

            {/* Quick Flowchart Graphic (HTML/Tailwind) - 視覚的な3ステップ図解 */}
            <div className="bg-[#FAF9F5] border border-stone-200 p-4 rounded-2xl mb-6" data-gsap-card>
              <span className="text-[10px] font-bold text-[#CD9535] tracking-widest uppercase block mb-3 font-sans">かんたん登録ステップ図解</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 max-w-xl gap-3">
                <div className="bg-white p-3 rounded-xl border border-stone-200/60 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#108A93] text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">1</div>
                  <div>
                    <h4 className="text-xs font-bold text-[#00204A]">基本 & 住所の入力</h4>
                    <p className="text-[9px] text-stone-400 mt-1">フォームに従って、新住所と連絡先をパパッと入力。</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200/60 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#108A93] text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">2</div>
                  <div>
                    <h4 className="text-xs font-bold text-[#00204A]">送信＆自動受理</h4>
                    <p className="text-[9px] text-stone-400 mt-1">送信ボタンを押して即時、手続きが完了します！</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address change pill action button */}
            <div>
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#interactive-forms-anchor"
                className="inline-flex items-center gap-3 bg-[#00204A] text-white hover:bg-[#CD9535] font-sans font-bold text-[12px] sm:text-xs py-3.5 px-8 rounded-full tracking-widest transition-colors duration-300 shadow-md"
                id="update-procedure-btn"
              >
                <span>住所変更手続きへ進む</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* =========================================================================
              STEPS TIMELINE CHART (Desktop & Tablet top-aligned)
              ========================================================================= */}
          <div className="w-full lg:w-[48%] mt-8 lg:mt-3" id="timeline-steps" data-gsap-card>
            <div className="relative grid grid-cols-4 gap-2">
              
              {/* Connecting horizontal dotted line (Underlay) */}
              <div className="absolute top-[21px] left-[12%] right-[12%] h-[1px] border-t border-dashed border-stone-200 z-0 hidden sm:block" />

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-full flex items-center justify-center font-sans font-extrabold text-xs tracking-wider transition-all duration-300 ${
                  expandedSection === 1 || submitSuccess ? 'bg-[#108A93] text-white ring-4 ring-[#108A93]/10' : 'bg-stone-100 text-[#00204A]'
                }`}>
                  01
                </div>
                <div className="mt-3.5 flex items-center justify-center p-1 bg-[#FAF9F5] rounded-full sm:bg-transparent">
                  <User className={`w-4 h-4 ${expandedSection === 1 || submitSuccess ? 'text-[#108A93]' : 'text-stone-400'}`} />
                </div>
                <h4 className="text-[11px] sm:text-[13px] font-sans font-bold text-[#00204A] tracking-wider mt-1.5 leading-none">
                  基本情報
                </h4>
                <p className="text-[8px] sm:text-[10.5px] text-stone-400 font-sans mt-1.5 leading-tight hidden xs:block">
                  氏名・生年月日など
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-full flex items-center justify-center font-sans font-extrabold text-xs tracking-wider transition-all duration-300 ${
                  expandedSection === 2 || submitSuccess ? 'bg-[#108A93] text-white ring-4 ring-[#108A93]/10' : 'bg-stone-100 text-[#00204A]'
                }`}>
                  02
                </div>
                <div className="mt-3.5 flex items-center justify-center p-1 bg-[#FAF9F5] rounded-full sm:bg-transparent">
                  <Mail className={`w-4 h-4 ${expandedSection === 2 || submitSuccess ? 'text-[#108A93]' : 'text-stone-400'}`} />
                </div>
                <h4 className="text-[11px] sm:text-[13px] font-sans font-bold text-[#00204A] tracking-wider mt-1.5 leading-none">
                  住所情報
                </h4>
                <p className="text-[8px] sm:text-[10.5px] text-stone-400 font-sans mt-1.5 leading-tight hidden xs:block">
                  現住所・送付先など
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-full flex items-center justify-center font-sans font-extrabold text-xs tracking-wider transition-all duration-300 ${
                  expandedSection === 3 || submitSuccess ? 'bg-[#108A93] text-white ring-4 ring-[#108A93]/10' : 'bg-stone-100 text-[#00204A]'
                }`}>
                  03
                </div>
                <div className="mt-3.5 flex items-center justify-center p-1 bg-[#FAF9F5] rounded-full sm:bg-transparent">
                  <Phone className={`w-4 h-4 ${expandedSection === 3 || submitSuccess ? 'text-[#108A93]' : 'text-stone-400'}`} />
                </div>
                <h4 className="text-[11px] sm:text-[13px] font-sans font-bold text-[#00204A] tracking-wider mt-1.5 leading-none">
                  連絡先
                </h4>
                <p className="text-[8px] sm:text-[10.5px] text-stone-400 font-sans mt-1.5 leading-tight hidden xs:block">
                  電話番号・メールなど
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-full flex items-center justify-center font-sans font-extrabold text-xs tracking-wider transition-all duration-300 ${
                  expandedSection === 4 || submitSuccess ? 'bg-[#108A93] text-white ring-4 ring-[#108A93]/10' : 'bg-stone-100 text-[#00204A]'
                }`}>
                  04
                </div>
                <div className="mt-3.5 flex items-center justify-center p-1 bg-[#FAF9F5] rounded-full sm:bg-transparent">
                  <BadgeCheck className={`w-4 h-4 ${expandedSection === 4 || submitSuccess ? 'text-[#108A93]' : 'text-stone-400'}`} />
                </div>
                <h4 className="text-[11px] sm:text-[13px] font-sans font-bold text-[#00204A] tracking-wider mt-1.5 leading-none">
                  確認
                </h4>
                <p className="text-[8px] sm:text-[10.5px] text-stone-400 font-sans mt-1.5 leading-tight hidden xs:block">
                  入力内容のご確認
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Anchor point to scroll to */}
        <div id="interactive-forms-anchor" className="scroll-mt-8" />

        {/* =========================================================================
            FORMS WRAPPER:
            1. MOBILE VIEW (Stacked expanded/collapsed accordions)
            2. DESKTOP VIEW (Stunning side-by-side 4-column cards mock layout)
            ========================================================================= */}
        
        {/* -------------------------------------------------------------------------
            DESKTOP VIEW: 4 Columns side-by-side with Fountain Pen on Card 4
            ------------------------------------------------------------------------- */}
        <div className="hidden lg:grid grid-cols-4 gap-4 items-stretch mb-12 relative">
          
          {/* Card 1: 基本情報の入力 */}
          <div className="bg-[#FAF9F5]/40 rounded-2xl p-5.5 border border-stone-200/60 shadow-sm flex flex-col justify-between text-left relative h-full">
            <div>
              {/* Card Header row */}
              <div className="flex items-center justify-between mb-4 border-b border-stone-200/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-full bg-[#108A93] text-white flex items-center justify-center font-sans font-bold text-[10.5px]">
                    01
                  </span>
                  <h3 className="text-[#00204A] font-serif font-bold text-sm tracking-wide">
                    基本情報の入力
                  </h3>
                </div>
                <span className="text-[11.5px] text-stone-400 font-sans">1/4</span>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-stone-200/60 h-1 rounded overflow-hidden mb-5">
                <div className="bg-[#108A93] h-full w-[25%]" />
              </div>

              {/* Input field stack */}
              <div className="space-y-4">
                {/* 1. Name */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    氏名
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-stone-200 bg-white rounded-md py-1.5 px-3 text-[12.5px] text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                  />
                </div>

                {/* 2. Name kana */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    氏名（カナ）
                  </label>
                  <input
                    type="text"
                    value={nameKana}
                    onChange={(e) => setNameKana(e.target.value)}
                    className="w-full border border-stone-200 bg-white rounded-md py-1.5 px-3 text-[12.5px] text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                  />
                </div>

                {/* 3. Birthday */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    生年月日
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                      className="w-full border border-stone-200 bg-white rounded-md py-1.5 pl-3 pr-8 text-[12.5px] text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                    />
                    <Calendar className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Graduation year */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    卒業年
                  </label>
                  <div className="relative">
                    <select
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      className="w-full border border-stone-200 bg-white rounded-md py-1.5 pl-3 pr-8 text-[12.5px] text-[#00204A] font-medium outline-none appearance-none focus:border-[#108A93]"
                    >
                      <option value="2015年">2015年</option>
                      <option value="2016年">2016年</option>
                      <option value="2017年">2017年</option>
                      <option value="2018年">2018年</option>
                      <option value="2019年">2019年</option>
                      <option value="2020年">2020年</option>
                      <option value="2021年">2021年</option>
                      <option value="2022年">2022年</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 5. Department/Major */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    学部・学科
                  </label>
                  <div className="relative">
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full border border-stone-200 bg-white rounded-md py-1.5 pl-3 pr-8 text-[12.5px] text-[#00204A] font-medium outline-none appearance-none focus:border-[#108A93]"
                    >
                      <option value="人文学部 文学科">人文学部 文学科</option>
                      <option value="人文学部 現代社会学科">人文学部 現代社会学科</option>
                      <option value="人文学部 国際文化学科">人文学部 国際文化学科</option>
                      <option value="人文学部 人文学科">人文学部 人文学科</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-[10px] text-stone-400 font-sans tracking-wide leading-tight">
              ※学籍番号をご存知の場合はご記入ください。
            </div>
          </div>

          {/* Card 2: 住所情報の入力 */}
          <div className="bg-[#FAF9F5]/40 rounded-2xl p-5.5 border border-stone-200/60 shadow-sm flex flex-col justify-between text-left relative h-full">
            <div>
              {/* Card Header row */}
              <div className="flex items-center justify-between mb-4 border-b border-stone-200/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-full bg-[#108A93] text-white flex items-center justify-center font-sans font-bold text-[10.5px]">
                    02
                  </span>
                  <h3 className="text-[#00204A] font-serif font-bold text-sm tracking-wide">
                    住所情報の入力
                  </h3>
                </div>
                <span className="text-[11.5px] text-stone-400 font-sans">2/4</span>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-stone-200/60 h-1 rounded overflow-hidden mb-5">
                <div className="bg-[#108A93] h-full w-[50%]" />
              </div>

              {/* Input field stack */}
              <div className="space-y-4">
                {/* 1. Postal Code */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    郵便番号
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full border border-stone-200 bg-white rounded-md py-1.5 px-3 text-[12.5px] text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                  />
                </div>

                {/* 2. Prefecture */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    都道府県
                  </label>
                  <div className="relative">
                    <select
                      value={prefecture}
                      onChange={(e) => setPrefecture(e.target.value)}
                      className="w-full border border-stone-200 bg-white rounded-md py-1.5 pl-3 pr-8 text-[12.5px] text-[#00204A] font-medium outline-none appearance-none focus:border-[#108A93]"
                    >
                      <option value="茨城県">茨城県</option>
                      <option value="東京都">東京都</option>
                      <option value="千葉県">千葉県</option>
                      <option value="埼玉県">埼玉県</option>
                      <option value="神奈川県">神奈川県</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Town/City/Address */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    市区町村・番地
                  </label>
                  <input
                    type="text"
                    value={cityAddress}
                    onChange={(e) => setCityAddress(e.target.value)}
                    className="w-full border border-stone-200 bg-white rounded-md py-1.5 px-3 text-[12.5px] text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                  />
                </div>

                {/* 4. Building/Room */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    建物名・部屋番号
                  </label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full border border-stone-200 bg-white rounded-md py-1.5 px-3 text-[12.5px] text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-[10px] text-[#CD9535] font-sans tracking-wide leading-tight flex items-start gap-1">
              <span>※</span>
              <span>発送先を変更される場合は送付先指定を行ってください。</span>
            </div>
          </div>

          {/* Card 3: 連絡先の入力 */}
          <div className="bg-[#FAF9F5]/40 rounded-2xl p-5.5 border border-stone-200/60 shadow-sm flex flex-col justify-between text-left relative h-full">
            <div>
              {/* Card Header row */}
              <div className="flex items-center justify-between mb-4 border-b border-stone-200/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-full bg-[#108A93] text-white flex items-center justify-center font-sans font-bold text-[10.5px]">
                    03
                  </span>
                  <h3 className="text-[#00204A] font-serif font-bold text-sm tracking-wide">
                    連絡先の入力
                  </h3>
                </div>
                <span className="text-[11.5px] text-stone-400 font-sans">3/4</span>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-stone-200/60 h-1 rounded overflow-hidden mb-5">
                <div className="bg-[#108A93] h-full w-[75%]" />
              </div>

              {/* Input field stack */}
              <div className="space-y-4">
                {/* 1. Phone number (Mobile) */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    電話番号 (携帯)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-stone-200 bg-white rounded-md py-1.5 px-3 text-[12.5px] text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                  />
                </div>

                {/* 2. Email Address */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-stone-200 bg-white rounded-md py-1.5 px-3 text-[12.5px] text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                  />
                </div>

                {/* 3. Mail Delivery Option toggle */}
                <div className="flex flex-col gap-2 pt-2.5">
                  <span className="text-[11px] font-sans font-bold text-stone-500 tracking-wider">
                    メール配信希望
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setSubscribeMail(!subscribeMail)}
                    className={`flex items-center gap-2.5 border rounded-md py-2 px-3 text-[12px] font-sans font-bold transition-all ${
                      subscribeMail 
                        ? 'border-[#108A93] bg-[#E8F6F7]/60 text-[#108A93]' 
                        : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    <span className={`w-4.5 h-4.5 rounded flex items-center justify-center transition-all ${
                      subscribeMail ? 'bg-[#108A93] text-white' : 'border border-stone-350 bg-white'
                    }`}>
                      {subscribeMail && <Check className="w-3 h-3 text-white stroke-[2.5]" />}
                    </span>
                    <span>希望する</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-[10px] text-stone-400 font-sans tracking-wide leading-tight">
              ※配信希望者の皆様に同窓会誌の送付等も優先してお知らせします。
            </div>
          </div>

          {/* Card 4: 入力内容の確認 & Diagonally Placed Fountain Pen */}
          <div className="bg-[#FAF9F5]/40 rounded-2xl p-5.5 border border-stone-200/60 shadow-sm flex flex-col justify-between text-left relative h-full overflow-hidden">
            <div>
              {/* Card Header row */}
              <div className="flex items-center justify-between mb-4 border-b border-stone-200/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-full bg-[#108A93] text-white flex items-center justify-center font-sans font-bold text-[10.5px]">
                    04
                  </span>
                  <h3 className="text-[#00204A] font-serif font-bold text-sm tracking-wide">
                    入力内容の確認
                  </h3>
                </div>
                <span className="text-[11.5px] text-stone-400 font-sans">4/4</span>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-stone-200/60 h-1 rounded overflow-hidden mb-5">
                <div className="bg-[#108A93] h-full w-[100%]" />
              </div>

              {/* Large Check Circle layout & summary */}
              <div className="relative z-10 text-center py-5">
                {/* Circle Double Outline Rings */}
                <div className="relative inline-flex items-center justify-center w-14 h-14 bg-white border-2 border-[#108A93] rounded-full shadow-sm mb-3.5">
                  <Check className="w-6 h-6 text-[#108A93] stroke-[3]" />
                </div>

                <h4 className="text-base font-serif font-bold text-[#108A93] mb-2.5">
                  完了
                </h4>
                
                <p className="text-stone-600 text-[11px] tracking-wider leading-relaxed max-w-[150px] mx-auto">
                  入力内容にお間違いがないかご確認ください。
                </p>
              </div>

              {/* Action buttons list inside desktop card 4 */}
              <div className="mt-4 relative z-10 space-y-2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-[#00132C] hover:bg-[#108A93] text-white font-sans font-bold text-[11.5px] py-2.5 px-4 rounded-md tracking-widest transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>変更を送信する</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#CD9535]" />
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetForm}
                  className="w-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 font-sans font-semibold text-[10.5px] py-2 px-3 rounded-md transition-all"
                >
                  最初からやり直す
                </button>
              </div>
            </div>

            {/* =========================================================================
                THE ELEGANT FOUNTAIN PEN ACCENT (SVG ILLUSTRATED DIAGONAL ART OVERLAY)
                ========================================================================= */}
            <div className="absolute right-[-4px] bottom-[-16px] w-[95px] h-[190px] pointer-events-none select-none z-20 origin-bottom-right transform rotate-[-8deg] hover:rotate-[-2deg] transition-transform duration-500 scale-105 hidden xl:block opacity-90">
              <svg viewBox="0 0 100 200" className="w-full h-full text-[#111111]" fill="none" xmlns="http://www.w3.org/2000/svg">
                
                {/* 3D Soft Shadow backing */}
                <path d="M43,30 L38,62 L50,62 Z" fill="#000000" opacity="0.1" filter="blur(2px)" />
                <path d="M38,62 L39,185 L50,185 L49,62 Z" fill="#000000" opacity="0.15" filter="blur(3px)" />

                {/* 1. Fountain Pen Nib */}
                {/* Gold outer nib profile */}
                <path d="M48,5 C43,15, 38,32, 38,48 L48,48 Z" fill="#E6C260" stroke="#CD9535" strokeWidth="0.5" />
                <path d="M48,5 C53,15, 58,32, 58,48 L48,48 Z" fill="#D3A93C" stroke="#CD9535" strokeWidth="0.5" />
                
                {/* Silver inner heart inlay */}
                <path d="M48,15 C45,22, 42,35, 42,48 L48,48 Z" fill="#E4E4E7" />
                <path d="M48,15 C51,22, 54,35, 54,48 L48,48 Z" fill="#C4C4C7" />
                
                {/* Breathing Hole and line slice */}
                <circle cx="48" cy="35" r="1.2" fill="#222" />
                <line x1="48" y1="5" x2="48" y2="34" stroke="#222" strokeWidth="0.7" />

                {/* 2. Plastic Feeder Ring & Grip Connection */}
                <rect x="39" y="48" width="18" height="3" fill="#D3A93C" />
                
                {/* 3. Jet Black Polished Pen Body Barrel */}
                <path d="M39.5,51 L41,180 C41,184, 55,184, 55,180 L56.5,51 Z" fill="#0a1220" />
                <path d="M48,51 L48,181" stroke="#ffffff" strokeWidth="0.6" opacity="0.25" /> {/* High contrast 3D surface glare */}

                {/* Gold bands details on pen body */}
                <rect x="40" y="55" width="16" height="2.5" fill="#E6C260" />
                <rect x="40.3" y="173" width="15.4" height="3" fill="#E6C260" />

                {/* Golden Cap Clip visible extending down */}
                <path d="M42,65 L43,125 C43,128, 41,130, 41,132 L47,132 C47,130, 45,128, 45,125 L44,65 Z" fill="url(#goldGrad)" stroke="#A9842C" strokeWidth="0.4" />
                <circle cx="44" cy="132" r="1.5" fill="#E6C260" />

                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#CD9535" />
                    <stop offset="50%" stopColor="#FFF2CC" />
                    <stop offset="100%" stopColor="#9C6B1F" />
                  </linearGradient>
                </defs>

              </svg>
            </div>

          </div>

        </div>

        {/* -------------------------------------------------------------------------
            MOBILE & TABLET VIEW: Interactive Accordion stack
            ------------------------------------------------------------------------- */}
        <div className="lg:hidden space-y-4 mb-10 text-left">
          
          {/* Form wrapper tag for active submits */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Accordion 1: 基本情報 */}
            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggleAccordion(1)}
                className="w-full py-4.5 px-5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-sans font-bold text-xs ${
                    expandedSection === 1 ? 'bg-[#108A93] text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    01
                  </span>
                  <h3 className="text-[#00204A] font-serif font-bold text-sm sm:text-base tracking-wider">
                    基本情報の入力
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-sans">1/4</span>
                  {expandedSection === 1 ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expandedSection === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-6 border-t border-stone-100 pt-5 space-y-4">
                      
                      {/* Name input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">氏名</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 px-3.5 text-sm text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                          placeholder="茨城 太郎"
                        />
                      </div>

                      {/* Name kana input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">氏名（カナ）</label>
                        <input
                          type="text"
                          value={nameKana}
                          onChange={(e) => setNameKana(e.target.value)}
                          className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 px-3.5 text-sm text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                          placeholder="イバラキ タロウ"
                        />
                      </div>

                      {/* Birthday input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">生年月日</label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                            placeholder="1990/04/01"
                          />
                          <Calendar className="w-4 h-4 text-stone-400 absolute right-3 pointer-events-none" />
                        </div>
                      </div>

                      {/* Graduation selection */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">卒業年</label>
                        <div className="relative">
                          <select
                            value={gradYear}
                            onChange={(e) => setGradYear(e.target.value)}
                            className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-[#00204A] font-medium outline-none appearance-none focus:border-[#108A93]"
                          >
                            <option value="2015年">2015年</option>
                            <option value="2016年">2016年</option>
                            <option value="2017年">2017年</option>
                            <option value="2018年">2018年</option>
                            <option value="2019年">2019年</option>
                            <option value="2020年">2020年</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Department selection */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">学部・学科</label>
                        <div className="relative">
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-[#00204A] font-medium outline-none appearance-none focus:border-[#108A93]"
                          >
                            <option value="人文学部 文学科">人文学部 文学科</option>
                            <option value="人文学部 現代社会学科">人文学部 現代社会学科</option>
                            <option value="人文学部 人文学科">人文学部 人文学科</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Next arrow inside form */}
                      <div className="pt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setExpandedSection(2)}
                          className="inline-flex items-center gap-1.5 bg-[#00204A] text-white py-2 px-5 rounded-lg font-sans text-xs font-bold"
                        >
                          <span>住所情報へ進む</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#CD9535]" />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: 住所情報 */}
            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggleAccordion(2)}
                className="w-full py-4.5 px-5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-sans font-bold text-xs ${
                    expandedSection === 2 ? 'bg-[#108A93] text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    02
                  </span>
                  <h3 className="text-[#00204A] font-serif font-bold text-sm sm:text-base tracking-wider">
                    住所情報の入力
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-sans">2/4</span>
                  {expandedSection === 2 ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expandedSection === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-6 border-t border-stone-100 pt-5 space-y-4">
                      
                      {/* Postal code */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">郵便番号</label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 px-3.5 text-sm text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                          placeholder="310-8512"
                        />
                      </div>

                      {/* Prefecture selection */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">都道府県</label>
                        <div className="relative">
                          <select
                            value={prefecture}
                            onChange={(e) => setPrefecture(e.target.value)}
                            className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-[#00204A] font-medium outline-none appearance-none focus:border-[#108A93]"
                          >
                            <option value="茨城県">茨城県</option>
                            <option value="東京都">東京都</option>
                            <option value="千葉県">千葉県</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Town/Address */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">市区町村・番地</label>
                        <input
                          type="text"
                          value={cityAddress}
                          onChange={(e) => setCityAddress(e.target.value)}
                          className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 px-3.5 text-sm text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                          placeholder="水戸市文京1-5-30"
                        />
                      </div>

                      {/* Building Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">建物名・部屋番号</label>
                        <input
                          type="text"
                          value={building}
                          onChange={(e) => setBuilding(e.target.value)}
                          className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 px-3.5 text-sm text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                          placeholder="例) 茨城大学◯◯寮101"
                        />
                      </div>

                      {/* Navigation trigger button */}
                      <div className="pt-3 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => setExpandedSection(1)}
                          className="text-stone-500 text-xs font-bold font-sans"
                        >
                          戻る
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedSection(3)}
                          className="inline-flex items-center gap-1.5 bg-[#00204A] text-white py-2 px-5 rounded-lg font-sans text-xs font-bold"
                        >
                          <span>連絡先へ進む</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#CD9535]" />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: 連絡先 */}
            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggleAccordion(3)}
                className="w-full py-4.5 px-5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-sans font-bold text-xs ${
                    expandedSection === 3 ? 'bg-[#108A93] text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    03
                  </span>
                  <h3 className="text-[#00204A] font-serif font-bold text-sm sm:text-base tracking-wider">
                    連絡先の入力
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-sans">3/4</span>
                  {expandedSection === 3 ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expandedSection === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-6 border-t border-stone-100 pt-5 space-y-4">
                      
                      {/* Phone mobile */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">電話番号 (携帯)</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 px-3.5 text-sm text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                          placeholder="090-1234-5678"
                        />
                      </div>

                      {/* Email address */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-bold text-stone-500">メールアドレス</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-stone-200/80 bg-white rounded-lg py-2.5 px-3.5 text-sm text-[#00204A] font-medium outline-none focus:border-[#108A93]"
                          placeholder="alumni@ibaraki.ac.jp"
                        />
                      </div>

                      {/* Newsletter sign option */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setSubscribeMail(!subscribeMail)}
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            subscribeMail ? 'bg-[#108A93] border-[#108A93] text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {subscribeMail && <Check className="w-3.5 h-3.5 text-currentColor stroke-[2.5]" />}
                        </button>
                        <span className="text-stone-700 text-xs font-sans font-semibold">
                          最新情報のメール配信を希望する
                        </span>
                      </div>

                      {/* Back/Next triggers */}
                      <div className="pt-3 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => setExpandedSection(2)}
                          className="text-stone-500 text-xs font-bold font-sans"
                        >
                          戻る
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedSection(4)}
                          className="inline-flex items-center gap-1.5 bg-[#00204A] text-white py-2 px-5 rounded-lg font-sans text-xs font-bold"
                        >
                          <span>確認画面へ進む</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#CD9535]" />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 4: 入力内容の確認 */}
            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggleAccordion(4)}
                className="w-full py-4.5 px-5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-sans font-bold text-xs ${
                    expandedSection === 4 ? 'bg-[#108A93] text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    04
                  </span>
                  <h3 className="text-[#00204A] font-serif font-bold text-sm sm:text-base tracking-wider">
                    入力内容の確認
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-sans">4/4</span>
                  {expandedSection === 4 ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expandedSection === 4 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-6 border-t border-stone-100 pt-5 text-left">
                      
                      {/* Summary list of client inputs */}
                      <div className="bg-[#FAF9F5]/60 rounded-xl p-4.5 space-y-3 mb-5 border border-amber-900/5 text-xs">
                        <div className="grid grid-cols-12 gap-1 pb-1.5 border-b border-stone-200/50">
                          <span className="col-span-4 text-stone-400 font-bold">氏名:</span>
                          <span className="col-span-8 text-[#00204A] font-semibold">{name || '未入力'}</span>
                        </div>
                        <div className="grid grid-cols-12 gap-1 pb-1.5 border-b border-stone-200/50">
                          <span className="col-span-4 text-stone-400 font-bold">生年月日:</span>
                          <span className="col-span-8 text-[#00204A] font-semibold">{birthdate || '未入力'}</span>
                        </div>
                        <div className="grid grid-cols-12 gap-1 pb-1.5 border-b border-stone-200/50">
                          <span className="col-span-4 text-stone-400 font-bold">学部・学科:</span>
                          <span className="col-span-8 text-[#00204A] font-semibold">{gradYear} {department}</span>
                        </div>
                        <div className="grid grid-cols-12 gap-1 pb-1.5 border-b border-stone-200/50">
                          <span className="col-span-4 text-stone-400 font-bold">郵便番号:</span>
                          <span className="col-span-8 text-[#00204A] font-semibold">{postalCode || '未入力'}</span>
                        </div>
                        <div className="grid grid-cols-12 gap-1 pb-1.5 border-b border-stone-200/50">
                          <span className="col-span-4 text-stone-400 font-bold">現住所:</span>
                          <span className="col-span-8 text-[#00204A] font-semibold">{prefecture}{cityAddress} {building}</span>
                        </div>
                        <div className="grid grid-cols-12 gap-1">
                          <span className="col-span-4 text-stone-400 font-bold font-sans">連絡手段:</span>
                          <span className="col-span-8 text-[#00204A] font-semibold font-sans">
                            {phone} / {email}
                          </span>
                        </div>
                      </div>

                      {/* Action back/submit buttons */}
                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => setExpandedSection(3)}
                          className="text-stone-500 text-xs font-bold font-sans"
                        >
                          戻る
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-1.5 bg-[#00204A] hover:bg-[#108A93] text-white py-3 px-6 rounded-lg font-sans text-xs font-bold tracking-widest shadow-sm"
                        >
                          {isSubmitting ? (
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>送信する</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#CD9535]" />
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </form>

        </div>

        {/* =========================================================================
            TRANSIENT SUCCESS COMPONENT (RESIZING POPPED CARD PRECISELY AS MOCKUP)
            ========================================================================= */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div 
              id="update-success-banner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full bg-[#E8F6F7]/60 border border-[#108A93]/20 rounded-2xl p-6 sm:p-8 text-left mb-12 flex items-stretch gap-5.5"
            >
              <div className="w-12 h-12 rounded-full bg-[#108A93] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#108A93] font-serif font-bold text-base sm:text-lg mb-1 leading-normal">
                  変更届の送信が完了しました
                </h3>
                <p className="text-[#00204A] text-xs sm:text-[13.5px] leading-relaxed tracking-wider mb-4">
                  ご入力いただいた住所・連絡先の更新情報がオンライン届出としてシステムに仮登録されました。
                  同窓会事務局にて情報確認完了しだい、本登録させていただきます。
                </p>
                <button
                  onClick={resetForm}
                  className="bg-white hover:bg-stone-50 text-stone-700 font-sans font-bold text-xs py-2 px-4.5 rounded-md border border-stone-200 transition-all cursor-pointer shadow-sm"
                >
                  新しい情報を入力する / 戻る
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
