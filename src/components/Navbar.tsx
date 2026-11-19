import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Truck,
  BarChart3,
  Globe,
  UserCheck,
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  Store,
  Landmark,
  Moon,
  Sun,
  Handshake,
  ShieldCheck,
  User,
  FolderKanban,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../i18n';
import { GlobalSearchBar } from './GlobalSearchBar';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLang?: SupportedLanguage;
  setCurrentLang?: (lang: SupportedLanguage) => void;
  onOpenAuth?: () => void;
  onSelectProject?: (projectId: string) => void;
  onSelectProduct?: (productId: string) => void;
  onSelectScheme?: (schemeName: string) => void;
  onSelectMarket?: (commodityName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth = () => {},
  onSelectProject = () => {},
  onSelectProduct = () => {},
  onSelectScheme = () => {},
  onSelectMarket = () => {}
}) => {
  const { currentUser, role, switchRole } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' }
  ];

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  const navLinks = [
    { id: 'projects', label: t.navProjects, icon: FolderKanban },
    { id: 'schemes', label: t.navSchemes, icon: Landmark },
    { id: 'market', label: t.navMarket, icon: TrendingUp },
    { id: 'marketplace', label: t.navMarketplace, icon: Store },
    { id: 'deals', label: t.navDeals, icon: Sparkles, highlight: true },
    { id: 'dashboard', label: t.navDashboard, icon: BarChart3 },
    { id: 'customer', label: t.navCustomerPortal, icon: ShoppingBag },
    { id: 'village-connect', label: t.navVillageConnect, icon: Handshake },
    { id: 'logistics', label: t.navLogistics, icon: Truck },
    { id: 'admin', label: t.navAdmin, icon: ShieldCheck },
    { id: 'support', label: t.navSupport, icon: PhoneCall }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Top Banner Notice */}
      <div className="bg-[#2E7D32] dark:bg-[#1B5E20] text-white text-xs py-1.5 px-4 font-medium">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#D4A017] dark:bg-[#FBBF24] shrink-0" />
            <span className="truncate">
              <strong>GramSetu</strong> · Projects, Govt Schemes, Mandi Prices &amp; Direct Marketplace
            </span>
          </span>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-white/85 shrink-0">
            <span>Toll-Free: 1800-419-GRAM</span>
            <span>·</span>
            <span>Pan-India Post Relay &amp; UPI Escrow</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#2E7D32] dark:bg-[#22C55E] text-[#D4A017] dark:text-slate-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform font-bold">
            G
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#2E7D32] dark:text-[#22C55E] font-serif whitespace-nowrap">
                {t.appName}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md bg-[#D4A017]/20 text-[#2E7D32] dark:text-[#FBBF24] border border-[#D4A017]/30 whitespace-nowrap">
                Hub
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block max-w-[230px] truncate">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Desktop Nav Links (Scrollable strip on smaller laptops, full row on xl) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto scrollbar-none">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#2E7D32] text-white shadow-xs dark:bg-[#22C55E] dark:text-slate-950'
                    : item.highlight
                    ? 'text-[#2E7D32] dark:text-[#22C55E] bg-[#2E7D32]/10 dark:bg-[#22C55E]/10 hover:bg-[#2E7D32]/20'
                    : 'text-slate-700 dark:text-slate-300 hover:text-[#2E7D32] dark:hover:text-[#22C55E] hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#D4A017] dark:text-slate-950' : 'opacity-70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Theme, Language, Role, Cart, Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dark / Bright Mode Segmented Switch */}
          <div
            className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs"
            role="group"
            aria-label="Theme Mode"
          >
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                theme === 'light'
                  ? 'bg-white text-amber-600 shadow-xs border border-amber-200/70'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title={t.lightMode}
            >
              <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : 'opacity-60'}`} />
              <span className="hidden 2xl:inline">{t.lightMode}</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                theme === 'dark'
                  ? 'bg-[#0F172A] text-emerald-400 shadow-xs border border-emerald-500/50'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title={t.darkMode}
            >
              <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-emerald-400' : 'opacity-60'}`} />
              <span className="hidden 2xl:inline">{t.darkMode}</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-[#2E7D32] dark:hover:border-[#22C55E] shadow-2xs cursor-pointer whitespace-nowrap"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#22C55E]" />
              <span>{languages.find(l => l.code === language)?.native || 'English'}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-fadeIn text-xs">
                <div className="px-3 py-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  {t.selectLanguage}
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                      language === lang.code ? 'font-bold text-[#2E7D32] dark:text-[#22C55E] bg-slate-50/50 dark:bg-slate-800/40' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-slate-400">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-[#2E7D32] cursor-pointer whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#22C55E]" />
              <span className="capitalize">
                {role === 'entrepreneur' ? t.roleEntrepreneur.split('/')[0] : role === 'customer' ? t.roleCustomer.split('/')[0] : t.roleAdmin.split('(')[0]}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {t.switchRole}
                </div>
                <button
                  onClick={() => { switchRole('entrepreneur'); setRoleMenuOpen(false); }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-2 cursor-pointer ${role === 'entrepreneur' ? 'bg-[#2E7D32]/10 font-bold text-[#2E7D32] dark:text-[#22C55E]' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <div>
                    <div>{t.roleEntrepreneur}</div>
                    <span className="text-[10px] text-slate-400 font-normal">Manage inventory &amp; orders</span>
                  </div>
                </button>
                <button
                  onClick={() => { switchRole('customer'); setRoleMenuOpen(false); }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-2 cursor-pointer ${role === 'customer' ? 'bg-[#2E7D32]/10 font-bold text-[#2E7D32] dark:text-[#22C55E]' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <div>
                    <div>{t.roleCustomer}</div>
                    <span className="text-[10px] text-slate-400 font-normal">Shop verified goods</span>
                  </div>
                </button>
                <button
                  onClick={() => { switchRole('admin'); setRoleMenuOpen(false); }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-2 cursor-pointer ${role === 'admin' ? 'bg-[#2E7D32]/10 font-bold text-[#2E7D32] dark:text-[#22C55E]' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <div>
                    <div>{t.roleAdmin}</div>
                    <span className="text-[10px] text-slate-400 font-normal">Platform &amp; data admin</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-[#2E7D32] transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D4A017] dark:bg-[#FBBF24] text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white dark:text-slate-950 text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentUser ? currentUser.name.split(' ')[0] : t.navLogin}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="xl:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Global Universal Search Strip */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0B1120]/70 py-2 px-4">
        <div className="container mx-auto max-w-4xl">
          <GlobalSearchBar
            compact
            onSelectProject={onSelectProject}
            onSelectProduct={onSelectProduct}
            onSelectScheme={onSelectScheme}
            onSelectMarket={onSelectMarket}
          />
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-4 py-3 space-y-1 animate-fadeIn max-h-[75vh] overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer ${
                  isActive
                    ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4A017] dark:text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Mobile Theme Mode Switcher */}
          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 py-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{theme === 'dark' ? t.darkMode : t.lightMode}</span>
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.lightMode}</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#0F172A] text-emerald-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.darkMode}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
