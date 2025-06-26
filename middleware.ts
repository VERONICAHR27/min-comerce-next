import { auth } from "@/auth"
import { NextResponse, NextRequest} from "next/server"

export default async function middleware(req: NextRequest) {
  const session = await auth()  
    if (!session) {
      return NextResponse.redirect(new URL("/signIn", req.url))
    }       
}

export const config = {
  matcher: ["/admin/:path*", "/profile"],
}