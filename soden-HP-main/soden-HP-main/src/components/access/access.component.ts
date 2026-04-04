import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, GsapScrollAnimateDirective]
})
export class AccessComponent {
  companyInfo = {
    name: '株式会社創電工業',
    nameEn: 'Soden Industry Co., Ltd.',
    postalCode: '〒031-0833',
    address: '青森県八戸市大字大久保字小久保平19-7',
    tel: '0178-25-2172',
    fax: '0178-25-2171',
    hours: '月〜土 8:00〜18:00',
    closed: '日曜日・祝日',
    parking: 'あり（来客用駐車場完備）'
  };

  accessMethods = [
    {
      icon: 'car',
      title: '車でお越しの場合',
      description: '八戸自動車道「八戸IC」より車で約15分。国道45号線沿い、大久保地区。来客用駐車場を完備しております。'
    },
    {
      icon: 'train',
      title: '電車でお越しの場合',
      description: 'JR八戸線「本八戸駅」よりタクシーで約15分。または、JR東北新幹線「八戸駅」よりタクシーで約20分。'
    }
  ];
}
