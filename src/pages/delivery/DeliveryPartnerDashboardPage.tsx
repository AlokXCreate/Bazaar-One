import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { formatDateTime } from '../../utils/formatters';
import {
  Truck,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  DollarSign,
  PackageCheck,
  Store,
} from 'lucide-react';

export const DeliveryPartnerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useCart();

  // Find active deliveries
  const activeDeliveries = orders.filter(
    (o) => o.orderStatus === 'out_for_delivery' || o.orderStatus === 'ready_for_pickup' || o.orderStatus === 'preparing'
  );

  const completedDeliveries = orders.filter((o) => o.orderStatus === 'delivered');

  const totalEarnings = completedDeliveries.length * 40; // ₹40 delivery payout per order

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex-shrink-0 flex items-center justify-center">
            <Truck className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              Delivery Partner Fleet Hub • Active Rider
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              {user?.displayName || 'Rahul Jadhav'}
            </h1>
            <p className="text-xs text-stone-200 mt-1">
              Vehicle: Bajaj Pulsar 150 (MH 12 AB 4589) • Active Duty Zone: Pune Central
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
            <span className="text-[10px] text-stone-300 block uppercase font-bold">Rider Earnings</span>
            <span className="text-xl font-extrabold text-emerald-300 font-display">
              {formatINR(totalEarnings + 840)}
            </span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
            <span className="text-[10px] text-stone-300 block uppercase font-bold">Delivered</span>
            <span className="text-xl font-extrabold text-white font-display">
              {completedDeliveries.length + 18} Trips
            </span>
          </div>
        </div>
      </div>

      {/* Active Runs */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-900 dark:text-white font-display flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-emerald-600" />
          <span>Active Assigned Trips ({activeDeliveries.length})</span>
        </h3>

        {activeDeliveries.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-400">
            <Truck className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No pending delivery runs currently assigned.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDeliveries.map((ord) => (
              <div
                key={ord.id}
                className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-stone-900 dark:text-white">
                        {ord.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase animate-pulse">
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-stone-400 text-[11px] mt-0.5 block">
                      Dispatched on {formatDateTime(ord.createdAt)} • Rider Payout: ₹40.00
                    </span>
                  </div>

                  <span className="text-sm font-black text-stone-900 dark:text-white font-display">
                    Customer To Pay: {ord.paymentMethod === 'cod' ? formatINR(ord.totalAmount) : 'PAID (ONLINE)'}
                  </span>
                </div>

                {/* Pickup & Drop Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Pickup */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-bazaar-saffron">
                      <Store className="w-4 h-4" />
                      <span>STEP 1: STORE PICKUP</span>
                    </div>
                    <p className="font-extrabold text-stone-900 dark:text-white">{ord.shopName}</p>
                    <p className="text-stone-500">
                      Collect parcel from merchant counter • {ord.items.length} items
                    </p>
                  </div>

                  {/* Drop */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-stone-900 border border-emerald-200 dark:border-stone-700 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400">
                      <MapPin className="w-4 h-4" />
                      <span>STEP 2: CUSTOMER DESTINATION</span>
                    </div>
                    <p className="font-extrabold text-stone-900 dark:text-white">{ord.customerName}</p>
                    <p className="text-stone-500">
                      {ord.deliveryAddress.street}, {ord.deliveryAddress.area}, {ord.deliveryAddress.city} - {ord.deliveryAddress.pincode}
                    </p>
                    {ord.deliveryInstructions && (
                      <p className="text-[11px] text-stone-400 italic">"{ord.deliveryInstructions}"</p>
                    )}
                  </div>
                </div>

                {/* Rider Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-bazaar-green" />
                      <span>Call Customer ({ord.customerPhone})</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        `${ord.deliveryAddress.street}, ${ord.deliveryAddress.area}, ${ord.deliveryAddress.city}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>Navigate GPS</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    {ord.orderStatus === 'preparing' && (
                      <button
                        onClick={() =>
                          updateOrderStatus(ord.id, 'out_for_delivery', 'Rider Rahul picked up order from shop counter')
                        }
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow hover:bg-purple-700 transition-colors"
                      >
                        Confirm Pickup & Start Run
                      </button>
                    )}

                    {ord.orderStatus === 'out_for_delivery' && (
                      <button
                        onClick={() =>
                          updateOrderStatus(ord.id, 'delivered', 'Order verified and handed over at customer doorstep')
                        }
                        className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Successful Delivery</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
