import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useCart } from '../../context/CartContext';
import { Product, UnitOfMeasure } from '../../types';
import { formatINR } from '../../utils/currency';
import { formatDateTime } from '../../utils/formatters';
import { documentExportService } from '../../services/documentExportService';
import {
  Store,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  FileDown,
  ArrowRight,
  TrendingUp,
  QrCode,
  Printer,
  MessageSquare,
  Users,
  Percent,
  Check,
  X,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const VendorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { shops, products, addProduct, updateProduct, deleteProduct, bargainQuoteRequests } = useMarketplace();
  const { orders, updateOrderStatus } = useCart();

  // Find vendor's registered shop
  const vendorShop = shops.find((s) => s.ownerId === user?.uid || s.id === user?.shopId) || shops[0];
  const vendorProducts = products.filter((p) => p.shopId === vendorShop.id);
  const vendorOrders = orders.filter((o) => o.shopId === vendorShop.id);

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'bargains' | 'qr'>('overview');
  const [salesPeriod, setSalesPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Add Product Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newRegionalName, setNewRegionalName] = useState('');
  const [newCategory, setNewCategory] = useState(vendorShop.category || 'kirana');
  const [newPrice, setNewPrice] = useState<number>(60);
  const [newCostPrice, setNewCostPrice] = useState<number>(45);
  const [newUnit, setNewUnit] = useState<UnitOfMeasure>('kg');
  const [newStock, setNewStock] = useState<number>(100);
  const [newDesc, setNewDesc] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600');

  // Sales metrics
  const todayOrders = vendorOrders;
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const weeklyRevenue = todayRevenue + 18450;
  const monthlyRevenue = weeklyRevenue + 64200;

  const currentDisplayRevenue =
    salesPeriod === 'today' ? todayRevenue : salesPeriod === 'week' ? weeklyRevenue : monthlyRevenue;

  const totalOrdersPlaced = vendorOrders.length + (salesPeriod === 'week' ? 42 : salesPeriod === 'month' ? 180 : 0);
  const pendingOrders = vendorOrders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');
  const completedOrders = vendorOrders.filter((o) => o.orderStatus === 'delivered');
  const lowStockItems = vendorProducts.filter((p) => p.stockQuantity <= p.lowStockThreshold);

  const averageOrderValue = Math.round(todayRevenue / (vendorOrders.length || 1));
  const estimatedProfitMargin = Math.round(currentDisplayRevenue * 0.22); // 22% margin

  // Chart data
  const revenueChartData =
    salesPeriod === 'today'
      ? [
          { time: '08 AM', revenue: 450 },
          { time: '10 AM', revenue: 1200 },
          { time: '12 PM', revenue: 2150 },
          { time: '02 PM', revenue: 840 },
          { time: '04 PM', revenue: 1650 },
          { time: '06 PM', revenue: 3100 },
          { time: '08 PM', revenue: 2400 },
        ]
      : [
          { time: 'Mon', revenue: 4200 },
          { time: 'Tue', revenue: 5800 },
          { time: 'Wed', revenue: 4900 },
          { time: 'Thu', revenue: 6400 },
          { time: 'Fri', revenue: 7100 },
          { time: 'Sat', revenue: 10400 },
          { time: 'Sun', revenue: 8900 },
        ];

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    addProduct({
      shopId: vendorShop.id,
      shopName: vendorShop.name,
      marketType: vendorShop.marketType,
      name: newProdName,
      regionalName: newRegionalName || undefined,
      category: newCategory,
      description: newDesc || `${newProdName} fresh stock directly from ${vendorShop.name}.`,
      imageUrl: newImageUrl,
      price: newPrice,
      unit: newUnit,
      stockQuantity: newStock,
      lowStockThreshold: Math.round(newStock * 0.15) || 5,
      isAvailable: newStock > 0,
      rating: 5.0,
      reviewCount: 1,
      tags: [newProdName.toLowerCase(), newCategory],
      freshnessStatus: 'same-day',
      isQualityChecked: true,
    });

    setIsAddModalOpen(false);
    setNewProdName('');
    setNewRegionalName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Merchant Branding Header */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-700 via-bazaar-maroon to-stone-900 text-white p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-bazaar-saffron/10 transform skew-x-12 pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex-shrink-0 flex items-center justify-center">
            <Store className="w-9 h-9 text-bazaar-saffron" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider bg-bazaar-saffron text-stone-950 px-2 py-0.5 rounded font-black">
                Shop Owner Console
              </span>
              <span className="text-xs text-stone-300">GST: {vendorShop.gstNumber || '27AABCS1429B1ZX'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display mt-0.5">
              {vendorShop.name}
            </h1>
            <p className="text-xs text-stone-200 mt-1">
              Proprietor: <strong>{vendorShop.ownerName}</strong> • {vendorShop.address.street}, {vendorShop.address.area}, {vendorShop.address.city}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-bazaar-saffron hover:bg-bazaar-saffron/90 text-stone-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5 border border-white/20"
          >
            <QrCode className="w-4 h-4 text-bazaar-saffron" />
            <span>Counter UPI QR</span>
          </button>

          <button
            onClick={() =>
              documentExportService.exportPDF({
                type: 'inventory_report',
                title: `${vendorShop.name} - Official Sales & Stock Audit`,
                products: vendorProducts,
                shop: vendorShop,
              })
            }
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5 border border-white/20"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Audit (PDF)</span>
          </button>
        </div>
      </div>

      {/* Period Filter for Sales & Orders Analytics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider px-2">
          Merchant Performance Period:
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => setSalesPeriod('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              salesPeriod === 'today'
                ? 'bg-bazaar-maroon text-white shadow'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            Today's Live Sales
          </button>
          <button
            onClick={() => setSalesPeriod('week')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              salesPeriod === 'week'
                ? 'bg-bazaar-maroon text-white shadow'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSalesPeriod('month')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              salesPeriod === 'month'
                ? 'bg-bazaar-maroon text-white shadow'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Core KPI Cards: How Much Sale Done, How Much Order Placed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Sale Done */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Sale Done ({salesPeriod.toUpperCase()})
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-white font-display">
            {formatINR(currentDisplayRevenue)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ 18.4% growth vs previous cycle</span>
          </div>
        </div>

        {/* Metric 2: Total Orders Placed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Orders Placed
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-white font-display">
            {totalOrdersPlaced} Orders
          </div>
          <div className="text-xs text-stone-500">
            {pendingOrders.length} pending packing • {completedOrders.length} completed
          </div>
        </div>

        {/* Metric 3: Average Order Value & Margins */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Average Order Value (AOV)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-white font-display">
            {formatINR(averageOrderValue || 540)}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
            Est. Net Profit: {formatINR(estimatedProfitMargin)}
          </div>
        </div>

        {/* Metric 4: Inventory & Stock Health */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Catalog Items Listed
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-white font-display">
            {vendorProducts.length} Items
          </div>
          <div className={`text-xs font-semibold ${lowStockItems.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {lowStockItems.length > 0 ? `⚠️ ${lowStockItems.length} items low on stock!` : '✅ All stock levels healthy'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'overview'
              ? 'bg-bazaar-maroon text-white shadow'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sales & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'orders'
              ? 'bg-bazaar-maroon text-white shadow'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders Management ({vendorOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'inventory'
              ? 'bg-bazaar-maroon text-white shadow'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Stock & Quick Pricing ({vendorProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bargains')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'bargains'
              ? 'bg-bazaar-maroon text-white shadow'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Customer Bargains & Quotes ({bargainQuoteRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('qr')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
            activeTab === 'qr'
              ? 'bg-bazaar-maroon text-white shadow'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Cashier UPI Standee</span>
        </button>
      </div>

      {/* TAB 1: Sales & Analytics Chart View */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
                  Live Revenue & Sales Volume ({salesPeriod.toUpperCase()})
                </h3>
                <p className="text-xs text-stone-500">Real-time settlement record for {vendorShop.name}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Total: {formatINR(currentDisplayRevenue)}
              </span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(value: any) => [`₹${value}`, 'Sales Done']} />
                  <Bar dataKey="revenue" fill="#7A263A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Order Actions Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Orders Requiring Action ({pendingOrders.length})
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron hover:underline"
              >
                Go to Orders Management →
              </button>
            </div>

            <div className="space-y-3">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-sm text-stone-900 dark:text-white">{ord.id}</span>
                    <span className="text-stone-500 block mt-0.5">
                      {ord.customerName} ({ord.customerPhone}) • {ord.items.length} items • Total: <strong>{formatINR(ord.totalAmount)}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ord.orderStatus === 'placed' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'accepted_by_shop', 'Shop accepted and packing items')}
                        className="px-3.5 py-1.5 rounded-xl bg-bazaar-green text-white font-bold hover:bg-emerald-700"
                      >
                        Accept Order
                      </button>
                    )}
                    {ord.orderStatus === 'accepted_by_shop' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'preparing', 'Items weighed and packed')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700"
                      >
                        Mark Packing
                      </button>
                    )}
                    {ord.orderStatus === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup', 'Parcel placed at counter')}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                      >
                        Ready for Pickup
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
            Full Store Orders Fulfillment Pipeline
          </h3>

          <div className="space-y-4">
            {vendorOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-stone-900 dark:text-white">{ord.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bazaar-maroon text-white uppercase">
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-stone-400 block mt-0.5">
                      Customer: <strong>{ord.customerName}</strong> ({ord.customerPhone}) • Address: {ord.deliveryAddress.street}, {ord.deliveryAddress.area}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-stone-900 dark:text-white font-display block">
                      {formatINR(ord.totalAmount)}
                    </span>
                    <span className="text-stone-400 text-[11px]">Mode: {ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})</span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-2 text-xs">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-stone-700 dark:text-stone-300">
                      <span>{item.quantity} {item.unit} × {item.name}</span>
                      <span className="font-semibold">{formatINR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Action Controls */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-end gap-2 text-xs">
                  {ord.orderStatus === 'placed' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'accepted_by_shop', 'Shop accepted')}
                        className="px-4 py-2 rounded-xl bg-bazaar-green text-white font-bold hover:bg-emerald-700 shadow-sm"
                      >
                        Accept Order
                      </button>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'cancelled', 'Rejected due to stock unavailability')}
                        className="px-4 py-2 rounded-xl bg-rose-100 text-rose-800 font-bold hover:bg-rose-200"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {ord.orderStatus === 'accepted_by_shop' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'preparing', 'Packing items')}
                      className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-sm"
                    >
                      Mark as Packing / Preparing
                    </button>
                  )}

                  {ord.orderStatus === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup', 'Parcel on counter')}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
                    >
                      Ready for Pickup
                    </button>
                  )}

                  {ord.orderStatus === 'ready_for_pickup' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'out_for_delivery', 'Handed over to rider Rahul')}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-sm"
                    >
                      Handover to Rider (Out for Delivery)
                    </button>
                  )}

                  {ord.orderStatus === 'out_for_delivery' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'delivered', 'Delivered at customer address')}
                      className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 shadow-sm"
                    >
                      Confirm Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Inventory & Quick Stock Steppers */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
                Inventory Stock & Quick Restock Stepper
              </h3>
              <p className="text-xs text-stone-500">
                Adjust stock quantities with 1-click steppers or update listed prices
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-bazaar-maroon text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Item</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 font-bold border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Rate / Unit</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Quick Stock Adjust</th>
                  <th className="p-3.5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {vendorProducts.map((p) => {
                  const isLow = p.stockQuantity <= p.lowStockThreshold;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                      <td className="p-3.5 font-bold text-stone-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 dark:border-stone-700"
                          />
                          <div>
                            <span className="block">{p.name}</span>
                            {p.regionalName && <span className="text-[10px] text-stone-400">{p.regionalName}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-stone-500 capitalize">{p.category}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-bold font-display text-stone-900 dark:text-white">
                          <span>{formatINR(p.price)}</span>
                          <span className="text-stone-400 font-normal">/{p.unit}</span>
                          <button
                            onClick={() => {
                              const newRate = prompt(`Update selling price per ${p.unit} for "${p.name}":`, String(p.price));
                              if (newRate !== null) {
                                updateProduct(p.id, { price: parseInt(newRate) || p.price });
                              }
                            }}
                            className="text-[10px] text-bazaar-maroon dark:text-bazaar-saffron hover:underline ml-1"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`font-black text-sm ${isLow ? 'text-rose-600' : 'text-stone-800 dark:text-stone-200'}`}>
                          {p.stockQuantity} {p.unit}
                        </span>
                        {isLow && <span className="block text-[10px] text-rose-500 font-bold">Low Stock!</span>}
                      </td>
                      <td className="p-3.5">
                        {/* 1-Click Steppers */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateProduct(p.id, { stockQuantity: Math.max(0, p.stockQuantity - 1) })}
                            className="px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded text-stone-700 dark:text-stone-300 font-bold"
                            title="Minus 1"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => updateProduct(p.id, { stockQuantity: p.stockQuantity + 5 })}
                            className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded font-bold"
                            title="Add 5"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => updateProduct(p.id, { stockQuantity: p.stockQuantity + 25 })}
                            className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded font-bold"
                            title="Add 25"
                          >
                            +25
                          </button>
                          <button
                            onClick={() => updateProduct(p.id, { stockQuantity: 0 })}
                            className="px-2 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 rounded text-[10px] font-bold"
                            title="Mark Out of Stock"
                          >
                            Set 0
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${p.name}" from catalog?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Customer Bargains & Quotes */}
      {activeTab === 'bargains' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
              Traditional Customer Bargain & Bulk Price Requests
            </h3>
            <p className="text-xs text-stone-500">
              Shoppers submitting counter-offers or bulk festival quantity requests directly to your counter
            </p>
          </div>

          {bargainQuoteRequests.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No pending customer bargain requests at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bargainQuoteRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                    <span className="font-bold text-sm text-stone-900 dark:text-white">{req.productName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                      Offer Pending
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-stone-600 dark:text-stone-300">
                    <div>
                      <span className="text-stone-400 block">Listed Rate:</span>
                      <span className="font-bold line-through">{formatINR(req.originalPrice)} / {req.unit}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Customer Proposed Rate:</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatINR(req.offeredRate)} / {req.unit}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300">
                    <strong>Qty:</strong> {req.targetQuantity} {req.unit} • <strong>Phone:</strong> {req.customerPhone}
                    {req.message && <p className="italic text-stone-500 mt-1">"{req.message}"</p>}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <a
                      href={`tel:${req.customerPhone}`}
                      className="flex-1 py-2 rounded-xl bg-bazaar-green text-white font-bold text-center hover:bg-emerald-700"
                    >
                      Call Customer
                    </a>
                    <a
                      href={`https://wa.me/${req.customerPhone.replace(/\D/g, '')}?text=Hello,%20regarding%20your%20Bazaar%20One%20offer%20for%20${encodeURIComponent(req.productName)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-center hover:bg-emerald-700"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Cashier UPI Standee */}
      {activeTab === 'qr' && (
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white dark:bg-stone-850 border-4 border-bazaar-maroon shadow-2xl text-center space-y-5">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-bazaar-saffron font-black">
              Official Bazaar One Merchant
            </span>
            <h2 className="text-2xl font-black font-display text-stone-900 dark:text-white">
              {vendorShop.name}
            </h2>
            <p className="text-xs text-stone-500">
              Scan & Pay using Google Pay, PhonePe, Paytm, or any UPI App
            </p>
          </div>

          <div className="w-56 h-56 mx-auto bg-stone-50 dark:bg-stone-900 p-4 rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center shadow-inner">
            <QrCode className="w-44 h-44 text-stone-900 dark:text-white" />
          </div>

          <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl font-mono text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron">
            {vendorShop.upiId || 'shreeganesh.kirana@oksbi'}
          </div>

          <div className="text-[11px] text-stone-400">
            Keep this standee at your shop billing counter for zero-commission instant UPI settlement.
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Item to Shop Catalog"
        subtitle={`Listing for ${vendorShop.name}`}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Product Title (English):</label>
              <input
                type="text"
                placeholder="e.g. Sharbati Whole Wheat"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Regional Name (Hindi/Marathi):</label>
              <input
                type="text"
                placeholder="उदा. शरबती गहू (Gehun)"
                value={newRegionalName}
                onChange={(e) => setNewRegionalName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Category:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
              >
                <option value="kirana">Kirana Stores (किराना)</option>
                <option value="vegetables">Fresh Vegetables (भाजीपाला)</option>
                <option value="fruits">Fresh Fruits (फळे)</option>
                <option value="dairy">Dairy & Milk (दूध व तूप)</option>
                <option value="grains-pulses">Grains & Pulses (डाळी व धान्य)</option>
                <option value="spices">Spices & Masalas (खडे मसाले)</option>
                <option value="traditional-snacks">Traditional Sweets & Snacks</option>
                <option value="packaged-food">Packaged FMCG Foods</option>
                <option value="household">Household Cleaners</option>
                <option value="organic">Certified Organic Products</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Unit of Measure:</label>
              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="L">Litre (L)</option>
                <option value="ml">Millilitre (ml)</option>
                <option value="piece">Piece</option>
                <option value="packet">Packet</option>
                <option value="dozen">Dozen</option>
                <option value="box">Box</option>
                <option value="bundle">Bundle (जुडी)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Selling Price per Unit (₹):</label>
              <input
                type="number"
                min="1"
                value={newPrice}
                onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Initial Stock Quantity:</label>
              <input
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">Product Description:</label>
            <textarea
              rows={2}
              placeholder="Direct mandi procurement, fresh crop, guaranteed genuine quality..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-bazaar-maroon text-white hover:bg-bazaar-maroon-700 shadow"
          >
            Publish Product to Store Catalog
          </button>
        </form>
      </Modal>
    </div>
  );
};
