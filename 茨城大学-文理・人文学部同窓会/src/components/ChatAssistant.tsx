import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Trash2, 
  ArrowRight, 
  Clock, 
  MapPin, 
  CreditCard, 
  BookOpen, 
  Award, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: '茨大同窓会へようこそ！茨城大学 文理・人文学部同窓会AIコンシェルジュです。同窓会の手続き、イベント、会報閲覧、または大学の歴史などについて気軽にお尋ねください。'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const chatBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat container on new messages/typing
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Focus on input when chat box is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Open chat from custom global window event
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-alumni-chat', handleOpenChat);
    return () => window.removeEventListener('open-alumni-chat', handleOpenChat);
  }, []);

  // Horizontal slider scrolling handler
  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollStep = 192; // Card width + gap
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollStep : scrollStep,
        behavior: 'smooth'
      });
    }
  };

  // Reusable core messaging router to support direct taps
  const sendQuestionDirectly = async (questionText: string) => {
    if (isLoading) return;
    setErrorMessage(null);

    // Append user message immediately to state stream
    const updatedMessages = [...messages, { role: 'user', content: questionText } as ChatMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: questionText,
          history: messages, // Send accumulated back-and-forth history
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'レスポンスの取得に失敗しました。');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'model', content: data.reply || 'お答えが返ってきませんでした。' }
      ]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setErrorMessage(
        error.message || '接続に失敗しました。開発サーバー、またはAPIキーの設定をご確認ください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    sendQuestionDirectly(userText);
  };

  const clearChat = () => {
    if (window.confirm('チャット履歴を消去しますか？')) {
      setMessages([
        {
          role: 'model',
          content: 'チャットをリセットしました。何か御用はございますか？'
        }
      ]);
      setErrorMessage(null);
    }
  };

  // Predefined interactive FAQ quick cards layout list
  const faqCards = [
    {
      id: 'office',
      question: '事務局の場所や営業時間は？',
      icon: <Clock className="w-4 h-4 text-[#CD9535]" />,
      hint: 'アクセス・受付時間 🕒'
    },
    {
      id: 'address',
      question: '登録住所の変更手続き方法は？',
      icon: <MapPin className="w-4 h-4 text-[#CD9535]" />,
      hint: '住所変更の流れ 📬'
    },
    {
      id: 'bulletin',
      question: '同窓会報をオンラインで見るには？',
      icon: <BookOpen className="w-4 h-4 text-[#CD9535]" />,
      hint: '会報閲覧リンク 📖'
    },
    {
      id: 'fee',
      question: '同窓会に会費や寄付はありますか？',
      icon: <CreditCard className="w-4 h-4 text-[#CD9535]" />,
      hint: '会費・寄付手続き 💳'
    }
  ];

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 font-sans" id="ai-chat-assistant-container">
      <AnimatePresence>
        {/* Chat window panel */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[460px] max-h-[calc(100vh-130px)] sm:h-[500px] sm:max-h-none bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col"
          >
            {/* Header portion */}
            <div className="bg-[#00204A] text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-stone-950">
                  <Bot className="w-5 h-5 text-[#00204A]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide leading-tight">茨大同窓会 AIコンシェルジュ</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    <span className="text-[10px] text-stone-200 uppercase tracking-widest font-semibold">Gemini 3.5 AI Active</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="チャット履歴を消去"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="閉じる"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Chat Body panel containing messages stream */}
            <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 bg-[#FAF9F5]/70 space-y-4">
              {messages.map((msg, index) => {
                const isModel = msg.role === 'model';
                return (
                  <React.Fragment key={index}>
                    <div
                      className={`flex items-start gap-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}
                    >
                      {isModel && (
                        <div className="w-7 h-7 rounded-full bg-[#00204A] flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div className="max-w-[78%] flex flex-col">
                        <div
                          className={`rounded-2xl p-3 text-[13.5px] leading-relaxed shadow-sm ${
                            isModel
                              ? 'bg-white text-stone-800 rounded-tl-none border border-stone-200/50'
                              : 'bg-[#CD9535] text-stone-950 rounded-tr-none font-medium'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>

                      {!isModel && (
                        <div className="w-7 h-7 rounded-full bg-stone-300 flex items-center justify-center text-stone-700 flex-shrink-0 mt-1 border border-stone-400/20 shadow-sm">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* FAQ Quick Response card slider on initial screen */}
                    {isModel && index === 0 && messages.length === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="mt-2 pl-9 pr-1"
                      >
                        <p className="text-[11px] font-bold text-[#00204A] mb-2 tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#CD9535] rounded-full animate-pulse" />
                          <span>よくある質問（タップで即答）:</span>
                        </p>
                        
                        {/* Horizontal Slider Wrapper */}
                        <div className="relative group/slider">
                          <div 
                            ref={sliderRef}
                            className="flex gap-2.5 overflow-x-auto py-1.5 px-0.5 scroll-smooth snap-x snap-mandatory scrollbar-none"
                            id="faq-slider-scroller"
                          >
                            {faqCards.map((faq) => (
                              <motion.button
                                key={faq.id}
                                whileHover={{ y: -2, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => sendQuestionDirectly(faq.question)}
                                className="flex-shrink-0 w-[185px] snap-start bg-white border border-stone-200 hover:border-[#CD9535]/80 rounded-xl p-3.5 shadow-xs text-left flex flex-col justify-between h-[124px] focus:outline-none transition-all duration-200 cursor-pointer"
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="p-1.5 bg-stone-50 rounded-lg text-amber-600">
                                      {faq.icon}
                                    </span>
                                    <span className="text-[9px] font-bold text-stone-400 tracking-widest uppercase">
                                      FAQ
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-[11.5px] leading-tight text-stone-800 line-clamp-2">
                                    {faq.question}
                                  </h4>
                                </div>
                                <div className="text-[9.5px] text-[#CD9535] font-bold flex items-center justify-between font-sans mt-1 w-full border-t border-stone-100 pt-1.5">
                                  <span className="text-[8.5px] text-stone-400 font-medium normal-case truncate max-w-[120px]">
                                    {faq.hint}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-[#CD9535] flex-shrink-0" />
                                </div>
                              </motion.button>
                            ))}
                          </div>

                          {/* Left Navigation arrow indicator */}
                          <button
                            type="button"
                            onClick={() => scrollSlider('left')}
                            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-400 hover:text-[#00204A] hover:border-stone-300 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 focus:outline-none z-10 cursor-pointer"
                            aria-label="前へ"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.2]" />
                          </button>

                          {/* Right Navigation arrow indicator */}
                          <button
                            type="button"
                            onClick={() => scrollSlider('right')}
                            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-400 hover:text-[#00204A] hover:border-stone-300 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 focus:outline-none z-10 cursor-pointer"
                            aria-label="次へ"
                          >
                            <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
                          </button>
                        </div>

                        {/* Hint legend with subtle scrolling aid symbol */}
                        <div className="text-[9px] text-stone-400 text-center select-none font-sans mt-1">
                          ← 左右スワイプで他の質問を選択できます →
                        </div>
                      </motion.div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Typing simulation indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-[#00204A] flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-stone-200/50 rounded-2xl p-3.5 rounded-tl-none shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Graceful error output banner */}
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex flex-col gap-1.5 shadow-sm leading-relaxed">
                  <p className="font-bold flex items-center gap-1">⚠ 接続エラー</p>
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>

            {/* In-chat quick navigation helper anchors */}
            <div className="px-4 py-2 bg-white border-t border-stone-100 flex flex-wrap gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none z-10">
              <button
                onClick={() => setInputMessage('住所変更したいです')}
                className="text-[11px] font-medium bg-stone-50 hover:bg-amber-50 border border-stone-200/80 hover:border-amber-400/50 text-[#00204A] hover:text-amber-800 rounded-full py-1 px-2.5 transition-colors cursor-pointer"
              >
                📬 住所変更手続きをする
              </button>
              <button
                onClick={() => setInputMessage('同窓会の会報を見たい')}
                className="text-[11px] font-medium bg-stone-50 hover:bg-amber-50 border border-stone-200/80 hover:border-amber-400/50 text-[#00204A] hover:text-amber-800 rounded-full py-1 px-2.5 transition-colors cursor-pointer"
              >
                📖 会報（アーカイブ）
              </button>
              <button
                onClick={() => setInputMessage('大学の歴史について教えて')}
                className="text-[11px] font-medium bg-stone-50 hover:bg-amber-50 border border-stone-200/80 hover:border-amber-400/50 text-[#00204A] hover:text-amber-800 rounded-full py-1 px-2.5 transition-colors cursor-pointer"
              >
                🏫 学部の歴史
              </button>
            </div>

            {/* Footer Form input control */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="質問を入力してください..."
                disabled={isLoading}
                className="flex-1 bg-stone-50 border border-stone-200/80 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-amber-500/80 focus:bg-white text-[#00204A] disabled:opacity-60 transition-all duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-[#00204A] disabled:bg-stone-100 hover:bg-[#031C3C] text-white disabled:text-stone-400 flex items-center justify-center transition-all cursor-pointer shadow-sm flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Messenger Activator Button with soft ripple glow */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 bg-[#00204A] text-white hover:bg-[#031C3C] rounded-full shadow-2xl hidden sm:flex items-center justify-center cursor-pointer transition-all border border-amber-500/20 shadow-[#00204A]/30 relative group z-50 float-right"
        id="ai-coach-activator-button"
        title="AIコンシェルジュを開く"
      >
        {/* Pulser rings */}
        <span className="absolute inset-0 rounded-full border border-[#CD9535] opacity-25 group-hover:scale-125 transition-transform duration-500" />
        <span className="absolute -inset-0.5 rounded-full bg-[#CD9535]/15 animate-ping opacity-60" />

        <div className="relative">
          {isOpen ? (
            <X className="w-6 h-6 text-[#CD9535] stroke-[2.2]" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-0.5">
              <MessageSquare className="w-5.5 h-5.5 text-amber-400 fill-amber-400/10 stroke-[2.2]" />
              <span className="text-[8px] font-bold text-white tracking-tighter leading-none select-none">チャット</span>
            </div>
          )}
        </div>
      </motion.button>
    </div>
  );
}
