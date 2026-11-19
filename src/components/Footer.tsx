import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#1E3D1A] text-white pt-14 pb-8 border-t-4 border-[#E6B325]">
      <div className="container mx-auto px-4">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-white/10 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-[#E6B325] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">{t.footerFairTradeTitle}</h4>
              <p className="text-white/70">{t.footerFairTradeDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-[#E6B325] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">{t.footerEscrowTitle}</h4>
              <p className="text-white/70">{t.footerEscrowDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-[#E6B325] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">{t.footerLogisticsTitle}</h4>
              <p className="text-white/70">{t.footerLogisticsDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-[#E6B325] shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">{t.footerHeritageTitle}</h4>
              <p className="text-white/70">{t.footerHeritageDesc}</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-10 text-sm">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E6B325] text-[#1E3D1A] flex items-center justify-center font-bold">
                F
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-wide">{t.appName}</span>
            </div>
            <p className="text-white/70 text-xs leading-relaxed max-w-sm">
              {t.footerMission}
            </p>
            <div className="pt-2 text-xs text-white/60 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>{t.footerNodalClusters}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>{t.footerTollFree}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>{t.footerEmail}</span>
              </div>
            </div>
          </div>

          {/* Platform Columns */}
          <div>
            <h5 className="font-semibold text-xs uppercase tracking-wider mb-3 text-[#E6B325]">
              {t.navMarketplace}
            </h5>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <button onClick={() => setActiveTab('projects')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navProjects}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('market')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navMarket}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  {t.catTextiles}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  {t.catPottery}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  {t.catSpices}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-xs uppercase tracking-wider mb-3 text-[#E6B325]">
              {t.navDeals}
            </h5>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <button onClick={() => setActiveTab('deals')} className="text-[#E6B325] font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                  <span>{t.dealsTitle}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  {t.artisanDashboard}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-assistant')} className="hover:text-white transition-colors cursor-pointer">
                  {t.voiceAdvisor}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('logistics')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navLogistics}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('schemes')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navSchemes}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-xs uppercase tracking-wider mb-3 text-[#E6B325]">
              {t.navSupport}
            </h5>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <button onClick={() => setActiveTab('support')} className="hover:text-white transition-colors cursor-pointer">
                  {t.supportTitle}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('customer')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navCustomerPortal}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('village-connect')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navVillageConnect}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors cursor-pointer">
                  {t.navAdmin}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>{t.footerCopyright} · Lead Architect: Vedant Mishra.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">{t.footerLegal}</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">{t.authenticityGuaranteed}</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">{t.trustPostalRelay}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
