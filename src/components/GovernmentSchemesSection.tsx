import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Calculator, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  FileText, 
  Users, 
  Clock, 
  Award, 
  Check, 
  Loader2, 
  PhoneCall, 
  Building2,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { UNIVERSAL_AUDIO_LANGUAGES } from '../audioLanguages';
import { useLanguage } from '../context/LanguageContext';

export interface Scheme {
  id: string;
  name: string;
  tagline: string;
  ministry: string;
  maxLoanAmount: number;
  loanDisplay: string;
  tranches: string;
  interestRate: string;
  interestSubvention: string;
  subsidyGrant: string;
  collateral: string;
  category: 'artisan_toolkits' | 'collateral_free_loans' | 'capital_subsidies' | 'women_entrepreneurs' | string;
  badge: string;
  eligibleTrades: string[];
  processingTime: string;
  documents: string[];
}

export const GovernmentSchemesSection: React.FC<{ currentLang?: string }> = () => {
  const { t, language } = useLanguage();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Audio voice state for schemes
  const [selectedAudioLang, setSelectedAudioLang] = useState<string>('hi-IN');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [translatingAudio, setTranslatingAudio] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string | null>(null);

  // Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(300000);
  const [calcTrade, setCalcTrade] = useState<string>('artisan');
  const [calcYears, setCalcYears] = useState<number>(3);
  const [calcResult, setCalcResult] = useState<any>(null);
  const [calculating, setCalculating] = useState<boolean>(false);

  // Application Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeApplyScheme, setActiveApplyScheme] = useState<Scheme | null>(null);
  const [applicantName, setApplicantName] = useState('Radha Devi');
  const [applicantPhone, setApplicantPhone] = useState('+91 94310 44521');
  const [applicantTrade, setApplicantTrade] = useState('Handloom Textiles & Rural Craft');
  const [desiredAmount, setDesiredAmount] = useState('300000');
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState<any | null>(null);

  useEffect(() => {
    fetchSchemes();
    calculateLoan(300000, 'artisan', 3);
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/schemes');
      const data = await res.json();
      if (data.schemes) {
        setSchemes(data.schemes);
      }
    } catch (err) {
      console.error('Failed to load government schemes', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateLoan = async (amt: number, trade: string, years: number) => {
    try {
      setCalculating(true);
      const res = await fetch('/api/schemes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, category: trade, tenureYears: years })
      });
      const data = await res.json();
      setCalcResult(data);
    } catch (e) {
      console.error('Calculation error', e);
    } finally {
      setCalculating(false);
    }
  };

  const handleSpeech = async (scheme: Scheme) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio && currentPlayingId === scheme.id) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setCurrentPlayingId(null);
      setSpokenTranscript(null);
      return;
    }

    window.speechSynthesis.cancel();
    setTranslatingAudio(true);
    setCurrentPlayingId(scheme.id);

    const scriptToSpeak = `${scheme.name}. Offered by ${scheme.ministry}. You can receive up to ${scheme.loanDisplay} with interest rate of ${scheme.interestRate}. Subsidy: ${scheme.subsidyGrant}. Collateral: ${scheme.collateral}. Apply directly through Gram AI district kiosks with zero middleman deductions.`;

    try {
      const selectedLangObj = UNIVERSAL_AUDIO_LANGUAGES.find(l => l.code === selectedAudioLang);
      const res = await fetch('/api/voice/speak-in-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: scriptToSpeak,
          targetLanguage: selectedLangObj?.label || 'Hindi',
          languageCode: selectedAudioLang
        })
      });

      const data = await res.json();
      const text = data.spokenAudioScript || scriptToSpeak;
      setSpokenTranscript(text);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = data.languageCode || selectedAudioLang;
      utterance.rate = 0.94;
      utterance.pitch = 1.0;

      if (window.speechSynthesis.getVoices) {
        const voices = window.speechSynthesis.getVoices();
        const matched = voices.find(v => v.lang.toLowerCase().startsWith((data.languageCode || selectedAudioLang).slice(0, 2).toLowerCase()));
        if (matched) utterance.voice = matched;
      }

      utterance.onstart = () => {
        setIsPlayingAudio(true);
        setTranslatingAudio(false);
      };
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setCurrentPlayingId(null);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setTranslatingAudio(false);
        setCurrentPlayingId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Audio playback failed', e);
      const utterance = new SpeechSynthesisUtterance(scriptToSpeak);
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
    setCurrentPlayingId(null);
    setSpokenTranscript(null);
  };

  const handleOpenApplyModal = (scheme: Scheme) => {
    setActiveApplyScheme(scheme);
    setDesiredAmount(String(scheme.maxLoanAmount));
    setApplicationSuccess(null);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApplyScheme) return;

    try {
      setApplying(true);
      const res = await fetch('/api/schemes/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName,
          phone: applicantPhone,
          schemeId: activeApplyScheme.id,
          trade: applicantTrade,
          requestedAmount: desiredAmount,
          location: 'Varanasi District Gramin Bank Branch #12'
        })
      });
      const data = await res.json();
      if (data.success) {
        setApplicationSuccess(data.application);
      }
    } catch (err) {
      console.error('Application submit error', err);
    } finally {
      setApplying(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Schemes & Loans (6)' },
    { id: 'artisan_toolkits', label: '🔨 Artisan Toolkits & ₹3L Loans' },
    { id: 'collateral_free_loans', label: '💼 MUDRA Working Capital' },
    { id: 'capital_subsidies', label: '🏭 35% Capital Subsidies (PMEGP)' },
    { id: 'women_entrepreneurs', label: '👩‍🌾 Women & SHG Micro-Credit' },
  ];

  const filteredSchemes = selectedCategory === 'all'
    ? schemes
    : schemes.filter(s => s.category === selectedCategory);

  return (
    <section className="container mx-auto px-4 max-w-6xl space-y-8 py-6">
      
      {/* Main Section Header Banner */}
      <div className="bg-gradient-to-r from-[#1B3E17] via-[#2D5A27] to-[#1E4319] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border-2 border-[#E6B325]/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6B325]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6B325]/20 text-[#E6B325] text-xs font-bold border border-[#E6B325]/30">
            <Landmark className="w-3.5 h-3.5" />
            <span>{t.schemesOfficialSupport}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-snug">
            {t.schemesBannerTitle}
          </h2>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal">
            No searching required! Instantly discover and access subsidized government loans from <strong>₹50,000 to ₹50 Lakh</strong>, <strong>up to 35% capital subsidies</strong>, <strong>₹15,000 modern toolkits</strong>, and <strong>5% concessional interest rates</strong> backed by the Government of India, NABARD, and SIDBI.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.schemesCollateralFree}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-[#E6B325]">
              <Sparkles className="w-3.5 h-3.5 text-[#E6B325]" />
              <span>{t.schemesDisbursalDirect}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>{t.schemesZeroBrokers}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Global Language Selector & Audio Voice Announcement Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {t.listenSchemesAudio}:
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Click the audio button on any scheme below to hear loans, interest rates, and subsidies spoken aloud.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedAudioLang}
            onChange={(e) => {
              stopAudio();
              setSelectedAudioLang(e.target.value);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-[#F8F5F0] dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2D5A27] shadow-inner cursor-pointer"
          >
            {UNIVERSAL_AUDIO_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                Audio Voice: {lang.label} ({lang.native})
              </option>
            ))}
          </select>

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

      {/* Spoken Transcript Bar if playing */}
      {(isPlayingAudio || translatingAudio) && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between animate-fadeIn text-xs">
          <div className="flex items-center gap-2 text-[#2D5A27] dark:text-emerald-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
            <span>
              {translatingAudio ? 'Translating scheme details into your selected voice language...' : `Speaking: "${spokenTranscript?.slice(0, 140)}..."`}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-1 h-3 bg-[#2D5A27] dark:bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-5 bg-[#2D5A27] dark:bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-4 bg-[#2D5A27] dark:bg-emerald-400 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#2D5A27] dark:bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Schemes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => {
          const isSpeakingThis = isPlayingAudio && currentPlayingId === scheme.id;
          return (
            <div
              key={scheme.id}
              className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group hover:border-[#2D5A27]/50 dark:hover:border-emerald-500/40"
            >
              {/* Top Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E6B325]/15 dark:bg-amber-950/40 text-[#2D5A27] dark:text-amber-300 border border-[#E6B325]/30 dark:border-amber-700/40">
                  {scheme.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {scheme.processingTime}
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#2D5A27] dark:group-hover:text-emerald-400 transition-colors leading-tight">
                  {scheme.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {scheme.tagline}
                </p>
                <div className="text-[11px] text-[#2D5A27] dark:text-emerald-400 font-semibold pt-0.5">
                  Authority: {scheme.ministry}
                </div>
              </div>

              {/* Loan & Subsidy Highlights Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Loan</span>
                  <span className="text-base font-bold text-[#2D5A27] dark:text-emerald-300">{scheme.loanDisplay}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Interest Rate</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{scheme.interestRate}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-[#C69516] dark:text-amber-400 block">Direct Govt Subsidy / Benefit</span>
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">{scheme.subsidyGrant}</span>
                </div>
              </div>

              {/* Collateral & Tranches Info */}
              <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span><strong>Collateral:</strong> {scheme.collateral}</span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span><strong>Structure:</strong> {scheme.tranches}</span>
                </div>
              </div>

              {/* Eligible Trades Preview */}
              <div className="space-y-1.5 text-[11px] pt-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Eligible Trades:</span>
                <div className="flex flex-wrap gap-1">
                  {scheme.eligibleTrades.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                      {t}
                    </span>
                  ))}
                  {scheme.eligibleTrades.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px]">
                      +{scheme.eligibleTrades.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Audio Listen & Apply */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSpeech(scheme)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSpeakingThis 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                  title="Listen aloud in chosen language"
                >
                  {isSpeakingThis ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#2D5A27]" />
                      <span>Listen</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenApplyModal(scheme)}
                  className="px-4 py-2 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer group/btn"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E6B325] group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Interactive Live Scheme & Loan EMI Calculator Bar */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E6B325]/20 dark:bg-amber-950/40 text-[#2D5A27] dark:text-amber-300 flex items-center justify-center font-bold">
              <Calculator className="w-6 h-6 text-[#2D5A27] dark:text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                Automatic Scheme & EMI Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your business requirement to see exact monthly EMI, eligible government subsidies, and zero-collateral limits.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            100% Transparent Govt Subvention
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          {/* Input 1: Loan Amount */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Required Loan Amount:</span>
              <span className="text-[#2D5A27] dark:text-emerald-400 font-bold text-sm">₹{calcAmount.toLocaleString('en-IN')}</span>
            </label>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="25000"
              value={calcAmount}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCalcAmount(val);
                calculateLoan(val, calcTrade, calcYears);
              }}
              className="w-full accent-[#2D5A27] dark:accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹50,000 (Shishu)</span>
              <span>₹3,00,000 (Vishwakarma)</span>
              <span>₹20,00,000 (MUDRA)</span>
            </div>
          </div>

          {/* Input 2: Trade Category */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">Business / Trade Category:</label>
            <select
              value={calcTrade}
              onChange={(e) => {
                const val = e.target.value;
                setCalcTrade(val);
                calculateLoan(calcAmount, val, calcYears);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-[#F8F5F0] dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2D5A27]"
            >
              <option value="artisan">Artisan / Handloom / Potter / Weaver (PM Vishwakarma)</option>
              <option value="retail">Retail / Ration Store / Sports Goods (MUDRA)</option>
              <option value="manufacturing">Small Manufacturing / Food Processing (PMEGP 35% Subsidy)</option>
              <option value="women">Women Entrepreneur / SHG Guild (Stand-Up India)</option>
            </select>
          </div>

          {/* Input 3: Tenure */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">Repayment Period:</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 5].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    setCalcYears(yr);
                    calculateLoan(calcAmount, calcTrade, yr);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                    calcYears === yr 
                      ? 'bg-[#2D5A27] dark:bg-emerald-600 text-white border-[#2D5A27] dark:border-emerald-600' 
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {yr} Year{yr > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Calculation Summary Results */}
        {calcResult && (
          <div className="p-5 rounded-2xl bg-[#2D5A27]/5 dark:bg-emerald-950/30 border border-[#2D5A27]/20 dark:border-emerald-800/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Recommended Scheme</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{calcResult.recommendedScheme.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Subsidized Interest Rate</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">{calcResult.interestRateFormatted}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Estimated Monthly EMI</span>
              <span className="font-bold text-[#2D5A27] dark:text-emerald-300 text-base">₹{calcResult.monthlyEmi?.toLocaleString('en-IN')}/mo</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#C69516] dark:text-amber-400 block">Direct Govt Subsidy</span>
              <span className="font-bold text-[#C69516] dark:text-amber-400 text-base">
                {calcResult.estimatedSubsidy > 0 ? `₹${calcResult.estimatedSubsidy.toLocaleString('en-IN')}` : '₹15,000 Toolkit + 8% Subvention'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 1-Click Scheme Application Modal */}
      {isApplyModalOpen && activeApplyScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {applicationSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                    Application Pre-Approved!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Your scheme application has been registered and verified under priority rural enterprise quota.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-2">
                  <div className="flex justify-between border-b border-slate-200/80 dark:border-slate-700 pb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Application Token:</span>
                    <strong className="font-mono text-[#2D5A27] dark:text-emerald-400">{applicationSuccess.id}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/80 dark:border-slate-700 pb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Applicant:</span>
                    <strong className="text-slate-900 dark:text-white">{applicationSuccess.applicantName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/80 dark:border-slate-700 pb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Scheme Name:</span>
                    <strong className="text-slate-900 dark:text-white">{applicationSuccess.schemeName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/80 dark:border-slate-700 pb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">Sanction Amount:</span>
                    <strong className="text-emerald-800 dark:text-emerald-400">₹{Number(applicationSuccess.requestedAmount).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Assigned Verification Kiosk:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{applicationSuccess.kioskLocation}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  A verification SMS with kiosk token has been sent to {applicationSuccess.phone}. Gram AI field coordinator will assist with direct bank disbursal within 48 hours.
                </p>

                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#2D5A27] dark:bg-emerald-600 hover:bg-[#1E3D1A] dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Done & Return to Homepage
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C69516] dark:text-amber-400">
                    Direct Bank Verification
                  </span>
                  <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
                    Apply for {activeApplyScheme.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Authority: {activeApplyScheme.ministry} · {activeApplyScheme.collateral}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name (As per Aadhaar):</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Phone (Aadhaar & Bank Linked):</label>
                    <input
                      type="text"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Business Trade / Craft Activity:</label>
                    <input
                      type="text"
                      required
                      value={applicantTrade}
                      onChange={(e) => setApplicantTrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Requested Loan Amount (INR):</label>
                    <input
                      type="number"
                      required
                      max={activeApplyScheme.maxLoanAmount}
                      value={desiredAmount}
                      onChange={(e) => setDesiredAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:border-[#2D5A27]"
                    />
                    <span className="text-[10px] text-slate-400">
                      Maximum allowable under this scheme: {activeApplyScheme.loanDisplay}
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      <span>Govt Subsidies Included:</span>
                    </span>
                    <p>{activeApplyScheme.subsidyGrant}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-5 py-2.5 rounded-xl bg-[#2D5A27] dark:bg-emerald-600 hover:bg-[#1E3D1A] dark:hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {applying && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E6B325]" />}
                    <span>Submit & Get Pre-Approval</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
