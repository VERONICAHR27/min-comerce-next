"use client";

import { useCart } from '@/context/CartContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, isLoading, error } = useCart();

    const subtotal = cart?.items?.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0) || 0;
    const shipping = 10; // Costo fijo de envío
    const total = subtotal + shipping;

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Cargando carrito...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de productos */}
                <div className="lg:col-span-2">
                    {cart.items.length === 0 ? (
                        <p>No hay productos en el carrito</p>
                    ) : (
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <Card 
                                    key={`cart-item-${item.productId}`} 
                                    className="mb-4"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={item.product.imageUrl} 
                                                alt={item.product.title} 
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h2 className="text-lg font-semibold">{item.product.title}</h2>
                                                <p className="text-blue-600">${item.product.price}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <Button 
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <span>{item.quantity}</span>
                                                    <Button 
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                    <Button 
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeFromCart(item.product.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Resumen del pedido */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Button 
                                    className="w-full mt-4"
                                    disabled={cart.items.length === 0}
                                >
                                    Realizar pedido
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}