import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Image as ImageIcon,
  Minus,
  Plus,
  Quote,
} from 'lucide-react';

import activityImage from '../data/newsletter43/activity.jpg';
import hasuiImage from '../data/newsletter43/hasui.jpg';
import homeworkImage from '../data/newsletter43/homework.jpg';
import jumpRopeImage from '../data/newsletter43/jump-rope.jpg';
import lunchImage from '../data/newsletter43/lunch.jpg';

type MagazineArticle = {
  id: string;
  page: string;
  label: string;
  title: string;
  author: string;
  deck: string;
  image?: string;
  imageAlt?: string;
  accent: string;
  readTime: string;
  pullQuote: string;
  body: string[];
};

const articles: MagazineArticle[] = [
  {
    id: 'memory',
    page: '01',
    label: '巻頭言',
    title: '茨城大学 半世紀の想い出',
    author: '木戸 之都子（人文・文10回卒）',
    deck: '入学から50年。人文学部、人文図書室、同窓会名簿づくりの記憶をたどる巻頭エッセイ。',
    image: activityImage,
    imageAlt: '茨城大学の活動風景',
    accent: '#B57A24',
    readTime: '約5分',
    pullQuote: '半世紀の記憶は、学びの場と人のつながりが重なってできた同窓会の歩みでもあります。',
    body: [
      '私が茨城大学人文学部文学科に入学したのは1976年のことでした。卒業後は人文学部に就職し、2023年に定年退職しましたが、その後も非常勤講師やアルバイト等で現在も茨城大学と関わっています。今年は入学してからちょうど50年目になり、過去の出来事や記憶が懐かしく思い出され、感慨深いです。',
      '入学当時の最初の記憶は、授業の始まる直前に教室にやってきて演説していく上級生や、廊下に散乱するビラ、キャンパス内の立て看など、学生運動の名残りを感じたことでした。人文学部文学科の1年生は60名で、専攻を超えた繋がりが強かったように感じます。',
      '卒業後の1981年、人文学部助手として人文図書室に職を得ました。当時の理念のもと、人文図書室は1984年に統合新設され、人文系の専門的参考図書を収集し、教員・学生への支援サービスを積極的に行いました。',
      '図書館所蔵古文書との関わりも茨城大学の大事な思い出です。郷土資料の整備に関わり、古文書のくずし字に触れるきっかけになりました。現在もボランティアで近世村方文書の史料整理にささやかながら関わっています。',
      '1982年に設立された文理・人文学部同窓会には設立準備段階から加わり、担当は同窓会名簿作成でした。今後も同窓会が学部や大学との連携を密接にとりながら、茨城大学の発展に寄与することを期待しています。',
    ],
  },
  {
    id: 'dean',
    page: '02',
    label: '学部長メッセージ',
    title: '同窓会の皆様へ',
    author: '同窓会名誉会長・人文社会科学部長　蓮井 誠一郎',
    deck: '新学部長就任に際して、学部・大学院教育の現在と、人のつながりの再構築を語る。',
    image: hasuiImage,
    imageAlt: '蓮井誠一郎 人文社会科学部長',
    accent: '#2F6F73',
    readTime: '約4分',
    pullQuote: 'テクノロジーを活用しながら、豊かな心のやりとりをいかに追求するか。',
    body: [
      '同窓会の皆様には、様々なご支援、ご協力、お気遣いを日頃より賜っております。学部を代表しまして、御礼申し上げます。今春、人文社会科学部長・学野長・研究科長に就任いたしました。',
      '私の専門は国際政治学と平和学で、環境問題と安全保障との関連を軸に研究してきました。急激な変化をふまえて、新しい適応力のあるライフスタイルや価値観をもった市民をどう育成して世に送り出すべきか、議論し考える日々です。',
      '対面授業が増え、大学も賑わいを取り戻しています。他方で、魅力的な職場・学び場作りが不可欠です。教職員や学生の多様性に基づき、生活上のバランスを確保することが重要です。',
      '急速に発達したオンライン会議の技術は、授業に変革をもたらしました。一方で、同じ空気を共有する対面の機会は減少し、仕事の余白に生じていた豊かなやりとりに基づく人間関係は変化しています。',
      '私は学部長就任後の最初の教授会にて、「学部（カレッジ）の再構築」を掲げました。テクノロジーを活用しながら、豊かな心のやりとりをいかに追求するかを考えるべきと信じています。',
    ],
  },
  {
    id: 'iop',
    page: '03-04',
    label: '学生レポート',
    title: 'ひたちなか市における子どもの居場所づくり',
    author: '人文社会科学部4年　中塩 紗矢香',
    deck: 'NPO法人「ただいま」でのiOP活動を通じ、学校の外側から子どもたちの実態を見つめる。',
    image: homeworkImage,
    imageAlt: 'てらこやで宿題をする様子',
    accent: '#8C4A5B',
    readTime: '約4分',
    pullQuote: '学校以外の第三の居場所から、子ども一人ひとりに寄り添う支援を考える。',
    body: [
      '私は将来教員を志しており、今回のiOPを通じて、学校という枠組みの外側から子どもたちの実態を見つめたいと考え、NPO法人「ただいま」での活動を決めました。',
      '近年増加する不登校児童・生徒がどのような思いを抱え、学校以外の「第三の居場所」がどう機能しているのかを当事者の目線で理解し、教員としての土台を築くことを目標にしました。',
      '2024年9月から現在に至るまで、ひたちなか市のフリースクール「ふらっと」や放課後の居場所「てらこや」にて週1回のスタッフ業務を行いました。主な役割は子どもたちの遊び相手や見守り、環境整備でした。',
      '活動を通じて、一人ひとりの特性に応じた「個別最適な支援」の重要性を痛感しました。不登校の背景には発達特性への無理解や家庭環境など多様な要因が潜んでおり、画一的な対応は通用しないということを学びました。',
      'この経験を糧に、将来は学校の中だけで完結せず、地域の活動とも密に連携しながら、多様な特性を持つ子どもたち一人ひとりに寄り添える教員を目指します。',
    ],
  },
  {
    id: 'meeting',
    page: '05',
    label: 'お知らせ',
    title: '第18回総会の開催について',
    author: '茨城大学文理・人文学部同窓会',
    deck: '令和8年7月18日、ホテル日航つくばで開催。総会、講演会、懇親会のご案内。',
    accent: '#395B8F',
    readTime: '約3分',
    pullQuote: '総会、講演会、懇親会を通じて、同窓生が顔を合わせる機会をつくります。',
    body: [
      '会則第9条により、第18回総会を開催します。今年度は、令和8年7月18日（土）につくば市内で開催いたします。',
      '総会終了後、恒例の講演会を企画いたしております。また、講演会終了後には懇親会を開催いたします。たくさんの会員の皆様のご参加をお待ちしております。',
      '日時は令和8年7月18日（土）午後1時30分から3時30分まで、受付は午後1時からです。場所は、つくば市吾妻1-1364-1 ホテル日航つくばです。',
      '議題は、決算・事業報告、予算・事業計画、その他。講演会の講師は茨城大学学長 佐川泰弘氏です。',
      'ご出席の場合は、お名前、卒業年月、住所及び電話番号をお書きになり、同窓会事務局までご連絡ください。',
    ],
  },
  {
    id: 'board',
    page: '06',
    label: '活動記録',
    title: '第40回理事会議事要録',
    author: '茨城大学文理・人文学部同窓会',
    deck: '令和7年度の事業活動報告、決算、事業計画、予算、個人情報保護方針改正を記録。',
    accent: '#6F5B9A',
    readTime: '約3分',
    pullQuote: '事業活動と会計、個人情報保護方針の改正まで、同窓会運営の現在を記録します。',
    body: [
      '第40回理事会は、令和7年7月19日（土）13時30分から16時20分まで、水戸京成ホテルで開催されました。出席者は40名でした。',
      '令和6年度事業活動報告並びに決算報告について、監査報告を経て原案のとおり承認されました。',
      '令和7年度事業計画並びに予算については、「イバダイ・サステナ・パートナーズ（略称 イバサス）」への参加を含めて説明があり、原案のとおり承認されました。',
      '個人情報保護方針の改正についても、「学生個人情報等の共同利用に関する覚書」の締結に伴う改正として説明され、承認されました。',
      '理事会終了後には講演会と懇親会が行われ、盛会裏に散会となりました。',
    ],
  },
  {
    id: 'afterword',
    page: '08',
    label: '編集後記',
    title: '編集後記',
    author: 'A・S',
    deck: '第43号からデジタル化へ。スマートフォンでも気軽に読める会報への移行について。',
    accent: '#7A5C32',
    readTime: '約2分',
    pullQuote: '若い会員の方々にも気軽に読んでいただけるよう、第43号からデジタル化を図りました。',
    body: [
      '今年度は、第18回総会開催の年です。7月18日（土）につくば市吾妻のホテル日航つくばで開催することといたしました。',
      '会報も今回発行の第43号から、デジタル化を図りました。一部の方には紙媒体でお送りいたしましたが、会員の皆様方には、ハガキでQRコードをお送りいたしましたので、スマートフォン等でご覧いただけるようになりました。',
      '郵送料が値上げされたことがきっかけですが、現役の学生を始めとする若い会員の方々に気軽に読んでいただけるように考え、変更しました。',
      'ご意見、ご要望等がございましたらご遠慮なく事務局までお申しつけ下さい。また、ホームページにつきましても、随時更新しておりますが、こちらへのご意見等もお寄せください。',
      '会員の皆様、今後とも、更なるご支援、ご協力をいただけますようお願い申しあげます。',
    ],
  },
];

