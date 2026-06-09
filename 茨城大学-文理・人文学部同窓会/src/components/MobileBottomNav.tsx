import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Newspaper, 
  BookOpen, 
  UserCheck, 
  MessageSquare 
} from 'lucide-react';

interface MobileBottomNavProps {
  currentView: 'home' | 'about' | 'newsletter43';
  onNavigate: (targetView: 'home' | 'about' | 'newsletter43', hash?: string) => void;
  onOpenChat: () => void;
}

export default function MobileBottomNav({ currentView, onNavigate, onOpenChat }: MobileBottomNavProps) {
  const navItems = [
    {
      label: 'ホーム',
      icon: <Home className="w-5 h-5" />,
      onClick: () => {
        onNavigate('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      badge: false,
    },
    {
      label: 'おしらせ',
      icon: <Newspaper className="w-5 h-5" />,
      onClick: () => {
        onNavigate('home', '#news');
      },
      badge: false,
    },
    {
      label: 'ストーリー',
      icon: <BookOpen className="w-5 h-5" />,
      onClick: () => {
        onNavigate('home', '#stories-section');
      },
      badge: false,
    },
    {
      label: '手続き',
      icon: <UserCheck className="w-5 h-5" />,
      onClick: () => {
        onNavigate('home', '#update-section');
      },
      badge: false,
    },
    {
      label: 'チャット',
      icon: <MessageSquare className="w-5 h-5 text-[#CD9535]" />,
      onClick: onOpenChat,
      badge: true,
      highlight: true,
    }
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 bg-gradient-to-t from-[#FAF9F5]/90 via-[#FAF9F5]/40 to-transparent pointer-events-none">
      <div className="bg-white/95 backdrop-blur-md border border-stone-200/60 shadow-xl rounded-2xl flex items-center justify-around py-1.5 px-2 pointer-events-auto max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isAIchat = item.highlight;
          return (
            <motion.button
              key={index}
              whileTap={{ scale: 0.92 }}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all relative flex-1 cursor-pointer select-none ${
                isAIchat 
                  ? 'text-[#00204A] font-bold' 
                  : 'text-stone-500 hover:text-[#00204A]'
              }`}
            >
              {/* Highlight background glow for the special active/AI option */}
              {isAIchat && (
                <div className="absolute inset-0 bg-[#CD9535]/10 rounded-xl -z-10 animate-pulse duration-3000" />
              )}
              
              <div className="relative flex items-center justify-center">
                {item.icon}
                
                {/* Micro active dot or pulse indicator for AI consultation */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#CD9535] rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[#CD9535] animate-ping opacity-75" />
                  </span>
                )}
              </div>
              
              <span className={`text-[9.5px] mt-1 tracking-tighter ${
                isAIchat ? 'text-[#00204A] font-extrabold' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
