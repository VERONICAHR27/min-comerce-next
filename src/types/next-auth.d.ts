import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "admin" | "user"
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: "admin" | "user"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string
    role: "admin" | "user"
  }
}
export default NextAuth({
  // ...otros providers...
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  session: {
    strategy: "jwt"
  }
})