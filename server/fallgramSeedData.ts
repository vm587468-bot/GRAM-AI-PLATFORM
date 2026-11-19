import { Project, ProjectCategory, GovernmentScheme, MarketPrice } from '../src/types';

export const INITIAL_PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    id: 'cat-agri',
    slug: 'agriculture',
    name: 'Agriculture',
    description: 'High-value protected farming, horticulture, mushroom cultivation, and farm-gate value preservation.',
    iconName: 'Sprout'
  },
  {
    id: 'cat-food',
    slug: 'food_processing',
    name: 'Food Processing',
    description: 'Spice milling, cold-pressed edible oils, dairy chilling, and hygienic rural packaging units.',
    iconName: 'Utensils'
  },
  {
    id: 'cat-rural',
    slug: 'rural_entrepreneurship',
    name: 'Rural Entrepreneurship',
    description: 'Community cooperative enterprises, artisan cluster workshops, and SHG-led production hubs.',
    iconName: 'Users'
  },
  {
    id: 'cat-small-biz',
    slug: 'small_business',
    name: 'Small Businesses',
    description: 'Low-capital village and semi-urban retail, B2B supply, and agro-input enterprises.',
    iconName: 'Store'
  },
  {
    id: 'cat-tech',
    slug: 'technology',
    name: 'Technology',
    description: 'Digital agri-tech, solar IoT cold storage, and software/telemetry platforms for rural commerce.',
    iconName: 'Cpu'
  },
  {
    id: 'cat-mfg',
    slug: 'manufacturing',
    name: 'Manufacturing',
    description: 'Bamboo utility craft, terracotta cookware kilns, biodegradable packaging, and eco-materials.',
    iconName: 'Factory'
  },
  {
    id: 'cat-services',
    slug: 'services',
    name: 'Services',
    description: 'Rural cold-chain leasing, soil testing labs, farm machinery rentals, and logistics hubs.',
    iconName: 'Wrench'
  },
  {
    id: 'cat-local',
    slug: 'local_business',
    name: 'Local Businesses',
    description: 'District-level artisan showrooms, weekly mandi collection centers, and village service kiosks.',
    iconName: 'MapPin'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-mushroom-oyster',
    slug: 'oyster-mushroom-cultivation-unit',
    name: 'Oyster Mushroom Cultivation & Drying Micro-Unit',
    category: 'agriculture',
    industry: 'Agri-Horticulture',
    businessType: 'Micro Farm Production',
    locationSuitability: 'Rural & Semi-Urban (High humidity or shaded shed across India)',
    imageUrl: '/images/project_mushroom.jpg',
    description: 'Low-footprint indoor oyster mushroom farming using paddy or wheat straw substrate inside a ventilated bamboo/shade-net shed, paired with solar tray drying for extended shelf life.',
    keywords: ['mushroom', 'oyster', 'farming', 'cultivation', 'agriculture', 'paddy straw', 'shg', 'fungi', 'high protein'],
    requiredInvestment: '₹1,20,000 – ₹2,50,000',
    estimatedSetupCost: '₹1,65,000 (Illustrative 400-bag batch unit)',
    costAssumptions: 'Estimate assumes existing 400 sq ft shed or low-cost bamboo frame; excludes land purchase. Spawn, straw, and polybags priced at 2026 regional reference rates.',
    estimatedMonthlyRevenueRange: '₹35,000 – ₹60,000 gross (yield and local mandi rates vary)',
    requiredResources: [
      '400 sq ft ventilated shade-net / bamboo room',
      'Certified Oyster Mushroom Spawn (Pleurotus spp.)',
      'Clean paddy or wheat straw substrate + chaff cutter',
      'Polypropylene cultivation bags, hygrometer, and mist sprayer',
      'Solar cabinet dryer (optional for dehydrated mushroom packs)'
    ],
    targetCustomers: 'District vegetable mandis, restaurants, hostels, urban organic stores, and dehydrated spice/soup processors.',
    revenueModel: 'Fresh harvest sold within 24 hours locally + solar-dried mushroom pouches shipped to urban retail buyers.',
    requiredSkills: [
      'Substrate pasteurization and hygiene control',
      'Temperature (20-28°C) & humidity (75-85%) management',
      'Basic grading and moisture-proof packaging'
    ],
    benefits: [
      'Short 30–40 day harvest cycle enables faster working capital turnover',
      'Utilizes agricultural crop residue (paddy/wheat straw) instead of burning',
      'Requires minimal arable land; suitable for women SHGs and smallholders'
    ],
    challenges: [
      'High contamination risk if spawn or straw sterilization is inconsistent',
      'Fresh oyster mushrooms perish within 24-48 hours without cold storage or drying',
      'Summer heat spikes above 32°C require cooling foggers or seasonal scheduling'
    ],
    relatedSchemeIds: ['scheme-pmfme', 'scheme-nabard-shg', 'scheme-pmmy-mudra'],
    referenceLinks: [
      { label: 'ICAR-Directorate of Mushroom Research (Solan)', url: 'https://dmrsolan.icar.gov.in' },
      { label: 'PMFME Food Processing Portal', url: 'https://pmfme.mofpi.gov.in' }
    ],
    status: 'verified',
    verifiedSource: 'ICAR-DMR Technical Reference & GramSetu Project Review',
    lastVerifiedDate: '2026-10-05',
    createdAt: '2026-09-12T08:00:00Z',
    updatedAt: '2026-10-05T10:30:00Z'
  },
  {
    id: 'proj-solar-cold-storage',
    slug: 'solar-micro-cold-storage-hub',
    name: 'Solar-Powered Micro Cold Storage & Produce Pre-Cooling Hub',
    category: 'technology',
    industry: 'Agri-Tech & Clean Energy',
    businessType: 'Cooling-as-a-Service (FPO / Hub)',
    locationSuitability: 'Horticulture Clusters & Rural Mandis (High solar irradiance regions)',
    imageUrl: '/images/project_solar_cold_storage.jpg',
    description: 'Off-grid 5 MT modular thermal-battery cold room powered by rooftop solar PV panels to reduce post-harvest spoilage of tomatoes, leafy greens, flowers, and fruits at the farm gate.',
    keywords: ['solar', 'cold storage', 'post harvest', 'cooling', 'agritech', 'clean energy', 'fpo', 'tomato', 'vegetables', 'iot'],
    requiredInvestment: '₹8,50,000 – ₹14,00,000 (eligible for AIF / MIDH subsidy)',
    estimatedSetupCost: '₹11,50,000 (5 MT thermal-storage solar unit)',
    costAssumptions: 'Baseline equipment cost before government capital subsidy; excludes concrete foundation pad and grid backup inverter.',
    estimatedMonthlyRevenueRange: '₹48,000 – ₹85,000 rental & aggregation margin (depends on occupancy)',
    requiredResources: [
      '3.5–5 kWp Solar PV array with phase-change thermal storage bank',
      'Insulated PUF panel cold chamber (5 MT capacity)',
      'IoT temperature/humidity telemetry logger',
      'Stackable perforated plastic harvest crates (150+ units)'
    ],
    targetCustomers: 'Small vegetable growers, Farmer Producer Organizations (FPOs), dairy collectors, and regional agri-traders.',
    revenueModel: 'Per-crate daily storage fee (₹2–₹4/kg/week) or FPO shared cooperative margin from selling non-distress produce.',
    requiredSkills: [
      'Thermal chamber scheduling & ethylene-compatible crop sorting',
      'Solar panel cleaning & preventive maintenance',
      'Digital crate inventory & mandi price timing'
    ],
    benefits: [
      'Eliminates diesel generator fuel costs and rural grid outage losses',
      'Cuts perishable post-harvest wastage from ~25% down to under 6%',
      'Qualifies for 3% interest subvention under Agriculture Infrastructure Fund (AIF)'
    ],
    challenges: [
      'High upfront CapEx requires institutional credit or FPO equity pooling',
      'Prolonged monsoon cloud cover reduces reserve hours without hybrid backup',
      'Farmers need onboarding to bring pre-sorted, undamaged produce early'
    ],
    relatedSchemeIds: ['scheme-aif', 'scheme-pmegp', 'scheme-nabard-shg'],
    referenceLinks: [
      { label: 'Agriculture Infrastructure Fund (AIF)', url: 'https://agriinfra.dac.gov.in' },
      { label: 'National Horticulture Board', url: 'https://nhb.gov.in' }
    ],
    implementationDetails: {
      techStack: ['Solar MPPT Controller', 'LoRaWAN / GSM Temp Sensors', 'Thermal Phase-Change Battery'],
      backendDetails: 'REST telemetry ingestion endpoint logging 15-minute chamber temperature & door-open alerts.',
      databaseDetails: 'Time-series crate occupancy and temperature compliance audit logs.',
      features: ['Offline thermal holdover up to 30 hours', 'Crate batch QR tracking', 'Remote SMS overheat warning']
    },
    status: 'verified',
    verifiedSource: 'DACFW AIF Guidelines & Clean Energy Agri Reference',
    lastVerifiedDate: '2026-10-08',
    createdAt: '2026-09-14T09:00:00Z',
    updatedAt: '2026-10-08T11:00:00Z'
  },
  {
    id: 'proj-spice-processing',
    slug: 'turmeric-spice-milling-packaging-unit',
    name: 'Organic Turmeric & Spice Grinding, Grading & Packaging Unit',
    category: 'food_processing',
    industry: 'Food Processing & Spices',
    businessType: 'SHG / MSME Food Enterprise',
    locationSuitability: 'Turmeric, Chilli & Coriander Belts (Kerala, Maharashtra, Telangana, UP, Odisha)',
    imageUrl: '/images/project_spice_unit.jpg',
    description: 'FSSAI-compliant micro food processing unit transforming raw farm-dried rhizomes and spices into stone/hammer-milled, lab-tested, vacuum-sealed retail pouches.',
    keywords: ['spice', 'turmeric', 'haldi', 'food processing', 'grinding', 'masala', 'packaging', 'fssai', 'pmfme', 'women shg'],
    requiredInvestment: '₹2,80,000 – ₹6,00,000',
    estimatedSetupCost: '₹3,90,000 (Pulverizer, roaster, band sealer & lab kit)',
    costAssumptions: 'Assumes rented 500 sq ft tiled workspace with 3-phase power connection; FSSAI basic/state registration fees included.',
    estimatedMonthlyRevenueRange: '₹75,000 – ₹1,40,000 gross depending on B2B/D2C volume',
    requiredResources: [
      'Stainless-steel impact pulverizer (low-heat grinding) & vibro-sifter',
      'Moisture meter, digital weighing scale, and continuous band sealer',
      'Food-grade kraft stand-up pouches & batch code printer',
      'FSSAI license and NABL curcumin/pesticide residue batch test'
    ],
    targetCustomers: 'Urban health-food D2C buyers, local kirana networks, institutional kitchens, and bulk spice exporters.',
    revenueModel: 'Value-addition spread between raw dried spice procurement and branded 200g/500g retail or 5kg HoReCa packs.',
    requiredSkills: [
      'Moisture & microbial control during storage (<10% moisture)',
      'FSSAI labeling compliance (nutritional panel, batch, expiry)',
      'Procurement grading (curcumin %, pungency, volatile oil)'
    ],
    benefits: [
      'Eligible for 35% credit-linked capital subsidy under PMFME scheme',
      'Shelf-stable 12–18 month inventory reduces distress selling',
      'Strong demand for single-origin, adulterant-free spices'
    ],
    challenges: [
      'Working capital tied up in seasonal harvest procurement',
      'Strict food safety compliance and aflatoxin/moisture monitoring needed',
      'Retail shelf competition requires verified purity lab reports'
    ],
    relatedSchemeIds: ['scheme-pmfme', 'scheme-pmegp', 'scheme-standup-india'],
    referenceLinks: [
      { label: 'PMFME Scheme (MoFPI)', url: 'https://pmfme.mofpi.gov.in' },
      { label: 'FSSAI Licensing Portal (FoSCoS)', url: 'https://foscos.fssai.gov.in' }
    ],
    status: 'verified',
    verifiedSource: 'MoFPI PMFME DPR Reference Library',
    lastVerifiedDate: '2026-10-10',
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-10-10T09:15:00Z'
  },
  {
    id: 'proj-dairy-chilling',
    slug: 'village-milk-chilling-paneer-unit',
    name: 'Village Dairy Bulk Milk Chilling & Paneer Micro-Plant',
    category: 'food_processing',
    industry: 'Dairy & Animal Husbandry',
    businessType: 'Cooperative / Small Dairy Enterprise',
    locationSuitability: 'Dairy Villages with 300–1,000 L/day milk surplus',
    imageUrl: '/images/project_dairy_plant.jpg',
    description: 'Automated milk fat/SNF testing, stainless steel bulk milk cooler (500L–1000L), and hygienic paneer & cultured ghee production center paying farmers transparently via UPI.',
    keywords: ['dairy', 'milk', 'chilling', 'paneer', 'ghee', 'cooperative', 'rural entrepreneurship', 'animal husbandry'],
    requiredInvestment: '₹4,50,000 – ₹9,50,000',
    estimatedSetupCost: '₹6,20,000 (500L Bulk Milk Cooler + analyzer + paneer press)',
    costAssumptions: 'Excludes land/building construction and refrigerated delivery van; assumes reliable single/three-phase electricity + backup DG.',
    estimatedMonthlyRevenueRange: '₹1,50,000 – ₹2,80,000 gross throughput (margins vary with procurement fat %)',
    requiredResources: [
      'Ultrasonic Milk Analyzer (Fat/SNF/Water adulteration check)',
      '500L SS-304 Bulk Milk Cooler (BMC) & 40L aluminum/SS milk cans',
      'Steam/jacketed curdling vat & hydraulic paneer press',
      'Food-grade vacuum packaging & FSSAI dairy registration'
    ],
    targetCustomers: 'Town sweet shops, caterers, regional dairies, urban apartment milk subscriptions, and retail supermarkets.',
    revenueModel: 'Dual stream: chilled raw milk bulk supply + higher-margin fresh paneer, khoa, and bilona ghee.',
    requiredSkills: [
      'Clean-in-Place (CIP) stainless steel sanitation protocols',
      'Fair fat-based farmer billing & testing calibration',
      'Same-day cold-chain dispatch planning'
    ],
    benefits: [
      'Daily cash-flow business with steady household & foodservice demand',
      'Prevents souring spoilage during summer transit',
      'Builds direct trust with village milk-pouring farmers via digital fat slips'
    ],
    challenges: [
      'Strict hygiene and cold-chain discipline required every morning and evening',
      'Power outages can compromise chilled milk batches without backup',
      'Summer lean-season milk supply drops require balanced farmer incentives'
    ],
    relatedSchemeIds: ['scheme-pmfme', 'scheme-nabard-shg', 'scheme-pmmy-mudra'],
    referenceLinks: [
      { label: 'Department of Animal Husbandry & Dairying', url: 'https://dahd.nic.in' },
      { label: 'NDDB Dairy Knowledge Portal', url: 'https://www.nddb.coop' }
    ],
    status: 'verified',
    verifiedSource: 'NDDB Micro-Dairy Reference & NABARD Model Scheme',
    lastVerifiedDate: '2026-10-06',
    createdAt: '2026-09-20T07:30:00Z',
    updatedAt: '2026-10-06T12:00:00Z'
  },
  {
    id: 'proj-bamboo-craft',
    slug: 'bamboo-utility-furniture-craft-workshop',
    name: 'Treated Bamboo Utility Craft & Eco-Packaging Workshop',
    category: 'manufacturing',
    industry: 'Sustainable Handicrafts & Eco-Manufacturing',
    businessType: 'Artisan Guild / Cluster Workshop',
    locationSuitability: 'Assam, Tripura, Odisha, Chhattisgarh, MP, Maharashtra bamboo belts',
    imageUrl: '/images/project_bamboo_craft.jpg',
    description: 'Semi-mechanized bamboo splitting, natural borax/smoke treatment, and woven storage baskets, lampshades, and plastic-free gift hampers for hospitality and urban retail.',
    keywords: ['bamboo', 'craft', 'handicrafts', 'manufacturing', 'basket', 'sustainable', 'artisan', 'vishwakarma', 'furniture'],
    requiredInvestment: '₹1,50,000 – ₹3,50,000',
    estimatedSetupCost: '₹2,10,000 (Cross-cut saw, radial splitter, treatment tank & hand tools)',
    costAssumptions: 'Assumes existing artisan skill base or PM Vishwakarma training; excludes raw bamboo yard lease.',
    estimatedMonthlyRevenueRange: '₹50,000 – ₹1,10,000 gross (order-driven seasonal peaks)',
    requiredResources: [
      'Bamboo cross-cutting machine, radial splitter & slivering toolset',
      'Eco-friendly seasoning & anti-borer treatment tank',
      'Dry covered curing rack & sanding equipment',
      'Moisture-resistant woven packaging wraps'
    ],
    targetCustomers: 'Eco-resorts, corporate festive gifting buyers, urban homeware boutiques, and zero-waste retail brands.',
    revenueModel: 'Made-to-order B2B gift hamper runs + direct D2C craft sales via online marketplace.',
    requiredSkills: [
      'Seasoning bamboo to avoid cracking & beetle infestation',
      'Precision weave consistency & modern interior design patterns',
      'Bulk order estimation and lead-time management'
    ],
    benefits: [
      'Supported by PM Vishwakarma ₹15,000 toolkit grant and 5% subsidized credit',
      'Strong urban shift away from single-use plastic boxes & baskets',
      'Renewable 3–5 year bamboo harvest cycle supports local ecology'
    ],
    challenges: [
      'Untreated green bamboo warps or develops fungus in humid transit',
      'Manual-only finishing reduces margins on standardized B2B orders',
      'Volumetric shipping weight requires nested/collapsible product design'
    ],
    relatedSchemeIds: ['scheme-pm-vishwakarma', 'scheme-pmegp', 'scheme-pmmy-mudra'],
    referenceLinks: [
      { label: 'National Bamboo Mission', url: 'https://nbm.nic.in' },
      { label: 'PM Vishwakarma Portal', url: 'https://pmvishwakarma.gov.in' }
    ],
    status: 'verified',
    verifiedSource: 'National Bamboo Mission & KVIC Artisan Reference',
    lastVerifiedDate: '2026-10-09',
    createdAt: '2026-09-22T11:00:00Z',
    updatedAt: '2026-10-09T14:20:00Z'
  },
  {
    id: 'proj-handloom-weaving',
    slug: 'gi-handloom-natural-dye-cluster',
    name: 'Natural-Dye Handloom Weaving & Direct D2C Textile Studio',
    category: 'rural_entrepreneurship',
    industry: 'Textiles & Handloom Heritage',
    businessType: 'Weaver Cooperative / D2C Studio',
    locationSuitability: 'Handloom Clusters (Varanasi, Pochampally, Bhagalpur, Kutch, Chanderi)',
    imageUrl: '/images/project_handloom_weaving.jpg',
    description: 'Pitloom and frame-loom weaving unit producing natural-dyed Khadi cotton and Tussar silk sarees/dupattas with QR-verified weaver provenance and direct digital storefront.',
    keywords: ['handloom', 'weaving', 'textiles', 'saree', 'khadi', 'silk', 'natural dye', 'rural entrepreneurship', 'gi tag'],
    requiredInvestment: '₹1,80,000 – ₹4,50,000 (for 4-loom cluster upgrade & yarn bank)',
    estimatedSetupCost: '₹2,60,000 (Yarn stock, loom jacquard upgrade, natural dye vats)',
    costAssumptions: 'Assumes existing weaver looms; budget covers yarn working capital, natural dye house setup, and photography/branding.',
    estimatedMonthlyRevenueRange: '₹80,000 – ₹1,80,000 gross (varies sharply by fabric grade & festive demand)',
    requiredResources: [
      'Seasoned wooden pitlooms / frame looms with jacquard attachments',
      'Certified handspun yarn (Tussar, Mulberry, or 80s Khadi Cotton)',
      'Indigo, madder, pomegranate & harda natural dye vats',
      'Handloom Mark / GI Tag certification & product photography kit'
    ],
    targetCustomers: 'Direct urban patrons, wedding trousseau buyers, boutique apparel brands, and global sustainable fashion importers.',
    revenueModel: 'Direct-to-consumer digital sales preserving 85%+ of retail value for weavers instead of 25-30% trader wages.',
    requiredSkills: [
      'Warp-weft tension balancing & intricate motif weaving',
      'Color-fast natural mordanting techniques',
      'Accurate catalog descriptions, dimensions, and care guidance'
    ],
    benefits: [
      'Eliminates multiple wholesale commission layers',
      'Handloom Mark / GI verification builds strong buyer willingness to pay',
      'Eligible for Mudra working capital & PMEGP expansion subsidies'
    ],
    challenges: [
      'Yarn price volatility squeezes margins on fixed-price custom orders',
      'Rainy season slows natural yarn drying and outdoor warping',
      'Requires disciplined order-dispatch timelines for urban buyers'
    ],
    relatedSchemeIds: ['scheme-pm-vishwakarma', 'scheme-pmmy-mudra', 'scheme-pmegp'],
    referenceLinks: [
      { label: 'Office of Development Commissioner (Handlooms)', url: 'https://handlooms.nic.in' },
      { label: 'India Handloom Brand', url: 'https://www.indiahandloombrand.gov.in' }
    ],
    status: 'verified',
    verifiedSource: 'Handlooms India Reference & Varanasi Cluster Audit',
    lastVerifiedDate: '2026-10-11',
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-10-11T09:00:00Z'
  },
  {
    id: 'proj-cold-pressed-oil',
    slug: 'wood-pressed-kolhu-oil-ghani',
    name: 'Wood-Pressed (Kachi Ghani) Mustard & Groundnut Oil Mill',
    category: 'small_business',
    industry: 'Edible Oils & Agri-Retail',
    businessType: 'Village Micro-Mill & Local Retail',
    locationSuitability: 'Oilseed Regions (Rajasthan, MP, Gujarat, UP, Haryana, Bihar)',
    imageUrl: '/images/project_oil_mill.jpg',
    description: 'Slow-RPM wooden-pestle oil extraction micro-unit producing unrefined cold-pressed mustard, groundnut, and sesame oils alongside high-protein oilcake cattle feed.',
    keywords: ['oil mill', 'ghani', 'cold pressed', 'mustard oil', 'groundnut', 'small business', 'kachi ghani', 'cattle feed'],
    requiredInvestment: '₹2,50,000 – ₹5,50,000',
    estimatedSetupCost: '₹3,60,000 (2-unit rotary wooden ghani + oil filter press + bottling)',
    costAssumptions: 'Assumes leased 350 sq ft shopfront with 5–7.5 HP power connection; excludes initial seasonal seed stockpile.',
    estimatedMonthlyRevenueRange: '₹90,000 – ₹1,75,000 gross (oil + khal oilcake by-product)',
    requiredResources: [
      'Vagai/Babool wood-lined rotary ghani expeller machine (15-20 kg/hr)',
      'Seed cleaner/destoner & plate-frame cotton cloth oil filter',
      'Food-grade glass/tin packaging & Agmark/FSSAI oil license',
      'Dry moisture-proof seed storage drums'
    ],
    targetCustomers: 'Health-conscious urban families, local households (BYO bottle refills), bakeries, and local dairy farms (for oilcake).',
    revenueModel: 'Dual revenue: unrefined cold-pressed oil retail + 100% sale of nutrient-rich khal (oilcake) to local dairy farmers.',
    requiredSkills: [
      'Selecting high-oil-content clean seeds (<8% moisture)',
      'Operating slow extraction (<45°C) to preserve natural antioxidants',
      'Transparent batch dating & leak-proof bottle sealing'
    ],
    benefits: [
      'Zero chemical solvent (hexane) extraction appeals strongly to urban buyers',
      'By-product oilcake covers significant seed/power overhead in dairy belts',
      'Repeat household staple purchase drives steady monthly demand'
    ],
    challenges: [
      'Lower oil yield (~33–36%) compared to hot solvent mills makes retail pricing higher',
      'Seasonal oilseed price swings require careful inventory hedging',
      'Needs clean sediment filtration without overheating the oil'
    ],
    relatedSchemeIds: ['scheme-pmfme', 'scheme-pmegp', 'scheme-cmegp-mh'],
    referenceLinks: [
      { label: 'KVIC Oil Ghani Guidelines (PMEGP)', url: 'https://www.kviconline.gov.in/pmegpeportal' },
      { label: 'FSSAI Food Licensing', url: 'https://foscos.fssai.gov.in' }
    ],
    status: 'verified',
    verifiedSource: 'KVIC PMEGP Model DPR & Agmark Reference',
    lastVerifiedDate: '2026-10-04',
    createdAt: '2026-09-26T09:00:00Z',
    updatedAt: '2026-10-04T15:30:00Z'
  },
  {
    id: 'proj-terracotta-kiln',
    slug: 'smokeless-terracotta-cookware-kiln',
    name: 'Eco-Friendly Terracotta Cookware & Water Matka Studio',
    category: 'local_business',
    industry: 'Ceramics, Pottery & Sustainable Kitchen',
    businessType: 'Local Craft & E-Commerce Studio',
    locationSuitability: 'Alluvial / Riverbed Clay Clusters across India',
    imageUrl: '/images/project_pottery_workshop.jpg',
    description: 'Modernized electric potter-wheel and fuel-efficient smokeless kiln setup producing unglazed biryani handis, curd pots, and clay water filters with shockproof eco-packaging.',
    keywords: ['pottery', 'terracotta', 'clay', 'matka', 'local business', 'cookware', 'handi', 'vishwakarma', 'craft'],
    requiredInvestment: '₹90,000 – ₹2,20,000',
    estimatedSetupCost: '₹1,35,000 (2 electric wheels + clay pug mill + improved kiln)',
    costAssumptions: 'Assumes potter household courtyard access; excludes clay pit mining royalties where applicable.',
    estimatedMonthlyRevenueRange: '₹32,000 – ₹65,000 gross (summer peaks for matkas, festive peaks for cookware)',
    requiredResources: [
      'Electric potter wheel + small clay pug mill for uniform clay mixing',
      'Energy-efficient insulated firing kiln (reduces firewood by 40%)',
      'Corrugated honeycomb / dried husk transit packaging',
      'Lead-free testing certificate for unglazed foodware'
    ],
    targetCustomers: 'Local households, traditional restaurants, health-conscious urban kitchens, and festive diya/gifting buyers.',
    revenueModel: 'High-margin cookware & cooling matkas sold locally and shipped safely via shockproof packaging.',
    requiredSkills: [
      'Clay blending with mica/sand to prevent thermal cracking',
      'Uniform kiln firing temperature control (850–950°C)',
      'Double-walled transit cushioning for fragile earthenware'
    ],
    benefits: [
      'Electric wheel + pug mill triples daily output while reducing artisan fatigue',
      'PM Vishwakarma directly covers potters (Kumhar) with toolkit + 5% loans',
      'Zero toxic synthetic glazes creates genuine differentiation'
    ],
    challenges: [
      'Transit breakage risk requires tested corrugated & husk packaging',
      'Monsoon dampness halts open sun-drying without covered racks',
      'Seasonal demand dips require product diversification across seasons'
    ],
    relatedSchemeIds: ['scheme-pm-vishwakarma', 'scheme-pmmy-mudra'],
    referenceLinks: [
      { label: 'PM Vishwakarma Kumhar Trade Guide', url: 'https://pmvishwakarma.gov.in' },
      { label: 'KVIC Kumhar Sashaktikaran Yojana', url: 'https://www.kvic.gov.in' }
    ],
    status: 'verified',
    verifiedSource: 'KVIC Kumhar Sashaktikaran Reference',
    lastVerifiedDate: '2026-10-03',
    createdAt: '2026-09-28T08:30:00Z',
    updatedAt: '2026-10-03T16:10:00Z'
  },
  {
    id: 'proj-rural-soil-lab',
    slug: 'village-soil-water-testing-clinic',
    name: 'Mini Soil Health, Water Quality & Agri-Advisory Service Lab',
    category: 'services',
    industry: 'Agricultural Services & Extension',
    businessType: 'Fee-for-Service Rural Lab',
    locationSuitability: 'Block / Gram Panchayat Agricultural Market Centers',
    imageUrl: '/images/project_solar_cold_storage.jpg',
    description: 'Decentralized block-level soil NPK, pH, EC, and micronutrient rapid testing clinic helping farmers optimize fertilizer spending and generate digital Soil Health Cards.',
    keywords: ['soil testing', 'services', 'agriculture', 'lab', 'fertilizer', 'npk', 'ph', 'advisory', 'kisan'],
    requiredInvestment: '₹1,80,000 – ₹4,00,000',
    estimatedSetupCost: '₹2,40,000 (Digital soil analyzer, pH/EC meters, reagents & printer)',
    costAssumptions: 'Baseline kit for ~1,500–2,000 samples/year inside a rented 150 sq ft kiosk.',
    estimatedMonthlyRevenueRange: '₹25,000 – ₹55,000 service fees + input advisory margin (seasonal sowing peaks)',
    requiredResources: [
      'ICAR-calibrated Mini Soil Testing Kit / Digital Colorimeter',
      'Soil auger, drying trays, distilled water & certified reagents',
      'Thermal card printer & farmer SMS/WhatsApp dosage calculator'
    ],
    targetCustomers: 'Individual farmers, FPOs, horticulture nurseries, and cooperative sugar/cotton societies.',
    revenueModel: 'Per-sample testing fee (₹150–₹300/sample) + FPO annual soil-mapping contracts before Kharif & Rabi sowing.',
    requiredSkills: [
      'Representative multi-point soil sampling methodology',
      'Accurate reagent titration & digital calibration',
      'Translating NPK numbers into local crop fertilizer doses'
    ],
    benefits: [
      'Helps farmers save 15–25% on unnecessary urea/DAP overuse',
      'Low real-estate footprint suitable for educated rural youth',
      'Supports sustainable soil organic carbon restoration'
    ],
    challenges: [
      'Demand concentrates heavily in pre-Kharif and pre-Rabi months',
      'Reagent expiry and instrument calibration require strict logs',
      'Farmers need clear visual dosage printouts in regional languages'
    ],
    relatedSchemeIds: ['scheme-pmmy-mudra', 'scheme-aif'],
    referenceLinks: [
      { label: 'Soil Health Card Portal (Govt of India)', url: 'https://soilhealth.dac.gov.in' },
      { label: 'ICAR Agri-Clinics & Agri-Business Centers', url: 'https://www.agriclinics.net' }
    ],
    status: 'verified',
    verifiedSource: 'DACFW Soil Health Card Framework Reference',
    lastVerifiedDate: '2026-10-07',
    createdAt: '2026-09-29T10:45:00Z',
    updatedAt: '2026-10-07T10:45:00Z'
  },
  {
    id: 'proj-fallgram-commerce-os',
    slug: 'fallgram-rural-commerce-search-platform',
    name: 'GramSetu Rural Commerce & Mandi Intelligence Web Platform',
    category: 'technology',
    industry: 'Software & Rural Digital Infrastructure',
    businessType: 'Full-Stack Web Platform (SaaS / Marketplace)',
    locationSuitability: 'Pan-India Rural & Urban Digital Network',
    imageUrl: '/images/project_handloom_weaving.jpg',
    description: 'Production-grade multilingual web platform unifying direct rural producer storefronts, verified government scheme discovery, commodity mandi intelligence, and AI advisory.',
    keywords: ['software', 'technology', 'web app', 'react', 'sqlite', 'express', 'ecommerce', 'search', 'marketplace', 'fallgram'],
    requiredInvestment: '₹50,000 – ₹1,80,000 (Cloud hosting, domain & SMS/payment gateway)',
    estimatedSetupCost: '₹85,000 initial launch & verification setup',
    costAssumptions: 'Assumes in-house open-source stack (React, Node.js, SQLite/PostgreSQL) deployed on cloud container hosting.',
    estimatedMonthlyRevenueRange: 'Depends on transaction adoption & B2B SaaS hub subscriptions',
    requiredResources: [
      'Node.js + Express REST API server with rate limiting & RBAC',
      'Persistent SQLite / PostgreSQL relational database',
      'React + TypeScript + Tailwind CSS responsive frontend',
      'Optional Agmarknet data.gov.in API & Gemini API integration'
    ],
    targetCustomers: 'Rural FPOs, self-help groups, craft cooperatives, agri-entrepreneurs, and conscious urban buyers.',
    revenueModel: 'Zero-commission fair-trade buyer protection / institutional hub analytics subscriptions.',
    requiredSkills: [
      'Full-stack TypeScript, REST API design & relational SQL indexing',
      'Multilingual UI/UX and low-bandwidth mobile optimization',
      'Payment escrow reconciliation & security auditing'
    ],
    benefits: [
      'Unifies project discovery, govt subsidies, and market intelligence in one portal',
      'Deterministic ranked search prevents fake or mismatched product listings',
      '4-language interface lowers digital literacy barriers for village makers'
    ],
    challenges: [
      'Onboarding first-time rural sellers requires field coordinator support',
      'Maintaining verified external scheme & mandi data freshness',
      'Strict data validation & role-based access security enforcement'
    ],
    relatedSchemeIds: ['scheme-pmmy-mudra', 'scheme-standup-india'],
    referenceLinks: [
      { label: 'Digital India Portal', url: 'https://www.digitalindia.gov.in' },
      { label: 'Open Government Data Platform (data.gov.in)', url: 'https://data.gov.in' }
    ],
    implementationDetails: {
      techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Node.js', 'Express', 'SQLite (better-sqlite3)', '@google/genai'],
      frontendDetails: 'Responsive SPA with Light/Dark theme engine, 4-language i18n, debounced universal search, and strict type-separated Project/Product modals.',
      backendDetails: 'Express REST API with HMAC Bearer authentication, RBAC middleware, rate limiting, and deterministic multi-tier search scoring.',
      databaseDetails: 'Normalized SQLite schema with foreign keys & indexes across users, projects, schemes, markets, products, orders, reviews, and audit trails.',
      features: ['Universal ranked search', 'Verified Govt Schemes filterable explorer', 'Mandi price board with optional live data.gov.in sync', 'Role-protected Admin Console'],
      sourceOrDemoUrl: '#projects'
    },
    status: 'verified',
    verifiedSource: 'GramSetu Engineering Architecture Spec',
    lastVerifiedDate: '2026-10-12',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-12T08:00:00Z'
  }
];