const gallery = [
  { image: homeworkImage, label: 'てらこやで宿題をする様子' },
  { image: jumpRopeImage, label: 'てらこやで大縄跳びをする様子' },
  { image: lunchImage, label: 'ふらっとでのお昼ご飯の様子' },
  { image: activityImage, label: 'ふらっとでの活動の様子' },
];

const issueHighlights = [
  { articleId: 'memory', label: '巻頭', title: '半世紀の記憶', description: '茨城大学と同窓会の歩みを、個人の記憶からたどる。' },
  { articleId: 'dean', label: '現在', title: '学部の再構築', description: '新学部長が語る、対面とテクノロジーのこれから。' },
  { articleId: 'iop', label: '現場', title: '子どもの居場所', description: '学生が地域活動で見つめた第三の居場所の意味。' },
];

export default function Newsletter43WebMagazine() {
  const [activeArticleId, setActiveArticleId] = React.useState(articles[0].id);
  const [fontScale, setFontScale] = React.useState(1);
  const articleTopRef = React.useRef<HTMLDivElement>(null);
  const readerRef = React.useRef<HTMLDivElement>(null);
  const activeIndex = articles.findIndex((article) => article.id === activeArticleId);
  const activeArticle = articles[activeIndex] ?? articles[0];
  const readingProgress = ((activeIndex + 1) / articles.length) * 100;

  React.useEffect(() => {
    if (window.location.hash !== '#newsletter-reader') return;

    const timer = window.setTimeout(() => {
      readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  const scrollToArticleTop = () => {
    window.setTimeout(() => {
      articleTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const selectArticle = (articleId: string) => {
    setActiveArticleId(articleId);
    scrollToArticleTop();
  };

  const moveArticle = (direction: number) => {
    const nextIndex = (activeIndex + direction + articles.length) % articles.length;
    setActiveArticleId(articles[nextIndex].id);
    scrollToArticleTop();
  };

  const goHome = () => {
    window.location.href = window.location.pathname;
  };

  return (
    <section id="newsletter-43" className="relative overflow-hidden bg-[#F8F1E6] py-10 text-[#14213D] sm:py-14 lg:py-20 xl:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-[#D7C8AA]" aria-hidden="true" />
      <div className="absolute right-0 top-24 hidden h-[520px] w-[38vw] border-y border-l border-[#D7C8AA]/70 bg-[#FFFCF6]/55 xl:block" aria-hidden="true" />
      <div className="absolute bottom-24 left-0 hidden h-[300px] w-[22vw] border-y border-r border-[#D7C8AA]/60 bg-[#EAF0EA]/70 xl:block" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex h-11 w-full items-center justify-center gap-2 border border-[#D7C8AA] bg-[#FFFCF6] px-5 text-sm font-bold text-stone-600 transition-colors hover:border-[#B57A24] hover:text-[#14213D] sm:w-fit"
          >
            <ChevronLeft className="h-4 w-4" />
            ホームへ戻る
          </button>
          <a
            href="#newsletter-reader"
            className="inline-flex h-11 w-full items-center justify-center gap-2 bg-[#14213D] px-5 text-sm font-bold text-white transition-colors hover:bg-[#B57A24] sm:w-fit"
          >
            記事一覧へ
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="relative grid gap-6 lg:gap-8 xl:grid-cols-[420px_1fr]"
        >
          <aside className="relative min-h-[520px] overflow-hidden rounded-lg bg-[#111827] text-white shadow-[0_24px_70px_rgba(20,33,61,0.22)] sm:min-h-[560px] xl:min-h-[620px]">
            <img src={lunchImage} alt="会報第43号の表紙ビジュアル" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-[#111827]/35 to-[#111827]/92" aria-hidden="true" />
            <div className="absolute left-5 top-5 h-[calc(100%-40px)] w-[calc(100%-40px)] border border-white/35" aria-hidden="true" />
            <div className="relative flex min-h-[520px] flex-col justify-between p-5 sm:min-h-[560px] sm:p-8 xl:min-h-[620px]">
              <div>
                <div className="flex items-center justify-between gap-4 border-y border-white/50 py-3 text-[10px] font-black tracking-[0.16em] text-white/90 sm:text-[11px] sm:tracking-[0.22em]">
                  <span>IBARAKI</span>
                  <span>WEB MAGAZINE</span>
                </div>
                <h2 className="mt-8 font-serif text-[44px] font-bold leading-none text-white sm:text-[58px] xl:text-[68px]">
                  同窓会報
                  <span className="mt-3 block text-[70px] text-[#E0A23A] sm:text-[92px] xl:text-[104px]">43</span>
                </h2>
                <p className="mt-5 max-w-[285px] font-serif text-[16px] font-bold leading-8 text-[#FFF8EA] sm:text-[18px]">
                  茨城大学文理・人文学部同窓会 会報 第43号
                </p>
                <div className="mt-7 grid grid-cols-[58px_1fr] gap-4 border-y border-white/30 py-4 sm:mt-8 sm:grid-cols-[72px_1fr]">
                  <p className="font-serif text-[30px] leading-none text-[#E0A23A] sm:text-[38px]">特集</p>
                  <p className="text-[12px] font-bold leading-6 tracking-[0.12em] text-white/85">
                    記憶、学部の現在、地域で学ぶ学生の声を一つの流れで読む。
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3 border-y border-white/30 py-5 text-sm">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-[#E0A23A]">ISSUE</p>
                    <p className="mt-1 font-serif text-2xl font-bold">2026.06</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-[#E0A23A]">PAGES</p>
                    <p className="mt-1 font-serif text-2xl font-bold">08</p>
                  </div>
                </div>
                <a
                  href="#newsletter-reader"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 bg-[#E0A23A] px-5 text-sm font-black tracking-[0.16em] text-[#111827] transition-colors hover:bg-white"
                >
                  読み始める
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </aside>

          <div className="relative flex min-w-0 flex-col justify-between rounded-lg border border-[#D7C8AA] bg-[#FFFCF6] p-5 shadow-sm sm:p-6 lg:p-8 xl:p-10">
            <div className="absolute right-8 top-8 hidden h-28 w-24 rotate-3 border border-[#D7C8AA] bg-[#F8F1E6] p-3 shadow-sm xl:block" aria-hidden="true">
              <div className="h-full border border-[#D7C8AA] bg-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-black tracking-[0.18em] text-[#B57A24]">
                <span className="inline-flex items-center gap-2 border border-[#D7C8AA] px-3 py-2">
                  <BookOpen className="h-4 w-4" />
                  WEB MAGAZINE
                </span>
                <span className="inline-flex items-center gap-2 border border-[#D7C8AA] px-3 py-2">
                  <CalendarDays className="h-4 w-4" />
                  令和8年6月発行
                </span>
              </div>

              <h3 className="mt-8 max-w-3xl font-serif text-[34px] font-bold leading-tight text-[#14213D] sm:text-4xl lg:text-5xl xl:text-6xl">
                43号を、読むほど深まるWEBマガジンへ。
              </h3>
              <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-stone-600">
                巻頭言、学部長メッセージ、学生レポート、総会案内、理事会記録、編集後記を、スマートフォンでも読みやすい章立てに再編集しました。
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3 xl:grid-cols-3">
              {issueHighlights.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    selectArticle(item.articleId);
                  }}
                  className="group border border-[#D7C8AA] bg-[#F8F1E6] p-5 text-left transition-colors hover:border-[#B57A24] hover:bg-white"
                >
                  <p className="text-[10px] font-black tracking-[0.2em] text-[#B57A24]">{item.label}</p>
                  <p className="mt-3 font-serif text-2xl font-bold text-[#14213D]">{item.title}</p>
                  <p className="mt-3 text-sm font-medium leading-6 text-stone-600">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-black tracking-[0.14em] text-[#B57A24]">
                    READ
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div ref={readerRef} id="newsletter-reader" className="mt-10 scroll-mt-28 grid gap-6 xl:grid-cols-[300px_1fr] xl:gap-8">
          <nav className="xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-lg border border-[#D7C8AA] bg-[#FFFCF6] p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-serif text-2xl font-bold">Contents</h4>
                <FileText className="h-5 w-5 text-[#B57A24]" />
              </div>
              <div className="mt-5 h-2 overflow-hidden bg-[#E8DDC5]" aria-label="記事位置">
                <div className="h-full bg-[#14213D] transition-all duration-300" style={{ width: `${readingProgress}%` }} />
              </div>
              <p className="mt-2 text-[10px] font-black tracking-[0.16em] text-stone-500">
                記事 {activeIndex + 1}/{articles.length}
              </p>
              <div className="mt-5 space-y-2">
                {articles.map((article) => (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => selectArticle(article.id)}
                    className={`grid w-full grid-cols-[42px_1fr] gap-3 border p-3 text-left transition-colors ${
                      activeArticleId === article.id
                        ? 'border-[#B57A24] bg-[#FFF4DC] text-[#14213D]'
                        : 'border-[#E3D7BF] bg-white text-stone-600 hover:border-[#B57A24]/60'
                    }`}
                  >
                    <span className="font-serif text-xl font-bold text-[#B57A24]">{article.page}</span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-black tracking-[0.14em] text-[#B57A24]">{article.label}</span>
                      <span className="mt-1 block text-sm font-bold leading-5">{article.title}</span>
                      <span className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-stone-400">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <article className="min-w-0 rounded-lg border border-[#D7C8AA] bg-[#FFFCF6] shadow-sm">
            <div ref={articleTopRef} className="scroll-mt-28 border-b border-[#D7C8AA] p-5 sm:p-8" style={{ borderTop: `6px solid ${activeArticle.accent}` }}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl font-bold sm:text-5xl" style={{ color: activeArticle.accent }}>{activeArticle.page}</span>
                  <div>
                    <p className="text-[11px] font-black tracking-[0.18em]" style={{ color: activeArticle.accent }}>{activeArticle.label}</p>
                    <p className="mt-1 text-sm font-bold text-stone-500">{activeArticle.author}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-stone-400">
                      <Clock className="h-3.5 w-3.5" />
                      {activeArticle.readTime}
                    </p>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-2 border border-[#D7C8AA] bg-white px-3 py-2 sm:w-auto">
                  <span className="mr-1 text-xs font-bold text-stone-500">文字サイズ</span>
                  <button
                    type="button"
                    onClick={() => setFontScale((value) => Math.max(0.92, value - 0.08))}
                    className="flex h-8 w-8 items-center justify-center border border-[#D7C8AA] bg-[#FFFCF6] text-stone-600 hover:text-[#14213D]"
                    aria-label="本文を小さくする"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontScale((value) => Math.min(1.16, value + 0.08))}
                    className="flex h-8 w-8 items-center justify-center border border-[#D7C8AA] bg-[#FFFCF6] text-stone-600 hover:text-[#14213D]"
                    aria-label="本文を大きくする"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h4 className="mt-7 max-w-3xl font-serif text-[28px] font-bold leading-tight text-[#14213D] sm:text-4xl xl:text-5xl">
                {activeArticle.title}
              </h4>
              <p className="mt-5 max-w-3xl text-[15px] font-medium leading-8 text-stone-600 sm:text-base">{activeArticle.deck}</p>
            </div>

            <div className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[340px_1fr]">
              <div className="space-y-5">
                {activeArticle.image ? (
                  <figure className="border border-[#D7C8AA] bg-[#F8F1E6] p-3">
                    <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                      <img src={activeArticle.image} alt={activeArticle.imageAlt} className="h-full w-full object-cover" />
                    </div>
                    <figcaption className="mt-3 text-xs font-bold leading-5 text-stone-500">{activeArticle.imageAlt}</figcaption>
                  </figure>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center border border-[#D7C8AA] bg-[#F8F1E6] text-[#B57A24]">
                    <FileText className="h-12 w-12" />
                  </div>
                )}
                <aside className="border-l-4 bg-[#F8F1E6] p-5" style={{ borderColor: activeArticle.accent }}>
                  <Quote className="h-5 w-5" style={{ color: activeArticle.accent }} />
                  <p className="mt-3 font-serif text-xl font-bold leading-8 text-[#14213D]">{activeArticle.pullQuote}</p>
                </aside>
              </div>

              <div
                className="space-y-6 text-stone-700"
                style={{ fontSize: `${fontScale}rem`, lineHeight: 1.95 }}
              >
                {activeArticle.body.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    className={
                      index === 0
                        ? 'first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[4.6em] first-letter:font-bold first-letter:leading-[0.84] first-letter:text-[#B57A24]'
                        : undefined
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#D7C8AA] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <button
                type="button"
                onClick={() => moveArticle(-1)}
                className="inline-flex h-11 items-center justify-center gap-2 border border-[#D7C8AA] bg-white px-5 text-sm font-bold text-stone-600 hover:text-[#14213D]"
              >
                <ChevronLeft className="h-4 w-4" />
                前の記事
              </button>
              <p className="text-center text-xs font-black tracking-[0.16em] text-stone-500">
                {activeIndex + 1} / {articles.length}
              </p>
              <button
                type="button"
                onClick={() => moveArticle(1)}
                className="inline-flex h-11 items-center justify-center gap-2 border border-[#D7C8AA] bg-white px-5 text-sm font-bold text-stone-600 hover:text-[#14213D]"
              >
                次の記事
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>

        <div className="mt-10 rounded-lg border border-[#D7C8AA] bg-[#FFFCF6] p-5 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black tracking-[0.2em] text-[#B57A24]">PHOTO STORY</p>
              <h4 className="mt-2 font-serif text-3xl font-bold text-[#14213D]">学生レポート写真</h4>
            </div>
            <ImageIcon className="h-6 w-6 text-[#B57A24]" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item) => (
              <figure key={item.label} className="border border-[#D7C8AA] bg-[#F8F1E6] p-2">
                <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                  <img src={item.image} alt={item.label} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <figcaption className="mt-3 px-1 pb-1 text-xs font-bold leading-5 text-stone-600">{item.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
