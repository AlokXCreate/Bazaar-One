import React from 'react';
import { ALL_CATEGORIES } from '../../data/mockCategories';
import {
  Store,
  Carrot,
  Apple,
  Milk,
  Wheat,
  Flame,
  Shirt,
  Palette,
  Sparkles,
  Coffee,
  Sun,
  ShoppingBag,
  Cookie,
  Sparkle,
  Home,
  Tv,
  Leaf,
  Layers,
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  marketType: 'traditional' | 'modern' | 'both';
}

const ICON_MAP: Record<string, any> = {
  Store,
  Carrot,
  Apple,
  Milk,
  Wheat,
  Flame,
  Shirt,
  Palette,
  Sparkles,
  Coffee,
  Sun,
  ShoppingBag,
  Cookie,
  Sparkle,
  Home,
  Tv,
  Leaf,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  marketType,
}) => {
  const visibleCategories = ALL_CATEGORIES.filter((c) => {
    if (marketType === 'both') return true;
    return c.marketType === marketType;
  });

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {/* All Categories Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
            selectedCategory === 'all'
              ? 'bg-bazaar-maroon text-white border-bazaar-maroon shadow-md'
              : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-bazaar-maroon/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Categories</span>
        </button>

        {visibleCategories.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Store;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                isSelected
                  ? 'bg-bazaar-maroon text-white border-bazaar-maroon shadow-md'
                  : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-bazaar-maroon/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-bazaar-saffron' : 'text-stone-500'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