export const INITIAL_SCHEMES: GovernmentScheme[] = [
  {
    id: 'scheme-pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    tagline: 'End-to-end holistic support for traditional rural artisans & craftspeople across 18 trades.',
    ministry: 'Ministry of Micro, Small & Medium Enterprises (MoMSME)',
    level: 'Central',
    state: 'All India',
    category: 'artisan_toolkits',
    schemeType: 'Toolkit & Training',
    eligibilityTarget: 'Traditional artisans & craftspeople (18+ years, unorganized/self-employed)',
    description: 'Central Sector Scheme providing PM Vishwakarma Certificate & ID card, basic and advanced skill training with daily stipend, ₹15,000 toolkit e-voucher, and collateral-free enterprise credit at a 5% concessional interest rate.',
    purposeBenefits: [
      'Recognition via official PM Vishwakarma Certificate and ID Card',
      'Toolkit incentive up to ₹15,000 via e-RUPI / e-voucher',
      'Skill upgradation training (5-7 days basic + 15+ days advanced) with ₹500/day stipend',
      'Collateral-free credit: ₹1 Lakh (1st tranche, 18 months) & ₹2 Lakh (2nd tranche, 30 months) at 5% interest'
    ],
    eligibilityCriteria: [
      'Artisan or craftsperson working with hands and tools in one of 18 notified trades (Carpenter, Potter, Weaver/Tailor, Blacksmith, Mason, Basket/Mat/Broom maker, etc.)',
      'Minimum age 18 years on date of registration',
      'Must not have availed similar credit under PMEGP, PM SVANidhi, or Mudra in past 5 years (exceptions apply for Mudra/SVANidhi repaid)',
      'Limited to one member per family; government employees excluded'
    ],
    documents: [
      'Aadhaar Card (linked with active mobile number)',
      'Bank Account Passbook / IFSC details',
      'Ration Card / Family ID',
      'Skill & Trade Declaration via CSC Biometric Verification'
    ],
    applicationProcess: [
      'Visit nearest Common Service Centre (CSC) with Aadhaar & Bank details',
      'Complete Aadhaar e-KYC and trade registration on pmvishwakarma.gov.in',
      '3-Stage verification by Gram Panchayat / ULB, District Committee, and Screening Committee',
      'Receive Digital ID, attend 5-day training, claim ₹15,000 toolkit voucher & bank loan'
    ],
    financialAssistance: 'Up to ₹3,00,000 collateral-free loan @ 5% fixed + ₹15,000 Toolkit Grant',
    maxLoanAmount: 300000,
    loanDisplay: 'Up to ₹3,00,000',
    tranches: '₹1,00,000 (Tranche 1) + ₹2,00,000 (Tranche 2)',
    interestRate: '5.0% Fixed Concessional Rate',
    interestSubvention: 'Up to 8% Govt interest subvention paid directly to banks',
    subsidyGrant: '₹15,000 Toolkit e-Voucher + ₹500/day Training Stipend',
    collateral: '100% Collateral-Free (CGTMSE Backed)',
    deadline: 'Ongoing Open Enrollment (FY 2023-24 to FY 2027-28)',
    status: 'active',
    officialUrl: 'https://pmvishwakarma.gov.in',
    officialSource: 'pmvishwakarma.gov.in (Ministry of MSME)',
    lastVerifiedDate: '2026-10-10',
    badge: 'Artisan Priority',
    eligibleTrades: ['Potters (Kumhar)', 'Basket/Bamboo Makers', 'Carpenters', 'Tailors & Weavers', 'Blacksmiths', 'Toy Makers'],
    processingTime: 'Approx. 21-35 days (3-stage verification)'
  },
  {
    id: 'scheme-pmmy-mudra',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    tagline: 'Collateral-free micro & small enterprise credit from ₹50,000 up to ₹20 Lakh.',
    ministry: 'Ministry of Finance (Dept of Financial Services)',
    level: 'Central',
    state: 'All India',
    category: 'collateral_free_loans',
    schemeType: 'Loan & Credit',
    eligibilityTarget: 'Non-corporate small business entrepreneurs, micro-manufacturers, traders & allied agri units',
    description: 'Provides institutional credit through Public/Private Sector Banks, RRBs, Small Finance Banks, and MFIs under Shishu (up to ₹50k), Kishore (₹50k–₹5L), Tarun (₹5L–₹10L), and Tarun Plus (₹10L–₹20L for repeat borrowers who repaid Tarun loans).',
    purposeBenefits: [
      'Zero collateral security required under Credit Guarantee Fund for Micro Units (CGFMU)',
      'Supports working capital, machinery purchase, shop modernization, and agri-allied units',
      'Four graded tiers matching business scale: Shishu, Kishore, Tarun, and Tarun Plus'
    ],
    eligibilityCriteria: [
      'Indian citizen above 18 years with viable non-farm income-generating business plan (manufacturing, trading, services, or allied agriculture)',
      'Clean credit track record with no wilful bank default',
      'Tarun Plus (₹10L–₹20L) applies only to entrepreneurs who have successfully availed and repaid previous Tarun category loans'
    ],
    documents: [
      'Aadhaar Card & PAN Card',
      'Passport-size Photographs & Address Proof',
      'Business Registration (Udyam Registration) & Brief Project Plan',
      'Last 6–12 Months Bank Statement & Machinery Quotations'
    ],
    applicationProcess: [
      'Prepare a simple 1-page business cost & revenue estimate',
      'Register Udyam Assist / Udyam Certificate online (free on udyamregistration.gov.in)',
      'Apply online via JanSamarth Portal (jansamarth.in) or nearest bank branch',
      'Bank appraises cash flow and disburses directly to supplier / business account'
    ],
    financialAssistance: '₹50,000 to ₹20,00,000 Collateral-Free Business Credit',
    maxLoanAmount: 2000000,
    loanDisplay: 'Up to ₹20,00,000',
    tranches: 'Shishu (≤₹50k) · Kishore (≤₹5L) · Tarun (≤₹10L) · Tarun Plus (≤₹20L)',
    interestRate: '8.5% – 11.5% (varies by lending bank & credit score)',
    interestSubvention: 'Bank MCLR/Repo-linked; zero collateral guarantee fees borne by scheme',
    subsidyGrant: 'CGFMU Credit Guarantee Coverage (No Third-Party Security Needed)',
    collateral: '100% Collateral-Free',
    deadline: 'Ongoing Year-Round',
    status: 'active',
    officialUrl: 'https://www.mudra.org.in',
    officialSource: 'mudra.org.in & jansamarth.in (Ministry of Finance)',
    lastVerifiedDate: '2026-10-10',
    badge: 'Zero Collateral Credit',
    eligibleTrades: ['Small Retail & Kirana', 'Artisan Workshops', 'Service Kiosks', 'Food Carts & Dairy', 'E-Rickshaw / Transport'],
    processingTime: '10-20 working days (via JanSamarth / Bank)'
  },
  {
    id: 'scheme-pmegp',
    name: "PMEGP (Prime Minister's Employment Generation Programme)",
    tagline: 'Up to 35% rural capital subsidy for new manufacturing and service micro-enterprises.',
    ministry: 'Ministry of MSME (Implemented via KVIC)',
    level: 'Central',
    state: 'All India',
    category: 'capital_subsidies',
    schemeType: 'Capital Subsidy',
    eligibilityTarget: 'New enterprises by individuals (18+ yrs), SHGs, Cooperatives & Charitable Trusts',
    description: 'Credit-linked margin money subsidy scheme administered by KVIC to establish new self-employment micro-enterprises in manufacturing (project cost up to ₹50 Lakh) and business/service sector (up to ₹20 Lakh).',
    purposeBenefits: [
      'Rural Special Category (Women, SC/ST, OBC, Minorities, Ex-Servicemen, Hill/NE): 35% Govt Margin Money Subsidy',
      'Rural General Category: 25% Margin Money Subsidy (Urban General: 15%, Urban Special: 25%)',
      'Beneficiary contribution is only 5% (Special) or 10% (General) of project cost'
    ],
    eligibilityCriteria: [
      'Any individual aged 18+ years; for projects above ₹10 Lakh (Mfg) or ₹5 Lakh (Service), minimum 8th standard pass required',
      'Only for NEW projects (existing units that already availed govt subsidy are ineligible)',
      'Must complete mandatory Entrepreneurship Development Programme (EDP) training before subsidy release'
    ],
    documents: [
      'Aadhaar, PAN, & Educational Qualification Certificate',
      'Detailed Project Report (DPR) with Machinery Quotations',
      'Rural Area / Caste / Special Category Certificate (where applicable)',
      'Rent Agreement or Owned Land Proof for Workshop'
    ],
    applicationProcess: [
      'Apply online directly on kviconline.gov.in/pmegpeportal (zero agent fee)',
      'Select implementing agency (KVIC, KVIB, or DIC) and upload DPR + documents',
      'Task Force Committee interview & bank loan sanction',
      'Complete free EDP training -> subsidy locked in Term Deposit for 3 years & adjusted against loan'
    ],
    financialAssistance: 'Project ceiling ₹50L (Mfg) / ₹20L (Service) with 25%–35% Rural Subsidy',
    maxLoanAmount: 5000000,
    loanDisplay: 'Up to ₹50,00,000',
    tranches: 'Max ₹50L (Manufacturing) · Max ₹20L (Service/Trading)',
    interestRate: 'Normal Bank MSME Rate (~9.5%–11.5%, charged only on net non-subsidized loan)',
    interestSubvention: 'Effective borrowing drops sharply via 25%-35% principal subsidy',
    subsidyGrant: '25% to 35% Margin Money Capital Subsidy in Rural Areas',
    collateral: 'Collateral-Free up to ₹10L (CGTMSE optional above ₹10L)',
    deadline: 'Ongoing Online Portal',
    status: 'active',
    officialUrl: 'https://www.kviconline.gov.in/pmegpeportal',
    officialSource: 'kviconline.gov.in (KVIC / Ministry of MSME)',
    lastVerifiedDate: '2026-10-10',
    badge: '35% Capital Subsidy',
    eligibleTrades: ['Oil Mills & Dal Mills', 'Spice Processing', 'Wood/Bamboo Mfg', 'Garment Units', 'Agri Repair Services'],
    processingTime: '30-60 days (DPR Screening + Bank Appraisal)'
  },
  {
    id: 'scheme-pmfme',
    name: 'PMFME (PM Formalisation of Micro Food Processing Enterprises)',
    tagline: '35% credit-linked subsidy up to ₹10 Lakh per unit for spices, dairy, grains & food units.',
    ministry: 'Ministry of Food Processing Industries (MoFPI)',
    level: 'Central',
    state: 'All India',
    category: 'capital_subsidies',
    schemeType: 'Capital Subsidy',
    eligibilityTarget: 'Existing & new micro food processing units, FPOs, SHGs & Producer Cooperatives',
    description: 'Supports micro food processors with 35% eligible capital subsidy (ceiling ₹10 Lakh per unit), ₹40,000/member SHG seed capital, and One District One Product (ODOP) branding & packaging assistance.',
    purposeBenefits: [
      '35% credit-linked capital subsidy on eligible plant & machinery up to ₹10 Lakh',
      '₹40,000 seed capital per SHG member engaged in food processing (via NRLM)',
      'Up to 50% grant support for branding & marketing for FPOs/SHGs'
    ],
    eligibilityCriteria: [
      'Individual micro food entrepreneurs, proprietorship/partnership firms, FPOs, SHGs, or Cooperatives',
      'Applicant must be 18+ years with minimum 10% own contribution',
      'Food processing activity aligned with state/district food safety & ODOP priorities preferred'
    ],
    documents: [
      'Aadhaar, PAN, & Bank Account Details',
      'Udyam Registration & FSSAI Registration/Application',
      'Machinery Proforma Invoices & DPR',
      'Electricity Bill / Proof of Premises'
    ],
    applicationProcess: [
      'Register on official PMFME MIS portal (pmfme.mofpi.gov.in)',
      'District Resource Person (DRP) assists free of cost with DPR upload',
      'District Level Committee recommendation & bank loan sanction',
      'Subsidy released directly by Nodal Bank against eligible machinery/civil assets'
    ],
    financialAssistance: '35% Capital Subsidy up to ₹10,00,000 + ₹40k SHG Seed Capital',
    maxLoanAmount: 3000000,
    loanDisplay: 'Up to ₹30L Project',
    tranches: '35% Subsidy Capped at ₹10,00,000 per enterprise',
    interestRate: 'Standard Bank MSME Interest Rate',
    interestSubvention: 'Direct 35% Capital Principal Reduction',
    subsidyGrant: '35% Credit-Linked Capital Grant (Max ₹10 Lakh)',
    collateral: 'As per RBI/CGTMSE MSME Norms (Zero collateral up to ₹10L)',
    deadline: 'Active through FY 2025-26 / Ongoing Portal Window',
    status: 'active',
    officialUrl: 'https://pmfme.mofpi.gov.in',
    officialSource: 'pmfme.mofpi.gov.in (Ministry of Food Processing Industries)',
    lastVerifiedDate: '2026-10-09',
    badge: 'Food Processing 35%',
    eligibleTrades: ['Turmeric & Spice Milling', 'Dairy & Paneer Units', 'Cold-Pressed Oils', 'Pickle/Papad SHGs', 'Grain & Millet Processing'],
    processingTime: '30-45 days via District Resource Person'
  },
  {
    id: 'scheme-standup-india',
    name: 'Stand-Up India Scheme',
    tagline: 'Bank loans from ₹10 Lakh to ₹1 Crore for Women and SC/ST greenfield entrepreneurs.',
    ministry: 'Ministry of Finance & SIDBI',
    level: 'Central',
    state: 'All India',
    category: 'women_entrepreneurs',
    schemeType: 'Loan & Credit',
    eligibilityTarget: 'Women entrepreneurs & SC/ST entrepreneurs setting up greenfield ventures',
    description: 'Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one Woman borrower per bank branch for setting up a greenfield enterprise in manufacturing, services, agri-allied activities, or trading.',
    purposeBenefits: [
      'Composite loan covering both term loan and working capital (up to ₹1 Crore)',
      'Up to 85% project financing (reduced to 75% if converged with state subsidies)',
      'Repayment tenure up to 7 years with maximum 18-month moratorium'
    ],
    eligibilityCriteria: [
      'SC/ST and/or Woman entrepreneur above 18 years of age',
      'Applicable strictly for GREENFIELD (first-time) enterprise in manufacturing, trading, services, or agri-allied sectors',
      'In non-individual enterprises, at least 51% shareholding and controlling stake must be held by SC/ST or Woman entrepreneur'
    ],
    documents: [
      'Identity, Address & Caste/Gender Eligibility Proof',
      'Detailed Greenfield Project Report & Business Premises Lease',
      'PAN Card, Udyam Certificate & Bank Statements',
      'Income Tax / Net Worth Statement (if applicable)'
    ],
    applicationProcess: [
      'Register on standupmitra.in or jansamarth.in and complete readiness questionnaire',
      'Connect with Lead District Manager (LDM) or nearest Scheduled Commercial Bank branch',
      'Submit DPR for appraisal with Credit Guarantee Fund (CGFSI) backing',
      'Disbursal via RuPay debit/credit facility for working capital & term asset purchase'
    ],
    financialAssistance: '₹10,00,000 to ₹1,00,00,000 Composite Term & Working Capital Loan',
    maxLoanAmount: 10000000,
    loanDisplay: '₹10L – ₹1 Crore',
    tranches: 'Single Composite Loan (Term + Working Capital)',
    interestRate: 'Lowest applicable bank rate (Base Rate / MCLR + 3% + tenor premium)',
    interestSubvention: 'Can be converged with eligible state capital/interest subsidies',
    subsidyGrant: 'CGFSI Credit Guarantee Cover + Handholding Support via SIDBI',
    collateral: 'Collateral-Free under CGFSI Guarantee (or primary asset hypothecation)',
    deadline: 'Active Ongoing Scheme',
    status: 'active',
    officialUrl: 'https://www.standupmitra.in',
    officialSource: 'standupmitra.in (SIDBI / Dept of Financial Services)',
    lastVerifiedDate: '2026-10-08',
    badge: 'Women & SC/ST',
    eligibleTrades: ['Women-Led Food Units', 'Apparel & Handloom Studios', 'Agri-Allied Enterprises', 'Retail & Diagnostics'],
    processingTime: '30-45 days'
  },
  {
    id: 'scheme-nabard-shg',
    name: 'NABARD SHG-Bank Linkage & FPO Credit Support',
    tagline: 'Concessional group micro-credit for Rural Women Self-Help Groups and FPOs.',
    ministry: 'NABARD (National Bank for Agriculture & Rural Development)',
    level: 'Central',
    state: 'All India',
    category: 'women_entrepreneurs',
    schemeType: 'Micro-Credit',
    eligibilityTarget: 'Registered Women Self-Help Groups (SHGs) & Farmer Producer Organizations (FPOs)',
    description: 'Channelizes collateral-free revolving funds and enterprise term loans through Rural Cooperative Banks, RRBs, and Commercial Banks to rural women SHGs (under DAY-NRLM) and FPOs.',
    purposeBenefits: [
      'Collateral-free SHG loans up to ₹10–₹20 Lakh under DAY-NRLM norms',
      'Prompt-repayment interest subvention reducing effective interest down to ~4%–7% in notified districts',
      'Skill training, bookkeeping digitization (E-Shakti), and rural mart exhibition support'
    ],
    eligibilityCriteria: [
      'Active SHG (10-20 rural women members) existing for at least 6 months with Panchasutra adherence',
      'Regular internal savings, meetings, and transparent ledger records',
      'FPOs must be legally registered under Companies Act / Cooperative Societies Act'
    ],
    documents: [
      'SHG Resolution & Member Aadhaar KYC List',
      'Savings Bank Passbook & Panchasutra Grading Sheet',
      'NRLM / SRLM Block Coordinator Verification'
    ],
    applicationProcess: [
      'Pass group loan resolution during weekly/monthly SHG meeting',
      'Submit credit linkage file via Block Mission Management Unit (BMMU) / Bank Sakhi',
      'Bank grades SHG savings discipline and opens/enhances Cash Credit Limit (CCL)'
    ],
    financialAssistance: '₹1,50,000 to ₹20,00,000 SHG Cash Credit Limit (4%–7% Effective Rate)',
    maxLoanAmount: 2000000,
    loanDisplay: 'Up to ₹20,00,000',
    tranches: 'Graded CCL: ₹1.5L (Yr 1) -> ₹3L (Yr 2) -> ₹6L+ (Yr 3+)',
    interestRate: '7% Base (4% Effective on Prompt Repayment in eligible districts)',
    interestSubvention: '3%–5% Interest Subvention via DAY-NRLM / State Rural Livelihood Missions',
    subsidyGrant: 'DAY-NRLM Interest Subvention + Revolving Fund Support',
    collateral: '100% Collateral-Free Group Guarantee',
    deadline: 'Ongoing Year-Round via SRLM & Banks',
    status: 'active',
    officialUrl: 'https://www.nabard.org',
    officialSource: 'nabard.org & aajeevika.gov.in',
    lastVerifiedDate: '2026-10-08',
    badge: 'Women SHG Micro-Credit',
    eligibleTrades: ['Women Dairy Collectives', 'Spice & Pickle SHGs', 'Handloom Clusters', 'Seed Banks & Nursery Groups'],
    processingTime: '14-21 days via Bank Sakhi'
  },
  {
    id: 'scheme-aif',
    name: 'Agriculture Infrastructure Fund (AIF)',
    tagline: '3% interest subvention & credit guarantee up to ₹2 Crore for solar cold storage & grading hubs.',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central',
    state: 'All India',
    category: 'capital_subsidies',
    schemeType: 'Infrastructure',
    eligibilityTarget: 'Farmers, FPOs, PACS, Agri-Entrepreneurs & Rural Startups',
    description: 'Medium-to-long term debt financing facility for post-harvest management infrastructure including cold storages, pack houses, assaying units, warehouses, and primary processing.',
    purposeBenefits: [
      '3% per annum interest subvention on loans up to ₹2 Crore for maximum 7 years',
      'Credit guarantee coverage under CGTMSE up to ₹2 Crore (fee borne by Government)',
      'Can be converged with central/state capital subsidy schemes (e.g., PMFME, MIDH)'
    ],
    eligibilityCriteria: [
      'Farmers, FPOs, PACS, SHGs, Agri-entrepreneurs, Joint Liability Groups, or State Agencies',
      'Project must involve post-harvest infrastructure or community farming assets',
      'Viable DPR submitted on official AIF portal'
    ],
    documents: [
      'Applicant KYC & Entity Registration (FPO/PACS/Proprietorship)',
      'Detailed Project Report (DPR) with Civil/Equipment Quotations',
      'Land Ownership or Long-Term Registered Lease Deed'
    ],
    applicationProcess: [
      'Apply online at agriinfra.dac.gov.in with project location & DPR',
      'Central Project Monitoring Unit (PMU) conducts preliminary verification',
      'Selected lending bank appraises and sanctions loan with auto-applied 3% interest subvention'
    ],
    financialAssistance: '3% Interest Subvention + CGTMSE Guarantee on Loans up to ₹2 Crore',
    maxLoanAmount: 20000000,
    loanDisplay: 'Up to ₹2 Crore',
    tranches: 'Term Loan up to 7 Years (with up to 2-year moratorium)',
    interestRate: 'Capped at 9% before subvention (~6% effective after 3% subvention)',
    interestSubvention: '3.0% Annual Interest Subvention Paid by Central Govt',
    subsidyGrant: '3% Interest Subvention + Zero CGTMSE Guarantee Fee',
    collateral: 'CGTMSE Covered up to ₹2 Crore (Primary asset hypothecated)',
    deadline: 'Active (Financing Facility Operational through FY 2025-26 / Disbursal Window)',
    status: 'active',
    officialUrl: 'https://agriinfra.dac.gov.in',
    officialSource: 'agriinfra.dac.gov.in (Ministry of Agriculture)',
    lastVerifiedDate: '2026-10-09',
    badge: 'Cold-Chain & Infra',
    eligibleTrades: ['Solar Cold Storage', 'Warehouse & Silos', 'Sorting & Pack Houses', 'Custom Hiring Centers'],
    processingTime: '30-60 days'
  },
  {
    id: 'scheme-cmegp-mh',
    name: 'Chief Minister Employment Generation Programme (CMEGP - Maharashtra)',
    tagline: 'State-level 15%–35% subsidy for rural & semi-urban manufacturing and service ventures in Maharashtra.',
    ministry: 'Directorate of Industries, Govt of Maharashtra',
    level: 'State',
    state: 'Maharashtra',
    category: 'capital_subsidies',
    schemeType: 'Capital Subsidy',
    eligibilityTarget: 'Maharashtra domicile entrepreneurs aged 18–45 years (50 yrs for Special Category)',
    description: 'Maharashtra State Government credit-linked subsidy scheme modeled on PMEGP for establishing new manufacturing (up to ₹50L) and service/agro-allied businesses (up to ₹20L), with 30%–35% rural subsidy for Special Categories.',
    purposeBenefits: [
      'Rural General Category: 25% Subsidy · Rural Special Category (Women/SC/ST/OBC): 35% Subsidy',
      'Low own-contribution requirement of 5% (Special) to 10% (General)',
      'Covers agro-based rural processing, oil ghanis, spice mills, and service units'
    ],
    eligibilityCriteria: [
      'Domicile of Maharashtra aged 18 to 45 years (5-year relaxation for Women, SC/ST, OBC, Minorities)',
      'Minimum 7th pass (projects up to ₹10L) or 10th pass (projects above ₹10L)',
      'Only new enterprises eligible; must complete online/offline EDP training'
    ],
    documents: [
      'Aadhaar Card & Maharashtra Domicile / Birth Certificate',
      'Educational Certificate & Project Report (DPR)',
      'Caste Certificate (if claiming Special Category) & Passport Photo',
      'Gram Panchayat NOC / Workshop Rent Agreement'
    ],
    applicationProcess: [
      'Register online via maha-cmegp.gov.in portal',
      'District Industries Centre (DIC) / KVIB reviews documents and schedules interview',
      'Recommended application forwarded to bank for loan sanction & EDP training'
    ],
    financialAssistance: 'Up to ₹50L Project Cost · 25%–35% Rural Capital Subsidy',
    maxLoanAmount: 5000000,
    loanDisplay: 'Up to ₹50,00,000',
    tranches: 'Max ₹50L (Manufacturing) · Max ₹20L (Service/Agro)',
    interestRate: 'Standard Bank MSME Interest Rate',
    interestSubvention: '25%-35% Capital Subsidy reduces net principal debt',
    subsidyGrant: '25% (Rural General) to 35% (Rural Women/SC/ST/OBC) Subsidy',
    collateral: 'CGTMSE Collateral-Free Norms Applicable',
    deadline: 'Annual State Target Window (Active)',
    status: 'active',
    officialUrl: 'https://maha-cmegp.gov.in',
    officialSource: 'maha-cmegp.gov.in (Govt of Maharashtra)',
    lastVerifiedDate: '2026-10-05',
    badge: 'Maharashtra State',
    eligibleTrades: ['Food & Spice Processing', 'Dairy Products', 'Bamboo & Woodcraft', 'Rural Service Units'],
    processingTime: '30-50 days via DIC'
  },
  {
    id: 'scheme-pmfby-kharif-archive',
    name: 'PMFBY Kharif Crop Insurance Enrollment Window (2026 Kharif Cycle)',
    tagline: 'Seasonal crop insurance enrollment window (Closed for Kharif 2026; Rabi window upcoming).',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central',
    state: 'All India',
    category: 'capital_subsidies',
    schemeType: 'Infrastructure',
    eligibilityTarget: 'Loanee & non-loanee farmers cultivating notified Kharif crops',
    description: 'Pradhan Mantri Fasal Bima Yojana provides comprehensive crop risk insurance at capped farmer premiums (2% for Kharif, 1.5% for Rabi). Note: The 2026 Kharif enrollment cut-off closed on 31 July 2026; Rabi enrollment opens per state notification.',
    purposeBenefits: [
      'Farmer pays maximum 2% premium for Kharif and 1.5% for Rabi; balance subsidized by Central/State Govts',
      'Covers prevented sowing, localized hailstorm/landslide, standing crop yield loss, and post-harvest cyclone risks'
    ],
    eligibilityCriteria: [
      'Cultivator / sharecropper / tenant farmer growing notified crop in notified area',
      'Valid land record (Khatauni/7-12) or sowing declaration certificate'
    ],
    documents: [
      'Aadhaar Card & Bank Passbook',
      'Land Possession Record (RoR / Khatauni) or Tenant Agreement',
      'Sowing Certificate issued by Patwari / Village Officer'
    ],
    applicationProcess: [
      'Check active seasonal notification on pmfby.gov.in before cut-off date',
      'Enroll through bank branch, CSC center, or PMFBY Farmer portal'
    ],
    financialAssistance: 'Subsidized Crop Insurance Coverage (2% Kharif / 1.5% Rabi Farmer Premium)',
    maxLoanAmount: 500000,
    loanDisplay: 'Sum Insured / Ha',
    tranches: 'Seasonal Cycle (Kharif & Rabi)',
    interestRate: 'Not Applicable (Insurance Premium Subsidy)',
    interestSubvention: 'Govt bears ~80%-90% of actuarial insurance premium',
    subsidyGrant: 'Central + State Actuarial Premium Subsidy',
    collateral: 'Zero Collateral',
    deadline: '2026 Kharif Cut-off Expired (31 July 2026) · Check Rabi Window',
    status: 'expired',
    officialUrl: 'https://pmfby.gov.in',
    officialSource: 'pmfby.gov.in (Ministry of Agriculture)',
    lastVerifiedDate: '2026-10-01',
    badge: 'Seasonal Cut-off Closed',
    eligibleTrades: ['Paddy & Millet Farmers', 'Pulses & Oilseed Growers', 'Cotton & Horticulture'],
    processingTime: 'Seasonal Notification Dependent'
  }
];

