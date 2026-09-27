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

interface LogisticsTrackingPageProps {
  initialTrackingId?: string;
  setActiveTab: (tab: string) => void;
}

export const LogisticsTrackingPage: React.FC<LogisticsTrackingPageProps> = ({ 
  initialTrackingId = 'GRAM-88219',
  setActiveTab
}) => {
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
            Live Village Consignment Tracking
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Track parcels as they travel from remote village self-help groups, through district postal hubs, to urban doorsteps.
          </p>
        </div>
      </div>

      {/* Tracking Input Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Enter Consignment or Order ID (e.g. GRAM-88219 or ORD-2026-901)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2D5A27] font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#E6B325]" />
            <span>Track Parcel</span>
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <div className="text-xs text-slate-500">Consignment Number</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#2D5A27]">
                  {trackingData.order.trackingId}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Recipient: <strong>{trackingData.order.customerName}</strong> · Deliver to: {trackingData.order.shippingAddress}
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className="text-xs text-slate-500">Estimated Doorstep Delivery</div>
                <div className="text-base font-bold text-slate-900">
                  {trackingData.order.deliveryDateEstimated}
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  trackingData.order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {trackingData.order.orderStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Delivery Partner & Secure OTP Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8F5F0] p-4 rounded-2xl border border-[#2D5A27]/10 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Logistics Partner</span>
                <div className="font-semibold text-slate-800 mt-0.5">{trackingData.partner.name}</div>
                <div className="text-slate-500 text-[11px]">{trackingData.partner.vehicle}</div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Delivery Agent</span>
                <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#2D5A27]" />
                  <span>{trackingData.partner.agent}</span>
                </div>
                <div className="text-emerald-700 text-[11px]">Vaccinated & Identity Verified</div>
              </div>

              <div className="sm:border-l sm:pl-4 border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Handoff Delivery OTP</span>
                <div className="font-mono text-lg font-bold text-[#2D5A27] tracking-widest mt-0.5 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-[#E6B325]" />
                  <span>{trackingData.partner.otp}</span>
                </div>
                <div className="text-slate-400 text-[10px]">Provide OTP to delivery partner upon inspection</div>
              </div>
            </div>

            {/* Milestone Step-by-Step Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-sm text-slate-900">Consignment Transit Milestones</h3>
              
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {trackingData.stages.map((stage: any) => {
                  const isDone = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <div key={stage.step} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        isDone ? 'border-[#2D5A27] bg-[#2D5A27]' :
                        isCurrent ? 'border-[#E6B325] bg-[#E6B325] ring-4 ring-[#E6B325]/20 animate-pulse' :
                        'border-slate-300'
                      }`}>
                        {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className={`font-bold ${isCurrent ? 'text-[#2D5A27]' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                            {stage.step}. {stage.title}
                          </h4>
                          <span className="text-[11px] text-slate-400">{stage.time}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{stage.location}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items inside this shipment */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Shipment Contents:</h4>
              <div className="flex flex-wrap gap-3">
                {trackingData.order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <img src={item.imageUrl} alt={item.title} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <div className="font-semibold text-slate-800 truncate max-w-[200px]">{item.title}</div>
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
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#2D5A27]/10 text-[#2D5A27] flex items-center justify-center font-bold">
            1
          </div>
          <h4 className="font-bold text-slate-900">Gram Nodal Aggregation</h4>
          <p className="text-slate-600 leading-relaxed">
            Parcels are collected twice daily from village self-help groups and quality inspected using standardized non-plastic packaging.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#E6B325]/20 text-[#C69516] flex items-center justify-center font-bold">
            2
          </div>
          <h4 className="font-bold text-slate-900">India Post Speed Post Sync</h4>
          <p className="text-slate-600 leading-relaxed">
            District postal sorting routes handle inter-state transit with priority tracking and tamper-evident barcode sealing.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#2D5A27]/10 text-[#2D5A27] flex items-center justify-center font-bold">
            3
          </div>
          <h4 className="font-bold text-slate-900">Verified Doorstep Handover</h4>
          <p className="text-slate-600 leading-relaxed">
            Zero-contact OTP verification triggers automatic fund release from escrow directly to the rural artisan's bank account.
          </p>
        </div>
      </div>

    </div>
  );
};
