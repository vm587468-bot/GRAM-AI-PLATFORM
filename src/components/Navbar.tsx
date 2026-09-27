import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  GraduationCap, 
  BarChart3, 
  Globe, 
  UserCheck, 
  Menu, 
  X, 
  ChevronDown,
  PhoneCall,
  Package,
  Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { SupportedLanguage, TRANSLATIONS } from '../i18n';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLang: SupportedLanguage;
  setCurrentLang: (lang: SupportedLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentLang,
  setCurrentLang
}) => {
  const { currentUser, role, switchRole } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = TRANSLATIONS[currentLang];

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' }
  ];

  const navLinks = [
    { id: 'marketplace', label: t.navMarketplace, icon: Store },
    { id: 'dashboard', label: t.navDashboard, icon: BarChart3, roleOnly: 'entrepreneur' },
    { id: 'customer', label: t.navCustomerPortal, icon: Package },
    { id: 'logistics', label: t.navLogistics, icon: Truck },
    { id: 'learning', label: t.navLearning, icon: GraduationCap },
    { id: 'ai-assistant', label: t.navAIAssistant, icon: Sparkles, highlight: true },
    { id: 'support', label: t.navSupport, icon: PhoneCall }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#2D5A27]/10">
      {/* Top Banner Notice */}
      <div className="bg-[#2D5A27] text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E6B325] animate-pulse"></span>
            <span>Direct Village Sourcing · 86%+ Proceeds to Rural Artisans · Zero Middlemen</span>
          </span>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-white/80">
            <span>Toll-Free Helpline: 1800-419-GRAM</span>
            <span>·</span>
            <span>India Post & Gram Express Rural Nodal Relay</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" stroke="none">
              <path d="M12 2L4 9v12h16V9l-8-7zm0 3.2L18 10v9H6v-9l6-4.8z" opacity="0.3"/>
              <path d="M12 7c-2.2 0-4 1.8-4 4 0 2.8 4 6.5 4 6.5s4-3.7 4-6.5c0-2.2-1.8-4-4-4zm0 5.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#2D5A27] font-serif">Gram AI</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-[#E6B325]/20 text-[#2D5A27] border border-[#E6B325]/40">
                Rural OS
              </span>
            </div>
            <p className="text-[11px] text-[#2C2C2C]/70 -mt-0.5 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive 
                    ? 'bg-[#2D5A27] text-white shadow-sm'
                    : item.highlight
                    ? 'text-[#2D5A27] bg-[#E6B325]/15 hover:bg-[#E6B325]/25 border border-[#E6B325]/30'
                    : 'text-[#2C2C2C] hover:text-[#2D5A27] hover:bg-[#2D5A27]/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E6B325]' : item.highlight ? 'text-[#2D5A27]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Language, Role Toggle, Cart */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#2C2C2C] bg-white border border-[#2D5A27]/15 rounded-lg hover:border-[#2D5A27]/40 shadow-xs"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#2D5A27]" />
              <span className="uppercase font-semibold">{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div 
                className="absolute right-0 mt-1 w-36 bg-white border border-[#2D5A27]/10 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#F8F5F0] transition-colors ${
                      currentLang === lang.code ? 'font-semibold text-[#2D5A27] bg-[#2D5A27]/5' : 'text-[#2C2C2C]'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium bg-white border border-[#2D5A27]/20 rounded-lg hover:border-[#2D5A27] shadow-xs text-[#2C2C2C]"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-5 h-5 rounded-full object-cover border border-[#2D5A27]"
              />
              <span className="hidden sm:inline-block max-w-[100px] truncate font-medium">
                {currentUser.name}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                role === 'entrepreneur' ? 'bg-[#2D5A27] text-white' :
                role === 'customer' ? 'bg-[#E6B325] text-[#2C2C2C]' :
                'bg-slate-700 text-white'
              }`}>
                {role === 'entrepreneur' ? 'Artisan' : role === 'customer' ? 'Buyer' : 'Admin'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-1 w-64 bg-white border border-[#2D5A27]/15 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-2 py-1.5 border-b border-slate-100 text-xs text-slate-500 font-medium">
                  Switch Active Role Demo:
                </div>
                <button
                  onClick={() => {
                    switchRole('entrepreneur');
                    setActiveTab('dashboard');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 hover:bg-[#F8F5F0] transition-colors mt-1 ${
                    role === 'entrepreneur' ? 'bg-[#2D5A27]/10 font-semibold text-[#2D5A27]' : 'text-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#2D5A27] text-white flex items-center justify-center text-xs">
                    SD
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Sunita Devi (Weaver)</div>
                    <div className="text-[10px] text-slate-500">Mithila Shakti SHG · Entrepreneur</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    switchRole('customer');
                    setActiveTab('customer');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 hover:bg-[#F8F5F0] transition-colors ${
                    role === 'customer' ? 'bg-[#2D5A27]/10 font-semibold text-[#2D5A27]' : 'text-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#E6B325] text-[#2C2C2C] flex items-center justify-center text-xs font-bold">
                    AS
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Arjun Sharma (Buyer)</div>
                    <div className="text-[10px] text-slate-500">Bengaluru · Customer Portal</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    switchRole('admin');
                    setActiveTab('dashboard');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 hover:bg-[#F8F5F0] transition-colors ${
                    role === 'admin' ? 'bg-[#2D5A27]/10 font-semibold text-[#2D5A27]' : 'text-slate-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">
                    PV
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Pooja Venkatesh (Admin)</div>
                    <div className="text-[10px] text-slate-500">Gram Hub Nodal Coordinator</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#2D5A27] bg-white border border-[#2D5A27]/20 rounded-lg hover:bg-[#2D5A27]/5 hover:border-[#2D5A27] transition-colors shadow-xs"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E6B325] text-[#2C2C2C] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#2C2C2C] hover:text-[#2D5A27] rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#2D5A27]/10 bg-[#F8F5F0] px-4 py-3 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'bg-[#2D5A27] text-white'
                    : 'text-[#2C2C2C] hover:bg-[#2D5A27]/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E6B325]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
