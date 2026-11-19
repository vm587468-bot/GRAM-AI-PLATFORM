import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  BarChart3, 
  CreditCard, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Award,
  ChevronRight,
  Landmark,
  FolderKanban,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../i18n';
import { GovernmentSchemesSection } from '../components/GovernmentSchemesSection';
import { GlobalSearchBar } from '../components/GlobalSearchBar';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  currentLang?: SupportedLanguage;
  onSelectProject?: (projectId: string) => void;
  onSelectProduct?: (productId: string) => void;
  onSelectScheme?: (schemeName: string) => void;
  onSelectMarket?: (commodityName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  onSelectProject = () => {},
  onSelectProduct = () => {},
  onSelectScheme = () => {},
  onSelectMarket = () => {}
}) => {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 bg-radial from-[#E6B325]/10 via-[#F8F5F0] to-[#F8F5F0] dark:via-[#0F172A] dark:to-[#0F172A] border-b border-[#2D5A27]/10 dark:border-slate-800 transition-colors">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2D5A27]/10 dark:bg-emerald-950/50 border border-[#2D5A27]/20 dark:border-emerald-800 text-xs font-semibold text-[#2D5A27] dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5 text-[#E6B325] dark:text-[#FBBF24]" />
                <span>{t.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D5A27] dark:text-emerald-300 tracking-tight leading-[1.15]">
                {t.heroTitle} <br />
                <span className="text-[#C69516] dark:text-[#FBBF24] italic font-normal">{t.heroHighlight}</span>
              </h1>

              <p className="text-base sm:text-lg text-[#2C2C2C]/80 dark:text-slate-300 leading-relaxed font-normal">
                {t.heroSubtitle}
              </p>

              {/* Universal Hero Search */}
              <div className="pt-1">
                <GlobalSearchBar
                  onSelectProject={onSelectProject}
                  onSelectProduct={onSelectProduct}
                  onSelectScheme={onSelectScheme}
                  onSelectMarket={onSelectMarket}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('projects')}
                  className="px-5 py-3.5 rounded-xl bg-[#2D5A27] dark:bg-emerald-600 hover:bg-[#1E3D1A] dark:hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group cursor-pointer"
                >
                  <FolderKanban className="w-4 h-4 text-[#E6B325] dark:text-amber-300" />
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4 text-[#E6B325] dark:text-amber-300 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="px-5 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border border-amber-500"
                >
                  <span>{t.exploreMarketplace}</span>
                </button>

                <button
                  onClick={() => setActiveTab('market')}
                  className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#2D5A27] dark:text-emerald-400 border border-[#2D5A27]/30 dark:border-slate-700 font-semibold text-sm transition-all shadow-xs hover:border-[#2D5A27] flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400" />
                  <span>{t.navMarket}</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai-assistant')}
                  className="px-4 py-3.5 rounded-xl bg-[#E6B325]/20 dark:bg-amber-950/40 hover:bg-[#E6B325]/30 dark:hover:bg-amber-900/50 text-[#2D5A27] dark:text-amber-300 border border-[#E6B325]/50 dark:border-amber-700/50 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#2D5A27] dark:text-amber-300" />
                  <span>{t.voiceAdvisor}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400" />
                  <span>{t.trustFairTrade}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400" />
                  <span>{t.trustGIOrigin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400" />
                  <span>{t.trustPostalRelay}</span>
                </div>
              </div>
            </div>

            {/* Right Visual Console / Rural Ecosystem Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white dark:bg-[#1E293B] p-6 space-y-5">
                  {/* Top Bar with Live Indicator */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#2D5A27] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        🌾
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{t.ecosystemHub}</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.liveNodalNetwork}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#2D5A27] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full">
                      {t.activeNode}
                    </span>
                  </div>

                  {/* 3 Pillars Quick Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.pillar3Title}</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white">{t.instantEscrow}</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{t.zeroCommission}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.navLogistics}</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white">{t.doorstepPickup}</div>
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{t.indiaPostRelayTitle}</div>
                    </div>
                  </div>

                  {/* Live Transaction / Scheme Badge */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50/60 dark:from-emerald-950/40 dark:to-amber-950/30 border border-emerald-100 dark:border-emerald-800/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#2D5A27] dark:text-emerald-300 flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5" />
                        {t.govtSubsidyPreApproved}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                        PMEGP 35%
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      ₹10,00,000 sanctioned for Rural Handloom Cluster with zero collateral requirement.
                    </div>
                  </div>

                  {/* Status List */}
                  <div className="space-y-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {t.verifiedGICert}
                      </span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">#GI-IN-2026</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {t.multiLangGuide}
                      </span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">4 Languages Active</span>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Card 1 */}
                <div className="absolute -top-4 -left-6 bg-white dark:bg-[#1E293B] p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold">
                    ₹
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">{t.directEarnings}</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white">₹4,82,00,000+</div>
                  </div>
                </div>

                {/* Floating Metric Card 2 */}
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-[#1E293B] p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6B325] text-[#2C2C2C] flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">{t.onTimeDelivery}</div>
                    <div className="text-base font-bold text-emerald-800 dark:text-emerald-400">99.2% Success</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Automatic Live Government Business Schemes & Loans Quick Bar */}
          <div className="mt-10 p-5 rounded-3xl bg-white/95 dark:bg-[#1E293B]/95 border-2 border-[#E6B325]/50 dark:border-[#E6B325]/30 shadow-lg backdrop-blur-md transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-xs sm:text-sm text-[#2D5A27] dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-[#C69516] dark:text-amber-400" />
                  <span>{t.schemesBannerTitle}</span>
                </span>
                <span className="text-[10px] font-bold bg-[#E6B325]/20 dark:bg-amber-950/40 text-[#2D5A27] dark:text-amber-300 px-2 py-0.5 rounded-full border border-[#E6B325]/40 dark:border-amber-700/40 hidden md:inline-block">
                  {t.schemesPreLoadedBadge}
                </span>
              </div>
              <a
                href="#govt-schemes"
                className="text-xs font-bold text-[#2D5A27] dark:text-emerald-400 hover:text-[#1E3D1A] dark:hover:text-emerald-300 flex items-center gap-1 hover:underline"
              >
                <span>{t.exploreAllSchemes}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <a href="#govt-schemes" className="p-3 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 hover:bg-emerald-50/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-300 transition-all text-left block group">
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">PM Vishwakarma</span>
                <span className="text-sm font-bold text-[#2D5A27] dark:text-emerald-300 block">₹3,00,000</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">5% Fixed · ₹15k Kit</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5 group-hover:underline">
                  <span>{t.applyNow}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </a>

              <a href="#govt-schemes" className="p-3 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 hover:bg-emerald-50/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-300 transition-all text-left block group">
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">PMMY MUDRA</span>
                <span className="text-sm font-bold text-[#2D5A27] dark:text-emerald-300 block">₹20,00,000</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">Zero Collateral</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5 group-hover:underline">
                  <span>{t.applyNow}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </a>

              <a href="#govt-schemes" className="p-3 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 hover:bg-emerald-50/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-300 transition-all text-left block group">
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">PMEGP Subsidy</span>
                <span className="text-sm font-bold text-[#2D5A27] dark:text-emerald-300 block">₹50,00,000</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">35% Govt Grant</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5 group-hover:underline">
                  <span>{t.applyNow}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </a>

              <a href="#govt-schemes" className="p-3 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 hover:bg-emerald-50/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-300 transition-all text-left block group">
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">Stand-Up India</span>
                <span className="text-sm font-bold text-[#2D5A27] dark:text-emerald-300 block">₹10L - ₹1 Cr</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">Women & SC/ST</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5 group-hover:underline">
                  <span>{t.applyNow}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </a>

              <a href="#govt-schemes" className="p-3 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 hover:bg-emerald-50/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-300 transition-all text-left block group">
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">NABARD Credit</span>
                <span className="text-sm font-bold text-[#2D5A27] dark:text-emerald-300 block">₹2L - ₹10L</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">4% Effective Int.</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5 group-hover:underline">
                  <span>{t.applyNow}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </a>

              <a href="#govt-schemes" className="p-3 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 hover:bg-emerald-50/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-300 transition-all text-left block group">
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">ODOP Grant</span>
                <span className="text-sm font-bold text-[#2D5A27] dark:text-emerald-300 block">₹10,00,000</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">100% Free Grant</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5 group-hover:underline">
                  <span>{t.applyNow}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ================= DEDICATED DEALS & BEST SCHEMES SHOWCASE (Replaces video tutorials completely) ================= */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="bg-gradient-to-br from-[#1E3D1A] via-[#2D5A27] to-[#1B4D20] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#D4A017]/30 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4A017]">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.featuredDealsBadge}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                {t.featuredDealsTitle}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {t.featuredDealsSubtitle}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('deals')}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-center"
            >
              <span>{t.viewAllDealsBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Verified Deal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Deal 1 */}
            <div 
              onClick={() => setActiveTab('deals')}
              className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-3 hover:bg-white/15 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/80 text-white font-bold text-[10px]">
                  20% OFF
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold">GRAMFEST20</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {t.catTextiles}
                </h3>
                <p className="text-white/80 leading-relaxed text-[11px] mt-1">
                  Varanasi pure silk sarees & Jamdani dupattas with verified handloom authenticity.
                </p>
              </div>
              <div className="text-[10px] text-emerald-300 pt-1 flex items-center gap-1 font-semibold">
                <span>{t.dealsBadge}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Deal 2 */}
            <div 
              onClick={() => setActiveTab('deals')}
              className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-3 hover:bg-white/15 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/80 text-slate-950 font-bold text-[10px]">
                  25% OFF
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold">POTTERY25</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {t.catPottery}
                </h3>
                <p className="text-white/80 leading-relaxed text-[11px] mt-1">
                  Unglazed terracotta water matkas & natural clay cookers with shockproof banana packaging.
                </p>
              </div>
              <div className="text-[10px] text-emerald-300 pt-1 flex items-center gap-1 font-semibold">
                <span>{t.dealsBadge}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Deal 3 */}
            <div 
              onClick={() => setActiveTab('deals')}
              className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-3 hover:bg-white/15 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/80 text-white font-bold text-[10px]">
                  10% OFF
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold">VILLAGE10</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {t.catSpices} & {t.catHoneyOils}
                </h3>
                <p className="text-white/80 leading-relaxed text-[11px] mt-1">
                  High-curcumin Wayanad organic turmeric & raw Sundarbans mangrove forest honey.
                </p>
              </div>
              <div className="text-[10px] text-emerald-300 pt-1 flex items-center gap-1 font-semibold">
                <span>{t.dealsBadge}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Deal 4 */}
            <div 
              onClick={() => setActiveTab('deals')}
              className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-3 hover:bg-white/15 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/80 text-white font-bold text-[10px]">
                  15% OFF
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold">SPORTS15</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {t.catSports}
                </h3>
                <p className="text-white/80 leading-relaxed text-[11px] mt-1">
                  Kashmir Willow tournament cricket bats carved by generational village woodcrafters.
                </p>
              </div>
              <div className="text-[10px] text-emerald-300 pt-1 flex items-center gap-1 font-semibold">
                <span>{t.dealsBadge}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
              <span>
                {t.fairTradeShareNotice} · <strong>{t.directEscrowNotice}</strong>
              </span>
            </div>
            <button
              onClick={() => setActiveTab('deals')}
              className="text-[#D4A017] hover:underline font-bold whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>{t.viewAllDealsBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= GOVERNMENT BUSINESS SCHEMES SECTION ================= */}
      <div id="govt-schemes" className="scroll-mt-24">
        <GovernmentSchemesSection currentLang={language} />
      </div>

      {/* Impact Numbers Bar */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#2D5A27]/15 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-center md:border-r border-slate-100 dark:border-slate-800 p-2">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#2D5A27] dark:text-emerald-400">12,400+</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{t.impactRegisteredArtisans}</div>
          </div>
          <div className="text-center md:border-r border-slate-100 dark:border-slate-800 p-2">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#C69516] dark:text-[#FBBF24]">840+</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{t.impactHubs}</div>
          </div>
          <div className="text-center md:border-r border-slate-100 dark:border-slate-800 p-2">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#2D5A27] dark:text-emerald-400">86.4%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{t.impactRevenueShare}</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#C69516] dark:text-[#FBBF24]">45,000+</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{t.impactHappyBuyers}</div>
          </div>
        </div>
      </section>

      {/* Problem Statement vs Gram AI Solution */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#2D5A27] dark:text-emerald-400">
            {t.structuralChallengeBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
            {t.structuralChallengeTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {t.structuralChallengeSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Middleman System */}
          <div className="bg-rose-50/50 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-200/60 dark:border-rose-900/40 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>{t.brokenSystemTitle}</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600">✕</span>
                <span>{t.brokenMiddlemen}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600">✕</span>
                <span>{t.brokenLogistics}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600">✕</span>
                <span>{t.brokenPayments}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600">✕</span>
                <span>{t.brokenLanguage}</span>
              </li>
            </ul>
          </div>

          {/* The Gram AI Solution */}
          <div className="bg-[#2D5A27]/5 dark:bg-emerald-950/25 p-6 rounded-3xl border border-[#2D5A27]/20 dark:border-emerald-800/40 space-y-4">
            <div className="flex items-center gap-2 text-[#2D5A27] dark:text-emerald-300 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-[#2D5A27] dark:bg-emerald-400"></span>
              <span>{t.gramSolutionTitle}</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.solutionFairPayout}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.solutionPostalRelay}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.solutionInstantUpi}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.solutionVoiceCopilot}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Customer & Partner Testimonials */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 sm:p-12 border border-[#2D5A27]/15 dark:border-slate-800 shadow-sm space-y-8 transition-colors">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              {t.testimonialsTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.testimonialsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 space-y-3">
              <div className="flex text-[#E6B325]">★★★★★</div>
              <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "The transparency is what hooked me. I can literally scan a QR code and see Sunita Devi's workshop in Madhubani, and know 86% of my money reached her without a broker cut."
              </p>
              <div className="font-semibold text-slate-900 dark:text-white">
                Arjun Sharma · Bengaluru
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 space-y-3">
              <div className="flex text-[#E6B325]">★★★★★</div>
              <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "GramSetu's integration with the rural post office network solves a major hurdle in rural development: last-mile transport. Our district crafts now reach Mumbai in 3 days."
              </p>
              <div className="font-semibold text-slate-900 dark:text-white">
                Pooja Venkatesh · Rural Dev Coordinator
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F5F0] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 space-y-3">
              <div className="flex text-[#E6B325]">★★★★★</div>
              <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "GramSetu answers in simple Hindi and regional languages. When we needed help registering for the PM Vishwakarma toolkit grant, it explained every document step by step."
              </p>
              <div className="font-semibold text-slate-900 dark:text-white">
                Shankar Lal · Carpenter & Woodworker
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="bg-[#2D5A27] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E6B325]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white max-w-2xl mx-auto leading-tight">
            {t.ctaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            {t.ctaSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('marketplace')}
              className="px-6 py-3.5 rounded-xl bg-[#E6B325] hover:bg-[#C69516] text-[#2C2C2C] font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{t.ctaShopBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>{t.ctaEnterpriseBtn}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
