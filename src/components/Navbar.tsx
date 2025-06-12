"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ShoppingCart } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton"

export default function Navbar() {
    const { cart } = useCart();
    const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="w-full border-b">
            {/* Top banner */}
            <div className="bg-black text-white py-2 px-4 text-center text-sm">
                <span>¡En Min-commerce encontraras los mejores precios!</span>
            </div>

            {/* Main navbar content */}
            <div className="max-100 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    {/* Left - Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="font-bold text-xl tracking-wider hover:text-blue-600 transition-colors">
                            MIN - COMMERCE
                        </Link>
                    </div>

                    {/* Center - Navigation Links */}
                    <div className="hidden md:flex space-x-8">
                        <Link 
                            href="/products" 
                            className="text-sm font-medium hover:text-blue-600 transition-colors"
                        >
                            CATALOGO
                        </Link>
                        
                        <Link 
                            href="/" 
                            className="text-sm font-medium hover:text-blue-600 transition-colors"
                        >
                            CATEGORIAS
                        </Link>
                        <Link 
                            href="/orders" 
                            className="text-sm font-medium hover:text-blue-600 transition-colors"
                        >
                            MIS PEDIDOS
                        </Link>
                        <Link 
                            href="/checkout" 
                            className="text-sm font-medium hover:text-blue-600 transition-colors"
                        >
                            FORMULARIO
                        </Link>
                    </div>

                    {/* Right - Theme, Auth, Cart */}
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <AuthButton />
                        <Link 
                            href="/cart" 
                            className="flex items-center hover:text-blue-600 transition-colors"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}