"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product } from '@prisma/client';

interface ExtendedCartItem extends CartItem {
  product: Product;
}

interface ExtendedCart extends Omit<Cart, 'items'> {
  items: ExtendedCartItem[];
  total: number;
}

interface CartContextType {
  cart: ExtendedCart;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  error: string | null;
  isItemInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ExtendedCart>({
    id: '',
    userId: null,
    items: [],
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar carrito inicial desde la base de datos
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Error fetching cart');
        const data = await response.json();
        if (data.success) {
          setCart(data.data);
        }
      } catch (error) {
        setError('Error loading cart');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (items: ExtendedCartItem[]): number => {
    return items.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 
    0);
  };

  // Asegúrate de llamar a calculateTotal cada vez que actualices el carrito
  const updateCart = (updatedItems: ExtendedCartItem[]) => {
    const newTotal = calculateTotal(updatedItems);
    setCart(prev => ({
        ...prev,
        items: updatedItems,
        total: newTotal
    }));
  };

  const addToCart = async (product: Product) => {
    try {
      setIsLoading(true);
      const newCartItem: Omit<ExtendedCartItem, 'id' | 'createdAt' | 'updatedAt'> = {
        cartId: cart.id,
        productId: product.id,
        quantity: 1,
        product: product
      };

      const existingItem = cart.items.find(item => item.productId === product.id);

      if (existingItem) {
        const updatedItems = cart.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const updatedCart = {
          ...cart,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
        setCart(updatedCart);
        await syncCart(updatedCart);
      } else {
        const updatedItems = [...cart.items, newCartItem as ExtendedCartItem];
        const updatedCart = {
          ...cart,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
        setCart(updatedCart);
        await syncCart(updatedCart);
      }
    } catch (err) {
      setError('Error adding to cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const syncCart = async (updatedCart: ExtendedCart) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCart)
      });
      if (!response.ok) throw new Error('Error syncing cart');
    } catch (error) {
      console.error('Error syncing cart:', error);
      setError('Error syncing cart');
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(currentCart => {
      const newCart = {
        ...currentCart,
        items: currentCart.items.filter(
          item => item.product.id !== productId
        )
      };
      newCart.total = calculateTotal(newCart.items);
      syncCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(currentCart => {
      const updatedItems = currentCart.items
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
        .filter(item => item.quantity > 0);

      const newCart = {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
      syncCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  const isItemInCart = (productId: string): boolean => {
    return cart.items.some(item => item.productId === productId);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isLoading,
      error,
      isItemInCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}