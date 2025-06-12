import ProductCarousel from "@/components/ProductCarousel";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[600px]">
                <Image
                    src="https://www.web4.com.ar/wp-content/uploads/2020/07/banner-requisitos-tienda.jpg"
                    alt="Banner principal"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-opacity-400 flex items-center justify-center">
                    <Link
                        href="/products"
                        className="bg-black text-white px-20 py-7 rounded-lg text-3xl font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                        Ver Catálogo
                    </Link>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-10 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        Productos Destacados
                    </h2>
                    <ProductCarousel />
                </div>
            </section>
        </main>
    );
}