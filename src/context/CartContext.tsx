"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '@/models/cart';
import { Product } from '@/models/products';

interface CartContextType {
    cart: Cart;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    isLoading: boolean;
    error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
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

    // Sincronizar cambios con la base de datos
    const syncCart = async (updatedCart: Cart) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCart)
            });
            if (!response.ok) throw new Error('Error syncing cart');
        } catch (error) {
            console.error('Error syncing cart:', error);
        }
    };

    const calculateTotal = (items: CartItem[]): number => {
        return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    };

    const addToCart = (product: Product) => {
        setCart(currentCart => {
            const newCart = {
                ...currentCart,
                items: [...currentCart.items]
            };
            const existingItem = newCart.items.find(
                item => item.product.id === product.id
            );
            
            if (existingItem) {
                const updatedItems = newCart.items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                newCart.items = updatedItems;
                newCart.total = calculateTotal(updatedItems);
                syncCart(newCart);
                return newCart;
            }

            const updatedItems = [...newCart.items, { product, quantity: 1 }];
            newCart.items = updatedItems;
            newCart.total = calculateTotal(updatedItems);
            syncCart(newCart);
            return newCart;
        });
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

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart,
            isLoading,
            error 
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