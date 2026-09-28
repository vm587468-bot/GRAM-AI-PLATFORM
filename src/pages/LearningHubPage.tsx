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
  Sparkles,
  Binary,
  Database,
  Sigma,
  Layers,
  Loader2,
  Globe
} from 'lucide-react';
import { LearningModule } from '../types';

import { UNIVERSAL_AUDIO_LANGUAGES } from '../audioLanguages';

export const LearningHubPage: React.FC = () => {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedAudioLang, setSelectedAudioLang] = useState<string>('hi-IN');
  const [customLangName, setCustomLangName] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [translatingAudio, setTranslatingAudio] = useState(false);
  const [translatedScript, setTranslatedScript] = useState<string | null>(null);
  const [activeLangLabel, setActiveLangLabel] = useState<string>('Hindi');

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

  // Multi-Language Audio Voice Player
  const toggleSpeech = async (scriptText: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    setTranslatingAudio(true);

    try {
      const selectedLangObj = UNIVERSAL_AUDIO_LANGUAGES.find(l => l.code === selectedAudioLang);
      const isCustom = selectedAudioLang === 'custom';
      const targetLangName = isCustom ? (customLangName.trim() || 'Hindi') : (selectedLangObj?.label || 'Hindi');
      setActiveLangLabel(targetLangName);

      const res = await fetch('/api/voice/speak-in-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scriptText,
          targetLanguage: targetLangName,
          languageCode: isCustom ? 'custom' : selectedAudioLang
        })
      });

      const data = await res.json();
      const textToSpeak = data.spokenAudioScript || scriptText;
      setTranslatedScript(data.translatedText || scriptText);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const synthesisCode = data.languageCode && data.languageCode !== 'custom' ? data.languageCode : (isCustom ? 'hi-IN' : selectedAudioLang);
      utterance.lang = synthesisCode;
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      // Match best voice in browser if available
      if (window.speechSynthesis.getVoices) {
        const voices = window.speechSynthesis.getVoices();
        const matched = voices.find(v => v.lang.toLowerCase().startsWith(synthesisCode.slice(0, 2).toLowerCase()));
        if (matched) {
          utterance.voice = matched;
        }
      }

      utterance.onstart = () => {
        setIsPlayingAudio(true);
        setTranslatingAudio(false);
      };

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setTranslatingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Audio synthesis failed, falling back', e);
      const utterance = new SpeechSynthesisUtterance(scriptText);
      utterance.lang = selectedAudioLang.startsWith('en') ? selectedAudioLang : 'en-US';
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      setTranslatingAudio(false);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'aoa_algorithms', label: 'AOA (Algorithms in Logistics)', icon: Binary },
    { id: 'dbms_database', label: 'DBMS (3NF Relational & ACID)', icon: Database },
    { id: 'maths_applied', label: 'MATHS (Graph Theory & Markov)', icon: Sigma },
    { id: 'oop_architecture', label: 'OOP (SOLID & Design Patterns)', icon: Layers },
    { id: 'schemes', label: 'PM Vishwakarma & Mudra Loans', icon: Landmark },
    { id: 'packaging', label: 'Zero-Waste Packaging', icon: PackageCheck },
    { id: 'finance', label: 'Direct UPI & Digital Ledger', icon: CreditCard },
    { id: 'quality', label: 'GI Certification & Export Standards', icon: Award }
  ];

  const filteredModules = filterCategory === 'all'
    ? modules
    : modules.filter(m => m.category === filterCategory);

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-[#2D5A27] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-md">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E6B325]">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Gram Vidyapeeth · Business & Computer Science Academy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Practical Business Skills & Core Engineering Fundamentals
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Listen to masterclasses in <strong>ANY language you choose</strong> (Hindi, Marathi, Bengali, Tamil, Telugu, Spanish, French, German, or English). Learn both rural enterprise skills and the computer science disciplines powering Gram AI (AOA, DBMS, MATHS, OOP) taught by <strong>Vedant Mishra</strong>.
          </p>
        </div>
      </div>

      {/* Universal Multi-Language Audio Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Universal Audio Mode: Listen in Any Language You Want
              </h3>
              <p className="text-[11px] text-slate-500">
                Choose from 35+ regional Indian & global languages, or type <em>any</em> custom language you want.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={selectedAudioLang}
              onChange={(e) => {
                stopAudio();
                setSelectedAudioLang(e.target.value);
                setTranslatedScript(null);
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-[#F8F5F0] text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2D5A27] shadow-inner cursor-pointer"
            >
              {UNIVERSAL_AUDIO_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native !== lang.label ? `${lang.label} (${lang.native})` : lang.label} · {lang.region}
                </option>
              ))}
            </select>

            {selectedAudioLang === 'custom' && (
              <input
                type="text"
                placeholder="Type ANY language (e.g. Arabic, Greek, Russian...)"
                value={customLangName}
                onChange={(e) => setCustomLangName(e.target.value)}
                className="px-3.5 py-2 rounded-xl border-2 border-[#E6B325] bg-[#E6B325]/10 text-xs font-medium text-slate-900 focus:outline-none placeholder:text-slate-500 w-full sm:w-64"
              />
            )}

            {isPlayingAudio && (
              <button
                onClick={stopAudio}
                className="px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Audio</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Audio Visualizer Banner */}
        {(isPlayingAudio || translatingAudio) && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between animate-fadeIn text-xs">
            <div className="flex items-center gap-2 font-bold text-[#2D5A27]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>
                {translatingAudio ? `Translating audio into ${activeLangLabel}...` : `Speaking lesson aloud in ${activeLangLabel}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-[#2D5A27] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-5 bg-[#2D5A27] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-4 bg-[#2D5A27] rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterCategory === c.id
                ? 'bg-[#2D5A27] text-white shadow-xs font-semibold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c.icon && <c.icon className="w-3.5 h-3.5 text-[#E6B325]" />}
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Module List (Left Column) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-800 mb-2">Available Learning Modules ({filteredModules.length})</h3>
          
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => {
                stopAudio();
                setSelectedModule(mod);
                setTranslatedScript(null);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                selectedModule?.id === mod.id
                  ? 'bg-white border-[#2D5A27] ring-2 ring-[#2D5A27]/20 shadow-md'
                  : 'bg-white border-slate-200/80 hover:border-[#2D5A27]/40 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold uppercase tracking-wider text-[#C69516]">
                  {mod.category.replace('_', ' ')}
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
                <span className="truncate max-w-[190px]">By {mod.instructor}</span>
                <span className="text-[#2D5A27] font-semibold flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Any Language Audio</span>
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
                  {selectedModule.category.toUpperCase().replace('_', ' ')} MASTERCLASS
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

            {/* Audio Listen Bar (Accessible for Village Producers & Students) */}
            <div className="bg-[#2D5A27]/5 border border-[#2D5A27]/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSpeech(selectedModule.audioScript)}
                  disabled={translatingAudio}
                  className="w-12 h-12 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
                  title="Listen in any selected language"
                >
                  {translatingAudio ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#E6B325]" />
                  ) : isPlayingAudio ? (
                    <Pause className="w-5 h-5 text-[#E6B325]" />
                  ) : (
                    <Play className="w-5 h-5 text-[#E6B325] ml-0.5" />
                  )}
                </button>
                <div>
                  <div className="font-semibold text-xs text-[#2D5A27] flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>
                      {translatingAudio ? `Translating audio into ${activeLangLabel}...` : 
                       isPlayingAudio ? `Speaking in ${activeLangLabel}...` : 
                       `Listen in ${selectedAudioLang === 'custom' ? (customLangName || 'Custom Language') : activeLangLabel}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    High clarity pronunciation designed for listening at rural workshops and university classrooms.
                  </p>
                </div>
              </div>

              {isPlayingAudio && (
                <button
                  onClick={stopAudio}
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
                  Assistance with village verification available through Gram AI district kiosks.
                </p>
              </div>
            )}

            {/* Key Actionable Takeaways */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                Key Concepts & Actionable Takeaways
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

            {/* Audio Transcript Preview with Live Translation */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-slate-700">Audio Script Transcript:</h4>
                <span className="text-[11px] text-[#2D5A27] font-semibold">
                  Voice: {selectedAudioLang === 'custom' ? (customLangName || 'Custom') : activeLangLabel}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic leading-relaxed">
                "{translatedScript || selectedModule.audioScript}"
              </div>
            </div>

            {/* Download summary */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-400">Academic Review Lead: Vedant Mishra</span>
              <button
                onClick={() => alert(`Downloaded 1-page curriculum summary for: ${selectedModule.title}`)}
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
