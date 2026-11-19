import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Loader2,
  FolderKanban,
  ShoppingBag,
  Landmark,
  TrendingUp,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { UniversalSearchResult, Project, Product, GovernmentScheme, MarketPrice } from '../types';
import { SafeProductImage } from './SafeProductImage';

interface GlobalSearchBarProps {
  onSelectProject: (projectId: string) => void;
  onSelectProduct: (productId: string) => void;
  onSelectScheme: (schemeName: string) => void;
  onSelectMarket: (commodityName: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onSelectProject,
  onSelectProduct,
  onSelectScheme,
  onSelectMarket,
  placeholder = 'Search any project, product, govt scheme, or market commodity...',
  compact = false
}) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<UniversalSearchResult | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&limit=5`,
          { signal: controller.signal, cache: 'no-store' }
        );
        if (!res.ok) {
          throw new Error('Search service returned an error.');
        }
        const data = (await res.json()) as UniversalSearchResult;
        setResults(data);
        setOpen(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError('Unable to complete search right now. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setError(null);
    setOpen(false);
  };

  const hasResults = Boolean(results && results.totalCount > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search className={`text-slate-400 absolute left-3.5 pointer-events-none ${compact ? 'w-4 h-4' : 'w-4.5 h-4.5'}`} />
        <input
          type="text"
          value={query}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Universal Search"
          className={`w-full pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#22C55E] transition-colors ${
            compact ? 'py-2 text-xs' : 'py-3 text-sm shadow-sm'
          }`}
        />
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#2E7D32] dark:text-[#22C55E] absolute right-3.5" />
        ) : (
          query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 max-h-[75vh] overflow-y-auto p-3 space-y-3">
          {error ? (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : loading && !results ? (
            <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Searching GramSetu database...
            </div>
          ) : !hasResults ? (
            <div className="py-6 px-4 text-center space-y-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No matching records found for "{query.trim()}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try another project name, commodity, product title, category, or scheme keyword.
              </p>
            </div>
          ) : (
            results && (
              <>
                <div className="px-2 py-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <span>
                    {results.totalCount} verified result{results.totalCount === 1 ? '' : 's'} for "{results.normalizedQuery}"
                  </span>
                  <span className="tabular-nums">
                    {results.counts.projects} Projects · {results.counts.products} Products · {results.counts.schemes} Schemes · {results.counts.markets} Markets
                  </span>
                </div>

                {/* Projects Group */}
                {results.results.projects.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 text-[11px] font-bold text-[#2E7D32] dark:text-[#22C55E] flex items-center gap-1.5">
                      <FolderKanban className="w-3.5 h-3.5" />
                      <span>Projects ({results.counts.projects})</span>
                    </div>
                    {results.results.projects.map((proj: Project) => (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          onSelectProject(proj.id);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <SafeProductImage
                            src={proj.imageUrl}
                            alt={proj.name}
                            allowProjectImages
                            compact
                            containerClassName="w-10 h-10 rounded-lg shrink-0"
                            className="w-full h-full object-cover"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {proj.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              Project · {proj.industry} · {proj.requiredInvestment}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Products Group */}
                {results.results.products.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Marketplace Products ({results.counts.products})</span>
                    </div>
                    {results.results.products.map((prod: Product) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          onSelectProduct(prod.id);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <SafeProductImage
                            src={prod.imageUrl}
                            alt={prod.title}
                            updatedAt={prod.updatedAt}
                            compact
                            containerClassName="w-10 h-10 rounded-lg shrink-0"
                            className="w-full h-full object-cover"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {prod.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate tabular-nums">
                              Product · ₹{prod.price.toLocaleString('en-IN')} · {prod.artisanName}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Schemes Group */}
                {results.results.schemes.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Government Schemes ({results.counts.schemes})</span>
                    </div>
                    {results.results.schemes.map((sch: GovernmentScheme) => (
                      <button
                        key={sch.id}
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          onSelectScheme(sch.name);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {sch.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {sch.ministry} · {sch.state} · Status: {sch.status}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Market Commodities Group */}
                {results.results.markets.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 text-[11px] font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Market Prices ({results.counts.markets})</span>
                    </div>
                    {results.results.markets.map((mkt: MarketPrice) => (
                      <button
                        key={mkt.id}
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          onSelectMarket(mkt.commodityName);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {mkt.commodityName} ({mkt.variety})
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate tabular-nums">
                            {mkt.marketName}, {mkt.state} · ₹{mkt.modalPrice.toLocaleString('en-IN')} {mkt.unit}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};
