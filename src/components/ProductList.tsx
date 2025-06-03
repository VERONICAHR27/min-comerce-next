import { type Product } from "@/models/products";
import ProductCard from "@/components/ProductCard";

interface ProductListProps {
    products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
    return (
        <section className="w-full">
            {/* Container con padding responsivo y máximo ancho */}
            <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Grid de productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>

                {/* Mensaje cuando no hay productos */}
                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No hay productos disponibles
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}