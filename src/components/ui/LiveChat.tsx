import { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  getAssistantReply,
  getWelcomeMessage,
  AssistantLink,
  AssistantResponse,
} from '../../lib/assistant';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  links?: AssistantLink[];
  quickReplies?: string[];
}

let msgId = 0;
const nextId = () => `m${msgId++}`;

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Seed the welcome message the first time the widget is opened.
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = getWelcomeMessage();
      setMessages([{ id: nextId(), sender: 'bot', ...welcome }]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const pushBotReply = (reply: AssistantResponse) => {
    setTyping(true);
    // Small, human-feeling delay before the reply appears.
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId(), sender: 'bot', ...reply }]);
      setTyping(false);
    }, 500);
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMessages((prev) => [...prev, { id: nextId(), sender: 'user', text }]);
    setInput('');
    pushBotReply(getAssistantReply(text));
  };

  const handleLink = (link: AssistantLink) => {
    if (link.external) {
      window.open(link.to, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link.to);
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-28 right-4 sm:right-8 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-[calc(100vw-2rem)] sm:w-[23rem] h-[min(32rem,calc(100dvh-13rem))] shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4 rounded-2xl"
            role="dialog"
            aria-label="Clean9ja assistant"
          >
            {/* Header */}
            <div className="bg-primary p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-accent-gold text-primary flex items-center justify-center font-heading font-black italic rounded-md">
                  CN
                </div>
                <div>
                  <h3 className="font-black text-xs">Clean9ja Assistant</h3>
                  <p className="text-[10px] text-accent-gold font-bold flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" /> Online • 24/7
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-4 bg-secondary/30 overflow-y-auto space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={m.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={
                        m.sender === 'user'
                          ? 'bg-primary text-white p-3 text-[12px] font-medium leading-relaxed rounded-l-lg rounded-tr-lg shadow-sm'
                          : 'bg-white text-gray-700 p-3 text-[12px] font-medium leading-relaxed rounded-r-lg rounded-tl-lg shadow-sm'
                      }
                    >
                      {m.text}
                    </div>

                    {/* Navigation / action links */}
                    {m.links && m.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {m.links.map((link) => (
                          <button
                            key={link.label}
                            onClick={() => handleLink(link)}
                            className="bg-accent-orange text-white text-[10px] font-black px-3 py-1.5 rounded-sm hover:bg-primary transition-colors"
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Quick replies */}
                    {m.sender === 'bot' && m.quickReplies && m.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {m.quickReplies.map((q) => (
                          <button
                            key={q}
                            onClick={() => send(q)}
                            className="border border-primary/30 text-primary text-[10px] font-bold tracking-wide px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-r-lg rounded-tl-lg shadow-sm flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, pricing…"
                aria-label="Type your message"
                className="flex-1 text-xs font-medium px-3 py-2 bg-secondary/40 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="bg-primary text-white p-2.5 rounded-md disabled:opacity-40 hover:bg-accent-gold hover:text-primary transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        className="w-16 h-16 shrink-0 bg-[#003366] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary transition-all"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
      </button>
    </div>
  );
}
