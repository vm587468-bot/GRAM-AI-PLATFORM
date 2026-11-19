export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'gu';

export interface Translations {
  appName: string;
  tagline: string;
  navProjects: string;
  navMarket: string;
  navMarketplace: string;
  navDeals: string;
  navDashboard: string;
  navCustomerPortal: string;
  navLogistics: string;
  navSchemes: string;
  navVillageConnect: string;
  navAdmin: string;
  navAIAssistant: string;
  navSupport: string;
  navLogin: string;
  navSignup: string;
  navLogout: string;

  // Theme & Language
  darkMode: string;
  lightMode: string;
  changeLanguage: string;
  selectLanguage: string;

  // Hero Section
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  exploreMarketplace: string;
  artisanDashboard: string;
  voiceAdvisor: string;
  govtSchemesLoans: string;
  trustFairTrade: string;
  trustGIOrigin: string;
  trustPostalRelay: string;

  // Ecosystem Console
  ecosystemHub: string;
  liveNodalNetwork: string;
  activeNode: string;
  instantEscrow: string;
  zeroCommission: string;
  doorstepPickup: string;
  indiaPostRelayTitle: string;
  govtSubsidyPreApproved: string;
  verifiedGICert: string;
  multiLangGuide: string;
  directEarnings: string;
  onTimeDelivery: string;

  // Automatic Schemes Banner
  schemesBannerTitle: string;
  schemesPreLoadedBadge: string;
  exploreAllSchemes: string;
  applyNow: string;

  // Problem & Solution
  problemBadge: string;
  problemTitle: string;
  problemSubtitle: string;
  problem1Title: string;
  problem1Desc: string;
  problem2Title: string;
  problem2Desc: string;
  problem3Title: string;
  problem3Desc: string;
  problem4Title: string;
  problem4Desc: string;

  solutionBadge: string;
  solutionTitle: string;
  solutionSubtitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;

  // Marketplace Search & Filters
  marketplaceTitle: string;
  marketplaceSubtitle: string;
  searchPlaceholder: string;
  allCategories: string;
  catClothes: string;
  catSports: string;
  catRation: string;
  catTextiles: string;
  catSpices: string;
  catPottery: string;
  catHoneyOils: string;
  catBambooWood: string;
  catHandicrafts: string;
  sortBy: string;
  sortRelevance: string;
  sortNewest: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortRating: string;
  filterByCondition: string;
  conditionNew: string;
  conditionLikeNew: string;
  conditionGood: string;
  conditionFair: string;
  verifiedSellersOnly: string;
  inStockOnly: string;
  priceRange: string;
  clearFilters: string;

  // Product Card & Details
  addToCart: string;
  buyNow: string;
  inStock: string;
  outOfStock: string;
  unitsLeft: string;
  verifiedArtisan: string;
  giCertifiedBadge: string;
  authenticityGuaranteed: string;
  viewDetails: string;
  imageUnavailable: string;
  clickToZoom: string;
  fullScreenGallery: string;
  specifications: string;
  warranty: string;
  returnPolicy: string;
  defectsNotice: string;
  artisanStoryTitle: string;
  materialsUsed: string;
  fairTradeShareNotice: string;
  contactSeller: string;
  compareProduct: string;
  reportListing: string;

  // Reviews System
  productReviews: string;
  writeReview: string;
  customerRatingBreakdown: string;
  overallRating: string;
  qualityRating: string;
  durabilityRating: string;
  valueRating: string;
  sellerRating: string;
  verifiedBuyer: string;
  helpfulCount: string;
  markHelpful: string;
  reportReview: string;
  uploadReviewPhoto: string;
  submitReview: string;
  reviewPlaceholder: string;
  noReviewsYet: string;

  // Deals & Schemes
  dealsTitle: string;
  dealsSubtitle: string;
  dealsBadge: string;
  verifiedDealsOnly: string;
  discountFilterAll: string;
  discount20: string;
  discount30: string;
  discount50: string;
  copyCoupon: string;
  couponCopied: string;
  validUntil: string;
  originalPriceLabel: string;
  offerPriceLabel: string;
  savingsLabel: string;
  minOrderLabel: string;

  // Product Comparison
  compareTitle: string;
  compareSubtitle: string;
  compareEmpty: string;
  removeComparison: string;
  featureTitle: string;

  // Seller / Entrepreneur Dashboard
  dashboardOverview: string;
  dashboardInventory: string;
  dashboardOrders: string;
  dashboardAnalytics: string;
  totalSales: string;
  monthlyRevenue: string;
  orders: string;
  activeCustomers: string;
  addProduct: string;
  editProduct: string;
  deleteProduct: string;
  pauseListing: string;
  activateListing: string;
  stockAvailable: string;
  lowStockAlert: string;
  payoutAccount: string;
  escrowSecured: string;
  buyerEnquiries: string;
  uploadProductPhotos: string;
  productTitleLabel: string;
  productBrandLabel: string;
  productModelLabel: string;
  productPriceLabel: string;
  productConditionLabel: string;
  productWarrantyLabel: string;

  // Customer Dashboard
  myOrders: string;
  noOrdersYet: string;
  downloadInvoice: string;
  cancelOrder: string;
  requestReturn: string;
  trackConsignment: string;
  orderCancelled: string;
  returnRequested: string;

  // Admin Dashboard
  adminTitle: string;
  adminSubtitle: string;
  totalUsers: string;
  activeUsers: string;
  lastLogin: string;
  neverLoggedIn: string;
  lastLoginUnknown: string;
  inactiveStatus: string;
  successfulLogins: string;
  failedAttempts: string;
  accountStatus: string;
  suspendAccount: string;
  reactivateAccount: string;
  auditTrail: string;
  productModeration: string;
  reportedListings: string;
  flaggedReviews: string;
  approveListing: string;
  pauseListingAdmin: string;

  // Logistics
  logisticsTitle: string;
  logisticsSubtitle: string;
  trackPlaceholder: string;
  consignmentDetails: string;
  indiaPostRelay: string;
  deliveryOtp: string;
  inTransit: string;
  outForDelivery: string;
  deliveredSuccess: string;

  // Village Connect
  villageConnectTitle: string;
  villageConnectSubtitle: string;
  postCollaboration: string;
  clusterRadius: string;
  allOpportunities: string;
  sharedVans: string;
  bulkMaterials: string;
  sharedMachinery: string;
  jointOrders: string;
  collaborateBtn: string;

  // Support
  supportTitle: string;
  supportSubtitle: string;
  raiseNewTicket: string;
  issueTopic: string;
  issueCategory: string;
  issueMessage: string;
  phoneSupport: string;
  submitTicket: string;
  ticketStatusOpen: string;
  ticketStatusResolved: string;

  // Cart & Checkout
  cart: string;
  checkout: string;
  cartEmpty: string;
  subtotal: string;
  deliveryFee: string;
  freeDeliveryBadge: string;
  totalAmount: string;
  upiPayment: string;
  scanUpiQr: string;
  verifyAndPay: string;
  paymentSuccess: string;

  // Universal
  close: string;
  cancel: string;
  confirm: string;
  save: string;
  loading: string;
  search: string;
  filter: string;
  all: string;
  roleEntrepreneur: string;
  roleCustomer: string;
  roleAdmin: string;
  switchRole: string;

  // Footer
  footerFairTradeTitle: string;
  footerFairTradeDesc: string;
  footerEscrowTitle: string;
  footerEscrowDesc: string;
  footerLogisticsTitle: string;
  footerLogisticsDesc: string;
  footerHeritageTitle: string;
  footerHeritageDesc: string;
  footerMission: string;
  footerNodalClusters: string;
  footerTollFree: string;
  footerEmail: string;
  footerQuickLinks: string;
  footerCategories: string;
  footerPrograms: string;
  footerLegal: string;
  footerCopyright: string;

  // Additional Marketplace & Modals
  showingProductsCount: string;
  noProductsMatch: string;
  noProductsSubtext: string;
  compareSideBySide: string;
  clearComparison: string;
  comparedBadge: string;
  brandLabel: string;
  modelLabel: string;
  verifiedReviewsCount: string;
  sendMessageToSeller: string;
  reportSuspiciousListing: string;
  sendDirectMessage: string;
  messageSellerDesc: string;
  submitReportBtn: string;
  reportReasonPlaceholder: string;
  wasReviewHelpful: string;
  reportReviewBtn: string;
  allReviewsHeading: string;
  directEscrowNotice: string;

  // Additional Landing Page
  impactRegisteredArtisans: string;
  impactHubs: string;
  impactRevenueShare: string;
  impactHappyBuyers: string;
  structuralChallengeBadge: string;
  structuralChallengeTitle: string;
  structuralChallengeSubtitle: string;
  brokenSystemTitle: string;
  brokenMiddlemen: string;
  brokenLogistics: string;
  brokenPayments: string;
  brokenLanguage: string;
  gramSolutionTitle: string;
  solutionFairPayout: string;
  solutionPostalRelay: string;
  solutionInstantUpi: string;
  solutionVoiceCopilot: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaShopBtn: string;
  ctaEnterpriseBtn: string;
  featuredDealsBadge: string;
  featuredDealsTitle: string;
  featuredDealsSubtitle: string;
  viewAllDealsBtn: string;
  directVillageDelivery: string;
  cartProceedToCheckout: string;

  // User & Portal
  welcomeBack: string;
  consciousPatron: string;
  supportedVillagesCount: string;
  exploreMoreCrafts: string;
  livePostalTrackingAvailable: string;
  browseVillageCatalog: string;
  shopVillageMarketplace: string;
  orderConsignment: string;
  orderEstimatedDelivery: string;
  logisticsPartner: string;
  deliveryAgent: string;
  handoffOtp: string;
  otpInstructions: string;
  transitMilestones: string;
  shipmentContents: string;
  gstReceipt: string;
  taxInvoice: string;
  reviewArtisanProduct: string;
  thankYouFeedback: string;
  yourRating: string;
  yourReviewExperience: string;
  submitVerifiedReview: string;

  // Entrepreneur Dashboard Extra
  directBankVpa: string;
  withdrawFunds: string;
  instantUpiTransfer: string;
  availableBalance: string;
  totalSalesRevenue: string;
  directCustomerOrders: string;
  activePatrons: string;
  fairProducerCut: string;
  dailyMarketIntelligence: string;
  refreshInsights: string;
  monthlyRevenueGrowth: string;
  revenueByCategory: string;
  advanceStatus: string;
  markPacked: string;
  handoverToHub: string;
  outForDeliveryStatus: string;
  markDelivered: string;
  deliveredAndSettled: string;
  directInquiries: string;
  activeConversations: string;
  verifiedBuyerBadge: string;
  typeReplyPlaceholder: string;
  sendReplyBtn: string;
  uploadNewProduct: string;
  productNamePlaceholder: string;
  directFairPrice: string;
  stockQuantity: string;
  sellingUnit: string;
  materialsIngredients: string;
  aiStoryteller: string;
  generateWithAi: string;
  publishProductBtn: string;

  // Government Schemes Extra
  schemesOfficialSupport: string;
  schemesCollateralFree: string;
  schemesDisbursalDirect: string;
  schemesZeroBrokers: string;
  listenSchemesAudio: string;
  stopAudio: string;
  loanEmiCalculator: string;
  calculateEmi: string;
  monthlyEmi: string;
  interestSaved: string;
  applySubsidyBtn: string;
  appliedSuccessfully: string;
  applicantName: string;
  applicantPhone: string;
  desiredLoanAmount: string;

  // Village Connect Extra
  villageConnectHeroTitle: string;
  villageConnectHeroDesc: string;
  postCollaborationBtn: string;
  activeEntrepreneursInCluster: string;
  allOpportunitiesTag: string;
  sharedDeliveryVansTag: string;
  bulkRawMaterialsTag: string;
  sharedMachineryTag: string;
  jointOrderTag: string;
  interestedBtn: string;

  // Support Extra
  supportHelpdesk: string;
  tollFreeHelpline: string;
  districtNodalHubs: string;
  raiseTicketBtn: string;
  ticketSubject: string;
  ticketDetails: string;
  ticketReplyPlaceholder: string;

  // Voice AI & Checkout Extra
  voiceAssistantGreeting: string;
  voiceAssistantSubtitle: string;
  speakOrTypePrompt: string;
  voiceQueryEscrow: string;
  voiceQueryTrack: string;
  voiceQuerySchemes: string;
  voiceQueryTextiles: string;
  qrScanInstructions: string;
  deliveryAddressLabel: string;
  deliveryPhoneLabel: string;
  payableTotal: string;
  trackLiveConsignment: string;

  // Comparison Extra
  compareFeaturesBrand: string;
  compareFeaturesCondition: string;
  compareFeaturesRating: string;
  compareFeaturesVillage: string;
  compareFeaturesMaterials: string;
  compareFeaturesWarranty: string;
  compareFeaturesAction: string;

  // Voice Copilot & Missing Component Keys
  voiceCopilotTitle: string;
  voiceCopilotSubtitle: string;
  listenAudio: string;
  hubPickup: string;
  priceDropAlertActive: string;
  schemesHeroTitle: string;
  schemesHeroSubtitle: string;
  ordersTitle: string;
  ordersSubtitle: string;
  readyForInstantUpi: string;
  pendingEscrowLabel: string;
  releasesUponScan: string;
  lifetimeDirectEarnings: string;
  producerMarginZeroCommission: string;
  recentBankUpiSettlements: string;
  orderDate: string;
  sellProductsManageStock: string;
  sellProductsSubtitle: string;
  trackOrder: string;
  verifiedQualityBadge: string;
  authenticVillageProvenance: string;
  brandModel: string;
  condition: string;
  customerRatingCol: string;
  originVillage: string;
  warrantyGuaranteed: string;
  actionCol: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'GramSetu',
    tagline: 'Projects, Govt Schemes, Market Prices & Verified Marketplace',
    navProjects: 'Projects',
    navMarket: 'Market Prices',
    navMarketplace: 'Marketplace',
    navDeals: 'Deals & Offers',
    navDashboard: 'Artisan Dashboard',
    navCustomerPortal: 'My Orders',
    navLogistics: 'Logistics Relay',
    navSchemes: 'Govt Schemes',
    navVillageConnect: 'Village Connect',
    navAdmin: 'Admin Console',
    navAIAssistant: 'Voice Assistant',
    navSupport: 'Help & Support',
    navLogin: 'Login',
    navSignup: 'Register',
    navLogout: 'Logout',

    darkMode: 'Dark Mode',
    lightMode: 'Bright Mode',
    changeLanguage: 'Change Language',
    selectLanguage: 'Select Language',

    heroBadge: "Next-Gen Platform for Rural Enterprises, Artisans & Smart Discovery",
    heroTitle: 'Direct Rural Commerce.',
    heroHighlight: 'Smart Intelligence.',
    heroSubtitle: 'GramSetu connects micro-enterprise projects, verified official government schemes, live mandi market prices, and trusted artisan products with direct UPI escrow and postal logistics.',
    exploreMarketplace: 'Explore Marketplace',
    artisanDashboard: 'Artisan Dashboard',
    voiceAdvisor: 'Voice Advisor',
    govtSchemesLoans: 'Govt Schemes & Loans (₹3L - ₹50L)',
    trustFairTrade: '86%+ Proceeds to Artisans',
    trustGIOrigin: 'Verified GI & Organic Origin',
    trustPostalRelay: 'India Post Rural Nodal Relay',

    ecosystemHub: 'GramSetu Ecosystem Hub',
    liveNodalNetwork: 'Live Village Nodal Network',
    activeNode: 'Active Node',
    instantEscrow: 'Instant Escrow',
    zeroCommission: '0% Middleman Cut',
    doorstepPickup: 'Doorstep Pickup',
    indiaPostRelayTitle: 'India Post + Speed Post Relay',
    govtSubsidyPreApproved: 'Govt Subsidy Pre-Approved',
    verifiedGICert: 'Verified GI Certification',
    multiLangGuide: 'Multi-Language Voice Guide',
    directEarnings: 'Direct Earnings',
    onTimeDelivery: 'On-Time Delivery',

    schemesBannerTitle: 'Automatic Access: Government Business Schemes & Subsidized Loans',
    schemesPreLoadedBadge: 'No Search Needed · 100% Pre-Loaded',
    exploreAllSchemes: 'Explore all schemes, rules & loan calculator',
    applyNow: 'Apply Now',

    problemBadge: 'The Problem: Broken Rural Supply Chains',
    problemTitle: 'Why Village Entrepreneurs Struggle to Grow',
    problemSubtitle: 'Before GramSetu, talented artisans and farmers were trapped by exploitative middlemen, absent courier services, and predatory informal loans.',
    problem1Title: 'Broker & Middleman Exploitation',
    problem1Desc: 'Intermediaries pocket 60-70% of retail margins while paying subsistence wages to village makers.',
    problem2Title: 'Logistics Dead-Zones',
    problem2Desc: 'Commercial express couriers refuse rural pickup, leaving remote craft clusters isolated from city buyers.',
    problem3Title: 'Payment Insecurity & 90-Day Delays',
    problem3Desc: 'Delayed payments force rural families into debt spirals with local moneylenders.',
    problem4Title: 'Digital & Language Exclusion',
    problem4Desc: 'Complex English-only portals lock out millions of skilled craftspeople across rural Bharat.',

    solutionBadge: 'The Solution: GramSetu Integrated OS',
    solutionTitle: 'Bridging Village Craft to Conscious Urban Patrons',
    solutionSubtitle: 'A technology stack built specifically for village connectivity, regional languages, and India Post logistics.',
    pillar1Title: 'Direct Fair-Trade Commerce',
    pillar1Desc: '86%+ of customer spend reaches artisans directly with transparent escrow release.',
    pillar2Title: 'India Post Nodal Hubs',
    pillar2Desc: 'Gram Express aggregates parcels at village post offices for low-cost, pan-India deliveries.',
    pillar3Title: 'Instant NPCI UPI Escrow',
    pillar3Desc: 'Payment locks on order and transfers into the artisan self-help bank account upon hub dispatch.',
    pillar4Title: 'Voice Guide in 4 Indian Languages',
    pillar4Desc: 'Artisans manage catalogs, talk to voice copilots, and apply for government subsidies effortlessly.',

    marketplaceTitle: 'Direct Producer Marketplace',
    marketplaceSubtitle: 'Discover authentic GI-certified handlooms, pure organic spices, natural pottery, and handcrafted treasures directly from village creators.',
    searchPlaceholder: 'Search products by title, artisan, craft type, or region (e.g., Kalamkari, Pottery, Mustard Oil)...',
    allCategories: 'All Categories',
    catClothes: 'Clothes & Ethnic',
    catSports: 'Sports & Gear',
    catRation: 'Ration & Grains',
    catTextiles: 'Handloom Textiles',
    catSpices: 'Organic Spices',
    catPottery: 'Terracotta Pottery',
    catHoneyOils: 'Raw Honey & Oils',
    catBambooWood: 'Bamboo & Woodcraft',
    catHandicrafts: 'Tribal Handicrafts',
    sortBy: 'Sort By',
    sortRelevance: 'Best Match',
    sortNewest: 'Newest Arrivals',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortRating: 'Highest Rated',
    filterByCondition: 'Condition',
    conditionNew: 'Brand New',
    conditionLikeNew: 'Like New',
    conditionGood: 'Good',
    conditionFair: 'Fair (Minor Flaws)',
    verifiedSellersOnly: 'Verified Sellers Only',
    inStockOnly: 'In Stock Only',
    priceRange: 'Price Range',
    clearFilters: 'Clear Filters',

