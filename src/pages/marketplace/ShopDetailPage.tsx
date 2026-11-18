import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { Product } from '../../types';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Star,
  ArrowLeft,
  Store,
} from 'lucide-react';

interface ShopDetailPageProps {
  onQuickView: (product: Product) => void;
  onBargainQuote: (product: Product) => void;
}

export const ShopDetailPage: React.FC<ShopDetailPageProps> = ({
  onQuickView,
  onBargainQuote,
}) => {
  const { shopId } = useParams<{ shopId: string }>();
  const { getShopById, getProductsByShop } = useMarketplace();

  const shop = getShopById(shopId || '');
  const shopProducts = shopId ? getProductsByShop(shopId) : [];

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Store className="w-12 h-12 text-stone-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">Shop Not Found</h2>
        <Link to="/marketplace" className="text-xs text-bazaar-maroon font-bold mt-2 inline-block">
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-bazaar-maroon transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Stores</span>
      </Link>

      {/* Store Banner Card */}
      <div className="rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-card">
        <div className="relative h-48 sm:h-64 w-full bg-stone-100 dark:bg-stone-800">
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-bazaar-saffron text-bazaar-charcoal uppercase">
                  {shop.marketType === 'traditional' ? 'Traditional Bazaar' : 'Modern Retail'}
                </span>
                {shop.isVerified && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display">{shop.name}</h1>
              <p className="text-xs text-stone-200 mt-1">
                Proprietor: {shop.ownerName} • ★ {shop.rating.toFixed(1)} ({shop.ratingCount} reviews)
              </p>
            </div>

            {/* Direct Dial & WhatsApp */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${shop.contactNumber}`}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-stone-900 font-bold text-xs shadow hover:bg-stone-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-bazaar-maroon" />
                <span>Call Store</span>
              </a>

              {shop.whatsappNumber && (
                <a
                  href={`https://wa.me/${shop.whatsappNumber.replace(/\D/g, '')}?text=Namaste%20${encodeURIComponent(
                    shop.name
                  )},%20I%20am%20shopping%20on%20Bazaar%20One.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Store Metadata Row */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600 dark:text-stone-300 border-t border-stone-100 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-bazaar-saffron mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-stone-900 dark:text-white block">Location</span>
              <span>
                {shop.address.street}, {shop.address.area}, {shop.address.city} - {shop.address.pincode}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-bazaar-green mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-stone-900 dark:text-white block">Operating Hours</span>
              <span>
                {shop.openingTime} - {shop.closingTime} (Open Daily)
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-bazaar-maroon mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-stone-900 dark:text-white block">Delivery & Pickup</span>
              <span>
                {shop.offersDelivery ? 'Home Delivery Available' : 'Counter pickup only'} • Min. Order: ₹{shop.minimumOrder}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products from this shop */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-stone-900 dark:text-white">
              Available Store Catalog ({shopProducts.length})
            </h2>
            <p className="text-xs text-stone-500">Live verified inventory directly from this merchant</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {shopProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onBargainQuote={onBargainQuote}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
