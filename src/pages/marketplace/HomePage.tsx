import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TraditionalVsModernToggle } from '../../components/marketplace/TraditionalVsModernToggle';
import { CategoryFilter } from '../../components/marketplace/CategoryFilter';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { ShopCard } from '../../components/marketplace/ShopCard';
import { Product } from '../../types';
import {
  Sparkles,
  ShoppingBag,
  Store,
  MapPin,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  HeartHandshake,
} from 'lucide-react';

interface HomePageProps {
  onQuickView: (product: Product) => void;
  onBargainQuote: (product: Product) => void;
  onOpenAI: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onQuickView,
  onBargainQuote,
  onOpenAI,
}) => {
  const {
    shops,
    products,
    marketFilter,
    setMarketFilter,
    selectedCategory,
    setSelectedCategory,
  } = useMarketplace();

  const traditionalShops = shops.filter((s) => s.marketType === 'traditional');
  const modernShops = shops.filter((s) => s.marketType === 'modern');

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-bazaar-cream-200/90 via-bazaar-cream-100 to-transparent">
        {/* Decorative Indian motifs background overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#7A263A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-850 border border-bazaar-saffron/40 shadow-sm text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-bazaar-saffron animate-ping" />
              <span>India's First Unified Mandi & Retail Commerce Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display text-bazaar-charcoal dark:text-white leading-[1.15]">
              Your Local Bazaar. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-bazaar-maroon via-bazaar-saffron to-bazaar-green">
                Your Modern Marketplace.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-normal leading-relaxed">
              Connect directly with verified local Kirana stores, fresh vegetable mandis, spice merchants and modern hypermarkets from one seamless application.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white font-bold text-sm shadow-xl shadow-bazaar-maroon/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={onOpenAI}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-stone-850 hover:bg-stone-50 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:border-bazaar-saffron"
              >
                <Sparkles className="w-4 h-4 text-bazaar-saffron" />
                <span>Ask Bazaar AI</span>
              </button>

              <Link
                to="/maps"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100/70 border border-amber-200 dark:border-stone-700 text-amber-900 dark:text-amber-300 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <MapPin className="w-4 h-4 text-bazaar-saffron" />
                <span>Locate Nearby Shops</span>
              </Link>
            </div>

            {/* Market Type Toggle Pill */}
            <div className="pt-6">
              <TraditionalVsModernToggle
                currentFilter={marketFilter}
                onChange={setMarketFilter}
                traditionalCount={traditionalShops.length}
                modernCount={modernShops.length}
                totalCount={shops.length}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-stone-900 dark:text-white">
              Browse by Marketplace Category
            </h2>
            <p className="text-xs text-stone-500">
              Discover authentic staples, pure ghee, morning produce and branded home goods
            </p>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          marketType={marketFilter}
        />
      </section>

      {/* Featured Verified Stores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-display text-stone-900 dark:text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-bazaar-maroon dark:text-bazaar-saffron" />
              <span>Verified Local Merchants & Retailers</span>
            </h2>
            <p className="text-xs text-stone-500">
              Authentic vendors with transparent pricing, direct WhatsApp enquiry, and quick delivery
            </p>
          </div>
          <Link
            to="/maps"
            className="text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron hover:underline"
          >
            View on Live Map →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(marketFilter === 'traditional'
            ? traditionalShops
            : marketFilter === 'modern'
            ? modernShops
            : shops
          )
            .slice(0, 3)
            .map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
        </div>
      </section>

      {/* Featured Daily Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-display text-stone-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-bazaar-saffron" />
              <span>Popular Essentials & Farm-Fresh Produce</span>
            </h2>
            <p className="text-xs text-stone-500">
              Priced in Indian Rupees (₹) with guaranteed freshness and local authenticity
            </p>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-bazaar-maroon dark:text-bazaar-saffron hover:underline"
          >
            See Full Catalog ({products.length} Items) →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onBargainQuote={onBargainQuote}
            />
          ))}
        </div>
      </section>

      {/* Smart Planner Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-bazaar-maroon via-bazaar-maroon-700 to-amber-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bazaar-saffron text-bazaar-charcoal font-bold text-xs uppercase tracking-wider">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Signature Feature</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-display leading-tight">
              Smart Shopping Planner for Indian Households
            </h3>

            <p className="text-sm text-bazaar-cream-200 leading-relaxed">
              Stop maintaining messy paper chits! Organize your daily kitchen greens, weekly grocery staples, and monthly household budgets. Automatically compare rates between traditional mandis and modern stores, and transfer everything to your cart with one click.
            </p>

            <div className="pt-2">
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-bazaar-saffron hover:bg-bazaar-saffron/90 text-bazaar-charcoal font-bold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105"
              >
                <span>Open Smart Planner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
