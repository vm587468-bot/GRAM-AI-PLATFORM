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
  Info,
  Sparkles,
  Loader2,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { SupportedLanguage } from '../i18n';

interface MarketplacePageProps {
  onOpenCheckout: () => void;
  currentLang: SupportedLanguage;
  externalSearch?: string;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ 
  onOpenCheckout,
  externalSearch = ''
}) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(externalSearch);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Dynamic Sourcing State
  const [customSourcingInput, setCustomSourcingInput] = useState('');
  const [isSourcing, setIsSourcing] = useState(false);
  const [sourcingNotice, setSourcingNotice] = useState<string | null>(null);

  useEffect(() => {
    if (externalSearch) {
      setSearchQuery(externalSearch);
    }
  }, [externalSearch]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/products', window.location.origin);
      if (selectedCategory !== 'all') url.searchParams.set('category', selectedCategory);
      if (searchQuery.trim()) url.searchParams.set('search', searchQuery.trim());

      const res = await fetch(url.toString());
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  // Discover & Source ANY Product on-demand via Gemini backend
  const handleDiscoverAnyProduct = async (queryText?: string) => {
    const targetQuery = (queryText || customSourcingInput || searchQuery).trim();
    if (!targetQuery) return;

    setIsSourcing(true);
    setSourcingNotice(`Sourcing authentic village producers for "${targetQuery}"...`);

    try {
      const res = await fetch('/api/products/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: targetQuery,
          categoryHint: selectedCategory !== 'all' ? selectedCategory : undefined
        })
      });

      const data = await res.json();
      if (data.product) {
        setSourcingNotice(`Discovered & verified: "${data.product.title}"`);
        setProducts(prev => {
          const filtered = prev.filter(p => p.id !== data.product.id);
          return [data.product, ...filtered];
        });
        setCustomSourcingInput('');
        // Open the newly generated/sourced product modal directly
        openProductModal(data.product);
      }
    } catch (err) {
      console.error('Failed to discover product', err);
      setSourcingNotice('Failed to source product. Please try another name.');
    } finally {
      setIsSourcing(false);
      setTimeout(() => setSourcingNotice(null), 4000);
    }
  };

  const openProductModal = async (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`);
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

  const categories = [
    { id: 'all', label: 'All Village Goods' },
    { id: 'textiles', label: 'Handloom Textiles' },
    { id: 'spices', label: 'Organic Spices & Saffron' },
    { id: 'pottery', label: 'Terracotta & Blue Pottery' },
    { id: 'honey_oils', label: 'Raw Honey & Oils' },
    { id: 'bamboo_wood', label: 'Wood, Leather & Crafts' },
  ];

  const quickIdeas = [
    'Kashmiri Mongra Saffron',
    'Jaipur Blue Pottery Floral Vase',
    'Kolhapuri Leather Chappals',
    'Coorg Arabica Coffee',
    'Bastar Bell Metal Figurine',
    'Kalamkari Cotton Saree',
    'Mysore Sandalwood Soap',
    'Terracotta Clay Water Bottle'
  ];

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      
      {/* Header Banner with On-Demand Sourcing Badge */}
      <div className="bg-[#2D5A27] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E6B325]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>On-Demand Rural Sourcing · Any Product in India</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            See & Buy Any Authentic Village Product You Want.
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Search our curated GI-certified inventory, or type *anything you desire* — from Kashmiri Saffron to Jaipur Blue Pottery. Our AI copilot will source authentic village producers in real-time.
          </p>
        </div>
      </div>

      {/* On-Demand AI Product Sourcing Tool */}
      <div className="bg-gradient-to-r from-[#E6B325]/15 via-white to-[#F8F5F0] p-5 rounded-3xl border border-[#E6B325]/40 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E6B325] text-[#2C2C2C] flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[#2D5A27]">
                Want to see ANY product? Source anything from rural India on-demand:
              </h3>
              <p className="text-[11px] text-slate-500">
                Type any item (e.g. Kolhapuri chappals, Warli painting, clay water jug, pure sandalwood) to add it instantly to the catalog.
              </p>
            </div>
          </div>

          {sourcingNotice && (
            <span className="text-xs font-semibold text-[#2D5A27] bg-[#2D5A27]/10 px-3 py-1 rounded-lg animate-pulse">
              {sourcingNotice}
            </span>
          )}
        </div>

        {/* Dynamic Sourcing Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDiscoverAnyProduct();
          }}
          className="flex flex-col sm:flex-row gap-2 pt-1"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={customSourcingInput}
              onChange={(e) => setCustomSourcingInput(e.target.value)}
              placeholder="Type ANY product name here (e.g., Mysore Sandalwood Oil, Assam Muga Silk, Clay Tawa)..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:border-[#2D5A27] shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!customSourcingInput.trim() || isSourcing}
            className="px-5 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSourcing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E6B325]" />
                <span>Sourcing from Village...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E6B325]" />
                <span>Source with Gram AI</span>
              </>
            )}
          </button>
        </form>

        {/* Sample One-Click Ideas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 text-[11px]">
          <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0">Try Sourcing:</span>
          {quickIdeas.map((idea, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCustomSourcingInput(idea);
                handleDiscoverAnyProduct(idea);
              }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#2D5A27]/10 hover:text-[#2D5A27] text-slate-700 border border-slate-200 whitespace-nowrap transition-colors cursor-pointer"
            >
              + {idea}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, artisan, materials or state..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2D5A27]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center text-xs text-slate-500">
            <span>Showing: <strong>{products.length}</strong> live products in store</span>
          </div>
        </div>

        {/* Category Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2D5A27] text-white shadow-xs font-semibold'
                  : 'bg-[#F8F5F0] text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zero Results / Dynamic Sourcing Fallback */}
      {products.length === 0 && !loading && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#E6B325]/20 text-[#2D5A27] mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
              "{searchQuery}" is not currently in the local catalog
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
              Would you like Gram AI to source and add <strong>"{searchQuery}"</strong> directly from verified Indian village artisan clusters?
            </p>
          </div>

          <button
            onClick={() => handleDiscoverAnyProduct(searchQuery)}
            disabled={isSourcing}
            className="px-6 py-3 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs sm:text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSourcing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E6B325]" />
                <span>Sourcing "{searchQuery}" with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E6B325]" />
                <span>Source "{searchQuery}" Now</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
              <div className="w-full h-48 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#2D5A27]/40 transition-all flex flex-col justify-between group"
            >
              {/* Product Image */}
              <div 
                className="relative h-52 overflow-hidden bg-slate-100 cursor-pointer" 
                onClick={() => openProductModal(product)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Fair-Trade Direct Impact Strip */}
                <div className="absolute top-2.5 left-2.5 bg-[#2D5A27]/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                  {product.fairTradePercent}% direct to artisan
                </div>

                <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E6B325]" />
                  <span className="truncate max-w-[170px]">{product.artisanLocation}</span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="truncate max-w-[150px] font-medium text-[#2D5A27]">
                      {product.artisanName}
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                    </span>
                  </div>

                  <h3 
                    onClick={() => openProductModal(product)}
                    className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-[#2D5A27] cursor-pointer"
                  >
                    {product.title}
                  </h3>
                </div>

                {/* Price and Add button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-[#2D5A27] font-serif">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">per {product.unit}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product, 1)}
                    className="p-2 rounded-xl bg-[#2D5A27] text-white hover:bg-[#1E3D1A] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Add to cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#E6B325]" />
                    <span className="text-xs font-semibold px-0.5">Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#2D5A27]/20 p-6 sm:p-8 text-[#2C2C2C]">
            
            {/* Close Button */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#2D5A27]" />
                <span className="font-semibold text-slate-800">{selectedProduct.artisanLocation}</span>
                <span>·</span>
                <span>Verified Rural Artisan Cluster</span>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Product Visual */}
              <div className="space-y-3">
                <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="bg-[#F8F5F0] p-3.5 rounded-xl border border-[#2D5A27]/15 space-y-1.5 text-xs">
                  <div className="font-semibold text-[#2D5A27] flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
                    <span>Fair-Trade Escrow Breakdown</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    <strong>{selectedProduct.fairTradePercent}% (₹{Math.round(selectedProduct.price * (selectedProduct.fairTradePercent / 100))})</strong> goes directly to {selectedProduct.artisanName}. Only 3% covers rural postal aggregation.
                  </p>
                </div>
              </div>

              {/* Product Info & Action */}
              <div className="space-y-4 flex flex-col justify-between text-xs">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#C69516]">
                      {selectedProduct.category.toUpperCase()}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 mt-0.5">
                      {selectedProduct.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{selectedProduct.rating}</span>
                      </div>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600">{selectedProduct.reviewsCount} verified reviews</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#2D5A27] font-serif">
                      ₹{selectedProduct.price}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{selectedProduct.originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">/ {selectedProduct.unit}</span>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-800">Description</h4>
                    <p className="text-slate-600 leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  {/* Artisan Provenance Story */}
                  <div className="bg-[#2D5A27]/5 p-3 rounded-xl border border-[#2D5A27]/20 space-y-1">
                    <h4 className="font-semibold text-[#2D5A27]">
                      Artisan Heritage Story
                    </h4>
                    <p className="text-slate-700 italic text-[11px] leading-relaxed">
                      "{selectedProduct.artisanStory}"
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium pt-1">
                      Crafted by {selectedProduct.artisanName}
                    </p>
                  </div>

                  {/* Materials */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1.5">Materials & Ingredients:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.materials.map((mat, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Purchase Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 font-semibold text-xs text-slate-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct, quantity);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#E6B325]" />
                      <span>Add to Direct Cart (₹{selectedProduct.price * quantity})</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-slate-400">
                    Dispatched from {selectedProduct.artisanLocation} via India Post / Gram Express Relay
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Reviews Section in Modal */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 mb-3">
                Verified Customer Reviews ({productReviews.length})
              </h3>
              {reviewsLoading ? (
                <div className="text-xs text-slate-400">Loading authentic feedback...</div>
              ) : productReviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No customer reviews yet. Be the first to order and review!</p>
              ) : (
                <div className="space-y-3">
                  {productReviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-[#F8F5F0] rounded-xl border border-slate-200/60 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rev.userAvatar} alt={rev.userName} className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-semibold text-slate-800">{rev.userName}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-medium">
                            Verified Buyer
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500 text-[10px]">
                        {'★'.repeat(rev.rating)}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
                      {rev.artisanReply && (
                        <div className="mt-2 pl-3 border-l-2 border-[#2D5A27] text-[11px] text-[#2D5A27] bg-white p-2 rounded">
                          <strong>Artisan reply:</strong> {rev.artisanReply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
