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
import Update from './components/Update';
import Reconnection from './components/Reconnection';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import MobileBottomNav from './components/MobileBottomNav';
import NewsletterModal from './components/NewsletterModal';
import { motion, AnimatePresence } from 'motion/react';
import { useGsapHomeAnimations } from './hooks/useGsapHomeAnimations';

export default function App() {
  // Demo interactive state
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'newsletter43'>('home');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isRegModalOpen, setIsRegModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isHomeIntroComplete, setIsHomeIntroComplete] = useState(false);
  const handleHomeIntroComplete = useCallback(() => {
    setIsHomeIntroComplete(true);
  }, []);
  const homeGsapRef = useGsapHomeAnimations(currentView === 'home', handleHomeIntroComplete);

  const handleSelectTopic = (title: string) => {
    setSelectedTopic(title);
    setIsRegModalOpen(true);
  };

  const handleNavigate = (targetView: 'home' | 'about' | 'newsletter43', hash?: string) => {
    setCurrentView(targetView);
    if (hash) {
      if (hash === '#event-registration-form') {
        setSelectedTopic('第１８回総会・懇親会');
        setIsRegModalOpen(true);
      } else if (hash === '#newsletter-43' || hash === '#newsletter-reader') {
        setCurrentView('newsletter43');
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      } else {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent('open-alumni-chat'));
    setIsChatOpen(true);
  };

  // Synchronize on backward/forward browser events or hash loaded initially
  useEffect(() => {
    const handleOpenNewsletter43 = () => {
      setCurrentView('newsletter43');
      window.history.replaceState(null, '', '#newsletter-43');
      setTimeout(() => {
        const element = document.querySelector('#newsletter-43');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      const aboutHashes = ['#about-section', '#purpose-activities', '#presidents-greeting', '#bylaws', '#organization-board', '#annual-reports', '#membership', '#branches', '#privacy'];
      if (aboutHashes.includes(hash)) {
        setCurrentView('about');
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else if (hash === '#event-registration-form') {
        setCurrentView('home');
        setSelectedTopic('第１８回総会・懇親会');
        setIsRegModalOpen(true);
      } else if (hash === '#newsletter-43' || hash === '#newsletter-reader') {
        setCurrentView('newsletter43');
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else if (hash && hash !== '#') {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    };

    window.addEventListener('open-newsletter-43', handleOpenNewsletter43);
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => {
      window.removeEventListener('open-newsletter-43', handleOpenNewsletter43);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

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
              key="newsletter43-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <Newsletter43WebMagazine />
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
      <NewsletterModal autoOpenReady={isHomeIntroComplete} />
    </div>
  );
}
