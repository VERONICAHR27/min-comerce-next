"use client";

import { useState } from 'react';
import { Product } from '@/models/products';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function ProductCard(props: Product) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            addToCart(props);
            // The cart will be automatically saved to backend through the useEffect in CartContext
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Card className="relative h-full flex flex-col hover:shadow-md transition-shadow duration-300">
            {/* Sale Badge */}
            {props.onSale && (
                <span className="absolute top-2 right-2 bg-rose-100 text-rose-600 text-xs font-medium px-2 py-1 rounded-full z-10">
                    On Sale
                </span>
            )}

            <CardContent className="flex-grow px-4">
                
                <Link href={`/product/${props.id}`}>
                <img
                    src={props.imageUrl}
                    alt={props.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                     <p className="text-lg font-semibold mb-2">
                        {props.title}
                    </p>   
                    
                    <p className="text-blue-600 font-semibold">
                        ${props.price.toFixed(2)}
                    </p>
                </Link>
                <div className="mt-2">
                    <p className="text-gray-600 text-sm">
                        {props.category}
                    </p>
                </div>
            </CardContent>

            <CardFooter className="p-4">
                <Button 
                    onClick={handleAddToCart}
                    className="w-full"
                    disabled={isAdding}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isAdding ? 'Agregando...' : 'Agregar al carrito'}
                </Button>
            </CardFooter>
        </Card>
    );
}