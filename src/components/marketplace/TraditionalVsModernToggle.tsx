import React from 'react';
import { MarketType } from '../../types';
import { Store, Building2, Layers } from 'lucide-react';

interface ToggleProps {
  currentFilter: MarketType;
  onChange: (type: MarketType) => void;
  traditionalCount?: number;
  modernCount?: number;
  totalCount?: number;
}

export const TraditionalVsModernToggle: React.FC<ToggleProps> = ({
  currentFilter,
  onChange,
  traditionalCount,
  modernCount,
  totalCount,
}) => {
  return (
    <div className="inline-flex p-1.5 bg-stone-200/80 dark:bg-stone-800 rounded-2xl border border-stone-300/60 dark:border-stone-700 shadow-inner">
      {/* Both Button */}
      <button
        onClick={() => onChange('both')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
          currentFilter === 'both'
            ? 'bg-white dark:bg-stone-900 text-bazaar-charcoal dark:text-white shadow-md'
            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
        }`}
      >
        <Layers className="w-4 h-4 text-stone-500" />
        <span>Unified Marketplace</span>
        {totalCount !== undefined && (
          <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-stone-800 font-bold">
            {totalCount}
          </span>
        )}
      </button>

      {/* Traditional Bazaar */}
      <button
        onClick={() => onChange('traditional')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
          currentFilter === 'traditional'
            ? 'bg-gradient-to-r from-bazaar-maroon to-bazaar-maroon-700 text-white shadow-md shadow-bazaar-maroon/20'
            : 'text-stone-600 dark:text-stone-400 hover:text-bazaar-maroon'
        }`}
      >
        <Store className="w-4 h-4 text-bazaar-saffron" />
        <span>Traditional Bazaar</span>
        {traditionalCount !== undefined && (
          <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-bazaar-saffron font-bold">
            {traditionalCount}
          </span>
        )}
      </button>

      {/* Modern Marketplace */}
      <button
        onClick={() => onChange('modern')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
          currentFilter === 'modern'
            ? 'bg-gradient-to-r from-bazaar-green to-emerald-700 text-white shadow-md shadow-emerald-900/20'
            : 'text-stone-600 dark:text-stone-400 hover:text-bazaar-green'
        }`}
      >
        <Building2 className="w-4 h-4 text-emerald-300" />
        <span>Modern Retail</span>
        {modernCount !== undefined && (
          <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
            {modernCount}
          </span>
        )}
      </button>
    </div>
  );
};
