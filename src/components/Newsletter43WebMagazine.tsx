import React from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Menu,
  Minus,
  Plus,
  Quote,
} from 'lucide-react';

import activityImage from '../data/newsletter43/activity.jpg';
import hasuiImage from '../data/newsletter43/hasui.jpg';
import homeworkImage from '../data/newsletter43/homework.jpg';
import jumpRopeImage from '../data/newsletter43/jump-rope.jpg';
import kidoYukikoImage from '../data/newsletter43/kido-yukiko.jpg';
import lunchImage from '../data/newsletter43/lunch.jpg';
import NewsletterArticleBody, { type NewsletterArticlePhoto } from './NewsletterArticleBody';
import NewsletterPdfFlipbook from './NewsletterPdfFlipbook';

type MagazineArticle = {
  id: string;
  page: string;
  label: string;
  title: string;
  author: string;
  deck: string;
  photos?: NewsletterArticlePhoto[];
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
    photos: [{ image: kidoYukikoImage, label: '木戸 之都子 様', variant: 'portrait' }],
    accent: '#B57A24',
    readTime: '約5分',
    pullQuote: '半世紀の記憶は、学びの場と人のつながりが重なってできた同窓会の歩みでもあります。',
    body: [
      '私が茨城大学人文学部文学科に入学したのは1976年のことでした。卒業後は人文学部に就職し、2023年に定年退職しましたが、その後も非常勤講師やアルバイト等で現在も茨城大学と関わっています。今年は入学してからちょうど50年目になり、光陰矢の如し、とはよくいったもので、過去の出来事や記憶が懐かしく思い出され、感慨深いです。入学当時の最初の記憶は1年生の授業の始まる直前にいきなり教室にやってきて教卓で演説していく上級生や廊下に散乱するビラやキャンパス内の立て看など、学生運動の名残りを感じたことでした。人文学部文学科の1年生は60名で、同じ専攻だけでなく専攻を超えた繋がりが強かったように感じます。',
      '卒業後の1981年、人文学部助手として人文図書室に職を得て、人文図書室分室という1スパン（研究室1個分）の狭いスペースが私の部屋になりました。当時、人文図書室運営委員長だった東敏雄教授の「学部独自の図書室を充実させていく」という理念の元、それまで社会系と文系に分かれていた人文図書室が1984年増築された人文B棟に新たな人文図書室として統合新設されました。人文系の専門的参考図書を収集し、人文学部の教員・学生への支援サービスを積極的に行った結果、人文図書室の蔵書数は図書約20,000冊、雑誌約1,000誌になり、パソコン（20台）等を所有し、学生の文献情報検索の技術向上のためにガイダンスも実施してきました。また、1983年度以降の卒業論文の情報（目次構成・使用した参考文献など）を収集し、データベース化して閲覧に供しています（人文学部の教職員・学生のみが利用可）。',
      'しかし、残念ながら当初の職員3名が1名までに減少し、予算の縮小等もあり、2021年人文図書室は廃止されました。ただし、その機能は大幅に縮小して2022年、2スパンの学部共同資料室に姿をかえました。40年近い人文図書室の歴史は2011年3月11日の東日本大震災や2020年4月以降のコロナ禍のつらい思い出を含めて、私の中では大切な思い出になりつつあります。',
      '図書館所蔵古文書の関わりも茨城大学の大事な思い出です。当時、人文図書室運営委員だった河内八郎教授からのお誘いで図書館所蔵の郷土資料の整備に関わり、当時、図書館のデジタル化の波で隅に追いやられがちだった古文書のくずし字に触れるきっかけになり、歴史の学生さんと史料整理を行いながら読むことの楽しさを覚えました。現在もボランティアで図書館所蔵の近世村方文書の史料整理にささやかながら関わっています。',
      '1982年に設立された文理・人文学部同窓会には設立準備段階から加わり、私の担当は同窓会名簿作成でした。同窓会名簿は今年の発行で10冊目になりますが、2003年に個人情報保護法が制定されてから卒業生の住所や勤務先を把握するのがとくに困難になり、試行錯誤を繰り返しながら発行を重ねた記憶があります。同窓会費が入学時に徴収する方式になってから現在の同窓会加入率は95％になっていると聞きます。設立当初は同窓会への理解がなかなか得られず、在学中や卒業間際に勧誘するしかなく、加入率も30％と伸び悩んでいて、現在と比べると隔世の感があります。',
      '今後も文理・人文学部同窓会が学部や大学との連携を密接にとりながら、茨城大学の発展に寄与するとともに同窓生同士の交流を活発に行っていくこと期待しています。',
    ],
  },
  {
    id: 'dean',
    page: '02',
    label: '学部長メッセージ',
    title: '同窓会の皆様へ',
    author: '同窓会名誉会長・人文社会科学部長　蓮井 誠一郎',
    deck: '新学部長就任に際して、学部・大学院教育の現在と、人のつながりの再構築を語る。',
    photos: [{ image: hasuiImage, label: '蓮井誠一郎 人文社会科学部長' }],
    accent: '#2F6F73',
    readTime: '約4分',
    pullQuote: 'テクノロジーを活用しながら、豊かな心のやりとりをいかに追求するか。',
    body: [
      '同窓会の皆様には、様々なご支援、ご協力、お気遣いを日頃より賜っております。学部を代表しまして、御礼申し上げます。',
      '今春、人文社会科学部長・学野長・研究科長に就任いたしました。責任の重さを感じながら、学部の新しい姿を構想しつつ、社会の期待に応えられるように改革を着実に進めるために準備を重ねております。',
      '私の専門は国際政治学と平和学で、環境問題と安全保障との関連を軸に研究してきました。コロナ禍に社会が適応する中で、イラン情勢が、私たち日本人が過去の石油危機から何を学んだかを試そうとしています。このような急激な変化をふまえて、新しい適応力のあるライフスタイルや価値観をもった市民をどう育成して世に送り出すべきか、議論し考える日々です。',
      '現在の学部・大学院教育と今後',
      '対面授業が増え、大学も賑わいを取り戻しています。他方で、より優秀な人物を惹きつけるためには、魅力的な職場・学び場作りが不可欠です。そのためには教職員や学生の多様性に基づき、生活上のバランスを確保することが重要です。教職員のワーク・ライフ・バランスと多様な学生への対応により、急な休講や欠席であっても学びの機会を失わない仕組みの活用を推進しております。',
      'このような価値観を社会に拡げる専門家を教育すべく、大学院では来年度から文部科学省に採択された「ダイバーシティ地域共創プログラム」の学位プログラム化を行います。',
      '他方で、地方国立大学の厳しい大学財政事情から、教員の減少傾向は続いており、総合人文社会系学部としての強みをどう活かし弱みをカバーしていくかが課題となっております。メディア文化や心理・人間科学といったメジャーが学生の人気を集める一方で、第一希望の叶わなかった学生たちの意欲をいかに維持するかは課題です。また、変化する学生や社会のニーズに応えるためのメジャー・サブメジャー制の中身についても、検討が必要です。',
      'テクノロジーの発展と人のつながりの再構築',
      '急速に発達したオンライン会議の技術は、教室を中心とした授業に変革をもたらし、資料のペーパレス化による紙資源節約、教員や学生の居場所に捕らわれない自由な授業実施を可能にし、計り知れないメリットをもたらしました。他方で、同じ空気を共有する対面の機会は減少し、教員と学生、そして教員同士の仕事の「余白」に生じていた豊かなやりとりに基づく人間関係は変化しています。',
      '私は学部長就任後の最初の教授会にて、「学部（カレッジ）の再構築」を掲げました。',
      '教員と学生が寝食を共にして学んだはるか昔のカレッジに戻るのではなく（そういう機会はあってよいのですが）、テクノロジーを活用しながら、豊かな心のやりとりをいかにして追求するか、を考えるべきと私は信じています。',
      'すでに、教員間でもゆるやかなつながりで、各自の研究の周縁部を豊かにする様々な試みが実践されています。当学部には「市民共創教育研究センター」があり、学部教員がメンバーです。このような場を活かして、多種多様な交流をつくり、これからの学部について、議論して参りたいと存じます。',
      '最後になりましたが同窓生の皆様のご発展を祈念しつつ、学部への引き続きのご支援ならびにご協力をお願いするとともに、私たちをお見守りくださいますようお願い申し上げます。学内外で皆様にお目にかかるのを楽しみにしております。',
    ],
  },
  {
    id: 'iop',
    page: '03-04',
    label: '学生レポート',
    title: 'ひたちなか市における子どもの居場所づくり',
    author: '人文社会科学部4年　中塩 紗矢香',
    deck: 'NPO法人「ただいま」でのiOP活動を通じ、学校の外側から子どもたちの実態を見つめる。',
    photos: [
      { image: homeworkImage, label: 'てらこやで宿題をする様子' },
      { image: jumpRopeImage, label: 'てらこやで大縄跳びをする様子' },
      { image: lunchImage, label: 'ふらっとでのお昼ご飯の様子' },
      { image: activityImage, label: 'ふらっとでの活動の様子' },
    ],
    accent: '#8C4A5B',
    readTime: '約4分',
    pullQuote: '学校以外の第三の居場所から、子ども一人ひとりに寄り添う支援を考える。',
    body: [
      '私は将来教員を志しており、今回のiOPを通じて、学校という枠組みの外側から子どもたちの実態を見つめたいと考え、NPO法人「ただいま」での活動を決めました。近年増加する不登校児童・生徒がどのような思いを抱え、学校以外の「第三の居場所」がどう機能しているのかを当事者の目線で理解し、教員としての土台を築くことを目標に、現場での実践を通じて学びを深めました。',
      '2024年9月から現在に至るまで、ひたちなか市のフリースクール「ふらっと」や放課後の居場所「てらこや」にて週1回のスタッフ業務を行いました。主な役割は子どもたちの遊び相手や見守り、環境整備でしたが、学校提出用の活動報告書の執筆補助など、地域と学校を繋ぐ実務にも携わりました。',
      '活動を通じて、一人ひとりの特性に応じた「個別最適な支援」の重要性を痛感しました。不登校の背景には発達特性への無理解や家庭環境など多様な要因が潜んでおり、画一的な対応は通用しないということ。また、表面的な行動の裏にある「見えない背景」を多角的に想像し、試行錯誤しながら寄り添う中で、子どもが社会との繋がりを再構築していく姿を目の当たりにしたことは大きな成果であったと感じております。',
      'この経験を糧に、将来は学校の中だけで完結せず、地域の活動とも密に連携しながら、多様な特性を持つ子どもたち一人ひとりに寄り添える教員を目指します。大学内では学べない地域の実情に触れることができ、実りの多いiOP活動となりました。',
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

const fontScales = [0.875, 1, 1.125, 1.25];

function changeFontScale(current: number, direction: -1 | 1) {
  const nearestIndex = fontScales.reduce(
    (bestIndex, scale, index) =>
      Math.abs(scale - current) < Math.abs(fontScales[bestIndex] - current) ? index : bestIndex,
    0,
  );
  return fontScales[Math.min(fontScales.length - 1, Math.max(0, nearestIndex + direction))];
}

function splitAuthor(author: string) {
  const trimmed = author.trim();
  const normalized = trimmed.replace(/\s+/g, ' ');
  const parentheticalMatch = normalized.match(/^(.+?)（(.+?)）$/);

  if (parentheticalMatch) {
    return {
      role: parentheticalMatch[2],
      name: parentheticalMatch[1],
    };
  }

  const separatorIndex = trimmed.lastIndexOf('　');

  if (separatorIndex <= 0) {
    return { role: '', name: normalized };
  }

  return {
    role: trimmed.slice(0, separatorIndex).replace(/\s+/g, ' ').trim(),
    name: trimmed.slice(separatorIndex + 1).replace(/\s+/g, ' ').trim(),
  };
}

export default function Newsletter43WebMagazine() {
  const [activeArticleId, setActiveArticleId] = React.useState(articles[0].id);
  const [fontScale, setFontScale] = React.useState(1);
  const [isPdfOpen, setIsPdfOpen] = React.useState(false);
  const articleTopRef = React.useRef<HTMLDivElement>(null);
  const readerRef = React.useRef<HTMLDivElement>(null);
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const activeIndex = articles.findIndex((article) => article.id === activeArticleId);
  const activeArticle = articles[activeIndex] ?? articles[0];
  const activeAuthor = splitAuthor(activeArticle.author);
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
    <section id="newsletter-43" className="relative bg-[#F8F4EC] pb-28 pt-6 text-[#14213D] sm:pb-32 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-bold text-stone-600 transition-colors hover:text-[#14213D]"
          >
            <ChevronLeft className="h-4 w-4" />
            ホームへ戻る
          </button>
          <button
            type="button"
            onClick={() => timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-bold text-[#14213D]"
          >
            <Menu className="h-5 w-5" />
            目次
          </button>
        </div>

        <div className="overflow-hidden border border-[#DED4C2] bg-[#FFFCF7] shadow-[0_14px_42px_rgba(20,33,61,0.08)]">
          <div className="grid grid-cols-[minmax(0,1fr)_100px] items-center gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-8 sm:p-8 lg:grid-cols-[1fr_330px] lg:gap-12 lg:p-12">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#14213D] sm:text-[12px] sm:tracking-[0.24em]">WEB MAGAZINE</span>
                <span className="font-serif text-3xl leading-none text-[#B87816] sm:text-5xl">43</span>
              </div>
              <p className="mt-2 text-xs font-bold text-stone-600 sm:mt-3 sm:text-sm">令和8年6月発行</p>
              <h2 className="mt-4 max-w-xl font-serif text-[26px] font-bold leading-[1.45] tracking-[0.01em] text-[#14213D] sm:mt-6 sm:text-5xl lg:text-6xl">
                記憶から、
                <br />
                現在と地域へ。
              </h2>
              <p className="mt-4 hidden max-w-lg text-[15px] font-medium leading-8 text-stone-600 min-[430px]:block sm:text-base">
                学部の歩み、今、そして地域で学ぶ学生の声をつなぐ、6つの物語。
              </p>
              <div className="mt-4 grid gap-2 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
                <button
                  type="button"
                  onClick={() => selectArticle(articles[0].id)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#062B59] px-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(6,43,89,0.18)] transition-colors hover:bg-[#B87816] sm:min-h-14 sm:gap-3 sm:px-7 sm:text-base"
                >
                  最初の記事を読む
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPdfOpen(true)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#B87816] bg-[#FFFCF7] px-3 text-xs font-bold text-[#14213D] transition-colors hover:bg-[#B87816] hover:text-white sm:min-h-14 sm:gap-3 sm:px-7 sm:text-base"
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  PDFをめくって読む
                </button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[300px]">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111827] shadow-[0_16px_32px_rgba(20,33,61,0.2)]">
                <img src={lunchImage} alt="会報第43号の表紙ビジュアル" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#071C39]/15 via-[#071C39]/30 to-[#071C39]/90" aria-hidden="true" />
                <div className="relative flex h-full flex-col justify-between p-2.5 text-white sm:p-5">
                  <div className="flex justify-between text-[5px] font-black tracking-[0.1em] sm:text-[9px] sm:tracking-[0.18em]">
                    <span>IBARAKI</span>
                    <span>WEB MAGAZINE</span>
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold sm:text-3xl">同窓会報</p>
                    <p className="font-serif text-4xl leading-none text-[#E4A52E] sm:text-7xl">43</p>
                    <p className="mt-2 hidden border-t border-white/40 pt-2 text-xs font-bold leading-6 sm:block">
                      記憶、学部の現在、地域で学ぶ学生の声を一つの流れで読む。
                    </p>
                    <div className="mt-2 flex gap-2 text-[7px] font-bold sm:mt-4 sm:gap-8 sm:text-xs">
                      <span>2026.06</span>
                      <span>08 PAGES</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={timelineRef} className="scroll-mt-24 py-8 sm:py-16">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#D8CDBA] pb-4 sm:mb-8 sm:pb-5">
            <div>
              <p className="text-[11px] font-black tracking-[0.22em] text-[#B87816]">CONTENTS</p>
              <h3 className="mt-2 font-serif text-[28px] font-bold sm:text-4xl">6つの物語をたどる</h3>
            </div>
            <p className="text-xs font-bold text-stone-500">全6記事</p>
          </div>

          <div className="relative">
            <div className="absolute bottom-3 left-[46px] top-3 w-px bg-[#C98B23] sm:left-[68px]" aria-hidden="true" />
            <div className="space-y-5 sm:space-y-7">
              {articles.map((article, index) => {
                const image =
                  article.id === 'memory'
                    ? kidoYukikoImage
                    : article.id === 'dean'
                      ? hasuiImage
                      : article.id === 'iop'
                        ? lunchImage
                        : undefined;

                return (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => selectArticle(article.id)}
                    className="group relative grid w-full grid-cols-[74px_1fr] gap-4 text-left sm:grid-cols-[112px_1fr] sm:gap-7"
                  >
                    <span className="relative z-10 block bg-[#F8F4EC] py-2">
                      <span className="block font-serif text-[38px] font-bold leading-none text-[#062B59] sm:text-6xl">{article.page}</span>
                      <span className="mt-3 block text-[11px] font-black leading-5 text-[#B87816] sm:text-sm">{article.label}</span>
                      <span className="mt-3 flex items-center gap-1 text-[10px] font-bold text-stone-500 sm:text-xs">
                        <Clock className="h-3.5 w-3.5" />
                        {article.readTime}
                      </span>
                    </span>

                    <span className="overflow-hidden border border-[#E2D8C8] bg-[#FFFCF7] shadow-[0_8px_22px_rgba(20,33,61,0.07)] transition-transform group-hover:-translate-y-0.5">
                      <span className={`grid ${image ? 'md:grid-cols-2' : ''}`}>
                        {image && index % 2 === 0 && (
                          <img
                            src={image}
                            alt=""
                            className={`h-44 w-full object-top sm:h-52 md:h-72 ${
                              article.id === 'memory' || article.id === 'dean' ? 'bg-[#EAF4F8] object-contain' : 'object-cover'
                            }`}
                          />
                        )}
                        <span className="flex min-h-[170px] flex-col justify-center p-5 sm:p-7">
                          <span className="font-serif text-[23px] font-bold leading-[1.45] text-[#14213D] sm:text-3xl">{article.title}</span>
                          <span className="mt-3 line-clamp-2 text-sm font-medium leading-7 text-stone-600">{article.deck}</span>
                          <span className="mt-5 inline-flex items-center gap-3 text-xs font-black tracking-[0.18em] text-[#B87816]">
                            READ
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </span>
                        {image && index % 2 === 1 && (
                          <img
                            src={image}
                            alt=""
                            className={`h-44 w-full object-top sm:h-52 md:h-72 ${
                              article.id === 'memory' || article.id === 'dean' ? 'bg-[#EAF4F8] object-contain' : 'object-cover'
                            }`}
                          />
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div ref={readerRef} id="newsletter-reader" className="scroll-mt-24">
          <article className="overflow-hidden border border-[#D7C8AA] bg-[#FFFCF7] shadow-[0_12px_34px_rgba(20,33,61,0.08)]">
            <div ref={articleTopRef} className="scroll-mt-24 border-b border-[#D7C8AA] p-5 sm:p-8" style={{ borderTop: `6px solid ${activeArticle.accent}` }}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl font-bold sm:text-5xl" style={{ color: activeArticle.accent }}>{activeArticle.page}</span>
                  <div>
                    <p className="text-[11px] font-black tracking-[0.18em]" style={{ color: activeArticle.accent }}>{activeArticle.label}</p>
                    <div className="mt-1 max-w-[240px] text-sm font-bold leading-5 text-stone-500 sm:max-w-none">
                      {activeAuthor.role && <p>{activeAuthor.role}</p>}
                      <p className="whitespace-nowrap text-[#14213D] sm:text-stone-500">{activeAuthor.name}</p>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-stone-400">
                      <Clock className="h-3.5 w-3.5" />
                      {activeArticle.readTime}
                    </p>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-2 border border-[#D7C8AA] bg-white px-3 py-2 sm:w-auto">
                  <span className="mr-1 text-xs font-bold text-stone-500">
                    文字サイズ
                    <span className="ml-1 text-[#B87816]">{Math.round(fontScale * 100)}%</span>
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setFontScale((value) => changeFontScale(value, -1));
                    }}
                    disabled={fontScale <= 0.875}
                    className="flex h-11 w-11 items-center justify-center border border-[#D7C8AA] bg-[#FFFCF6] text-stone-600 hover:text-[#14213D] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="本文を小さくする"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setFontScale((value) => changeFontScale(value, 1));
                    }}
                    disabled={fontScale >= 1.25}
                    className="flex h-11 w-11 items-center justify-center border border-[#D7C8AA] bg-[#FFFCF6] text-stone-600 hover:text-[#14213D] disabled:cursor-not-allowed disabled:opacity-35"
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

            <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[260px_1fr]">
              <div>
                <aside className="border-l-4 bg-[#F8F1E6] p-5" style={{ borderColor: activeArticle.accent }}>
                  <Quote className="h-5 w-5" style={{ color: activeArticle.accent }} />
                  <p className="mt-3 font-serif text-xl font-bold leading-8 text-[#14213D]">{activeArticle.pullQuote}</p>
                </aside>
              </div>

              <NewsletterArticleBody
                articleId={activeArticle.id}
                body={activeArticle.body}
                photos={activeArticle.photos ?? []}
                fontScale={fontScale}
              />
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

        <div className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-24px)] max-w-xl -translate-x-1/2 items-center gap-3 rounded-full bg-[#062B59] px-4 py-3 text-white shadow-[0_12px_30px_rgba(6,43,89,0.28)] sm:bottom-6 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex min-h-11 shrink-0 items-center gap-2 px-1 text-xs font-bold sm:text-sm"
          >
            <BookOpen className="h-5 w-5 text-[#E4A52E]" />
            全6記事
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-center text-[10px] font-bold tracking-[0.08em] text-white/80">
              記事 {activeIndex + 1} / {articles.length}
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/25" aria-label="記事位置">
              <div className="h-full rounded-full bg-[#E4A52E] transition-all duration-300" style={{ width: `${readingProgress}%` }} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex min-h-11 shrink-0 items-center gap-2 px-1 text-xs font-bold sm:text-sm"
          >
            <Menu className="h-5 w-5 text-[#E4A52E]" />
            目次
          </button>
        </div>
      </div>
      <NewsletterPdfFlipbook isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} />
    </section>
  );
}
