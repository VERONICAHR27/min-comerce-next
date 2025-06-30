import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
  const session = await auth();
  console.log("Middleware session:", session);
  if (!session) {
    return NextResponse.redirect(new URL("/denied?type=no_session", req.url))
  }

  const userRole = session.user?.role;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin"); // true: /admin/users, /admin/orders -- false: /dashboard/admin
  if (userRole !== "admin" && isAdminRoute) {
    return NextResponse.redirect(new URL("/denied", req.url))
  }
  return NextResponse.next();

 }

export const config = {
  matcher: ["/admin/:path*", "/profile"],
}