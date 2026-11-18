import React, { useState } from 'react';
import { Product } from '../../types';
import { Modal } from '../common/Modal';
import { formatINR } from '../../utils/currency';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Plus, Minus, Store, ShieldCheck, MapPin, AlertCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReportModal?: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<QuickViewProps> = ({
  product,
  isOpen,
  onClose,
  onOpenReportModal,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      subtitle={`Offered by ${product.shopName}`}
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <Badge variant={product.marketType === 'traditional' ? 'traditional' : 'modern'}>
              {product.marketType === 'traditional' ? 'Traditional Market' : 'Modern Retail'}
            </Badge>
            {product.freshnessStatus === 'farm-fresh' && (
              <Badge variant="success">🌱 Farm-Fresh Today</Badge>
            )}
          </div>
        </div>

        {/* Details & Specs */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            {/* Title & Regional Name */}
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-white font-display">
              {product.name}
            </h2>
            {product.regionalName && (
              <p className="text-sm font-semibold text-bazaar-maroon dark:text-bazaar-saffron mt-0.5">
                {product.regionalName}
              </p>
            )}

            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={product.rating} count={product.reviewCount} size={16} />
              <span className="text-xs text-stone-400">|</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} ${product.unit})` : 'Out of Stock'}
              </span>
            </div>

            {/* Price section */}
            <div className="mt-4 p-3 rounded-xl bg-bazaar-cream-200/60 dark:bg-stone-800/80 border border-bazaar-cream-300 dark:border-stone-700 flex items-baseline gap-2">
              <span className="text-2xl font-black text-bazaar-maroon dark:text-bazaar-saffron font-display">
                {formatINR(product.price)}
              </span>
              <span className="text-sm text-stone-600 dark:text-stone-300 font-medium">/{product.unit}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-stone-400 line-through ml-2">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mt-4">
              {product.description}
            </p>

            {/* Verification & Origin Details */}
            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
              {product.originState && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Origin / Farm State:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{product.originState}</span>
                </div>
              )}
              {product.brand && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Brand:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{product.brand}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Quality Verified:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Checked for purity
                </span>
              </div>
            </div>
          </div>

          {/* Quantity selector & Add to Cart button */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Select Quantity:</span>
              <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              className="w-full py-3 rounded-xl font-bold text-sm bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add {quantity} to Shopping Cart • {formatINR(product.price * quantity)}</span>
            </button>

            {/* Quality Report Link */}
            {onOpenReportModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReportModal(product);
                }}
                className="w-full text-center text-xs text-rose-700 dark:text-rose-400 hover:underline flex items-center justify-center gap-1 pt-1"
              >
                <AlertCircle className="w-3 h-3" />
                <span>Notice an issue? Report Product Quality Concern</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
