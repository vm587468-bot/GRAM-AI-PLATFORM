import { User, Product, Order, LearningModule, SupportTicket, Review } from '../src/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-artisan-1',
    name: 'Sunita Devi',
    email: 'sunita@gramai.org',
    role: 'entrepreneur',
    phone: '+91 98234 56789',
    location: 'Madhubani District',
    state: 'Bihar',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    bio: 'Master artisan in Madhubani traditional hand-painted Tussar silk & cotton textiles, leader of Mithila Women Self-Help Group (28 weavers).',
    shgName: 'Mithila Shakti SHG',
    joinedDate: '2024-03-12'
  },
  {
    id: 'user-artisan-2',
    name: 'Rameshwar Rathore',
    email: 'rameshwar@gramai.org',
    role: 'entrepreneur',
    phone: '+91 94140 23411',
    location: 'Molela Village, Rajsamand',
    state: 'Rajasthan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    bio: 'Fourth generation terracotta craftsman specializing in organic earthenware, clay cooking handis, and terracotta water coolers.',
    shgName: 'Mitti Shilp Samiti',
    joinedDate: '2024-01-18'
  },
  {
    id: 'user-customer-1',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    role: 'customer',
    phone: '+91 98112 34567',
    location: 'Indiranagar, Bengaluru',
    state: 'Karnataka',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    bio: 'Eco-conscious design enthusiast passionate about supporting direct rural artisanal communities.',
    joinedDate: '2024-05-10'
  },
  {
    id: 'user-admin-1',
    name: 'Pooja Venkatesh',
    email: 'pooja.admin@gramai.org',
    role: 'admin',
    phone: '+91 98450 11223',
    location: 'Regional Hub HQ, Patna',
    state: 'Bihar',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    bio: 'Gram AI Village Cluster Development Officer & Quality Assurance Lead.',
    joinedDate: '2023-11-01'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    artisanId: 'user-artisan-1',
    artisanName: 'Sunita Devi (Mithila Shakti SHG)',
    artisanLocation: 'Madhubani, Bihar',
    title: 'Hand-Painted Madhubani Tussar Silk Dupatta',
    category: 'textiles',
    price: 1850,
    originalPrice: 2400,
    stock: 14,
    unit: 'piece',
    rating: 4.9,
    reviewsCount: 38,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Exquisite 100% natural Tussar silk dupatta featuring authentic Kohbar and peacock motifs painstakingly hand-painted using natural vegetable dyes, twig brushes, and nib pens.',
    artisanStory: 'Sunita learned Madhubani art from her grandmother. By selling directly through Gram AI, her SHG of 28 village women now earns 3x more than they did through local commission brokers.',
    materials: ['Pure Tussar Silk', 'Natural Indigo', 'Turmeric Pigments', 'Lampblack'],
    inStock: true,
    featured: true,
    fairTradePercent: 86
  },
  {
    id: 'prod-2',
    artisanId: 'user-artisan-2',
    artisanName: 'Rameshwar Rathore',
    artisanLocation: 'Molela, Rajasthan',
    title: 'Handcrafted Terracotta Clay Biryani & Curd Pot (2.5L)',
    category: 'pottery',
    price: 680,
    originalPrice: 850,
    stock: 22,
    unit: 'pot with lid',
    rating: 4.8,
    reviewsCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    description: 'Naturally unglazed, kiln-baked traditional clay handi. Enriches food with calcium, magnesium, and natural earthy aroma while ensuring non-toxic, slow alkaline cooking.',
    artisanStory: 'Rameshwar sources clay from the local riverbed of Banas. Each pot is hand-turned on a wooden potter wheel and seasoned with natural rice starch before firing.',
    materials: ['Organic Banas River Clay', 'Mica flakes', 'Rice starch seasoning'],
    inStock: true,
    featured: true,
    fairTradePercent: 88
  },
  {
    id: 'prod-3',
    artisanId: 'user-artisan-3',
    artisanName: 'Vasantha Rao & Co-op',
    artisanLocation: 'Wayanad, Kerala',
    title: 'Wayanad High-Curcumin Raw Organic Turmeric (500g)',
    category: 'spices',
    price: 340,
    originalPrice: 420,
    stock: 45,
    unit: '500g pack',
    rating: 5.0,
    reviewsCount: 64,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    description: 'Certified organic, solar sun-dried heirloom turmeric powder with over 6.2% verified lab curcumin content. Grown in shade under Western Ghats canopy without chemical inputs.',
    artisanStory: 'A collective of 40 tribal farmers in Wayanad practicing zero-budget natural farming. Gram AI guarantees direct farm-gate collection with immediate UPI payment.',
    materials: ['100% Curcuma Longa', 'Zero preservatives', 'Non-irradiated'],
    inStock: true,
    featured: true,
    fairTradePercent: 84
  },
  {
    id: 'prod-4',
    artisanId: 'user-artisan-4',
    artisanName: 'Biren Mondal',
    artisanLocation: 'Sundarbans Biosphere, West Bengal',
    title: 'Wild Mangrove Raw Forest Honey (400g Glass Jar)',
    category: 'honey_oils',
    price: 520,
    originalPrice: 650,
    stock: 19,
    unit: '400g jar',
    rating: 4.9,
    reviewsCount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    description: 'Unprocessed, unfiltered multi-floral raw nectar harvested sustainably by traditional Mouli foragers from wild Apis dorsata honeycombs in coastal mangrove forests.',
    artisanStory: 'Mouli honey-gatherers face extreme challenges in the delta. Direct selling enables safety insurance funds, eco-friendly protective gear, and living wages for 15 families.',
    materials: ['Pure Wild Mangrove Nectar', 'Natural pollen grains', 'Raw & Unpasteurized'],
    inStock: true,
    featured: false,
    fairTradePercent: 82
  },
  {
    id: 'prod-5',
    artisanId: 'user-artisan-5',
    artisanName: 'Hemant Boro',
    artisanLocation: 'Barpeta, Assam',
    title: 'Woven Golden Bamboo Storage Basket with Lid',
    category: 'bamboo_wood',
    price: 790,
    originalPrice: 990,
    stock: 16,
    unit: 'piece',
    rating: 4.7,
    reviewsCount: 21,
    imageUrl: 'https://images.unsplash.com/photo-1595079672139-5470805087e2?auto=format&fit=crop&w=800&q=80',
    description: 'Fine split-cane bamboo basket intricately hand-woven with interlocking geometric lattice. Treated naturally against wood-borers using smoked sal leaves.',
    artisanStory: 'Bamboo craft is an indigenous heritage of the Bodo community. Gram AI logistics has opened metro gifting and decor markets across Mumbai and Bangalore.',
    materials: ['Seasoned Assam Golden Bamboo', 'Natural vegetable polish'],
    inStock: true,
    featured: true,
    fairTradePercent: 87
  },
  {
    id: 'prod-6',
    artisanId: 'user-artisan-6',
    artisanName: 'Santosh Devi (Kutch Weavers)',
    artisanLocation: 'Bhuj, Gujarat',
    title: 'Kutch Kala Cotton Handwoven Throw Blanket',
    category: 'textiles',
    price: 2100,
    originalPrice: 2600,
    stock: 9,
    unit: 'piece (60x80 in)',
    rating: 5.0,
    reviewsCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80',
    description: 'Rain-fed indigenous Kala cotton woven on pit-looms with organic plant-based madder root and indigo dyes. Breathable, durable, and gets softer with every wash.',
    artisanStory: 'Kala cotton requires zero chemical fertilizers or synthetic pesticides. It supports local dryland pastoralists and weaver families in the arid Rann of Kutch.',
    materials: ['100% Rainfed Kala Cotton', 'Madder Root', 'Natural Indigo'],
    inStock: true,
    featured: false,
    fairTradePercent: 85
  },
  {
    id: 'prod-7',
    artisanId: 'user-artisan-7',
    artisanName: 'Maniram Gurjar',
    artisanLocation: 'Alwar, Rajasthan',
    title: 'Cold-Pressed Wood-Ghani Mustard Oil (1 Litre)',
    category: 'honey_oils',
    price: 290,
    originalPrice: 350,
    stock: 35,
    unit: '1L glass bottle',
    rating: 4.9,
    reviewsCount: 47,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    description: 'Extracted slowly at room temperature using a traditional bull-driven wooden pestle (Kachi Ghani). Retains all natural pungency, antioxidants, and Omega-3 fatty acids.',
    artisanStory: 'Smallholder farmers in Mewat region cooperative. No chemical refining, no bleaching, no artificial flavoring — pure farm-fresh culinary heritage.',
    materials: ['100% Pure Black Mustard Seeds', 'Single cold press'],
    inStock: true,
    featured: false,
    fairTradePercent: 89
  },
  {
    id: 'prod-8',
    artisanId: 'user-artisan-8',
    artisanName: 'Nagaswamy Gowda',
    artisanLocation: 'Channapatna, Karnataka',
    title: 'Non-Toxic Vegetable Lacquer Wooden Balancing Game',
    category: 'bamboo_wood',
    price: 640,
    originalPrice: 799,
    stock: 25,
    unit: 'set of 12 blocks',
    rating: 4.8,
    reviewsCount: 33,
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-turned Ivory Wood (Wrightia tinctoria) coated with natural tree resin lacquer mixed with turmeric, kumkum, and indigo colors. 100% child-safe and biodegradable.',
    artisanStory: 'Channapatna toy craft dates back to Tipu Sultan. Gram AI helps generational artisans compete with imported plastic toys by celebrating non-toxic sustainability.',
    materials: ['Sustainably Harvested Hale Wood', 'Natural Shellac', 'Food-grade vegetable tints'],
    inStock: true,
    featured: true,
    fairTradePercent: 83
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-901',
    trackingId: 'GRAM-88219',
    customerId: 'user-customer-1',
    customerName: 'Arjun Sharma',
    customerPhone: '+91 98112 34567',
    shippingAddress: '42, 12th Main, 4th Cross, Indiranagar, Bengaluru, KA 560038',
    items: [
      {
        productId: 'prod-1',
        title: 'Hand-Painted Madhubani Tussar Silk Dupatta',
        price: 1850,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        artisanName: 'Sunita Devi'
      },
      {
        productId: 'prod-3',
        title: 'Wayanad High-Curcumin Raw Organic Turmeric (500g)',
        price: 340,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
        artisanName: 'Vasantha Rao'
      }
    ],
    totalAmount: 2530,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    upiRefId: 'UPI-AXIS-992817462',
    orderStatus: 'out_for_delivery',
    createdAt: '2026-09-24T14:20:00Z',
    deliveryDateEstimated: '2026-09-28',
    currentHub: 'Bengaluru East Distribution Hub, Indiranagar',
    deliveryPartner: 'Gram Express & India Post Nodal',
    deliveryAgentPhone: '+91 99001 84210 (Rajesh Kumar)',
    deliveryOtp: '4829'
  },
  {
    id: 'ORD-2026-894',
    trackingId: 'GRAM-77401',
    customerId: 'user-customer-1',
    customerName: 'Arjun Sharma',
    customerPhone: '+91 98112 34567',
    shippingAddress: '42, 12th Main, Indiranagar, Bengaluru, KA 560038',
    items: [
      {
        productId: 'prod-2',
        title: 'Handcrafted Terracotta Clay Biryani Pot',
        price: 680,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        artisanName: 'Rameshwar Rathore'
      }
    ],
    totalAmount: 680,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    upiRefId: 'UPI-HDFC-33109482',
    orderStatus: 'delivered',
    createdAt: '2026-09-15T09:12:00Z',
    deliveryDateEstimated: '2026-09-19',
    currentHub: 'Delivered to Doorstep',
    deliveryPartner: 'Gram Express',
    deliveryAgentPhone: '+91 98822 10992',
    deliveryOtp: '1109'
  }
];

