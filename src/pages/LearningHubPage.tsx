import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Play, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  Clock, 
  Eye, 
  Share2, 
  Award, 
  Sparkles, 
  X, 
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
  Youtube
} from 'lucide-react';
import { 
  VideoTutorial, 
  TUTORIAL_CATEGORIES, 
  VERIFIED_VIDEO_TUTORIALS 
} from '../data/videoTutorialsData';
import { useLanguage } from '../context/LanguageContext';

export const LearningHubPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [tutorials, setTutorials] = useState<VideoTutorial[]>(VERIFIED_VIDEO_TUTORIALS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'Beginner' | 'Intermediate'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'history'>('all');

  // Video Player Modal State
  const [activeVideo, setActiveVideo] = useState<VideoTutorial | null>(null);

  // Saved Videos & Watch History (persisted in localStorage)
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gramai_saved_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [historyVideoIds, setHistoryVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gramai_watch_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gramai_completed_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Try fetching dynamic videos if API available, else use verified fallbacks
  useEffect(() => {
    fetch('/api/tutorials')
      .then(res => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then(data => {
        if (data && data.tutorials && data.tutorials.length > 0) {
          setTutorials(data.tutorials);
        }
      })
      .catch(() => {
        // Retain verified fallback tutorials
      });
  }, []);

  const toggleSaveVideo = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedVideoIds(prev => {
      const updated = prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id];
      localStorage.setItem('gramai_saved_videos', JSON.stringify(updated));
      return updated;
    });
  };

  const handleOpenVideo = (video: VideoTutorial) => {
    setActiveVideo(video);
    setHistoryVideoIds(prev => {
      const filtered = prev.filter(id => id !== video.id);
      const updated = [video.id, ...filtered];
      localStorage.setItem('gramai_watch_history', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCompleteVideo = (id: string) => {
    setCompletedVideoIds(prev => {
      const updated = prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id];
      localStorage.setItem('gramai_completed_videos', JSON.stringify(updated));
      return updated;
    });
  };

  // Filter Logic
  const filteredTutorials = tutorials.filter(video => {
    // Tab filter
    if (activeTab === 'saved' && !savedVideoIds.includes(video.id)) return false;
    if (activeTab === 'history' && !historyVideoIds.includes(video.id)) return false;

    // Category filter
    if (selectedCategory !== 'all' && video.category !== selectedCategory) return false;

    // Level filter
    if (selectedLevel !== 'all' && video.level !== selectedLevel) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = video.title.toLowerCase().includes(q);
      const matchDesc = video.description.toLowerCase().includes(q);
      const matchCat = video.categoryLabel.toLowerCase().includes(q);
      const matchChannel = video.channelName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat && !matchChannel) return false;
    }

    return true;
  });

  const progressPercentage = Math.round((completedVideoIds.length / tutorials.length) * 100);

  // Category labels localized where helpful
  const getCategoryTitle = (catId: string, fallback: string) => {
    return fallback;
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2E7D32] via-[#1B5E20] to-[#0D3811] text-white p-6 sm:p-10 shadow-xl border border-[#D4A017]/30">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#D4A017] dark:text-[#FBBF24]">
            <Youtube className="w-4 h-4 text-red-400" />
            <span>{t.tutorialsBadge}</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            {t.tutorialsTitle}
          </h1>
          
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            {t.tutorialsSubtitle}
          </p>

          {/* Quick Progress Bar */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
            <div className="flex-1 bg-black/30 rounded-full h-3.5 p-0.5 border border-white/20">
              <div 
                className="bg-gradient-to-r from-[#D4A017] to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-white/90 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{completedVideoIds.length} of {tutorials.length} {t.completedBadge} ({progressPercentage}%)</span>
              </span>
              <span className="text-white/40">·</span>
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-[#D4A017]" />
                <span>{savedVideoIds.length} {t.savedVideos}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Search Control Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        
        {/* Top Row: Search & Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.videoSearchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Tabs & Level Selector */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* View Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'all' 
                    ? 'bg-white dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#22C55E] shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.all} ({tutorials.length})
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'saved' 
                    ? 'bg-white dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#22C55E] shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{t.savedVideos} ({savedVideoIds.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'history' 
                    ? 'bg-white dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#22C55E] shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t.watchHistory} ({historyVideoIds.length})</span>
              </button>
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-1 text-xs bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1">
              <span className="text-slate-500 font-medium px-1">Level:</span>
              {(['all', 'Beginner', 'Intermediate'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    selectedLevel === lvl
                      ? 'bg-[#2E7D32] text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {lvl === 'all' ? t.all : lvl === 'Beginner' ? t.beginnerLevel : t.intermediateLevel}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 8 Requested Categories Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none pt-1">
          {TUTORIAL_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#2E7D32] text-white shadow-sm ring-2 ring-[#2E7D32]/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.id === 'all' ? t.tutorialsCategoryAll : cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {cat.id === 'all' ? tutorials.length : cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Cards Grid */}
      {filteredTutorials.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <Youtube className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {t.noVideosFound}
          </h3>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSearchQuery('');
              setActiveTab('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B5E20] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((video) => {
            const isSaved = savedVideoIds.includes(video.id);
            const isCompleted = completedVideoIds.includes(video.id);

            return (
              <div
                key={video.id}
                onClick={() => handleOpenVideo(video)}
                className="group bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img 
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white">
                      {video.categoryLabel}
                    </span>
                    <button
                      onClick={(e) => toggleSaveVideo(video.id, e)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        isSaved 
                          ? 'bg-[#D4A017] text-white' 
                          : 'bg-black/60 text-white hover:bg-black/80'
                      }`}
                      title={isSaved ? "Saved" : "Save Tutorial"}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Bottom Video Meta Badges */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium">
                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{video.duration}</span>
                    </span>
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-slate-300">
                      {video.views}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                      <span className="font-semibold text-[#2E7D32] dark:text-[#22C55E] truncate">
                        {video.channelName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        video.level === 'Beginner' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' 
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                      }`}>
                        {video.level === 'Beginner' ? t.beginnerLevel : t.intermediateLevel}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-[#2E7D32] dark:group-hover:text-[#22C55E] transition-colors">
                      {video.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#2E7D32] dark:text-[#22C55E] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>{t.watchTutorial}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.completedBadge}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-normal">
                        Ready to watch
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dedicated Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#1E293B] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col my-auto max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 truncate">
                <Youtube className="w-5 h-5 text-red-600 shrink-0" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {activeVideo.categoryLabel} · {activeVideo.channelName}
                </span>
              </div>
              <button 
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded YouTube Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${activeVideo.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Details & Interaction */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    {activeVideo.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-[#2E7D32] dark:text-[#22C55E]">
                      {activeVideo.channelName}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activeVideo.duration}</span>
                    </span>
                    <span>·</span>
                    <span>{activeVideo.views}</span>
                    <span>·</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">
                      {activeVideo.level}
                    </span>
                  </div>
                </div>

                {/* Video Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleCompleteVideo(activeVideo.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      completedVideoIds.includes(activeVideo.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {completedVideoIds.includes(activeVideo.id) ? t.completedBadge : t.markComplete}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleSaveVideo(activeVideo.id)}
                    className={`p-2 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer ${
                      savedVideoIds.includes(activeVideo.id)
                        ? 'bg-[#D4A017] text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title={savedVideoIds.includes(activeVideo.id) ? "Saved" : "Save Video"}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  Tutorial Overview:
                </p>
                <p>{activeVideo.description}</p>
              </div>

              {/* Key Takeaways & Action Points */}
              {activeVideo.keyTakeaways && activeVideo.keyTakeaways.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Practical Action Steps:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeVideo.keyTakeaways.map((point, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs text-slate-800 dark:text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Tutorials in same Category */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t.relatedVideos}:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tutorials
                    .filter(v => v.id !== activeVideo.id && (v.category === activeVideo.category || selectedCategory === 'all'))
                    .slice(0, 2)
                    .map(rel => (
                      <div
                        key={rel.id}
                        onClick={() => handleOpenVideo(rel)}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                      >
                        <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                          <img src={rel.thumbnailUrl} alt={rel.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-3.5 h-3.5 fill-white text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {rel.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {rel.channelName} · {rel.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
