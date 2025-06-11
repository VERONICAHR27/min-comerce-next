import { prisma } from '../lib/prisma'

export interface Product {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    category: string;
    onSale?: boolean;
}

export const products: Array<Product> = [
  {
    id: '0',
    title: 'Zapatillas Classic Old Skool',
    price: 179.99,
    imageUrl: 'https://vans.com.pe/cdn/shop/files/VN000D3HY28_HERO.png',
    category: 'Calzado',
    onSale: true
  },
  {
    id: '1',
    title: 'Zapatillas Authentic',
    price: 159.99,
    imageUrl: 'https://falabella.scene7.com/is/image/FalabellaPE/882257227_1',
    category: 'Calzado',
    onSale: false
  },
  {
    id: '2',
    title: 'Zapatillas Urbanas',
    price: 179.99,
    imageUrl: 'https://vans.com.pe/cdn/shop/files/VN000D3HY28_HERO.png?v=1698698660&width=493',
    category: 'Calzado',
    onSale: true
  },
    {
    id: '3',
    title: 'Zapatillas Urbanas',
    price: 179.99,
    imageUrl: 'https://vans.com.pe/cdn/shop/files/VN000D3HY28_HERO.png?v=1698698660&width=493',
    category: 'Calzado',
    onSale: true
  },
    {
    id: '4',
    title: 'Zapatillas Urbanas',
    price: 179.99,
    imageUrl: 'https://vans.com.pe/cdn/shop/files/VN000D3HY28_HERO.png?v=1698698660&width=493',
    category: 'Calzado',
    onSale: true
  },
    {
    id: '5',
    title: 'Zapatillas Urbanas',
    price: 179.99,
    imageUrl: 'https://vans.com.pe/cdn/shop/files/VN000D3HY28_HERO.png?v=1698698660&width=493',
    category: 'Calzado',
    onSale: false
  },
    {
    id: '6',
    title: 'Zapatillas Urbanas',
    price: 179.99,
    imageUrl: 'https://vans.com.pe/cdn/shop/files/VN000D3HY28_HERO.png?v=1698698660&width=493',
    category: 'Calzado',
    onSale: true
  },
  
]

export async function getProducts() {
  return await prisma.product.findMany()
}

export async function createProduct(data: Omit<Product, 'id'>) {
  return await prisma.product.create({ data })
}