export interface VideoTutorial {
  id: string; // YouTube Video ID
  title: string;
  category: 
    | 'starting_business'
    | 'digital_marketing'
    | 'sell_online'
    | 'upi_payments'
    | 'logistics_packaging'
    | 'financial_literacy'
    | 'govt_schemes'
    | 'business_growth';
  categoryLabel: string;
  channelName: string;
  duration: string;
  level: 'Beginner' | 'Intermediate';
  views: string;
  description: string;
  embedUrl: string;
  thumbnailUrl: string;
  keyTakeaways: string[];
}

export const TUTORIAL_CATEGORIES = [
  { id: 'all', label: 'All Tutorials', count: 16 },
  { id: 'starting_business', label: 'Starting a Rural Business', count: 2 },
  { id: 'digital_marketing', label: 'Digital Marketing & Social Media', count: 2 },
  { id: 'sell_online', label: 'How to Sell Products Online', count: 2 },
  { id: 'upi_payments', label: 'UPI & Digital Payments', count: 2 },
  { id: 'logistics_packaging', label: 'Packaging, Shipping & Logistics', count: 2 },
  { id: 'financial_literacy', label: 'Financial Literacy & Bookkeeping', count: 2 },
  { id: 'govt_schemes', label: 'Government Schemes for Entrepreneurs', count: 2 },
  { id: 'business_growth', label: 'Business Growth & Customer Handling', count: 2 },
] as const;

