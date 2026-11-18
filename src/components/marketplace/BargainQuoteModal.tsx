import React, { useState } from 'react';
import { Product } from '../../types';
import { Modal } from '../common/Modal';
import { formatINR } from '../../utils/currency';
import { useMarketplace } from '../../context/MarketplaceContext';
import { MessageSquare, Check, ArrowRight } from 'lucide-react';

interface BargainModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BargainQuoteModal: React.FC<BargainModalProps> = ({ product, isOpen, onClose }) => {
  const [targetQuantity, setTargetQuantity] = useState(5);
  const [offeredRate, setOfferedRate] = useState(product ? Math.round(product.price * 0.9) : 100);
  const [message, setMessage] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const { submitBargainRequest } = useMarketplace();

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBargainRequest({
      productId: product.id,
      productName: product.name,
      shopId: product.shopId,
      shopName: product.shopName,
      targetQuantity,
      unit: product.unit,
      originalPrice: product.price,
      offeredRate,
      customerPhone,
      message,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bargain / Request Bulk Price Quote"
      subtitle={`Traditional bazaar direct quotation for ${product.name}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
          <strong>Direct Shopkeeper Negotiation:</strong> Traditional vendors often provide attractive discounts for larger quantities or regular family weekly orders.
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-stone-200 dark:border-stone-800">
          <span className="text-stone-500">Regular Listed Price:</span>
          <span className="font-bold text-stone-900 dark:text-white">
            {formatINR(product.price)} / {product.unit}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Required Quantity ({product.unit}):
          </label>
          <input
            type="number"
            min="1"
            value={targetQuantity}
            onChange={(e) => setTargetQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Your Proposed Rate per {product.unit} (₹):
          </label>
          <input
            type="number"
            min="1"
            value={offeredRate}
            onChange={(e) => setOfferedRate(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
            required
          />
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            Total proposed quote: {formatINR(offeredRate * targetQuantity)}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Your Mobile Number (for shopkeeper call / WhatsApp response):
          </label>
          <input
            type="tel"
            placeholder="+91 98XXX XXXXX"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Note / Special Requirement (Optional):
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Need weekly supply every Sunday, or festival puja preparation"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl text-sm font-bold bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white shadow transition-all flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Send Quote Request to {product.shopName}</span>
        </button>
      </form>
    </Modal>
  );
};
