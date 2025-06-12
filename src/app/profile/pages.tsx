import { auth } from "../../../auth"

export default async function ProfilePage() {
    const session = await auth()

  if (!session) {
    return (
      <main className="flex items-center justify-center">
        <p className="text-xl">No autorizado</p>
      </main>
    )
  }

  return (
    <main className="h-[80vh] flex flex-col items-center justify-center">
      <h2 className="text-xl">Perfil del Usuario</h2>
      <p className="font-bold">{session.user?.name} / {session.user?.email}</p>
    </main>
  )
}