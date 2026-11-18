import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Shop, Product, MarketType, QualityReport } from '../types';
import { localStore } from '../data/initialSeed';
import { useToast } from './ToastContext';

interface MarketplaceContextType {
  shops: Shop[];
  products: Product[];
  marketFilter: MarketType;
  setMarketFilter: (type: MarketType) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredProducts: Product[];
  filteredShops: Shop[];
  getShopById: (id: string) => Shop | undefined;
  getProductById: (id: string) => Product | undefined;
  getProductsByShop: (shopId: string) => Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addShop: (shop: Omit<Shop, 'id'>) => Shop;
  updateShop: (id: string, data: Partial<Shop>) => void;
  qualityReports: QualityReport[];
  submitQualityReport: (report: Omit<QualityReport, 'id' | 'createdAt' | 'status'>) => void;
  updateReportStatus: (id: string, status: QualityReport['status'], notes?: string) => void;
  bargainQuoteRequests: any[];
  submitBargainRequest: (data: any) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [qualityReports, setQualityReports] = useState<QualityReport[]>([]);
  const [bargainQuoteRequests, setBargainQuoteRequests] = useState<any[]>([]);

  const [marketFilter, setMarketFilter] = useState<MarketType>('both');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { success } = useToast();

  useEffect(() => {
    setShops(localStore.getShops());
    setProducts(localStore.getProducts());
    setQualityReports(localStore.getReports());
  }, []);

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      // Market filter
      if (marketFilter !== 'both' && shop.marketType !== marketFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && shop.category !== selectedCategory) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = shop.name.toLowerCase().includes(q);
        const matchesArea = shop.address.area.toLowerCase().includes(q) || shop.address.city.toLowerCase().includes(q);
        const matchesCategory = shop.category.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesCategory) return false;
      }
      return true;
    });
  }, [shops, marketFilter, selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Market filter
      if (marketFilter !== 'both' && prod.marketType !== marketFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }
      // Search query (handles English, regional Hindi/Marathi, brands, tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesRegional = prod.regionalName ? prod.regionalName.toLowerCase().includes(q) : false;
        const matchesBrand = prod.brand ? prod.brand.toLowerCase().includes(q) : false;
        const matchesShop = prod.shopName.toLowerCase().includes(q);
        const matchesCategory = prod.category.toLowerCase().includes(q);
        const matchesTags = prod.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchesName && !matchesRegional && !matchesBrand && !matchesShop && !matchesCategory && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [products, marketFilter, selectedCategory, searchQuery]);

  const getShopById = (id: string) => shops.find((s) => s.id === id);
  const getProductById = (id: string) => products.find((p) => p.id === id);
  const getProductsByShop = (shopId: string) => products.filter((p) => p.shopId === shopId);

  const addProduct = (prodData: Omit<Product, 'id'>): Product => {
    const newProd: Product = {
      ...prodData,
      id: 'prod-' + Date.now(),
    };
    const updated = [newProd, ...products];
    setProducts(updated);
    localStore.saveProducts(updated);
    success(`Added product "${newProd.name}" to inventory`);
    return newProd;
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...data } : p));
    setProducts(updated);
    localStore.saveProducts(updated);
    success('Product inventory updated');
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStore.saveProducts(updated);
    success('Product removed from catalog');
  };

  const addShop = (shopData: Omit<Shop, 'id'>): Shop => {
    const newShop: Shop = {
      ...shopData,
      id: 'shop-' + Date.now(),
    };
    const updated = [newShop, ...shops];
    setShops(updated);
    localStore.saveShops(updated);
    success(`Registered new store "${newShop.name}"`);
    return newShop;
  };

  const updateShop = (id: string, data: Partial<Shop>) => {
    const updated = shops.map((s) => (s.id === id ? { ...s, ...data } : s));
    setShops(updated);
    localStore.saveShops(updated);
    success('Store profile updated');
  };

  const submitQualityReport = (reportData: Omit<QualityReport, 'id' | 'createdAt' | 'status'>) => {
    const newReport: QualityReport = {
      ...reportData,
      id: 'QR-' + Math.floor(1000 + Math.random() * 9000),
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    const updated = [newReport, ...qualityReports];
    setQualityReports(updated);
    localStore.saveReports(updated);
    success(`Quality report #${newReport.id} submitted for investigation`);
  };

  const updateReportStatus = (id: string, status: QualityReport['status'], notes?: string) => {
    const updated = qualityReports.map((r) =>
      r.id === id ? { ...r, status, resolutionNotes: notes || r.resolutionNotes } : r
    );
    setQualityReports(updated);
    localStore.saveReports(updated);
    success(`Report #${id} updated to ${status}`);
  };

  const submitBargainRequest = (data: any) => {
    const req = {
      id: 'BR-' + Date.now(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setBargainQuoteRequests((prev) => [req, ...prev]);
    success('Bargain / quote request sent directly to shopkeeper!');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        shops,
        products,
        marketFilter,
        setMarketFilter,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filteredProducts,
        filteredShops,
        getShopById,
        getProductById,
        getProductsByShop,
        addProduct,
        updateProduct,
        deleteProduct,
        addShop,
        updateShop,
        qualityReports,
        submitQualityReport,
        updateReportStatus,
        bargainQuoteRequests,
        submitBargainRequest,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
