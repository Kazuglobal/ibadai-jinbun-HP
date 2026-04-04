import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

interface CaseItem {
  title: string;
  category: string;
  location: string;
  description: string;
  scope: string[];
  image: string;
  imageAlt: string;
}

@Component({
  selector: 'app-cases-detail',
  templateUrl: './cases-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, GsapScrollAnimateDirective]
})
export class CasesDetailComponent {
  categories = ['すべて', '電気設備', '太陽光発電', '消防設備', '通信設備', '物流システム'];
  selectedCategory = 'すべて';

  cases: CaseItem[] = [
    {
      title: '大型商業施設 電気設備新設工事',
      category: '電気設備',
      location: '八戸市内',
      description: '大型商業施設の新築に伴う電気設備の設計・施工。高圧受変電設備、動力設備、照明設備、非常用発電設備を一括で担当しました。',
      scope: ['高圧受変電設備', '動力・照明設備', '非常用発電設備', 'LED照明'],
      image: '/images/contact/contact1.png',
      imageAlt: '商業施設の電気設備工事'
    },
    {
      title: '工場 太陽光発電設備設置',
      category: '太陽光発電',
      location: '青森県内',
      description: '食品加工工場の屋根に太陽光パネル（出力100kW）を設置。自家消費型のシステムを導入し、電力コストの大幅削減を実現しました。',
      scope: ['太陽光パネル100kW', 'パワーコンディシ��ナー', '監視システム', '電力買取手続き'],
      image: '/images/contact/contact2.png',
      imageAlt: '工場屋根の太陽光発電パネル'
    },
    {
      title: '公共施設 消防設備改修工事',
      category: '消防設備',
      location: '八戸市内',
      description: '築30年の公共施設における消防設備の全面改修。自動火災報知設備、誘導灯、非常照明の更新を行い、最新の防災基準に適合させました。',
      scope: ['自動火災報���設備', '誘導灯・非常照明', '消火栓設備', '定期点検体制構築'],
      image: '/images/contact/contact3.png',
      imageAlt: '公共施設の消防設備改修'
    },
    {
      title: 'オフィスビル ネットワーク構築',
      category: '通信設備',
      location: '八戸市内',
      description: 'オフィスビル全館のLAN配線・Wi-Fi環境の構築。各フロアへの光ファイバー敷設と、監視カメラシステムの導入を行いました。',
      scope: ['光ファイバー敷設', 'LAN配線工事', 'Wi-Fiアクセスポイント', '監視カメラシステム'],
      image: '/images/contact/contact4.png',
      imageAlt: 'オフィスビルの通信設備'
    },
    {
      title: '物流倉庫 搬送システム電気工事',
      category: '物流システム',
      location: '青森県内',
      description: '物流倉庫の自動搬送システムに伴う電気設備工事。コンベヤーラインの動力設備、PLC制御盤の設計・製作、センサー類の設置を担当しました。',
      scope: ['コンベヤー動力設備', 'PLC制御盤設計・製作', 'センサー設置', '試運転調整'],
      image: '/images/companyinfo.jpg',
      imageAlt: '物流倉庫の搬送システム'
    },
    {
      title: '住宅 LED照明リニューアル工事',
      category: '電気設備',
      location: '八戸市内',
      description: '集合住宅共用部の照明をすべてLEDに更新。年間電力消費量を約60%削減し、管理組合の電気代負担を大幅に軽減しました。',
      scope: ['LED照明器具交換', '調光制御システム', '人感センサー設置', '電力使用量測定'],
      image: '/images/contact/contact1.png',
      imageAlt: 'LED照明リニューアル工事'
    }
  ];

  get filteredCases(): CaseItem[] {
    if (this.selectedCategory === 'すべて') {
      return this.cases;
    }
    return this.cases.filter(c => c.category === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}
