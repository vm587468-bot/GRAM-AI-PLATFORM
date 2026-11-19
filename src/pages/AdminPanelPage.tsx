import React, { useState, useEffect } from 'react';
import {
  Users,
  CreditCard,
  ShieldCheck,
  Search,
  X,
  Download,
  Lock,
  Unlock,
  AlertTriangle,
  History,
  Flag,
  RefreshCw,
  FolderKanban,
  Landmark,
  TrendingUp,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { SupportedLanguage } from '../i18n';
import { useLanguage } from '../context/LanguageContext';
import { SafeProductImage } from '../components/SafeProductImage';
import { useAuth } from '../context/AuthContext';
import { User, Product, Review, Project, GovernmentScheme, MarketPrice } from '../types';

interface AdminPanelPageProps {
  currentLang?: SupportedLanguage;
  setActiveTab: (tab: string) => void;
  onOpenAuth?: () => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  onOpenAuth = () => {}
}) => {
  const { t } = useLanguage();
  const { token, role, switchRole } = useAuth();
  const [activeTab, setActiveTabLocal] = useState<'users' | 'moderation' | 'projects' | 'schemes' | 'markets' | 'escrow'>('users');
  const [authError, setAuthError] = useState<string | null>(null);

  // Users Management State
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    neverLoggedInCount: 0,
    unknownLoginCount: 0,
    inactiveCount: 0,
    suspendedCount: 0
  });
  const [userSearch, setUserSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loginTypeFilter, setLoginTypeFilter] = useState('all');
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Moderation State
  const [reportedProducts, setReportedProducts] = useState<Product[]>([]);
  const [flaggedReviews, setFlaggedReviews] = useState<Review[]>([]);

  // Projects, Schemes, Markets CRUD State
  const [projects, setProjects] = useState<Project[]>([]);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [markets, setMarkets] = useState<MarketPrice[]>([]);

  // Audit Trail & Action Dialog State
  const [selectedUserForAudit, setSelectedUserForAudit] = useState<User | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: 'user_status' | 'product_moderate' | 'review_moderate';
    id: string;
    title: string;
    actionValue: string;
  } | null>(null);
  const [actionReason, setActionReason] = useState('');

  // CRUD Modal Forms
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    category: 'agri_business',
    industry: 'Agriculture & Food Processing',
    businessType: 'Micro-Enterprise',
    requiredInvestment: '₹1,50,000 – ₹3,00,000',
    estimatedSetupCost: '₹1,85,000 indicative setup',
    estimatedMonthlyRevenueRange: 'Estimated ₹25,000 – ₹45,000 / month',
    costAssumptions: 'Estimate assumes cooperative cluster pricing and 60% capacity utilization.',
    requiredResources: 'Sorting Unit, Weighing Scale, Clean Packaging',
    requiredSkills: 'Basic book-keeping, quality grading',
    benefits: 'High urban repeat demand',
    challenges: 'Moisture control and transport',
    imageUrl: '/images/project_mushroom.jpg',
    status: 'verified' as 'verified' | 'draft' | 'archived'
  });

  const [schemeFormOpen, setSchemeFormOpen] = useState(false);
  const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);
  const [schemeForm, setSchemeForm] = useState({
    name: '',
    ministry: '',
    state: 'All India',
    category: 'artisan',
    schemeType: 'Subsidy & Credit',
    description: '',
    purposeBenefits: '',
    eligibilityCriteria: '',
    documents: 'Aadhaar Card, Bank Passbook, Project Proposal',
    applicationProcess: 'Apply via the official government portal.',
    financialAssistance: 'Up to ₹3,00,000',
    deadline: 'Rolling / Ongoing',
    officialUrl: 'https://pmvishwakarma.gov.in/',
    officialSource: 'Ministry Portal (.gov.in)',
    lastVerifiedDate: '2026-10-15',
    status: 'active' as 'active' | 'upcoming' | 'expired'
  });

  const [marketFormOpen, setMarketFormOpen] = useState(false);
  const [editingMarketId, setEditingMarketId] = useState<string | null>(null);
  const [marketForm, setMarketForm] = useState({
    commodityName: '',
    variety: 'FAQ / Standard',
    category: 'Spices',
    marketName: '',
    district: '',
    state: '',
    minPrice: 2000,
    maxPrice: 2600,
    modalPrice: 2300,
    unit: '₹ / Quintal',
    demandLevel: 'Moderate' as 'High' | 'Moderate' | 'Seasonal' | 'Unavailable',
    supplyLevel: 'Steady' as 'Surplus' | 'Steady' | 'Tight' | 'Seasonal' | 'Unavailable',
    dataSource: 'Agmarknet Reference Dataset',
    priceDate: new Date().toISOString().slice(0, 10)
  });

  const [notification, setNotification] = useState<string | null>(null);

  const authHeaders = () => {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  };

  useEffect(() => {
    if (role !== 'admin') {
      setAuthError('Admin role access required to inspect security audit logs and manage GramSetu data.');
      setLoadingUsers(false);
      return;
    }
    setAuthError(null);
    fetchAdminUsers();
    fetchModerationItems();
    fetchProjects();
    fetchSchemes();
    fetchMarkets();
  }, [role, token, userSearch, statusFilter, roleFilter, loginTypeFilter]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchAdminUsers = async () => {
    setLoadingUsers(true);
    try {
      const url = new URL('/api/admin/users', window.location.origin);
      if (userSearch.trim()) url.searchParams.set('search', userSearch.trim());
      if (statusFilter !== 'all') url.searchParams.set('status', statusFilter);
      if (roleFilter !== 'all') url.searchParams.set('role', roleFilter);
      if (loginTypeFilter !== 'all') url.searchParams.set('loginType', loginTypeFilter);

      const res = await fetch(url.toString(), { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Admin authorization required.');
        return;
      }
      setAuthError(null);
      setUsers(data.users || []);
      if (data.stats) setUserStats(data.stats);
    } catch (err) {
      console.error('Failed to load admin users', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchModerationItems = async () => {
    try {
      const res = await fetch('/api/admin/moderation', { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setReportedProducts(data.reportedProducts || []);
      setFlaggedReviews(data.flaggedReviews || []);
    } catch (err) {
      console.error('Failed to load moderation items', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects?limit=50');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSchemes = async () => {
    try {
      const res = await fetch('/api/schemes?limit=50');
      const data = await res.json();
      setSchemes(data.schemes || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMarkets = async () => {
    try {
      const res = await fetch('/api/markets?limit=50');
      const data = await res.json();
      setMarkets(data.markets || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmPendingAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAction) return;
    try {
      if (pendingAction.type === 'user_status') {
        const res = await fetch(`/api/admin/users/${pendingAction.id}/status`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            status: pendingAction.actionValue,
            reason: actionReason.trim() || 'Administrative status update',
            adminName: 'Pooja Venkatesh (Admin)'
          })
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Account updated to ${pendingAction.actionValue.toUpperCase()}.`);
          fetchAdminUsers();
        }
      } else if (pendingAction.type === 'product_moderate') {
        const res = await fetch(`/api/admin/products/${pendingAction.id}/moderate`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            action: pendingAction.actionValue,
            reason: actionReason.trim() || 'Reviewed by admin team.'
          })
        });
        const data = await res.json();
        if (data.success) {
          showNotification(data.message || 'Listing updated.');
          fetchModerationItems();
        }
      } else if (pendingAction.type === 'review_moderate') {
        const res = await fetch(`/api/admin/reviews/${pendingAction.id}/moderate`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ action: pendingAction.actionValue })
        });
        const data = await res.json();
        if (data.success) {
          showNotification(data.message || 'Review updated.');
          fetchModerationItems();
        }
      }
      setPendingAction(null);
      setActionReason('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const splitCsv = (val: string) => val.split(',').map(s => s.trim()).filter(Boolean);
    const payload = {
      name: projectForm.name,
      description: projectForm.description,
      category: projectForm.category,
      industry: projectForm.industry,
      businessType: projectForm.businessType,
      requiredInvestment: projectForm.requiredInvestment,
      estimatedSetupCost: projectForm.estimatedSetupCost,
      estimatedMonthlyRevenueRange: projectForm.estimatedMonthlyRevenueRange,
      costAssumptions: projectForm.costAssumptions,
      requiredResources: splitCsv(projectForm.requiredResources),
      requiredSkills: splitCsv(projectForm.requiredSkills),
      benefits: splitCsv(projectForm.benefits),
      challenges: splitCsv(projectForm.challenges),
      imageUrl: projectForm.imageUrl,
      status: projectForm.status
    };
    const url = editingProjectId ? `/api/admin/projects/${editingProjectId}` : '/api/admin/projects';
    const method = editingProjectId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
    if (res.ok) {
      showNotification(editingProjectId ? 'Project updated.' : 'New project created and searchable.');
      setProjectFormOpen(false);
      setEditingProjectId(null);
      fetchProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) {
      showNotification('Project removed from directory.');
      fetchProjects();
    }
  };

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    const splitLines = (val: string) => val.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    const payload = {
      ...schemeForm,
      purposeBenefits: splitLines(schemeForm.purposeBenefits),
      eligibilityCriteria: splitLines(schemeForm.eligibilityCriteria),
      documents: splitLines(schemeForm.documents),
      applicationProcess: splitLines(schemeForm.applicationProcess)
    };
    const url = editingSchemeId ? `/api/admin/schemes/${editingSchemeId}` : '/api/admin/schemes';
    const method = editingSchemeId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
    if (res.ok) {
      showNotification(editingSchemeId ? 'Government scheme updated.' : 'Government scheme added.');
      setSchemeFormOpen(false);
      setEditingSchemeId(null);
      fetchSchemes();
    }
  };

  const handleDeleteScheme = async (id: string) => {
    const res = await fetch(`/api/admin/schemes/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) {
      showNotification('Scheme deleted.');
      fetchSchemes();
    }
  };

  const handleSaveMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingMarketId ? `/api/admin/markets/${editingMarketId}` : '/api/admin/markets';
    const method = editingMarketId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify({
        ...marketForm,
        minPrice: Number(marketForm.minPrice),
        maxPrice: Number(marketForm.maxPrice),
        modalPrice: Number(marketForm.modalPrice)
      })
    });
    if (res.ok) {
      showNotification(editingMarketId ? 'Market price updated.' : 'Market price entry added.');
      setMarketFormOpen(false);
      setEditingMarketId(null);
      fetchMarkets();
    }
  };

  const handleDeleteMarket = async (id: string) => {
    const res = await fetch(`/api/admin/markets/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) {
      showNotification('Market entry deleted.');
      fetchMarkets();
    }
  };

  if (role !== 'admin' || authError) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-14">
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
            Admin Authorization Required
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {authError || 'Switch to the Hub Coordinator (Admin) role or sign in with admin credentials to manage users, projects, government schemes, market prices, and moderation.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => switchRole('admin')}
              className="px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold cursor-pointer"
            >
              Switch to Admin Role
            </button>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
            >
              Sign In with Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8 animate-fadeIn">
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#1E293B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GramSetu Admin Console · Role-Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            {t.adminTitle}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            {t.adminSubtitle}
          </p>
        </div>

        <button
          onClick={() => {
            fetchAdminUsers();
            fetchModerationItems();
            fetchProjects();
            fetchSchemes();
            fetchMarkets();
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-700 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh All Data</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs tabular-nums">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500">{t.totalUsers}</span>
          <div className="text-2xl font-bold font-serif text-[#2E7D32] dark:text-[#22C55E]">{userStats.totalUsers}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600">{t.activeUsers}</span>
          <div className="text-2xl font-bold font-serif text-emerald-600">{userStats.activeSessions}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-600">Projects</span>
          <div className="text-2xl font-bold font-serif text-amber-600">{projects.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-blue-600">Govt Schemes</span>
          <div className="text-2xl font-bold font-serif text-blue-600">{schemes.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500">Market Quotes</span>
          <div className="text-2xl font-bold font-serif text-slate-700 dark:text-slate-300">{markets.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-rose-600">{t.reportedListings}</span>
          <div className="text-2xl font-bold font-serif text-rose-600">{reportedProducts.length}</div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTabLocal('users')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'users' ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users &amp; Auth Logs</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('projects')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'projects' ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('schemes')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'schemes' ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Schemes ({schemes.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('markets')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'markets' ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Market Prices ({markets.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('moderation')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'moderation' ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Moderation ({reportedProducts.length + flaggedReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('escrow')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'escrow' ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Escrow Ledger</span>
        </button>
      </div>

      {/* ================= TAB: USERS ================= */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
              >
                <option value="all">All Account Status</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
                <option value="pending">Pending Verification</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="entrepreneur">{t.roleEntrepreneur}</option>
                <option value="customer">{t.roleCustomer}</option>
                <option value="admin">{t.roleAdmin}</option>
              </select>

              <select
                value={loginTypeFilter}
                onChange={(e) => setLoginTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
              >
                <option value="all">All Login Types</option>
                <option value="recent">Recent / Active Session</option>
                <option value="never">Never Logged In</option>
                <option value="unknown">Last Login Unknown</option>
                <option value="inactive">Inactive (&gt;30 Days)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">User &amp; Role</th>
                  <th className="py-3 px-4">Registration</th>
                  <th className="py-3 px-4">Last Login Record</th>
                  <th className="py-3 px-4">Login Attempts</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions &amp; Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loadingUsers ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      Loading user accounts...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      No users matched your filter criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isSuspended = u.accountStatus === 'suspended';
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{u.name}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-slate-100 dark:bg-slate-800">{u.role}</span>
                              </div>
                              <span className="text-[11px] text-slate-500">{u.email} · {u.location}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">{new Date(u.registeredAt || u.joinedDate || Date.now()).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {u.lastLoginType === 'never' ? 'Never logged in' : u.lastLoginType === 'unknown' ? 'Unknown' : u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Active'}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums">✓ {u.successfulLoginsCount} · ✕ {u.failedLoginsCount}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isSuspended ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {u.accountStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedUserForAudit(u)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <History className="w-3.5 h-3.5" />
                              <span>Audit ({u.suspensionAuditTrail?.length || 0})</span>
                            </button>
                            <button
                              onClick={() => {
                                setPendingAction({
                                  type: 'user_status',
                                  id: u.id,
                                  title: `${isSuspended ? 'Reactivate' : 'Suspend'} account for ${u.name}`,
                                  actionValue: isSuspended ? 'active' : 'suspended'
                                });
                                setActionReason('');
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                                isSuspended ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                              <span>{isSuspended ? t.reactivateAccount : t.suspendAccount}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB: PROJECTS CRUD ================= */}
      {activeTab === 'projects' && (
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Manage Projects Directory</h3>
              <p className="text-xs text-slate-500">Add, edit, or remove projects indexed in SQLite full-text search.</p>
            </div>
            <button
              onClick={() => {
                setEditingProjectId(null);
                setProjectForm({
                  name: '',
                  description: '',
                  category: 'agri_business',
                  industry: 'Agriculture & Food Processing',
                  businessType: 'Micro-Enterprise',
                  requiredInvestment: '₹1,50,000 – ₹3,00,000',
                  estimatedSetupCost: '₹1,85,000 indicative setup',
                  estimatedMonthlyRevenueRange: 'Estimated ₹25,000 – ₹45,000 / month',
                  costAssumptions: 'Estimate assumes cooperative cluster pricing and 60% capacity utilization.',
                  requiredResources: 'Sorting Unit, Weighing Scale, Clean Packaging',
                  requiredSkills: 'Basic book-keeping, quality grading',
                  benefits: 'High urban repeat demand',
                  challenges: 'Moisture control and transport',
                  imageUrl: '/images/project_mushroom.jpg',
                  status: 'verified'
                });
                setProjectFormOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {projects.map(p => (
              <div key={p.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white truncate">{p.name}</div>
                    <div className="text-slate-500 truncate">{p.industry} · {p.requiredInvestment} · Status: {p.status}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingProjectId(p.id);
                      setProjectForm({
                        name: p.name,
                        description: p.description,
                        category: p.category,
                        industry: p.industry,
                        businessType: p.businessType,
                        requiredInvestment: p.requiredInvestment,
                        estimatedSetupCost: p.estimatedSetupCost || '',
                        estimatedMonthlyRevenueRange: p.estimatedMonthlyRevenueRange || '',
                        costAssumptions: p.costAssumptions,
                        requiredResources: (p.requiredResources || []).join(', '),
                        requiredSkills: (p.requiredSkills || []).join(', '),
                        benefits: (p.benefits || []).join(', '),
                        challenges: (p.challenges || []).join(', '),
                        imageUrl: p.imageUrl,
                        status: p.status
                      });
                      setProjectFormOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: GOVT SCHEMES CRUD ================= */}
      {activeTab === 'schemes' && (
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Manage Government Schemes</h3>
              <p className="text-xs text-slate-500">Maintain official central and state scheme eligibility, deadlines, and .gov.in portal links.</p>
            </div>
            <button
              onClick={() => {
                setEditingSchemeId(null);
                setSchemeForm({
                  name: '',
                  ministry: '',
                  state: 'All India',
                  category: 'artisan',
                  schemeType: 'Subsidy & Credit',
                  description: '',
                  purposeBenefits: '',
                  eligibilityCriteria: '',
                  documents: 'Aadhaar Card, Bank Passbook',
                  applicationProcess: 'Apply via official portal.',
                  financialAssistance: 'Up to ₹3,00,000',
                  deadline: 'Rolling / Ongoing',
                  officialUrl: 'https://pmvishwakarma.gov.in/',
                  officialSource: 'Ministry Portal (.gov.in)',
                  lastVerifiedDate: '2026-10-15',
                  status: 'active'
                });
                setSchemeFormOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Scheme</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {schemes.map(s => (
              <div key={s.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{s.name}</div>
                  <div className="text-slate-500 truncate">{s.ministry} · {s.state} · Status: {s.status} · Verified: {s.lastVerifiedDate}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingSchemeId(s.id);
                      setSchemeForm({
                        name: s.name,
                        ministry: s.ministry,
                        state: s.state,
                        category: s.category,
                        schemeType: s.schemeType,
                        description: s.description,
                        purposeBenefits: (s.purposeBenefits || []).join(', '),
                        eligibilityCriteria: (s.eligibilityCriteria || []).join(', '),
                        documents: (s.documents || []).join(', '),
                        applicationProcess: (s.applicationProcess || []).join(', '),
                        financialAssistance: s.financialAssistance,
                        deadline: s.deadline,
                        officialUrl: s.officialUrl,
                        officialSource: s.officialSource,
                        lastVerifiedDate: s.lastVerifiedDate,
                        status: s.status
                      });
                      setSchemeFormOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteScheme(s.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: MARKET PRICES CRUD ================= */}
      {activeTab === 'markets' && (
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Manage Mandi &amp; Market Commodity Prices</h3>
              <p className="text-xs text-slate-500">Update commodity modal, min, and max prices and trends.</p>
            </div>
            <button
              onClick={() => {
                setEditingMarketId(null);
                setMarketForm({
                  commodityName: '',
                  variety: 'FAQ / Standard',
                  category: 'Spices',
                  marketName: '',
                  district: '',
                  state: '',
                  minPrice: 2000,
                  maxPrice: 2600,
                  modalPrice: 2300,
                  unit: '₹ / Quintal',
                  demandLevel: 'Moderate',
                  supplyLevel: 'Steady',
                  dataSource: 'Agmarknet Reference Dataset',
                  priceDate: new Date().toISOString().slice(0, 10)
                });
                setMarketFormOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Commodity</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {markets.map(m => (
              <div key={m.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{m.commodityName} ({m.variety})</div>
                  <div className="text-slate-500 truncate tabular-nums">{m.marketName}, {m.state} · Modal ₹{m.modalPrice} {m.unit}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingMarketId(m.id);
                      setMarketForm({
                        commodityName: m.commodityName,
                        variety: m.variety,
                        category: m.category,
                        marketName: m.marketName,
                        district: m.district,
                        state: m.state,
                        minPrice: m.minPrice,
                        maxPrice: m.maxPrice,
                        modalPrice: m.modalPrice,
                        unit: m.unit,
                        demandLevel: m.demandLevel,
                        supplyLevel: m.supplyLevel,
                        dataSource: m.dataSource,
                        priceDate: m.priceDate
                      });
                      setMarketFormOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMarket(m.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: MODERATION ================= */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{t.reportedListings} ({reportedProducts.length})</span>
            </h3>
            {reportedProducts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No active suspicious listing reports.</div>
            ) : (
              <div className="space-y-3">
                {reportedProducts.map(prod => (
                  <div key={prod.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <SafeProductImage
                        src={prod.imageUrl}
                        alt={prod.title}
                        updatedAt={prod.updatedAt}
                        compact
                        containerClassName="w-16 h-16 rounded-xl shrink-0"
                        className="w-full h-full object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{prod.title}</span>
                        <div className="text-slate-500">By {prod.artisanName} · ₹{prod.price}</div>
                        <div className="text-rose-600 font-medium mt-1">Reason: {prod.reportedReason || 'Flagged for inspection.'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setPendingAction({ type: 'product_moderate', id: prod.id, title: `Approve listing: ${prod.title}`, actionValue: 'approve' });
                          setActionReason('Verified authentic by admin team.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
                      >
                        {t.approveListing}
                      </button>
                      <button
                        onClick={() => {
                          setPendingAction({ type: 'product_moderate', id: prod.id, title: `Pause listing: ${prod.title}`, actionValue: 'pause' });
                          setActionReason('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold cursor-pointer"
                      >
                        {t.pauseListingAdmin}
                      </button>
                      <button
                        onClick={() => {
                          setPendingAction({ type: 'product_moderate', id: prod.id, title: `Delete listing: ${prod.title}`, actionValue: 'delete' });
                          setActionReason('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-500" />
              <span>{t.flaggedReviews} ({flaggedReviews.length})</span>
            </h3>
            {flaggedReviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No flagged customer reviews.</div>
            ) : (
              <div className="space-y-3">
                {flaggedReviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{rev.userName}</span>
                        <span className="text-amber-500 font-bold">★ {rev.rating}/5</span>
                        <span className="text-slate-400">· {new Date(rev.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 italic">"{rev.comment}"</p>
                      <div className="text-[11px] text-rose-600 font-semibold">
                        Reported Reason: {rev.reportReason || 'Flagged review.'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPendingAction({ type: 'review_moderate', id: rev.id, title: `Keep review by ${rev.userName}?`, actionValue: 'keep' })}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold cursor-pointer"
                      >
                        Keep Review
                      </button>
                      <button
                        onClick={() => setPendingAction({ type: 'review_moderate', id: rev.id, title: `Delete review by ${rev.userName}?`, actionValue: 'delete' })}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold cursor-pointer"
                      >
                        Delete Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB: ESCROW ================= */}
      {activeTab === 'escrow' && (
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">NPCI UPI Direct Escrow Settlement Ledger</h3>
              <p className="text-xs text-slate-500">Nodal summary between buyer escrow payments and seller payouts.</p>
            </div>
            <button
              onClick={() => showNotification('Audit ledger summary exported.')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs tabular-nums">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400">Escrow Reserved Balance</span>
              <div className="text-2xl font-bold font-serif text-[#2E7D32] dark:text-[#22C55E] mt-1">₹14,82,400</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-400">Disbursed (Last 24h)</span>
              <div className="text-2xl font-bold font-serif text-blue-900 dark:text-blue-300 mt-1">₹3,42,100</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400">Open Disputes</span>
              <div className="text-2xl font-bold font-serif text-amber-900 dark:text-amber-300 mt-1">0</div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ACTION CONFIRM MODAL ================= */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{pendingAction.title}</h3>
            <form onSubmit={handleConfirmPendingAction} className="space-y-3 text-xs">
              {pendingAction.type !== 'review_moderate' && (
                <textarea
                  rows={3}
                  value={actionReason}
                  onChange={e => setActionReason(e.target.value)}
                  placeholder="Enter administrative reason for the audit log..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white font-bold cursor-pointer">
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PROJECT FORM MODAL ================= */}
      {projectFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingProjectId ? 'Edit Project' : 'Add Project to Directory'}
              </h3>
              <button onClick={() => setProjectFormOpen(false)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
              <input required placeholder="Project Name" value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              <textarea required rows={3} placeholder="Project Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Industry" value={projectForm.industry} onChange={e => setProjectForm({ ...projectForm, industry: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                <input required placeholder="Business Type" value={projectForm.businessType} onChange={e => setProjectForm({ ...projectForm, businessType: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Investment Estimate" value={projectForm.requiredInvestment} onChange={e => setProjectForm({ ...projectForm, requiredInvestment: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                <input required placeholder="Monthly Revenue Estimate" value={projectForm.estimatedMonthlyRevenueRange} onChange={e => setProjectForm({ ...projectForm, estimatedMonthlyRevenueRange: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              </div>
              <input placeholder="Cost Assumptions" value={projectForm.costAssumptions} onChange={e => setProjectForm({ ...projectForm, costAssumptions: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              <input placeholder="Required Resources (comma separated)" value={projectForm.requiredResources} onChange={e => setProjectForm({ ...projectForm, requiredResources: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              <input placeholder="Required Skills (comma separated)" value={projectForm.requiredSkills} onChange={e => setProjectForm({ ...projectForm, requiredSkills: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold cursor-pointer">Save Project</button>
            </form>
          </div>
        </div>
      )}

      {/* ================= SCHEME FORM MODAL ================= */}
      {schemeFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingSchemeId ? 'Edit Government Scheme' : 'Add Government Scheme'}
              </h3>
              <button onClick={() => setSchemeFormOpen(false)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveScheme} className="space-y-3 text-xs">
              <input required placeholder="Scheme Name" value={schemeForm.name} onChange={e => setSchemeForm({ ...schemeForm, name: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Ministry / Dept" value={schemeForm.ministry} onChange={e => setSchemeForm({ ...schemeForm, ministry: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                <input required placeholder="State (e.g. All India)" value={schemeForm.state} onChange={e => setSchemeForm({ ...schemeForm, state: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              </div>
              <textarea required rows={2} placeholder="Description" value={schemeForm.description} onChange={e => setSchemeForm({ ...schemeForm, description: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              <textarea required rows={2} placeholder="Official Purpose & Benefits (comma or newline separated)" value={schemeForm.purposeBenefits} onChange={e => setSchemeForm({ ...schemeForm, purposeBenefits: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              <input required placeholder="Eligibility Criteria (comma separated)" value={schemeForm.eligibilityCriteria} onChange={e => setSchemeForm({ ...schemeForm, eligibilityCriteria: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Official URL (.gov.in)" value={schemeForm.officialUrl} onChange={e => setSchemeForm({ ...schemeForm, officialUrl: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                <select value={schemeForm.status} onChange={e => setSchemeForm({ ...schemeForm, status: e.target.value as any })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <option value="active">active</option>
                  <option value="upcoming">upcoming</option>
                  <option value="expired">expired</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold cursor-pointer">Save Scheme</button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MARKET FORM MODAL ================= */}
      {marketFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingMarketId ? 'Edit Market Price' : 'Add Commodity Price'}
              </h3>
              <button onClick={() => setMarketFormOpen(false)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveMarket} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Commodity Name" value={marketForm.commodityName} onChange={e => setMarketForm({ ...marketForm, commodityName: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                <input required placeholder="Category" value={marketForm.category} onChange={e => setMarketForm({ ...marketForm, category: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Mandi / Market Name" value={marketForm.marketName} onChange={e => setMarketForm({ ...marketForm, marketName: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                <input required placeholder="State" value={marketForm.state} onChange={e => setMarketForm({ ...marketForm, state: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" required placeholder="Min ₹" value={marketForm.minPrice} onChange={e => setMarketForm({ ...marketForm, minPrice: Number(e.target.value) })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                <input type="number" required placeholder="Modal ₹" value={marketForm.modalPrice} onChange={e => setMarketForm({ ...marketForm, modalPrice: Number(e.target.value) })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                <input type="number" required placeholder="Max ₹" value={marketForm.maxPrice} onChange={e => setMarketForm({ ...marketForm, maxPrice: Number(e.target.value) })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold cursor-pointer">Save Market Entry</button>
            </form>
          </div>
        </div>
      )}

      {/* ================= USER AUDIT TRAIL MODAL ================= */}
      {selectedUserForAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Security &amp; Suspension Audit Trail</span>
                </h3>
                <p className="text-xs text-slate-500">
                  User: <strong>{selectedUserForAudit.name}</strong> ({selectedUserForAudit.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedUserForAudit(null)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {selectedUserForAudit.loginHistory?.length ? (
                selectedUserForAudit.loginHistory.map((rec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                    <span>{rec.status.toUpperCase()} · {rec.device}</span>
                    <span className="text-slate-400 font-mono">{new Date(rec.timestamp).toLocaleString()} ({rec.ip})</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No login records available.</p>
              )}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUserForAudit(null)}
                className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
