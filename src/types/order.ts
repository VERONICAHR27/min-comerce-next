interface OrderItem {
    quantity: number;
    product: {
        id: string;
        price: number;
    };
}

export interface OrderPayload {
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    items: OrderItem[];
}

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
