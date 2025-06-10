// src/app/api/cart/route.ts
import { NextResponse } from 'next/server';
import type { Cart } from '@/models/cart';

// Simulamos una base de datos en memoria
let savedCart: Cart | null = null;

export async function POST(request: Request) {
    try {
        const cart: Cart = await request.json();
        
        // Simulamos guardar en una base de datos
        savedCart = cart;
        console.log('Cart saved to backend:', cart);

        return NextResponse.json({ 
            success: true, 
            message: 'Cart saved successfully',
            data: cart 
        }, { 
            status: 200 
        });
    } catch (error) {
        console.error('Error saving cart:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Error saving cart',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, 
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Simulamos obtener de una base de datos
        return NextResponse.json({ 
            success: true, 
            message: 'Cart retrieved successfully',
            data: savedCart || { items: [], total: 0 }
        }, { 
            status: 200 
        });
    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                message: 'Error retrieving cart',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, 
            { status: 500 }
        );
    }
}