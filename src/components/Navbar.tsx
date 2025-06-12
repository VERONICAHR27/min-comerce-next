"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ShoppingCart } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton"

export default function Navbar() {
    const { cart } = useCart();
    const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <NavigationMenu className="bg-white shadow-sm dark:bg-gray-950">
            <NavigationMenuList>
                {/* Center Items */}
                <div className="flex items-center gap-67 flex-1 justify-center">
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
                <AuthButton />

                {/* Right side items with Cart and Theme Toggle */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
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