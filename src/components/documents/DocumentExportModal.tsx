import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { usePlanner } from '../../context/PlannerContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { documentExportService } from '../../services/documentExportService';
import { FileText, FileDown, Code, Globe, FileCode, Check } from 'lucide-react';

interface DocumentExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentExportModal: React.FC<DocumentExportModalProps> = ({ isOpen, onClose }) => {
  const { orders } = useCart();
  const { currentPlan } = usePlanner();
  const { products, qualityReports } = useMarketplace();

  const [docType, setDocType] = useState<'invoice' | 'shopping_list' | 'inventory_report'>('invoice');
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleExport = (format: 'pdf' | 'docx' | 'json' | 'html') => {
    const payload = {
      type: docType,
      title:
        docType === 'invoice'
          ? `Bazaar One Tax Invoice - ${currentOrder?.id || 'RECEIPT'}`
          : docType === 'shopping_list'
          ? `Shopping Planner - ${currentPlan?.title || 'Plan'}`
          : 'Store Inventory & Stock Report',
      order: currentOrder,
      plan: currentPlan,
      products: products,
      qualityReport: qualityReports[0],
    };

    if (format === 'pdf') {
      documentExportService.exportPDF(payload);
    } else if (format === 'docx') {
      documentExportService.exportDOCX(payload);
    } else if (format === 'json') {
      documentExportService.exportJSON(payload);
    } else if (format === 'html') {
      documentExportService.exportHTML(payload);
    }

    setDownloadSuccess(format.toUpperCase());
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bazaar One Document & Invoice Generator"
      subtitle="Export official verified documents in PDF, Microsoft Word, JSON or HTML"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Document Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
            Select Document to Export:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setDocType('invoice')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                docType === 'invoice'
                  ? 'border-bazaar-maroon bg-bazaar-maroon/10 text-bazaar-maroon ring-2 ring-bazaar-maroon'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <FileText className="w-5 h-5 text-bazaar-maroon" />
              <span>Tax Invoice / Bill</span>
            </button>

            <button
              onClick={() => setDocType('shopping_list')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                docType === 'shopping_list'
                  ? 'border-bazaar-green bg-bazaar-green/10 text-bazaar-green ring-2 ring-bazaar-green'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <FileCode className="w-5 h-5 text-bazaar-green" />
              <span>Shopping Plan</span>
            </button>

            <button
              onClick={() => setDocType('inventory_report')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                docType === 'inventory_report'
                  ? 'border-bazaar-saffron bg-amber-50 dark:bg-amber-950/40 text-stone-900 dark:text-white ring-2 ring-bazaar-saffron font-bold'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <FileDown className="w-5 h-5 text-bazaar-saffron" />
              <span>Inventory Report</span>
            </button>
          </div>
        </div>

        {/* Order Selector when docType is invoice */}
        {docType === 'invoice' && (
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Select Order:
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} - {o.shopName} (₹{o.totalAmount})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Format Action Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
            Choose Export Format:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleExport('pdf')}
              className="p-3 rounded-xl bg-bazaar-maroon hover:bg-bazaar-maroon-700 text-white font-bold text-xs flex flex-col items-center gap-1 shadow transition-all"
            >
              <FileDown className="w-5 h-5" />
              <span>PDF Document</span>
            </button>

            <button
              onClick={() => handleExport('docx')}
              className="p-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex flex-col items-center gap-1 shadow transition-all"
            >
              <FileText className="w-5 h-5" />
              <span>Word (.DOCX)</span>
            </button>

            <button
              onClick={() => handleExport('json')}
              className="p-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex flex-col items-center gap-1 shadow transition-all"
            >
              <Code className="w-5 h-5 text-bazaar-saffron" />
              <span>JSON Payload</span>
            </button>

            <button
              onClick={() => handleExport('html')}
              className="p-3 rounded-xl bg-bazaar-green hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center gap-1 shadow transition-all"
            >
              <Globe className="w-5 h-5" />
              <span>Standalone HTML</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-300 dark:border-emerald-800 animate-slide-up">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess} file generated and downloaded successfully!</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
