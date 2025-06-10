"use client";

import { useParams } from 'next/navigation';
import { products } from '@/models/products';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

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
            <Card className="max-w-4xl mx-auto">
                <CardContent className="p-6">
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
                            <Button 
                                onClick={() => addToCart(product)}
                                className="mt-6 w-full"
                                size="lg"
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}