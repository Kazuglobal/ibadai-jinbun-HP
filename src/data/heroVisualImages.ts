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
    src: '/newsletters/42/image-01.webp',
    alt: '講演会で登壇する様子',
    label: 'GRADUATES',
  },
  alumni: {
    src: '/newsletters/39/image-01.webp',
    alt: 'キャンパスのテーブルで歓談する学生',
    label: 'ALUMNI',
  },
  archive: {
    src: '/newsletters/42/image-04.webp',
    alt: '図書資料の前で撮影された教員ポートレート',
    label: 'ARCHIVE',
  },
} satisfies Record<string, HeroVisualImage>;
