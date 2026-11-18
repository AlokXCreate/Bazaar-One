import React from 'react';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Plus, Minus, Eye, MessageSquare, Check, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onBargainQuote?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onBargainQuote,
}) => {
  const { items, addToCart, updateQuantity } = useCart();

  const cartItem = items.find((i) => i.product.id === product.id);
  const inCartQty = cartItem?.quantity || 0;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="group relative bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-card hover:shadow-glass-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <Badge variant={product.marketType === 'traditional' ? 'traditional' : 'modern'} size="sm">
            {product.marketType === 'traditional' ? 'Traditional Bazaar' : 'Modern Retail'}
          </Badge>

          {product.freshnessStatus === 'farm-fresh' && (
            <Badge variant="success" size="sm">
              🌱 Farm-Fresh Today
            </Badge>
          )}
          {product.freshnessStatus === 'same-day' && (
            <Badge variant="warning" size="sm">
              ✨ Freshly Milled / Prepared
            </Badge>
          )}
        </div>

        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5 z-10 bg-bazaar-saffron text-bazaar-charcoal font-black text-xs px-2 py-0.5 rounded-full shadow">
            {discountPercent}% OFF
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/90 text-stone-900 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow-lg transition-all transform scale-75 group-hover:scale-100 hover:bg-white"
          title="Quick View Details"
        >
          <Eye className="w-5 h-5 text-bazaar-maroon" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Shop Name & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <Link
              to={`/shops/${product.shopId}`}
              className="flex items-center gap-1 font-medium hover:text-bazaar-maroon transition-colors truncate max-w-[70%]"
            >
              <Store className="w-3.5 h-3.5 text-bazaar-saffron flex-shrink-0" />
              <span className="truncate">{product.shopName}</span>
            </Link>
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-stone-900 dark:text-white text-sm line-clamp-1 cursor-pointer hover:text-bazaar-maroon transition-colors"
          >
            {product.name}
          </h3>

          {/* Regional Name (Hindi / Marathi) */}
          {product.regionalName && (
            <p className="text-xs text-bazaar-maroon-600 dark:text-bazaar-saffron font-medium mt-0.5 line-clamp-1">
              {product.regionalName}
            </p>
          )}

          {/* Description snippet */}
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Pricing & Cart Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-stone-900 dark:text-white font-display">
                {formatINR(product.price)}
              </span>
              <span className="text-xs text-stone-500 font-medium">/{product.unit}</span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart / Stepper */}
          <div className="flex items-center gap-2">
            {/* Bargain button for traditional items */}
            {product.marketType === 'traditional' && onBargainQuote && (
              <button
                onClick={() => onBargainQuote(product)}
                title="Bargain / Request Bulk Quote"
                className="p-2 rounded-xl text-stone-500 hover:text-bazaar-maroon hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            )}

            {inCartQty > 0 ? (
              <div className="flex items-center bg-bazaar-maroon text-white rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => updateQuantity(product.id, inCartQty - 1)}
                  className="px-2.5 py-1.5 hover:bg-bazaar-maroon-700 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-bold">{inCartQty}</span>
                <button
                  onClick={() => updateQuantity(product.id, inCartQty + 1)}
                  className="px-2.5 py-1.5 hover:bg-bazaar-maroon-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                disabled={product.stockQuantity <= 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
