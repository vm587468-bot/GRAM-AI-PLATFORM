import React, { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  X,
  AlertCircle,
  Loader2,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  Code2,
  RotateCcw
} from 'lucide-react';
import { Project, ProjectCategory, GovernmentScheme } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProjectsPageProps {
  initialSelectedProjectId?: string | null;
  onClearSelectedProject?: () => void;
  onOpenSchemeSection?: () => void;
  onOpenAuth?: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  initialSelectedProjectId,
  onClearSelectedProject,
  onOpenSchemeSection,
  onOpenAuth
}) => {
  const { token } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedBusinessType, setSelectedBusinessType] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'name_asc'>('newest');
  const [limit, setLimit] = useState(12);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);

  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [relatedSchemes, setRelatedSchemes] = useState<GovernmentScheme[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
    }, 280);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedQuery && sortBy === 'newest') {
      setSortBy('relevance');
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchProjects();
  }, [debouncedQuery, selectedCategory, selectedIndustry, selectedBusinessType, sortBy, limit]);

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }
  }, [token]);

  useEffect(() => {
    if (initialSelectedProjectId) {
      openProjectDetail(initialSelectedProjectId);
    }
  }, [initialSelectedProjectId]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('/api/projects', window.location.origin);
      if (debouncedQuery) url.searchParams.set('q', debouncedQuery);
      if (selectedCategory !== 'all') url.searchParams.set('category', selectedCategory);
      if (selectedIndustry !== 'all') url.searchParams.set('industry', selectedIndustry);
      if (selectedBusinessType !== 'all') url.searchParams.set('businessType', selectedBusinessType);
      url.searchParams.set('sort', sortBy);
      url.searchParams.set('limit', String(limit));

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to load projects');
      const data = await res.json();
      setProjects(data.projects || []);
      setTotalCount(data.totalCount || 0);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.industries)) setIndustries(data.industries);
      if (Array.isArray(data.businessTypes)) setBusinessTypes(data.businessTypes);
    } catch {
      setError('Unable to load the Projects directory right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarkedIds(data.bookmarks || []);
      }
    } catch {
      // silent bookmark sync fail
    }
  };

  const toggleBookmark = async (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!token) {
      onOpenAuth?.();
      return;
    }
    const isBookmarked = bookmarkedIds.includes(projectId);
    try {
      const res = await fetch(
        isBookmarked ? `/api/bookmarks/${projectId}` : '/api/bookmarks',
        {
          method: isBookmarked ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: isBookmarked ? undefined : JSON.stringify({ projectId })
        }
      );
      if (res.ok) {
        const data = await res.json();
        setBookmarkedIds(data.bookmarks || []);
      }
    } catch (err) {
      console.error('Bookmark error', err);
    }
  };

  const openProjectDetail = async (idOrSlug: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(idOrSlug)}`);
      if (!res.ok) throw new Error('Project not found');
      const data = await res.json();
      setDetailProject(data.project);
      setRelatedSchemes(data.relatedSchemes || []);
    } catch {
      setError('Could not load details for that project.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailProject(null);
    setRelatedSchemes([]);
    onClearSelectedProject?.();
  };

  const resetAllFilters = () => {
    setSearchInput('');
    setDebouncedQuery('');
    setSelectedCategory('all');
    setSelectedIndustry('all');
    setSelectedBusinessType('all');
    setSavedOnly(false);
    setSortBy('newest');
  };

  const displayedProjects = savedOnly
    ? projects.filter(p => bookmarkedIds.includes(p.id))
    : projects;

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold text-[#2E7D32] dark:text-[#22C55E]">
            GramSetu Blueprint & Project Directory
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Verified Business, Agro & Technology Projects
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Explore actionable project blueprints with indicative cost estimates, explicit assumptions, required skills, and matching government subsidy schemes.
          </p>
        </div>

        <button
          onClick={() => setSavedOnly(!savedOnly)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            savedOnly
              ? 'bg-[#2E7D32] text-white border-[#2E7D32] dark:bg-[#22C55E] dark:text-slate-950'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#2E7D32]'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Saved Bookmarks ({bookmarkedIds.length})</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
            selectedCategory === 'all'
              ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 border-transparent'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === cat.slug
                ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 border-transparent'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search & Attribute Filters Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by project name, industry, keywords, or skills..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#2E7D32]"
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
          value={selectedIndustry}
          onChange={e => setSelectedIndustry(e.target.value)}
          className="md:col-span-3 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <option value="all">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>

        <select
          value={selectedBusinessType}
          onChange={e => setSelectedBusinessType(e.target.value)}
          className="md:col-span-2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <option value="all">All Types</option>
          {businessTypes.map(bt => (
            <option key={bt} value={bt}>
              {bt}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="md:col-span-2 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="relevance">Relevance</option>
          <option value="name_asc">Name (A–Z)</option>
        </select>
      </div>

      {/* Results summary & Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchProjects}
            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="tabular-nums">
          Showing {displayedProjects.length} of {totalCount} verified project blueprint{totalCount === 1 ? '' : 's'}
        </span>
        {(searchInput || selectedCategory !== 'all' || selectedIndustry !== 'all' || savedOnly) && (
          <button
            onClick={resetAllFilters}
            className="text-[#2E7D32] dark:text-[#22C55E] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-xs text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32] dark:text-[#22C55E]" />
          <span>Loading project blueprints...</span>
        </div>
      ) : displayedProjects.length === 0 ? (
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <FolderKanban className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching projects found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            No project record matched your active search or filters. Clear filters to view all curated project blueprints.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 text-xs font-bold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map(proj => {
            const isBookmarked = bookmarkedIds.includes(proj.id);
            const hasImgError = imageErrors[proj.id];
            return (
              <div
                key={proj.id}
                onClick={() => openProjectDetail(proj.id)}
                className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-[#2E7D32]/60 dark:hover:border-[#22C55E]/60 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {!hasImgError && proj.imageUrl ? (
                      <img
                        src={proj.imageUrl}
                        alt={proj.name}
                        referrerPolicy="no-referrer"
                        onError={() => setImageErrors(prev => ({ ...prev, [proj.id]: true }))}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1 p-4 text-center">
                        <FolderKanban className="w-6 h-6" />
                        <span>Project preview unavailable</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={e => toggleBookmark(proj.id, e)}
                      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark project'}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:text-[#2E7D32] cursor-pointer"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {proj.industry} · {proj.businessType}
                    </div>
                    <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white group-hover:text-[#2E7D32] dark:group-hover:text-[#22C55E] transition-colors leading-snug">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Est. Investment</span>
                    <span className="font-bold text-[#2E7D32] dark:text-[#22C55E] tabular-nums">
                      {proj.requiredInvestment}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Location fit: {proj.locationSuitability}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {projects.length < totalCount && !savedOnly && (
        <div className="text-center">
          <button
            onClick={() => setLimit(prev => prev + 12)}
            className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#2E7D32] cursor-pointer"
          >
            Load More Projects
          </button>
        </div>
      )}

      {/* Project Detail Modal */}
      {(detailProject || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={closeDetail}
              aria-label="Close project details"
              className="sticky top-0 float-right p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {detailLoading || !detailProject ? (
              <div className="py-16 flex flex-col items-center gap-3 text-xs text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
                <span>Loading project blueprint...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <img
                      src={detailProject.imageUrl}
                      alt={detailProject.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-7 space-y-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {detailProject.industry} · {detailProject.businessType} · Status: {detailProject.status}
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                      {detailProject.name}
                    </h2>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {detailProject.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={() => toggleBookmark(detailProject.id)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:border-[#2E7D32] cursor-pointer"
                      >
                        {bookmarkedIds.includes(detailProject.id) ? (
                          <>
                            <BookmarkCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
                            <span>Bookmarked</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4" />
                            <span>Save Bookmark</span>
                          </>
                        )}
                      </button>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Verified source: {detailProject.verifiedSource} ({detailProject.lastVerifiedDate})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Indicative Cost & Financial Estimates */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-slate-500 dark:text-slate-400">Indicative Total Investment</div>
                      <div className="text-base font-bold text-[#2E7D32] dark:text-[#22C55E] tabular-nums">
                        {detailProject.requiredInvestment}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 dark:text-slate-400">Setup Cost Breakdown</div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {detailProject.estimatedSetupCost}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 dark:text-slate-400">Indicative Revenue Range</div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {detailProject.estimatedMonthlyRevenueRange || 'Depends on scale and local demand'}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-amber-800 dark:text-amber-300">
                    <strong>Cost Assumptions & Note:</strong> {detailProject.costAssumptions} Figures are planning estimates, not guaranteed profits.
                  </div>
                </div>

                {/* Operational Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Target Customers</h4>
                      <p className="text-slate-600 dark:text-slate-300">{detailProject.targetCustomers}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Revenue Model</h4>
                      <p className="text-slate-600 dark:text-slate-300">{detailProject.revenueModel}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Location Suitability</h4>
                      <p className="text-slate-600 dark:text-slate-300">{detailProject.locationSuitability}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Required Resources</h4>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4">
                        {detailProject.requiredResources.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Required Skills</h4>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4">
                        {detailProject.requiredSkills.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Benefits & Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Key Advantages</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc pl-4">
                      {detailProject.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Operational Risks & Challenges</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc pl-4">
                      {detailProject.challenges.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technology Implementation Details (ONLY rendered for software/tech projects) */}
                {detailProject.implementationDetails && (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
                      <span>Technical Stack & Architecture Details</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                      {detailProject.implementationDetails.techStack && detailProject.implementationDetails.techStack.length > 0 && (
                        <div>
                          <strong>Tech Stack:</strong> {detailProject.implementationDetails.techStack.join(', ')}
                        </div>
                      )}
                      {detailProject.implementationDetails.frontendDetails && (
                        <div>
                          <strong>Frontend:</strong> {detailProject.implementationDetails.frontendDetails}
                        </div>
                      )}
                      {detailProject.implementationDetails.backendDetails && (
                        <div>
                          <strong>Backend & APIs:</strong> {detailProject.implementationDetails.backendDetails}
                        </div>
                      )}
                      {detailProject.implementationDetails.databaseDetails && (
                        <div>
                          <strong>Database:</strong> {detailProject.implementationDetails.databaseDetails}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Linked Government Schemes & Reference Links */}
                {(relatedSchemes.length > 0 || detailProject.referenceLinks.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    {relatedSchemes.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Landmark className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
                          <span>Applicable Government Schemes</span>
                        </h4>
                        <div className="space-y-2">
                          {relatedSchemes.map(sch => (
                            <div key={sch.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">{sch.name}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {sch.loanDisplay} · {sch.subsidyGrant}
                                </div>
                              </div>
                              {onOpenSchemeSection && (
                                <button
                                  onClick={() => {
                                    closeDetail();
                                    onOpenSchemeSection();
                                  }}
                                  className="text-[#2E7D32] dark:text-[#22C55E] font-bold hover:underline shrink-0 cursor-pointer"
                                >
                                  View Scheme
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {detailProject.referenceLinks.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">Official References & Portals</h4>
                        <div className="space-y-2">
                          {detailProject.referenceLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-[#2E7D32] text-[#2E7D32] dark:text-[#22C55E] font-semibold"
                            >
                              <span>{link.label}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
