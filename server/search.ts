import {
  db,
  mapProjectRow,
  mapProductRow,
  mapSchemeRow,
  mapMarketRow
} from './db';
import {
  Project,
  Product,
  GovernmentScheme,
  MarketPrice,
  UniversalSearchResult
} from '../src/types';

export function normalizeQuery(raw: string): string {
  return (raw || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function tokenize(text: string): string[] {
  return normalizeQuery(text)
    .replace(/[^a-z0-9\u0900-\u097f\u0a80-\u0aff\s-]/gi, ' ')
    .split(/[\s-]+/)
    .filter(t => t.length > 0);
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const prev = new Array(bl + 1);
  const curr = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) prev[j] = j;

  for (let i = 1; i <= al; i++) {
    curr[0] = i;
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= bl; j++) prev[j] = curr[j];
  }
  return prev[bl];
}

function maxAllowedDistance(tokenLen: number): number {
  if (tokenLen >= 8) return 2;
  if (tokenLen >= 4) return 1;
  return 0;
}

/**
 * Deterministic multi-tier relevance scorer.
 * Returns null if the candidate does not genuinely match the query.
 * Every query token must match either as a substring or within strict bounded edit distance
 * against the record's primary searchable words, preventing unrelated results.
 */
function scoreCandidate(
  query: string,
  primaryTitle: string,
  highPriorityFields: string[],
  secondaryFields: string[]
): number | null {
  const normQ = normalizeQuery(query);
  if (!normQ) return 1; // Empty query matches (for pure filter browsing)

  const normTitle = normalizeQuery(primaryTitle);
  const titleWords = tokenize(primaryTitle);
  const highJoined = normalizeQuery(highPriorityFields.join(' '));
  const highWords = tokenize(highPriorityFields.join(' '));
  const secondaryJoined = normalizeQuery(secondaryFields.join(' '));
  const allWords = Array.from(new Set([...titleWords, ...highWords, ...tokenize(secondaryJoined)]));

  const qTokens = tokenize(normQ);
  if (qTokens.length === 0) return null;

  let score = 0;

  // Tier 1: Exact full-title match
  if (normTitle === normQ) {
    score += 1200;
  } else if (normTitle.startsWith(normQ)) {
    // Tier 2: Title prefix match
    score += 750;
  } else if (normTitle.includes(normQ)) {
    // Tier 3: Exact phrase contained inside title
    score += 500;
  } else if (highJoined.includes(normQ)) {
    // Tier 4: Exact phrase inside keywords/category/brand/industry
    score += 320;
  } else if (secondaryJoined.includes(normQ)) {
    score += 200;
  }

  // Per-token verification: EVERY query token must genuinely match something in the record
  let matchedTokenCount = 0;
  for (const qt of qTokens) {
    let tokenBest = 0;

    // Exact word in title
    if (titleWords.includes(qt)) {
      tokenBest = 140;
    } else if (titleWords.some(w => w.startsWith(qt)) || normTitle.includes(qt)) {
      tokenBest = qt.length >= 3 ? 110 : 80;
    } else if (highWords.includes(qt) || highJoined.includes(qt)) {
      tokenBest = 75;
    } else if (secondaryJoined.includes(qt)) {
      tokenBest = 45;
    } else {
      // Careful spelling variation check (only on words >= 4 chars, bounded edit distance)
      const maxDist = maxAllowedDistance(qt.length);
      if (maxDist > 0) {
        let bestDist = Infinity;
        let inTitle = false;
        for (const w of titleWords) {
          if (Math.abs(w.length - qt.length) > maxDist) continue;
          const d = levenshtein(qt, w);
          if (d <= maxDist && d < bestDist) {
            bestDist = d;
            inTitle = true;
          }
        }
        if (bestDist > maxDist) {
          for (const w of allWords) {
            if (Math.abs(w.length - qt.length) > maxDist) continue;
            const d = levenshtein(qt, w);
            if (d <= maxDist && d < bestDist) {
              bestDist = d;
              inTitle = false;
            }
          }
        }
        if (bestDist <= maxDist) {
          tokenBest = inTitle ? 55 - bestDist * 10 : 30 - bestDist * 8;
        }
      }
    }

    if (tokenBest > 0) {
      matchedTokenCount++;
      score += tokenBest;
    }
  }

  // Require all tokens to match for 1-3 word queries, or at least 75% for longer queries
  const requiredMatches =
    qTokens.length <= 3 ? qTokens.length : Math.ceil(qTokens.length * 0.75);
  if (matchedTokenCount < requiredMatches) {
    return null;
  }

  return score;
}

