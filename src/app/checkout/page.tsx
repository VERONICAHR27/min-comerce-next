"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutForm {
    name: string;
    email: string;
    address: string;
    city: string;
    phone: string;
}

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const SHIPPING_COST = 10.00;
    const [formData, setFormData] = useState<CheckoutForm>({
        name: "",
        email: "",
        address: "",
        city: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);

    const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    const total = subtotal + SHIPPING_COST;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cart.items.map(item => ({
                        product: {
                            id: item.product.id,
                            price: item.product.price
                        },
                        quantity: item.quantity
                    })),
                    customerName: formData.name,
                    customerEmail: formData.email,
                    customerAddress: `${formData.address}, ${formData.city}`,
                    subtotal,
                    shippingCost: SHIPPING_COST,
                    total
                }),
            });

            if (response.ok) {
                clearCart();
                router.push("/order-success");
            } else {
                throw new Error("Error al procesar la orden");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un error al procesar tu orden. Por favor intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulario de envío */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Información de Envío</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                        >
                            {loading ? "Procesando..." : "Confirmar Pedido"}
                        </button>
                    </form>
                </div>

                {/* Resumen del pedido */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-semibold mb-6">Resumen del Pedido</h2>
                    <div className="space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.product.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.product.title}</p>
                                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                </div>
                                <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between items-center font-bold">
                                <p>Subtotal</p>
                                <p>${subtotal.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Envío</p>
                                <p>${SHIPPING_COST.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <p>Total</p>
                                <p>${total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
