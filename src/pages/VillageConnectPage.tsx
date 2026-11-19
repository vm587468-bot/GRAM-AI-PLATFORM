import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Truck, 
  Share2, 
  MessageSquare, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  Package, 
  Handshake, 
  Send, 
  TrendingUp,
  Search,
  Filter,
  Check,
  Building2,
  X,
  PhoneCall
} from 'lucide-react';
import { SupportedLanguage } from '../i18n';
import { useLanguage } from '../context/LanguageContext';

interface Post {
  id: string;
  authorName: string;
  authorRole: string;
  location: string;
  distanceKm: number;
  avatar: string;
  tag: 'bulk_freight' | 'raw_material' | 'machinery' | 'joint_order';
  title: string;
  content: string;
  timeAgo: string;
  interestedCount: number;
  contactPhone: string;
}

export const VillageConnectPage: React.FC<{ currentLang?: SupportedLanguage; setActiveTab: (tab: string) => void }> = ({
  setActiveTab
}) => {
  const { t, language } = useLanguage();
  const [filterTag, setFilterTag] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Post form
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState<'bulk_freight' | 'raw_material' | 'machinery' | 'joint_order'>('bulk_freight');
  const [newContent, setNewContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post-1',
      authorName: 'Vedant Mishra',
      authorRole: 'Lead Artisan · Mishra Craft Guild',
      location: 'Varanasi, UP',
      distanceKm: 2,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      tag: 'bulk_freight',
      title: 'Sharing India Post Eco EV Van to Lucknow/Kanpur this Thursday (Save 55% Freight)',
      content: 'We have reserved a 1200kg capacity rural dispatch van for Banarasi handloom parcels. Still have ~400kg empty cargo volume. Artisans in Mirzapur/Varanasi cluster can combine their parcels to share nodal courier cost.',
      timeAgo: '2 hours ago',
      interestedCount: 8,
      contactPhone: '+91 94310 44521'
    },
    {
      id: 'post-2',
      authorName: 'Rameshwar Gurjar',
      authorRole: 'Molela Terracotta Potter SHG',
      location: 'Chandauli, UP',
      distanceKm: 14,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RameshwarGurjar',
      tag: 'raw_material',
      title: 'Bulk Organic Banana-Fibre Shockproof Cushioning Available at Cost',
      content: 'We purchased 500kg dried banana-leaf packaging cushions directly from farm collectives. We have 120kg extra. Zero plastic, 100% biodegradable and prevents earthenware & glass breakage during transit.',
      timeAgo: '5 hours ago',
      interestedCount: 14,
      contactPhone: '+91 98210 11244'
    },
    {
      id: 'post-3',
      authorName: 'Suman Devi & Mahila SHG',
      authorRole: 'Natural Spice & Oil Milling',
      location: 'Ramnagar, UP',
      distanceKm: 8,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
      tag: 'machinery',
      title: 'Cold-Press Mustard & Sesame Wood Ghani Free Time Slots',
      content: 'Our village solar wooden ghani runs at 60% capacity on Tuesdays and Fridays. Local farmers and spice artisans can book 2-hour extraction slots at nominal electricity cost rather than traveling to city mills.',
      timeAgo: '1 day ago',
      interestedCount: 6,
      contactPhone: '+91 97120 44910'
    },
    {
      id: 'post-4',
      authorName: 'Farooq Ahmad & Kashmiri Co-op',
      authorRole: 'Willow Bat & Woodworks',
      location: 'Varanasi Central Kiosk',
      distanceKm: 18,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      tag: 'joint_order',
      title: 'Looking for 300 Hand-Stitched Jute Bat Covers for Export Consignment',
      content: 'We received an institutional sports order for 300 grade-1 willow cricket bats. Seeking textile SHG to supply 300 reinforced jute carrying bags with drawstring within 10 days. Guaranteed payment through GramSetu Escrow.',
      timeAgo: '1 day ago',
      interestedCount: 11,
      contactPhone: '+91 91920 88401'
    }
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setTimeout(() => {
      const newP: Post = {
        id: `post-${Date.now()}`,
        authorName: 'Vedant Mishra',
        authorRole: 'Mishra Craft Guild & Tech Labs',
        location: 'Varanasi, UP',
        distanceKm: 1,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        tag: newTag,
        title: newTitle,
        content: newContent,
        timeAgo: 'Just now',
        interestedCount: 1,
        contactPhone: '+91 94310 44521'
      };
      setPosts([newP, ...posts]);
      setPosting(false);
      setIsPostModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setJoinedSuccess('Your collaboration request has been broadcasted to 142 nearby village entrepreneurs!');
    }, 500);
  };

  const handleInterest = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, interestedCount: p.interestedCount + 1 };
      }
      return p;
    }));
    setJoinedSuccess('Connected! The organizer has received your interest notification.');
  };

  const filteredPosts = posts.filter(p => {
    const matchesTag = filterTag === 'all' || p.tag === filterTag;
    const matchesDist = p.distanceKm <= maxDistance;
    return matchesTag && matchesDist;
  });

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#1E4319] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-white/10">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#D4A017] dark:text-[#FBBF24]">
            <Handshake className="w-3.5 h-3.5" />
            <span>Village Connect · Local Entrepreneur Collaborative Network</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Connect. Pool Resources. Grow Together.
          </h1>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal">
            No rural entrepreneur stands alone! Connect with verified artisans, weavers, farmers, and cooperatives within your district cluster. Share shipping vehicles, bulk raw materials, and machinery to cut costs by up to <strong>60%</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#c29113] text-slate-900 font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Post Collaboration Request</span>
            </button>
            <span className="text-xs text-white/80 font-medium">
              142 Active Rural Entrepreneurs in your 25km cluster
            </span>
          </div>
        </div>
      </div>

      {joinedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{joinedSuccess}</span>
          </div>
          <button onClick={() => setJoinedSuccess(null)} className="cursor-pointer text-slate-500 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Bar: Radius & Tag Filters */}
      <div className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'bulk_freight', label: '🚚 Shared Delivery Vans' },
            { id: 'raw_material', label: '🌾 Bulk Raw Materials' },
            { id: 'machinery', label: '⚙️ Shared Machinery & Tools' },
            { id: 'joint_order', label: '🤝 Joint Order Fulfillment' }
          ].map(tag => (
            <button
              key={tag.id}
              onClick={() => setFilterTag(tag.id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterTag === tag.id
                  ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Distance Range Slider */}
        <div className="flex items-center gap-3 w-full md:w-auto text-xs shrink-0">
          <MapPin className="w-4 h-4 text-[#2E7D32] dark:text-[#22C55E]" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Cluster Radius:</span>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-28 accent-[#2E7D32] cursor-pointer"
          />
          <span className="font-bold text-[#2E7D32] dark:text-[#22C55E] w-12">{maxDistance} km</span>
        </div>

      </div>

      {/* Posts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Active Collaboration Opportunities ({filteredPosts.length})</span>
          <span>Location: Varanasi & Eastern UP Cluster</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={post.authorName} className="w-11 h-11 rounded-2xl object-cover border border-slate-200" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {post.authorName}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {post.authorRole} · <span className="text-[#2E7D32] dark:text-[#22C55E] font-medium">{post.location} ({post.distanceKm} km away)</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4A017]/15 text-slate-900 dark:text-[#FBBF24] border border-[#D4A017]/30 shrink-0">
                  {post.tag.replace('_', ' ')}
                </span>
              </div>

              {/* Title & Content */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  {post.timeAgo} · <strong className="text-slate-700 dark:text-slate-300">{post.interestedCount} connected</strong>
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${post.contactPhone}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                    title={`Call: ${post.contactPhone}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#22C55E]" />
                  </a>

                  <button
                    onClick={() => handleInterest(post.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white dark:text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Handshake className="w-3.5 h-3.5 text-[#D4A017] dark:text-slate-950" />
                    <span>Collaborate</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl relative space-y-5">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
                Broadcast Collaboration Opportunity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share excess courier capacity, surplus raw materials, or joint orders with nearby village makers.
              </p>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Category:</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="bulk_freight">🚚 Shared Delivery Van / Parcel Pooling</option>
                  <option value="raw_material">🌾 Bulk Raw Material Sharing (Cotton, Clay, Spices)</option>
                  <option value="machinery">⚙️ Shared Tools / Machine Capacity (Loom, Grinder, Kiln)</option>
                  <option value="joint_order">🤝 Joint Order Fulfillment (Subcontracting)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Opportunity Headline:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Empty 300kg cargo space in courier van to Delhi this Saturday"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">Details & Terms:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain dates, available quantities, cost sharing percentage, or exact requirements..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white dark:text-slate-950 font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {posting ? 'Broadcasting...' : 'Broadcast to Cluster'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
