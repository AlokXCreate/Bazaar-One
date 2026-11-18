import React, { useState } from 'react';
import { Product, Order, QualityReport } from '../../types';
import { Modal } from '../common/Modal';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface QualityReportProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QualityReportModal: React.FC<QualityReportProps> = ({ product, isOpen, onClose }) => {
  const { submitQualityReport } = useMarketplace();
  const { orders } = useCart();
  const { user } = useAuth();

  const [orderId, setOrderId] = useState(orders[0]?.id || 'BZR-ORD-8819');
  const [category, setCategory] = useState<QualityReport['category']>('weight_mismatch');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQualityReport({
      customerId: user?.uid || 'guest-user',
      customerName: user?.displayName || 'Aarav Sharma',
      orderId,
      shopId: product?.shopId || 'shop-trad-1',
      shopName: product?.shopName || 'Shree Ganesh Kirana',
      productName: product?.name || 'Reported Grocery Item',
      category,
      description,
      purchaseDate: new Date().toISOString(),
    });
    setIsSubmitted(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsSubmitted(false);
        onClose();
      }}
      title="Product Quality & Trust Report"
      subtitle="Bazaar One Consumer Protection & Quality Assurance Cell"
      maxWidth="md"
    >
      {isSubmitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
            Quality Complaint Registered
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Our quality compliance officer and merchant dispute desk will investigate this matter within 24 business hours.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-bazaar-maroon text-white hover:bg-bazaar-maroon-700"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Consumer Trust Guarantee:</strong> We ensure that every traditional mandi vendor and retail store upholds genuine weights, freshness and packaging standards.
            </div>
          </div>

          <div className="text-xs text-stone-600 dark:text-stone-300 space-y-1">
            <div>
              <span className="text-stone-400">Target Product: </span>
              <strong>{product?.name || 'Selected Item'}</strong>
            </div>
            <div>
              <span className="text-stone-400">Merchant: </span>
              <strong>{product?.shopName || 'Registered Merchant'}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Associated Order ID:
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Complaint Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
            >
              <option value="weight_mismatch">Weight / Quantity Mismatch</option>
              <option value="spoilage">Freshness / Spoilage Issue</option>
              <option value="damaged">Damaged Packaging</option>
              <option value="expired">Past Expiry Date</option>
              <option value="incorrect_item">Incorrect Item Delivered</option>
              <option value="other">Other Concern</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Describe the Concern:
            </label>
            <textarea
              rows={3}
              placeholder="Provide exact details of the discrepancy (e.g. Weight checked on kitchen scale, appearance or smell concern)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-rose-700 hover:bg-rose-800 text-white shadow transition-all flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Submit Formal Quality Complaint</span>
          </button>
        </form>
      )}
    </Modal>
  );
};
