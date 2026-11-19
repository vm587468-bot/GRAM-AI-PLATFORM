import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Users, 
  Plus, 
  Sparkles, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  RefreshCw, 
  Eye, 
  Edit3, 
  Trash2, 
  ChevronRight,
  Loader2,
  X,
  MessageSquare,
  Send,
  Truck,
  Landmark,
  ShieldCheck,
  Check,
  ArrowRight,
  Upload,
  FileText
} from 'lucide-react';
import { Product, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SafeProductImage } from '../components/SafeProductImage';

export const EntrepreneurDashboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { currentUser, token } = useAuth();
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'orders' | 'chats' | 'payouts' | 'inventory' | 'schemes'>('analytics');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [productFormNotice, setProductFormNotice] = useState<string | null>(null);

  // Customer Chats state
  const [customerChats, setCustomerChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Payouts state
  const [payoutsData, setPayoutsData] = useState<any>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawNotice, setWithdrawNotice] = useState<string | null>(null);

  // AI Business Tips state
  const [businessTips, setBusinessTips] = useState<string>('');
  const [tipsLoading, setTipsLoading] = useState(false);

  // Add / Edit Product Modal State (NEVER pre-fill another product's image!)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newSku, setNewSku] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newCondition, setNewCondition] = useState<'new' | 'like_new' | 'good' | 'fair'>('new');
  const [newCategory, setNewCategory] = useState<string>('textiles');
  const [newPrice, setNewPrice] = useState('1200');
  const [newStock, setNewStock] = useState('15');
  const [newUnit, setNewUnit] = useState('piece');
  const [newMaterials, setNewMaterials] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newArtisanStory, setNewArtisanStory] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newExtraImages, setNewExtraImages] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState<'certificate' | 'specification' | 'provenance' | 'care_guide' | 'lab_report'>('certificate');
  const [newDocSummary, setNewDocSummary] = useState('');
  const [verifyingImage, setVerifyingImage] = useState(false);
  const [imageVerifyResult, setImageVerifyResult] = useState<{ valid: boolean; reason: string } | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    fetchAIBusinessTips();
    fetchCustomerChats();
    fetchPayouts();
  }, [currentUser.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const sellerId = currentUser?.role === 'entrepreneur' ? currentUser.id : 'user-artisan-1';
      const [prodRes, orderRes, analRes] = await Promise.all([
        fetch(`/api/products?artisanId=${encodeURIComponent(sellerId)}&limit=100`, { cache: 'no-store' }),
        fetch(`/api/orders?artisanId=${encodeURIComponent(sellerId)}`, { cache: 'no-store' }),
        fetch('/api/analytics/overview', { cache: 'no-store' })
      ]);

      const [prodData, orderData, analData] = await Promise.all([
        prodRes.json(),
        orderRes.json(),
        analRes.json()
      ]);

      setProducts(prodData.products || []);
      setOrders(orderData.orders || []);
      setAnalytics(analData);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerChats = async () => {
    try {
      const res = await fetch('/api/customer-chats?artisanId=user-artisan-1');
      const data = await res.json();
      setCustomerChats(data.chats || []);
      if (data.chats && data.chats.length > 0 && !activeChat) {
        setActiveChat(data.chats[0]);
      }
    } catch (e) {
      console.error('Failed to fetch chats', e);
    }
  };

  const fetchPayouts = async () => {
    try {
      const res = await fetch('/api/payouts');
      const data = await res.json();
      setPayoutsData(data.payouts || null);
    } catch (e) {
      console.error('Failed to fetch payouts', e);
    }
  };

  const handleWithdrawFunds = async () => {
    if (!payoutsData || payoutsData.availableBalance <= 0) return;
    setIsWithdrawing(true);
    setWithdrawNotice(null);
    try {
      const res = await fetch('/api/payouts/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: payoutsData.availableBalance })
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawNotice(`₹${data.payout.amount} instantly transferred via UPI to ${payoutsData.upiVpa}!`);
        setPayoutsData(data.updatedPayouts);
      }
    } catch (e) {
      console.error('Withdraw error', e);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleSendArtisanReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !replyMessage.trim() || sendingReply) return;

    setSendingReply(true);
    try {
      const res = await fetch('/api/customer-chats/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: activeChat.id,
          artisanId: currentUser.id,
          artisanName: currentUser.name,
          text: replyMessage,
          sender: 'artisan'
        })
      });
      const data = await res.json();
      setActiveChat(data.chat);
      setCustomerChats(prev => prev.map(c => c.id === data.chat.id ? data.chat : c));
      setReplyMessage('');
    } catch (e) {
      console.error('Failed to send reply', e);
    } finally {
      setSendingReply(false);
    }
  };

  const fetchAIBusinessTips = async () => {
    setTipsLoading(true);
    try {
      const res = await fetch('/api/ai/business-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'textiles', season: 'Diwali Autumn Festive Season' })
      });
      const data = await res.json();
      setBusinessTips(data.tips || '');
    } catch (err) {
      console.error('Failed to load tips', err);
    } finally {
      setTipsLoading(false);
    }
  };

  const handleAIGenerateDescription = async () => {
    setProductFormNotice(null);
    if (!newTitle.trim()) {
      setProductFormNotice('Please enter a product title first (e.g. Handwoven Khadi Saree).');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          materials: newMaterials,
          artisanLocation: currentUser.location || 'Madhubani, Bihar'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Story generation failed');
      if (data.story) setNewArtisanStory(data.story);
      if (data.features) {
        setNewDescription(data.story + '\n\nKey Highlights:\n• ' + data.features.join('\n• '));
      }
      if (data.suggestedPrice) {
        setNewPrice(String(data.suggestedPrice));
      }
    } catch (err: any) {
      setProductFormNotice(err?.message || 'Unable to generate description right now.');
    } finally {
      setAiGenerating(false);
    }
  };

  const openCreateProductModal = () => {
    setEditingProductId(null);
    setNewSku('');
    setNewTitle('');
    setNewBrand('');
    setNewModel('');
    setNewCondition('new');
    setNewCategory('textiles');
    setNewPrice('1200');
    setNewStock('15');
    setNewUnit('piece');
    setNewMaterials('');
    setNewDescription('');
    setNewArtisanStory('');
    setNewImageUrl('');
    setNewExtraImages('');
    setNewDocTitle('');
    setNewDocType('certificate');
    setNewDocSummary('');
    setImageVerifyResult(null);
    setProductFormNotice(null);
    setIsAddModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setNewSku(prod.sku || '');
    setNewTitle(prod.title || '');
    setNewBrand(prod.brand || '');
    setNewModel(prod.model || '');
    setNewCondition(prod.condition || 'new');
    setNewCategory(prod.category || 'textiles');
    setNewPrice(String(prod.price || ''));
    setNewStock(String(prod.stock ?? 0));
    setNewUnit(prod.unit || 'piece');
    setNewMaterials((prod.materials || []).join(', '));
    setNewDescription(prod.description || '');
    setNewArtisanStory(prod.artisanStory || '');
    setNewImageUrl(prod.imageUrl || '');
    const extras = (prod.images || []).filter(u => u !== prod.imageUrl);
    setNewExtraImages(extras.join('\n'));
    const firstDoc = prod.documents?.[0];
    setNewDocTitle(firstDoc?.title || '');
    setNewDocType(firstDoc?.docType || 'certificate');
    setNewDocSummary(firstDoc?.summary || '');
    setImageVerifyResult(null);
    setProductFormNotice(null);
    setIsAddModalOpen(true);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setImageVerifyResult({ valid: false, reason: 'Please select an image smaller than 1.5 MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setNewImageUrl(reader.result);
        setImageVerifyResult({ valid: true, reason: 'Uploaded product image ready and uniquely linked.' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVerifyImageUrl = async () => {
    setVerifyingImage(true);
    setImageVerifyResult(null);
    try {
      const res = await fetch('/api/products/verify-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: newImageUrl.trim(),
          productId: editingProductId || undefined
        })
      });
      const data = await res.json();
      setImageVerifyResult({
        valid: Boolean(data.valid),
        reason: data.reason || (res.ok ? 'Verified.' : 'Image verification failed.')
      });
    } catch {
      setImageVerifyResult({ valid: false, reason: 'Network error while verifying image URL.' });
    } finally {
      setVerifyingImage(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProduct(true);
    setProductFormNotice(null);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const extraList = newExtraImages
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(Boolean);
      const primaryTrimmed = newImageUrl.trim();
      const gallery = Array.from(new Set(primaryTrimmed ? [primaryTrimmed, ...extraList] : extraList));

      const documentsPayload = newDocTitle.trim()
        ? [
            {
              id: editingProductId ? `doc-${editingProductId}-1` : undefined,
              title: newDocTitle.trim(),
              docType: newDocType,
              issuer: currentUser.shgName || currentUser.name,
              verified: true,
              summary: newDocSummary.trim() || `Verified documentation for ${newTitle.trim()}.`
            }
          ]
        : [];

      const payload: Record<string, any> = {
        sku: newSku.trim() || undefined,
        artisanId: currentUser.id,
        artisanName: `${currentUser.name} (${currentUser.shgName || 'Village SHG'})`,
        artisanLocation: `${currentUser.location}, ${currentUser.state}`,
        title: newTitle.trim(),
        brand: newBrand.trim(),
        model: newModel.trim(),
        condition: newCondition,
        category: newCategory,
        price: Number(newPrice),
        stock: Number(newStock),
        unit: newUnit.trim() || 'piece',
        materials: newMaterials
          .split(',')
          .map(m => m.trim())
          .filter(Boolean),
        description: newDescription.trim() || `${newTitle.trim()} crafted by verified producer.`,
        artisanStory: newArtisanStory.trim() || 'Direct producer unit.',
        imageUrl: primaryTrimmed,
        images: gallery,
        documents: documentsPayload,
        fairTradePercent: 86
      };

      const targetUrl = editingProductId
        ? `/api/products/${encodeURIComponent(editingProductId)}`
        : '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(targetUrl, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product listing.');
      }

      setIsAddModalOpen(false);
      setEditingProductId(null);
      await loadDashboardData();
      setActiveSubTab('inventory');
    } catch (err: any) {
      setProductFormNotice(err?.message || 'Failed to save product.');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setConfirmDeleteId(null);
        await loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, currentStatus: string) => {
    const nextStatusMap: Record<string, string> = {
      placed: 'packed',
      packed: 'dispatched',
      dispatched: 'out_for_delivery',
      out_for_delivery: 'delivered'
    };
    const nextStatus = nextStatusMap[currentStatus];
    if (!nextStatus) return;

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ orderStatus: nextStatus })
      });
      loadDashboardData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      
      {/* Top Welcome Bar */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 border border-[#2D5A27]/15 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#2D5A27] shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D5A27] dark:bg-emerald-600 text-white">
                Verified SHG Lead
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentUser.shgName || 'Ganga Weaver Self Help Group'} · {currentUser.location}, {currentUser.state}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 font-medium">
              <span>Direct Bank VPA: <strong className="font-mono text-[#2D5A27] dark:text-emerald-400">{payoutsData?.upiVpa || 'radhadevi@sbi'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E6B325] dark:text-amber-300" />
            <span>{t.addProduct}</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className="px-4 py-2.5 rounded-xl bg-[#E6B325]/20 hover:bg-[#E6B325]/30 text-[#2D5A27] dark:text-amber-300 border border-[#E6B325]/40 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#2D5A27] dark:text-amber-300" />
            <span>{t.voiceAdvisor}</span>
          </button>
        </div>
      </div>

      {/* 7 Core Capabilities Status Strip */}
      <div className="bg-[#2D5A27]/5 dark:bg-slate-800/60 border border-[#2D5A27]/20 dark:border-slate-700 p-3.5 rounded-2xl flex items-center gap-3 overflow-x-auto scrollbar-none text-xs">
        <span className="font-bold text-[#2D5A27] dark:text-emerald-400 shrink-0 uppercase tracking-wider text-[10px]">
          {t.appName} Features:
        </span>
        <div className="flex items-center gap-4 shrink-0 font-medium text-slate-700 dark:text-slate-200">
          <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27] dark:text-emerald-400" />
            <span>{t.addProduct}</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27] dark:text-emerald-400" />
            <span>{t.upiPayment}</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27] dark:text-emerald-400" />
            <span>{t.trackConsignment}</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27] dark:text-emerald-400" />
            <span>{t.buyerEnquiries}</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27] dark:text-emerald-400" />
            <span>{t.dashboardAnalytics}</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27] dark:text-emerald-400" />
            <span>{t.navDeals}</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27] dark:text-emerald-400" />
            <span>{t.voiceAdvisor}</span>
          </span>
        </div>
      </div>

      {/* Main Sub-Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'analytics'
              ? 'bg-[#2D5A27] dark:bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t.dashboardAnalytics}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'orders'
              ? 'bg-[#2D5A27] dark:bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{t.dashboardOrders} ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('chats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
            activeSubTab === 'chats'
              ? 'bg-[#2D5A27] dark:bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.buyerEnquiries}</span>
          {customerChats.some(c => c.unreadByArtisan > 0) && (
            <span className="w-2 h-2 rounded-full bg-[#E6B325]" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('payouts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'payouts'
              ? 'bg-[#2D5A27] dark:bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{t.payoutAccount}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'inventory'
              ? 'bg-[#2D5A27] dark:bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.dashboardInventory} ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schemes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'schemes'
              ? 'bg-[#2D5A27] dark:bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Landmark className="w-4 h-4 text-[#C69516]" />
          <span>{t.navSchemes}</span>
        </button>
      </div>

      {/* ================= TAB 1: BUSINESS ANALYTICS ================= */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t.totalSalesRevenue}</span>
                <span className="p-1.5 rounded-lg bg-[#2D5A27]/10 dark:bg-emerald-950/60 text-[#2D5A27] dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold font-serif text-[#2D5A27] dark:text-emerald-400">
                ₹{analytics?.kpis?.totalSales?.toLocaleString('en-IN') || '2,84,500'}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>+24.5%</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">vs previous month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t.directCustomerOrders}</span>
                <span className="p-1.5 rounded-lg bg-[#E6B325]/20 dark:bg-amber-950/60 text-[#C69516] dark:text-amber-300">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                {analytics?.kpis?.totalOrders || 186}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>12 ready for postal dispatch</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t.activePatrons}</span>
                <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                {analytics?.kpis?.activeCustomers || 142}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span>71% repeat purchase rate</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t.fairProducerCut}</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold font-serif text-emerald-800 dark:text-emerald-300">
                86.4%
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <span>Zero broker deductions</span>
              </div>
            </div>
          </div>

          {/* AI Daily Market Tips Card */}
          <div className="bg-gradient-to-r from-[#2D5A27] to-[#1E3D1A] text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E6B325] text-[#2C2C2C] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{t.dailyMarketIntelligence}</h3>
                  <p className="text-[11px] text-white/70">Real-time demand intelligence tailored for your village craft category</p>
                </div>
              </div>

              <button
                onClick={fetchAIBusinessTips}
                disabled={tipsLoading}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${tipsLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{t.refreshInsights}</span>
              </button>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 text-xs leading-relaxed text-white/95 whitespace-pre-line border border-white/10">
              {tipsLoading ? (
                <div className="flex items-center gap-2 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-[#E6B325]" />
                  <span>Analyzing metro consumer trends for handmade textiles...</span>
                </div>
              ) : (
                businessTips || "1. High demand for festive gifting bundles in Delhi & Bangalore. Package Madhubani dupattas with handmade greeting cards.\n2. Use sunlight between 9 AM and 11 AM for crisp product photos.\n3. Keep 20 extra units packed in biodegradable banana fibre sleeves for urgent express dispatches."
              )}
            </div>
          </div>

          {/* Analytics Charts & Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Monthly Revenue Growth (Apr - Sep 2026)</h3>
                  <p className="text-xs text-slate-500">Direct earnings credited to SHG bank account</p>
                </div>
                <span className="text-xs font-bold text-[#2D5A27] bg-[#2D5A27]/10 px-2.5 py-1 rounded-lg">
                  +139% Growth
                </span>
              </div>

              {/* SVG Bar Chart */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                {analytics?.monthlyReports?.map((report: any) => {
                  const maxRev = 75000;
                  const heightPercent = Math.round((report.revenue / maxRev) * 100);
                  return (
                    <div key={report.month} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[10px] font-semibold text-[#2D5A27] opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{(report.revenue / 1000).toFixed(1)}k
                      </div>
                      <div 
                        className="w-full max-w-[48px] bg-[#2D5A27]/85 hover:bg-[#2D5A27] rounded-t-xl transition-all relative"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#E6B325]" />
                      </div>
                      <span className="text-xs font-medium text-slate-600 mt-1">{report.month}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Average Order Value: <strong>₹{analytics?.kpis?.averageOrderValue || '1,530'}</strong></span>
                <span>Postal Dispatch Relay Time: <strong>1.4 Days</strong></span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Revenue by Craft Category</h3>
                <p className="text-xs text-slate-500">Top earning rural crafts</p>
              </div>

              <div className="space-y-3 pt-2">
                {analytics?.categoryPerformance?.map((cat: any, i: number) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-medium truncate max-w-[170px]">{cat.name}</span>
                      <span className="font-bold text-[#2D5A27]">{cat.share}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${i % 2 === 0 ? 'bg-[#2D5A27]' : 'bg-[#E6B325]'}`}
                        style={{ width: `${cat.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TRACK DELIVERIES & ORDER FULFILLMENT ================= */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{t.ordersTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.ordersSubtitle}</p>
              </div>
              <button
                onClick={() => setActiveTab('logistics')}
                className="px-3.5 py-1.5 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-[#1E3D1A] flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Truck className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>{t.trackConsignment}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                    <th className="pb-3">{t.orderConsignment}</th>
                    <th className="pb-3">{t.roleCustomer.split('/')[0]}</th>
                    <th className="pb-3">{t.shipmentContents}</th>
                    <th className="pb-3">{t.totalAmount}</th>
                    <th className="pb-3">{t.accountStatus}</th>
                    <th className="pb-3 text-right">{t.advanceStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{order.id}</div>
                        <div className="font-mono text-[11px] text-[#2D5A27] dark:text-emerald-400 font-bold">{order.trackingId}</div>
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{order.customerName}</div>
                        <div className="text-[10px] text-slate-400">{order.customerPhone}</div>
                      </td>
                      <td className="py-3">
                        <div className="max-w-[180px] truncate text-slate-700 dark:text-slate-300 font-medium">
                          {order.items.map(it => `${it.quantity}x ${it.title}`).join(', ')}
                        </div>
                      </td>
                      <td className="py-3 font-serif font-bold text-slate-900 dark:text-white">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                          order.orderStatus === 'out_for_delivery' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                          order.orderStatus === 'dispatched' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' :
                          order.orderStatus === 'packed' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                          'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        }`}>
                          {order.orderStatus === 'delivered' ? t.deliveredSuccess : order.orderStatus === 'out_for_delivery' ? t.outForDeliveryStatus : order.orderStatus === 'dispatched' ? t.inTransit : order.orderStatus === 'packed' ? t.markPacked : order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {order.orderStatus !== 'delivered' ? (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, order.orderStatus)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#2D5A27] hover:bg-[#1E3D1A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors shadow-xs cursor-pointer"
                          >
                            {order.orderStatus === 'placed' ? t.markPacked :
                             order.orderStatus === 'packed' ? t.handoverToHub :
                             order.orderStatus === 'dispatched' ? t.outForDeliveryStatus :
                             t.markDelivered}
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.deliveredAndSettled}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CHAT WITH CUSTOMERS ================= */}
      {activeSubTab === 'chats' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{t.directInquiries}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Communicate directly with buyers about custom weaves, bulk orders, and delivery dates</p>
              </div>
              <span className="text-xs font-semibold text-[#2D5A27] dark:text-emerald-400 bg-[#2D5A27]/10 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                {customerChats.length} {t.activeConversations}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Chat Thread Selector (Left 4 cols) */}
              <div className="md:col-span-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">
                  {t.buyerEnquiries}:
                </span>
                {customerChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center ${
                      activeChat?.id === chat.id
                        ? 'bg-[#2D5A27]/10 dark:bg-emerald-950/50 border-[#2D5A27] dark:border-emerald-500 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <img src={chat.customerAvatar} alt={chat.customerName} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white truncate">{chat.customerName}</span>
                        {chat.unreadByArtisan > 0 && (
                          <span className="w-2 h-2 rounded-full bg-[#E6B325]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{chat.productTitle}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Chat Messages and Reply Form (Right 8 cols) */}
              <div className="md:col-span-8 bg-[#F8F5F0] dark:bg-slate-800/60 rounded-2xl p-4 border border-[#2D5A27]/15 dark:border-slate-700 flex flex-col h-[400px]">
                {activeChat ? (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-700 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={activeChat.customerAvatar} alt={activeChat.customerName} className="w-7 h-7 rounded-lg object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{activeChat.customerName}</span>
                          <span className="text-slate-400 text-[10px] ml-2">{activeChat.productTitle}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        {t.verifiedBuyerBadge}
                      </span>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto py-3 space-y-2 text-xs">
                      {activeChat.messages.map((m: any, idx: number) => {
                        const isMe = m.sender === 'artisan';
                        return (
                          <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                              isMe ? 'bg-[#2D5A27] dark:bg-emerald-600 text-white shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xs'
                            }`}>
                              <div className="flex items-center justify-between text-[10px] opacity-70 mb-1">
                                <span className="font-semibold">{isMe ? `You (${currentUser.name})` : activeChat.customerName}</span>
                                <span>{m.time}</span>
                              </div>
                              <p>{m.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reply Input */}
                    <form onSubmit={handleSendArtisanReply} className="flex gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder={`${t.typeReplyPlaceholder} (${activeChat.customerName})`}
                        className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2D5A27]"
                      />
                      <button
                        type="submit"
                        disabled={!replyMessage.trim() || sendingReply}
                        className="px-4 py-2 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs disabled:opacity-40 transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>{t.sendReplyBtn}</span>
                        <Send className="w-3.5 h-3.5 text-[#E6B325]" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                    {t.typeReplyPlaceholder}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: RECEIVE PAYMENTS & UPI LEDGER ================= */}
      {activeSubTab === 'payouts' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{t.availableBalance}</span>
              <div className="text-2xl font-bold font-serif text-[#2D5A27] dark:text-emerald-400">
                ₹{payoutsData?.availableBalance?.toLocaleString('en-IN') || '14,850'}
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">{t.readyForInstantUpi}</p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{t.pendingEscrowLabel}</span>
              <div className="text-2xl font-bold font-serif text-amber-700 dark:text-amber-400">
                ₹{payoutsData?.pendingEscrow?.toLocaleString('en-IN') || '3,700'}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.releasesUponScan}</p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{t.lifetimeDirectEarnings}</span>
              <div className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                ₹{payoutsData?.totalLifetimeEarned?.toLocaleString('en-IN') || '2,84,500'}
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">{t.producerMarginZeroCommission}</p>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{payoutsData?.bankName || 'State Bank of India (Rural Branch)'}</h3>
                  <p className="text-xs text-slate-500 font-mono">A/C: {payoutsData?.accountNumberMasked || '•••• •••• 4019'} · UPI: {payoutsData?.upiVpa || 'sunitadevi@sbi'}</p>
                </div>
              </div>

              <button
                onClick={handleWithdrawFunds}
                disabled={isWithdrawing || !payoutsData?.availableBalance}
                className="px-6 py-3 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E6B325]" />
                    <span>Processing UPI Transfer...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-[#E6B325]" />
                    <span>Withdraw ₹{payoutsData?.availableBalance?.toLocaleString('en-IN') || '14,850'} to UPI</span>
                  </>
                )}
              </button>
            </div>

            {withdrawNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{withdrawNotice}</span>
              </div>
            )}
          </div>

          {/* Settlement History Table */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.recentBankUpiSettlements}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                    <th className="pb-2">Reference ID</th>
                    <th className="pb-2">{t.orderDate}</th>
                    <th className="pb-2">{t.upiPayment}</th>
                    <th className="pb-2">Bank Reference</th>
                    <th className="pb-2">{t.accountStatus}</th>
                    <th className="pb-2 text-right">{t.totalAmount} (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payoutsData?.recentPayouts?.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{p.id}</td>
                      <td className="py-2.5 text-slate-500">{p.date}</td>
                      <td className="py-2.5 text-slate-700 dark:text-slate-300">{p.method}</td>
                      <td className="py-2.5 font-mono text-slate-500 text-[11px]">{p.bankRef}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-serif font-bold text-base text-[#2D5A27] dark:text-emerald-400">
                        ₹{p.amount?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: SELL PRODUCTS & INVENTORY ================= */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.sellProductsManageStock}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.sellProductsSubtitle}</p>
              </div>
              <button
                onClick={openCreateProductModal}
                className="px-3.5 py-1.5 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-[#1E3D1A] flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addProduct}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-[#F8F5F0]/40 dark:bg-slate-800/50 flex flex-col gap-3">
                  <div className="flex gap-3 items-center">
                    <SafeProductImage
                      src={prod.imageUrl}
                      alt={prod.title}
                      updatedAt={prod.updatedAt}
                      compact
                      containerClassName="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                      className="w-full h-full object-cover"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{prod.title}</h4>
                      {prod.sku && (
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                          SKU: {prod.sku}
                        </div>
                      )}
                      <div className="text-[#2D5A27] dark:text-emerald-400 font-serif font-bold text-sm">₹{prod.price}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>Stock: <strong>{prod.stock} {prod.unit}s</strong></span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">86% Fair Cut</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                    <button
                      type="button"
                      onClick={() => openEditProductModal(prod)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2D5A27] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Listing &amp; Image</span>
                    </button>

                    {confirmDeleteId === prod.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(prod.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: GOVT SCHEMES & LOANS ================= */}
      {activeSubTab === 'schemes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#2D5A27]" />
                  <span>Government Schemes, Working Capital & Subsidies</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Subsidized credit programs and toolkit grants pre-approved for your rural enterprise.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('schemes')}
                className="px-4 py-2 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-[#1E3D1A] flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <span>Full Schemes Explorer & EMI Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E6B325]" />
              </button>
            </div>

            {/* Pre-Approved Application Status */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#E6B325]" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">PM Vishwakarma Yojana (Ref: APP-VISHWA-8421)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Disbursal Ready
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Beneficiary: <strong>Vedant Mishra</strong> · Trade: <strong>Handloom Textiles & Rural Craft</strong>
                  </p>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Sanctioned: ₹3,00,000 @ 5% subsidized interest · ₹15,000 Toolkit E-Voucher allocated
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Nodal Branch</span>
                <span className="text-xs font-bold text-slate-800">Varanasi Central Gramin Bank #104</span>
              </div>
            </div>

            {/* Quick Loan Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl border border-slate-200 bg-[#F8F5F0]/50 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#2D5A27]">PMMY MUDRA Loan</span>
                  <span className="text-emerald-700 font-semibold">0 Collateral</span>
                </div>
                <div className="text-xl font-serif font-bold text-slate-900">Up to ₹20,00,000</div>
                <p className="text-[11px] text-slate-500">Working capital for stock, raw yarn, sports goods, and grains.</p>
                <button
                  onClick={() => setActiveTab('schemes')}
                  className="text-xs font-bold text-[#2D5A27] flex items-center gap-1 hover:underline pt-1 cursor-pointer"
                >
                  <span>Apply with 1-click</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-[#F8F5F0]/50 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#2D5A27]">PMEGP Capital Subsidy</span>
                  <span className="text-[#C69516] font-semibold">35% Govt Grant</span>
                </div>
                <div className="text-xl font-serif font-bold text-slate-900">Up to ₹50,00,000</div>
                <p className="text-[11px] text-slate-500">Non-repayable direct cash grant up to ₹17.5 Lakh for production setups.</p>
                <button
                  onClick={() => setActiveTab('schemes')}
                  className="text-xs font-bold text-[#2D5A27] flex items-center gap-1 hover:underline pt-1 cursor-pointer"
                >
                  <span>Apply with 1-click</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-[#F8F5F0]/50 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#2D5A27]">NABARD SHG Credit</span>
                  <span className="text-emerald-700 font-semibold">4% Interest</span>
                </div>
                <div className="text-xl font-serif font-bold text-slate-900">₹2L - ₹10,00,000</div>
                <p className="text-[11px] text-slate-500">Peer micro-credit for Self-Help Groups with prompt repayment rebate.</p>
                <button
                  onClick={() => setActiveTab('schemes')}
                  className="text-xs font-bold text-[#2D5A27] flex items-center gap-1 hover:underline pt-1 cursor-pointer"
                >
                  <span>Apply with 1-click</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add / Edit Product Modal with Verified Image & Document Binding */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#2D5A27]/20 dark:border-slate-700 text-[#2C2C2C] dark:text-slate-100">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold">
                  {editingProductId ? <Edit3 className="w-4 h-4" /> : '+'}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {editingProductId ? 'Edit Product, Image & Documents' : t.uploadNewProduct}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Each product requires a unique SKU and its own verified photo (or leave photo blank for Image Not Available)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 pt-4 text-xs">
              {productFormNotice && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 font-medium">
                  {productFormNotice}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.productTitleLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t.productNamePlaceholder}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unique SKU Code
                  </label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                    placeholder="Auto-generated if blank"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.brandLabel}
                  </label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="Producer / Brand"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.modelLabel}
                  </label>
                  <input
                    type="text"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="Model / Variant"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.condition}
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#2D5A27]"
                  >
                    <option value="new">{t.conditionNew}</option>
                    <option value="like_new">{t.conditionLikeNew}</option>
                    <option value="good">{t.conditionGood}</option>
                    <option value="fair">{t.conditionFair}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.allCategories}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#2D5A27]"
                  >
                    <option value="textiles">{t.catTextiles}</option>
                    <option value="clothes">{t.catClothes}</option>
                    <option value="sports">{t.catSports}</option>
                    <option value="ration">{t.catRation}</option>
                    <option value="spices">{t.catSpices}</option>
                    <option value="pottery">{t.catPottery}</option>
                    <option value="honey_oils">{t.catHoneyOils}</option>
                    <option value="bamboo_wood">{t.catBambooWood}</option>
                    <option value="handicrafts">{t.catHandicrafts}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.directFairPrice} (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.stockQuantity}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.sellingUnit}
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="piece, 500g pack, pot, 1L bottle"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              {/* Dedicated Verified Product Image Box */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Product Photo Verification (Matched Exclusively to This Listing)
                  </span>
                  <label className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-[#2D5A27] dark:text-emerald-400 hover:border-[#2D5A27] flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <SafeProductImage
                    src={newImageUrl}
                    alt={newTitle || 'Product preview'}
                    containerClassName="w-24 h-24 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                    className="w-full h-full object-cover"
                  />

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => {
                          setNewImageUrl(e.target.value);
                          setImageVerifyResult(null);
                        }}
                        placeholder="Paste direct HTTPS product photo URL or leave blank for Image Not Available"
                        className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#2D5A27]"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyImageUrl}
                        disabled={verifyingImage}
                        className="px-3 py-2 rounded-xl bg-[#2D5A27] text-white font-semibold text-[11px] hover:bg-[#1E3D1A] cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {verifyingImage ? 'Checking...' : 'Verify Image'}
                      </button>
                    </div>

                    {imageVerifyResult && (
                      <div
                        className={`p-2 rounded-xl text-[11px] font-medium flex items-center gap-1.5 ${
                          imageVerifyResult.valid
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{imageVerifyResult.reason}</span>
                      </div>
                    )}

                    <textarea
                      rows={2}
                      value={newExtraImages}
                      onChange={(e) => setNewExtraImages(e.target.value)}
                      placeholder="Optional additional angle photo URLs (one per line)"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[11px] focus:outline-none focus:border-[#2D5A27]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.materialsIngredients}
                </label>
                <input
                  type="text"
                  value={newMaterials}
                  onChange={(e) => setNewMaterials(e.target.value)}
                  placeholder="Pure Silk, Indigo, Kashmir Willow, Bamboo"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#2D5A27]"
                />
              </div>

              {/* Description & Story Helper */}
              <div className="bg-[#E6B325]/15 dark:bg-amber-950/40 border border-[#E6B325]/30 dark:border-amber-700/40 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-[#2D5A27] dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C69516]" />
                    <span>{t.aiStoryteller}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">
                    Generate authentic producer story, highlights &amp; fair pricing with 1 click.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAIGenerateDescription}
                  disabled={aiGenerating}
                  className="px-3 py-1.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#E6B325]" />
                      <span>{t.generateWithAi}</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.specifications}
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe your product details, size, and care instructions..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#2D5A27]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.artisanStoryTitle}
                </label>
                <textarea
                  rows={2}
                  value={newArtisanStory}
                  onChange={(e) => setNewArtisanStory(e.target.value)}
                  placeholder="Who made this? Share how this product supports your family or village SHG..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#2D5A27]"
                />
              </div>

              {/* Product Document Binding */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                  <FileText className="w-3.5 h-3.5 text-[#2D5A27] dark:text-emerald-400" />
                  <span>Attached Product Document / Quality Certificate (Optional)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="Document title (e.g. Lab Purity Report)"
                    className="sm:col-span-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as any)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value="certificate">Certificate</option>
                    <option value="specification">Specification</option>
                    <option value="provenance">Provenance</option>
                    <option value="lab_report">Lab Report</option>
                    <option value="care_guide">Care Guide</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={newDocSummary}
                  onChange={(e) => setNewDocSummary(e.target.value)}
                  placeholder="Brief verified summary bound exclusively to this product ID"
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="px-5 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#E6B325]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingProductId ? 'Save Changes' : t.publishProductBtn}</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
