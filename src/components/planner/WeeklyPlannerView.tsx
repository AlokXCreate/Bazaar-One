import React from 'react';
import { ShoppingPlan } from '../../types';
import { formatINR } from '../../utils/currency';
import { usePlanner } from '../../context/PlannerContext';
import { Check, ShoppingCart, Calendar, Trash2 } from 'lucide-react';

interface WeeklyPlannerProps {
  plan: ShoppingPlan;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyPlannerView: React.FC<WeeklyPlannerProps> = ({ plan }) => {
  const { toggleItemPurchased, removeItemFromPlan, addAllUnpurchasedToCart } = usePlanner();

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div>
          <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
            {plan.title}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Organized day-by-day for kitchen meal preparation • Weekly Budget: {formatINR(plan.budget)} (Spent: {formatINR(plan.spent)})
          </p>
        </div>

        <button
          onClick={() => addAllUnpurchasedToCart(plan.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white shadow-sm transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add Weekly Groceries to Cart</span>
        </button>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAYS.map((day) => {
          const dayItems = plan.items.filter((i) => i.dayOfWeek === day || (!i.dayOfWeek && day === 'Monday'));
          const dayTotal = dayItems.reduce((s, i) => s + i.estimatedPrice, 0);

          return (
            <div
              key={day}
              className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-bazaar-saffron" />
                    <span className="font-bold text-xs text-stone-900 dark:text-white">{day}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500">{formatINR(dayTotal)}</span>
                </div>

                <div className="space-y-2">
                  {dayItems.length === 0 ? (
                    <p className="text-xs text-stone-400 italic py-2">No items scheduled</p>
                  ) : (
                    dayItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                          item.isPurchased
                            ? 'bg-stone-100 dark:bg-stone-800 border-transparent opacity-60'
                            : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            onClick={() => toggleItemPurchased(plan.id, item.id)}
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              item.isPurchased ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400'
                            }`}
                          >
                            {item.isPurchased && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <span className={`truncate font-medium ${item.isPurchased ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-200'}`}>
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="font-bold font-display text-[11px]">{formatINR(item.estimatedPrice)}</span>
                          <button
                            onClick={() => removeItemFromPlan(plan.id, item.id)}
                            className="text-stone-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
