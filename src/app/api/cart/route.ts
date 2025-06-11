// src/app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { items } = await request.json();
        
        // Obtener o crear el carrito
        let cart = await prisma.cart.findFirst();
        if (!cart) {
            cart = await prisma.cart.create({ data: {} });
        }

        // Eliminar items existentes
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        // Crear nuevos items
        await prisma.cartItem.createMany({
            data: items.map((item: any) => ({
                cartId: cart!.id,
                productId: item.product.id,
                quantity: item.quantity
            }))
        });

        // Obtener el carrito actualizado
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return NextResponse.json({ 
            success: true,
            data: updatedCart
        });
    } catch (error) {
        console.error('Error saving cart:', error);
        return NextResponse.json({ success: false, error: 'Error saving cart' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET() {
    try {
        // Por ahora usaremos un carrito "default" hasta implementar autenticación
        let cart = await prisma.cart.findFirst({
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {},
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        }

        const total = cart.items.reduce(
            (sum, item) => sum + (item.product.price * item.quantity),
            0
        );

        return NextResponse.json({ 
            success: true,
            data: {
                id: cart.id,
                items: cart.items,
                total
            }
        });
    } catch (error) {
        console.error('Error retrieving cart:', error);
        return NextResponse.json({ success: false, error: 'Error retrieving cart' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}