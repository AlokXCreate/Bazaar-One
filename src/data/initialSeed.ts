import { Shop, Product, Order, ShoppingPlan, QualityReport, UserProfile } from '../types';
import { MOCK_SHOPS } from './mockShops';
import { MOCK_PRODUCTS } from './mockProducts';
import { MOCK_ORDERS } from './mockOrders';
import { MOCK_SHOPPING_PLANS } from './mockPlans';

const STORAGE_KEYS = {
  SHOPS: 'bazaar_one_shops',
  PRODUCTS: 'bazaar_one_products',
  ORDERS: 'bazaar_one_orders',
  PLANS: 'bazaar_one_plans',
  REPORTS: 'bazaar_one_quality_reports',
  USERS: 'bazaar_one_users',
  CURRENT_USER: 'bazaar_one_current_user',
};

export const DEFAULT_USERS: UserProfile[] = [
  {
    uid: 'cust-demo-1',
    email: 'aarav.customer@bazaarone.in',
    displayName: 'Aarav Sharma',
    phoneNumber: '+91 98221 55678',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    address: {
      street: 'Flat 402, Sai Vihar Apartment, Sadashiv Peth',
      area: 'Sadashiv Peth',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411030',
    },
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z',
  },
  {
    uid: 'vendor-1',
    email: 'rameshwar.vendor@bazaarone.in',
    displayName: 'Rameshwar Lal Gupta',
    phoneNumber: '+91 98220 14589',
    role: 'vendor',
    shopId: 'shop-trad-1',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isVerified: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z',
  },
  {
    uid: 'deliv-1',
    email: 'rahul.delivery@bazaarone.in',
    displayName: 'Rahul Jadhav',
    phoneNumber: '+91 97665 43210',
    role: 'delivery',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isVerified: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z',
  },
  {
    uid: 'admin-1',
    email: 'superadmin@bazaarone.in',
    displayName: 'Super Admin (Bazaar One)',
    phoneNumber: '+91 99999 00001',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z',
  },
];

export function initializeLocalStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.SHOPS)) {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(MOCK_SHOPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(MOCK_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PLANS)) {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(MOCK_SHOPPING_PLANS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default logged in as demo customer
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    const defaultReports: QualityReport[] = [
      {
        id: 'QR-1001',
        customerId: 'cust-demo-1',
        customerName: 'Aarav Sharma',
        orderId: 'BZR-ORD-8819',
        shopId: 'shop-trad-5',
        shopName: 'Chitale & Joshi Traditional Sweets',
        productName: 'Authentic Kaju Katli',
        category: 'weight_mismatch',
        description: 'Box showed 250g label but on digital kitchen scale it weighed 218g including packaging.',
        purchaseDate: '2026-11-17T16:00:00Z',
        status: 'under_review',
        createdAt: '2026-11-17T18:00:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(defaultReports));
  }
}

// Local Storage Helper APIs
export const localStore = {
  getShops(): Shop[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPS);
      return data ? JSON.parse(data) : MOCK_SHOPS;
    } catch {
      return MOCK_SHOPS;
    }
  },
  saveShops(shops: Shop[]) {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
  },

  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : MOCK_PRODUCTS;
    } catch {
      return MOCK_PRODUCTS;
    }
  },
  saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : MOCK_ORDERS;
    } catch {
      return MOCK_ORDERS;
    }
  },
  saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  getPlans(): ShoppingPlan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANS);
      return data ? JSON.parse(data) : MOCK_SHOPPING_PLANS;
    } catch {
      return MOCK_SHOPPING_PLANS;
    }
  },
  savePlans(plans: ShoppingPlan[]) {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  },

  getReports(): QualityReport[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveReports(reports: QualityReport[]) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  },

  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
    }
  },
  setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  },
  saveUsers(users: UserProfile[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
};
