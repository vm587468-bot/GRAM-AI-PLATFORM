import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  ArrowRight, 
  Bot, 
  Navigation, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface AppVoiceWidgetProps {
  currentTab: string;
  setActiveTab: (tab: string) => void;
  onTrackOrder: (trackingId: string) => void;
  onFilterMarketplace: (search: string) => void;
}

interface ChatItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  action?: {
    type: 'navigate' | 'search_product' | 'track_order' | 'open_cart';
    target?: string;
  };
}

export const AppVoiceWidget: React.FC<AppVoiceWidgetProps> = ({
  currentTab,
  setActiveTab,
  onTrackOrder,
  onFilterMarketplace
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<ChatItem[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: "Namaste! I am your Gram AI Voice Assistant. Speak or type any query about our products, UPI payments, postal tracking, or village artisan support."
    }
  ]);

  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([
    'How does UPI escrow protect buyers and artisans?',
    'Track my parcel GRAM-88219',
    'Show me handloom sarees and textiles',
    'How do village artisans get paid?'
  ]);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading, isOpen]);

  // Voice Speech-To-Text Handler
  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query in the box.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      // Stop any existing speech
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English / Hindi mix

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        if (transcript) {
          handleSendQuery(transcript);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // Text-To-Speech Output
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Query Backend AI Voice Assistant
  const handleSendQuery = async (queryToSend: string) => {
    const text = queryToSend.trim();
    if (!text || loading) return;

    const userItem: ChatItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text
    };

    setHistory(prev => [...prev, userItem]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/app-voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          currentTab
        })
      });

      const data = await res.json();
      const botReply = data.reply || 'Here is what I found on Gram AI.';

      const botItem: ChatItem = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        action: data.action
      };

      setHistory(prev => [...prev, botItem]);
      if (Array.isArray(data.suggestedQueries) && data.suggestedQueries.length > 0) {
        setSuggestedQueries(data.suggestedQueries);
      }

      // Auto-speak response if enabled
      if (autoSpeak) {
        speakText(botReply);
      }

      // Execute app actions (navigation or search or tracking)
      if (data.action) {
        handleExecuteAction(data.action);
      }

    } catch (err) {
      console.error('Voice query error', err);
      const fallbackItem: ChatItem = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "Gram AI connects village producers directly with conscious buyers. You can explore the marketplace, track consignments, or view the artisan dashboard!"
      };
      setHistory(prev => [...prev, fallbackItem]);
      if (autoSpeak) speakText(fallbackItem.text);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = (action: any) => {
    if (!action) return;
    if (action.type === 'navigate' && action.target) {
      setActiveTab(action.target);
    } else if (action.type === 'search_product' && action.target) {
      setActiveTab('marketplace');
      onFilterMarketplace(action.target);
    } else if (action.type === 'track_order' && action.target) {
      setActiveTab('logistics');
      onTrackOrder(action.target);
    }
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              if (autoSpeak && history.length === 1) {
                speakText(history[0].text);
              }
            }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#2D5A27] text-white shadow-2xl hover:bg-[#1E3D1A] transition-all hover:scale-105 border-2 border-[#E6B325] cursor-pointer group"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-[#E6B325]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E6B325] animate-ping" />
            </div>
            <span className="font-semibold text-xs tracking-wide">
              AI Voice Assistant
            </span>
          </button>
        )}
      </div>

      {/* Floating Interactive Voice Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-[#2D5A27]/25 overflow-hidden flex flex-col max-h-[85vh] text-[#2C2C2C] animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[#2D5A27] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E6B325] text-[#2C2C2C] flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Gram AI Voice Copilot</h3>
                <p className="text-[11px] text-white/80">Speaks answers & navigates app for you</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Voice Sound Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setAutoSpeak(!autoSpeak);
                }}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  autoSpeak ? 'bg-white/20 text-[#E6B325]' : 'text-white/60 hover:bg-white/10'
                }`}
                title={autoSpeak ? 'Voice output is ON (Auto-reads responses)' : 'Voice output is MUTED'}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Voice Speaking Status Bar */}
          {isSpeaking && (
            <div className="bg-[#E6B325]/20 border-b border-[#E6B325]/40 px-4 py-1.5 flex items-center justify-between text-xs text-[#2D5A27]">
              <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#2D5A27]" />
                <span>Speaking answer aloud...</span>
              </span>
              <button
                onClick={stopSpeaking}
                className="text-[10px] uppercase font-bold text-rose-700 hover:underline cursor-pointer"
              >
                Stop Audio
              </button>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F5F0]/50 text-xs min-h-[260px] max-h-[380px]">
            {history.map((item) => {
              const isBot = item.sender === 'assistant';
              return (
                <div
                  key={item.id}
                  className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-6 h-6 rounded-lg bg-[#2D5A27] text-[#E6B325] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      isBot
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                        : 'bg-[#2D5A27] text-white shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{item.text}</p>

                    {isBot && (
                      <div className="pt-2 mt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <button
                          onClick={() => speakText(item.text)}
                          className="hover:text-[#2D5A27] flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3 text-[#2D5A27]" />
                          <span>Replay Audio</span>
                        </button>

                        {item.action && item.action.type && (
                          <button
                            onClick={() => handleExecuteAction(item.action)}
                            className="text-[#2D5A27] font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>Open {item.action.target || item.action.type}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2D5A27]" />
                <span>Thinking and preparing voice answer...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Voice Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 space-y-1">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block px-1">
              Ask or Tap to Speak:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {suggestedQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(q)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#2D5A27]/10 hover:text-[#2D5A27] text-[11px] text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Mic and Input */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(inputText);
              }}
              className="flex items-center gap-2"
            >
              {/* Mic button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2.5 rounded-xl transition-all cursor-pointer shadow-xs ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200' 
                    : 'bg-[#2D5A27] text-white hover:bg-[#1E3D1A]'
                }`}
                title={isRecording ? 'Listening... click to stop' : 'Tap to speak your query'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#E6B325]" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRecording ? 'Listening to voice...' : 'Ask anything about the app or products...'}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#2D5A27] placeholder-slate-400"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="p-2 rounded-xl bg-[#2D5A27] text-white hover:bg-[#1E3D1A] transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4 text-[#E6B325]" />
              </button>
            </form>

            {isRecording && (
              <p className="text-[10px] text-rose-600 font-semibold mt-1 px-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                <span>Listening now... speak your question about Gram AI!</span>
              </p>
            )}
          </div>

        </div>
      )}
    </>
  );
};
