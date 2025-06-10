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

    // Cargar carrito inicial
    useEffect(() => {
        const loadCart = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Intentar cargar desde localStorage primero
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }

                // Luego intentar sincronizar con el backend
                const response = await fetch('/api/cart');
                if (!response.ok) {
                    throw new Error('Failed to fetch cart from server');
                }

                const data = await response.json();
                if (data.success && data.data) {
                    setCart(data.data);
                    localStorage.setItem('cart', JSON.stringify(data.data));
                }
            } catch (error) {
                console.error('Error loading cart:', error);
                setError(error instanceof Error ? error.message : 'Error loading cart');
            } finally {
                setIsLoading(false);
            }
        };

        loadCart();
    }, []);

    // Guardar carrito cuando cambie
    useEffect(() => {
        const saveCart = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Guardar en localStorage
                localStorage.setItem('cart', JSON.stringify(cart));

                // Guardar en el backend
                const response = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cart),
                });

                if (!response.ok) {
                    throw new Error('Failed to save cart to server');
                }

                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message || 'Error saving cart');
                }
            } catch (error) {
                console.error('Error saving cart:', error);
                setError(error instanceof Error ? error.message : 'Error saving cart');
            } finally {
                setIsLoading(false);
            }
        };

        // Solo guardar si hay items en el carrito
        if (cart.items.length > 0) {
            saveCart();
        }
    }, [cart]);

    const calculateTotal = (items: CartItem[]): number => {
        return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    };

    const addToCart = (product: Product) => {
        setCart(currentCart => {
            const existingItem = currentCart.items.find(
                item => item.product.id === product.id
            );
            
            if (existingItem) {
                const updatedItems = currentCart.items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                return {
                    items: updatedItems,
                    total: calculateTotal(updatedItems)
                };
            }

            const updatedItems = [...currentCart.items, { product, quantity: 1 }];
            return {
                items: updatedItems,
                total: calculateTotal(updatedItems)
            };
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(currentCart => {
            const updatedItems = currentCart.items.filter(
                item => item.product.id !== productId
            );
            return {
                items: updatedItems,
                total: calculateTotal(updatedItems)
            };
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

            return {
                items: updatedItems,
                total: calculateTotal(updatedItems)
            };
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