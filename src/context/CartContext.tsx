import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product, VendorCartSplit, Order, PaymentMethod } from '../types';
import { localStore } from '../data/initialSeed';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const CART_STORAGE_KEY = 'bazaar_one_cart';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
  totalDeliveryFee: number;
  totalTax: number;
  totalDiscount: number;
  grandTotal: number;
  vendorSplits: VendorCartSplit[];
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  orders: Order[];
  placeOrder: (details: {
    address: { street: string; area: string; city: string; pincode: string };
    fulfillmentType: 'delivery' | 'pickup';
    paymentMethod: PaymentMethod;
    instructions?: string;
  }) => Promise<{ success: boolean; orderIds: string[] }>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], note?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);

  const { success, warning, error } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      setOrders(localStore.getOrders());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCartToStorage = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
  };

  const addToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    if (product.stockQuantity <= 0) {
      warning(`Sorry, "${product.name}" is currently out of stock.`);
      return;
    }

    const existingIndex = items.findIndex((item) => item.product.id === product.id);

    if (existingIndex > -1) {
      const existing = items[existingIndex];
      const newQty = existing.quantity + quantity;
      if (newQty > product.stockQuantity) {
        warning(`Only ${product.stockQuantity} ${product.unit} available in stock.`);
        return;
      }
      const updated = [...items];
      updated[existingIndex].quantity = newQty;
      saveCartToStorage(updated);
      success(`Updated quantity of "${product.name}" in your cart`);
    } else {
      const updated = [...items, { product, quantity, selectedVariant }];
      saveCartToStorage(updated);
      success(`Added "${product.name}" to cart`);
    }
  };

  const removeFromCart = (productId: string) => {
    const updated = items.filter((item) => item.product.id !== productId);
    saveCartToStorage(updated);
    success('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = items.find((i) => i.product.id === productId);
    if (item && quantity > item.product.stockQuantity) {
      warning(`Cannot exceed available stock of ${item.product.stockQuantity}`);
      return;
    }
    const updated = items.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage([]);
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BAZAAR50' || clean === 'FIRSTBUY') {
      setAppliedCoupon(clean);
      setCouponDiscountPercent(10); // 10% instant discount
      success(`Coupon "${clean}" applied! 10% discount added to order.`);
      return true;
    } else if (clean === 'DESI20') {
      setAppliedCoupon(clean);
      setCouponDiscountPercent(20);
      success('Special Festival Coupon DESI20 applied! 20% discount added.');
      return true;
    } else {
      error('Invalid or expired coupon code. Try BAZAAR50 or DESI20.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
    success('Coupon removed');
  };

  // Group items by shop (vendor splitting)
  const vendorSplits: VendorCartSplit[] = useMemo(() => {
    const map = new Map<string, { shopName: string; items: CartItem[] }>();

    items.forEach((item) => {
      const sId = item.product.shopId;
      if (!map.has(sId)) {
        map.set(sId, { shopName: item.product.shopName, items: [] });
      }
      map.get(sId)!.items.push(item);
    });

    const splits: VendorCartSplit[] = [];
    map.forEach((val, shopId) => {
      const subtotal = val.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      const deliveryFee = subtotal > 500 ? 0 : 30; // Free delivery above 500 per shop
      const tax = Math.round(subtotal * 0.05); // 5% GST on applicable items
      const total = subtotal + deliveryFee + tax;

      splits.push({
        shopId,
        shopName: val.shopName,
        items: val.items,
        subtotal,
        deliveryFee,
        tax,
        total,
      });
    });

    return splits;
  }, [items]);

  const totalItemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => vendorSplits.reduce((sum, v) => sum + v.subtotal, 0), [vendorSplits]);
  const totalDeliveryFee = useMemo(() => vendorSplits.reduce((sum, v) => sum + v.deliveryFee, 0), [vendorSplits]);
  const totalTax = useMemo(() => vendorSplits.reduce((sum, v) => sum + v.tax, 0), [vendorSplits]);
  const rawTotal = subtotal + totalDeliveryFee + totalTax;
  const totalDiscount = useMemo(() => Math.round((subtotal * couponDiscountPercent) / 100), [subtotal, couponDiscountPercent]);
  const grandTotal = Math.max(0, rawTotal - totalDiscount);

  const placeOrder = async (details: {
    address: { street: string; area: string; city: string; pincode: string };
    fulfillmentType: 'delivery' | 'pickup';
    paymentMethod: PaymentMethod;
    instructions?: string;
  }): Promise<{ success: boolean; orderIds: string[] }> => {
    if (items.length === 0) {
      error('Your cart is empty');
      return { success: false, orderIds: [] };
    }

    const createdOrderIds: string[] = [];
    const newOrders: Order[] = [];

    // Create an order per vendor split
    for (const split of vendorSplits) {
      const orderId = 'BZR-ORD-' + Math.floor(1000 + Math.random() * 9000);
      const discountShare = Math.round((split.subtotal / (subtotal || 1)) * totalDiscount);
      const finalSplitTotal = Math.max(0, split.total - discountShare);

      const order: Order = {
        id: orderId,
        customerId: user?.uid || 'guest-user',
        customerName: user?.displayName || 'Valued Customer',
        customerPhone: user?.phoneNumber || '+91 98221 00000',
        shopId: split.shopId,
        shopName: split.shopName,
        items: split.items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          unit: i.product.unit,
          price: i.product.price,
          quantity: i.quantity,
          imageUrl: i.product.imageUrl,
        })),
        subtotal: split.subtotal,
        deliveryFee: details.fulfillmentType === 'pickup' ? 0 : split.deliveryFee,
        tax: split.tax,
        discount: discountShare,
        totalAmount: details.fulfillmentType === 'pickup' ? finalSplitTotal - split.deliveryFee : finalSplitTotal,
        deliveryAddress: details.address,
        fulfillmentType: details.fulfillmentType,
        deliveryInstructions: details.instructions,
        paymentMethod: details.paymentMethod,
        paymentStatus: details.paymentMethod === 'cod' ? 'pending' : 'completed',
        paymentReference:
          details.paymentMethod === 'upi'
            ? 'UPI-' + Math.random().toString(36).substring(2, 10).toUpperCase()
            : details.paymentMethod === 'razorpay'
            ? 'pay_' + Math.random().toString(36).substring(2, 12)
            : undefined,
        orderStatus: 'placed',
        statusHistory: [
          {
            status: 'placed',
            timestamp: new Date().toISOString(),
            note: `Order placed via ${details.paymentMethod.toUpperCase()}`,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      createdOrderIds.push(orderId);
      newOrders.push(order);
    }

    const updatedOrders = [...newOrders, ...orders];
    setOrders(updatedOrders);
    localStore.saveOrders(updatedOrders);

    // Atomically update inventory in products
    const allProducts = localStore.getProducts();
    const productUpdates = allProducts.map((p) => {
      const foundInCart = items.find((ci) => ci.product.id === p.id);
      if (foundInCart) {
        return {
          ...p,
          stockQuantity: Math.max(0, p.stockQuantity - foundInCart.quantity),
        };
      }
      return p;
    });
    localStore.saveProducts(productUpdates);

    clearCart();
    return { success: true, orderIds: createdOrderIds };
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus'], note?: string) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          orderStatus: status,
          updatedAt: new Date().toISOString(),
          statusHistory: [
            ...ord.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              note: note || `Status changed to ${status.replace(/_/g, ' ')}`,
            },
          ],
        };
      }
      return ord;
    });
    setOrders(updated);
    localStore.saveOrders(updated);
    success(`Order ${orderId} updated to ${status.replace(/_/g, ' ')}`);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemCount,
        subtotal,
        totalDeliveryFee,
        totalTax,
        totalDiscount,
        grandTotal,
        vendorSplits,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orders,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
