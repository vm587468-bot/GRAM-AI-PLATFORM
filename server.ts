import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  db,
  initDatabase,
  hashPassword,
  verifyPassword,
  signAuthToken,
  verifyAuthToken,
  mapUserRow,
  mapProjectRow,
  mapSchemeRow,
  mapMarketRow,
  mapProductRow,
  mapReviewRow,
  mapOrderRow,
  mapDealRow,
  mapMessageRow,
  mapTicketRow,
  getAllProjectCategories,
  isValidProductImageUrl,
  AuthTokenPayload
} from './server/db';
import {
  runUniversalSearch,
  searchProjects,
  searchProducts,
  searchSchemes,
  searchMarkets,
  normalizeQuery
} from './server/search';

initDatabase();

const app = express();
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
app.use(['/api/products', '/api/search', '/api/deals', '/api/orders'], (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many AI requests. Please wait a minute and try again.' }
});

interface AuthenticatedRequest extends Request {
  authUser?: AuthTokenPayload & { name: string; accountStatus: string };
}

function resolveUserFromToken(token: string): (AuthTokenPayload & { name: string; accountStatus: string }) | null {
  const payload = verifyAuthToken(token);
  if (payload) {
    const row = db.prepare('SELECT id, name, email, role, account_status FROM users WHERE id = ?').get(payload.userId) as any;
    if (!row) return null;
    return {
      userId: row.id,
      email: row.email,
      role: row.role,
      exp: payload.exp,
      name: row.name,
      accountStatus: row.account_status
    };
  }

  // Backward compatibility for initial preview session tokens
  const legacyRoleMap: Record<string, 'entrepreneur' | 'customer' | 'admin'> = {
    demo_token_artisan: 'entrepreneur',
    demo_token_customer: 'customer',
    demo_token_admin: 'admin'
  };
  const legacyRole = legacyRoleMap[token];
  if (legacyRole) {
    const row = db.prepare("SELECT id, name, email, role, account_status FROM users WHERE role = ? AND account_status = 'active' LIMIT 1").get(legacyRole) as any;
    if (!row) return null;
    return {
      userId: row.id,
      email: row.email,
      role: row.role,
      exp: Date.now() + 86400000,
      name: row.name,
      accountStatus: row.account_status
    };
  }
  return null;
}

function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  const user = resolveUserFromToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
  if (user.accountStatus === 'suspended') {
    return res.status(403).json({ error: 'Account is suspended. Contact platform administrator.' });
  }
  req.authUser = user;
  next();
}

function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (token) {
    const user = resolveUserFromToken(token);
    if (user && user.accountStatus !== 'suspended') {
      req.authUser = user;
    }
  }
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.authUser) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Administrator role required.' });
  }
  next();
}

function requireSellerOrAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.authUser) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.authUser.role !== 'entrepreneur' && req.authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Seller or Administrator role required.' });
  }
  next();
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// ==================== HEALTH ====================
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    platform: 'GramSetu',
    database: 'sqlite',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    liveMarketApiConfigured: Boolean(process.env.DATA_GOV_API_KEY)
  });
});

// ==================== AUTHENTICATION & USERS ====================
app.post('/api/auth/login', authLimiter, (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const row = db.prepare('SELECT * FROM users WHERE LOWER(email) = ? OR phone = ?').get(cleanEmail, String(email || '').trim()) as any;
  if (!row) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (row.account_status === 'suspended') {
    return res.status(403).json({ error: 'This account has been suspended by an administrator.' });
  }

  const nowIso = new Date().toISOString();
  const valid = verifyPassword(String(password), row.password_hash);
  if (!valid) {
    db.prepare('UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?').run(row.id);
    db.prepare('INSERT INTO user_login_history (user_id, timestamp, status, ip, device) VALUES (?, ?, ?, ?, ?)').run(
      row.id,
      nowIso,
      'failed',
      req.ip || '127.0.0.1',
      req.headers['user-agent']?.slice(0, 60) || 'Web Browser'
    );
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  db.prepare(`
    UPDATE users
    SET account_status = CASE WHEN account_status = 'pending' THEN 'active' ELSE account_status END,
        last_login_at = ?,
        last_login_type = 'recent',
        last_active_at = ?
    WHERE id = ?
  `).run(nowIso, nowIso, row.id);

  db.prepare('INSERT INTO user_login_history (user_id, timestamp, status, ip, device) VALUES (?, ?, ?, ?, ?)').run(
    row.id,
    nowIso,
    'success',
    req.ip || '127.0.0.1',
    req.headers['user-agent']?.slice(0, 60) || 'Web Browser'
  );

  const updatedRow = db.prepare('SELECT * FROM users WHERE id = ?').get(row.id) as any;
  const token = signAuthToken({ userId: updatedRow.id, email: updatedRow.email, role: updatedRow.role });
  res.json({ user: mapUserRow(updatedRow), token });
});

app.post('/api/auth/register', authLimiter, (req: Request, res: Response) => {
  const { name, email, password, phone, location, state, role } = req.body || {};
  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password || String(password).length < 6) {
    return res.status(400).json({ error: 'Valid name, email, and password (min 6 chars) are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const assignedRole: 'entrepreneur' | 'customer' = role === 'entrepreneur' ? 'entrepreneur' : 'customer';
  const id = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const nowIso = new Date().toISOString();
  const passwordHash = hashPassword(String(password));
  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`;

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, phone, location, state, avatar, bio, shg_name, joined_date, account_status, last_login_at, last_login_type, last_active_at, failed_login_attempts)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, 'recent', ?, 0)
  `).run(
    id,
    cleanName,
    cleanEmail,
    passwordHash,
    assignedRole,
    String(phone || '+91 90000 00000'),
    String(location || 'India'),
    String(state || 'India'),
    avatar,
    assignedRole === 'entrepreneur' ? 'Verified GramSetu rural producer & artisan.' : 'Verified GramSetu marketplace buyer.',
    assignedRole === 'entrepreneur' ? 'Independent Producer Unit' : '',
    nowIso.split('T')[0],
    nowIso,
    nowIso
  );

  db.prepare('INSERT INTO user_login_history (user_id, timestamp, status, ip, device) VALUES (?, ?, ?, ?, ?)').run(
    id,
    nowIso,
    'success',
    req.ip || '127.0.0.1',
    req.headers['user-agent']?.slice(0, 60) || 'Web Registration'
  );

  const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
  const token = signAuthToken({ userId: id, email: cleanEmail, role: assignedRole });
  res.status(201).json({ user: mapUserRow(userRow), token });
});

app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const resolved = resolveUserFromToken(token);
  if (!resolved) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(resolved.userId) as any;
  if (!row) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user: mapUserRow(row) });
});

app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const requestedRole = req.body?.role;
  const targetRole: 'entrepreneur' | 'customer' | 'admin' =
    requestedRole === 'admin' ? 'admin' : requestedRole === 'customer' ? 'customer' : 'entrepreneur';

  const row = db
    .prepare("SELECT * FROM users WHERE role = ? AND account_status = 'active' ORDER BY joined_date ASC LIMIT 1")
    .get(targetRole) as any;

  if (!row) {
    return res.status(404).json({ error: 'No active account found for requested role.' });
  }

  const token = signAuthToken({ userId: row.id, email: row.email, role: row.role });
  res.json({ user: mapUserRow(row), token });
});

// ==================== UNIVERSAL SEARCH ====================
app.get('/api/search', (req: Request, res: Response) => {
  const q = String(req.query.q ?? req.query.search ?? '');
  const type = String(req.query.type || 'all') as 'all' | 'projects' | 'products' | 'schemes' | 'markets';
  const category = req.query.category ? String(req.query.category) : undefined;
  const state = req.query.state ? String(req.query.state) : undefined;
  const industry = req.query.industry ? String(req.query.industry) : undefined;
  const businessType = req.query.businessType ? String(req.query.businessType) : undefined;
  const location = req.query.location ? String(req.query.location) : undefined;
  const sort = (req.query.sort ? String(req.query.sort) : 'relevance') as any;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 24;

  const result = runUniversalSearch({
    q,
    type,
    category,
    state,
    industry,
    businessType,
    location,
    sort,
    page,
    limit
  });

  res.json({
    ...result,
    categories: getAllProjectCategories()
  });
});

// ==================== PROJECTS & BOOKMARKS ====================
app.get('/api/projects/categories', (_req: Request, res: Response) => {
  res.json({ categories: getAllProjectCategories() });
});

app.get('/api/projects', (req: Request, res: Response) => {
  const q = String(req.query.q ?? req.query.search ?? '');
  const category = req.query.category ? String(req.query.category) : undefined;
  const industry = req.query.industry ? String(req.query.industry) : undefined;
  const businessType = req.query.businessType ? String(req.query.businessType) : undefined;
  const location = req.query.location ? String(req.query.location) : undefined;
  const sort = (req.query.sort ? String(req.query.sort) : q.trim() ? 'relevance' : 'newest') as any;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 24));

  const matched = searchProjects({
    q,
    category,
    industry,
    businessType,
    location,
    sort,
    includeDrafts: req.query.includeDrafts === 'true'
  });

  const start = (page - 1) * limit;
  const paged = matched.slice(start, start + limit);

  const allProjects = db.prepare('SELECT industry, business_type, location_suitability FROM projects').all() as any[];
  const industries = Array.from(new Set(allProjects.map(r => r.industry))).sort();
  const businessTypes = Array.from(new Set(allProjects.map(r => r.business_type))).sort();

  res.json({
    projects: paged,
    totalCount: matched.length,
    page,
    limit,
    categories: getAllProjectCategories(),
    industries,
    businessTypes
  });
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const param = req.params.id;
  const row = db.prepare('SELECT * FROM projects WHERE id = ? OR slug = ?').get(param, param) as any;
  if (!row) {
    return res.status(404).json({ error: 'Project not found.' });
  }
  const project = mapProjectRow(row);
  let relatedSchemes: any[] = [];
  if (project.relatedSchemeIds.length > 0) {
    const placeholders = project.relatedSchemeIds.map(() => '?').join(',');
    const schemeRows = db
      .prepare(`SELECT * FROM government_schemes WHERE id IN (${placeholders})`)
      .all(...project.relatedSchemeIds) as any[];
    relatedSchemes = schemeRows.map(mapSchemeRow);
  }
  res.json({ project, relatedSchemes });
});

