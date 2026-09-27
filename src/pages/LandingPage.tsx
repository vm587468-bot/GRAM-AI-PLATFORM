import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  GraduationCap, 
  BarChart3, 
  CreditCard, 
  MapPin, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  ChevronRight
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  currentLang: SupportedLanguage;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab, currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 bg-radial from-[#E6B325]/10 via-[#F8F5F0] to-[#F8F5F0] border-b border-[#2D5A27]/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2D5A27]/10 border border-[#2D5A27]/20 text-xs font-semibold text-[#2D5A27]">
                <Sparkles className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>Next-Gen Operating System for India's 650,000 Villages</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D5A27] tracking-tight leading-[1.15]">
                Direct Rural Commerce. <br />
                <span className="text-[#C69516] italic font-normal">Dignified Prosperity.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#2C2C2C]/80 leading-relaxed font-normal">
                Gram AI bridges rural artisans, self-help groups, and natural farmers directly with urban conscious buyers — combining fair-trade sales, rural micro-logistics, instant UPI escrow, and Gemini-powered business intelligence.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="px-6 py-3.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group cursor-pointer"
                >
                  <span>{t.exploreMarketplace}</span>
                  <ArrowRight className="w-4 h-4 text-[#E6B325] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#2D5A27] border border-[#2D5A27]/30 font-semibold text-sm transition-all shadow-xs hover:border-[#2D5A27] flex items-center gap-2 cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4 text-[#2D5A27]" />
                  <span>Artisan Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai-assistant')}
                  className="px-4 py-3.5 rounded-xl bg-[#E6B325]/20 hover:bg-[#E6B325]/30 text-[#2D5A27] border border-[#E6B325]/50 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#2D5A27]" />
                  <span>Try Gram Sahayak AI</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />
                  <span>86%+ Proceeds to Artisans</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />
                  <span>Verified GI & Organic Origin</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />
                  <span>India Post Rural Nodal Relay</span>
                </div>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Main Artisan Photo */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                    alt="Sunita Devi, Rural Weaver"
                    className="w-full h-80 object-cover object-top"
                  />
                  <div className="p-4 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#2D5A27]">Sunita Devi & Mithila SHG</span>
                      <span className="text-[11px] font-semibold bg-[#2D5A27]/10 text-[#2D5A27] px-2 py-0.5 rounded-md">
                        Madhubani, Bihar
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      28 Women Artisans · 480+ Monthly Pan-India Orders · Direct UPI Settlement
                    </p>
                  </div>
                </div>

                {/* Floating Metric Card 1 */}
                <div className="absolute -top-4 -left-6 bg-white p-3.5 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="w-10 h-10 rounded-lg bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold">
                    ₹
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Direct Earnings</div>
                    <div className="text-base font-bold text-slate-900">₹4,82,00,000+</div>
                  </div>
                </div>

                {/* Floating Metric Card 2 */}
                <div className="absolute -bottom-4 -right-4 bg-white p-3.5 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E6B325] text-[#2C2C2C] flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">On-Time Delivery</div>
                    <div className="text-base font-bold text-emerald-800">99.2% Success</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Impact Numbers Bar */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded-2xl border border-[#2D5A27]/15 shadow-sm">
          <div className="text-center md:border-r border-slate-100 p-2">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#2D5A27]">12,400+</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Registered Village Artisans</div>
          </div>
          <div className="text-center md:border-r border-slate-100 p-2">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#C69516]">840+</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Village Aggregation Hubs</div>
          </div>
          <div className="text-center md:border-r border-slate-100 p-2">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#2D5A27]">86.4%</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Average Producer Revenue Share</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#C69516]">45,000+</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Happy Conscious Consumers</div>
          </div>
        </div>
      </section>

      {/* Problem Statement vs Gram AI Solution */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#2D5A27]">
            The Structural Challenge
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Why Rural Producers Were Cut Off from Fair Wealth
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            India's creative and organic economy generates billions, but deep structural disconnects prevent village creators from prospering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Middleman System */}
          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200/60 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>The Broken Traditional System</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600">✕</span>
                <span><strong>Heavy Middleman Exploitation:</strong> Brokers capture 50% to 70% of product retail margins, paying artisans bare subsistence wages.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600">✕</span>
                <span><strong>No Last-Mile Rural Logistics:</strong> Major private courier services do not pick up from remote villages, creating shipping dead-zones.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600">✕</span>
                <span><strong>Delayed Cash Remittances:</strong> Village producers wait 45 to 90 days for payment, forcing reliance on predatory local money lenders.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-600">✕</span>
                <span><strong>Language & Paperwork Barriers:</strong> Complicated English-only e-commerce apps lock out millions of talented vernacular creators.</span>
              </li>
            </ul>
          </div>

          {/* The Gram AI Solution */}
          <div className="bg-[#2D5A27]/5 p-6 rounded-2xl border border-[#2D5A27]/20 space-y-4">
            <div className="flex items-center gap-2 text-[#2D5A27] font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-[#2D5A27]"></span>
              <span>The Gram AI Ecosystem Solution</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                <span><strong>86%+ Direct Fair Payout:</strong> Direct consumer-to-artisan escrow removes layers of middlemen with guaranteed live price transparency.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                <span><strong>Postal Hub Nodal Relay:</strong> We aggregate parcels at village Panchayat nodes and bridge with India Post & Gram Express EVs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                <span><strong>Instant UPI Settlement:</strong> Escrow automatically releases funds to the artisan SHG bank account within 24h of hub pickup.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                <span><strong>Voice & Regional AI Copilot:</strong> Artisans speak in Hindi, Marathi, Tamil, or Telugu to generate product catalogs and calculate fair prices.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars of Gram AI */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#2D5A27]">
            Integrated Technology Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            A Complete Operating System for Rural Prosperity
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Engineered specifically for the needs, literacy, and connectivity conditions of rural enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Direct Marketplace */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#2D5A27]/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#2D5A27]/10 text-[#2D5A27] flex items-center justify-center group-hover:bg-[#2D5A27] group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Direct Producer Marketplace</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Showcase authentic GI-certified handicrafts, pure organic spices, and cold-pressed oils. Every product features transparent provenance and artisan collective bios.
            </p>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="text-xs font-semibold text-[#2D5A27] flex items-center gap-1 group-hover:underline pt-1"
            >
              <span>Explore catalogue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Rural Micro-Logistics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#2D5A27]/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#E6B325]/20 text-[#C69516] flex items-center justify-center group-hover:bg-[#E6B325] group-hover:text-slate-900 transition-colors">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Gram Express Nodal Logistics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consolidated pickup from village self-help groups. Partnered with 150,000+ rural post offices for reliable, low-cost pan-India door-to-door delivery.
            </p>
            <button
              onClick={() => setActiveTab('logistics')}
              className="text-xs font-semibold text-[#2D5A27] flex items-center gap-1 group-hover:underline pt-1"
            >
              <span>Track consignment</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Instant UPI Escrow */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#2D5A27]/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#2D5A27]/10 text-[#2D5A27] flex items-center justify-center group-hover:bg-[#2D5A27] group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Instant NPCI UPI Escrow</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customers pay safely with GPay, PhonePe, or Paytm. Funds are held securely and released instantly into the artisan's bank account with zero platform fee.
            </p>
            <div className="text-xs font-semibold text-emerald-800 pt-1">
              Zero MDR Fee for SHGs
            </div>
          </div>

          {/* Card 4: AI Business Assistant */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#2D5A27]/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#E6B325]/20 text-[#C69516] flex items-center justify-center group-hover:bg-[#E6B325] group-hover:text-slate-900 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Gram Sahayak AI Assistant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by Google Gemini 3.8 Flash. Assists village entrepreneurs with voice input, calculating fair profit prices, festive sales forecasting, and government subsidies.
            </p>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="text-xs font-semibold text-[#2D5A27] flex items-center gap-1 group-hover:underline pt-1"
            >
              <span>Ask business advice</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 5: Multilingual Learning */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#2D5A27]/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#2D5A27]/10 text-[#2D5A27] flex items-center justify-center group-hover:bg-[#2D5A27] group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Gram Vidyapeeth Learning Hub</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Audio-first and visual modules in local languages: zero-waste shock packaging, quality testing, FSSAI compliance, and PM Vishwakarma ₹3 Lakh loan guidelines.
            </p>
            <button
              onClick={() => setActiveTab('learning')}
              className="text-xs font-semibold text-[#2D5A27] flex items-center gap-1 group-hover:underline pt-1"
            >
              <span>Start learning</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6: Real-time Analytics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#2D5A27]/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#E6B325]/20 text-[#C69516] flex items-center justify-center group-hover:bg-[#E6B325] group-hover:text-slate-900 transition-colors">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Visual Sales Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simple, high-contrast dashboards showing daily orders, gross revenue, repeating buyers, and automated monthly tax-ready PDF settlement statements.
            </p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-xs font-semibold text-[#2D5A27] flex items-center gap-1 group-hover:underline pt-1"
            >
              <span>Open dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Success Stories from the Ground */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#2D5A27]">
            Grassroots Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Real Stories of Village Entrepreneurs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Meet the artisans and farmers whose livelihoods have transformed through direct digital commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Story 1 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
                alt="Madhubani silk art"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#2D5A27] text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                Handloom Textiles
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Sunita Devi · Mithila SHG, Bihar</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed italic">
                  "Before Gram AI, local traders bought our silk dupattas for ₹600 and sold them in Delhi for ₹3,000. Now our women earn ₹1,850 per piece directly. We opened bank accounts for 28 village daughters."
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Revenue Growth: <strong className="text-emerald-700 font-bold">+280%</strong></span>
                <span>Active 18 Months</span>
              </div>
            </div>
          </div>

          {/* Story 2 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80"
                alt="Terracotta earthenware"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#C69516] text-slate-900 text-[11px] font-semibold px-2 py-0.5 rounded">
                Terracotta Pottery
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Rameshwar Rathore · Molela, Rajasthan</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed italic">
                  "Everyone told us earthen pots break in courier shipping. Gram Vidyapeeth taught us to pack using dried banana fibre cushions. Out of 420 pots shipped last festival, only 1 had a crack!"
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Breakage Rate: <strong className="text-emerald-700 font-bold">0.2%</strong></span>
                <span>4th Gen Potter</span>
              </div>
            </div>
          </div>

          {/* Story 3 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
                alt="Organic turmeric harvest"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#2D5A27] text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                Organic Farming
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Vasantha Rao · Wayanad, Kerala</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed italic">
                  "Our high-curcumin turmeric used to get mixed with chemical spices in wholesale mandis. With Gram AI, urban fitness & ayurveda consumers pay for verified purity straight from our plantation."
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Direct Farmer Cut: <strong className="text-emerald-700 font-bold">84%</strong></span>
                <span>40 Farmer Co-op</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Customer & Partner Testimonials */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#2D5A27]/15 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Trusted by Urban Patrons & Rural Institutions
            </h3>
            <p className="text-xs text-slate-500">
              Hear what conscious buyers and cooperative leaders say about Gram AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-[#F8F5F0] border border-slate-200/60 space-y-3">
              <div className="flex text-[#E6B325]">★★★★★</div>
              <p className="text-slate-700 italic leading-relaxed">
                "The transparency is what hooked me. I can literally scan a QR code and see Sunita Devi's workshop in Madhubani, and know 86% of my money reached her without a broker cut."
              </p>
              <div className="font-semibold text-slate-900">
                Arjun Sharma · Bengaluru
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F5F0] border border-slate-200/60 space-y-3">
              <div className="flex text-[#E6B325]">★★★★★</div>
              <p className="text-slate-700 italic leading-relaxed">
                "Gram AI’s integration with the rural post office network solves the biggest headache in rural development: last-mile transport. Our district crafts now reach Mumbai in 3 days."
              </p>
              <div className="font-semibold text-slate-900">
                Pooja Venkatesh · Rural Dev Coordinator
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F5F0] border border-slate-200/60 space-y-3">
              <div className="flex text-[#E6B325]">★★★★★</div>
              <p className="text-slate-700 italic leading-relaxed">
                "The Gram Sahayak AI answers in simple Hindi. When we didn't know how to register for the PM Vishwakarma toolkit grant, it explained every document step by step!"
              </p>
              <div className="font-semibold text-slate-900">
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
            Be Part of India's Direct Rural Commerce Revolution
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Whether you want to source authentic, chemical-free rural treasures or take your village enterprise pan-India, Gram AI is built for you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('marketplace')}
              className="px-6 py-3 rounded-xl bg-[#E6B325] hover:bg-[#C69516] text-[#2C2C2C] font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Shop Artisan Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Join as Rural Enterprise</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
