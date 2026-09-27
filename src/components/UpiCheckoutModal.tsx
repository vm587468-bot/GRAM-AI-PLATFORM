import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface UpiCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (orderId: string, trackingId: string) => void;
}

export const UpiCheckoutModal: React.FC<UpiCheckoutModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const { cart, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [address, setAddress] = useState('42, 12th Main, 4th Cross, Indiranagar, Bengaluru, KA 560038');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98112 34567');
  const [selectedApp, setSelectedApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [createdOrderDetails, setCreatedOrderDetails] = useState<{ id: string; trackingId: string } | null>(null);

  if (!isOpen) return null;

  const upiId = 'gramai.merchants@sbi';
  const shippingFee = subtotal > 1000 ? 0 : 60;
  const totalAmount = subtotal + shippingFee;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleApprovePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Verify simulated payment with backend
      const payRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txnId: `TXN${Date.now()}`,
          upiRefId: `UPI-NPCI-${Math.floor(100000000 + Math.random() * 900000000)}`
        })
      });
      const payData = await payRes.json();

      // 2. Create Order in backend
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
        artisanName: item.product.artisanName
      }));

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: currentUser.id,
          customerName: currentUser.name,
          customerPhone: phone,
          shippingAddress: address,
          items: orderItems,
          totalAmount,
          paymentMethod: 'UPI',
          upiRefId: payData.bankRef
        })
      });

      const orderData = await orderRes.json();
      setCreatedOrderDetails({
        id: orderData.order.id,
        trackingId: orderData.order.trackingId
      });
      setPaymentDone(true);
      clearCart();
    } catch (err) {
      console.error('Payment error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#2D5A27]/20 p-6 text-[#2C2C2C]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2D5A27] text-[#E6B325] flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#2D5A27]">
                {paymentDone ? 'Payment Successful!' : 'Direct UPI Escrow Checkout'}
              </h3>
              <p className="text-xs text-slate-500">
                {paymentDone ? 'Order placed directly with village producers' : 'NPCI Unified Payments Interface · Zero Platform Cut'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentDone && createdOrderDetails ? (
          /* Payment Confirmation View */
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-[#2D5A27] rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">₹{totalAmount} Paid via UPI</h4>
              <p className="text-xs text-emerald-700 font-medium mt-1">
                Verified by NPCI Escrow & Settled to Artisan Account
              </p>
            </div>

            <div className="bg-[#F8F5F0] p-4 rounded-xl text-left text-xs space-y-2 border border-[#2D5A27]/10">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-semibold text-slate-800">{createdOrderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Relay Tracking Code:</span>
                <span className="font-mono font-bold text-[#2D5A27]">{createdOrderDetails.trackingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deliver To:</span>
                <span className="font-medium text-slate-800 truncate max-w-[220px]">{address}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="font-semibold text-slate-800">4 Business Days via Gram Express</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onPaymentSuccess(createdOrderDetails.id, createdOrderDetails.trackingId);
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#2D5A27] text-white font-semibold text-sm hover:bg-[#1E3D1A] transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>Track Live Consignment ({createdOrderDetails.trackingId})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Payment Form View */
          <div className="space-y-5 pt-4 text-xs">
            {/* Delivery Details */}
            <div className="space-y-2 bg-[#F8F5F0] p-3.5 rounded-xl border border-[#2D5A27]/10">
              <label className="block text-[11px] font-semibold text-[#2D5A27] uppercase tracking-wider">
                Delivery Address & Contact
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#2D5A27]"
                placeholder="Door number, street, city, pin code..."
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#2D5A27]"
                  placeholder="Delivery Phone / WhatsApp number"
                />
              </div>
            </div>

            {/* UPI QR & Payment Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              {/* Dynamic QR Code representation */}
              <div className="flex flex-col items-center justify-center p-3 bg-white border-2 border-dashed border-[#2D5A27]/30 rounded-xl">
                <div className="w-36 h-36 bg-white p-2 rounded-lg flex items-center justify-center shadow-inner relative">
                  {/* Clean SVG QR pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#2D5A27]">
                    <rect width="100" height="100" fill="white" />
                    {/* Corner Position Detection Patterns */}
                    <rect x="5" y="5" width="26" height="26" fill="#2D5A27" rx="2" />
                    <rect x="9" y="9" width="18" height="18" fill="white" rx="1" />
                    <rect x="13" y="13" width="10" height="10" fill="#2D5A27" />

                    <rect x="69" y="5" width="26" height="26" fill="#2D5A27" rx="2" />
                    <rect x="73" y="9" width="18" height="18" fill="white" rx="1" />
                    <rect x="77" y="13" width="10" height="10" fill="#2D5A27" />

                    <rect x="5" y="69" width="26" height="26" fill="#2D5A27" rx="2" />
                    <rect x="9" y="73" width="18" height="18" fill="white" rx="1" />
                    <rect x="13" y="77" width="10" height="10" fill="#2D5A27" />

                    {/* QR Matrix Elements */}
                    <rect x="36" y="8" width="6" height="6" fill="#2D5A27" />
                    <rect x="46" y="8" width="6" height="6" fill="#2D5A27" />
                    <rect x="56" y="12" width="8" height="8" fill="#2D5A27" />
                    <rect x="36" y="22" width="8" height="8" fill="#2D5A27" />
                    <rect x="48" y="24" width="6" height="6" fill="#2D5A27" />
                    <rect x="36" y="36" width="28" height="28" fill="#E6B325" rx="3" />
                    <rect x="44" y="44" width="12" height="12" fill="#2D5A27" />

                    <rect x="8" y="36" width="6" height="8" fill="#2D5A27" />
                    <rect x="18" y="44" width="8" height="6" fill="#2D5A27" />
                    <rect x="8" y="54" width="10" height="6" fill="#2D5A27" />

                    <rect x="72" y="36" width="8" height="8" fill="#2D5A27" />
                    <rect x="84" y="44" width="8" height="8" fill="#2D5A27" />
                    <rect x="72" y="56" width="8" height="6" fill="#2D5A27" />

                    <rect x="36" y="72" width="6" height="10" fill="#2D5A27" />
                    <rect x="48" y="70" width="10" height="8" fill="#2D5A27" />
                    <rect x="62" y="76" width="8" height="8" fill="#2D5A27" />
                    <rect x="74" y="72" width="8" height="8" fill="#2D5A27" />
                    <rect x="86" y="82" width="6" height="6" fill="#2D5A27" />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-[#2D5A27] text-[#E6B325] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      UPI
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-2 font-medium">
                  Scan with any UPI Banking App
                </span>
              </div>

              {/* Amount Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="bg-[#F8F5F0] p-3 rounded-lg border border-[#2D5A27]/10">
                  <div className="text-slate-500 text-[11px]">Payable Total:</div>
                  <div className="text-2xl font-bold text-[#2D5A27] font-serif">₹{totalAmount}</div>
                  <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>86% (₹{Math.round(totalAmount * 0.86)}) directly to artisan</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal ({cart.length}):</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rural Eco-Delivery:</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}</span>
                  </div>
                </div>

                {/* VPA copy button */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-mono text-[11px] text-slate-700">{upiId}</span>
                  <button 
                    onClick={handleCopyUpi}
                    className="text-[#2D5A27] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Select Preferred UPI App */}
            <div>
              <span className="text-[11px] font-semibold text-slate-700 block mb-2">
                Or Tap to Pay with UPI App:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'gpay', name: 'Google Pay', color: 'border-blue-300 text-blue-800' },
                  { id: 'phonepe', name: 'PhonePe', color: 'border-purple-300 text-purple-800' },
                  { id: 'paytm', name: 'Paytm UPI', color: 'border-cyan-300 text-cyan-800' },
                  { id: 'bhim', name: 'BHIM UPI', color: 'border-emerald-300 text-emerald-800' }
                ].map(app => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app.id as any)}
                    className={`py-2 px-2 rounded-xl text-center border text-[11px] font-semibold transition-all ${
                      selectedApp === app.id
                        ? 'border-[#2D5A27] bg-[#2D5A27]/10 text-[#2D5A27] ring-1 ring-[#2D5A27]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Instant Confirmation Action */}
            <div className="pt-2">
              <button
                onClick={handleApprovePayment}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E6B325]" />
                    <span>Verifying with NPCI Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#E6B325]" />
                    <span>Confirm UPI Payment (₹{totalAmount})</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                Protected by Gram AI Rural Escrow Protocol · 100% Refund Guarantee on In-transit Damage
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
