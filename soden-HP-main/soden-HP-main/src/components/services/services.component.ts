import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

interface Service {
  number: string;
  title: string;
  description: string;
  details: string[];
  image: string;
  imageAlt: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, GsapScrollAnimateDirective]
})
export class ServicesComponent {
  services: Service[] = [
    {
      number: '01',
      title: '電気設備工事',
      description: '工場・商業施設・公共施設・住宅の電気設備の設計から施工、保守管理まで一貫して対応します。高圧受変電設備、動力設備、照明設備、コンセント設備など、あらゆる電気設備に対応可能です。',
      details: [
        '高圧受変電設備の設計・施工',
        '動力設備・照明設備の新設・改修',
        'LED照明への省エネ改修工事',
        '分電盤・配電盤の設置・更新',
        '工場の生産ライン電気設備',
        '非常用発電設備の設置'
      ],
      image: '/images/contact/contact1.png',
      imageAlt: '電気設備工事の施工現場'
    },
    {
      number: '02',
      title: '電気通信工事',
      description: '情報通信設備の設計・施工を行います。LAN配線、光ファイバー敷設、電話設備、放送設備など、現代のビジネスに不可欠な通信インフラを構築します。',
      details: [
        'LAN・光ファイバーケーブル配線',
        '電話交換機設備の設置',
        '構内放送設備・インターホン設備',
        'テレビ共聴設備・CATV設備',
        '監視カメラ・セキュリティシステム',
        'ネットワーク機器の設置・設定'
      ],
      image: '/images/contact/contact2.png',
      imageAlt: '電気通信工事の作業風景'
    },
    {
      number: '03',
      title: '消防設備工事',
      description: '火災報知設備、消火設備、避難設備の設計・施工・点検を行います。法令に基づく定期点検も実施し、建物の安全を守ります。',
      details: [
        '自動火災報知設備の設計・施工',
        '消火器・屋内消火栓設備',
        '誘導灯・非常照明設備',
        'スプリンクラー設備',
        '消防設備の定期点検・報告',
        '防災設備の改修・更新工事'
      ],
      image: '/images/contact/contact3.png',
      imageAlt: '消防設備の点検作業'
    },
    {
      number: '04',
      title: '空調設備工事',
      description: '業務用エアコン、換気設備、空調ダクトの設計・施工を行います。快適な室内環境の実現と省エネ性能の両立を追求します。',
      details: [
        '業務用エアコンの設計・施工',
        '換気設備・排煙設備',
        '空調ダクトの設計・施工',
        'ヒートポンプ式空調システム',
        '全館空調システム',
        '空調設備の保守・メンテナンス'
      ],
      image: '/images/contact/contact4.png',
      imageAlt: '空調設備の施工'
    },
    {
      number: '05',
      title: '太陽光発電設備',
      description: '産業用・住宅用の太陽光発電設備の設計・施工・保守管理を行います。再生可能エネルギーの普及を通じて、SDGsの達成に貢献します。',
      details: [
        '産業用太陽光発電システムの設計・施工',
        '住宅用太陽光パネルの設置',
        '蓄電池システムの導入',
        '売電・自家消費シミュレーション',
        '太陽光発電設備の保守・点検',
        '補助金申請のサポート'
      ],
      image: '/images/companyinfo.jpg',
      imageAlt: '太陽光発電設備の施工'
    },
    {
      number: '06',
      title: '物流システム・機械設備',
      description: '物流倉庫の自動化システム、コンベヤー設備、制御盤の設計・施工を行います。生産性向上とコスト削減を実現します。',
      details: [
        'コンベヤー・搬送システムの設計・施工',
        '自動倉庫システムの電気設備',
        'PLC制御盤の設計・製作',
        '自動制御装置の設計・施工',
        '工場の省力化・自動化設備',
        '設備の保守・メンテナンス'
      ],
      image: '/images/companyinfo.jpg',
      imageAlt: '物流システムの施工'
    }
  ];

  isEven(index: number): boolean {
    return index % 2 === 0;
  }
}
