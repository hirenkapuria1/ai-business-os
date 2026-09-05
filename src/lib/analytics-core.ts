export type AnalyticsOrder = { status: string; totalAmount: { toString(): string } | string | number; createdAt: Date }

export function parseAnalyticsRange(searchParams: URLSearchParams, now = new Date()) {
  const defaultEnd = new Date(now)
  const defaultStart = new Date(now)
  defaultStart.setUTCDate(defaultStart.getUTCDate() - 29)
  const start = parseDate(searchParams.get('from')) ?? defaultStart
  const endInput = parseDate(searchParams.get('to')) ?? defaultEnd
  const from = new Date(start); from.setUTCHours(0, 0, 0, 0)
  const to = new Date(endInput); to.setUTCHours(23, 59, 59, 999)
  if (from > to) throw new Error('The start date must be before the end date')
  if (to.getTime() - from.getTime() > 366 * 86400000) throw new Error('Date range cannot exceed 366 days')
  return { from, to, timezone: 'UTC' as const }
}

function parseDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function aggregateOrders(orders: AnalyticsOrder[]) {
  const paid = orders.filter((order) => order.status === 'PAID')
  const daily = new Map<string, { date: string; orders: number; revenue: number }>()
  for (const order of paid) {
    const date = order.createdAt.toISOString().slice(0, 10)
    const current = daily.get(date) ?? { date, orders: 0, revenue: 0 }
    current.orders += 1
    current.revenue += Number(order.totalAmount.toString())
    daily.set(date, current)
  }
  return {
    revenue: paid.reduce((sum, order) => sum + Number(order.totalAmount.toString()), 0),
    paidOrders: paid.length,
    totalOrders: orders.length,
    conversionRate: orders.length === 0 ? 0 : (paid.length / orders.length) * 100,
    daily: [...daily.values()].sort((a, b) => a.date.localeCompare(b.date)),
  }
}
