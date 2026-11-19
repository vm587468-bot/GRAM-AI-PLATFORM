import Database from 'better-sqlite3';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_DEALS,
  INITIAL_MESSAGES,
  INITIAL_TICKETS
} from './seedData';
import {
  INITIAL_PROJECT_CATEGORIES,
  INITIAL_PROJECTS,
  INITIAL_SCHEMES,
  INITIAL_MARKET_PRICES
} from './fallgramSeedData';
import {
  User,
  Project,
  ProjectCategory,
  GovernmentScheme,
  MarketPrice,
  Product,
  ProductDocument,
  Order,
  Review,
  DealOffer,
  SellerMessage,
  SupportTicket
} from '../src/types';

export function isValidProductImageUrl(rawUrl: string | null | undefined): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;
  // Never allow generic workshop/project images on products
  if (trimmed.includes('/images/project_') || trimmed.includes('/images/project-')) {
    return false;
  }
  if (trimmed.startsWith('/images/')) {
    return !trimmed.includes('..') && trimmed.length > '/images/'.length;
  }
  if (trimmed.startsWith('data:image/')) {
    return /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/i.test(trimmed);
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function resolveWritableDataDir(): string {
  const preferred = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(preferred)) {
      fs.mkdirSync(preferred, { recursive: true });
    }
    fs.accessSync(preferred, fs.constants.W_OK);
    return preferred;
  } catch {
    const fallback = path.join(os.tmpdir(), 'fallgram-data');
    if (!fs.existsSync(fallback)) {
      fs.mkdirSync(fallback, { recursive: true });
    }
    return fallback;
  }
}

const DATA_DIR = resolveWritableDataDir();
const DB_PATH = path.join(DATA_DIR, 'fallgram.db');
export const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ==================== PASSWORD & TOKEN HELPERS ====================
const TOKEN_SECRET =
  process.env.AUTH_SECRET ||
  process.env.JWT_SECRET ||
  'fallgram_ai_local_dev_hmac_secret_2026';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  const keyBuf = Buffer.from(keyHex, 'hex');
  const derivedBuf = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

export interface AuthTokenPayload {
  userId: string;
  role: 'entrepreneur' | 'customer' | 'admin';
  email: string;
  exp: number;
}

