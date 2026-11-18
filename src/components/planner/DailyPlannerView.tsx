import React, { useState } from 'react';
import { ShoppingPlan, UnitOfMeasure } from '../../types';
import { formatINR } from '../../utils/currency';
import { usePlanner } from '../../context/PlannerContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Check, Plus, Trash2, ShoppingCart, Store, AlertCircle } from 'lucide-react';

interface DailyPlannerProps {
  plan: ShoppingPlan;
}

export const DailyPlannerView: React.FC<DailyPlannerProps> = ({ plan }) => {
  const { toggleItemPurchased, addItemToPlan, removeItemFromPlan, addAllUnpurchasedToCart } = usePlanner();
  const { shops } = useMarketplace();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('vegetables');
  const [estimatedPrice, setEstimatedPrice] = useState(50);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<UnitOfMeasure>('kg');
  const [preferredShopId, setPreferredShopId] = useState(shops[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const shop = shops.find((s) => s.id === preferredShopId);

    addItemToPlan(plan.id, {
      name,
      category,
      estimatedPrice,
      quantity,
      unit,
      preferredShopId,
      preferredShopName: shop?.name || 'Local Mandi',
      notes,
    });

    setName('');
    setNotes('');
    setShowAddForm(false);
  };

  const purchasedCount = plan.items.filter((i) => i.isPurchased).length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div>
          <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
            {plan.title}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {purchasedCount} of {plan.items.length} items purchased today • Spent: {formatINR(plan.spent)} of {formatINR(plan.budget)} budget
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-bazaar-maroon" />
            <span>Add Item</span>
          </button>

          <button
            onClick={() => addAllUnpurchasedToCart(plan.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white shadow-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>One-Click Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Add Item Inline Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3 animate-slide-up">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Add New Item to Daily Checklist
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <input
              type="text"
              placeholder="Item name (e.g. Fresh Coriander, Cow Milk)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 sm:col-span-2"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
            >
              <option value="vegetables">Fresh Vegetables</option>
              <option value="fruits">Fresh Fruits</option>
              <option value="dairy">Dairy & Milk</option>
              <option value="kirana">Kirana / Staples</option>
              <option value="traditional-snacks">Snacks & Sweets</option>
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitOfMeasure)}
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="bundle">bundle</option>
                <option value="packet">packet</option>
                <option value="piece">piece</option>
              </select>
            </div>

            <input
              type="number"
              min="0"
              placeholder="Est. Price (₹)"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(parseInt(e.target.value) || 0)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
            />

            <select
              value={preferredShopId}
              onChange={(e) => setPreferredShopId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold bg-bazaar-maroon text-white rounded-xl shadow"
            >
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* Checklist items */}
      <div className="space-y-2">
        {plan.items.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              item.isPurchased
                ? 'bg-stone-100/70 dark:bg-stone-850/40 border-stone-200 dark:border-stone-800 opacity-60'
                : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-800 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => toggleItemPurchased(plan.id, item.id)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                  item.isPurchased
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-stone-300 dark:border-stone-600 hover:border-bazaar-maroon'
                }`}
              >
                {item.isPurchased && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <div className="min-w-0">
                <span
                  className={`text-xs sm:text-sm font-bold block truncate ${
                    item.isPurchased ? 'line-through text-stone-500' : 'text-stone-900 dark:text-white'
                  }`}
                >
                  {item.name}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span>
                    {item.quantity} {item.unit}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-bazaar-maroon dark:text-bazaar-saffron">
                    <Store className="w-3 h-3" />
                    {item.preferredShopName || 'Local Shop'}
                  </span>
                  {item.notes && (
                    <>
                      <span>•</span>
                      <span className="italic text-stone-500 truncate max-w-[150px]">{item.notes}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-extrabold text-stone-800 dark:text-stone-200 font-display">
                {formatINR(item.estimatedPrice)}
              </span>
              <button
                onClick={() => removeItemFromPlan(plan.id, item.id)}
                className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
