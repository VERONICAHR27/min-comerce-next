import { auth } from "@/auth"

export default async function ProfilePage() {
    const session = await auth()

  

  return (
    <main className="h-[80vh] flex flex-col items-center justify-center">
      <h2 className="text-xl">Perfil del Usuario</h2>
      <p className="font-bold">{session?.user?.name} / {session?.user?.email}</p>
      <p className="font-bold">{session?.user?.role}</p>
    </main>
  )
}