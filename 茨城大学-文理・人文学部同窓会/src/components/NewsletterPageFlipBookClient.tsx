import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, FileText, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const pages = Array.from(
  { length: 8 },
  (_, index) => `/newsletters/43/pdf-pages/page-${String(index + 1).padStart(2, '0')}.webp`,
);

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

type PageFlipApi = {
  pageFlip: () => {
    flipNext: (corner?: 'top' | 'bottom') => void;
    flipPrev: (corner?: 'top' | 'bottom') => void;
    flip: (page: number, corner?: 'top' | 'bottom') => void;
  };
};

type PageProps = {
  index: number;
  src: string;
};

type PinchStart = {
  distance: number;
  zoom: number;
  centerX: number;
  centerY: number;
  scrollLeft: number;
  scrollTop: number;
};

type PdfDocument = Awaited<ReturnType<typeof loadPdfDocument>>;

let pdfDocumentPromise: Promise<import('pdfjs-dist').PDFDocumentProxy> | null = null;

async function loadPdfDocument() {
  if (!pdfDocumentPromise) {
    pdfDocumentPromise = Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
    ]).then(([pdfjs, worker]) => {
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      return pdfjs.getDocument({ url: '/newsletters/43/newsletter-43.pdf' }).promise;
    });
  }

  return pdfDocumentPromise;
}

const getTouchDistance = (touches: TouchList) =>
  Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY,
  );

const BookPage = React.forwardRef<HTMLDivElement, PageProps>(({ index, src }, ref) => (
  <div ref={ref} className="h-full w-full overflow-hidden bg-white" data-density="soft">
    <img
      src={src}
      alt={`同窓会報第43号 ${index + 1}ページ`}
      className="h-full w-full select-none object-contain"
      draggable={false}
      loading={index < 2 ? 'eager' : 'lazy'}
      fetchPriority={index < 2 ? 'high' : 'auto'}
      decoding={index < 2 ? 'sync' : 'async'}
    />
  </div>
));

BookPage.displayName = 'BookPage';

