export interface UserLoginRecord {
  timestamp: string;
  status: 'success' | 'failed';
  ip: string;
  device: string;
}

export interface UserSuspensionAudit {
  action: 'suspend' | 'reactivate';
  byAdmin: string;
  reason: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'entrepreneur' | 'customer' | 'admin';
  phone: string;
  location: string;
  state: string;
  avatar: string;
  bio?: string;
  shgName?: string;
  joinedDate: string;
  registeredAt?: string;
  accountStatus: 'active' | 'suspended' | 'pending';
  lastLoginAt: string | null;
  lastLoginType: 'recent' | 'never' | 'unknown' | 'inactive';
  lastActiveAt?: string | null;
  failedLoginAttempts: number;
  successfulLoginsCount?: number;
  failedLoginsCount?: number;
  loginHistory: UserLoginRecord[];
  suspensionAuditTrail: UserSuspensionAudit[];
}

export interface ProjectCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  category: string;
  industry: string;
  businessType: string;
  locationSuitability: string;
  imageUrl: string;
  description: string;
  keywords: string[];
  requiredInvestment: string;
  estimatedSetupCost: string;
  costAssumptions: string;
  estimatedMonthlyRevenueRange?: string;
  requiredResources: string[];
  targetCustomers: string;
  revenueModel: string;
  requiredSkills: string[];
  benefits: string[];
  challenges: string[];
  relatedSchemeIds: string[];
  referenceLinks: { label: string; url: string }[];
  implementationDetails?: {
    techStack?: string[];
    frontendDetails?: string;
    backendDetails?: string;
    databaseDetails?: string;
    features?: string[];
    sourceOrDemoUrl?: string;
  };
  status: 'verified' | 'draft' | 'archived';
  verifiedSource: string;
  lastVerifiedDate: string;
  createdAt: string;
  updatedAt: string;
  matchScore?: number;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  tagline: string;
  ministry: string;
  level: 'Central' | 'State';
  state: string;
  category: string;
  schemeType: 'Loan & Credit' | 'Capital Subsidy' | 'Toolkit & Training' | 'Infrastructure' | 'Micro-Credit';
  eligibilityTarget: string;
  description: string;
  purposeBenefits: string[];
  eligibilityCriteria: string[];
  documents: string[];
  applicationProcess: string[];
  financialAssistance: string;
  maxLoanAmount: number;
  loanDisplay: string;
  tranches: string;
  interestRate: string;
  interestSubvention: string;
  subsidyGrant: string;
  collateral: string;
  deadline: string;
  status: 'active' | 'upcoming' | 'expired';
  officialUrl: string;
  officialSource: string;
  lastVerifiedDate: string;
  badge: string;
  eligibleTrades: string[];
  processingTime: string;
  updatedAt?: string;
}

export interface MarketPrice {
  id: string;
  commodityName: string;
  variety: string;
  category: string;
  marketName: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  previousPrice?: number;
  demandLevel: 'High' | 'Moderate' | 'Seasonal' | 'Unavailable';
  supplyLevel: 'Surplus' | 'Steady' | 'Tight' | 'Seasonal' | 'Unavailable';
  priceDate: string;
  dataSource: string;
  sourceUrl: string;
  isLiveApi: boolean;
  updatedAt?: string;
}

export interface ProductDocument {
  id: string;
  productId: string;
  title: string;
  docType: 'certificate' | 'specification' | 'provenance' | 'care_guide' | 'lab_report';
  issuer: string;
  verified: boolean;
  summary: string;
  url?: string;
}

export interface Product {
  id: string;
  sku?: string;
  artisanId: string;
  artisanName: string;
  artisanLocation: string;
  title: string;
  brand?: string;
  model?: string;
  category: 'clothes' | 'sports' | 'ration' | 'textiles' | 'spices' | 'pottery' | 'honey_oils' | 'bamboo_wood' | 'handicrafts' | string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  price: number;
  originalPrice?: number;
  stock: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  documents?: ProductDocument[];
  warranty?: string;
  returnPolicy?: string;
  defectsNotice?: string;
  verifiedSeller: boolean;
  sellerVerificationBadge?: string;
  authenticityStatus: 'verified' | 'unverified';
  artisanStory: string;
  materials: string[];
  inStock: boolean;
  featured: boolean;
  fairTradePercent: number;
  dealBadge?: string;
  moderationStatus?: 'approved' | 'pending' | 'reported' | 'paused';
  reportedReason?: string;
  matchScore?: number;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  artisanId?: string;
  artisanName?: string;
}

export interface Order {
  id: string;
  trackingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'UPI' | 'COD' | 'CARD';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  upiRefId?: string;
  orderStatus: 'placed' | 'packed' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'return_requested';
  cancellationReason?: string;
  returnReason?: string;
  createdAt: string;
  deliveryDateEstimated: string;
  currentHub: string;
  deliveryPartner: string;
  deliveryAgentPhone: string;
  deliveryOtp: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  qualityRating?: number;
  durabilityRating?: number;
  valueForMoneyRating?: number;
  sellerExperienceRating?: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  reviewImages?: string[];
  helpfulCount: number;
  reported?: boolean;
  reportReason?: string;
  artisanReply?: string;
}

export interface DealOffer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  couponCode: string;
  category: string;
  validUntil: string;
  terms: string;
  minOrderValue: number;
  verified: boolean;
  featuredProductIds?: string[];
}

export interface SellerMessage {
  id: string;
  productId: string;
  productTitle: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'entrepreneur';
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  role: string;
  subject: string;
  category: 'payment' | 'logistics' | 'product' | 'general';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  messages: {
    sender: 'user' | 'support';
    text: string;
    time: string;
  }[];
}

export interface UniversalSearchResult {
  query: string;
  normalizedQuery: string;
  totalCount: number;
  counts: {
    projects: number;
    products: number;
    schemes: number;
    markets: number;
  };
  results: {
    projects: Project[];
    products: Product[];
    schemes: GovernmentScheme[];
    markets: MarketPrice[];
  };
  pagination: {
    page: number;
    limit: number;
  };
}
