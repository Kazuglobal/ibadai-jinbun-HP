import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import News from './components/News';
import Events from './components/Events';
import EventRegistration from './components/EventRegistration';
import Stories from './components/Stories';
import NetworkArchive from './components/NetworkArchive';
import Newsletter43WebMagazine from './components/Newsletter43WebMagazine';
import NewsletterArchiveMagazine from './components/NewsletterArchiveMagazine';
import Update from './components/Update';
import Reconnection from './components/Reconnection';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import MobileBottomNav from './components/MobileBottomNav';
import NewsletterModal from './components/NewsletterModal';
import { motion, AnimatePresence } from 'motion/react';
import { useGsapHomeAnimations } from './hooks/useGsapHomeAnimations';

const SITE_NAME = '茨城大学 文理・人文学部同窓会';

const seoProfiles = {
  home: {
    title: `${SITE_NAME} 公式サイト`,
    description:
      '茨城大学 文理・人文学部同窓会の公式サイトです。同窓会の活動、総会・イベント、会報アーカイブ、住所変更、入会案内、事務局へのお問い合わせをご案内します。',
    canonicalPath: '/',
  },
  about: {
    title: `同窓会について | ${SITE_NAME}`,
    description:
      '茨城大学 文理・人文学部同窓会の目的、活動、役員、会則、入会案内、個人情報保護方針、事務局情報をご案内します。',
    canonicalPath: '/about',
  },
  events: {
    title: `総会・イベント | ${SITE_NAME}`,
    description:
      '茨城大学 文理・人文学部同窓会の総会、講演会、懇親会、交流イベントの開催情報と参加申込をご案内します。',
    canonicalPath: '/events',
  },
  archive: {
    title: `同窓会報アーカイブ | ${SITE_NAME}`,
    description:
      '茨城大学 文理・人文学部同窓会報の最新号とバックナンバーを閲覧できます。同窓生の寄稿、活動報告、事務局からのお知らせを掲載しています。',
    canonicalPath: '/archive',
  },
  contact: {
    title: `お問い合わせ・住所変更 | ${SITE_NAME}`,
    description:
      '茨城大学 文理・人文学部同窓会事務局へのお問い合わせ、住所変更、入会・退会・物故報告の手続きをご案内します。',
    canonicalPath: '/contact',
  },
  newsletter43: {
    title: `同窓会報 第43号 | ${SITE_NAME}`,
    description:
      '茨城大学 文理・人文学部同窓会報 第43号をWebマガジン形式で閲覧できます。巻頭エッセイ、同窓生の声、活動報告を掲載しています。',
    canonicalPath: '/newsletter/43',
  },
};

function getInitialNewsletterIssue() {
  if (typeof window === 'undefined') return 43;

  const pathIssue = window.location.pathname.match(/^\/newsletter\/(3[4-9]|4[0-3])\/?$/)?.[1];
  const hashIssue = /^#newsletter-(3[4-9]|4[0-3])$/.test(window.location.hash)
    ? window.location.hash.match(/\d+/)?.[0]
    : undefined;

  return Number(pathIssue ?? hashIssue ?? 43);
}

