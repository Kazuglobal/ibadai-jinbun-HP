import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  FileText,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Phone,
  ReceiptText,
  ScrollText,
  X,
} from 'lucide-react';

import activityImage from '../data/newsletter43/activity.jpg';
import hasuiImage from '../data/newsletter43/hasui.jpg';
import homeworkImage from '../data/newsletter43/homework.jpg';
import jumpRopeImage from '../data/newsletter43/jump-rope.jpg';
import lunchImage from '../data/newsletter43/lunch.jpg';

interface NewsletterModalProps {
  autoOpenReady?: boolean;
  onClose?: () => void;
}

type Article = {
  id: string;
  label: string;
  title: string;
  author?: string;
  lead?: string;
  paragraphs: string[];
};

type FinanceRow = {
  item: string;
  current: string;
  previous?: string;
  note?: string;
};

const tocItems = [
  { id: 'cover', label: '巻頭', title: '茨城大学 半世紀の想い出' },
  { id: 'greeting', label: '挨拶', title: '同窓会の皆様へ' },
  { id: 'iop', label: '学生', title: 'ひたちなか市における子どもの居場所づくり' },
  { id: 'meeting', label: '総会', title: '第18回総会の開催について' },
  { id: 'board', label: '記録', title: '第40回理事会議事要録' },
  { id: 'activities', label: '事業', title: '令和7年度事業報告・令和8年度事業計画' },
  { id: 'finance', label: '会計', title: '決算報告・予算案' },
  { id: 'editor', label: '後記', title: '編集後記' },
];

const magazineCards = [
  {
    id: 'cover',
    label: 'MEMORY',
    title: '茨城大学 半世紀の想い出',
    copy: '学生時代から人文図書室、同窓会名簿づくりまで。大学と歩んだ半世紀をたどる巻頭エッセイ。',
    image: activityImage,
  },
  {
    id: 'greeting',
    label: 'MESSAGE',
    title: '同窓会の皆様へ',
    copy: '新学部長が語る、学部教育の現在と「カレッジの再構築」。',
    image: hasuiImage,
  },
  {
    id: 'iop',
    label: 'STUDENT',
    title: 'ひたちなか市における子どもの居場所づくり',
    copy: '学生の地域実践を、写真とともに読める活動レポートとして構成。',
    image: homeworkImage,
  },
  {
    id: 'meeting',
    label: 'MEETING',
    title: '第18回総会の開催について',
    copy: '日時、会場、講演会、懇親会まで、総会参加に必要な情報を整理。',
    image: lunchImage,
  },
  {
    id: 'board',
    label: 'RECORD',
    title: '第40回理事会議事要録',
    copy: '議事の流れと承認事項を、要点ごとに読みやすく再編集。',
    image: jumpRopeImage,
  },
  {
    id: 'activities',
    label: 'PLAN',
    title: '事業報告・事業計画',
    copy: '令和7年度の活動と令和8年度の計画を、カード単位で確認できます。',
    image: activityImage,
  },
  {
    id: 'finance',
    label: 'FINANCE',
    title: '決算報告・予算案',
    copy: '会計資料をスマートフォンでも追いやすいテーブルカードに再構成。',
    image: hasuiImage,
  },
  {
    id: 'editor',
    label: 'EDITOR',
    title: '編集後記',
    copy: 'デジタル化の背景、会員へのお願い、事務局連絡先をまとめました。',
    image: lunchImage,
  },
];

