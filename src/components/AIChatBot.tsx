/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, X, Send, Mic, MicOff, Info, HelpCircle, ArrowUpRight } from 'lucide-react';
import { ChatMessage, Product } from '../types';
import { products } from '../data';
import { formatPrice } from '../utils/currency';

interface AIChatBotProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  isOpen?: boolean;
  onCloseToggle?: () => void;
}

export default function AIChatBot({
  onSelectProduct,
  onAddToCart,
  isOpen: parentIsOpen,
  onCloseToggle
}: AIChatBotProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = parentIsOpen !== undefined ? parentIsOpen : localIsOpen;
  const toggleOpen = () => {
    if (onCloseToggle) {
      onCloseToggle();
    } else {
      setLocalIsOpen(!localIsOpen);
    }
  };

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [typingSpeech, setTypingSpeech] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'assistant',
        text: "Hey! I am your **Trendzo AI Stylist**. ⚡ \n\nI can recommend streetwear, gadgets, and accessories fitted perfectly to your lifestyle. Try asking me for 'cool techwear outfits', 'rugged active watch', or 'esports upgrades'! How are we dressing today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  // Handle scrolling of messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (textToSend.trim() === '') return;

    // Clear main input
    if (!customText) setInputMessage('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Build dialogue history to forward context on each API turn
      // Limit history to the last 4 exchanges to keep payloads clean
      const recentHistory = messages
        .slice(-8)
        .map(m => ({ sender: m.sender, text: m.text }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: recentHistory
        })
      });

      if (!response.ok) {
        throw new Error('API dispatch error');
      }

      const data = await response.json();

      // Look up our static products matching bracket IDs
      let matchingProducts: Product[] = [];
      if (data.recommendedIds && Array.isArray(data.recommendedIds)) {
        matchingProducts = products.filter(p => data.recommendedIds.includes(p.id));
      } else {
        // Double safety: regex matches inside returned text if any
        const regex = /\[\[(prod-\d+)\]\]/g;
        const matches = data.text.match(regex);
        if (matches) {
          const ids = matches.map((m: string) => m.replace('[[', '').replace(']]', ''));
          matchingProducts = products.filter(p => ids.includes(p.id));
        }
      }

      const assistantMsg: ChatMessage = {
        id: `msg-asst-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: matchingProducts
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("[Chatbot Dispatch Failure]", err);
      // Friendly, robust offline rule-based fallback inside client
      const fallbackMsg = products.slice(0, 3);
      setMessages(prev => [...prev, {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: "I experienced a minor atmospheric disturbance in our AI antenna, but I can still style you up! Here are our favorite futuristic drops handpicked for your weekend routine:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: fallbackMsg
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Simulate Voice Search mic listening
  const handleToggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setTypingSpeech('Simulating voice dictation...');

    const simulatedSpeechPrompts = [
      "Recommend techwear bags and hoodies",
      "Show me dynamic active watches",
      "Explain your return procedures",
      "I need low latency earbuds"
    ];

    const pick = simulatedSpeechPrompts[Math.floor(Math.random() * simulatedSpeechPrompts.length)];

    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += 3;
      setTypingSpeech(pick.substring(0, currentLength));
      if (currentLength >= pick.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsListening(false);
          setInputMessage(pick);
        }, 600);
      }
    }, 50);
  };

  // Quick suggestion prompts
  const starterPrompts = [
    "Cyberpunk setups 👾",
    "Techwear outerwear 🧥",
    "Gamer gear upgrades 🕹️",
    "Active smartwatch ⌚"
  ];

  // Render text containing markdown or bold labels safely
  const renderMessageText = (text: string) => {
    // Replace bracket formats like [[prod-01]] with clean names
    let cleanText = text;
    products.forEach((p) => {
      cleanText = cleanText.replace(`[[${p.id}]]`, `**${p.title}**`);
    });

    const parts = cleanText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-blue-400 font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating launcher bubble (If not open) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleOpen}
            id="chatbot-launch-bubble"
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none border border-white/10 cursor-pointer group"
          >
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 group-hover:scale-110 transition-transform animate-ping" />
            <MessageSquare className="w-6 h-6" />
            <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-0.5 text-yellow-300 animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main chat fold */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed bottom-6 right-6 z-40 w-full max-w-sm md:max-w-md h-[550px] rounded-3xl glass-panel md:backdrop-blur-2xl border border-white/10 shadow-3xl overflow-hidden flex flex-col justify-between"
          >
            {/* Header fold */}
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white relative shadow shadow-purple-500/20">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-neutral-900" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Trendzo AI Assistant
                    <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400">Gemini 3.5</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">Styling advice & product discovery</div>
                </div>
              </div>
              
              <button
                id="chatbot-close"
                onClick={toggleOpen}
                aria-label="Close Chat"
                className="p-1.5 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Middle Message Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {/* Assistant avatar icon inside bubble line */}
                    {m.sender === 'assistant' && (
                      <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 text-neutral-400 text-[10px] font-bold">
                        AI
                      </div>
                    )}
                    
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white/4 border border-white/5 text-neutral-200 rounded-bl-none whitespace-pre-wrap'
                      }`}
                    >
                      {renderMessageText(m.text)}
                    </div>
                  </div>

                  <span className="text-[9px] text-neutral-600 mt-1 font-mono px-8">
                    {m.timestamp}
                  </span>

                  {/* Render product recommendation cards below assistant text bubble if they exist */}
                  {m.sender === 'assistant' && m.recommendedProducts && m.recommendedProducts.length > 0 && (
                    <div className="mt-2.5 ml-8 grid grid-cols-1 md:grid-cols-2 gap-2 w-[85%]">
                      {m.recommendedProducts.map((p) => (
                        <div
                          key={p.id}
                          id={`chat-rec-${p.id}`}
                          className="p-2 rounded-xl bg-white/2 border border-white/5 hover:border-blue-500/30 flex items-center gap-2 transition-all group"
                        >
                          <img
                            referrerPolicy="no-referrer"
                            src={p.image}
                            alt={p.title}
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0 cursor-pointer"
                            onClick={() => onSelectProduct(p)}
                          />
                          <div className="flex-1 min-w-0">
                            <span 
                              onClick={() => onSelectProduct(p)}
                              className="block text-[10px] font-bold text-white hover:text-blue-400 transition-colors truncate cursor-pointer"
                            >
                              {p.title}
                            </span>
                            <span className="block text-[9px] text-blue-400 font-mono font-bold mt-0.5">
                              {formatPrice(p.discountPrice || p.price)}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => onSelectProduct(p)}
                            className="p-1 rounded-md bg-white/5 hover:bg-blue-500 hover:text-white text-neutral-400 transition-all cursor-pointer flex items-center justify-center"
                            title="Quick View"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* simulated listening dictation popup */}
              {isListening && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-600/10 border border-purple-500/20 text-xs text-purple-400 animate-pulse">
                  <Mic className="w-4 h-4" />
                  <span>{typingSpeech}</span>
                </div>
              )}

              {/* typing indicators */}
              {isTyping && (
                <div className="flex items-center gap-1.5 ml-8 text-neutral-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce animation-delay-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce animation-delay-400" />
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Bottom Input Area */}
            <div className="p-3 bg-neutral-950/90 border-t border-white/5 space-y-3">
              {/* starter recommendation triggers */}
              {messages.length < 3 && (
                <div className="flex flex-wrap gap-1.5">
                  {starterPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p.toLowerCase().replace(/[^\w\s]/g, '').trim())}
                      className="text-[10px] font-semibold py-1 px-2.5 rounded-lg bg-neutral-900 hover:bg-white hover:text-black border border-white/5 hover:border-white transition-all cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input row */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice button dictation selector */}
                <button
                  type="button"
                  id="chatbot-mic-btn"
                  onClick={handleToggleVoice}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-500 hover:text-white border border-white/5'
                  }`}
                  title={isListening ? "Listening..." : "Dictate Prompt (Voice Simulation)"}
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  id="chatbot-input"
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask Trendzo AI Stylist..."
                  className="flex-1 text-xs py-2.5 px-4 rounded-xl glass-input placeholder-neutral-500"
                />

                <button
                  type="submit"
                  aria-label="Send Message"
                  id="chatbot-submit"
                  className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
