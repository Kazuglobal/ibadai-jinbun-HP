import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Newspaper, 
  TrendingUp, 
  Laptop2, 
  Factory, 
  ShoppingCart, 
  Grid, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Users, 
  ChevronLeft,
  ArrowRight,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Globe,
  Link,
  Upload,
  Camera,
  X
} from 'lucide-react';

// Classy Grad database containing exactly 24 graduates to reach the "24 items found" requirement!
const GRADUATES_DATA = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop', // Confident smiling woman in blue blazer
    category: 'education',
    categoryLabel: '教育・行政',
    categoryBg: 'bg-[#FDFAF0]', 
    categoryBorder: 'border-[#CD9535]/30',
    categoryText: 'text-[#CD9535]',
    categoryIcon: GraduationCap,
    gradYear: '2020年卒',
    major: '社会学専攻',
    title: '地域の現場で、人と社会をつなぐ卒業生',
    quote: '地域づくりのコーディネーターとして、人や人、地域と行政をつなぐ仕事にやりがいを感じています。',
    affiliation: '茨城県庁 地域政策課 地域づくり推進係',
    name: 'A.Mさん',
    link: '#story-1'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop', // Smart smiling gentleman in suit
    category: 'media',
    categoryLabel: 'メディア・出版・広告',
    categoryBg: 'bg-[#F0F5FA]',
    categoryBorder: 'border-[#2B6CB0]/30',
    categoryText: 'text-[#2B6CB0]',
    categoryIcon: Newspaper,
    gradYear: '2018年卒',
    major: '日本語学専攻',
    title: '言葉と文化の学びを、仕事に活かす卒業生',
    quote: '出版社で編集者として、言葉の力で人の心を動かすという目標に、日々向き合っています。',
    affiliation: '株式会社◯◯出版 編集部 編集者',
    name: 'K.Tさん',
    link: '#story-2'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop', // High quality lady profile
    category: 'it',
    categoryLabel: 'IT・通信',
    categoryBg: 'bg-[#ECFDFC]',
    categoryBorder: 'border-[#0D9488]/30',
    categoryText: 'text-[#0D9488]',
    categoryIcon: Laptop2,
    gradYear: '2019年卒',
    major: '情報メディア専攻',
    title: 'テクノロジーで、人の暮らしを豊かに',
    quote: 'IT企業でプロジェクトマネージャーとして、サービスの企画・開発に携わり、社会に貢献しています。',
    affiliation: '株式会社◯◯テクノロジーズ プロジェクトマネージャー',
    name: 'R.Sさん',
    link: '#story-3'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', // Friendly finance consult guy
    category: 'finance',
    categoryLabel: '金融・コンサルティング',
    categoryBg: 'bg-[#F2EDFD]',
    categoryBorder: 'border-[#6B46C1]/30',
    categoryText: 'text-[#6B46C1]',
    categoryIcon: TrendingUp,
    gradYear: '2017年卒',
    major: '経済学専攻',
    title: '確かな提案力で、企業の成長をサポート',
    quote: '地方銀行の法人営業として、地元中小企業の資金調達や事業承継を支援し、地域経済を熱く支えています。',
    affiliation: '株式会社茨城第一銀行 営業部',
    name: 'S.Yさん',
    link: '#story-4'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop', // Manufacturing lady engineer
    category: 'manufacturer',
    categoryLabel: 'メーカー・製造',
    categoryBg: 'bg-[#FFF5F5]',
    categoryBorder: 'border-[#C53030]/30',
    categoryText: 'text-[#C53030]',
    categoryIcon: Factory,
    gradYear: '2016年卒',
    major: '応用化学専攻',
    title: 'ものづくりの未来を、新素材で拓く',
    quote: '大手化学メーカーの研究所にて、環境負荷の少ない次世代プラスチック素材の研究開発に携わっています。',
    affiliation: '東洋化学株式会社 材料開発本部',
    name: 'M.Nさん',
    link: '#story-5'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop', // Retail design guy
    category: 'service',
    categoryLabel: 'サービス・小売',
    categoryBg: 'bg-[#EEFCF5]',
    categoryBorder: 'border-[#2F855A]/30',
    categoryText: 'text-[#2F855A]',
    categoryIcon: ShoppingCart,
    gradYear: '2021年卒',
    major: '人文学専攻',
    title: '「伝える力」を磨き、最高の顧客体験を',
    quote: '旅行プランナーとして、お客様一人ひとりに合わせたカスタマイズツアー of 企画・手配を行っています。',
    affiliation: '株式会社JACトラベル 企画営業部',
    name: 'Y.Kさん',
    link: '#story-6',
    hasDiscount: true,
    discountDetails: '「同窓会サイトを見た」とお伝えいただくか、同窓会員証の提示で、特選国内・海外オーダーメイドツアーの取扱手数料を50%OFFにいたします！',
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com',
    websiteUrl: 'https://example.com/jac-travel'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=600&auto=format&fit=crop', // Museum historical girl
    category: 'other',
    categoryLabel: 'その他',
    categoryBg: 'bg-[#F2F4F8]',
    categoryBorder: 'border-[#4A5568]/30',
    categoryText: 'text-[#4A5568]',
    categoryIcon: Grid,
    gradYear: '2015年卒',
    major: '歴史・考古学専攻',
    title: '地域の記憶を紡ぎ、未来へ継承する',
    quote: '市立博物館の学芸員として、郷土史資料の調査研究や特別展の企画・運営に従事しています。',
    affiliation: '水戸市立歴史博物館 学芸推進部',
    name: 'K.Oさん',
    link: '#story-7'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop', // Classroom tutor
    category: 'education',
    categoryLabel: '教育・行政',
    categoryBg: 'bg-[#FDFAF0]',
    categoryBorder: 'border-[#CD9535]/30',
    categoryText: 'text-[#CD9535]',
    categoryIcon: GraduationCap,
    gradYear: '2019年卒',
    major: '教育社会学専攻',
    title: '子どもたちの個性を伸ばす探究学習の創出',
    quote: '中学校の社会科教諭として、生徒が主体的に地域の魅力や課題を発生・発見できるアクティブ・ラーニングを実践しています。',
    affiliation: '水戸市立第一中学校 教諭',
    name: 'T.Aさん',
    link: '#story-8'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop', // News reporter
    category: 'media',
    categoryLabel: 'メディア・出版・広告',
    categoryBg: 'bg-[#F0F5FA]',
    categoryBorder: 'border-[#2B6CB0]/30',
    categoryText: 'text-[#2B6CB0]',
    categoryIcon: Newspaper,
    gradYear: '2015年卒',
    major: '英米文学専攻',
    title: '最前線の情報を、分かりやすく届ける責任',
    quote: '地方テレビ局の記者として、事件・事故から地域の心温まるイベントまで幅広い取材・原稿執筆を担当。',
    affiliation: '茨城中央テレビ 報道局 記者',
    name: 'H.Uさん',
    link: '#story-9'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?q=80&w=600&auto=format&fit=crop', // Consultant
    category: 'finance',
    categoryLabel: '金融・コンサルティング',
    categoryBg: 'bg-[#F2EDFD]',
    categoryBorder: 'border-[#6B46C1]/30',
    categoryText: 'text-[#6B46C1]',
    categoryIcon: TrendingUp,
    gradYear: '2018年卒',
    major: '経営学科専攻',
    title: '経営の伴走者として、最適な財務計画を提案',
    quote: 'コンサルティングファームで、スタートアップ企業の財務戦略立案や資金調達のアドバイスを行っています。',
    affiliation: 'キャピタル・アドバイザーズ 経営コンサルタント',
    name: 'E.Mさん',
    link: '#story-10'
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop', // IT Designer
    category: 'it',
    categoryLabel: 'IT・通信',
    categoryBg: 'bg-[#ECFDFC]',
    categoryBorder: 'border-[#0D9488]/30',
    categoryText: 'text-[#0D9488]',
    categoryIcon: Laptop2,
    gradYear: '2020年卒',
    major: '情報科学専攻',
    title: '直感的で心地よいデジタルプロダクトの創造',
    quote: 'Webデザイナー兼フロントエンドエンジニアとして、ユーザー視点に立ったUI/UXの設計開発を担当しています。',
    affiliation: 'デジタル・フロンティア株式会社 UI開発部',
    name: 'N.Sさん',
    link: '#story-11',
    hasDiscount: true,
    discountDetails: '同窓生関係者様が個人事業・店舗ホームページ新規制作をご依頼された場合、初期費用を総額15%割引いたします！'
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop', // Factory engineering guy
    category: 'manufacturer',
    categoryLabel: 'メーカー・製造',
    categoryBg: 'bg-[#FFF5F5]',
    categoryBorder: 'border-[#C53030]/30',
    categoryText: 'text-[#C53030]',
    categoryIcon: Factory,
    gradYear: '2014年卒',
    major: '機械工学専攻',
    title: '世界に誇る日本の技術を、現場から世界へ',
    quote: '精密機械メーカーの生産技術エンジニアとして、最先端のスマート工場の立ち上げ・ライン自動化プロジェクトを牽引。',
    affiliation: '国際精機株式会社 生産技術部 主任',
    name: 'T.Iさん',
    link: '#story-12'
  },
  {
    id: 13,
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=600&auto=format&fit=crop', // Retail lifestyle coordinator
    category: 'service',
    categoryLabel: 'サービス・小売',
    categoryBg: 'bg-[#EEFCF5]',
    categoryBorder: 'border-[#2F855A]/30',
    categoryText: 'text-[#2F855A]',
    categoryIcon: ShoppingCart,
    gradYear: '2022年卒',
    major: '心理学専攻',
    title: '暮らしに寄り添う、心地良い空間提案',
    quote: 'インテリア空間デザイナーとして、個人邸宅やオフィスのリノベーションに伴うトータルコーディネートをご提案。',
    affiliation: '株式会社ライフスタイルデザイン 設計部',
    name: 'R.Oさん',
    link: '#story-13',
    hasDiscount: true,
    discountDetails: '初回インテリア・お部屋リフォームカウンセリングを特別に無償化（通常初回1万円）とし、ご成約時にセレクト照明器具をプレゼントいたします。'
  },
  {
    id: 14,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop', // International NGO guy
    category: 'other',
    categoryLabel: 'その他',
    categoryBg: 'bg-[#F2F4F8]',
    categoryBorder: 'border-[#4A5568]/30',
    categoryText: 'text-[#4A5568]',
    categoryIcon: Grid,
    gradYear: '2013年卒',
    major: '国際関係専攻',
    title: '国境を越え、平和的な多文化共共生を築く',
    quote: '国際協力NGOのスタッフとして、開発途上国での教育支援プロジェクトや、国内の在住外国人サポートを主導。',
    affiliation: 'グローバル・パートナーズ 国際開発マネージャー',
    name: 'S.Hさん',
    link: '#story-14'
  },
  {
    id: 15,
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=600&auto=format&fit=crop', // City councillor/admin lady
    category: 'education',
    categoryLabel: '教育・行政',
    categoryBg: 'bg-[#FDFAF0]',
    categoryBorder: 'border-[#CD9535]/30',
    categoryText: 'text-[#CD9535]',
    categoryIcon: GraduationCap,
    gradYear: '2017年卒',
    major: '行政法専攻',
    title: '市民の暮らしを支え、より良い街づくりを',
    quote: '市役所の企画課にて、市民協働によるコミュニティ活性化プロジェクトや防災計画の策定を推進。',
    affiliation: '水戸市役所 企画政策部 政策企画課',
    name: 'Y.Mさん',
    link: '#story-15'
  },
  {
    id: 16,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop', // Branding visual guy
    category: 'media',
    categoryLabel: 'メディア・出版・広告',
    categoryBg: 'bg-[#F0F5FA]',
    categoryBorder: 'border-[#2B6CB0]/30',
    categoryText: 'text-[#2B6CB0]',
    categoryIcon: Newspaper,
    gradYear: '2016年卒',
    major: '視覚デザイン専攻',
    title: '物語を可視化し、心をつかむビジュアル',
    quote: 'フリーランスのグラフィックデザイナーとして、新商品のパッケージデザインや企業ロゴ、ブランディングを多数手掛ける。',
    affiliation: 'スタジオ・クリエイティブ アートディレクター',
    name: 'K.Kさん',
    link: '#story-16'
  },
  {
    id: 17,
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600&auto=format&fit=crop', // Private Banker
    category: 'finance',
    categoryLabel: '金融・コンサルティング',
    categoryBg: 'bg-[#F2EDFD]',
    categoryBorder: 'border-[#6B46C1]/30',
    categoryText: 'text-[#6B46C1]',
    categoryIcon: TrendingUp,
    gradYear: '2014年卒',
    major: '経済史専攻',
    title: '資産形成のパートナーとして信頼を紡ぐ',
    quote: '証券会社のプライベートバンカーとして、個人富裕層やオーナー企業の長期的な資産保全と運用戦略を伴走サポート。',
    affiliation: '桜証券株式会社 ウェルスマネジメント部',
    name: 'I.Tさん',
    link: '#story-17'
  },
  {
    id: 18,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop', // Data scientist lady
    category: 'it',
    categoryLabel: 'IT・通信',
    categoryBg: 'bg-[#ECFDFC]',
    categoryBorder: 'border-[#0D9488]/30',
    categoryText: 'text-[#0D9488]',
    categoryIcon: Laptop2,
    gradYear: '2021年卒',
    major: '認知科学専攻',
    title: 'データから、まだ見ぬ顧客のニーズを読み解く',
    quote: 'データサイエンティストとして、大手ECサイトの購買ビッグデータを解析し、マーケティング施策に活かすAIモデルを作成。',
    affiliation: 'フューチャー・アナリティクス株式会社 AI解析チーム',
    name: 'A.Oさん',
    link: '#story-18'
  },
  {
    id: 19,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop', // Food manufacturer
    category: 'manufacturer',
    categoryLabel: 'メーカー・製造',
    categoryBg: 'bg-[#FFF5F5]',
    categoryBorder: 'border-[#C53030]/30',
    categoryText: 'text-[#C53030]',
    categoryIcon: Factory,
    gradYear: '2015年卒',
    major: '生物環境専攻',
    title: '自然の恵みを活かした、安全な食品づくり',
    quote: '食品メーカーの商品開発部にて、茨城県産の特産果実をたっぷり使用した新スイーツの規格開発および試作設計を担当。',
    affiliation: '茨城フード＆ナチュラル 開発コアチーム',
    name: 'M.Yさん',
    link: '#story-19'
  },
  {
    id: 20,
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=600&auto=format&fit=crop', // Bridal coordinator
    category: 'service',
    categoryLabel: 'サービス・小売',
    categoryBg: 'bg-[#EEFCF5]',
    categoryBorder: 'border-[#2F855A]/30',
    categoryText: 'text-[#2F855A]',
    categoryIcon: ShoppingCart,
    gradYear: '2020年卒',
    major: '観光文化専攻',
    title: 'おもてなしの心で、特別な一日の演出を',
    quote: 'ブライダルコーディネーターとして、新郎新婦のイメージに合わせたオリジナルウェディングのプロデュースから演出提案。',
    affiliation: 'グランドパレス水戸 ウェディングプロデュース部',
    name: 'H.Sさん',
    link: '#story-20'
  },
  {
    id: 21,
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=600&auto=format&fit=crop', // Cafe owner guy
    category: 'other',
    categoryLabel: 'その他',
    categoryBg: 'bg-[#F2F4F8]',
    categoryBorder: 'border-[#4A5568]/30',
    categoryText: 'text-[#4A5568]',
    categoryIcon: Grid,
    gradYear: '2012年卒',
    major: '近現代史専攻',
    title: '古き良きものを、現代のスタイルに',
    quote: '古民家を再生した和菓子カフェのオーナーとして、地域の食材を用いたオリジナル創作和菓子の製造・販売を通じた観光振興。',
    affiliation: 'ゆらり庵 代表オーナー',
    name: 'J.Nさん',
    link: '#story-21',
    hasDiscount: true,
    discountDetails: '古民家和菓子カフェ「ゆらり庵」にて同窓会員様はお会計から全品10%OFF、または手作り創作和菓子を1点プレゼントいたします！',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    websiteUrl: 'https://example.com/yurarian'
  },
  {
    id: 22,
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=600&auto=format&fit=crop', // Counsellor lady
    category: 'education',
    categoryLabel: '教育・行政',
    categoryBg: 'bg-[#FDFAF0]',
    categoryBorder: 'border-[#CD9535]/30',
    categoryText: 'text-[#CD9535]',
    categoryIcon: GraduationCap,
    gradYear: '2019年卒',
    major: '心理臨床専攻',
    title: '心と身体の健康を守り、豊かな学校生活を',
    quote: 'スクールカウンセラーとして、生徒の友人関係や進路に対する悩みの相談に寄り添い、教員との連絡調整をサポート。',
    affiliation: '茨城県スクール支援センター 配置カウンセラー',
    name: 'N.Kさん',
    link: '#story-22'
  },
  {
    id: 23,
    image: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?q=80&w=600&auto=format&fit=crop', // Radio presenter
    category: 'media',
    categoryLabel: 'メディア・出版・広告',
    categoryBg: 'bg-[#F0F5FA]',
    categoryBorder: 'border-[#2B6CB0]/30',
    categoryText: 'text-[#2B6CB0]',
    categoryIcon: Newspaper,
    gradYear: '2018年卒',
    major: 'メディア表現専攻',
    title: '音と声の力で、毎日の生活に彩りを添える',
    quote: 'ラジオ番組のディレクターとして、若者向け音楽番組の構成や、地元のトレンド情報を生放送で発信する役割を担う。',
    affiliation: 'エフエム茨城 制作部 ディレクター',
    name: 'Y.Fさん',
    link: '#story-23'
  },
  {
    id: 24,
    image: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=600&auto=format&fit=crop', // Network IT engineer guy
    category: 'it',
    categoryLabel: 'IT・通信',
    categoryBg: 'bg-[#ECFDFC]',
    categoryBorder: 'border-[#0D9488]/30',
    categoryText: 'text-[#0D9488]',
    categoryIcon: Laptop2,
    gradYear: '2022年卒',
    major: '情報通信専攻',
    title: '未来の通信システムを陰から支える誇り',
    quote: 'ネットワークエンジニアとして、企業内のセキュアなイントラネットインフラの構築や、保守管理サービスにあたっています。',
    affiliation: 'ネットワンテクノロジーズ ネットワーク事業部',
    name: 'M.Tさん',
    link: '#story-24'
  }
];

