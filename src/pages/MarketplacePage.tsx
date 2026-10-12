import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  ShoppingBag, 
  ShieldCheck, 
  X, 
  Check, 
  Heart, 
  ChevronRight, 
  Sparkles, 
  Loader2, 
  ArrowRight,
  MessageCircle,
  Scale,
  Flag,
  ThumbsUp,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Award,
  RefreshCw,
  Send
} from 'lucide-react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../i18n';
import { ProductImageGallery } from '../components/ProductImageGallery';

interface MarketplacePageProps {
  onOpenCheckout: () => void;
  currentLang?: SupportedLanguage;
  externalSearch?: string;
  setActiveTab?: (tab: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ 
  onOpenCheckout,
  externalSearch = '',
  setActiveTab
}) => {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(externalSearch);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  // Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review Submission State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [durabilityRating, setDurabilityRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [sellerRating, setSellerRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhoto, setReviewPhoto] = useState<string | null>(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewNotice, setReviewNotice] = useState<string | null>(null);

  // Comparison State (Up to 3 products)
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Seller Contact Message Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [contactSentNotice, setContactSentNotice] = useState<string | null>(null);

  // Suspicious Listing Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSending, setReportSending] = useState(false);
  const [reportSentNotice, setReportSentNotice] = useState<string | null>(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gramai_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (externalSearch) {
      setSearchQuery(externalSearch);
    }
  }, [externalSearch]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, selectedCondition, verifiedOnly, inStockOnly, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/products', window.location.origin);
      if (selectedCategory !== 'all') url.searchParams.set('category', selectedCategory);
      if (searchQuery.trim()) url.searchParams.set('search', searchQuery.trim());
      if (selectedCondition !== 'all') url.searchParams.set('condition', selectedCondition);
      if (verifiedOnly) url.searchParams.set('verifiedOnly', 'true');
      if (inStockOnly) url.searchParams.set('inStockOnly', 'true');
      if (sortBy) url.searchParams.set('sort', sortBy);

      const res = await fetch(url.toString());
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const openProductModal = async (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${product.id}`);
      const data = await res.json();
      setProductReviews(data.reviews || []);
    } catch (err) {
      console.error('Failed to load product reviews', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = (product: Product, qty: number) => {
    addToCart(product, qty);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('gramai_wishlist', JSON.stringify(next));
      return next;
    });
  };

  // Comparison toggle
  const toggleComparison = (product: Product) => {
    setComparisonList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 products side-by-side.');
        return prev;
      }
      return [...prev, product];
    });
  };

  // Review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setReviewSubmitting(true);
    setReviewNotice(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          userId: 'user-customer-1',
          userName: 'Arjun Sharma',
          rating: reviewRating,
          qualityRating,
          durabilityRating,
          valueForMoneyRating: valueRating,
          sellerExperienceRating: sellerRating,
          comment: reviewComment,
          reviewImages: reviewPhoto ? [reviewPhoto] : []
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setProductReviews(prev => [data.review, ...prev]);
      setReviewNotice('Thank you! Your verified review has been published.');
      setReviewComment('');
      setReviewPhoto(null);
      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewNotice(null);
      }, 2000);
    } catch (err: any) {
      setReviewNotice(err.message || 'Error submitting review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReviewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHelpfulReview = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setProductReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulCount: data.helpfulCount } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportReview = async (reviewId: string) => {
    const reason = prompt('Please specify why this review is suspicious or inaccurate:');
    if (!reason) return;
    try {
      await fetch(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      alert('Thank you. The review has been reported for moderation.');
    } catch (err) {
      console.error(err);
    }
  };

  // Seller Messaging
  const handleSendMessageToSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !contactMessage.trim()) return;
    setContactSending(true);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productTitle: selectedProduct.title,
          senderId: 'user-customer-1',
          senderName: 'Arjun Sharma',
          senderRole: 'customer',
          recipientId: selectedProduct.artisanId,
          recipientName: selectedProduct.artisanName,
          text: contactMessage
        })
      });

      setContactSentNotice(`Message sent directly to ${selectedProduct.artisanName}!`);
      setContactMessage('');
      setTimeout(() => {
        setIsContactModalOpen(false);
        setContactSentNotice(null);
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setContactSending(false);
    }
  };

  // Report Suspicious Listing
  const handleReportListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !reportReason.trim()) return;
    setReportSending(true);

    try {
      await fetch(`/api/products/${selectedProduct.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason })
      });

      setReportSentNotice('Listing reported. Admin team will audit authenticity within 24 hours.');
      setReportReason('');
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSentNotice(null);
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setReportSending(false);
    }
  };

  const categories = [
    { id: 'all', label: t.allCategories },
    { id: 'clothes', label: t.catClothes },
    { id: 'sports', label: t.catSports },
    { id: 'ration', label: t.catRation },
    { id: 'textiles', label: t.catTextiles },
    { id: 'spices', label: t.catSpices },
    { id: 'pottery', label: t.catPottery },
    { id: 'honey_oils', label: t.catHoneyOils },
    { id: 'bamboo_wood', label: t.catBambooWood },
    { id: 'handicrafts', label: t.catHandicrafts }
  ];

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner Notice for Deals & Direct Commerce */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.verifiedQualityBadge} · {t.authenticVillageProvenance}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            {t.marketplaceTitle}
          </h1>
          <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
            {t.marketplaceSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab && setActiveTab('deals')}
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{t.navDeals}</span>
          </button>
        </div>
      </div>

      {/* Search & Comprehensive Filters Panel */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-10 py-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-[#2E7D32] dark:focus:border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Condition, Verified Seller, In-Stock, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Condition Select */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500 dark:text-slate-400">{t.filterByCondition}:</span>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">{t.all}</option>
                <option value="new">{t.conditionNew}</option>
                <option value="like_new">{t.conditionLikeNew}</option>
                <option value="good">{t.conditionGood}</option>
                <option value="fair">{t.conditionFair}</option>
              </select>
            </div>

            {/* Verified Seller Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#2E7D32] focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {t.verifiedSellersOnly}
              </span>
            </label>

            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#2E7D32] focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {t.inStockOnly}
              </span>
            </label>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400">{t.sortBy}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="price_asc">{t.sortPriceAsc}</option>
              <option value="price_desc">{t.sortPriceDesc}</option>
              <option value="rating">{t.sortRating}</option>
            </select>

            {(searchQuery || selectedCategory !== 'all' || selectedCondition !== 'all' || verifiedOnly || inStockOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCondition('all');
                  setVerifiedOnly(false);
                  setInStockOnly(false);
                  setSortBy('newest');
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold text-xs ml-2 cursor-pointer"
              >
                {t.clearFilters}
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Comparison Floating Bar (if products selected) */}
      {comparisonList.length > 0 && (
        <div className="sticky top-20 z-30 bg-white dark:bg-[#1E293B] p-4 rounded-2xl shadow-xl border-2 border-[#2E7D32] dark:border-emerald-500 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-[#2E7D32] dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                {comparisonList.length} {t.compareTitle}
              </span>
              <span className="text-[11px] text-slate-500">
                {t.compareSubtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white font-bold text-xs hover:bg-[#1B5E20] transition-colors cursor-pointer shadow-xs"
            >
              {t.compareSideBySide}
            </button>
            <button
              onClick={() => setComparisonList([])}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 cursor-pointer"
              title={t.clearComparison}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>
          {t.showingProductsCount}: {products.length}
        </span>
        <span>
          {t.fairTradeShareNotice}
        </span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 animate-pulse">
              <div className="aspect-square bg-slate-200 dark:bg-slate-700/60 rounded-2xl" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded-lg w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-lg w-1/2" />
              <div className="h-10 bg-slate-200 dark:bg-slate-700/60 rounded-xl" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            {t.noProductsMatch}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {t.noProductsSubtext}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isCompared = comparisonList.some(p => p.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Product Image Gallery with Zoom */}
                <div className="relative">
                  <ProductImageGallery
                    images={product.images}
                    primaryImageUrl={product.imageUrl}
                    title={product.title}
                    aspectRatio="aspect-square"
                  />

                  {/* Condition Tag */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-xs text-white font-bold text-[10px] uppercase tracking-wider">
                      {product.condition === 'new' ? t.conditionNew : product.condition === 'like_new' ? t.conditionLikeNew : product.condition === 'good' ? t.conditionGood : t.conditionFair}
                    </span>
                    {product.dealBadge && (
                      <span className="px-2 py-0.5 rounded-lg bg-rose-600 text-white font-bold text-[10px]">
                        {product.dealBadge}
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-md"
                    title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-[#2E7D32] dark:text-[#22C55E]" />
                      <span>{product.artisanLocation}</span>
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating} ({product.reviewsCount})</span>
                    </span>
                  </div>

                  <h3 
                    onClick={() => openProductModal(product)}
                    className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug cursor-pointer hover:text-[#2E7D32] dark:hover:text-[#22C55E] transition-colors"
                  >
                    {product.title}
                  </h3>

                  {product.brand && (
                    <p className="text-[11px] text-slate-500 font-medium">
                      {product.brand} {product.model ? `· ${product.model}` : ''}
                    </p>
                  )}

                  {/* Price Row */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-bold font-serif text-[#2E7D32] dark:text-[#22C55E]">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-normal">
                      / {product.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {product.sellerVerificationBadge || t.verifiedArtisan}
                    </span>
                    {product.authenticityStatus === 'verified' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {t.authenticityGuaranteed}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddToCart(product, 1)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </button>

                    <button
                      onClick={() => handleBuyNow(product)}
                      className="py-2.5 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>{t.buyNow}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <button
                      onClick={() => openProductModal(product)}
                      className="text-[#2E7D32] dark:text-[#22C55E] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <span>{t.viewDetails}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleComparison(product)}
                      className={`flex items-center gap-1 font-semibold cursor-pointer ${
                        isCompared ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'Compared' : t.compareProduct}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ==================== PRODUCT DETAIL MODAL ==================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 relative text-slate-800 dark:text-slate-100">
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Gallery with Zoom & Multi-Photo View */}
              <div>
                <ProductImageGallery
                  images={selectedProduct.images}
                  primaryImageUrl={selectedProduct.imageUrl}
                  title={selectedProduct.title}
                  aspectRatio="aspect-square"
                />
              </div>

              {/* Right Summary Info */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      {selectedProduct.sellerVerificationBadge || t.verifiedArtisan}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                      {t.filterByCondition}: {selectedProduct.condition === 'new' ? t.conditionNew : selectedProduct.condition === 'like_new' ? t.conditionLikeNew : selectedProduct.condition === 'good' ? t.conditionGood : t.conditionFair}
                    </span>
                  </div>

                  <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white leading-snug">
                    {selectedProduct.title}
                  </h2>

                  {selectedProduct.brand && (
                    <p className="text-xs text-slate-500">
                      {t.brandLabel}: <strong className="text-slate-700 dark:text-slate-300">{selectedProduct.brand}</strong> · {t.modelLabel}: {selectedProduct.model || 'Standard'}
                    </p>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{selectedProduct.rating}</span>
                  </div>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 font-medium">{productReviews.length} {t.verifiedReviewsCount}</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl font-bold font-serif text-[#2E7D32] dark:text-[#22C55E]">
                    ₹{selectedProduct.price}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{selectedProduct.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-slate-500">
                    / {selectedProduct.unit}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Fair Trade Box */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.fairTradeShareNotice}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400">
                    {t.directEscrowNotice}
                  </p>
                </div>

                {/* Quantity & Buy Actions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Quantity:</span>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-xs font-bold text-slate-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      ({selectedProduct.stock} units available)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAddToCart(selectedProduct, quantity)}
                      className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t.addToCart}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct, quantity);
                        setSelectedProduct(null);
                        if (onOpenCheckout) onOpenCheckout();
                      }}
                      className="py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>{t.buyNow}</span>
                    </button>
                  </div>

                  {addedNotice && (
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center animate-fadeIn">
                      Added {quantity} unit(s) to your cart!
                    </div>
                  )}
                </div>

                {/* Direct Action Links: Contact Seller & Report */}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="flex items-center gap-1.5 text-[#2E7D32] dark:text-[#22C55E] font-bold hover:underline cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.contactSeller}</span>
                  </button>

                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{t.reportListing}</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Specifications & Policies Accordion / Cards */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                {t.specifications} & Quality Trust
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Specs Table */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                    Product Parameters
                  </span>
                  <div className="divide-y divide-slate-200/60 dark:divide-slate-800">
                    {selectedProduct.specifications && Object.entries(selectedProduct.specifications).map(([k, v]) => (
                      <div key={k} className="py-1.5 flex justify-between gap-2">
                        <span className="text-slate-500">{k}:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{v}</span>
                      </div>
                    ))}
                    <div className="py-1.5 flex justify-between gap-2">
                      <span className="text-slate-500">Materials:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{selectedProduct.materials.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Policies & Warranty */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                    Warranty & Return Assurance
                  </span>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">{t.warranty}:</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      {selectedProduct.warranty || '1 Year Artisan Guild Craft Guarantee'}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">{t.returnPolicy}:</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      {selectedProduct.returnPolicy || '7 Days Return via India Post Rural Relay'}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">{t.defectsNotice}:</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      {selectedProduct.defectsNotice || 'Inspected 100% Defect-Free Quality by cluster lead.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Artisan Story */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs space-y-1.5">
              <span className="font-bold font-serif text-sm text-amber-950 dark:text-amber-300 block">
                {t.artisanStoryTitle}
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedProduct.artisanStory}
              </p>
            </div>

            {/* Customer Reviews Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                    {t.productReviews}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real, verified customer feedback with quality breakdowns
                  </p>
                </div>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white font-bold text-xs hover:bg-[#1B5E20] transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  {t.writeReview}
                </button>
              </div>

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="py-6 flex items-center justify-center text-xs text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Loading reviews...</span>
                </div>
              ) : productReviews.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 text-center text-xs text-slate-500">
                  {t.noReviewsYet}
                </div>
              ) : (
                <div className="space-y-4">
                  {productReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {review.userName}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                              <span>{review.date}</span>
                              {review.verifiedPurchase && (
                                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>{t.verifiedBuyer}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Criteria Scores Strip */}
                      {(review.qualityRating || review.durabilityRating || review.valueForMoneyRating) && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                          <div>
                            <span className="text-slate-400 block">{t.qualityRating}</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{review.qualityRating || review.rating}/5</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">{t.durabilityRating}</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{review.durabilityRating || review.rating}/5</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">{t.valueRating}</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{review.valueForMoneyRating || review.rating}/5</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">{t.sellerRating}</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{review.sellerExperienceRating || review.rating}/5</span>
                          </div>
                        </div>
                      )}

                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {review.comment}
                      </p>

                      {/* Customer Uploaded Photo */}
                      {review.reviewImages && review.reviewImages.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          {review.reviewImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Review attachment"
                              className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                            />
                          ))}
                        </div>
                      )}

                      {/* Artisan Reply */}
                      {review.artisanReply && (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                          <span className="font-bold text-[11px] text-emerald-900 dark:text-emerald-300">
                            Reply from Artisan ({selectedProduct.artisanName}):
                          </span>
                          <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                            {review.artisanReply}
                          </p>
                        </div>
                      )}

                      {/* Footer Actions: Helpful & Report */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                        <button
                          onClick={() => handleHelpfulReview(review.id)}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{t.markHelpful} ({review.helpfulCount || 0})</span>
                        </button>

                        <button
                          onClick={() => handleReportReview(review.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          {t.reportReview}
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==================== WRITE REVIEW MODAL ==================== */}
      {isReviewModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 relative text-slate-800 dark:text-slate-100">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                {t.writeReview}
              </h3>
              <p className="text-xs text-slate-500">
                Reviewing: <strong>{selectedProduct.title}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Rating Criteria Sliders / Stars */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{t.overallRating}:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="cursor-pointer text-amber-400"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">{t.qualityRating}:</span>
                  <select
                    value={qualityRating}
                    onChange={(e) => setQualityRating(Number(e.target.value))}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{t.durabilityRating}:</span>
                  <select
                    value={durabilityRating}
                    onChange={(e) => setDurabilityRating(Number(e.target.value))}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{t.valueRating}:</span>
                  <select
                    value={valueRating}
                    onChange={(e) => setValueRating(Number(e.target.value))}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{t.sellerRating}:</span>
                  <select
                    value={sellerRating}
                    onChange={(e) => setSellerRating(Number(e.target.value))}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Written Feedback:
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={t.reviewPlaceholder}
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  {t.uploadReviewPhoto}:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReviewPhotoUpload}
                    className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-slate-100 dark:file:bg-slate-800 file:font-semibold cursor-pointer"
                  />
                  {reviewPhoto && (
                    <img src={reviewPhoto} alt="Upload preview" className="w-10 h-10 rounded-lg object-cover" />
                  )}
                </div>
              </div>

              {reviewNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-xs">
                  {reviewNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={reviewSubmitting || !reviewComment.trim()}
                className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-md"
              >
                {reviewSubmitting ? 'Submitting...' : t.submitReview}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CONTACT SELLER MODAL ==================== */}
      {isContactModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 relative text-slate-800 dark:text-slate-100">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                {t.contactSeller}
              </h3>
              <p className="text-xs text-slate-500">
                To: <strong>{selectedProduct.artisanName}</strong> · {t.messageSellerDesc}
              </p>
            </div>

            <form onSubmit={handleSendMessageToSeller} className="space-y-3 text-xs">
              <textarea
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Ask about customization, bulk orders, dispatch dates, or material provenance..."
                required
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
              />

              {contactSentNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold">
                  {contactSentNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={contactSending || !contactMessage.trim()}
                className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{contactSending ? 'Sending...' : t.sendDirectMessage}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== REPORT LISTING MODAL ==================== */}
      {isReportModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 relative text-slate-800 dark:text-slate-100">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{t.reportListing}</span>
              </div>
              <p className="text-xs text-slate-500">
                Flag suspicious or counterfeit listing: <strong>{selectedProduct.title}</strong>
              </p>
            </div>

            <form onSubmit={handleReportListing} className="space-y-3 text-xs">
              <textarea
                rows={4}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder={t.reportReasonPlaceholder}
                required
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
              />

              {reportSentNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold">
                  {reportSentNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={reportSending || !reportReason.trim()}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                {reportSending ? 'Reporting...' : t.submitReportBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== PRODUCT COMPARISON MODAL ==================== */}
      {isComparisonOpen && comparisonList.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative text-slate-800 dark:text-slate-100">
            <button
              onClick={() => setIsComparisonOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
                {t.compareTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.compareSubtitle}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 font-bold text-slate-400 uppercase tracking-wider text-[10px] w-1/4">
                      {t.featureTitle}
                    </th>
                    {comparisonList.map(p => (
                      <th key={p.id} className="p-3 font-bold text-slate-900 dark:text-white w-1/4">
                        <div className="space-y-2">
                          <img src={p.imageUrl} alt={p.title} className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
                          <div className="font-bold line-clamp-2">{p.title}</div>
                          <div className="text-emerald-700 dark:text-emerald-400 font-serif text-sm">₹{p.price}</div>
                          <button
                            onClick={() => toggleComparison(p)}
                            className="text-[10px] text-rose-600 hover:underline cursor-pointer block"
                          >
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-bold text-slate-500">{t.brandModel}</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {p.brand || 'Artisan Guild'} {p.model ? `· ${p.model}` : ''}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">{t.condition}</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-3 capitalize font-semibold">
                        {p.condition}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">{t.customerRatingCol}</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-3 font-bold text-amber-600">
                        ★ {p.rating} ({p.reviewsCount})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">{t.originVillage}</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-3">
                        {p.artisanLocation}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">{t.materialsUsed}</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-3">
                        {p.materials.join(', ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">{t.warrantyGuaranteed}</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-3">
                        {p.warranty || '1 Year Craft Warranty'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">{t.actionCol}</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-3">
                        <button
                          onClick={() => {
                            addToCart(p, 1);
                            setIsComparisonOpen(false);
                          }}
                          className="py-1.5 px-3 rounded-lg bg-[#2E7D32] text-white font-bold text-[11px] cursor-pointer"
                        >
                          {t.addToCart}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
