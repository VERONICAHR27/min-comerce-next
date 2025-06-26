import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: "/signIn", // Redirección si no hay sesión
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
  },
})