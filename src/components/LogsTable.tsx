'use client'
import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  role: string
}

interface SessionLog {
  id: string
  userId: string
  action: string
  provider: string | null
  timestamp: string
  user: User
}

interface LogsResponse {
  logs: SessionLog[]
  total: number
}

interface LogStats {
  todayLogins: number
  yesterdayLogins: number
  todayLogouts: number
  yesterdayLogouts: number
}

export default function LogsTable() {
  const [logs, setLogs] = useState<SessionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('')
  const [searchEmail, setSearchEmail] = useState<string>('')
  const [stats, setStats] = useState<LogStats>({
    todayLogins: 0,
    yesterdayLogins: 0,
    todayLogouts: 0,
    yesterdayLogouts: 0
  })

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/logs')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      const data: LogsResponse = await response.json()
      setLogs(data.logs)
      calculateStats(data.logs)
      console.log(`📊 Loaded ${data.logs.length} logs`)
    } catch (error) {
      console.error('Error fetching logs:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  // Calcular estadísticas de hoy vs ayer
  const calculateStats = (logs: SessionLog[]) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
    const yesterdayEnd = new Date(todayStart.getTime() - 1)

    const todayLogins = logs.filter(log => {
      const logDate = new Date(log.timestamp)
      return log.action === 'login' && logDate >= todayStart
    }).length

    const yesterdayLogins = logs.filter(log => {
      const logDate = new Date(log.timestamp)
      return log.action === 'login' && logDate >= yesterdayStart && logDate <= yesterdayEnd
    }).length

    const todayLogouts = logs.filter(log => {
      const logDate = new Date(log.timestamp)
      return log.action === 'logout' && logDate >= todayStart
    }).length

    const yesterdayLogouts = logs.filter(log => {
      const logDate = new Date(log.timestamp)
      return log.action === 'logout' && logDate >= yesterdayStart && logDate <= yesterdayEnd
    }).length

    setStats({
      todayLogins,
      yesterdayLogins,
      todayLogouts,
      yesterdayLogouts
    })
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getActionBadge = (action: string) => {
    if (action === 'login') {
      return 'bg-green-100 text-green-800 border border-green-300'
    } else if (action === 'logout') {
      return 'bg-red-100 text-red-800 border border-red-300'
    }
    return 'bg-gray-100 text-gray-800 border border-gray-300'
  }

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return 'bg-purple-100 text-purple-800 border border-purple-300'
    } else if (role === 'user') {
      return 'bg-blue-100 text-blue-800 border border-blue-300'
    }
    return 'bg-gray-100 text-gray-800 border border-gray-300'
  }

  // Filtrar logs por acción, rol y búsqueda de email
  const filteredLogs = logs.filter(log => {
    const matchesFilter = !filter || log.action === filter || log.user.role === filter
    const matchesSearch = !searchEmail || 
      log.user.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
      log.user.name?.toLowerCase().includes(searchEmail.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando logs...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
        <button 
          onClick={fetchLogs}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Estadísticas */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Logins Hoy</p>
              <p className="text-2xl font-bold text-green-900">{stats.todayLogins}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Logins Ayer</p>
              <p className="text-2xl font-bold text-blue-900">{stats.yesterdayLogins}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-900">Logouts Hoy</p>
              <p className="text-2xl font-bold text-red-900">{stats.todayLogouts}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Logouts Ayer</p>
              <p className="text-2xl font-bold text-gray-900">{stats.yesterdayLogouts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controles y filtros */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Logs de Sesión</h2>
            <p className="text-gray-600 mt-1">Eventos de login y logout de todos los usuarios</p>
          </div>
          <div className="text-sm text-gray-500">
            Mostrando: <span className="font-medium">{filteredLogs.length}</span> / {logs.length}
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          {/* Campo de búsqueda */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por email o nombre..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Botones de filtro por acción */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter(filter === 'login' ? '' : 'login')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'login'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter === 'login' ? 'Mostrar Todos' : 'Solo Logins'}
            </button>
            <button
              onClick={() => setFilter(filter === 'logout' ? '' : 'logout')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === 'logout'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter === 'logout' ? 'Mostrar Todos' : 'Solo Logouts'}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2">No hay logs disponibles</p>
                    <p className="text-sm text-gray-400">Los eventos de login/logout aparecerán aquí</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          log.user.role === 'admin' ? 'bg-purple-200' : 'bg-blue-200'
                        }`}>
                          <span className="text-sm font-medium text-gray-700">
                            {log.user.name ? log.user.name.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {log.user.name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(log.user.role)}`}>
                      {log.user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionBadge(log.action)}`}>
                      {log.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      {log.provider ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          {log.provider}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">
                      {formatDate(log.timestamp)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}