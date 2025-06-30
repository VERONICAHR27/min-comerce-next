import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

// Helper function para centralizar la lógica de acceso
function hasAccess(route: string, role: string | undefined): boolean {
  // Si no hay rol, no tiene acceso a rutas protegidas
  if (!role) return false;
  
  // Rutas exclusivas para admin
  if (route.startsWith("/admin")) {  // ← Esto incluye /admin/logs
    return role === "admin";         // ← Solo admin puede acceder
  }
  
  // Rutas accesibles para admin y user
  if (route.startsWith("/dashboard")) {
    return role === "admin" || role === "user";
  }
  
  // Rutas de perfil accesibles para usuarios autenticados
  if (route.startsWith("/profile")) {
    return role === "admin" || role === "user";
  }
  
  // Por defecto, permitir acceso
  return true;
}

export default async function middleware(req: NextRequest) {
  const session = await auth();
  console.log("Middleware session:", session);
  
  // Si no hay sesión, redirigir a denied
  if (!session) {
    return NextResponse.redirect(new URL("/denied?type=no_session", req.url))
  }

  const userRole = session.user?.role;
  const currentPath = req.nextUrl.pathname;
  
  // Verificar acceso usando el helper
  if (!hasAccess(currentPath, userRole)) {
    // Redirigir según el rol del usuario
    if (userRole === "user") {
      return NextResponse.redirect(new URL("/denied", req.url));
    } else {
      return NextResponse.redirect(new URL("/denied?type=insufficient_permissions", req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/dashboard/:path*"],
}