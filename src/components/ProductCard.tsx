"use client";

import { useCart } from '@/context/CartContext';
import type { Product } from '@/models/products';

export default function ProductCard(props: Product) {
    const { addToCart } = useCart();

    return (
        <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex flex-col h-full">
            {/* Sale Badge - Ajustado z-index y posición */}
            {props.onSale && (
                <span className="absolute top-2 right-2 bg-rose-100 text-rose-600 text-xs font-medium px-2 py-1 rounded-full z-10">
                    On Sale
                </span>
            )}
            
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-md mb-4">
                <img 
                    src={props.imageUrl} 
                    alt={props.title}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
            </div>
            
            {/* Content */}
            <div className="flex flex-col flex-grow">
                <h2 className="text-gray-800 font-medium text-lg mb-2 line-clamp-2">
                    {props.title}
                </h2>
                
                <div className="mt-auto">
                    <p className="text-gray-600 text-sm mb-2">
                        {props.category}
                    </p>
                    <p className="text-gray-900 font-semibold">
                        ${props.price.toFixed(2)}
                    </p>
                </div>

                <button 
                    onClick={() => addToCart(props)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
}