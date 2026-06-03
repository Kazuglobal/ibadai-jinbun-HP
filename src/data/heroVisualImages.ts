export type HeroVisualImage = {
  src: string;
  alt: string;
  label: string;
};

// Hero visual image slots. Replace any src with a local public path or another URL.
// Example: src: "/images/hero-campus.jpg"
export const heroVisualImages = {
  campus: {
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    alt: '大学キャンパスの建物',
    label: 'CAMPUS',
  },
  graduation: {
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=900&auto=format&fit=crop',
    alt: '卒業式の風景',
    label: 'GRADUATES',
  },
  alumni: {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop',
    alt: '同窓生が語り合う様子',
    label: 'ALUMNI',
  },
  archive: {
    src: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=900&auto=format&fit=crop',
    alt: '書籍とアーカイブ資料',
    label: 'ARCHIVE',
  },
} satisfies Record<string, HeroVisualImage>;
