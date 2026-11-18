import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, Store, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalDeliveryFee,
    totalTax,
    totalDiscount,
    grandTotal,
    vendorSplits,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 shadow-2xl flex flex-col justify-between border-l border-stone-200 dark:border-stone-800 animate-slide-up">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-850">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-bazaar-maroon dark:text-bazaar-saffron" />
              <h2 className="text-lg font-bold text-stone-900 dark:text-white font-display">
                Shopping Cart
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-bazaar-maroon text-white font-bold">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-500 hover:text-rose-600 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4 text-stone-300 dark:text-stone-600">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-base text-stone-800 dark:text-stone-200 mb-1">
                  Your Cart is Empty
                </h3>
                <p className="text-xs max-w-xs mb-6">
                  Explore fresh produce from traditional mandis or everyday groceries from modern supermarkets.
                </p>
                <Link
                  to="/marketplace"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-bazaar-maroon text-white text-xs font-bold shadow hover:bg-bazaar-maroon-700 transition-colors"
                >
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              <>
                {/* Vendor Split Notice */}
                {vendorSplits.length > 1 && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-bold">Multi-Vendor Cart:</span> You have items from{' '}
                    {vendorSplits.length} different shops. Orders will be prepared independently by each merchant.
                  </div>
                )}

                {/* Vendor Groups */}
                {vendorSplits.map((split) => (
                  <div
                    key={split.shopId}
                    className="border border-stone-200 dark:border-stone-800 rounded-2xl p-4 bg-stone-50/40 dark:bg-stone-850/50 space-y-3"
                  >
                    {/* Shop Header */}
                    <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron">
                        <Store className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[200px]">{split.shopName}</span>
                      </div>
                      <span className="text-xs text-stone-500 font-medium">
                        Subtotal: {formatINR(split.subtotal)}
                      </span>
                    </div>

                    {/* Shop Items */}
                    <div className="space-y-3">
                      {split.items.map((item) => (
                        <div key={item.product.id} className="flex gap-3 items-center">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-xl object-cover border border-stone-200 dark:border-stone-700 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-[11px] text-stone-500">
                              {formatINR(item.product.price)} / {item.product.unit}
                            </p>
                            <span className="text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron">
                              {formatINR(item.product.price * item.quantity)}
                            </span>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-900">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-stone-100 dark:hover:bg-stone-800"
                            >
                              <Minus className="w-3 h-3 text-stone-500" />
                            </button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-stone-100 dark:hover:bg-stone-800"
                            >
                              <Plus className="w-3 h-3 text-stone-500" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Coupon Code Input */}
                <div className="pt-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span>Coupon {appliedCoupon} Applied!</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-emerald-900 dark:text-emerald-200 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. BAZAAR50, DESI20)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl uppercase font-semibold"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold bg-stone-800 hover:bg-stone-900 text-white rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer / Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span>
                    {totalDeliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatINR(totalDeliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Applicable GST:</span>
                  <span>{formatINR(totalTax)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount:</span>
                    <span>- {formatINR(totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span>Grand Total:</span>
                  <span className="text-base text-bazaar-maroon dark:text-bazaar-saffron font-display">
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3 rounded-xl font-bold text-sm bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white shadow-lg shadow-bazaar-maroon/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Proceed to Checkout ({formatINR(grandTotal)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
