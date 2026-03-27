import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Sparkles, Loader2, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { useAuth, API } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

const QUICK_SUGGESTIONS = [
  "Find me jobs",
  "Improve my resume",
  "Top skills in 2026",
  "How to apply?"
];

const AIChatbot = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hi${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! I'm your AI Career Guide. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen, isMinimized]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build context from user profile
      const context = {
        role: user?.role || 'Guest',
        skills: user?.userProfile?.skills || user?.companyProfile?.industry || []
      };

      const res = await API.post('/chat', {
        message: text.trim(),
        history: messages,
        context
      });

      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'ai', content: res.data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting right now. Please try again later." }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: "Oops! Something went wrong on my end. Can we try that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'ai', content: "Chat cleared! What's on your mind?" }]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-xl shadow-brand-purple/30 hover:shadow-2xl hover:shadow-brand-purple/40 hover:-translate-y-1 transition-all z-50 group flex items-center justify-center"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="absolute right-full mr-4 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-3 py-1.5 rounded-xl whitespace-nowrap hidden md:block pointer-events-none font-bold">
          AI Career Guide
        </span>
      </button>
    );
  }

  // Auto-linkify and format simple bold in AI messages
  const formatText = (text) => {
    const lines = text.split('\\n');
    return lines.map((line, i) => (
      <span key={i}>
        {line.replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>')}
        {i < lines.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className={cn(
      'fixed right-0 sm:right-6 z-50 flex flex-col transition-all duration-300 shadow-2xl overflow-hidden',
      isMinimized ? 'bottom-6 h-14 w-72 sm:w-80 rounded-[2rem]' : 'bottom-0 sm:bottom-6 sm:h-[600px] h-[100dvh] w-full sm:w-[400px] sm:rounded-[2rem] rounded-none',
      isDark ? 'bg-dark-card border border-dark-border/50' : 'bg-white/80 backdrop-blur-2xl border border-white/40'
    )}>
      {/* Header */}
      <div className={cn(
        'p-4 flex items-center justify-between shrink-0 cursor-pointer',
        isDark ? 'bg-dark-hover/80 border-b border-dark-border/50' : 'bg-white/90 border-b border-brand-purple/10'
      )} onClick={() => setIsMinimized(p => !p)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white p-1.5 shadow-glow-sm">
            <Bot className="w-full h-full" />
          </div>
          <div>
            <h3 className={cn('font-black text-sm', isDark ? 'text-white' : 'text-gray-900')}>Career AI</h3>
            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          {!isMinimized && (
            <button onClick={(e) => { e.stopPropagation(); clearChat(); }} className="p-1.5 hover:bg-gray-500/10 rounded-lg transition-colors" title="Clear Chat">
              <Trash2 className="w-4 h-4 hover:text-red-400" />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(p => !p); }} className="p-1.5 hover:bg-gray-500/10 rounded-lg transition-colors">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1.5 hover:bg-gray-500/10 rounded-lg hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex items-end gap-2 w-full', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              
              {/* AI Avatar */}
              {msg.role === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple shrink-0 mb-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={cn(
                'px-4 py-2.5 max-w-[85%] text-[13px] leading-relaxed break-words',
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-2xl rounded-tr-sm shadow-glow-sm' 
                  : isDark 
                    ? 'bg-dark-hover/50 text-gray-200 rounded-2xl rounded-tl-sm border border-dark-border' 
                    : 'bg-white text-gray-700 rounded-2xl rounded-tl-sm border border-black/5 shadow-sm'
              )}>
                 {/* Inner HTML injection */}
                 <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>').replace(/\*(.*?)\*/g, '<i>$1</i>') }} />
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-end gap-2 w-full justify-start">
              <div className="w-6 h-6 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple shrink-0 mb-1">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className={cn(
                'px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1 opacity-70 border',
                isDark ? 'bg-dark-hover/50 border-dark-border' : 'bg-white border-black/5'
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Quick Suggestions & Input */}
      {!isMinimized && (
        <div className={cn(
          'p-3 shrink-0',
          isDark ? 'bg-dark-card border-t border-dark-border/50' : 'bg-white/90 border-t border-brand-purple/10'
        )}>
          {/* Suggestions */}
          {messages.length < 3 && !isLoading && (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {QUICK_SUGGESTIONS.map(sug => (
                <button
                  key={sug}
                  onClick={() => handleSend(sug)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors flexitems-center shrink-0 border',
                    isDark ? 'bg-dark-hover text-brand-purple border-brand-purple/20 hover:bg-brand-purple/10' : 'bg-brand-purple/5 text-brand-violet border-brand-purple/10 hover:bg-brand-purple/10'
                  )}
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className={cn(
              'flex items-center gap-2 p-1.5 rounded-2xl border transition-colors',
              isDark ? 'bg-dark-hover/60 border-dark-border focus-within:border-brand-purple/50' : 'bg-black/5 border-transparent focus-within:border-brand-purple/30 focus-within:bg-white'
            )}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent px-3 py-2 text-[13px] outline-none placeholder:text-gray-500"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-brand-purple text-white shadow-glow-sm disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
