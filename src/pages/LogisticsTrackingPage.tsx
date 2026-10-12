import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Package, 
  ShieldCheck, 
  Phone, 
  Key, 
  Building2,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LogisticsTrackingPageProps {
  initialTrackingId?: string;
  setActiveTab: (tab: string) => void;
}

export const LogisticsTrackingPage: React.FC<LogisticsTrackingPageProps> = ({ 
  initialTrackingId = 'GRAM-88219',
  setActiveTab
}) => {
  const { t } = useLanguage();
  const [trackingInput, setTrackingInput] = useState(initialTrackingId);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialTrackingId) {
      setTrackingInput(initialTrackingId);
      performTrack(initialTrackingId);
    }
  }, [initialTrackingId]);

  const performTrack = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/deliveries/track/${code.trim()}`);
      const data = await res.json();
      if (data.found) {
        setTrackingData(data);
      } else {
        setTrackingData(null);
        setErrorMsg(data.message || 'Tracking ID not found');
      }
    } catch (err) {
      console.error('Tracking fetch error', err);
      setErrorMsg('Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performTrack(trackingInput);
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-[#2D5A27] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-md">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E6B325]">
            <Truck className="w-3.5 h-3.5" />
            <span>Gram Express & India Post Rural Relay</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            {t.logisticsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            {t.logisticsSubtitle}
          </p>
        </div>
      </div>

      {/* Tracking Input Card */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder={t.trackPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2D5A27] font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#E6B325]" />
            <span>{t.trackOrder}</span>
          </button>
        </form>

        {/* Quick Sample Tracking Codes */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
          <span>Try sample tracking codes:</span>
          <button
            onClick={() => { setTrackingInput('GRAM-88219'); performTrack('GRAM-88219'); }}
            className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#2D5A27] font-mono font-semibold cursor-pointer"
          >
            GRAM-88219 (Out for Delivery)
          </button>
          <button
            onClick={() => { setTrackingInput('GRAM-77401'); performTrack('GRAM-77401'); }}
            className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#2D5A27] font-mono font-semibold cursor-pointer"
          >
            GRAM-77401 (Delivered)
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-slate-400 text-xs space-y-2">
          <Truck className="w-8 h-8 animate-bounce mx-auto text-[#2D5A27]" />
          <p>Querying Gram Nodal Relay Network...</p>
        </div>
      )}

      {errorMsg && !loading && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {trackingData && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Status Overview Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.orderConsignment}</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#2D5A27] dark:text-emerald-400">
                  {trackingData.order.trackingId}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Recipient: <strong>{trackingData.order.customerName}</strong> · Deliver to: {trackingData.order.shippingAddress}
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.orderEstimatedDelivery}</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {trackingData.order.deliveryDateEstimated}
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  trackingData.order.orderStatus === 'delivered' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' :
                  'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                }`}>
                  {trackingData.order.orderStatus === 'delivered' ? t.deliveredSuccess : trackingData.order.orderStatus === 'out_for_delivery' ? t.outForDeliveryStatus : t.inTransit}
                </span>
              </div>
            </div>

            {/* Delivery Partner & Secure OTP Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8F5F0] dark:bg-slate-800/80 p-4 rounded-2xl border border-[#2D5A27]/10 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-semibold">{t.logisticsPartner}</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{trackingData.partner.name}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">{trackingData.partner.vehicle}</div>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-semibold">{t.deliveryAgent}</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#2D5A27] dark:text-emerald-400" />
                  <span>{trackingData.partner.agent}</span>
                </div>
                <div className="text-emerald-700 dark:text-emerald-400 text-[11px]">Vaccinated & Identity Verified</div>
              </div>

              <div className="sm:border-l sm:pl-4 border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-semibold">{t.handoffOtp}</span>
                <div className="font-mono text-lg font-bold text-[#2D5A27] dark:text-emerald-400 tracking-widest mt-0.5 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-[#E6B325] dark:text-amber-300" />
                  <span>{trackingData.partner.otp}</span>
                </div>
                <div className="text-slate-400 dark:text-slate-400 text-[10px]">{t.otpInstructions}</div>
              </div>
            </div>

            {/* Milestone Step-by-Step Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.transitMilestones}</h3>
              
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {trackingData.stages.map((stage: any) => {
                  const isDone = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <div key={stage.step} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center ${
                        isDone ? 'border-[#2D5A27] dark:border-emerald-500 bg-[#2D5A27] dark:bg-emerald-500' :
                        isCurrent ? 'border-[#E6B325] dark:border-amber-400 bg-[#E6B325] ring-4 ring-[#E6B325]/20 animate-pulse' :
                        'border-slate-300 dark:border-slate-700'
                      }`}>
                        {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className={`font-bold ${isCurrent ? 'text-[#2D5A27] dark:text-emerald-400' : isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                            {stage.step}. {stage.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">{stage.time}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{stage.location}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items inside this shipment */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.shipmentContents}:</h4>
              <div className="flex flex-wrap gap-3">
                {trackingData.order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                    <img src={item.imageUrl} alt={item.title} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{item.title}</div>
                      <div className="text-[10px] text-slate-400">Qty: {item.quantity} · Producer: {item.artisanName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Rural Relay Network Information Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#2D5A27]/10 dark:bg-emerald-950/60 text-[#2D5A27] dark:text-emerald-400 flex items-center justify-center font-bold">
            1
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white">Gram Nodal Aggregation</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Parcels are collected twice daily from village self-help groups and quality inspected using standardized non-plastic packaging.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#E6B325]/20 dark:bg-amber-950/60 text-[#C69516] dark:text-amber-300 flex items-center justify-center font-bold">
            2
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white">India Post Speed Post Sync</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            District postal sorting routes handle inter-state transit with priority tracking and tamper-evident barcode sealing.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#2D5A27]/10 dark:bg-emerald-950/60 text-[#2D5A27] dark:text-emerald-400 flex items-center justify-center font-bold">
            3
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white">Verified Doorstep Handover</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Zero-contact OTP verification triggers automatic fund release from escrow directly to the rural artisan's bank account.
          </p>
        </div>
      </div>

    </div>
  );
};
