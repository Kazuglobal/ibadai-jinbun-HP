import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function isVisible(element: HTMLElement) {
  return element.getClientRects().length > 0;
}

export function useGsapHomeAnimations(enabled: boolean, onIntroComplete?: () => void) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!enabled) return;

      const root = rootRef.current;
      if (!root) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scopedElements = (selector: string) =>
        gsap.utils.toArray<HTMLElement>(selector, root).filter(isVisible);

      const animatedElements = scopedElements(
        '[data-gsap], [data-gsap-section-title], [data-gsap-card]',
      );

      if (prefersReducedMotion) {
        gsap.set(animatedElements, { clearProps: 'opacity,visibility,transform' });
        onIntroComplete?.();
        return;
      }

      const heroEyebrow = scopedElements('[data-gsap="hero-eyebrow"]');
      const heroTitle = scopedElements('[data-gsap="hero-title"]');
      const heroRule = scopedElements('[data-gsap="hero-rule"]');
      const heroCopy = scopedElements('[data-gsap="hero-copy"]');
      const heroActions = scopedElements('[data-gsap="hero-actions"]');
      const heroPhotos = scopedElements('[data-gsap="hero-photo"]');

      const heroTimelineTargets = [
        ...heroEyebrow,
        ...heroTitle,
        ...heroRule,
        ...heroCopy,
        ...heroActions,
        ...heroPhotos,
      ];

      if (heroTimelineTargets.length > 0) {
        gsap.set(heroTimelineTargets, { autoAlpha: 0 });

        const timeline = gsap.timeline({
          defaults: { duration: 0.7, ease: 'power3.out' },
          onComplete: onIntroComplete,
        });

        timeline
          .fromTo(heroEyebrow, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0 }, 0.05)
          .fromTo(heroTitle, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, '<0.12')
          .fromTo(heroRule, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0 }, '<0.12')
          .fromTo(heroCopy, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, '<0.10')
          .fromTo(heroActions, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0 }, '<0.10')
          .fromTo(
            heroPhotos,
            { autoAlpha: 0, y: 24, scale: 0.985 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.08 },
            '<0.08',
          );
      } else {
        onIntroComplete?.();
      }

      const matchMedia = gsap.matchMedia();
      matchMedia.add('(min-width: 1024px)', () => {
        const desktopPhotos = scopedElements('[data-gsap="hero-photo"]');

        desktopPhotos.forEach((photo, index) => {
          gsap.to(photo, {
            y: index % 2 === 0 ? 24 : -24,
            ease: 'none',
            scrollTrigger: {
              trigger: root.querySelector('[data-gsap="hero-section"]') ?? photo,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        });
      });

      const revealItems = scopedElements('[data-gsap-section-title], [data-gsap-card]');
      if (revealItems.length > 0) {
        gsap.set(revealItems, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(revealItems, {
          start: 'top 85%',
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              ease: 'power3.out',
              stagger: 0.08,
              overwrite: true,
            });
          },
        });
      }

      const pendingImages = Array.from(root.querySelectorAll('img')).filter(
        (image): image is HTMLImageElement =>
          image instanceof HTMLImageElement && !image.complete,
      );
      const refresh = () => ScrollTrigger.refresh();
      pendingImages.forEach((image) => image.addEventListener('load', refresh, { once: true }));

      return () => {
        pendingImages.forEach((image) => image.removeEventListener('load', refresh));
        matchMedia.revert();
      };
    },
    { scope: rootRef, dependencies: [enabled, onIntroComplete], revertOnUpdate: true },
  );

  return rootRef;
}