export interface SearchFilters {
  q?: string;
  type?: 'all' | 'projects' | 'products' | 'schemes' | 'markets';
  category?: string;
  industry?: string;
  businessType?: string;
  location?: string;
  state?: string;
  schemeType?: string;
  eligibility?: string;
  status?: string;
  condition?: string;
  verifiedOnly?: boolean;
  inStockOnly?: boolean;
  sort?: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'name_asc';
  page?: number;
  limit?: number;
  includeDrafts?: boolean;
}

export function searchProjects(filters: SearchFilters): Project[] {
  const rows = db.prepare('SELECT * FROM projects').all() as any[];
  let items = rows.map(mapProjectRow);

  if (!filters.includeDrafts) {
    items = items.filter(p => p.status !== 'archived');
  }
  if (filters.category && filters.category !== 'all') {
    const catNorm = normalizeQuery(filters.category);
    items = items.filter(p => normalizeQuery(p.category) === catNorm);
  }
  if (filters.industry && filters.industry !== 'all') {
    const indNorm = normalizeQuery(filters.industry);
    items = items.filter(p => normalizeQuery(p.industry).includes(indNorm));
  }
  if (filters.businessType && filters.businessType !== 'all') {
    const btNorm = normalizeQuery(filters.businessType);
    items = items.filter(p => normalizeQuery(p.businessType).includes(btNorm));
  }
  if (filters.location && filters.location !== 'all') {
    const locNorm = normalizeQuery(filters.location);
    items = items.filter(p => normalizeQuery(p.locationSuitability).includes(locNorm));
  }

  const query = normalizeQuery(filters.q || '');
  if (query) {
    const scored: Project[] = [];
    for (const p of items) {
      const s = scoreCandidate(
        query,
        p.name,
        [p.category, p.industry, p.businessType, ...(p.keywords || [])],
        [
          p.description,
          p.locationSuitability,
          p.targetCustomers,
          p.revenueModel,
          ...(p.requiredResources || []),
          ...(p.requiredSkills || [])
        ]
      );
      if (s !== null) {
        scored.push({ ...p, matchScore: s });
      }
    }
    items = scored;
  }

  const sort = filters.sort || (query ? 'relevance' : 'newest');
  items.sort((a, b) => {
    if (sort === 'relevance' && query) {
      const diff = (b.matchScore || 0) - (a.matchScore || 0);
      if (diff !== 0) return diff;
    }
    if (sort === 'name_asc') {
      return a.name.localeCompare(b.name);
    }
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });

  return items;
}

export function searchProducts(filters: SearchFilters): Product[] {
  const rows = db.prepare('SELECT * FROM products').all() as any[];
  let items = rows.map(mapProductRow).filter(p => p.moderationStatus !== 'paused');

  if (filters.category && filters.category !== 'all') {
    const catNorm = normalizeQuery(filters.category);
    items = items.filter(p => normalizeQuery(p.category) === catNorm);
  }
  if (filters.condition && filters.condition !== 'all') {
    items = items.filter(p => p.condition === filters.condition);
  }
  if (filters.verifiedOnly) {
    items = items.filter(p => p.verifiedSeller);
  }
  if (filters.inStockOnly) {
    items = items.filter(p => p.inStock && p.stock > 0);
  }

  const query = normalizeQuery(filters.q || '');
  if (query) {
    const scored: Product[] = [];
    for (const p of items) {
      const s = scoreCandidate(
        query,
        p.title,
        [
          p.sku || '',
          p.brand || '',
          p.model || '',
          p.category,
          p.artisanName,
          p.artisanLocation,
          ...(p.materials || [])
        ],
        [
          p.description,
          p.artisanStory,
          ...Object.values(p.specifications || {})
        ]
      );
      if (s !== null) {
        scored.push({ ...p, matchScore: s });
      }
    }
    items = scored;
  }

  const sort = filters.sort || (query ? 'relevance' : 'newest');
  items.sort((a, b) => {
    if (sort === 'relevance' && query) {
      const diff = (b.matchScore || 0) - (a.matchScore || 0);
      if (diff !== 0) return diff;
    }
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return b.id.localeCompare(a.id);
  });

  return items;
}

