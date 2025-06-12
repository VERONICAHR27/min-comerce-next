"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  onSale: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const url = searchQuery 
                    ? `/api/products?search=${encodeURIComponent(searchQuery)}`
                    : '/api/products';
                    
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('API Response:', data); // Debug log
                
                // Manejar correctamente la estructura de la respuesta
                const productsArray = data.products || [];
                setProducts(productsArray);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery]);

    if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
    if (error) return <div className="container mx-auto px-4 py-8">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Nuestro Catálogo</h1>
            {products.length === 0 ? (
                <p>No products found</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            )}
        </div>
    );
}