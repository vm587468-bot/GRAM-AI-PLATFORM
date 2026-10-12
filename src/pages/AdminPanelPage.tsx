import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Search, 
  Check, 
  X, 
  Download, 
  Lock, 
  Unlock,
  AlertTriangle,
  History,
  Flag,
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react';
import { SupportedLanguage } from '../i18n';
import { useLanguage } from '../context/LanguageContext';
import { User, Product, Review } from '../types';

export const AdminPanelPage: React.FC<{ currentLang?: SupportedLanguage; setActiveTab: (tab: string) => void }> = ({
  setActiveTab
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTabLocal] = useState<'overview' | 'users' | 'moderation' | 'orders' | 'escrow' | 'tickets'>('users');
  
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
  const [loadingModeration, setLoadingModeration] = useState(false);

  // Audit Trail Modal State
  const [selectedUserForAudit, setSelectedUserForAudit] = useState<User | null>(null);

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminUsers();
    fetchModerationItems();
  }, [userSearch, statusFilter, roleFilter, loginTypeFilter]);

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

      const res = await fetch(url.toString());
      const data = await res.json();
      setUsers(data.users || []);
      if (data.stats) setUserStats(data.stats);
    } catch (err) {
      console.error('Failed to load admin users', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchModerationItems = async () => {
    setLoadingModeration(true);
    try {
      const res = await fetch('/api/admin/moderation');
      const data = await res.json();
      setReportedProducts(data.reportedProducts || []);
      setFlaggedReviews(data.flaggedReviews || []);
    } catch (err) {
      console.error('Failed to load moderation items', err);
    } finally {
      setLoadingModeration(false);
    }
  };

  const handleToggleUserSuspension = async (user: User) => {
    const isSuspended = user.accountStatus === 'suspended';
    const nextStatus = isSuspended ? 'active' : 'suspended';
    const reason = prompt(
      isSuspended 
        ? `Reactivate account for ${user.name}? Enter administrative reason:` 
        : `Suspend account for ${user.name}? Enter mandatory reason for audit trail:`
    );

    if (reason === null) return; // User cancelled prompt

    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          reason: reason.trim() || (isSuspended ? 'Admin reactivated account.' : 'Policy violation investigation.'),
          adminName: 'Pooja Venkatesh (Security Lead)'
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`User ${user.name} is now ${nextStatus.toUpperCase()}. Action logged to audit trail.`);
        fetchAdminUsers();
      }
    } catch (err) {
      console.error('Failed to update user status', err);
    }
  };

  const handleModerateProduct = async (productId: string, action: 'approve' | 'pause' | 'delete') => {
    const reason = prompt(`Administrative reason for "${action}" on listing #${productId}:`);
    if (reason === null && action !== 'approve') return;

    try {
      const res = await fetch(`/api/admin/products/${productId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason: reason || 'Verified by admin team.' })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message || `Action ${action} applied.`);
        fetchModerationItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleModerateReview = async (reviewId: string, action: 'keep' | 'delete') => {
    if (!confirm(`Are you sure you want to ${action === 'delete' ? 'delete' : 'clear flag for'} this review?`)) return;

    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        fetchModerationItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8 animate-fadeIn">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-[#1E293B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-in fade-in duration-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Gram AI Master Admin Console · Tier-1 Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            {t.adminTitle}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            {t.adminSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchAdminUsers(); fetchModerationItems(); }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-700 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards (Distinguishing Never Logged In, Unknown, Inactive, Active) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500">{t.totalUsers}</span>
          <div className="text-2xl font-bold font-serif text-[#2E7D32] dark:text-[#22C55E]">{userStats.totalUsers}</div>
          <span className="text-[10px] text-slate-400">Total registered</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600">{t.activeUsers}</span>
          <div className="text-2xl font-bold font-serif text-emerald-600">{userStats.activeSessions}</div>
          <span className="text-[10px] text-slate-400">Logged in recently</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-600">{t.neverLoggedIn}</span>
          <div className="text-2xl font-bold font-serif text-amber-600">{userStats.neverLoggedInCount}</div>
          <span className="text-[10px] text-slate-400">Zero session records</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-purple-600">{t.lastLoginUnknown}</span>
          <div className="text-2xl font-bold font-serif text-purple-600">{userStats.unknownLoginCount}</div>
          <span className="text-[10px] text-slate-400">Legacy / unindexed</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500">{t.inactiveStatus}</span>
          <div className="text-2xl font-bold font-serif text-slate-700 dark:text-slate-300">{userStats.inactiveCount}</div>
          <span className="text-[10px] text-slate-400">No login in 30+ days</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-rose-600">{t.reportedListings}</span>
          <div className="text-2xl font-bold font-serif text-rose-600">{reportedProducts.length}</div>
          <span className="text-[10px] text-slate-400">Pending audit</span>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTabLocal('users')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Login Management</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('moderation')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'moderation'
              ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{t.productModeration} ({reportedProducts.length + flaggedReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('escrow')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'escrow'
              ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>NPCI UPI Escrow Ledger</span>
        </button>
      </div>

      {/* ================= TAB CONTENT: USERS & LOGIN MANAGEMENT ================= */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          
          {/* Search & Filters Header */}
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
              {/* Account Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All Account Status</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
                <option value="pending">Pending Verification</option>
              </select>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="entrepreneur">{t.roleEntrepreneur}</option>
                <option value="customer">{t.roleCustomer}</option>
                <option value="admin">{t.roleAdmin}</option>
              </select>

              {/* Login Status Filter (Distinguishing 'Never', 'Unknown', 'Inactive', 'Recent') */}
              <select
                value={loginTypeFilter}
                onChange={(e) => setLoginTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All Login Types</option>
                <option value="recent">Recent / Active Session</option>
                <option value="never">Never Logged In</option>
                <option value="unknown">Last Login Unknown</option>
                <option value="inactive">Inactive (&gt;30 Days)</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">User & Role</th>
                  <th className="py-3 px-4">Registration</th>
                  <th className="py-3 px-4">Last Login Record</th>
                  <th className="py-3 px-4">Login Attempts</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions & Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loadingUsers ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      Loading user accounts and login security telemetry...
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
                      <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        {/* User & Role */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{u.name}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                  u.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' 
                                    : u.role === 'entrepreneur' 
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                }`}>
                                  {u.role}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500">{u.email} · {u.location}</span>
                            </div>
                          </div>
                        </td>

                        {/* Registration Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {new Date(u.registeredAt).toLocaleDateString()}
                          </div>
                          <span className="text-[10px] text-slate-400">Verified KYC</span>
                        </td>

                        {/* Last Login Distinction */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {u.lastLoginType === 'never' ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
                              Never logged in
                            </span>
                          ) : u.lastLoginType === 'unknown' ? (
                            <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-bold">
                              Last login unknown
                            </span>
                          ) : u.lastLoginType === 'inactive' ? (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-[10px] font-bold">
                              Inactive (&gt;30d) · {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Historical'}
                            </span>
                          ) : (
                            <div>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                                Active Session
                              </span>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Recent'}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Login Attempts & History */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600 font-bold" title="Successful Logins">
                              ✓ {u.successfulLoginsCount}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className={u.failedLoginsCount > 0 ? "text-rose-600 font-bold" : "text-slate-400"} title="Failed Attempts">
                              ✕ {u.failedLoginsCount}
                            </span>
                          </div>
                          {u.loginHistory && u.loginHistory.length > 0 && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              IP: {u.loginHistory[0]?.ip}
                            </div>
                          )}
                        </td>

                        {/* Account Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isSuspended 
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300' 
                              : u.accountStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {u.accountStatus}
                          </span>
                        </td>

                        {/* Actions & Audit Trail */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedUserForAudit(u)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              title="View Audit Trail & Login History"
                            >
                              <History className="w-3.5 h-3.5" />
                              <span>Audit ({u.suspensionAuditTrail?.length || 0})</span>
                            </button>

                            <button
                              onClick={() => handleToggleUserSuspension(u)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                isSuspended
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  : 'bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {isSuspended ? (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>{t.reactivateAccount}</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>{t.suspendAccount}</span>
                                </>
                              )}
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

      {/* ================= TAB CONTENT: PRODUCT & REVIEW MODERATION ================= */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          {/* Reported Listings */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>{t.reportedListings} ({reportedProducts.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Products flagged by buyers for suspicious provenance, counterfeit claims, or incorrect photos.
                </p>
              </div>
            </div>

            {reportedProducts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No active suspicious listing reports. All marketplace items verified.
              </div>
            ) : (
              <div className="space-y-3">
                {reportedProducts.map(prod => (
                  <div key={prod.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={prod.imageUrl} alt={prod.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{prod.title}</span>
                        <div className="text-slate-500">By {prod.artisanName} · ₹{prod.price}</div>
                        <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-[11px] font-medium border border-rose-200 dark:border-rose-800">
                          <strong>Report Reason:</strong> {prod.reportedReason || 'Flagged for quality inspection.'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleModerateProduct(prod.id, 'approve')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                      >
                        {t.approveListing}
                      </button>
                      <button
                        onClick={() => handleModerateProduct(prod.id, 'pause')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
                      >
                        {t.pauseListingAdmin}
                      </button>
                      <button
                        onClick={() => handleModerateProduct(prod.id, 'delete')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                      >
                        Remove Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Flagged Customer Reviews */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-500" />
                  <span>{t.flaggedReviews} ({flaggedReviews.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Reviews reported by customers or artisans for harassment or fabricated testimonials.
                </p>
              </div>
            </div>

            {flaggedReviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No flagged customer reviews. Trust score is 99.8%.
              </div>
            ) : (
              <div className="space-y-3">
                {flaggedReviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{rev.author}</span>
                        <span className="text-amber-500 font-bold">★ {rev.rating}/5</span>
                        <span className="text-slate-400">· {new Date(rev.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 italic">"{rev.comment}"</p>
                      <div className="text-[11px] text-rose-600 font-semibold">
                        Reported Reason: {rev.reportReason || 'Suspicious testimonial claim.'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleModerateReview(rev.id, 'keep')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
                      >
                        Keep Review
                      </button>
                      <button
                        onClick={() => handleModerateReview(rev.id, 'delete')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
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

      {/* ================= TAB CONTENT: NPCI UPI ESCROW LEDGER ================= */}
      {activeTab === 'escrow' && (
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">NPCI UPI Direct Escrow Settlement Ledger</h3>
              <p className="text-xs text-slate-500">
                Live nodal audit between customer payments, escrow holding accounts, and artisan SHG disbursements.
              </p>
            </div>
            <button
              onClick={() => showNotification('Audit ledger PDF downloaded successfully.')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Ledger</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400">Escrow Reserved Balance</span>
              <div className="text-2xl font-bold font-serif text-[#2E7D32] dark:text-[#22C55E] mt-1">₹14,82,400</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Directly held until delivery OTP validation</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-400">Disbursed (Last 24h)</span>
              <div className="text-2xl font-bold font-serif text-blue-900 dark:text-blue-300 mt-1">₹3,42,100</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Direct UPI IMPS credit to artisan VPAs</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400">Escrow Dispute Rate</span>
              <div className="text-2xl font-bold font-serif text-amber-900 dark:text-amber-300 mt-1">0.02%</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Lowest across rural Indian digital platforms</p>
            </div>
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
                  <span>Security & Suspension Audit Trail</span>
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

            {/* Login Telemetry Records */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Recent Login Attempts</h4>
              <div className="space-y-2 text-xs">
                {selectedUserForAudit.loginHistory && selectedUserForAudit.loginHistory.length > 0 ? (
                  selectedUserForAudit.loginHistory.map((rec, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${rec.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="font-bold uppercase text-[10px]">{rec.status}</span>
                        <span className="text-slate-500">· {rec.device}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(rec.timestamp).toLocaleString()} ({rec.ip})
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No login records available for this account.</p>
                )}
              </div>
            </div>

            {/* Suspension / Status Audit Entries */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Status Modification History</h4>
              <div className="space-y-2 text-xs">
                {selectedUserForAudit.suspensionAuditTrail && selectedUserForAudit.suspensionAuditTrail.length > 0 ? (
                  selectedUserForAudit.suspensionAuditTrail.map((audit, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold uppercase text-[10px] ${audit.action === 'suspend' ? 'text-rose-600' : 'text-emerald-600'}`}>
                          Action: {audit.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(audit.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-xs">Reason: "{audit.reason}"</p>
                      <span className="text-[10px] text-slate-500">By Authorized Admin: {audit.byAdmin}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No suspension modifications recorded. Account is in good standing.</p>
                )}
              </div>
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
