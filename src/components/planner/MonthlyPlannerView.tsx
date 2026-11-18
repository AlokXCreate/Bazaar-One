import React from 'react';
import { ShoppingPlan } from '../../types';
import { formatINR } from '../../utils/currency';
import { usePlanner } from '../../context/PlannerContext';
import { Check, ShoppingCart, AlertTriangle, TrendingUp, Trash2 } from 'lucide-react';

interface MonthlyPlannerProps {
  plan: ShoppingPlan;
}

export const MonthlyPlannerView: React.FC<MonthlyPlannerProps> = ({ plan }) => {
  const { toggleItemPurchased, removeItemFromPlan, addAllUnpurchasedToCart } = usePlanner();

  const percentSpent = Math.min(100, Math.round((plan.spent / (plan.budget || 1)) * 100));
  const isOverBudget = plan.spent > plan.budget;

  return (
    <div className="space-y-6">
      {/* Monthly Budget Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-stone-900 dark:text-white font-display">
              {plan.title}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Month of {plan.month || 'November 2026'} • Household provisions & monthly bulk staples
            </p>
          </div>

          <button
            onClick={() => addAllUnpurchasedToCart(plan.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white shadow transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Order Monthly Staples</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1.5 text-stone-700 dark:text-stone-300">
            <span>
              Spent: <strong className="text-stone-900 dark:text-white">{formatINR(plan.spent)}</strong>
            </span>
            <span>
              Monthly Budget: <strong className="text-bazaar-maroon dark:text-bazaar-saffron">{formatINR(plan.budget)}</strong>
            </span>
          </div>

          <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget ? 'bg-rose-500' : percentSpent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>

          {isOverBudget && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold mt-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Budget exceeded by {formatINR(plan.spent - plan.budget)}! Consider comparing alternative local vendors.</span>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Items List */}
      <div className="space-y-3">
        {plan.items.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              item.isPurchased
                ? 'bg-stone-50 dark:bg-stone-850/40 border-stone-200 dark:border-stone-800 opacity-60'
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
                  className={`text-sm font-bold block truncate ${
                    item.isPurchased ? 'line-through text-stone-500' : 'text-stone-900 dark:text-white'
                  }`}
                >
                  {item.name}
                </span>
                <span className="text-xs text-stone-400">
                  {item.preferredShopName || 'Preferred Merchant'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-extrabold text-stone-900 dark:text-white font-display">
                {formatINR(item.estimatedPrice)}
              </span>
              <button
                onClick={() => removeItemFromPlan(plan.id, item.id)}
                className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
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