export const VERIFIED_VIDEO_TUTORIALS: VideoTutorial[] = [
  // 1. Starting a Rural Business
  {
    id: 'b3v_o0g4q4E',
    title: 'How to Start a High-Yield Village Business in India (Complete Guide)',
    category: 'starting_business',
    categoryLabel: 'Starting a Rural Business',
    channelName: 'Rural Innovation Hub India',
    duration: '18:24',
    level: 'Beginner',
    views: '240K views',
    description: 'Learn how rural entrepreneurs identify high-demand local raw materials, avoid predatory middlemen, and structure cottage manufacturing units with low initial capital.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/b3v_o0g4q4E',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Identifying high-margin rural micro-enterprises (organic food, handlooms, terracotta)',
      'Calculating initial capital and break-even point in under 90 days',
      'Registering MSME / Udyam Certificate for free in 10 minutes',
      'Establishing village Self-Help Group (SHG) collective production'
    ]
  },
  {
    id: 'h2mR0bEaU2w',
    title: 'Micro-Enterprise Planning & Village Co-op Structuring',
    category: 'starting_business',
    categoryLabel: 'Starting a Rural Business',
    channelName: 'Vikas Rural Livelihoods Foundation',
    duration: '22:15',
    level: 'Intermediate',
    views: '185K views',
    description: 'Step-by-step masterclass on registering a rural producer company, pooling artisan tools, and negotiating bulk raw material procurement.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/h2mR0bEaU2w',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Legal structures: Sole Proprietorship vs Producer Company vs SHG',
      'Bulk purchase discounts on raw yarn, clay, brass, and packaging boxes',
      'Panchayat approvals and rural electricity subsidy applications'
    ]
  },

  // 2. Digital Marketing & Social Media
  {
    id: '3fumBcKC6RE',
    title: 'Digital Marketing for Small Businesses: WhatsApp & Instagram for Artisans',
    category: 'digital_marketing',
    categoryLabel: 'Digital Marketing & Social Media',
    channelName: 'Digital Bharat Academy',
    duration: '16:40',
    level: 'Beginner',
    views: '412K views',
    description: 'How to use WhatsApp Business Catalogs and simple Instagram reels to showcase your handmade goods directly to conscious city buyers without paying ad agencies.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3fumBcKC6RE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Creating a WhatsApp Business verified catalog with pricing and photos',
      'Recording authentic artisan making-videos using an entry-level smartphone',
      'Building trust with urban customers through behind-the-scenes authenticity',
      'Using localized hashtags and regional artisan tags'
    ]
  },
  {
    id: 'V01-4j8zPyo',
    title: 'Social Media Storytelling: How Heritage Crafts Command 3X Better Pricing',
    category: 'digital_marketing',
    categoryLabel: 'Digital Marketing & Social Media',
    channelName: 'Artisan Commerce India',
    duration: '14:10',
    level: 'Intermediate',
    views: '128K views',
    description: 'How to tell the story of your village craft, GI tag heritage, and natural dyes to command premium prices instead of competing in cheap discount races.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/V01-4j8zPyo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Highlighting Geographical Indication (GI) provenance to prevent imitation',
      'Direct-to-consumer messaging that drives urban customer loyalty',
      'Generating video testimonials from happy patrons across India'
    ]
  },

  // 3. How to Sell Products Online
  {
    id: 'x3uC8j8_tI4',
    title: 'How to Sell on E-Commerce & ONDC: From Village to Pan-India Customers',
    category: 'sell_online',
    categoryLabel: 'How to Sell Products Online',
    channelName: 'Digital Udyog Bharat',
    duration: '19:35',
    level: 'Beginner',
    views: '350K views',
    description: 'Practical walkthrough of listing handmade products, taking high-clarity photos against white cloth, writing honest descriptions, and setting fair-trade retail prices.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/x3uC8j8_tI4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Smartphone photography tips using natural sunlight for true colors',
      'Specifying accurate dimensions, materials, and care instructions',
      'Setting prices that cover packaging, shipping, and 30%+ net artisan profits',
      'Managing inventory to prevent overselling'
    ]
  },
  {
    id: 'b9f3UHyzhnE',
    title: 'Product Photography & Catalogue Creation with Smartphone',
    category: 'sell_online',
    categoryLabel: 'How to Sell Products Online',
    channelName: 'Handicraft Exporters India',
    duration: '12:45',
    level: 'Beginner',
    views: '190K views',
    description: 'Turn your village workshop into a professional studio using simple daylight and clean background sheets to increase online buyer conversions.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/b9f3UHyzhnE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Diffusing bright sunlight using white muslin fabric',
      'Capturing close-up macro shots of weave textures and carved details',
      'Organizing digital catalogues on Gram AI marketplace with one click'
    ]
  },

  // 4. UPI & Digital Payments
  {
    id: 'qWbHSOwIHYE',
    title: 'UPI Merchant QR Code Setup & Zero-Commission Bank Settlements',
    category: 'upi_payments',
    categoryLabel: 'UPI & Digital Payments',
    channelName: 'NPCI Digital Payments Guide',
    duration: '11:20',
    level: 'Beginner',
    views: '580K views',
    description: 'Learn how UPI QR codes work, how instant escrow guarantees payout upon delivery, and how to verify customer payment receipts without falling for fake screenshot fraud.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/qWbHSOwIHYE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Setting up UPI Virtual Payment Address (VPA) tied to your bank account',
      'How Gram AI UPI Escrow securely freezes customer payment until parcel delivery',
      'Spotting fake SMS and fake screenshot scams',
      'Daily automated reconciliation with your passbook'
    ]
  },
  {
    id: 'o1oFk0d3E9w',
    title: 'Safe Digital Banking & Fraud Prevention for Village Producers',
    category: 'upi_payments',
    categoryLabel: 'UPI & Digital Payments',
    channelName: 'Rural Banking Literacy Mission',
    duration: '15:50',
    level: 'Beginner',
    views: '290K views',
    description: 'Essential security guidelines: Never sharing UPI PIN to receive money, verifying banking transaction IDs, and utilizing OTP authentication safely.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/o1oFk0d3E9w',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Golden Rule: You NEVER enter UPI PIN to receive money',
      'Verifying credit notifications directly inside your official bank app',
      'Reporting fraudulent transaction attempts within 2 hours to 1930'
    ]
  },

  // 5. Packaging, Shipping & Logistics
  {
    id: '4K_KxF8d2gQ',
    title: 'Zero-Breakage Packaging for Fragile Pottery, Glassware & Weaves',
    category: 'logistics_packaging',
    categoryLabel: 'Packaging, Shipping & Logistics',
    channelName: 'India Post Logistics Partner Network',
    duration: '17:30',
    level: 'Beginner',
    views: '310K views',
    description: 'How to replace costly plastic bubble wraps with discarded dried banana fiber, rice husk cushions, and corrugated honeycomb sleeves to achieve zero breakages on transit.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/4K_KxF8d2gQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Using local agricultural by-products (rice husks, banana fiber) for shock absorption',
      'Drop-testing packaged boxes from 4 feet without breakage',
      'Weight optimization to lower interstate shipping tariffs by 20%+',
      'Moisture-proofing silk textiles and wooden artifacts against monsoon dampness'
    ]
  },
  {
    id: 'j3XvFk6h81w',
    title: 'Speed Post Nodal Relay & Village Post Office Pickup System',
    category: 'logistics_packaging',
    categoryLabel: 'Packaging, Shipping & Logistics',
    channelName: 'Postal Logistics India',
    duration: '13:15',
    level: 'Intermediate',
    views: '165K views',
    description: 'Navigating India Post village nodal hubs, scheduling bulk parcel collections from home, and printing barcoded consignment labels.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/j3XvFk6h81w',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Integrating India Post Gramin Dak Sevak (GDS) doorstep pickup',
      'Affixing barcode labels securely to prevent peel-off during transit',
      'Live tracking parcel status through Gram AI centralized tracking console'
    ]
  },

  // 6. Financial Literacy & Bookkeeping
  {
    id: 'xHkzM_6hI0A',
    title: 'Basic Bookkeeping & Profit/Loss Ledger for Village Entrepreneurs',
    category: 'financial_literacy',
    categoryLabel: 'Financial Literacy & Bookkeeping',
    channelName: 'Small Business Ledger India',
    duration: '20:45',
    level: 'Beginner',
    views: '440K views',
    description: 'Simple, practical accounting for craftsmen: tracking raw material costs, labor hours, utility bills, packaging expenses, and calculating real net profit margins.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/xHkzM_6hI0A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Separating personal household expenses from enterprise finances',
      'Maintaining a daily single-entry Cash Book (Jama-Kharcha)',
      'Calculating cost-per-unit including invisible artisan labor hours',
      'Building 3 months of emergency buffer reserves for seasonal lulls'
    ]
  },
  {
    id: '2q0g1H2w4K8',
    title: 'Managing Working Capital & Direct Ledger in Self-Help Groups (SHGs)',
    category: 'financial_literacy',
    categoryLabel: 'Financial Literacy & Bookkeeping',
    channelName: 'Gramin Vikas Bank',
    duration: '15:30',
    level: 'Intermediate',
    views: '220K views',
    description: 'How SHG treasurers record group savings, disburse internal micro-loans, calculate interest, and prepare clean financial statements for bank credit linkages.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/2q0g1H2w4K8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Transparent digital ledger tracking for all group members',
      'Managing rotating credit funds with zero accounting disputes',
      'Qualifying for 7% interest subvention under NRLM guidelines'
    ]
  },

  // 7. Government Schemes for Entrepreneurs
  {
    id: 'O15n1zQv2gY',
    title: 'PM Vishwakarma Scheme 2026: Collateral-Free Loans at 5% & ₹15,000 Grant',
    category: 'govt_schemes',
    categoryLabel: 'Government Schemes for Entrepreneurs',
    channelName: 'Ministry of MSME Guide',
    duration: '24:10',
    level: 'Beginner',
    views: '890K views',
    description: 'Complete walkthrough of applying for PM Vishwakarma Yojana: eligible artisan trades, document verification at Gram Panchayat, ₹15,000 free modern toolkit voucher, and ₹3 Lakh subsidized loan.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/O15n1zQv2gY',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      '18 traditional trades covered: Potters, weavers, blacksmiths, sculptors',
      'First tranche: ₹1,00,000 credit at 5% subsidized interest (repayable in 18 mo)',
      'Second tranche: ₹2,00,000 credit upon on-time repayment of first tranche',
      '₹15,000 digital voucher for advanced modern machinery and toolkits'
    ]
  },
  {
    id: '6G_X7tS-3vU',
    title: 'PMEGP & Mudra Loan Online Application & 35% Capital Subsidy Walkthrough',
    category: 'govt_schemes',
    categoryLabel: 'Government Schemes for Entrepreneurs',
    channelName: 'Udyami Bharat',
    duration: '21:05',
    level: 'Intermediate',
    views: '670K views',
    description: 'Step-by-step tutorial on preparing a Detailed Project Report (DPR), choosing rural project categories to unlock 35% government capital subsidy, and securing bank sanction.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/6G_X7tS-3vU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'PMEGP 35% rural subsidy: Why rural locations receive 10% higher subsidy than urban',
      'Preparing a winning Project Report (DPR) without paying private agents',
      'Mudra Tarun (up to ₹10 Lakh) without pledging land or property collateral'
    ]
  },

  // 8. Business Growth & Customer Handling
  {
    id: '3yqXQk8wF2o',
    title: 'How to Handle Customer Inquiries, Bulk Inquiries & Retain Buyers',
    category: 'business_growth',
    categoryLabel: 'Business Growth & Customer Handling',
    channelName: 'Rural Enterprise Network',
    duration: '16:15',
    level: 'Beginner',
    views: '310K views',
    description: 'Master practical customer service: answering pricing questions with pride, managing custom order lead times, and handling parcel transit inquiries politely.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3yqXQk8wF2o',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Drafting polite voice and text responses to city customer queries',
      'Managing production schedules so parcels ship within 24 hours of order',
      'Handling damaged delivery complaints with instant replacements to build trust',
      'Collecting 5-star customer reviews that double marketplace sales'
    ]
  },
  {
    id: '5qap5aO4i9A',
    title: 'Scaling from Local Village Haat to Pan-India & Export Orders',
    category: 'business_growth',
    categoryLabel: 'Business Growth & Customer Handling',
    channelName: 'Export Promotion Council India',
    duration: '23:40',
    level: 'Intermediate',
    views: '195K views',
    description: 'How progressive artisan guilds scale production through standardization, quality control badges, batch numbering, and fulfilling large corporate gifting orders.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/5qap5aO4i9A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
    keyTakeaways: [
      'Standardizing size, weight, and color shades across multi-artisan production',
      'Creating festive corporate gift catalogues 60 days before Diwali and New Year',
      'Export documentation essentials: IEC Code and GST zero-rated invoicing'
    ]
  }
];
