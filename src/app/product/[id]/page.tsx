"use client";

import { useParams } from 'next/navigation';
import { products } from '@/models/products';
import { useCart } from '@/context/CartContext';

export default function ProductDetail() {
    const params = useParams();
    const { addToCart } = useCart();
    
    const product = products.find(p => p.id === params.id);

    if (!product) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <img 
                            src={product.imageUrl} 
                            alt={product.title}
                            className="w-full rounded-lg"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                        <p className="text-2xl font-semibold text-blue-600 mb-4">
                            ${product.price.toFixed(2)}
                        </p>
                        <p className="text-gray-600 mb-4">Category: {product.category}</p>
                        {product.onSale && (
                            <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full mb-4 inline-block">
                                On Sale
                            </span>
                        )}
                        <button 
                            onClick={() => addToCart(product)}
                            className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}