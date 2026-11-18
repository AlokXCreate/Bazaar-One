import React from 'react';
import { LiveShopDiscoveryMap } from '../../components/maps/LiveShopDiscoveryMap';
import { MapPin, Compass } from 'lucide-react';

export const LiveMapsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bazaar-saffron/20 text-bazaar-maroon dark:text-bazaar-saffron text-xs font-bold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Real-time Geolocation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 dark:text-white">
          Live Store Discovery & Local Mandi Locator
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Explore approved traditional markets, vegetable mandis, spice merchants, and modern retailers around you
        </p>
      </div>

      <LiveShopDiscoveryMap />
    </div>
  );
};