// Available Filter Categories mapping
const CATEGORY_TABS = [
  { id: 'all', label: 'すべて', icon: null },
  { id: 'education', label: '教育・行政', icon: GraduationCap },
  { id: 'media', label: 'メディア・出版・広告', icon: Newspaper },
  { id: 'finance', label: '金融・コンサルティング', icon: TrendingUp },
  { id: 'it', label: 'IT・通信', icon: Laptop2 },
  { id: 'manufacturer', label: 'メーカー・製造', icon: Factory },
  { id: 'service', label: 'サービス・小売', icon: ShoppingCart },
  { id: 'other', label: 'その他', icon: Grid }
];

// Dynamic helper function to generate realistic and high-fidelity interview answers
function getInterviewDetails(grad: typeof GRADUATES_DATA[0]) {
  const affiliation = grad.affiliation;
  const major = grad.major;

  let q1 = "";
  let q2 = "";
  let q3 = "";

  if (grad.category === 'education') {
    q1 = `私は現在、${affiliation}において日々業務を行っています。私の主なやりがいは、日々の取り組みが地域社会の活性化や教育現場の直接的な力へと還元されるのを実感できる点にあります。学術・行政の観点から人々の暮らしを守り、未来への礎を築く仕事には、言葉に尽くせぬ責任感と大きな誇りがあります。`;
    q2 = `大学では主に${major}を専攻し、問題意識を持って社会の構造を探究することの重要性を学びました。当時はゼミの仲間や温かい先生方と深夜まで議論を交わし、フィールドワークで茨城県内の多くの方々と出会いました。大学での多様な他者との対話や学術的な訓練こそが、現在の私の活動のバックボーンとなっています。`;
    q3 = `在学生の皆さん、文理・人文学部での学びは一見多様で、すぐに「正解」が見つからないことばかりかもしれません。しかし、その「問い続ける姿勢」こそが社会に出てから最も強い武器になります。ぜひ大学という自由な学問の場で、自分なりの問いを深く突き詰めていってください。応援しています。`;
  } else if (grad.category === 'media') {
    q1 = `日々変化する社会の出来事や言葉を扱い、伝える仕事、それが${affiliation}における私の役割です。自分が手がけた記事やメディア企画が市民に届き、「心が動かされた」「新しい視点を知ることができた」といった反響をいただいたとき、言葉の重みとこの仕事の最高の面白さを実感します。`;
    q2 = `在学中は、${major}での学びを通じて表現方法やコミュニケーション理論、そして言葉が持つ文化的な背景を深く追究しました。図書館の静かな空間での古典との対面や、ゼミ発表でのクリティカルな議論は、私の審美眼と言葉へのこだわりを育む貴重な揺りかごでした。`;
    q3 = `世界は広いフィールドであり、多角的な視点を持つことが人生を豊かにします。在学生の皆さんには、ぜひ枠にとらわれない旺盛な好奇心を大切にしてほしいと思います。本を読み、人と話し、自らの手で書き・表現することを恐れずに歩んでいってください。`;
  } else if (grad.category === 'it') {
    q1 = `${affiliation}において、最新のテクノロジーを駆使しながらプロジェクトに向き合っています。私たちが作ったサービスやソリューションが実際に稼働し、何万人ものユーザーの不便を解消。人々のライフスタイルが快適にアップデートされていく様子を目の当たりにする瞬間こそが、次の挑戦への原動力です。`;
    q2 = `茨城大学では${major}の枠組みの中で、情報技術の基礎から応用、さらにはメディア工学的なアプローチまで幅広く体験しました。研究室で泥臭くコードを書き、バグを解消しながら徹夜した思い出や、ハッカソンなどの自発的な課外活動は、今日の私の実践力を生み出す最大の学びです。`;
    q3 = `デジタル化が加速するスピードは止められませんが、その中核にいるのは常に「人」です。人文的な思考とテクノロジーは、対極にあるのではなく、互いを補完し合う関係にあります。茨大の恵まれた環境で、文理の境界を越えたイノベーティブな知性を育ててください。`;
  } else if (grad.category === 'finance') {
    q1 = `私は${affiliation}にて、日々お客様の大切な資産・事業の伴走者として経営財務コンサルティングを行っています。企業の成長や地域経済の活性化に向けて最適な資金スキームや財務戦略を提案し、経営者の方と二人三脚で困難な決断を乗り越えられた際に、深い信頼とやりがいを味わっています。`;
    q2 = `在学中は${major}を専攻し、複雑に絡み合うマクロ経済・ミクロ経済の原理やビジネスモデルの歴史的背景を丁寧に深掘りしました。机上の空論に終わらせず、常に「現在の時事問題がどう影響しているか」議論した活動は、社会の風向きを俯瞰する今の私の大局観を育ててくれました。`;
    q3 = `社会に出ると、不確実で予期せぬ状況に直面することが多々あります。そうした時にこそ、大学で身につけた論理的思考力と他者に寄り添う人間力が真価を発揮します。どうか目先のメリットだけでなく、一生ものの強みとなる「本質を見極める力」を磨いてください。`;
  } else if (grad.category === 'manufacturer') {
    q1 = `私は${affiliation}において、日本のものづくりの強みである新技術開発やバリューチェーンの設計を担っています。自分が関わった数々の製品が量産化され、世界市場へと輸出されて広く生活の一部になっていくのを見屆けるプロセスには、他には代えがたいエンジニア魂と達成感があります。`;
    q2 = `学生時代は${major}の研究室にて実験の日々を送り、データの再現性や科学的探究の方法論をたたき込まれました。時に失敗を繰り返しながらも仮説検証を積み重ね、自らの手で未知の発見に向き合う忍耐力の尊さを知る機会に。あの頃の開発に注いだ熱量と姿勢は、今の生産現場でも全く変わらずに生きています。`;
    q3 = `ものづくりは技術だけでなく、それを使ってどう社会を豊かにするかという優しさから始まります。学生の皆さんには、専門知識の向上だけではなく、幅広い教養とコミュニケーション力を同時に培ってほしいと願っています。失敗を恐れない積極的な挑戦をお待ちしています。`;
  } else {
    q1 = `私は現在、${affiliation}にて、お客様が望む最高の体験や新たなライフスタイルのコーディネートをご提案する仕事に取り組んでいます。お一人おひとりの潜在的ニーズを深く傾聴し、それらを美しく調和させた特別な時間や空間、サービスをカタチに出来たときの喜びは計り知れません。`;
    q2 = `人文社会科学部（旧人文学部）で${major}を学んだ日々は、人間の多様な価値観、思考パターン、歴史的背景を深く理解する土壌となりました。キャンパス内で育んだ温かな学生同士・教授陣との人間関係や、自主的に取り組んだ学内外の課外研究こそが、私の「おもてなしの心」と課題解決力のコアです。`;
    q3 = `キャリアを築く上で、大学で過ごす時間はとてもかけがえのないものです。知識をインプットするだけでなく、多様なフィールド（海外留学、ボランティア、インターン等）へ実際に飛び出し、五感で感じる経験をたくさん積んでください。皆さんの輝く未来を同窓会一同応援しております。`;
  }

  return { q1, q2, q3 };
}

