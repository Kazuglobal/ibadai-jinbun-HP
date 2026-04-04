import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, GsapScrollAnimateDirective]
})
export class FaqComponent {
  categories = ['すべて', 'サービス', '太陽光発電', '採用', 'その他'];
  selectedCategory = 'すべて';

  faqItems: FaqItem[] = [
    {
      category: 'サービス',
      question: 'どのようなサービスを提供していますか？',
      answer: '電気設備工事、電気通信工事、消防設備工事、空調設備工事、太陽光発電設備の設計施工、物流システム・機械設備工事、ビル保守管理を行っています。設計から施工・保守管理までワンストップで対応いたします。'
    },
    {
      category: 'サービス',
      question: '対応エリアはどこですか？',
      answer: '青森県八戸市を拠点に、青森県内全域を中心に対応しております。大規模案件は東北地方全域への出張施工も承ります。まずはお気軽にご相談ください。'
    },
    {
      category: 'サービス',
      question: '見積りは無料ですか？',
      answer: 'はい、お見積りは無料です。現地調査も無料で承ります。お電話（0178-25-2172）またはお問い合わせフォームからお気軽にご連絡ください。'
    },
    {
      category: 'サービス',
      question: '個人宅の電気工事も対応していますか？',
      answer: 'はい、対応しております。コンセント増設、分電盤交換、照明設備の交換・LED化、エアコン設置工事など、住宅の電気工事全般を承ります。'
    },
    {
      category: 'サービス',
      question: '緊急対応は可能ですか？',
      answer: '停電やブレーカー落ちなどの緊急トラブルにも可能な限り対応いたします。まずはお電話（0178-25-2172）にてご状況をお知らせください。受付時間外の場合は翌営業日に折り返しご連絡いたします。'
    },
    {
      category: 'サービス',
      question: '工事の保証はありますか？',
      answer: '施工後のアフターフォローを重視しております。工事内容に応じた保証期間を設けており、不具合が発生した場合は迅速に対応いたします。詳細はお見積り時にご説明いたします。'
    },
    {
      category: '太陽光発電',
      question: '太陽光発電の設置は対応していますか？',
      answer: 'はい、太陽光発電設備の設計・施工・保守管理まで一貫して対応しております。産業用（工場・倉庫の屋根、遊休地）から住宅用まで幅広く実績がございます。'
    },
    {
      category: '太陽光発電',
      question: '太陽光発電の導入費用はどのくらいですか？',
      answer: '設置場所の条件、パネルの種類・枚数、蓄電池の有無により異なります。現地調査後に詳細なお見積りをご提示いたします。また、各種補助金制度のご案内・申請サポートも行っております。'
    },
    {
      category: '太陽光発電',
      question: '補助金は利用できますか？',
      answer: '国や青森県、八戸市の補助金制度をご案内いたします。補助金の申請手続きのサポートも行っておりますので、お気軽にご相談ください。'
    },
    {
      category: '採用',
      question: '求人は募集していますか？',
      answer: '電気工事士・施工管理技士を随時募集しております。未経験の方も歓迎です。資格取得支援制度があり、働きながら技術と資格を身につけることができます。詳しくは採用情報ページをご覧ください。'
    },
    {
      category: '採用',
      question: '未経験でも応募できますか？',
      answer: 'はい、未経験の方も大歓迎です。入社後は先輩社員によるOJT研修で基礎から学べます。第二種電気工事士などの資格取得もサポートしており、費用は会社が負担いたします。'
    },
    {
      category: '採用',
      question: 'どのような資格が取得できますか？',
      answer: '第一種・第二種電気工事士、一級・二級電気工事施工管理技士、消防設備士などの資格取得を支援しています。受験費用・講習費用は会社負担で、勉強時間の確保もサポートします。'
    },
    {
      category: 'その他',
      question: '創業はいつですか？',
      answer: '1987年（昭和62年）に創業し、地域密着で38年以上の実績と信頼を積み重ねてまいりました。青森県八戸市を拠点に、電気設備工事のプロフェッショナルとして地域の電気インフラを支えています。'
    },
    {
      category: 'その他',
      question: '営業時間を教えてください。',
      answer: '営業時間は月曜日〜土曜日の8:00〜18:00です。日曜日・祝日はお休みをいただいております。お問い合わせフォームは24時間受け付けておりますので、営業時間外でもお気軽にお送りください。'
    }
  ];

  get filteredFaqItems(): FaqItem[] {
    if (this.selectedCategory === 'すべて') {
      return this.faqItems;
    }
    return this.faqItems.filter(item => item.category === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  toggledItems = new Set<number>();

  toggleItem(index: number): void {
    if (this.toggledItems.has(index)) {
      this.toggledItems.delete(index);
    } else {
      this.toggledItems.add(index);
    }
  }

  isOpen(index: number): boolean {
    return this.toggledItems.has(index);
  }
}
