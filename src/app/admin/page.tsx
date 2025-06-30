import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user?.role !== "admin") {
    redirect('/profile')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Admin Page</h1>
      <p className="text-lg mb-4">Welcome to the admin page!</p>
      <p className="text-sm text-gray-600 mb-8">Logged in as: {session.user?.email}</p>
      
      <div className="space-y-4">
        <Link 
          href="/admin/logs" 
          className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver Dashboard de Logs
        </Link>
      </div>
    </div>
  )
}