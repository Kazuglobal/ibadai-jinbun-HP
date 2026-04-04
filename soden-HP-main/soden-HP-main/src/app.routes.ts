import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { RecruitDetailsComponent } from './components/recruit-details/recruit-details.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

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
