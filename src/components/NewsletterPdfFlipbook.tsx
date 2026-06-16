import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Download, X } from 'lucide-react';

type NewsletterPdfFlipbookProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FlipbookClientComponent = React.ComponentType;

export default function NewsletterPdfFlipbook({ isOpen, onClose }: NewsletterPdfFlipbookProps) {
  const [FlipbookClient, setFlipbookClient] = React.useState<FlipbookClientComponent | null>(null);

  React.useEffect(() => {
    if (!isOpen || FlipbookClient || typeof window === 'undefined') return;

    let active = true;
    void import('./NewsletterPageFlipBookClient').then((module) => {
      if (active) setFlipbookClient(() => module.default);
    });

    return () => {
      active = false;
    };
  }, [FlipbookClient, isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col bg-[#07172C]/96 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="同窓会報第43号 PDF冊子リーダー"
        >
          <header className="flex min-h-16 items-center justify-between gap-3 border-b border-white/15 px-3 sm:px-6">
            <div className="min-w-0">
              <p className="truncate font-serif text-sm font-bold sm:text-lg">同窓会報 第43号</p>
              <p className="text-[10px] font-bold tracking-[0.16em] text-[#E4A52E] sm:text-xs">
                PAGE FLIP BOOK READER
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/newsletters/43/newsletter-43.pdf"
                download
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-3 text-xs font-bold transition-colors hover:bg-white hover:text-[#07172C] sm:px-5 sm:text-sm"
                aria-label="同窓会報第43号のPDFを保存"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">PDFを保存</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-[#07172C]"
                aria-label="PDFリーダーを閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1">
            {FlipbookClient ? (
              <FlipbookClient />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-bold text-white/65">
                冊子を読み込んでいます...
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
