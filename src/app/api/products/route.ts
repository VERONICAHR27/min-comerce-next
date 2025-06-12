import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los productos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const products = await prisma.product.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ],
      } : undefined,
    });
    
    return NextResponse.json({ 
        success: true,
        products: products,
        message: 'Products retrieved successfully' 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ 
        success: false,
        message: 'Error retrieving products',
        error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
        status: 500 
    });
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Crear un nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        title: body.title,
        price: body.price,
        imageUrl: body.imageUrl,
        category: body.category,
        onSale: body.onSale || false,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}