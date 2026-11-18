import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { formatDateTime } from '../../utils/formatters';
import { documentExportService } from '../../services/documentExportService';
import { Package, Truck, Store, FileText, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrdersPageProps {
  onOpenReportModal?: (orderId: string, shopName: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = () => {
  const { orders } = useCart();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Delivered</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">Out for Delivery</span>;
      case 'preparing':
      case 'accepted_by_shop':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Preparing Order</span>;
      case 'placed':
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300">Order Placed</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 dark:text-white">
          My Orders & Live Tracking
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Track live dispatch progress, download official tax receipts, and view purchase history
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3">
          <Package className="w-16 h-16 text-stone-400 mx-auto" />
          <h3 className="font-bold text-base text-stone-800 dark:text-stone-200">No Orders Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Place your first order from authentic traditional shops or modern hypermarkets!
          </p>
          <Link
            to="/marketplace"
            className="px-5 py-2.5 rounded-xl bg-bazaar-maroon text-white font-bold text-xs inline-block shadow"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden"
            >
              {/* Order Card Header */}
              <div className="p-4 sm:p-5 bg-stone-50/70 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-stone-900 dark:text-white">
                      {order.id}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <span className="text-stone-400 text-[11px] mt-0.5 block">
                    Placed on {formatDateTime(order.createdAt)} • Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                  </span>
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-bazaar-maroon" />
                    <span>Download Invoice (PDF)</span>
                  </button>

                  <Link
                    to={`/orders/${order.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    <span>Track Status</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items & Store details */}
              <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron">
                    <Store className="w-4 h-4" />
                    <span>{order.shopName}</span>
                  </div>

                  {/* Item thumbs */}
                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 dark:border-stone-700"
                        />
                        <div>
                          <span className="font-semibold block truncate max-w-[150px]">{item.name}</span>
                          <span className="text-stone-400 text-[11px]">
                            {item.quantity} {item.unit} × {formatINR(item.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-right border-t md:border-t-0 md:border-l border-stone-200 dark:border-stone-800 pt-3 md:pt-0 md:pl-6 w-full md:w-auto flex md:flex-col justify-between md:justify-center items-end">
                  <span className="text-xs text-stone-400">Total Paid</span>
                  <span className="text-lg font-extrabold text-stone-900 dark:text-white font-display">
                    {formatINR(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
