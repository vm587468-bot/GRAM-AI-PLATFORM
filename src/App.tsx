import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { UpiCheckoutModal } from './components/UpiCheckoutModal';
import { AppVoiceWidget } from './components/AppVoiceWidget';

import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { EntrepreneurDashboard } from './pages/EntrepreneurDashboard';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { LogisticsTrackingPage } from './pages/LogisticsTrackingPage';
import { DealsAndSchemesPage } from './pages/DealsAndSchemesPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SupportPage } from './pages/SupportPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { VillageConnectPage } from './pages/VillageConnectPage';
import { GovernmentSchemesSection } from './components/GovernmentSchemesSection';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingId, setActiveTrackingId] = useState<string>('GRAM-88219');
  const [marketplaceSearch, setMarketplaceSearch] = useState<string>('');
  const { language } = useLanguage();

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (_orderId: string, trackingId: string) => {
    setActiveTrackingId(trackingId);
    setActiveTab('logistics');
  };

  const handleTrackSpecificOrder = (trackingId: string) => {
    setActiveTrackingId(trackingId);
    setActiveTab('logistics');
  };

  const handleVoiceFilterMarketplace = (search: string) => {
    setMarketplaceSearch(search);
    setActiveTab('marketplace');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'schemes' && (
          <div className="py-6 sm:py-10 bg-[#F8FAF7] dark:bg-[#0F172A]">
            <GovernmentSchemesSection currentLang={language} />
          </div>
        )}

        {activeTab === 'marketplace' && (
          <MarketplacePage
            onOpenCheckout={handleOpenCheckout}
            currentLang={language}
            externalSearch={marketplaceSearch}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <EntrepreneurDashboard
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'customer' && (
          <CustomerDashboard
            setActiveTab={setActiveTab}
            onTrackOrder={handleTrackSpecificOrder}
          />
        )}

        {activeTab === 'village-connect' && (
          <VillageConnectPage
            currentLang={language}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanelPage
            currentLang={language}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'logistics' && (
          <LogisticsTrackingPage
            initialTrackingId={activeTrackingId}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'deals' && (
          <DealsAndSchemesPage
            setActiveTab={setActiveTab}
            onOpenCheckout={handleOpenCheckout}
          />
        )}

        {activeTab === 'ai-assistant' && (
          <AIAssistantPage />
        )}

        {activeTab === 'support' && (
          <SupportPage />
        )}
      </main>

      {/* Floating Global AI Voice Assistant */}
      <AppVoiceWidget
        currentTab={activeTab}
        setActiveTab={setActiveTab}
        onTrackOrder={handleTrackSpecificOrder}
        onFilterMarketplace={handleVoiceFilterMarketplace}
      />

      {/* Universal Cart Slide-out Drawer */}
      <CartDrawer
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Instant UPI Escrow Checkout Modal */}
      <UpiCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