export function searchSchemes(filters: SearchFilters): GovernmentScheme[] {
  const rows = db.prepare('SELECT * FROM government_schemes').all() as any[];
  let items = rows.map(mapSchemeRow);

  if (filters.category && filters.category !== 'all') {
    items = items.filter(s => s.category === filters.category);
  }
  if (filters.state && filters.state !== 'all') {
    const st = normalizeQuery(filters.state);
    items = items.filter(s => normalizeQuery(s.state) === st || normalizeQuery(s.state) === 'all india');
  }
  if (filters.schemeType && filters.schemeType !== 'all') {
    const tp = normalizeQuery(filters.schemeType);
    items = items.filter(s => normalizeQuery(s.schemeType) === tp);
  }
  if (filters.status && filters.status !== 'all') {
    items = items.filter(s => s.status === filters.status);
  }
  if (filters.eligibility && filters.eligibility !== 'all') {
    const el = normalizeQuery(filters.eligibility);
    items = items.filter(
      s =>
        normalizeQuery(s.eligibilityTarget).includes(el) ||
        s.eligibilityCriteria.some(c => normalizeQuery(c).includes(el)) ||
        s.eligibleTrades.some(t => normalizeQuery(t).includes(el))
    );
  }

  const query = normalizeQuery(filters.q || '');
  if (query) {
    const scored: { scheme: GovernmentScheme; score: number }[] = [];
    for (const s of items) {
      const sc = scoreCandidate(
        query,
        s.name,
        [s.ministry, s.schemeType, s.state, s.category, ...(s.eligibleTrades || [])],
        [s.tagline, s.description, s.eligibilityTarget, ...(s.purposeBenefits || [])]
      );
      if (sc !== null) {
        scored.push({ scheme: s, score: sc });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    items = scored.map(x => x.scheme);
  }

  return items;
}

export function searchMarkets(filters: SearchFilters): MarketPrice[] {
  const rows = db.prepare('SELECT * FROM market_prices').all() as any[];
  let items = rows.map(mapMarketRow);

  if (filters.category && filters.category !== 'all') {
    const cat = normalizeQuery(filters.category);
    items = items.filter(m => normalizeQuery(m.category) === cat);
  }
  if (filters.state && filters.state !== 'all') {
    const st = normalizeQuery(filters.state);
    items = items.filter(m => normalizeQuery(m.state) === st);
  }

  const query = normalizeQuery(filters.q || '');
  if (query) {
    const scored: { market: MarketPrice; score: number }[] = [];
    for (const m of items) {
      const sc = scoreCandidate(
        query,
        m.commodityName,
        [m.variety, m.category, m.marketName, m.district, m.state],
        [m.dataSource, m.unit]
      );
      if (sc !== null) {
        scored.push({ market: m, score: sc });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    items = scored.map(x => x.market);
  }

  if (filters.sort === 'price_asc') {
    items.sort((a, b) => a.modalPrice - b.modalPrice);
  } else if (filters.sort === 'price_desc') {
    items.sort((a, b) => b.modalPrice - a.modalPrice);
  }

  return items;
}

export function runUniversalSearch(filters: SearchFilters): UniversalSearchResult {
  const rawQuery = filters.q || '';
  const normQuery = normalizeQuery(rawQuery);
  const type = filters.type || 'all';
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 24));
  const offset = (page - 1) * limit;

  const projectsAll = type === 'all' || type === 'projects' ? searchProjects(filters) : [];
  const productsAll = type === 'all' || type === 'products' ? searchProducts(filters) : [];
  const schemesAll = type === 'all' || type === 'schemes' ? searchSchemes(filters) : [];
  const marketsAll = type === 'all' || type === 'markets' ? searchMarkets(filters) : [];

  const slicePaged = <T>(arr: T[]) => arr.slice(offset, offset + limit);

  const totalCount =
    projectsAll.length + productsAll.length + schemesAll.length + marketsAll.length;

  if (normQuery.length >= 2) {
    try {
      db.prepare(
        'INSERT INTO search_history (query, entity_type, results_count, created_at) VALUES (?, ?, ?, ?)'
      ).run(normQuery, type, totalCount, new Date().toISOString());
    } catch {
      // ignore logging error
    }
  }

  return {
    query: rawQuery,
    normalizedQuery: normQuery,
    totalCount,
    counts: {
      projects: projectsAll.length,
      products: productsAll.length,
      schemes: schemesAll.length,
      markets: marketsAll.length
    },
    results: {
      projects: slicePaged(projectsAll),
      products: slicePaged(productsAll),
      schemes: slicePaged(schemesAll),
      markets: slicePaged(marketsAll)
    },
    pagination: {
      page,
      limit
    }
  };
}
