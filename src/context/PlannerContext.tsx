import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingPlan, ShoppingListItem, PlannerFrequency } from '../types';
import { localStore } from '../data/initialSeed';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';
import { useMarketplace } from './MarketplaceContext';

interface PlannerContextType {
  plans: ShoppingPlan[];
  activeFrequency: PlannerFrequency;
  setActiveFrequency: (freq: PlannerFrequency) => void;
  currentPlan: ShoppingPlan | undefined;
  addItemToPlan: (planId: string, item: Omit<ShoppingListItem, 'id' | 'isPurchased'>) => void;
  toggleItemPurchased: (planId: string, itemId: string) => void;
  removeItemFromPlan: (planId: string, itemId: string) => void;
  updatePlanBudget: (planId: string, newBudget: number) => void;
  addAllUnpurchasedToCart: (planId: string) => void;
  createPlan: (plan: Omit<ShoppingPlan, 'id' | 'createdAt' | 'updatedAt' | 'spent'>) => ShoppingPlan;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<ShoppingPlan[]>([]);
  const [activeFrequency, setActiveFrequency] = useState<PlannerFrequency>('daily');

  const { success, info } = useToast();
  const { addToCart } = useCart();
  const { products } = useMarketplace();

  useEffect(() => {
    setPlans(localStore.getPlans());
  }, []);

  const savePlans = (newPlans: ShoppingPlan[]) => {
    setPlans(newPlans);
    localStore.savePlans(newPlans);
  };

  const currentPlan = plans.find((p) => p.frequency === activeFrequency) || plans[0];

  const toggleItemPurchased = (planId: string, itemId: string) => {
    const updated = plans.map((plan) => {
      if (plan.id === planId) {
        let spentDelta = 0;
        const newItems = plan.items.map((item) => {
          if (item.id === itemId) {
            const willBePurchased = !item.isPurchased;
            spentDelta = willBePurchased ? item.estimatedPrice : -item.estimatedPrice;
            return { ...item, isPurchased: willBePurchased };
          }
          return item;
        });
        return {
          ...plan,
          items: newItems,
          spent: Math.max(0, plan.spent + spentDelta),
          updatedAt: new Date().toISOString(),
        };
      }
      return plan;
    });
    savePlans(updated);
  };

  const addItemToPlan = (planId: string, itemData: Omit<ShoppingListItem, 'id' | 'isPurchased'>) => {
    const newItem: ShoppingListItem = {
      ...itemData,
      id: 'item-' + Date.now(),
      isPurchased: false,
    };

    const updated = plans.map((plan) => {
      if (plan.id === planId) {
        return {
          ...plan,
          items: [...plan.items, newItem],
          updatedAt: new Date().toISOString(),
        };
      }
      return plan;
    });
    savePlans(updated);
    success(`Added "${newItem.name}" to shopping plan`);
  };

  const removeItemFromPlan = (planId: string, itemId: string) => {
    const updated = plans.map((plan) => {
      if (plan.id === planId) {
        const item = plan.items.find((i) => i.id === itemId);
        const spentDelta = item && item.isPurchased ? -item.estimatedPrice : 0;
        return {
          ...plan,
          items: plan.items.filter((i) => i.id !== itemId),
          spent: Math.max(0, plan.spent + spentDelta),
          updatedAt: new Date().toISOString(),
        };
      }
      return plan;
    });
    savePlans(updated);
    info('Item removed from shopping list');
  };

  const updatePlanBudget = (planId: string, newBudget: number) => {
    const updated = plans.map((plan) => {
      if (plan.id === planId) {
        return { ...plan, budget: newBudget, updatedAt: new Date().toISOString() };
      }
      return plan;
    });
    savePlans(updated);
    success('Budget updated');
  };

  const addAllUnpurchasedToCart = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    const unpurchased = plan.items.filter((i) => !i.isPurchased);
    if (unpurchased.length === 0) {
      info('All items in this plan are already marked as purchased!');
      return;
    }

    let count = 0;
    unpurchased.forEach((item) => {
      // Find matching product in catalog
      const matched =
        (item.productId && products.find((p) => p.id === item.productId)) ||
        products.find(
          (p) =>
            p.name.toLowerCase().includes(item.name.toLowerCase()) ||
            item.name.toLowerCase().includes(p.name.toLowerCase())
        );

      if (matched) {
        addToCart(matched, item.quantity);
        count++;
      } else {
        // Create matching product fallback from first vendor
        const fallback = products[0];
        if (fallback) {
          addToCart(
            {
              ...fallback,
              id: 'plan-prod-' + item.id,
              name: item.name,
              price: item.estimatedPrice || 50,
              unit: item.unit,
            },
            item.quantity
          );
          count++;
        }
      }
    });

    success(`Successfully added ${count} items from shopping list into your Cart!`);
  };

  const createPlan = (planData: Omit<ShoppingPlan, 'id' | 'createdAt' | 'updatedAt' | 'spent'>): ShoppingPlan => {
    const newPlan: ShoppingPlan = {
      ...planData,
      id: 'plan-' + Date.now(),
      spent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...plans, newPlan];
    savePlans(updated);
    success(`Created new plan "${newPlan.title}"`);
    return newPlan;
  };

  return (
    <PlannerContext.Provider
      value={{
        plans,
        activeFrequency,
        setActiveFrequency,
        currentPlan,
        addItemToPlan,
        toggleItemPurchased,
        removeItemFromPlan,
        updatePlanBudget,
        addAllUnpurchasedToCart,
        createPlan,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