export default function Stories() {
  // Initialize graduates from localStorage or static data
  const [graduates, setGraduates] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ibaraki_alumni_stories');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading alumni stories from localStorage:', e);
    }
    return GRADUATES_DATA;
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyWithDiscount, setOnlyWithDiscount] = useState(false);
  const itemsPerPage = 3;

  const sliderRef = React.useRef<HTMLDivElement>(null);

  // Handles sort state dropdown overlay
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Active story details selected for full-screen immersive modal experience
  const [selectedGrad, setSelectedGrad] = useState<any | null>(null);

  // --- SUBMIT MODAL ACTIONS & FIELDS ---
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formMajor, setFormMajor] = useState('');
  const [formGradYear, setFormGradYear] = useState('2024年卒');
  const [formAffiliation, setFormAffiliation] = useState('');
  const [formCategory, setFormCategory] = useState('education');
  const [formTitle, setFormTitle] = useState('');
  const [formQuote, setFormQuote] = useState('');
  
  // SNS Links
  const [formLinkedin, setFormLinkedin] = useState('');
  const [formFacebook, setFormFacebook] = useState('');
  const [formInstagram, setFormInstagram] = useState('');
  const [formX, setFormX] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  
  // Discount Tag fields
  const [formHasDiscount, setFormHasDiscount] = useState(false);
  const [formDiscountDetails, setFormDiscountDetails] = useState('');

  // Image Upload Fields
  const [formImage, setFormImage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 350;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formMajor || !formAffiliation || !formTitle || !formQuote) {
      alert('必須項目（※）をすべて入力してください。');
      return;
    }
    
    // Choose premium professional avatar photo based on Category
    const categoryImages: Record<string, string> = {
      education: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
      media: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?q=80&w=600&auto=format&fit=crop',
      finance: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
      it: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
      manufacturer: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      service: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=600&auto=format&fit=crop',
      other: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    };
    
    const pickedImage = formImage || categoryImages[formCategory] || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop';
    
    // Match Category label, bg, border, text
    const categoryMeta: Record<string, { label: string; bg: string; border: string; text: string }> = {
      education: { label: '教育・行政', bg: 'bg-[#FDFAF0]', border: 'border-[#CD9535]/30', text: 'text-[#CD9535]' },
      media: { label: 'メディア・出版・広告', bg: 'bg-[#F0F5FA]', border: 'border-[#2B6CB0]/30', text: 'text-[#2B6CB0]' },
      finance: { label: '金融・コンサルティング', bg: 'bg-[#FEFCBF]/60', border: 'border-[#D69E2E]/40', text: 'text-[#B7791F]' },
      it: { label: 'IT・通信', bg: 'bg-[#ECFDFC]', border: 'border-[#0D9488]/30', text: 'text-[#0D9488]' },
      manufacturer: { label: 'メーカー・製造', bg: 'bg-[#FFF5F5]', border: 'border-[#E53E3E]/30', text: 'text-[#E53E3E]' },
      service: { label: 'サービス・小売', bg: 'bg-[#EEFCF5]', border: 'border-[#2F855A]/30', text: 'text-[#2F855A]' },
      other: { label: 'その他', bg: 'bg-[#F2F4F8]', border: 'border-[#4A5568]/30', text: 'text-[#4A5568]' },
    };
    
    const meta = categoryMeta[formCategory] || categoryMeta.other;
    const newId = graduates.length > 0 ? Math.max(...graduates.map(g => g.id)) + 1 : 1;
    
    const newGrad = {
      id: newId,
      image: pickedImage,
      category: formCategory,
      categoryLabel: meta.label,
      categoryBg: meta.bg,
      categoryBorder: meta.border,
      categoryText: meta.text,
      gradYear: formGradYear,
      major: formMajor,
      title: formTitle,
      quote: formQuote,
      affiliation: formAffiliation,
      name: formName,
      link: `#story-${newId}`,
      hasDiscount: formHasDiscount,
      discountDetails: formHasDiscount ? formDiscountDetails : '',
      linkedinUrl: formLinkedin || undefined,
      facebookUrl: formFacebook || undefined,
      instagramUrl: formInstagram || undefined,
      xUrl: formX || undefined,
      websiteUrl: formWebsite || undefined
    };
    
    const updatedGrads = [newGrad, ...graduates];
    setGraduates(updatedGrads);
    localStorage.setItem('ibaraki_alumni_stories', JSON.stringify(updatedGrads));
    
    // Clear form and show success message
    setFormName('');
    setFormMajor('');
    setFormAffiliation('');
    setFormTitle('');
    setFormQuote('');
    setFormLinkedin('');
    setFormFacebook('');
    setFormInstagram('');
    setFormX('');
    setFormWebsite('');
    setFormHasDiscount(false);
    setFormDiscountDetails('');
    setFormImage('');
    setIsSubmitModalOpen(false);
    
    // Scroll slider back to left
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  // Reset demo list
  const handleResetDemoList = () => {
    if (window.confirm('インタビュー掲載リストをデフォルトデータにリセットしますか？')) {
      localStorage.removeItem('ibaraki_alumni_stories');
      setGraduates(GRADUATES_DATA);
    }
  };

  // Computed / filtered grads database list
  const filteredAndSortedGrads = useMemo(() => {
    let result = [...graduates];

    // 1. Category Filter block
    if (activeCategory !== 'all') {
      result = result.filter(grad => grad.category === activeCategory);
    }

    // 1.5 Discount Benefit Filter
    if (onlyWithDiscount) {
      result = result.filter(grad => grad.hasDiscount);
    }

    // 2. Multi-word Search filter text query block
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(grad => 
        grad.title.toLowerCase().includes(query) ||
        grad.quote.toLowerCase().includes(query) ||
        grad.major.toLowerCase().includes(query) ||
        grad.affiliation.toLowerCase().includes(query) ||
        grad.categoryLabel.toLowerCase().includes(query) ||
        grad.name.toLowerCase().includes(query)
      );
    }

    // 3. Simple sorting logic
    if (sortOrder === 'newest') {
      // Sort primarily by graduate year descending (e.g. 2022 -> 2012)
      result.sort((a, b) => b.id - a.id);
    } else {
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [graduates, activeCategory, onlyWithDiscount, searchQuery, sortOrder]);

  // Total pages calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedGrads.length / itemsPerPage));

  // Ensure current page does not go out of bound when filter shifts
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, onlyWithDiscount, searchQuery, sortOrder]);

  // Slice list for visual pagination
  const paginatedGrads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedGrads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedGrads, currentPage]);

  const handlePageChange = (pageNo: number) => {
    if (pageNo >= 1 && pageNo <= totalPages) {
      setCurrentPage(pageNo);
      // Soft-scroll back to results summary for good feel or keep stable
      const el = document.getElementById('stories-results-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF9F5] py-16 lg:py-24 border-t border-stone-200/40" id="stories-section" data-gsap-section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            SECTION HEADER
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-8 border-b border-stone-200/50" data-gsap-title>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7 text-left">
            {/* Elegant Section Title with Left Gold Border */}
            <div className="border-l-[3.5px] border-[#CD9535] pl-4 flex items-center h-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#00204A] tracking-wider leading-none">
                STORIES
              </h2>
            </div>
            
            {/* Classy grey sub-title explanation text */}
            <div className="flex flex-col justify-center text-stone-500 pt-1">
              <span className="font-sans font-bold text-[14px] tracking-widest leading-none">
                卒業生インタビュー
              </span>
            </div>
          </div>

          {/* Desktop/Tablet Header Search Link Trigger */}
          <div className="hidden md:flex items-center gap-1 text-stone-600 font-sans text-xs tracking-wider">
            <span>卒業生の職種・分野から探す</span>
            <Search className="w-3.5 h-3.5 ml-1 text-stone-500" />
          </div>

        </div>

        {/* Small introductory text narrative */}
        <div className="text-left text-stone-600 text-sm sm:text-[14.5px] tracking-wide leading-relaxed mb-8 max-w-3xl" data-gsap-copy>
          茨城大学文理・人文学部で学び、さまざまな分野で活躍する卒業生の声をご紹介します。
        </div>

        {/* =========================================================================
            SEARCH BAR (PIXEL APPLIED RESPONSIVE INPUT AS IN SCREENSHOTS)
            ========================================================================= */}
        <div className="mb-8 max-w-full">
          <div className="relative border border-stone-200 bg-white rounded-lg flex items-center justify-between py-3.5 px-4.5 shadow-sm hover:border-[#CD9535]/80 focus-within:border-[#CD9535] focus-within:ring-1 focus-within:ring-[#CD9535]/20 transition-all">
            <div className="flex items-center gap-3.5 w-full">
              <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="卒業生の職種・分野から探す（キーワード：社会、IT、メディア等）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm sm:text-[14.5px] text-[#00204A] bg-transparent outline-none placeholder-stone-400 font-sans"
                id="stories-search-input"
              />
            </div>
            
            <ChevronRight className="w-[18px] h-[18px] text-stone-400 hover:text-[#00204A] transition-colors flex-shrink-0 select-none" />
          </div>
        </div>

        {/* =========================================================================
            CATEGORY TABS FILTERS (Pill Layout Wrapping precisely like mockup)
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
          <nav className="flex flex-wrap items-center gap-2 sm:gap-3" aria-label="Graduate Categories Filter">
            {CATEGORY_TABS.map((tab) => {
              const IconComponent = tab.icon;
              const isTabActive = activeCategory === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`py-2.5 px-4.5 rounded-full text-xs sm:text-[13px] font-sans font-bold tracking-wider flex items-center gap-2 transition-all cursor-pointer border ${
                    isTabActive
                      ? 'bg-[#00132C] text-white border-[#00132C]'
                      : 'bg-white text-[#00204A] border-stone-200 hover:border-[#CD9535]/60 hover:text-[#CD9535]'
                  }`}
                >
                  {IconComponent && <IconComponent className="w-3.5 h-3.5 opacity-85" />}
                  <span>{tab.label}</span>
                  {tab.id === 'other' && <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />}
                </button>
              );
            })}
          </nav>

          {/* Special Toggle filter for discount benefits */}
          <button
            onClick={() => {
              setOnlyWithDiscount(!onlyWithDiscount);
              setCurrentPage(1);
            }}
            className={`py-2.5 px-4.5 rounded-full text-xs sm:text-[13px] font-sans font-bold tracking-wider flex items-center gap-2 transition-all cursor-pointer border shadow-xs select-none ${
              onlyWithDiscount
                ? 'bg-[#CD9535] text-white border-[#CD9535]'
                : 'bg-amber-50/70 text-amber-800 border-amber-200/50 hover:bg-amber-100/70 hover:text-[#CD9535] hover:border-[#CD9535]'
            }`}
          >
            <span className="text-sm">🎁</span>
            <span>お店・事業（割引特典あり）</span>
          </button>
        </div>

        {/* Results anchor for smooth pagination scroll support */}
        <div id="stories-results-anchor" className="scroll-mt-6" />

        {/* =========================================================================
            RESULTS COUNTER & SORT DROPDOWN BAR
            ========================================================================= */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-dashed border-stone-200/60">
          
          {/* Output match counter */}
          <div className="text-stone-700 font-sans text-xs sm:text-sm tracking-wider flex items-center gap-3">
            <div className="flex items-center">
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#CD9535] mr-1.5 transition-all">
                {filteredAndSortedGrads.length}
              </span>
              <span>件の卒業生インタビューが見つかりました</span>
            </div>
            {localStorage.getItem('ibaraki_alumni_stories') && (
              <button 
                onClick={handleResetDemoList}
                className="text-[10px] text-stone-400 hover:text-red-500 underline ml-2 cursor-pointer border-none bg-transparent"
              >
                (初期データにリセット)
              </button>
            )}
          </div>

          {/* Newest Sorting Dropdown menu button */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="py-2 px-4 bg-white border border-stone-200 rounded-lg text-xs sm:text-[13px] font-sans font-bold text-stone-700 tracking-wider flex items-center gap-1.5 shadow-sm hover:border-stone-300 transition-colors select-none cursor-pointer"
              aria-haspopup="listbox"
              id="stories-sort-dropdown-trigger"
            >
              <span>{sortOrder === 'newest' ? '新着順' : '卒業年順'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom overlay menu items */}
            {showSortDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-20 cursor-default" 
                  onClick={() => setShowSortDropdown(false)} 
                />
                <ul 
                  className="absolute right-0 mt-1.5 w-32 bg-white border border-stone-150 rounded-lg shadow-lg z-30 text-left overflow-hidden text-xs sm:text-[13px] font-sans font-medium"
                  role="listbox"
                >
                  <li>
                    <button
                      onClick={() => {
                        setSortOrder('newest');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full py-2.5 px-4 text-left transition-colors cursor-pointer ${
                        sortOrder === 'newest' 
                          ? 'bg-stone-50 text-[#CD9535] font-semibold' 
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      新着順
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setSortOrder('oldest');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full py-2.5 px-4 text-left transition-colors cursor-pointer ${
                        sortOrder === 'oldest' 
                          ? 'bg-stone-50 text-[#CD9535] font-semibold' 
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      卒業年順
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>

        </div>

        {/* =========================================================================
            GRADUATES INTERVIEW CARDS SLIDER (Horizontal slide with scroll snapping)
            ========================================================================= */}
        <div className="relative group/slider select-none">
          
          {/* Left Arrow Button for smooth sliding on Desktop */}
          <button 
            onClick={() => scrollSlider('left')}
            className="absolute -left-4 sm:-left-6 top-[50%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/95 border border-stone-200 shadow-lg flex items-center justify-center text-[#00204A] hover:bg-stone-50 active:scale-95 transition-all opacity-0 group-hover/slider:opacity-100 md:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#CD9535]/50 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>
          
          {/* Right Arrow Button for smooth sliding on Desktop */}
          <button 
            onClick={() => scrollSlider('right')}
            className="absolute -right-4 sm:-right-6 top-[50%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/95 border border-stone-200 shadow-lg flex items-center justify-center text-[#00204A] hover:bg-stone-50 active:scale-95 transition-all opacity-0 group-hover/slider:opacity-100 md:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#CD9535]/50 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Swipe Indicator instruction helper line */}
          <div className="flex items-center justify-between text-stone-400 text-[11px] sm:text-xs font-sans tracking-widest mb-4 pl-1">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              左右にフリック・スワイプしてスクロールできます ⇆
            </span>
            <span className="hidden md:inline font-bold text-[#CD9535]">矢印キーまたは上のボタンでの操作も可能です</span>
          </div>

          {/* Slider Row Container */}
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto gap-6 sm:gap-8 pb-8 pt-2 snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: 'none', // for Firefox
              msOverflowStyle: 'none', // for IE/Edge
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <style>{`
              /* Hide scrollbar for Chrome, Safari and Opera */
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <AnimatePresence mode="popLayout">
              {filteredAndSortedGrads.length > 0 ? (
                filteredAndSortedGrads.map((grad, index) => {
                  const ItemIcon = grad.categoryIcon;
                  
                  return (
                    <motion.div
                      key={grad.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4) }}
                      whileHover={{ y: -6 }}
                      onClick={() => setSelectedGrad(grad)}
                      className="snap-start flex-shrink-0 w-[290px] xs:w-[325px] sm:w-[340px] md:w-[350px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-stone-200/50 text-left flex flex-col transition-all cursor-pointer"
                    >
                      <div className="flex min-h-full flex-col" data-gsap-card>
                      {/* Top portrait container */}
                      <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-150" data-gsap-media>
                        <img 
                          src={grad.image} 
                          alt={grad.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-[0.98]"
                          referrerPolicy="no-referrer"
                        />
                        {/* Floating Badges */}
                        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-2 items-start">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans font-bold py-1 px-3 rounded-full border shadow-sm ${grad.categoryBg} ${grad.categoryBorder} ${grad.categoryText}`}>
                            {ItemIcon && <ItemIcon className="w-3.5 h-3.5" />}
                            <span>{grad.categoryLabel}</span>
                          </span>

                          {/* Floating Amber "割引特典あり" tag directly on top of card inside image overlay */}
                          {grad.hasDiscount && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-sans font-black py-1 px-3.5 rounded-lg bg-amber-500 text-white border border-amber-400 shadow-md transform hover:scale-105 transition-transform">
                              <span>🎁</span>
                              <span>割引特典あり</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card details body section */}
                      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                        
                        {/* Main Information Stack */}
                        <div>
                          {/* Graduation & Major Info */}
                          <div className="text-stone-400 font-sans text-xs tracking-wider mb-2">
                            {grad.gradYear}　{grad.major}
                          </div>

                          {/* Headline Title */}
                          <h3 className="text-base sm:text-lg font-serif font-bold text-[#00204A] leading-[1.4] tracking-wider mb-4 min-h-[44px] line-clamp-2 group-hover:text-[#CD9535] transition-colors">
                            {grad.title}
                          </h3>

                          {/* Special Quotes Design Layout */}
                          <div className="relative mb-4 mt-2">
                            <span className="absolute -top-3 -left-1 text-3xl font-serif text-[#CD9535]/20 leading-none select-none">“</span>
                            <p className="text-stone-600 text-xs sm:text-[13.5px] leading-relaxed tracking-wider pl-4 pr-1 line-clamp-3 select-text">
                              {grad.quote}
                            </p>
                            <span className="absolute -bottom-3 right-1 text-3xl font-serif text-[#CD9535]/20 leading-none select-none">”</span>
                          </div>
                        </div>

                        {/* Interactive mini SNS Row */}
                        {(grad.linkedinUrl || grad.facebookUrl || grad.instagramUrl || grad.xUrl || grad.websiteUrl) && (
                          <div className="flex flex-wrap items-center gap-2 mb-3 mt-1.5" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[10px] uppercase font-sans font-black tracking-widest text-stone-400 mr-1 select-none">SNS / HP Link:</span>
                            {grad.linkedinUrl && (
                              <a href={grad.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-1 px-1.5 rounded bg-slate-100 hover:bg-[#0077B5]/10 text-slate-600 hover:text-[#0077B5] transition-colors" title="LinkedIn">
                                <Linkedin className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {grad.facebookUrl && (
                              <a href={grad.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-1 px-1.5 rounded bg-slate-100 hover:bg-[#1877F2]/10 text-slate-600 hover:text-[#1877F2] transition-colors" title="Facebook">
                                <Facebook className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {grad.instagramUrl && (
                              <a href={grad.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-1 px-1.5 rounded bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-600 transition-colors" title="Instagram">
                                <Instagram className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {grad.xUrl && (
                              <a href={grad.xUrl} target="_blank" rel="noopener noreferrer" className="p-1 px-1.5 rounded bg-slate-100 hover:bg-stone-200 text-slate-600 hover:text-stone-950 transition-colors" title="X (Twitter)">
                                <Twitter className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {grad.websiteUrl && (
                              <a href={grad.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-1 px-1.5 rounded bg-slate-100 hover:bg-amber-100/70 text-slate-600 hover:text-[#CD9535] transition-colors" title="Website/HP">
                                <Globe className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Bottom Graduate attribution + Action arrow button */}
                        <div className="border-t border-stone-100 pt-3.5 mt-2 flex flex-row items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-stone-500 font-sans text-[10.5px] tracking-wider leading-relaxed truncate">
                              {grad.affiliation}
                            </div>
                            <div className="text-[#00204A] font-sans font-bold text-[13px] sm:text-[14px] tracking-wider mt-0.5">
                              {grad.name}
                            </div>
                          </div>

                          {/* Action icon button matching brand style */}
                          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white group-hover:bg-[#00204A] border border-stone-200 group-hover:border-[#00204A] text-[#00204A] group-hover:text-white rounded-full flex items-center justify-center transition-all shadow-none select-none flex-shrink-0">
                            <ChevronRight className="w-4.5 h-4.5 stroke-[1.8]" />
                          </div>
                        </div>

                      </div>
                      </div>

                    </motion.div>
                  );
                })
              ) : (
                // Empty search/filter indicator
                <div className="w-full py-16 text-center select-none bg-white rounded-2xl border border-stone-200/50 p-8 flex flex-col items-center justify-center">
                  <p className="text-[#00204A] font-serif font-bold text-lg mb-2">
                    該当する卒業生インタビューが見つかりませんでした
                  </p>
                  <p className="text-stone-400 text-xs sm:text-[13px] tracking-wider mb-6">
                    条件を変えて再確認いただくか、別のキーワードでお試しください。
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setOnlyWithDiscount(false);
                      setSearchQuery('');
                    }}
                    className="bg-white hover:bg-[#00204A]/5 text-[#00204A] border border-[#00204A] font-sans font-bold text-[12px] py-2.5 px-6 rounded-lg transition-all cursor-pointer"
                  >
                    すべての条件をクリアする
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM ALUMNI INTERVIEW RECRUITMENT BANNER
            ========================================================================= */}
        <div className="w-full bg-[#FCFBF8] border border-stone-200/50 rounded-2xl p-6 sm:p-8 md:px-12 mt-16 sm:mt-20 flex flex-col md:flex-row items-center justify-between gap-6" data-gsap-card>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
            
            {/* White rounded people user circle avatar */}
            <div className="bg-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 border border-amber-900/5">
              <Users className="w-6 h-6 text-[#CD9535]" />
            </div>

            {/* Recruitment core notes */}
            <div className="flex flex-col pt-1.5 gap-1">
              <h3 className="text-[#00204A] font-serif font-bold text-base sm:text-lg tracking-wider">
                STORIESに登録したい方はいませんか？
              </h3>
              <p className="text-stone-500 text-xs sm:text-[13.5px] tracking-wider leading-relaxed">
                ご自身の活動や、同窓生に紹介したいお店・事業について掲載・共有しましょう！
              </p>
            </div>

          </div>

          {/* Guidelines & Direct Input Twin Actions Stack */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#join-interviews"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-350 py-3 px-5 rounded-lg font-sans font-bold text-xs sm:text-[12.5px] tracking-widest shadow-sm transition-all text-center flex-1 sm:flex-none"
              id="join-interview-btn"
            >
              <span>掲載ガイドライン</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
            </motion.a>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#00204A] hover:bg-[#00204A]/90 text-white border border-[#00204A] py-3 px-5 rounded-lg font-sans font-bold text-xs sm:text-[12.5px] tracking-widest shadow-md transition-all text-center cursor-pointer flex-1 sm:flex-none"
              id="direct-submit-btn"
            >
              <span>STORIESに直接登録する ✍️</span>
            </motion.button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          STORY DETAIL FULL MODAL DIALOG EXPERIENCE (AnimatePresence Overlay)
          ========================================================================= */}
      <AnimatePresence>
        {selectedGrad && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGrad(null)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Body placement position wrapper */}
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full text-left flex flex-col md:flex-row z-50 border border-stone-200"
              >
                {/* Close Button top-right (absolute positioned with high contrast) */}
                <button
                  onClick={() => setSelectedGrad(null)}
                  className="absolute top-4 right-4 z-50 p-2 text-stone-400 hover:text-[#00204A] hover:bg-stone-50 rounded-full border border-stone-200 bg-white transition-all shadow-sm focus:outline-none"
                  aria-label="Close story detail"
                >
                  <X className="w-5 h-5 opacity-80" />
                </button>

                {/* Left Side: Outstanding Portrait Column */}
                <div className="md:w-[320px] bg-[#FAF9F5] flex-shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
                  <div className="relative aspect-[1/1] md:aspect-[3/4] w-full overflow-hidden bg-stone-200">
                    <img
                      src={selectedGrad.image}
                      alt={selectedGrad.name}
                      className="w-full h-full object-cover filter brightness-[0.98]"
                      referrerPolicy="no-referrer"
                    />
                    {/* Shadow cover gradient on top of profile image on small screens */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-stone-900/40 to-transparent pointer-events-none md:hidden" />
                  </div>

                  {/* Profile Bottom stats card */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between text-left">
                    <div>
                      {/* Category Label */}
                      <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-sans font-bold py-1 px-3 rounded-full border mb-3.5 ${selectedGrad.categoryBg} ${selectedGrad.categoryBorder} ${selectedGrad.categoryText}`}>
                        {selectedGrad.categoryIcon && <selectedGrad.categoryIcon className="w-3.5 h-3.5" />}
                        <span>{selectedGrad.categoryLabel}</span>
                      </span>

                      {/* Name Card */}
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider mb-2 leading-none">
                        {selectedGrad.name}
                      </h3>
                      
                      {/* Graduate Year & Major Info */}
                      <p className="text-xs sm:text-[13px] font-sans font-medium text-stone-500 tracking-wider mb-4 leading-normal">
                        {selectedGrad.gradYear}　{selectedGrad.major}
                      </p>
                    </div>

                    <div className="border-t border-stone-200/65 pt-4 mt-4">
                      <span className="block text-[10px] text-[#CD9535] font-sans font-bold tracking-widest uppercase mb-1">Affiliation</span>
                      <p className="text-stone-700 font-sans text-xs sm:text-[13px] leading-relaxed tracking-wider font-semibold">
                        {selectedGrad.affiliation}
                      </p>
                    </div>

                    {/* Dedicated Social/Web Connections inside Modal */}
                    {(selectedGrad.linkedinUrl || selectedGrad.facebookUrl || selectedGrad.instagramUrl || selectedGrad.xUrl || selectedGrad.websiteUrl) && (
                      <div className="border-t border-stone-200/65 pt-4 mt-4">
                        <span className="block text-[10px] text-[#CD9535] font-sans font-bold tracking-widest uppercase mb-2">SNS / WEB LINKS</span>
                        <div className="flex flex-wrap gap-2.5">
                          {selectedGrad.linkedinUrl && (
                            <a 
                              href={selectedGrad.linkedinUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-[34px] h-[34px] rounded-full bg-[#0077B5] hover:bg-[#0077B5]/85 text-white flex items-center justify-center shadow-xs transition-colors"
                              title="LinkedIn"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {selectedGrad.facebookUrl && (
                            <a 
                              href={selectedGrad.facebookUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-[34px] h-[34px] rounded-full bg-[#1877F2] hover:bg-[#1877F2]/85 text-white flex items-center justify-center shadow-xs transition-colors"
                              title="Facebook"
                            >
                              <Facebook className="w-4 h-4" />
                            </a>
                          )}
                          {selectedGrad.instagramUrl && (
                            <a 
                              href={selectedGrad.instagramUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-[34px] h-[34px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90 text-white flex items-center justify-center shadow-xs transition-opacity"
                              title="Instagram"
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                          {selectedGrad.xUrl && (
                            <a 
                              href={selectedGrad.xUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-[34px] h-[34px] rounded-full bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center shadow-xs border border-stone-800 transition-colors"
                              title="X (Twitter)"
                            >
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                          {selectedGrad.websiteUrl && (
                            <a 
                              href={selectedGrad.websiteUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-[34px] h-[34px] rounded-full bg-[#00204A] hover:bg-[#CD9535] text-white flex items-center justify-center shadow-xs transition-colors"
                              title="Website / HP"
                            >
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Interview Expanded content Q&A layout */}
                <div className="flex-1 p-6 sm:p-8 md:p-10 max-h-[85vh] md:max-h-[750px] overflow-y-auto">
                  
                  {/* Decorative quote header banner */}
                  <div className="mb-8 border-l-[3.5px] border-[#CD9535] pl-4 md:pl-5 text-left">
                    <span className="inline-block text-[10.5px] text-[#CD9535] font-sans font-bold tracking-widest uppercase mb-1">Message from Alumni</span>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#00204A] tracking-wide leading-snug">
                      「{selectedGrad.quote}」
                    </h2>
                  </div>

                  {/* Interview Questions Grid Stack with dynamic context rendering */}
                  <div className="space-y-8 text-left">
                    {/* Q1 */}
                    <div className="bg-[#FAF9F5]/40 border border-stone-100 p-5 rounded-2xl">
                      <h4 className="text-sm sm:text-base font-serif font-bold text-[#00204A] tracking-wider mb-3 flex items-start gap-2">
                        <span className="text-[#CD9535] font-mono font-black text-base sm:text-lg leading-none">Q1.</span>
                        <span>この仕事を選んだ理由と、やりがいは何ですか？</span>
                      </h4>
                      <p className="text-stone-600 text-xs sm:text-[13.5px] leading-relaxed tracking-wider pl-6.5 font-sans whitespace-pre-line">
                        {getInterviewDetails(selectedGrad).q1}
                      </p>
                    </div>

                    {/* Q2 */}
                    <div className="bg-[#FAF9F5]/40 border border-stone-100 p-5 rounded-2xl">
                      <h4 className="text-sm sm:text-base font-serif font-bold text-[#00204A] tracking-wider mb-3 flex items-start gap-2">
                        <span className="text-[#CD9535] font-mono font-black text-base sm:text-lg leading-none">Q2.</span>
                        <span>茨城大学での学びや学生時代の思い出は？</span>
                      </h4>
                      <p className="text-stone-600 text-xs sm:text-[13.5px] leading-relaxed tracking-wider pl-6.5 font-sans whitespace-pre-line">
                        {getInterviewDetails(selectedGrad).q2}
                      </p>
                    </div>

                    {/* Q3 */}
                    <div className="bg-[#FAF9F5]/40 border border-stone-100 p-5 rounded-2xl">
                      <h4 className="text-sm sm:text-base font-serif font-bold text-[#00204A] tracking-wider mb-3 flex items-start gap-2">
                        <span className="text-[#CD9535] font-mono font-black text-base sm:text-lg leading-none">Q3.</span>
                        <span>在学生や受験生の皆さんへのメッセージ</span>
                      </h4>
                      <p className="text-stone-600 text-xs sm:text-[13.5px] leading-relaxed tracking-wider pl-6.5 font-sans whitespace-pre-line">
                        {getInterviewDetails(selectedGrad).q3}
                      </p>
                    </div>

                    {/* Premium Gold Discount Box (Only if selectedGrad has discount details!) */}
                    {selectedGrad.hasDiscount && (
                      <div className="bg-amber-50/50 border border-amber-200/80 p-5 sm:p-6 rounded-2xl relative overflow-hidden mt-6 shadow-sm">
                        <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center opacity-40">
                          <span className="text-2xl pt-2 pr-2">🎁</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-serif font-bold text-amber-900 tracking-wider mb-3 flex items-center gap-2">
                          <span className="inline-flex items-center justify-center bg-amber-600 text-white rounded px-2 py-0.5 text-[11px] font-sans font-extrabold shadow-sm">
                            会員限定特典
                          </span>
                          <span>卒業生のお店・事業 割引ベネフィット</span>
                        </h4>
                        <p className="text-amber-950 text-xs sm:text-[13.5px] leading-relaxed tracking-wider font-sans font-medium whitespace-pre-line bg-white/70 rounded-xl p-3.5 border border-amber-100/50 shadow-xs">
                          {selectedGrad.discountDetails}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Top-level Footer statement inside modal */}
                  <div className="border-t border-stone-100 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
                    <span className="text-stone-400 font-mono tracking-widest uppercase">
                      Ibaraki Univ. Bunri/人文 Dousoukai
                    </span>
                    <button
                      onClick={() => setSelectedGrad(null)}
                      className="text-stone-500 hover:text-[#00204A] font-bold tracking-widest uppercase flex items-center gap-1 border-b border-stone-300 hover:border-[#00204A] pb-0.5 transition-all text-[11px]"
                    >
                      閉じる
                    </button>
                  </div>

                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          STORY WORK DIRECT REGISTRATION FORM DIALOG EXPERIENCE
          ========================================================================= */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubmitModalOpen(false)}
              className="fixed inset-0 bg-[#001025]/75 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Body placement position wrapper */}
            <div className="flex min-h-screen items-center justify-center p-2 sm:p-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full text-left z-50 border border-stone-200 flex flex-col max-h-[92vh] sm:max-h-[90vh]"
              >
                {/* Close Button top-right */}
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="absolute top-3.5 right-3.5 z-50 p-2 text-stone-400 hover:text-[#00204A] hover:bg-stone-50 rounded-full border border-stone-200 bg-white transition-all shadow-sm focus:outline-none"
                  aria-label="Close form"
                >
                  <X className="w-5 h-5 opacity-80" />
                </button>

                {/* Scrollable Container Wrapper with padding */}
                <div className="overflow-y-auto p-5 sm:p-8 md:p-10 flex-1 scrollbar-thin">
                  {/* Form Header */}
                <div className="mb-6 pb-4 border-b border-stone-150">
                  <span className="inline-block text-[10px] text-[#CD9535] font-sans font-bold tracking-widest uppercase mb-1">
                    Direct Submission Form
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#00204A] tracking-wider">
                    STORIES 掲載登録
                  </h2>
                  <p className="text-stone-500 text-xs mt-1.5 leading-normal">
                    ご自身の活動内容や、在校生・同窓生へのメッセージ、事業・お店の特典をご記入ください。登録後リアルタイムにスライドへ反映されます。
                  </p>
                </div>

                <form onSubmit={handleAddSubmit} className="space-y-4">
                  {/* Photo Upload Zone (Drag-and-Drop + Manual Click) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-sans font-bold text-[#00204A] tracking-wide">
                      プロフィール写真・店舗/事業イメージ (任意)
                    </label>
                    <div 
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert('画像サイズは2MB以下にしてください。');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setFormImage(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className={`border-2 border-dashed rounded-xl p-4 transition-all text-center flex flex-col items-center justify-center cursor-pointer select-none ${
                        isDragging 
                          ? 'border-[#CD9535] bg-amber-50/40 scale-[1.01]' 
                          : formImage 
                            ? 'border-emerald-300 bg-emerald-50/10' 
                            : 'border-stone-200 hover:border-[#CD9535]/55 bg-[#FAF9F5] hover:bg-[#FAF9F5]/70'
                      }`}
                      onClick={() => document.getElementById('photo-upload-input')?.click()}
                    >
                      <input 
                        type="file" 
                        id="photo-upload-input" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert('画像サイズは2MB以下にしてください。');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                setFormImage(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      
                      {formImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative w-20 h-20">
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#CD9535] shadow-sm">
                              <img src={formImage} alt="Uploaded preview" className="w-full h-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormImage('');
                              }}
                              className="absolute -top-1 -right-1 z-20 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                              title="画像を削除"
                            >
                              <X className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                            <span>✓ 画像のアップロードに成功しました！</span>
                          </p>
                          <p className="text-[10px] text-stone-400">
                            (クリックまたはドラッグ＆ドロップで別の画像に変更)
                          </p>
                        </div>
                      ) : (
                        <div className="py-2.5 flex flex-col items-center gap-1.5 text-stone-500">
                          <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 animate-pulse">
                            <Upload className="w-5 h-5 text-[#CD9535]" />
                          </div>
                          <p className="text-xs font-bold text-stone-600 mt-1">
                            クリックしてファイルを選択、またはここにドラッグ＆ドロップ
                          </p>
                          <p className="text-[10px] text-stone-400">
                            PNG, JPG, WEBP (2MB以内。未選択時はカテゴリーの標準写真が使われます)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 1: Name and Major */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-bold text-[#00204A] tracking-wide mb-1.5">
                        お名前・紹介名 <span className="text-red-500 font-extrabold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="例: 茨大 太郎 または I.Tさん"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full text-sm py-2 px-3 bg-[#FAF9F5] border border-stone-200 rounded-lg outline-none focus:border-[#CD9535] focus:ring-1 focus:ring-[#CD9535]/15 transition-all font-sans text-[#00204A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-bold text-[#00204A] tracking-wide mb-1.5">
                        学部・出身専攻 <span className="text-red-500 font-extrabold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="例: 人文学科社会科学専攻"
                        value={formMajor}
                        onChange={(e) => setFormMajor(e.target.value)}
                        className="w-full text-sm py-2 px-3 bg-[#FAF9F5] border border-stone-200 rounded-lg outline-none focus:border-[#CD9535] focus:ring-1 focus:ring-[#CD9535]/15 transition-all font-sans text-[#00204A]"
                      />
                    </div>
                  </div>

                  {/* Row 2: Graduation Year and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-bold text-[#00204A] tracking-wide mb-1.5">
                        卒業年度・卒年
                      </label>
                      <select
                        value={formGradYear}
                        onChange={(e) => setFormGradYear(e.target.value)}
                        className="w-full text-sm py-2.5 px-3 bg-[#FAF9F5] border border-stone-200 rounded-lg outline-none focus:border-[#CD9535] focus:ring-1 focus:ring-[#CD9535]/15 transition-all font-sans text-[#00204A]"
                      >
                        <option value="2024年卒">2024年卒</option>
                        <option value="2023年卒">2023年卒</option>
                        <option value="2022年卒">2022年卒</option>
                        <option value="2021年卒">2021年卒</option>
                        <option value="2020年卒">2020年卒</option>
                        <option value="2015年卒">2015年卒</option>
                        <option value="2010年卒">2010年卒</option>
                        <option value="2005年卒">2005年卒</option>
                        <option value="2000年卒">2000年卒</option>
                        <option value="1995年卒">1995年卒</option>
                        <option value="1990年卒">1990年卒</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-bold text-[#00204A] tracking-wide mb-1.5">
                        掲載カテゴリー（職種・分野）
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full text-sm py-2.5 px-3 bg-[#FAF9F5] border border-stone-200 rounded-lg outline-none focus:border-[#CD9535] focus:ring-1 focus:ring-[#CD9535]/15 transition-all font-sans text-[#00204A]"
                      >
                        <option value="education">教育・行政</option>
                        <option value="media">メディア・出版・広告</option>
                        <option value="finance">金融・コンサルティング</option>
                        <option value="it">IT・通信</option>
                        <option value="manufacturer">メーカー・製造</option>
                        <option value="service">サービス・小売</option>
                        <option value="other">その他</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Affiliation */}
                  <div>
                    <label className="block text-xs font-sans font-bold text-[#00204A] tracking-wide mb-1.5">
                      現在の勤務先・所属・役職名 <span className="text-red-500 font-extrabold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例: 株式会社○○ 総合開発推進部 主任"
                      value={formAffiliation}
                      onChange={(e) => setFormAffiliation(e.target.value)}
                      className="w-full text-sm py-2 px-3 bg-[#FAF9F5] border border-stone-200 rounded-lg outline-none focus:border-[#CD9535] focus:ring-1 focus:ring-[#CD9535]/15 transition-all font-sans text-[#00204A]"
                    />
                  </div>

                  {/* Headline */}
                  <div>
                    <label className="block text-xs font-sans font-bold text-[#00204A] tracking-wide mb-1.5">
                      インタビュー見出し・スローガン <span className="text-red-500 font-extrabold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例: 伝統と最先端を融合し、地域の美味しさを全国へ"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full text-sm py-2 px-3 bg-[#FAF9F5] border border-stone-200 rounded-lg outline-none focus:border-[#CD9535] focus:ring-1 focus:ring-[#CD9535]/15 transition-all font-sans text-[#00204A]"
                    />
                  </div>

                  {/* Activity and message */}
                  <div>
                    <label className="block text-xs font-sans font-bold text-[#00204A] tracking-wide mb-1.5">
                      主な活動内容や、在学生への一言メッセージ <span className="text-red-500 font-extrabold">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="大学生活での思い出や、今の仕事のやりがいなどをご記入ください。Q1〜Q3の質問への回答が自動生成されます。"
                      value={formQuote}
                      onChange={(e) => setFormQuote(e.target.value)}
                      className="w-full text-sm py-2 px-3 bg-[#FAF9F5] border border-stone-200 rounded-lg resize-none outline-none focus:border-[#CD9535] focus:ring-1 focus:ring-[#CD9535]/15 transition-all font-sans text-[#00204A]"
                    />
                  </div>

                  {/* Benefits Tag */}
                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 select-none">
                    <label className="flex items-center gap-2 cursor-pointer font-sans text-xs font-bold text-amber-900">
                      <input
                        type="checkbox"
                        checked={formHasDiscount}
                        onChange={(e) => setFormHasDiscount(e.target.checked)}
                        className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                      />
                      <span>🎁 お店や事業など、同窓生向けの「割引・優待特典」を登録する</span>
                    </label>
                    
                    {formHasDiscount && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <textarea
                          placeholder="特典詳細をご記入ください。 （例: 「会計より10%OFF、または手作り商品を1点プレゼント」等）"
                          rows={2}
                          value={formDiscountDetails}
                          onChange={(e) => setFormDiscountDetails(e.target.value)}
                          className="w-full text-xs py-2 px-3 bg-white border border-amber-200 rounded-md outline-none focus:border-amber-500 font-sans text-stone-700"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* SNS Options Grid (The critical user request!) */}
                  <div className="border-t border-stone-150 pt-4">
                    <label className="block text-xs font-sans font-bold text-[#00204A] tracking-wide mb-2 uppercase">
                      🖥️ 各種SNS / ホームページリンクの入力 (任意)
                    </label>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-[105px] font-sans text-[11px] font-black text-stone-500 flex items-center gap-1.5">
                          <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
                          <span>LinkedIn</span>
                        </div>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={formLinkedin}
                          onChange={(e) => setFormLinkedin(e.target.value)}
                          className="flex-1 text-xs py-1.5 px-2.5 bg-[#FAF9F5] border border-stone-200 rounded focus:border-[#CD9535] outline-none font-sans"
                        />
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-[105px] font-sans text-[11px] font-black text-stone-500 flex items-center gap-1.5">
                          <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                          <span>Facebook</span>
                        </div>
                        <input
                          type="url"
                          placeholder="https://facebook.com/profile"
                          value={formFacebook}
                          onChange={(e) => setFormFacebook(e.target.value)}
                          className="flex-1 text-xs py-1.5 px-2.5 bg-[#FAF9F5] border border-stone-200 rounded focus:border-[#CD9535] outline-none font-sans"
                        />
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-[105px] font-sans text-[11px] font-black text-stone-500 flex items-center gap-1.5">
                          <Instagram className="w-3.5 h-3.5 text-[#D62976]" />
                          <span>Instagram</span>
                        </div>
                        <input
                          type="url"
                          placeholder="https://instagram.com/username"
                          value={formInstagram}
                          onChange={(e) => setFormInstagram(e.target.value)}
                          className="flex-1 text-xs py-1.5 px-2.5 bg-[#FAF9F5] border border-stone-200 rounded focus:border-[#CD9535] outline-none font-sans"
                        />
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-[105px] font-sans text-[11px] font-black text-stone-500 flex items-center gap-1.5">
                          <Twitter className="w-3.5 h-3.5 text-stone-800" />
                          <span>X (Twitter)</span>
                        </div>
                        <input
                          type="url"
                          placeholder="https://x.com/username"
                          value={formX}
                          onChange={(e) => setFormX(e.target.value)}
                          className="flex-1 text-xs py-1.5 px-2.5 bg-[#FAF9F5] border border-stone-200 rounded focus:border-[#CD9535] outline-none font-sans"
                        />
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-[105px] font-sans text-[11px] font-black text-stone-500 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-stone-700" />
                          <span>自社・個人HP</span>
                        </div>
                        <input
                          type="url"
                          placeholder="https://example.com"
                          value={formWebsite}
                          onChange={(e) => setFormWebsite(e.target.value)}
                          className="flex-1 text-xs py-1.5 px-2.5 bg-[#FAF9F5] border border-stone-200 rounded focus:border-[#CD9535] outline-none font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submission and Cancel Buttons */}
                  <div className="border-t border-stone-150 pt-5 mt-4 flex items-center justify-end gap-3 select-none">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="py-2.5 px-5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-sans font-bold tracking-widest transition-colors cursor-pointer"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#CD9535] hover:bg-[#B5822C] text-white rounded-lg text-xs font-sans font-bold tracking-widest transition-colors cursor-pointer shadow-md"
                    >
                      登録を申請する 📨
                    </button>
                  </div>
                </form>
                </div> {/* End scrollable content wrapper */}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
