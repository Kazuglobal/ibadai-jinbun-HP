import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

interface NewsItem {
  date: string;
  category: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, GsapScrollAnimateDirective]
})
export class NewsDetailComponent {
  newsItems: NewsItem[] = [
    {
      date: '2026.04.01',
      category: 'お知らせ',
      title: 'ホームページをリニューアルしました',
      content: '株式会社創電工業のホームページを全面リニューアルいたしました。より見やすく、事業内容や採用情報を分かりやすくお伝えできるよう構成を一新しました。今後とも何卒よろしくお願いいたします。'
    },
    {
      date: '2026.04.01',
      category: '採用',
      title: '電気工事士・施工管理技士を募集中です',
      content: '当社では電気工事士および施工管理技士を募集しています。未経験者歓迎、資格取得支援制度あり。地元八戸で腰を据えて働きたい方のご応募をお待ちしております。詳しくは採用情報ページをご覧ください。'
    },
    {
      date: '2026.03.15',
      category: '実績',
      title: '大型商業施設の電気設備工事が完了しました',
      content: '八戸市内の大型商業施設における電気設備新設工事が無事完了いたしました。高圧受変電設備から照明・動力設備まで一貫して施工を担当しました。'
    },
    {
      date: '2026.03.01',
      category: 'お知らせ',
      title: 'SDGs への取り組みを強化しています',
      content: '当社では太陽光発電設備の普及推進、LED照明への省エネ改修、再生可能エネルギーの活用を通じて、持続可能な社会の実現に貢献しています。環境に配慮した電気設備の提案を積極的に行っています。'
    },
    {
      date: '2026.02.15',
      category: '実績',
      title: '太陽光発電設備の導入実績が増えています',
      content: '昨年度は産業用・住宅用合わせて多数の太陽光発電設備を設計・施工いたしました。各種補助金の活用サポートも行っておりますので、導入をご検討の方はお気軽にご相談ください。'
    },
    {
      date: '2026.01.06',
      category: 'お知らせ',
      title: '年始のご挨拶',
      content: '明けましておめでとうございます。本年も地域の皆様の安全・安心な暮らしを支える電気設備工事に全力で取り組んでまいります。本年もどうぞよろしくお願いいたします。'
    }
  ];

  categories = ['すべて', 'お知らせ', '採用', '実績'];
  selectedCategory = 'すべて';

  get filteredNews(): NewsItem[] {
    if (this.selectedCategory === 'すべて') {
      return this.newsItems;
    }
    return this.newsItems.filter(n => n.category === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'お知らせ': return 'bg-emerald-600';
      case '採用': return 'bg-amber-500';
      case '実績': return 'bg-sky-500';
      default: return 'bg-slate-500';
    }
  }
}
