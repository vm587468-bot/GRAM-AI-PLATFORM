import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  Filter, 
  Percent, 
  ShoppingBag, 
  Landmark, 
  ArrowRight,
  TrendingUp,
  Heart,
  Bell
} from 'lucide-react';
import { DealOffer, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { GovernmentSchemesSection } from '../components/GovernmentSchemesSection';
import { ProductImageGallery } from '../components/ProductImageGallery';

interface DealsAndSchemesPageProps {
  setActiveTab: (tab: string) => void;
  onOpenCheckout?: () => void;
}

export const DealsAndSchemesPage: React.FC<DealsAndSchemesPageProps> = ({
  setActiveTab,
  onOpenCheckout
}) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const [deals, setDeals] = useState<DealOffer[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [discountFilter, setDiscountFilter] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gramai_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [priceDropAlertSet, setPriceDropAlertSet] = useState<string | null>(null);

  useEffect(() => {
    fetchDealsAndProducts();
  }, []);

  const fetchDealsAndProducts = async () => {
    setLoading(true);
    try {
      const [dealsRes, productsRes] = await Promise.all([
        fetch('/api/deals'),
        fetch('/api/products')
      ]);

      const dealsData = await dealsRes.json();
      const productsData = await productsRes.json();

      // Filter out expired offers automatically
      const now = new Date();
      const validDeals = (dealsData.deals || []).filter((d: DealOffer) => {
        if (!d.validUntil) return true;
        return new Date(d.validUntil) >= now;
      });

      setDeals(validDeals);
      // Products with dealBadge or discounts
      const discounted = (productsData.products || []).filter(
        (p: Product) => p.originalPrice && p.originalPrice > p.price
      );
      setDealProducts(discounted);
    } catch (err) {
      console.error('Failed to load deals', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('gramai_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const handleSetPriceDropAlert = (productId: string) => {
    setPriceDropAlertSet(productId);
    setTimeout(() => setPriceDropAlertSet(null), 3000);
  };

  const filteredDeals = deals.filter(d => {
    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesDisc = discountFilter === 0 || d.discountPercentage >= discountFilter;
    return matchesCat && matchesDisc;
  });

  const filteredProducts = dealProducts.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const discountPct = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    const matchesDisc = discountFilter === 0 || discountPct >= discountFilter;
    return matchesCat && matchesDisc;
  });

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-12 animate-fadeIn">
      {/* Top Festive Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#B8860B] text-white p-6 sm:p-10 shadow-xl border border-white/10">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-amber-300 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.dealsBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight">
            {t.dealsTitle}
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
            {t.dealsSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.verifiedDealsOnly}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
              <Percent className="w-4 h-4 text-amber-300" />
              <span>{t.featuredDealsBadge}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {t.filter}:
            </span>
          </div>

          {/* Discount Range Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { label: t.discountFilterAll, val: 0 },
              { label: t.discount20, val: 20 },
              { label: t.discount30, val: 30 },
              { label: t.discount50, val: 50 }
            ].map(pill => (
              <button
                key={pill.val}
                onClick={() => setDiscountFilter(pill.val)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  discountFilter === pill.val
                    ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
          {[
            { id: 'all', label: t.allCategories },
            { id: 'clothes', label: t.catClothes },
            { id: 'sports', label: t.catSports },
            { id: 'ration', label: t.catRation },
            { id: 'pottery', label: t.catPottery },
            { id: 'honey_oils', label: t.catHoneyOils },
            { id: 'bamboo_wood', label: t.catBambooWood }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Active Verified Coupons Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-white">
              {t.dealsTitle}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {t.copyCoupon}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDeals.map(deal => (
            <div
              key={deal.id}
              className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 border-2 border-dashed border-amber-300 dark:border-amber-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    {deal.discountPercentage}% OFF
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{t.validUntil} {deal.validUntil}</span>
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {deal.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {deal.description}
                </p>
                <div className="text-[11px] text-slate-500 font-medium">
                  {t.minOrderLabel}: ₹{deal.minOrderValue}
                </div>
              </div>

              {/* Coupon Copy Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleCopyCode(deal.couponCode)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    copiedCode === deal.couponCode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }`}
                >
                  {copiedCode === deal.couponCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.couponCopied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-mono tracking-wider">{deal.couponCode}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Discounted Products Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-white">
              {t.featuredDealsTitle}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="text-xs font-bold text-[#2E7D32] dark:text-[#22C55E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t.exploreMarketplace}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const savings = (product.originalPrice || product.price) - product.price;
            const discountPct = product.originalPrice 
              ? Math.round((savings / product.originalPrice) * 100) 
              : 0;

            const isWishlisted = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
              >
                {/* Product Image Gallery with Zoom */}
                <div className="relative">
                  <ProductImageGallery
                    images={product.images}
                    primaryImageUrl={product.imageUrl}
                    title={product.title}
                    aspectRatio="aspect-4/3"
                  />

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md">
                    {discountPct}% OFF
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-md"
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{product.artisanLocation}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{product.unit}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {product.title}
                  </h3>

                  {/* Price Breakdown */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-bold font-serif text-[#2E7D32] dark:text-[#22C55E]">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      {t.savingsLabel}: ₹{savings}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </button>

                    <button
                      onClick={() => handleSetPriceDropAlert(product.id)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:border-amber-400 transition-colors cursor-pointer"
                      title="Set Price-Drop Alert"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>

                  {priceDropAlertSet === product.id && (
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold text-center animate-fadeIn">
                      {t.priceDropAlertActive}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Subsidized Government Schemes Section (Embedded) */}
      <div id="govt-schemes-embed" className="space-y-4 pt-6">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-[#2E7D32] dark:text-[#22C55E]" />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
            {t.schemesHeroTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {t.schemesHeroSubtitle}
        </p>

        <GovernmentSchemesSection currentLang={language} />
      </div>

    </div>
  );
};
