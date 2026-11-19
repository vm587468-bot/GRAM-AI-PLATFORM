import React, { useState, useEffect } from 'react';
import {
  Landmark,
  ShieldCheck,
  ArrowRight,
  Calculator,
  Volume2,
  VolumeX,
  Clock,
  Check,
  Loader2,
  ExternalLink,
  X,
  Search,
  AlertCircle,
  FileText,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { UNIVERSAL_AUDIO_LANGUAGES } from '../audioLanguages';
import { useLanguage } from '../context/LanguageContext';
import { GovernmentScheme } from '../types';

export interface GovernmentSchemesSectionProps {
  currentLang?: string;
  initialSearch?: string;
}

export const GovernmentSchemesSection: React.FC<GovernmentSchemesSectionProps> = ({
  initialSearch = ''
}) => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('all');

  // Audio voice state
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

  // Detail & Application Modals
  const [detailScheme, setDetailScheme] = useState<GovernmentScheme | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeApplyScheme, setActiveApplyScheme] = useState<GovernmentScheme | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantTrade, setApplicantTrade] = useState('');
  const [desiredAmount, setDesiredAmount] = useState('300000');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState<any | null>(null);

  useEffect(() => {
    if (initialSearch) {
      setSearchInput(initialSearch);
      setDebouncedQuery(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
    }, 280);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchSchemes();
  }, [debouncedQuery, selectedCategory, selectedState, selectedType, selectedStatus, selectedEligibility]);

  useEffect(() => {
    calculateLoan(300000, 'artisan', 3);
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL('/api/schemes', window.location.origin);
      if (debouncedQuery) url.searchParams.set('q', debouncedQuery);
      if (selectedCategory !== 'all') url.searchParams.set('category', selectedCategory);
      if (selectedState !== 'all') url.searchParams.set('state', selectedState);
      if (selectedType !== 'all') url.searchParams.set('schemeType', selectedType);
      if (selectedStatus !== 'all') url.searchParams.set('status', selectedStatus);
      if (selectedEligibility !== 'all') url.searchParams.set('eligibility', selectedEligibility);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to load government schemes');
      const data = await res.json();
      setSchemes(data.schemes || []);
      if (Array.isArray(data.states)) setAvailableStates(data.states);
      if (Array.isArray(data.schemeTypes)) setAvailableTypes(data.schemeTypes);
    } catch {
      setError('Unable to load government schemes right now. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const calculateLoan = async (amt: number, trade: string, years: number) => {
    try {
      const res = await fetch('/api/schemes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt, category: trade, tenureYears: years })
      });
      if (res.ok) {
        const data = await res.json();
        setCalcResult(data);
      }
    } catch (e) {
      console.error('Calculation error', e);
    }
  };

  const handleSpeech = async (scheme: GovernmentScheme) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio && currentPlayingId === scheme.id) {
      stopAudio();
      return;
    }

    window.speechSynthesis.cancel();
    setTranslatingAudio(true);
    setCurrentPlayingId(scheme.id);

    const scriptToSpeak = `${scheme.name}. Ministry: ${scheme.ministry}. ${scheme.description}. Financial assistance: ${scheme.financialAssistance || scheme.loanDisplay}. Status: ${scheme.status}. Official portal: ${scheme.officialSource}.`;

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
    } catch {
      setIsPlayingAudio(false);
      setTranslatingAudio(false);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setCurrentPlayingId(null);
    setSpokenTranscript(null);
  };

  const handleOpenApplyModal = (scheme: GovernmentScheme) => {
    setActiveApplyScheme(scheme);
    setDesiredAmount(String(scheme.maxLoanAmount || 200000));
    setApplicationSuccess(null);
    setApplyError(null);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApplyScheme) return;
    setApplying(true);
    setApplyError(null);
    try {
      const res = await fetch('/api/schemes/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName,
          phone: applicantPhone,
          schemeId: activeApplyScheme.id,
          trade: applicantTrade,
          requestedAmount: desiredAmount
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not submit inquiry.');
      }
      setApplicationSuccess(data.application);
    } catch (err: any) {
      setApplyError(err?.message || 'Error submitting inquiry.');
    } finally {
      setApplying(false);
    }
  };

  const resetFilters = () => {
    setSearchInput('');
    setDebouncedQuery('');
    setSelectedCategory('all');
    setSelectedState('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedEligibility('all');
  };

  const statusLabel = (st: GovernmentScheme['status']) => {
    if (st === 'active') return 'Active';
    if (st === 'upcoming') return 'Upcoming';
    return 'Expired';
  };

  const statusColor = (st: GovernmentScheme['status']) => {
    if (st === 'active') return 'text-emerald-700 dark:text-emerald-400';
    if (st === 'upcoming') return 'text-amber-700 dark:text-amber-400';
    return 'text-rose-700 dark:text-rose-400';
  };

  const categories = [
    { id: 'all', label: 'All Schemes' },
    { id: 'artisan_toolkits', label: 'Artisan Toolkits' },
    { id: 'collateral_free_loans', label: 'Collateral-Free Loans' },
    { id: 'capital_subsidies', label: 'Capital Subsidies' },
    { id: 'women_entrepreneurs', label: 'Women & SC/ST' },
    { id: 'agriculture_allied', label: 'Agriculture & Allied' },
    { id: 'rural_technology', label: 'Rural Technology' }
  ];

  return (
    <section className="container mx-auto px-4 max-w-6xl space-y-6 py-6">
      {/* Section Header */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2E7D32] dark:text-[#22C55E]">
            <Landmark className="w-4 h-4" />
            <span>{t.schemesOfficialSupport}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Verified Government Schemes & Subsidies
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Browse verified Central and State Government programmes with official portals, eligibility criteria, required documents, deadlines, and verification dates. Final applications are completed on the official government portals linked on each scheme.
          </p>
        </div>

        {/* Audio Language Switch */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedAudioLang}
            onChange={e => {
              stopAudio();
              setSelectedAudioLang(e.target.value);
            }}
            aria-label="Audio Language"
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            {UNIVERSAL_AUDIO_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                Audio: {lang.label} ({lang.native})
              </option>
            ))}
          </select>
          {isPlayingAudio && (
            <button
              onClick={stopAudio}
              className="px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>

      {(isPlayingAudio || translatingAudio) && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
          <span>
            {translatingAudio
              ? 'Preparing voice summary in your chosen language...'
              : `Playing summary: "${spokenTranscript?.slice(0, 140)}..."`}
          </span>
        </div>
      )}

      {/* Search & Multi-Facet Filter Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search scheme name, ministry, trade, or benefit..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#2E7D32]"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All States</option>
            {availableStates.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Types</option>
            {availableTypes.map(tp => (
              <option key={tp} value={tp}>
                {tp}
              </option>
            ))}
          </select>

          <select
            value={selectedEligibility}
            onChange={e => setSelectedEligibility(e.target.value)}
            className="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Eligibility</option>
            <option value="Artisan">Artisans & Weavers</option>
            <option value="Women">Women Entrepreneurs</option>
            <option value="Micro">Micro & Small Enterprises</option>
            <option value="Farmer">Farmers & FPOs</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="upcoming">Upcoming</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs text-rose-800 dark:text-rose-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchSchemes}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-12 flex flex-col items-center gap-2 text-xs text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
          <span>Loading verified schemes...</span>
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            No government schemes matched your current filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scheme Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map(scheme => {
            const isSpeakingThis = isPlayingAudio && currentPlayingId === scheme.id;
            return (
              <div
                key={scheme.id}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-[#2E7D32]/60 dark:hover:border-[#22C55E]/60 transition-colors"
              >
                <div className="space-y-3">
                  {/* Clean unboxed metadata header */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>
                      {String(scheme.level).toLowerCase() === 'central' ? 'Central Govt' : 'State Govt'} · {scheme.state} · {scheme.schemeType}
                    </span>
                    <span className={`font-bold ${statusColor(scheme.status)}`}>
                      {statusLabel(scheme.status)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white leading-snug">
                      {scheme.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {scheme.description}
                    </p>
                    <div className="text-[11px] font-semibold text-[#2E7D32] dark:text-[#22C55E] mt-1.5">
                      {scheme.ministry}
                    </div>
                  </div>

                  {/* Financial Highlights */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Assistance / Cap</span>
                      <span className="font-bold text-[#2E7D32] dark:text-[#22C55E] tabular-nums">
                        {scheme.loanDisplay}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Interest / Rate</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {scheme.interestRate || 'See guidelines'}
                      </span>
                    </div>
                    <div className="col-span-2 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Subsidy / Key Benefit</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {scheme.subsidyGrant || scheme.financialAssistance}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <div>
                      <strong>Deadline:</strong> {scheme.deadline}
                    </div>
                    <div>
                      <strong>Verified:</strong> {scheme.lastVerifiedDate || 'Refer official portal'} ({scheme.officialSource})
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSpeech(scheme)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isSpeakingThis
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                      title="Listen in selected language"
                    >
                      {isSpeakingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailScheme(scheme)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#2E7D32] font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      Full Details
                    </button>
                  </div>

                  {scheme.officialUrl ? (
                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 font-bold inline-flex items-center gap-1 hover:opacity-90"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(scheme)}
                      disabled={scheme.status === 'expired'}
                      className="px-3.5 py-2 rounded-xl bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 font-bold cursor-pointer disabled:opacity-40"
                    >
                      {t.applyNow}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loan EMI & Subsidy Estimator */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#22C55E] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                {t.loanEmiCalculator}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Indicative EMI estimator for scheme-backed loans (verify final terms with your lending bank).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Loan Amount:</span>
              <span className="text-[#2E7D32] dark:text-[#22C55E] tabular-nums">
                ₹{calcAmount.toLocaleString('en-IN')}
              </span>
            </label>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="25000"
              value={calcAmount}
              onChange={e => {
                const v = Number(e.target.value);
                setCalcAmount(v);
                calculateLoan(v, calcTrade, calcYears);
              }}
              className="w-full accent-[#2E7D32] cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">Activity Category:</label>
            <select
              value={calcTrade}
              onChange={e => {
                setCalcTrade(e.target.value);
                calculateLoan(calcAmount, e.target.value, calcYears);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="artisan">Artisan / Craftsperson (PM Vishwakarma)</option>
              <option value="retail">Retail / Trade (PMMY MUDRA)</option>
              <option value="manufacturing">Micro Manufacturing / Food (PMEGP)</option>
              <option value="women">Women / SC-ST Greenfield (Stand-Up India)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">Tenure:</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 5].map(yr => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    setCalcYears(yr);
                    calculateLoan(calcAmount, calcTrade, yr);
                  }}
                  className={`py-2 rounded-xl font-bold border cursor-pointer ${
                    calcYears === yr
                      ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 border-transparent'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {yr} Yr
                </button>
              ))}
            </div>
          </div>
        </div>

        {calcResult && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block">Matched Scheme</span>
              <span className="font-bold text-slate-900 dark:text-white">{calcResult.recommendedScheme?.name}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Indicative Interest</span>
              <span className="font-bold text-[#2E7D32] dark:text-[#22C55E]">{calcResult.interestRateFormatted}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Estimated Monthly EMI</span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                ₹{Number(calcResult.monthlyEmi || 0).toLocaleString('en-IN')}/mo
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Indicative Margin/Subsidy</span>
              <span className="font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                {calcResult.estimatedSubsidy > 0
                  ? `Up to ₹${Number(calcResult.estimatedSubsidy).toLocaleString('en-IN')}`
                  : 'Refer official scheme terms'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Scheme Full Detail Modal */}
      {detailScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setDetailScheme(null)}
              aria-label="Close scheme details"
              className="sticky top-0 float-right p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 pr-8">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {detailScheme.ministry} · {detailScheme.state} · Status:{' '}
                <strong className={statusColor(detailScheme.status)}>{statusLabel(detailScheme.status)}</strong>
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                {detailScheme.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{detailScheme.description}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Financial Assistance / Subsidy</span>
                <strong className="text-slate-900 dark:text-white">
                  {detailScheme.financialAssistance || detailScheme.subsidyGrant}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Application Deadline</span>
                <strong className="text-slate-900 dark:text-white">{detailScheme.deadline}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Official Source</span>
                <strong className="text-slate-900 dark:text-white">{detailScheme.officialSource}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Last Verified Date</span>
                <strong className="text-slate-900 dark:text-white tabular-nums">
                  {detailScheme.lastVerifiedDate || 'Verify on official portal'}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
                  <span>Purpose & Official Benefits</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                  {detailScheme.purposeBenefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
                  <span>Eligibility Criteria</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                  {detailScheme.eligibilityCriteria.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
                  <span>Required Documents</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                  {detailScheme.documents.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
                  <span>Application Steps</span>
                </h4>
                <ol className="list-decimal pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                  {detailScheme.applicationProcess.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              {detailScheme.officialUrl && (
                <a
                  href={detailScheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 font-bold inline-flex items-center gap-1.5"
                >
                  <span>Visit Official Government Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {detailScheme.status !== 'expired' && (
                <button
                  type="button"
                  onClick={() => {
                    const target = detailScheme;
                    setDetailScheme(null);
                    handleOpenApplyModal(target);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 hover:border-[#2E7D32] cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Save Facilitation Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Facilitation Inquiry Modal */}
      {isApplyModalOpen && activeApplyScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {applicationSuccess ? (
              <div className="text-center py-4 space-y-4 text-xs">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                  Inquiry Reference Recorded
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Reference ID: <strong className="font-mono">{applicationSuccess.id}</strong>. Complete your formal submission on the official portal below.
                </p>
                {applicationSuccess.officialUrl && (
                  <a
                    href={applicationSuccess.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold"
                  >
                    <span>Open Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                    Scheme Facilitation Request
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    {activeApplyScheme.name} · {activeApplyScheme.ministry}
                  </p>
                </div>

                {applyError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
                    {applyError}
                  </div>
                )}

                <div>
                  <label className="font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={e => setApplicantPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Business / Trade Activity</label>
                  <input
                    type="text"
                    required
                    value={applicantTrade}
                    onChange={e => setApplicantTrade(e.target.value)}
                    placeholder="e.g. Food processing, handloom, dairy"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {applying && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Inquiry</span>
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
