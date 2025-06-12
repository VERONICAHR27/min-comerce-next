"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link";

export default function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <Link href={"/profile"} className="text-xs border-1 rounded-lg px-6 h-8 flex items-center">{session.user?.name}</Link>
        <button onClick={() => signOut()}>Cerrar sesión</button>
      </>
    )
  }

  return <button onClick={() => signIn("github")}>Iniciar con Google</button>
}