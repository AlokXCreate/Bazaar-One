import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlanner } from '../../context/PlannerContext';
import { useCart } from '../../context/CartContext';
import { aiService, AIResponse } from '../../services/aiService';
import { formatINR } from '../../utils/currency';
import { Modal } from '../common/Modal';
import { Sparkles, Send, Bot, User, Plus, ShoppingCart, Globe, ArrowRight } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  responsePayload?: AIResponse;
  timestamp: string;
}

export const BazaarAIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const { products, shops } = useMarketplace();
  const { currentPlan, addItemToPlan } = usePlanner();
  const { addToCart } = useCart();

  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: 'Namaste! I am your Bazaar AI Assistant. I can help plan your monthly groceries within your budget, compare rates between traditional and modern stores, or prepare your weekly kitchen list. How may I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const aiResult = await aiService.processQuery(textToSend, products, shops, language);

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: aiResult.message,
        responsePayload: aiResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleAddItemsToPlanner = (items: AIResponse['suggestedItems']) => {
    if (!items || !currentPlan) return;
    items.forEach((item) => {
      addItemToPlan(currentPlan.id, {
        name: item.name,
        category: item.category,
        estimatedPrice: item.estimatedPrice,
        quantity: item.quantity,
        unit: item.unit as any,
      });
    });
  };

  const quickPrompts = [
    { label: 'Weekly list within ₹2,000', query: 'Create a weekly family grocery list within ₹2,000' },
    { label: 'Monthly budget ₹5,000', query: 'Prepare my monthly grocery list within ₹5,000' },
    { label: 'Compare cooking oils', query: 'Compare prices of cooking oils across nearby stores' },
    { label: 'ताजी भाजीपाला (Fresh veggies)', query: 'Where can I get fresh vegetables and greens today?' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bazaar AI Intelligent Assistant"
      subtitle="Powered by Gemini & Real-time Verified Marketplace Catalog"
      maxWidth="2xl"
    >
      <div className="flex flex-col h-[520px]">
        {/* Language selector bar */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 font-medium">
            <Globe className="w-3.5 h-3.5 text-bazaar-saffron" />
            <span>Response Language:</span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                language === 'en' ? 'bg-bazaar-maroon text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                language === 'hi' ? 'bg-bazaar-maroon text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                language === 'mr' ? 'bg-bazaar-maroon text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
              }`}
            >
              मराठी (Marathi)
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bazaar-maroon to-bazaar-saffron text-white flex items-center justify-center flex-shrink-0 shadow">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-bazaar-maroon text-white shadow'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Suggested Items Widget */}
                {msg.responsePayload?.suggestedItems && (
                  <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 space-y-2">
                    <div className="font-bold text-[11px] uppercase tracking-wider text-bazaar-maroon dark:text-bazaar-saffron">
                      Suggested Grocery Essentials:
                    </div>
                    <div className="space-y-1.5">
                      {msg.responsePayload.suggestedItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px]"
                        >
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {item.name} ({item.quantity} {item.unit})
                          </span>
                          <span className="font-bold font-display text-bazaar-maroon dark:text-bazaar-saffron">
                            {formatINR(item.estimatedPrice)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleAddItemsToPlanner(msg.responsePayload?.suggestedItems)}
                      className="w-full mt-2 py-2 rounded-xl bg-bazaar-green text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-bazaar-green/90 transition-colors shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add All Suggestions to Active Planner</span>
                    </button>
                  </div>
                )}

                {/* Suggested Products from Catalog */}
                {msg.responsePayload?.suggestedProducts && (
                  <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 space-y-1.5">
                    <div className="font-bold text-[11px] text-stone-500 uppercase tracking-wider">
                      Verified Catalog Matches:
                    </div>
                    {msg.responsePayload.suggestedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px]"
                      >
                        <div className="truncate mr-2">
                          <span className="font-bold block truncate">{p.name}</span>
                          <span className="text-[10px] text-stone-400">{p.shopName}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-bold text-bazaar-maroon dark:text-bazaar-saffron">
                            {formatINR(p.price)}
                          </span>
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="p-1.5 rounded-lg bg-bazaar-maroon text-white hover:bg-bazaar-maroon-700"
                            title="Add to cart"
                          >
                            <ShoppingCart className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-right opacity-60 pt-1">{msg.timestamp}</div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 text-xs items-center text-stone-500 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-bazaar-saffron/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-bazaar-saffron animate-spin" />
              </div>
              <span>Bazaar AI is analyzing catalog rates and calculating suggestions...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp.query)}
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-bazaar-saffron/20 hover:text-bazaar-maroon transition-all flex-shrink-0 border border-stone-200 dark:border-stone-700"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-2 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              language === 'hi'
                ? 'मुझसे किराना या बाज़ार के बारे में पूछें...'
                : language === 'mr'
                ? 'मला किराणा, भाजी किंवा दुकानांविषयी विचारा...'
                : 'Ask Bazaar AI about grocery planning, prices, or shops...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-bazaar-maroon text-stone-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="px-4 py-2.5 rounded-xl bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </Modal>
  );
};
