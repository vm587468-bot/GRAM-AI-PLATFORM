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

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
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
              <h4 className="font-semibold text-white text-sm mb-1">Direct Fair Trade Guarantee</h4>
              <p className="text-white/70">86%+ of customer payments flow straight to the village artisan self-help group.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-[#E6B325] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Instant NPCI UPI Escrow</h4>
              <p className="text-white/70">Secure digital payments with automatic dispatch release and zero merchant deductions.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-[#E6B325] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Rural Nodal Logistics</h4>
              <p className="text-white/70">Partnered with India Post rural branch offices and Gram Express electric fleet.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-[#E6B325] shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Generational Heritage</h4>
              <p className="text-white/70">Authentic GI-certified crafts, organic farm produce, and zero plastic packaging.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-10 text-sm">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E6B325] text-[#1E3D1A] flex items-center justify-center font-bold">
                G
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-wide">Gram AI</span>
            </div>
            <p className="text-white/70 text-xs leading-relaxed max-w-sm">
              Empowering India's 650,000 villages with integrated digital commerce, micro-logistics relay, AI-driven market intelligence, and multilingual learning tools.
            </p>
            <div className="pt-2 text-xs text-white/60 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>Nodal Clusters: Madhubani · Molela · Wayanad · Sundarbans · Barpeta</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>Toll-Free Kisan & Artisan Mitra: 1800-419-GRAM</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>helpdesk@gramai.org · WhatsApp: +91 94310 44521</span>
              </div>
            </div>
          </div>

          {/* Platform Columns */}
          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3 text-[#E6B325]">
              Marketplace
            </h5>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors">
                  Handcrafted Textiles & Silks
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors">
                  Terracotta & Earthen Pottery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors">
                  Organic Wayanad Spices
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors">
                  Wild Mangrove Honey & Oils
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-white transition-colors">
                  Bamboo & Wooden Toys
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3 text-[#E6B325]">
              Artisan Tools & CS Core
            </h5>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <button onClick={() => setActiveTab('engineering')} className="text-[#E6B325] font-semibold hover:underline flex items-center gap-1">
                  <span>CS Core (AOA/DBMS/MATHS/OOP)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
                  Sales & Revenue Analytics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-assistant')} className="hover:text-white transition-colors">
                  Gram Sahayak AI Advisor
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('logistics')} className="hover:text-white transition-colors">
                  Hub Consignment Tracking
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learning')} className="hover:text-white transition-colors">
                  PM Vishwakarma & Mudra Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learning')} className="hover:text-white transition-colors">
                  Eco-Packaging Video Lessons
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3 text-[#E6B325]">
              Governance & Trust
            </h5>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <button onClick={() => setActiveTab('support')} className="hover:text-white transition-colors">
                  Village Coordinator Kiosks
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('customer')} className="hover:text-white transition-colors">
                  Direct Verified Reviews
                </button>
              </li>
              <li>
                <a href="#schemes" onClick={(e) => { e.preventDefault(); setActiveTab('learning'); }} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>NABARD & SHG Linkage</span>
                  <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </li>
              <li>
                <a href="#gi" onClick={(e) => { e.preventDefault(); setActiveTab('learning'); }} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Geographical Indication (GI)</span>
                  <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© 2026 Gram AI Foundation · Lead Architect: Vedant Mishra · Grounded in AOA, DBMS, MATHS & OOP.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy & Data Sovereignty</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Artisan Charter</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Open ONDC Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