const articles: Article[] = [
  {
    id: 'cover',
    label: '巻頭言',
    title: '茨城大学 半世紀の想い出',
    author: '茨城大学文理・人文学部同窓会 理事　木戸 之都子（人文・文10回卒）',
    lead:
      '入学から50年。学生運動の名残、人文図書室の歩み、古文書整理、そして同窓会名簿づくりまで、茨城大学と歩んだ半世紀の記録です。',
    paragraphs: [
      '私が茨城大学人文学部文学科に入学したのは1976年のことでした。卒業後は人文学部に就職し、2023年に定年退職しましたが、その後も非常勤講師やアルバイト等で現在も茨城大学と関わっています。今年は入学してからちょうど50年目になり、光陰矢の如し、とはよくいったもので、過去の出来事や記憶が懐かしく思い出され、感慨深いです。',
      '入学当時の最初の記憶は1年生の授業の始まる直前にいきなり教室にやってきて教卓で演説していく上級生や廊下に散乱するビラやキャンパス内の立て看など、学生運動の名残りを感じたことでした。人文学部文学科の1年生は60名で、同じ専攻だけでなく専攻を超えた繋がりが強かったように感じます。',
      '卒業後の1981年、人文学部助手として人文図書室に職を得て、人文図書室分室という1スパンの狭いスペースが私の部屋になりました。当時、人文図書室運営委員長だった東敏雄教授の「学部独自の図書室を充実させていく」という理念の元、それまで社会系と文系に分かれていた人文図書室が1984年増築された人文B棟に新たな人文図書室として統合新設されました。',
      '人文系の専門的参考図書を収集し、人文学部の教員・学生への支援サービスを積極的に行った結果、人文図書室の蔵書数は図書約20,000冊、雑誌約1,000誌になり、パソコン20台等を所有し、学生の文献情報検索の技術向上のためにガイダンスも実施してきました。',
      'また、1983年度以降の卒業論文の情報を収集し、データベース化して閲覧に供しています。しかし、残念ながら当初の職員3名が1名までに減少し、予算の縮小等もあり、2021年に人文図書室は廃止されました。ただし、その機能は大幅に縮小して2022年、2スパンの学部共同資料室に姿をかえました。',
      '図書館所蔵古文書の関わりも茨城大学の大事な思い出です。当時、人文図書室運営委員だった河内八郎教授からのお誘いで図書館所蔵の郷土資料の整備に関わり、古文書のくずし字に触れるきっかけになりました。現在もボランティアで図書館所蔵の近世村方文書の史料整理にささやかながら関わっています。',
      '1982年に設立された文理・人文学部同窓会には設立準備段階から加わり、私の担当は同窓会名簿作成でした。同窓会名簿は今年の発行で10冊目になりますが、2003年に個人情報保護法が制定されてから卒業生の住所や勤務先を把握するのがとくに困難になり、試行錯誤を繰り返しながら発行を重ねた記憶があります。',
      '同窓会費が入学時に徴収する方式になってから現在の同窓会加入率は95％になっていると聞きます。設立当初は同窓会への理解がなかなか得られず、加入率も30％と伸び悩んでいて、現在と比べると隔世の感があります。',
      '今後も文理・人文学部同窓会が学部や大学との連携を密接にとりながら、茨城大学の発展に寄与するとともに同窓生同士の交流を活発に行っていくことを期待しています。',
    ],
  },
  {
    id: 'greeting',
    label: '学部長挨拶',
    title: '同窓会の皆様へ',
    author: '同窓会名誉会長・人文社会科学部長　蓮井 誠一郎',
    lead:
      '新学部長就任に際し、学部教育の現在と未来、テクノロジー時代における「カレッジ」の再構築について語ります。',
    paragraphs: [
      '同窓会の皆様には、様々なご支援、ご協力、お気遣いを日頃より賜っております。学部を代表しまして、御礼申し上げます。',
      '今春、人文社会科学部長・学野長・研究科長に就任いたしました。責任の重さを感じながら、学部の新しい姿を構想しつつ、社会の期待に応えられるように改革を着実に進めるために準備を重ねております。',
      '私の専門は国際政治学と平和学で、環境問題と安全保障との関連を軸に研究してきました。急激な変化をふまえて、新しい適応力のあるライフスタイルや価値観をもった市民をどう育成して世に送り出すべきか、議論し考える日々です。',
      '対面授業が増え、大学も賑わいを取り戻しています。他方で、より優秀な人物を惹きつけるためには、魅力的な職場・学び場作りが不可欠です。教職員や学生の多様性に基づき、生活上のバランスを確保することが重要です。',
      '大学院では来年度から文部科学省に採択された「ダイバーシティ地域共創プログラム」の学位プログラム化を行います。',
      '地方国立大学の厳しい大学財政事情から、教員の減少傾向は続いており、総合人文社会系学部としての強みをどう活かし弱みをカバーしていくかが課題となっております。',
      '急速に発達したオンライン会議の技術は、資料のペーパレス化、教員や学生の居場所に捕らわれない自由な授業実施を可能にしました。他方で、同じ空気を共有する対面の機会は減少し、人間関係は変化しています。',
      '私は学部長就任後の最初の教授会にて、「学部（カレッジ）の再構築」を掲げました。テクノロジーを活用しながら、豊かな心のやりとりをいかに追求するかを考えるべきと信じています。',
      '当学部には「市民共創教育研究センター」があり、学部教員がメンバーです。このような場を活かして、多種多様な交流をつくり、これからの学部について議論して参りたいと存じます。',
      '最後になりましたが同窓生の皆様のご発展を祈念しつつ、学部への引き続きのご支援ならびにご協力をお願いするとともに、私たちをお見守りくださいますようお願い申し上げます。',
    ],
  },
  {
    id: 'iop',
    label: '学生寄稿',
    title: 'ひたちなか市における子どもの居場所づくり',
    author: '茨城大学人文社会科学部4年　中塩 紗矢香',
    lead:
      '不登校児童・生徒を支える地域の現場で、学校外の「第三の居場所」が果たす役割を学んだiOP活動報告です。',
    paragraphs: [
      '私は将来教員を志しており、今回のiOPを通じて、学校という枠組みの外側から子どもたちの実態を見つめたいと考え、NPO法人「ただいま」での活動を決めました。',
      '近年増加する不登校児童・生徒がどのような思いを抱え、学校以外の「第三の居場所」がどう機能しているのかを当事者の目線で理解し、教員としての土台を築くことを目標に、現場での実践を通じて学びを深めました。',
      '2024年9月から現在に至るまで、ひたちなか市のフリースクール「ふらっと」や放課後の居場所「てらこや」にて週1回のスタッフ業務を行いました。',
      '主な役割は子どもたちの遊び相手や見守り、環境整備でしたが、学校提出用の活動報告書の執筆補助など、地域と学校を繋ぐ実務にも携わりました。',
      '活動を通じて、一人ひとりの特性に応じた「個別最適な支援」の重要性を痛感しました。不登校の背景には発達特性への無理解や家庭環境など多様な要因が潜んでおり、画一的な対応は通用しないということを学びました。',
      '表面的な行動の裏にある「見えない背景」を多角的に想像し、試行錯誤しながら寄り添う中で、子どもが社会との繋がりを再構築していく姿を目の当たりにしたことは大きな成果であったと感じております。',
      'この経験を糧に、将来は学校の中だけで完結せず、地域の活動とも密に連携しながら、多様な特性を持つ子どもたち一人ひとりに寄り添える教員を目指します。',
      '大学内では学べない地域の実情に触れることができ、実りの多いiOP活動となりました。',
    ],
  },
];

