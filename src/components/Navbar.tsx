"use client";
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function Navbar() {
    const { cart } = useCart();
    const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-gray-800">
                        Min-Commerce
                    </Link>
                    <Link 
                        href="/cart" 
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium flex items-center gap-1">
                            Carrito
                            {itemCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}