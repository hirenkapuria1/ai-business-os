import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logEvent } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
  const started = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok', database: 'connected', responseTimeMs: Date.now() - started })
  } catch (error) {
    logEvent('error', 'health.database_unavailable', { error: error instanceof Error ? error.name : 'UnknownError' })
    return NextResponse.json({ status: 'degraded', database: 'unavailable' }, { status: 503 })
  }
}