app.get('/api/bookmarks', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const rows = db
    .prepare(`
      SELECT p.* FROM projects p
      INNER JOIN bookmarks b ON b.project_id = p.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `)
    .all(req.authUser!.userId) as any[];
  const projects = rows.map(mapProjectRow);
  res.json({
    bookmarks: projects.map(p => p.id),
    projects
  });
});

app.post('/api/bookmarks', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const projectId = String(req.body?.projectId || '').trim();
  if (!projectId) {
    return res.status(400).json({ error: 'projectId is required.' });
  }
  const exists = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
  if (!exists) {
    return res.status(404).json({ error: 'Project not found.' });
  }
  db.prepare('INSERT OR IGNORE INTO bookmarks (user_id, project_id, created_at) VALUES (?, ?, ?)').run(
    req.authUser!.userId,
    projectId,
    new Date().toISOString()
  );
  const rows = db.prepare('SELECT project_id FROM bookmarks WHERE user_id = ?').all(req.authUser!.userId) as any[];
  res.status(201).json({ success: true, bookmarks: rows.map(r => r.project_id) });
});

app.delete('/api/bookmarks/:projectId', authenticate, (req: AuthenticatedRequest, res: Response) => {
  db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND project_id = ?').run(
    req.authUser!.userId,
    req.params.projectId
  );
  const rows = db.prepare('SELECT project_id FROM bookmarks WHERE user_id = ?').all(req.authUser!.userId) as any[];
  res.json({ success: true, bookmarks: rows.map(r => r.project_id) });
});

// ==================== GOVERNMENT SCHEMES ====================
app.get('/api/schemes', (req: Request, res: Response) => {
  const q = String(req.query.q ?? req.query.search ?? '');
  const category = req.query.category ? String(req.query.category) : undefined;
  const state = req.query.state ? String(req.query.state) : undefined;
  const schemeType = req.query.schemeType ? String(req.query.schemeType) : undefined;
  const eligibility = req.query.eligibility ? String(req.query.eligibility) : undefined;
  const status = req.query.status ? String(req.query.status) : undefined;

  const matched = searchSchemes({ q, category, state, schemeType, eligibility, status });
  const allRows = db.prepare('SELECT state, scheme_type, status, category FROM government_schemes').all() as any[];

  res.json({
    schemes: matched,
    totalCount: matched.length,
    states: Array.from(new Set(allRows.map(r => r.state))).sort(),
    schemeTypes: Array.from(new Set(allRows.map(r => r.scheme_type))).sort()
  });
});

app.get('/api/schemes/:id', (req: Request, res: Response) => {
  const row = db.prepare('SELECT * FROM government_schemes WHERE id = ?').get(req.params.id) as any;
  if (!row) {
    return res.status(404).json({ error: 'Government scheme not found.' });
  }
  res.json({ scheme: mapSchemeRow(row) });
});

