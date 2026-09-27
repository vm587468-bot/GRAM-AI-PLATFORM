import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_LEARNING_MODULES,
  INITIAL_REVIEWS,
  INITIAL_TICKETS
} from './server/seedData';
import { Product, Order, Review, SupportTicket } from './src/types';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory Database Store (with seed data)
let dbUsers = [...INITIAL_USERS];
let dbProducts: Product[] = [...INITIAL_PRODUCTS];
let dbOrders: Order[] = [...INITIAL_ORDERS];
let dbReviews: Review[] = [...INITIAL_REVIEWS];
let dbLearning = [...INITIAL_LEARNING_MODULES];
let dbTickets: SupportTicket[] = [...INITIAL_TICKETS];

// Initialize Gemini SDK with User-Agent header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper for simulated JWT tokens
function generateToken(userId: string, role: string) {
  const payload = { userId, role, timestamp: Date.now() };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(token?: string) {
  if (!token) return null;
  try {
    const raw = Buffer.from(token.replace('Bearer ', ''), 'base64').toString('utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  let user = dbUsers.find(u => u.email === email);
  if (!user && role) {
    user = dbUsers.find(u => u.role === role);
  }
  if (!user) {
    user = dbUsers[0]; // Fallback to first artisan
  }
  const token = generateToken(user.id, user.role);
  res.json({ token, user });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, role, phone, location, state, shgName } = req.body;
  const newUser = {
    id: `user-${Date.now()}`,
    name: name || 'Rural Partner',
    email: email || `user${Date.now()}@gramai.org`,
    role: role || 'entrepreneur',
    phone: phone || '+91 90000 00000',
    location: location || 'Gram Hub',
    state: state || 'Bihar',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    bio: 'Proud village entrepreneur on Gram AI platform.',
    shgName: shgName || 'Village Enterprise Group',
    joinedDate: new Date().toISOString().split('T')[0]
  };
  dbUsers.push(newUser);
  const token = generateToken(newUser.id, newUser.role);
  res.status(201).json({ token, user: newUser });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const decoded = verifyToken(authHeader);
  if (decoded && decoded.userId) {
    const user = dbUsers.find(u => u.id === decoded.userId);
    if (user) {
      return res.json({ user });
    }
  }
  // Default to primary artisan
  res.json({ user: dbUsers[0] });
});

app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  const user = dbUsers.find(u => u.role === role) || dbUsers[0];
  const token = generateToken(user.id, user.role);
  res.json({ token, user });
});

// ==================== PRODUCTS ROUTES ====================
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, artisanId } = req.query;
  let results = [...dbProducts];

  if (category && category !== 'all') {
    results = results.filter(p => p.category === category);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.artisanName.toLowerCase().includes(q) ||
      p.artisanLocation.toLowerCase().includes(q)
    );
  }
  if (artisanId) {
    results = results.filter(p => p.artisanId === artisanId);
  }

  res.json({ products: results });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = dbProducts.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const reviews = dbReviews.filter(r => r.productId === req.params.id);
  res.json({ product, reviews });
});

