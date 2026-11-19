import React, { useState, useEffect } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Loader2,
  X,
  Info
} from 'lucide-react';
import { MarketPrice } from '../types';

interface MarketPageProps {
  initialSearch?: string;
}

export const MarketPage: React.FC<MarketPageProps> = ({ initialSearch = '' }) => {
  const [markets, setMarkets] = useState<MarketPrice[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceMode, setSourceMode] = useState<'live_api' | 'reference'>('reference');
  const [liveApiConfigured, setLiveApiConfigured] = useState(false);
  const [liveNotice, setLiveNotice] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc'>('relevance');

  useEffect(() => {
    if (initialSearch) {
      setSearchInput(initialSearch);
      setDebouncedQuery(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
    }, 280);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchMarkets(false);
  }, [debouncedQuery, selectedCategory, selectedState, sortBy]);

  const fetchMarkets = async (tryLive: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('/api/markets', window.location.origin);
      if (debouncedQuery) url.searchParams.set('q', debouncedQuery);
      if (selectedCategory !== 'all') url.searchParams.set('category', selectedCategory);
      if (selectedState !== 'all') url.searchParams.set('state', selectedState);
      if (sortBy) url.searchParams.set('sort', sortBy);
      if (tryLive) url.searchParams.set('live', 'true');

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to load market prices');
      const data = await res.json();
      setMarkets(data.markets || []);
      setCategories(data.categories || []);
      setStates(data.states || []);
      setSourceMode(data.sourceMode || 'reference');
      setLiveApiConfigured(Boolean(data.liveApiConfigured));
      setLiveNotice(data.liveNotice || null);
    } catch {
      setError('Unable to load commodity market data right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold text-[#2E7D32] dark:text-[#22C55E]">
            GramSetu Market Intelligence
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
            Commodity & Mandi Market Prices
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Compare indicative wholesale modal prices, minimum-maximum spreads, regional supply conditions, and verified source attributions across Indian markets.
          </p>
        </div>

        <button
          onClick={() => fetchMarkets(liveApiConfigured)}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#2E7D32] text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{liveApiConfigured ? 'Sync Live Agmarknet Feed' : 'Refresh Reference Prices'}</span>
        </button>
      </div>

      {/* Data Transparency Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E] shrink-0 mt-0.5" />
          <div>
            <strong>Source Mode:</strong>{' '}
            {sourceMode === 'live_api'
              ? 'Live Agmarknet API (data.gov.in) active.'
              : 'Verified Regional Reference Dataset (Agmarknet / Spices Board / Cotton Corp benchmark entries).'}
            {liveNotice && <span className="block text-amber-700 dark:text-amber-300 mt-0.5">{liveNotice}</span>}
          </div>
        </div>
        <a
          href="https://agmarknet.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2E7D32] dark:text-[#22C55E] font-semibold hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Agmarknet Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search commodity, variety, mandi, district, or state..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#2E7D32]"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="md:col-span-3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <option value="all">All Commodity Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={selectedState}
          onChange={e => setSelectedState(e.target.value)}
          className="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <option value="all">All States</option>
          {states.map(st => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="md:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <option value="relevance">Relevance</option>
          <option value="price_desc">Modal Price: High to Low</option>
          <option value="price_asc">Modal Price: Low to High</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs text-rose-800 dark:text-rose-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchMarkets(false)}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Market Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-xs text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32] dark:text-[#22C55E]" />
            <span>Loading commodity market prices...</span>
          </div>
        ) : markets.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-2 text-xs">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No market price records matched your filter.
            </p>
            <button
              onClick={() => {
                setSearchInput('');
                setSelectedCategory('all');
                setSelectedState('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Commodity & Variety</th>
                  <th className="py-3.5 px-4">Market / State</th>
                  <th className="py-3.5 px-4 text-right">Min – Max Price</th>
                  <th className="py-3.5 px-4 text-right">Modal Price</th>
                  <th className="py-3.5 px-4 text-right">Change</th>
                  <th className="py-3.5 px-4">Demand / Supply</th>
                  <th className="py-3.5 px-4">Date & Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {markets.map(m => {
                  const diff = m.previousPrice ? m.modalPrice - m.previousPrice : null;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{m.commodityName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {m.variety} · {m.category}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{m.marketName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {m.district ? `${m.district}, ` : ''}{m.state}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                        ₹{m.minPrice.toLocaleString('en-IN')} – ₹{m.maxPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                        <span className="font-bold text-[#2E7D32] dark:text-[#22C55E] text-sm">
                          ₹{m.modalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[10px] text-slate-400">{m.unit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                        {diff === null ? (
                          <span className="text-slate-400 inline-flex items-center gap-1">
                            <Minus className="w-3 h-3" /> —
                          </span>
                        ) : diff > 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> +₹{diff.toLocaleString('en-IN')}
                          </span>
                        ) : diff < 0 ? (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold inline-flex items-center gap-1">
                            <TrendingDown className="w-3.5 h-3.5" /> -₹{Math.abs(diff).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-slate-700 dark:text-slate-300">
                          Demand: <strong>{m.demandLevel}</strong>
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                          Supply: {m.supplyLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="tabular-nums text-slate-700 dark:text-slate-300">{m.priceDate}</div>
                        {m.sourceUrl ? (
                          <a
                            href={m.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#2E7D32] dark:text-[#22C55E] hover:underline inline-flex items-center gap-1"
                          >
                            <span>{m.dataSource}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">{m.dataSource}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
