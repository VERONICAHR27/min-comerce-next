"use client";

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Product = {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    category: string;
};

export default function ProductCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 3,
        containScroll: 'trimSnaps'
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>;
    }

    if (products.length === 0) {
        return <div className="text-center py-8">No hay productos disponibles.</div>;
    }

    return (
        <div className="relative max-w-7xl mx-auto my-8">
            <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-4">
                        {products.map((product) => (
                            <div key={product.id} className="flex-[0_0_33.333%] min-w-0 pl-4">
                                <div className="relative h-[400px] w-full bg-white rounded-lg shadow-md overflow-hidden group">
                                    <Link href={`/product/${product.id}`}>
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.title}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                            priority
                                        />
                                    </Link>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                                        <h3 className="text-lg font-semibold text-center line-clamp-2">{product.title}</h3>
                                        <p className="mt-2 text-center text-lg font-bold">${product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={scrollPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
