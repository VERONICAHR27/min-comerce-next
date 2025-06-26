"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { data: session } = useSession()
  const router = useRouter();

  if (session) {
    return (
      <>
        <Link href={"/profile"} className="text-xs border-1 rounded-lg px-6 h-8 flex items-center">
          {session.user?.name}
        </Link>
        <button 
          onClick={() => signOut()} 
          className="text-sm hover:text-blue-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </>
    )
  }

  return (
    <button 
      onClick={() => router.push('/signIn')} 
      className="text-sm hover:text-blue-600 transition-colors"
    >
      Iniciar sesión
    </button>
  )
}