import { ArrowRight } from 'lucide-react';
import { heroVisualImages, type HeroVisualImage } from '../data/heroVisualImages';

const actions = [
  { label: 'NEWS', href: '#news', primary: true },
  { label: 'ADDRESS', href: '#address', primary: false },
  { label: 'ARCHIVE', href: '#archive', primary: false },
];

function Photo({ image, className }: { image: HeroVisualImage; className: string }) {
  return (
    <figure className={`overflow-hidden bg-stone-200 ${className}`}>
      <img src={image.src} alt={image.alt} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
    </figure>
  );
}

function HeroActions({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? 'grid gap-2.5' : 'flex items-center gap-4'}>
      {actions.map((action) => (
        <a
          key={action.href}
          href={action.href}
          className={`${mobile ? 'h-10 rounded-[4px] px-4 text-xs' : 'h-12 min-w-[120px] rounded-[3px] px-5 text-xs'} flex items-center justify-between border border-[#00204A] font-serif font-semibold tracking-[0.28em] transition-colors ${action.primary ? 'bg-[#00204A] text-white' : 'bg-transparent text-[#00204A] hover:bg-white'}`}
        >
          <span>{action.label}</span>
          <ArrowRight className="h-4 w-4 stroke-[1.4]" />
        </a>
      ))}
    </div>
  );
}

function DesktopImageGrid() {
  return (
    <div className="relative min-h-[560px]">
      <Photo image={heroVisualImages.campus} className="absolute left-0 top-0 h-[54%] w-[58%]" />
      <Photo image={heroVisualImages.graduation} className="absolute right-[10%] top-[7%] h-[48%] w-[29%] rounded-t-full" />
      <Photo image={heroVisualImages.archive} className="absolute bottom-[12%] left-0 h-[28%] w-[40%]" />
      <Photo image={heroVisualImages.alumni} className="absolute bottom-[12%] left-[42%] h-[28%] w-[40%]" />
      <div className="absolute bottom-[12%] left-[80%] h-7 w-7 bg-[#00204A]" aria-hidden="true" />
      <div className="absolute right-[4%] top-[8%] h-[17%] w-px bg-[#CD9535]" aria-hidden="true" />
      <div className="absolute right-[4%] top-[55%] h-[13%] w-px bg-[#CD9535]" aria-hidden="true" />
      <div className="absolute right-[1.2%] top-[32%] flex h-[170px] items-center justify-center" aria-hidden="true">
        <span className="rotate-90 whitespace-nowrap font-serif text-[14px] font-bold tracking-[0.38em] text-[#00204A]">ALUMNI NETWORK</span>
      </div>
      <div className="absolute bottom-[5.6%] left-0 h-px w-[82%] bg-[#00204A]" aria-hidden="true" />
      <div className="absolute bottom-[5.6%] left-[82%] h-px w-[18%] bg-[#CD9535]" aria-hidden="true" />
    </div>
  );
}

function DesktopHero() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid min-h-[560px] grid-cols-[42%_58%] overflow-hidden bg-transparent">
        <div className="relative py-10 pr-10">
          <div className="mt-4 flex items-center gap-5">
            <span className="h-9 w-px bg-[#CD9535]" />
            <p className="font-serif text-[15px] tracking-[0.12em] text-[#00204A]">学びの記憶と人のつながりを、未来へ</p>
          </div>
          <h1 className="mt-7 max-w-[430px] font-serif text-[46px] font-bold leading-[1.28] text-[#00204A]">
            知のつながりを、
            <br />
            未来へひらく。
          </h1>
          <div className="mt-5 h-px w-20 bg-[#CD9535]" aria-hidden="true" />
          <p className="mt-6 whitespace-pre-line font-serif text-[15px] font-semibold leading-[1.8] tracking-[0.12em] text-[#00204A]">
            卒業生・在学生・教職員をつなぐ{'\n'}同窓会プラットフォーム
          </p>
          <div className="mt-8">
            <HeroActions />
          </div>
          <div className="absolute bottom-[15%] left-0 grid grid-cols-8 gap-x-3 gap-y-2 opacity-85" aria-hidden="true">
            {Array.from({ length: 32 }).map((_, index) => (
              <span key={index} className="h-0.5 w-0.5 rounded-full bg-[#00204A]" />
            ))}
          </div>
        </div>
        <DesktopImageGrid />
      </div>
    </div>
  );
}

function MobileHero() {
  return (
    <div className="mx-auto max-w-[430px] border-y border-[#D8D2C5] bg-[#FBFAF6]">
      <Photo image={heroVisualImages.campus} className="h-[206px] w-full" />
      <div className="grid grid-cols-2">
        <Photo image={heroVisualImages.archive} className="h-[86px] w-full" />
        <Photo image={heroVisualImages.alumni} className="h-[86px] w-full" />
      </div>
      <div className="flex h-9 items-center justify-center gap-5 bg-[#00204A] text-white">
        <span className="h-px w-12 bg-[#CD9535]" />
        <span className="font-serif text-[11px] font-semibold tracking-[0.38em]">ALUMNI NETWORK</span>
        <span className="h-px w-12 bg-[#CD9535]" />
      </div>
      <div className="px-6 pb-10 pt-7">
        <p className="font-serif text-[13px] font-semibold leading-relaxed tracking-[0.11em] text-[#00204A]">学びの記憶と人のつながりを、未来へ</p>
        <h1 className="mt-4 font-serif text-[32px] font-bold leading-[1.35] text-[#00204A]">
          知のつながりを、
          <br />
          未来へひらく。
        </h1>
        <div className="mt-4 h-px w-16 bg-[#CD9535]" aria-hidden="true" />
        <p className="mt-4 font-serif text-[12px] font-semibold leading-[1.9] tracking-[0.12em] text-[#00204A]">
          卒業生・在学生・教職員をつなぐ
          <br />
          同窓会プラットフォーム
        </p>
        <div className="mt-6">
          <HeroActions mobile />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F5] pb-14 pt-4 lg:pb-12 lg:pt-0" id="home-hero-section">
      <div className="hidden lg:block">
        <DesktopHero />
      </div>
      <div className="block px-4 lg:hidden">
        <MobileHero />
      </div>
    </section>
  );
}