    addToCart: 'Add to Cart',
    buyNow: 'Buy Now (UPI)',
    inStock: 'In Stock',
    outOfStock: 'Sold Out',
    unitsLeft: 'units available',
    verifiedArtisan: 'Verified Rural Artisan Guild',
    giCertifiedBadge: 'GI Certified Origin',
    authenticityGuaranteed: '100% Authentic Provenance',
    viewDetails: 'View Product Details',
    imageUnavailable: 'Image Not Available',
    clickToZoom: 'Hover or click to zoom',
    fullScreenGallery: 'Full-Screen Photo Gallery',
    specifications: 'Product Specifications',
    warranty: 'Warranty & Guarantee',
    returnPolicy: 'Return & Exchange Policy',
    defectsNotice: 'Craft Variations & Quality Notice',
    artisanStoryTitle: 'Artisan Story & Heritage',
    materialsUsed: 'Raw Materials Used',
    fairTradeShareNotice: '86%+ Direct Artisan Earnings Guarantee',
    contactSeller: 'Contact Seller / Guild',
    compareProduct: 'Compare',
    reportListing: 'Report Suspicious Listing',

    productReviews: 'Customer Reviews & Quality Ratings',
    writeReview: 'Write a Review',
    customerRatingBreakdown: 'Quality & Durability Breakdown',
    overallRating: 'Overall Rating',
    qualityRating: 'Product Quality',
    durabilityRating: 'Durability',
    valueRating: 'Value for Money',
    sellerRating: 'Seller Experience',
    verifiedBuyer: 'Verified Purchase',
    helpfulCount: 'Helpful',
    markHelpful: 'Helpful',
    reportReview: 'Report Review',
    uploadReviewPhoto: 'Attach Real Photo (Optional)',
    submitReview: 'Submit Honest Review',
    reviewPlaceholder: 'Share your genuine experience with this handcrafted product, packaging, and quality...',
    noReviewsYet: 'No verified reviews yet. Be the first to review this artisanal product!',

    dealsTitle: 'Best Schemes, Offers & Verified Deals',
    dealsSubtitle: 'Transparent village discounts, seasonal offers, and coupon codes verified directly with artisan guilds.',
    dealsBadge: 'Verified Direct Discounts',
    verifiedDealsOnly: 'Guild-Verified Deals Only',
    discountFilterAll: 'All Deals',
    discount20: '20%+ Off',
    discount30: '30%+ Off',
    discount50: '50%+ Super Deals',
    copyCoupon: 'Copy Code',
    couponCopied: 'Code Copied!',
    validUntil: 'Offer Valid Until',
    originalPriceLabel: 'Original M.R.P.',
    offerPriceLabel: 'Direct Deal Price',
    savingsLabel: 'You Save',
    minOrderLabel: 'Min. Order Value',

    compareTitle: 'Side-by-Side Product Comparison',
    compareSubtitle: 'Inspect materials, conditions, warranties, and prices to make an informed, ethical purchase.',
    compareEmpty: 'No products selected for comparison. Click "Compare" on any product card.',
    removeComparison: 'Remove',
    featureTitle: 'Specification',

    dashboardOverview: 'Overview',
    dashboardInventory: 'My Inventory',
    dashboardOrders: 'Orders & Dispatch',
    dashboardAnalytics: 'Sales & Growth',
    totalSales: 'Total Sales',
    monthlyRevenue: 'Monthly Direct Revenue',
    orders: 'Total Orders',
    activeCustomers: 'Repeat Patrons',
    addProduct: 'List New Product',
    editProduct: 'Edit Listing',
    deleteProduct: 'Remove Listing',
    pauseListing: 'Pause Listing',
    activateListing: 'Publish Listing',
    stockAvailable: 'Units in Stock',
    lowStockAlert: 'Low Stock Alert',
    payoutAccount: 'Linked Bank Account',
    escrowSecured: 'Escrow Secured',
    buyerEnquiries: 'Customer Messages',
    uploadProductPhotos: 'Upload Product Photos (Multiple Angles)',
    productTitleLabel: 'Product Name',
    productBrandLabel: 'Brand / Guild Name',
    productModelLabel: 'Model / Variant',
    productPriceLabel: 'Price (₹)',
    productConditionLabel: 'Condition',
    productWarrantyLabel: 'Warranty Details',

    myOrders: 'My Orders',
    noOrdersYet: 'You have not placed any orders yet. Explore the marketplace!',
    downloadInvoice: 'Tax Invoice (PDF)',
    cancelOrder: 'Cancel Order',
    requestReturn: 'Request Return',
    trackConsignment: 'Live India Post Tracking',
    orderCancelled: 'Order has been cancelled.',
    returnRequested: 'Return request submitted.',

    adminTitle: 'GramSetu Master Admin Console',
    adminSubtitle: 'Platform governance, verified user accounts, login security audit trails, and product moderation.',
    totalUsers: 'Total Registered Users',
    activeUsers: 'Active Sessions',
    lastLogin: 'Last Login',
    neverLoggedIn: 'Never logged in',
    lastLoginUnknown: 'Last login unknown',
    inactiveStatus: 'Inactive (>30 days)',
    successfulLogins: 'Successful Logins',
    failedAttempts: 'Failed Attempts',
    accountStatus: 'Account Status',
    suspendAccount: 'Suspend Account',
    reactivateAccount: 'Reactivate Account',
    auditTrail: 'Security Audit Trail',
    productModeration: 'Product Moderation',
    reportedListings: 'Reported Listings',
    flaggedReviews: 'Flagged Reviews',
    approveListing: 'Approve Listing',
    pauseListingAdmin: 'Pause Listing',

    logisticsTitle: 'Postal Relay & Live Consignment Tracker',
    logisticsSubtitle: 'Real-time GPS routing across India Post village branch offices and Gram Express electric fleet.',
    trackPlaceholder: 'Enter Tracking ID (e.g. GRAM-88219)...',
    consignmentDetails: 'Consignment Details',
    indiaPostRelay: 'India Post Nodal Hub',
    deliveryOtp: 'Delivery Verification OTP',
    inTransit: 'In Transit',
    outForDelivery: 'Out for Delivery',
    deliveredSuccess: 'Delivered Successfully',

    villageConnectTitle: 'Village Connect Collaboration Network',
    villageConnectSubtitle: 'Connect with nearby artisans and farmers to share transport vans, purchase raw materials in bulk, and fulfill joint orders.',
    postCollaboration: 'Post Collaboration Request',
    clusterRadius: 'Cluster Radius',
    allOpportunities: 'All Opportunities',
    sharedVans: 'Shared Electric Vans',
    bulkMaterials: 'Raw Material Bulk Orders',
    sharedMachinery: 'Shared Processing Tools',
    jointOrders: 'Joint Production Orders',
    collaborateBtn: 'Join Initiative',

    supportTitle: 'Kisan & Artisan Mitra Support Desk',
    supportSubtitle: '24x7 toll-free helpline, WhatsApp assistance, and dispute resolution for rural enterprises.',
    raiseNewTicket: 'Raise New Support Ticket',
    issueTopic: 'Issue Title',
    issueCategory: 'Category',
    issueMessage: 'Describe Your Issue in Detail',
    phoneSupport: 'Toll-Free Helpline: 1800-419-GRAM',
    submitTicket: 'Submit Support Ticket',
    ticketStatusOpen: 'Open / Under Review',
    ticketStatusResolved: 'Resolved',

    cart: 'Shopping Cart',
    checkout: 'Instant UPI Checkout',
    cartEmpty: 'Your direct artisan cart is empty.',
    subtotal: 'Subtotal',
    deliveryFee: 'India Post Rural Relay Delivery',
    freeDeliveryBadge: 'FREE Direct Delivery',
    totalAmount: 'Total Payable Amount',
    upiPayment: 'Pay via UPI (GPay, PhonePe, Paytm, BHIM)',
    scanUpiQr: 'Scan QR to Pay with Any UPI App',
    verifyAndPay: 'Verify & Confirm Escrow Payment',
    paymentSuccess: 'Payment Successful! Escrow Activated.',

    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save Changes',
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    roleEntrepreneur: 'Artisan / Entrepreneur',
    roleCustomer: 'Customer / Buyer',
    roleAdmin: 'Hub Coordinator (Admin)',
    switchRole: 'Switch Role',

    // Footer
    footerFairTradeTitle: 'Direct Fair Trade Guarantee',
    footerFairTradeDesc: '86%+ of customer payments flow straight to the village artisan self-help group.',
    footerEscrowTitle: 'Instant NPCI UPI Escrow',
    footerEscrowDesc: 'Secure digital payments with automatic dispatch release and zero merchant deductions.',
    footerLogisticsTitle: 'Rural Nodal Logistics',
    footerLogisticsDesc: 'Partnered with India Post rural branch offices and Gram Express electric fleet.',
    footerHeritageTitle: 'Generational Heritage',
    footerHeritageDesc: 'Authentic GI-certified crafts, organic farm produce, and zero plastic packaging.',
    footerMission: "Empowering India's 650,000 villages with integrated digital commerce, micro-logistics relay, smart market intelligence, and multilingual learning tools.",
    footerNodalClusters: 'Nodal Clusters: Madhubani · Molela · Wayanad · Sundarbans · Barpeta',
    footerTollFree: 'Toll-Free Kisan & Artisan Mitra: 1800-419-GRAM',
    footerEmail: 'helpdesk@gramsetu.org · WhatsApp: +91 94310 44521',
    footerQuickLinks: 'Quick Links',
    footerCategories: 'Popular Categories',
    footerPrograms: 'Government Programs',
    footerLegal: 'Fair Trade & Escrow Policy',
    footerCopyright: 'GramSetu Rural Commerce OS · Built for Bharat',

    // Additional Marketplace & Modals
    showingProductsCount: 'Verified Products',
    noProductsMatch: 'No products matched your search',
    noProductsSubtext: 'Try adjusting your search terms, removing filters, or browsing other categories.',
    compareSideBySide: 'Compare Side-by-Side',
    clearComparison: 'Clear Comparison',
    comparedBadge: 'Compared',
    brandLabel: 'Brand',
    modelLabel: 'Model',
    verifiedReviewsCount: 'Verified Customer Reviews',
    sendMessageToSeller: 'Message Seller / Artisan',
    reportSuspiciousListing: 'Report Suspicious Listing',
    sendDirectMessage: 'Send Direct Message to Producer',
    messageSellerDesc: 'Ask questions regarding customization, bulk orders, or craft origin directly to the producer.',
    submitReportBtn: 'Submit Report for Moderation',
    reportReasonPlaceholder: 'Specify reason (counterfeit, inaccurate photo, damaged item, etc.)...',
    wasReviewHelpful: 'Helpful',
    reportReviewBtn: 'Report Review',
    allReviewsHeading: 'Customer Reviews & Quality Ratings',
    directEscrowNotice: 'Direct UPI escrow ensures 86%+ payment directly to the village self-help cluster.',

    // Additional Landing Page
    impactRegisteredArtisans: 'Registered Village Artisans',
    impactHubs: 'Village Aggregation Hubs',
    impactRevenueShare: 'Average Producer Revenue Share',
    impactHappyBuyers: 'Happy Conscious Consumers',
    structuralChallengeBadge: 'The Structural Challenge',
    structuralChallengeTitle: 'Why Rural Producers Were Cut Off from Fair Wealth',
    structuralChallengeSubtitle: "India's creative and organic economy generates billions, but deep structural disconnects prevent village creators from prospering.",
    brokenSystemTitle: 'The Broken Traditional System',
    brokenMiddlemen: 'Heavy Middleman Exploitation: Brokers capture 50% to 70% of product retail margins, paying artisans bare subsistence wages.',
    brokenLogistics: 'No Last-Mile Rural Logistics: Major private courier services do not pick up from remote villages, creating shipping dead-zones.',
    brokenPayments: 'Delayed Cash Remittances: Village producers wait 45 to 90 days for payment, forcing reliance on predatory local money lenders.',
    brokenLanguage: 'Language & Paperwork Barriers: Complicated English-only e-commerce apps lock out millions of talented vernacular creators.',
    gramSolutionTitle: 'The GramSetu Ecosystem Solution',
    solutionFairPayout: '86%+ Direct Fair Payout: Direct consumer-to-artisan escrow removes layers of middlemen with guaranteed live price transparency.',
    solutionPostalRelay: 'Postal Hub Nodal Relay: We aggregate parcels at village Panchayat nodes and bridge with India Post & Gram Express EVs.',
    solutionInstantUpi: 'Instant UPI Settlement: Escrow automatically releases funds to the artisan SHG bank account within 24h of hub pickup.',
    solutionVoiceCopilot: 'Voice & Regional Guide: Artisans speak in Hindi, Marathi, Gujarati, or English to generate product catalogs and calculate fair prices.',
    testimonialsTitle: 'Trusted by Urban Patrons & Rural Institutions',
    testimonialsSubtitle: 'Hear what conscious buyers and cooperative leaders say about GramSetu.',
    ctaTitle: "Be Part of India's Direct Rural Commerce Revolution",
    ctaSubtitle: 'Whether you want to source authentic, chemical-free rural treasures or take your village enterprise pan-India, GramSetu is built for you.',
    ctaShopBtn: 'Shop Artisan Marketplace',
    ctaEnterpriseBtn: 'Join as Rural Enterprise',
    featuredDealsBadge: 'Best Offers & Schemes',
    featuredDealsTitle: 'Exclusive Direct-From-Village Deals',
    featuredDealsSubtitle: 'Explore seasonal discounts, verified coupons, and government credit schemes.',
    viewAllDealsBtn: 'View All Deals & Offers',
    directVillageDelivery: 'Direct Village Delivery',
    cartProceedToCheckout: 'Proceed to Secure UPI Escrow',
    welcomeBack: 'Welcome back',
    consciousPatron: 'Conscious Patron · Supporting rural village artisans directly',
    supportedVillagesCount: 'You have supported 3 village cooperatives this season',
    exploreMoreCrafts: 'Explore More Village Crafts',
    livePostalTrackingAvailable: 'Live Postal & Hub Tracking Available',
    browseVillageCatalog: 'Browse our direct village catalog for handmade textiles, spices, and pottery.',
    shopVillageMarketplace: 'Shop Village Marketplace',
    orderConsignment: 'Consignment Number',
    orderEstimatedDelivery: 'Estimated Doorstep Delivery',
    logisticsPartner: 'Logistics Partner',
    deliveryAgent: 'Delivery Agent',
    handoffOtp: 'Handoff Delivery OTP',
    otpInstructions: 'Provide OTP to delivery partner upon item inspection',
    transitMilestones: 'Consignment Transit Milestones',
    shipmentContents: 'Shipment Contents',
    gstReceipt: 'GST Receipt & Invoice',
    taxInvoice: 'Tax Invoice & Fair Trade Remittance Receipt',
    reviewArtisanProduct: 'Review Artisan Product',
    thankYouFeedback: 'Thank you for supporting rural craft!',
    yourRating: 'Your Rating',
    yourReviewExperience: 'Your Review & Experience',
    submitVerifiedReview: 'Submit Verified Review',
    directBankVpa: 'Direct Bank VPA',
    withdrawFunds: 'Withdraw to UPI',
    instantUpiTransfer: 'Instant Bank Transfer',
    availableBalance: 'Available Balance',
    totalSalesRevenue: 'Total Sales Revenue',
    directCustomerOrders: 'Direct Customer Orders',
    activePatrons: 'Active Conscious Patrons',
    fairProducerCut: 'Fair Producer Cut',
    dailyMarketIntelligence: 'Gram Sahayak: Daily Market Intelligence',
    refreshInsights: 'Refresh Insights',
    monthlyRevenueGrowth: 'Monthly Revenue Growth',
    revenueByCategory: 'Revenue by Craft Category',
    advanceStatus: 'Advance Status',
    markPacked: 'Mark Packed',
    handoverToHub: 'Handover to Hub',
    outForDeliveryStatus: 'Out for Delivery',
    markDelivered: 'Mark Delivered',
    deliveredAndSettled: 'Delivered & Escrow Settled',
    directInquiries: 'Direct Customer Inquiries & Custom Orders',
    activeConversations: 'Active Conversations',
    verifiedBuyerBadge: 'Verified Buyer',
    typeReplyPlaceholder: 'Reply directly to customer...',
    sendReplyBtn: 'Send Message',
    uploadNewProduct: 'Upload New Rural Product',
    productNamePlaceholder: 'e.g. Handcrafted Madhubani Tussar Silk Dupatta',
    directFairPrice: 'Direct Fair Price (₹ INR)',
    stockQuantity: 'Available Stock Quantity',
    sellingUnit: 'Selling Unit (piece, pack, kg, bottle)',
    materialsIngredients: 'Materials / Natural Ingredients',
    aiStoryteller: 'Smart Product Storyteller',
    generateWithAi: 'Generate Product Story',
    publishProductBtn: 'Publish Product to GramSetu',
    schemesOfficialSupport: 'Official Government Welfare & Banking Support · Direct Benefit Transfer (DBT)',
    schemesCollateralFree: '100% Collateral-Free Loans',
    schemesDisbursalDirect: 'Direct Bank Account Disbursal',
    schemesZeroBrokers: 'Zero Middleman Deductions',
    listenSchemesAudio: 'Listen to Scheme Rules in ANY Language',
    stopAudio: 'Stop Audio',
    loanEmiCalculator: 'Subsidized Loan EMI & Grant Calculator',
    calculateEmi: 'Calculate EMI',
    monthlyEmi: 'Estimated Monthly EMI',
    interestSaved: 'Interest Subvention Subsidy Saved',
    applySubsidyBtn: 'Apply with 1-Click (DBT)',
    appliedSuccessfully: 'Application Dispatched Directly to District Nodal Bank!',
    applicantName: 'Applicant Name',
    applicantPhone: 'Mobile Phone / WhatsApp',
    desiredLoanAmount: 'Requested Loan Amount (₹)',
    villageConnectHeroTitle: 'Connect. Pool Resources. Grow Together.',
    villageConnectHeroDesc: 'Connect with verified artisans, weavers, and farmers in your cluster to share delivery vans, machinery, and bulk supplies.',
    postCollaborationBtn: 'Post Collaboration Request',
    activeEntrepreneursInCluster: 'Active Rural Entrepreneurs in your 25km cluster',
    allOpportunitiesTag: 'All Opportunities',
    sharedDeliveryVansTag: '🚚 Shared Delivery Vans',
    bulkRawMaterialsTag: '🌾 Bulk Raw Materials',
    sharedMachineryTag: '⚙️ Shared Machinery & Tools',
    jointOrderTag: '🤝 Joint Order Fulfillment',
    interestedBtn: 'I am Interested / Connect',
    supportHelpdesk: 'Gram Sahayak Helpdesk & Village Coordinators',
    tollFreeHelpline: 'Toll-Free Helpline',
    districtNodalHubs: 'District Nodal Support Hubs',
    raiseTicketBtn: 'Create Support Ticket',
    ticketSubject: 'Issue Subject',
    ticketDetails: 'Describe your issue or order query...',
    ticketReplyPlaceholder: 'Type a message to helpdesk...',
    voiceAssistantGreeting: 'Namaste! I am your GramSetu Voice Assistant.',
    voiceAssistantSubtitle: 'Ask me anything in your language about products, schemes, UPI escrow, or order tracking.',
    speakOrTypePrompt: 'Ask voice assistant or type...',
    voiceQueryEscrow: 'How does UPI escrow protect buyers and artisans?',
    voiceQueryTrack: 'Track my parcel GRAM-88219',
    voiceQuerySchemes: 'How to apply for PM Vishwakarma scheme?',
    voiceQueryTextiles: 'Show me authentic handloom sarees and textiles',
    qrScanInstructions: 'Scan with any UPI Banking App (GPay, PhonePe, Paytm, BHIM)',
    deliveryAddressLabel: 'Delivery Address & Contact',
    deliveryPhoneLabel: 'Delivery Phone / WhatsApp number',
    payableTotal: 'Payable Total',
    trackLiveConsignment: 'Track Live Consignment',
    compareFeaturesBrand: 'Brand & Model',
    compareFeaturesCondition: 'Item Condition',
    compareFeaturesRating: 'Customer Rating',
    compareFeaturesVillage: 'Origin Village / Cluster',
    compareFeaturesMaterials: 'Materials Used',
    compareFeaturesWarranty: 'Warranty & Guarantee',
    compareFeaturesAction: 'Quick Action',

