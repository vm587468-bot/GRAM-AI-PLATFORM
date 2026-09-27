import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
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
import { LearningHubPage } from './pages/LearningHubPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SupportPage } from './pages/SupportPage';

import { SupportedLanguage } from './i18n';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingId, setActiveTrackingId] = useState<string>('GRAM-88219');
  const [marketplaceSearch, setMarketplaceSearch] = useState<string>('');

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (orderId: string, trackingId: string) => {
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
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] text-[#2C2C2C]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplacePage
            onOpenCheckout={handleOpenCheckout}
            currentLang={currentLang}
            externalSearch={marketplaceSearch}
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

        {activeTab === 'logistics' && (
          <LogisticsTrackingPage
            initialTrackingId={activeTrackingId}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'learning' && (
          <LearningHubPage />
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
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
