"use client";
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart } = useCart();

    if (cart.items.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-600 mb-8">¡Agrega algunos productos!</p>
                <Link 
                    href="/"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Ver Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Carrito de Compras</h1>
            
            <div className="space-y-4">
                {cart.items.map((item) => (
                    <div 
                        key={item.product.id} 
                        className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
                    >
                        <img 
                            src={item.product.imageUrl} 
                            alt={item.product.title}
                            className="w-24 h-24 object-cover rounded-md"
                        />
                        
                        <div className="flex-grow">
                            <h3 className="font-medium">{item.product.title}</h3>
                            <p className="text-gray-600">
                                ${item.product.price.toFixed(2)} c/u
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                                <button 
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                >
                                    +
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}

                <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span>${cart.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}