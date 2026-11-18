// Domain Types for Bazaar One Marketplace

export type UserRole = 'customer' | 'vendor' | 'delivery' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  avatarUrl?: string;
  address?: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  shopId?: string; // If role is vendor
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MarketType = 'traditional' | 'modern' | 'both';

export type TraditionalCategory =
  | 'kirana'
  | 'vegetables'
  | 'fruits'
  | 'dairy'
  | 'grains-pulses'
  | 'spices'
  | 'traditional-clothing'
  | 'handicrafts'
  | 'flowers'
  | 'street-vendors'
  | 'homemade'
  | 'regional-specialties'
  | 'puja-samagri'
  | 'traditional-snacks';

export type ModernCategory =
  | 'supermarkets'
  | 'departmental'
  | 'electronics'
  | 'household'
  | 'personal-care'
  | 'packaged-food'
  | 'modern-clothing'
  | 'home-essentials'
  | 'organic';

export type UnitOfMeasure =
  | 'kg'
  | 'g'
  | 'L'
  | 'ml'
  | 'piece'
  | 'packet'
  | 'dozen'
  | 'box'
  | 'bundle';

export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  marketType: 'traditional' | 'modern';
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  contactNumber: string;
  whatsappNumber?: string;
  address: {
    street: string;
    landmark?: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  openingTime: string;
  closingTime: string;
  isOpenToday: boolean;
  offersDelivery: boolean;
  offersPickup: boolean;
  minimumOrder: number;
  deliveryFee: number;
  isVerified: boolean;
  distanceKm?: number;
  upiId?: string;
  gstNumber?: string;
  fssaiNumber?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  marketType: 'traditional' | 'modern';
  name: string;
  regionalName?: string; // Hindi/Marathi name (e.g., 'हळद' / 'हल्दी' for Turmeric)
  brand?: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number; // in INR
  originalPrice?: number; // for discount display
  unit: UnitOfMeasure;
  stockQuantity: number;
  lowStockThreshold: number;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  // Quality & Verification attributes
  freshnessStatus?: 'farm-fresh' | 'same-day' | 'standard';
  expiryDate?: string;
  batchNumber?: string;
  isQualityChecked?: boolean;
  originState?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface VendorCartSplit {
  shopId: string;
  shopName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export type OrderStatus =
  | 'placed'
  | 'payment_confirmed'
  | 'accepted_by_shop'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refund_initiated'
  | 'refunded';

export type PaymentMethod = 'upi' | 'razorpay' | 'cod' | 'card' | 'netbanking';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shopId: string;
  shopName: string;
  items: {
    productId: string;
    name: string;
    unit: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  deliveryAddress: {
    street: string;
    area: string;
    city: string;
    pincode: string;
  };
  fulfillmentType: 'delivery' | 'pickup';
  deliveryInstructions?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentReference?: string;
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  createdAt: string;
  updatedAt: string;
}

// Shopping Planner Types
export type PlannerFrequency = 'daily' | 'weekly' | 'monthly';

export interface ShoppingListItem {
  id: string;
  name: string;
  category: string;
  estimatedPrice: number;
  quantity: number;
  unit: UnitOfMeasure;
  isPurchased: boolean;
  preferredShopId?: string;
  preferredShopName?: string;
  productId?: string;
  dayOfWeek?: string; // For weekly planner (e.g. 'Monday', 'Tuesday')
  notes?: string;
}

export interface ShoppingPlan {
  id: string;
  userId: string;
  title: string;
  frequency: PlannerFrequency;
  budget: number;
  spent: number;
  items: ShoppingListItem[];
  month?: string; // e.g. "November 2026"
  createdAt: string;
  updatedAt: string;
}

// Quality Report
export interface QualityReport {
  id: string;
  customerId: string;
  customerName: string;
  orderId: string;
  shopId: string;
  shopName: string;
  productName: string;
  category: 'spoilage' | 'damaged' | 'expired' | 'incorrect_item' | 'weight_mismatch' | 'other';
  description: string;
  purchaseDate: string;
  status: 'submitted' | 'under_review' | 'resolved' | 'rejected';
  resolutionNotes?: string;
  createdAt: string;
}
