import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Info, 
  CheckCircle, 
  User, 
  BookOpen, 
  Home, 
  Check, 
  Send,
  Sparkles,
  AlertTriangle,
  X
} from 'lucide-react';

interface EventRegistrationProps {
  selectedTopic?: string;
  onClearTopic?: () => void;
  onClose?: () => void;
}

export default function EventRegistration({ selectedTopic, onClearTopic, onClose }: EventRegistrationProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isIntegrated, setIsIntegrated] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    kana: '',
    gradYear: '',
    address: '',
    phone: '',
    partyStatus: 'attend', // attend (出席) or decline (欠席)
    memo: ''
  });

  useEffect(() => {
    if (selectedTopic) {
      setFormData(prev => {
        const marker = `【お申し込み対象】：${selectedTopic}`;
        if (prev.memo.includes(marker)) return prev;
        
        const cleanedMemo = prev.memo.replace(/【お申し込み対象】：.*\n?/, '').trim();
        return {
          ...prev,
          memo: `${marker}\n${cleanedMemo}`.trim()
        };
      });
    }
  }, [selectedTopic]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'お名前を入力してください';
    if (!formData.gradYear.trim()) newErrors.gradYear = '卒業年月・学部（例: 平成30年3月人文学部）を入力してください';
    if (!formData.address.trim()) newErrors.address = 'ご住所を入力してください';
    if (!formData.phone.trim()) newErrors.phone = '電話番号を入力してください';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Submit via backend API which proxies securely to the User's GAS Web App
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'サーバー連携でエラーが発生いたしました。');
      }

      setIsIntegrated(!!result.integrated);
      setFormSubmitted(true);
    } catch (error: any) {
      console.error('Registration submission error:', error);
      setSubmissionError(
        error.message || '接続に失敗しました。時間をおいてもう一度お試しいただくか、手動メール作成ボタン(アプリでメール作成する)をご利用ください。'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill mail content for generating a direct offline email draft
  const getMailtoLink = () => {
    const emailTo = 'ibadai.bj.dousou@gmail.com, oodate@salat.co.jp';
    const subject = encodeURIComponent('【第18回総会 参加申込】 ' + formData.fullName + ' 様');
    
    const bodyText = `【第18回茨城大学文理・人文学部同窓会総会 参加申込】

お名前： ${formData.fullName} (${formData.kana || '未入力'})
卒業年月・学部： ${formData.gradYear}
ご住所： ${formData.address}
電話番号： ${formData.phone}
懇親会への参加： ${formData.partyStatus === 'attend' ? '出席する（会費5,000円）' : '欠席（または総会のみ）'}
連絡事項・コメント：
${formData.memo || 'なし'}

--------------------------------------------------
茨城大学 文理・人文学部同窓会WEBサイトより作成`;

    return `mailto:${emailTo}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      kana: '',
      gradYear: '',
      address: '',
      phone: '',
      partyStatus: 'attend',
      memo: ''
    });
    setFormSubmitted(false);
    setSubmissionError(null);
  };

  return (
    <div className="fixed inset-0 bg-[#00132C]/80 backdrop-blur-md z-50 overflow-y-auto flex justify-center items-start py-8 sm:py-16 px-4">
      {/* Click outside to close */}
      <div className="fixed inset-0 cursor-default" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl border border-stone-200/80 w-full max-w-4xl min-h-[400px] overflow-hidden z-10 text-left animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 bg-[#CD9535] w-full" />
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-stone-400 hover:text-[#00204A] hover:border-stone-300 bg-stone-50 hover:bg-stone-100 p-2.5 rounded-full transition-all cursor-pointer z-30 border border-stone-200/60"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 sm:p-8 md:p-12 relative z-10">
          
          {/* =========================================================================
              SECTION HEADER
              ========================================================================= */}
          <div className="text-center mb-12">
            <div className="inline-block border-b-2 border-[#CD9535] pb-2 mb-3">
              <span className="text-[11px] sm:text-xs font-bold text-[#CD9535] uppercase tracking-[0.25em]">
                Online Attendance Form
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#00204A] tracking-wider">
              第１８回総会 参加お申し込み
            </h2>
            <p className="mt-3 text-stone-500 text-sm max-w-xl mx-auto leading-relaxed">
              令和８年７月１８日（土）開催予定の同窓会総会・講演会・懇親会へのご出席は、こちらのフォームから簡単にご登録いただけます。
            </p>
          </div>

        {/* =========================================================================
            EVENT DETAILS BANNER
            ========================================================================= */}
        <div className="bg-[#FAF9F5] border border-stone-200/60 rounded-2xl p-6 md:p-8 mb-10 shadow-xs">
          <h3 className="font-serif font-bold text-lg text-[#00204A] mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#CD9535]" />
            <span>第１８回総会 開催概要</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13.5px] leading-relaxed text-stone-700">
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <Calendar className="w-4.5 h-4.5 text-[#00204A] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-stone-900">開催期日</span>
                  <span>令和８年７月１８日（土） １３：３０ ～ １５：３０</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-[#00204A] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-stone-900">開催場所</span>
                  <span>つくば市吾妻1-1364-1　<strong>ホテル日航つくば</strong></span>
                  <span className="block text-xs text-stone-500">（TXつくば駅下車５分）</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4.5 h-4.5 text-[#00204A] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-stone-900">会場電話番号</span>
                  <span>℡. （029）852-1112</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 border-t md:border-t-0 md:border-l border-stone-200/80 pt-4 md:pt-0 md:pl-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4.5 h-4.5 text-[#CD9535] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-stone-900">懇親会のご案内</span>
                  <span>総会、講演会終了後、同会場にて懇親会を行います。</span>
                  <span className="block font-semibold text-[#00204A]">会費： ５，０００円</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50/50 border border-amber-200/50 rounded-xl p-3">
                <Info className="w-4.5 h-4.5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-900">お申し込み締め切り</span>
                  <span className="text-amber-950 font-semibold text-xs py-0.5 px-2 bg-amber-200/40 rounded inline-block mt-0.5">
                    令和８年７月７日（火）
                  </span>
                  <span className="block text-xs text-stone-500 mt-1">※準備の都合上、期日までにお知らせください。</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN INTERACTIVE STATE ENGINE
            ========================================================================= */}
        <AnimatePresence mode="wait">
          {isSubmitting ? (
            <motion.div
              key="submitting-spinner"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white border border-stone-200 rounded-2xl p-8 md:p-16 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px] shadow-sm relative overflow-hidden"
            >
              {/* Decorative gentle pulse circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-64 h-64 border border-[#CD9535]/30 rounded-full animate-ping [animation-duration:3s]" />
                <div className="absolute w-48 h-48 border border-[#00204A]/20 rounded-full animate-pulse" />
              </div>

              {/* Majestic gold/navy animated spinner */}
              <div className="relative flex items-center justify-center mb-4 z-10">
                <div className="w-16 h-16 border-4 border-stone-100 border-t-[#00204A] border-r-[#CD9535] rounded-full animate-spin" />
                <div className="absolute w-8 h-8 rounded-full bg-[#FAF9F5] border border-stone-200 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-[#CD9535]" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm relative z-10">
                <h3 className="text-lg font-serif font-bold text-[#00204A] tracking-wider animate-pulse">
                  登録手続きを実行中
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                  同窓会事務局サーバーへ情報を安全に暗号化して送信しています。そのまましばらくお待ちください。
                </p>
              </div>

              {/* Progress bar simulation */}
              <div className="w-48 h-1.5 bg-stone-100 rounded-full overflow-hidden relative z-10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#00204A] to-[#CD9535]" 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
                />
              </div>
            </motion.div>
          ) : !formSubmitted ? (
            <motion.form
              key="reg-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleSubmit}
              className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm space-y-6"
            >
              <div className="border-b border-stone-100 pb-3 mb-4">
                <span className="text-xs font-bold text-stone-400 tracking-wide">
                  ※は必須入力項目となります。
                </span>
              </div>

              {/* Grid 2-column fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full name input */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-[13px] font-bold text-[#00204A] flex items-center gap-1">
                    <span>お名前</span>
                    <span className="text-red-500 text-xs">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="伊大 太郎"
                      className={`w-full bg-stone-50 border ${
                        errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-stone-200 focus:border-amber-500'
                      } rounded-xl pl-10 pr-4 py-3 text-sm text-[#00204A] outline-none transition-all duration-200`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                </div>

                {/* Furigana input */}
                <div className="space-y-1.5">
                  <label htmlFor="kana" className="text-[13px] font-bold text-[#00204A]">
                    ふりがな
                  </label>
                  <input
                    type="text"
                    id="kana"
                    name="kana"
                    value={formData.kana}
                    onChange={handleChange}
                    placeholder="いばだい たろう"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-[#00204A] outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Graduation info input */}
              <div className="space-y-1.5">
                <label htmlFor="gradYear" className="text-[13px] font-bold text-[#00204A] flex items-center gap-1">
                  <span>ご卒業年月・出身学部学科等</span>
                  <span className="text-red-500 text-xs">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    id="gradYear"
                    name="gradYear"
                    value={formData.gradYear}
                    onChange={handleChange}
                    placeholder="例: 平成30年3月 人文学部人文学科卒"
                    className={`w-full bg-stone-50 border ${
                      errors.gradYear ? 'border-red-500 bg-red-50/20' : 'border-stone-200 focus:border-amber-500'
                    } rounded-xl pl-10 pr-4 py-3 text-sm text-[#00204A] outline-none transition-all duration-200`}
                  />
                </div>
                {errors.gradYear && <p className="text-xs text-red-500">{errors.gradYear}</p>}
              </div>

              {/* Address info and Mail Delivery */}
              <div className="space-y-1.5">
                <label htmlFor="address" className="text-[13px] font-bold text-[#00204A] flex items-center gap-1">
                  <span>ご住所（案内等の送付先）</span>
                  <span className="text-red-500 text-xs">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                    <Home className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="〒 310-8512 茨城県水戸市文京2-1-1"
                    className={`w-full bg-stone-50 border ${
                      errors.address ? 'border-red-500 bg-red-50/20' : 'border-stone-200 focus:border-amber-500'
                    } rounded-xl pl-10 pr-4 py-3 text-sm text-[#00204A] outline-none transition-all duration-200`}
                  />
                </div>
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>

              {/* Grid 2-column: Contact details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone contact */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-[13px] font-bold text-[#00204A] flex items-center gap-1">
                    <span>電話番号（当日連絡・確認用）</span>
                    <span className="text-red-500 text-xs">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="090-0000-0000"
                      className={`w-full bg-stone-50 border ${
                        errors.phone ? 'border-red-500 bg-red-50/20' : 'border-stone-200 focus:border-amber-500'
                      } rounded-xl pl-10 pr-4 py-3 text-sm text-[#00204A] outline-none transition-all duration-200`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Party (Kondankai) Attendance status dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="partyStatus" className="text-[13px] font-bold text-[#00204A]">
                    総会・講演会に続く「懇親会」への参加
                  </label>
                  <select
                    id="partyStatus"
                    name="partyStatus"
                    value={formData.partyStatus}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-[#00204A] outline-none transition-all duration-200 cursor-pointer"
                  >
                    <option value="attend">出席する （会費：5,000円）</option>
                    <option value="decline">欠席する （総会・講演会のみ参加）</option>
                  </select>
                </div>
              </div>

              {/* Remarks commentary text field */}
              <div className="space-y-1.5">
                <label htmlFor="memo" className="text-[13px] font-bold text-[#00204A]">
                  その他連絡事項・メッセージ
                </label>
                <textarea
                  id="memo"
                  name="memo"
                  value={formData.memo}
                  onChange={handleChange}
                  rows={4}
                  placeholder="恩師への想いや、メッセージ、またはご要望などがございましたら自由にご記入ください。"
                  className="w-full bg-stone-50 border border-stone-200 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-[#00204A] outline-none transition-all duration-200"
                />
              </div>

              {/* Live submission network alert notification overlay */}
              {submissionError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 leading-relaxed flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">送信エラーが発生しました</span>
                    <p>{submissionError}</p>
                    <p className="mt-1.5 text-stone-600">お手数ですが、時間をおいて再度お試しいただくか、事務局まで直接お問い合わせください。</p>
                  </div>
                </div>
              )}

              {/* Submit Buttons footer area */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch justify-end gap-3.5">
                {/* Primary Site form register submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 bg-[#00204A] hover:bg-[#031C3C] text-white text-xs font-bold py-4 px-8 rounded-full cursor-pointer transition-all disabled:opacity-75 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>登録手続き中...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>出席を登録する（WEB登録）</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            /* Successful attendance confirmation view state */
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-xs"
            >
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-emerald-950">
                  お申し込み、ありがとうございます
                </h3>
                <p className="mt-3 text-emerald-800 text-sm max-w-xl mx-auto leading-relaxed">
                  {isIntegrated ? (
                    <>
                      第１８回総会へのお申込み（出席登録）を完了いたしました。<br />
                      ご入力いただいた内容を受け付けました。
                    </>
                  ) : (
                    <>
                      第１８回総会へのお申込み（出席登録）を完了いたしました。<br />
                      さらに確実に手続きを完了・お控えを保存するため、以下の<strong>「メール送信をして手続きを完了する」</strong>ボタンから、ご自身のメールソフトを開き送信を完了されることをお勧めいたします。
                    </>
                  )}
                </p>
              </div>

              {/* Data confirmation detail drawer card preview */}
              <div className="max-w-md mx-auto bg-white border border-emerald-100 rounded-xl p-5 text-left text-xs space-y-2.5 text-stone-700 shadow-xs">
                <div className="border-b border-stone-100 pb-2 mb-2 font-bold text-stone-900 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>登録内容の確認：</span>
                </div>
                <div>お名前： <strong className="text-stone-950">{formData.fullName}</strong></div>
                <div>卒業年月等： <span className="text-stone-900">{formData.gradYear}</span></div>
                <div>ご住所： <span className="text-stone-900">{formData.address}</span></div>
                <div>電話番号： <span className="text-stone-900">{formData.phone}</span></div>
                <div>懇親会参加： <strong className="text-[#00204A]">{formData.partyStatus === 'attend' ? '出席する（会費：5千円）' : '欠席する'}</strong></div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getMailtoLink()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00204A] hover:bg-[#031C3C] text-white text-xs font-semibold py-4 px-8 rounded-full shadow-sm transition-all text-center"
                >
                  <Mail className="w-4.5 h-4.5 text-[#CD9535]" />
                  <span>メール送信をして手続きを完了する</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
  );
}
