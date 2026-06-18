export type HeroVisualImage = {
  src: string;
  alt: string;
  label: string;
};

// Hero visual image slots. Replace any src with a local public path or another URL.
// Example: src: "/images/hero-campus.jpg"
export const heroVisualImages = {
  campus: {
    src: '/newsletters/42/image-02.webp',
    alt: '桜が咲く茨城大学の校舎',
    label: 'CAMPUS',
  },
  graduation: {
    src: '/newsletters/42/image-05.webp',
    alt: '茨城大学関係者の記念撮影',
    label: 'GRADUATES',
  },
  alumni: {
    src: '/newsletters/39/image-01.webp',
    alt: 'キャンパスのテーブルで歓談する学生',
    label: 'ALUMNI',
  },
  archive: {
    src: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=900&auto=format&fit=crop',
    alt: '書籍とアーカイブ資料',
    label: 'ARCHIVE',
  },
} satisfies Record<string, HeroVisualImage>;