const meetingDetails = [
  ['日時', '令和8年7月18日（土）午後1時30分から3時30分まで（受付は午後1時から）'],
  ['場所', 'つくば市吾妻1-1364-1　ホテル日航つくば（TXつくば駅下車5分）'],
  ['議題', '決算・事業報告、予算・事業計画、その他'],
  ['講演会', '講師　茨城大学 学長　佐川 泰弘 氏'],
  ['懇親会', '総会、講演会終了後、午後3時30分まで（会費 5,000円）'],
  ['連絡先', 'Tel: 029-228-8546 / 090-3100-5814（鈴木）　E-mail: ibadai.bj.dousou@gmail.com'],
];

const boardMinutes = [
  '第40回理事会は令和7年7月19日（土）13:30から16:20まで、水戸京成ホテルで開催され、40名が出席しました。',
  '大和田一雄会長の挨拶、原口名誉会長による学部の現況を含む挨拶の後、会長が議長となり、書記と議事録署名人が委嘱されました。',
  '令和6年度事業活動報告並びに決算報告について、監査報告を受けたうえで原案のとおり承認されました。',
  '令和7年度事業計画並びに予算について、「イバダイ・サステナ・パートナーズ（略称：イバサス）」への参加を含めて説明があり、原案のとおり承認されました。',
  '「イバサス」の創設に伴う学生個人情報等の共同利用に関する覚書締結を受け、個人情報保護方針の改正が承認されました。',
  '校歌斉唱、閉会宣言の後、石井宏典人文社会科学部教授による「都市で故郷を編む　沖縄・シマからの移動と回帰」の講演が行われました。',
  '理事会終了後は懇親会が行われ、盛会裏に散会となりました。',
];

const activityReports = [
  {
    title: '令和7年度事業報告',
    rows: [
      ['第40回理事会', '令和7年7月19日', '水戸市内の京成ホテルで開催'],
      ['役員会・幹事会', '令和7年7月8日 / 令和8年3月5日', '役員会と幹事会を合同開催'],
      ['母校及び学生支援事業ならびに組織活動', '通期事業', '地域連携事業講座、茨城の魅力を探求し発信する高校生コンテスト、大学基金、同窓会連合会、イバサス、ホームカミングデー、学部後援会等と連携'],
      ['会報第42号発行', '令和7年6月', '会員ならびに大学等関係先に配布（送付部数7,500部）'],
      ['会員拡充活動', '通期事業', '新入学生への入会勧誘を大学と連携して実施。ホームページを随時更新し、内容充実を図った'],
    ],
  },
  {
    title: '令和8年度事業計画（案）',
    rows: [
      ['第18回総会・第41回理事会', '令和8年7月18日', 'つくば市内のホテル日航つくばで開催予定'],
      ['役員会・幹事会', '令和8年6月26日 / 12月18日 / 令和9年3月12日', '必要に応じ開催。役員会と幹事会を合同開催'],
      ['母校及び学生支援事業ならびに組織活動', '通期事業', '地域連携事業講座、いば探協賛、大学基金、第9回学生懸賞論文、同窓会連合会、イバサス、学部後援会、ホームカミングデー、シンポジウム等への支援'],
      ['会報第43号発行', '令和8年6月', '会報のデジタル化を図る。紙媒体配布希望会員及び大学等関係先には配布（送付部数800部）'],
      ['会員拡充活動', '通期事業', '新入学生への入会勧誘を大学と連携して実施し、ホームページの内容充実に努める'],
    ],
  },
];

