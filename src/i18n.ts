export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te';

export interface Translations {
  appName: string;
  tagline: string;
  navMarketplace: string;
  navDashboard: string;
  navCustomerPortal: string;
  navLogistics: string;
  navLearning: string;
  navAIAssistant: string;
  navSupport: string;
  exploreMarketplace: string;
  villageBusiness: string;
  cart: string;
  checkout: string;
  totalSales: string;
  monthlyRevenue: string;
  orders: string;
  activeCustomers: string;
  addProduct: string;
  fairTradeToArtisan: string;
  trackOrder: string;
  voiceAsk: string;
  roleEntrepreneur: string;
  roleCustomer: string;
  roleAdmin: string;
  switchRole: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'Gram AI',
    tagline: 'Direct Rural Commerce & Intelligence',
    navMarketplace: 'Marketplace',
    navDashboard: 'Artisan Dashboard',
    navCustomerPortal: 'My Orders',
    navLogistics: 'Logistics Relay',
    navLearning: 'Learning Hub',
    navAIAssistant: 'Gram Sahayak AI',
    navSupport: 'Support',
    exploreMarketplace: 'Shop Village Crafts',
    villageBusiness: 'Empower Your Enterprise',
    cart: 'Cart',
    checkout: 'Instant UPI Checkout',
    totalSales: 'Total Sales',
    monthlyRevenue: 'Monthly Revenue',
    orders: 'Total Orders',
    activeCustomers: 'Conscious Patrons',
    addProduct: 'Add New Product',
    fairTradeToArtisan: 'directly to artisan collective',
    trackOrder: 'Track Consignment',
    voiceAsk: 'Speak or Ask Anything',
    roleEntrepreneur: 'Artisan / Entrepreneur',
    roleCustomer: 'Urban Conscious Buyer',
    roleAdmin: 'Hub Coordinator (Admin)',
    switchRole: 'Switch Role'
  },
  hi: {
    appName: 'ग्राम AI',
    tagline: 'ग्रामीण उद्यमिता और सीधा व्यापार मंच',
    navMarketplace: 'बाज़ार (Marketplace)',
    navDashboard: 'कारीगर डैशबोर्ड',
    navCustomerPortal: 'मेरे ऑर्डर्स',
    navLogistics: 'लॉजिस्टिक्स ट्रैकिंग',
    navLearning: 'ज्ञान केंद्र (Learning)',
    navAIAssistant: 'ग्राम सहायक AI',
    navSupport: 'सहायता केंद्र',
    exploreMarketplace: 'गाँव के उत्पाद खरीदें',
    villageBusiness: 'अपना उद्यम बढ़ाएं',
    cart: 'झोली (Cart)',
    checkout: 'सीधा UPI भुगतान',
    totalSales: 'कुल बिक्री',
    monthlyRevenue: 'मासिक आमदनी',
    orders: 'कुल ऑर्डर्स',
    activeCustomers: 'सक्रिय ग्राहक',
    addProduct: 'नया उत्पाद जोड़ें',
    fairTradeToArtisan: 'सीधा कारीगर समूह के खाते में',
    trackOrder: 'पार्सल ट्रैक करें',
    voiceAsk: 'बोलकर पूछें',
    roleEntrepreneur: 'ग्रामीण कारीगर (उद्यमी)',
    roleCustomer: 'खरीदार (ग्राहक)',
    roleAdmin: 'ग्राम समन्वयक (Admin)',
    switchRole: 'भूमिका बदलें'
  },
  mr: {
    appName: 'ग्राम AI',
    tagline: 'ग्रामीण उद्योजकता आणि थेट व्यापार',
    navMarketplace: 'बाजारपेठ',
    navDashboard: 'उद्योजक डॅशबोर्ड',
    navCustomerPortal: 'माझे ऑर्डर्स',
    navLogistics: 'वाहतूक ट्रॅकिंग',
    navLearning: 'मार्गदर्शन केंद्र',
    navAIAssistant: 'ग्राम सहाय्यक AI',
    navSupport: 'मदत व संपर्क',
    exploreMarketplace: 'ग्रामीण वस्तू खरेदी करा',
    villageBusiness: 'आपला व्यवसाय वाढवा',
    cart: 'कार्ट',
    checkout: 'थेट UPI पेमेंट',
    totalSales: 'एकूण विक्री',
    monthlyRevenue: 'मासिक उत्पन्न',
    orders: 'एकूण ऑर्डर्स',
    activeCustomers: 'ग्राहक संख्या',
    addProduct: 'नवीन उत्पादन जोडा',
    fairTradeToArtisan: 'थेट कारागिरांच्या खात्यात',
    trackOrder: 'पार्सल शोधा',
    voiceAsk: 'आवाजाने विचारा',
    roleEntrepreneur: 'ग्रामीण कारागीर',
    roleCustomer: 'शहरी ग्राहक',
    roleAdmin: 'हब समन्वयक',
    switchRole: 'भूमिका बदला'
  },
  bn: {
    appName: 'গ্রাম AI',
    tagline: 'গ্রামীণ উদ্যোক্তাদের সরাসরি বাণিজ্য',
    navMarketplace: 'বাজার',
    navDashboard: 'শিল্পী ড্যাশবোর্ড',
    navCustomerPortal: 'আমার অর্ডার',
    navLogistics: 'পার্সেল ট্র্যাকিং',
    navLearning: 'শেখার কেন্দ্র',
    navAIAssistant: 'গ্রাম সহায়ক AI',
    navSupport: 'সহায়তা',
    exploreMarketplace: 'গ্রামের পণ্য কিনুন',
    villageBusiness: 'ব্যবসা বাড়ান',
    cart: 'ব্যাগ',
    checkout: 'সরাসরি UPI পেমেন্ট',
    totalSales: 'মোট বিক্রি',
    monthlyRevenue: 'মাসিক আয়',
    orders: 'মোট অর্ডার',
    activeCustomers: 'গ্রাহক',
    addProduct: 'নতুন পণ্য যোগ করুন',
    fairTradeToArtisan: 'সরাসরি শিল্পীর অ্যাকাউন্টে',
    trackOrder: 'ট্র্যাক করুন',
    voiceAsk: 'কথা বলে জানুন',
    roleEntrepreneur: 'গ্রামীণ কারিগর',
    roleCustomer: 'ক্রেতা',
    roleAdmin: 'হাব কোঅর্ডিনেটর',
    switchRole: 'রোল পরিবর্তন'
  },
  ta: {
    appName: 'கிராம் AI',
    tagline: 'கிராமப்புற வணிகம் மற்றும் நேரடி சந்தை',
    navMarketplace: 'சந்தை',
    navDashboard: 'கைவினைஞர் டாஷ்போர்டு',
    navCustomerPortal: 'எனது ஆர்டர்கள்',
    navLogistics: 'டெலிவரி கண்காணிப்பு',
    navLearning: 'கற்றல் மையம்',
    navAIAssistant: 'கிராம் சகாயக் AI',
    navSupport: 'உதவி மையம்',
    exploreMarketplace: 'கிராமிய பொருட்கள் வாங்க',
    villageBusiness: 'உங்கள் தொழிலை வளர்க்கவும்',
    cart: 'கூடை',
    checkout: 'நேரடி UPI கட்டணம்',
    totalSales: 'மொத்த விற்பனை',
    monthlyRevenue: 'மாத வருமானம்',
    orders: 'மொத்த ஆர்டர்கள்',
    activeCustomers: 'வாடிக்கையாளர்கள்',
    addProduct: 'புதிய தயாரிப்பு சேர்க்க',
    fairTradeToArtisan: 'நேரடியாக கைவினைஞர் கணக்கில்',
    trackOrder: 'ஆர்டரை கண்காணிக்க',
    voiceAsk: 'குரல் மூலம் கேட்க',
    roleEntrepreneur: 'கைவினைஞர் / தொழில்முனைவோர்',
    roleCustomer: 'வாடிக்கையாளர்',
    roleAdmin: 'மைய ஒருங்கிணைப்பாளர்',
    switchRole: 'பங்கை மாற்றவும்'
  },
  te: {
    appName: 'గ్రామ్ AI',
    tagline: 'గ్రామీణ వ్యాపారం మరియు ప్రత్యక్ష మార్కెట్',
    navMarketplace: 'మార్కెట్‌ప్లేస్',
    navDashboard: 'చేతివృత్తుల డాష్‌బోర్డ్',
    navCustomerPortal: 'నా ఆర్డర్లు',
    navLogistics: 'డెలివరీ ట్రాకింగ్',
    navLearning: 'నేర్చుకునే వేదిక',
    navAIAssistant: 'గ్రామ్ సహాయక్ AI',
    navSupport: 'మద్దతు కేంద్రం',
    exploreMarketplace: 'గ్రామీణ వస్తువులు కొనండి',
    villageBusiness: 'మీ వ్యాపారాన్ని పెంచుకోండి',
    cart: 'కార్ట్',
    checkout: 'తక్షణ UPI చెల్లింపు',
    totalSales: 'మొత్తం అమ్మకాలు',
    monthlyRevenue: 'నెలవారీ ఆదాయం',
    orders: 'మొత్తం ఆర్డర్లు',
    activeCustomers: 'వినియోగదారులు',
    addProduct: 'కొత్త ఉత్పత్తిని జోడించండి',
    fairTradeToArtisan: 'నేరుగా కళాకారుల ఖాతాలోకి',
    trackOrder: 'ఆర్డర్ ట్రాక్ చేయండి',
    voiceAsk: 'మాట్లాడి అడగండి',
    roleEntrepreneur: 'చేతివృత్తుల వ్యాపారి',
    roleCustomer: 'కొనుగోలుదారు',
    roleAdmin: 'హబ్ సమన్వయకర్త',
    switchRole: 'పాత్రను మార్చండి'
  }
};
