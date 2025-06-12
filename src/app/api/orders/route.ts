import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderPayload } from '@/types/order';

export async function POST(req: Request) {
    try {
        const body = await req.json() as OrderPayload;
        const SHIPPING_COST = 10.00;

        // Calculate subtotal and total with shipping
        const subtotal = body.items.reduce(
            (sum: number, item: OrderPayload['items'][0]) =>
                sum + item.quantity * item.product.price,
            0
        );
        const total = subtotal + SHIPPING_COST;

        // Create the order in the database
        const order = await prisma.order.create({
            data: {
                customerName: body.customerName,
                customerEmail: body.customerEmail,
                customerAddress: body.customerAddress,
                subtotal: subtotal,
                shippingCost: SHIPPING_COST,
                total: total,
                status: 'PENDING',
                items: {
                    create: body.items.map((item: OrderPayload['items'][0]) => ({
                        quantity: item.quantity,
                        price: item.product.price,
                        productId: item.product.id
                    }))
                }
            }
        });

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                total: order.total,
                shippingCost: order.shippingCost
            }
        });
    } catch (error) {
        console.error('Error processing order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process order' },
            { status: 500 }
        );
    }
}