export const INITIAL_MARKET_PRICES: MarketPrice[] = [
  {
    id: 'mkt-turmeric-erode',
    commodityName: 'Turmeric (Finger / Salem Grade)',
    variety: 'Finger Polished',
    category: 'Spices',
    marketName: 'Erode APMC Regulated Market',
    district: 'Erode',
    state: 'Tamil Nadu',
    minPrice: 13200,
    maxPrice: 15800,
    modalPrice: 14650,
    unit: '₹ / Quintal (100 kg)',
    previousPrice: 14300,
    demandLevel: 'High',
    supplyLevel: 'Steady',
    priceDate: '2026-10-10',
    dataSource: 'Agmarknet Reference Dataset (data.gov.in)',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-wheat-bhal',
    commodityName: 'Wheat (Sharbati / Lokwan)',
    variety: 'Sharbati FAQ',
    category: 'Grains & Cereals',
    marketName: 'Indore Krishi Upaj Mandi',
    district: 'Indore',
    state: 'Madhya Pradesh',
    minPrice: 2780,
    maxPrice: 3250,
    modalPrice: 3040,
    unit: '₹ / Quintal (100 kg)',
    previousPrice: 2990,
    demandLevel: 'High',
    supplyLevel: 'Steady',
    priceDate: '2026-10-10',
    dataSource: 'Agmarknet Reference Dataset (data.gov.in)',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-mustard-alwar',
    commodityName: 'Mustard Seed (Black / Kachi Ghani Grade)',
    variety: '42% Oil Content FAQ',
    category: 'Oilseeds & Oils',
    marketName: 'Alwar Krishi Upaj Mandi',
    district: 'Alwar',
    state: 'Rajasthan',
    minPrice: 5750,
    maxPrice: 6320,
    modalPrice: 6080,
    unit: '₹ / Quintal (100 kg)',
    previousPrice: 5950,
    demandLevel: 'High',
    supplyLevel: 'Tight',
    priceDate: '2026-10-10',
    dataSource: 'Agmarknet Reference Dataset (data.gov.in)',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-onion-lasalgaon',
    commodityName: 'Onion (Red Nashik)',
    variety: 'Pole Red Medium-Bold',
    category: 'Vegetables',
    marketName: 'Lasalgaon APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    minPrice: 2200,
    maxPrice: 3450,
    modalPrice: 2950,
    unit: '₹ / Quintal (100 kg)',
    previousPrice: 3100,
    demandLevel: 'Moderate',
    supplyLevel: 'Steady',
    priceDate: '2026-10-10',
    dataSource: 'Agmarknet Reference Dataset (data.gov.in)',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-tomato-kolar',
    commodityName: 'Tomato (Hybrid Desi)',
    variety: 'Grade-A Crate',
    category: 'Vegetables',
    marketName: 'Kolar APMC Tomato Market',
    district: 'Kolar',
    state: 'Karnataka',
    minPrice: 1800,
    maxPrice: 2900,
    modalPrice: 2400,
    unit: '₹ / Quintal (100 kg)',
    previousPrice: 2150,
    demandLevel: 'High',
    supplyLevel: 'Tight',
    priceDate: '2026-10-10',
    dataSource: 'Agmarknet Reference Dataset (data.gov.in)',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-black-pepper-kochi',
    commodityName: 'Black Pepper (Tellicherry / Malabar)',
    variety: 'Ungarbled Bold',
    category: 'Spices',
    marketName: 'Kochi Spice Exchange Mandi',
    district: 'Ernakulam',
    state: 'Kerala',
    minPrice: 64500,
    maxPrice: 68200,
    modalPrice: 66800,
    unit: '₹ / Quintal (100 kg)',
    previousPrice: 66100,
    demandLevel: 'High',
    supplyLevel: 'Tight',
    priceDate: '2026-10-09',
    dataSource: 'Agmarknet & Spices Board Reference',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-cumin-unjha',
    commodityName: 'Cumin Seed (Jeera)',
    variety: 'Unjha Bold 99% Pure',
    category: 'Spices',
    marketName: 'Unjha APMC',
    district: 'Mehsana',
    state: 'Gujarat',
    minPrice: 23400,
    maxPrice: 26800,
    modalPrice: 25200,
    unit: '₹ / Quintal (100 kg)',
    previousPrice: 25600,
    demandLevel: 'Moderate',
    supplyLevel: 'Steady',
    priceDate: '2026-10-10',
    dataSource: 'Agmarknet Reference Dataset (data.gov.in)',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-paddy-varanasi',
    commodityName: 'Paddy (Basmati / Sona Masoori Common)',
    variety: 'Common Non-Basmati Grade-A',
    category: 'Grains & Cereals',
    marketName: 'Varanasi Paharia Mandi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    minPrice: 2260,
    maxPrice: 2490,
    modalPrice: 2380,
    unit: '₹ / Quintal (100 kg)',
    previousPrice: 2350,
    demandLevel: 'Moderate',
    supplyLevel: 'Surplus',
    priceDate: '2026-10-10',
    dataSource: 'Agmarknet Reference Dataset (data.gov.in)',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-oyster-mushroom-delhi',
    commodityName: 'Oyster Mushroom (Fresh Wholesale)',
    variety: 'Clean Trimmed Pack',
    category: 'Horticulture & Mushrooms',
    marketName: 'Azadpur APMC Fruit & Veg Market',
    district: 'North Delhi',
    state: 'Delhi',
    minPrice: 130,
    maxPrice: 195,
    modalPrice: 165,
    unit: '₹ / Kg',
    previousPrice: 160,
    demandLevel: 'High',
    supplyLevel: 'Tight',
    priceDate: '2026-10-10',
    dataSource: 'Azadpur APMC Reference Bulletin',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-chana-latur',
    commodityName: 'Bengal Gram (Desi Chana)',
    variety: 'Bold Desi FAQ',
    category: 'Pulses',
    marketName: 'Latur Krishi Upaj Mandi',
    district: 'Latur',
    state: 'Maharashtra',
    minPrice: 6750,
    maxPrice: 7350,
    modalPrice: 7100,
    unit: '₹ / Quintal (100 kg)',
    previousPrice: 7020,
    demandLevel: 'Moderate',
    supplyLevel: 'Steady',
    priceDate: '2026-10-10',
    dataSource: 'Agmarknet Reference Dataset (data.gov.in)',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-groundnut-rajkot',
    commodityName: 'Groundnut (Bold / G20 Pod)',
    variety: 'G-20 Sun-Dried',
    category: 'Oilseeds & Oils',
    marketName: 'Rajkot APMC',
    district: 'Rajkot',
    state: 'Gujarat',
    minPrice: 5900,
    maxPrice: 6650,
    modalPrice: 6280,
    unit: '₹ / Quintal (100 kg)',
    previousPrice: 6200,
    demandLevel: 'Moderate',
    supplyLevel: 'Surplus',
    priceDate: '2026-10-10',
    dataSource: 'Agmarknet Reference Dataset (data.gov.in)',
    sourceUrl: 'https://agmarknet.gov.in',
    isLiveApi: false
  },
  {
    id: 'mkt-raw-honey-sundarbans',
    commodityName: 'Forest Honey (Bulk Raw Floral)',
    variety: 'Unprocessed Raw Drums',
    category: 'Forest & Dairy Products',
    marketName: 'Canning / Kolkata Co-op Aggregation Hub',
    district: 'South 24 Parganas',
    state: 'West Bengal',
    minPrice: 360,
    maxPrice: 480,
    modalPrice: 420,
    unit: '₹ / Kg',
    previousPrice: 410,
    demandLevel: 'High',
    supplyLevel: 'Seasonal',
    priceDate: '2026-10-08',
    dataSource: 'State Forest Minor Produce Reference',
    sourceUrl: 'https://trifed.tribal.gov.in',
    isLiveApi: false
  }
];
