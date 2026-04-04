import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, GsapScrollAnimateDirective]
})
export class PrivacyPolicyComponent {
  lastUpdated = '2026年3月';

  sections = [
    {
      title: '1. 個人情報の収集について',
      content: `当社は、お問い合わせフォームおよび採用エントリーフォームを通じて、以下の個人情報を収集することがあります。\n\n・氏名\n・メールアドレス\n・電話番号\n・お問い合わせ内容\n・その他、ご本人が任意に提供した情報`
    },
    {
      title: '2. 個人情報の利用目的',
      content: `収集した個人情報は、以下の目的のために利用いたします。\n\n・お問い合わせへの回答・対応\n・採用選考の実施および採用に関する連絡\n・当社サービスに関する情報提供\n・法令に基づく対応`
    },
    {
      title: '3. 個人情報の第三者提供',
      content: `当社は、以下の場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。\n\n・法令に基づく場合\n・人の生命・身体・財産の保護のために必要がある場合\n・公衆衛生の向上または児童の健全な育成の推進に特に必要がある場合\n・国の機関等が法令の定める事務を遂行することに協力する必要がある場合`
    },
    {
      title: '4. 個人情報の安全管理',
      content: `当社は、収集した個人情報の漏洩、紛失、改ざん等を防止するため、適切なセキュリティ対策を実施します。\n\nお問い合わせ・採用フォームの送信データは、Google LLC が提供する Google Apps Script（GAS）を経由して処理されます。データの取り扱いについては、Google のプライバシーポリシーもあわせてご確認ください。`
    },
    {
      title: '5. 個人情報の開示・訂正・削除',
      content: `ご本人から個人情報の開示・訂正・削除のご要望があった場合は、本人確認のうえ、合理的な期間内に対応いたします。\n\nご要望は、下記お問い合わせ窓口までご連絡ください。`
    },
    {
      title: '6. Cookie および解析ツールについて',
      content: `当サイトでは現在、Cookie による追跡や Google Analytics 等の解析ツールは使用しておりません。\n\nなお、将来的にこれらを導入する場合は、本ポリシーを改定の上、改めてお知らせいたします。`
    },
    {
      title: '7. プライバシーポリシーの改定',
      content: `当社は、法令の改正や運用の変更に応じて、本ポリシーを予告なく改定することがあります。\n\n改定後のポリシーは、当サイトに掲載した時点から効力を生じます。重要な変更については、サイト上でお知らせいたします。`
    },
    {
      title: '8. お問い合わせ窓口',
      content: `個人情報の取り扱いに関するご質問・ご要望は、下記までお問い合わせください。\n\n株式会社創電工業\n〒031-0833 青森県八戸市大字大久保字小久保平19-7\nTEL: 0178-25-2172（受付時間 8:00〜18:00 ／ 日・祝日除く）`
    }
  ];
}
