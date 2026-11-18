import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TraditionalVsModernToggle } from '../../components/marketplace/TraditionalVsModernToggle';
import { CategoryFilter } from '../../components/marketplace/CategoryFilter';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { Product } from '../../types';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, PackageX } from 'lucide-react';

interface MarketplacePageProps {
  onQuickView: (product: Product) => void;
  onBargainQuote: (product: Product) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  onQuickView,
  onBargainQuote,
}) => {
  const {
    filteredProducts,
    marketFilter,
    setMarketFilter,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    shops,
  } = useMarketplace();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const traditionalCount = shops.filter((s) => s.marketType === 'traditional').length;
  const modernCount = shops.filter((s) => s.marketType === 'modern').length;

  const sortedProducts = useMemo(() => {
    let list = [...filteredProducts];

    if (onlyInStock) {
      list = list.filter((p) => p.stockQuantity > 0);
    }

    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'featured':
      default:
        return list;
    }
  }, [filteredProducts, sortBy, onlyInStock]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Market Toggle Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 dark:text-white">
            Unified Indian Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse verified products directly from local street vendors, kirana merchants & modern stores
          </p>
        </div>

        <TraditionalVsModernToggle
          currentFilter={marketFilter}
          onChange={setMarketFilter}
          traditionalCount={traditionalCount}
          modernCount={modernCount}
          totalCount={shops.length}
        />
      </div>

      {/* Category Strip */}
      <div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          marketType={marketFilter}
        />
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input in catalog */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products, brands, or regional terms (उदा. तांदूळ)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        {/* Filters & Sorting */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-stone-700 dark:text-stone-300">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-bazaar-maroon focus:ring-bazaar-maroon w-4 h-4"
            />
            <span>In-Stock Only</span>
          </label>

          <div className="flex items-center gap-1.5 border-l border-stone-200 dark:border-stone-700 pl-3">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 font-medium text-xs text-stone-800 dark:text-stone-200"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 mx-auto flex items-center justify-center">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-stone-800 dark:text-stone-200">
            No Products Found Matching Filters
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try clearing your search query or selecting "Unified Marketplace" to browse all categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setMarketFilter('both');
            }}
            className="px-4 py-2 text-xs font-bold bg-bazaar-maroon text-white rounded-xl shadow"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onBargainQuote={onBargainQuote}
            />
          ))}
        </div>
      )}
    </div>
  );
};
