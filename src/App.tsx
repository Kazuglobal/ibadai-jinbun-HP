import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import News from './components/News';
import Events from './components/Events';
import EventRegistration from './components/EventRegistration';
import Stories from './components/Stories';
import NetworkArchive from './components/NetworkArchive';
import Update from './components/Update';
import Reconnection from './components/Reconnection';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import MobileBottomNav from './components/MobileBottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

export default function App() {
  // Demo interactive state
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'about'>('home');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isRegModalOpen, setIsRegModalOpen] = useState<boolean>(false);

  const handleSelectTopic = (title: string) => {
    setSelectedTopic(title);
    setIsRegModalOpen(true);
  };

  const handleNavigate = (targetView: 'home' | 'about', hash?: string) => {
    setCurrentView(targetView);
    if (hash) {
      if (hash === '#event-registration-form') {
        setSelectedTopic('第１８回総会・懇親会');
        setIsRegModalOpen(true);
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

  // Synchronize on backward/forward browser events or hash loaded initially
  useEffect(() => {
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
      } else if (hash && hash !== '#') {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#00204A] font-sans antialiased text-base selection:bg-amber-600 selection:text-white pb-20 sm:pb-0">
      {/* Top Welcome micro Notification bar */}
      <AnimatePresence>
        {showDemoBanner && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#CD9535] text-stone-900 text-xs font-semibold py-2 px-4 flex items-center justify-between gap-2 overflow-hidden z-50 relative select-none"
            id="demo-banner-alert"
          >
            <div className="mx-auto flex items-center gap-1.5 py-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>「茨城大学 文理・人文学部同窓会」デザイン再現デモ：メニューとフッターを含め、ディテールにこだわって再現いたしました。</span>
            </div>
            <button 
              onClick={() => setShowDemoBanner(false)} 
              className="text-stone-900/70 hover:text-stone-900 p-1 focus:outline-none focus:ring-1 focus:ring-stone-900 rounded transition-all cursor-pointer"
              aria-label="Dismiss Alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section (Menu) - now with currentView and navigate callback */}
      <Header currentView={currentView} onNavigate={handleNavigate} />

      {/* Hero section with overlays and college photo collage */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div
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
      <ChatAssistant />

      {/* Styled Mobile Bottom Navigation Bar */}
      <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}