function HighResolutionPdfPage({ pageIndex, zoom }: { pageIndex: number; zoom: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [isRendering, setIsRendering] = React.useState(true);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => setContainerWidth(container.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || containerWidth === 0) return;

    let active = true;
    let renderTask: ReturnType<
      Awaited<ReturnType<PdfDocument['getPage']>>['render']
    > | null = null;
    setIsRendering(true);

    void loadPdfDocument()
      .then((pdf) => pdf.getPage(pageIndex + 1))
      .then((page) => {
        if (!active) return;

        const unscaledViewport = page.getViewport({ scale: 1 });
        const renderScale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale: renderScale });
        const outputScale = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) return;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${(containerWidth * unscaledViewport.height) / unscaledViewport.width}px`;

        renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform:
            outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
        });
        return renderTask.promise;
      })
      .then(() => {
        if (active) setIsRendering(false);
      })
      .catch((error: unknown) => {
        if (
          active &&
          (!(error instanceof Error) || error.name !== 'RenderingCancelledException')
        ) {
          console.error('PDF page rendering failed', error);
        }
      });

    return () => {
      active = false;
      renderTask?.cancel();
    };
  }, [containerWidth, pageIndex, zoom]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[520/735] shrink-0 overflow-hidden bg-white shadow-[0_22px_55px_rgba(0,0,0,0.34)]"
      style={{
        width: `${zoom * 100}%`,
        maxWidth: `${520 * zoom}px`,
      }}
      aria-label={`同窓会報第43号 ${pageIndex + 1}ページの高解像度表示`}
    >
      <canvas ref={canvasRef} className="block h-full w-full bg-white" />
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-xs font-bold text-[#07172C]">
          高精細な紙面を読み込んでいます...
        </div>
      )}
    </div>
  );
}

export default function NewsletterPageFlipBookClient() {
  const bookRef = React.useRef<PageFlipApi | null>(null);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [isFlipping, setIsFlipping] = React.useState(false);
  const [zoom, setZoom] = React.useState(MIN_ZOOM);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const zoomRef = React.useRef(MIN_ZOOM);
  const pinchStartRef = React.useRef<PinchStart | null>(null);

  const changeZoom = React.useCallback((nextZoom: number) => {
    const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    zoomRef.current = clampedZoom;
    setZoom(clampedZoom);
    if (clampedZoom === MIN_ZOOM) {
      window.requestAnimationFrame(() => {
        viewportRef.current?.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      });
    }
  }, []);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) return;

      event.preventDefault();
      event.stopPropagation();
      const rect = viewport.getBoundingClientRect();
      const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2 - rect.left;
      const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2 - rect.top;
      pinchStartRef.current = {
        distance: getTouchDistance(event.touches),
        zoom: zoomRef.current,
        centerX,
        centerY,
        scrollLeft: viewport.scrollLeft,
        scrollTop: viewport.scrollTop,
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      const start = pinchStartRef.current;
      if (!start || event.touches.length !== 2) return;

      event.preventDefault();
      event.stopPropagation();
      const nextZoom = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, start.zoom * (getTouchDistance(event.touches) / start.distance)),
      );
      zoomRef.current = nextZoom;
      setZoom(nextZoom);

      const ratio = nextZoom / start.zoom;
      window.requestAnimationFrame(() => {
        viewport.scrollLeft = (start.scrollLeft + start.centerX) * ratio - start.centerX;
        viewport.scrollTop = (start.scrollTop + start.centerY) * ratio - start.centerY;
      });
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!pinchStartRef.current || event.touches.length >= 2) return;
      pinchStartRef.current = null;
      if (zoomRef.current <= MIN_ZOOM + 0.04) changeZoom(MIN_ZOOM);
    };

    viewport.addEventListener('touchstart', handleTouchStart, { capture: true, passive: false });
    viewport.addEventListener('touchmove', handleTouchMove, { capture: true, passive: false });
    viewport.addEventListener('touchend', handleTouchEnd, { capture: true });
    viewport.addEventListener('touchcancel', handleTouchEnd, { capture: true });
    return () => {
      viewport.removeEventListener('touchstart', handleTouchStart, { capture: true });
      viewport.removeEventListener('touchmove', handleTouchMove, { capture: true });
      viewport.removeEventListener('touchend', handleTouchEnd, { capture: true });
      viewport.removeEventListener('touchcancel', handleTouchEnd, { capture: true });
    };
  }, [changeZoom]);

  const flipPrevious = React.useCallback(() => {
    if (isFlipping || pageIndex === 0) return;
    if (zoomRef.current > MIN_ZOOM) {
      setPageIndex((current) => Math.max(0, current - 1));
      return;
    }
    bookRef.current?.pageFlip().flipPrev('bottom');
  }, [isFlipping, pageIndex]);

  const flipNext = React.useCallback(() => {
    if (isFlipping || pageIndex === pages.length - 1) return;
    if (zoomRef.current > MIN_ZOOM) {
      setPageIndex((current) => Math.min(pages.length - 1, current + 1));
      return;
    }
    bookRef.current?.pageFlip().flipNext('bottom');
  }, [isFlipping, pageIndex]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        flipPrevious();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        flipNext();
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        changeZoom(zoom + ZOOM_STEP);
      }
      if (event.key === '-') {
        event.preventDefault();
        changeZoom(zoom - ZOOM_STEP);
      }
      if (event.key === '0') {
        event.preventDefault();
        changeZoom(MIN_ZOOM);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeZoom, flipNext, flipPrevious, zoom]);

  const selectPage = (index: number) => {
    if (isFlipping || index === pageIndex) return;
    if (zoom > MIN_ZOOM) {
      setPageIndex(index);
      return;
    }
    bookRef.current?.pageFlip().flip(index, index > pageIndex ? 'bottom' : 'top');
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-12 py-3 sm:px-20 sm:py-5">
        <div className="absolute left-1/2 top-2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-[#07172C]/88 p-1 shadow-lg backdrop-blur sm:top-4">
          <button
            type="button"
            onClick={() => changeZoom(zoom - ZOOM_STEP)}
            disabled={zoom <= MIN_ZOOM}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white hover:text-[#07172C] disabled:opacity-30"
            aria-label="紙面を縮小"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-[54px] text-center text-xs font-bold" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => changeZoom(zoom + ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white hover:text-[#07172C] disabled:opacity-30"
            aria-label="紙面を拡大"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => changeZoom(MIN_ZOOM)}
            disabled={zoom === MIN_ZOOM}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white hover:text-[#07172C] disabled:opacity-30"
            aria-label="拡大率を100%に戻す"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <p className="pointer-events-none absolute left-1/2 top-[58px] z-40 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tracking-[0.08em] text-white/65 sm:hidden">
          2本指で拡大・縮小
        </p>

        <button
          type="button"
          onClick={flipPrevious}
          disabled={isFlipping || pageIndex === 0}
          className="absolute left-1 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#07172C]/80 text-white backdrop-blur transition-colors hover:bg-white hover:text-[#07172C] disabled:cursor-not-allowed disabled:opacity-25 sm:left-5 sm:h-[52px] sm:w-[52px]"
          aria-label="前のページをめくる"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div
          ref={viewportRef}
          className={`h-full w-full overscroll-contain ${
            zoom > MIN_ZOOM ? 'cursor-grab overflow-auto' : 'overflow-hidden'
          }`}
          role="group"
          aria-label={
            zoom > MIN_ZOOM
              ? '拡大表示中のPDF紙面。1本指で移動、2本指のピンチで拡大縮小できます'
              : '紙の冊子形式のPDF。2本指のピンチで拡大できます。紙面の端をドラッグ、クリック、または横スワイプしてめくれます'
          }
          onDoubleClick={() => changeZoom(zoom === MIN_ZOOM ? 1.75 : MIN_ZOOM)}
        >
          <div className="flex min-h-full min-w-full items-center justify-center">
            {zoom > MIN_ZOOM ? (
              <HighResolutionPdfPage pageIndex={pageIndex} zoom={zoom} />
            ) : (
              <div>
                <HTMLFlipBook
                  ref={bookRef}
                  width={520}
                  height={735}
                  size="stretch"
                  minWidth={300}
                  maxWidth={560}
                  minHeight={424}
                  maxHeight={790}
                  startPage={pageIndex}
                  drawShadow
                  flippingTime={850}
                  usePortrait
                  startZIndex={0}
                  autoSize
                  maxShadowOpacity={0.18}
                  showCover
                  mobileScrollSupport
                  clickEventForward
                  useMouseEvents
                  swipeDistance={30}
                  showPageCorners
                  disableFlipByClick={false}
                  className="newsletter-pageflip"
                  style={{}}
                  onFlip={(event) => setPageIndex(Number(event.data))}
                  onChangeState={(event) => setIsFlipping(event.data === 'flipping')}
                >
                  {pages.map((page, index) => (
                    <BookPage key={page} index={index} src={page} />
                  ))}
                </HTMLFlipBook>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={flipNext}
          disabled={isFlipping || pageIndex === pages.length - 1}
          className="absolute right-1 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#07172C]/80 text-white backdrop-blur transition-colors hover:bg-white hover:text-[#07172C] disabled:cursor-not-allowed disabled:opacity-25 sm:right-5 sm:h-[52px] sm:w-[52px]"
          aria-label="次のページをめくる"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </main>

      <footer className="border-t border-white/15 bg-[#07172C] px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="flex min-w-[66px] items-center gap-2 text-xs font-bold sm:min-w-[110px] sm:text-sm">
            <FileText className="h-4 w-4 text-[#E4A52E]" />
            {pageIndex + 1} / {pages.length}
          </div>
          <div className="min-w-0 flex-1 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex min-w-max gap-2">
              {pages.map((page, index) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => selectPage(index)}
                  disabled={isFlipping}
                  className={`relative h-[52px] w-9 flex-shrink-0 overflow-hidden border-2 bg-white transition-all disabled:cursor-wait sm:h-16 sm:w-11 ${
                    index === pageIndex
                      ? 'border-[#E4A52E] opacity-100'
                      : 'border-transparent opacity-55 hover:opacity-90'
                  }`}
                  aria-label={`${index + 1}ページへめくる`}
                  aria-current={index === pageIndex ? 'page' : undefined}
                >
                  <img
                    src={page}
                    alt=""
                    className="h-full w-full object-cover"
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                </button>
              ))}
            </div>
          </div>
          <p className="hidden min-w-[185px] text-right text-[10px] font-bold tracking-[0.1em] text-white/55 md:block">
            {zoom > MIN_ZOOM ? 'SCROLL TO READ / 0 TO RESET' : 'DRAG, CLICK, SWIPE OR KEYS'}
          </p>
        </div>
      </footer>
    </div>
  );
}
