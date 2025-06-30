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

  // Cargar carrito inicial desde la base de datos y localStorage
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        
        // Intentar cargar desde la API primero
        const response = await fetch('/api/cart', {
          credentials: 'include', // Asegurar que las cookies se envíen
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error fetching cart');
        }
        
        const data = await response.json();
        if (data.success && data.data) {
          setCart(data.data);
        } else {
          // Si no hay datos en la API, intentar cargar desde localStorage
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            setCart(parsedCart);
          }
        }
      } catch (error) {
        console.error('Error loading cart from API:', error);
        
        // Fallback a localStorage si la API falla
        try {
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            setCart(parsedCart);
          }
        } catch (localError) {
          console.error('Error loading cart from localStorage:', localError);
          setError('Error loading cart');
        }
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
      // Guardar en localStorage como respaldo
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Intentar sincronizar con la API
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedCart)
      });
      
      if (!response.ok) {
        console.warn('Error syncing cart with API, but saved locally');
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      // Asegurar que al menos se guarde localmente
      localStorage.setItem('cart', JSON.stringify(updatedCart));
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
        ...currentCart,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
      syncCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    const emptyCart = {
      ...cart,
      items: [], 
      total: 0
    };
    setCart(emptyCart);
    syncCart(emptyCart);
    localStorage.removeItem('cart');
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