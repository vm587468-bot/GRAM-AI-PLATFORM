import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Download, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Landmark, 
  PackageCheck,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { LearningModule } from '../types';

export const LearningHubPage: React.FC = () => {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState(false);

  useEffect(() => {
    fetch('/api/learning')
      .then(res => res.json())
      .then(data => {
        setModules(data.modules || []);
        if (data.modules && data.modules.length > 0) {
          setSelectedModule(data.modules[0]);
        }
      })
      .catch(err => console.error('Failed to load learning modules', err));
  }, []);

  // Text-To-Speech Playback for Rural Accessibility
  const toggleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }

    if (speechSynthesisActive) {
      window.speechSynthesis.cancel();
      setSpeechSynthesisActive(false);
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clear village listening
      utterance.onend = () => {
        setSpeechSynthesisActive(false);
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setSpeechSynthesisActive(false);
        setIsPlayingAudio(false);
      };
      window.speechSynthesis.speak(utterance);
      setSpeechSynthesisActive(true);
      setIsPlayingAudio(true);
    }
  };

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'schemes', label: 'Government Subsidies & Loans' },
    { id: 'packaging', label: 'Zero-Waste Packaging' },
    { id: 'finance', label: 'Direct UPI & Digital Ledger' },
    { id: 'quality', label: 'Export & Quality Marks' }
  ];

  const filteredModules = filterCategory === 'all' 
    ? modules 
    : modules.filter(m => m.category === filterCategory);

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-[#2D5A27] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-md">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E6B325]">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Gram Vidyapeeth · Vernacular Skills Academy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Practical Business Learning for Rural Enterprises
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Audio-enabled lessons in Hindi and regional languages on collateral-free loans, zero-plastic packaging, digital accounting, and export certification.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterCategory === c.id
                ? 'bg-[#2D5A27] text-white shadow-xs font-semibold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Module List (Left Column) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-800 mb-2">Available Learning Modules</h3>
          
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => {
                setSelectedModule(mod);
                if (speechSynthesisActive) {
                  window.speechSynthesis.cancel();
                  setSpeechSynthesisActive(false);
                  setIsPlayingAudio(false);
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                selectedModule?.id === mod.id
                  ? 'bg-white border-[#2D5A27] ring-2 ring-[#2D5A27]/20 shadow-md'
                  : 'bg-white border-slate-200/80 hover:border-[#2D5A27]/40 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold uppercase tracking-wider text-[#C69516]">
                  {mod.category}
                </span>
                <span className="flex items-center gap-1">
                  <span>{mod.duration}</span>
                  <span>·</span>
                  <span>{mod.level}</span>
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 leading-snug">
                {mod.title}
              </h4>

              <p className="text-xs text-slate-600 line-clamp-2">
                {mod.summary}
              </p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span>By {mod.instructor}</span>
                <span className="text-[#2D5A27] font-semibold flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Audio Enabled</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Module Detail & Voice Player (Right Column) */}
        {selectedModule && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Module Header */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C69516] uppercase tracking-wider">
                  {selectedModule.category.toUpperCase()} MASTERCLASS
                </span>
                <span className="text-xs bg-[#2D5A27]/10 text-[#2D5A27] font-semibold px-2.5 py-0.5 rounded-full">
                  {selectedModule.language}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {selectedModule.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedModule.summary}
              </p>

              <div className="text-xs text-slate-500">
                Course Lead: <strong>{selectedModule.instructor}</strong>
              </div>
            </div>

            {/* Audio Listen Bar (Accessible for Village Producers) */}
            <div className="bg-[#2D5A27]/5 border border-[#2D5A27]/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSpeech(selectedModule.audioScript)}
                  className="w-12 h-12 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
                  title="Listen in Hindi / Audio mode"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-5 h-5 text-[#E6B325]" />
                  ) : (
                    <Play className="w-5 h-5 text-[#E6B325] ml-0.5" />
                  )}
                </button>
                <div>
                  <div className="font-semibold text-xs text-[#2D5A27] flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingAudio ? 'Speaking Audio Lesson...' : 'Listen to Voice Lesson (Audio Mode)'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    High clarity pronunciation designed for listening at rural workshops.
                  </p>
                </div>
              </div>

              {isPlayingAudio && (
                <button
                  onClick={() => toggleSpeech('')}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Stop Audio
                </button>
              )}
            </div>

            {/* Government Scheme Subsidy Highlight (if applicable) */}
            {selectedModule.schemeBenefit && (
              <div className="bg-[#E6B325]/15 border border-[#E6B325]/40 p-4 rounded-2xl space-y-1 text-xs">
                <div className="font-bold text-[#2D5A27] flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-[#C69516]" />
                  <span>Scheme Direct Subsidy Benefit</span>
                </div>
                <p className="text-slate-800 font-medium">
                  {selectedModule.schemeBenefit}
                </p>
                <p className="text-[11px] text-slate-600">
                  Assistance with village Sarpanch verification available at your district Gram AI kiosk.
                </p>
              </div>
            )}

            {/* Key Actionable Takeaways */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                Key Actionable Steps
              </h3>
              <div className="space-y-2">
                {selectedModule.keyPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8F5F0] border border-slate-200/60 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Transcript Preview */}
            <div className="space-y-2 pt-2">
              <h4 className="font-semibold text-xs text-slate-700">Audio Script Transcript:</h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic leading-relaxed">
                "{selectedModule.audioScript}"
              </div>
            </div>

            {/* Download summary */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-400">Verified by National Rural Livelihood Mission (NRLM)</span>
              <button
                onClick={() => alert(`Downloaded 1-page summary guide for: ${selectedModule.title}`)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#2D5A27]" />
                <span>Save 1-Page Summary</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
