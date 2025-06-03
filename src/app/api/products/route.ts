import { products } from '@/models/products';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        return NextResponse.json(
            { 
                products,
                message: 'Products retrieved successfully' 
            }, 
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { 
                message: 'Error retrieving products',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, 
            { status: 500 }
        );
    }
}