import React from 'react';

export type NewsletterArticlePhoto = {
  image: string;
  label: string;
  articleId?: string;
  variant?: 'default' | 'portrait';
};

type NewsletterArticleBodyProps = {
  articleId: string;
  body: string[];
  photos: NewsletterArticlePhoto[];
  fontScale: number;
};

function groupPhotosByParagraph(bodyLength: number, photos: NewsletterArticlePhoto[]) {
  const groups = new Map<number, NewsletterArticlePhoto[]>();

  photos.forEach((photo, photoIndex) => {
    const paragraphIndex = Math.min(
      Math.max(bodyLength - 1, 0),
      Math.floor(((photoIndex + 1) * bodyLength) / (photos.length + 1)),
    );
    const group = groups.get(paragraphIndex) ?? [];
    group.push(photo);
    groups.set(paragraphIndex, group);
  });

  return groups;
}

export default function NewsletterArticleBody({
  articleId,
  body,
  photos,
  fontScale,
}: NewsletterArticleBodyProps) {
  const photosByParagraph = groupPhotosByParagraph(body.length, photos);

  return (
    <div
      className="space-y-6 text-stone-700 transition-[font-size] duration-200"
      style={{ fontSize: `${fontScale}rem`, lineHeight: 1.95 }}
    >
      {body.map((paragraph, index) => {
        const paragraphPhotos = photosByParagraph.get(index) ?? [];

        return (
          <React.Fragment key={`${articleId}-${index}`}>
            <p
              className={
                index === 0
                  ? 'first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[4.6em] first-letter:font-bold first-letter:leading-[0.84] first-letter:text-[#B57A24]'
                  : undefined
              }
            >
              {paragraph}
            </p>

            {paragraphPhotos.length > 0 && (
              <div className={`grid gap-4 py-2 ${paragraphPhotos.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {paragraphPhotos.map((photo) => (
                  <figure
                    key={photo.image}
                    className={`border border-[#D7C8AA] bg-[#F8F1E6] p-3 ${
                      photo.variant === 'portrait' ? 'mx-auto w-full max-w-[240px] sm:max-w-[280px]' : ''
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center overflow-hidden bg-stone-200 ${
                        photo.variant === 'portrait' ? 'min-h-0' : 'min-h-52'
                      }`}
                    >
                      <img
                        src={photo.image}
                        alt={photo.label}
                        loading="lazy"
                        className={photo.variant === 'portrait' ? 'w-full object-contain' : 'max-h-[560px] w-full object-contain'}
                      />
                    </div>
                    <figcaption className="mt-3 text-xs font-bold leading-5 text-stone-500">
                      {photo.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
