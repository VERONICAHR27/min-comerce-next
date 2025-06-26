"use client"
import { signIn, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
 

export default function SignInPage() {
    
  const { data: session } = useSession()
    if (!!session) {
       redirect("/")
    }
  
    return (
   <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Selecciona el método de inicio de sesión
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => signIn("google", { callbackUrl: "/", prompt: "select_account" })}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            Continuar con Google
          </button>
        </div>
      </div>
    </main>
  )
}