export function signAuthToken(payload: Omit<AuthTokenPayload, 'exp'>): string {
  const fullPayload: AuthTokenPayload = {
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const encoded = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expectedSig = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(encoded)
      .digest('base64url');
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }
    const decoded = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as AuthTokenPayload;
    if (!decoded || !decoded.userId || decoded.exp < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

// ==================== SCHEMA INITIALIZATION ====================
export function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('entrepreneur','customer','admin')),
      phone TEXT,
      location TEXT,
      state TEXT,
      avatar TEXT,
      bio TEXT,
      shg_name TEXT,
      joined_date TEXT,
      account_status TEXT NOT NULL DEFAULT 'active' CHECK(account_status IN ('active','suspended','pending')),
      last_login_at TEXT,
      last_login_type TEXT NOT NULL DEFAULT 'never' CHECK(last_login_type IN ('recent','never','unknown','inactive')),
      last_active_at TEXT,
      failed_login_attempts INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_login_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('success','failed')),
      ip TEXT,
      device TEXT
    );

    CREATE TABLE IF NOT EXISTS user_audit_trail (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      action TEXT NOT NULL CHECK(action IN ('suspend','reactivate')),
      by_admin TEXT NOT NULL,
      reason TEXT,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      icon_name TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      industry TEXT NOT NULL,
      business_type TEXT NOT NULL,
      location_suitability TEXT NOT NULL,
      image_url TEXT NOT NULL,
      description TEXT NOT NULL,
      keywords_json TEXT NOT NULL,
      required_investment TEXT NOT NULL,
      estimated_setup_cost TEXT NOT NULL,
      cost_assumptions TEXT NOT NULL,
      estimated_monthly_revenue_range TEXT,
      required_resources_json TEXT NOT NULL,
      target_customers TEXT NOT NULL,
      revenue_model TEXT NOT NULL,
      required_skills_json TEXT NOT NULL,
      benefits_json TEXT NOT NULL,
      challenges_json TEXT NOT NULL,
      related_scheme_ids_json TEXT NOT NULL,
      reference_links_json TEXT NOT NULL,
      implementation_details_json TEXT,
      status TEXT NOT NULL DEFAULT 'verified' CHECK(status IN ('verified','draft','archived')),
      verified_source TEXT,
      last_verified_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, project_id)
    );

    CREATE TABLE IF NOT EXISTS government_schemes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT,
      ministry TEXT NOT NULL,
      level TEXT NOT NULL,
      state TEXT NOT NULL,
      category TEXT NOT NULL,
      scheme_type TEXT NOT NULL,
      eligibility_target TEXT,
      description TEXT NOT NULL,
      purpose_benefits_json TEXT NOT NULL,
      eligibility_criteria_json TEXT NOT NULL,
      documents_json TEXT NOT NULL,
      application_process_json TEXT NOT NULL,
      financial_assistance TEXT,
      max_loan_amount INTEGER NOT NULL DEFAULT 0,
      loan_display TEXT,
      tranches TEXT,
      interest_rate TEXT,
      interest_subvention TEXT,
      subsidy_grant TEXT,
      collateral TEXT,
      deadline TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','upcoming','expired')),
      official_url TEXT,
      official_source TEXT,
      last_verified_date TEXT,
      badge TEXT,
      eligible_trades_json TEXT,
      processing_time TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS scheme_applications (
      id TEXT PRIMARY KEY,
      applicant_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      scheme_id TEXT NOT NULL,
      scheme_name TEXT NOT NULL,
      ministry TEXT,
      trade TEXT,
      requested_amount TEXT,
      status TEXT NOT NULL,
      kiosk_location TEXT,
      submitted_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS market_prices (
      id TEXT PRIMARY KEY,
      commodity_name TEXT NOT NULL,
      variety TEXT,
      category TEXT NOT NULL,
      market_name TEXT NOT NULL,
      district TEXT,
      state TEXT NOT NULL,
      min_price REAL NOT NULL,
      max_price REAL NOT NULL,
      modal_price REAL NOT NULL,
      unit TEXT NOT NULL,
      previous_price REAL,
      demand_level TEXT,
      supply_level TEXT,
      price_date TEXT NOT NULL,
      data_source TEXT NOT NULL,
      source_url TEXT,
      is_live_api INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      artisan_id TEXT NOT NULL,
      artisan_name TEXT NOT NULL,
      artisan_location TEXT NOT NULL,
      title TEXT NOT NULL,
      brand TEXT,
      model TEXT,
      category TEXT NOT NULL,
      condition TEXT NOT NULL DEFAULT 'new',
      price REAL NOT NULL,
      original_price REAL,
      stock INTEGER NOT NULL DEFAULT 0,
      unit TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 5.0,
      reviews_count INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      images_json TEXT NOT NULL,
      description TEXT NOT NULL,
      specifications_json TEXT,
      warranty TEXT,
      return_policy TEXT,
      defects_notice TEXT,
      verified_seller INTEGER NOT NULL DEFAULT 1,
      seller_verification_badge TEXT,
      authenticity_status TEXT NOT NULL DEFAULT 'verified',
      artisan_story TEXT,
      materials_json TEXT,
      in_stock INTEGER NOT NULL DEFAULT 1,
      featured INTEGER NOT NULL DEFAULT 0,
      fair_trade_percent INTEGER NOT NULL DEFAULT 86,
      deal_badge TEXT,
      moderation_status TEXT NOT NULL DEFAULT 'approved',
      reported_reason TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_avatar TEXT,
      rating INTEGER NOT NULL,
      quality_rating INTEGER,
      durability_rating INTEGER,
      value_for_money_rating INTEGER,
      seller_experience_rating INTEGER,
      comment TEXT NOT NULL,
      date TEXT NOT NULL,
      verified_purchase INTEGER NOT NULL DEFAULT 0,
      review_images_json TEXT,
      helpful_count INTEGER NOT NULL DEFAULT 0,
      reported INTEGER NOT NULL DEFAULT 0,
      report_reason TEXT,
      artisan_reply TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      tracking_id TEXT UNIQUE NOT NULL,
      customer_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      items_json TEXT NOT NULL,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'UPI',
      payment_status TEXT NOT NULL DEFAULT 'PAID',
      upi_ref_id TEXT,
      order_status TEXT NOT NULL DEFAULT 'placed',
      cancellation_reason TEXT,
      return_reason TEXT,
      created_at TEXT NOT NULL,
      delivery_date_estimated TEXT,
      current_hub TEXT,
      delivery_partner TEXT,
      delivery_agent_phone TEXT,
      delivery_otp TEXT
    );

    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      discount_percentage INTEGER NOT NULL,
      coupon_code TEXT NOT NULL,
      category TEXT NOT NULL,
      valid_until TEXT NOT NULL,
      terms TEXT,
      min_order_value REAL NOT NULL DEFAULT 0,
      verified INTEGER NOT NULL DEFAULT 1,
      featured_product_ids_json TEXT
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      product_title TEXT,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      recipient_id TEXT NOT NULL,
      recipient_name TEXT,
      text TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      role TEXT NOT NULL,
      subject TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      priority TEXT NOT NULL DEFAULT 'medium',
      created_at TEXT NOT NULL,
      messages_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      results_count INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
    CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
    CREATE INDEX IF NOT EXISTS idx_schemes_category ON government_schemes(category);
    CREATE INDEX IF NOT EXISTS idx_schemes_state ON government_schemes(state);
    CREATE INDEX IF NOT EXISTS idx_markets_category ON market_prices(category);
    CREATE INDEX IF NOT EXISTS idx_markets_state ON market_prices(state);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_title ON products(title);
    CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking_id);
  `);

  // Safe incremental schema migrations for existing SQLite databases
  const prodCols = (db.prepare('PRAGMA table_info(products)').all() as { name: string }[]).map(c => c.name);
  if (!prodCols.includes('sku')) {
    db.exec('ALTER TABLE products ADD COLUMN sku TEXT');
  }
  if (!prodCols.includes('documents_json')) {
    db.exec('ALTER TABLE products ADD COLUMN documents_json TEXT');
  }
  if (!prodCols.includes('updated_at')) {
    db.exec('ALTER TABLE products ADD COLUMN updated_at TEXT');
  }

  seedIfEmpty();
  reconcileProductIntegrity();
}

function reconcileProductIntegrity(): void {
  const seedById = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
  const seedRevById = new Map(INITIAL_REVIEWS.map(r => [r.id, r]));
  const nowIso = new Date().toISOString();

  const tx = db.transaction(() => {
    // 1. Reconcile all seeded products to guarantee canonical SKU, image gallery, specs, and documents
    const updateSeedProd = db.prepare(`
      UPDATE products
      SET sku = ?,
          title = ?,
          brand = ?,
          model = ?,
          image_url = ?,
          images_json = ?,
          specifications_json = ?,
          documents_json = ?,
          updated_at = COALESCE(updated_at, created_at, ?)
      WHERE id = ?
    `);

    for (const seedProd of INITIAL_PRODUCTS) {
      const existing = db.prepare('SELECT id, sku, image_url, images_json, specifications_json, documents_json FROM products WHERE id = ?').get(seedProd.id) as any;
      if (existing) {
        const canonicalDocs = (seedProd.documents || []).map(d => ({ ...d, productId: seedProd.id }));
        const expectedImagesJson = JSON.stringify(seedProd.images || [seedProd.imageUrl]);
        const expectedSpecsJson = JSON.stringify(seedProd.specifications || {});
        const expectedDocsJson = JSON.stringify(canonicalDocs);
        if (
          existing.sku !== (seedProd.sku || '') ||
          existing.image_url !== seedProd.imageUrl ||
          existing.images_json !== expectedImagesJson ||
          existing.specifications_json !== expectedSpecsJson ||
          existing.documents_json !== expectedDocsJson
        ) {
          updateSeedProd.run(
            seedProd.sku || `FG-${seedProd.id.toUpperCase()}`,
            seedProd.title,
            seedProd.brand || '',
            seedProd.model || '',
            seedProd.imageUrl,
            expectedImagesJson,
            expectedSpecsJson,
            expectedDocsJson,
            nowIso,
            seedProd.id
          );
        }
      }
    }

    // 2. Audit ALL products for duplicate/shared images, project image leaks, missing SKUs, or unbound docs
    const allProducts = db.prepare('SELECT id, sku, image_url, images_json, documents_json, created_at, updated_at FROM products ORDER BY id ASC').all() as any[];
    // Process seeded products first so they retain priority over any accidental custom duplicates
    allProducts.sort((a, b) => {
      const aSeed = seedById.has(a.id) ? 0 : 1;
      const bSeed = seedById.has(b.id) ? 0 : 1;
      if (aSeed !== bSeed) return aSeed - bSeed;
      return String(a.created_at || '').localeCompare(String(b.created_at || ''));
    });

    const claimedUrls = new Set<string>();
    const fixProdStmt = db.prepare(`
      UPDATE products
      SET sku = ?, image_url = ?, images_json = ?, documents_json = ?, updated_at = ?
      WHERE id = ?
    `);

    for (const row of allProducts) {
      const rawImages = safeJsonParse<string[]>(row.images_json, []);
      const combinedCandidates = [row.image_url, ...rawImages]
        .filter((u): u is string => typeof u === 'string')
        .map(u => u.trim())
        .filter(u => isValidProductImageUrl(u));

      const uniqueValidForThisProduct: string[] = [];
      for (const url of combinedCandidates) {
        if (!claimedUrls.has(url) && !uniqueValidForThisProduct.includes(url)) {
          claimedUrls.add(url);
          uniqueValidForThisProduct.push(url);
        }
      }

      const cleanPrimary = uniqueValidForThisProduct[0] || '';
      const cleanImagesJson = JSON.stringify(uniqueValidForThisProduct);
      const cleanSku = (row.sku && String(row.sku).trim()) || `FG-${String(row.id).replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;

      const rawDocs = safeJsonParse<ProductDocument[]>(row.documents_json, []);
      const boundDocs = Array.isArray(rawDocs)
        ? rawDocs.map((doc, i) => ({
            ...doc,
            id: doc.id || `doc-${row.id}-${i + 1}`,
            productId: row.id
          }))
        : [];
      const cleanDocsJson = JSON.stringify(boundDocs);

      if (
        cleanSku !== row.sku ||
        cleanPrimary !== (row.image_url || '') ||
        cleanImagesJson !== (row.images_json || '[]') ||
        cleanDocsJson !== (row.documents_json || '[]') ||
        !row.updated_at
      ) {
        fixProdStmt.run(
          cleanSku,
          cleanPrimary,
          cleanImagesJson,
          cleanDocsJson,
          row.updated_at || row.created_at || nowIso,
          row.id
        );
      }
    }

    // 3. Reconcile order items against canonical products
    const productLookup = new Map<string, { title: string; imageUrl: string }>();
    const refreshedRows = db.prepare('SELECT id, title, image_url FROM products').all() as any[];
    for (const p of refreshedRows) {
      productLookup.set(p.id, { title: p.title, imageUrl: p.image_url || '' });
    }
    const orderRows = db.prepare('SELECT id, items_json FROM orders').all() as any[];
    const updateOrderStmt = db.prepare('UPDATE orders SET items_json = ? WHERE id = ?');
    for (const ord of orderRows) {
      const items = safeJsonParse<any[]>(ord.items_json, []);
      let changed = false;
      const updatedItems = items.map(it => {
        const canonical = it?.productId ? productLookup.get(it.productId) : undefined;
        if (canonical && (it.imageUrl !== canonical.imageUrl || it.title !== canonical.title)) {
          changed = true;
          return { ...it, title: canonical.title, imageUrl: canonical.imageUrl };
        }
        return it;
      });
      if (changed) {
        updateOrderStmt.run(JSON.stringify(updatedItems), ord.id);
      }
    }

    // 4. Reconcile seeded review photos
    const updateRevStmt = db.prepare('UPDATE product_reviews SET review_images_json = ? WHERE id = ?');
    for (const [revId, seedRev] of seedRevById.entries()) {
      const expectedRevImgs = JSON.stringify(seedRev.reviewImages || []);
      const rowRev = db.prepare('SELECT review_images_json FROM product_reviews WHERE id = ?').get(revId) as any;
      if (rowRev && rowRev.review_images_json !== expectedRevImgs) {
        updateRevStmt.run(expectedRevImgs, revId);
      }
    }
  });

  tx();
}