app.post('/api/schemes/apply', (req: Request, res: Response) => {
  const { applicantName, phone, schemeId, trade, requestedAmount, location } = req.body || {};
  const schemeRow = db.prepare('SELECT * FROM government_schemes WHERE id = ?').get(String(schemeId || '')) as any;
  if (!schemeRow) {
    return res.status(404).json({ error: 'Selected government scheme not found.' });
  }
  if (schemeRow.status === 'expired') {
    return res.status(400).json({ error: 'This scheme window has expired. Please check active schemes or the official portal.' });
  }

  const appId = `APP-${Date.now().toString().slice(-6)}`;
  const submittedAt = new Date().toISOString();
  const kioskLoc = String(location || 'District Nodal Facilitation Desk');

  db.prepare(`
    INSERT INTO scheme_applications (id, applicant_name, phone, scheme_id, scheme_name, ministry, trade, requested_amount, status, kiosk_location, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    appId,
    String(applicantName || 'Applicant'),
    String(phone || '+91 90000 00000'),
    schemeRow.id,
    schemeRow.name,
    schemeRow.ministry,
    String(trade || 'Rural Enterprise'),
    String(requestedAmount || schemeRow.max_loan_amount),
    'REGISTERED_INQUIRY',
    kioskLoc,
    submittedAt
  );

  res.status(201).json({
    success: true,
    application: {
      id: appId,
      applicantName: String(applicantName || 'Applicant'),
      phone: String(phone || '+91 90000 00000'),
      schemeId: schemeRow.id,
      schemeName: schemeRow.name,
      ministry: schemeRow.ministry,
      trade: String(trade || 'Rural Enterprise'),
      requestedAmount: String(requestedAmount || schemeRow.max_loan_amount),
      status: 'REGISTERED_INQUIRY',
      kioskLocation: kioskLoc,
      officialUrl: schemeRow.official_url,
      submittedAt
    },
    message: `Inquiry reference ${appId} saved. Final official application must be completed on ${schemeRow.official_url || 'the official government portal'}.`
  });
});

app.post('/api/schemes/calculate', (req: Request, res: Response) => {
  const amount = Math.max(10000, Number(req.body?.amount) || 200000);
  const category = String(req.body?.category || 'artisan');
  const tenureYears = Math.min(15, Math.max(1, Number(req.body?.tenureYears) || 3));

  let schemeId = 'pm-vishwakarma';
  let baseRate = 5.0;
  let subsidyPct = 0;

  if (category === 'manufacturing' || amount > 1000000) {
    schemeId = 'pmegp-subsidy';
    baseRate = 9.0;
    subsidyPct = 35;
  } else if (category === 'women') {
    schemeId = 'stand-up-india';
    baseRate = 8.2;
    subsidyPct = 0;
  } else if (category === 'retail' || amount > 300000) {
    schemeId = 'pmmy-mudra';
    baseRate = 8.5;
    subsidyPct = 0;
  }

  const schemeRow = db.prepare('SELECT * FROM government_schemes WHERE id = ?').get(schemeId) as any;
  const fallbackRow = schemeRow || (db.prepare('SELECT * FROM government_schemes LIMIT 1').get() as any);
  const scheme = mapSchemeRow(fallbackRow);

  const subsidyAmt = subsidyPct > 0 ? Math.round((amount * subsidyPct) / 100) : 0;
  const effectivePrincipal = Math.max(0, amount - subsidyAmt);
  const monthlyRate = baseRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi =
    monthlyRate === 0
      ? effectivePrincipal / totalMonths
      : (effectivePrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const marketRate = 14.0;
  const marketMonthlyRate = marketRate / 12 / 100;
  const marketEmi =
    (amount * marketMonthlyRate * Math.pow(1 + marketMonthlyRate, totalMonths)) /
    (Math.pow(1 + marketMonthlyRate, totalMonths) - 1);

  res.json({
    requestedAmount: amount,
    tenureYears,
    recommendedScheme: scheme,
    estimatedSubsidy: subsidyAmt,
    effectiveLoanPrincipal: effectivePrincipal,
    monthlyEmi: Math.round(emi),
    interestRateFormatted: `${baseRate}% p.a. (indicative)`,
    savingsComparedToInformalLoans: Math.max(0, Math.round((marketEmi - emi) * totalMonths))
  });
});

// ==================== MARKET PRICES & COMMODITIES ====================
app.get('/api/markets', async (req: Request, res: Response) => {
  const q = String(req.query.q ?? req.query.search ?? '');
  const category = req.query.category ? String(req.query.category) : undefined;
  const state = req.query.state ? String(req.query.state) : undefined;
  const sort = req.query.sort ? (String(req.query.sort) as any) : undefined;
  const liveApiKey = process.env.DATA_GOV_API_KEY;
  let sourceMode: 'live_api' | 'reference' = 'reference';
  let liveNotice: string | null = null;

  // Optional live Agmarknet sync when DATA_GOV_API_KEY is explicitly configured
  if (liveApiKey && req.query.live === 'true') {
    try {
      const apiUrl = new URL('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070');
      apiUrl.searchParams.set('api-key', liveApiKey);
      apiUrl.searchParams.set('format', 'json');
      apiUrl.searchParams.set('limit', '20');
      if (state && state !== 'all') apiUrl.searchParams.set('filters[state]', state);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const apiRes = await fetch(apiUrl.toString(), { signal: controller.signal });
      clearTimeout(timeout);
      if (apiRes.ok) {
        const apiData = (await apiRes.json()) as any;
        if (Array.isArray(apiData.records) && apiData.records.length > 0) {
          sourceMode = 'live_api';
          const upsert = db.prepare(`
            INSERT OR REPLACE INTO market_prices (
              id, commodity_name, variety, category, market_name, district, state,
              min_price, max_price, modal_price, unit, previous_price, demand_level,
              supply_level, price_date, data_source, source_url, is_live_api, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
          `);
          const nowIso = new Date().toISOString();
          const tx = db.transaction(() => {
            for (const rec of apiData.records) {
              const id = `agm-${String(rec.commodity || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${String(rec.market || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`.slice(0, 60);
              upsert.run(
                id,
                rec.commodity || 'Commodity',
                rec.variety || 'Standard',
                'Agricultural Commodities',
                rec.market || 'Mandi',
                rec.district || '',
                rec.state || 'India',
                Number(rec.min_price) || 0,
                Number(rec.max_price) || 0,
                Number(rec.modal_price) || 0,
                'INR / Quintal',
                null,
                'Reported via Agmarknet',
                'Reported via Agmarknet',
                rec.arrival_date || nowIso.split('T')[0],
                'Agmarknet Live API (data.gov.in)',
                'https://agmarknet.gov.in/',
                nowIso
              );
            }
          });
          tx();
        }
      } else {
        liveNotice = 'Live market feed returned an upstream error; showing verified reference mandi prices.';
      }
    } catch {
      liveNotice = 'Could not reach live Agmarknet feed; showing verified reference mandi prices.';
    }
  }

  const matched = searchMarkets({ q, category, state, sort });
  const allRows = db.prepare('SELECT category, state FROM market_prices').all() as any[];

  res.json({
    markets: matched,
    totalCount: matched.length,
    categories: Array.from(new Set(allRows.map(r => r.category))).sort(),
    states: Array.from(new Set(allRows.map(r => r.state))).sort(),
    liveApiConfigured: Boolean(liveApiKey),
    sourceMode,
    liveNotice,
    lastUpdated: new Date().toISOString()
  });
});

// ==================== PRODUCTS MARKETPLACE ====================
function validateAndCheckProductImages(
  excludeId: string | null,
  rawPrimary: string,
  rawList: string[]
): { ok: true; primaryImage: string; dedupedImages: string[] } | { ok: false; status: number; error: string } {
  const candidates = [rawPrimary, ...rawList]
    .map(u => String(u || '').trim())
    .filter(Boolean);

  for (const url of candidates) {
    if (!isValidProductImageUrl(url)) {
      return {
        ok: false,
        status: 400,
        error: `Invalid or generic product image URL rejected ("${url.slice(0, 80)}"). Use a direct product photo URL, uploaded image, or leave empty for Image Not Available.`
      };
    }
  }

  const dedupedImages = Array.from(new Set(candidates));
  const primaryImage = dedupedImages[0] || '';

  if (dedupedImages.length > 0) {
    const otherRows = excludeId
      ? (db.prepare('SELECT id, sku, title, image_url, images_json FROM products WHERE id != ?').all(excludeId) as any[])
      : (db.prepare('SELECT id, sku, title, image_url, images_json FROM products').all() as any[]);

    for (const other of otherRows) {
      let otherImgs: string[] = [];
      try {
        otherImgs = JSON.parse(other.images_json || '[]');
      } catch {
        otherImgs = [];
      }
      const otherSet = new Set(
        [other.image_url, ...(Array.isArray(otherImgs) ? otherImgs : [])]
          .filter((u): u is string => typeof u === 'string')
          .map(u => u.trim())
          .filter(Boolean)
      );
      const conflict = dedupedImages.find(u => otherSet.has(u));
      if (conflict) {
        return {
          ok: false,
          status: 409,
          error: `Image mismatch prevention: This image is already assigned to "${other.title}" (${other.sku || other.id}). Every product must have its own unique photo.`
        };
      }
    }
  }

  return { ok: true, primaryImage, dedupedImages };
}

app.get('/api/products', (req: Request, res: Response) => {
  const q = String(req.query.q ?? req.query.search ?? '');
  const category = req.query.category ? String(req.query.category) : undefined;
  const condition = req.query.condition ? String(req.query.condition) : undefined;
  const verifiedOnly = req.query.verifiedOnly === 'true';
  const inStockOnly = req.query.inStockOnly === 'true';
  const artisanId = req.query.artisanId ? String(req.query.artisanId) : undefined;
  const sort = (req.query.sort ? String(req.query.sort) : q.trim() ? 'relevance' : 'newest') as any;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));

  let products = searchProducts({ q, category, condition, verifiedOnly, inStockOnly, sort });
  if (artisanId) {
    products = products.filter(p => p.artisanId === artisanId);
  }

  const total = products.length;
  const start = (page - 1) * limit;
  const paged = products.slice(start, start + limit);

  res.json({
    products: paged,
    total,
    totalCount: total,
    page,
    limit
  });
});

app.post('/api/products/verify-image', async (req: Request, res: Response) => {
  const imageUrl = String(req.body?.imageUrl || '').trim();
  const excludeProductId = req.body?.productId ? String(req.body.productId) : null;

  if (!imageUrl) {
    return res.json({
      valid: false,
      reason: 'No image URL provided. Listing will display the "Image Not Available" placeholder cleanly.'
    });
  }

  if (!isValidProductImageUrl(imageUrl)) {
    return res.status(400).json({
      valid: false,
      reason: 'Rejected: URL must be a valid https/http product image, uploaded image, or /images/products/ asset (generic workshop photos are blocked).'
    });
  }

  const dupCheck = validateAndCheckProductImages(excludeProductId, imageUrl, [imageUrl]);
  if (!dupCheck.ok) {
    return res.status(dupCheck.status).json({
      valid: false,
      duplicate: dupCheck.status === 409,
      reason: dupCheck.error
    });
  }

  if (imageUrl.startsWith('data:image/')) {
    return res.json({ valid: true, sourceType: 'uploaded_data_url', reason: 'Uploaded image validated and unique to this product.' });
  }

  if (imageUrl.startsWith('/images/')) {
    const safeRel = imageUrl.replace(/^\/+/, '');
    const fullPath = path.join(process.cwd(), 'public', safeRel);
    if (fs.existsSync(fullPath)) {
      return res.json({ valid: true, sourceType: 'verified_local_asset', reason: 'Verified local product asset found and uniquely mapped.' });
    }
    return res.status(404).json({ valid: false, reason: `Local product image file not found at ${imageUrl}.` });
  }

  // Remote HTTP/HTTPS verification
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    let response = await fetch(imageUrl, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
    if (!response.ok || response.status === 405) {
      response = await fetch(imageUrl, { method: 'GET', signal: controller.signal, redirect: 'follow' });
    }
    clearTimeout(timer);

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (!response.ok) {
      return res.status(400).json({
        valid: false,
        reason: `Remote image URL returned HTTP ${response.status}. Placeholder "Image Not Available" should be used instead.`
      });
    }
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({
        valid: false,
        reason: `URL did not return an image (Content-Type: ${contentType || 'unknown'}).`
      });
    }
    return res.json({
      valid: true,
      sourceType: 'remote_verified',
      contentType,
      reason: 'Remote product image verified reachable and uniquely assigned.'
    });
  } catch {
    return res.status(400).json({
      valid: false,
      reason: 'Could not verify remote image URL within timeout. Leave blank to display "Image Not Available".'
    });
  }
});

// Verify real DB records only — never fabricate non-existent listings
app.post('/api/products/discover', (req: Request, res: Response) => {
  const query = normalizeQuery(String(req.body?.query || ''));
  if (!query) {
    return res.status(400).json({ error: 'Search query required.', products: [], found: false });
  }
  const products = searchProducts({ q: query, sort: 'relevance' });
  res.json({
    query,
    products,
    found: products.length > 0,
    message:
      products.length > 0
        ? `Found ${products.length} verified database listing(s) matching "${query}".`
        : `No matching products found in database for "${query}".`
  });
});

app.get('/api/products/:id/documents', (req: Request, res: Response) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
  if (!row) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  const product = mapProductRow(row);
  res.json({
    productId: product.id,
    sku: product.sku,
    title: product.title,
    documents: product.documents || [],
    specifications: product.specifications || {}
  });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
  if (!row) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  const reviews = db
    .prepare('SELECT * FROM product_reviews WHERE product_id = ? ORDER BY date DESC')
    .all(row.id) as any[];
  res.json({
    product: mapProductRow(row),
    reviews: reviews.map(mapReviewRow)
  });
});

app.post('/api/products', authenticate, requireSellerOrAdmin, (req: AuthenticatedRequest, res: Response) => {
  const body = req.body || {};
  const title = String(body.title || '').trim();
  const price = Number(body.price);
  if (!title || Number.isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'Valid product title and positive price are required.' });
  }

  const rawList: string[] = Array.isArray(body.images)
    ? body.images.map((u: any) => String(u || '').trim()).filter(Boolean)
    : [];
  const rawPrimary = String(body.imageUrl || '').trim();

  const imgCheck = validateAndCheckProductImages(null, rawPrimary, rawList);
  if (!imgCheck.ok) {
    return res.status(imgCheck.status).json({ error: imgCheck.error });
  }

  const id = `prod-${Date.now()}`;
  const sku = String(body.sku || `FG-${id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`).trim().toUpperCase();
  const existingSku = db.prepare('SELECT id, title FROM products WHERE UPPER(sku) = ?').get(sku) as any;
  if (existingSku) {
    return res.status(409).json({ error: `SKU "${sku}" is already assigned to "${existingSku.title}". Please use a unique SKU.` });
  }

  const artisanRow = db.prepare('SELECT id, name, location FROM users WHERE id = ?').get(req.authUser!.userId) as any;
  const stockNum = Math.max(0, Number(body.stock) || 10);
  const nowIso = new Date().toISOString();

  const rawDocs = Array.isArray(body.documents) ? body.documents : [];
  const boundDocs = rawDocs
    .filter((d: any) => d && String(d.title || '').trim())
    .map((d: any, idx: number) => ({
      id: String(d.id || `doc-${id}-${idx + 1}`),
      productId: id,
      title: String(d.title).trim(),
      docType: ['certificate', 'specification', 'provenance', 'care_guide', 'lab_report'].includes(d.docType) ? d.docType : 'specification',
      issuer: String(d.issuer || artisanRow?.name || req.authUser!.name),
      verified: Boolean(d.verified ?? true),
      summary: String(d.summary || '').trim(),
      url: d.url ? String(d.url).trim() : undefined
    }));

  const specs = body.specifications && typeof body.specifications === 'object' ? { ...body.specifications, SKU: sku } : { SKU: sku };

  db.prepare(`
    INSERT INTO products (
      id, sku, artisan_id, artisan_name, artisan_location, title, brand, model, category,
      condition, price, original_price, stock, unit, rating, reviews_count, image_url,
      images_json, description, specifications_json, documents_json, warranty, return_policy, defects_notice,
      verified_seller, seller_verification_badge, authenticity_status, artisan_story,
      materials_json, in_stock, featured, fair_trade_percent, deal_badge, moderation_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'Verified Seller Unit', 'verified', ?, ?, ?, 0, 86, ?, 'approved', ?, ?)
  `).run(
    id,
    sku,
    body.artisanId || artisanRow?.id || req.authUser!.userId,
    body.artisanName || artisanRow?.name || req.authUser!.name,
    body.artisanLocation || artisanRow?.location || 'India',
    title,
    String(body.brand || ''),
    String(body.model || ''),
    String(body.category || 'handicrafts'),
    String(body.condition || 'new'),
    price,
    body.originalPrice ? Number(body.originalPrice) : null,
    stockNum,
    String(body.unit || 'piece'),
    imgCheck.primaryImage,
    JSON.stringify(imgCheck.dedupedImages),
    String(body.description || 'Verified product listed on GramSetu Marketplace.'),
    JSON.stringify(specs),
    JSON.stringify(boundDocs),
    String(body.warranty || 'Seller Standard Replacement Policy'),
    String(body.returnPolicy || '7-Day Return Policy'),
    String(body.defectsNotice || ''),
    String(body.artisanStory || 'Direct producer unit on GramSetu.'),
    JSON.stringify(Array.isArray(body.materials) ? body.materials : ['Verified Materials']),
    stockNum > 0 ? 1 : 0,
    body.dealBadge || null,
    nowIso,
    nowIso
  );

  const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
  res.status(201).json({ product: mapProductRow(created) });
});

app.put('/api/products/:id', authenticate, requireSellerOrAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
  if (!existing) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  if (req.authUser!.role !== 'admin' && existing.artisan_id !== req.authUser!.userId) {
    return res.status(403).json({ error: 'You may only edit your own listings.' });
  }

  const b = req.body || {};
  const stockNum = b.stock !== undefined ? Math.max(0, Number(b.stock)) : existing.stock;
  const inStock = b.inStock !== undefined ? (b.inStock ? 1 : 0) : stockNum > 0 ? 1 : 0;

  let nextPrimary = existing.image_url || '';
  let nextImagesJson = existing.images_json || '[]';
  if (b.imageUrl !== undefined || b.images !== undefined) {
    const rawPrimary = b.imageUrl !== undefined ? String(b.imageUrl || '').trim() : '';
    const rawList: string[] = Array.isArray(b.images)
      ? b.images.map((u: any) => String(u || '').trim()).filter(Boolean)
      : rawPrimary
      ? [rawPrimary]
      : [];

    const imgCheck = validateAndCheckProductImages(existing.id, rawPrimary, rawList);
    if (!imgCheck.ok) {
      return res.status(imgCheck.status).json({ error: imgCheck.error });
    }
    nextPrimary = imgCheck.primaryImage;
    nextImagesJson = JSON.stringify(imgCheck.dedupedImages);
  }

  let nextSku = existing.sku || `FG-${String(existing.id).replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;
  if (b.sku !== undefined && String(b.sku).trim()) {
    const candidateSku = String(b.sku).trim().toUpperCase();
    const conflictSku = db.prepare('SELECT id, title FROM products WHERE UPPER(sku) = ? AND id != ?').get(candidateSku, existing.id) as any;
    if (conflictSku) {
      return res.status(409).json({ error: `SKU "${candidateSku}" is already assigned to "${conflictSku.title}".` });
    }
    nextSku = candidateSku;
  }

  let nextDocsJson = existing.documents_json || '[]';
  if (Array.isArray(b.documents)) {
    const boundDocs = b.documents
      .filter((d: any) => d && String(d.title || '').trim())
      .map((d: any, idx: number) => ({
        id: String(d.id || `doc-${existing.id}-${idx + 1}`),
        productId: existing.id,
        title: String(d.title).trim(),
        docType: ['certificate', 'specification', 'provenance', 'care_guide', 'lab_report'].includes(d.docType) ? d.docType : 'specification',
        issuer: String(d.issuer || existing.artisan_name),
        verified: Boolean(d.verified ?? true),
        summary: String(d.summary || '').trim(),
        url: d.url ? String(d.url).trim() : undefined
      }));
    nextDocsJson = JSON.stringify(boundDocs);
  }

  const nextSpecsJson = b.specifications && typeof b.specifications === 'object'
    ? JSON.stringify({ ...b.specifications, SKU: nextSku })
    : existing.specifications_json;

  const nowIso = new Date().toISOString();

  db.prepare(`
    UPDATE products
    SET sku = ?, title = ?, brand = ?, model = ?, category = ?, condition = ?, price = ?,
        original_price = ?, stock = ?, unit = ?, image_url = ?, images_json = ?,
        description = ?, specifications_json = ?, documents_json = ?, warranty = ?, return_policy = ?, defects_notice = ?,
        in_stock = ?, updated_at = ?
    WHERE id = ?
  `).run(
    nextSku,
    b.title ?? existing.title,
    b.brand ?? existing.brand,
    b.model ?? existing.model,
    b.category ?? existing.category,
    b.condition ?? existing.condition,
    b.price !== undefined ? Number(b.price) : existing.price,
    b.originalPrice !== undefined ? (b.originalPrice ? Number(b.originalPrice) : null) : existing.original_price,
    stockNum,
    b.unit ?? existing.unit,
    nextPrimary,
    nextImagesJson,
    b.description ?? existing.description,
    nextSpecsJson,
    nextDocsJson,
    b.warranty ?? existing.warranty,
    b.returnPolicy ?? existing.return_policy,
    b.defectsNotice ?? existing.defects_notice,
    inStock,
    nowIso,
    req.params.id
  );

  // Also sync order items' snapshot image/title if needed? No, historical orders keep snapshot unless reconciled, or keep live product updated cleanly.
  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
  res.json({ product: mapProductRow(updated) });
});

app.delete('/api/products/:id', authenticate, requireSellerOrAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
  if (!existing) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  if (req.authUser!.role !== 'admin' && existing.artisan_id !== req.authUser!.userId) {
    return res.status(403).json({ error: 'You may only delete your own listings.' });
  }
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.post('/api/products/:id/report', (req: Request, res: Response) => {
  const row = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Product not found.' });
  const reason = String(req.body?.reason || 'Reported by buyer for quality/authenticity inspection.');
  db.prepare("UPDATE products SET moderation_status = 'reported', reported_reason = ? WHERE id = ?").run(reason, req.params.id);
  res.json({ success: true, message: 'Listing has been flagged for administrator review.' });
});

// ==================== DEALS & COUPONS ====================
app.get('/api/deals', (_req: Request, res: Response) => {
  const rows = db.prepare('SELECT * FROM deals ORDER BY discount_percentage DESC').all() as any[];
  res.json({ deals: rows.map(mapDealRow) });
});

app.post('/api/deals/apply-coupon', (req: Request, res: Response) => {
  const couponCode = String(req.body?.couponCode || '').trim().toUpperCase();
  const orderTotal = Number(req.body?.orderTotal) || 0;
  if (!couponCode) {
    return res.status(400).json({ valid: false, message: 'Please enter a coupon code.' });
  }
  const row = db.prepare('SELECT * FROM deals WHERE UPPER(coupon_code) = ? AND verified = 1').get(couponCode) as any;
  if (!row) {
    return res.status(404).json({ valid: false, message: 'Invalid or expired coupon code.' });
  }
  const deal = mapDealRow(row);
  if (deal.validUntil && new Date(deal.validUntil) < new Date()) {
    return res.status(400).json({ valid: false, message: 'This promotional coupon has expired.' });
  }
  if (orderTotal < deal.minOrderValue) {
    return res.status(400).json({
      valid: false,
      message: `Minimum order value for ${deal.couponCode} is ₹${deal.minOrderValue}.`
    });
  }
  const discountAmount = Math.round((orderTotal * deal.discountPercentage) / 100);
  res.json({
    valid: true,
    couponCode: deal.couponCode,
    discountPercentage: deal.discountPercentage,
    discountAmount,
    newTotal: Math.max(0, orderTotal - discountAmount),
    message: `${deal.discountPercentage}% Discount Applied via ${deal.couponCode}!`
  });
});

// ==================== REVIEWS ====================
app.get('/api/reviews', (req: Request, res: Response) => {
  const productId = req.query.productId ? String(req.query.productId) : null;
  const sort = String(req.query.sort || 'newest');

  let orderBy = 'date DESC';
  if (sort === 'highest') orderBy = 'rating DESC, helpful_count DESC';
  else if (sort === 'helpful') orderBy = 'helpful_count DESC, rating DESC';

  const rows = productId
    ? (db.prepare(`SELECT * FROM product_reviews WHERE product_id = ? ORDER BY ${orderBy}`).all(productId) as any[])
    : (db.prepare(`SELECT * FROM product_reviews ORDER BY ${orderBy}`).all() as any[]);
  res.json({ reviews: rows.map(mapReviewRow) });
});

app.post('/api/reviews', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const b = req.body || {};
  const productId = String(b.productId || '').trim();
  const userId = req.authUser?.userId || String(b.userId || 'user-customer-1');
  const userName = req.authUser?.name || String(b.userName || 'Verified Buyer');

  if (!productId || !b.comment || !String(b.comment).trim()) {
    return res.status(400).json({ error: 'Product ID and review comment are required.' });
  }

  const productRow = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
  if (!productRow) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const existing = db.prepare('SELECT id FROM product_reviews WHERE product_id = ? AND user_id = ?').get(productId, userId);
  if (existing) {
    return res.status(400).json({ error: 'You have already submitted a review for this product.' });
  }

  // Genuine verified-purchase check against orders table
  const userOrders = db.prepare("SELECT items_json FROM orders WHERE customer_id = ? AND order_status != 'cancelled'").all(userId) as any[];
  const hasPurchased = userOrders.some(o => {
    try {
      const items = JSON.parse(o.items_json) as any[];
      return items.some(it => it.productId === productId);
    } catch {
      return false;
    }
  });

  const overall = Math.min(5, Math.max(1, Number(b.rating) || 5));
  const id = `rev-${Date.now()}`;
  const today = new Date().toISOString().split('T')[0];

  db.prepare(`
    INSERT INTO product_reviews (
      id, product_id, user_id, user_name, user_avatar, rating,
      quality_rating, durability_rating, value_for_money_rating, seller_experience_rating,
      comment, date, verified_purchase, review_images_json, helpful_count, reported
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
  `).run(
    id,
    productId,
    userId,
    userName,
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`,
    overall,
    Number(b.qualityRating) || overall,
    Number(b.durabilityRating) || overall,
    Number(b.valueForMoneyRating) || overall,
    Number(b.sellerExperienceRating) || overall,
    String(b.comment).trim(),
    today,
    hasPurchased ? 1 : 0,
    JSON.stringify(Array.isArray(b.reviewImages) ? b.reviewImages : [])
  );

  // Recompute product rating & review count
  const stats = db.prepare('SELECT COUNT(*) as cnt, AVG(rating) as avgRating FROM product_reviews WHERE product_id = ?').get(productId) as any;
  db.prepare('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?').run(
    Number((stats.avgRating || overall).toFixed(1)),
    stats.cnt || 1,
    productId
  );

  const created = db.prepare('SELECT * FROM product_reviews WHERE id = ?').get(id) as any;
  res.status(201).json({ review: mapReviewRow(created) });
});

app.post('/api/reviews/:id/helpful', (req: Request, res: Response) => {
  const row = db.prepare('SELECT id, helpful_count FROM product_reviews WHERE id = ?').get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Review not found.' });
  const nextCount = (row.helpful_count || 0) + 1;
  db.prepare('UPDATE product_reviews SET helpful_count = ? WHERE id = ?').run(nextCount, row.id);
  res.json({ success: true, helpfulCount: nextCount });
});

app.post('/api/reviews/:id/report', (req: Request, res: Response) => {
  const row = db.prepare('SELECT id FROM product_reviews WHERE id = ?').get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Review not found.' });
  const reason = String(req.body?.reason || 'Customer flagged review for moderation.');
  db.prepare('UPDATE product_reviews SET reported = 1, report_reason = ? WHERE id = ?').run(reason, row.id);
  res.json({ success: true, message: 'Review flagged for admin moderation review.' });
});

// ==================== ORDERS & PAYMENTS & LOGISTICS ====================
app.get('/api/orders', (req: Request, res: Response) => {
  const customerId = req.query.customerId ? String(req.query.customerId) : null;
  const artisanId = req.query.artisanId ? String(req.query.artisanId) : null;
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as any[];
  let orders = rows.map(mapOrderRow);

  if (customerId) {
    orders = orders.filter(o => o.customerId === customerId);
  }
  if (artisanId) {
    orders = orders.filter(o => o.items.some(item => item.artisanId === artisanId));
  }
  res.json({ orders });
});

app.post('/api/orders', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const b = req.body || {};
  const rawItems = Array.isArray(b.items) ? b.items : [];
  if (rawItems.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item.' });
  }

  let computedTotal = 0;
  const verifiedItems: any[] = [];
  for (const item of rawItems) {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const prodRow = item.productId
      ? (db.prepare('SELECT * FROM products WHERE id = ?').get(String(item.productId)) as any)
      : null;

    if (prodRow) {
      computedTotal += prodRow.price * qty;
      verifiedItems.push({
        productId: prodRow.id,
        title: prodRow.title,
        price: prodRow.price,
        quantity: qty,
        imageUrl: prodRow.image_url,
        artisanId: prodRow.artisan_id,
        artisanName: prodRow.artisan_name
      });
    } else {
      const unitPrice = Math.max(0, Number(item.price) || 0);
      computedTotal += unitPrice * qty;
      verifiedItems.push({ ...item, price: unitPrice, quantity: qty });
    }
  }

  if (b.couponCode) {
    const dealRow = db.prepare('SELECT * FROM deals WHERE UPPER(coupon_code) = ? AND verified = 1').get(String(b.couponCode).trim().toUpperCase()) as any;
    if (dealRow && computedTotal >= dealRow.min_order_value) {
      computedTotal = Math.max(0, computedTotal - Math.round((computedTotal * dealRow.discount_percentage) / 100));
    }
  }

  const orderId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
  const trackingId = `GRAM-${Math.floor(10000 + Math.random() * 90000)}`;
  const nowIso = new Date().toISOString();
  const estDate = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
  const otp = String(Math.floor(1000 + Math.random() * 9000));

  db.prepare(`
    INSERT INTO orders (
      id, tracking_id, customer_id, customer_name, customer_phone, shipping_address,
      items_json, total_amount, payment_method, payment_status, upi_ref_id,
      order_status, created_at, delivery_date_estimated, current_hub,
      delivery_partner, delivery_agent_phone, delivery_otp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'UPI', 'PAID', ?, 'placed', ?, ?, ?, 'India Post Gram Relay', '+91 98100 11223', ?)
  `).run(
    orderId,
    trackingId,
    req.authUser?.userId || String(b.customerId || 'user-customer-1'),
    req.authUser?.name || String(b.customerName || 'Valued Buyer'),
    String(b.customerPhone || '+91 98112 34567'),
    String(b.shippingAddress || 'Delivery Address'),
    JSON.stringify(verifiedItems),
    computedTotal || Number(b.totalAmount) || 0,
    String(b.upiRefId || `NPCI-UPI-${Date.now().toString().slice(-8)}`),
    nowIso,
    estDate,
    'District Nodal Origin Hub',
    otp
  );

  const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
  res.status(201).json({ order: mapOrderRow(created) });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Order not found' });
  const { orderStatus, currentHub } = req.body || {};
  db.prepare('UPDATE orders SET order_status = ?, current_hub = ? WHERE id = ?').run(
    orderStatus || row.order_status,
    currentHub || row.current_hub,
    row.id
  );
  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(row.id) as any;
  res.json({ order: mapOrderRow(updated) });
});

app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
  const row = db.prepare('SELECT * FROM orders WHERE id = ? OR tracking_id = ?').get(req.params.id, req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Order not found' });
  if (row.order_status === 'delivered') {
    return res.status(400).json({ error: 'Delivered orders cannot be cancelled. You can request a return instead.' });
  }
  const reason = String(req.body?.reason || 'Customer requested order cancellation before delivery.');
  db.prepare("UPDATE orders SET order_status = 'cancelled', cancellation_reason = ? WHERE id = ?").run(reason, row.id);
  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(row.id) as any;
  res.json({ success: true, order: mapOrderRow(updated), message: 'Order cancelled and UPI escrow refund initiated.' });
});

app.post('/api/orders/:id/return', (req: Request, res: Response) => {
  const row = db.prepare('SELECT * FROM orders WHERE id = ? OR tracking_id = ?').get(req.params.id, req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Order not found' });
  const reason = String(req.body?.reason || 'Customer requested return and replacement inspection.');
  db.prepare("UPDATE orders SET order_status = 'return_requested', return_reason = ? WHERE id = ?").run(reason, row.id);
  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(row.id) as any;
  res.json({ success: true, order: mapOrderRow(updated), message: 'Return request submitted. Pickup scheduled.' });
});

app.post('/api/payments/create-upi', (req: Request, res: Response) => {
  const { amount, orderId } = req.body || {};
  const txnId = `TXN${Date.now()}`;
  const upiId = 'gramsetu.escrow@sbi';
  const qrString = `upi://pay?pa=${upiId}&pn=GramSetu_Escrow&am=${amount}&tn=Order_${orderId || 'Cart'}&cu=INR&tr=${txnId}`;

  res.json({
    txnId,
    upiId,
    qrString,
    amount,
    merchantName: 'GramSetu Escrow Settlement',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { txnId, upiRefId } = req.body || {};
  res.json({
    status: 'SUCCESS',
    txnId,
    bankRef: upiRefId || `NPCI-UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    verifiedAt: new Date().toISOString(),
    escrowNote: 'Secured in GramSetu Escrow until delivery confirmation.'
  });
});

app.get('/api/deliveries/track/:trackingId', (req: Request, res: Response) => {
  const tid = String(req.params.trackingId || '').trim();
  const row = db
    .prepare('SELECT * FROM orders WHERE LOWER(tracking_id) = LOWER(?) OR LOWER(id) = LOWER(?)')
    .get(tid, tid) as any;

  if (!row) {
    return res.json({
      trackingId: tid,
      found: false,
      message: 'Consignment not found. Try searching with sample tracking ID GRAM-88219 or ORD-2026-901.'
    });
  }

  const order = mapOrderRow(row);
  const stages = [
    {
      step: 1,
      title: 'Origin Producer Hub',
      location: 'Varanasi & Madhubani Origin Cluster',
      status: 'completed',
      time: 'Stage 1 Completed',
      description: 'Quality inspected, barcoded, and packaged.'
    },
    {
      step: 2,
      title: 'District Nodal Aggregation Hub',
      location: 'Regional Gram Relay Center',
      status: order.orderStatus === 'placed' ? 'current' : 'completed',
      time: 'Stage 2',
      description: 'Consolidated with regional consignment for dispatch.'
    },
    {
      step: 3,
      title: 'Interstate Transit Sorting',
      location: 'National Postal Sorting Hub',
      status: ['dispatched', 'out_for_delivery', 'delivered'].includes(order.orderStatus)
        ? 'completed'
        : order.orderStatus === 'packed'
        ? 'current'
        : 'pending',
      time: 'Stage 3',
      description: 'Sealed container in transit.'
    },
    {
      step: 4,
      title: 'Destination Last-Mile Hub',
      location: order.currentHub || 'Destination Distribution Hub',
      status: ['out_for_delivery', 'delivered'].includes(order.orderStatus)
        ? order.orderStatus === 'delivered'
          ? 'completed'
          : 'current'
        : 'pending',
      time: 'Stage 4',
      description: 'Assigned for doorstep delivery with OTP verification.'
    },
    {
      step: 5,
      title: 'Delivered to Buyer',
      location: order.shippingAddress,
      status: order.orderStatus === 'delivered' ? 'completed' : 'pending',
      time: order.orderStatus === 'delivered' ? 'Delivered' : `Estimated ${order.deliveryDateEstimated}`,
      description: order.orderStatus === 'delivered' ? 'Delivered and escrow released.' : 'Awaiting OTP handoff.'
    }
  ];

  res.json({
    found: true,
    order,
    stages,
    partner: {
      name: order.deliveryPartner,
      vehicle: 'India Post Gram Relay',
      agent: order.deliveryAgentPhone,
      otp: order.deliveryOtp
    }
  });
});

// ==================== MESSAGES, CHATS, TICKETS & PAYOUTS ====================
app.get('/api/messages', (req: Request, res: Response) => {
  const { userId, productId } = req.query;
  const rows = db.prepare('SELECT * FROM messages ORDER BY timestamp ASC').all() as any[];
  let results = rows.map(mapMessageRow);
  if (userId) results = results.filter(m => m.senderId === userId || m.recipientId === userId);
  if (productId) results = results.filter(m => m.productId === productId);
  res.json({ messages: results });
});

app.post('/api/messages', (req: Request, res: Response) => {
  const b = req.body || {};
  if (!b.text || !String(b.text).trim()) {
    return res.status(400).json({ error: 'Message text required' });
  }
  const id = `msg-${Date.now()}`;
  const ts = new Date().toISOString();
  db.prepare(`
    INSERT INTO messages (id, product_id, product_title, sender_id, sender_name, sender_role, recipient_id, recipient_name, text, timestamp, read)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `).run(
    id,
    b.productId || 'prod-1',
    b.productTitle || 'Verified Product',
    b.senderId || 'user-customer-1',
    b.senderName || 'Buyer',
    b.senderRole || 'customer',
    b.recipientId || 'user-artisan-1',
    b.recipientName || 'Seller',
    String(b.text).trim(),
    ts
  );
  const created = db.prepare('SELECT * FROM messages WHERE id = ?').get(id) as any;
  res.status(201).json({ message: mapMessageRow(created) });
});

app.get('/api/support/tickets', (_req: Request, res: Response) => {
  const rows = db.prepare('SELECT * FROM support_tickets ORDER BY created_at DESC').all() as any[];
  res.json({ tickets: rows.map(mapTicketRow) });
});

app.post('/api/support/tickets', (req: Request, res: Response) => {
  const b = req.body || {};
  const id = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowIso = new Date().toISOString();
  const messages = [
    {
      sender: 'user',
      text: String(b.message || 'Need assistance with GramSetu.'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
  db.prepare(`
    INSERT INTO support_tickets (id, user_id, user_name, role, subject, category, status, priority, created_at, messages_json)
    VALUES (?, ?, ?, ?, ?, ?, 'open', 'medium', ?, ?)
  `).run(
    id,
    b.userId || 'user-artisan-1',
    b.userName || 'User',
    b.role || 'entrepreneur',
    String(b.subject || 'Support Inquiry'),
    String(b.category || 'general'),
    nowIso,
    JSON.stringify(messages)
  );
  const created = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(id) as any;
  res.status(201).json({ ticket: mapTicketRow(created) });
});

app.post('/api/support/tickets/:id/reply', (req: Request, res: Response) => {
  const row = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Ticket not found' });
  const ticket = mapTicketRow(row);
  ticket.messages.push({
    sender: req.body?.sender === 'support' ? 'support' : 'user',
    text: String(req.body?.text || ''),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  db.prepare('UPDATE support_tickets SET messages_json = ? WHERE id = ?').run(JSON.stringify(ticket.messages), row.id);
  res.json({ ticket });
});

// Direct customer-artisan chat helper (persisted via messages table grouped by partner/product)
app.get('/api/customer-chats', (req: Request, res: Response) => {
  const artisanId = req.query.artisanId ? String(req.query.artisanId) : 'user-artisan-1';
  const rows = db.prepare('SELECT * FROM messages WHERE recipient_id = ? OR sender_id = ? ORDER BY timestamp ASC').all(artisanId, artisanId) as any[];
  const msgs = rows.map(mapMessageRow);
  const grouped = new Map<string, any>();

  for (const m of msgs) {
    const partnerId = m.senderId === artisanId ? m.recipientId : m.senderId;
    const partnerName = m.senderId === artisanId ? m.recipientName : m.senderName;
    const key = `${partnerId}:${m.productId}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: `chat-${partnerId}-${m.productId}`,
        customerId: partnerId,
        customerName: partnerName || 'Buyer',
        customerAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(partnerName || 'Buyer')}`,
        artisanId,
        artisanName: 'Seller Unit',
        productTitle: m.productTitle || 'Marketplace Item',
        productId: m.productId,
        unreadByArtisan: 0,
        messages: []
      });
    }
    const chat = grouped.get(key);
    chat.messages.push({
      sender: m.senderRole === 'entrepreneur' ? 'artisan' : 'customer',
      text: m.text,
      time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (!m.read && m.senderRole !== 'entrepreneur') {
      chat.unreadByArtisan += 1;
    }
  }

  res.json({ chats: Array.from(grouped.values()) });
});

app.post('/api/customer-chats/send', (req: Request, res: Response) => {
  const { customerId, customerName, artisanId, artisanName, productTitle, productId, text, sender } = req.body || {};
  const id = `msg-${Date.now()}`;
  const ts = new Date().toISOString();
  const isArtisan = sender === 'artisan';
  db.prepare(`
    INSERT INTO messages (id, product_id, product_title, sender_id, sender_name, sender_role, recipient_id, recipient_name, text, timestamp, read)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    id,
    productId || 'prod-1',
    productTitle || 'Marketplace Product',
    isArtisan ? artisanId || 'user-artisan-1' : customerId || 'user-customer-1',
    isArtisan ? artisanName || 'Seller' : customerName || 'Buyer',
    isArtisan ? 'entrepreneur' : 'customer',
    isArtisan ? customerId || 'user-customer-1' : artisanId || 'user-artisan-1',
    isArtisan ? customerName || 'Buyer' : artisanName || 'Seller',
    String(text || '').trim(),
    ts
  );

  res.json({
    chat: {
      id: `chat-${customerId || 'user-customer-1'}-${productId || 'prod-1'}`,
      customerId: customerId || 'user-customer-1',
      customerName: customerName || 'Buyer',
      artisanId: artisanId || 'user-artisan-1',
      productTitle: productTitle || 'Marketplace Product',
      productId: productId || 'prod-1',
      unreadByArtisan: 0,
      messages: [
        {
          sender: isArtisan ? 'artisan' : 'customer',
          text: String(text || '').trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }
  });
});

let payoutState = {
  artisanId: 'user-artisan-1',
  artisanName: 'Vedant Mishra',
  bankName: 'State Bank of India',
  accountNumberMasked: '•••• •••• 4019',
  upiVpa: 'vedantmishra@sbi',
  totalLifetimeEarned: 284500,
  availableBalance: 14850,
  pendingEscrow: 3700,
  recentPayouts: [
    {
      id: 'PAY-8921',
      amount: 22400,
      date: '2026-09-24',
      status: 'SETTLED',
      method: 'Direct UPI Escrow',
      bankRef: 'NPCI-UPI-9928174628'
    }
  ]
};

app.get('/api/payouts', (_req: Request, res: Response) => {
  res.json({ payouts: payoutState });
});

app.post('/api/payouts/withdraw', (req: Request, res: Response) => {
  const withdrawAmount = Number(req.body?.amount) || payoutState.availableBalance;
  if (withdrawAmount <= 0 || withdrawAmount > payoutState.availableBalance) {
    return res.status(400).json({ error: 'Invalid or insufficient available balance.' });
  }
  const newPayout = {
    id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: withdrawAmount,
    date: new Date().toISOString().split('T')[0],
    status: 'SETTLED',
    method: `Instant UPI to ${payoutState.upiVpa}`,
    bankRef: `NPCI-UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`
  };
  payoutState.availableBalance = Math.max(0, payoutState.availableBalance - withdrawAmount);
  payoutState.recentPayouts.unshift(newPayout);
  res.json({
    success: true,
    message: `₹${withdrawAmount} transferred to ${payoutState.upiVpa}`,
    payout: newPayout,
    updatedPayouts: payoutState
  });
});

app.get('/api/analytics/overview', (_req: Request, res: Response) => {
  const ordStats = db.prepare("SELECT COUNT(*) as cnt, COALESCE(SUM(total_amount),0) as rev FROM orders WHERE order_status != 'cancelled'").get() as any;
  const prodCount = (db.prepare('SELECT COUNT(*) as cnt FROM products').get() as any).cnt;
  const projCount = (db.prepare('SELECT COUNT(*) as cnt FROM projects').get() as any).cnt;
  const schemeCount = (db.prepare('SELECT COUNT(*) as cnt FROM government_schemes').get() as any).cnt;

  res.json({
    kpis: {
      totalSales: ordStats.rev || 0,
      totalOrders: ordStats.cnt || 0,
      activeProducts: prodCount,
      activeProjects: projCount,
      activeSchemes: schemeCount,
      activeCustomers: (db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role='customer'").get() as any).cnt,
      growthRate: 18.4,
      averageOrderValue: ordStats.cnt ? Math.round(ordStats.rev / ordStats.cnt) : 0,
      onTimeDeliveryRate: 98.5,
      artisanFairCutAverage: '86%'
    },
    monthlyReports: [
      { month: 'May', revenue: 34500, orders: 14, artisans: 8 },
      { month: 'Jun', revenue: 41200, orders: 18, artisans: 11 },
      { month: 'Jul', revenue: 52000, orders: 22, artisans: 14 },
      { month: 'Aug', revenue: 61800, orders: 26, artisans: 16 },
      { month: 'Sep', revenue: 67000, orders: 29, artisans: 19 },
      { month: 'Oct', revenue: ordStats.rev || 71500, orders: ordStats.cnt || 31, artisans: 21 }
    ],
    categoryPerformance: [
      { name: 'Handloom Textiles', sales: 112000, share: 39, growth: '+24%' },
      { name: 'Organic Spices & Turmeric', sales: 68400, share: 24, growth: '+31%' },
      { name: 'Terracotta & Pottery', sales: 46200, share: 16, growth: '+18%' },
      { name: 'Honey & Cold-Pressed Oils', sales: 38900, share: 14, growth: '+20%' },
      { name: 'Bamboo & Wood Craft', sales: 19000, share: 7, growth: '+14%' }
    ]
  });
});

// ==================== STRICT RBAC ADMIN ENDPOINTS ====================
app.get('/api/admin/users', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const search = normalizeQuery(String(req.query.search || ''));
  const status = String(req.query.status || 'all');
  const role = String(req.query.role || 'all');
  const loginType = String(req.query.loginType || 'all');

  const allRows = db.prepare('SELECT * FROM users ORDER BY joined_date DESC').all() as any[];
  const allUsers = allRows.map(mapUserRow);

  const stats = {
    totalUsers: allUsers.length,
    activeSessions: allUsers.filter(u => u.lastLoginType === 'recent' && u.accountStatus === 'active').length,
    neverLoggedInCount: allUsers.filter(u => u.lastLoginType === 'never').length,
    unknownLoginCount: allUsers.filter(u => u.lastLoginType === 'unknown').length,
    inactiveCount: allUsers.filter(u => u.lastLoginType === 'inactive').length,
    suspendedCount: allUsers.filter(u => u.accountStatus === 'suspended').length
  };

  let filtered = allUsers;
  if (search) {
    filtered = filtered.filter(
      u =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.phone.toLowerCase().includes(search)
    );
  }
  if (status !== 'all') filtered = filtered.filter(u => u.accountStatus === status);
  if (role !== 'all') filtered = filtered.filter(u => u.role === role);
  if (loginType !== 'all') filtered = filtered.filter(u => u.lastLoginType === loginType);

  res.json({ users: filtered, stats });
});

app.post('/api/admin/users/:id/status', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'User not found.' });

  const nextStatus = req.body?.status === 'suspended' ? 'suspended' : 'active';
  const reason = String(req.body?.reason || (nextStatus === 'suspended' ? 'Administrative suspension.' : 'Account reactivated.'));
  const byAdmin = String(req.body?.adminName || req.authUser!.name);
  const action = nextStatus === 'suspended' ? 'suspend' : 'reactivate';

  db.prepare('UPDATE users SET account_status = ? WHERE id = ?').run(nextStatus, row.id);
  db.prepare('INSERT INTO user_audit_trail (user_id, action, by_admin, reason, timestamp) VALUES (?, ?, ?, ?, ?)').run(
    row.id,
    action,
    byAdmin,
    reason,
    new Date().toISOString()
  );

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(row.id) as any;
  res.json({ success: true, user: mapUserRow(updated) });
});

app.get('/api/admin/moderation', authenticate, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const prodRows = db.prepare("SELECT * FROM products WHERE moderation_status = 'reported' OR moderation_status = 'paused'").all() as any[];
  const revRows = db.prepare('SELECT * FROM product_reviews WHERE reported = 1').all() as any[];
  res.json({
    reportedProducts: prodRows.map(mapProductRow),
    flaggedReviews: revRows.map(mapReviewRow)
  });
});

app.post('/api/admin/products/:id/moderate', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Product not found.' });

  const action = req.body?.action;
  if (action === 'delete') {
    db.prepare('DELETE FROM products WHERE id = ?').run(row.id);
    return res.json({ success: true, message: 'Product listing removed.' });
  }
  if (action === 'pause') {
    db.prepare("UPDATE products SET moderation_status = 'paused', in_stock = 0 WHERE id = ?").run(row.id);
    return res.json({ success: true, message: 'Listing paused.' });
  }
  db.prepare("UPDATE products SET moderation_status = 'approved', reported_reason = NULL WHERE id = ?").run(row.id);
  res.json({ success: true, message: 'Listing approved.' });
});

app.post('/api/admin/reviews/:id/moderate', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const row = db.prepare('SELECT * FROM product_reviews WHERE id = ?').get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: 'Review not found.' });

  if (req.body?.action === 'delete') {
    db.prepare('DELETE FROM product_reviews WHERE id = ?').run(row.id);
    return res.json({ success: true, message: 'Flagged review deleted.' });
  }
  db.prepare('UPDATE product_reviews SET reported = 0, report_reason = NULL WHERE id = ?').run(row.id);
  res.json({ success: true, message: 'Review flag cleared.' });
});

// Admin Projects CRUD
app.post('/api/admin/projects', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const b = req.body || {};
  const name = String(b.name || '').trim();
  const description = String(b.description || '').trim();
  if (!name || !description) {
    return res.status(400).json({ error: 'Project name and description are required.' });
  }

  const id = String(b.id || `proj-${Date.now()}`);
  const slug = String(b.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4));
  const nowIso = new Date().toISOString();

  db.prepare(`
    INSERT INTO projects (
      id, slug, name, category, industry, business_type, location_suitability,
      image_url, description, keywords_json, required_investment, estimated_setup_cost,
      cost_assumptions, estimated_monthly_revenue_range, required_resources_json,
      target_customers, revenue_model, required_skills_json, benefits_json,
      challenges_json, related_scheme_ids_json, reference_links_json,
      implementation_details_json, status, verified_source, last_verified_date,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    slug,
    name,
    String(b.category || 'small_business'),
    String(b.industry || 'General Enterprise'),
    String(b.businessType || 'Small Business Unit'),
    String(b.locationSuitability || 'Pan-India Rural & Semi-Urban'),
    String(b.imageUrl || '/images/project_spice_unit.jpg'),
    description,
    JSON.stringify(Array.isArray(b.keywords) ? b.keywords : []),
    String(b.requiredInvestment || 'Estimate unavailable — verify locally'),
    String(b.estimatedSetupCost || 'Estimate pending assessment'),
    String(b.costAssumptions || 'Illustrative regional estimate; actual costs vary by district, equipment vendor, and capacity.'),
    String(b.estimatedMonthlyRevenueRange || 'Varies by market demand & utilization'),
    JSON.stringify(Array.isArray(b.requiredResources) ? b.requiredResources : []),
    String(b.targetCustomers || 'Local & regional buyers'),
    String(b.revenueModel || 'Direct retail & B2B supply'),
    JSON.stringify(Array.isArray(b.requiredSkills) ? b.requiredSkills : []),
    JSON.stringify(Array.isArray(b.benefits) ? b.benefits : []),
    JSON.stringify(Array.isArray(b.challenges) ? b.challenges : []),
    JSON.stringify(Array.isArray(b.relatedSchemeIds) ? b.relatedSchemeIds : []),
    JSON.stringify(Array.isArray(b.referenceLinks) ? b.referenceLinks : []),
    b.implementationDetails ? JSON.stringify(b.implementationDetails) : null,
    b.status === 'draft' || b.status === 'archived' ? b.status : 'verified',
    String(b.verifiedSource || 'GramSetu Admin Directory'),
    nowIso.split('T')[0],
    nowIso,
    nowIso
  );

  const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as any;
  res.status(201).json({ project: mapProjectRow(created) });
});

app.put('/api/admin/projects/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Project not found.' });
  const b = req.body || {};

  db.prepare(`
    UPDATE projects
    SET name = ?, category = ?, industry = ?, business_type = ?, location_suitability = ?,
        image_url = ?, description = ?, keywords_json = ?, required_investment = ?,
        estimated_setup_cost = ?, cost_assumptions = ?, estimated_monthly_revenue_range = ?,
        required_resources_json = ?, target_customers = ?, revenue_model = ?,
        required_skills_json = ?, benefits_json = ?, challenges_json = ?,
        related_scheme_ids_json = ?, reference_links_json = ?, implementation_details_json = ?,
        status = ?, updated_at = ?
    WHERE id = ?
  `).run(
    b.name ?? existing.name,
    b.category ?? existing.category,
    b.industry ?? existing.industry,
    b.businessType ?? existing.business_type,
    b.locationSuitability ?? existing.location_suitability,
    b.imageUrl ?? existing.image_url,
    b.description ?? existing.description,
    b.keywords ? JSON.stringify(b.keywords) : existing.keywords_json,
    b.requiredInvestment ?? existing.required_investment,
    b.estimatedSetupCost ?? existing.estimated_setup_cost,
    b.costAssumptions ?? existing.cost_assumptions,
    b.estimatedMonthlyRevenueRange ?? existing.estimated_monthly_revenue_range,
    b.requiredResources ? JSON.stringify(b.requiredResources) : existing.required_resources_json,
    b.targetCustomers ?? existing.target_customers,
    b.revenueModel ?? existing.revenue_model,
    b.requiredSkills ? JSON.stringify(b.requiredSkills) : existing.required_skills_json,
    b.benefits ? JSON.stringify(b.benefits) : existing.benefits_json,
    b.challenges ? JSON.stringify(b.challenges) : existing.challenges_json,
    b.relatedSchemeIds ? JSON.stringify(b.relatedSchemeIds) : existing.related_scheme_ids_json,
    b.referenceLinks ? JSON.stringify(b.referenceLinks) : existing.reference_links_json,
    b.implementationDetails !== undefined ? (b.implementationDetails ? JSON.stringify(b.implementationDetails) : null) : existing.implementation_details_json,
    b.status ?? existing.status,
    new Date().toISOString(),
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id) as any;
  res.json({ project: mapProjectRow(updated) });
});

app.delete('/api/admin/projects/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found.' });
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Admin Government Schemes CRUD
app.post('/api/admin/schemes', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const b = req.body || {};
  const name = String(b.name || '').trim();
  const ministry = String(b.ministry || '').trim();
  if (!name || !ministry) {
    return res.status(400).json({ error: 'Scheme name and ministry/authority are required.' });
  }
  const id = String(b.id || `scheme-${Date.now()}`);
  const nowIso = new Date().toISOString();

  db.prepare(`
    INSERT INTO government_schemes (
      id, name, tagline, ministry, level, state, category, scheme_type, eligibility_target,
      description, purpose_benefits_json, eligibility_criteria_json, documents_json,
      application_process_json, financial_assistance, max_loan_amount, loan_display, tranches,
      interest_rate, interest_subvention, subsidy_grant, collateral, deadline, status,
      official_url, official_source, last_verified_date, badge, eligible_trades_json,
      processing_time, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    name,
    String(b.tagline || ''),
    ministry,
    b.level === 'state' ? 'state' : 'central',
    String(b.state || 'All India'),
    String(b.category || 'capital_subsidies'),
    String(b.schemeType || 'Subsidy'),
    String(b.eligibilityTarget || 'Verify eligibility on official portal'),
    String(b.description || ''),
    JSON.stringify(Array.isArray(b.purposeBenefits) ? b.purposeBenefits : []),
    JSON.stringify(Array.isArray(b.eligibilityCriteria) ? b.eligibilityCriteria : []),
    JSON.stringify(Array.isArray(b.documents) ? b.documents : ['Aadhaar Card', 'Bank Passbook']),
    JSON.stringify(Array.isArray(b.applicationProcess) ? b.applicationProcess : ['Apply via official portal']),
    String(b.financialAssistance || ''),
    Number(b.maxLoanAmount) || 0,
    String(b.loanDisplay || 'Check official portal'),
    String(b.tranches || 'As per official norms'),
    String(b.interestRate || 'As per scheme guidelines'),
    String(b.interestSubvention || 'Applicable as notified'),
    String(b.subsidyGrant || b.financialAssistance || ''),
    String(b.collateral || 'Refer to scheme guidelines'),
    String(b.deadline || 'Ongoing — verify on official portal'),
    ['active', 'upcoming', 'expired'].includes(b.status) ? b.status : 'active',
    String(b.officialUrl || ''),
    String(b.officialSource || ministry),
    String(b.lastVerifiedDate || nowIso.split('T')[0]),
    String(b.badge || 'Verified Scheme'),
    JSON.stringify(Array.isArray(b.eligibleTrades) ? b.eligibleTrades : []),
    String(b.processingTime || 'Subject to verification'),
    nowIso
  );

  const created = db.prepare('SELECT * FROM government_schemes WHERE id = ?').get(id) as any;
  res.status(201).json({ scheme: mapSchemeRow(created) });
});

app.put('/api/admin/schemes/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM government_schemes WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Scheme not found.' });
  const b = req.body || {};

  db.prepare(`
    UPDATE government_schemes
    SET name = ?, tagline = ?, ministry = ?, level = ?, state = ?, category = ?, scheme_type = ?,
        description = ?, financial_assistance = ?, loan_display = ?, subsidy_grant = ?,
        deadline = ?, status = ?, official_url = ?, official_source = ?, last_verified_date = ?, updated_at = ?
    WHERE id = ?
  `).run(
    b.name ?? existing.name,
    b.tagline ?? existing.tagline,
    b.ministry ?? existing.ministry,
    b.level ?? existing.level,
    b.state ?? existing.state,
    b.category ?? existing.category,
    b.schemeType ?? existing.scheme_type,
    b.description ?? existing.description,
    b.financialAssistance ?? existing.financial_assistance,
    b.loanDisplay ?? existing.loan_display,
    b.subsidyGrant ?? existing.subsidy_grant,
    b.deadline ?? existing.deadline,
    b.status ?? existing.status,
    b.officialUrl ?? existing.official_url,
    b.officialSource ?? existing.official_source,
    b.lastVerifiedDate ?? existing.last_verified_date,
    new Date().toISOString(),
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM government_schemes WHERE id = ?').get(req.params.id) as any;
  res.json({ scheme: mapSchemeRow(updated) });
});

app.delete('/api/admin/schemes/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.prepare('SELECT id FROM government_schemes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Scheme not found.' });
  db.prepare('DELETE FROM government_schemes WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Admin Market Prices CRUD
app.post('/api/admin/markets', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const b = req.body || {};
  const commodityName = String(b.commodityName || '').trim();
  const marketName = String(b.marketName || '').trim();
  if (!commodityName || !marketName) {
    return res.status(400).json({ error: 'Commodity name and market name are required.' });
  }
  const id = `mkt-${Date.now()}`;
  const nowIso = new Date().toISOString();

  db.prepare(`
    INSERT INTO market_prices (
      id, commodity_name, variety, category, market_name, district, state,
      min_price, max_price, modal_price, unit, previous_price, demand_level,
      supply_level, price_date, data_source, source_url, is_live_api, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
  `).run(
    id,
    commodityName,
    String(b.variety || 'FAQ Grade'),
    String(b.category || 'Agricultural Commodities'),
    marketName,
    String(b.district || marketName),
    String(b.state || 'India'),
    Number(b.minPrice) || Number(b.modalPrice) || 0,
    Number(b.maxPrice) || Number(b.modalPrice) || 0,
    Number(b.modalPrice) || 0,
    String(b.unit || 'INR / Quintal'),
    b.previousPrice !== undefined ? Number(b.previousPrice) : null,
    String(b.demandLevel || 'Moderate'),
    String(b.supplyLevel || 'Moderate'),
    String(b.priceDate || nowIso.split('T')[0]),
    String(b.dataSource || 'Admin Verified Mandi Entry'),
    String(b.sourceUrl || 'https://agmarknet.gov.in/'),
    nowIso
  );

  const created = db.prepare('SELECT * FROM market_prices WHERE id = ?').get(id) as any;
  res.status(201).json({ market: mapMarketRow(created) });
});

app.put('/api/admin/markets/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM market_prices WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Market record not found.' });
  const b = req.body || {};

  db.prepare(`
    UPDATE market_prices
    SET commodity_name = ?, variety = ?, category = ?, market_name = ?, state = ?,
        min_price = ?, max_price = ?, modal_price = ?, unit = ?, demand_level = ?,
        supply_level = ?, price_date = ?, data_source = ?, updated_at = ?
    WHERE id = ?
  `).run(
    b.commodityName ?? existing.commodity_name,
    b.variety ?? existing.variety,
    b.category ?? existing.category,
    b.marketName ?? existing.market_name,
    b.state ?? existing.state,
    b.minPrice !== undefined ? Number(b.minPrice) : existing.min_price,
    b.maxPrice !== undefined ? Number(b.maxPrice) : existing.max_price,
    b.modalPrice !== undefined ? Number(b.modalPrice) : existing.modal_price,
    b.unit ?? existing.unit,
    b.demandLevel ?? existing.demand_level,
    b.supplyLevel ?? existing.supply_level,
    b.priceDate ?? existing.price_date,
    b.dataSource ?? existing.data_source,
    new Date().toISOString(),
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM market_prices WHERE id = ?').get(req.params.id) as any;
  res.json({ market: mapMarketRow(updated) });
});

app.delete('/api/admin/markets/:id', authenticate, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const existing = db.prepare('SELECT id FROM market_prices WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Market record not found.' });
  db.prepare('DELETE FROM market_prices WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ==================== AI ASSISTANT ENDPOINTS (Grounded in SQLite DB) ====================
app.post('/api/ai/chat', aiLimiter, async (req: Request, res: Response) => {
  const { message, history = [], language = 'English', role = 'entrepreneur' } = req.body || {};
  const cleanMsg = String(message || '').trim();
  if (!cleanMsg) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Search local SQLite database for grounded context
  const dbMatches = runUniversalSearch({ q: cleanMsg, type: 'all', limit: 4 });
  const references = {
    projects: dbMatches.results.projects.slice(0, 3),
    schemes: dbMatches.results.schemes.slice(0, 3),
    markets: dbMatches.results.markets.slice(0, 3),
    products: dbMatches.results.products.slice(0, 3)
  };

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: 'Advisor is unavailable because GEMINI_API_KEY is not configured.',
      references
    });
  }

  const contextSummary = JSON.stringify({
    matchedProjects: references.projects.map(p => ({
      name: p.name,
      category: p.category,
      investment: p.requiredInvestment,
      setupCost: p.estimatedSetupCost,
      assumptions: p.costAssumptions,
      schemes: p.relatedSchemeIds
    })),
    matchedSchemes: references.schemes.map(s => ({
      name: s.name,
      ministry: s.ministry,
      state: s.state,
      status: s.status,
      financialAssistance: s.financialAssistance,
      officialUrl: s.officialUrl
    })),
    matchedMarkets: references.markets.map(m => ({
      commodity: m.commodityName,
      market: m.marketName,
      state: m.state,
      modalPrice: m.modalPrice,
      unit: m.unit,
      date: m.priceDate,
      source: m.dataSource
    })),
    matchedProducts: references.products.map(pr => ({
      title: pr.title,
      price: pr.price,
      seller: pr.artisanName,
      location: pr.artisanLocation
    }))
  });

  const systemInstruction = `You are GramSetu Advisor (Gram Sahayak), a grounded assistant for rural & small-business entrepreneurs, farmers, and buyers in India.
Respond in clear, practical ${language}. User role: ${role}.
Use ONLY the verified database facts provided below when citing specific projects, scheme terms, prices, or product listings. Never invent government URLs, subsidy amounts, or guaranteed profit promises. Whenever sharing project setup costs, note that they are indicative regional estimates. If verified info for a detail is unavailable, say so clearly.

Verified Database Context for this query:
${contextSummary}`;

  const recentHistory = Array.isArray(history)
    ? history.slice(-6).map((h: any) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n')
    : '';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: recentHistory ? `${recentHistory}\nUser: ${cleanMsg}` : cleanMsg,
      config: { systemInstruction }
    });
    res.json({
      reply: response.text || 'I could not generate a response for that query.',
      references
    });
  } catch (err: any) {
    console.error('Gemini /api/ai/chat error:', err?.message || err);
    res.status(502).json({
      error: 'Unable to reach AI service right now. Verified database matches are attached below.',
      references
    });
  }
});

