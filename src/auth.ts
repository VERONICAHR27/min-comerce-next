import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  adapter: PrismaAdapter(prisma), //guarda los usuarios en la base de datos
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Redirección si no hay sesión
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = user.email === "hilarioreyesveronica6@gmail.com" ? "admin" : "user"
      }
      return token
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        session.user.role = token.role as "admin" | "user"
      }
      return session
    },
    async signIn({ user, account }) {
      try {
        await prisma.sessionLog.create({
          data: {
            userId: user.id,
            action: 'login',
            provider: account?.provider || 'unknown',
          }
        })
      } catch (error) {
        console.error('Error registrando login:', error)
      }
      return true
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.sub) {
        try {
          await prisma.sessionLog.create({
            data: {
              userId: token.sub,
              action: 'logout',
            }
          })
        } catch (error) {
          console.error('Error registrando logout:', error)
        }
      }
    },
  },
})