app.post('/api/products', (req: Request, res: Response) => {
  const body = req.body;
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    artisanId: body.artisanId || 'user-artisan-1',
    artisanName: body.artisanName || 'Sunita Devi (Mithila Shakti SHG)',
    artisanLocation: body.artisanLocation || 'Madhubani, Bihar',
    title: body.title || 'Handcrafted Rural Product',
    category: body.category || 'textiles',
    price: Number(body.price) || 500,
    originalPrice: body.originalPrice ? Number(body.originalPrice) : Number(body.price) * 1.2,
    stock: Number(body.stock) || 10,
    unit: body.unit || 'piece',
    rating: 5.0,
    reviewsCount: 0,
    imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: body.description || '',
    artisanStory: body.artisanStory || 'Directly crafted in rural workshops and verified by Gram AI cluster lead.',
    materials: Array.isArray(body.materials) ? body.materials : ['Natural Material', 'Handcrafted'],
    inStock: true,
    featured: false,
    fairTradePercent: body.fairTradePercent ? Number(body.fairTradePercent) : 86
  };
  dbProducts.unshift(newProduct);
  res.status(201).json({ product: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const index = dbProducts.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  dbProducts[index] = { ...dbProducts[index], ...req.body };
  res.json({ product: dbProducts[index] });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  dbProducts = dbProducts.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

// ==================== ORDERS & PAYMENTS ROUTES ====================
app.get('/api/orders', (req: Request, res: Response) => {
  const { customerId, artisanId } = req.query;
  let results = [...dbOrders];
  if (customerId) {
    results = results.filter(o => o.customerId === customerId);
  }
  // For entrepreneur view, filter orders containing artisan's products or return all if demo
  if (artisanId) {
    results = results.filter(o =>
      o.items.some(item => {
        const prod = dbProducts.find(p => p.id === item.productId);
        return prod?.artisanId === artisanId || item.artisanName.toLowerCase().includes('sunita');
      })
    );
    if (results.length === 0) results = dbOrders.slice(0, 5); // Fallback for smooth demo
  }
  res.json({ orders: results });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const { customerId, customerName, customerPhone, shippingAddress, items, totalAmount, paymentMethod, upiRefId } = req.body;
  const orderId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
  const trackingId = `GRAM-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: Order = {
    id: orderId,
    trackingId,
    customerId: customerId || 'user-customer-1',
    customerName: customerName || 'Valued Buyer',
    customerPhone: customerPhone || '+91 98000 00000',
    shippingAddress: shippingAddress || 'Bengaluru, India',
    items: items || [],
    totalAmount: Number(totalAmount) || 1200,
    paymentMethod: paymentMethod || 'UPI',
    paymentStatus: 'PAID',
    upiRefId: upiRefId || `UPI-GRAM-${Date.now()}`,
    orderStatus: 'placed',
    createdAt: new Date().toISOString(),
    deliveryDateEstimated: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currentHub: 'Village SHG Aggregation Node, Madhubani',
    deliveryPartner: 'Gram Express & India Post Rural Relay',
    deliveryAgentPhone: '+91 94310 44521',
    deliveryOtp: `${Math.floor(1000 + Math.random() * 9000)}`
  };

  // Reduce product stocks
  if (items && Array.isArray(items)) {
    for (const item of items) {
      const prod = dbProducts.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      }
    }
  }

  dbOrders.unshift(newOrder);
  res.status(201).json({ order: newOrder });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { orderStatus, currentHub } = req.body;
  const order = dbOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (orderStatus) order.orderStatus = orderStatus;
  if (currentHub) order.currentHub = currentHub;
  res.json({ order });
});

// ==================== UPI PAYMENT GENERATION ====================
app.post('/api/payments/create-upi', (req: Request, res: Response) => {
  const { amount, customerName, orderId } = req.body;
  const txnId = `TXN${Date.now()}`;
  const upiId = 'gramai.merchants@sbi';
  const qrString = `upi://pay?pa=${upiId}&pn=GramAI_RuralCrafts&am=${amount}&tn=Order_${orderId || 'Cart'}&cu=INR&tr=${txnId}`;

  res.json({
    txnId,
    upiId,
    qrString,
    amount,
    merchantName: 'Gram AI Village Producers Co-op',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { txnId, upiRefId } = req.body;
  res.json({
    status: 'SUCCESS',
    txnId,
    bankRef: upiRefId || `NPCI-UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    verifiedAt: new Date().toISOString(),
    escrowNote: 'Secured in Gram AI Rural Escrow. Released to artisan upon hub dispatch verification.'
  });
});

// ==================== LOGISTICS & DELIVERY TRACKING ====================
app.get('/api/deliveries/track/:trackingId', (req: Request, res: Response) => {
  const { trackingId } = req.params;
  const order = dbOrders.find(o => o.trackingId.toLowerCase() === trackingId.toLowerCase() || o.id.toLowerCase() === trackingId.toLowerCase());

  if (!order) {
    // Return sample detailed tracking for demo tracking code
    return res.json({
      trackingId,
      found: false,
      message: 'Consignment not found. Try search with sample tracking code GRAM-88219 or ORD-2026-901'
    });
  }

  // Generate realistic milestone steps based on status
  const stages = [
    {
      step: 1,
      title: 'Village SHG Origin Hub',
      location: 'Madhubani Rural Artisan Center, Bihar',
      status: 'completed',
      time: '24 Sep, 02:40 PM',
      description: 'Quality inspected, barcode stamped, and packaged using organic shock-cushion materials.'
    },
    {
      step: 2,
      title: 'District Nodal Aggregation Hub',
      location: 'Patna Central Gram Hub, Bihar',
      status: order.orderStatus === 'placed' ? 'current' : 'completed',
      time: '25 Sep, 09:15 AM',
      description: 'Consolidated with regional craft consignment. Transferred to Gram Express Relay.'
    },
    {
      step: 3,
      title: 'Interstate Transport & Air/Rail Sorting',
      location: 'Nagpur National Postal Sorting Hub',
      status: ['dispatched', 'out_for_delivery', 'delivered'].includes(order.orderStatus) ? 'completed' : order.orderStatus === 'packed' ? 'current' : 'pending',
      time: '26 Sep, 07:30 PM',
      description: 'Container batch sealed with tamper-evident digital tag.'
    },
    {
      step: 4,
      title: 'Destination City Last-Mile Hub',
      location: order.currentHub || 'Bengaluru East Distribution Hub, Indiranagar',
      status: ['out_for_delivery', 'delivered'].includes(order.orderStatus) ? (order.orderStatus === 'delivered' ? 'completed' : 'current') : 'pending',
      time: '27 Sep, 08:00 AM',
      description: 'Assigned to local delivery associate. Delivery OTP generated.'
    },
    {
      step: 5,
      title: 'Delivery to Customer Doorstep',
      location: order.shippingAddress,
      status: order.orderStatus === 'delivered' ? 'completed' : 'pending',
      time: order.orderStatus === 'delivered' ? '27 Sep, 11:30 AM' : 'Estimated 28 Sep',
      description: order.orderStatus === 'delivered' ? 'Delivered successfully. Payment confirmed directly to artisan.' : 'Awaiting OTP handoff at recipient address.'
    }
  ];

  res.json({
    found: true,
    order,
    stages,
    partner: {
      name: order.deliveryPartner,
      vehicle: 'BR-06-EA-4912 (Eco EV Van)',
      agent: order.deliveryAgentPhone,
      otp: order.deliveryOtp
    }
  });
});

// ==================== LEARNING & REVIEWS ====================
app.get('/api/learning', (_req: Request, res: Response) => {
  res.json({ modules: dbLearning });
});

app.get('/api/reviews', (req: Request, res: Response) => {
  const { productId } = req.query;
  let results = dbReviews;
  if (productId) {
    results = results.filter(r => r.productId === productId);
  }
  res.json({ reviews: results });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { productId, userId, userName, rating, comment } = req.body;
  const newRev: Review = {
    id: `rev-${Date.now()}`,
    productId,
    userId: userId || 'user-customer-1',
    userName: userName || 'Satisfied Patron',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    rating: Number(rating) || 5,
    comment: comment || 'Wonderful traditional item, direct from village artisan!',
    date: new Date().toISOString().split('T')[0],
    verifiedPurchase: true
  };
  dbReviews.unshift(newRev);

  // Update product rating
  const prod = dbProducts.find(p => p.id === productId);
  if (prod) {
    const prodReviews = dbReviews.filter(r => r.productId === productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    prod.rating = Number(avg.toFixed(1));
    prod.reviewsCount = prodReviews.length;
  }

  res.status(201).json({ review: newRev });
});

// ==================== SUPPORT TICKETS ====================
app.get('/api/support/tickets', (_req: Request, res: Response) => {
  res.json({ tickets: dbTickets });
});

app.post('/api/support/tickets', (req: Request, res: Response) => {
  const { userId, userName, role, subject, category, message } = req.body;
  const newTicket: SupportTicket = {
    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: userId || 'user-artisan-1',
    userName: userName || 'Sunita Devi',
    role: role || 'entrepreneur',
    subject: subject || 'Help needed with Gram AI portal',
    category: category || 'general',
    status: 'open',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    messages: [
      {
        sender: 'user',
        text: message || 'I need help with my dispatch tracking.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  };
  dbTickets.unshift(newTicket);
  res.status(201).json({ ticket: newTicket });
});

app.post('/api/support/tickets/:id/reply', (req: Request, res: Response) => {
  const ticket = dbTickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  const { text, sender } = req.body;
  ticket.messages.push({
    sender: sender || 'user',
    text: text || '',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  res.json({ ticket });
});

// ==================== ANALYTICS DASHBOARD ====================
app.get('/api/analytics/overview', (_req: Request, res: Response) => {
  const totalSales = 284500;
  const totalOrders = dbOrders.length + 184;
  const activeCustomers = 142;
  const growthRate = 24.5;

  const monthlyReports = [
    { month: 'Apr', revenue: 28000, orders: 24, artisans: 12 },
    { month: 'May', revenue: 34500, orders: 29, artisans: 16 },
    { month: 'Jun', revenue: 41200, orders: 36, artisans: 21 },
    { month: 'Jul', revenue: 52000, orders: 44, artisans: 25 },
    { month: 'Aug', revenue: 61800, orders: 53, artisans: 28 },
    { month: 'Sep', revenue: 67000, orders: 58, artisans: 32 }
  ];

  const categoryPerformance = [
    { name: 'Textiles & Handloom', sales: 112000, share: 39, growth: '+28%' },
    { name: 'Organic Spices & Turmeric', sales: 68400, share: 24, growth: '+34%' },
    { name: 'Terracotta & Pottery', sales: 46200, share: 16, growth: '+18%' },
    { name: 'Wild Honey & Cold-Pressed Oils', sales: 38900, share: 14, growth: '+21%' },
    { name: 'Bamboo & Wood Craft', sales: 19000, share: 7, growth: '+15%' }
  ];

  res.json({
    kpis: {
      totalSales,
      totalOrders,
      activeCustomers,
      growthRate,
      averageOrderValue: Math.round(totalSales / totalOrders),
      onTimeDeliveryRate: 99.2,
      artisanFairCutAverage: '86%'
    },
    monthlyReports,
    categoryPerformance
  });
});

// ==================== GEMINI AI ENDPOINTS ====================
// 1. AI Business Assistant Chat (Gram Sahayak AI)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history, language = 'English', role = 'entrepreneur' } = req.body;

  try {
    const systemPrompt = `You are "Gram Sahayak AI" (ग्राम सहायक), an expert business advisor, market intelligence copilot, and mentor dedicated to rural Indian entrepreneurs, village self-help groups (SHGs), traditional craftspeople, and organic farmers.
Your tone is deeply respectful, warm, encouraging, practical, and grounded in rural realities.
You provide clear, actionable business advice covering:
1. Pricing handmade & agricultural products (accounting for raw materials, manual labor hours, fair profit margins).
2. Packaging fragile craft items (terracotta, glass, textiles) using low-cost eco-friendly farm waste like banana fibre or rice husks.
3. Logistics and inter-state dispatch tips through India Post Rural Nodal & Gram Express.
4. Government schemes in India (PM Vishwakarma, PM Mudra, NABARD SHG-Bank Linkage, Stand-Up India, FSSAI registration, GI Tagging).
5. Festive marketing strategies (Diwali, Pongal, Durga Puja, Rakhi) and social commerce selling (WhatsApp catalogs).
6. Explaining financial terms (escrow, zero MDR UPI, working capital) in simple, accessible language.

Language requirement: Provide your main response in ${language}. If requested in Hindi, use natural, conversational Hindi with clear Roman/Devanagari explanations.
Always include 2-3 specific, actionable steps the artisan can take today.`;

    let conversationText = '';
    if (Array.isArray(history)) {
      conversationText = history.slice(-6).map((h: any) => `${h.sender === 'user' ? 'Artisan' : 'Gram Sahayak'}: ${h.text}`).join('\n');
    }

    const fullPrompt = `${conversationText ? conversationText + '\n' : ''}Artisan question: "${message}"\n\nPlease answer concisely and practically.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({
      reply: response.text || 'Namaste! I am here to help you grow your village enterprise with fair prices, safe shipping, and direct customers.'
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: 'AI service unavailable right now.',
      reply: `Namaste! Here is a proven recommendation: For rural crafts, calculate price as (Raw materials + ₹80/hr labor + 25% profit margin). Also, utilize PM Vishwakarma toolkit subsidies for modern equipment!`
    });
  }
});

// 2. AI Product Description Generator
app.post('/api/ai/generate-description', async (req: Request, res: Response) => {
  const { title, category, materials, artisanLocation, language = 'English' } = req.body;

  try {
    const prompt = `Craft a compelling, authentic e-commerce product description for a rural artisan/farmer product:
Product: ${title}
Category: ${category}
Materials/Ingredients: ${materials}
Village Origin: ${artisanLocation}
Target Audience: Urban conscious buyers seeking 100% authentic, ethical, handmade/organic goods.

Return response in valid JSON with these keys:
- "catchyTitle": an elegant title celebrating origin and authenticity
- "story": a warm, vivid 2-3 sentence artisan provenance story highlighting cultural heritage and positive village impact
- "features": array of 4 bullet points (e.g. natural dyes, non-toxic, handmade by SHG)
- "suggestedPrice": realistic recommended price in INR (number)
- "fairTradeNote": transparent explanation of why this pricing is ethical and how 85%+ reaches the producer directly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an ethical e-commerce copywriter celebrating Indian rural crafts and organic farming.',
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('AI description error:', err);
    res.json({
      catchyTitle: `Authentic Handcrafted ${title}`,
      story: `Lovingly handcrafted in ${artisanLocation || 'rural India'} using generational techniques passed down through families. Every purchase directly sustains village self-help groups with zero middleman deductions.`,
      features: [
        '100% genuine natural origin and ethical labor',
        'Directly inspected and stamped at Gram AI village hub',
        'Eco-friendly biodegradable packaging',
        'Fair-trade verified directly to artisan account'
      ],
      suggestedPrice: 850,
      fairTradeNote: '86% of this sale goes directly into the artisan SHG bank account via instant UPI.'
    });
  }
});

// 3. AI Daily Business Tips
app.post('/api/ai/business-tips', async (req: Request, res: Response) => {
  const { category = 'textiles', season = 'Festive Autumn' } = req.body;

  try {
    const prompt = `Give 3 timely, high-impact business tips for a rural Indian artisan selling ${category} during the current season (${season}).
Focus on practical advice:
1. Demand trends in metros (e.g. natural dyes, corporate gifting, sustainable packaging)
2. Stock preparation & packaging advice
3. How to take high-quality mobile photos under natural morning sunlight to sell faster.

Keep it crisp, actionable, and formatted cleanly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a rural business growth mentor.'
      }
    });

    res.json({ tips: response.text });
  } catch (err) {
    res.json({
      tips: `1. **Festive Corporate Gifting:** Metro companies are ordering sustainable craft hampers. Bundle small items together for higher order value.\n2. **Natural Sunlight Photography:** Take product photos outside between 8 AM and 10 AM on a plain white khadi cloth to show true natural colors.\n3. **Early Stock Buffer:** Ship fragile items to the district hub at least 5 days before peak festival rush to avoid courier delays.`
    });
  }
});

// ==================== VITE & STATIC FILES SETUP ====================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Gram AI Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
