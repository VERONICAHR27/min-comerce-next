import { redirect } from "next/navigation"
import { auth } from "@/auth"
import LogsTable from "@/components/LogsTable"

export default async function LogsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user?.role !== "admin") {
    redirect('/profile')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Logs</h1>
          <p className="text-gray-600 mt-2">
            Monitoreo de eventos de autenticación del sistema
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <LogsTable />
        </div>
      </div>
    </div>
  )
}