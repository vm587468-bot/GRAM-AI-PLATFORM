import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  syncCartWithServer: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gramai_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const syncCartWithServer = useCallback(async () => {
    try {
      const res = await fetch('/api/products?limit=100', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const liveProducts: Product[] = Array.isArray(data.products) ? data.products : [];
      if (liveProducts.length === 0) return;
      const byId = new Map(liveProducts.map(p => [p.id, p]));

      setCart(prev => {
        if (prev.length === 0) return prev;
        let changed = false;
        const next: CartItem[] = [];
        for (const item of prev) {
          const fresh = byId.get(item.product.id);
          if (!fresh) {
            changed = true;
            continue;
          }
          if (
            fresh.imageUrl !== item.product.imageUrl ||
            fresh.title !== item.product.title ||
            fresh.price !== item.product.price ||
            fresh.updatedAt !== item.product.updatedAt ||
            fresh.sku !== item.product.sku
          ) {
            changed = true;
            next.push({ ...item, product: fresh });
          } else {
            next.push(item);
          }
        }
        return changed ? next : prev;
      });
    } catch {
      // keep existing cart if offline
    }
  }, []);

  useEffect(() => {
    syncCartWithServer();
  }, [syncCartWithServer]);

  useEffect(() => {
    localStorage.setItem('gramai_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { product, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        syncCartWithServer,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen
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
