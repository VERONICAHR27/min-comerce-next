import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
}

export const { auth, signIn, signOut } = NextAuth(config)