const financeTables: { title: string; rows: FinanceRow[] }[] = [
  {
    title: '令和7年度 一般会計決算報告',
    rows: [
      { item: '収入合計', current: '18,508,700円', previous: '予算 18,463,000円' },
      { item: '入会金', current: '3,810,000円', previous: '予算 3,800,000円', note: '入学生375名 他6名' },
      { item: '会費', current: '201,000円', previous: '予算 170,000円', note: '理事会、役員会参加者' },
      { item: '預金利息', current: '8,977円', previous: '予算 4,277円' },
      { item: '支出小計', current: '3,753,961円', previous: '予算 4,104,000円' },
      { item: '次期繰越金', current: '14,754,739円', previous: '予算 14,359,000円' },
      { item: '現金・預貯金残高', current: '14,754,739円', note: '常陽銀行、ゆうちょ銀行各口座合計' },
    ],
  },
  {
    title: '令和7年度 学生表彰特別会計決算報告',
    rows: [
      { item: '収入合計', current: '52,652円', previous: '予算 52,600円' },
      { item: '預金利息', current: '93円', previous: '予算 41円' },
      { item: '支出合計', current: '0円', previous: '予算 0円' },
      { item: '次期繰越金', current: '52,652円', previous: '予算 52,600円' },
      { item: '現金・預貯金残高', current: '52,652円', note: '常陽銀行普通預金36,150円、ゆうちょ銀行通常貯金16,502円' },
    ],
  },
  {
    title: '令和8年度 一般会計予算（案）',
    rows: [
      { item: '収入合計', current: '18,519,000円', previous: '7年度予算 18,463,000円' },
      { item: '入会金', current: '3,600,000円', previous: '7年度予算 3,800,000円', note: '@10,000円×360名を見込む' },
      { item: '大学支援事業費', current: '350,000円', previous: '7年度予算 800,000円' },
      { item: '学生支援事業費', current: '570,000円', previous: '7年度予算 260,000円', note: '学生懸賞論文拠出金・いば探事業協賛金等' },
      { item: '支出小計', current: '3,744,000円', previous: '7年度予算 4,104,000円' },
      { item: '次期繰越金', current: '14,775,000円', previous: '7年度予算 14,359,000円' },
    ],
  },
  {
    title: '令和8年度 学生表彰特別会計予算（案）',
    rows: [
      { item: '収入合計', current: '819,000円', previous: '7年度予算 52,600円' },
      { item: '同窓会拠出金', current: '382,000円', previous: '7年度予算 0円', note: '総費用を後援会と同窓会で折半' },
      { item: '後援会負担金', current: '382,000円', previous: '7年度予算 0円' },
      { item: '入賞者賞金', current: '330,000円', previous: '7年度予算 0円', note: '最優秀賞金10万円ほか' },
      { item: '入選論文集印刷費', current: '300,000円', previous: '7年度予算 0円', note: '120部' },
      { item: '次期繰越金', current: '3,000円', previous: '7年度予算 52,600円' },
    ],
  },
];

const editorParagraphs = [
  '今年度は、第18回総会開催の年です。7月18日（土）につくば市吾妻の「ホテル日航つくば」で開催することといたしました。立地的には、TXつくば駅から徒歩3分の場所にあります。東京方面からは大変便利なところです。',
  '会報の5ページに詳細は記載してありますので、会員の皆様方におかれましては、是非ご出席下さいますようお願い申し上げます。出席していただける場合には、出席申込をメール等によりましてご連絡いただけると助かります。',
  '今年に入りまして、第4代会長の野口芳男氏、文理学部政経学科第1回生で元人文学部教授の村松司叙氏、元人文学部教授で金沢大学名誉教授の中島史雄氏がそれぞれお亡くなりになりました。御三方には生前大変お世話になりました。紙面をお借りして、衷心よりご冥福をお祈り申し上げます。',
  '会報も今回発行の第43号から、デジタル化を図りました。一部の方には紙媒体でお送りいたしましたが、会員の皆様方には、ハガキでQRコードをお送りいたしましたので、スマートフォン等でご覧いただけるようになりました。',
  '郵送料が値上げされたことがきっかけですが、現役の学生を始めとする若い会員の方々に気軽に読んでいただけるように考え、変更しました。',
  'ご意見、ご要望等がございましたらご遠慮なく事務局までお申しつけ下さい。また、ホームページにつきましても、随時更新しておりますが、こちらへのご意見等もお寄せください。会員の皆様、今後とも、更なるご支援、ご協力をいただけますようお願い申しあげます。（A・S）',
];

