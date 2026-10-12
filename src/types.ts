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
  shgName?: string; // Self Help Group name
  joinedDate: string;
  accountStatus: 'active' | 'suspended' | 'pending';
  lastLoginAt: string | null;
  lastLoginType: 'recent' | 'never' | 'unknown' | 'inactive';
  lastActiveAt?: string | null;
  failedLoginAttempts: number;
  loginHistory: UserLoginRecord[];
  suspensionAuditTrail: UserSuspensionAudit[];
}

export interface Product {
  id: string;
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
  images: string[]; // Unique product image gallery associated strictly with this product ID
  description: string;
  specifications: Record<string, string>;
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
  fairTradePercent: number; // e.g. 85% goes to artisan
  dealBadge?: string;
  moderationStatus?: 'approved' | 'pending' | 'reported' | 'paused';
  reportedReason?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  artisanName: string;
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
