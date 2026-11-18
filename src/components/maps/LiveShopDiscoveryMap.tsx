import React, { useState } from 'react';
import { Shop } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ShopCard } from '../marketplace/ShopCard';
import { MapPin, Navigation, Phone, Clock, Store, Building2, Search } from 'lucide-react';

export const LiveShopDiscoveryMap: React.FC = () => {
  const { filteredShops, marketFilter, setMarketFilter } = useMarketplace();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(filteredShops[0] || null);
  const [userLocationName, setUserLocationName] = useState('Pune, Maharashtra (411030)');
  const [locationSearch, setLocationSearch] = useState('');

  // Center coordinate around Pune Market Area
  const centerLat = 18.5204;
  const centerLng = 73.8567;

  return (
    <div className="space-y-6">
      {/* Search & Location Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-bazaar-saffron/20 text-bazaar-maroon flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Current Discovery Location
            </div>
            <div className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <span>{userLocationName}</span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                GPS Verified
              </span>
            </div>
          </div>
        </div>

        {/* Search location */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Change area or PIN code..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>
          <button
            onClick={() => {
              if (locationSearch.trim()) {
                setUserLocationName(locationSearch);
                setLocationSearch('');
              }
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-bazaar-maroon text-white hover:bg-bazaar-maroon-700 transition-colors shadow-sm"
          >
            Update
          </button>
        </div>
      </div>

      {/* Map Layout: Left Interactive Canvas, Right Shop Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Interactive Map Visualizer Canvas */}
        <div className="lg:col-span-7 bg-stone-100 dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 relative overflow-hidden shadow-inner flex flex-col justify-between p-6">
          {/* Simulated Google Maps Tiles / Aesthetic Map Grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#7A263A_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Top Controls Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-white/90 dark:bg-stone-850/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold shadow flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{filteredShops.length} Registered Stores Discovered</span>
            </div>

            <div className="flex items-center gap-2 bg-white/90 dark:bg-stone-850/90 backdrop-blur-md p-1 rounded-xl border border-stone-200 dark:border-stone-700 shadow text-xs">
              <button
                onClick={() => setMarketFilter('both')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  marketFilter === 'both' ? 'bg-bazaar-maroon text-white' : 'text-stone-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMarketFilter('traditional')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  marketFilter === 'traditional' ? 'bg-bazaar-maroon text-white' : 'text-stone-600'
                }`}
              >
                Traditional
              </button>
              <button
                onClick={() => setMarketFilter('modern')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  marketFilter === 'modern' ? 'bg-emerald-700 text-white' : 'text-stone-600'
                }`}
              >
                Modern
              </button>
            </div>
          </div>

          {/* Markers Playground */}
          <div className="relative flex-1 min-h-[360px] flex items-center justify-center my-4">
            {/* Center User Marker */}
            <div className="absolute z-20 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-blue-300 dark:ring-blue-900 shadow-lg animate-pulse">
                <Navigation className="w-3 h-3 fill-current rotate-45" />
              </div>
              <span className="bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded shadow mt-1 font-bold">
                You are here
              </span>
            </div>

            {/* Shop Markers dispersed based on coordinates */}
            {filteredShops.map((shop, idx) => {
              const isSelected = selectedShop?.id === shop.id;
              // Distribute markers visually around center
              const angles = [0, 45, 90, 135, 180, 225, 270, 315];
              const angle = (angles[idx % angles.length] * Math.PI) / 180;
              const distance = 80 + (idx % 3) * 45;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;

              return (
                <div
                  key={shop.id}
                  onClick={() => setSelectedShop(shop)}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className="absolute cursor-pointer transition-all duration-300 group z-10 hover:z-30"
                >
                  <div
                    className={`p-2 rounded-2xl flex items-center gap-1.5 shadow-xl border-2 transition-transform ${
                      isSelected
                        ? 'scale-110 ring-4 ring-bazaar-saffron bg-white dark:bg-stone-900 border-bazaar-maroon'
                        : 'group-hover:scale-105 bg-white/95 dark:bg-stone-850/95 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-white ${
                        shop.marketType === 'traditional' ? 'bg-bazaar-maroon' : 'bg-bazaar-green'
                      }`}
                    >
                      {shop.marketType === 'traditional' ? (
                        <Store className="w-4 h-4" />
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-left pr-1">
                      <div className="text-[11px] font-bold text-stone-900 dark:text-white max-w-[120px] truncate">
                        {shop.name}
                      </div>
                      <div className="text-[9px] text-stone-500 font-semibold">
                        {shop.distanceKm} km • ★ {shop.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Active Marker Preview Card */}
          {selectedShop && (
            <div className="relative z-10 p-4 rounded-2xl bg-white/95 dark:bg-stone-850/95 backdrop-blur-md border border-stone-200 dark:border-stone-700 shadow-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={selectedShop.imageUrl}
                  alt={selectedShop.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-stone-900 dark:text-white truncate">
                    {selectedShop.name}
                  </h4>
                  <p className="text-xs text-stone-500 truncate">
                    {selectedShop.address.street}, {selectedShop.address.area}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-bazaar-maroon dark:text-bazaar-saffron mt-0.5">
                    <span>{selectedShop.openingTime} - {selectedShop.closingTime}</span>
                    <span>•</span>
                    <span>{selectedShop.offersDelivery ? 'Home Delivery' : 'Pickup only'}</span>
                  </div>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShop.address.lat},${selectedShop.address.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white text-xs font-bold shadow flex-shrink-0 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </a>
            </div>
          )}
        </div>

        {/* Right List View */}
        <div className="lg:col-span-5 space-y-4 max-h-[680px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              Nearby Shops List ({filteredShops.length})
            </h3>
            <span className="text-xs text-stone-500">Sorted by proximity</span>
          </div>

          <div className="space-y-4">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => setSelectedShop(shop)}
                className={`cursor-pointer transition-all ${
                  selectedShop?.id === shop.id ? 'ring-2 ring-bazaar-saffron rounded-2xl' : ''
                }`}
              >
                <ShopCard shop={shop} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
