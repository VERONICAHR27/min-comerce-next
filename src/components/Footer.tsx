import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">MIN-COMMERCE</h3>
                        <p className="text-gray-400">
                            Tu tienda online de confianza para encontrar los mejores productos al mejor precio.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
                                    Carrito
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="text-gray-400 hover:text-white transition-colors">
                                    Mi Cuenta
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Categorías</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products?category=electronics" className="text-gray-400 hover:text-white transition-colors">
                                    Electrónicos
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=clothing" className="text-gray-400 hover:text-white transition-colors">
                                    Ropa
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=accessories" className="text-gray-400 hover:text-white transition-colors">
                                    Accesorios
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Síguenos</h3>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                               className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                    <p className="text-center text-gray-400">
                        © {new Date().getFullYear()} MIN-COMMERCE. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
