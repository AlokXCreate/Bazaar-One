import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { CartProvider } from './context/CartContext';
import { PlannerProvider } from './context/PlannerContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { BazaarAIAssistant } from './components/ai/BazaarAIAssistant';
import { DocumentExportModal } from './components/documents/DocumentExportModal';
import { ProductQuickViewModal } from './components/marketplace/ProductQuickViewModal';
import { BargainQuoteModal } from './components/marketplace/BargainQuoteModal';
import { QualityReportModal } from './components/quality/QualityReportModal';

import { HomePage } from './pages/marketplace/HomePage';
import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { ShopDetailPage } from './pages/marketplace/ShopDetailPage';
import { LiveMapsPage } from './pages/marketplace/LiveMapsPage';
import { ShoppingPlannerPage } from './pages/customer/ShoppingPlannerPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { VendorDashboardPage } from './pages/vendor/VendorDashboardPage';
import { DeliveryPartnerDashboardPage } from './pages/delivery/DeliveryPartnerDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Product } from './types';

export function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [bargainProduct, setBargainProduct] = useState<Product | null>(null);
  const [reportProduct, setReportProduct] = useState<Product | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-bazaar-cream-100 dark:bg-stone-950 text-bazaar-charcoal dark:text-stone-100 font-sans selection:bg-bazaar-saffron selection:text-bazaar-charcoal">
      {/* Universal Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onQuickView={(p) => setQuickViewProduct(p)}
                onBargainQuote={(p) => setBargainProduct(p)}
                onOpenAI={() => setIsAIOpen(true)}
              />
            }
          />
          <Route
            path="/marketplace"
            element={
              <MarketplacePage
                onQuickView={(p) => setQuickViewProduct(p)}
                onBargainQuote={(p) => setBargainProduct(p)}
              />
            }
          />
          <Route
            path="/shops/:shopId"
            element={
              <ShopDetailPage
                onQuickView={(p) => setQuickViewProduct(p)}
                onBargainQuote={(p) => setBargainProduct(p)}
              />
            }
          />
          <Route path="/maps" element={<LiveMapsPage />} />
          <Route
            path="/planner"
            element={
              <ShoppingPlannerPage
                onOpenAI={() => setIsAIOpen(true)}
                onOpenExportModal={() => setIsExportModalOpen(true)}
              />
            }
          />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/orders/:orderId"
            element={
              <OrderTrackingPage
                onOpenReportModal={(order) => {
                  setReportProduct({
                    id: order.items[0]?.productId || 'p1',
                    shopId: order.shopId,
                    shopName: order.shopName,
                    name: order.items[0]?.name || 'Item',
                    price: order.totalAmount,
                    unit: 'piece',
                    stockQuantity: 10,
                    lowStockThreshold: 2,
                    isAvailable: true,
                    marketType: 'traditional',
                    category: 'kirana',
                    description: '',
                    imageUrl: order.items[0]?.imageUrl || '',
                    rating: 5,
                    reviewCount: 1,
                    tags: [],
                  });
                }}
              />
            }
          />
          <Route path="/customer" element={<CustomerDashboardPage />} />
          <Route path="/vendor" element={<VendorDashboardPage />} />
          <Route path="/delivery" element={<DeliveryPartnerDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <BazaarAIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      <DocumentExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenReportModal={(p) => setReportProduct(p)}
      />

      <BargainQuoteModal
        product={bargainProduct}
        isOpen={!!bargainProduct}
        onClose={() => setBargainProduct(null)}
      />

      <QualityReportModal
        product={reportProduct}
        isOpen={!!reportProduct}
        onClose={() => setReportProduct(null)}
      />

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <MarketplaceProvider>
            <CartProvider>
              <PlannerProvider>
                <AppContent />
              </PlannerProvider>
            </CartProvider>
          </MarketplaceProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
