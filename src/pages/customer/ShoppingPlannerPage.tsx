import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { DailyPlannerView } from '../../components/planner/DailyPlannerView';
import { WeeklyPlannerView } from '../../components/planner/WeeklyPlannerView';
import { MonthlyPlannerView } from '../../components/planner/MonthlyPlannerView';
import { CalendarCheck, CalendarDays, CalendarRange, Sparkles, Plus } from 'lucide-react';

interface ShoppingPlannerPageProps {
  onOpenAI: () => void;
  onOpenExportModal?: () => void;
}

export const ShoppingPlannerPage: React.FC<ShoppingPlannerPageProps> = ({ onOpenAI }) => {
  const { plans, activeFrequency, setActiveFrequency, currentPlan } = usePlanner();

  const frequencies = [
    { id: 'daily', label: "Daily Today's List", icon: CalendarCheck, desc: 'Fresh greens, milk, bread & daily staples' },
    { id: 'weekly', label: 'Weekly Family Plan', icon: CalendarDays, desc: 'Meal preparation & weekly kitchen groceries' },
    { id: 'monthly', label: 'Monthly Essentials', icon: CalendarRange, desc: 'Flours, dals, oils, bulk ghee & detergents' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Planner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bazaar-saffron/20 text-bazaar-maroon dark:text-bazaar-saffron text-xs font-bold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Smart Shopping Planner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 dark:text-white">
            Smart Grocery & Budget Planner
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Organize daily purchases, monitor household budgets, and order with 1-click checkout
          </p>
        </div>

        <button
          onClick={onOpenAI}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-bazaar-maroon to-amber-900 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4 text-bazaar-saffron" />
          <span>Generate Plan with Bazaar AI</span>
        </button>
      </div>

      {/* Frequency Tabs Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {frequencies.map((freq) => {
          const Icon = freq.icon;
          const isActive = activeFrequency === freq.id;

          return (
            <button
              key={freq.id}
              onClick={() => setActiveFrequency(freq.id as any)}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                isActive
                  ? 'border-bazaar-maroon bg-white dark:bg-stone-850 shadow-md ring-2 ring-bazaar-maroon/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900 hover:bg-white'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? 'bg-bazaar-maroon text-bazaar-saffron'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">{freq.label}</h3>
                <p className="text-[11px] text-stone-500 mt-0.5">{freq.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Active Plan View */}
      {currentPlan && (
        <div className="animate-fade-in">
          {activeFrequency === 'daily' && <DailyPlannerView plan={currentPlan} />}
          {activeFrequency === 'weekly' && <WeeklyPlannerView plan={currentPlan} />}
          {activeFrequency === 'monthly' && <MonthlyPlannerView plan={currentPlan} />}
        </div>
      )}
    </div>
  );
};
