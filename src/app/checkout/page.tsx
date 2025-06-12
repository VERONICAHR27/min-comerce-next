"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const checkoutSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    city: z.string().min(3, "La ciudad debe tener al menos 3 caracteres"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const SHIPPING_COST = 10.00;
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema),
    });

    const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    const total = subtotal + SHIPPING_COST;

    const onSubmit = async (formData: CheckoutForm) => {
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

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulario de envío */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Información de Envío</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name")}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email")}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    {...register("phone")}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    {...register("address")}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    {...register("city")}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.city && (
                                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                                )}
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
