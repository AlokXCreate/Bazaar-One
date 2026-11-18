import React from 'react';
import { Shop } from '../../types';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { Phone, MessageCircle, MapPin, Clock, Truck, ShoppingBag, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ShopCardProps {
  shop: Shop;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  return (
    <div className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card hover:shadow-glass-hover transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative h-44 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={shop.marketType === 'traditional' ? 'traditional' : 'modern'}>
              {shop.marketType === 'traditional' ? 'Traditional Market' : 'Modern Retail'}
            </Badge>
          </div>

          {/* Verification Badge */}
          {shop.isVerified && (
            <div className="absolute top-3 right-3 bg-white/95 dark:bg-stone-900/90 text-bazaar-maroon text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow">
              <CheckCircle className="w-3.5 h-3.5 text-bazaar-green" />
              <span>Verified Merchant</span>
            </div>
          )}

          {/* Shop Title inside overlay on image */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="font-extrabold text-base line-clamp-1 drop-shadow-sm font-display">
              {shop.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-stone-200 mt-0.5">
              <span>{shop.ownerName}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300">
                ★ {shop.rating.toFixed(1)} ({shop.ratingCount})
              </span>
            </div>
          </div>
        </div>

        {/* Shop Info Area */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
            {shop.description}
          </p>

          <div className="space-y-1.5 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-bazaar-saffron mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">
                {shop.address.area}, {shop.address.city} ({shop.distanceKm} km away)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-bazaar-green flex-shrink-0" />
              <span>
                {shop.openingTime} - {shop.closingTime} {shop.isOpenToday ? '(Open Now)' : '(Closed)'}
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-stone-600 dark:text-stone-300">
              {shop.offersDelivery && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Truck className="w-3 h-3" /> Home Delivery
                </span>
              )}
              {shop.offersPickup && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <ShoppingBag className="w-3 h-3" /> Counter Pickup
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer: Call, WhatsApp, View Store */}
      <div className="p-4 pt-0">
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 grid grid-cols-3 gap-2">
          {/* Call button */}
          <a
            href={`tel:${shop.contactNumber}`}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors"
            title="Call Shop Directly"
          >
            <Phone className="w-3.5 h-3.5 text-bazaar-maroon" />
            <span>Call</span>
          </a>

          {/* WhatsApp button */}
          <a
            href={
              shop.whatsappNumber
                ? `https://wa.me/${shop.whatsappNumber.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                    shop.name
                  )},%20I%20found%20your%20shop%20on%20Bazaar%20One.`
                : '#'
            }
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 transition-colors border border-emerald-200 dark:border-emerald-800"
            title="WhatsApp Enquiry"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chat</span>
          </a>

          {/* View Store button */}
          <Link
            to={`/shops/${shop.id}`}
            className="flex items-center justify-center py-2 px-2 rounded-xl text-xs font-bold bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white transition-colors shadow-sm"
          >
            <span>Visit Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