function getInitialView(): 'home' | 'about' | 'newsletter43' {
  if (typeof window === 'undefined') return 'home';
  if (window.location.pathname === '/about') return 'about';
  if (/^\/newsletter\/(3[4-9]|4[0-3])\/?$/.test(window.location.pathname)) return 'newsletter43';
  if (/^#newsletter-(3[4-9]|4[0-3])$/.test(window.location.hash)) return 'newsletter43';
  return 'home';
}

export default function App() {
  // Demo interactive state
  const initialNewsletterIssue = getInitialNewsletterIssue();
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'newsletter43'>(getInitialView);
  const [selectedNewsletterIssue, setSelectedNewsletterIssue] = useState(initialNewsletterIssue);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isRegModalOpen, setIsRegModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isHomeIntroComplete, setIsHomeIntroComplete] = useState(false);
  const handleHomeIntroComplete = useCallback(() => {
    setIsHomeIntroComplete(true);
  }, []);
  const homeGsapRef = useGsapHomeAnimations(currentView === 'home', handleHomeIntroComplete);

  const resolveNavigationHash = (hash?: string) => {
    if (!hash) return undefined;

    const hashAliases: Record<string, string> = {
      '#address': '#update-section',
      '#archive': '#network-archive',
      '#contact': '#site-footer',
      '#events': '#events-section',
      '#stories': '#stories-section',
      '#network': '#network-archive',
      '#news-section': '#news',
      '#footer': '#site-footer',
      '#rules': '#bylaws',
      '#support': '#update-section',
    };

    return hashAliases[hash] ?? hash;
  };

  const resolvePathNavigation = (pathname: string) => {
    const pathAliases: Record<string, { view: 'home' | 'about' | 'newsletter43'; hash?: string; issue?: number }> = {
      '/': { view: 'home' },
      '/about': { view: 'about', hash: '#about-section' },
      '/events': { view: 'home', hash: '#events-section' },
      '/archive': { view: 'home', hash: '#network-archive' },
      '/contact': { view: 'home', hash: '#site-footer' },
    };
    const newsletterPath = pathname.match(/^\/newsletter\/(3[4-9]|4[0-3])\/?$/);
    if (newsletterPath) {
      return { view: 'newsletter43' as const, issue: Number(newsletterPath[1]) };
    }
    return pathAliases[pathname];
  };

  const scrollToHash = (hash: string) => {
    [360, 800, 1300, 2200].forEach((delay) => {
      window.setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const headerOffset = 84;
          const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
        }
      }, delay);
    });
  };

  const handleSelectTopic = (title: string) => {
    setSelectedTopic(title);
    setIsRegModalOpen(true);
  };

  const handleNavigate = (targetView: 'home' | 'about' | 'newsletter43', hash?: string) => {
    const targetHash = resolveNavigationHash(hash);
    setCurrentView(targetView);
    if (targetHash) {
      if (targetHash === '#event-registration-form') {
        setSelectedTopic('第１８回総会・懇親会');
        setIsRegModalOpen(true);
      } else if (/^#newsletter-(3[4-9]|4[0-3])$/.test(targetHash) || targetHash === '#newsletter-reader') {
        const issueFromHash = Number(targetHash.match(/\d+/)?.[0] ?? selectedNewsletterIssue);
        setSelectedNewsletterIssue(issueFromHash);
        setCurrentView('newsletter43');
        window.history.pushState(null, '', targetHash);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 120);
      } else {
        window.history.pushState(null, '', targetHash);
        scrollToHash(targetHash);
      }
    } else {
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent('open-alumni-chat'));
    setIsChatOpen(true);
  };

  // Synchronize on backward/forward browser events or hash loaded initially
  useEffect(() => {
    const openNewsletterIssue = (issueNumber: number) => {
      setSelectedNewsletterIssue(issueNumber);
      setCurrentView('newsletter43');
      window.history.pushState(null, '', `#newsletter-${issueNumber}`);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 120);
    };

    const handleOpenNewsletter43 = () => openNewsletterIssue(43);
    const handleOpenNewsletterIssue = (event: Event) => {
      const issueNumber = Number((event as CustomEvent<number>).detail);
      if (issueNumber >= 34 && issueNumber <= 43) {
        openNewsletterIssue(issueNumber);
      }
    };

    const handleHashChange = () => {
      const hash = resolveNavigationHash(window.location.hash);
      const pathNavigation = resolvePathNavigation(window.location.pathname);
      const aboutHashes = ['#about-section', '#purpose-activities', '#presidents-greeting', '#bylaws', '#organization-board', '#membership', '#branches', '#privacy'];
      if (aboutHashes.includes(hash)) {
        setCurrentView('about');
        scrollToHash(hash);
      } else if (hash === '#event-registration-form') {
        setCurrentView('home');
        setSelectedTopic('第１８回総会・懇親会');
        setIsRegModalOpen(true);
      } else if (/^#newsletter-(3[4-9]|4[0-3])$/.test(hash) || hash === '#newsletter-reader') {
        const issueFromHash = Number(hash.match(/\d+/)?.[0] ?? 43);
        setSelectedNewsletterIssue(issueFromHash);
        setCurrentView('newsletter43');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 120);
      } else if (hash && hash !== '#') {
        setCurrentView('home');
        scrollToHash(hash);
      } else if (pathNavigation) {
        setCurrentView(pathNavigation.view);
        if (pathNavigation.issue) {
          setSelectedNewsletterIssue(pathNavigation.issue);
          window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 120);
        } else if (pathNavigation.hash) {
          scrollToHash(pathNavigation.hash);
        }
      }
    };

    window.addEventListener('open-newsletter-43', handleOpenNewsletter43);
    window.addEventListener('open-newsletter-issue', handleOpenNewsletterIssue);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    handleHashChange();
    return () => {
      window.removeEventListener('open-newsletter-43', handleOpenNewsletter43);
      window.removeEventListener('open-newsletter-issue', handleOpenNewsletterIssue);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const pathProfile = typeof window !== 'undefined' ? resolvePathNavigation(window.location.pathname) : undefined;
    const hash = typeof window !== 'undefined' ? resolveNavigationHash(window.location.hash) : undefined;
    const profile =
      currentView === 'newsletter43'
        ? {
            ...seoProfiles.newsletter43,
            title: `同窓会報 第${selectedNewsletterIssue}号 | ${SITE_NAME}`,
            canonicalPath: `/newsletter/${selectedNewsletterIssue}`,
          }
        : currentView === 'about'
          ? seoProfiles.about
          : pathProfile?.hash === '#events-section' || hash === '#events-section'
            ? seoProfiles.events
            : pathProfile?.hash === '#network-archive' || hash === '#network-archive'
              ? seoProfiles.archive
              : pathProfile?.hash === '#site-footer' || hash === '#site-footer'
                ? seoProfiles.contact
                : seoProfiles.home;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const canonicalUrl = `${origin}${profile.canonicalPath}`;
    document.title = profile.title;

    const setMeta = (selector: string, attribute: 'content' | 'href', value: string) => {
      let element = document.querySelector(selector);
      if (!element && selector === 'link[rel="canonical"]') {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      if (element) element.setAttribute(attribute, value);
    };

    setMeta('meta[name="description"]', 'content', profile.description);
    setMeta('link[rel="canonical"]', 'href', canonicalUrl);
    setMeta('meta[property="og:title"]', 'content', profile.title);
    setMeta('meta[property="og:description"]', 'content', profile.description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[name="twitter:title"]', 'content', profile.title);
    setMeta('meta[name="twitter:description"]', 'content', profile.description);
  }, [currentView, selectedNewsletterIssue]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#00204A] font-sans antialiased text-base selection:bg-amber-600 selection:text-white pb-20 sm:pb-0">
      {/* Header section (Menu) - now with currentView and navigate callback */}
      <Header currentView={currentView} onNavigate={handleNavigate} />

      {/* Hero section with overlays and college photo collage */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div
              ref={homeGsapRef}
              key="home-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <Hero />
              <News onSelectNews={handleSelectTopic} />
              <Events onSelectEvent={handleSelectTopic} />
              <Stories />
              <NetworkArchive />
              <Update />
              <Reconnection />
            </motion.div>
          ) : currentView === 'newsletter43' ? (
            <motion.div
              key={`newsletter-${selectedNewsletterIssue}-view`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {selectedNewsletterIssue === 43 ? (
                <Newsletter43WebMagazine />
              ) : (
                <NewsletterArchiveMagazine
                  issueNumber={selectedNewsletterIssue}
                  onIssueChange={(issueNumber) => {
                    setSelectedNewsletterIssue(issueNumber);
                    window.history.pushState(null, '', `#newsletter-${issueNumber}`);
                  }}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="about-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <About onNavigate={handleNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer section (Footer) - communicates navigation links back to main container */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Modal Registration form */}
      <AnimatePresence>
        {isRegModalOpen && (
          <EventRegistration 
            selectedTopic={selectedTopic} 
            onClearTopic={() => setSelectedTopic('')} 
            onClose={() => {
              setIsRegModalOpen(false);
              setSelectedTopic('');
            }}
          />
        )}
      </AnimatePresence>

      {/* Persistent floating AI Chat Assistant */}
      {currentView !== 'newsletter43' && <ChatAssistant isOpen={isChatOpen} onOpenChange={setIsChatOpen} />}

      {/* Styled Mobile Bottom Navigation Bar */}
      {currentView !== 'newsletter43' && <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} onOpenChat={handleOpenChat} />}

      {/* Pop-up modal newsletter helper */}
      {currentView === 'home' && <NewsletterModal autoOpenReady={isHomeIntroComplete} />}
    </div>
  );
}
