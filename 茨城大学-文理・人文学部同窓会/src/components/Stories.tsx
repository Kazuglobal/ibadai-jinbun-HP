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
  Gift,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Globe,
  X
} from 'lucide-react';
import StoryInterviewApplication from './StoryInterviewApplication';

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
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop', // Counsellor lady
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
  // The current cards are presentation samples until reviewed alumni submissions are published.
  const graduates = GRADUATES_DATA;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyWithDiscount, setOnlyWithDiscount] = useState(false);
  const itemsPerPage = 3;

  // Handles sort state dropdown overlay
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Active story details selected for full-screen immersive modal experience
  const [selectedGrad, setSelectedGrad] = useState<any | null>(null);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

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

  const hasActiveFilters =
    activeCategory !== 'all' || onlyWithDiscount || searchQuery.trim() !== '';
  const featuredGrad = graduates[0] ?? null;
  const resultsForDisplay = useMemo(
    () =>
      filteredAndSortedGrads.filter(
        (grad) => hasActiveFilters || !featuredGrad || grad.id !== featuredGrad.id,
      ),
    [featuredGrad, filteredAndSortedGrads, hasActiveFilters],
  );

  // Total pages calculation
  const totalPages = Math.max(1, Math.ceil(resultsForDisplay.length / itemsPerPage));

  // Ensure current page does not go out of bound when filter shifts
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, onlyWithDiscount, searchQuery, sortOrder]);

  // Slice list for visual pagination
  const paginatedGrads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return resultsForDisplay.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, resultsForDisplay]);

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
    <section
      className="relative scroll-mt-20 overflow-hidden border-t border-stone-200/40 bg-[#FAF9F5] py-3 sm:scroll-mt-24 sm:py-16 lg:py-24"
      id="stories-section"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl" data-gsap-section-title>
          <div className="border-l-[3px] border-[#CD9535] pl-4 sm:pl-7">
            <p className="font-serif text-[16px] font-bold tracking-[0.18em] text-[#B57A24] sm:text-[30px]">
              STORIES
            </p>
            <h2 className="mt-1.5 font-serif text-[24px] font-bold leading-[1.35] tracking-[0.04em] text-[#00204A] sm:mt-4 sm:text-[46px] sm:leading-[1.4] lg:text-[54px]">
              先輩の歩みから、
              <br />
              次の一歩を見つける
            </h2>
          </div>
          <p className="mt-3 text-[11px] leading-5 tracking-[0.04em] text-stone-600 sm:mt-6 sm:text-base sm:leading-7">
            同窓生一人ひとりの歩みを、オンラインインタビューを通じて集めていく場所です。現在表示中の記事は掲載イメージのサンプルです。
          </p>
          <div className="mt-3 inline-flex items-center gap-2 border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-bold leading-5 text-amber-900 sm:mt-5 sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-[#CD9535]" />
            現在、公開済みの同窓生インタビューはまだありません
          </div>
        </header>

        {featuredGrad && !hasActiveFilters && (
          <motion.button
            type="button"
            onClick={() => setSelectedGrad(featuredGrad)}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25 }}
            className="group mt-4 w-full overflow-hidden border border-stone-200 bg-white text-left shadow-sm sm:mt-9"
            data-gsap-card
          >
            <div className="relative aspect-[12/5] overflow-hidden sm:aspect-[16/9] lg:aspect-[16/7]">
              <img
                src={featuredGrad.image}
                alt={featuredGrad.name}
                className="h-full w-full object-cover object-[center_28%] transition-transform duration-700 group-hover:scale-[1.025] sm:object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#00132C]/55" />
              <div className="absolute inset-0 flex max-w-2xl flex-col justify-end p-4 text-white sm:p-9 lg:p-12">
                <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold tracking-wider sm:gap-3 sm:text-xs">
                  <span className="border border-[#D7A946] px-2 py-1 text-[#F3C76B] sm:px-3 sm:py-1.5">
                    {featuredGrad.categoryLabel}
                  </span>
                  <span className="text-white/80">{featuredGrad.gradYear}</span>
                </div>
                <h3 className="mt-3 font-serif text-[19px] font-bold leading-[1.4] tracking-[0.04em] sm:mt-5 sm:text-[38px] sm:leading-[1.45]">
                  {featuredGrad.title}
                </h3>
                <p className="mt-3 text-[9px] font-medium leading-4 text-white/90 sm:mt-5 sm:text-sm sm:leading-6">
                  {featuredGrad.affiliation}
                </p>
                <p className="mt-0.5 text-[11px] font-bold tracking-wider sm:mt-1 sm:text-base">{featuredGrad.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-stone-200 px-4 py-2.5 text-xs font-bold tracking-wider text-[#00204A] sm:gap-3 sm:px-9 sm:py-4 sm:text-base">
              <span>インタビューを読む</span>
              <ArrowRight className="h-4 w-4 text-[#CD9535] transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </div>
          </motion.button>
        )}

        <div className="mt-3 border border-stone-200 bg-white shadow-sm transition-colors focus-within:border-[#CD9535] sm:mt-8">
          <label className="flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-4">
            <Search className="h-4 w-4 flex-none text-stone-400 sm:h-5 sm:w-5" />
            <input
              type="search"
              aria-label="卒業生の職種・分野から探す"
              placeholder="卒業生の職種・分野から探す"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-xs text-[#00204A] outline-none placeholder:text-stone-400 sm:text-base"
              id="stories-search-input"
            />
          </label>
        </div>

        <nav
          className="mt-3 grid grid-cols-4 gap-1.5 rounded-xl border border-stone-200 bg-[#F5F3EC] p-1.5 shadow-sm sm:mt-5 sm:grid-cols-8 sm:gap-0 sm:rounded-none sm:border-x-0 sm:border-t-0 sm:bg-transparent sm:p-0 sm:shadow-none"
          aria-label="Graduate Categories Filter"
        >
          {CATEGORY_TABS.map((tab) => {
            const IconComponent = tab.icon ?? Users;
            const isTabActive = activeCategory === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveCategory(tab.id);
                  setCurrentPage(1);
                }}
                className={`relative flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-lg border px-1 py-2 text-center text-[10px] font-bold leading-[1.25] transition-all sm:min-h-24 sm:gap-2 sm:rounded-none sm:border-0 sm:px-2 sm:pb-4 sm:pt-3 sm:text-xs sm:leading-4 ${
                  isTabActive
                    ? 'border-[#00204A] bg-[#00204A] text-white shadow-sm sm:bg-transparent sm:text-[#00204A] sm:shadow-none'
                    : 'border-white bg-white text-stone-600 hover:border-[#CD9535]/40 hover:text-[#00204A] sm:border-transparent sm:bg-transparent'
                }`}
                aria-pressed={isTabActive}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors sm:h-10 sm:w-10 ${
                    isTabActive
                      ? 'bg-white/15 text-[#F3C76B] sm:bg-[#00204A] sm:text-white'
                      : 'bg-[#F2F4F8] text-[#00204A]'
                  }`}
                >
                  <IconComponent className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </span>
                <span>{tab.label}</span>
                {isTabActive && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-[#CD9535] sm:inset-x-2" />}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            setOnlyWithDiscount(!onlyWithDiscount);
            setCurrentPage(1);
          }}
          className={`mt-1 flex w-full items-center justify-between border-y px-2 py-2.5 text-left text-xs font-bold transition-colors sm:mt-4 sm:py-4 sm:text-sm ${
            onlyWithDiscount
              ? 'border-[#CD9535] bg-amber-50 text-[#9A6718]'
              : 'border-stone-200 text-stone-600 hover:text-[#00204A]'
          }`}
          aria-pressed={onlyWithDiscount}
        >
          <span className="flex items-center gap-3">
            <Gift className="h-4 w-4 text-[#CD9535] sm:h-5 sm:w-5" />
            特典のあるお店・事業のみ表示
          </span>
          <ChevronRight className={`h-5 w-5 transition-transform ${onlyWithDiscount ? 'rotate-90' : ''}`} />
        </button>

        <div id="stories-results-anchor" className="scroll-mt-24 pt-4 sm:pt-10">
          <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-3 sm:pb-4">
            <div>
              <h3 className="font-serif text-[18px] font-bold tracking-[0.04em] text-[#00204A] sm:text-[31px]">
                {hasActiveFilters ? 'サンプル検索結果' : '掲載イメージ'}
                <span className="ml-2 text-[14px] text-[#B57A24] sm:text-xl">
                  サンプル {filteredAndSortedGrads.length}件
                </span>
              </h3>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1.5 px-2 py-2 text-xs font-bold tracking-wider text-stone-600 hover:text-[#00204A] sm:text-sm"
                aria-haspopup="listbox"
                aria-expanded={showSortDropdown}
                id="stories-sort-dropdown-trigger"
              >
                <span>{sortOrder === 'newest' ? '新着順' : '卒業年順'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSortDropdown && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-20 cursor-default"
                    onClick={() => setShowSortDropdown(false)}
                    aria-label="並び順メニューを閉じる"
                  />
                  <ul className="absolute right-0 z-30 mt-1 w-36 overflow-hidden border border-stone-200 bg-white text-sm shadow-lg" role="listbox">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setSortOrder('newest');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left ${
                          sortOrder === 'newest' ? 'bg-stone-50 font-bold text-[#B57A24]' : 'text-stone-700'
                        }`}
                      >
                        新着順
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setSortOrder('oldest');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left ${
                          sortOrder === 'oldest' ? 'bg-stone-50 font-bold text-[#B57A24]' : 'text-stone-700'
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

          <div className="divide-y divide-stone-200">
            <AnimatePresence mode="popLayout">
              {paginatedGrads.length > 0 ? (
                paginatedGrads.map((grad, index) => {
                  const ItemIcon = grad.categoryIcon;

                  return (
                    <motion.button
                      type="button"
                      key={grad.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setSelectedGrad(grad)}
                      className="group grid w-full grid-cols-[82px_1fr_auto] gap-3 py-3 text-left sm:grid-cols-[150px_1fr_auto] sm:gap-6 sm:py-6"
                      data-gsap-card
                    >
                      <div className="aspect-square overflow-hidden bg-stone-100 sm:aspect-[4/3]">
                        <img
                          src={grad.image}
                          alt={grad.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="min-w-0 self-center">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs">
                          <span className={`border px-2 py-1 font-bold ${grad.categoryBorder} ${grad.categoryText}`}>
                            <span className="inline-flex items-center gap-1">
                              {ItemIcon && <ItemIcon className="h-3 w-3" />}
                              {grad.categoryLabel}
                            </span>
                          </span>
                          <span className="text-stone-400">{grad.gradYear}</span>
                        </div>
                        <h4 className="mt-1.5 line-clamp-2 font-serif text-[13px] font-bold leading-[1.45] tracking-[0.025em] text-[#00204A] transition-colors group-hover:text-[#B57A24] sm:mt-2 sm:text-xl sm:leading-[1.5]">
                          {grad.title}
                        </h4>
                        <p className="mt-1.5 line-clamp-1 text-[9px] leading-4 text-stone-500 sm:mt-2 sm:text-xs sm:leading-5">
                          {grad.affiliation}
                        </p>
                        <p className="mt-0.5 text-[10px] font-bold tracking-wider text-[#00204A] sm:text-sm">{grad.name}</p>
                      </div>

                      <ChevronRight className="h-5 w-5 self-center text-[#00204A] transition-transform group-hover:translate-x-1 group-hover:text-[#CD9535]" />
                    </motion.button>
                  );
                })
              ) : (
                <div className="py-16 text-center">
                  <p className="font-serif text-lg font-bold text-[#00204A]">
                    該当する卒業生インタビューが見つかりませんでした
                  </p>
                  <p className="mt-2 text-xs leading-6 text-stone-400">
                    キーワードや職種を変更して、もう一度お試しください。
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory('all');
                      setOnlyWithDiscount(false);
                      setSearchQuery('');
                    }}
                    className="mt-6 border border-[#00204A] px-6 py-3 text-xs font-bold text-[#00204A] transition-colors hover:bg-[#00204A] hover:text-white"
                  >
                    条件をすべてクリア
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {paginatedGrads.length > 0 && totalPages > 1 && (
            <div className="mt-7 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center border border-stone-200 text-[#00204A] transition-colors hover:border-[#00204A] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="前のページ"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold tracking-[0.18em] text-stone-500">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center border border-stone-200 text-[#00204A] transition-colors hover:border-[#00204A] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="次のページ"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-y border-stone-200 py-8 text-center md:flex-row md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-white text-[#CD9535] shadow-sm">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-wider text-[#00204A]">
                同窓生の歩みが、この同窓会の一番の財産です
              </h3>
              <p className="mt-1 text-xs leading-6 text-stone-500">
                かんたんなオンラインインタビューに答えて、写真・HP・SNS・同窓生特典と一緒にSTORIESへ掲載申請できます。
                内容は事務局が確認し、掲載基準によっては反映されない場合があります。
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href="#join-interviews"
              className="inline-flex items-center justify-center gap-2 border border-stone-300 bg-white px-5 py-3 text-xs font-bold tracking-wider text-stone-700"
              id="join-interview-btn"
            >
              掲載について
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#00204A] px-5 py-3 text-xs font-bold tracking-wider text-white"
              id="direct-submit-btn"
            >
              インタビューを始める
              <ArrowRight className="h-4 w-4" />
            </button>
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

      <StoryInterviewApplication isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} />
    </section>
  );
}
