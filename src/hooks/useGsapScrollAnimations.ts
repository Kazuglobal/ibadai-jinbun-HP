import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function visibleElements(elements: HTMLElement[]) {
  return elements.filter((element) => element.getClientRects().length > 0);
}

export function useGsapScrollAnimations(dependencyKey: unknown) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const toArray = (selector: string) => visibleElements(gsap.utils.toArray<HTMLElement>(selector, root));
      const titleItems = toArray('[data-gsap-title]');
      const copyItems = toArray('[data-gsap-copy]');
      const cardItems = toArray('[data-gsap-card]');
      const mediaItems = toArray('[data-gsap-media]');
      const lineItems = toArray('[data-gsap-line]');
      const allItems = [...titleItems, ...copyItems, ...cardItems, ...mediaItems, ...lineItems];

      if (reduceMotion) {
        gsap.set(allItems, { clearProps: 'opacity,visibility,transform' });
        return;
      }

      gsap.set(titleItems, { autoAlpha: 0, y: 28 });
      gsap.set(copyItems, { autoAlpha: 0, y: 22 });
      gsap.set(cardItems, { autoAlpha: 0, y: 28 });
      gsap.set(mediaItems, { autoAlpha: 0, y: 26, scale: 0.985 });
      gsap.set(lineItems, { autoAlpha: 0, scaleX: 0, transformOrigin: 'left center' });

      const sectionItems = (selector: string, section: HTMLElement) =>
        visibleElements(gsap.utils.toArray<HTMLElement>(selector, section)).filter(
          (item) => item.closest('[data-gsap-section]') === section,
        );

      toArray('[data-gsap-section]').forEach((section, index) => {
        const title = sectionItems('[data-gsap-title]', section);
        const copy = sectionItems('[data-gsap-copy]', section);
        const media = sectionItems('[data-gsap-media]', section);
        const lines = sectionItems('[data-gsap-line]', section);

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,
            refreshPriority: index,
          },
          defaults: { duration: 0.68, ease: 'power3.out' },
        });

        timeline
          .to(title, { autoAlpha: 1, y: 0 }, 0)
          .to(lines, { autoAlpha: 1, scaleX: 1, duration: 0.72 }, '<0.08')
          .to(copy, { autoAlpha: 1, y: 0 }, '<0.1')
          .to(media, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08 }, '<0.06');
      });

      ScrollTrigger.batch(cardItems, {
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

      const matchMedia = gsap.matchMedia();
      matchMedia.add('(min-width: 1024px)', () => {
        mediaItems.forEach((media, index) => {
          gsap.to(media, {
            y: index % 2 === 0 ? -18 : 18,
            ease: 'none',
            scrollTrigger: {
              trigger: media,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        });
      });

      const images = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
      const pendingImages = images.filter((image) => !image.complete);
      const refresh = () => ScrollTrigger.refresh();
      pendingImages.forEach((image) => image.addEventListener('load', refresh, { once: true }));
      const fontRefresh = window.setTimeout(refresh, 250);

      return () => {
        window.clearTimeout(fontRefresh);
        pendingImages.forEach((image) => image.removeEventListener('load', refresh));
        matchMedia.revert();
      };
    },
    { scope: rootRef, dependencies: [dependencyKey], revertOnUpdate: true },
  );

  return rootRef;
}
