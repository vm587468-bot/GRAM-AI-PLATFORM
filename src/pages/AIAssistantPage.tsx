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
  RotateCcw,
  Languages,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantPage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Namaste ${currentUser.name}! I am Gram Sahayak AI (ग्राम सहायक), your personal rural business advisor powered by Google Gemini. \n\nI can help you with:\n1. Fair profit price calculations for your handmade & farm produce\n2. Low-cost eco-friendly packaging using banana fibre and rice husks\n3. Applying for PM Vishwakarma and PM Mudra collateral-free government subsidies\n4. Preparing inventory and WhatsApp catalog marketing for upcoming festivals.\n\nHow can I support your village enterprise today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Marathi' | 'Bengali' | 'Tamil' | 'Telugu'>('English');
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Voice speech-to-text input (Web Speech API)
  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
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
      recognition.lang = selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
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

  // Text-to-speech for reading AI response aloud
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
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          language: selectedLanguage,
          role
        })
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Namaste! I am here to help you scale your village enterprise.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-fallback-${Date.now()}`,
        sender: 'assistant',
        text: 'Namaste! While reconnecting, remember this golden rule: Always calculate your selling price as (Raw materials + Minimum ₹80/hr labor + 25% profit margin). Also claim your ₹15,000 free toolkit under the PM Vishwakarma scheme!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const promptChips = [
    'How should I price my handmade cotton sarees for Diwali to ensure fair profit?',
    'Explain PM Vishwakarma loan and ₹15,000 free toolkit eligibility in simple words',
    'How can I pack fragile terracotta pots using dried banana fibre so they do not break in courier?',
    'What are the best WhatsApp catalog strategies for selling wild forest honey to metro customers?'
  ];

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8 space-y-6">
      
      {/* Assistant Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#2D5A27]/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                Gram Sahayak AI
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E6B325]/20 text-[#2D5A27] border border-[#E6B325]/40">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Rural Enterprise Copilot · Voice & Multilingual Advisor
            </p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-[#2D5A27]" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as any)}
            className="text-xs font-semibold p-2 rounded-xl bg-[#F8F5F0] border border-slate-200 text-slate-800 focus:outline-none focus:border-[#2D5A27]"
          >
            <option value="English">English (Advice)</option>
            <option value="Hindi">हिंदी (Hindi Advice)</option>
            <option value="Marathi">मराठी (Marathi Advice)</option>
            <option value="Bengali">বাংলা (Bengali Advice)</option>
            <option value="Tamil">தமிழ் (Tamil Advice)</option>
            <option value="Telugu">తెలుగు (Telugu Advice)</option>
          </select>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-[#E6B325]" />
          <span>Recommended Practical Inquiries</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="text-left p-2.5 rounded-xl bg-white hover:bg-[#F8F5F0] border border-slate-200/80 hover:border-[#2D5A27]/40 text-xs text-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              "{chip}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAI = msg.sender === 'assistant';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2 leading-relaxed ${
                  isAI
                    ? 'bg-[#F8F5F0] text-slate-800 border border-[#2D5A27]/10'
                    : 'bg-[#2D5A27] text-white shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-70">
                  <span className="font-semibold">{isAI ? 'Gram Sahayak' : 'You'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-line text-xs font-normal">
                  {msg.text}
                </div>

                {isAI && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Rural Growth Intelligence</span>
                    <button
                      onClick={() => handleSpeak(msg.text, msg.id)}
                      className={`flex items-center gap-1 font-semibold cursor-pointer ${
                        isSpeaking ? 'text-amber-600' : 'text-[#2D5A27] hover:underline'
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
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-500 py-2">
            <div className="w-8 h-8 rounded-xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>Gram Sahayak AI is formulating practical advice with Gemini 3.8 Flash...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Voice Button */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Microphone Toggle */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isRecording 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Click to speak in Hindi or English'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#2D5A27]" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isRecording ? 'Listening to your voice...' : 'Ask about pricing, PM Vishwakarma subsidy, packaging or marketing...'}
            className="flex-1 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-40 cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5 text-[#E6B325]" />
          </button>
        </form>

        {isRecording && (
          <div className="text-[11px] text-rose-600 font-semibold px-2 pt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>Microphone active. Speak naturally in {selectedLanguage}...</span>
          </div>
        )}
      </div>

    </div>
  );
};
