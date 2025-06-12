"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ShoppingCart, Search } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton"

export default function Navbar() {
    const { cart } = useCart();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <NavigationMenu className="bg-white shadow-sm dark:bg-gray-950 w-full">
            <NavigationMenuList className="container mx-auto flex items-center justify-between px-4">
                {/* Left side with nav items */}
                <div className="flex items-center gap-4">
            
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">INICIO</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link href="/products" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">CATALOGO</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </div>

                {/* Center with search */}
                <div className="flex-1 max-w-md mx-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            type="search"
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                        />
                        <Button type="submit" variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>

                {/* Right side items */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <AuthButton />
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link href="/cart" className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                <span className="text-gray-600 dark:text-gray-300">CARRITO</span>
                                {itemCount > 0 && (
                                    <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </div>
            </NavigationMenuList>
        </NavigationMenu>
    );
}