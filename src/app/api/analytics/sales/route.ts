import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getAnalyticsData, parseAnalyticsRange } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  try {
    const range = parseAnalyticsRange(new URL(request.url).searchParams)
    const { daily, revenue, paidOrders } = await getAnalyticsData(range.from, range.to)
    return NextResponse.json({ range, revenue, paidOrders, daily })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid date range' }, { status: 400 })
  }
}
