import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  ImagePlus,
  Instagram,
  Linkedin,
  LoaderCircle,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

type InterviewAnswer = {
  question: string;
  answer: string;
};

type UploadedPhoto = {
  name: string;
  type: string;
  dataUrl: string;
};

interface StoryInterviewApplicationProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTERVIEW_QUESTION_COUNT = 5;
const EMPTY_PROFILE = {
  name: '',
  email: '',
  gradYear: '',
  major: '',
  affiliation: '',
  category: '教育・行政',
};
const EMPTY_LINKS = {
  website: '',
  linkedin: '',
  instagram: '',
  facebook: '',
  x: '',
};

const categories = [
  '教育・行政',
  'メディア・出版・広告',
  '金融・コンサルティング',
  'IT・通信',
  'メーカー・製造',
  'サービス・小売',
  'その他',
];

const fieldClass =
  'w-full rounded-lg border border-stone-200 bg-[#FAF9F5] px-3 py-2.5 text-sm text-[#00204A] outline-none transition focus:border-[#CD9535] focus:ring-2 focus:ring-[#CD9535]/10';

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('画像を読み込めませんでした。'));
    reader.onerror = () => reject(new Error('画像を読み込めませんでした。'));
    reader.readAsDataURL(file);
  });
}

export default function StoryInterviewApplication({ isOpen, onClose }: StoryInterviewApplicationProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [interview, setInterview] = useState<InterviewAnswer[]>([]);
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [links, setLinks] = useState(EMPTY_LINKS);
  const [hasBenefit, setHasBenefit] = useState(false);
  const [benefit, setBenefit] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const profileReady = Boolean(
    profile.name.trim() &&
      profile.email.trim() &&
      profile.gradYear.trim() &&
      profile.major.trim() &&
      profile.affiliation.trim(),
  );
  const interviewComplete = interview.length >= INTERVIEW_QUESTION_COUNT;
  const progress = useMemo(() => Math.min(100, (interview.length / INTERVIEW_QUESTION_COUNT) * 100), [interview]);

  const resetAndClose = () => {
    setStep(0);
    setProfile(EMPTY_PROFILE);
    setCurrentQuestion('');
    setAnswer('');
    setInterview([]);
    setPhotos([]);
    setLinks(EMPTY_LINKS);
    setHasBenefit(false);
    setBenefit('');
    setConsent(false);
    setError('');
    setSubmitted(false);
    onClose();
  };

  const requestInterviewQuestion = async (answers: InterviewAnswer[]) => {
    const response = await fetch('/api/stories/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, interview: answers }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        response.status === 503
          ? '現在インタビューを利用できません。時間をおいてもう一度お試しください。'
          : '次の質問を取得できませんでした。もう一度お試しください。',
      );
    }
    if (!data.question) {
      throw new Error('有効な質問を取得できませんでした。');
    }
    return String(data.question);
  };

  const startInterview = async () => {
    if (!profileReady || isInterviewLoading) return;
    setIsInterviewLoading(true);
    setError('');
    setInterview([]);
    setAnswer('');
    setCurrentQuestion('');
    try {
      const question = await requestInterviewQuestion([]);
      setCurrentQuestion(question);
      setStep(1);
    } catch (requestError: any) {
      setError(requestError.message || 'インタビューを開始できませんでした。');
    } finally {
      setIsInterviewLoading(false);
    }
  };

  const handlePhotos = async (files: FileList | null) => {
    if (!files) return;
    setError('');
    const remaining = Math.max(0, 3 - photos.length);
    const selected = Array.from(files).slice(0, remaining);

    if (selected.some((file) => !file.type.startsWith('image/') || file.size > 2 * 1024 * 1024)) {
      setError('写真はJPG・PNG・WEBP形式、1枚2MB以下で選択してください。');
      return;
    }

    const converted = await Promise.all(
      selected.map(async (file) => ({
        name: file.name,
        type: file.type,
        dataUrl: await fileToDataUrl(file),
      })),
    );
    setPhotos((current) => [...current, ...converted].slice(0, 3));
  };

  const submitInterviewAnswer = async () => {
    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer || isInterviewLoading) return;

    const updatedInterview = [...interview, { question: currentQuestion, answer: trimmedAnswer }];
    setError('');

    if (updatedInterview.length >= INTERVIEW_QUESTION_COUNT) {
      setInterview(updatedInterview);
      setAnswer('');
      if (!/^(なし|ありません|特になし)/.test(trimmedAnswer)) {
        setHasBenefit(true);
        setBenefit(trimmedAnswer);
      }
      return;
    }

    setIsInterviewLoading(true);
    try {
      const question = await requestInterviewQuestion(updatedInterview);
      setInterview(updatedInterview);
      setAnswer('');
      setCurrentQuestion(question);
    } catch (requestError: any) {
      setError(requestError.message || '次の質問を取得できませんでした。');
    } finally {
      setIsInterviewLoading(false);
    }
  };

  const submitApplication = async () => {
    if (!consent || isSubmitting) return;
    if (hasBenefit && !benefit.trim()) {
      setError('同窓生特典の内容を入力してください。');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/stories/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          interview,
          photos,
          links,
          benefit: hasBenefit ? benefit : '',
          agreedToReviewTerms: consent,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '申請を送信できませんでした。');
      setSubmitted(true);
    } catch (requestError: any) {
      setError(requestError.message || '申請を送信できませんでした。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="story-application-title">
          <motion.button
            type="button"
            aria-label="申請画面を閉じる"
            className="fixed inset-0 h-full w-full bg-[#001025]/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
          />

          <div className="flex min-h-full items-center justify-center p-2 sm:p-5">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="relative z-10 flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl"
            >
              <header className="flex items-start justify-between gap-4 border-b border-stone-200 bg-[#00204A] px-5 py-4 text-white sm:px-7">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#E7BB62]">ALUMNI STORIES</p>
                  <h2 id="story-application-title" className="mt-1 font-serif text-xl font-bold sm:text-2xl">
                    オンラインインタビューで掲載を申し込む
                  </h2>
                </div>
                <button type="button" onClick={resetAndClose} className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="閉じる">
                  <X className="h-5 w-5" />
                </button>
              </header>

              <div className="border-b border-stone-200 bg-[#FAF9F5] px-5 py-3 sm:px-7">
                <div className="flex items-center gap-2 text-[10px] font-bold text-stone-500 sm:text-xs">
                  {['基本情報', 'インタビュー', '写真・SNS・特典'].map((label, index) => (
                    <React.Fragment key={label}>
                      {index > 0 && <span className="h-px flex-1 bg-stone-300" />}
                      <span className={step === index ? 'text-[#B57A24]' : step > index ? 'text-[#00204A]' : ''}>
                        {step > index ? '✓ ' : ''}{label}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-7">
                {submitted ? (
                  <div className="mx-auto max-w-lg py-8 text-center">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check className="h-8 w-8" />
                    </span>
                    <h3 className="mt-5 font-serif text-2xl font-bold text-[#00204A]">申請を受け付けました</h3>
                    <p className="mt-3 text-sm leading-7 text-stone-600">
                      回答内容を読みやすく整えたうえで、同窓会事務局が確認します。
                    </p>
                    <div className="mt-5 border border-amber-200 bg-amber-50 px-4 py-3 text-left text-xs leading-6 text-amber-900">
                      申請内容や掲載基準によっては、STORIESへ反映されない場合があります。
                    </div>
                    <button type="button" onClick={resetAndClose} className="mt-7 bg-[#00204A] px-7 py-3 text-sm font-bold text-white">
                      閉じる
                    </button>
                  </div>
                ) : step === 0 ? (
                  <div className="space-y-5">
                    <div className="border-l-4 border-[#CD9535] bg-amber-50/60 px-4 py-3 text-xs leading-6 text-stone-700">
                      現在表示中のSTORIESは掲載イメージのサンプルです。実際の同窓生ストーリーは、申請内容を事務局が確認した後に掲載します。
                      <strong className="block text-amber-900">内容によっては反映されない場合があります。</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs text-stone-600">
                      <div className="border border-stone-200 bg-[#FAF9F5] p-3">
                        <ImagePlus className="mb-2 h-5 w-5 text-[#CD9535]" />
                        <strong className="block text-[#00204A]">写真を最大3枚</strong>
                        インタビュー後にプロフィールや活動写真を追加できます。
                      </div>
                      <div className="border border-stone-200 bg-[#FAF9F5] p-3">
                        <Globe className="mb-2 h-5 w-5 text-[#CD9535]" />
                        <strong className="block text-[#00204A]">HP・SNSを掲載</strong>
                        ホームページや各SNSのリンクを追加できます。
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="text-xs font-bold text-[#00204A]">お名前・掲載名 *
                        <input className={`${fieldClass} mt-1.5`} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="例：茨大 太郎 / I.Tさん" />
                      </label>
                      <label className="text-xs font-bold text-[#00204A]">連絡用メールアドレス *
                        <input type="email" className={`${fieldClass} mt-1.5`} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="確認連絡にのみ使用します" />
                      </label>
                      <label className="text-xs font-bold text-[#00204A]">卒業年 *
                        <input className={`${fieldClass} mt-1.5`} value={profile.gradYear} onChange={(e) => setProfile({ ...profile, gradYear: e.target.value })} placeholder="例：2005年卒" />
                      </label>
                      <label className="text-xs font-bold text-[#00204A]">学部・学科・専攻 *
                        <input className={`${fieldClass} mt-1.5`} value={profile.major} onChange={(e) => setProfile({ ...profile, major: e.target.value })} placeholder="例：人文学科 社会科学専攻" />
                      </label>
                      <label className="text-xs font-bold text-[#00204A] sm:col-span-2">現在の所属・活動 *
                        <input className={`${fieldClass} mt-1.5`} value={profile.affiliation} onChange={(e) => setProfile({ ...profile, affiliation: e.target.value })} placeholder="会社・団体・地域活動など" />
                      </label>
                      <label className="text-xs font-bold text-[#00204A] sm:col-span-2">活動分野
                        <select className={`${fieldClass} mt-1.5`} value={profile.category} onChange={(e) => setProfile({ ...profile, category: e.target.value })}>
                          {categories.map((category) => <option key={category}>{category}</option>)}
                        </select>
                      </label>
                    </div>
                  </div>
                ) : step === 1 ? (
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00204A] text-[#E7BB62]"><MessageSquareText className="h-5 w-5" /></span>
                      <div>
                        <p className="text-sm font-bold text-[#00204A]">STORIES インタビュー</p>
                        <p className="text-[11px] text-stone-500">
                          回答に合わせて質問が進みます。全{INTERVIEW_QUESTION_COUNT}問です。
                        </p>
                      </div>
                    </div>
                    <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-stone-100"><div className="h-full bg-[#CD9535] transition-all" style={{ width: `${progress}%` }} /></div>
                    <div className="space-y-4">
                      {interview.map((item, index) => (
                        <div key={`${item.question}-${index}`} className="border-l-2 border-stone-200 pl-4">
                          <p className="text-xs font-bold leading-6 text-[#00204A]">Q{index + 1}. {item.question}</p>
                          <p className="mt-1 whitespace-pre-wrap text-xs leading-6 text-stone-600">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                    {!interviewComplete && (
                      <div className="mt-5 rounded-xl border border-[#CD9535]/30 bg-amber-50/40 p-4">
                        <p className="flex gap-2 text-sm font-bold leading-7 text-[#00204A]"><Sparkles className="mt-1 h-4 w-4 flex-none text-[#CD9535]" />{currentQuestion}</p>
                        <textarea className={`${fieldClass} mt-3 min-h-28 resize-y`} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="ご自身の言葉でお答えください" />
                        <button type="button" disabled={!answer.trim() || isInterviewLoading} onClick={submitInterviewAnswer} className="mt-3 inline-flex items-center gap-2 bg-[#00204A] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-40">
                          {isInterviewLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MessageSquareText className="h-4 w-4" />}
                          回答して次の質問へ
                        </button>
                      </div>
                    )}
                    {interviewComplete && (
                      <div className="mt-5 flex items-start gap-3 border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                        <Check className="mt-0.5 h-5 w-5 flex-none" />インタビューが完了しました。写真やSNS、同窓生特典を追加できます。
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <section>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-[#00204A]"><ImagePlus className="h-5 w-5 text-[#CD9535]" />写真（任意・最大3枚）</h3>
                      <label className="mt-3 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-stone-200 bg-[#FAF9F5] px-4 py-5 text-center hover:border-[#CD9535]">
                        <ImagePlus className="h-6 w-6 text-[#CD9535]" />
                        <span className="mt-2 text-xs font-bold text-stone-600">プロフィール・活動・店舗などの写真を選択</span>
                        <span className="mt-1 text-[10px] text-stone-400">1枚2MB以下 / JPG・PNG・WEBP</span>
                        <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handlePhotos(e.target.files)} />
                      </label>
                      {photos.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {photos.map((photo, index) => (
                            <div key={`${photo.name}-${index}`} className="relative aspect-square overflow-hidden bg-stone-100">
                              <img src={photo.dataUrl} alt="" className="h-full w-full object-cover" />
                              <button type="button" onClick={() => setPhotos(photos.filter((_, photoIndex) => photoIndex !== index))} aria-label={`${photo.name}を削除`} className="absolute right-1 top-1 rounded-full bg-black/65 p-1.5 text-white"><Trash2 className="h-3 w-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-[#00204A]"><Globe className="h-5 w-5 text-[#CD9535]" />HP・SNSアカウント（任意）</h3>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {([
                          ['website', 'ホームページ', Globe],
                          ['linkedin', 'LinkedIn', Linkedin],
                          ['instagram', 'Instagram', Instagram],
                          ['facebook', 'Facebook', Globe],
                          ['x', 'X', Globe],
                        ] as const).map(([key, label, Icon]) => (
                          <label key={key} className="text-xs font-bold text-stone-600"><span className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" />{label}</span>
                            <input type="url" className={`${fieldClass} mt-1`} value={links[key]} onChange={(e) => setLinks({ ...links, [key]: e.target.value })} placeholder="https://" />
                          </label>
                        ))}
                      </div>
                    </section>

                    <section className="border border-amber-200 bg-amber-50/60 p-4">
                      <label className="flex cursor-pointer items-start gap-3 text-sm font-bold text-amber-950">
                        <input type="checkbox" checked={hasBenefit} onChange={(e) => setHasBenefit(e.target.checked)} className="mt-1 h-4 w-4 accent-amber-600" />
                        同窓生向けの割引・優待・相談特典を掲載する
                      </label>
                      {hasBenefit && <textarea className={`${fieldClass} mt-3 min-h-24 resize-y bg-white`} value={benefit} onChange={(e) => setBenefit(e.target.value)} placeholder="利用条件、特典内容、有効期限などを具体的に入力してください" />}
                    </section>

                    <label className="flex cursor-pointer items-start gap-3 border-t border-stone-200 pt-5 text-xs leading-6 text-stone-600">
                      <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#00204A]" />
                      <span><strong className="block text-[#00204A]">掲載審査と個人情報の取扱いに同意します。</strong>回答は内容や事実を変えない範囲で読みやすく整え、事務局が確認・編集後に掲載を判断します。内容によっては反映されない場合があります。</span>
                    </label>
                  </div>
                )}

                {error && <p role="alert" className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold leading-5 text-red-700">{error}</p>}
              </div>

              {!submitted && (
                <footer className="flex items-center justify-between gap-3 border-t border-stone-200 bg-white px-5 py-4 sm:px-7">
                  <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || isSubmitting} className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-500 disabled:opacity-30">
                    <ArrowLeft className="h-4 w-4" />戻る
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="hidden items-center gap-1 text-[10px] text-stone-400 sm:flex"><ShieldCheck className="h-3.5 w-3.5" />事務局確認後に掲載</span>
                    {step < 2 ? (
                      <button
                        type="button"
                        disabled={(step === 0 && (!profileReady || isInterviewLoading)) || (step === 1 && !interviewComplete)}
                        onClick={step === 0 ? startInterview : () => setStep(2)}
                        className="inline-flex items-center gap-2 bg-[#00204A] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-35"
                      >
                        {isInterviewLoading && step === 0 ? (
                          <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            インタビューを準備中
                          </>
                        ) : (
                          <>
                            {step === 0 ? 'インタビューを始める' : '写真・SNSを追加する'}
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    ) : (
                      <button type="button" disabled={!consent || isSubmitting} onClick={submitApplication} className="inline-flex items-center gap-2 bg-[#CD9535] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-35">
                        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {isSubmitting ? '回答を整えて送信中' : '掲載審査を申し込む'}
                      </button>
                    )}
                  </div>
                </footer>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