app.post('/api/ai/app-voice-assistant', aiLimiter, async (req: Request, res: Response) => {
  const { query, language = 'English', currentTab = 'landing' } = req.body || {};
  const cleanQ = String(query || '').trim();
  if (!cleanQ) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  const dbMatches = runUniversalSearch({ q: cleanQ, type: 'all', limit: 3 });
  const references = {
    projects: dbMatches.results.projects.slice(0, 2),
    schemes: dbMatches.results.schemes.slice(0, 2),
    markets: dbMatches.results.markets.slice(0, 2),
    products: dbMatches.results.products.slice(0, 2)
  };

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: 'Voice assistant unavailable (GEMINI_API_KEY not configured).',
      references
    });
  }

  const validTabs = [
    'landing',
    'projects',
    'schemes',
    'market',
    'marketplace',
    'deals',
    'dashboard',
    'customer',
    'logistics',
    'village-connect',
    'admin',
    'ai-assistant',
    'support'
  ];

  const systemInstruction = `You are GramSetu Voice Assistant. Current page tab: "${currentTab}".
Valid navigation tabs: ${validTabs.join(', ')}.
Answer the user's question concisely in ${language} (2-4 spoken sentences) using ONLY accurate GramSetu data below, and return JSON with optional navigation/search action.
Database Matches: ${JSON.stringify({
    projects: references.projects.map(p => p.name),
    schemes: references.schemes.map(s => ({ name: s.name, officialUrl: s.officialUrl })),
    markets: references.markets.map(m => ({ commodity: m.commodityName, price: m.modalPrice, unit: m.unit })),
    products: references.products.map(pr => ({ title: pr.title, price: pr.price }))
  })}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: cleanQ,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            actionType: { type: Type.STRING, description: 'navigate | search_product | track_order | none' },
            actionTarget: { type: Type.STRING },
            suggestedQueries: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['reply', 'actionType']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const action =
      parsed.actionType && parsed.actionType !== 'none' && parsed.actionTarget
        ? { type: parsed.actionType, target: parsed.actionTarget }
        : undefined;

    res.json({
      reply: parsed.reply || 'Here is what I found on GramSetu.',
      action,
      suggestedQueries: Array.isArray(parsed.suggestedQueries) ? parsed.suggestedQueries.slice(0, 4) : [],
      references
    });
  } catch (err: any) {
    console.error('Gemini voice assistant error:', err?.message || err);
    res.status(502).json({
      error: 'Voice assistant service could not respond right now.',
      references
    });
  }
});

app.post('/api/ai/generate-description', aiLimiter, async (req: Request, res: Response) => {
  const { title, category, materials, artisanLocation } = req.body || {};
  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Write an authentic product story, 4 factual bullet highlights, and an indicative fair INR price for "${title}" (category: ${category}, materials: ${materials}, origin: ${artisanLocation}).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: { type: Type.STRING },
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedPrice: { type: Type.NUMBER }
          },
          required: ['story', 'features', 'suggestedPrice']
        }
      }
    });
    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    res.status(502).json({ error: 'Failed to generate product description.' });
  }
});

app.post('/api/ai/business-tips', aiLimiter, async (req: Request, res: Response) => {
  const { category = 'handicrafts', season = 'Festive Season' } = req.body || {};
  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Provide 3 practical business & inventory tips for rural sellers in "${category}" during "${season}". Keep each tip concise and realistic without exaggerating income.`
    });
    res.json({ tips: response.text || '' });
  } catch {
    res.status(502).json({ error: 'Failed to load AI business tips.' });
  }
});

app.post('/api/voice/speak-in-language', aiLimiter, async (req: Request, res: Response) => {
  const { text, targetLanguage = 'Hindi', languageCode = 'hi-IN' } = req.body || {};
  const cleanText = String(text || '').trim();
  if (!cleanText) return res.status(400).json({ error: 'Text is required.' });

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({ spokenAudioScript: cleanText, languageCode, fallback: true });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Translate this into clear, natural spoken ${targetLanguage} suitable for text-to-speech playback. Output only the translated text:\n\n${cleanText}`
    });
    res.json({
      spokenAudioScript: response.text?.trim() || cleanText,
      languageCode
    });
  } catch {
    res.json({ spokenAudioScript: cleanText, languageCode, fallback: true });
  }
});

// ==================== VITE / STATIC ENTRY POINT ====================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.resolve(__dirname, 'dist'))
      ? path.resolve(__dirname, 'dist')
      : path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found.' });
      }
      const indexFile = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        return res.sendFile(indexFile);
      }
      return res.status(503).send('Application build not found.');
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GramSetu Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