function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function seedIfEmpty(): void {
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  if (userCount === 0) {
    const defaultPasswordHash = hashPassword('Fallgram@2026');
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, phone, location, state, avatar, bio, shg_name, joined_date, account_status, last_login_at, last_login_type, last_active_at, failed_login_attempts)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertHist = db.prepare(`
      INSERT INTO user_login_history (user_id, timestamp, status, ip, device)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertAudit = db.prepare(`
      INSERT INTO user_audit_trail (user_id, action, by_admin, reason, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);

    const tx = db.transaction(() => {
      for (const u of INITIAL_USERS) {
        insertUser.run(
          u.id, u.name, u.email.toLowerCase(), defaultPasswordHash, u.role,
          u.phone, u.location, u.state, u.avatar, u.bio || '', u.shgName || '',
          u.joinedDate, u.accountStatus, u.lastLoginAt, u.lastLoginType,
          u.lastActiveAt || null, u.failedLoginAttempts
        );
        for (const h of u.loginHistory || []) {
          insertHist.run(u.id, h.timestamp, h.status, h.ip, h.device);
        }
        for (const a of u.suspensionAuditTrail || []) {
          insertAudit.run(u.id, a.action, a.byAdmin, a.reason, a.timestamp);
        }
      }
    });
    tx();
  }

  const catCount = (db.prepare('SELECT COUNT(*) as count FROM project_categories').get() as { count: number }).count;
  if (catCount === 0) {
    const insertCat = db.prepare(`
      INSERT INTO project_categories (id, slug, name, description, icon_name)
      VALUES (?, ?, ?, ?, ?)
    `);
    const tx = db.transaction(() => {
      for (const c of INITIAL_PROJECT_CATEGORIES) {
        insertCat.run(c.id, c.slug, c.name, c.description, c.iconName || 'Folder');
      }
    });
    tx();
  }

  const projCount = (db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }).count;
  if (projCount === 0) {
    const insertProj = db.prepare(`
      INSERT INTO projects (
        id, slug, name, category, industry, business_type, location_suitability,
        image_url, description, keywords_json, required_investment, estimated_setup_cost,
        cost_assumptions, estimated_monthly_revenue_range, required_resources_json,
        target_customers, revenue_model, required_skills_json, benefits_json,
        challenges_json, related_scheme_ids_json, reference_links_json,
        implementation_details_json, status, verified_source, last_verified_date,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const tx = db.transaction(() => {
      for (const p of INITIAL_PROJECTS) {
        insertProj.run(
          p.id, p.slug, p.name, p.category, p.industry, p.businessType, p.locationSuitability,
          p.imageUrl, p.description, JSON.stringify(p.keywords), p.requiredInvestment,
          p.estimatedSetupCost, p.costAssumptions, p.estimatedMonthlyRevenueRange || '',
          JSON.stringify(p.requiredResources), p.targetCustomers, p.revenueModel,
          JSON.stringify(p.requiredSkills), JSON.stringify(p.benefits),
          JSON.stringify(p.challenges), JSON.stringify(p.relatedSchemeIds),
          JSON.stringify(p.referenceLinks),
          p.implementationDetails ? JSON.stringify(p.implementationDetails) : null,
          p.status, p.verifiedSource, p.lastVerifiedDate, p.createdAt, p.updatedAt
        );
      }
    });
    tx();
  }

  const schemeCount = (db.prepare('SELECT COUNT(*) as count FROM government_schemes').get() as { count: number }).count;
  if (schemeCount === 0) {
    const insertScheme = db.prepare(`
      INSERT INTO government_schemes (
        id, name, tagline, ministry, level, state, category, scheme_type, eligibility_target,
        description, purpose_benefits_json, eligibility_criteria_json, documents_json,
        application_process_json, financial_assistance, max_loan_amount, loan_display, tranches,
        interest_rate, interest_subvention, subsidy_grant, collateral, deadline, status,
        official_url, official_source, last_verified_date, badge, eligible_trades_json,
        processing_time, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const tx = db.transaction(() => {
      for (const s of INITIAL_SCHEMES) {
        insertScheme.run(
          s.id, s.name, s.tagline, s.ministry, s.level, s.state, s.category, s.schemeType,
          s.eligibilityTarget, s.description, JSON.stringify(s.purposeBenefits),
          JSON.stringify(s.eligibilityCriteria), JSON.stringify(s.documents),
          JSON.stringify(s.applicationProcess), s.financialAssistance, s.maxLoanAmount,
          s.loanDisplay, s.tranches, s.interestRate, s.interestSubvention, s.subsidyGrant,
          s.collateral, s.deadline, s.status, s.officialUrl, s.officialSource,
          s.lastVerifiedDate, s.badge, JSON.stringify(s.eligibleTrades), s.processingTime,
          new Date().toISOString()
        );
      }
    });
    tx();
  }

  const marketCount = (db.prepare('SELECT COUNT(*) as count FROM market_prices').get() as { count: number }).count;
  if (marketCount === 0) {
    const insertMkt = db.prepare(`
      INSERT INTO market_prices (
        id, commodity_name, variety, category, market_name, district, state,
        min_price, max_price, modal_price, unit, previous_price, demand_level,
        supply_level, price_date, data_source, source_url, is_live_api, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const tx = db.transaction(() => {
      for (const m of INITIAL_MARKET_PRICES) {
        insertMkt.run(
          m.id, m.commodityName, m.variety, m.category, m.marketName, m.district, m.state,
          m.minPrice, m.maxPrice, m.modalPrice, m.unit, m.previousPrice ?? null,
          m.demandLevel, m.supplyLevel, m.priceDate, m.dataSource, m.sourceUrl,
          m.isLiveApi ? 1 : 0, new Date().toISOString()
        );
      }
    });
    tx();
  }

  const prodCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number }).count;
  if (prodCount === 0) {
    const insertProd = db.prepare(`
      INSERT INTO products (
        id, sku, artisan_id, artisan_name, artisan_location, title, brand, model, category,
        condition, price, original_price, stock, unit, rating, reviews_count, image_url,
        images_json, description, specifications_json, documents_json, warranty, return_policy, defects_notice,
        verified_seller, seller_verification_badge, authenticity_status, artisan_story,
        materials_json, in_stock, featured, fair_trade_percent, deal_badge, moderation_status,
        reported_reason, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const tx = db.transaction(() => {
      INITIAL_PRODUCTS.forEach((p, idx) => {
        const ts = new Date(Date.now() - idx * 3600000).toISOString();
        const docs = (p.documents || []).map(d => ({ ...d, productId: p.id }));
        insertProd.run(
          p.id, p.sku || `FG-${p.id.toUpperCase()}`, p.artisanId, p.artisanName, p.artisanLocation, p.title, p.brand || '', p.model || '',
          p.category, p.condition, p.price, p.originalPrice ?? null, p.stock, p.unit,
          p.rating, p.reviewsCount, p.imageUrl, JSON.stringify(p.images || (p.imageUrl ? [p.imageUrl] : [])),
          p.description, JSON.stringify(p.specifications || {}), JSON.stringify(docs), p.warranty || '',
          p.returnPolicy || '', p.defectsNotice || '', p.verifiedSeller ? 1 : 0,
          p.sellerVerificationBadge || '', p.authenticityStatus || 'verified', p.artisanStory || '',
          JSON.stringify(p.materials || []), p.inStock ? 1 : 0, p.featured ? 1 : 0,
          p.fairTradePercent || 86, p.dealBadge || null, p.moderationStatus || 'approved',
          p.reportedReason || null, ts, ts
        );
      });
    });
    tx();
  }

  const revCount = (db.prepare('SELECT COUNT(*) as count FROM product_reviews').get() as { count: number }).count;
  if (revCount === 0) {
    const insertRev = db.prepare(`
      INSERT INTO product_reviews (
        id, product_id, user_id, user_name, user_avatar, rating, quality_rating,
        durability_rating, value_for_money_rating, seller_experience_rating,
        comment, date, verified_purchase, review_images_json, helpful_count,
        reported, report_reason, artisan_reply
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const tx = db.transaction(() => {
      for (const r of INITIAL_REVIEWS) {
        insertRev.run(
          r.id, r.productId, r.userId, r.userName, r.userAvatar, r.rating,
          r.qualityRating ?? r.rating, r.durabilityRating ?? r.rating,
          r.valueForMoneyRating ?? r.rating, r.sellerExperienceRating ?? r.rating,
          r.comment, r.date, r.verifiedPurchase ? 1 : 0,
          JSON.stringify(r.reviewImages || []), r.helpfulCount || 0,
          r.reported ? 1 : 0, r.reportReason || null, r.artisanReply || null
        );
      }
    });
    tx();
  }

  const ordCount = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number }).count;
  if (ordCount === 0) {
    const insertOrd = db.prepare(`
      INSERT INTO orders (
        id, tracking_id, customer_id, customer_name, customer_phone, shipping_address,
        items_json, total_amount, payment_method, payment_status, upi_ref_id,
        order_status, cancellation_reason, return_reason, created_at,
        delivery_date_estimated, current_hub, delivery_partner, delivery_agent_phone, delivery_otp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const tx = db.transaction(() => {
      for (const o of INITIAL_ORDERS) {
        insertOrd.run(
          o.id, o.trackingId, o.customerId, o.customerName, o.customerPhone, o.shippingAddress,
          JSON.stringify(o.items), o.totalAmount, o.paymentMethod, o.paymentStatus,
          o.upiRefId || null, o.orderStatus, o.cancellationReason || null, o.returnReason || null,
          o.createdAt, o.deliveryDateEstimated, o.currentHub, o.deliveryPartner,
          o.deliveryAgentPhone, o.deliveryOtp
        );
      }
    });
    tx();
  }

  const dealCount = (db.prepare('SELECT COUNT(*) as count FROM deals').get() as { count: number }).count;
  if (dealCount === 0) {
    const insertDeal = db.prepare(`
      INSERT INTO deals (id, title, description, discount_percentage, coupon_code, category, valid_until, terms, min_order_value, verified, featured_product_ids_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const tx = db.transaction(() => {
      for (const d of INITIAL_DEALS) {
        insertDeal.run(
          d.id, d.title, d.description, d.discountPercentage, d.couponCode,
          d.category, d.validUntil, d.terms, d.minOrderValue, d.verified ? 1 : 0,
          JSON.stringify(d.featuredProductIds || [])
        );
      }
    });
    tx();
  }

  const msgCount = (db.prepare('SELECT COUNT(*) as count FROM messages').get() as { count: number }).count;
  if (msgCount === 0) {
    const insertMsg = db.prepare(`
      INSERT INTO messages (id, product_id, product_title, sender_id, sender_name, sender_role, recipient_id, recipient_name, text, timestamp, read)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const tx = db.transaction(() => {
      for (const m of INITIAL_MESSAGES) {
        insertMsg.run(
          m.id, m.productId, m.productTitle, m.senderId, m.senderName, m.senderRole,
          m.recipientId, m.recipientName, m.text, m.timestamp, m.read ? 1 : 0
        );
      }
    });
    tx();
  }

  const tckCount = (db.prepare('SELECT COUNT(*) as count FROM support_tickets').get() as { count: number }).count;
  if (tckCount === 0) {
    const insertTck = db.prepare(`
      INSERT INTO support_tickets (id, user_id, user_name, role, subject, category, status, priority, created_at, messages_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const tx = db.transaction(() => {
      for (const t of INITIAL_TICKETS) {
        insertTck.run(
          t.id, t.userId, t.userName, t.role, t.subject, t.category,
          t.status, t.priority, t.createdAt, JSON.stringify(t.messages)
        );
      }
    });
    tx();
  }
}

// ==================== ROW MAPPERS ====================
export function mapUserRow(row: any): User {
  const history = db
    .prepare('SELECT timestamp, status, ip, device FROM user_login_history WHERE user_id = ? ORDER BY id DESC LIMIT 20')
    .all(row.id) as any[];
  const audits = db
    .prepare('SELECT action, by_admin as byAdmin, reason, timestamp FROM user_audit_trail WHERE user_id = ? ORDER BY id DESC')
    .all(row.id) as any[];

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    phone: row.phone || '',
    location: row.location || '',
    state: row.state || '',
    avatar: row.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(row.name)}`,
    bio: row.bio || '',
    shgName: row.shg_name || '',
    joinedDate: row.joined_date || '',
    registeredAt: row.joined_date || '',
    accountStatus: row.account_status,
    lastLoginAt: row.last_login_at,
    lastLoginType: row.last_login_type,
    lastActiveAt: row.last_active_at,
    failedLoginAttempts: row.failed_login_attempts || 0,
    successfulLoginsCount: history.filter(h => h.status === 'success').length,
    failedLoginsCount: history.filter(h => h.status === 'failed').length,
    loginHistory: history,
    suspensionAuditTrail: audits
  };
}

export function mapProjectRow(row: any): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    industry: row.industry,
    businessType: row.business_type,
    locationSuitability: row.location_suitability,
    imageUrl: row.image_url,
    description: row.description,
    keywords: safeJsonParse<string[]>(row.keywords_json, []),
    requiredInvestment: row.required_investment,
    estimatedSetupCost: row.estimated_setup_cost,
    costAssumptions: row.cost_assumptions,
    estimatedMonthlyRevenueRange: row.estimated_monthly_revenue_range || undefined,
    requiredResources: safeJsonParse<string[]>(row.required_resources_json, []),
    targetCustomers: row.target_customers,
    revenueModel: row.revenue_model,
    requiredSkills: safeJsonParse<string[]>(row.required_skills_json, []),
    benefits: safeJsonParse<string[]>(row.benefits_json, []),
    challenges: safeJsonParse<string[]>(row.challenges_json, []),
    relatedSchemeIds: safeJsonParse<string[]>(row.related_scheme_ids_json, []),
    referenceLinks: safeJsonParse<{ label: string; url: string }[]>(row.reference_links_json, []),
    implementationDetails: row.implementation_details_json
      ? safeJsonParse(row.implementation_details_json, undefined)
      : undefined,
    status: row.status,
    verifiedSource: row.verified_source || 'GramSetu Curated Reference',
    lastVerifiedDate: row.last_verified_date || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapSchemeRow(row: any): GovernmentScheme {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline || '',
    ministry: row.ministry,
    level: row.level,
    state: row.state,
    category: row.category,
    schemeType: row.scheme_type,
    eligibilityTarget: row.eligibility_target || '',
    description: row.description,
    purposeBenefits: safeJsonParse<string[]>(row.purpose_benefits_json, []),
    eligibilityCriteria: safeJsonParse<string[]>(row.eligibility_criteria_json, []),
    documents: safeJsonParse<string[]>(row.documents_json, []),
    applicationProcess: safeJsonParse<string[]>(row.application_process_json, []),
    financialAssistance: row.financial_assistance || '',
    maxLoanAmount: row.max_loan_amount,
    loanDisplay: row.loan_display || '',
    tranches: row.tranches || '',
    interestRate: row.interest_rate || '',
    interestSubvention: row.interest_subvention || '',
    subsidyGrant: row.subsidy_grant || '',
    collateral: row.collateral || '',
    deadline: row.deadline || 'Refer to official portal',
    status: row.status,
    officialUrl: row.official_url || '',
    officialSource: row.official_source || '',
    lastVerifiedDate: row.last_verified_date || '',
    badge: row.badge || '',
    eligibleTrades: safeJsonParse<string[]>(row.eligible_trades_json, []),
    processingTime: row.processing_time || '',
    updatedAt: row.updated_at
  };
}

export function mapMarketRow(row: any): MarketPrice {
  return {
    id: row.id,
    commodityName: row.commodity_name,
    variety: row.variety || '',
    category: row.category,
    marketName: row.market_name,
    district: row.district || '',
    state: row.state,
    minPrice: row.min_price,
    maxPrice: row.max_price,
    modalPrice: row.modal_price,
    unit: row.unit,
    previousPrice: row.previous_price ?? undefined,
    demandLevel: row.demand_level || 'Unavailable',
    supplyLevel: row.supply_level || 'Unavailable',
    priceDate: row.price_date,
    dataSource: row.data_source,
    sourceUrl: row.source_url || '',
    isLiveApi: Boolean(row.is_live_api),
    updatedAt: row.updated_at
  };
}

export function mapProductRow(row: any): Product {
  const rawPrimary = typeof row.image_url === 'string' ? row.image_url.trim() : '';
  const validPrimary = isValidProductImageUrl(rawPrimary) ? rawPrimary : '';
  const rawList = safeJsonParse<string[]>(row.images_json, []);
  const validList = Array.from(
    new Set(
      rawList
        .filter((u): u is string => typeof u === 'string')
        .map(u => u.trim())
        .filter(isValidProductImageUrl)
    )
  );
  const images = validPrimary
    ? Array.from(new Set([validPrimary, ...validList]))
    : validList;
  const imageUrl = validPrimary || images[0] || '';

  const rawDocs = safeJsonParse<ProductDocument[]>(row.documents_json, []);
  const documents = Array.isArray(rawDocs)
    ? rawDocs.map((d, idx) => ({
        ...d,
        id: d.id || `doc-${row.id}-${idx + 1}`,
        productId: row.id
      }))
    : [];

  return {
    id: row.id,
    sku: row.sku || `FG-${String(row.id).replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`,
    artisanId: row.artisan_id,
    artisanName: row.artisan_name,
    artisanLocation: row.artisan_location,
    title: row.title,
    brand: row.brand || '',
    model: row.model || '',
    category: row.category,
    condition: row.condition,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    stock: row.stock,
    unit: row.unit,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    imageUrl,
    images,
    description: row.description,
    specifications: safeJsonParse<Record<string, string>>(row.specifications_json, {}),
    documents,
    warranty: row.warranty || '',
    returnPolicy: row.return_policy || '',
    defectsNotice: row.defects_notice || '',
    verifiedSeller: Boolean(row.verified_seller),
    sellerVerificationBadge: row.seller_verification_badge || '',
    authenticityStatus: row.authenticity_status,
    artisanStory: row.artisan_story || '',
    materials: safeJsonParse<string[]>(row.materials_json, []),
    inStock: Boolean(row.in_stock),
    featured: Boolean(row.featured),
    fairTradePercent: row.fair_trade_percent,
    dealBadge: row.deal_badge || undefined,
    moderationStatus: row.moderation_status,
    reportedReason: row.reported_reason || undefined,
    updatedAt: row.updated_at || row.created_at
  };
}

export function mapReviewRow(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    userName: row.user_name,
    userAvatar: row.user_avatar || '',
    rating: row.rating,
    qualityRating: row.quality_rating ?? row.rating,
    durabilityRating: row.durability_rating ?? row.rating,
    valueForMoneyRating: row.value_for_money_rating ?? row.rating,
    sellerExperienceRating: row.seller_experience_rating ?? row.rating,
    comment: row.comment,
    date: row.date,
    verifiedPurchase: Boolean(row.verified_purchase),
    reviewImages: safeJsonParse<string[]>(row.review_images_json, []),
    helpfulCount: row.helpful_count,
    reported: Boolean(row.reported),
    reportReason: row.report_reason || undefined,
    artisanReply: row.artisan_reply || undefined
  };
}

export function mapOrderRow(row: any): Order {
  return {
    id: row.id,
    trackingId: row.tracking_id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    shippingAddress: row.shipping_address,
    items: safeJsonParse(row.items_json, []),
    totalAmount: row.total_amount,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    upiRefId: row.upi_ref_id || undefined,
    orderStatus: row.order_status,
    cancellationReason: row.cancellation_reason || undefined,
    returnReason: row.return_reason || undefined,
    createdAt: row.created_at,
    deliveryDateEstimated: row.delivery_date_estimated || '',
    currentHub: row.current_hub || '',
    deliveryPartner: row.delivery_partner || '',
    deliveryAgentPhone: row.delivery_agent_phone || '',
    deliveryOtp: row.delivery_otp || ''
  };
}

export function mapDealRow(row: any): DealOffer {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    discountPercentage: row.discount_percentage,
    couponCode: row.coupon_code,
    category: row.category,
    validUntil: row.valid_until,
    terms: row.terms || '',
    minOrderValue: row.min_order_value,
    verified: Boolean(row.verified),
    featuredProductIds: safeJsonParse<string[]>(row.featured_product_ids_json, [])
  };
}

export function mapMessageRow(row: any): SellerMessage {
  return {
    id: row.id,
    productId: row.product_id,
    productTitle: row.product_title || '',
    senderId: row.sender_id,
    senderName: row.sender_name,
    senderRole: row.sender_role,
    recipientId: row.recipient_id,
    recipientName: row.recipient_name || '',
    text: row.text,
    timestamp: row.timestamp,
    read: Boolean(row.read)
  };
}

export function mapTicketRow(row: any): SupportTicket {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    role: row.role,
    subject: row.subject,
    category: row.category,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    messages: safeJsonParse(row.messages_json, [])
  };
}

export function getAllProjectCategories(): ProjectCategory[] {
  return db.prepare('SELECT id, slug, name, description, icon_name as iconName FROM project_categories ORDER BY name ASC').all() as ProjectCategory[];
}
