import { auth } from "@/auth"
import { redirect } from "next/navigation"

// Esta página muestra el perfil del usuario autenticado
// Si no hay sesión, redirige a la página de inicio de sesión
// La sesión se obtiene desde el middleware, por lo que no es necesario volver a autenticar al usuario aquí

export default async function ProfilePage() {
    const session = await auth()
    if (!session) {
        // Redirigir a la página de inicio de sesión si no hay sesión
        redirect("/signIn")
    }
    return (
        <main className="h-[80vh] flex flex-col items-center justify-center">
            <h2 className="text-xl">Perfil del Usuario</h2>
            <p className="font-bold">{session?.user?.name} / {session?.user?.email}</p>
            <p className="font-bold">{session?.user?.role}</p>
        </main>
    )
}