function scrollToSection(id: string) {
  document.getElementById(`magazine43-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ArticleBlock({ article, children }: { article: Article; children?: React.ReactNode }) {
  const [firstParagraph, ...restParagraphs] = article.paragraphs;

  return (
    <article
      id={`magazine43-${article.id}`}
      className="scroll-mt-6 overflow-hidden rounded-[12px] border border-stone-200 bg-white shadow-[0_22px_70px_rgba(0,32,74,0.1)]"
    >
      <div className="bg-[#00204A] px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-black tracking-[0.24em] text-[#CD9535]">ARTICLE / {article.label}</p>
          <p className="hidden text-[10px] font-black tracking-[0.28em] text-white/45 sm:block">NEWSLETTER 43</p>
        </div>
      </div>
      <div className="px-5 py-9 sm:px-8 sm:py-12">
        <div className="mb-7 flex items-center gap-3">
          <span className="rounded-full bg-[#F5F3EC] px-3 py-1 text-[10px] font-black tracking-[0.18em] text-[#00204A]">
            {article.label}
          </span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_132px]">
          <div>
            <h2 className="max-w-3xl font-serif text-4xl font-black leading-tight tracking-wide text-[#00204A] md:text-6xl">
              {article.title}
            </h2>
            {article.author && (
              <p className="mt-5 inline-flex rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-black leading-relaxed text-stone-500">
                {article.author}
              </p>
            )}
          </div>

          <div className="hidden border-l border-stone-200 pl-5 lg:block">
            <p className="text-[10px] font-black leading-6 tracking-[0.28em] text-[#CD9535] [writing-mode:vertical-rl]">
              IBADAI ALUMNI MAGAZINE
            </p>
          </div>
        </div>

        {article.lead && (
          <div className="mt-8 rounded-[10px] border border-[#CD9535]/30 bg-[#FAF7EF] p-5 sm:p-7">
            <p className="mb-3 text-[10px] font-black tracking-[0.28em] text-[#CD9535]">LEAD</p>
            <p className="text-base font-bold leading-9 tracking-wide text-stone-700">{article.lead}</p>
          </div>
        )}

        <div className="mt-10 max-w-3xl space-y-6 text-[15px] leading-9 tracking-wide text-stone-700 sm:text-base sm:leading-10">
          {firstParagraph && (
            <p className="border-b border-stone-200 pb-6 text-[17px] font-semibold leading-10 text-[#00204A]">
              {firstParagraph}
            </p>
          )}
          {restParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {children && <div className="mt-10">{children}</div>}
      </div>
    </article>
  );
}

export default function NewsletterModal({ autoOpenReady = true, onClose }: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    if (!autoOpenReady) return;

    if (!(window as any).__hasShownNewsletterThisSession) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        (window as any).__hasShownNewsletterThisSession = true;
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [autoOpenReady]);

  useEffect(() => {
    const handleOpenNewsletter = () => setIsOpen(true);
    window.addEventListener('open-newsletter', handleOpenNewsletter);
    return () => window.removeEventListener('open-newsletter', handleOpenNewsletter);
  }, []);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(false);
    window.addEventListener('open-alumni-chat', handleOpenChat);
    return () => window.removeEventListener('open-alumni-chat', handleOpenChat);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b111d]/80 p-2 backdrop-blur-sm sm:p-5">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 cursor-default"
            aria-label="会報を閉じる"
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-[94vh] w-full max-w-6xl overflow-hidden rounded-[10px] bg-[#FFFDF8] text-[#00204A] shadow-[0_32px_120px_rgba(0,0,0,0.45)]"
            id="editorial-newsletter-modal"
          >
            <aside className="hidden w-[290px] flex-shrink-0 border-r border-stone-200 bg-[#F5F3EC] p-7 lg:block">
              <div className="sticky top-0">
                <div className="mb-8">
                  <p className="text-[11px] font-bold tracking-[0.28em] text-[#CD9535]">ALUMNI MAGAZINE</p>
                  <h2 className="mt-3 font-serif text-4xl font-black leading-none text-[#00204A]">第43号</h2>
                  <p className="mt-3 text-xs font-semibold leading-6 text-stone-500">2026年6月発行 / WEBマガジン版</p>
                </div>

                <nav className="space-y-2" aria-label="会報第43号 目次">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="group flex w-full items-center gap-3 rounded-[6px] border border-transparent px-3 py-3 text-left transition hover:border-[#CD9535]/30 hover:bg-white"
                    >
                      <span className="w-11 text-[10px] font-black tracking-widest text-[#CD9535]">{item.label}</span>
                      <span className="flex-1 text-xs font-bold leading-5 text-stone-700 group-hover:text-[#00204A]">
                        {item.title}
                      </span>
                      <ChevronRight className="h-4 w-4 text-stone-300" />
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur md:px-7">
                <button
                  onClick={() => setIsTocOpen((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-[11px] font-bold tracking-widest text-[#00204A] lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                  目次
                </button>
                <div className="hidden items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-stone-400 md:flex">
                  <BookOpen className="h-4 w-4 text-[#CD9535]" />
                  IBARAKI UNIVERSITY LIBERAL ARTS & HUMANITIES ALUMNI
                </div>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 rounded-full bg-[#00204A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#CD9535]"
                >
                  閉じる
                  <X className="h-4 w-4" />
                </button>
              </div>

              {isTocOpen && (
                <div className="border-b border-stone-200 bg-[#F5F3EC] p-4 lg:hidden">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {tocItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          scrollToSection(item.id);
                          setIsTocOpen(false);
                        }}
                        className="rounded-[6px] bg-white px-3 py-3 text-left text-xs font-bold text-[#00204A]"
                      >
                        <span className="mr-2 text-[#CD9535]">{item.label}</span>
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <main className="overflow-y-auto">
                <section
                  id="magazine43-cover"
                  className="relative overflow-hidden bg-[#F5F3EC] px-5 py-14 md:px-10 lg:px-14 lg:py-20"
                >
                  <div className="absolute right-8 top-8 hidden text-[120px] font-black leading-none text-white/70 md:block">
                    43
                  </div>
                  <div className="relative max-w-4xl">
                    <p className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black tracking-[0.24em] text-[#CD9535]">
                      同窓会報 第43号 / 2026年6月
                    </p>
                    <h1 className="font-serif text-4xl font-black leading-tight tracking-wide text-[#00204A] md:text-6xl">
                      茨城大学文理・人文学部同窓会
                      <br />
                      WEBマガジン
                    </h1>
                    <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-stone-600">
                      半世紀の記憶、新学部長の挨拶、学生の地域実践、総会案内、理事会記録、事業・会計報告まで。第43号の内容を、スマートフォンでも読みやすい縦長記事として再編集しました。
                    </p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      {[
                        ['発行', '茨城大学文理・人文学部同窓会'],
                        ['所在地', '〒310-8512 水戸市文京2-1-1'],
                        ['連絡先', '029-228-8546 / ibadai.bj.dousou@gmail.com'],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-[8px] border border-stone-200 bg-white p-4">
                          <p className="text-[10px] font-black tracking-widest text-[#CD9535]">{label}</p>
                          <p className="mt-2 text-xs font-bold leading-5 text-stone-700">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="mx-auto max-w-5xl px-5 py-12 md:px-10">
                  <section className="mb-12">
                    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[11px] font-black tracking-[0.28em] text-[#CD9535]">FEATURE INDEX</p>
                        <h2 className="mt-2 font-serif text-3xl font-black text-[#00204A] md:text-5xl">
                          記事カードから読む
                        </h2>
                      </div>
                      <p className="max-w-sm text-sm font-semibold leading-7 text-stone-500">
                        第43号の内容をセクションごとの記事カードに整理しました。気になる記事から読み進められます。
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {magazineCards.map((card, index) => (
                        <button
                          key={card.id}
                          onClick={() => scrollToSection(card.id)}
                          className={`group overflow-hidden rounded-[10px] border border-stone-200 bg-white text-left shadow-[0_16px_42px_rgba(0,32,74,0.08)] transition hover:-translate-y-1 hover:border-[#CD9535]/50 hover:shadow-[0_22px_58px_rgba(0,32,74,0.13)] ${
                            index === 0 ? 'md:col-span-2 md:grid md:grid-cols-[1.05fr_0.95fr]' : ''
                          }`}
                        >
                          <span className={`relative block overflow-hidden ${index === 0 ? 'h-64 md:h-full' : 'h-48'}`}>
                            <img src={card.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                            <span className="absolute inset-0 bg-linear-to-t from-[#00132C]/65 via-[#00132C]/10 to-transparent" />
                            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black tracking-[0.22em] text-[#CD9535]">
                              {card.label}
                            </span>
                          </span>
                          <span className="flex min-h-[220px] flex-col justify-between p-5 sm:p-6">
                            <span>
                              <span className="mb-4 block h-[2px] w-10 bg-[#CD9535]" />
                              <span className="block font-serif text-2xl font-black leading-tight text-[#00204A]">
                                {card.title}
                              </span>
                              <span className="mt-4 block text-sm font-semibold leading-7 text-stone-600">
                                {card.copy}
                              </span>
                            </span>
                            <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-black tracking-[0.22em] text-[#00204A]">
                              READ ARTICLE
                              <ArrowRight className="h-4 w-4 text-[#CD9535] transition group-hover:translate-x-1" />
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <div className="space-y-8">
                  <ArticleBlock article={articles[0]}>
                    <div className="grid gap-3 rounded-[10px] bg-[#00204A] p-5 text-white shadow-[0_18px_45px_rgba(0,32,74,0.18)] sm:grid-cols-2">
                      <div className="flex gap-3">
                        <CalendarDays className="mt-1 h-5 w-5 flex-shrink-0 text-[#CD9535]" />
                        <p className="text-sm font-bold leading-7">第18回総会開催：2026年7月18日（土）</p>
                      </div>
                      <div className="flex gap-3">
                        <Landmark className="mt-1 h-5 w-5 flex-shrink-0 text-[#CD9535]" />
                        <p className="text-sm font-bold leading-7">ホームカミングデー2026：2026年10月10日（土）開催</p>
                      </div>
                    </div>
                  </ArticleBlock>

                  <ArticleBlock article={articles[1]}>
                    <figure className="overflow-hidden rounded-[10px] border border-stone-200 bg-white shadow-[0_18px_48px_rgba(0,32,74,0.08)]">
                      <img src={hasuiImage} alt="蓮井誠一郎 学部長" className="h-[360px] w-full object-cover object-top" />
                      <figcaption className="border-t border-stone-200 bg-[#F5F3EC] px-5 py-4 text-xs font-bold text-stone-500">
                        蓮井誠一郎 人文社会科学部長
                      </figcaption>
                    </figure>
                  </ArticleBlock>

                  <ArticleBlock article={articles[2]}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        [homeworkImage, 'てらこやで宿題をする様子'],
                        [jumpRopeImage, 'てらこやで大縄跳びをする様子'],
                        [lunchImage, '「ふらっと」でのお昼ご飯の様子'],
                        [activityImage, '「ふらっと」での活動の様子'],
                      ].map(([src, caption]) => (
                        <figure
                          key={caption}
                          className="overflow-hidden rounded-[10px] border border-stone-200 bg-white shadow-[0_16px_42px_rgba(0,32,74,0.08)]"
                        >
                          <img src={src} alt={caption} className="h-60 w-full object-cover" />
                          <figcaption className="border-t border-stone-200 bg-[#F5F3EC] px-4 py-3 text-xs font-bold text-stone-500">
                            {caption}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </ArticleBlock>

                  <section id="magazine43-meeting" className="scroll-mt-6 overflow-hidden rounded-[10px] border border-stone-200 bg-white shadow-[0_18px_50px_rgba(0,32,74,0.08)]">
                    <div className="border-b border-stone-200 bg-[#F5F3EC] px-5 py-4 sm:px-8">
                      <p className="text-[10px] font-black tracking-[0.24em] text-[#CD9535]">ARTICLE / 総会</p>
                    </div>
                    <div className="px-5 py-8 sm:px-8 sm:py-10">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="rounded-full bg-[#00204A] px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white">
                        総会
                      </span>
                      <span className="h-px flex-1 bg-stone-200" />
                    </div>
                    <h2 className="font-serif text-3xl font-black text-[#00204A] md:text-5xl">第18回総会の開催について</h2>
                    <p className="mt-6 text-[15px] leading-9 text-stone-700">
                      会則第9条により、第18回総会を下記のとおり開催します。今年度は開催場所がつくば市内に変わりました。総会終了後には講演会と懇親会を予定しています。
                    </p>
                    <div className="mt-8 overflow-hidden rounded-[10px] border border-stone-200 shadow-[0_16px_42px_rgba(0,32,74,0.08)]">
                      {meetingDetails.map(([label, value]) => (
                        <div key={label} className="grid border-b border-stone-200 last:border-b-0 md:grid-cols-[150px_1fr]">
                          <div className="bg-[#F5F3EC] px-5 py-4 text-xs font-black tracking-widest text-[#CD9535]">
                            {label}
                          </div>
                          <div className="bg-white px-5 py-4 text-sm font-semibold leading-7 text-stone-700">{value}</div>
                        </div>
                      ))}
                    </div>
                    </div>
                  </section>

                  <section id="magazine43-board" className="scroll-mt-6 overflow-hidden rounded-[10px] border border-stone-200 bg-white shadow-[0_18px_50px_rgba(0,32,74,0.08)]">
                    <div className="border-b border-stone-200 bg-[#F5F3EC] px-5 py-4 sm:px-8">
                      <p className="text-[10px] font-black tracking-[0.24em] text-[#CD9535]">ARTICLE / 記録</p>
                    </div>
                    <div className="px-5 py-8 sm:px-8 sm:py-10">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="rounded-full bg-[#00204A] px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white">
                        記録
                      </span>
                      <span className="h-px flex-1 bg-stone-200" />
                    </div>
                    <h2 className="font-serif text-3xl font-black text-[#00204A] md:text-5xl">第40回理事会議事要録</h2>
                    <div className="mt-8 space-y-4">
                      {boardMinutes.map((minute, index) => (
                        <div
                          key={minute}
                          className="flex gap-4 rounded-[10px] border border-stone-200 bg-[#FAF7EF] p-4 shadow-[0_12px_30px_rgba(0,32,74,0.06)]"
                        >
                          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#00204A] text-xs font-black text-white">
                            {index + 1}
                          </span>
                          <p className="text-sm font-semibold leading-7 text-stone-700">{minute}</p>
                        </div>
                      ))}
                    </div>
                    </div>
                  </section>

                  <section id="magazine43-activities" className="scroll-mt-6 overflow-hidden rounded-[10px] border border-stone-200 bg-white shadow-[0_18px_50px_rgba(0,32,74,0.08)]">
                    <div className="border-b border-stone-200 bg-[#F5F3EC] px-5 py-4 sm:px-8">
                      <p className="text-[10px] font-black tracking-[0.24em] text-[#CD9535]">ARTICLE / 事業</p>
                    </div>
                    <div className="px-5 py-8 sm:px-8 sm:py-10">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="rounded-full bg-[#00204A] px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white">
                        事業
                      </span>
                      <span className="h-px flex-1 bg-stone-200" />
                    </div>
                    <h2 className="font-serif text-3xl font-black text-[#00204A] md:text-5xl">
                      令和7年度事業報告・令和8年度事業計画
                    </h2>
                    <div className="mt-8 grid gap-6">
                      {activityReports.map((report) => (
                        <div
                          key={report.title}
                          className="rounded-[10px] border border-stone-200 bg-white p-5 shadow-[0_16px_42px_rgba(0,32,74,0.08)]"
                        >
                          <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-[#00204A]">
                            <ScrollText className="h-5 w-5 text-[#CD9535]" />
                            {report.title}
                          </h3>
                          <div className="space-y-3">
                            {report.rows.map(([item, date, body]) => (
                              <div key={item} className="rounded-[8px] bg-[#FAF7EF] p-4">
                                <p className="text-sm font-black text-[#00204A]">{item}</p>
                                <p className="mt-1 text-xs font-bold text-[#CD9535]">{date}</p>
                                <p className="mt-2 text-sm leading-7 text-stone-700">{body}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    </div>
                  </section>

                  <section id="magazine43-finance" className="scroll-mt-6 overflow-hidden rounded-[10px] border border-stone-200 bg-white shadow-[0_18px_50px_rgba(0,32,74,0.08)]">
                    <div className="border-b border-stone-200 bg-[#F5F3EC] px-5 py-4 sm:px-8">
                      <p className="text-[10px] font-black tracking-[0.24em] text-[#CD9535]">ARTICLE / 会計</p>
                    </div>
                    <div className="px-5 py-8 sm:px-8 sm:py-10">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="rounded-full bg-[#00204A] px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white">
                        会計
                      </span>
                      <span className="h-px flex-1 bg-stone-200" />
                    </div>
                    <h2 className="font-serif text-3xl font-black text-[#00204A] md:text-5xl">決算報告・予算案</h2>
                    <p className="mt-6 text-sm leading-8 text-stone-600">
                      会報第43号掲載の決算・予算資料を、スマートフォンで読みやすい主要項目テーブルとして再構成しました。
                    </p>
                    <div className="mt-8 grid gap-6">
                      {financeTables.map((table) => (
                        <div
                          key={table.title}
                          className="overflow-hidden rounded-[10px] border border-stone-200 bg-white shadow-[0_16px_42px_rgba(0,32,74,0.08)]"
                        >
                          <div className="flex items-center gap-3 bg-[#00204A] px-5 py-4 text-white">
                            <ReceiptText className="h-5 w-5 text-[#CD9535]" />
                            <h3 className="text-sm font-black tracking-wide">{table.title}</h3>
                          </div>
                          <div className="divide-y divide-stone-200">
                            {table.rows.map((row) => (
                              <div key={`${table.title}-${row.item}`} className="grid gap-2 px-5 py-4 md:grid-cols-[1.2fr_1fr_1fr]">
                                <p className="text-sm font-black text-[#00204A]">{row.item}</p>
                                <p className="text-sm font-bold text-stone-800">{row.current}</p>
                                <p className="text-xs font-semibold leading-6 text-stone-500">{row.note || row.previous}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    </div>
                  </section>

                  <section id="magazine43-editor" className="scroll-mt-6 overflow-hidden rounded-[10px] border border-stone-200 bg-white shadow-[0_18px_50px_rgba(0,32,74,0.08)]">
                    <div className="border-b border-stone-200 bg-[#F5F3EC] px-5 py-4 sm:px-8">
                      <p className="text-[10px] font-black tracking-[0.24em] text-[#CD9535]">ARTICLE / 後記</p>
                    </div>
                    <div className="px-5 py-8 sm:px-8 sm:py-10">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="rounded-full bg-[#00204A] px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white">
                        後記
                      </span>
                      <span className="h-px flex-1 bg-stone-200" />
                    </div>
                    <h2 className="font-serif text-3xl font-black text-[#00204A] md:text-5xl">編集後記</h2>
                    <div className="mt-8 space-y-5 text-[15px] leading-9 tracking-wide text-stone-700">
                      {editorParagraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="mt-8 grid gap-3 rounded-[10px] border border-[#CD9535]/25 bg-[#F5F3EC] p-5 sm:grid-cols-3">
                      <div className="flex gap-3">
                        <Phone className="mt-1 h-5 w-5 text-[#CD9535]" />
                        <p className="text-xs font-bold leading-6 text-stone-700">029-228-8546 / 090-3100-5814（鈴木）</p>
                      </div>
                      <div className="flex gap-3">
                        <Mail className="mt-1 h-5 w-5 text-[#CD9535]" />
                        <p className="break-all text-xs font-bold leading-6 text-stone-700">ibadai.bj.dousou@gmail.com</p>
                      </div>
                      <div className="flex gap-3">
                        <MapPin className="mt-1 h-5 w-5 text-[#CD9535]" />
                        <p className="text-xs font-bold leading-6 text-stone-700">水戸市文京2-1-1 茨城大学人文社会科学部内</p>
                      </div>
                    </div>
                    </div>
                  </section>
                  </div>

                  <div className="mt-14 border-t border-stone-200 pt-8 text-center">
                    <FileText className="mx-auto mb-3 h-6 w-6 text-[#CD9535]" />
                    <p className="text-xs font-bold leading-6 text-stone-500">
                      同窓会会報第43号 WEBマガジン版 / 発行 茨城大学文理・人文学部同窓会
                    </p>
                  </div>
                </div>
              </main>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
