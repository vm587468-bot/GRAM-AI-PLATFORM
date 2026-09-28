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
  ArrowRight
} from 'lucide-react';
import { Product, Order } from '../types';
import { useAuth } from '../context/AuthContext';

export const EntrepreneurDashboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'orders' | 'chats' | 'payouts' | 'inventory'>('analytics');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  // New Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'textiles' | 'spices' | 'pottery' | 'honey_oils' | 'bamboo_wood'>('textiles');
  const [newPrice, setNewPrice] = useState('1200');
  const [newStock, setNewStock] = useState('15');
  const [newUnit, setNewUnit] = useState('piece');
  const [newMaterials, setNewMaterials] = useState('Hand-spun cotton, Natural herbal dye');
  const [newDescription, setNewDescription] = useState('');
  const [newArtisanStory, setNewArtisanStory] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  useEffect(() => {
    loadDashboardData();
    fetchAIBusinessTips();
    fetchCustomerChats();
    fetchPayouts();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, analRes] = await Promise.all([
        fetch('/api/products?artisanId=user-artisan-1'),
        fetch('/api/orders?artisanId=user-artisan-1'),
        fetch('/api/analytics/overview')
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

  // Generate description using Gemini 3.8 Flash on server
  const handleAIGenerateDescription = async () => {
    if (!newTitle.trim()) {
      alert('Please enter a product title first (e.g. Handwoven Khadi Saree)');
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
      if (data.story) setNewArtisanStory(data.story);
      if (data.features) {
        setNewDescription(data.story + '\n\nKey Highlights:\n• ' + data.features.join('\n• '));
      }
      if (data.suggestedPrice) {
        setNewPrice(String(data.suggestedPrice));
      }
    } catch (err) {
      console.error('AI generation failed', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artisanId: currentUser.id,
          artisanName: `${currentUser.name} (${currentUser.shgName || 'Village SHG'})`,
          artisanLocation: `${currentUser.location}, ${currentUser.state}`,
          title: newTitle,
          category: newCategory,
          price: Number(newPrice),
          stock: Number(newStock),
          unit: newUnit,
          materials: newMaterials.split(',').map(m => m.trim()),
          description: newDescription || `${newTitle} handcrafted with traditional generational skills.`,
          artisanStory: newArtisanStory || 'Directly crafted in our village cluster with love.',
          imageUrl: newImageUrl,
          fairTradePercent: 86
        })
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        // Reset form
        setNewTitle('');
        setNewDescription('');
        setNewArtisanStory('');
        loadDashboardData();
        setActiveSubTab('inventory');
      }
    } catch (err) {
      console.error('Failed to create product', err);
    } finally {
      setSubmittingProduct(false);
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
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D5A27]/15 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#2D5A27] shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {currentUser.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D5A27] text-white">
                Verified SHG Lead
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser.shgName || 'Mishra Rural Guild & Tech Labs'} · {currentUser.location}, {currentUser.state}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1.5 font-medium">
              <span>Direct Bank VPA: <strong className="font-mono text-[#2D5A27]">{payoutsData?.upiVpa || 'vedantmishra@sbi'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E6B325]" />
            <span>Sell New Product</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className="px-4 py-2.5 rounded-xl bg-[#E6B325]/20 hover:bg-[#E6B325]/30 text-[#2D5A27] border border-[#E6B325]/40 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#2D5A27]" />
            <span>Voice Advisor</span>
          </button>
        </div>
      </div>

      {/* 7 Core Capabilities Status Strip */}
      <div className="bg-[#2D5A27]/5 border border-[#2D5A27]/20 p-3.5 rounded-2xl flex items-center gap-3 overflow-x-auto scrollbar-none text-xs">
        <span className="font-bold text-[#2D5A27] shrink-0 uppercase tracking-wider text-[10px]">
          All Active Features:
        </span>
        <div className="flex items-center gap-4 shrink-0 font-medium text-slate-700">
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Sell Products</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Receive Payments (UPI)</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Track Deliveries</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Chat with Customers</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Business Analytics</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Tutorials Hub</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Voice Support</span>
          </span>
        </div>
      </div>

      {/* Main Sub-Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'analytics'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Business Analytics</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'orders'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Track Deliveries ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('chats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
            activeSubTab === 'chats'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat with Customers</span>
          {customerChats.some(c => c.unreadByArtisan > 0) && (
            <span className="w-2 h-2 rounded-full bg-[#E6B325] animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('payouts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'payouts'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Receive Payments & UPI Ledger</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'inventory'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Sell Products ({products.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: BUSINESS ANALYTICS ================= */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Total Sales Revenue</span>
                <span className="p-1.5 rounded-lg bg-[#2D5A27]/10 text-[#2D5A27]">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold font-serif text-[#2D5A27]">
                ₹{analytics?.kpis?.totalSales?.toLocaleString('en-IN') || '2,84,500'}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <span>+24.5%</span>
                <span className="text-slate-400 font-normal">vs previous month</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Direct Customer Orders</span>
                <span className="p-1.5 rounded-lg bg-[#E6B325]/20 text-[#C69516]">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900">
                {analytics?.kpis?.totalOrders || 186}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <span>12 ready for postal dispatch</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Active Conscious Patrons</span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900">
                {analytics?.kpis?.activeCustomers || 142}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>71% repeat purchase rate</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Fair Producer Cut</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-bold font-serif text-emerald-800">
                86.4%
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
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
                  <h3 className="font-bold text-sm text-white">Gram Sahayak AI: Daily Market Intelligence</h3>
                  <p className="text-[11px] text-white/70">Real-time demand intelligence tailored for your village craft category</p>
                </div>
              </div>

              <button
                onClick={fetchAIBusinessTips}
                disabled={tipsLoading}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${tipsLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh Insights</span>
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
                <h3 className="font-bold text-base text-slate-900">Live Orders & Consignment Tracking</h3>
                <p className="text-xs text-slate-500">Advance fulfillment status directly when postal partners pick up packages</p>
              </div>
              <button
                onClick={() => setActiveTab('logistics')}
                className="px-3.5 py-1.5 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-[#1E3D1A] flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Truck className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>Open Postal Relay Map</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-3">Order & Tracking ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Current Status</th>
                    <th className="pb-3 text-right">Fulfillment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3">
                        <div className="font-semibold text-slate-900">{order.id}</div>
                        <div className="font-mono text-[11px] text-[#2D5A27] font-bold">{order.trackingId}</div>
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-slate-800">{order.customerName}</div>
                        <div className="text-[10px] text-slate-400">{order.customerPhone}</div>
                      </td>
                      <td className="py-3">
                        <div className="max-w-[180px] truncate text-slate-700 font-medium">
                          {order.items.map(it => `${it.quantity}x ${it.title}`).join(', ')}
                        </div>
                      </td>
                      <td className="py-3 font-serif font-bold text-slate-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.orderStatus === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                          order.orderStatus === 'dispatched' ? 'bg-purple-100 text-purple-800' :
                          order.orderStatus === 'packed' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {order.orderStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {order.orderStatus !== 'delivered' ? (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, order.orderStatus)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#2D5A27] text-white hover:bg-[#1E3D1A] font-semibold text-[11px] transition-colors shadow-xs cursor-pointer"
                          >
                            Advance: {
                              order.orderStatus === 'placed' ? 'Mark Packed' :
                              order.orderStatus === 'packed' ? 'Handover to Hub' :
                              order.orderStatus === 'dispatched' ? 'Out for Delivery' :
                              'Mark Delivered'
                            }
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Delivered & Escrow Settled</span>
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Direct Customer Inquiries & Custom Orders</h3>
                <p className="text-xs text-slate-500">Communicate directly with buyers about custom weaves, bulk orders, and delivery dates</p>
              </div>
              <span className="text-xs font-semibold text-[#2D5A27] bg-[#2D5A27]/10 px-2.5 py-1 rounded-lg">
                {customerChats.length} Active Conversations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Chat Thread Selector (Left 4 cols) */}
              <div className="md:col-span-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">
                  Customer Messages:
                </span>
                {customerChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center ${
                      activeChat?.id === chat.id
                        ? 'bg-[#2D5A27]/10 border-[#2D5A27] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={chat.customerAvatar} alt={chat.customerName} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">{chat.customerName}</span>
                        {chat.unreadByArtisan > 0 && (
                          <span className="w-2 h-2 rounded-full bg-[#E6B325]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{chat.productTitle}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Chat Messages and Reply Form (Right 8 cols) */}
              <div className="md:col-span-8 bg-[#F8F5F0] rounded-2xl p-4 border border-[#2D5A27]/15 flex flex-col h-[400px]">
                {activeChat ? (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={activeChat.customerAvatar} alt={activeChat.customerName} className="w-7 h-7 rounded-lg object-cover" />
                        <div>
                          <span className="font-bold text-slate-900">{activeChat.customerName}</span>
                          <span className="text-slate-400 text-[10px] ml-2">Regarding: {activeChat.productTitle}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Verified Buyer
                      </span>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto py-3 space-y-2 text-xs">
                      {activeChat.messages.map((m: any, idx: number) => {
                        const isMe = m.sender === 'artisan';
                        return (
                          <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                              isMe ? 'bg-[#2D5A27] text-white shadow-xs' : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
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
                    <form onSubmit={handleSendArtisanReply} className="flex gap-2 pt-2 border-t border-slate-200/80">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder={`Reply directly to ${activeChat.customerName}...`}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
                      />
                      <button
                        type="submit"
                        disabled={!replyMessage.trim() || sendingReply}
                        className="px-4 py-2 rounded-xl bg-[#2D5A27] text-white font-semibold text-xs hover:bg-[#1E3D1A] disabled:opacity-40 transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Send</span>
                        <Send className="w-3.5 h-3.5 text-[#E6B325]" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                    Select a conversation to reply
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
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Available for Withdrawal</span>
              <div className="text-2xl font-bold font-serif text-[#2D5A27]">
                ₹{payoutsData?.availableBalance?.toLocaleString('en-IN') || '14,850'}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">Ready for instant UPI transfer to your bank</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Held in Postal Escrow</span>
              <div className="text-2xl font-bold font-serif text-amber-700">
                ₹{payoutsData?.pendingEscrow?.toLocaleString('en-IN') || '3,700'}
              </div>
              <p className="text-[11px] text-slate-500">Releases upon postal hub dispatch scan</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Lifetime Direct Earnings</span>
              <div className="text-2xl font-bold font-serif text-slate-900">
                ₹{payoutsData?.totalLifetimeEarned?.toLocaleString('en-IN') || '2,84,500'}
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">86.4% producer margin (Zero commission)</p>
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Recent Bank & UPI Settlements</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-2">Reference ID</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Payment Method</th>
                    <th className="pb-2">Bank Reference</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payoutsData?.recentPayouts?.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-800">{p.id}</td>
                      <td className="py-2.5 text-slate-500">{p.date}</td>
                      <td className="py-2.5 text-slate-700">{p.method}</td>
                      <td className="py-2.5 font-mono text-slate-500 text-[11px]">{p.bankRef}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-serif font-bold text-base text-[#2D5A27]">
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Sell Rural Products & Manage Stock</h3>
                <p className="text-xs text-slate-500">Live products visible on Gram AI pan-India marketplace</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-[#1E3D1A] flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New Craft</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="p-3 rounded-2xl border border-slate-200/80 bg-[#F8F5F0]/40 flex gap-3 items-center">
                  <img src={prod.imageUrl} alt={prod.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-bold text-slate-900 truncate">{prod.title}</h4>
                    <div className="text-[#2D5A27] font-serif font-bold text-sm">₹{prod.price}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>Stock: <strong>{prod.stock} {prod.unit}s</strong></span>
                      <span className="text-emerald-700 font-medium">86% Fair Cut</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal with Gemini AI Description Generator */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#2D5A27]/20 text-[#2C2C2C]">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold">
                  +
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Upload New Rural Product</h3>
                  <p className="text-xs text-slate-500">Sell directly to conscious urban buyers across India</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 pt-4 text-xs">
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Handcrafted Madhubani Tussar Silk Dupatta"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Craft / Farm Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#2D5A27]"
                  >
                    <option value="textiles">Handloom & Textiles</option>
                    <option value="spices">Organic Spices & Grains</option>
                    <option value="pottery">Terracotta & Clay Pottery</option>
                    <option value="honey_oils">Raw Honey & Cold-Pressed Oils</option>
                    <option value="bamboo_wood">Bamboo & Wood Craft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Direct Fair Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Available Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Selling Unit
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="piece, 500g pack, pot, 1L bottle"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Materials / Natural Ingredients (comma-separated)
                </label>
                <input
                  type="text"
                  value={newMaterials}
                  onChange={(e) => setNewMaterials(e.target.value)}
                  placeholder="Pure Silk, Indigo, Turmeric Dye, Bamboo"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
                />
              </div>

              {/* AI Auto-Generate Button */}
              <div className="bg-[#E6B325]/15 border border-[#E6B325]/30 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-[#2D5A27] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C69516]" />
                    <span>Gemini AI Product Storyteller</span>
                  </div>
                  <p className="text-[10px] text-slate-600">
                    Auto-generate authentic artisan story, highlights & fair pricing with 1 click.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAIGenerateDescription}
                  disabled={aiGenerating}
                  className="px-3 py-1.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing Story...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#E6B325]" />
                      <span>Generate with AI</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Product Description & Features
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe your craft details, size, and care instructions..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Artisan Collective Provenance Story
                </label>
                <textarea
                  rows={2}
                  value={newArtisanStory}
                  onChange={(e) => setNewArtisanStory(e.target.value)}
                  placeholder="Who made this? Share how this product supports your family or village SHG..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="px-5 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#E6B325]" />
                      <span>Publishing to Marketplace...</span>
                    </>
                  ) : (
                    <span>Publish Product to Gram AI</span>
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