    voiceCopilotTitle: 'GramSetu Voice Assistant',
    voiceCopilotSubtitle: 'Ask about projects, govt schemes, mandi prices, or products',
    listenAudio: 'Listen',
    hubPickup: 'Village Postal Hub Pickup',
    priceDropAlertActive: 'Verified Price Drop Alert Active',
    schemesHeroTitle: 'Official Government Schemes & Subsidies',
    schemesHeroSubtitle: 'Browse verified central and state enterprise, artisan, and MSME support schemes with official portals.',
    ordersTitle: 'Direct Buyer Orders & Dispatch',
    ordersSubtitle: 'Track packing, village hub handover, and escrow release across your orders.',
    readyForInstantUpi: 'Ready for Instant UPI Settlement',
    pendingEscrowLabel: 'Held Safely in UPI Escrow',
    releasesUponScan: 'Releases automatically upon postal hub scan',
    lifetimeDirectEarnings: 'Lifetime Direct Producer Earnings',
    producerMarginZeroCommission: '86%+ Producer Cut · Zero Middlemen',
    recentBankUpiSettlements: 'Recent Bank / UPI Settlements',
    orderDate: 'Order Date',
    sellProductsManageStock: 'Sell Products & Manage Stock',
    sellProductsSubtitle: 'Add verified products with accurate photos, condition, warranty, and fair pricing.',
    trackOrder: 'Track Order',
    verifiedQualityBadge: 'Verified Quality & Origin',
    authenticVillageProvenance: 'Authentic Direct Producer Provenance',
    brandModel: 'Brand & Model',
    condition: 'Condition',
    customerRatingCol: 'Customer Rating',
    originVillage: 'Origin Village',
    warrantyGuaranteed: 'Warranty & Guarantee',
    actionCol: 'Quick Action'
  },

  hi: {
    appName: 'ग्रामसेतु',
    tagline: 'परियोजनाएं, सरकारी योजनाएं, मंडी भाव और विश्वसनीय बाज़ार',
    navProjects: 'परियोजनाएं',
    navMarket: 'बाज़ार भाव',
    navMarketplace: 'उत्पाद बाज़ार',
    navDeals: 'डील्स और छूट',
    navDashboard: 'कारीगर डैशबोर्ड',
    navCustomerPortal: 'मेरे ऑर्डर्स',
    navLogistics: 'डाकघर लॉजिस्टिक्स',
    navSchemes: 'सरकारी योजनाएं',
    navVillageConnect: 'ग्राम कनेक्ट',
    navAdmin: 'एडमिन कंसोल',
    navAIAssistant: 'वॉइस सहायक',
    navSupport: 'सहायता केंद्र',
    navLogin: 'लॉग इन',
    navSignup: 'पंजीकरण',
    navLogout: 'लॉग आउट',

    darkMode: 'डार्क मोड',
    lightMode: 'ब्राइट मोड',
    changeLanguage: 'भाषा बदलें',
    selectLanguage: 'भाषा चुनें',

    heroBadge: 'भारत के 6,50,000 गांवों के लिए अगली पीढ़ी का डिजिटल मंच',
    heroTitle: 'सीधा ग्रामीण व्यापार।',
    heroHighlight: 'सशक्त एवं आत्मनिर्भर जीवन।',
    heroSubtitle: 'ग्रामसेतु ग्रामीण कारीगरों, स्वयं सहायता समूहों और प्राकृतिक किसानों को सीधे शहरी जागरूक खरीदारों से जोड़ता है — बिना किसी बिचौलिए के, तत्काल UPI एस्क्रो भुगतान, डाकघर रिले और स्मार्ट बिज़नेस टूल्स के साथ।',
    exploreMarketplace: 'उत्पाद बाज़ार देखें',
    artisanDashboard: 'कारीगर डैशबोर्ड',
    voiceAdvisor: 'वॉइस सलाहकार',
    govtSchemesLoans: 'सरकारी योजनाएं एवं ऋण (₹3 लाख - ₹50 लाख)',
    trustFairTrade: '86%+ कमाई सीधे कारीगर के खाते में',
    trustGIOrigin: '100% प्रामाणिक GI और जैविक उत्पाद',
    trustPostalRelay: 'भारतीय डाक ग्रामीण नोडल रिले',

    ecosystemHub: 'ग्रामसेतु इकोसिस्टम हब',
    liveNodalNetwork: 'लाइव ग्रामीण नोडल नेटवर्क',
    activeNode: 'सक्रिय नोड',
    instantEscrow: 'तत्काल एस्क्रो',
    zeroCommission: '0% बिचौलिया कमीशन',
    doorstepPickup: 'घर से पार्सल पिकअप',
    indiaPostRelayTitle: 'भारतीय डाक + स्पीड पोस्ट रिले',
    govtSubsidyPreApproved: 'सरकारी सब्सिडी पूर्व-स्वीकृत',
    verifiedGICert: 'प्रमाणित GI प्रमाणपत्र',
    multiLangGuide: 'बहुभाषी वॉइस मार्गदर्शक',
    directEarnings: 'सीधी कमाई',
    onTimeDelivery: 'समय पर डिलीवरी',

    schemesBannerTitle: 'स्वचालित पहुंच: सरकारी व्यावसायिक योजनाएं एवं सब्सिडी ऋण',
    schemesPreLoadedBadge: 'खोजने की ज़रूरत नहीं · 100% पहले से लोड',
    exploreAllSchemes: 'सभी योजनाएं, नियम और ऋण कैलकुलेटर देखें',
    applyNow: 'आवेदन करें',

    problemBadge: 'समस्या: टूटी हुई ग्रामीण आपूर्ति श्रृंखला',
    problemTitle: 'ग्रामीण उद्यमियों को आगे बढ़ने में बाधा क्यों?',
    problemSubtitle: 'ग्रामसेतु से पहले, कुशल कारीगर और किसान दलालों के शोषण, अनुपस्थित कूरियर सेवाओं और ऊंचे ब्याज वाले कर्ज़ों के चक्रव्यूह में फंसे हुए थे।',
    problem1Title: 'दलालों और बिचौलियों का भारी शोषण',
    problem1Desc: 'मध्यस्थ 60-70% खुदरा मुनाफा हड़प लेते हैं और कारीगरों को मामूली मज़दूरी देते हैं।',
    problem2Title: 'ग्रामीण कूरियर की अनुपलब्धता',
    problem2Desc: 'निजी कूरियर कंपनियां गांवों से पिकअप नहीं करती हैं, जिससे सुदूर शिल्प केंद्र कटे रहते हैं।',
    problem3Title: 'भुगतान की अनिश्चितता और 90 दिन की देरी',
    problem3Desc: 'महीनों तक भुगतान न मिलने से ग्रामीण परिवारों को स्थानीय साहूकारों पर निर्भर रहना पड़ता है।',
    problem4Title: 'डिजिटल और भाषा की बाधा',
    problem4Desc: 'अंग्रेजी के जटिल ऐप्स लाखों प्रतिभाशाली स्थानीय कारीगरों को बाज़ार से बाहर रखते हैं।',

    solutionBadge: 'समाधान: ग्रामसेतु एकीकृत ऑपरेटिंग सिस्टम',
    solutionTitle: 'गांव के शिल्प को सीधे जागरूक शहरी ग्राहकों तक पहुंचाना',
    solutionSubtitle: 'ग्रामीण कनेक्टिविटी, क्षेत्रीय भाषाओं और भारतीय डाक नेटवर्क के लिए विशेष रूप से डिज़ाइन किया गया मंच।',
    pillar1Title: 'सीधा और पारदर्शी व्यापार',
    pillar1Desc: 'ग्राहक के भुगतान का 86%+ हिस्सा बिना किसी कटौती के सीधे कारीगर के खाते में जाता है।',
    pillar2Title: 'भारतीय डाक नोडल हब',
    pillar2Desc: 'ग्राम एक्सप्रेस गांव के डाकघरों से पार्सल एकत्र करके पूरे भारत में किफायती डिलीवरी करती है।',
    pillar3Title: 'तत्काल NPCI UPI एस्क्रो',
    pillar3Desc: 'ऑर्डर पर पैसा सुरक्षित रूप से लॉक होता है और डाकघर से पिकअप होते ही जारी हो जाता है।',
    pillar4Title: '4 भारतीय भाषाओं में वॉइस मार्गदर्शक',
    pillar4Desc: 'कारीगर बोलकर उत्पाद सूची बनाते हैं, वॉइस असिस्टेंट से बात करते हैं और सरकारी योजनाओं का लाभ लेते हैं।',

    marketplaceTitle: 'प्रत्यक्ष उत्पादक बाज़ार',
    marketplaceSubtitle: 'ग्रामीण कारीगरों से सीधे प्रामाणिक GI-प्रमाणित हथकरघा, शुद्ध जैविक मसाले, मिट्टी के बर्तन और हस्तशिल्प खोजें।',
    searchPlaceholder: 'उत्पाद, कारीगर, शिल्प प्रकार या क्षेत्र से खोजें (जैसे: कलमकारी, मिट्टी के बर्तन, सरसों का तेल)...',
    allCategories: 'सभी श्रेणियां',
    catClothes: 'वस्त्र और पारंपरिक कपड़े',
    catSports: 'खेल का सामान',
    catRation: 'राशन और शुद्ध अनाज',
    catTextiles: 'हथकरघा वस्त्र',
    catSpices: 'शुद्ध जैविक मसाले',
    catPottery: 'टेराकोटा मिट्टी के बर्तन',
    catHoneyOils: 'प्राकृतिक शहद और तेल',
    catBambooWood: 'बांस और लकड़ी का शिल्प',
    catHandicrafts: 'पारंपरिक हस्तशिल्प',
    sortBy: 'क्रमबद्ध करें',
    sortRelevance: 'सर्वश्रेष्ठ मिलान',
    sortNewest: 'नवीनतम उत्पाद',
    sortPriceAsc: 'कीमत: कम से अधिक',
    sortPriceDesc: 'कीमत: अधिक से कम',
    sortRating: 'सर्वोच्च रेटिंग',
    filterByCondition: 'हालत (कंडीशन)',
    conditionNew: 'बिल्कुल नया',
    conditionLikeNew: 'नए जैसा',
    conditionGood: 'अच्छा',
    conditionFair: 'सामान्य (मामूली खामी)',
    verifiedSellersOnly: 'केवल सत्यापित विक्रेता',
    inStockOnly: 'केवल उपलब्ध स्टॉक',
    priceRange: 'मूल्य सीमा',
    clearFilters: 'फ़िल्टर हटाएं',

    addToCart: 'कार्ट में जोड़ें',
    buyNow: 'अभी खरीदें (UPI)',
    inStock: 'उपलब्ध है',
    outOfStock: 'स्टॉक समाप्त',
    unitsLeft: 'पीस शेष',
    verifiedArtisan: 'सत्यापित ग्रामीण कारीगर समूह',
    giCertifiedBadge: 'GI प्रमाणित मूल',
    authenticityGuaranteed: '100% प्रामाणिक उत्पाद',
    viewDetails: 'उत्पाद विवरण देखें',
    imageUnavailable: 'चित्र उपलब्ध नहीं है',
    clickToZoom: 'ज़ूम करने के लिए माउस घुमाएं',
    fullScreenGallery: 'फुल-स्क्रीन फोटो गैलरी',
    specifications: 'उत्पाद विनिर्देश',
    warranty: 'वारंटी एवं गारंटी',
    returnPolicy: 'वापसी एवं विनिमय नीति',
    defectsNotice: 'हस्तनिर्मित गुणवत्ता और प्राकृतिक भिन्नता सूचना',
    artisanStoryTitle: 'कारीगर की कहानी और धरोहर',
    materialsUsed: 'उपयोग की गई कच्ची सामग्री',
    fairTradeShareNotice: '86%+ सीधी कारीगर आय गारंटी',
    contactSeller: 'विक्रेता / कारीगर से संपर्क करें',
    compareProduct: 'तुलना करें',
    reportListing: 'संदिग्ध उत्पाद की शिकायत करें',

    productReviews: 'ग्राहक समीक्षाएं एवं गुणवत्ता रेटिंग',
    writeReview: 'समीक्षा लिखें',
    customerRatingBreakdown: 'गुणवत्ता और टिकाऊपन का विवरण',
    overallRating: 'कुल रेटिंग',
    qualityRating: 'उत्पाद गुणवत्ता',
    durabilityRating: 'टिकाऊपन',
    valueRating: 'पैसे का मूल्य',
    sellerRating: 'विक्रेता अनुभव',
    verifiedBuyer: 'सत्यापित खरीदार',
    helpfulCount: 'मददगार',
    markHelpful: 'मददगार',
    reportReview: 'समीक्षा की रिपोर्ट करें',
    uploadReviewPhoto: 'वास्तविक फोटो संलग्न करें (वैकल्पिक)',
    submitReview: 'समीक्षा जमा करें',
    reviewPlaceholder: 'इस उत्पाद की गुणवत्ता, पैकेजिंग और अपने अनुभव के बारे में लिखें...',
    noReviewsYet: 'अभी कोई समीक्षा नहीं है। पहले समीक्षक बनें!',

    dealsTitle: 'सर्वश्रेष्ठ योजनाएं, ऑफ़र और सत्यापित डील्स',
    dealsSubtitle: 'गांव के कारीगरों से सीधे सत्यापित वास्तविक छूट, मौसमी ऑफ़र और कूपन कोड।',
    dealsBadge: 'सत्यापित सीधी छूट',
    verifiedDealsOnly: 'केवल सत्यापित डील्स',
    discountFilterAll: 'सभी डील्स',
    discount20: '20%+ छूट',
    discount30: '30%+ छूट',
    discount50: '50%+ महाबचत डील्स',
    copyCoupon: 'कोड कॉपी करें',
    couponCopied: 'कोड कॉपी हो गया!',
    validUntil: 'वैधता तिथि',
    originalPriceLabel: 'मूल खुदरा मूल्य',
    offerPriceLabel: 'सीधा डील मूल्य',
    savingsLabel: 'आपकी बचत',
    minOrderLabel: 'न्यूनतम ऑर्डर मूल्य',

    compareTitle: 'आमने-सामने उत्पाद तुलना',
    compareSubtitle: 'सामग्री, गुणवत्ता, वारंटी और कीमत की तुलना करके सही निर्णय लें।',
    compareEmpty: 'तुलना के लिए कोई उत्पाद नहीं चुना गया। उत्पाद कार्ड पर "तुलना करें" पर क्लिक करें।',
    removeComparison: 'हटाएं',
    featureTitle: 'विवरण',

    dashboardOverview: 'सिंहावलोकन',
    dashboardInventory: 'मेरी इन्वेंट्री',
    dashboardOrders: 'ऑर्डर और प्रेषण',
    dashboardAnalytics: 'बिक्री और विकास',
    totalSales: 'कुल बिक्री',
    monthlyRevenue: 'मासिक शुद्ध आय',
    orders: 'कुल ऑर्डर्स',
    activeCustomers: 'पुनरावृत्त ग्राहक',
    addProduct: 'नया उत्पाद जोड़ें',
    editProduct: 'उत्पाद संपादित करें',
    deleteProduct: 'उत्पाद हटाएं',
    pauseListing: 'उत्पाद रोकें',
    activateListing: 'उत्पाद प्रकाशित करें',
    stockAvailable: 'उपलब्ध स्टॉक',
    lowStockAlert: 'कम स्टॉक चेतावनी',
    payoutAccount: 'संबद्ध बैंक खाता',
    escrowSecured: 'एस्क्रो सुरक्षित',
    buyerEnquiries: 'ग्राहक संदेश',
    uploadProductPhotos: 'उत्पाद की तस्वीरें अपलोड करें',
    productTitleLabel: 'उत्पाद का नाम',
    productBrandLabel: 'ब्रांड / गिल्ड नाम',
    productModelLabel: 'मॉडल / प्रकार',
    productPriceLabel: 'कीमत (₹)',
    productConditionLabel: 'हालत',
    productWarrantyLabel: 'वारंटी विवरण',

    myOrders: 'मेरे ऑर्डर्स',
    noOrdersYet: 'आपने अभी तक कोई ऑर्डर नहीं दिया है। बाज़ार देखें!',
    downloadInvoice: 'टैक्स इनवॉइस (PDF)',
    cancelOrder: 'ऑर्डर रद्द करें',
    requestReturn: 'वापसी का अनुरोध करें',
    trackConsignment: 'लाइव डाकघर ट्रैकिंग',
    orderCancelled: 'ऑर्डर रद्द कर दिया गया है।',
    returnRequested: 'वापसी का अनुरोध दर्ज हो गया है।',

    adminTitle: 'ग्रामसेतु मास्टर एडमिन कंसोल',
    adminSubtitle: 'प्लेटफ़ॉर्म संचालन, उपयोगकर्ता सुरक्षा ऑडिट ट्रेल और उत्पाद नियंत्रण।',
    totalUsers: 'कुल पंजीकृत उपयोगकर्ता',
    activeUsers: 'सक्रिय सत्र',
    lastLogin: 'अंतिम लॉगिन',
    neverLoggedIn: 'कभी लॉगिन नहीं किया',
    lastLoginUnknown: 'अंतिम लॉगिन अज्ञात',
    inactiveStatus: 'निष्क्रिय (>30 दिन)',
    successfulLogins: 'सफल लॉगिन',
    failedAttempts: 'विफल प्रयास',
    accountStatus: 'खाता स्थिति',
    suspendAccount: 'खाता निलंबित करें',
    reactivateAccount: 'खाता पुनः सक्रिय करें',
    auditTrail: 'सुरक्षा ऑडिट ट्रेल',
    productModeration: 'उत्पाद नियंत्रण',
    reportedListings: 'रिपोर्ट किए गए उत्पाद',
    flaggedReviews: 'फ्लैग की गई समीक्षाएं',
    approveListing: 'मंजूर करें',
    pauseListingAdmin: 'रोकें',

    logisticsTitle: 'डाकघर रिले और लाइव पार्सल ट्रैकर',
    logisticsSubtitle: 'भारतीय डाक और ग्राम एक्सप्रेस वाहनों की लाइव जीपीएस ट्रैकिंग।',
    trackPlaceholder: 'ट्रैकिंग आईडी दर्ज करें (जैसे: GRAM-88219)...',
    consignmentDetails: 'पार्सल विवरण',
    indiaPostRelay: 'डाकघर नोडल हब',
    deliveryOtp: 'डिलीवरी सत्यापन OTP',
    inTransit: 'मार्ग में है',
    outForDelivery: 'डिलीवरी के लिए निकला',
    deliveredSuccess: 'सफलतापूर्वक डिलीवर हुआ',

    villageConnectTitle: 'ग्राम कनेक्ट सहयोग नेटवर्क',
    villageConnectSubtitle: 'साथी कारीगरों और किसानों के साथ मिलकर वाहन साझा करें, कच्चा माल थोक में खरीदें और बड़े ऑर्डर पूरे करें।',
    postCollaboration: 'सहयोग अनुरोध पोस्ट करें',
    clusterRadius: 'क्लस्टर दायरा',
    allOpportunities: 'सभी अवसर',
    sharedVans: 'साझा इलेक्ट्रिक वाहन',
    bulkMaterials: 'कच्चे माल का थोक ऑर्डर',
    sharedMachinery: 'साझा प्रसंस्करण मशीनें',
    jointOrders: 'संयुक्त उत्पादन ऑर्डर',
    collaborateBtn: 'पहल में शामिल हों',

    supportTitle: 'किसान और कारीगर मित्र सहायता केंद्र',
    supportSubtitle: '24x7 टोल-फ्री हेल्पलाइन, व्हाट्सएप सहायता और विवाद समाधान।',
    raiseNewTicket: 'नई टिकट दर्ज करें',
    issueTopic: 'समस्या का शीर्षक',
    issueCategory: 'श्रेणी',
    issueMessage: 'समस्या का विस्तार से विवरण दें',
    phoneSupport: 'टोल-फ्री हेल्पलाइन: 1800-419-GRAM',
    submitTicket: 'टिकट जमा करें',
    ticketStatusOpen: 'सक्रिय / विचाराधीन',
    ticketStatusResolved: 'हल किया गया',

    cart: 'शॉपिंग कार्ट',
    checkout: 'तत्काल UPI चेकआउट',
    cartEmpty: 'आपकी कार्ट खाली है।',
    subtotal: 'उप-योग',
    deliveryFee: 'डाकघर ग्रामीण रिले डिलीवरी',
    freeDeliveryBadge: 'मुफ़्त सीधी डिलीवरी',
    totalAmount: 'कुल देय राशि',
    upiPayment: 'UPI द्वारा भुगतान करें (GPay, PhonePe, Paytm, BHIM)',
    scanUpiQr: 'QR कोड स्कैन करके भुगतान करें',
    verifyAndPay: 'पुष्टि करें और भुगतान करें',
    paymentSuccess: 'भुगतान सफल! एस्क्रो सक्रिय हुआ।',

    close: 'बंद करें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    save: 'सहेजें',
    loading: 'लोड हो रहा है...',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    all: 'सभी',
    roleEntrepreneur: 'कारीगर / उद्यमी',
    roleCustomer: 'ग्राहक / खरीदार',
    roleAdmin: 'हब समन्वयक (एडमिन)',
    switchRole: 'भूमिका बदलें',

    // Footer
    footerFairTradeTitle: 'प्रत्यक्ष निष्पक्ष व्यापार गारंटी',
    footerFairTradeDesc: '86%+ ग्राहक भुगतान सीधे गांव के कारीगर स्वयं सहायता समूह के खाते में जाता है।',
    footerEscrowTitle: 'तत्काल NPCI UPI एस्क्रो',
    footerEscrowDesc: 'सुरक्षित डिजिटल भुगतान, डिलीवरी पर स्वतः रिलीज, शून्य बिचौलिया कटौती।',
    footerLogisticsTitle: 'ग्रामीण नोडल लॉजिस्टिक्स',
    footerLogisticsDesc: 'भारतीय डाक ग्रामीण शाखाओं और ग्राम एक्सप्रेस इलेक्ट्रिक बेड़े के साथ साझेदारी।',
    footerHeritageTitle: 'पीढ़ी-दर-पीढ़ी विरासत',
    footerHeritageDesc: 'प्रामाणिक GI-प्रमाणित हस्तशिल्प, जैविक कृषि उत्पाद और शून्य प्लास्टिक पैकेजिंग।',
    footerMission: 'भारत के 6,50,000 गांवों को डिजिटल वाणिज्य, माइक्रो-लॉजिस्टिक्स और बहुभाषी तकनीक से सशक्त बनाना।',
    footerNodalClusters: 'प्रमुख क्लस्टर: मधुबनी · मोलेला · वायनाड · सुंदरबन · बारपेटा',
    footerTollFree: 'टोल-फ्री किसान एवं कारीगर मित्र: 1800-419-GRAM',
    footerEmail: 'helpdesk@gramsetu.org · व्हाट्सएप: +91 94310 44521',
    footerQuickLinks: 'त्वरित लिंक',
    footerCategories: 'लोकप्रिय श्रेणियां',
    footerPrograms: 'सरकारी कार्यक्रम',
    footerLegal: 'निष्पक्ष व्यापार और एस्क्रो नीति',
    footerCopyright: 'ग्रामसेतु ग्रामीण वाणिज्य मंच · भारत के लिए समर्पित',

    // Additional Marketplace & Modals
    showingProductsCount: 'सत्यापित उत्पाद',
    noProductsMatch: 'कोई उत्पाद नहीं मिला',
    noProductsSubtext: 'कृपया खोज शब्द बदलें या फ़िल्टर हटाकर पुनः प्रयास करें।',
    compareSideBySide: 'आमने-सामने तुलना करें',
    clearComparison: 'तुलना हटाएं',
    comparedBadge: 'तुलना में',
    brandLabel: 'ब्रांड',
    modelLabel: 'मॉडल',
    verifiedReviewsCount: 'सत्यापित ग्राहक समीक्षाएं',
    sendMessageToSeller: 'कारीगर / विक्रेता को संदेश भेजें',
    reportSuspiciousListing: 'संदिग्ध उत्पाद की रिपोर्ट करें',
    sendDirectMessage: 'उत्पादक को सीधा संदेश भेजें',
    messageSellerDesc: 'कस्टमाइज़ेशन, थोक ऑर्डर या शिल्प के बारे में सीधे उत्पादक से पूछें।',
    submitReportBtn: 'रिपोर्ट जमा करें',
    reportReasonPlaceholder: 'कारण बताएं (नक़ली, गलत तस्वीर, खराब माल आदि)...',
    wasReviewHelpful: 'मददगार',
    reportReviewBtn: 'समीक्षा रिपोर्ट करें',
    allReviewsHeading: 'ग्राहक समीक्षाएं एवं गुणवत्ता रेटिंग',
    directEscrowNotice: 'सीधा UPI एस्क्रो सुनिश्चित करता है कि 86%+ भुगतान सीधे कारीगर समूह को मिले।',

    // Additional Landing Page
    impactRegisteredArtisans: 'पंजीकृत ग्रामीण कारीगर',
    impactHubs: 'ग्रामीण संग्रहण केंद्र',
    impactRevenueShare: 'औसत उत्पादक आय हिस्सा',
    impactHappyBuyers: 'संतुष्ट जागरूक खरीदार',
    structuralChallengeBadge: 'संरचनात्मक चुनौती',
    structuralChallengeTitle: 'ग्रामीण उत्पादक उचित लाभ से वंचित क्यों रहे?',
    structuralChallengeSubtitle: 'भारत की कला और जैविक अर्थव्यवस्था करोड़ों की है, लेकिन बिचौलियों के कारण गांव के निर्माता पीछे रह जाते हैं।',
    brokenSystemTitle: 'टूटी हुई पारंपरिक व्यवस्था',
    brokenMiddlemen: 'दलालों का शोषण: बिचौलिए 50% से 70% मुनाफा रख लेते हैं और कारीगरों को मामूली मजदूरी देते हैं।',
    brokenLogistics: 'लॉजिस्टिक्स का अभाव: निजी कूरियर कंपनियां गांवों से पिकअप नहीं करती हैं।',
    brokenPayments: 'भुगतान में देरी: भुगतान के लिए 45 से 90 दिन का इंतजार करना पड़ता है।',
    brokenLanguage: 'भाषा की रुकावट: केवल अंग्रेजी के ऐप्स लाखों कुशल कारीगरों को अलग-थलग कर देते हैं।',
    gramSolutionTitle: 'ग्रामसेतु समाधान',
    solutionFairPayout: '86%+ सीधी कमाई: उपभोक्ता से कारीगर तक सीधा एस्क्रो भुगतान।',
    solutionPostalRelay: 'डाकघर नोडल रिले: पंचायत स्तर पर पार्सल एकत्र कर भारतीय डाक से डिलीवरी।',
    solutionInstantUpi: 'तत्काल UPI निपटान: पिकअप के 24 घंटे में सीधे बैंक खाते में भुगतान।',
    solutionVoiceCopilot: 'वॉइस और क्षेत्रीय मार्गदर्शक: कारीगर अपनी भाषा में बोलकर उत्पाद प्रबंधन कर सकते हैं।',
    testimonialsTitle: 'शहरी ग्राहकों और ग्रामीण संस्थाओं का अटूट विश्वास',
    testimonialsSubtitle: 'जानिए ग्रामसेतु के बारे में जागरूक खरीदारों और सहकारी समितियों की राय।',
    ctaTitle: 'भारत की सीधी ग्रामीण वाणिज्य क्रांति से जुड़ें',
    ctaSubtitle: 'चाहे आप प्रामाणिक ग्रामीण उत्पाद खरीदना चाहते हों या अपना व्यवसाय पूरे देश में ले जाना चाहते हों, ग्रामसेतु आपके लिए है।',
    ctaShopBtn: 'कारीगर बाज़ार देखें',
    ctaEnterpriseBtn: 'ग्रामीण उद्यमी के रूप में जुड़ें',
    featuredDealsBadge: 'सर्वश्रेष्ठ ऑफ़र और योजनाएं',
    featuredDealsTitle: 'गांव से सीधे विशेष डील्स',
    featuredDealsSubtitle: 'मौसमी छूट, सत्यापित कूपन कोड और सरकारी ऋण योजनाओं का लाभ उठाएं।',
    viewAllDealsBtn: 'सभी डील्स और ऑफ़र देखें',
    directVillageDelivery: 'सीधी ग्रामीण डिलीवरी',
    cartProceedToCheckout: 'सुरक्षित UPI एस्क्रो चेकआउट करें',
    welcomeBack: 'वापसी पर स्वागत है',
    consciousPatron: 'सजग ग्राहक · ग्रामीण कारीगरों का सीधा समर्थन',
    supportedVillagesCount: 'आपने इस सीज़न 3 ग्रामीण सहकारी समितियों का समर्थन किया है',
    exploreMoreCrafts: 'और अधिक ग्रामीण शिल्प देखें',
    livePostalTrackingAvailable: 'लाइव डाक एवं हब ट्रैकिंग उपलब्ध',
    browseVillageCatalog: 'हस्तनिर्मित वस्त्र, शुद्ध मसाले और मिट्टी के बर्तनों के लिए कैटलॉग देखें।',
    shopVillageMarketplace: 'ग्रामीण बाज़ार में खरीदारी करें',
    orderConsignment: 'पार्सल ट्रैकिंग संख्या',
    orderEstimatedDelivery: 'अनुमानित घर तक डिलीवरी',
    logisticsPartner: 'लॉजिस्टिक्स पार्टनर',
    deliveryAgent: 'डिलीवरी प्रतिनिधि',
    handoffOtp: 'डिलीवरी सुरक्षित OTP',
    otpInstructions: 'सामान की जांच के बाद डिलीवरी पार्टनर को OTP बताएं',
    transitMilestones: 'पार्सल परिवहन चरण',
    shipmentContents: 'पार्सल की सामग्री',
    gstReceipt: 'जीएसटी रसीद एवं चालान',
    taxInvoice: 'टैक्स चालान एवं फेयर-ट्रेड रसीद',
    reviewArtisanProduct: 'कारीगर उत्पाद की समीक्षा करें',
    thankYouFeedback: 'ग्रामीण शिल्प का समर्थन करने के लिए धन्यवाद!',
    yourRating: 'आपकी रेटिंग',
    yourReviewExperience: 'आपकी समीक्षा एवं अनुभव',
    submitVerifiedReview: 'सत्यापित समीक्षा जमा करें',
    directBankVpa: 'प्रत्यक्ष बैंक VPA',
    withdrawFunds: 'UPI खाते में निकालें',
    instantUpiTransfer: 'त्वरित बैंक ट्रांसफर',
    availableBalance: 'उपलब्ध शेष राशि',
    totalSalesRevenue: 'कुल बिक्री राजस्व',
    directCustomerOrders: 'ग्राहकों के सीधे ऑर्डर्स',
    activePatrons: 'सक्रिय जागरूक ग्राहक',
    fairProducerCut: 'कारीगर का उचित हिस्सा',
    dailyMarketIntelligence: 'ग्राम सहायक: दैनिक बाज़ार सुझाव',
    refreshInsights: 'सुझाव ताज़ा करें',
    monthlyRevenueGrowth: 'मासिक राजस्व वृद्धि',
    revenueByCategory: 'शिल्प श्रेणी अनुसार कमाई',
    advanceStatus: 'स्थिति आगे बढ़ाएं',
    markPacked: 'पैक किया गया',
    handoverToHub: 'हब को सौंपा गया',
    outForDeliveryStatus: 'डिलीवरी के लिए रवाना',
    markDelivered: 'डिलीवर किया गया',
    deliveredAndSettled: 'डिलीवर हुआ और भुगतान निपटाया',
    directInquiries: 'ग्राहकों की सीधी पूछताछ और विशेष ऑर्डर्स',
    activeConversations: 'सक्रिय बातचीत',
    verifiedBuyerBadge: 'सत्यापित खरीदार',
    typeReplyPlaceholder: 'ग्राहक को सीधा जवाब लिखें...',
    sendReplyBtn: 'संदेश भेजें',
    uploadNewProduct: 'नया ग्रामीण उत्पाद जोड़ें',
    productNamePlaceholder: 'उदा. हाथ से बुनी मधुबनी तसर सिल्क दुपट्टा',
    directFairPrice: 'सीधी उचित कीमत (₹ INR)',
    stockQuantity: 'उपलब्ध स्टॉक मात्रा',
    sellingUnit: 'बिक्री इकाई (नग, पैकेट, किलो, बोतल)',
    materialsIngredients: 'प्रयुक्त प्राकृतिक सामग्री',
    aiStoryteller: 'स्मार्ट उत्पाद कहानीकार',
    generateWithAi: 'उत्पाद विवरण तैयार करें',
    publishProductBtn: 'उत्पाद ग्रामसेतु पर प्रकाशित करें',
    schemesOfficialSupport: 'आधिकारिक सरकारी कल्याण एवं बैंकिंग सहायता · प्रत्यक्ष लाभ अंतरण (DBT)',
    schemesCollateralFree: '100% बिना गारंटी ऋण',
    schemesDisbursalDirect: 'सीधे बैंक खाते में राशि',
    schemesZeroBrokers: 'बिचौलियों की शून्य कटौती',
    listenSchemesAudio: 'किसी भी भाषा में योजना के नियम सुनें',
    stopAudio: 'ऑडियो रोकें',
    loanEmiCalculator: 'अनुदानित ऋण EMI और सब्सिडी कैलकुलेटर',
    calculateEmi: 'EMI गणना करें',
    monthlyEmi: 'अनुमानित मासिक किस्त (EMI)',
    interestSaved: 'ब्याज छूट सब्सिडी बचत',
    applySubsidyBtn: '1-क्लिक से आवेदन करें (DBT)',
    appliedSuccessfully: 'आवेदन सीधे जिला नोडल बैंक को भेज दिया गया!',
    applicantName: 'आवेदक का नाम',
    applicantPhone: 'मोबाइल नंबर / व्हाट्सएप',
    desiredLoanAmount: 'वांछित ऋण राशि (₹)',
    villageConnectHeroTitle: 'जुड़ें। संसाधन साझा करें। साथ बढ़ें।',
    villageConnectHeroDesc: 'डिलीवरी वैन, मशीनरी और थोक सामग्री साझा करने के लिए अपने क्लस्टर के कारीगरों और किसानों से जुड़ें।',
    postCollaborationBtn: 'सहयोग अनुरोध पोस्ट करें',
    activeEntrepreneursInCluster: 'आपके 25 किमी क्लस्टर में सक्रिय ग्रामीण उद्यमी',
    allOpportunitiesTag: 'सभी अवसर',
    sharedDeliveryVansTag: '🚚 साझा डिलीवरी वैन',
    bulkRawMaterialsTag: '🌾 थोक कच्चा माल',
    sharedMachineryTag: '⚙️ साझा मशीनरी एवं औजार',
    jointOrderTag: '🤝 संयुक्त ऑर्डर पूर्ति',
    interestedBtn: 'मैं इच्छुक हूँ / संपर्क करें',
    supportHelpdesk: 'ग्राम सहायक हेल्पडेस्क एवं ग्रामीण समन्वयक',
    tollFreeHelpline: 'टोल-फ्री हेल्पलाइन',
    districtNodalHubs: 'जिला नोडल सहायता केंद्र',
    raiseTicketBtn: 'सहायता टिकट बनाएं',
    ticketSubject: 'समस्या का विषय',
    ticketDetails: 'अपनी समस्या या ऑर्डर विवरण लिखें...',
    ticketReplyPlaceholder: 'हेल्पडेस्क को संदेश लिखें...',
    voiceAssistantGreeting: 'नमस्ते! मैं आपका ग्रामसेतु वॉइस सहायक हूँ।',
    voiceAssistantSubtitle: 'अपनी भाषा में उत्पाद, सरकारी योजनाएं, UPI भुगतान या ट्रैकिंग के बारे में पूछें।',
    speakOrTypePrompt: 'बोलें या सवाल टाइप करें...',
    voiceQueryEscrow: 'UPI एस्क्रो खरीदार और कारीगर की सुरक्षा कैसे करता है?',
    voiceQueryTrack: 'मेरा पार्सल GRAM-88219 ट्रैक करें',
    voiceQuerySchemes: 'पीएम विश्वकर्मा योजना के लिए कैसे आवेदन करें?',
    voiceQueryTextiles: 'मुझे असली हथकरघा साड़ियां और वस्त्र दिखाएं',
    qrScanInstructions: 'किसी भी UPI ऐप से स्कैन करें (GPay, PhonePe, Paytm, BHIM)',
    deliveryAddressLabel: 'डिलीवरी का पता और संपर्क',
    deliveryPhoneLabel: 'डिलीवरी फोन / व्हाट्सएप नंबर',
    payableTotal: 'कुल देय राशि',
    trackLiveConsignment: 'लाइव पार्सल ट्रैक करें',
    compareFeaturesBrand: 'ब्रांड और मॉडल',
    compareFeaturesCondition: 'उत्पाद की स्थिति',
    compareFeaturesRating: 'ग्राहक रेटिंग',
    compareFeaturesVillage: 'मूल गांव / क्लस्टर',
    compareFeaturesMaterials: 'प्रयुक्त सामग्री',
    compareFeaturesWarranty: 'वारंटी और गारंटी',
    compareFeaturesAction: 'त्वरित कार्रवाई',

    voiceCopilotTitle: 'ग्रामसेतु वॉइस सहायक',
    voiceCopilotSubtitle: 'परियोजनाओं, सरकारी योजनाओं, मंडी भाव या उत्पादों के बारे में पूछें',
    listenAudio: 'सुनें',
    hubPickup: 'ग्राम डाकघर केंद्र पिकअप',
    priceDropAlertActive: 'मूल्य गिरावट अलर्ट सक्रिय',
    schemesHeroTitle: 'आधिकारिक सरकारी योजनाएं और सब्सिडी',
    schemesHeroSubtitle: 'आधिकारिक पोर्टल लिंक के साथ सत्यापित केंद्रीय एवं राज्य योजनाओं का अन्वेषण करें।',
    ordersTitle: 'सीधे ग्राहक ऑर्डर्स और प्रेषण',
    ordersSubtitle: 'पैकिंग, ग्राम हब हैंडओवर और एस्क्रो भुगतान ट्रैक करें।',
    readyForInstantUpi: 'तत्काल UPI निपटान के लिए तैयार',
    pendingEscrowLabel: 'UPI एस्क्रो में सुरक्षित राशि',
    releasesUponScan: 'डाक केंद्र स्कैन पर स्वतः जारी होता है',
    lifetimeDirectEarnings: 'कुल सीधी उत्पादक आय',
    producerMarginZeroCommission: '86%+ उत्पादक हिस्सा · शून्य बिचौलिए',
    recentBankUpiSettlements: 'हाल के बैंक / UPI निपटान',
    orderDate: 'ऑर्डर दिनांक',
    sellProductsManageStock: 'उत्पाद बेचें और स्टॉक प्रबंधित करें',
    sellProductsSubtitle: 'सटीक फ़ोटो, स्थिति, वारंटी और उचित मूल्य के साथ उत्पाद जोड़ें।',
    trackOrder: 'ऑर्डर ट्रैक करें',
    verifiedQualityBadge: 'सत्यापित गुणवत्ता और मूल',
    authenticVillageProvenance: 'प्रामाणिक प्रत्यक्ष ग्राम स्रोत',
    brandModel: 'ब्रांड और मॉडल',
    condition: 'स्थिति',
    customerRatingCol: 'ग्राहक रेटिंग',
    originVillage: 'मूल गांव',
    warrantyGuaranteed: 'वारंटी और गारंटी',
    actionCol: 'त्वरित कार्रवाई'
  },

  mr: {
    appName: 'ग्रामसेतु',
    tagline: 'प्रकल्प, सरकारी योजना, बाजारभाव आणि विश्वसनीय बाजारपेठ',
    navProjects: 'प्रकल्प',
    navMarket: 'बाजारभाव',
    navMarketplace: 'उत्पादन बाजार',
    navDeals: 'डील्स आणि ऑफर्स',
    navDashboard: 'कारागीर डॅशबोर्ड',
    navCustomerPortal: 'माझे ऑर्डर्स',
    navLogistics: 'टपाल लॉजिस्टिक्स',
    navSchemes: 'सरकारी योजना',
    navVillageConnect: 'ग्राम कनेक्ट',
    navAdmin: 'ॲडमिन कन्सोल',
    navAIAssistant: 'व्हॉइस सहाय्यक',
    navSupport: 'मदत केंद्र',
    navLogin: 'लॉगिन',
    navSignup: 'नोंदणी',
    navLogout: 'बाहेर पडा',

    darkMode: 'डार्क मोड',
    lightMode: 'ब्राइट मोड',
    changeLanguage: 'भाषा बदला',
    selectLanguage: 'भाषा निवडा',

    heroBadge: 'भारतातील ६,५०,००० खेड्यांसाठी आधुनिक डिजिटल मंच',
    heroTitle: 'थेट ग्रामीण व्यापार.',
    heroHighlight: 'स्वाभिमानी समृद्धी.',
    heroSubtitle: 'ग्रामसेतु ग्रामीण कारागीर, बचत गट आणि सेंद्रिय शेतकऱ्यांना थेट शहरी ग्राहकांशी जोडतो — दलालांशिवाय विक्री, सुरक्षित UPI एस्क्रो आणि पोस्ट रिले लॉजिस्टिक्ससह.',
    exploreMarketplace: 'बाजार पहा',
    artisanDashboard: 'कारागीर डॅशबोर्ड',
    voiceAdvisor: 'व्हॉइस सल्लागार',
    govtSchemesLoans: 'सरकारी योजना आणि कर्ज (₹३ लाख - ₹५० लाख)',
    trustFairTrade: '८६%+ थेट कमाई कारागिरांच्या खात्यात',
    trustGIOrigin: '१००% अस्सल GI आणि सेंद्रिय उत्पादने',
    trustPostalRelay: 'भारतीय टपाल ग्रामीण रिले नेटवर्क',

    ecosystemHub: 'ग्रामसेतु इकोसिस्टम हब',
    liveNodalNetwork: 'थेट ग्रामीण नोडल नेटवर्क',
    activeNode: 'सक्रिय नोड',
    instantEscrow: 'त्वरित एस्क्रो',
    zeroCommission: '०% दलाल कमिशन',
    doorstepPickup: 'दारातून पार्सल उचल',
    indiaPostRelayTitle: 'भारतीय टपाल + स्पीड पोस्ट रिले',
    govtSubsidyPreApproved: 'सरकारी अनुदान पूर्व-मंजूर',
    verifiedGICert: 'प्रमाणित GI प्रमाणपत्र',
    multiLangGuide: 'बहुभाषिक व्हॉइस मार्गदर्शक',
    directEarnings: 'थेट कमाई',
    onTimeDelivery: 'वेळेवर वितरण',

    schemesBannerTitle: 'थेट प्रवेश: सरकारी व्यवसाय योजना आणि अनुदानीत कर्जे',
    schemesPreLoadedBadge: 'शोधण्याची गरज नाही · १००% पूर्व-लोड केलेले',
    exploreAllSchemes: 'सर्व योजना, नियम आणि कॅल्क्युलेटर पहा',
    applyNow: 'अर्ज करा',

    problemBadge: 'समस्या: विस्कळीत ग्रामीण बाजार',
    problemTitle: 'ग्रामीण उद्योजकांना अडचणी का येतात?',
    problemSubtitle: 'ग्रामसेतु आधी, कारागिरांना दलालांचे शोषण, पेमेंट फसवणूक आणि वाहतुकीच्या समस्यांचा सामना करावा लागत असे.',
    problem1Title: 'दलालांचे शोषण',
    problem1Desc: 'मध्यस्थ ६०-७०% नफा लाटतात आणि कारागिरांना अत्यल्प मजुरी देतात.',
    problem2Title: 'पेमेंटची असुरक्षितता',
    problem2Desc: 'सुरक्षित एस्क्रो नसल्यामुळे पैसे अडकतात किंवा बुडतात.',
    problem3Title: 'वाहतुकीचा अभाव',
    problem3Desc: 'खाजगी कुरिअर खेड्यांतून पार्सल उचलत नाहीत.',
    problem4Title: 'भाषेची अडचण',
    problem4Desc: 'केवळ इंग्रजीतील ॲप्समुळे कुशल कारागीर बाजारापासून वंचित राहतात.',

    solutionBadge: 'समाधान: ग्रामसेतु डिजिटल प्रणाली',
    solutionTitle: 'गावातील कला थेट शहरी ग्राहकांपर्यंत',
    solutionSubtitle: 'ग्रामीण भागासाठी विशेष विकसित केलेली पारदर्शक तंत्रज्ञान प्रणाली.',
    pillar1Title: 'थेट निष्पक्ष व्यापार',
    pillar1Desc: '८६%+ रक्कम थेट कारागिरांच्या बँक खात्यात जमा होते.',
    pillar2Title: 'टपाल नोडल हब',
    pillar2Desc: 'भारतीय टपाल कार्यालयांच्या सहकार्याने देशभर स्वस्त वाहतूक.',
    pillar3Title: 'त्वरित UPI एस्क्रो',
    pillar3Desc: 'पार्सल निघताच रक्कम सुरक्षितपणे मोकळी होते.',
    pillar4Title: 'स्थानिक भाषेत व्हॉइस मार्गदर्शक',
    pillar4Desc: 'मराठीत बोलून उत्पादने नोंदवा आणि व्यवसाय सांभाळा.',

    marketplaceTitle: 'थेट उत्पादक बाजार',
    marketplaceSubtitle: 'अस्सल GI-प्रमाणित हातमाग, सेंद्रिय मसाले आणि मातीची भांडी थेट ग्रामीण कारागिरांकडून खरेदी करा.',
    searchPlaceholder: 'उत्पादने, कारागीर किंवा प्रकार शोधा...',
    allCategories: 'सर्व वर्गवारी',
    catClothes: 'वस्त्र आणि पोशाख',
    catSports: 'क्रीडा साहित्य',
    catRation: 'रेशन आणि धान्य',
    catTextiles: 'हातमाग कापड',
    catSpices: 'सेंद्रिय मसाले',
    catPottery: 'टेराकोटा भांडी',
    catHoneyOils: 'मध आणि तेल',
    catBambooWood: 'बांबू आणि लाकूडकाम',
    catHandicrafts: 'पारंपरिक हस्तकला',
    sortBy: 'क्रमवारी',
    sortRelevance: 'सर्वोत्तम जुळणी',
    sortNewest: 'नवीनतम',
    sortPriceAsc: 'किंमत: कमी ते जास्त',
    sortPriceDesc: 'किंमत: जास्त ते कमी',
    sortRating: 'सर्वोत्कृष्ट रेटिंग',
    filterByCondition: 'स्थिती',
    conditionNew: 'नवीन',
    conditionLikeNew: 'नवीनसारखे',
    conditionGood: 'चांगले',
    conditionFair: 'सामान्य',
    verifiedSellersOnly: 'फक्त प्रमाणित विक्रेते',
    inStockOnly: 'उपलब्ध शिल्लक',
    priceRange: 'किंमत मर्यादा',
    clearFilters: 'फिल्टर काढा',

    addToCart: 'कार्टमध्ये टाका',
    buyNow: 'आता खरेदी करा (UPI)',
    inStock: 'उपलब्ध आहे',
    outOfStock: 'संपले',
    unitsLeft: 'नग शिल्लक',
    verifiedArtisan: 'प्रमाणित ग्रामीण कारागीर',
    giCertifiedBadge: 'GI प्रमाणित',
    authenticityGuaranteed: '१००% अस्सल हमी',
    viewDetails: 'तपशील पहा',
    imageUnavailable: 'चित्र उपलब्ध नाही',
    clickToZoom: 'मोठे करून पाहण्यासाठी फिरवा',
    fullScreenGallery: 'संपूर्ण फोटो दालन',
    specifications: 'उत्पादन तपशील',
    warranty: 'हमी आणि वॉरंटी',
    returnPolicy: 'परतावा धोरण',
    defectsNotice: 'हस्तनिर्मित वैशिष्ट्य सूचना',
    artisanStoryTitle: 'कारागिराची यशोगाथा',
    materialsUsed: 'वापरलेला कच्चा माल',
    fairTradeShareNotice: '८६%+ थेट कमाईची हमी',
    contactSeller: 'विक्रेत्याशी संपर्क',
    compareProduct: 'तुलना करा',
    reportListing: 'तक्रार नोंदवा',

    productReviews: 'ग्राहक अभिप्राय आणि रेटिंग',
    writeReview: 'अभिप्राय लिहा',
    customerRatingBreakdown: 'गुणवत्ता तपशील',
    overallRating: 'एकूण रेटिंग',
    qualityRating: 'उत्पादन दर्जा',
    durabilityRating: 'टिकाऊपणा',
    valueRating: 'किंमतीचे मूल्य',
    sellerRating: 'विक्रेता अनुभव',
    verifiedBuyer: 'प्रमाणित खरेदीदार',
    helpfulCount: 'उपयुक्त',
    markHelpful: 'उपयुक्त',
    reportReview: 'अभिप्राय तक्रार',
    uploadReviewPhoto: 'फोटो जोडा (पर्यायी)',
    submitReview: 'अभिप्राय पाठवा',
    reviewPlaceholder: 'तुमचा प्रामाणिक अनुभव लिहा...',
    noReviewsYet: 'अजून अभिप्राय नाही. पहिले खरेदीदार व्हा!',

    dealsTitle: 'सर्वोत्तम योजना, ऑफर्स आणि डील्स',
    dealsSubtitle: 'गावातील कारागिरांकडून थेट सत्यापित सवलती आणि कूपन कोड.',
    dealsBadge: 'सत्यापित सवलती',
    verifiedDealsOnly: 'फक्त सत्यापित डील्स',
    discountFilterAll: 'सर्व डील्स',
    discount20: '२०%+ सूट',
    discount30: '३०%+ सूट',
    discount50: '५०%+ महाबचत',
    copyCoupon: 'कोड कॉपी करा',
    couponCopied: 'कोड कॉपी झाला!',
    validUntil: 'अंतिम मुदत',
    originalPriceLabel: 'मूळ किंमत',
    offerPriceLabel: 'सवलत किंमत',
    savingsLabel: 'बचत',
    minOrderLabel: 'किमान ऑर्डर मूल्य',

    compareTitle: 'उत्पादन तुलना',
    compareSubtitle: 'दर्जा, किंमत आणि हमीची तुलना करून योग्य खरेदी करा.',
    compareEmpty: 'तुलनेसाठी कोणतेही उत्पादन निवडलेले नाही.',
    removeComparison: 'काढा',
    featureTitle: 'वैशिष्ट्ये',

    dashboardOverview: 'आढावा',
    dashboardInventory: 'इन्व्हेंटरी',
    dashboardOrders: 'ऑर्डर्स',
    dashboardAnalytics: 'विक्री आकडेवारी',
    totalSales: 'एकूण विक्री',
    monthlyRevenue: 'मासिक उत्पन्न',
    orders: 'एकूण ऑर्डर्स',
    activeCustomers: 'नियमित ग्राहक',
    addProduct: 'उत्पादन जोडा',
    editProduct: 'बदल करा',
    deleteProduct: 'काढून टाका',
    pauseListing: 'थांबवा',
    activateListing: 'सुरू करा',
    stockAvailable: 'शिल्लक साठा',
    lowStockAlert: 'कमी साठा इशारा',
    payoutAccount: 'बँक खाते',
    escrowSecured: 'एस्क्रो सुरक्षित',
    buyerEnquiries: 'ग्राहक संदेश',
    uploadProductPhotos: 'फोटो अपलोड करा',
    productTitleLabel: 'नाव',
    productBrandLabel: 'ब्रँड',
    productModelLabel: 'मॉडेल',
    productPriceLabel: 'किंमत (₹)',
    productConditionLabel: 'स्थिती',
    productWarrantyLabel: 'हमी',

    myOrders: 'माझे ऑर्डर्स',
    noOrdersYet: 'अजून कोणतेही ऑर्डर्स नाहीत. बाजार पहा!',
    downloadInvoice: 'बिल डाऊनलोड करा',
    cancelOrder: 'ऑर्डर रद्द करा',
    requestReturn: 'परतावा विनंती',
    trackConsignment: 'थेट टपाल ट्रॅकिंग',
    orderCancelled: 'ऑर्डर रद्द झाली आहे.',
    returnRequested: 'परतावा विनंती नोंदवली.',

    adminTitle: 'ग्रामसेतु ॲडमिन कन्सोल',
    adminSubtitle: 'प्रणाली व्यवस्थापन, वापरकर्ता सुरक्षा आणि उत्पादनांची तपासणी.',
    totalUsers: 'एकूण वापरकर्ते',
    activeUsers: 'सक्रिय सत्रे',
    lastLogin: 'शेवटचे लॉगिन',
    neverLoggedIn: 'कधीही लॉगिन नाही',
    lastLoginUnknown: 'लॉगिन अज्ञात',
    inactiveStatus: 'निष्क्रिय (>३० दिवस)',
    successfulLogins: 'यशस्वी लॉगिन',
    failedAttempts: 'अयशस्वी प्रयत्न',
    accountStatus: 'खाते स्थिती',
    suspendAccount: 'खाते निलंबित करा',
    reactivateAccount: 'पुन्हा सुरू करा',
    auditTrail: 'सुरक्षा ऑडिट ट्रेल',
    productModeration: 'उत्पादन तपासणी',
    reportedListings: 'तक्रार आलेली उत्पादने',
    flaggedReviews: 'तपासणी अभिप्राय',
    approveListing: 'मंजूर करा',
    pauseListingAdmin: 'थांबवा',

    logisticsTitle: 'टपाल रिले ट्रॅकिंग',
    logisticsSubtitle: 'भारतीय टपाल आणि वाहनांचे थेट जीपीएस ट्रॅकिंग.',
    trackPlaceholder: 'ट्रॅकिंग क्रमांक टाका...',
    consignmentDetails: 'पार्सल माहिती',
    indiaPostRelay: 'टपाल केंद्र',
    deliveryOtp: 'डिलिव्हरी OTP',
    inTransit: 'वाटेत आहे',
    outForDelivery: 'डिलिव्हरीसाठी निघाले',
    deliveredSuccess: 'यशस्वी वितरण झाले',

    villageConnectTitle: 'ग्राम कनेक्ट नेटवर्क',
    villageConnectSubtitle: 'गावातील कारागिरांसोबत एकत्र येऊन कच्चा माल खरेदी करा आणि विक्री वाढवा.',
    postCollaboration: 'सहकार्य विनंती पाठवा',
    clusterRadius: 'परिसर',
    allOpportunities: 'सर्व संधी',
    sharedVans: 'सामायिक वाहने',
    bulkMaterials: 'घाऊक कच्चा माल',
    sharedMachinery: 'सामायिक यंत्रे',
    jointOrders: 'संयुक्त ऑर्डर्स',
    collaborateBtn: 'सहभागी व्हा',

    supportTitle: 'शेतकरी आणि कारागीर मदत केंद्र',
    supportSubtitle: '२४x७ विनामूल्य मदत क्रमांक आणि तक्रार निवारण.',
    raiseNewTicket: 'नवीन तक्रार नोंदवा',
    issueTopic: 'विषय',
    issueCategory: 'प्रवर्ग',
    issueMessage: 'तपशीलवार समस्या लिहा',
    phoneSupport: 'टोल-फ्री: १८००-४१९-GRAM',
    submitTicket: 'पाठवा',
    ticketStatusOpen: 'सक्रिय',
    ticketStatusResolved: 'निराकरण झाले',

    cart: 'खरेदी कार्ट',
    checkout: 'UPI चेकआउट',
    cartEmpty: 'तुमची कार्ट रिकामी आहे.',
    subtotal: 'एकूण रक्कम',
    deliveryFee: 'टपाल वितरण शुल्क',
    freeDeliveryBadge: 'विनामूल्य थेट वितरण',
    totalAmount: 'देय रक्कम',
    upiPayment: 'UPI द्वारे पेमेंट करा (GPay, PhonePe, Paytm, BHIM)',
    scanUpiQr: 'QR कोड स्कॅन करा',
    verifyAndPay: 'खात्री करून पेमेंट करा',
    paymentSuccess: 'पेमेंट यशस्वी! एस्क्रो सुरू झाले.',

    close: 'बंद करा',
    cancel: 'रद्द करा',
    confirm: 'खात्री करा',
    save: 'जतन करा',
    loading: 'लोड होत आहे...',
    search: 'शोधा',
    filter: 'फिल्टर',
    all: 'सर्व',
    roleEntrepreneur: 'कारागीर / उद्योजक',
    roleCustomer: 'ग्राहक',
    roleAdmin: 'ॲडमिन',
    switchRole: 'भूमिका बदला',

    // Footer
    footerFairTradeTitle: 'थेट निष्पक्ष व्यापार हमी',
    footerFairTradeDesc: '८६%+ ग्राहक पेमेंट थेट गावातील कारागीर बचत गटाच्या खात्यात जमा होते.',
    footerEscrowTitle: 'त्वरित NPCI UPI एस्क्रो',
    footerEscrowDesc: 'सुरक्षित डिजिटल पेमेंट, वितरणावर स्वयंचलित सुटका आणि शून्य दलाल कपात.',
    footerLogisticsTitle: 'ग्रामीण नोडल लॉजिस्टिक्स',
    footerLogisticsDesc: 'भारतीय टपाल ग्रामीण शाखा आणि ग्राम एक्सप्रेस इलेक्ट्रिक वाहनांसोबत भागीदारी.',
    footerHeritageTitle: 'पारंपरिक वारसा',
    footerHeritageDesc: 'अस्सल GI-प्रमाणित हस्तकला, सेंद्रिय कृषी उत्पादने आणि प्लॅस्टिकमुक्त पॅकिंग.',
    footerMission: 'भारतातील ६,५०,००० खेड्यांना डिजिटल वाणिज्य आणि तंत्रज्ञानाने सक्षम करणे.',
    footerNodalClusters: 'प्रमुख केंद्रे: मधुबनी · मोलेला · वायनाड · सुंदरबन · बारपेटा',
    footerTollFree: 'टोल-फ्री शेतकरी व कारागीर मित्र: १८००-४१९-GRAM',
    footerEmail: 'helpdesk@gramsetu.org · व्हॉट्सॲप: +९१ ९४३१० ४४५२१',
    footerQuickLinks: 'महत्त्वाच्या लिंक्स',
    footerCategories: 'लोकप्रिय वर्गवारी',
    footerPrograms: 'सरकारी उपक्रम',
    footerLegal: 'निष्पक्ष व्यापार धोरण',
    footerCopyright: 'ग्रामसेतु ग्रामीण वाणिज्य मंच · भारतासाठी समर्पित',

    // Additional Marketplace & Modals
    showingProductsCount: 'प्रमाणित उत्पादने',
    noProductsMatch: 'कोणतेही उत्पादन सापडले नाही',
    noProductsSubtext: 'कृपया शोध शब्द बदला किंवा इतर वर्गवारी पहा.',
    compareSideBySide: 'आमने-सामने तुलना करा',
    clearComparison: 'तुलना काढा',
    comparedBadge: 'तुलनेत आहे',
    brandLabel: 'ब्रँड',
    modelLabel: 'मॉडेल',
    verifiedReviewsCount: 'प्रमाणित ग्राहक अभिप्राय',
    sendMessageToSeller: 'कारागिराला संदेश पाठवा',
    reportSuspiciousListing: 'संशयास्पद उत्पादनाची तक्रार करा',
    sendDirectMessage: 'उत्पादकाला थेट संदेश पाठवा',
    messageSellerDesc: 'कस्टमायझेशन, घाऊक ऑर्डर किंवा उत्पादनाबाबत थेट कारागिराला विचारा.',
    submitReportBtn: 'तक्रार नोंदवा',
    reportReasonPlaceholder: 'कारण लिहा (खोटे, चुकीचा फोटो, खराब माल इत्यादी)...',
    wasReviewHelpful: 'उपयुक्त',
    reportReviewBtn: 'अभिप्राय तक्रार',
    allReviewsHeading: 'ग्राहक अभिप्राय आणि गुणवत्ता रेटिंग',
    directEscrowNotice: 'थेट UPI एस्क्रोमुळे ८६%+ रक्कम थेट कारागीर समूहाला मिळते.',

    // Additional Landing Page
    impactRegisteredArtisans: 'नोंदणीकृत ग्रामीण कारागीर',
    impactHubs: 'ग्रामीण संकलन केंद्रे',
    impactRevenueShare: 'सरासरी उत्पादक वाटा',
    impactHappyBuyers: 'समाधानी ग्राहक',
    structuralChallengeBadge: 'संरचनात्मक आव्हान',
    structuralChallengeTitle: 'ग्रामीण उत्पादक नफ्यापासून वंचित का?',
    structuralChallengeSubtitle: 'भारताची कला आणि सेंद्रिय अर्थव्यवस्था मोठी आहे, परंतु दलालांमुळे कारागिरांपर्यंत नफा पोहोचत नव्हता.',
    brokenSystemTitle: 'अपुरा जुना मार्ग',
    brokenMiddlemen: 'दलालांचे शोषण: मध्यस्थ ५० ते ७०% नफा स्वतःकडे ठेवतात.',
    brokenLogistics: 'वाहतुकीचा अभाव: खाजगी कुरिअर ग्रामीण भागातून पार्सल उचलत नाहीत.',
    brokenPayments: 'पेमेंटला उशीर: कारागिरांना पैशांसाठी महिनोन्महिने थांबावे लागते.',
    brokenLanguage: 'भाषेची अडचण: इंग्रजी ॲप्समुळे कुशल ग्रामीण लोक बाहेर फेकले जातात.',
    gramSolutionTitle: 'ग्रामसेतु चे समाधान',
    solutionFairPayout: '८६%+ थेट कमाई: ग्राहकाकडून थेट कारागिराला एस्क्रो पेमेंट.',
    solutionPostalRelay: 'टपाल नोडल रिले: गावातील टपाल कार्यालयांमधून थेट पार्सल उचल.',
    solutionInstantUpi: 'त्वरित UPI जमा: २४ तासांत थेट बँक खात्यात रक्कम जमा.',
    solutionVoiceCopilot: 'स्थानिक भाषेत व्हॉइस सहाय्य: स्वतःच्या भाषेत बोलून व्यवसाय सांभाळा.',
    testimonialsTitle: 'शहरी ग्राहक आणि संस्थांचा विश्वास',
    testimonialsSubtitle: 'ग्रामसेतु बद्दल जागरूक खरेदीदार काय म्हणतात ते ऐका.',
    ctaTitle: 'भारताच्या थेट ग्रामीण व्यापार क्रांतीत सहभागी व्हा',
    ctaSubtitle: 'तुम्हाला अस्सल ग्रामीण वस्तू खरेदी करायच्या असतील किंवा व्यवसाय वाढवायचा असेल, ग्रामसेतु तुमच्या पाठीशी आहे.',
    ctaShopBtn: 'कारागीर बाजार पहा',
    ctaEnterpriseBtn: 'उद्योजक म्हणून सामील व्हा',
    featuredDealsBadge: 'सर्वोत्तम ऑफर्स आणि योजना',
    featuredDealsTitle: 'थेट गावातून खास डील्स',
    featuredDealsSubtitle: 'सवलती, सत्यापित कूपन कोड आणि सरकारी कर्ज योजनांचा लाभ घ्या.',
    viewAllDealsBtn: 'सर्व डील्स आणि ऑफर्स पहा',
    directVillageDelivery: 'थेट गावातून वितरण',
    cartProceedToCheckout: 'सुरक्षित UPI एस्क्रो चेकआउट',
    welcomeBack: 'पुन्हा स्वागत आहे',
    consciousPatron: 'जागरूक ग्राहक · ग्रामीण कारागिरांना थेट पाठिंबा',
    supportedVillagesCount: 'तुम्ही या हंगामात 3 ग्रामीण सहकारी संस्थांना पाठिंबा दिला आहे',
    exploreMoreCrafts: 'आणखी ग्रामीण हस्तकला पहा',
    livePostalTrackingAvailable: 'थेट टपाल आणि केंद्र ट्रॅकिंग उपलब्ध',
    browseVillageCatalog: 'हातमाग वस्त्रे, मसाले आणि मातीच्या भांड्यांसाठी थेट कॅटलॉग पहा.',
    shopVillageMarketplace: 'ग्रामीण बाजारात खरेदी करा',
    orderConsignment: 'पार्सल ट्रॅकिंग क्रमांक',
    orderEstimatedDelivery: 'अंदाजे घरपोच वितरण',
    logisticsPartner: 'लॉजिस्टिक्स भागीदार',
    deliveryAgent: 'वितरण प्रतिनिधी',
    handoffOtp: 'वितरण सुरक्षित OTP',
    otpInstructions: 'वस्तू तपासल्यानंतर वितरण प्रतिनिधीला OTP द्या',
    transitMilestones: 'पार्सल वाहतूक टप्पे',
    shipmentContents: 'पार्सल मधील वस्तू',
    gstReceipt: 'जीएसटी पावती आणि बीजक',
    taxInvoice: 'कर बीजक आणि फेअर-ट्रेड पावती',
    reviewArtisanProduct: 'उत्पादनाचे पुनरावलोकन करा',
    thankYouFeedback: 'ग्रामीण कलेला पाठिंबा दिल्याबद्दल धन्यवाद!',
    yourRating: 'तुमचे रेटिंग',
    yourReviewExperience: 'तुमचा अनुभव व पुनरावलोकन',
    submitVerifiedReview: 'सत्यापित पुनरावलोकन सादर करा',
    directBankVpa: 'थेट बँक VPA',
    withdrawFunds: 'UPI खात्यात पैसे काढा',
    instantUpiTransfer: 'त्वरित बँक ट्रान्सफर',
    availableBalance: 'शिल्लक रक्कम',
    totalSalesRevenue: 'एकूण विक्री महसूल',
    directCustomerOrders: 'ग्राहकांचे थेट ऑर्डर्स',
    activePatrons: 'सक्रिय जागरूक ग्राहक',
    fairProducerCut: 'उत्पादकाचा रास्त हिस्सा',
    dailyMarketIntelligence: 'ग्राम सहाय्यक: दैनंदिन बाजार सल्ले',
    refreshInsights: 'सल्ले ताजे करा',
    monthlyRevenueGrowth: 'मासिक महसूल वाढ',
    revenueByCategory: 'शिल्प प्रकारानुसार कमाई',
    advanceStatus: 'स्थिती पुढे न्या',
    markPacked: 'पॅक केले',
    handoverToHub: 'केंद्राकडे सुपूर्द केले',
    outForDeliveryStatus: 'वितरणासाठी बाहेर',
    markDelivered: 'वितरित झाले',
    deliveredAndSettled: 'वितरित झाले आणि व्यवहार पूर्ण',
    directInquiries: 'ग्राहकांची थेट चौकशी आणि खास ऑर्डर्स',
    activeConversations: 'सक्रिय संभाषणे',
    verifiedBuyerBadge: 'सत्यापित खरेदीदार',
    typeReplyPlaceholder: 'ग्राहकाला थेट उत्तर लिहा...',
    sendReplyBtn: 'संदेश पाठवा',
    uploadNewProduct: 'नवीन ग्रामीण उत्पादन जोडा',
    productNamePlaceholder: 'उदा. हातमाग पैठणी साडी किंवा बांबू हस्तकला',
    directFairPrice: 'थेट रास्त किंमत (₹ INR)',
    stockQuantity: 'उपलब्ध साठा संख्या',
    sellingUnit: 'विक्री एकक (नग, पॅकेट, किलो, बाटली)',
    materialsIngredients: 'वापरलेले नैसर्गिक साहित्य',
    aiStoryteller: 'स्मार्ट उत्पादन कथाकार',
    generateWithAi: 'उत्पादन माहिती तयार करा',
    publishProductBtn: 'उत्पादन ग्रामसेतु वर प्रकाशित करा',
    schemesOfficialSupport: 'अधिकृत सरकारी कल्याण व बँकिंग पाठबळ · थेट लाभ हस्तांतरण (DBT)',
    schemesCollateralFree: '100% विनातारण कर्ज',
    schemesDisbursalDirect: 'थेट बँक खात्यात रक्कम',
    schemesZeroBrokers: 'दलालांची शून्य कपात',
    listenSchemesAudio: 'कोणत्याही भाषेत योजनांचे नियम ऐका',
    stopAudio: 'ऑडिओ थांबवा',
    loanEmiCalculator: 'अनुदानित कर्ज हप्ता आणि सबसिडी गणक',
    calculateEmi: 'हप्ता गणना करा',
    monthlyEmi: 'अंदाजे मासिक हप्ता (EMI)',
    interestSaved: 'व्याज सवलत सबसिडी बचत',
    applySubsidyBtn: '1-क्लिकमध्ये अर्ज करा (DBT)',
    appliedSuccessfully: 'अर्ज थेट जिल्हा नोडल बँकेकडे पाठवला गेला!',
    applicantName: 'अर्जदाराचे नाव',
    applicantPhone: 'मोबाईल क्रमांक / व्हॉट्सअॅप',
    desiredLoanAmount: 'अपेक्षित कर्ज रक्कम (₹)',
    villageConnectHeroTitle: 'जोडा. संसाधने एकत्र करा. एकत्र वाढा.',
    villageConnectHeroDesc: 'वाहतूक वॅन, यंत्रसामग्री आणि कच्चा माल सामायिक करण्यासाठी आपल्या परिसरातील कारागिरांशी जोडा.',
    postCollaborationBtn: 'सहकार्य विनंती पोस्ट करा',
    activeEntrepreneursInCluster: 'तुमच्या 25 किमी परिसरातील सक्रिय उद्योजक',
    allOpportunitiesTag: 'सर्व संधी',
    sharedDeliveryVansTag: '🚚 सामायिक वाहतूक वॅन',
    bulkRawMaterialsTag: '🌾 घाऊक कच्चा माल',
    sharedMachineryTag: '⚙️ सामायिक यंत्रसामग्री',
    jointOrderTag: '🤝 संयुक्त ऑर्डर पूर्तता',
    interestedBtn: 'मी उत्सुक आहे / संपर्क करा',
    supportHelpdesk: 'ग्राम सहाय्यक मदत केंद्र आणि ग्रामीण समन्वयक',
    tollFreeHelpline: 'टोल-फ्री हेल्पलाइन',
    districtNodalHubs: 'जिल्हा नोडल मदत केंद्र',
    raiseTicketBtn: 'मदत तिकीट तयार करा',
    ticketSubject: 'समस्येचा विषय',
    ticketDetails: 'तुमची समस्या किंवा ऑर्डर तपशील लिहा...',
    ticketReplyPlaceholder: 'मदत केंद्राला संदेश लिहा...',
    voiceAssistantGreeting: 'नमस्ते! मी तुमचा ग्रामसेतु व्हॉइस सहाय्यक आहे.',
    voiceAssistantSubtitle: 'तुमच्या भाषेत उत्पादने, सरकारी योजना, UPI व्यवहार किंवा ट्रॅकिंगबद्दल विचारा.',
    speakOrTypePrompt: 'बोला किंवा प्रश्न टाईप करा...',
    voiceQueryEscrow: 'UPI एस्क्रो खरेदीदार आणि कारागिरांचे संरक्षण कसे करते?',
    voiceQueryTrack: 'माझे पार्सल GRAM-88219 ट्रॅक करा',
    voiceQuerySchemes: 'पीएम विश्वकर्मा योजनेसाठी अर्ज कसा करावा?',
    voiceQueryTextiles: 'मला अस्सल हातमाग साड्या आणि वस्त्रे दाखवा',
    qrScanInstructions: 'कोणत्याही UPI ॲपने स्कॅन करा (GPay, PhonePe, Paytm, BHIM)',
    deliveryAddressLabel: 'वितरण पत्ता आणि संपर्क',
    deliveryPhoneLabel: 'वितरण फोन / व्हॉट्सअॅप क्रमांक',
    payableTotal: 'एकूण देय रक्कम',
    trackLiveConsignment: 'थेट पार्सल ट्रॅक करा',
    compareFeaturesBrand: 'ब्रँड आणि मॉडेल',
    compareFeaturesCondition: 'उत्पादनाची स्थिती',
    compareFeaturesRating: 'ग्राहक रेटिंग',
    compareFeaturesVillage: 'मूळ गाव / परिसर',
    compareFeaturesMaterials: 'वापरलेले साहित्य',
    compareFeaturesWarranty: 'हमी आणि गॅरंटी',
    compareFeaturesAction: 'त्वरित कृती',

    voiceCopilotTitle: 'ग्रामसेतु व्हॉइस सहाय्यक',
    voiceCopilotSubtitle: 'प्रकल्प, सरकारी योजना, बाजारभाव किंवा उत्पादनांबद्दल विचारा',
    listenAudio: 'ऐका',
    hubPickup: 'ग्रामीण टपाल केंद्र पिकअप',
    priceDropAlertActive: 'किंमत घट अलर्ट सक्रिय',
    schemesHeroTitle: 'अधिकृत सरकारी योजना आणि अनुदाने',
    schemesHeroSubtitle: 'अधिकृत संकेतस्थळांसह सत्यापित केंद्र व राज्य योजना पहा.',
    ordersTitle: 'थेट ग्राहक ऑर्डर्स आणि प्रेषण',
    ordersSubtitle: 'पॅकिंग, हब सुपूर्दगी आणि एस्क्रो पेमेंट ट्रॅक करा.',
    readyForInstantUpi: 'त्वरित UPI सेटलमेंटसाठी तयार',
    pendingEscrowLabel: 'UPI एस्क्रोमध्ये सुरक्षित रक्कम',
    releasesUponScan: 'टपाल केंद्र स्कॅननंतर आपोआप जमा होते',
    lifetimeDirectEarnings: 'एकूण थेट उत्पादक कमाई',
    producerMarginZeroCommission: '86%+ उत्पादक हिस्सा · शून्य मध्यस्थ',
    recentBankUpiSettlements: 'अलीकडील बँक / UPI सेटलमेंट्स',
    orderDate: 'ऑर्डर दिनांक',
    sellProductsManageStock: 'उत्पादने विका आणि साठा व्यवस्थापित करा',
    sellProductsSubtitle: 'अचूक फोटो, स्थिती, हमी आणि योग्य किमतीसह उत्पादने जोडा.',
    trackOrder: 'ऑर्डर ट्रॅक करा',
    verifiedQualityBadge: 'सत्यापित गुणवत्ता आणि मूळ',
    authenticVillageProvenance: 'अस्सल ग्रामीण उत्पादक स्रोत',
    brandModel: 'ब्रँड आणि मॉडेल',
    condition: 'स्थिती',
    customerRatingCol: 'ग्राहक रेटिंग',
    originVillage: 'मूळ गाव',
    warrantyGuaranteed: 'हमी आणि गॅरंटी',
    actionCol: 'त्वरित कृती'
  },

  gu: {
    appName: 'ગ્રામસેતુ',
    tagline: 'પ્રોજેક્ટ્સ, સરકારી યોજનાઓ, બજાર ભાવ અને વિશ્વસનીય બજાર',
    navProjects: 'પ્રોજેક્ટ્સ',
    navMarket: 'બજાર ભાવ',
    navMarketplace: 'ઉત્પાદન બજાર',
    navDeals: 'ડીલ્સ અને ઑફર્સ',
    navDashboard: 'કારીગર ડેશબોર્ડ',
    navCustomerPortal: 'મારા ઓર્ડર્સ',
    navLogistics: 'ટપાલ લોજિસ્ટિક્સ',
    navSchemes: 'સરકારી યોજનાઓ',
    navVillageConnect: 'ગ્રામ કનેક્ટ',
    navAdmin: 'એડમિન કન્સોલ',
    navAIAssistant: 'વોઇસ સહાયક',
    navSupport: 'સહાયતા કેન્દ્ર',
    navLogin: 'લોગિન',
    navSignup: 'નોંધણી',
    navLogout: 'લોગઆઉટ',

    darkMode: 'ડાર્ક મોડ',
    lightMode: 'બ્રાઇટ મોડ',
    changeLanguage: 'ભાષા બદલો',
    selectLanguage: 'ભાષા પસંદ કરો',

    heroBadge: "ભારતના ૬,૫૦,૦૦૦ ગામો માટે આધુનિક ડિજિટલ મંચ",
    heroTitle: 'સીધો ગ્રામીણ વેપાર.',
    heroHighlight: 'સ્વાભિમાની સમૃદ્ધિ.',
    heroSubtitle: 'ગ્રામસેતુ ગ્રામીણ કારીગરો, સ્વ-સહાય જૂથો અને કુદરતી ખેડૂતોને સીધા શહેરી ગ્રાહકો સાથે જોડે છે — દલાલો વગર, સુરક્ષિત UPI એસ્ક્રો અને પોસ્ટલ રીલે સાથે.',
    exploreMarketplace: 'બજાર જુઓ',
    artisanDashboard: 'કારીગર ડેશબોર્ડ',
    voiceAdvisor: 'વોઇસ સલાહકાર',
    govtSchemesLoans: 'સરકારી યોજનાઓ અને ધિરાણ (₹૩ લાખ - ₹૫૦ લાખ)',
    trustFairTrade: '૮૬%+ કમાણી સીધી કારીગરોના ખાતામાં',
    trustGIOrigin: '૧૦૦% અસલ GI અને ઓર્ગેનિક ઉત્પાદનો',
    trustPostalRelay: 'ભારતીય ટપાલ ગ્રામીણ રીલે નેટવર્ક',

    ecosystemHub: 'ગ્રામસેતુ ઇકોસિસ્ટમ હબ',
    liveNodalNetwork: 'લાઇવ ગ્રામીણ નોડલ નેટવર્ક',
    activeNode: 'સક્રિય નોડ',
    instantEscrow: 'ત્વરિત એસ્ક્રો',
    zeroCommission: '૦% દલાલી',
    doorstepPickup: 'ઘરેથી પાર્સલ પિકઅપ',
    indiaPostRelayTitle: 'ભારતીય ટપાલ + સ્પીડ પોસ્ટ રીલે',
    govtSubsidyPreApproved: 'સરકારી સબસિડી પૂર્વ-મંજૂર',
    verifiedGICert: 'પ્રમાણિત GI પ્રમાણપત્ર',
    multiLangGuide: 'બહુભાષી વોઇસ માર્ગદર્શક',
    directEarnings: 'સીધી કમાણી',
    onTimeDelivery: 'સમયસર ડિલિવરી',

    schemesBannerTitle: 'સીધો પ્રવેશ: સરકારી બિઝનેસ યોજનાઓ અને સબસિડી લોન',
    schemesPreLoadedBadge: 'શોધવાની જરૂર નથી · ૧૦૦% પહેલેથી લોડ',
    exploreAllSchemes: 'બધી યોજનાઓ, નિયમો અને કેલ્ક્યુલેટર જુઓ',
    applyNow: 'અરજી કરો',

    problemBadge: 'સમસ્યા: ગ્રામીણ સપ્લાય ચેઇનની ખામી',
    problemTitle: 'ગ્રામીણ સાહસિકો શા માટે પાછળ રહે છે?',
    problemSubtitle: 'ગ્રામસેતુ પહેલાં, કારીગરો દલાલોનું શોષણ અને પરિવહનની મુશ્કેલીઓનો સામનો કરતા હતા.',
    problem1Title: 'દલાલોનું શોષણ',
    problem1Desc: 'મધ્યસ્થીઓ ૬૦-૭૦% નફો લઈ જાય છે અને કારીગરોને ઓછી મજૂરી આપે છે.',
    problem2Title: 'કુરિયરની ગેરહાજરી',
    problem2Desc: 'ખાનગી કુરિયર ગામડાઓમાંથી પાર્સલ ઉપાડતા નથી.',
    problem3Title: 'પેમેન્ટમાં વિલંબ',
    problem3Desc: 'મહિનાઓ સુધી પેમેન્ટ ન મળવાથી કારીગરો દેવામાં ફસાય છે.',
    problem4Title: 'ભાષાની મુશ્કેલી',
    problem4Desc: 'માત્ર અંગ્રેજી એપ્લિકેશનોને કારણે સ્થાનિક કારીગરો બહાર રહી જાય છે.',

    solutionBadge: 'ઉકેલ: ગ્રામસેતુ ઓપરેટિંગ સિસ્ટમ',
    solutionTitle: 'ગામની કલા સીધી શહેરી ગ્રાહકો સુધી',
    solutionSubtitle: 'ગ્રામીણ પરિસ્થિતિઓ, પ્રાદેશિક ભાષાઓ અને ટપાલ નેટવર્ક માટે ખાસ રચાયેલ સિસ્ટમ.',
    pillar1Title: 'સીધો વ્યાજબી વેપાર',
    pillar1Desc: '૮૬%+ રકમ સીધી કારીગરોના બેંક ખાતામાં જમા થાય છે.',
    pillar2Title: 'ટપાલ નોડલ હબ',
    pillar2Desc: 'ગામની પોસ્ટ ઓફિસો સાથે મળીને દેશભરમાં સસ્તી ડિલિવરી.',
    pillar3Title: 'ત્વરિત UPI એસ્ક્રો',
    pillar3Desc: 'ડિસ્પેચ થતાં જ રકમ સુરક્ષિત રીતે છૂટી થાય છે.',
    pillar4Title: 'ગુજરાતીમાં વોઇસ માર્ગદર્શક',
    pillar4Desc: 'પોતાની ભાષામાં બોલીને ઉત્પાદનો મેનેજ કરો.',

    marketplaceTitle: 'સીધું ઉત્પાદક બજાર',
    marketplaceSubtitle: 'અસલ GI-પ્રમાણિત હેન્ડલૂમ, ઓર્ગેનિક મસાલા અને માટીકામ સીધા ગામના કારીગરો પાસેથી મેળવો.',
    searchPlaceholder: 'ઉત્પાદનો, કારીગર અથવા પ્રકાર શોધો...',
    allCategories: 'બધી કેટેગરી',
    catClothes: 'કપડાં અને પોશાક',
    catSports: 'રમતગમત સાધનો',
    catRation: 'અનાજ અને કરિયાણું',
    catTextiles: 'હેન્ડલૂમ કાપડ',
    catSpices: 'ઓર્ગેનિક મસાલા',
    catPottery: 'ટેરાકોટા માટીકામ',
    catHoneyOils: 'મધ અને તેલ',
    catBambooWood: 'વાંસ અને લાકડાકામ',
    catHandicrafts: 'પરંપરાગત હસ્તકલા',
    sortBy: 'ક્રમબદ્ધ કરો',
    sortRelevance: 'શ્રેષ્ઠ મેળ',
    sortNewest: 'નવા ઉત્પાદનો',
    sortPriceAsc: 'કિંમત: ઓછી થી વધુ',
    sortPriceDesc: 'કિંમત: વધુ થી ઓછી',
    sortRating: 'ઉચ્ચ રેટિંગ',
    filterByCondition: 'સ્થિતિ',
    conditionNew: 'એકદમ નવું',
    conditionLikeNew: 'નવા જેવું',
    conditionGood: 'સારું',
    conditionFair: 'સામાન્ય',
    verifiedSellersOnly: 'માત્ર ચકાસાયેલ વિક્રેતા',
    inStockOnly: 'સ્ટોકમાં ઉપલબ્ધ',
    priceRange: 'કિંમત શ્રેણી',
    clearFilters: 'ફિલ્ટર હટાવો',

    addToCart: 'કાર્ટમાં ઉમેરો',
    buyNow: 'હમણાં ખરીદો (UPI)',
    inStock: 'સ્ટોકમાં છે',
    outOfStock: 'સ્ટોક ખલાસ',
    unitsLeft: 'નંગ બાકી',
    verifiedArtisan: 'પ્રમાણિત ગ્રામીણ કારીગર',
    giCertifiedBadge: 'GI પ્રમાણિત',
    authenticityGuaranteed: '૧૦૦% અસલ ઉત્પાદન',
    viewDetails: 'વિગતો જુઓ',
    imageUnavailable: 'ફોટો ઉપલબ્ધ નથી',
    clickToZoom: 'ઝૂમ કરવા માટે માઉસ ફેરવો',
    fullScreenGallery: 'સંપૂર્ણ ફોટો ગેલેરી',
    specifications: 'ઉત્પાદન વિગતો',
    warranty: 'વોરંટી અને ગેરંટી',
    returnPolicy: 'રીટર્ન પોલિસી',
    defectsNotice: 'હસ્તનિર્મિત ગુણવત્તા સૂચના',
    artisanStoryTitle: 'કારીગરની વાર્તા અને વારસો',
    materialsUsed: 'વપરાયેલ કાચો માલ',
    fairTradeShareNotice: '૮૬%+ સીધી કારીગર કમાણીની ગેરંટી',
    contactSeller: 'વિક્રેતાનો સંપર્ક કરો',
    compareProduct: 'સરખામણી કરો',
    reportListing: 'ફરિયાદ નોંધાવો',

    productReviews: 'ગ્રાહક સમીક્ષાઓ અને રેટિંગ',
    writeReview: 'સમીક્ષા લખો',
    customerRatingBreakdown: 'ગુણવત્તા વિગતો',
    overallRating: 'કુલ રેટિંગ',
    qualityRating: 'ઉત્પાદન ગુણવત્તા',
    durabilityRating: 'ટકાઉપણું',
    valueRating: 'કિંમતનું મૂલ્ય',
    sellerRating: 'વિક્રેતા અનુભવ',
    verifiedBuyer: 'પ્રમાણિત ખરીદદાર',
    helpfulCount: 'ઉપયોગી',
    markHelpful: 'ઉપયોગી',
    reportReview: 'સમીક્ષાની ફરિયાદ',
    uploadReviewPhoto: 'વાસ્તવિક ફોટો જોડો (વૈકલ્પિક)',
    submitReview: 'સમીક્ષા મોકલો',
    reviewPlaceholder: 'તમારો સાચો અનુભવ લખો...',
    noReviewsYet: 'હજુ કોઈ સમીક્ષા નથી. પ્રથમ ખરીદદાર બનો!',

    dealsTitle: 'શ્રેષ્ઠ યોજનાઓ, ઑફર્સ અને ડીલ્સ',
    dealsSubtitle: 'ગામના કારીગરો પાસેથી સીધી ચકાસાયેલ વાજબી છૂટ અને કૂપન કોડ.',
    dealsBadge: 'ચકાસાયેલ સીધી છૂટ',
    verifiedDealsOnly: 'માત્ર ચકાસાયેલ ડીલ્સ',
    discountFilterAll: 'બધી ડીલ્સ',
    discount20: '૨૦%+ છૂટ',
    discount30: '૩૦%+ છૂટ',
    discount50: '૫૦%+ સુપર ડીલ્સ',
    copyCoupon: 'કોડ કોપી કરો',
    couponCopied: 'કોડ કોપી થઈ ગયો!',
    validUntil: 'માન્યતા તારીખ',
    originalPriceLabel: 'મૂળ કિંમત',
    offerPriceLabel: 'ડીલ કિંમત',
    savingsLabel: 'બચત',
    minOrderLabel: 'લઘુત્તમ ઓર્ડર મૂલ્ય',

    compareTitle: 'ઉત્પાદન સરખામણી',
    compareSubtitle: 'ગુણવત્તા, કિંમત અને વોરંટી સરખાવીને યોગ્ય નિર્ણય લો.',
    compareEmpty: 'સરખામણી માટે કોઈ ઉત્પાદન પસંદ કરેલ નથી.',
    removeComparison: 'હટાવો',
    featureTitle: 'વિગત',

    dashboardOverview: 'ઓવરવ્યૂ',
    dashboardInventory: 'મારી ઇન્વેન્ટરી',
    dashboardOrders: 'ઓર્ડર્સ',
    dashboardAnalytics: 'વેચાણ આંકડા',
    totalSales: 'કુલ વેચાણ',
    monthlyRevenue: 'માસિક આવક',
    orders: 'કુલ ઓર્ડર્સ',
    activeCustomers: 'નિયમિત ગ્રાહકો',
    addProduct: 'ઉત્પાદન ઉમેરો',
    editProduct: 'ફેરફાર કરો',
    deleteProduct: 'હટાવી દો',
    pauseListing: 'અટકાવો',
    activateListing: 'શરૂ કરો',
    stockAvailable: 'હાજર સ્ટોક',
    lowStockAlert: 'ઓછા સ્ટોકની ચેતવણી',
    payoutAccount: 'બેંક એકાઉન્ટ',
    escrowSecured: 'એસ્ક્રો સુરક્ષિત',
    buyerEnquiries: 'ગ્રાહક સંદેશાઓ',
    uploadProductPhotos: 'ફોટા અપલોડ કરો',
    productTitleLabel: 'નામ',
    productBrandLabel: 'બ્રાન્ડ',
    productModelLabel: 'મોડેલ',
    productPriceLabel: 'કિંમત (₹)',
    productConditionLabel: 'સ્થિતિ',
    productWarrantyLabel: 'વોરંટી',

    myOrders: 'મારા ઓર્ડર્સ',
    noOrdersYet: 'હજુ કોઈ ઓર્ડર નથી. બજાર જુઓ!',
    downloadInvoice: 'બિલ ડાઉનલોડ કરો',
    cancelOrder: 'ઓર્ડર રદ કરો',
    requestReturn: 'રીટર્ન વિનંતી',
    trackConsignment: 'લાઇવ ટપાલ ટ્રેકિંગ',
    orderCancelled: 'ઓર્ડર રદ થયો છે.',
    returnRequested: 'રીટર્ન વિનંતી નોંધાઈ.',

    adminTitle: 'ગ્રામસેતુ એડમિન કન્સોલ',
    adminSubtitle: 'પ્લેટફોર્મ સુરક્ષા, વપરાશકર્તા લૉગિન ઑડિટ અને ઉત્પાદન નિયંત્રણ.',
    totalUsers: 'કુલ વપરાશકર્તાઓ',
    activeUsers: 'સક્રિય સત્રો',
    lastLogin: 'છેલ્લું લૉગિન',
    neverLoggedIn: 'ક્યારેય લૉગિન નથી કર્યું',
    lastLoginUnknown: 'લૉગિન અજ્ઞાત',
    inactiveStatus: 'નિષ્ક્રિય (>૩૦ દિવસ)',
    successfulLogins: 'સફળ લૉગિન',
    failedAttempts: 'નિષ્ફળ પ્રયાસો',
    accountStatus: 'ખાતાની સ્થિતિ',
    suspendAccount: 'ખાતું સસ્પેન્ડ કરો',
    reactivateAccount: 'ખાતું પુનઃ સક્રિય કરો',
    auditTrail: 'ઑડિટ ટ્રેલ',
    productModeration: 'ઉત્પાદન નિયંત્રણ',
    reportedListings: 'ફરિયાદ થયેલ ઉત્પાદનો',
    flaggedReviews: 'ફ્લેગ કરેલી સમીક્ષાઓ',
    approveListing: 'મંજૂર કરો',
    pauseListingAdmin: 'અટકાવો',

    logisticsTitle: 'ટપાલ રીલે ટ્રેકિંગ',
    logisticsSubtitle: 'ભારતીય ટપાલ અને વાહનોનું લાઇવ જીપીએસ ટ્રેકિંગ.',
    trackPlaceholder: 'ટ્રેકિંગ નંબર દાખલ કરો...',
    consignmentDetails: 'પાર્સલ વિગતો',
    indiaPostRelay: 'ટપાલ કેન્દ્ર',
    deliveryOtp: 'ડિલિવરી OTP',
    inTransit: 'માર્ગમાં છે',
    outForDelivery: 'ડિલિવરી માટે નીકળેલ છે',
    deliveredSuccess: 'સફળતાપૂર્વક ડિલિવર થયું',

    villageConnectTitle: 'ગ્રામ કનેક્ટ નેટવર્ક',
    villageConnectSubtitle: 'સાથી કારીગરો સાથે મળીને વાહન અને સામગ્રી શેર કરો.',
    postCollaboration: 'સહકાર વિનંતી મૂકો',
    clusterRadius: 'ત્રિજ્યા',
    allOpportunities: 'તમામ તકો',
    sharedVans: 'શેર કરેલ વાહનો',
    bulkMaterials: 'કાચો માલ જથ્થાબંધ',
    sharedMachinery: 'શેર કરેલ મશીનરી',
    jointOrders: 'સંયુક્ત ઓર્ડર્સ',
    collaborateBtn: 'સહકાર આપો',

    supportTitle: 'સહાયતા અને ફરિયાદ નિવારણ',
    supportSubtitle: '૨૪x૭ ટોલ-ફ્રી હેલ્પલાઇન અને સહાયતા.',
    raiseNewTicket: 'નવી ફરિયાદ નોંધાવો',
    issueTopic: 'વિષય',
    issueCategory: 'કેટેગરી',
    issueMessage: 'સમસ્યા જણાવો',
    phoneSupport: 'ટોલ-ફ્રી: ૧૮૦૦-૪૧૯-GRAM',
    submitTicket: 'મોકલો',
    ticketStatusOpen: 'સક્રિય',
    ticketStatusResolved: 'ઉકેલાયેલ',

    cart: 'શોપિંગ કાર્ટ',
    checkout: 'UPI ચેકઆઉટ',
    cartEmpty: 'તમારી કાર્ટ ખાલી છે.',
    subtotal: 'કુલ રકમ',
    deliveryFee: 'ટપાલ ડિલિવરી ફી',
    freeDeliveryBadge: 'મફત સીધી ડિલિવરી',
    totalAmount: 'ચૂકવવાપાત્ર રકમ',
    upiPayment: 'UPI દ્વારા ચૂકવો (GPay, PhonePe, Paytm, BHIM)',
    scanUpiQr: 'QR કોડ સ્કેન કરો',
    verifyAndPay: 'ચકાસો અને ચૂકવો',
    paymentSuccess: 'પેમેન્ટ સફળ થયું! એસ્ક્રો શરૂ થયું.',

    close: 'બંધ કરો',
    cancel: 'રદ કરો',
    confirm: 'ખાતરી કરો',
    save: 'સાચવો',
    loading: 'લોડ થઈ રહ્યું છે...',
    search: 'શોધો',
    filter: 'ફિલ્ટર',
    all: 'બધું',
    roleEntrepreneur: 'કારીગર / સાહસિક',
    roleCustomer: 'ગ્રાહક',
    roleAdmin: 'એડમિન',
    switchRole: 'ભૂમિકા બદલો',

    // Footer
    footerFairTradeTitle: 'સીધો વાજબી વેપાર ગેરંટી',
    footerFairTradeDesc: '૮૬%+ ગ્રાહક પેમેન્ટ સીધા ગામના કારીગર જૂથના બેંક ખાતામાં જમા થાય છે.',
    footerEscrowTitle: 'ત્વરિત NPCI UPI એસ્ક્રો',
    footerEscrowDesc: 'સુરક્ષિત ડિજિટલ પેમેન્ટ, ડિલિવરી પર ઓટોમેટિક રીલીઝ અને કોઈ દલાલી નહીં.',
    footerLogisticsTitle: 'ગ્રામીણ નોડલ લોજિસ્ટિક્સ',
    footerLogisticsDesc: 'ભારતીય ટપાલ ગ્રામીણ શાખાઓ અને ગ્રામ એક્સપ્રેસ સાથે ભાગીદારી.',
    footerHeritageTitle: 'પરંપરાગત વારસો',
    footerHeritageDesc: 'અસલ GI-પ્રમાણિત હસ્તકલા, ઓર્ગેનિક કૃષિ ઉત્પાદનો અને પ્લાસ્ટિકમુક્ત પેકિંગ.',
    footerMission: 'ભારતના ૬,૫૦,૦૦૦ ગામોને ડિજિટલ વેપાર અને ટેકનોલોજી દ્વારા સશક્ત બનાવવા.',
    footerNodalClusters: 'મુખ્ય કેન્દ્રો: મધુબની · મોલેલા · વાયનાડ · સુંદરબન · બારપેટા',
    footerTollFree: 'ટોલ-ફ્રી કિસાન અને કારીગર મિત્ર: ૧૮૦૦-૪૧૯-GRAM',
    footerEmail: 'helpdesk@gramsetu.org · વોટ્સએપ: +૯૧ ૯૪૩૧૦ ૪૪૫૨૧',
    footerQuickLinks: 'ઝડપી લિંક્સ',
    footerCategories: 'લોકપ્રિય કેટેગરી',
    footerPrograms: 'સરકારી કાર્યક્રમો',
    footerLegal: 'વાજબી વેપાર નીતિ',
    footerCopyright: 'ગ્રામસેતુ ગ્રામીણ વેપાર મંચ · ભારત માટે સમર્પિત',

    // Additional Marketplace & Modals
    showingProductsCount: 'ચકાસાયેલ ઉત્પાદનો',
    noProductsMatch: 'કોઈ ઉત્પાદન મળ્યું નથી',
    noProductsSubtext: 'કૃપા કરીને શોધ શબ્દ બદલો અથવા અન્ય કેટેગરી જુઓ.',
    compareSideBySide: 'સામે સામે સરખામણી કરો',
    clearComparison: 'સરખામણી હટાવો',
    comparedBadge: 'સરખામણીમાં છે',
    brandLabel: 'બ્રાન્ડ',
    modelLabel: 'મોડેલ',
    verifiedReviewsCount: 'ચકાસાયેલ ગ્રાહક સમીક્ષાઓ',
    sendMessageToSeller: 'કારીગરને સંદેશ મોકલો',
    reportSuspiciousListing: 'શંકાસ્પદ ઉત્પાદનની ફરિયાદ કરો',
    sendDirectMessage: 'ઉત્પાદકને સીધો સંદેશ મોકલો',
    messageSellerDesc: 'કસ્ટમાઇઝેશન, જથ્થાબંધ ઓર્ડર અથવા ઉત્પાદન વિશે સીધું પૂછો.',
    submitReportBtn: 'ફરિયાદ મોકલો',
    reportReasonPlaceholder: 'કારણ જણાવો (નકલી, ખોટો ફોટો, ખરાબ સામાન વગેરે)...',
    wasReviewHelpful: 'ઉપયોગી',
    reportReviewBtn: 'સમીક્ષાની ફરિયાદ',
    allReviewsHeading: 'ગ્રાહક સમીક્ષાઓ અને ગુણવત્તા રેટિંગ',
    directEscrowNotice: 'સીધા UPI એસ્ક્રો દ્વારા ૮૬%+ રકમ સીધી કારીગર સમૂહને મળે છે.',

    // Additional Landing Page
    impactRegisteredArtisans: 'નોંધાયેલ ગ્રામીણ કારીગરો',
    impactHubs: 'ગ્રામીણ એકત્રીકરણ કેન્દ્રો',
    impactRevenueShare: 'સરેરાશ ઉત્પાદક હિસ્સો',
    impactHappyBuyers: 'સંતુષ્ટ ગ્રાહકો',
    structuralChallengeBadge: 'માળખાકીય પડકાર',
    structuralChallengeTitle: 'ગ્રામીણ ઉત્પાદકો નફાથી કેમ વંચિત રહ્યા?',
    structuralChallengeSubtitle: 'ભારતની કલા અને ઓર્ગેનિક અર્થતંત્ર વિશાળ છે, પરંતુ દલાલોને કારણે ગામના સર્જકો પાછળ રહી જતા હતા.',
    brokenSystemTitle: 'અપૂર્ણ પરંપરાગત સિસ્ટમ',
    brokenMiddlemen: 'દલાલોનું શોષણ: મધ્યસ્થીઓ ૫૦ થી ૭૦% નફો રાખી લે છે.',
    brokenLogistics: 'વાહનવ્યવહારનો અભાવ: ખાનગી કુરિયર ગામડાઓમાંથી પાર્સલ ઉપાડતા નથી.',
    brokenPayments: 'પેમેન્ટમાં વિલંબ: કારીગરોને નાણાં માટે મહિનાઓ રાહ જોવી પડતી.',
    brokenLanguage: 'ભાષાની અડચણ: અંગ્રેજી એપ્લિકેશનોને લીધે કુશળ કારીગરો બહાર રહી જતા.',
    gramSolutionTitle: 'ગ્રામસેતુ નો ઉકેલ',
    solutionFairPayout: '૮૬%+ સીધી કમાણી: ગ્રાહકથી સીધા કારીગર સુધી એસ્ક્રો પેમેન્ટ.',
    solutionPostalRelay: 'ટપાલ નોડલ રીલે: ગામની પોસ્ટ ઓફિસો દ્વારા સીધી ડિલિવરી.',
    solutionInstantUpi: 'ત્વરિત UPI ચુકવણી: ૨૪ કલાકમાં સીધા બેંક ખાતામાં જમા.',
    solutionVoiceCopilot: 'સ્થાનિક ભાષામાં વોઇસ સહાય: પોતાની ભાષામાં બોલીને બિઝનેસ સંભાળો.',
    testimonialsTitle: 'શહેરી ગ્રાહકો અને સંસ્થાઓનો અતૂટ વિશ્વાસ',
    testimonialsSubtitle: 'ગ્રામસેતુ વિશે જાગૃત ગ્રાહકો શું કહે છે તે સાંભળો.',
    ctaTitle: 'ભારતના સીધા ગ્રામીણ વેપાર ક્રાંતિ સાથે જોડાઓ',
    ctaSubtitle: 'તમારે અસલ ગ્રામીણ ચીજો ખરીદવી હોય કે વ્યવસાય વધારવો હોય, ગ્રામસેતુ તમારા માટે છે.',
    ctaShopBtn: 'કારીગર બજાર જુઓ',
    ctaEnterpriseBtn: 'ઉદ્યોગસાહસિક તરીકે જોડાઓ',
    featuredDealsBadge: 'શ્રેષ્ઠ ઑફર્સ અને યોજનાઓ',
    featuredDealsTitle: 'સીધા ગામમાંથી ખાસ ડીલ્સ',
    featuredDealsSubtitle: 'મોસમી છૂટ, માન્ય કૂપન કોડ અને સરકારી લોન યોજનાઓનો લાભ લો.',
    viewAllDealsBtn: 'બધી ડીલ્સ અને ઑફર્સ જુઓ',
    directVillageDelivery: 'સીધી ગ્રામીણ ડિલિવરી',
    cartProceedToCheckout: 'સુરક્ષિત UPI એસ્ક્રો ચેકઆઉટ',
    welcomeBack: 'પાછા ફરવા બદલ સ્વાગત છે',
    consciousPatron: 'જાગૃત ગ્રાહક · ગ્રામીણ કારીગરોને સીધો ટેકો',
    supportedVillagesCount: 'તમે આ સિઝનમાં 3 ગ્રામીણ મંડળીઓને ટેકો આપ્યો છે',
    exploreMoreCrafts: 'વધુ ગ્રામીણ હસ્તકલા જુઓ',
    livePostalTrackingAvailable: 'લાઈવ ટપાલ અને હબ ટ્રેકિંગ ઉપલબ્ધ',
    browseVillageCatalog: 'હાથવણાટ કાપડ, મસાલા અને માટીના વાસણો માટે સીધો કેટલોગ જુઓ.',
    shopVillageMarketplace: 'ગ્રામીણ બજારમાં ખરીદી કરો',
    orderConsignment: 'પાર્સલ ટ્રેકિંગ નંબર',
    orderEstimatedDelivery: 'અંદાજિત ઘર સુધી વિતરણ',
    logisticsPartner: 'લોજિસ્ટિક્સ પાર્ટનર',
    deliveryAgent: 'ડિલિવરી એજન્ટ',
    handoffOtp: 'ડિલિવરી સુરક્ષિત OTP',
    otpInstructions: 'સામાન ચકાસ્યા પછી ડિલિવરી પાર્ટનરને OTP આપો',
    transitMilestones: 'પાર્સલ પરિવહન તબક્કા',
    shipmentContents: 'પાર્સલમાં રહેલી વસ્તુઓ',
    gstReceipt: 'જીએસટી રસીદ અને બિલ',
    taxInvoice: 'ટેક્સ બિલ અને ફેર-ટ્રેડ રસીદ',
    reviewArtisanProduct: 'કારીગર ઉત્પાદનનો રિવ્યૂ આપો',
    thankYouFeedback: 'ગ્રામીણ હસ્તકલાને ટેકો આપવા બદલ આભાર!',
    yourRating: 'તમારું રેટિંગ',
    yourReviewExperience: 'તમારો અનુભવ અને સમીક્ષા',
    submitVerifiedReview: 'પ્રમાણિત સમીક્ષા સબમિટ કરો',
    directBankVpa: 'સીધું બેંક VPA',
    withdrawFunds: 'UPI ખાતામાં નાણાં ઉપાડો',
    instantUpiTransfer: 'ત્વરિત બેંક ટ્રાન્સફર',
    availableBalance: 'ઉપલબ્ધ બેલેન્સ',
    totalSalesRevenue: 'કુલ વેચાણ આવક',
    directCustomerOrders: 'ગ્રાહકોના સીધા ઓર્ડર્સ',
    activePatrons: 'સક્રિય જાગૃત ગ્રાહકો',
    fairProducerCut: 'ઉત્પાદકનો વાજબી હિસ્સો',
    dailyMarketIntelligence: 'ગ્રામ સહાયક: દૈનિક બજાર માર્ગદર્શન',
    refreshInsights: 'માર્ગદર્શન તાજું કરો',
    monthlyRevenueGrowth: 'માસિક આવક વૃદ્ધિ',
    revenueByCategory: 'શ્રેણી મુજબ કમાણી',
    advanceStatus: 'સ્થિતિ આગળ વધારો',
    markPacked: 'પેક કરેલ',
    handoverToHub: 'હબને સોંપેલ',
    outForDeliveryStatus: 'ડિલિવરી માટે રવાના',
    markDelivered: 'ડિલિવર થયેલ',
    deliveredAndSettled: 'ડિલિવર થયું અને ચુકવણી પૂર્ણ',
    directInquiries: 'ગ્રાહકોની સીધી પૂછપરછ અને ખાસ ઓર્ડર્સ',
    activeConversations: 'સક્રિય વાતચીત',
    verifiedBuyerBadge: 'ચકાસાયેલ ખરીદદાર',
    typeReplyPlaceholder: 'ગ્રાહકને સીધો જવાબ લખો...',
    sendReplyBtn: 'સંદેશ મોકલો',
    uploadNewProduct: 'નવું ગ્રામીણ ઉત્પાદન ઉમેરો',
    productNamePlaceholder: 'દા.ત. પાટણ પટોળા અથવા કચ્છી ભરતકામ',
    directFairPrice: 'સીધી વાજબી કિંમત (₹ INR)',
    stockQuantity: 'ઉપલબ્ધ સ્ટોક જથ્થો',
    sellingUnit: 'વેચાણ એકમ (નંગ, પેકેટ, કિલો, બોટલ)',
    materialsIngredients: 'વપરાયેલ કુદરતી સામગ્રી',
    aiStoryteller: 'સ્માર્ટ ઉત્પાદન વાર્તાકાર',
    generateWithAi: 'ઉત્પાદન વિગતો બનાવો',
    publishProductBtn: 'ઉત્પાદન ગ્રામસેતુ પર પ્રકાશિત કરો',
    schemesOfficialSupport: 'સત્તાવાર સરકારી સહાય અને બેંકિંગ ટેકો · સીધો લાભ ટ્રાન્સફર (DBT)',
    schemesCollateralFree: '100% વગર ગેરંટી લોન',
    schemesDisbursalDirect: 'સીધા બેંક ખાતામાં રકમ',
    schemesZeroBrokers: 'દલાલોની શૂન્ય કપાત',
    listenSchemesAudio: 'કોઈપણ ભાષામાં યોજનાના નિયમો સાંભળો',
    stopAudio: 'ઓડિયો બંધ કરો',
    loanEmiCalculator: 'સહાયિત લોન હપ્તો અને સબસિડી કેલ્ક્યુલેટર',
    calculateEmi: 'હપ્તાની ગણતરી કરો',
    monthlyEmi: 'અંદાજિત માસિક હપ્તો (EMI)',
    interestSaved: 'વ્યાજ છૂટ સબસિડી બચત',
    applySubsidyBtn: '1-ક્લિકમાં અરજી કરો (DBT)',
    appliedSuccessfully: 'અરજી સીધી જિલ્લા નોડલ બેંકને મોકલાઈ ગઈ!',
    applicantName: 'અરજદારનું નામ',
    applicantPhone: 'મોબાઈલ નંબર / વ્હોટ્સએપ',
    desiredLoanAmount: 'અપેક્ષિત લોન રકમ (₹)',
    villageConnectHeroTitle: 'જોડાઓ. સંસાધનો વહેંચો. સાથે આગળ વધો.',
    villageConnectHeroDesc: 'વાહનો, મશીનરી અને કાચો માલ વહેંચવા માટે તમારા વિસ્તારના કારીગરો અને ખેડૂતો સાથે જોડાઓ.',
    postCollaborationBtn: 'સહયોગ વિનંતી પોસ્ટ કરો',
    activeEntrepreneursInCluster: 'તમારા 25 કિમી વિસ્તારમાં સક્રિય સાહસિકો',
    allOpportunitiesTag: 'તમામ તકો',
    sharedDeliveryVansTag: '🚚 સંયુક્ત ડિલિવરી વાન',
    bulkRawMaterialsTag: '🌾 જથ્થાબંધ કાચો માલ',
    sharedMachineryTag: '⚙️ સંયુક્ત મશીનરી',
    jointOrderTag: '🤝 સંયુક્ત ઓર્ડર પૂર્તિ',
    interestedBtn: 'હું રસ ધરાવું છું / સંપર્ક કરો',
    supportHelpdesk: 'ગ્રામ સહાયક હેલ્પડેસ્ક અને ગ્રામીણ સંયોજકો',
    tollFreeHelpline: 'ટોલ-ફ્રી હેલ્પલાઇન',
    districtNodalHubs: 'જિલ્લા નોડલ સહાયતા કેન્દ્રો',
    raiseTicketBtn: 'સહાયતા ટિકિટ બનાવો',
    ticketSubject: 'સમસ્યાનો વિષય',
    ticketDetails: 'તમારી સમસ્યા અથવા ઓર્ડર વિગતો લખો...',
    ticketReplyPlaceholder: 'હેલ્પડેસ્કને સંદેશ લખો...',
    voiceAssistantGreeting: 'નમસ્તે! હું તમારો ગ્રામસેતુ વોઇસ સહાયક છું.',
    voiceAssistantSubtitle: 'તમારી ભાષામાં ઉત્પાદનો, સરકારી યોજનાઓ, UPI પેમેન્ટ અથવા ટ્રેકિંગ વિશે પૂછો.',
    speakOrTypePrompt: 'બોલો અથવા પ્રશ્ન ટાઈપ કરો...',
    voiceQueryEscrow: 'UPI એસ્ક્રો ખરીદદાર અને કારીગરોને કેવી રીતે રક્ષણ આપે છે?',
    voiceQueryTrack: 'મારું પાર્સલ GRAM-88219 ટ્રેક કરો',
    voiceQuerySchemes: 'પીએમ વિશ્વકર્મા યોજના માટે કેવી રીતે અરજી કરવી?',
    voiceQueryTextiles: 'મને અસલી હાથવણાટ સાડીઓ અને કાપડ બતાવો',
    qrScanInstructions: 'કોઈપણ UPI એપ વડે સ્કેન કરો (GPay, PhonePe, Paytm, BHIM)',
    deliveryAddressLabel: 'ડિલિવરી સરનામું અને સંપર્ક',
    deliveryPhoneLabel: 'ડિલિવરી ફોન / વ્હોટ્સએપ નંબર',
    payableTotal: 'કુલ ચૂકવવાપાત્ર રકમ',
    trackLiveConsignment: 'લાઈવ પાર્સલ ટ્રેક કરો',
    compareFeaturesBrand: 'બ્રાન્ડ અને મોડેલ',
    compareFeaturesCondition: 'ઉત્પાદનની સ્થિતિ',
    compareFeaturesRating: 'ગ્રાહક રેટિંગ',
    compareFeaturesVillage: 'મૂળ ગામ / ક્લસ્ટર',
    compareFeaturesMaterials: 'વપરાયેલ સામગ્રી',
    compareFeaturesWarranty: 'વોરંટી અને ગેરંટી',
    compareFeaturesAction: 'ઝડપી પગલું',

    voiceCopilotTitle: 'ગ્રામસેતુ વોઇસ સહાયક',
    voiceCopilotSubtitle: 'પ્રોજેક્ટ્સ, સરકારી યોજનાઓ, બજાર ભાવ અથવા ઉત્પાદનો વિશે પૂછો',
    listenAudio: 'સાંભળો',
    hubPickup: 'ગ્રામીણ ટપાલ કેન્દ્ર પિકઅપ',
    priceDropAlertActive: 'ભાવ ઘટાડાનું એલર્ટ સક્રિય',
    schemesHeroTitle: 'સત્તાવાર સરકારી યોજનાઓ અને સબસિડી',
    schemesHeroSubtitle: 'સત્તાવાર પોર્ટલ લિંક્સ સાથે ચકાસાયેલ કેન્દ્ર અને રાજ્ય યોજનાઓ જુઓ.',
    ordersTitle: 'સીધા ગ્રાહક ઓર્ડર્સ અને વિતરણ',
    ordersSubtitle: 'પેકિંગ, હબ સોંપણી અને એસ્ક્રો ચુકવણી ટ્રેક કરો.',
    readyForInstantUpi: 'ત્વરિત UPI પતાવટ માટે તૈયાર',
    pendingEscrowLabel: 'UPI એસ્ક્રોમાં સુરક્ષિત રકમ',
    releasesUponScan: 'ટપાલ કેન્દ્ર સ્કેન પછી આપમેળે જમા થાય છે',
    lifetimeDirectEarnings: 'કુલ સીધી ઉત્પાદક કમાણી',
    producerMarginZeroCommission: '86%+ ઉત્પાદક હિસ્સો · શૂન્ય દલાલી',
    recentBankUpiSettlements: 'તાજેતરના બેંક / UPI વ્યવહારો',
    orderDate: 'ઓર્ડર તારીખ',
    sellProductsManageStock: 'ઉત્પાદનો વેચો અને સ્ટોક સંભાળો',
    sellProductsSubtitle: 'સાચા ફોટા, સ્થિતિ, વોરંટી અને વાજબી કિંમત સાથે ઉત્પાદનો ઉમેરો.',
    trackOrder: 'ઓર્ડર ટ્રેક કરો',
    verifiedQualityBadge: 'ચકાસાયેલ ગુણવત્તા અને મૂળ',
    authenticVillageProvenance: 'અસલ ગ્રામીણ ઉત્પાદક સ્ત્રોત',
    brandModel: 'બ્રાન્ડ અને મોડેલ',
    condition: 'સ્થિતિ',
    customerRatingCol: 'ગ્રાહક રેટિંગ',
    originVillage: 'મૂળ ગામ',
    warrantyGuaranteed: 'વોરંટી અને ગેરંટી',
    actionCol: 'ઝડપી પગલું'
  }
};
