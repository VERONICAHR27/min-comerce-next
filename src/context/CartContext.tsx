"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Cart, CartItem } from '@/models/cart';
import { Product } from '@/models/products';


interface CartContextType {
    cart: Cart;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

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
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};