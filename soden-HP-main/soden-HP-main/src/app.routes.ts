import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { RecruitDetailsComponent } from './components/recruit-details/recruit-details.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ServicesComponent } from './components/services/services.component';
import { FaqComponent } from './components/faq/faq.component';
import { AccessComponent } from './components/access/access.component';
import { CasesDetailComponent } from './components/cases-detail/cases-detail.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: '株式会社創電工業 | 電気設備工事・設計施工（青森県八戸市）',
      description: '青森県八戸市の株式会社創電工業は、電気設備工事・電気通信工事・消防設備・空調設備・太陽光発電・物流システムの設計施工から保守管理までワンストップ対応。1987年創業、地域密着38年の実績と信頼で八戸市・青森県の電気インフラを支えます。',
      keywords: '創電工業,株式会社創電工業,電気工事,電気設備工事,電気通信工事,消防設備,空調設備,太陽光発電,物流システム,設計施工,保守管理,八戸市,青森県,電気工事会社,八戸 電気工事',
      image: '/images/companyinfo.jpg',
      imageAlt: '株式会社創電工業 チーム集合写真'
    }
  },
  {
    path: 'company',
    component: CompanyDetailsComponent,
    data: {
      title: '会社概要 | 株式会社創電工業（青森県八戸市の電気設備工事会社）',
      description: '株式会社創電工業の会社概要・沿革・所在地・事業内容。1987年創業、青森県八戸市で電気設備工事・電気通信工事・消防設備・空調設備・太陽光発電・物流システムの設計施工を手がける総合電気工事会社です。',
      keywords: '創電工業 会社概要,企業情報,沿革,所在地,電気工事会社,電気設備,八戸市,青森県,創電工業,総合電気工事',
      image: '/images/companyinfo.jpg',
      imageAlt: '株式会社創電工業の会社情報'
    }
  },
  {
    path: 'services',
    component: ServicesComponent,
    data: {
      title: '事業内容 | 株式会社創電工業（電気設備・太陽光発電・消防設備）',
      description: '創電工業の事業内容。電気設備工事・電気通信工事・消防設備工事・空調設備工事・太陽光発電設備・物流システムの設計から施工・保守管理までワンストップ対応。青森県八戸市を拠点に東北全域で実績。',
      keywords: '電気設備工事,電気通信工事,消防設備工事,空調設備,太陽光発電,物流システム,設計施工,保守管理,八戸市,青森県,創電工業 事業内容',
      image: '/images/contact/contact1.png',
      imageAlt: '創電工業の事業内容 - 電気設備工事'
    }
  },
  {
    path: 'cases',
    component: CasesDetailComponent,
    data: {
      title: '施工事例 | 株式会社創電工業（電気工事の実績紹介）',
      description: '創電工業の施工事例・実績紹介。商業施設・工場・公共施設の電気設備工事、太陽光発電設備設置、消防設備改修、通信設備構築、物流システム電気工事など幅広い施工実績をご紹介します。',
      keywords: '施工事例,電気工事 実績,太陽光発電 施工,消防設備 改修,八戸 電気工事 事例,創電工業 実績',
      image: '/images/contact/contact1.png',
      imageAlt: '創電工業の施工事例'
    }
  },
  {
    path: 'news',
    component: NewsDetailComponent,
    data: {
      title: 'お知らせ | 株式会社創電工業',
      description: '株式会社創電工業の最新情報・お知らせ。施工実績報告、採用情報、SDGsへの取り組み、会社の最新ニュースをお届けします。',
      keywords: '創電工業 お知らせ,ニュース,最新情報,施工実績,採用情報',
      image: '/images/companyinfo.jpg',
      imageAlt: '創電工業のお知らせ'
    }
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: {
      title: 'よくある質問（FAQ） | 株式会社創電工業',
      description: '創電工業へのよくある質問と回答。電気設備工事のサービス内容、対応エリア、太陽光発電の導入費用、採用情報、見積り・相談についてお答えします。',
      keywords: '創電工業 FAQ,よくある質問,電気工事 質問,太陽光発電 費用,八戸 電気工事 相談,採用 未経験',
      image: '/images/companyinfo.jpg',
      imageAlt: '創電工業 よくある質問'
    }
  },
  {
    path: 'access',
    component: AccessComponent,
    data: {
      title: 'アクセス・所在地 | 株式会社創電工業（青森県八戸市）',
      description: '株式会社創電工業へのアクセス情報。青森県八戸市大字大久保字小久保平19-7。八戸ICより車で約15分。来客用駐車場完備。地図・交通案内・営業時間のご案内。',
      keywords: '創電工業 アクセス,所在地,八戸市 電気工事,地図,交通案内,駐車場,営業時間',
      image: '/images/companyinfo.jpg',
      imageAlt: '創電工業のアクセス情報'
    }
  },
  {
    path: 'recruit',
    component: RecruitDetailsComponent,
    data: {
      title: '採用情報・求人 | 株式会社創電工業（青森県八戸市）',
      description: '株式会社創電工業の採用情報。電気工事士・施工管理技士を青森県八戸市で募集中。未経験者歓迎、資格取得支援制度あり。社員紹介・職場環境・エントリーフォームを掲載。',
      keywords: '創電工業 採用,求人,電気工事士 求人 八戸,施工管理 求人 青森,未経験歓迎,電気工事 採用,八戸市 求人',
      image: '/images/recruit_hero_bright.jpg',
      imageAlt: '株式会社創電工業の採用情報・職場風景'
    }
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      title: 'お問い合わせ | 株式会社創電工業',
      description: '株式会社創電工業へのお問い合わせページです。電気設備工事、電気通信工事、消防設備、空調設備、太陽光発電、採用に関するご相談を受け付けています。',
      keywords: '創電工業 お問い合わせ,電気工事 相談,見積もり,採用 問い合わせ,八戸市 電気工事',
      image: '/images/companyinfo.jpg',
      imageAlt: '株式会社創電工業へのお問い合わせ'
    }
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    data: {
      title: 'プライバシーポリシー | 株式会社創電工業',
      description: '株式会社創電工業のプライバシーポリシー。個人情報の収集・利用目的・管理方法についてご説明します。',
      keywords: 'プライバシーポリシー,個人情報保護,創電工業'
    }
  },
  { path: '**', redirectTo: '' }
];
