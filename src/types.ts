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
}

export interface Product {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanLocation: string;
  title: string;
  category: 'clothes' | 'sports' | 'ration' | 'textiles' | 'spices' | 'pottery' | 'honey_oils' | 'bamboo_wood' | 'handicrafts' | string;
  price: number;
  originalPrice?: number;
  stock: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  artisanStory: string;
  materials: string[];
  inStock: boolean;
  featured: boolean;
  fairTradePercent: number; // e.g. 85% goes to artisan
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
  orderStatus: 'placed' | 'packed' | 'dispatched' | 'out_for_delivery' | 'delivered';
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
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  artisanReply?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  category: 'finance' | 'packaging' | 'marketing' | 'schemes' | 'quality' | 'aoa_algorithms' | 'dbms_database' | 'maths_applied' | 'oop_architecture';
  duration: string;
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Core Engineering';
  summary: string;
  keyPoints: string[];
  audioScript: string;
  schemeBenefit?: string;
  instructor: string;
  icon: string;
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
