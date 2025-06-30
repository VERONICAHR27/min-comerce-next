// src/app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface CartItemData {
    product: {
        id: string;
    };
    quantity: number;
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        const { items }: { items: CartItemData[] } = await request.json();
        
        // Obtener o crear el carrito
        let cart = await prisma.cart.findFirst({
            where: session?.user?.id ? { userId: session.user.id } : {}
        });
        
        if (!cart) {
            cart = await prisma.cart.create({ 
                data: {
                    userId: session?.user?.id || null
                } 
            });
        }

        // Eliminar items existentes
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        // Crear nuevos items
        if (items && items.length > 0) {
            await prisma.cartItem.createMany({
                data: items.map((item: CartItemData) => ({
                    cartId: cart!.id,
                    productId: item.product.id,
                    quantity: item.quantity
                }))
            });
        }

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

        // Crear respuesta con headers de cookies apropiados
        const response = NextResponse.json({ 
            success: true,
            data: updatedCart
        });

        // Agregar headers para mejorar el manejo de cookies
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error saving cart:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Error saving cart',
            details: process.env.NODE_ENV === 'development' ? error : undefined
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET() {
    try {
        const session = await auth();
        
        const cart = await prisma.cart.findFirst({
            where: session?.user?.id ? { userId: session.user.id } : {},
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        const response = NextResponse.json({ 
            success: true, 
            data: cart,
            session: session ? {
                user: session.user?.email,
                id: session.user?.id
            } : null
        });

        // Agregar headers para mejorar el manejo de cookies
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Error fetching cart',
            details: process.env.NODE_ENV === 'development' ? error : undefined
        }, { status: 500 });
    }
}