export const INITIAL_LEARNING_MODULES: LearningModule[] = [
  {
    id: 'learn-1',
    title: 'Zero-Waste Packaging for Fragile Clay & Glass Goods',
    category: 'packaging',
    duration: '14 mins',
    language: 'Hindi & Regional',
    level: 'Beginner',
    summary: 'Learn how to replace expensive plastic bubble wraps with discarded dried banana fibre, rice husk cushions, and corrugated honeycomb sleeves.',
    keyPoints: [
      'Layering shock absorption using local organic agricultural by-products',
      'Drop-test verification from 4 feet without breakage',
      'Weight optimization to lower inter-state freight courier rates by 22%',
      'Cost comparison: ₹4 per item with agro-cushion vs ₹18 with plastic'
    ],
    audioScript: 'Namaste artisans! Today we will learn how to package fragile pottery and glass jars safely for courier delivery without spending extra money on plastic bubble wraps. Agricultural waste like rice husks and shredded jute can absorb heavy shocks...',
    instructor: 'Shrikant Patil (Gram Rural Logistics Lead)',
    icon: 'PackageCheck'
  },
  {
    id: 'learn-2',
    title: 'Govt Schemes 2026: PM Mudra & PM Vishwakarma Subsidy',
    category: 'schemes',
    duration: '18 mins',
    language: 'Multilingual',
    level: 'Beginner',
    summary: 'Complete guide to accessing collateral-free working capital loans up to ₹3,00,000 at 5% subsidized interest under the PM Vishwakarma scheme.',
    keyPoints: [
      'Who qualifies: Traditional potters, weavers, carpenters, blacksmiths',
      'Required documents: Aadhaar card, Village Sarpanch/Panchayat certificate',
      'Direct toolkit incentive of ₹15,000 credit directly to bank account',
      'Step-by-step assistance through Gram AI nodal kiosks'
    ],
    audioScript: 'Hello friends! Many village entrepreneurs miss out on government capital subsidies because of paperwork fears. Let us break down how to get your PM Vishwakarma certificate in three simple steps...',
    schemeBenefit: 'Up to ₹3 Lakh Collateral-Free Credit + ₹15,000 Free Modern Toolkit Grant',
    instructor: 'Anjali Deshmukh (Microfinance Counselor)',
    icon: 'Landmark'
  },
  {
    id: 'learn-3',
    title: 'Direct UPI & Digital Ledger for Self-Help Groups (SHGs)',
    category: 'finance',
    duration: '12 mins',
    language: 'Hindi & Tamil',
    level: 'Beginner',
    summary: 'How SHG treasurers can manage transparent digital cashbooks, QR code collections, and direct split payouts without bank queues.',
    keyPoints: [
      'Setting up unified village SHG merchant QR code with zero MDR fee',
      'Daily automated SMS voice alerts in local tongue upon customer payment',
      'Automated member dividend split ledger calculation',
      'Preventing common digital payment fraud and fake screenshot scams'
    ],
    audioScript: 'In this session, we show how your Mahila Bachat Gat can accept digital UPI payments directly from urban buyers. Every rupee is credited instantly to your SHG bank account with zero middleman deduction...',
    instructor: 'Sunita Devi (Lead Artisan & SHG Trainer)',
    icon: 'CreditCard'
  },
  {
    id: 'learn-4',
    title: 'Export Readiness: Lab Testing & FSSAI / Handloom Mark',
    category: 'quality',
    duration: '22 mins',
    language: 'English & Hindi',
    level: 'Intermediate',
    summary: 'Standards required to sell organic spices, wild honey, and natural silks to international premium buyers in Europe and North America.',
    keyPoints: [
      'FSSAI Organic and pesticide residue compliance testing steps',
      'Geographical Indication (GI) tag authentication certificate process',
      'Moisture control for spices and honey to prevent mold during maritime transit',
      'Creating barcode labels that tell your village origin story'
    ],
    audioScript: 'International conscious consumers are hungry for pure, unadulterated village spices. But export requires strict pesticide residue tests. Here is how Gram AI aggregates testing to lower individual certification costs...',
    instructor: 'Dr. K. Ramanathan (Agri-Commodity Certification Specialist)',
    icon: 'Award'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'user-customer-1',
    userName: 'Arjun Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    rating: 5,
    comment: 'The craftsmanship of this Madhubani Tussar silk dupatta is astonishing. The fine line detailing on the border with natural dyes has such depth. Came with a handwritten card from Sunita Devi!',
    date: '2026-09-20',
    verifiedPurchase: true,
    artisanReply: 'Thank you Arjun ji! Knowing that our Mithila heritage is treasured in Bengaluru brings so much happiness to our women weavers in Madhubani.'
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    userId: 'user-customer-2',
    userName: 'Meera Iyer',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    rating: 5,
    comment: 'Cooked biryani in this terracotta handi on gas stove (with heat diffuser). The flavour and aroma were unbeatable. Packaging with dried husk was 100% eco-friendly and arrived intact.',
    date: '2026-09-18',
    verifiedPurchase: true,
    artisanReply: 'Dhanyawad Meera ji. Please remember to soak the pot in clean water for 15 mins before first use. Warm regards from Molela!'
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    userId: 'user-customer-3',
    userName: 'Vikram Sethi',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
    rating: 5,
    comment: 'You can immediately tell this Wayanad turmeric is genuinely raw and pure. The intense golden hue and earthy aroma are unlike any commercial brand. 10/10.',
    date: '2026-09-22',
    verifiedPurchase: true
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-1042',
    userId: 'user-artisan-1',
    userName: 'Sunita Devi',
    role: 'entrepreneur',
    subject: 'Assistance requested for bulk packaging boxes for festive export',
    category: 'logistics',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2026-09-26T08:30:00Z',
    messages: [
      {
        sender: 'user',
        text: 'Namaste, our SHG has received 45 orders for Diwali gifting. Can the district hub provide 50 extra corrugated honeycomb sleeves by Monday?',
        time: '08:30 AM'
      },
      {
        sender: 'support',
        text: 'Namaste Sunita ji! Your request has been assigned to Gram Coordinator Suresh at Madhubani Hub. The sleeves will be delivered to your village center tomorrow at 11 AM.',
        time: '09:15 AM'
      }
    ]
  }
];
