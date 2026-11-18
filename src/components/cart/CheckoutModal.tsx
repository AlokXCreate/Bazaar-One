import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/currency';
import { isValidIndianPincode } from '../../utils/formatters';
import { PaymentMethod } from '../../types';
import { paymentService } from '../../services/paymentService';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  QrCode,
  Banknote,
  Truck,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { grandTotal, subtotal, totalDeliveryFee, totalTax, totalDiscount, placeOrder } = useCart();
  const navigate = useNavigate();

  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [street, setStreet] = useState(user?.address?.street || 'Flat 402, Sai Vihar Apartment');
  const [area, setArea] = useState(user?.address?.area || 'Sadashiv Peth');
  const [city, setCity] = useState(user?.address?.city || 'Pune');
  const [pincode, setPincode] = useState(user?.address?.pincode || '411030');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiIdInput, setUpiIdInput] = useState('customer@oksbi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdOrderIds, setCreatedOrderIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('bazaarone.pay@hdfcbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (fulfillmentType === 'delivery' && !isValidIndianPincode(pincode)) {
      alert('Please enter a valid 6-digit Indian PIN code (e.g. 411030)');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'razorpay') {
        await paymentService.processRazorpayPayment({
          amountINR: grandTotal,
          orderId: 'ORD-' + Date.now(),
          customerName: user?.displayName || 'Customer',
          customerEmail: user?.email || 'customer@bazaarone.in',
          customerPhone: user?.phoneNumber || '+91 98221 00000',
        });
      } else if (paymentMethod === 'upi') {
        await paymentService.verifyUpiPayment('UPI-TEST-' + Date.now());
      }

      const res = await placeOrder({
        address: { street, area, city, pincode },
        fulfillmentType,
        paymentMethod,
        instructions,
      });

      if (res.success) {
        setCreatedOrderIds(res.orderIds);
        setIsCompleted(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7A263A', '#F4A340', '#276749', '#D9A441'],
        });
      }
    } catch (err: any) {
      alert('Order placement failed: ' + (err.message || 'Payment interrupted'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isProcessing) {
          setIsCompleted(false);
          onClose();
        }
      }}
      title={isCompleted ? 'Order Confirmed!' : 'Secure Checkout & Payment'}
      subtitle={
        isCompleted
          ? 'Thank you for supporting verified local merchants on Bazaar One'
          : `Total Amount Payable: ${formatINR(grandTotal)}`
      }
      maxWidth="lg"
    >
      {isCompleted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-extrabold text-stone-900 dark:text-white font-display">
            Payment & Order Placed Successfully!
          </h3>

          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
            Your orders have been transmitted to the merchants. You will receive live order updates and can track dispatch status in real-time.
          </p>

          <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl max-w-xs mx-auto text-xs">
            <span className="text-stone-500">Order ID(s):</span>
            <div className="font-mono font-bold text-bazaar-maroon dark:text-bazaar-saffron mt-1">
              {createdOrderIds.join(', ')}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setIsCompleted(false);
                onClose();
                navigate('/orders');
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white shadow"
            >
              Track Order Live
            </button>
            <button
              onClick={() => {
                setIsCompleted(false);
                onClose();
                navigate('/marketplace');
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="space-y-5">
          {/* Fulfillment Toggle */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
              Fulfillment Preference:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  fulfillmentType === 'delivery'
                    ? 'border-bazaar-maroon bg-bazaar-maroon/10 text-bazaar-maroon'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Doorstep Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  fulfillmentType === 'pickup'
                    ? 'border-bazaar-maroon bg-bazaar-maroon/10 text-bazaar-maroon'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Store Counter Pickup</span>
              </button>
            </div>
          </div>

          {/* Delivery Address */}
          {fulfillmentType === 'delivery' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
              <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                Delivery Address in India
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Flat, House no., Building"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  required
                />
                <input
                  type="text"
                  placeholder="Area / Colony / Street"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                  required
                />
                <input
                  type="text"
                  placeholder="6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Special delivery instructions (e.g. Ring bell, leave with security)"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 mt-2"
              />
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              Select Payment Method:
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-bazaar-saffron bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-white font-bold ring-2 ring-bazaar-saffron'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                <QrCode className="w-5 h-5 text-bazaar-saffron" />
                <span className="text-xs">UPI / GPay / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-stone-900 dark:text-white font-bold ring-2 ring-blue-500'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Cards / Razorpay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-stone-900 dark:text-white font-bold ring-2 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">Cash on Delivery</span>
              </button>
            </div>

            {/* UPI Details Box */}
            {paymentMethod === 'upi' && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-stone-850 border border-bazaar-saffron/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 dark:text-stone-300 font-medium">Bazaar One Official VPA:</span>
                  <div className="flex items-center gap-1.5">
                    <code className="bg-white dark:bg-stone-900 px-2 py-0.5 rounded font-mono font-bold text-bazaar-maroon dark:text-bazaar-saffron">
                      bazaarone.pay@hdfcbank
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUPI}
                      className="p-1 hover:text-bazaar-maroon transition-colors"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200 dark:border-stone-800">
                  <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded flex items-center justify-center flex-shrink-0 border border-stone-300 dark:border-stone-700">
                    <QrCode className="w-12 h-12 text-stone-800 dark:text-stone-200" />
                  </div>
                  <div className="text-[11px] text-stone-500 leading-tight">
                    <p className="font-semibold text-stone-800 dark:text-stone-200">Instant UPI Payment</p>
                    <p>Supports Google Pay, PhonePe, Paytm, BHIM and all major bank apps.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Amount Breakdown Summary */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 space-y-1">
            <div className="flex justify-between">
              <span>Items Total:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>{totalDeliveryFee === 0 ? 'FREE' : formatINR(totalDeliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (GST):</span>
              <span>{formatINR(totalTax)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount Applied:</span>
                <span>- {formatINR(totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-stone-900 dark:text-white pt-1">
              <span>Total Payable:</span>
              <span className="text-base text-bazaar-maroon dark:text-bazaar-saffron font-display">
                {formatINR(grandTotal)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 rounded-xl font-extrabold text-sm bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Confirming with Gateway...</span>
            ) : (
              <span>Confirm & Pay {formatINR(grandTotal)}</span>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
};
