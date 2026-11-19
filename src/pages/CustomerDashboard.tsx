import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  FileText, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Heart,
  MessageSquare,
  Clock,
  X,
  ShieldCheck
} from 'lucide-react';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SafeProductImage } from '../components/SafeProductImage';

interface CustomerDashboardProps {
  setActiveTab: (tab: string) => void;
  onTrackOrder: (trackingId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ 
  setActiveTab,
  onTrackOrder 
}) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProductId, setReviewProductId] = useState('');
  const [reviewProductTitle, setReviewProductTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Invoice Modal State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Chat with Artisan State
  const [artisanChatModalOpen, setArtisanChatModalOpen] = useState(false);
  const [chatArtisanName, setChatArtisanName] = useState('');
  const [chatProductTitle, setChatProductTitle] = useState('');
  const [chatProductId, setChatProductId] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInputText, setChatInputText] = useState('');
  const [sendingChatMessage, setSendingChatMessage] = useState(false);

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const handleOpenArtisanChat = async (artisanName: string, productTitle: string, productId: string) => {
    setChatArtisanName(artisanName);
    setChatProductTitle(productTitle);
    setChatProductId(productId);
    setChatInputText('');
    setArtisanChatModalOpen(true);

    try {
      const res = await fetch('/api/customer-chats?customerId=user-customer-1');
      const data = await res.json();
      const existing = data.chats?.find((c: any) => c.productId === productId || c.artisanName.includes(artisanName.split(' ')[0]));
      if (existing) {
        setChatMessages(existing.messages || []);
      } else {
        setChatMessages([
          {
            sender: 'artisan',
            text: `Namaste! Thank you for ordering ${productTitle}. Feel free to ask any question regarding craft care, organic dye washing, or custom orders!`,
            time: 'Just now'
          }
        ]);
      }
    } catch {
      setChatMessages([]);
    }
  };

  const handleSendArtisanMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim() || sendingChatMessage) return;

    setSendingChatMessage(true);
    const newMsg = {
      sender: 'customer',
      text: chatInputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    const textToSend = chatInputText;
    setChatInputText('');

    try {
      await fetch('/api/customer-chats/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: currentUser.id,
          customerName: currentUser.name,
          artisanId: 'user-artisan-1',
          artisanName: chatArtisanName,
          productTitle: chatProductTitle,
          productId: chatProductId,
          text: textToSend,
          sender: 'customer'
        })
      });
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setSendingChatMessage(false);
    }
  };

  const fetchCustomerOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders?customerId=user-customer-1');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (productId: string, title: string) => {
    setReviewProductId(productId);
    setReviewProductTitle(title);
    setRating(5);
    setComment('');
    setReviewSubmitted(false);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: reviewProductId,
          userId: currentUser.id,
          userName: currentUser.name,
          rating,
          comment
        })
      });
      setReviewSubmitted(true);
      setTimeout(() => {
        setReviewModalOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Review failed', err);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 border border-[#2D5A27]/15 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E6B325] shadow-xs"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              {t.welcomeBack}, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.consciousPatron}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-400 font-medium mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.supportedVillagesCount}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('marketplace')}
          className="px-4 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <span>{t.exploreMoreCrafts}</span>
          <ArrowRight className="w-4 h-4 text-[#E6B325] dark:text-amber-300" />
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-serif">
            {t.myOrders} ({orders.length})
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">{t.livePostalTrackingAvailable}</span>
        </div>

        {loading ? (
          <div className="text-xs text-slate-400 py-12 text-center">{t.loading}</div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.noOrdersYet}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {t.browseVillageCatalog}
            </p>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="px-4 py-2 rounded-xl bg-[#2D5A27] dark:bg-emerald-600 text-white text-xs font-semibold hover:bg-[#1E3D1A] dark:hover:bg-emerald-500 cursor-pointer"
            >
              {t.shopVillageMarketplace}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:border-[#2D5A27]/30 dark:hover:border-emerald-500/30 transition-all"
              >
                {/* Order Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-white">{order.id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono font-bold text-[#2D5A27] dark:text-emerald-400 bg-[#2D5A27]/10 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      {order.trackingId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.orderStatus === 'delivered' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' :
                      order.orderStatus === 'out_for_delivery' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300' :
                      order.orderStatus === 'dispatched' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300' :
                      'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    }`}>
                      {order.orderStatus === 'delivered' ? t.deliveredSuccess : order.orderStatus === 'out_for_delivery' ? t.outForDeliveryStatus : order.orderStatus === 'dispatched' ? t.inTransit : order.orderStatus}
                    </span>

                    <button
                      onClick={() => onTrackOrder(order.trackingId)}
                      className="px-3 py-1 rounded-lg bg-[#2D5A27] dark:bg-emerald-600 text-white hover:bg-[#1E3D1A] dark:hover:bg-emerald-500 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Truck className="w-3.5 h-3.5 text-[#E6B325] dark:text-amber-300" />
                      <span>{t.trackConsignment}</span>
                    </button>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 bg-[#F8F5F0]/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                      <SafeProductImage
                        src={item.imageUrl}
                        alt={item.title}
                        compact
                        containerClassName="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                        className="w-full h-full object-cover"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.artisanName}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-serif font-bold text-slate-800 dark:text-slate-200">₹{item.price} × {item.quantity}</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleOpenArtisanChat(item.artisanName || 'Verified Seller', item.title, item.productId)}
                              className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-[#2D5A27] dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3 text-[#2D5A27] dark:text-emerald-400" />
                              <span>{t.contactSeller}</span>
                            </button>
                            <button
                              onClick={() => handleOpenReview(item.productId, item.title)}
                              className="text-[11px] font-semibold text-[#2D5A27] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Star className="w-3 h-3 text-[#E6B325] fill-current" />
                              <span>{t.writeReview}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery and Escrow Status Strip */}
                <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-[#2D5A27] dark:text-emerald-400" />
                      <span>{t.hubPickup}: <strong>{order.currentHub}</strong></span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {t.handoffOtp}: <strong className="font-mono text-slate-700 dark:text-slate-200">{order.deliveryOtp}</strong> · {t.logisticsPartner}: {order.deliveryPartner}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">{t.payableTotal} (UPI)</div>
                      <div className="text-base font-bold font-serif text-[#2D5A27] dark:text-emerald-400">₹{order.totalAmount}</div>
                    </div>

                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t.gstReceipt}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.reviewArtisanProduct}</h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#2D5A27] dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">{t.thankYouFeedback}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your feedback has been published and sent to the artisan.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {t.productTitleLabel}
                  </label>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{reviewProductTitle}</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {t.yourRating}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                          num <= rating ? 'text-[#E6B325]' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {t.yourReviewExperience}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.reviewPlaceholder}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md cursor-pointer"
                >
                  {t.submitVerifiedReview}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4">
            
            <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xl font-bold font-serif text-[#2D5A27] dark:text-emerald-400">{t.appName} {t.taxInvoice}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.gstReceipt}</div>
              </div>
              <button onClick={() => setSelectedInvoiceOrder(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-2 bg-[#F8F5F0] p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 text-[10px]">Invoice Ref:</span>
                  <div className="font-semibold text-slate-800">{selectedInvoiceOrder.id}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">NPCI UPI Ref:</span>
                  <div className="font-mono text-slate-800 font-semibold">{selectedInvoiceOrder.upiRefId}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Buyer Name:</span>
                  <div className="font-medium text-slate-800">{selectedInvoiceOrder.customerName}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Date:</span>
                  <div className="text-slate-800">{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2 pt-2">
                <div className="font-semibold text-slate-800 dark:text-slate-200">{t.shipmentContents}</div>
                {selectedInvoiceOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span>{it.quantity}x {it.title} ({it.artisanName})</span>
                    <span className="font-bold">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Fair Trade Split Breakdown */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 space-y-1.5 text-[11px]">
                <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.fairTradeShareNotice}</span>
                </div>
                <div className="flex justify-between text-emerald-800 dark:text-emerald-300">
                  <span>{t.trustFairTrade} (86%):</span>
                  <span className="font-bold">₹{Math.round(selectedInvoiceOrder.totalAmount * 0.86)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 dark:text-emerald-300">
                  <span>{t.trustPostalRelay} (11%):</span>
                  <span>₹{Math.round(selectedInvoiceOrder.totalAmount * 0.11)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 dark:text-emerald-300">
                  <span>{t.appName} (3%):</span>
                  <span>₹{Math.round(selectedInvoiceOrder.totalAmount * 0.03)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 font-bold text-sm">
                <span>{t.totalAmount}:</span>
                <span className="font-serif text-[#2D5A27] dark:text-emerald-400 text-lg">₹{selectedInvoiceOrder.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="w-full py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Direct Chat with Artisan Modal */}
      {artisanChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex flex-col h-[520px]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.contactSeller}: {chatArtisanName}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{chatProductTitle}</p>
                </div>
              </div>
              <button 
                onClick={() => setArtisanChatModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs bg-[#F8F5F0]/60 p-3 rounded-2xl my-2 border border-slate-100">
              {chatMessages.map((m: any, idx: number) => {
                const isCustomer = m.sender === 'customer';
                return (
                  <div key={idx} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                      isCustomer ? 'bg-[#2D5A27] text-white shadow-xs' : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
                    }`}>
                      <div className="flex items-center justify-between text-[10px] opacity-70 mb-1">
                        <span className="font-semibold">{isCustomer ? 'You (Arjun)' : chatArtisanName}</span>
                        <span>{m.time}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendArtisanMessage} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Ask about custom dimensions, washing care, or wedding bulk orders..."
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
              />
              <button
                type="submit"
                disabled={!chatInputText.trim() || sendingChatMessage}
                className="px-4 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <span>Send</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
