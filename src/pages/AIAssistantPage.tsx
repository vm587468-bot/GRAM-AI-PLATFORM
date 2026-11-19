import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
  Lightbulb,
  Languages,
  FolderKanban,
  ShoppingBag,
  Landmark,
  TrendingUp,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ReferenceItem {
  type: 'project' | 'product' | 'scheme' | 'market';
  id: string;
  title: string;
  subtitle: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  references?: ReferenceItem[];
  isError?: boolean;
}

interface AIAssistantPageProps {
  onSelectProject?: (projectId: string) => void;
  onSelectProduct?: (productId: string) => void;
  onSelectScheme?: (schemeName: string) => void;
  onSelectMarket?: (commodityName: string) => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  onSelectProject = () => {},
  onSelectProduct = () => {},
  onSelectScheme = () => {},
  onSelectMarket = () => {}
}) => {
  const { currentUser, role } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Namaste ${currentUser.name}! I am GramSetu Advisor, grounded in our verified database of business projects, official government schemes, mandi prices, and marketplace products.\n\nAsk me about:\n1. Project blueprints, startup costs & assumptions (dairy, mushrooms, spice processing, EV charging, or software)\n2. Official central & state government schemes, eligibility & documents\n3. Mandi commodity price references across Indian states\n4. Verified marketplace products, craft provenance & UPI escrow.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Marathi' | 'Gujarati'>('English');
  const [isRecording, setIsRecording] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleRecording = () => {
    setSpeechNotice(null);
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechNotice('Voice microphone input is unavailable in this browser. Please type your question below.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        selectedLanguage === 'Hindi'
          ? 'hi-IN'
          : selectedLanguage === 'Marathi'
          ? 'mr-IN'
          : selectedLanguage === 'Gujarati'
          ? 'gu-IN'
          : 'en-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const handleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingMessageId(msgId);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);
    setSpeechNotice(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6),
          language: selectedLanguage,
          role
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to process advisor request.');
      }

      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        references: Array.isArray(data.references) ? data.references : []
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: err?.message || 'Unable to reach GramSetu Advisor right now. Please check your connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReference = (ref: ReferenceItem) => {
    if (ref.type === 'project') onSelectProject(ref.id);
    else if (ref.type === 'product') onSelectProduct(ref.id);
    else if (ref.type === 'scheme') onSelectScheme(ref.title);
    else if (ref.type === 'market') onSelectMarket(ref.title);
  };

  const promptChips = [
    'Tell me about Oyster Mushroom Cultivation project costs and assumptions',
    'Which government schemes offer subsidies for rural food processing or artisan tools?',
    'What are the current reference mandi prices for turmeric and mustard?',
    'Show verified handloom or terracotta products available on GramSetu'
  ];

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8 space-y-6">
      {/* Assistant Header */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-[#2D5A27]/20 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white">
                GramSetu Advisor
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E6B325]/20 dark:bg-amber-950/60 text-[#2D5A27] dark:text-amber-300 border border-[#E6B325]/40 dark:border-amber-700/40">
                Database Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified Projects, Official Schemes, Mandi Rates &amp; Marketplace Advisor
            </p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            className="text-xs font-semibold p-2 rounded-xl bg-[#F8F5F0] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2D5A27]"
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी (Hindi)</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Gujarati">ગુજરાતી (Gujarati)</option>
          </select>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-[#E6B325]" />
          <span>Grounded Sample Questions</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="text-left p-2.5 rounded-xl bg-white dark:bg-[#1E293B] hover:bg-[#F8F5F0] dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 hover:border-[#2D5A27]/40 dark:hover:border-emerald-500/40 text-xs text-slate-700 dark:text-slate-300 transition-colors shadow-2xs cursor-pointer"
            >
              "{chip}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[420px] max-h-[550px] overflow-y-auto space-y-4 transition-colors">
        {messages.map((msg) => {
          const isAI = msg.sender === 'assistant';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-xs ${
                  msg.isError ? 'bg-rose-600 text-white' : 'bg-[#2D5A27] text-[#E6B325]'
                }`}>
                  {msg.isError ? <AlertCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 leading-relaxed ${
                  msg.isError
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                    : isAI
                    ? 'bg-[#F8F5F0] dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-[#2D5A27]/10 dark:border-slate-700'
                    : 'bg-[#2D5A27] dark:bg-emerald-600 text-white shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-70">
                  <span className="font-semibold">{isAI ? 'GramSetu Advisor' : 'You'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-line text-xs font-normal">
                  {msg.text}
                </div>

                {isAI && msg.references && msg.references.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Matching GramSetu Records
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {msg.references.map((ref) => {
                        const Icon =
                          ref.type === 'project'
                            ? FolderKanban
                            : ref.type === 'product'
                            ? ShoppingBag
                            : ref.type === 'scheme'
                            ? Landmark
                            : TrendingUp;
                        return (
                          <button
                            key={`${ref.type}-${ref.id}`}
                            type="button"
                            onClick={() => handleOpenReference(ref)}
                            className="text-left p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#2E7D32] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#22C55E] shrink-0" />
                              <div className="min-w-0">
                                <div className="font-semibold text-[11px] text-slate-900 dark:text-white truncate">
                                  {ref.title}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                  {ref.subtitle}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isAI && !msg.isError && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Grounded in GramSetu Database</span>
                    <button
                      onClick={() => handleSpeak(msg.text, msg.id)}
                      className={`flex items-center gap-1 font-semibold cursor-pointer ${
                        isSpeaking ? 'text-amber-600 dark:text-amber-400' : 'text-[#2D5A27] dark:text-emerald-400 hover:underline'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Read Aloud</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 py-2">
            <div className="w-8 h-8 rounded-xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>GramSetu Advisor is analyzing database records...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Speech Support Notice */}
      {speechNotice && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{speechNotice}</span>
        </div>
      )}

      {/* Input Form with Voice Button */}
      <div className="bg-white dark:bg-[#1E293B] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md transition-colors">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Click to speak'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isRecording ? 'Listening to your voice...' : 'Ask about projects, govt schemes, market prices, or marketplace products...'}
            className="flex-1 px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none bg-transparent"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-40 cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5 text-[#E6B325] dark:text-amber-300" />
          </button>
        </form>
      </div>
    </div>
  );
};
