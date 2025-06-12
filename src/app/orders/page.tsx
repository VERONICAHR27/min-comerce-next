"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        title: string;
    };
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/orders");
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders);
                } else {
                    throw new Error("Error al cargar las órdenes");
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg">Cargando órdenes...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Historial de Pedidos</h1>
            
            <div className="space-y-6">
                {orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No hay pedidos realizados aún.
                    </p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-md p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Pedido #{order.id.slice(-6)}
                                    </h2>
                                    <p className="text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium
                                    ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'}`}>
                                    {order.status === 'COMPLETED' ? 'Completado' :
                                     order.status === 'PENDING' ? 'Pendiente' : 'Cancelado'}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="border-t pt-4">
                                    <h3 className="font-medium mb-2">Detalles del envío</h3>
                                    <p>{order.customerName}</p>
                                    <p>{order.customerEmail}</p>
                                    <p>{order.customerAddress}</p>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-medium mb-2">Productos</h3>
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between py-2">
                                            <div>
                                                <p>{item.product.title}</p>
                                                <p className="text-sm text-gray-500">
                                                    Cantidad: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-medium">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between">
                                        <p>Subtotal</p>
                                        <p>${order.subtotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Envío</p>
                                        <p>${order.shippingCost.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between font-bold mt-2">
                                        <p>Total</p>
                                        <p>${order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
