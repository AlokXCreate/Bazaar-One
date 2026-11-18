import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { formatDateTime } from '../../utils/formatters';
import { documentExportService } from '../../services/documentExportService';
import {
  Package,
  Store,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  FileText,
  ArrowLeft,
  Navigation,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface OrderTrackingProps {
  onOpenReportModal?: (order: any) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingProps> = ({ onOpenReportModal }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useCart();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Package className="w-12 h-12 text-stone-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link to="/orders" className="text-xs text-bazaar-maroon font-bold mt-2 inline-block">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'placed', label: 'Order Confirmed', desc: 'Order and digital payment verified' },
    { key: 'accepted_by_shop', label: 'Accepted by Merchant', desc: 'Store started packing items' },
    { key: 'preparing', label: 'Prepared & Checked', desc: 'Quality checked and packed' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider on the way to your doorstep' },
    { key: 'delivered', label: 'Delivered', desc: 'Handed over successfully' },
  ];

  const getStepStatus = (stepKey: string) => {
    const orderStatusOrder = ['placed', 'accepted_by_shop', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = orderStatusOrder.indexOf(order.orderStatus);
    const targetIndex = orderStatusOrder.indexOf(stepKey);

    if (targetIndex <= currentIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-bazaar-maroon transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Orders</span>
      </Link>

      {/* Main Order Card */}
      <div className="rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-card overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-bazaar-maroon/10 via-amber-500/10 to-transparent border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-xl text-stone-900 dark:text-white">
                {order.id}
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-bazaar-maroon text-white uppercase">
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Placed on {formatDateTime(order.createdAt)} • Merchant: <strong>{order.shopName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                documentExportService.exportPDF({
                  type: 'invoice',
                  title: `Bazaar One Tax Invoice - ${order.id}`,
                  order,
                })
              }
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs shadow-sm hover:bg-stone-50 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-bazaar-maroon" />
              <span>Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Live Timeline */}
        <div className="p-6 sm:p-8 border-b border-stone-200 dark:border-stone-800">
          <h3 className="font-extrabold text-base text-stone-900 dark:text-white mb-6 font-display">
            Live Order Progress
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {steps.map((st, i) => {
              const status = getStepStatus(st.key);
              const isDone = status === 'completed';

              return (
                <div key={st.key} className="flex md:flex-col items-center md:items-start gap-4 md:gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold ${isDone ? 'text-stone-900 dark:text-white' : 'text-stone-400'}`}>
                      {st.label}
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-tight hidden md:block mt-0.5">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Partner Info */}
        {order.deliveryPartnerName && (
          <div className="p-6 bg-stone-50/60 dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Assigned Delivery Partner
                </span>
                <h4 className="font-extrabold text-sm text-stone-900 dark:text-white">
                  {order.deliveryPartnerName}
                </h4>
                <span className="text-xs text-stone-500">{order.deliveryPartnerPhone}</span>
              </div>
            </div>

            <a
              href={`tel:${order.deliveryPartnerPhone}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bazaar-green hover:bg-emerald-700 text-white font-bold text-xs shadow transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </a>
          </div>
        )}

        {/* Order Items & Breakdown */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-4">
              Order Items ({order.items.length})
            </h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700"
                    />
                    <div>
                      <span className="font-bold block">{item.name}</span>
                      <span className="text-stone-400">
                        {item.quantity} {item.unit} × {formatINR(item.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold font-display text-stone-800 dark:text-stone-200">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Destination and Billing Summary */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs space-y-2">
              <h5 className="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                Delivery Address:
              </h5>
              <p className="text-stone-600 dark:text-stone-300">
                {order.deliveryAddress.street}, {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
              </p>
              {order.deliveryInstructions && (
                <p className="text-stone-400 italic">"{order.deliveryInstructions}"</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal:</span>
                <span className="font-semibold">{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery Fee:</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : formatINR(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">GST:</span>
                <span>{formatINR(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>- {formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-stone-800">
                <span>Grand Total:</span>
                <span className="text-base text-bazaar-maroon dark:text-bazaar-saffron font-display">
                  {formatINR(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
