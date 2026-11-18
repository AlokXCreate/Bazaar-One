import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useCart } from '../../context/CartContext';
import { Product, UnitOfMeasure } from '../../types';
import { formatINR } from '../../utils/currency';
import { documentExportService } from '../../services/documentExportService';
import {
  Store,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Trash2,
  FileDown,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const VendorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { shops, products, addProduct, updateProduct, deleteProduct } = useMarketplace();
  const { orders, updateOrderStatus } = useCart();

  // Find vendor's registered shop
  const vendorShop = shops.find((s) => s.ownerId === user?.uid || s.id === user?.shopId) || shops[0];
  const vendorProducts = products.filter((p) => p.shopId === vendorShop.id);
  const vendorOrders = orders.filter((o) => o.shopId === vendorShop.id);

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');

  // Add Product Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newRegionalName, setNewRegionalName] = useState('');
  const [newCategory, setNewCategory] = useState(vendorShop.category || 'kirana');
  const [newPrice, setNewPrice] = useState<number>(60);
  const [newUnit, setNewUnit] = useState<UnitOfMeasure>('kg');
  const [newStock, setNewStock] = useState<number>(100);
  const [newDesc, setNewDesc] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600');

  // Quick stats calculations
  const todayRevenue = vendorOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = vendorOrders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');
  const lowStockItems = vendorProducts.filter((p) => p.stockQuantity <= p.lowStockThreshold);

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
      {/* Merchant Header */}
      <div className="rounded-3xl bg-gradient-to-r from-bazaar-maroon via-bazaar-maroon-700 to-amber-900 text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex-shrink-0 flex items-center justify-center">
            <Store className="w-8 h-8 text-bazaar-saffron" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-bazaar-saffron font-bold">
              Merchant Enterprise Portal • Verified Vendor
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              {vendorShop.name}
            </h1>
            <p className="text-xs text-stone-200 mt-1">
              Proprietor: {vendorShop.ownerName} • {vendorShop.address.street}, {vendorShop.address.area}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-bazaar-saffron hover:bg-bazaar-saffron/90 text-bazaar-charcoal font-bold text-xs shadow transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() =>
              documentExportService.exportPDF({
                type: 'inventory_report',
                title: `${vendorShop.name} - Official Stock Valuation`,
                products: vendorProducts,
                shop: vendorShop,
              })
            }
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" />
            <span>Inventory Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Today's Sales Revenue</span>
          <div className="text-2xl font-black text-bazaar-maroon dark:text-bazaar-saffron font-display">
            {formatINR(todayRevenue)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            ↑ 14% vs previous week
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Pending Store Orders</span>
          <div className="text-2xl font-black text-amber-600 font-display">
            {pendingOrders.length} Orders
          </div>
          <span className="text-[11px] text-stone-400 block">Requires packing & dispatch</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Catalog Products Listed</span>
          <div className="text-2xl font-black text-stone-900 dark:text-white font-display">
            {vendorProducts.length} Items
          </div>
          <span className="text-[11px] text-stone-400 block">Live on unified marketplace</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Low Stock Alerts</span>
          <div className={`text-2xl font-black font-display ${lowStockItems.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {lowStockItems.length} Items
          </div>
          <span className="text-[11px] text-stone-400 block">Restock recommended</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'overview'
              ? 'bg-bazaar-maroon text-white shadow'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Store Orders ({vendorOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'inventory'
              ? 'bg-bazaar-maroon text-white shadow'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Inventory & Stock ({vendorProducts.length})
        </button>
      </div>

      {/* Tab 1: Orders Fulfillment */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
            Incoming Orders & Status Fulfillment
          </h3>

          {vendorOrders.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-400">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No orders assigned to this store yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendorOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900 dark:text-white">{ord.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bazaar-maroon text-white uppercase">
                          {ord.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-stone-400 mt-0.5">
                        Customer: <strong>{ord.customerName}</strong> ({ord.customerPhone}) • {ord.deliveryAddress.street}, {ord.deliveryAddress.area}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-base text-bazaar-maroon dark:text-bazaar-saffron font-display">
                        {formatINR(ord.totalAmount)}
                      </span>
                      <span className="text-[11px] text-stone-400 block">Payment: {ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})</span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="space-y-2 text-xs">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-stone-700 dark:text-stone-300">
                        <span>{item.quantity} {item.unit} × {item.name}</span>
                        <span className="font-semibold">{formatINR(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions for Vendor: Accept, Mark Preparing, Out for delivery, Delivered */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-end gap-2">
                    {ord.orderStatus === 'placed' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'accepted_by_shop', 'Shop accepted and confirmed stock availability')}
                        className="px-3.5 py-1.5 rounded-xl bg-bazaar-green text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                      >
                        Accept Order
                      </button>
                    )}

                    {ord.orderStatus === 'accepted_by_shop' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'preparing', 'Items weighed, quality checked and packed')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors"
                      >
                        Mark as Packing / Preparing
                      </button>
                    )}

                    {ord.orderStatus === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup', 'Parcel ready at counter for pickup or rider assignment')}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
                      >
                        Ready for Pickup
                      </button>
                    )}

                    {ord.orderStatus === 'ready_for_pickup' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'out_for_delivery', 'Handed over to delivery rider Rahul')}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors"
                      >
                        Handover to Rider (Out for Delivery)
                      </button>
                    )}

                    {ord.orderStatus === 'out_for_delivery' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'delivered', 'Order successfully received by customer')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
                      >
                        Mark Completed (Delivered)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
              Live Store Inventory & Stock Control
            </h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-bazaar-maroon text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900 text-stone-500 font-bold border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="p-3.5">Product Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock Level</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
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
                            className="w-9 h-9 rounded-lg object-cover border border-stone-200 dark:border-stone-700"
                          />
                          <div>
                            <span className="block">{p.name}</span>
                            {p.regionalName && <span className="text-[10px] text-stone-400">{p.regionalName}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-stone-500 capitalize">{p.category}</td>
                      <td className="p-3.5 font-bold font-display text-stone-900 dark:text-white">
                        {formatINR(p.price)} / {p.unit}
                      </td>
                      <td className="p-3.5">
                        <span className={`font-bold ${isLow ? 'text-rose-600' : 'text-stone-800 dark:text-stone-200'}`}>
                          {p.stockQuantity} {p.unit}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {p.stockQuantity <= 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Low Stock Alert
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            const newStockVal = prompt(`Enter new stock quantity for "${p.name}" (${p.unit}):`, String(p.stockQuantity));
                            if (newStockVal !== null) {
                              updateProduct(p.id, { stockQuantity: parseInt(newStockVal) || 0 });
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg text-stone-800 dark:text-stone-200"
                        >
                          Quick Restock
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${p.name}" from catalog?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
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

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product to Store Catalog"
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
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Price per Unit (₹):</label>
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
              placeholder="Fresh farm harvest, natural processing without chemicals..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-bazaar-maroon text-white hover:bg-bazaar-maroon-700 shadow"
          >
            Publish Product to Store
          </button>
        </form>
      </Modal>
    </div>
  );
};
