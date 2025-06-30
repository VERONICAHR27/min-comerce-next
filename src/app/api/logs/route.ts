import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
        // OBTENER TODOS LOS LOGS (de admin y users)
    const logs = await prisma.sessionLog.findMany({
      take: 200, 
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true 
          }
        }
      }
    })

    console.log(`📊 Admin requesting logs: Found ${logs.length} logs total`)
    
    return NextResponse.json({
      logs,
      total: logs.length
    })

  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}