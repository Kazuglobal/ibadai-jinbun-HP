import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function useHeroFirstViewAnimation(onComplete?: () => void) {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const q = gsap.utils.selector(root);
      const introElements = q('[data-hero-intro]');

      if (prefersReducedMotion) {
        gsap.set(introElements, { clearProps: 'opacity,visibility,transform,clipPath' });
        onComplete?.();
        return;
      }

      const photos = q('[data-hero-intro="photo"]');
      const band = q('[data-hero-intro="band"]');
      const rules = q('[data-hero-intro="rule"]');
      const network = q('[data-hero-intro="network"]');
      const eyebrow = q('[data-hero-intro="eyebrow"]');
      const titleChars = q('[data-hero-intro="title-char"]');
      const copy = q('[data-hero-intro="copy"]');
      const actions = q('[data-hero-intro="actions"]');
      const ornament = q('[data-hero-intro="ornament"]');

      gsap.set([...photos, ...band, ...rules, ...network, ...eyebrow, ...titleChars, ...copy, ...actions, ...ornament], {
        autoAlpha: 0,
      });
      gsap.set(photos, { y: -34, scale: 1.04, transformOrigin: '50% 50%' });
      gsap.set(band, { y: -12, scaleX: 0.22, transformOrigin: '50% 50%' });
      gsap.set(rules, { scaleX: 0, transformOrigin: '50% 50%' });
      gsap.set(titleChars, { y: 64, rotation: 8, scale: 0.96, transformOrigin: '50% 80%' });

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete,
      });

      timeline
        .to(photos, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.15,
          stagger: { each: 0.14, from: 'start' },
        })
        .to(
          band,
          {
            autoAlpha: 1,
            y: 0,
            scaleX: 1,
            duration: 0.75,
            ease: 'power4.out',
          },
          '-=0.25',
        )
        .to(
          rules,
          {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.85,
            ease: 'power2.out',
          },
          '<0.08',
        )
        .to(
          network,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
          },
          '<0.18',
        )
        .fromTo(
          eyebrow,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.58 },
          '-=0.05',
        )
        .to(
          titleChars,
          {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.78,
            ease: 'back.out(1.35)',
            stagger: { each: 0.035, from: 'start' },
          },
          '-=0.1',
        )
        .fromTo(
          copy,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.58 },
          '-=0.28',
        )
        .fromTo(
          actions,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.52 },
          '-=0.2',
        )
        .fromTo(
          ornament,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 0.85, y: 0, duration: 0.5 },
          '-=0.2',
        );
    },
    { scope: rootRef, dependencies: [onComplete], revertOnUpdate: true },
  );

  return rootRef;
}
