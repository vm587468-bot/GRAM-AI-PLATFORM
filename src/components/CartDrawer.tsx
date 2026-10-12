import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const { cart, removeFromCart, updateQuantity, subtotal, isCartOpen, setIsCartOpen, totalItems } = useCart();
  const { t } = useLanguage();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 1000;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-100 shadow-2xl flex flex-col transition-colors">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-[#F8F5F0] dark:bg-slate-900/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#2D5A27] dark:text-emerald-400" />
              <h3 className="font-bold text-base text-[#2D5A27] dark:text-emerald-400 font-serif">
                {t.cart} ({totalItems})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Alert Bar */}
          <div className="bg-[#E6B325]/15 dark:bg-amber-950/30 border-b border-[#E6B325]/30 dark:border-amber-700/40 px-4 py-2 text-xs text-[#2D5A27] dark:text-amber-300">
            {remainingForFree > 0 ? (
              <span>Add <strong>₹{remainingForFree}</strong> more for <strong>{t.freeDeliveryBadge}</strong>!</span>
            ) : (
              <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.freeDeliveryBadge} ({t.directVillageDelivery})!</span>
              </span>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t.cartEmpty}</p>
                <p className="text-xs max-w-xs mx-auto">
                  {t.fairTradeShareNotice}
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8F5F0]/50 dark:bg-slate-800/70 hover:border-[#2D5A27]/20 dark:hover:border-emerald-500/30 transition-all"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{item.product.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.product.artisanName}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-sm text-[#2D5A27] dark:text-emerald-300">
                        ₹{item.product.price * item.quantity}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-0.5 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold text-xs min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.trustFairTrade} (~86%)</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">₹{Math.round(subtotal * 0.86)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.deliveryFee}</span>
                  <span>{subtotal >= 1000 ? <strong className="text-emerald-700 dark:text-emerald-400">{t.freeDeliveryBadge}</strong> : '₹60'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                  <span>{t.totalAmount}</span>
                  <span className="text-[#2D5A27] dark:text-emerald-300 font-serif text-lg">
                    ₹{subtotal + (subtotal >= 1000 ? 0 : 60)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{t.checkout}</span>
                <ArrowRight className="w-4 h-4 text-[#E6B325]" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A27] dark:text-emerald-400" />
                <span>{t.upiPayment}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
