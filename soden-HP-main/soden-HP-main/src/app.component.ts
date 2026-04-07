import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CustomCursorComponent } from './components/custom-cursor/custom-cursor.component';

const SITE_ORIGIN = 'https://soudenkougyou.com';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CustomCursorComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.applyMeta(this.getRouteData());

    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      const data = this.getRouteData();
      this.applyMeta(data);
    });
  }

  private getRouteData(): {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    imageAlt?: string;
  } {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data ?? {};
  }

  private applyMeta(data: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    imageAlt?: string;
  }) {
    const title = data.title
      ?? '株式会社創電工業 | 電気設備工事・設計施工（青森県八戸市）';
    const description = data.description
      ?? '青森県八戸市の株式会社創電工業は、電気設備工事・電気通信工事・消防設備・空調設備・太陽光発電・物流システムの設計施工から保守管理までワンストップ対応。1987年創業、地域密着38年の実績と信頼。';
    const keywords = data.keywords
      ?? '創電工業,株式会社創電工業,電気工事,電気設備工事,電気通信工事,消防設備,空調設備,太陽光発電,物流システム,設計施工,保守管理,八戸市,青森県,八戸 電気工事';
    const image = data.image ?? '/images/companyinfo.jpg';
    const imageAlt = data.imageAlt ?? '株式会社創電工業のチーム';
    const canonicalUrl = this.getCanonicalUrl();
    const resolvedImage = this.resolveUrl(image, canonicalUrl);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'author', content: '株式会社創電工業' });
    this.meta.updateTag({ property: 'og:locale', content: 'ja_JP' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: '株式会社創電工業' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: resolvedImage });
    this.meta.updateTag({ property: 'og:image:alt', content: imageAlt });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: resolvedImage });
    this.meta.updateTag({ name: 'twitter:image:alt', content: imageAlt });

    if (canonicalUrl) {
      this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
      this.meta.updateTag({ name: 'twitter:url', content: canonicalUrl });
      this.updateCanonicalLinks(canonicalUrl);
      this.updateStructuredData({
        title,
        description,
        image: resolvedImage,
        url: canonicalUrl
      });
    }
  }

  private getCanonicalUrl(): string | undefined {
    const currentPath = this.router.url || this.document.location?.pathname || '/';
    const url = new URL(currentPath, SITE_ORIGIN);
    url.hash = '';
    url.search = '';
    return url.toString();
  }

  private resolveUrl(path: string, canonicalUrl?: string): string {
    if (/^https?:\/\//.test(path)) {
      return path;
    }

    if (!canonicalUrl) {
      return path;
    }

    return new URL(path, canonicalUrl).toString();
  }

  private updateCanonicalLinks(canonicalUrl: string) {
    this.setLinkTag('canonical', canonicalUrl);
    this.setLinkTag('alternate', canonicalUrl, { hreflang: 'ja-JP' });
    this.setLinkTag('alternate', canonicalUrl, { hreflang: 'x-default' });
  }

  private setLinkTag(rel: string, href: string, attributes: { hreflang?: string } = {}) {
    const selector = attributes.hreflang
      ? `link[rel="${rel}"][hreflang="${attributes.hreflang}"]`
      : `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (attributes.hreflang) {
        link.setAttribute('hreflang', attributes.hreflang);
      }
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private updateStructuredData(data: {
    title: string;
    description: string;
    image: string;
    url: string;
  }) {
    const baseUrl = new URL('/', data.url).toString().replace(/\/$/, '');
    const organizationId = `${baseUrl}/#organization`;
    const websiteId = `${baseUrl}/#website`;
    const webpageId = `${data.url}#webpage`;

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['LocalBusiness', 'ElectricalContractor'],
          '@id': organizationId,
          name: '株式会社創電工業',
          alternateName: ['Soden Industry Co., Ltd.', '創電工業', 'soudenkougyou'],
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512
          },
          image: data.image,
          description: '青森県八戸市の株式会社創電工業。電気設備工事・電気通信工事・消防設備・空調設備・太陽光発電・物流システムの設計施工から保守管理まで対応。1987年創業、地域密着38年の実績と信頼。',
          telephone: '+81-178-25-2172',
          faxNumber: '+81-178-25-2171',
          foundingDate: '1987',
          areaServed: [
            { '@type': 'AdministrativeArea', name: '青森県' },
            { '@type': 'City', name: '八戸市' },
            { '@type': 'AdministrativeArea', name: '東北地方' }
          ],
          address: {
            '@type': 'PostalAddress',
            postalCode: '031-0833',
            addressRegion: '青森県',
            addressLocality: '八戸市',
            streetAddress: '大字大久保字小久保平19-7',
            addressCountry: 'JP'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 40.5122,
            longitude: 141.4883
          },
          priceRange: '$$',
          currenciesAccepted: 'JPY',
          paymentAccepted: '銀行振込',
          numberOfEmployees: {
            '@type': 'QuantitativeValue',
            minValue: 10,
            maxValue: 50
          },
          knowsAbout: [
            '電気設備工事', '電気通信工事', '消防設備工事',
            '空調設備工事', '太陽光発電設備', '物流システム',
            'ビル保守管理', '公共工事'
          ],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: '事業内容',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '電気設備設計施工' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '太陽光発電設備設計施工' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ビル保守管理' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '物流システム・機械設備工事' } }
            ]
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '08:00',
              closes: '18:00'
            }
          ],
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '+81-178-25-2172',
              contactType: 'customer service',
              areaServed: 'JP',
              availableLanguage: ['Japanese']
            }
          ],
          sameAs: [
            'https://www.google.com/maps/place/株式会社創電工業/@40.5122,141.4883,17z/'
            // TODO: SNSアカウント開設後に追加
            // 'https://www.instagram.com/soden_industry',
            // 'https://www.facebook.com/sodenindustry',
          ]
        },
        {
          '@type': 'WebSite',
          '@id': websiteId,
          url: baseUrl,
          name: '株式会社創電工業',
          alternateName: ['創電工業', 'Soden Industry'],
          publisher: { '@id': organizationId },
          inLanguage: 'ja-JP',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'WebPage',
          '@id': webpageId,
          url: data.url,
          name: data.title,
          description: data.description,
          isPartOf: { '@id': websiteId },
          about: { '@id': organizationId },
          inLanguage: 'ja-JP',
          dateModified: '2026-04-04',
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: data.image
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: this.buildBreadcrumbs(data.url, data.title)
          }
        },
        ...this.buildRouteSpecificSchema(data.url),
        ...this.buildFaqSchema(data.url)
      ]
    };

    this.upsertJsonLd('structured-data', structuredData);
  }

  private buildRouteSpecificSchema(url: string): unknown[] {
    const pathname = new URL(url).pathname;
    const baseUrl = new URL('/', url).toString().replace(/\/$/, '');
    const organizationId = `${baseUrl}/#organization`;

    switch (pathname) {
      case '/services':
        return [
          {
            '@type': 'Service',
            '@id': `${url}#service-page`,
            name: '電気設備・電気通信・消防設備・太陽光発電の設計施工サービス',
            serviceType: [
              '電気設備工事',
              '電気通信工事',
              '消防設備工事',
              '空調設備工事',
              '太陽光発電設備工事',
              '物流システム電気工事',
              '保守管理'
            ],
            provider: { '@id': organizationId },
            areaServed: [
              { '@type': 'City', name: '八戸市' },
              { '@type': 'AdministrativeArea', name: '青森県' },
              { '@type': 'AdministrativeArea', name: '東北地方' }
            ],
            availableChannel: {
              '@type': 'ServiceChannel',
              serviceUrl: `${baseUrl}/contact`,
              servicePhone: '+81-178-25-2172'
            }
          }
        ];
      case '/cases':
        return [
          {
            '@type': 'CollectionPage',
            '@id': `${url}#collection`,
            name: '株式会社創電工業の施工事例',
            description: '八戸市・青森県を中心に手がけた電気設備工事、消防設備工事、太陽光発電設備、通信設備、物流システム工事の施工実績一覧。',
            isPartOf: { '@id': `${baseUrl}/#website` },
            about: { '@id': organizationId }
          }
        ];
      case '/recruit':
        return [
          {
            '@type': 'AboutPage',
            '@id': `${url}#recruit`,
            name: '株式会社創電工業の採用情報',
            description: '八戸市を拠点に青森県内の電気設備工事・電気通信工事・消防設備工事を支える人材採用ページ。未経験者歓迎、資格取得支援あり。',
            about: { '@id': organizationId }
          }
        ];
      case '/contact':
        return [
          {
            '@type': 'ContactPage',
            '@id': `${url}#contact-page`,
            name: '株式会社創電工業へのお問い合わせ',
            description: '八戸市・青森県の電気設備工事、電気通信工事、消防設備、太陽光発電、採用に関するお問い合わせ窓口。',
            about: { '@id': organizationId },
            mainEntity: {
              '@type': 'Organization',
              '@id': organizationId,
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+81-178-25-2172',
                  contactType: 'customer service',
                  areaServed: ['八戸市', '青森県', '東北地方'],
                  availableLanguage: ['Japanese']
                }
              ]
            }
          }
        ];
      default:
        return [];
    }
  }

  private buildBreadcrumbs(url: string, title: string): unknown[] {
    const baseUrl = new URL('/', url).toString().replace(/\/$/, '');
    const items: unknown[] = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: baseUrl
      }
    ];

    const pathname = new URL(url).pathname;
    if (pathname !== '/' && pathname !== '') {
      const pathNames: Record<string, string> = {
        '/company': '会社概要',
        '/services': '事業内容',
        '/cases': '施工事例',
        '/news': 'お知らせ',
        '/faq': 'よくある質問',
        '/access': 'アクセス',
        '/recruit': '採用情報',
        '/contact': 'お問い合わせ',
        '/privacy-policy': 'プライバシーポリシー'
      };
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: pathNames[pathname] ?? title,
        item: url
      });
    }

    return items;
  }

  private buildFaqSchema(url: string): unknown[] {
    const pathname = new URL(url).pathname;
    if (pathname !== '/' && pathname !== '' && pathname !== '/faq') {
      return [];
    }
    return [
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'どのようなサービスを提供していますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '電気設備工事、電気通信工事、消防設備工事、空調設備工事、太陽光発電設備の設計施工、物流システム・機械設備工事、ビル保守管理を行っています。設計から施工・保守管理までワンストップで対応いたします。'
            }
          },
          {
            '@type': 'Question',
            name: '対応エリアはどこですか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '青森県八戸市を拠点に、青森県内全域を中心に対応しております。大規模案件は東北地方全域への出張施工も承ります。'
            }
          },
          {
            '@type': 'Question',
            name: '太陽光発電の設置は対応していますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'はい、太陽光発電設備の設計・施工・保守管理まで一貫して対応しております。産業用から住宅用まで幅広く実績がございます。'
            }
          },
          {
            '@type': 'Question',
            name: '求人は募集していますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '電気工事士・施工管理技士を随時募集しております。未経験の方も歓迎です。詳しくは採用情報ページをご覧ください。'
            }
          },
          {
            '@type': 'Question',
            name: '創業はいつですか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '1987年に創業し、地域密着で38年以上の実績と信頼を積み重ねてまいりました。'
            }
          }
        ]
      }
    ];
  }

  private upsertJsonLd(id: string, data: unknown) {
    let script = this.document.head.querySelector<HTMLScriptElement>(`script#${id}`);
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
